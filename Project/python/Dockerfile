FROM python:3.7-slim

RUN mkdir /install

WORKDIR /install

RUN apt-get update && apt-get upgrade -y
RUN apt-get install -y libpq-dev gcc
RUN pip3 install --upgrade pip

COPY requirements.txt /requirements.txt

RUN pip3 install --no-cache -r /requirements.txt

COPY src /app

WORKDIR /app

CMD ["python","app.py"]
