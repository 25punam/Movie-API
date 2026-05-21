FROM python:3.12-slim-bookworm

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

RUN apt-get update && apt-get install -y \
    curl \
    postgresql-client \
    ca-certificates \
    openssl \
    && update-ca-certificates \
    && rm -rf /var/lib/apt/lists/*

COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

COPY requirements.txt .
RUN uv pip install -r requirements.txt --system

COPY . .

# Create non-root user
RUN adduser --disabled-password --gecos "" appuser
USER appuser

EXPOSE 8000

CMD ["gunicorn", "movie_api.wsgi:application", "--bind", "0.0.0.0:8000", "--workers", "3"]


# FROM python:3.13-bullseye
# WORKDIR /app

# # Install system packages
# RUN apt-get update && apt-get install -y \
#     curl \
#     postgresql-client \
#     ca-certificates \
#     openssl \
#     && update-ca-certificates \
#     && rm -rf /var/lib/apt/lists/*

# # Install Python dependencies
# COPY requirements.txt .
# RUN pip install --upgrade pip
# RUN pip install -r requirements.txt

# # Copy project files
# COPY . .

# EXPOSE 8000

# CMD ["gunicorn", "movie_api.wsgi:application", "--bind", "0.0.0.0:8000"]
