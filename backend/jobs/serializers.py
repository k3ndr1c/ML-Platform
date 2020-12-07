from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password
from django.utils.html import escape

from rest_framework import serializers
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import AuthenticationFailed, ValidationError

from .models import Job, Prediction


class JobSerializer(serializers.ModelSerializer):
    class Meta:
        permissions = [IsAuthenticated]
        model = Job
        fields = ['id', 'created_at']
        read_only_fields = ['id', 'created_at']

    def create(self, validated_data, *args):
        return Job.objects.create(**validated_data)


class PredictionSerializer(serializers.ModelSerializer):
    class Meta:
        permissions = [IsAuthenticated]
        model = Prediction
        fields = ['id', 'job_id', 'status', 'prediction', 'created_at', 'finished_at']
        read_only_fields = ['id', 'job_id' 'created_at']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        file_name = instance.file_data.name.split('/')[-1]
        representation['created_at'] = instance.created_at.strftime("%m/%d/%Y %H:%M:%S")
        if instance.finished_at:
            representation['finished_at'] = instance.finished_at.strftime("%m/%d/%Y %H:%M:%S")
        representation['file_name'] = file_name
        return representation
