# 📋 Trello Board

A **Trello-inspired project management REST API** built with Node.js, Express, and MongoDB. It supports user authentication, organization management, kanban boards, and issue tracking — with role-based access control (Admin vs Member).

---

## 🚀 Features

- 🔐 **JWT Authentication** — Secure signup & signin with JSON Web Tokens
- 🏢 **Organizations** — Create organizations, manage members with role-based permissions
- 📋 **Boards** — Create and manage Kanban-style boards within organizations
- 🐛 **Issues** — Add, update, and remove issues on boards with status tracking (`todo`, `in-progress`, `done`)
- 🛡️ **Middleware-driven Authorization** — Fine-grained access control (Admin-only vs Member-or-Admin routes)
- 🌐 **CORS Enabled** — Ready for frontend integration
- 📝 **Request Logging** — HTTP request logging via Morgan

---

## 🗂️ Project Structure

```
trello-board/
├── server.js                   # Entry point — starts server & connects to DB
├── package.json
├── .env                        # Environment variables (not committed)
└── src/
    ├── app.js                  # Express app setup, middleware & routing
    ├── config/                 # App configuration
    ├── routers/
    │   ├── auth.router.js      # All API routes under /api/auth
    │   └── frontend.router.js  # Frontend serving routes
    ├── controllers/
    │   ├── signup.controller.js
    │   ├── signin.controller.js
    │   ├── organization.controller.js
    │   ├── organizationInfo.controller.js
    │   ├── addMemberToOrganization.js
    │   ├── removeMember.js
    │   ├── createBoard.js
    │   ├── boards.controller.js
    │   ├── addIssue.controller.js
    │   ├── getIssues.controller.js
    │   ├── updateIssue.controller.js
    │   ├── removeIssue.controller.js
    │   └── index.controller.js # Aggregates all controllers
    ├── middleWares/
    │   ├── verifyToken.js       # JWT verification
    │   ├── verifyUserId.js      # Validates requesting user exists
    │   ├── verifyOrgId.js       # Validates organization exists
    │   ├── verifyMemberUserId.js# Validates target member user
    │   ├── verifyAdmin.js       # Restricts route to org admins
    │   ├── memberOrAdmin.js     # Allows members or admins
    │   ├── verifyBoardId.js     # Validates board exists in org
    │   ├── findIssue.js         # Resolves issue from board
    │   └── index.middleware.js  # Aggregates all middlewares
    └── db/
        ├── connectDB.js         # MongoDB connection logic
        └── models/
            ├── user.model.js
            ├── organization.model.js
            ├── board.model.js
            └── issue.model.js
```

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **Node.js** | JavaScript runtime |
| **Express.js v5** | Web framework |
| **MongoDB** | NoSQL database |
| **Mongoose** | MongoDB ODM |
| **JSON Web Token (JWT)** | Authentication |
| **Morgan** | HTTP request logger |
| **CORS** | Cross-Origin Resource Sharing |
| **dotenv** | Environment variable management |
| **Nodemon** | Dev server auto-restart |

---

## ⚙️ Installation & Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or above recommended)
- [MongoDB](https://www.mongodb.com/) (local or Atlas cloud instance)

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd trello-board
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the root directory with the following:

```env
MONGO_URI=mongodb://localhost:27017/trello-board
JWT_SECRET=your_super_secret_jwt_key
PORT=3000
```

### 4. Start the development server
```bash
npm run dev
```

The server will start at **http://localhost:3000**

---

## 📡 API Reference

All authenticated routes require a **Bearer token** in the `Authorization` header:
```
Authorization: Bearer <your_jwt_token>
```

### 🔑 Authentication

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/auth/signup` | ❌ | Register a new user |
| `POST` | `/api/auth/signin` | ❌ | Login and receive JWT token |

#### Signup — `POST /api/auth/signup`
```json
{
  "userName": "johndoe",
  "password": "yourpassword"
}
```

#### Signin — `POST /api/auth/signin`
```json
{
  "userName": "johndoe",
  "password": "yourpassword"
}
```

---

### 🏢 Organizations

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| `POST` | `/api/auth/org` | ✅ | Any | Create an organization |
| `GET`  | `/api/auth/org-info` | ✅ | Any | Get organization details |
| `POST` | `/api/auth/add-member-to-organization` | ✅ | Admin/Member | Add a member to org |
| `POST` | `/api/auth/remove-member` | ✅ | Admin | Remove a member from org |

---

### 📋 Boards

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| `POST` | `/api/auth/board` | ✅ | Admin | Create a new board |
| `GET`  | `/api/auth/boards` | ✅ | Member/Admin | Get all boards in org |

---

### 🐛 Issues

| Method   | Endpoint | Auth | Role | Description |
|----------|----------|------|------|-------------|
| `POST`   | `/api/auth/issue` | ✅ | Admin | Add an issue to a board |
| `GET`    | `/api/auth/issues` | ✅ | Member/Admin | Get all issues on a board |
| `PATCH`  | `/api/auth/issue` | ✅ | Member/Admin | Update an issue's status |
| `DELETE` | `/api/auth/issue` | ✅ | Admin | Remove an issue from a board |

#### Issue Status Values
```
"todo" | "in-progress" | "done"
```

---

## 🗃️ Data Models

### User
```js
{
  userName: String,   // required, unique, lowercase
  password: String    // required (hashed)
}
```

### Organization
```js
{
  orgTitle:    String,      // required, unique, lowercase
  description: String,      // required
  admin:       ObjectId,    // ref: users
  members:     [ObjectId],  // ref: users
  boards:      [ObjectId]   // ref: boards
}
```

### Board
```js
{
  title:  String,     // required, unique, lowercase
  orgId:  ObjectId,   // ref: organizations
  issues: [ObjectId]  // ref: issues
}
```

### Issue
```js
{
  title:   String,    // required, lowercase
  boardId: ObjectId,  // ref: boards
  status:  String     // enum: "todo" | "in-progress" | "done", default: "todo"
}
```

---

## 🔒 Role-Based Access Control

| Action | Admin | Member |
|--------|-------|--------|
| Create organization | ✅ | ✅ |
| Add member to org | ✅ | ✅ |
| Remove member from org | ✅ | ❌ |
| Create board | ✅ | ❌ |
| View boards | ✅ | ✅ |
| Add issue | ✅ | ❌ |
| View issues | ✅ | ✅ |
| Update issue status | ✅ | ✅ |
| Delete issue | ✅ | ❌ |

---

## 📜 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with Nodemon (auto-restart on changes) |

---

## 📄 License

This project is licensed under the **ISC License**.

---

> Built as part of the **Web Development Bootcamp — Week 10** 🎓
