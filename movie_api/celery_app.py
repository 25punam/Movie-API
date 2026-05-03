import os
from celery import app as Celery

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "movie_api.settings")

app = Celery("movie_api")

app.config_from_object("django.conf:settings", namespace="CELERY")
app.autodiscover_tasks()
