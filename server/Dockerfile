FROM python:3.7-slim

RUN apt-get update && apt-get install -yq \
    python3 python3-dev gcc \
    gfortran musl-dev

ENV DB_CONNECTION_STRING=REDACTED
ENV PORT=5000
ENV TOKEN=None
COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY src/ /app

WORKDIR /app

EXPOSE $PORT

CMD ["python", "app.py"]
