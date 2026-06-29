# LifePulse FastAPI Backend 🚀

A high-performance, secure health optimization backend built with **Python**, **FastAPI**, and **SQLAlchemy**. It supports persistent relational databases (configured for local SQLite file storage by default, easily configured for PostgreSQL in production).

---

## Technical Features
- **JWT Bearer Token Security**: Password hashing with `bcrypt` (using `passlib`) and request authorization.
- **Auto Database Initialization**: SQLite tables are automatically provisioned on startup. No extra migration script required!
- **Swagger Documentation**: Native interactive endpoints for testing and validation.
- **Heartbeat Connection Endpoint**: Provides automated health checks for the Flutter app client.

---

## Getting Started

### 1. Prerequisites
- **Python 3.10+** installed on your system.
- **pip** package installer.

### 2. Installation
Navigate into the `fastapi_backend` directory and install the required dependencies:
```bash
# Go to backend directory
cd fastapi_backend

# (Optional) Create and activate a python virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install requirements
pip install -r requirements.txt
```

### 3. Run the Backend
Start the server using **uvicorn**:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Once running:
- **Main Entrypoint**: `http://localhost:8000/`
- **Heartbeat / Test Diagnostic Check**: `http://localhost:8000/db-test`
- **Interactive OpenAPI (Swagger) Documentation**: `http://localhost:8000/docs`

---

## Database Configurations (Optional)

By default, the backend stores data inside a local database file: `lifepulse.db`. 

To connect to a **PostgreSQL** database (e.g., Supabase, Neon, or local PostgreSQL), configure the `DATABASE_URL` environment variable before running the uvicorn command:

#### Linux / macOS:
```bash
export DATABASE_URL="postgresql://username:password@localhost:5432/lifepulse"
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

#### Windows (PowerShell):
```powershell
$env:DATABASE_URL="postgresql://username:password@localhost:5432/lifepulse"
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

---

## API Router Reference

- `POST /auth/register`: Create a new user account `{email, password, name}`.
- `POST /auth/login`: Login and receive access & refresh tokens.
- `POST /auth/refresh`: Feed a refresh token to obtain a fresh access token.
- `GET /users/me`: Access current authenticated user context.
- `POST /habits`: Create a personalized habits target checklist.
- `GET /habits`: Retrieve user habits list.
- `POST /water-logs`: Persist water consumption logs in milliliters.
- `POST /workout-logs`: Report minutes exercised and calories burned.
- `POST /meals`: Persist breakfast, lunch, and dinner calories.
- `POST /daily-scores`: Upsert daily health scores based on target achievements.
- `GET /db-test`: Standard diagnostic tool.
