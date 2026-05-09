# Community Property Management System

A full-stack web application for managing community/residential properties.
Built with **Spring Boot + MySQL** (backend) and **React** (frontend).

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Running Locally](#running-locally)
- [API Reference](#api-reference)
- [Frontend API Response Contract](#frontend-api-response-contract)
- [Next Steps](#next-steps)
- [Team Task Breakdown](#team-task-breakdown)

---

## Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Backend    | Java 17, Spring Boot 3.2            |
| ORM        | Spring Data JPA (Hibernate)         |
| Security   | Spring Security + JWT (JJWT 0.11)   |
| Database   | MySQL 8.x                           |
| Frontend   | React 18, React Router 6, Axios     |
| Build tool | Maven                               |

---

## Project Structure

```
community-property-management/
|-- backend/                          # Spring Boot application
|   |-- pom.xml
|   `-- src/main/
|       |-- java/com/community/management/
|       |   |-- CommunityManagementApplication.java
|       |   |-- config/               # SecurityConfig (JWT + CORS)
|       |   |-- controller/           # REST API controllers (7 modules)
|       |   |-- service/              # Business logic interfaces + impls
|       |   |-- repository/           # Spring Data JPA repositories
|       |   |-- entity/               # JPA entities (8 tables)
|       |   |-- dto/                  # Request/response objects
|       |   |-- security/             # JwtUtil, JwtFilter, UserDetailsService
|       |   `-- exception/            # Global error handling
|       `-- resources/
|           `-- application.yml       # Database + JWT config
|
`-- frontend/                         # React application
    |-- package.json
    `-- src/
        |-- App.js                    # Root router + PrivateRoute guard
        |-- index.js
        |-- components/               # Reusable components (Navbar, etc.)
        |-- pages/                    # Page components (Login, Register, Dashboard)
        `-- services/
            `-- api.js                # Axios instance + all API calls
```

---

## Prerequisites

Make sure the following are installed on your machine:

| Tool         | Minimum Version | Check command          |
|--------------|-----------------|------------------------|
| Java JDK     | 17              | `java -version`        |
| Maven        | 3.8+            | `mvn -version`         |
| MySQL Server | 8.0+            | `mysql --version`      |
| Node.js      | 18+             | `node -version`        |
| npm          | 9+              | `npm -version`         |

---

## Running Locally

### Step 1 - Set up the MySQL database

```bash
# Log in to MySQL
mysql -u root -p

# Create the database
CREATE DATABASE community_db;
EXIT;
```

### Step 2 - Configure the backend

Open `backend/src/main/resources/application.yml` and update:

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/community_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
    username: root
    password: YOUR_MYSQL_PASSWORD    # <-- change this
```

### Step 3 - Run the backend

```bash
cd backend
./mvnw spring-boot:run
```

The API will start at `http://localhost:8080`.

> On first run, Hibernate auto-creates all tables (`ddl-auto: update`).

### Step 4 - Seed the roles table

After the first run, insert the required roles:

```sql
USE community_db;

INSERT INTO roles (name) VALUES
  ('ROLE_ADMIN'),
  ('ROLE_RESIDENT'),
  ('ROLE_STAFF');
```

### Step 5 - Run the frontend

```bash
cd frontend
npm install
npm start
```

The app will open at `http://localhost:3000`.

### Step 6 - Verify the setup

Test the login endpoint using curl or Postman:

```bash
# Register a new user
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Admin User","email":"admin@test.com","password":"password123"}'

# Login and get a JWT token
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"password123"}'
```

A successful response returns:
```json
{
  "token": "eyJhbGci...",
  "email": "admin@test.com",
  "fullName": "Admin User"
}
```

Use the token in subsequent requests:
```bash
curl http://localhost:8080/api/announcements \
  -H "Authorization: Bearer eyJhbGci..."
```

---

## API Reference

All protected endpoints require `Authorization: Bearer <token>` header.

### Auth (public)
| Method | Endpoint               | Description        |
|--------|------------------------|--------------------|
| POST   | `/api/auth/register`   | Create new account |
| POST   | `/api/auth/login`      | Login, get JWT     |

### Users (protected)
| Method | Endpoint          | Role    | Description       |
|--------|-------------------|---------|-------------------|
| GET    | `/api/users`      | ADMIN   | List all users    |
| GET    | `/api/users/{id}` | Any     | Get user by ID    |
| PUT    | `/api/users/{id}` | Any     | Update profile    |
| DELETE | `/api/users/{id}` | ADMIN   | Delete user       |

### Announcements
| Method | Endpoint                    | Role  | Description          |
|--------|-----------------------------|-------|----------------------|
| GET    | `/api/announcements`        | Any   | List announcements   |
| POST   | `/api/announcements`        | ADMIN | Create announcement  |
| DELETE | `/api/announcements/{id}`   | ADMIN | Delete announcement  |

### Discussion Board
| Method | Endpoint                        | Role | Description      |
|--------|---------------------------------|------|------------------|
| GET    | `/api/posts`                    | Any  | List all posts   |
| GET    | `/api/posts/{id}`               | Any  | Get post details |
| POST   | `/api/posts`                    | Any  | Create post      |
| POST   | `/api/posts/{id}/comments`      | Any  | Add comment      |
| DELETE | `/api/posts/{id}`               | Any  | Delete post      |

### Bookings
| Method | Endpoint                        | Role  | Description          |
|--------|---------------------------------|-------|----------------------|
| GET    | `/api/bookings`                 | ADMIN | List all bookings    |
| GET    | `/api/bookings/user/{userId}`   | Any   | My bookings          |
| POST   | `/api/bookings`                 | Any   | Create booking       |
| PATCH  | `/api/bookings/{id}/status`     | ADMIN | Approve/reject       |
| DELETE | `/api/bookings/{id}`            | Any   | Cancel booking       |

### Maintenance
| Method | Endpoint                          | Role        | Description       |
|--------|-----------------------------------|-------------|-------------------|
| GET    | `/api/maintenance`                | ADMIN/STAFF | All requests      |
| GET    | `/api/maintenance/user/{userId}`  | Any         | My requests       |
| POST   | `/api/maintenance`                | Any         | Submit request    |
| PATCH  | `/api/maintenance/{id}/status`    | ADMIN/STAFF | Update status     |

### Payments (mock)
| Method | Endpoint                      | Role  | Description          |
|--------|-------------------------------|-------|----------------------|
| GET    | `/api/payments/user/{userId}` | Any   | My payment history   |
| POST   | `/api/payments`               | ADMIN | Create payment record|
| PATCH  | `/api/payments/{id}/pay`      | Any   | Mock: mark as paid   |

## Frontend API Response Contract

The React app reads the following fields from backend responses. Keep these names stable unless the frontend adapters are updated. For now, list endpoints should return a JSON array. The admin page can also tolerate `{ "content": [] }`, `{ "items": [] }`, or `{ "data": [] }`, but `GET /api/announcements` should return an array because the dashboard reads it directly.

All error responses that should be shown in the UI should include:

```json
{
  "message": "Human-readable error message"
}
```

A `401 Unauthorized` response logs the user out and redirects to `/login`.

### Auth responses

`POST /api/auth/login` should return:

```json
{
  "token": "jwt-token",
  "email": "admin@test.com",
  "fullName": "Admin User",
  "role": "ROLE_ADMIN"
}
```

The frontend accepts `role`, `roles`, or `authorities` in the response body, or inside the JWT payload. Any value containing `admin` is treated as an admin account. If no admin role is found, the user is treated as a resident.

`POST /api/auth/register` only needs to return any `2xx` response. Returning the created user object is also fine.

### Shared user shape

Used by `GET /api/users`, `postedBy`, booking `user`, and maintenance `user` fields:

```json
{
  "id": 1,
  "fullName": "Resident User",
  "email": "resident@test.com",
  "phone": "1234567890",
  "role": "ROLE_RESIDENT"
}
```

The admin page can also read `name`, `username`, `accountType`, `type`, `roles`, or `authorities`, but `id`, `fullName`, `email`, `phone`, and `role` are the preferred fields.

### Announcements

`GET /api/announcements` and `POST /api/announcements` should return announcement objects:

```json
{
  "id": 1,
  "title": "Water maintenance notice",
  "content": "Water will be unavailable from 10:00 to 12:00.",
  "postedBy": {
    "id": 1,
    "fullName": "Community Management"
  },
  "postedAt": "2026-05-08T14:30:00Z"
}
```

`GET /api/announcements` should return `Announcement[]`. `DELETE /api/announcements/{id}` can return `204 No Content`; the frontend does not require a response body.

### Discussion posts and comments

`GET /api/posts`, `GET /api/posts/{id}`, `POST /api/posts`, and `POST /api/posts/{id}/comments` should use these shapes when the discussion page is connected to the backend:

```json
{
  "id": 1,
  "title": "Community event",
  "content": "Event details",
  "author": "Property Manager A",
  "time": "2026-05-08 14:30",
  "replies": [
    {
      "id": 101,
      "author": "Resident User",
      "content": "Sign me up.",
      "time": "2026-05-08 15:00",
      "likes": 0,
      "liked": false
    }
  ]
}
```

If the backend uses `createdAt`, `comments`, or nested user objects instead of `time`, `replies`, and `author`, add a frontend adapter before replacing the current mock state.

### Bookings

`GET /api/bookings`, `GET /api/bookings/user/{userId}`, `POST /api/bookings`, and `PATCH /api/bookings/{id}/status` should return booking objects:

```json
{
  "id": 1,
  "facility": "Multipurpose Hall",
  "date": "2026-05-10",
  "time": "14:00-16:00",
  "user": {
    "id": 2,
    "fullName": "Resident User",
    "email": "resident@test.com"
  },
  "status": "pending"
}
```

Allowed booking statuses used by the frontend: `pending`, `approved`, `rejected`, `cancelled`. The status update request body sent by the frontend is:

```json
{
  "status": "approved"
}
```

### Maintenance requests

`GET /api/maintenance`, `GET /api/maintenance/user/{userId}`, `POST /api/maintenance`, and `PATCH /api/maintenance/{id}/status` should return maintenance request objects:

```json
{
  "id": 1,
  "title": "Leaking pipe",
  "description": "Pipe is leaking in the hallway.",
  "location": "Building A, Floor 3",
  "user": {
    "id": 2,
    "fullName": "Resident User",
    "email": "resident@test.com"
  },
  "status": "pending"
}
```

The admin page can display `title`, `issue`, or `description` as the request title. Allowed maintenance statuses used by the frontend: `pending`, `in_progress`, `resolved`, `closed`. The status update request body sent by the frontend is:

```json
{
  "status": "in_progress"
}
```

### Payments

`GET /api/payments/user/{userId}`, `POST /api/payments`, and `PATCH /api/payments/{id}/pay` should return payment objects:

```json
{
  "id": 1,
  "userId": 2,
  "type": "Property Management Fee",
  "amount": 320.0,
  "dueDate": "2026-05-31",
  "status": "unpaid",
  "paidAt": null
}
```

Allowed payment statuses used by the frontend: `unpaid`, `paid`. The admin payment creation request body sent by the frontend is:

```json
{
  "userId": 2,
  "type": "Property Management Fee",
  "amount": 320.0,
  "dueDate": "2026-05-31",
  "status": "unpaid"
}
```

---

## Next Steps

Below is what needs to be implemented to complete the system.
Each item references the relevant file(s) to edit.

### Backend

#### 1. Security - extract current user from JWT
Currently, controllers accept `userId` as a path param, which is insecure.
The logged-in user should be resolved from the JWT automatically.

Add a helper to `SecurityConfig` or a `@CurrentUser` annotation:
```java
// Example: resolve user inside a service
Authentication auth = SecurityContextHolder.getContext().getAuthentication();
String email = auth.getName();
User user = userRepository.findByEmail(email).orElseThrow();
```
Files: all `ServiceImpl` classes (replace `// TODO: set ... from security context`)

#### 2. Input validation on entities
Add `@Valid` + DTO classes for all `@RequestBody` parameters that currently
accept raw entity objects (e.g. `Post`, `Booking`, `MaintenanceRequest`).
File: all controllers, add DTOs in `dto/` package.

#### 3. Pagination
All list endpoints currently return unbounded lists.
Replace `findAll()` with `findAll(Pageable pageable)`.
```java
// Controller
@GetMapping
public Page<Post> getAll(@RequestParam(defaultValue = "0") int page,
                         @RequestParam(defaultValue = "10") int size) {
    return postService.getAllPosts(PageRequest.of(page, size));
}
```
Files: all repositories and service interfaces.

#### 4. Refresh tokens
The current JWT expires after 24 hours with no way to refresh.
Add a `refresh_tokens` table and `POST /api/auth/refresh` endpoint.

#### 5. Email notifications
Send emails on key events (booking approved, maintenance resolved).
Add `spring-boot-starter-mail` to `pom.xml` and create an `EmailService`.

#### 6. Admin seeding on startup
Create a `DataInitializer` (`@Component` + `CommandLineRunner`) that inserts
roles and a default admin account on first run, instead of requiring manual SQL.
File: create `config/DataInitializer.java`

#### 7. Conflict detection for bookings
`BookingServiceImpl.create()` needs to query for overlapping time slots
before saving.
```java
// Add to BookingRepository:
List<Booking> findByRoomNameAndStartTimeLessThanAndEndTimeGreaterThan(
    String roomName, LocalDateTime end, LocalDateTime start);
```

### Frontend

#### 8. Authentication context
Replace raw `localStorage` reads with a React Context so all components
share auth state reactively.
File: create `src/context/AuthContext.js`

#### 9. Complete page implementations
Stub pages to build:

| Page                  | Route               | File to create                         |
|-----------------------|---------------------|----------------------------------------|
| Discussion Board      | `/posts`            | `src/pages/Posts.js`                   |
| Post Detail + Comments| `/posts/:id`        | `src/pages/PostDetail.js`              |
| New Post Form         | `/posts/new`        | `src/pages/NewPost.js`                 |
| Booking Calendar      | `/bookings`         | `src/pages/Bookings.js`                |
| New Booking Form      | `/bookings/new`     | `src/pages/NewBooking.js`              |
| Maintenance List      | `/maintenance`      | `src/pages/Maintenance.js`             |
| New Request Form      | `/maintenance/new`  | `src/pages/NewMaintenance.js`          |
| Payments              | `/payments`         | `src/pages/Payments.js`                |
| User Profile          | `/profile`          | `src/pages/Profile.js`                 |
| Admin Panel           | `/admin`            | `src/pages/Admin.js`                   |

#### 10. UI component library
Install a component library to avoid writing raw CSS:
```bash
npm install @mui/material @emotion/react @emotion/styled
# or
npm install antd
```

#### 11. Form validation
Add client-side validation before API calls using `react-hook-form`:
```bash
npm install react-hook-form
```

#### 12. Global state management
Add React Query for server state (caching, refetching, loading states):
```bash
npm install @tanstack/react-query
```

### DevOps / Production

#### 13. Environment variables
Move secrets out of `application.yml`:
```bash
# .env (never commit this)
DB_PASSWORD=yourpassword
JWT_SECRET=your-secret-key
```
Use `${DB_PASSWORD}` in `application.yml`.

#### 14. Dockerize the project
Create `docker-compose.yml` to run MySQL + backend + frontend together.

#### 15. API documentation
Add Springdoc OpenAPI (Swagger UI):
```xml
<dependency>
    <groupId>org.springdoc</groupId>
    <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
    <version>2.3.0</version>
</dependency>
```
Visit `http://localhost:8080/swagger-ui.html` after adding this.

---

## Team Task Breakdown

See `TASKS.md` for the full breakdown of tasks divided across 3 teammates.
