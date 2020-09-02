FROM python:3.7

WORKDIR /home/api

COPY requirements.txt .

RUN pip install --no-cache-dir -r /home/api/requirements.txt

COPY . .

ENV APP_HOST=0.0.0.0
# need add the src folder to sys.path for compatibility
ENV PYTHONPATH=/home/api/src

EXPOSE 5000

CMD python code/run.py
