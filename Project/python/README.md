# Getting Started
* Duplicate ```src/config-default.cfg``` and name the duplicate ```src/config.cfg```
* Populate the **SODAPY_APPTOKEN** config variable
  * You can also export it as an environment variable

## How to run without docker
  * Perform the above ^
  * Install virtualenv
  * Install python3
  * Create your virtual environment ```virtualenv -p python3 ~/.envs/311-data```
  * Source your virtualenv ```source ~/.envs/311-data/bin/activate```
  * Update pip ```pip3 install --upgrade pip```
  * Install dependencies ```pip3 install -r requirements.txt```

## How to run in the container
  * Perform the above ^^
  * From the directory with the Dockerfile run: ```docker build . -t 311-data-backend:{your tag}```
    * The '.' is the build context (Where the app docker file is and where the app code is)
    * The '-t' means tag...what you want to name your container
    * '{your tag}' can be anything but typically follows [semantic versioning rules](https://semver.org/)
  * Run: ```docker run -p 5000:5000 -d 311-data-backend:{your tag}```
    * '-p' exposes the container port to your localhost port
    * '-d' runs the container in the background
      * You can exclude this to see the console output on your terminal
  * Run ```docker ps``` to verify your container is running
