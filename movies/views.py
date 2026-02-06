# views.py

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .tasks import fetch_movies_task
from .serializers import MovieSerializer
from django.db.models import Q
from .models import Movie, Genre


class FetchAllMoviesAPIView(APIView):
    def post(self, request):
        task = fetch_movies_task.delay()

        return Response({
            "message": "Movie fetch task started",
            "task_id": task.id
        }, status=status.HTTP_202_ACCEPTED)


class MovieSearchAPIView(APIView):
    def get(self, request):
        queryset = Movie.objects.all().prefetch_related("genres")

        q = request.GET.get("q")
        language = request.GET.get("language")
        genre = request.GET.get("genre")
        min_rating = request.GET.get("min_rating")
        page = request.GET.get("page", 1)
        limit = request.GET.get("limit")

        # Validate and parse pagination parameters
        try:
            page = max(1, int(page))
        except (ValueError, TypeError):
            page = 1

        # Apply search filters
        if q:
            # Use case-insensitive partial match across title and overview
            queryset = queryset.filter(
                Q(title__icontains=q) | Q(overview__icontains=q)
            )

        if language:
            queryset = queryset.filter(original_language=language)

        # Handle genre filter
        if genre:
            tokens = [g.strip() for g in genre.split(",") if g.strip()]
            genre_ids = []
            name_tokens = []
            for t in tokens:
                if t.isdigit():
                    genre_ids.append(int(t))
                else:
                    name_tokens.append(t)

            # resolve name tokens to genre_ids (case-insensitive)
            if name_tokens:
                for name in name_tokens:
                    matched = Genre.objects.filter(name__iexact=name).values_list('genre_id', flat=True)
                    for gid in matched:
                        genre_ids.append(gid)

            if genre_ids:
                queryset = queryset.filter(genres__genre_id__in=genre_ids).distinct()

        if min_rating:
            try:
                min_rating = float(min_rating)
                queryset = queryset.filter(vote_average__gte=min_rating)
            except ValueError:
                pass

        # Order results by popularity then rating
        queryset = queryset.order_by('-popularity', '-vote_average')

        # Get total count before applying limit
        total_count = queryset.count()

        # Apply limit (safe defaults to prevent rendering too many records)
        if limit:
            try:
                limit = int(limit)
                limit = max(1, min(limit, 100))  # Cap at 100 items per request
            except (ValueError, TypeError):
                limit = None
        else:
            # Default limit based on query complexity:
            # - No filters: 100 movies (initial load)
            # - Single/multiple filters: 500 movies (prevents rendering 44k+ movies for single language filter)
            if not (q or language or genre or min_rating):
                limit = 100
            else:
                limit = 500

        # NOTE: Do not pre-slice the queryset here using `limit`.
        # Pre-slicing caused empty results for pages > 1 because the subsequent
        # offset would be beyond the reduced queryset length. Instead, use
        # `limit` as the page size for offset-based pagination below.

        # Apply pagination (offset-based)
        page_size = limit if limit else 100
        offset = (page - 1) * page_size
        paginated_queryset = queryset[offset:offset + page_size]

        serializer = MovieSerializer(paginated_queryset, many=True, context={"request": request})
        return Response({
            "movies": serializer.data,
            "total_count": total_count,
            "returned_count": paginated_queryset.count(),
            "page": page,
            "page_size": page_size,
            "limit": limit
        })