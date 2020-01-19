FROM python:3.7-alpine

RUN echo "http://dl-8.alpinelinux.org/alpine/edge/community" >> /etc/apk/repositories

RUN apk add --no-cache --allow-untrusted --repository http://dl-3.alpinelinux.org/alpine/edge/testing hdf5 hdf5-dev
RUN apk --no-cache --update-cache add gcc musl-dev gfortran python python-dev py-pip build-base wget freetype-dev libpng-dev postgresql-dev openblas-dev \
  && pip install --no-cache-dir cython numpy
RUN ln -s /usr/include/locale.h /usr/include/xlocale.h


COPY requirements.txt /

RUN pip install --no-cache-dir -r /requirements.txt

COPY src/ /app

WORKDIR /app

EXPOSE 5000

CMD ["python", "app.py"]
