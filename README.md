# Football API Manager

A full-stack football data management platform with a secure REST API, role-based access control, and an interactive dashboard for analytics and administration.

---

🌐 **Live Demo:** https://football-api-manager.netlify.app/

🚀 **API Base URL:** https://football-api-manager.onrender.com/api/v1

📚 **API Documentation (Swagger):** https://football-api-manager.onrender.com/api/v1/docs

---

## 🧭 Table of Contents

- <a href="#overview">📖 Overview</a>
- <a href="#features">⚙️ Features</a>
- <a href="#getting-started">🚀 Getting Started</a>
  - <a href="#installation">🧩 Installation</a>
- <a href="#environment-variables">🔐 Environment Variables</a>
- <a href="#user-roles">👥 User Roles</a>
- <a href="#api-guide">📡 API Guide</a>
  - <a href="#authentication-endpoints">🔑 Authentication</a>
  - <a href="#clubs-endpoints">⚽ Clubs Endpoints</a>
  - <a href="#players-endpoints">🧍 Players Endpoints</a>
  - <a href="#competitions-endpoints">🏆 Competitions Endpoints</a>
  - <a href="#countries-endpoints">🌍 Countries Endpoints</a>
- <a href="#technologies-used">🛠️ Technologies Used</a>
- <a href="#about">💡 About</a>

---

<a id="overview"></a>

## 📖 Overview

Football API Manager is a centralized platform for football data.  
Admins can manage data, while standard users can view statistics and analytics.  
The system provides secure and structured data access via a REST API with token-based authentication.

---

<a id="features"></a>

## ⚙️ Features

- **Football Data Hub** – Centralized data management for clubs, players, competitions, countries, and stats.
- **User & Role Management** – Admins can manage users and permissions; standard users have secure access.
- **RESTful API Access** – Secure and scalable endpoints, with public endpoints accessible for general use.
- **API Documentation** – Comprehensive API reference via Swagger (OpenAPI) for easy integration.
- **Frontend UI** – Interactive and user-friendly interface for data exploration and management.
- **Secure Authentication** – JWT-based authentication with role-based access control.

---

<a id="getting-started"></a>

## 🚀 Getting Started

<a id="installation"></a>

### 🧩 Installation

1. **Clone the repository**

   ```bash
   git clone <repo-url>
   ```

2. **Install backend dependencies**

   ```bash
   cd server
   npm install
   ```

3. **Install frontend dependencies**

   ```bash
   cd client
   npm install
   ```

4. **Run backend**

   ```bash
   cd server
   npm run start:dev
   ```

5. **Run frontend**

   ```bash
   cd client
   npm run dev
   ```

---

<a id="environment-variables"></a>

## 🔐 Environment Variables

### Backend (`.env`)

```env
DB_HOST=<localhost>
DB_PORT=<your_port>
DB_USER=<your_user>
DB_PASSWORD=<your_password>
DB_NAME=<your_db_name>
ADMIN_SECRET_KEY=<your_admin_secret_key>
JWT_SECRET=<your_jwt_secret>
CLIENT_URL=<your_client_url>
```

### Frontend (`.env`)

```env
VITE_API_BASE_URL=<your_backend_api_url>
```

---

<a id="user-roles"></a>

## 👥 User Roles

- **Admin** – Manage clubs, players, competitions, countries, and users.
- **User** – View clubs, players, competitions, countries, and analytics.

Excellent — here’s a **clean, structured, and fully refactored** `API Guide` section for your `README.md`.
It keeps your style consistent, adds anchor tags (`<a id="">`) for working navigation, and presents endpoints in a clear, modern format with markdown tables and examples.

---

<a id="api-guide"></a>

## 📡 API Guide

Access comprehensive football data through the RESTful API.  
All endpoints are secured — except public ones — using **JWT authentication** and **role-based authorization** to ensure safe and controlled access.

**Base Path:**

```

/api/<API_VERSION>

Example: `/api/v1`

```

<a id="authentication-endpoints"></a>

### 🔑 Authentication Endpoints

| Method | Endpoint         | Description                          | Access |
| ------ | ---------------- | ------------------------------------ | ------ |
| POST   | `/auth/register` | Register a new user and get a token  | Public |
| POST   | `/auth/login`    | Login with credentials and get token | Public |

**Example – Register a new user**

