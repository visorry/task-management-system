
# Task Management System API

![Node.js](https://img.shields.io/badge/Node.js-v14.17.1-green)
![Express.js](https://img.shields.io/badge/Express.js-v4.17.1-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-v4.4.6-green)

A RESTful API for managing tasks, built with Node.js, Express.js, and MongoDB. This API allows users to perform CRUD operations (Create, Read, Update, Delete) on tasks, with authentication using JWT (JSON Web Tokens).

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)
- [Usage](#usage)
  - [Running the Server](#running-the-server)
  - [API Documentation](#api-documentation)
  - [Postman Collection](#postman-collection)
- [Testing](#testing)

## Features

- **User Authentication**: Register and login with JWT authentication.
- **Task Management**: Perform CRUD operations on tasks (Create, Read, Update, Delete).
- **Validation**: Implement validation for incoming data.
- **Error Handling**: Handle errors gracefully with appropriate HTTP status codes.
- **Security**: Secure API endpoints with JWT authentication.
- **Documentation**: API endpoints documented using Swagger.

## Technologies Used

- **Node.js**: Server-side JavaScript runtime.
- **Express.js**: Web application framework for Node.js.
- **MongoDB**: NoSQL database for storing tasks.
- **JWT**: JSON Web Tokens for authentication.
- **Swagger**: OpenAPI documentation for API endpoints.
- **Jest**: Testing framework for unit tests.
- **Postman**: API testing and documentation tool.

## Getting Started

### Prerequisites

- Node.js - [Install Node.js](https://nodejs.org/)
- MongoDB - [Install MongoDB](https://docs.mongodb.com/manual/installation/)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/visorry/task-management-system.git
   cd task-management-system
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

### Configuration

1. Set up environment variables:
   
   Create a `.env` file in the root directory with corresponding variables:

   ```plaintext
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/task-management
   JWT_SECRET=your_jwt_secret
   ```

   Adjust `MONGODB_URI` and `JWT_SECRET` values as per your configuration.

## Usage

### Running the Server

Start the Node.js server:

```bash
npm start
```

The server will start on `http://localhost:3000` (or the port specified in your `.env` file).

### API Documentation

Explore API documentation using Swagger UI:

- Open a web browser and go to `http://localhost:3000/api-docs` to view API endpoints and interact with them.

## Deployment

For a live example, visit https://task-management-system-fs9c.onrender.com/api-docs

### Postman Collection

Use Postman to interact with API endpoints. 

#### Example Test Cases:

1. **Register User**
   - **Endpoint:** `POST /auth/register`
   - **Body:**
     ```json
     {
       "username": "testuser",
       "password": "testpassword"
     }
     ```
   - **Expected Response:** HTTP 201 Created

2. **Login User**
   - **Endpoint:** `POST /auth/login`
   - **Body:**
     ```json
     {
       "username": "testuser",
       "password": "testpassword"
     }
     ```
   - **Expected Response:** HTTP 200 OK with JWT token

3. **Create Task**
   - **Endpoint:** `POST /api/tasks`
   - **Headers:** `Authorization: Bearer <JWT token>`
   - **Body:**
     ```json
     {
       "title": "Sample Task",
       "description": "Description of the task",
       "dueDate": "2024-12-31",
       "priority": "High"
     }
     ```
   - **Expected Response:** HTTP 201 Created

4. **Get All Tasks**
   - **Endpoint:** `GET /api/tasks`
   - **Headers:** `Authorization: Bearer <JWT token>`
   - **Expected Response:** HTTP 200 OK with list of tasks

5. **Update Task**
   - **Endpoint:** `PUT /api/tasks/:id`
   - **Headers:** `Authorization: Bearer <JWT token>`
   - **Body:**
     ```json
     {
       "title": "Updated Task Title",
       "description": "Updated task description"
     }
     ```
   - **Expected Response:** HTTP 200 OK with updated task details

6. **Delete Task**
   - **Endpoint:** `DELETE /api/tasks/:id`
   - **Headers:** `Authorization: Bearer <JWT token>`
   - **Expected Response:** HTTP 204 No Content

## Testing

Run tests using Jest:

```bash
npm test
```

Unit tests verify CRUD operations, error handling, and authentication.
