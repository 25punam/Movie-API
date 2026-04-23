from rest_framework import serializers
from .models import Movie, Genre
from urllib.parse import unquote


class GenreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genre
        fields = ["genre_id", "name"]


class MovieSerializer(serializers.ModelSerializer):
    genres = GenreSerializer(many=True, read_only=True)
    poster_url = serializers.SerializerMethodField()
    backdrop_url = serializers.SerializerMethodField()
    # also expose poster_path/backdrop_path as usable URLs (override model fields)
    poster_path = serializers.SerializerMethodField()
    backdrop_path = serializers.SerializerMethodField()

    class Meta:
        model = Movie
        # include model fields and serializer method fields
        fields = "__all__"

    def _filefield_to_url(self, fieldfile):
        if not fieldfile:
            return None

        name = getattr(fieldfile, 'name', None)
        # If the stored name itself is an external URL (or encoded), return it directly
        if name:
            # handle encoded https%3A/... cases
            if name.startswith('http') or name.startswith('https%3A') or 'http' in name:
                # decode percent-encoding if needed
                try:
                    decoded = unquote(name)
                    # ensure it starts with http after decode
                    if decoded.startswith('http'):
                        return decoded
                except Exception:
                    pass

        # Otherwise, treat it as a normal FileField stored in MEDIA and return absolute URL if request present
        try:
            request = self.context.get('request')
            url = fieldfile.url
            return request.build_absolute_uri(url) if request else url
        except Exception:
            return None

    def get_poster_url(self, obj):
        # prefer poster
        url = self._filefield_to_url(obj.poster_path)
        if url:
            return url
        # fallback to backdrop
        return self._filefield_to_url(obj.backdrop_path)

    def get_backdrop_url(self, obj):
        url = self._filefield_to_url(obj.backdrop_path)
        if url:
            return url
        return self._filefield_to_url(obj.poster_path)

    # expose raw path fields as usable URLs as well
    def get_poster_path(self, obj):
        return self.get_poster_url(obj)

    def get_backdrop_path(self, obj):
        return self.get_backdrop_url(obj)
