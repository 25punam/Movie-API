import time
from celery import shared_task
import requests
from django.conf import settings
from .models import Movie, Genre
from requests.adapters import HTTPAdapter, Retry
from django.db import IntegrityError, transaction

TMDB_DISCOVER_URL = "https://api.themoviedb.org/3/discover/movie"
TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w500"


@shared_task(bind=True)
def fetch_movies_task(self):
    headers = {
        "Authorization": f"Bearer {settings.TMDB_READ_ACCESS_TOKEN}",
        "Accept": "application/json",
    }

    session = requests.Session()
    session.headers.update(headers)

    retries = Retry(
        total=5,
        backoff_factor=2,
        status_forcelist=[429, 500, 502, 503, 504],
        allowed_methods=["GET"],
    )
    session.mount("https://", HTTPAdapter(max_retries=retries))

    for year in range(1970, 2027):
        page = 1

        while page <= 500:
            response = session.get(
                TMDB_DISCOVER_URL,
                params={
                    "page": page,
                    "primary_release_year": year,
                },
                timeout=20,
                verify=False,  # Docker workaround
            )

            if response.status_code != 200:
                break

            data = response.json()
            results = data.get("results", [])

            if not results:
                break

            for movie_data in results:
                tmdb_id = movie_data.get("id")
                if not tmdb_id:
                    continue

                try:
                    with transaction.atomic():
                        # Must unpack tuple into movie instance + created flag
                        movie, created = Movie.objects.update_or_create(
                            movie_id=tmdb_id,
                            defaults={
                                "title": movie_data.get("title", ""),
                                "original_title": movie_data.get("original_title", ""),
                                "original_language": movie_data.get("original_language", ""),
                                "overview": movie_data.get("overview") or "",
                                "adult": movie_data.get("adult", False),
                                "video": movie_data.get("video", False),
                                "popularity": movie_data.get("popularity") or 0.0,
                                "vote_average": movie_data.get("vote_average") or 0.0,
                                "vote_count": movie_data.get("vote_count") or 0,
                                "release_date": movie_data.get("release_date") or None,
                                "poster_path": (
                                    f"{TMDB_IMAGE_BASE}{movie_data['poster_path']}"
                                    if movie_data.get("poster_path") else None
                                ),
                                "backdrop_path": (
                                    f"{TMDB_IMAGE_BASE}{movie_data['backdrop_path']}"
                                    if movie_data.get("backdrop_path") else None
                                ),
                            }
                        )

                        # Now movie is the instance, safe to set genres
                        genre_objs = []
                        for gid in movie_data.get("genre_ids", []):
                            genre_obj, _ = Genre.objects.get_or_create(
                                genre_id=gid,
                                defaults={"name": str(gid)}
                            )
                            genre_objs.append(genre_obj)
                        movie.genres.set(genre_objs)

                except  Exception as e:
                    # catch ALL exceptions, log them
                    print(f"Skipping movie {tmdb_id} due to error: {e}")

            page += 1
            time.sleep(0.5)  # sleep per page to respect rate limits

    return "All movies saved successfully"


