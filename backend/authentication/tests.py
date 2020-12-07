from django.test import TestCase
from django.contrib.auth import get_user_model
from django.urls import reverse

from rest_framework.test import APIClient
from rest_framework import status


REGISTER_USER_URL = reverse('authentication:register')
LOGIN_URL = reverse('authentication:login')
GET_USER_INFO_URL = reverse('authentication:user')
CHANGE_PASSWORD_URL = reverse('authentication:change')


def create_user(**param):
    return get_user_model().objects.create_user(**param)


class PublicAuthApiTests(TestCase):
    """Test the authentication API (public)"""

    def setUp(self):
        self.client = APIClient()

    def test_create_valid_user_success(self):
        """Test creating user with valid payload is successful"""
        payload = {
            'email': 'test@testcase.com',
            'username': 'testuser',
            'phone_number': '1234567890',
            'first_name': 'John',
            'middle_name': 'C',
            'last_name': 'Die',
            'mail_address': '123 River St',
            'occupation': 'student',
            'password': 'testpassword',
        }
        res = self.client.post(REGISTER_USER_URL, payload)

        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        user = get_user_model().objects.get(**res.data)
        self.assertTrue(user.check_password(payload['password']))
        self.assertNotIn('password', res.data)

    def test_user_same_email(self):
        """Test creating a user that already has same email"""
        payload = {
            'email': 'test@testcase.com',
            'username': 'differentusername',
            'phone_number': '1234567890',
            'first_name': 'John',
            'middle_name': 'C',
            'last_name': 'Die',
            'mail_address': '123 River St',
            'occupation': 'student',
            'password': 'testpassword'
        }
        create_user(**payload)
        res = self.client.post(REGISTER_USER_URL, payload)

        self.assertEqual(res.status_code, status.HTTP_409_CONFLICT)

    def test_user_same_username(self):
        """Test creating a user that already has same username"""
        payload = {
            'email': 'different@email.com',
            'username': 'testuser',
            'phone_number': '1234567890',
            'first_name': 'John',
            'middle_name': 'C',
            'last_name': 'Die',
            'mail_address': '123 River St',
            'occupation': 'student',
            'password': 'testpassword',
        }
        create_user(**payload)
        res = self.client.post(REGISTER_USER_URL, payload)
        self.assertEqual(res.status_code, status.HTTP_409_CONFLICT)

    def test_create_token_for_user(self):
        """Test that a token sent returned for authenticated user"""
        payload = {
            'email': 'test@testcase.com',
            'username': 'testuser',
            'phone_number': '1234567890',
            'first_name': 'John',
            'middle_name': 'C',
            'last_name': 'Die',
            'mail_address': '123 River St',
            'occupation': 'student',
            'password': 'testpassword'
        }
        create_user(**payload)
        payload = {'username': 'testuser', 'password': 'testpassword'}
        res = self.client.post(LOGIN_URL, payload)

        self.assertIn('access', res.data)
        self.assertIn('refresh', res.data)
        self.assertEqual(res.status_code, status.HTTP_200_OK)

    def test_create_token_invalid_credentials(self):
        """Test that token is not created if invalid credentials are given"""
        payload = {
            'email': 'test@testcase.com',
            'username': 'testuser',
            'phone_number': '1234567890',
            'first_name': 'John',
            'middle_name': 'C',
            'last_name': 'Die',
            'mail_address': '123 River St',
            'occupation': 'student',
            'password': 'testpassword'
        }
        create_user(**payload)

        payload = {'username': 'testing', 'password': 'testpass'}
        res = self.client.post(LOGIN_URL, payload)

        self.assertNotIn('access', res.data)
        self.assertNotIn('refresh', res.data)
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_create_token_missing_field(self):
        """Test that username and password are required"""
        res = self.client.post(LOGIN_URL, {'username': 'testing', 'password': ''})
        
        self.assertNotIn('access', res.data)
        self.assertNotIn('refresh', res.data)
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_retrieve_user_authorized(self):
        """Test that authentication is required for getting user information"""
        res = self.client.get(GET_USER_INFO_URL)

        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)


class PrivateUserApiTests(TestCase):
    """Test API requests that require authentication"""

    def setUp(self):
        self.user = create_user(
            email='test@testcase.com',
            username='testuser',
            phone_number='1234567890',
            first_name='John',
            middle_name= 'C',
            last_name='Die',
            mail_address='123 River St',
            occupation='student',
            password='testpassword',
        )

        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

    def test_retrieve_profile_success(self):
        """Test retrieving profile for logged in user"""
        res = self.client.get(GET_USER_INFO_URL)

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data, {
            'email': 'test@testcase.com',
            'username': 'testuser',
            'phone_number': '1234567890',
            'first_name': 'John',
            'middle_name': 'C',
            'last_name': 'Die',
            'mail_address': '123 River St',
            'occupation': 'student',
        })

    def test_post_not_allowed(self):
        """Test that POST is not allowed on the user url"""
        res = self.client.post(GET_USER_INFO_URL, {})

        self.assertEqual(res.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)


    def test_update_user_password(self):
        """Test updating the user profile for authenticated user"""
        payload = {'old_password': 'testpassword', 'new_password': 'newtestpassword' }

        res = self.client.put(CHANGE_PASSWORD_URL, payload)

        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password(payload['new_password']))
        self.assertEqual(res.status_code, status.HTTP_204_NO_CONTENT)

    def test_update_user_password_fail(self):
        """Test updating password fails for incorrect password"""
        payload = {'old_password': 'wrongpassword', 'new_password': 'newtestpassword' }

        res = self.client.put(CHANGE_PASSWORD_URL, payload)

        self.user.refresh_from_db()
        self.assertFalse(self.user.check_password(payload['new_password']))
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
