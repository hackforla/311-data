FROM python:3.7-slim

RUN apt-get update && apt-get install -yq \
    python3 python3-dev gcc \
    gfortran musl-dev

ENV DB_CONNECTION_STRING
COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY src/ /app

WORKDIR /app

EXPOSE 5000

CMD ["python", "app.py"]
