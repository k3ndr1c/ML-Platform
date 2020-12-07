# ML Web Application

Web application built using React and Django Rest Framework that has User Authentication, User Login/Registration, and a User has the ability to upload text files to the server to receive label prediction of the Twenty Newsgroup Dataset.

## Dependencies
[Docker](https://docs.docker.com/get-docker/)

[Python3](https://www.python.org/downloads/)

## Initializing

Terminal 1 - Initialize docker containers

```bash
# Initializes RabbitMQ, React Client, and Postgres
docker-compose up
```

Terminal 2 - Run Django Server
```bash
# inside root dir
# Create python virtual env
python3 -m venv env

# Activate
source env/bin/activate

# Download requirements
pip install -r requirements.txt

cd backend

python3 manage.py migrate
python3 manage.py tests
python3 manage.py runserver
```

Terminal 3 - Run Celery
```bash
# inside root dir
# Activate
source env/bin/activate
cd backend

celery -A app worker -l INFO
```


## Usage

Frontend Client - localhost:3000/

Backend Server - localhost:8000/

## License
[MIT](https://choosealicense.com/licenses/mit/)