from django.contrib.auth import get_user_model
from django.views.decorators.csrf import csrf_exempt

from rest_framework import permissions, status
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.generics import RetrieveAPIView, CreateAPIView, UpdateAPIView
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError

from rest_framework_simplejwt.views import TokenObtainPairView

from .serializers import UserLoginSerializer, UserSerializer, ChangePasswordSerializer

User = get_user_model()

class UserLoginView(TokenObtainPairView):
    serializer_class = UserLoginSerializer


class UserDetailView(RetrieveAPIView):
    serializer_class = UserSerializer
    model = User

    def get_object(self):
        return self.request.user


class UserRegisterView(APIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = UserSerializer
    model = User

    def post(self, request, format='json'):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            if user:
                return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        data = request.data
        email = data['email']
        same_email_user = get_user_model().objects.filter(email=email).exists()

        if same_email_user:
            return Response('DuplicateEmailError', status=status.HTTP_409_CONFLICT)

        username = data['username']
        same_username_user = get_user_model().objects.filter(username=username).exists()
        
        if same_username_user:
            return Response('DuplicateUsernameError', status=status.HTTP_409_CONFLICT)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UpdatePasswordView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self, queryset=None):
        return self.request.user

    def put(self, request, *args, **kwargs):
        self.object = self.get_object()
        serializer = ChangePasswordSerializer(data=request.data)

        if serializer.is_valid():
            old_password = serializer.data.get("old_password")
            if not self.object.check_password(old_password):
                return Response({"old_password": ["Wrong password."]}, 
                                status=status.HTTP_400_BAD_REQUEST)
            self.object.set_password(serializer.data.get("new_password"))
            self.object.save()
            return Response(status=status.HTTP_204_NO_CONTENT)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
