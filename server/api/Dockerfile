FROM python:3.7

WORKDIR /home/api

COPY requirements.txt .

RUN pip install --no-cache-dir -r /home/api/requirements.txt

ENV APP_HOST=0.0.0.0
# need add the src folder to sys.path for compatibility
ENV PYTHONPATH=.:/home/api/code:/home/api/src

EXPOSE 5000

COPY . .

CMD python code/run.py
