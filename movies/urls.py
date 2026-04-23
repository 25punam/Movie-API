from django.urls import path
from .views import FetchAllMoviesAPIView,MovieSearchAPIView

urlpatterns = [
    path("movie/", FetchAllMoviesAPIView.as_view()),
    path("search/", MovieSearchAPIView.as_view()),
]

