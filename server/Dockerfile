FROM python:3.7-slim

RUN apt-get update && apt-get install -yq \
    python3 python3-dev gcc g++ \
    gfortran musl-dev

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY src/ /app

WORKDIR /app

CMD ["python", "app.py"]
