from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import viewsets, permissions, mixins, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import FormParser, MultiPartParser, FileUploadParser


from .serializers import JobSerializer, PredictionSerializer

from .models import Job, Prediction
from .tasks import predict_file


class IsOwnerOrAdmin(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.owner == request.user or request.user.is_superuser


class JobCreateView(APIView):
    parser_class = [MultiPartParser, FormParser]
    permission_classes = [IsAuthenticated]

    def post(self, request, format=None):
        serializer = JobSerializer(data=request.data)

        if serializer.is_valid():
            job = serializer.save(user=request.user)
            if 'length' not in request.data:
                length = 0
            else:
                length = request.data['length']
            for i in range(int(length)):
                file_key = f'file-{i}'
                f = request.data[file_key]
                prediction = Prediction.objects.create(
                    file_data=f, 
                    job=job, 
                    user=request.user,
                    status='CREATED'
                )
                pred_id = prediction.id
                pred_file_path = prediction.file_data.name
                
                predict_file.delay(pred_id, pred_file_path)

            return Response(
                serializer.data,
                status=status.HTTP_201_CREATED,
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST,
        )


class PredictionsViewSet(viewsets.GenericViewSet,
                            mixins.ListModelMixin):
    serializer_class = PredictionSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrAdmin]
    queryset = Prediction.objects.all()

    def get_queryset(self):
        user = self.request.user
        return Prediction.objects.filter(user=user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

