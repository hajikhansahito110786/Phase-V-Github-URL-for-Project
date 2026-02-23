Project Specification: Todo Management System with AI Assistant
1. Introduction
This document outlines the requirements for a Todo Management System that helps users organize tasks for multiple students. The system will include a conversational AI assistant to provide guidance and enhance productivity. The goal is to create a practical, user‑friendly tool for tracking student assignments and tasks, with full auditability and role‑based access control.

2. Problem Statement
Educators, tutors, and parents often manage multiple students with various assignments and deadlines. Existing tools are either too generic (lacking student‑specific context) or too complex. Users need a simple, centralized platform where they can:

Maintain a list of students.

Assign and track todos for each student.

Monitor progress (pending, in‑progress, completed, overdue).

See a history of changes for accountability.

Get quick answers and assistance via an integrated AI chatbot.

Additionally, the system must allow only authorized administrators to create new user accounts, ensuring security and controlled access.

3. Target Users
Administrators: Manage the system, create user accounts, and oversee all data.

Teachers / Tutors: Create and manage students and their todos.

Parents / Guardians: View progress of their children (future enhancement).

Students (future): Possibly view their own tasks.

For the initial release, the primary users are administrators and teachers/tutors.

4. Functional Requirements
4.1 User Authentication & Authorization
Users must be able to register (admin only) and log in securely.

Authentication via username and password.

Sessions maintained via secure cookies (HTTP‑only).

Role‑based access: admin can create new users; regular user cannot.

Logout functionality that clears the session.

4.2 Student Management
Create a new student record with name, email, and optional phone.

View a list of all students.

Edit student details.

Delete a student (cascade delete all associated todos).

Display a count of todos per student on the student card.

4.3 Todo Management
Create a todo for a specific student with title, description, priority (low/medium/high/critical), due date, and initial status (pending).

View a list of todos with filtering by student, status, and priority.

Update todo details (title, description, priority, due date, status).

Change todo status quickly from the list (pending → in‑progress → completed).

Delete a todo.

Show todo statistics: total, pending, in‑progress, completed, overdue.

4.4 Dashboard
Display summary statistics (total todos, pending, completed, etc.).

Show recent todos and recent audit logs.

Provide quick links to manage students and todos.

Visual charts (pie chart for status distribution, bar chart for weekly activity mock).

4.5 Audit Logging
Automatically record all insert, update, delete operations on students and todos.

Capture: timestamp, user, action, table name, record ID, old data, new data, IP address.

Allow viewing of audit logs (recent and filtered).

4.6 AI Chatbot
Provide a chat interface where users can ask questions about the system, get help with tasks, or request information.

The AI should be context‑aware (e.g., "show me pending todos") and respond conversationally.

Powered by Google Gemini AI (or similar) to generate helpful, human‑like responses.

4.7 Responsive UI
The interface must be usable on desktop, tablet, and mobile devices.

Use modern, clean design with intuitive navigation.

5. Non‑Functional Requirements
5.1 Security
Passwords must be hashed (bcrypt) before storage.

Authentication tokens must be stored in HTTP‑only cookies to prevent XSS.

CORS must be configured to allow only the frontend origin.

Database access restricted to authorized networks.

5.2 Performance
API responses should be fast (<200ms for typical operations).

Frontend should load quickly and be interactive.

Database queries optimized with indexes.

5.3 Reliability
The system must handle concurrent users without crashing.

Data must persist across server restarts (database on persistent storage).

5.4 Maintainability
Code should be modular, well‑documented, and follow consistent style.

Use version control (Git) to track changes.

Provide clear deployment instructions.

5.5 Scalability
Architecture should allow horizontal scaling of backend/frontend pods in Kubernetes.

Database can be scaled vertically or with read replicas if needed.

5.6 Usability
Intuitive navigation with clear labels and feedback messages (toasts).

Forms should validate input and provide helpful error messages.

6. User Stories
As an admin, I want to create new user accounts so that only authorized people can access the system.

As a teacher, I want to add a new student so that I can track their tasks.

As a teacher, I want to create a todo for a student with a due date so that they don't forget assignments.

As a teacher, I want to see all todos for a student so that I can monitor their workload.

As a teacher, I want to mark a todo as completed so that I can track progress.

As a teacher, I want to filter todos by status so that I can focus on pending items.

As a user, I want to ask the AI chatbot "What todos are overdue?" and get a list.

As an admin, I want to view the audit log to see who changed what and when.

As a user, I want to see a dashboard with key metrics so I can get an overview at a glance.

7. Constraints & Assumptions
The system will be deployed on a single VPS with Kubernetes (Minikube) for simplicity.

Database will run on the host machine (not in Kubernetes) for easier backup and management.

Users have modern browsers with JavaScript enabled.

Internet connectivity is required for the AI chatbot (calls external Gemini API).

8. Success Criteria
All functional requirements are implemented and tested.

Users can successfully perform all CRUD operations.

Audit logs accurately reflect changes.

AI chatbot responds appropriately to common queries.

Deployment works on a fresh Minikube setup following provided instructions.

The system handles at least 10 concurrent users without degradation.

9. Future Enhancements
Email notifications for upcoming deadlines.

Student view (limited access for students to see their own todos).

Integration with calendar services (Google Calendar).

Export data to CSV/PDF.

Advanced AI features: natural language task creation, sentiment analysis.

This specification captures the essence of the desired system without prescribing specific technologies, focusing instead on user needs and system behavior.


