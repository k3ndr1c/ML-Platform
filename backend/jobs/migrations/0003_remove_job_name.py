# Generated by Django 3.1.4 on 2020-12-06 23:35

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('jobs', '0002_job_created_at'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='job',
            name='name',
        ),
    ]
