import os
from django.db import models
from django.conf import settings


def text_file_path(instance, filename):
    user_id = instance.user.id
    job_id = instance.job.id
    return os.path.join(f'data/{user_id}/{job_id}', filename)


class Job(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return str(self.id)

class Prediction(models.Model):
    file_data = models.FileField(upload_to=text_file_path)
    job = models.ForeignKey(Job, on_delete=models.CASCADE)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )
    created_at = models.DateTimeField(auto_now_add=True)
    finished_at = models.DateTimeField(null=True)
    status = models.CharField(blank=True, max_length=255)
    prediction = models.CharField(blank=True, max_length=255)

    def __str__(self):
        username = self.user.username
        job_id = self.job.id
        file_name = self.file_data.name.split('/')[-1]
        return f'username:{username} job-id:{job_id} file-name:{file_name}'
