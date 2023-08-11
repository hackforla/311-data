# For more information, please refer to https://aka.ms/vscode-docker-python
FROM python:3.7-slim-buster

# Keeps Python from generating .pyc files in the container
ENV PYTHONDONTWRITEBYTECODE 1

# Turns off buffering for easier container logging
ENV PYTHONUNBUFFERED 1

# Install gcc and g++ to build pysupercluster (may not need)
RUN apt-get update \
    && apt-get install -y \
    gcc \
    g++ \
    && apt-get clean

# Install pip requirements
ADD requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Add the application code
WORKDIR /app
ADD . /app

# Switch to a non-root user, please refer to https://aka.ms/vscode-docker-python-user-rights
RUN useradd appuser && chown -R appuser /app
USER appuser

# Set python path
ENV PYTHONPATH=.:/app/code
ENV APP_HOST=0.0.0.0

# During debugging, this entry point will be overridden. For more information, please refer to https://aka.ms/vscode-docker-python-debug
CMD python code/run.py
