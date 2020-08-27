FROM python:3.7-slim

RUN apt-get update && \
    apt-get install -yq \
      python3 \
      python3-dev \
      gcc \
      g++ \
      gfortran \
      musl-dev && \
    pip install --upgrade pip

COPY requirements.txt /home/api/

RUN pip install --no-cache-dir -r /home/api/requirements.txt

COPY setup.cfg /home/api/
COPY /bin /home/api/bin/
COPY .env* /src /home/api/src/

WORKDIR /home/api

CMD python bin/api_check.py && python bin/api_start.py
