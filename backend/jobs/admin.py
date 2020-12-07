from django.contrib import admin

from .models import Job, Prediction

admin.site.register(Job)
admin.site.register(Prediction)