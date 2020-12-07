from .DocumentClassifier import DocumentClassifier

from celery.decorators import task

from django.utils import timezone

from .models import Prediction


@task(name="predict file label")
def predict_file(prediction_id, file_path):
    
    document_classifier = DocumentClassifier()
    prediction_label = document_classifier.predict(file_path)
    finished_at = timezone.now()
    status = 'FINISHED'
    data = {
        'prediction': prediction_label,
        'finished_at': finished_at,
        'status': status
    }
    Prediction.objects.filter(pk=prediction_id).update(**data)
