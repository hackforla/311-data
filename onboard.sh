echo "\n\n\t\tWelcome to 311! This script will check all dependencies required to develop\n\
\t\tagainst the 311 project. It will install packages when it can, otherwise there may\n\
\t\tbe further instructions for you to follow"

## PLATFORM
echo "\n\nChecking platform related components"
# check if docker is installed
if ! [ -x "$(command -v git)" ]; then
  echo "👺Error: git is not installed." >&2
  echo "Please visit this link \n\n\t https://www.atlassian.com/git/tutorials/install-git"
  echo "Once complete, rerun this script to find missing dependencies"
  exit 1
fi
echo "👍 Found git installation"

if ! [ -x "$(command -v docker)" ]; then
  echo "👺Error: docker is not installed." >&2
  echo "Please visit this link \n\n\t https://docs.docker.com/install/"
  echo "Once complete, rerun this script to find missing dependencies"
  exit 1
fi
echo "👍 Found docker installation"

# Check for docker-compose
if ! [ -x "$(command -v docker-compose)" ]; then
  echo "👺Error: docker-compose is not installed." >&2
  echo "Please visit this link \n\n\t https://docs.docker.com/compose/install/"
  echo "Once complete, rerun this script to find missing dependencies"
  exit 1
fi
echo "👍 Found docker-compose installation"

## FRONT END
echo "\n\n Checking front end components"
# Check for node
if ! [ -x "$(command -v node)" ]; then
  echo "👺Error: node is not installed." >&2
  echo "Please visit this link \n\n\t https://nodejs.org/en/"
  echo "Once complete, rerun this script to find missing dependencies"
  exit 1
fi
echo "👍 Found node installation"

# Check for npm
if ! [ -x "$(command -v npm)" ]; then
  echo "👺Error: npm is not installed." >&2
  echo "Please visit this link \n\n\t https://www.npmjs.com/get-npm"
  echo "Once complete, rerun this script to find missing dependencies"
  exit 1
fi
echo "👍 Found npm installation"

if [ -d node_modules ]; then
  echo "👍 Found node modules folder, skipping installation"
else
  echo "🕺 Installing node modules"
  npm install
fi


# Check for node version

## BACKEND
echo "\n\n Checking back end components"

# Check if git-lfs is *NOT* installed
if ! [ -x "$(command -v git-lfs)" ]; then
  echo "👺Error: git-lfs is not installed." >&2
  # echo "Please visit this link \n\n\t https://git-lfs.github.com/"
  # echo "Once complete, rerun this script to find missing dependencies"
  # exit 1
else
  echo "WARN Found git-lfs installation, if you have already initialized git-lfs"
  echo "WARN Please run git-lfs uninstall, currently we are not using git-lfs"
  echo "WARN If errors persist, follow this to remove lfs \n\n\thttps://github.com/git-lfs/git-lfs/issues/3026#issuecomment-451598434"
fi

# Check for postgres tools
if ! [ -x "$(command -v pg_config)" ]; then
  echo "👺Error: pg_config is not installed." >&2
  echo "👺👺👺 The backend required psycopg2 which requires a manual install of pg_config and libpq headers."
  echo "👺👺👺 To install those, please refer to \n\n\thttp://initd.org/psycopg/docs/install.html"
  exit 1
fi
echo "👍 Found pg_config installation"


# Check for python3
if ! [ -x "$(command -v python3)" ]; then
  echo "👺Error: python3 is not installed." >&2
  echo "Please visit this link \n\n\t https://www.python.org/downloads/"
  echo "Once complete, rerun this script to find missing dependencies"
  exit 1
fi
echo "👍 Found python3 installation"

# Check for virtualenv
if ! [ -x "$(command -v virtualenv)" ]; then
  echo "👺Error: virtualenv is not installed." >&2
  echo "Please visit this link \n\n\t https://pypi.org/project/virtualenv"
  echo "Once complete, rerun this script to find missing dependencies"
  exit 1
fi
echo "👍 Found virtualenv installation"

if [ -f .env ]; then
    echo "👍 Found existing environment file"
else
    echo "🕺 Copying environment file into .env"
    cp .example.env .env
fi

if [ -f ./server/src/settings.cfg ]; then
  echo "👍 Found python settings file"
else
  echo "🕺 Copying python settings file into server/src/settings.cfg"
  cp ./server/src/settings.example.cfg ./server/src/settings.cfg
fi

if [ -f ./Orchestration/docker-compose.yml ]; then
  echo "👍 Found docker compose file"
else
  echo "🕺 Copying docker compose file into Orchestration/docker-compose.yml"
  cp ./Orchestration/docker-compose-example.yml ./Orchestration/docker-compose.yml
fi


# Create virtualenv
if [ -d ~/.envs/311-data ]; then
  echo "👍 Found virtual environment"
else
  echo "🕺 Creating virtualenv to isolate python packages"
  virtualenv -p python3 ~/.envs/311-data
fi

# Source virtualenv if not already
echo "\n\n\t\tIf youve gotten to this point, congratulations! Dependencies are installed!"
echo "\t\tHappy Hacking! If you have any questions, please reach out to the #311-data-dev slack channel"
echo "\n\n"

# echo "🕺 Sourcing virtualenv, this will terminate the onboarding script"
#source ~/.envs/311-data/bin/activate
if [ -f ./server/src/static/2018_mini.csv ]; then
  echo "👍 Mini seed file found in server/src/static/2018_mini.csv"
  echo "Once the docker compose environment is setup you can send a POST request"
  echo 'To /ingest with body argument of {"sets":["2018_MINI"]} to seed the db'
  echo "With the first 10000 rows of the 2018 dataset"

else
  echo "🕺 Downloading the first 10000 rows of the 2018 dataset for seeding"

  curl 'https://data.lacity.org/resource/h65r-yf5i.csv?$select=SRNumber,CreatedDate,UpdatedDate,ActionTaken,Owner,RequestType,Status,RequestSource,MobileOS,Anonymous,AssignTo,ServiceDate,ClosedDate,AddressVerified,ApproximateAddress,Address,HouseNumber,Direction,StreetName,Suffix,ZipCode,Latitude,Longitude,Location,TBMPage,TBMColumn,TBMRow,APC,CD,CDMember,NC,NCName,PolicePrecinct&$limit=10000' -o server/src/static/2018_mini.csv

  echo "Once the docker compose environment is setup you can send a POST request"
  echo 'To /ingest with body argument of {"sets":["2018_MINI"]} to seed the db'
  echo "With the first 10000 rows of the 2018 dataset"

fi

while true; do
    read -p "Do you wish to run the docker environment? (postgres, frontend, backend, adminer)?" yn
    case $yn in
        [Yy]* ) docker-compose -f ./Orchestration/docker-compose.yml up --build -d && exit;;
        [Nn]* ) exit;;
        * ) echo "Please answer yes or no.";;
    esac
done
