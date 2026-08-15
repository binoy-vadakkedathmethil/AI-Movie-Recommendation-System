# AI-Movie-Recommendation-System

An AI-powered movie recommendation web application built with Angular and FastAPI.

The project follows a modern full-stack architecture where:

Angular handles the frontend/UI.
FastAPI provides REST APIs.
SQLite + SQLAlchemy handle application data.
JWT is used for authentication.
The frontend communicates with the backend through HTTP APIs.

🛠️ Technology Stack
Frontend
Technology	Purpose
Angular 20	Frontend framework
TypeScript	Application development
Angular Material	UI components
RxJS	Reactive programming
Angular Router	Navigation
HTTP Client	API communication

The current frontend package.json uses Angular 20 packages and TypeScript 5.8.x.

Backend
Technology	Purpose
Python	Backend language
FastAPI	REST API framework
Uvicorn	ASGI server
SQLAlchemy	ORM
SQLite	Database
Pydantic	Request/response validation
JWT	Authentication
Passlib/Bcrypt	Password hashing

The backend currently pins FastAPI, SQLAlchemy, Uvicorn, JWT-related packages, Pydantic and other dependencies in requirements.txt.


🚀 Getting Started
1. Prerequisites

Install the following:

Git
Node.js
npm
Angular CLI
Python 3.x
pip

Verify:

git --version
node --version
npm --version
python --version
pip --version

📥 2. Clone the Repository
git clone https://github.com/binoy-vadakkedathmethil/AI-Movie-Recommendation-System.git

Move into the project:

cd AI-Movie-Recommendation-System
🐍 3. Setup Backend

Go to the backend:

cd backend
Create a virtual environment
Windows
python -m venv venv

Activate:

venv\Scripts\activate

If PowerShell blocks script execution, use:

Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

Then:

venv\Scripts\activate
macOS/Linux
python3 -m venv venv
source venv/bin/activate
📦 4. Install Backend Dependencies
pip install -r requirements.txt

The repository already contains the required FastAPI, SQLAlchemy, Uvicorn, authentication and supporting Python packages.

▶️ 5. Start FastAPI Backend

From:

AI-Movie-Recommendation-System/backend

run:

python run.py

The repository's run.py starts Uvicorn using:

app.main:app

on:

http://127.0.0.1:8000

with reload enabled.

Backend URL:

http://127.0.0.1:8000
📚 6. FastAPI Swagger Documentation

FastAPI automatically provides interactive API documentation.

Open:

http://127.0.0.1:8000/docs

You can use Swagger UI to test:

Register
Login
Future movie APIs
Future recommendation APIs
🅰️ 7. Setup Angular Frontend

Open another terminal.

From the project root:

cd movie-pilot-ai

Install dependencies:

npm install

The Angular project defines ng serve as its start script.

▶️ 8. Start Angular

Run:

npm start

or:

ng serve

The application will be available at:

http://localhost:4200

The current Angular project is configured as an Angular 20 application and its existing README also uses ng serve with port 4200.
