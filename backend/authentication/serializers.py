from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password
from django.contrib.auth.password_validation import validate_password
from django.core.validators import EmailValidator
from django.db import transaction
from django.utils.html import escape

from rest_framework import serializers

from rest_framework.exceptions import AuthenticationFailed, ValidationError
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = [
            'username', 'email', 'password',
            'first_name', 'middle_name', 'last_name', 
            'phone_number', 'mail_address', 'occupation'
        ]
        extra_kwargs = {'password': {'write_only': True}}
    
    def validate(self, data):
        fields = [
            'username', 'email',
            'first_name', 'middle_name', 'last_name', 
            'phone_number', 'mail_address', 'occupation'
        ]
        for field in fields:
            data[field] = escape(data[field])
                
        return data

    def create(self, validated_data):
        """Create a new user with encrypted password and return it"""

        return get_user_model().objects.create_user(**validated_data)

    def update(self, instance, validated_data):
        """Update a user, setting the password correctly and return it"""
        password = validated_data.pop('password', None)
        user = super().update(instance, validated_data)

        if password:
            user.set_password(password)
            user.save()

        return user


class UserLoginSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        try:
            data = super().validate(attrs)
        except AuthenticationFailed as e:
            e.status_code = 403
            raise e

        data['token'] = data.pop('access')
        return data


class ChangePasswordSerializer(serializers.Serializer):
    """Serializer for change password endpoint"""
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)
