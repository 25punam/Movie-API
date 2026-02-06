from django.db import models

class Genre(models.Model):
    genre_id = models.PositiveIntegerField(unique=True,null=False)
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


# class Movie(models.Model):
#     id = models.BigAutoField(primary_key=True)
#     movie_id = models.PositiveBigIntegerField(unique=True, null=False, db_index=True)

#     title = models.CharField(max_length=255,db_index=True)
#     original_title = models.CharField(max_length=255)
#     original_language = models.CharField(max_length=10)

#     overview = models.TextField(blank=True)

#     adult = models.BooleanField(default=False)
#     video = models.BooleanField(default=False)

#     popularity = models.FloatField(default=0.0)
#     vote_average = models.FloatField(default=0.0)
#     vote_count = models.PositiveIntegerField(default=0)

#     release_date = models.DateField(null=True, blank=True)

#     poster_path = models.ImageField(upload_to="movies/posters/",null=True,blank=True)
#     backdrop_path = models.ImageField(upload_to="movies/backdrops/",null=True,blank=True)

#     genres = models.ManyToManyField(Genre,related_name="movies",blank=True)

#     def __str__(self):
#         return self.title
    

class Movie(models.Model):
    id = models.BigAutoField(primary_key=True)
    movie_id = models.PositiveBigIntegerField(unique=True, null=False, db_index=True)
    title = models.CharField(max_length=255,db_index=True)
    original_title = models.CharField(max_length=255)
    original_language = models.CharField(max_length=10,db_index=True)
    overview = models.TextField(blank=True,db_index=True)
    adult = models.BooleanField(default=False)
    video = models.BooleanField(default=False)
    popularity = models.FloatField(default=0.0,db_index=True)
    vote_average = models.FloatField(default=0.0,db_index=True)
    vote_count = models.PositiveIntegerField(default=0)
    release_date = models.DateField(null=True, blank=True,db_index=True)
    poster_path = models.ImageField(upload_to="movies/posters/",null=True,blank=True)
    backdrop_path = models.ImageField(upload_to="movies/backdrops/",null=True,blank=True)

    genres = models.ManyToManyField(Genre,related_name="movies",blank=True)


    def __str__(self):
        return self.title



class Status(models.Model):
    task_id = models.CharField(max_length=255, unique=True)
    total_movies = models.IntegerField(default=0)
    status = models.CharField(
        max_length=20,
        choices=[
            ("PENDING", "PENDING"),
            ("RUNNING", "RUNNING"),
            ("COMPLETED", "COMPLETED"),
            ("FAILED", "FAILED"),
        ],
        default="PENDING"
    )

