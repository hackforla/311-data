# For more information, please refer to https://aka.ms/vscode-docker-python
FROM python:3.7-slim-buster

# Keeps Python from generating .pyc files in the container
ENV PYTHONDONTWRITEBYTECODE 1

# Turns off buffering for easier container logging
ENV PYTHONUNBUFFERED 1

# Set a flag to be used by pyppeteer task
ENV IS_DOCKER = 1

# Install gcc to build psutil wheel used by Dask
RUN apt-get update -y && apt-get install -y gcc && apt-get install -y curl

# download and install chrome for pyppeteer
RUN curl -LO https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
RUN apt-get install -y ./google-chrome-stable_current_amd64.deb
RUN rm google-chrome-stable_current_amd64.deb 

# Install pip requirements
ADD requirements.txt .
RUN python -m pip install -r requirements.txt

# Add the application code
WORKDIR /app
ADD . /app

# Switch to a non-root user, please refer to https://aka.ms/vscode-docker-python-user-rights
RUN useradd appuser && chown -R appuser /app
USER appuser

# Tell Prefect where to look for the config
ENV PREFECT__USER_CONFIG_PATH ./config.toml
