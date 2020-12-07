from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse

from rest_framework import status
from rest_framework.test import APIClient

from .models import Job, Prediction

from .serializers import JobSerializer, PredictionSerializer


CREATE_JOB_URL = reverse('jobs:create')
GET_PREDICTIONS_LIST_URL = reverse('jobs:predictions-list')

def sample_job(user, **params):
    """Create and return a sample job"""
    return Job.objects.create(user=user)

def create_user(**param):
    return get_user_model().objects.create_user(**param)


class PublicJobsApiTests(TestCase):
    """Test unauthenticated jobs API access"""

    def setUp(self):
        self.client = APIClient()

    def test_auth_required_get_predictions(self):
        """Test that authentication is required to get predictions"""
        res = self.client.get(GET_PREDICTIONS_LIST_URL)

        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)

    def test_auth_required_create_job(self):
        """Test that authentication is required to create new job"""
        
        res = self.client.post(CREATE_JOB_URL, {})
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)


class PrivateJobsApiTests(TestCase):
    """Test authenticated Jobs API access"""

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

    def test_create_job(self):
        """Test creating a job"""
        res = self.client.post(CREATE_JOB_URL, {})

        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        job = Job.objects.get(id=res.data['id'])
        self.assertEqual(1, job.id)
