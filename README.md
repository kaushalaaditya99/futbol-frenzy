# futbol-frenzy
Create a phone application that allows coaches to perform drills for students and allow them to see instant feedback through machine learning pose analysis

## Installation

### Setting up Virtual Environment
First, ensure that Python(version 3.10 and up) with Pip, npm package manager, and Node.js are installed\
Using a python virtual environment is strongly recommended for running the backend server

#### Open a terminal at the directory and run the following commands
``` bash
py -m venv venv
venv\Scripts\activate #this command can be used at any time to run your virtual environment
```
You will know the virtual environmnet is running when you can see (venv) next to your directory listing in terminal
### Setting up Backend
#### Installing Dependencies
Run the following command in the virtual environment at `futbol-frenzy/backend` to install required django configurations

``` bash
pip install -r requirements.txt
```

#### Setting up Database
Run following commands in the virtual environment at `futbol-frenzy/backend/` to set up database
``` bash
py manage.py check
py manage.py makemigrations
py manage.py migrate
```
The above commands should also be run whenever a change is made to `backend/futbolfrenzy/models.py`

## Contributing to Backend
### File Structure
<p>Backend source code files can be found in backend/futbolfrenzy. Modifications to database should be synced in the files backend/futbolfrenzy/models.py, backend/futbolfrenzy/serializers.py, backend/futbolfrenzy/viewsets.py</br>
<p>Backend server settings file(pertaining to API structure and such) can be found in backend/FrenzyCore. API functions can be found in routers.py</br>