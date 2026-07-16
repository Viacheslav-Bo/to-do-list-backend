# To-Do List Backend

A robust and production-ready RESTful API for a To-Do List application. Built with Node.js, Express, TypeScript, and MongoDB. The application is containerized using Docker for seamless deployment and local development.

## Tech Stack

- **Runtime & Language:** Node.js, TypeScript
- **Framework:** Express
- **Database:** MongoDB (with Mongoose ODM)
- **Validation:** Zod
- **Security & Auth:** JWT (JSON Web Tokens), bcryptjs, CORS
- **Containerization:** Docker, Docker Compose

---

## Getting Started

You can run this project locally either using **Docker Compose** (recommended, setup in 1 click) or **manually**.

### Option 1: Running with Docker Compose (Recommended 🚀)

You don't need to have Node.js or MongoDB installed on your machine. Everything, including a local database, runs in isolated containers.

1. Make sure you have **Docker Desktop** installed and running.
2. Clone the repository and navigate to the project root.
3. Run the following command:
   ```bash
   docker-compose up --build
   ```
4. The API will be up and running at `http://localhost:3000`.

_Note: Data persists in a Docker volume, so your created tasks/users won't be lost when you stop the containers._

---

### Option 2: Manual Local Setup (Without Docker - Plan B)

If you don't have Docker installed or prefer running the services on your host machine:

1. **Clone the repository and install dependencies:**

   ```bash
   npm install
   ```

2. **Configure Environment Variables:**
   Create a `.env` file in the root directory based on the template:

   ```bash
   cp .env.example .env
   ```

   Open the `.env` file and fill in your MongoDB connection string and other secrets:

   ```text
   PORT=3000
   MONGO_URL=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   NODE_ENV=development
   FRONTEND_DOMAIN=http://localhost:3001
   ```

3. **Run the Server:**
   - **Development mode (with hot-reload):**
     ```bash
     npm run dev
     ```
   - **Production build & run:**
     ```bash
     npm run build
     ```
     ```bash
     npm run start
     ```

---
