from django.urls import path, include
from rest_framework.routers import DefaultRouter

from . import views

app_name = 'jobs'

router = DefaultRouter()
router.register(r'predictions', views.PredictionsViewSet, basename='predictions')

urlpatterns = [
    path('create-job', views.JobCreateView.as_view(), name='create'),
    path('', include(router.urls))
]

