from movies.models import Genre

genre_map = {
    28: "Action",
    12: "Adventure",
    16: "Animation",
    35: "Comedy",
    80: "Crime",
    99: "Documentary",
    18: "Drama",
    10751: "Family",
    36: "History",
    27: "Horror",
    10402: "Music",
    9648: "Mystery",
    10749: "Romance",
    878: "Science Fiction",
    10770: "TV Movie",
    53: "Thriller",
    10752: "War",
    37: "Western"
}

for gid, name in genre_map.items():
    genre, created = Genre.objects.get_or_create(
        name=name,
        defaults={"genre_id": gid}
    )
    genre.genre_id = gid
    genre.save()

    print(gid, "->", name)