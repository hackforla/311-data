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


# Check for node version

## BACKEND
echo "\n\n Checking back end components"

# Check if git-lfs is installed
if ! [ -x "$(command -v git-lfs)" ]; then
  echo "👺Error: git-lfs is not installed." >&2
  echo "Please visit this link \n\n\t https://git-lfs.github.com/"
  echo "Once complete, rerun this script to find missing dependencies"
  exit 1
fi
echo "👍 Found git-lfs installation"

# Check for postgres tools
echo "🕺 Starting postgres install to support psycopg2 in the backend"
## Need to adjust for different OS's
#sudo apt-get -y update
#sudo apt-get -y install postgresql-devel

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

# Create virtualenv
echo "🕺 Creating virtualenv to isolate python packages"
#virtualenv -p python3 ~/.envs/311-data

# Source virtualenv if not already
echo "\n\n\t\tIf youve gotten to this point, congratulations! Dependencies are installed!"
echo "\t\tHappy Hacking! If you have any questions, please reach out to the #311-data-dev slack channel"
echo "\n\n"

echo "🕺 Sourcing virtualenv, this will terminate the onboarding script"
#source ~/.envs/311-data/bin/activate
