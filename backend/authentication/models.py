from django.contrib.auth.models import (
    AbstractBaseUser, PermissionsMixin,
)
from django.db import models
from django.utils.translation import ugettext_lazy as _

from .managers import UserManager


class User(AbstractBaseUser, PermissionsMixin):
    """Custom User model"""
    email = models.EmailField(_('Email'), max_length=255, unique=True)
    username = models.CharField(_('Username'), max_length=50, unique=True)
    phone_number = models.CharField(_('Phone Number'), max_length=15)
    first_name = models.CharField(_('First Name'), max_length=50)
    middle_name = models.CharField(_('Middle Name'), max_length=50)
    last_name = models.CharField(_('Last Name'), max_length=50)
    mail_address = models.CharField(_('Mail Address'), max_length=100)
    occupation = models.CharField(_('Occupation'), max_length=50)

    is_staff = models.BooleanField(_('Is admin'), default=False)    
    objects = UserManager()

    USERNAME_FIELD = 'username'

    def __str__(self):
        return self.username