```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "username": "user@example.com",
  "password": "password123"
}
```

**Example – Authorization Header**

```
Authorization: Bearer <token>
```

---

<a id="clubs-endpoints"></a>

### ⚽ Clubs Endpoints

| Method | Endpoint                           | Description                          | Access |
| ------ | ---------------------------------- | ------------------------------------ | ------ |
| GET    | `/clubs`                           | Fetch all clubs                      | Public |
| GET    | `/clubs/:id`                       | Fetch a specific club by ID          | Public |
| POST   | `/clubs`                           | Create a new club                    | Admin  |
| PATCH  | `/clubs/:id`                       | Update a club                        | Admin  |
| DELETE | `/clubs/:id`                       | Delete a club                        | Admin  |
| POST   | `/clubs/create-bulk`               | Create multiple clubs in bulk        | Admin  |
| POST   | `/clubs/:clubId/players/:playerId` | Add a player to a specific club      | Admin  |
| DELETE | `/clubs/:clubId/players/:playerId` | Remove a player from a specific club | Admin  |

---

<a id="players-endpoints"></a>

### 🧍 Players Endpoints

| Method | Endpoint               | Description                     | Access |
| ------ | ---------------------- | ------------------------------- | ------ |
| GET    | `/players`             | Fetch all players               | Public |
| GET    | `/players/:id`         | Fetch a specific player by ID   | Public |
| POST   | `/players`             | Create a new player             | Admin  |
| PATCH  | `/players/:id`         | Update player information       | Admin  |
| DELETE | `/players/:id`         | Delete a player                 | Admin  |
| POST   | `/players/create-bulk` | Create multiple players in bulk | Admin  |

---

<a id="competitions-endpoints"></a>

### 🏆 Competitions Endpoints

| Method | Endpoint                                     | Description                          | Access |
| ------ | -------------------------------------------- | ------------------------------------ | ------ |
| GET    | `/competitions`                              | Fetch all competitions               | Public |
| GET    | `/competitions/:id`                          | Fetch a specific competition by ID   | Public |
| POST   | `/competitions`                              | Create a new competition             | Admin  |
| PATCH  | `/competitions/:id`                          | Update a competition                 | Admin  |
| DELETE | `/competitions/:id`                          | Delete a competition                 | Admin  |
| POST   | `/competitions/create-bulk`                  | Create multiple competitions in bulk | Admin  |
| POST   | `/competitions/:competitionId/clubs/:clubId` | Add a club to a competition          | Admin  |
| DELETE | `/competitions/:competitionId/clubs/:clubId` | Remove a club from a competition     | Admin  |

---

<a id="countries-endpoints"></a>

### 🌍 Countries Endpoints

| Method | Endpoint                 | Description                       | Access |
| ------ | ------------------------ | --------------------------------- | ------ |
| GET    | `/countries`             | Fetch all countries               | Public |
| GET    | `/countries/:id`         | Fetch a specific country by ID    | Public |
| POST   | `/countries`             | Create a new country              | Admin  |
| PATCH  | `/countries/:id`         | Update a country                  | Admin  |
| DELETE | `/countries/:id`         | Delete a country                  | Admin  |
| POST   | `/countries/create-bulk` | Create multiple countries in bulk | Admin  |

---

<a id="technologies-used"></a>

## 🛠️ Technologies Used

| Layer                | Technology                                                |
| -------------------- | --------------------------------------------------------- |
| **Frontend**         | React, TypeScript, Tailwind CSS, Vite                     |
| **Backend**          | NestJS                                                    |
| **Database**         | PostgreSQL (TypeORM)                                      |
| **Authentication**   | JWT with Role-Based Access Control (RBAC)                 |
| **Documentation**    | Swagger (OpenAPI)                                         |
| **Containerization** | Docker                                                    |
| **Deployment**       | Configurable for Render, Netlify, or Docker-based servers |

---

<a id="about"></a>

## 💡 About

**Football API Manager** is a full-stack application designed to provide structured, secure, and easily accessible football data.

It offers:

- A **modern frontend** for management and visualization.
- A **scalable backend** exposing a RESTful API.
- A **unified environment** for developers, analysts, and admins to manage football data with precision and flexibility.

> ⚽ Built for developers and admins who want a powerful, unified platform for managing football data — securely and efficiently.
