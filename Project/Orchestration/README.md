# Orchestration files
Current implementation: Docker Compose

## How to run
  * Duplicate the ```docker-compose-default.yml``` and rename it to ```docker-compose.yml```
  * Populate the environment variable for **SODAPY_APPTOKEN** in ```docker-compose.yml```
  * From this directory run ```docker-compose up -d --build```
    * '-d' runs everything in the background
    * '--build' will build both the front and backend images since they are not yet on dockerhub

### Frontend
[Link](http://localhost:3000)

### Backend
[Link](http://localhost:5000)

### PostgreSql Admin Dashboard
[Link](http://localhost:8080)
Login is as follows:
  * System: PostgreSql
  * server: db
  * Username: 311-user
  * Password: 311-data-is-r@d
  * Database: 311-user
