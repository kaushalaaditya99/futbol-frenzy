# futbol-frenzy
Create a phone application that allows coaches to perform drills for students and allow them to see instant feedback through machine learning pose analysis

## Prerequisites
- Python 3.12+ with pip
- Node.js and npm
- Xcode (for iOS) or Android Studio (for Android)

## Installation

### 1. Clone and set up the virtual environment

```bash
cd futbol-frenzy
python3 -m venv venv
source venv/bin/activate
```

> **Windows:** use `py -m venv venv
>> venv\Scripts\activate` instead

You will know the virtual environment is running when you can see `(venv)` next to your directory in terminal.

### 2. Backend setup

#### Install dependencies
```bash
cd backend
pip install -r requirements.txt
```

#### Create the `.env` file
Create a file at `backend/.env` with the following client IDs

#### Set up the database
```bash
python3 manage.py makemigrations
python3 manage.py migrate
```
> **Windows:** use 'py manage.py check                       
>> py manage.py makemigrations
>> py manage.py migrate' instead

These commands should also be run whenever a change is made to `backend/futbolfrenzy/models.py`.

#### Run the backend server
```bash
python3 manage.py runserver 0.0.0.0:8000
```
> **Windows:** use 'python manage.py runserver 0.0.0.0:8000` instead

> **Important:** You must use `0.0.0.0:8000` (not just `runserver`) so the app can connect from your phone/emulator over the local network.

### 3. Frontend setup

#### Install dependencies
```bash
cd frontend
npm install
```

#### Create the `.env` file
Create a file at `frontend/.env` with the three client IDs

### 4. Running the app

#### iOS
Requires a Mac with Xcode installed.
```bash
cd frontend
npx expo prebuild --platform ios
npx expo run:ios
```

#### Android
Requires Android Studio with the Android SDK installed.
```bash
cd frontend
npx expo prebuild --platform android
npx expo run:android
```

#### Web
Requires Android Studio with the Android SDK installed.
```bash
cd frontend
npx expo start
```

> **Note:** Make sure your phone/emulator is on the same Wi-Fi network as the computer running the backend server.

## Admin Page
Create a superuser login at `futbol-frenzy/backend/` using:
```bash
python3 manage.py createsuperuser
```
Then log in at `http://127.0.0.1:8000/admin/`

## Contributing to Backend

### File Structure
- Backend source code: `backend/futbolfrenzy/`
- Database changes should be synced across: `models.py`, `serializers.py`, `viewsets.py`, and `urls.py`
- Server settings: `backend/FrenzyCore/`
- API router: `backend/routers.py`
