implementation Task List
Phase 1: Project Setup & Planning
Define project requirements and user stories (see /sp.specify output)

Choose technology stack: FastAPI, Next.js, PostgreSQL, Docker, Kubernetes

Set up version control (Git) and create repository

Create project directory structure for backend and frontend

Phase 2: Backend Development (FastAPI)
2.1 Initial Setup
Initialize Python virtual environment

Install dependencies: fastapi, uvicorn, sqlalchemy, psycopg2-binary, python-jose[cryptography], passlib[bcrypt], bcrypt, python-multipart, email-validator, google-generativeai

Create main FastAPI app with CORS middleware

Configure environment variables (JWT_SECRET, DATABASE_URL)

2.2 Database Models & Connection
Create SQLAlchemy models: User, Student, Todo, AuditLog

Set up database connection (engine, session factory, get_db dependency)

Create tables (automatically via create_all or manually)

2.3 Authentication Endpoints
Implement JWT token creation and validation

Create login endpoint with cookie-based JWT

Create register endpoint (admin only)

Create verify endpoint to check current user

Create logout endpoint to clear cookie

Add password hashing (bcrypt)

2.4 Student Endpoints
GET /api/students – list all students

POST /api/students – create new student

GET /api/students/{id} – get student by id

PUT /api/students/{id} – update student

DELETE /api/students/{id} – delete student (cascade todos)

2.5 Todo Endpoints
GET /api/todos – list todos with optional filters (student_id, status, priority)

POST /api/todos – create todo

GET /api/todos/{id} – get todo by id

PUT /api/todos/{id} – update todo

DELETE /api/todos/{id} – delete todo

GET /api/todos/stats – get todo statistics (total, pending, completed, etc.)

2.6 Chat Endpoint
POST /api/chat – send message to Google Gemini AI and return response

Handle API key via environment variable

2.7 Audit Log Endpoint
GET /api/audit – list audit logs with pagination and filters (table, action)

Phase 3: Frontend Development (Next.js)
3.1 Initial Setup
Create Next.js app with TypeScript and Tailwind CSS

Install dependencies: axios, react-hot-toast, zustand, recharts, heroicons

Set up API client (axios instance with credentials)

Configure environment variable for API URL

3.2 Authentication & State Management
Create auth store (Zustand) for user state and login/logout

Implement login page (/login)

Implement register page (/register) – hidden unless admin

Add protected routes (redirect to login if not authenticated)

3.3 Layout & Navigation
Create main layout with responsive navbar

Conditionally show "Register" link for admin users

Add logout button

3.4 Students Page
Fetch and display list of students

Add student creation form (modal)

Add student edit/delete functionality

Show todo count for each student

Add "View Todos" button to see student's todos in a modal

3.5 Todos Page
Fetch and display todos with filtering by student, status, priority

Display todo statistics (cards)

Add todo creation/editing form (modal)

Add quick status change dropdown

Add delete confirmation

3.6 Dashboard Page
Fetch todo stats and recent todos

Fetch recent audit logs

Display stats cards

Show pie chart of todo status distribution

Show mock weekly activity chart (or real when available)

Display recent todos with student names

Display recent audit logs

3.7 Chat Page
Create chat interface with message input and response area

Send user message to backend chat endpoint

Display AI response with typing indicator

3.8 Audit Page
Fetch and display audit logs with pagination

Format log entries with color‑coded actions

Add filters (by table, action)

Phase 4: Database Setup (PostgreSQL on Host)
Install PostgreSQL 16 on VPS

Create database and user (todoapp, postgres)

Configure pg_hba.conf to allow connections from Kubernetes pod network (10.244.0.0/16) and Minikube node IP (192.168.49.2)

Set listen_addresses = '*' in postgresql.conf

Restart PostgreSQL and verify connectivity

Create initial admin user (password hashed with bcrypt)

Phase 5: Containerization
5.1 Backend Dockerfile
Write multi‑stage Dockerfile for Python backend

Copy requirements and install dependencies

Copy application code

Expose port 8840

Set environment variables for production

5.2 Frontend Dockerfile
Write multi‑stage Dockerfile for Next.js app

Build static files (or standalone server)

Copy to runner image

Expose port 3430

Phase 6: Kubernetes Deployment
6.1 Minikube Setup
Install Minikube (already present)

Start cluster with appropriate driver (none)

Enable necessary add‑ons (ingress, storage, etc. if needed)

6.2 Create Namespace & Secrets
Create todoapp namespace

Create secrets for JWT secret and Google API key (if needed)

6.3 PostgreSQL (in-cluster option, but we used host)
Option: Deploy PostgreSQL in cluster with PVC (we chose host instead)

(Alternatively) Use host PostgreSQL, so no in‑cluster DB deployment

6.4 Backend Deployment & Service
Write backend deployment YAML with environment variables (DATABASE_URL, JWT_SECRET)

Write backend service (ClusterIP, later NodePort)

Apply to cluster

6.5 Frontend Deployment & Service
Write frontend deployment YAML with environment variable NEXT_PUBLIC_API_URL

Write frontend service (NodePort for external access)

Apply to cluster

6.6 PersistentVolume (if in‑cluster DB)
Not needed for host DB, but we created a PVC for the in‑cluster PostgreSQL option (optional)

6.7 Expose Services Externally
Set up socat services on host to forward ports 8840 and 3430 to Minikube NodePorts

Create systemd services for socat to persist across reboots

Phase 7: Testing & Debugging
Test backend endpoints with curl

Test frontend login and CRUD operations

Debug CORS issues (add allow_origins, credentials)

Debug database connection issues (pg_hba.conf, firewall)

Debug password hashing (switch from passlib to bcrypt)

Fix TypeScript errors in frontend

Ensure admin‑only registration works

Verify audit logs are created

Phase 8: Documentation & Final Steps
Write README with setup instructions

Document deployment steps

Create project constitution (/sp.constitution)

Create project specification (/sp.specify)

Prepare task list (/sp.tasks)

(Optional) Add automated tests

(Optional) Set up CI/CD pipeline

Phase 9: Submission & Presentation
Package all code and documentation

Record demo video (if required)

Prepare presentation slides highlighting architecture and key features

Submit project

Legend:

= Completed

= Pending (may be optional or future)

This task list reflects the actual development journey and can be used as a checklist for project submission.


