from django.urls import path

from rest_framework_simplejwt import views as jwt_views
from . import views

app_name = 'authentication'

urlpatterns = [
    path("login/", jwt_views.TokenObtainPairView.as_view(), name='login'),
    path("user/", views.UserDetailView.as_view(), name='user'),
    path('user/change-password', views.UpdatePasswordView.as_view(), name='change'),
    path("register-user/", views.UserRegisterView.as_view(), name='register'),
]
