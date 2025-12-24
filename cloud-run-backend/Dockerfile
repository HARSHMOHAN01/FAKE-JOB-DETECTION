FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY main.py .

ENV PORT=8080
EXPOSE 8080

CMD exec gunicorn --bind :$PORT --workers 4 --threads 2 --worker-class gthread --worker-tmp-dir /dev/shm main:app
