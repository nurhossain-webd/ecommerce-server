# Express + TypeScript Backend Setup Guide

This README explains how to create a basic Express.js backend using TypeScript from scratch.

The goal of this stage is only to:

- Create a Node.js project
- Install Express
- Configure TypeScript
- Create `app.ts`
- Create `server.ts`
- Run the backend server
- Configure Git
- Push the project to GitHub

PostgreSQL, Prisma, JWT, bcrypt, and other features will be added later.

---

## 1. Create the Project Folder

Open your terminal and go to the location where you want to create the backend project.

Create a new folder:

```bash
mkdir ecommerce-server
```

Enter the folder:

```bash
cd ecommerce-server
```

---

## 2. Initialize Node.js

Run:

```bash
npm init -y
```

This creates:

```text
package.json
```

The `package.json` file stores information about the project, installed packages, and scripts.

---

## 3. Install Express

Run:

```bash
npm install express
```

Express is the framework we use to create our backend server and REST APIs.

---

## 4. Install TypeScript Development Packages

Run:

```bash
npm install -D typescript tsx @types/node @types/express
```

### What these packages do

- `typescript` → allows us to write TypeScript
- `tsx` → runs TypeScript files directly during development
- `@types/node` → gives TypeScript type information for Node.js
- `@types/express` → gives TypeScript type information for Express

`-D` means these packages are development dependencies.

---

## 5. Create TypeScript Configuration

Run:

```bash
npx tsc --init
```

This creates:

```text
tsconfig.json
```

Replace the generated content with:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "rootDir": "./src",
    "outDir": "./dist",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  },
  "include": ["src/**/*"]
}
```

### Important settings

#### `"target": "ES2022"`

Tells TypeScript which JavaScript version the TypeScript code should compile to.

#### `"module": "NodeNext"`

We are building a modern Node.js backend.

`NodeNext` lets TypeScript follow Node.js's modern module system.

That allows us to write:

```ts
import express from "express";
```

instead of older CommonJS syntax:

```js
const express = require("express");
```

#### `"moduleResolution": "NodeNext"`

Tells TypeScript how to find imported packages and files using Node.js module rules.

#### `"rootDir": "./src"`

Our TypeScript source code will live inside the `src` folder.

#### `"outDir": "./dist"`

Compiled JavaScript will later be placed inside the `dist` folder.

#### `"strict": true`

Enables TypeScript's strict type checking.

---

## 6. Create the Source Folder

Create:

```text
src/
```

Inside `src`, create:

```text
app.ts
server.ts
```

The project should now look like:

```text
ecommerce-server/
│
├── node_modules/
│
├── src/
│   ├── app.ts
│   └── server.ts
│
├── package.json
├── package-lock.json
└── tsconfig.json
```

---

# 7. Create `app.ts`

Open:

```text
src/app.ts
```

Write:

```ts
import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Server is running",
  });
});

export default app;
```

## Understanding `app.ts`

First, we need an Express application.

For that we use:

```ts
const app = express();
```

But `express()` comes from the Express package.

So first we have to import Express:

```ts
import express from "express";
```

The flow is:

```text
Need Express
     ↓
import express

Need an Express application
     ↓
express()

Store the application
     ↓
const app = express()
```

---

## Create a Test Route

We want the server to respond when someone sends a GET request to:

```text
/
```

So we write:

```ts
app.get("/", (req, res) => {
```

Here:

- `app` → our Express application
- `.get()` → handles a GET request
- `"/"` → route/path
- `req` → request coming from the client
- `res` → response we send back to the client

We send JSON using:

```ts
res.json({
  success: true,
  message: "Server is running",
});
```

The browser/client receives:

```json
{
  "success": true,
  "message": "Server is running"
}
```

`success` and `message` are property names we chose.

We use these names because they are common in REST APIs and make our API responses consistent.

Finally:

```ts
export default app;
```

exports our Express application so another file can import it.

---

# 8. Create `server.ts`

Open:

```text
src/server.ts
```

Write:

```ts
import app from "./app.js";

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
```

## Understanding `server.ts`

First, we need the Express application created inside `app.ts`.

So we import it:

```ts
import app from "./app.js";
```

Even though our source file is:

```text
app.ts
```

we write:

```ts
"./app.js";
```

because we are using:

```json
"module": "NodeNext"
```

Our TypeScript source:

```text
app.ts
```

will eventually compile into JavaScript:

```text
app.js
```

Node.js ultimately runs the JavaScript output.

With modern Node.js ESM imports, relative imports normally include the `.js` extension.

### CommonJS comparison

Older CommonJS code might use:

```js
const app = require("./app");
```

Modern ES Module / NodeNext code uses:

```ts
import app from "./app.js";
```

---

## Define the Port

We need a port where our backend will listen for requests.

```ts
const PORT = 5000;
```

Then start the server:

```ts
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
```

The flow is:

```text
app.ts
   ↓
creates Express app
   ↓
server.ts imports app
   ↓
app.listen(5000)
   ↓
server starts
```

---

# 9. Add the Development Script

Open:

```text
package.json
```

Find the `"scripts"` section.

Change it to:

```json
"scripts": {
  "dev": "tsx watch src/server.ts"
}
```

### What this means

```text
tsx
 ↓
runs TypeScript

watch
 ↓
watches our files and automatically restarts when code changes

src/server.ts
 ↓
starting file of our backend
```

Now we can start the server using:

```bash
npm run dev
```

---

# 10. Test the Server

Run:

```bash
npm run dev
```

The terminal should display:

```text
Server is running on port 5000
```

Open:

```text
http://localhost:5000
```

The browser should display something similar to:

```json
{
  "success": true,
  "message": "Server is running"
}
```

Our basic Express + TypeScript server is now working.

---

# 11. Create `.gitignore`

Create a file in the project root:

```text
.gitignore
```

Add:

```gitignore
node_modules/
dist/
.env
```

### Why?

#### `node_modules/`

Can be recreated using:

```bash
npm install
```

so we do not upload it to GitHub.

#### `dist/`

Contains generated/compiled files.

#### `.env`

Will later contain private information such as database URLs, JWT secrets, and other credentials.

Never push `.env` to GitHub.

---

# 12. Initialize Git

Run:

```bash
git init
```

Add all project files:

```bash
git add .
```

Create the first commit:

```bash
git commit -m "setup Express server with TypeScript"
```

---

# 13. Connect to GitHub

Create an empty GitHub repository.

For example:

```text
ecommerce-server
```

Do not create another README or `.gitignore` on GitHub if they already exist locally.

GitHub will give commands similar to:

```bash
git branch -M main
git remote add origin YOUR_GITHUB_REPOSITORY_URL
git push -u origin main
```

Replace:

```text
YOUR_GITHUB_REPOSITORY_URL
```

with the URL of your repository.

---

# Current Project Structure

After completing this stage:

```text
ecommerce-server/
│
├── node_modules/
│
├── src/
│   ├── app.ts
│   └── server.ts
│
├── .gitignore
├── package.json
├── package-lock.json
└── tsconfig.json
```

---

# Current Request Flow

When someone opens:

```text
http://localhost:5000/
```

the flow is:

```text
Client / Browser
       ↓
GET /
       ↓
Express app
       ↓
app.get("/")
       ↓
res.json(...)
       ↓
JSON response returned to client
```

---

# Commands Summary

Create project:

```bash
mkdir ecommerce-server
cd ecommerce-server
npm init -y
```

Install packages:

```bash
npm install express
npm install -D typescript tsx @types/node @types/express
```

Initialize TypeScript:

```bash
npx tsc --init
```

Run server:

```bash
npm run dev
```

Git:

```bash
git init
git add .
git commit -m "setup Express server with TypeScript"
```

Then connect the project to GitHub and push.

---

# Next Stage

The next stage of the project will add:

```text
PostgreSQL
   ↓
Prisma ORM
   ↓
Database connection
   ↓
Prisma models
   ↓
Migrations
```

These steps should be added to this README as the project grows.

---

# Stage 2 — PostgreSQL + Prisma Setup

This section continues from the basic Express + TypeScript server setup.

The goal of this stage is to:

- Install Prisma
- Initialize Prisma
- Create a Neon PostgreSQL database
- Connect Prisma to PostgreSQL
- Fix the Node.js `process` TypeScript error
- Test the database connection
- Create the first Prisma model
- Add the first enum
- Use UUID as the primary key
- Create and apply the first migration
- Inspect the database with Prisma Studio

---

## 14. Install Prisma

Run:

```bash
npm install prisma @prisma/client
```

### What are these packages?

`prisma`

Provides Prisma CLI commands such as:

```bash
npx prisma init
npx prisma migrate dev
npx prisma studio
npx prisma db pull
```

`@prisma/client`

Will allow our TypeScript backend code to communicate with the database through Prisma.

---

## 15. Initialize Prisma

Run:

```bash
npx prisma init
```

Prisma creates files including:

```text
prisma/
└── schema.prisma

prisma.config.ts
.env
```

The exact generated setup can vary depending on the Prisma version.

---

# 16. Understand `schema.prisma`

Our Prisma schema contains a datasource similar to:

```prisma
datasource db {
  provider = "postgresql"
}
```

This tells Prisma:

```text
Our database type
       ↓
PostgreSQL
```

The Prisma schema is where we will define our database models, fields, relationships, enums, indexes, and other database rules.

---

# 17. Create a Neon PostgreSQL Database

For this project we use Neon to host PostgreSQL.

Create a new Neon project.

Example project name:

```text
ecommerce-server
```

Neon provides a PostgreSQL connection string that looks roughly like:

```text
postgresql://USER:PASSWORD@HOST/DATABASE?sslmode=require
```

Never share the real connection string because it contains database credentials.

---

# 18. Add the Database URL to `.env`

Inside:

```text
.env
```

add:

```env
DATABASE_URL="YOUR_NEON_DATABASE_CONNECTION_STRING"
```

Do not upload `.env` to GitHub.

Our `.gitignore` already contains:

```gitignore
.env
```

---

# 19. Configure `prisma.config.ts`

Our Prisma configuration is:

```ts
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env["DATABASE_URL"],
  },
});
```

### Understanding the important parts

First:

```ts
import "dotenv/config";
```

loads environment variables from `.env`.

Then:

```ts
schema: "prisma/schema.prisma";
```

tells Prisma where our Prisma schema is.

Then:

```ts
migrations: {
  path: "prisma/migrations",
}
```

tells Prisma where migration files should be stored.

Finally:

```ts
datasource: {
  url: process.env["DATABASE_URL"],
}
```

reads:

```text
DATABASE_URL
```

from `.env`.

The connection flow is:

```text
.env
 ↓
DATABASE_URL
 ↓
prisma.config.ts
 ↓
Prisma
 ↓
Neon PostgreSQL
```

---

# 20. Fix: `Cannot find name 'process'`

We encountered this TypeScript error inside `prisma.config.ts`:

```text
Cannot find name 'process'.
Do you need to install type definitions for node?
```

`process` is a Node.js global.

TypeScript needs Node.js type definitions to understand it.

Make sure Node types are installed:

```bash
npm install -D @types/node
```

Then add this inside `compilerOptions` in `tsconfig.json`:

```json
"types": ["node"]
```

However, the error still appeared because our original TypeScript config only included:

```json
"include": ["src/**/*"]
```

Our `prisma.config.ts` file is outside `src`.

So we changed it to:

```json
"include": ["src/**/*", "prisma.config.ts"]
```

Our current `tsconfig.json` is:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "rootDir": "./src",
    "outDir": "./dist",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "types": ["node"]
  },
  "include": ["src/**/*", "prisma.config.ts"]
}
```

### Why did this fix the problem?

Originally TypeScript was mainly including:

```text
src/
```

But:

```text
prisma.config.ts
```

exists in the project root.

Adding it to `include` makes TypeScript apply our configuration, including Node.js types, to that file as well.

If VS Code still displays the error after changing the configuration:

```text
Cmd + Shift + P
```

then choose:

```text
TypeScript: Restart TS Server
```

---

# 21. Test the Prisma Database Connection

We tested the connection using:

```bash
npx prisma db pull
```

Prisma successfully connected to:

```text
PostgreSQL → Neon
```

but returned:

```text
P4001 The introspected database was empty
```

This was expected.

### Why?

`prisma db pull` reads tables that already exist in a database and creates Prisma models from them.

Our database was completely new and had no tables.

So:

```text
Prisma connected successfully
        ↓
Looked for existing tables
        ↓
Found none
        ↓
P4001
```

This did NOT mean our database connection failed.

It confirmed that Prisma could reach the PostgreSQL database.

For our project we are using this direction:

```text
Create Prisma models
        ↓
Create migration
        ↓
Prisma creates PostgreSQL tables
```

rather than:

```text
Existing PostgreSQL tables
        ↓
prisma db pull
        ↓
Generate Prisma models
```

---

# 22. Create the First Enum

Our assignment requires at least two enums.

The first one is:

```prisma
enum UserRole {
  USER
  ADMIN
}
```

An enum is useful when a field should accept only a fixed set of values.

For example:

```text
UserRole
├── USER
└── ADMIN
```

Instead of allowing any random string for a role, Prisma restricts it to one of the enum values.

Other common enum examples are:

```prisma
enum OrderStatus {
  PENDING
  CONFIRMED
  SHIPPED
  DELIVERED
  CANCELLED
}
```

and:

```prisma
enum PaymentStatus {
  PENDING
  PAID
  FAILED
  REFUNDED
}
```

Use an enum when the rule is roughly:

```text
"This field can only be one of these specific values."
```

Do not normally use an enum for data that changes frequently, such as product categories. Categories are better represented by a database table.

---

# 23. Create the First Prisma Model

Our first model is `User`.

```prisma
model User {
  id        String   @id @default(uuid()) @db.Uuid
  name      String
  email     String   @unique
  password  String
  role      UserRole @default(USER)
  isDeleted Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("users")
}
```

---

# 24. Understanding the User Model

## `id`

```prisma
id String @id @default(uuid()) @db.Uuid
```

`id`

is the field name.

`String`

is how Prisma represents the value in our application.

`@id`

makes it the primary key.

`@default(uuid())`

automatically generates a UUID when a user is created.

Example UUID:

```text
550e8400-e29b-41d4-a716-446655440000
```

`@db.Uuid`

tells Prisma to store it using PostgreSQL's native UUID database type.

We chose UUID instead of CUID for this PostgreSQL project.

Later, foreign keys that reference a UUID ID should also use the matching PostgreSQL type, for example:

```prisma
userId String @db.Uuid
```

---

## `name`

```prisma
name String
```

Stores the user's name.

---

## `email`

```prisma
email String @unique
```

Stores the user's email.

`@unique` means PostgreSQL/Prisma will not allow two users with the same email.

---

## `password`

```prisma
password String
```

Stores the user's password.

Important:

We will NOT store the plain password.

Later, during authentication:

```text
User password
     ↓
bcrypt
     ↓
hashed password
     ↓
database
```

---

## `role`

```prisma
role UserRole @default(USER)
```

The field uses our `UserRole` enum.

If no role is provided, Prisma uses:

```text
USER
```

as the default.

---

## `isDeleted`

```prisma
isDeleted Boolean @default(false)
```

Supports soft deletion.

Instead of permanently deleting a user row, later we can change:

```text
isDeleted = false
```

to:

```text
isDeleted = true
```

---

## `createdAt`

```prisma
createdAt DateTime @default(now())
```

Automatically stores when the record was created.

---

## `updatedAt`

```prisma
updatedAt DateTime @updatedAt
```

Prisma automatically updates this timestamp when the record is updated through Prisma.

---

## `@@map("users")`

```prisma
@@map("users")
```

Our Prisma model is called:

```text
User
```

but the actual PostgreSQL table is called:

```text
users
```

This also satisfies the assignment requirement to demonstrate table mapping with `@@map()`.

---

# 25. Create the First Migration

After defining the User model, run:

```bash
npx prisma migrate dev --name create_user_table
```

The migration succeeded and created a folder similar to:

```text
prisma/
└── migrations/
    └── 20260808181129_create_user_table/
        └── migration.sql
```

The timestamp in the folder name will be different for every project.

---

# 26. What Does `prisma migrate dev` Do?

Before migration:

```text
schema.prisma
     ↓
User model exists in our Prisma schema

PostgreSQL
     ↓
No users table
```

We run:

```bash
npx prisma migrate dev --name create_user_table
```

Then:

```text
schema.prisma
      ↓
Prisma detects database changes
      ↓
creates migration.sql
      ↓
runs SQL against PostgreSQL
      ↓
PostgreSQL creates the table
```

After the migration Prisma reported:

```text
Your database is now in sync with your schema.
```

---

# 27. Migration SQL

Prisma created:

```text
migration.sql
```

This file contains actual SQL generated from our Prisma schema.

This is important because Prisma is an ORM, but PostgreSQL still works using SQL underneath.

Conceptually:

```text
Prisma model
     ↓
Prisma migration
     ↓
SQL
     ↓
PostgreSQL
```

Do not randomly edit old migration files after they have already been applied.

---

# 28. Prisma Studio

To visually inspect our database, run:

```bash
npx prisma studio
```

Prisma Studio provides a browser interface where we can inspect database records and models.

At this point we can see our `User` model/table.

We did not manually add users yet because user creation will later happen through our REST API.

---

# Current Prisma Flow

Our project now has:

```text
schema.prisma
      ↓
describes database structure

prisma migrate dev
      ↓
creates migration SQL

migration.sql
      ↓
changes PostgreSQL

Neon
      ↓
hosts PostgreSQL database
```

---

# Updated Project Structure

At this checkpoint, the important structure is approximately:

```text
ecommerce-server/
│
├── prisma/
│   ├── migrations/
│   │   └── 20260808181129_create_user_table/
│   │       └── migration.sql
│   │
│   └── schema.prisma
│
├── src/
│   ├── app.ts
│   └── server.ts
│
├── .env
├── .gitignore
├── package.json
├── package-lock.json
├── prisma.config.ts
└── tsconfig.json
```

Remember:

```text
.env
```

exists locally but must NOT be pushed to GitHub.

---

# Useful Prisma Commands Learned So Far

Initialize Prisma:

```bash
npx prisma init
```

Read an existing database:

```bash
npx prisma db pull
```

Create/apply a development migration:

```bash
npx prisma migrate dev --name migration_name
```

Open Prisma Studio:

```bash
npx prisma studio
```

---

# Git Checkpoint 2

At this point we completed:

```text
Prisma installation
        ↓
Neon PostgreSQL database
        ↓
Database connection
        ↓
UserRole enum
        ↓
User model
        ↓
UUID primary key
        ↓
First migration
        ↓
Prisma Studio
```

Before committing, make sure `.env` is ignored.

Check:

```bash
git status
```

Then:

```bash
git add .
git commit -m "setup Prisma with PostgreSQL and add User model"
git push
```

---

# Next Stage

After this commit, the next part will be connecting Prisma Client to our Express application.

We will create:

```text
src/
└── lib/
    └── prisma.ts
```

Then our services will eventually use that Prisma client to communicate with PostgreSQL.

---

# Stage 3 — Prisma Client + User Service + User Routes

This stage adds Prisma Client to the Express backend and creates the first User API routes.

## 29. Generate Prisma Client

Run:

```bash
npx prisma generate
```

Our Prisma schema uses the newer client generator, similar to:

```prisma
generator client {
  provider = "prisma-client"
  output   = "../src/generated/prisma"
}
```

So the generated client is placed inside:

```text
src/generated/prisma/
```

## 30. Prisma Client Import Issue

This did not work in our project:

```ts
import { PrismaClient } from "@prisma/client";
```

Error:

```text
Module '"@prisma/client"' has no exported member 'PrismaClient'.
```

Because we are using the newer `prisma-client` generator, we import Prisma Client from the generated output folder instead:

```ts
import { PrismaClient } from "../generated/prisma/client.js";
```

## 31. Prisma 7 Requires a PostgreSQL Adapter

This:

```ts
const prisma = new PrismaClient();
```

gave:

```text
Expected 1 arguments, but got 0.
```

For our Prisma 7 setup, install the PostgreSQL adapter:

```bash
npm install @prisma/adapter-pg pg
```

## 32. Create `src/lib/prisma.ts`

Create:

```text
src/lib/prisma.ts
```

Code:

```ts
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.js";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});

export default prisma;
```

### How this works

`import "dotenv/config";` loads `.env`, so Node can access:

```ts
process.env.DATABASE_URL;
```

`PrismaPg` is the PostgreSQL adapter.

Then:

```ts
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
```

creates a PostgreSQL connection using our Neon database URL.

The `!` tells TypeScript that we expect `DATABASE_URL` to exist.

Then:

```ts
const prisma = new PrismaClient({
  adapter,
});
```

creates Prisma Client using that PostgreSQL adapter.

Flow:

```text
Backend
  ↓
Prisma Client
  ↓
PostgreSQL Adapter
  ↓
DATABASE_URL
  ↓
Neon PostgreSQL
```

Finally:

```ts
export default prisma;
```

lets our services reuse the same Prisma client.

## 33. Why We Use a Services Folder

We created:

```text
src/services/user/user.service.ts
```

Services contain business and database logic.

General flow:

```text
Frontend
   ↓
Route
   ↓
Service
   ↓
Prisma
   ↓
PostgreSQL
```

Real-life example:

```text
Customer clicks "Place Order"
        ↓
POST /api/orders
        ↓
Order route
        ↓
Order service
        ↓
Check stock / calculate total / create order
        ↓
Prisma
        ↓
PostgreSQL
```

Simple analogy:

```text
Frontend = Customer
Route    = Waiter
Service  = Kitchen
Database = Storage
```

## 34. Current `user.service.ts`

```ts
import prisma from "../../lib/prisma.js";

const getAllUsers = async () => {
  const users = await prisma.user.findMany();

  return users;
};

const createUser = async (data: {
  name: string;
  email: string;
  password: string;
}) => {
  const user = await prisma.user.create({
    data: data,
  });

  return user;
};

const getUserById = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: id,
    },
  });

  return user;
};

export const userService = {
  getAllUsers,
  createUser,
  getUserById,
};
```

## 35. `getAllUsers()`

```ts
const getAllUsers = async () => {
  const users = await prisma.user.findMany();

  return users;
};
```

`prisma.user.findMany()` means:

```text
Prisma
  ↓
User model
  ↓
Find all rows
  ↓
PostgreSQL users table
```

## 36. `createUser()`

```ts
const createUser = async (data: {
  name: string;
  email: string;
  password: string;
}) => {
  const user = await prisma.user.create({
    data: data,
  });

  return user;
};
```

The function receives `name`, `email`, and `password`.

Then Prisma inserts that data into PostgreSQL.

Important: the password is still plain text only for learning CRUD. Before real authentication we will hash it with bcrypt.

## 37. `getUserById()`

```ts
const getUserById = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: id,
    },
  });

  return user;
};
```

This means:

```text
Find the user WHERE database id equals the id we received.
```

`where` is a Prisma property and should not be renamed.

This can also be shortened to:

```ts
where: {
  id,
}
```

## 38. Create the User Router

Current `src/routes/user.route.ts`:

```ts
import { Router } from "express";
import { userService } from "../services/user/user.service.js";

const router = Router();

router.get("/", async (req, res) => {
  const users = await userService.getAllUsers();

  res.json({
    success: true,
    message: "Users retrieved successfully",
    data: users,
  });
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;

  const user = await userService.getUserById(id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  res.json({
    success: true,
    message: "User retrieved successfully",
    data: user,
  });
});

router.post("/", async (req, res) => {
  const data = req.body;

  const user = await userService.createUser(data);

  res.json({
    success: true,
    message: "User created successfully",
    data: user,
  });
});

export default router;
```

## 39. Why Use `Router()`?

We could put all endpoints directly in `app.ts`, but that would make it very large.

Instead we organize them:

```text
routes/
├── user.route.ts
├── product.route.ts
├── category.route.ts
└── order.route.ts
```

## 40. Connect User Router to `app.ts`

Import:

```ts
import userRouter from "./routes/user.route.js";
```

Then:

```ts
app.use("/api/users", userRouter);
```

This gives the router a base URL.

So:

```ts
router.get("/");
```

becomes:

```text
GET /api/users
```

`router.post("/")` becomes:

```text
POST /api/users
```

and:

```ts
router.get("/:id");
```

becomes:

```text
GET /api/users/:id
```

## 41. Enable JSON Request Bodies

Add to `app.ts`:

```ts
app.use(express.json());
```

This lets Express read JSON using:

```ts
req.body;
```

Flow:

```text
Frontend sends JSON
       ↓
express.json()
       ↓
req.body
       ↓
Route
```

## 42. Current Important `app.ts`

```ts
import express from "express";
import userRouter from "./routes/user.route.js";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Server is running",
  });
});

app.use("/api/users", userRouter);

export default app;
```

## 43. Available User Endpoints

```text
GET  /api/users       → Get all users
GET  /api/users/:id   → Get one user by ID
POST /api/users       → Create a user
```

## 44. Create a User with Terminal

Make sure the server is running:

```bash
npm run dev
```

Then:

```bash
curl -X POST http://localhost:5001/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Riyad",
    "email": "riyad@example.com",
    "password": "123456"
  }'
```

`-X POST` sends a POST request.

`Content-Type: application/json` tells Express that the request body is JSON.

`-d` contains the body data.

## 45. Check Created Users

Run:

```bash
curl http://localhost:5001/api/users
```

Or inspect the database using:

```bash
npx prisma studio
```

`curl` tests the API.

Prisma Studio checks the database directly.

## 46. Test GET User By ID

First:

```bash
curl http://localhost:5001/api/users
```

Copy one user's UUID.

Then:

```bash
curl http://localhost:5001/api/users/YOUR_USER_ID
```

## 47. 404 User Not Found

If Prisma returns no user:

```ts
if (!user) {
  return res.status(404).json({
    success: false,
    message: "User not found",
  });
}
```

HTTP `404` means `Not Found`.

## 48. Port 5000 Returned HTTP 403

We encountered:

```text
HTTP ERROR 403
```

on port `5000`.

Another process was likely using that port, so we changed:

```ts
const PORT = 5000;
```

to:

```ts
const PORT = 5001;
```

Then restarted the server.

## 49. `Cannot GET /api/users`

We then encountered:

```text
Cannot GET /api/users
```

This means Express was running, but the route was not registered correctly.

The required connection is:

```ts
app.use("/api/users", userRouter);
```

plus:

```ts
router.get("/", ...)
```

Together:

```text
/api/users + /
       ↓
GET /api/users
```

After fixing/checking the route and restarting the server, it worked.

## 50. Invalid UUID Error

We tested:

```text
http://localhost:5001/api/users/123
```

and Prisma returned:

```text
invalid input syntax for type uuid: "123"
```

Our User ID is:

```prisma
id String @id @default(uuid()) @db.Uuid
```

So PostgreSQL expects a valid UUID.

A valid UUID looks like:

```text
550e8400-e29b-41d4-a716-446655440000
```

Later we will add validation so invalid IDs return a clean API error instead of a Prisma error page.

## 51. Current Request Flow

Get all users:

```text
GET /api/users
      ↓
app.use("/api/users", userRouter)
      ↓
router.get("/")
      ↓
userService.getAllUsers()
      ↓
prisma.user.findMany()
      ↓
PostgreSQL
      ↓
res.json(...)
```

Create user:

```text
POST /api/users
      ↓
express.json()
      ↓
req.body
      ↓
router.post("/")
      ↓
userService.createUser(data)
      ↓
prisma.user.create()
      ↓
PostgreSQL
```

## 52. Updated Project Structure

```text
ecommerce-server/
│
├── prisma/
│   ├── migrations/
│   │   └── 20260808181129_create_user_table/
│   │       └── migration.sql
│   └── schema.prisma
│
├── src/
│   ├── generated/
│   │   └── prisma/
│   │       └── ...
│   ├── lib/
│   │   └── prisma.ts
│   ├── routes/
│   │   └── user.route.ts
│   ├── services/
│   │   └── user/
│   │       └── user.service.ts
│   ├── app.ts
│   └── server.ts
│
├── .env
├── .gitignore
├── package.json
├── package-lock.json
├── prisma.config.ts
├── README.md
└── tsconfig.json
```

Remember: `.env` must not be pushed to GitHub.

## 53. Git Checkpoint 3

Before committing:

```bash
git status
```

Then:

```bash
git add .
git commit -m "add Prisma client and user CRUD routes"
git push
```

# User CRUD --- Update and Soft Delete

## Update User

Added `updateUser()` using `prisma.user.update()`. The user ID
identifies which record to update, while `data` contains optional fields
such as `name` and `email`.

```ts
const updateUser = async (
  id: string,
  data: {
    name?: string;
    email?: string;
  },
) => {
  const user = await prisma.user.update({
    where: { id: id },
    data: data,
  });

  return user;
};
```

Added the route:

```ts
router.patch("/:id", async (req, res) => {
  const id = req.params.id;
  const data = req.body;

  const user = await userService.updateUser(id, data);

  res.json({
    success: true,
    message: "User updated successfully",
    data: user,
  });
});
```

Endpoint:

```text
PATCH /api/users/:id
```

Test:

```bash
curl -X PATCH http://localhost:5001/api/users/YOUR_USER_ID \
  -H "Content-Type: application/json" \
  -d '{"name":"Riyad Updated"}'
```

## Soft Delete User

Instead of permanently deleting a row with `prisma.user.delete()`, the
project uses soft delete by changing `isDeleted` from `false` to `true`.

```ts
const deleteUser = async (id: string) => {
  const user = await prisma.user.update({
    where: { id: id },
    data: {
      isDeleted: true,
    },
  });

  return user;
};
```

Added the route:

```ts
router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  const user = await userService.deleteUser(id);

  res.json({
    success: true,
    message: "User deleted successfully",
    data: user,
  });
});
```

Endpoint:

```text
DELETE /api/users/:id
```

Test:

```bash
curl -X DELETE http://localhost:5001/api/users/YOUR_USER_ID
```

## Hide Soft-Deleted Users

Updated `getAllUsers()` so normal API requests return only active users:

```ts
const getAllUsers = async () => {
  const users = await prisma.user.findMany({
    where: {
      isDeleted: false,
    },
  });

  return users;
};
```

Updated `getUserById()` so a soft-deleted user is not returned:

```ts
const getUserById = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: id,
      isDeleted: false,
    },
  });

  return user;
};
```

## User CRUD Status

```text
POST   /api/users       → Create User
GET    /api/users       → Get All Active Users
GET    /api/users/:id   → Get Active User By ID
PATCH  /api/users/:id   → Update User
DELETE /api/users/:id   → Soft Delete User
```

User CRUD with soft-delete support is now complete.

## Git Checkpoint

```bash
git status
git add .
git commit -m "complete user CRUD with soft delete"
git push
```

# Category CRUD

## Category Model

Added `CategoryStatus` and `Category` to `prisma/schema.prisma`:

```prisma
enum CategoryStatus {
  ACTIVE
  INACTIVE
}

model Category {
  id        String         @id @default(uuid()) @db.Uuid
  name      String         @unique
  status    CategoryStatus @default(ACTIVE)
  isDeleted Boolean        @default(false)
  createdAt DateTime       @default(now())
  updatedAt DateTime       @updatedAt

  @@map("categories")
}
```

After changing the Prisma schema:

```bash
npx prisma migrate dev --name create_category_table
npx prisma generate
```

Remember:

```text
migrate  → updates PostgreSQL
generate → updates Prisma Client
```

## Category Service

Created:

```text
src/services/category/category.service.ts
```

The service supports:

```text
Get all categories
Create category
Get category by ID
Update category
Soft delete category
```

Soft-deleted categories are filtered using:

```ts
where: {
  isDeleted: false,
}
```

For updates, enum values must match Prisma exactly:

```text
ACTIVE
INACTIVE
```

Using `Active` or `Inactive` causes a TypeScript error.

Soft delete uses:

```ts
prisma.category.update({
  where: { id },
  data: {
    isDeleted: true,
  },
});
```

instead of permanently deleting the row.

## Category Router

Created:

```text
src/routes/category.route.ts
```

Connected it in `app.ts`:

```ts
app.use("/api/categories", categoryRouter);
```

Available endpoints:

```text
GET    /api/categories
GET    /api/categories/:id
POST   /api/categories
PATCH  /api/categories/:id
DELETE /api/categories/:id
```

## API Testing

Create category:

```bash
curl -X POST http://localhost:5001/api/categories   -H "Content-Type: application/json"   -d '{"name":"Electronics"}'
```

Get all categories:

```bash
curl http://localhost:5001/api/categories
```

Update category:

```bash
curl -X PATCH http://localhost:5001/api/categories/YOUR_CATEGORY_ID   -H "Content-Type: application/json"   -d '{"name":"Mobile Devices","status":"INACTIVE"}'
```

Soft delete category:

```bash
curl -X DELETE http://localhost:5001/api/categories/YOUR_CATEGORY_ID
```

Category CRUD is now complete.

## Git Checkpoint

After adding this section to the main `README.md`:

```bash
git status
git add .
git commit -m "complete category CRUD"
git push
```

# Product Model, Category Relation, and Product CRUD

## Product Model and Relation

Added `ProductStatus` and the `Product` model. Each product has its own UUID and a `categoryId` foreign key pointing to `Category.id`.

```prisma
categoryId String   @db.Uuid
category   Category @relation(fields: [categoryId], references: [id])
```

Added the opposite side to `Category`:

```prisma
products Product[]
```

Relationship:

```text
Category → has many Products
Product  → belongs to one Category
```

The first migration failed because the opposite `products Product[]` relation was missing from `Category`. After adding it:

```bash
npx prisma migrate dev --name create_product_table
npx prisma generate
```

## Product Service and Router

Created Product service/router with:

```text
GET    /api/products
GET    /api/products/:id
POST   /api/products
PATCH  /api/products/:id
DELETE /api/products/:id
```

Creating a product requires a real category UUID:

```json
{
  "name": "iPhone 17",
  "description": "Latest iPhone",
  "price": 999,
  "stock": 10,
  "categoryId": "CATEGORY_UUID"
}
```

Used the Prisma relation:

```ts
include: {
  category: true,
}
```

so product GET requests can also return the related Category information.

Update supports optional fields such as `name`, `description`, `price`, `stock`, `status`, and `categoryId`.

Soft delete uses `prisma.product.update()` to set:

```ts
isDeleted: true;
```

Normal product queries filter with `isDeleted: false`.

## Testing

```bash
curl http://localhost:5001/api/products
```

```bash
curl -X PATCH http://localhost:5001/api/products/YOUR_PRODUCT_ID \
  -H "Content-Type: application/json" \
  -d '{"price":899,"stock":20}'
```

```bash
curl -X DELETE http://localhost:5001/api/products/YOUR_PRODUCT_ID
```

Product CRUD and the Category → Product relationship are now implemented and tested.

## Git Checkpoint

```bash
git status
git add .
git commit -m "add product CRUD and category relation"
git push
```

# Product Model, Category Relation, and Product CRUD

## Product Model and Relation

Added `ProductStatus` and the `Product` model. Each product has its own UUID and a `categoryId` foreign key pointing to `Category.id`.

```prisma
categoryId String   @db.Uuid
category   Category @relation(fields: [categoryId], references: [id])
```

Added the opposite side to `Category`:

```prisma
products Product[]
```

Relationship:

```text
Category → has many Products
Product  → belongs to one Category
```

The first migration failed because the opposite `products Product[]` relation was missing from `Category`. After adding it:

```bash
npx prisma migrate dev --name create_product_table
npx prisma generate
```

## Product Service and Router

Created Product service/router with:

```text
GET    /api/products
GET    /api/products/:id
POST   /api/products
PATCH  /api/products/:id
DELETE /api/products/:id
```

Creating a product requires a real category UUID:

```json
{
  "name": "iPhone 17",
  "description": "Latest iPhone",
  "price": 999,
  "stock": 10,
  "categoryId": "CATEGORY_UUID"
}
```

Used the Prisma relation:

```ts
include: {
  category: true,
}
```

so product GET requests can also return the related Category information.

Update supports optional fields such as `name`, `description`, `price`, `stock`, `status`, and `categoryId`.

Soft delete uses `prisma.product.update()` to set:

```ts
isDeleted: true;
```

Normal product queries filter with `isDeleted: false`.

## Testing

```bash
curl http://localhost:5001/api/products
```

```bash
curl -X PATCH http://localhost:5001/api/products/YOUR_PRODUCT_ID \
  -H "Content-Type: application/json" \
  -d '{"price":899,"stock":20}'
```

```bash
curl -X DELETE http://localhost:5001/api/products/YOUR_PRODUCT_ID
```

Product CRUD and the Category → Product relationship are now implemented and tested.

## Git Checkpoint

```bash
git status
git add .
git commit -m "add product CRUD and category relation"
git push
```

# Review Model and Review API

## Review Model

Added the `Review` model with `rating`, optional `comment`, soft delete, timestamps, and relations to User and Product.

```prisma
userId    String  @db.Uuid
user      User    @relation(fields: [userId], references: [id])

productId String  @db.Uuid
product   Product @relation(fields: [productId], references: [id])
```

Added the opposite relation to `User` and `Product`:

```prisma
reviews Review[]
```

Relationship:

```text
User    → has many Reviews
Product → has many Reviews
Review  → belongs to one User and one Product
```

## Migration

```bash
npx prisma migrate dev --name create_review_table
npx prisma generate
```

This created:

```text
reviews.userId    → users.id
reviews.productId → products.id
```

## Review Service and Router

Created:

```text
src/services/review/review.service.ts
src/routes/review.route.ts
```

Implemented:

```text
GET  /api/reviews
POST /api/reviews
```

Used:

```ts
include: {
  user: true,
  product: true,
}
```

so GET reviews returns the related User and Product information.

Connected the router:

```ts
app.use("/api/reviews", reviewRouter);
```

## Testing

A User, Category, and Product were created first because Review requires valid `userId` and `productId` values.

```bash
curl -X POST http://localhost:5001/api/reviews \
  -H "Content-Type: application/json" \
  -d '{
    "rating": 5,
    "comment": "Excellent product",
    "userId": "YOUR_USER_ID",
    "productId": "YOUR_PRODUCT_ID"
  }'
```

Then tested:

```bash
curl http://localhost:5001/api/reviews
```

Review creation and retrieval worked successfully.

## Issue Encountered

The GET Review API initially returned the incorrect message:

```text
Product route is working
```

The Review data itself was correct. The response message was changed to:

```ts
message: "Reviews retrieved successfully";
```

## Security Issue Identified

The included User object currently exposes the password in the API response. Passwords must never be returned to clients. This will be fixed during the authentication/security implementation with password hashing and safe response selection.

## Current Status

```text
Review Model              ✅
User → Review Relation    ✅
Product → Review Relation ✅
Create Review             ✅
Get All Reviews           ✅
Include User              ✅
Include Product           ✅
API Testing               ✅
```

## Git Checkpoint

```bash
git status
git add .
git commit -m "add review model service and routes"
git push
```

## Get Review By ID

Added a service to retrieve one active review by ID together with its related Product and User.

```ts
const getReviewById = async (id: string) => {
  const review = await prisma.review.findUnique({
    where: {
      id: id,
      isDeleted: false,
    },
    include: {
      product: true,
      user: true,
    },
  });

  return review;
};
```

Added route:

```text
GET /api/reviews/:id
```

If the review is missing or soft deleted, the API returns `Review not found`.

## Update Review

Added:

```ts
const updateReview = async (
  id: string,
  data: {
    rating?: number;
    comment?: string;
  },
) => {
  const review = await prisma.review.update({
    where: { id },
    data,
  });

  return review;
};
```

Added route:

```text
PATCH /api/reviews/:id
```

Test:

```bash
curl -X PATCH http://localhost:5001/api/reviews/YOUR_REVIEW_ID \
  -H "Content-Type: application/json" \
  -d '{"rating":4,"comment":"Very good product"}'
```

## Soft Delete Review

Added:

```ts
const deleteReview = async (id: string) => {
  const review = await prisma.review.update({
    where: { id },
    data: {
      isDeleted: true,
    },
  });

  return review;
};
```

Added route:

```text
DELETE /api/reviews/:id
```

Test:

```bash
curl -X DELETE http://localhost:5001/api/reviews/YOUR_REVIEW_ID
```

## Review CRUD Status

```text
GET    /api/reviews       → Get all active reviews
GET    /api/reviews/:id   → Get active review by ID
POST   /api/reviews       → Create review
PATCH  /api/reviews/:id   → Update review
DELETE /api/reviews/:id   → Soft delete review
```

Review CRUD is now complete and tested.

## Git Checkpoint

```bash
git status
git add .
git commit -m "complete review CRUD"
git push
```

# Order, OrderItem, Relations, Nested Include, and Nested Create

This section is intentionally more detailed because Order introduces several important Prisma relationship concepts.

## Why We Need Both `Order` and `OrderItem`

An Order can contain multiple products, so we cannot store only one `productId` inside `Order`.

```text
Order
  ↓
has many
  ↓
OrderItem
  ↓
each OrderItem points to one Product
```

`OrderItem` stores information for each product inside an order, such as:

```text
quantity
price
productId
orderId
```

## Order Model Relations

```prisma
userId String @db.Uuid
user   User   @relation(fields: [userId], references: [id])

orderItems OrderItem[]
```

`userId` stores the User ID.

```prisma
user User @relation(fields: [userId], references: [id])
```

means:

```text
Order.userId
      ↓
references
      ↓
User.id
```

`orderItems OrderItem[]` means one Order can have many OrderItems.

## OrderItem Model Relations

```prisma
orderId String @db.Uuid
order   Order  @relation(fields: [orderId], references: [id])

productId String  @db.Uuid
product   Product @relation(fields: [productId], references: [id])
```

This means:

```text
OrderItem.orderId   → Order.id
OrderItem.productId → Product.id
```

Added opposite fields:

```prisma
// User
orders Order[]

// Product
orderItems OrderItem[]
```

## Migration

```bash
npx prisma migrate dev --name create_order_tables
npx prisma generate
```

This creates:

```text
orders
order_items
```

and foreign-key relationships.

## Get All Orders

```ts
const getAllOrders = async () => {
  const orders = await prisma.order.findMany({
    where: {
      isDeleted: false,
    },
    include: {
      user: true,
      orderItems: {
        include: {
          product: true,
        },
      },
    },
  });

  return orders;
};
```

### Understanding `include`

```ts
include: {
```

`include` is Prisma syntax used when we want related model data in the returned result.

Without `include`, Prisma returns only fields directly from `Order`.

### `user: true`

```ts
user: true,
```

`user` is the relation field defined in the `Order` model.

This means:

```text
Also fetch the User connected to this Order.
```

So instead of receiving only:

```json
{
  "userId": "USER_UUID"
}
```

we can also receive:

```json
{
  "userId": "USER_UUID",
  "user": {
    "id": "USER_UUID",
    "name": "Riyad"
  }
}
```

### `orderItems`

```ts
orderItems: {
```

`orderItems` is the relation field:

```prisma
orderItems OrderItem[]
```

This tells Prisma to work with all OrderItems connected to the Order.

If we only wanted OrderItems, we could write:

```ts
include: {
  orderItems: true,
}
```

### Nested `include`

```ts
orderItems: {
  include: {
    product: true,
  },
},
```

Read it like this:

```text
Include OrderItems
        ↓
For each OrderItem
        ↓
also include its Product
```

`product` matches this relation field in `OrderItem`:

```prisma
product Product @relation(...)
```

So the returned structure becomes:

```text
Order
├── User
└── OrderItems
    ├── OrderItem 1
    │   └── Product
    └── OrderItem 2
        └── Product
```

This is called a nested include because an `include` is used inside another related object.

## Get Order By ID

```ts
const getOrderById = async (id: string) => {
  const order = await prisma.order.findUnique({
    where: {
      id,
      isDeleted: false,
    },
    include: {
      user: true,
      orderItems: {
        include: {
          product: true,
        },
      },
    },
  });

  return order;
};
```

Remember:

```text
where
↓
Which Order should Prisma find?

include
↓
What related information should Prisma also return?
```

## Create Order With OrderItems

```ts
const createOrder = async (data: {
  userId: string;
  totalPrice: number;
  items: {
    productId: string;
    quantity: number;
    price: number;
  }[];
}) => {
  const order = await prisma.order.create({
    data: {
      userId: data.userId,
      totalPrice: data.totalPrice,

      orderItems: {
        create: data.items,
      },
    },

    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
  });

  return order;
};
```

### Understanding `items`

```ts
items: {
  productId: string;
  quantity: number;
  price: number;
}
[];
```

The `[]` means `items` is an array.

Each item represents one OrderItem.

Example:

```json
{
  "items": [
    {
      "productId": "PRODUCT_1",
      "quantity": 2,
      "price": 999
    },
    {
      "productId": "PRODUCT_2",
      "quantity": 1,
      "price": 100
    }
  ]
}
```

This creates two OrderItems.

### `userId: data.userId`

```ts
userId: data.userId,
```

The first `userId` is the field Prisma expects for the new Order.

`data.userId` is the value received from the request.

### `totalPrice: data.totalPrice`

```ts
totalPrice: data.totalPrice,
```

stores the provided total price in the new Order.

Later, a stronger production implementation should calculate this on the backend rather than fully trusting the frontend.

## Nested Create

The most important new part:

```ts
orderItems: {
  create: data.items,
},
```

This is a Prisma nested create.

`orderItems` is the relation field from:

```prisma
orderItems OrderItem[]
```

`create` means:

```text
While creating this Order,
also create related OrderItem records.
```

`data.items` contains the OrderItem objects from the request.

So:

```text
Create Order
    ↓
Take every object from data.items
    ↓
Create an OrderItem for each
    ↓
Connect each OrderItem to the new Order
```

## How `orderId` Gets Filled Automatically

The request does not contain `orderId`, even though `OrderItem` requires it.

That works because this is a nested create:

```ts
orderItems: {
  create: data.items,
}
```

Prisma already knows these OrderItems belong to the Order it is currently creating.

Conceptually:

```text
1. Prisma creates Order

Order.id = "ORDER-123"

2. Prisma creates OrderItems

OrderItem 1.orderId = "ORDER-123"
OrderItem 2.orderId = "ORDER-123"
```

So we do not manually send `orderId`.

## Why Include After Create?

This part:

```ts
include: {
  orderItems: {
    include: {
      product: true,
    },
  },
},
```

does not create anything.

The creation already happened here:

```ts
orderItems: {
  create: data.items,
}
```

The `include` only controls what Prisma returns after the database operation.

Remember:

```text
create
↓
changes database

include
↓
controls related data returned
```

## Why Update Does Not Need `include`

```ts
const updateOrder = async (
  id: string,
  data: {
    status?: "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED";
    totalPrice?: number;
  },
) => {
  const order = await prisma.order.update({
    where: {
      id,
    },
    data,
  });

  return order;
};
```

We are only updating Order fields.

For example:

```json
{
  "status": "CONFIRMED"
}
```

We do not need User, OrderItem, or Product details to perform that update.

If the frontend needed the full related data immediately after updating, we could add `include`, but it is not required for the update itself.

## Why Soft Delete Does Not Need `include`

```ts
const deleteOrder = async (id: string) => {
  const order = await prisma.order.update({
    where: {
      id,
    },
    data: {
      isDeleted: true,
    },
  });

  return order;
};
```

This only needs to:

```text
Find Order
↓
set isDeleted = true
```

Related information is not needed for that operation.

Important:

```text
include does NOT create or define a relation.
```

The relation already exists through `@relation`.

`include` only asks Prisma to return related records.

## Quick `include` Rule

```ts
include: {
  user: true,
}
```

means:

```text
Order + User
```

```ts
include: {
  orderItems: true,
}
```

means:

```text
Order + OrderItems
```

```ts
include: {
  orderItems: {
    include: {
      product: true,
    },
  },
}
```

means:

```text
Order
+
OrderItems
+
Product for each OrderItem
```

## Order Router

Connected with:

```ts
app.use("/api/orders", orderRouter);
```

Endpoints:

```text
GET    /api/orders
GET    /api/orders/:id
POST   /api/orders
PATCH  /api/orders/:id
DELETE /api/orders/:id
```

## Create Order Test

```bash
curl -X POST http://localhost:5001/api/orders   -H "Content-Type: application/json"   -d '{
    "userId": "YOUR_USER_ID",
    "totalPrice": 1998,
    "items": [
      {
        "productId": "YOUR_PRODUCT_ID",
        "quantity": 2,
        "price": 999
      }
    ]
  }'
```

## Update Order Test

```bash
curl -X PATCH http://localhost:5001/api/orders/YOUR_ORDER_ID   -H "Content-Type: application/json"   -d '{
    "status": "CONFIRMED"
  }'
```

## Soft Delete Order Test

```bash
curl -X DELETE http://localhost:5001/api/orders/YOUR_ORDER_ID
```

After soft delete, `GET /api/orders` returned:

```json
{
  "success": true,
  "message": "Orders retrieved successfully",
  "data": []
}
```

This is correct because `getAllOrders()` uses:

```ts
where: {
  isDeleted: false,
}
```

The deleted Order remains in PostgreSQL but is hidden from normal API results.

## Important Concepts Learned

```text
OrderItem as a connecting model
Foreign keys
One-to-many relations
Nested include
Nested create
Automatic orderId assignment
include vs create
where vs include
Soft delete
```

Most important summary:

```text
@relation
→ defines how models are connected

include
→ returns related data

create inside a relation
→ creates related records

where
→ chooses which record(s) to work with
```

## Git Checkpoint

```bash
git status
git add .
git commit -m "add order CRUD with nested order items"
git push
```

# Authentication, JWT, Protected Routes, and Order Ownership

This section documents the authentication/security work in detail, including the problems encountered and why each new line was added.

## 1. Install Authentication Packages

```bash
npm install bcrypt jsonwebtoken
npm install -D @types/bcrypt @types/jsonwebtoken
```

`bcrypt` hashes and compares passwords. `jsonwebtoken` creates and verifies JWTs. The `@types/...` packages give TypeScript type information for packages that do not provide their own types.

## 2. Hash Passwords Before Saving

User creation was changed from storing plain text to:

```ts
const hashedPassword = await bcrypt.hash(data.password, 10);
```

Here:

```text
data.password → plain password from request
bcrypt.hash() → creates a secure hash
10            → bcrypt cost/salt rounds
hashedPassword → value stored in PostgreSQL
```

Then:

```ts
const user = await prisma.user.create({
  data: {
    name: data.name,
    email: data.email,
    password: hashedPassword,
  },
  omit: {
    password: true,
  },
});
```

`omit: { password: true }` does not delete the password from PostgreSQL. It only prevents Prisma from returning it in the API result.

The same `omit` was added to normal User CRUD queries so password hashes are not exposed.

## 3. Login With `bcrypt.compare()`

Created:

```text
src/services/auth/auth.service.ts
```

The important comparison is:

```ts
const isPasswordMatched = await bcrypt.compare(data.password, user.password);
```

`data.password` comes from the current login request.

`user.password` comes from PostgreSQL and contains the stored bcrypt hash.

Flow:

```text
plain password from login
        ↓
bcrypt.compare()
        ↑
stored bcrypt hash
        ↓
true / false
```

### Problem: old user could not login

An older test User had been created before bcrypt was added, so PostgreSQL contained:

```text
123456
```

instead of a bcrypt hash such as:

```text
$2b$10$...
```

`bcrypt.compare()` therefore failed.

Fix: create a new User after bcrypt hashing was enabled.

## 4. Authentication Route Structure

Connected:

```ts
app.use("/api/auth", authRouter);
```

Inside `auth.route.ts`:

```ts
router.post("/login", ...)
```

Express combines:

```text
/api/auth + /login
=
/api/auth/login
```

We use `/login` instead of only `/` because `/api/auth` is a base path that can later contain multiple authentication actions:

```text
/api/auth/login
/api/auth/register
/api/auth/logout
/api/auth/refresh-token
```

## 5. JWT Secret

Generated a random JWT secret:

```bash
openssl rand -base64 32
```

Then added it to `.env`:

```env
JWT_SECRET="..."
```

The secret stays only on the backend and must never be sent to the frontend.

### Problem: `secretOrPrivateKey must have a value`

JWT creation initially failed with:

```text
secretOrPrivateKey must have a value
```

because:

```ts
process.env.JWT_SECRET;
```

was undefined.

Fix: add `JWT_SECRET` to `.env` and restart the server.

Important:

```ts
process.env.JWT_SECRET as string;
```

does not create the environment variable. It only tells TypeScript to treat the value as a string.

## 6. Create JWT

After successful password comparison:

```ts
const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, {
  expiresIn: "7d",
});
```

Line by line:

```ts
jwt.sign(...)
```

creates and signs the token.

```ts
{
  id: user.id;
}
```

is the payload. We chose to store the User ID in the JWT.

```ts
process.env.JWT_SECRET as string;
```

is the private server secret used to sign it.

```ts
expiresIn: "7d";
```

makes the token expire after seven days.

Password is NOT placed inside the JWT.

## 7. Return Safe User Data + JWT

Instead of:

```ts
return { user, token };
```

which could return the stored password hash, return a safe user object:

```ts
return {
  user: {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  },
  token,
};
```

## 8. JWT Authentication Flow

```text
User sends email + password
        ↓
Find User by email
        ↓
bcrypt.compare()
        ↓
Password valid
        ↓
jwt.sign()
        ↓
Frontend receives JWT
        ↓
Frontend sends JWT on protected requests
```

The frontend sends:

```text
Authorization: Bearer JWT_TOKEN
```

## 9. Why JWT Is Safer Than Trusting `req.body.userId`

Before authentication, Order creation could trust:

```json
{
  "userId": "USER_UUID"
}
```

But a User ID is only an identifier. It is not proof that the requester owns that identity.

After JWT authentication, the backend should get the authenticated User ID from the verified token instead of trusting:

```ts
req.body.userId;
```

## 10. Authentication Middleware

Created:

```text
src/middleware/auth.middleware.ts
```

```ts
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const auth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: string;
    };

    req.user = {
      id: decoded.id,
    };

    next();
  } catch {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};
```

## 11. `req.headers.authorization`

If the client sends:

```text
Authorization: Bearer eyJhbGciOi...
```

then:

```ts
req.headers.authorization;
```

contains:

```text
Bearer eyJhbGciOi...
```

## 12. `authHeader.split(" ")[1]`

```ts
authHeader.split(" ");
```

turns:

```text
Bearer eyJ...
```

into:

```ts
["Bearer", "eyJ..."];
```

So:

```ts
authHeader.split(" ")[1];
```

returns only the JWT.

## 13. `jwt.verify()`

```ts
const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
  id: string;
};
```

This verifies the token using the same secret used during `jwt.sign()`.

It checks whether the token is valid and unexpired.

Because we signed with:

```ts
{
  id: user.id;
}
```

we later read:

```ts
decoded.id;
```

The name `decoded` is just our variable name and can be changed.

The payload property `id` can also be renamed, but whatever name is used in `jwt.sign()` must match what is read after `jwt.verify()`.

## 14. Extend Express Request With `req.user`

Express knows properties such as:

```text
req.body
req.params
req.headers
```

but does not know `req.user`.

Created:

```text
src/types/express.d.ts
```

```ts
import "express";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
      };
    }
  }
}
```

This only tells TypeScript that `req.user` is allowed.

It does NOT create the runtime value.

The middleware creates it:

```ts
req.user = {
  id: decoded.id,
};
```

Then `next()` passes the same request object to the route.

## 15. Understanding `next()`

For:

```ts
router.post("/", auth, async (req, res) => {
```

Express runs:

```text
request
↓
auth middleware
↓
JWT valid
↓
req.user created
↓
next()
↓
actual route handler
```

Without `next()`, the request would stop in the middleware.

## 16. Protect Create Order

Changed:

```ts
router.post("/", async ...)
```

to:

```ts
router.post("/", auth, async ...)
```

Adding `auth` means the route will not run unless JWT verification succeeds.

## 17. Problem: `userId: undefined`

After protecting Order creation, Prisma returned an error showing:

```text
userId: undefined
Argument `user` is missing
```

Why?

The frontend no longer sent `userId`, which was correct, but the route still did:

```ts
const data = req.body;
const order = await orderService.createOrder(data);
```

So the service never received the authenticated User ID.

Fix:

```ts
const order = await orderService.createOrder({
  ...data,
  userId: req.user!.id,
});
```

## 18. Understanding `...data`

If:

```ts
data;
```

contains:

```json
{
  "totalPrice": 999,
  "items": [...]
}
```

then:

```ts
{
  ...data,
  userId: req.user!.id,
}
```

creates:

```json
{
  "totalPrice": 999,
  "items": [...],
  "userId": "AUTHENTICATED_USER_ID"
}
```

`...data` copies the properties from the original object.

Then `userId` is added from the verified JWT.

## 19. Understanding `req.user!.id`

The custom Request type used:

```ts
user?: {
  id: string;
}
```

The `?` means `user` might be undefined.

TypeScript may therefore reject:

```ts
req.user.id;
```

The route runs after `auth`, which sets `req.user`, so we use:

```ts
req.user!.id;
```

The `!` is TypeScript's non-null assertion operator.

It means:

```text
I know this value exists here.
```

It does not create or validate the value at runtime.

## 20. Successful Protected Order Creation

After fixing the route:

```text
JWT
↓
auth middleware
↓
decoded.id
↓
req.user.id
↓
Order route adds userId
↓
createOrder()
↓
Order.userId
```

Order creation worked without sending `userId` from the frontend.

## 21. Problem: `jwt malformed`

During testing we received:

```text
JsonWebTokenError: jwt malformed
```

This happened because the value sent after `Bearer` was not a complete valid JWT.

A JWT normally has three sections:

```text
xxxxx.yyyyy.zzzzz
```

Fix: login again, copy the full token, and send:

```text
Authorization: Bearer FULL_JWT_TOKEN
```

## 22. Why Add `try/catch` Around `jwt.verify()`

Without `try/catch`, malformed or expired tokens caused Express to return an HTML error page.

Now:

```ts
try {
  // verify
} catch {
  return res.status(401).json({
    success: false,
    message: "Invalid or expired token",
  });
}
```

This keeps API error responses consistent JSON.

## 23. Protect All Order Routes

Added `auth` to:

```ts
router.get("/", auth, ...)
router.get("/:id", auth, ...)
router.post("/", auth, ...)
router.patch("/:id", auth, ...)
router.delete("/:id", auth, ...)
```

Why?

Order data should not be publicly available.

Adding `auth` checks:

```text
Is this requester authenticated?
```

But authentication alone does NOT check whether the User owns a specific Order.

That requires ownership filtering.

## 24. Problem: `req.params.id` Type Error

TypeScript showed:

```text
Argument of type 'string | string[]'
is not assignable to parameter of type 'string'.
```

The newer Express typings can type:

```ts
req.params.id;
```

as:

```ts
string | string[]
```

but our service expects:

```ts
id: string;
```

Fix:

```ts
const id = req.params.id as string;
```

This tells TypeScript that this route parameter is one string.

## 25. Protect GET All Orders With Ownership

Previously:

```ts
getAllOrders();
```

could return every active Order.

Changed service:

```ts
const getAllOrders = async (userId: string) => {
  const orders = await prisma.order.findMany({
    where: {
      userId: userId,
      isDeleted: false,
    },
    include: {
      user: true,
      orderItems: {
        include: {
          product: true,
        },
      },
    },
  });

  return orders;
};
```

Changed route:

```ts
router.get("/", auth, async (req, res) => {
  const userId = req.user!.id;

  const orders = await orderService.getAllOrders(userId);

  res.json({
    success: true,
    message: "Orders retrieved successfully",
    data: orders,
  });
});
```

Now:

```text
JWT
↓
req.user.id
↓
getAllOrders(userId)
↓
where userId matches authenticated User
```

So one User does not receive another User's Orders.

## 26. Protect GET Order By ID With Ownership

Changed service:

```ts
const getOrderById = async (id: string, userId: string) => {
  const order = await prisma.order.findFirst({
    where: {
      id,
      userId,
      isDeleted: false,
    },
    include: {
      user: true,
      orderItems: {
        include: {
          product: true,
        },
      },
    },
  });

  return order;
};
```

Changed route:

```ts
router.get("/:id", auth, async (req, res) => {
  const id = req.params.id as string;
  const userId = req.user!.id;

  const order = await orderService.getOrderById(id, userId);

  if (!order) {
    return res.status(404).json({
      success: false,
      message: "Order not found",
    });
  }

  res.json({
    success: true,
    message: "Order retrieved successfully",
    data: order,
  });
});
```

Prisma now checks:

```ts
where: {
  id,
  userId,
  isDeleted: false,
}
```

Meaning:

```text
Correct Order ID?
AND
Does this Order belong to authenticated User?
AND
Is it not soft deleted?
```

## 27. Authentication vs Authorization

Authentication asks:

```text
Who are you?
```

Handled by:

```text
JWT
jwt.verify()
auth middleware
```

Authorization / ownership asks:

```text
Are you allowed to access this resource?
```

Handled by checks such as:

```ts
where: {
  id,
  userId,
}
```

A valid JWT does not automatically mean the User should be allowed to access every Order.

## 28. Current Protected Order Flow

Create Order:

```text
Frontend
↓
Authorization: Bearer JWT
↓
auth middleware
↓
jwt.verify()
↓
req.user.id
↓
Order route
↓
userId added from JWT
↓
createOrder()
↓
PostgreSQL
```

Get own Orders:

```text
JWT
↓
req.user.id
↓
getAllOrders(userId)
↓
where userId matches
↓
only own Orders
```

Get own Order by ID:

```text
JWT userId
+
Order ID from URL
↓
where:
id
userId
isDeleted = false
↓
return only if owned by authenticated User
```

## 29. Security Lessons

```text
Never store plain-text passwords.
Never return password hashes to the frontend.
Never put passwords inside JWT payloads.
JWT_SECRET stays only on the backend.
Do not trust req.body.userId for authenticated identity.
Use User ID from verified JWT.
Authentication and ownership are different.
A valid JWT does not mean access to every resource.
Catch JWT errors and return JSON.
```

## 30. Current Authentication Status

```text
bcrypt hashing                       ✅
Password omitted from User responses ✅
Login service                         ✅
bcrypt.compare()                      ✅
JWT secret                            ✅
JWT generation                        ✅
Login route                           ✅
Auth middleware                       ✅
Authorization header parsing          ✅
jwt.verify()                          ✅
Custom req.user type                  ✅
User ID from JWT                      ✅
Invalid JWT handling                  ✅
Create Order protected                ✅
All Order routes protected            ✅
Get own Orders                        ✅
Get own Order by ID                   ✅
```

## 31. Next Security Work

Still to do:

```text
Protect Update Order by ownership
Protect Delete Order by ownership
Role-based authorization (USER / ADMIN)
Input validation
Centralized error handling
Calculate trusted Order total on backend
```

## Git Checkpoint

```bash
git status
git add .
git commit -m "add JWT authentication and protect order routes"
git push
```

# Order Ownership Protection and Error Handling

## Goal

This stage improves the JWT-protected Order API by adding ownership checks, preventing access to deleted Orders, hiding password hashes from related User data, and returning clean 404 responses when an Order cannot be accessed.

## Authentication vs Ownership

Adding `auth` to a route:

```ts
router.patch("/:id", auth, ...)
```

proves that the requester has a valid JWT. It does not prove that the requested Order belongs to that User.

We therefore need both:

```text
Authentication -> Is this User logged in?
Ownership      -> Does this Order belong to this User?
```

The authenticated User ID comes from:

```ts
const userId = req.user!.id;
```

It comes from the verified JWT, not `req.body.userId`.

## Protect Get All Orders

```ts
const getAllOrders = async (userId: string) => {
  const orders = await prisma.order.findMany({
    where: {
      isDeleted: false,
      userId: userId,
    },
    include: {
      user: {
        omit: {
          password: true,
        },
      },
      orderItems: {
        include: {
          product: true,
        },
      },
    },
  });

  return orders;
};
```

The `where` block means only active Orders belonging to the authenticated User are returned.

```ts
userId: userId;
```

can also be written as:

```ts
userId;
```

when the property and variable have the same name.

## Password Hash Leak Through Relation

Originally we used:

```ts
user: true;
```

This included the complete related User and caused the password hash to appear in the Order response.

We changed it to:

```ts
user: {
  omit: {
    password: true,
  },
},
```

This still includes the related User but prevents Prisma from returning `password`.

A hashed password should still not be exposed to the client.

## Why `orderItems` Still Uses `include`

```ts
orderItems: {
  include: {
    product: true,
  },
},
```

This is separate from password protection.

The relation is:

```text
Order
  -> OrderItem
      -> Product
```

`orderItems` includes the items belonging to the Order. The nested `product: true` includes the Product related to each OrderItem.

So the response structure is roughly:

```text
Order
├── User
│   └── password omitted
└── OrderItems
    └── Product
```

## Protect Get Order By ID

```ts
const getOrderById = async (id: string, userId: string) => {
  const order = await prisma.order.findUnique({
    where: {
      id,
      isDeleted: false,
      userId: userId,
    },
    include: {
      user: {
        omit: {
          password: true,
        },
      },
      orderItems: {
        include: {
          product: true,
        },
      },
    },
  });

  return order;
};
```

The query checks:

```text
correct Order ID
AND
belongs to authenticated User
AND
is not soft deleted
```

## NEW: Ownership Check Before Update

The new Update logic first checks whether an accessible Order exists:

```ts
const existingOrder = await prisma.order.findFirst({
  where: {
    id,
    userId,
    isDeleted: false,
  },
});
```

Why `findFirst()`?

Before modifying the database, we want to ask:

```text
Does an active Order with this ID belong to this authenticated User?
```

Each condition has a purpose:

```ts
id;
```

identifies the requested Order.

```ts
userId;
```

ensures the Order belongs to the authenticated User.

```ts
isDeleted: false;
```

prevents modification of an already soft-deleted Order.

Together:

```text
correct Order + correct owner + active = allowed
```

## Why Return `null`

After checking:

```ts
if (!existingOrder) {
  return null;
}
```

No matching Order can mean:

```text
Order does not exist
OR
Order belongs to another User
OR
Order is already deleted
```

Instead of continuing to `update()` and potentially getting a Prisma error, the service returns `null`.

The route can then convert that result into a clean HTTP response.

## Full Update Service

```ts
const updateOrder = async (
  id: string,
  userId: string,
  data: {
    status?: "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED";
    totalPrice?: number;
  },
) => {
  const existingOrder = await prisma.order.findFirst({
    where: {
      id,
      userId,
      isDeleted: false,
    },
  });

  if (!existingOrder) {
    return null;
  }

  const order = await prisma.order.update({
    where: {
      id,
    },
    data,
  });

  return order;
};
```

## NEW: Ownership Check Before Delete

Delete uses the same check:

```ts
const existingOrder = await prisma.order.findFirst({
  where: {
    id,
    userId,
    isDeleted: false,
  },
});

if (!existingOrder) {
  return null;
}
```

This prevents a User from deleting another User's Order and prevents repeatedly deleting an already deleted Order.

## Why `isDeleted` Appears Twice

Soft delete uses:

```ts
where: {
  isDeleted: false,
}
```

and:

```ts
data: {
  isDeleted: true,
}
```

They have different purposes.

The first means:

```text
Find/check an Order that is currently active.
```

The second means:

```text
Change that Order so it is now marked deleted.
```

Flow:

```text
isDeleted: false
        ↓
find active Order
        ↓
isDeleted: true
        ↓
mark Order deleted
```

The row remains in PostgreSQL. This is a soft delete.

## Full Delete Service

```ts
const deleteOrder = async (id: string, userId: string) => {
  const existingOrder = await prisma.order.findFirst({
    where: {
      id,
      userId,
      isDeleted: false,
    },
  });

  if (!existingOrder) {
    return null;
  }

  const order = await prisma.order.update({
    where: {
      id,
    },
    data: {
      isDeleted: true,
    },
  });

  return order;
};
```

## NEW: Route Handles `null`

Because the service can now return `null`, PATCH adds:

```ts
if (!order) {
  return res.status(404).json({
    success: false,
    message: "Order not found",
  });
}
```

DELETE adds the same check.

The flow is:

```text
Service searches for owned active Order
↓
nothing found
↓
return null
↓
route sees !order
↓
HTTP 404
```

This produces:

```json
{
  "success": false,
  "message": "Order not found"
}
```

instead of a raw Prisma/HTML error.

## Why Use the Same `Order not found` Message for Another User's Order?

Suppose User A requests an Order belonging to User B.

The query requires both:

```text
requested Order ID
AND
User A's ID
```

so no matching accessible Order is found.

We return:

```text
Order not found
```

rather than confirming that another User's Order exists. This avoids unnecessarily exposing information about resources the requester does not own.

## TypeScript Problem: `req.params.id`

We encountered:

```text
Argument of type 'string | string[]' is not assignable to parameter of type 'string'.
```

Our service expects:

```ts
id: string;
```

so we used:

```ts
const id = req.params.id as string;
```

`as string` is a TypeScript type assertion. It tells TypeScript to treat this route parameter as a string. It does not transform the value at runtime.

## PATCH Route

```ts
router.patch("/:id", auth, async (req, res) => {
  const id = req.params.id as string;
  const data = req.body;
  const userId = req.user!.id;

  const order = await orderService.updateOrder(id, userId, data);

  if (!order) {
    return res.status(404).json({
      success: false,
      message: "Order not found",
    });
  }

  res.json({
    success: true,
    message: "Order updated successfully",
    data: order,
  });
});
```

## DELETE Route

```ts
router.delete("/:id", auth, async (req, res) => {
  const id = req.params.id as string;
  const userId = req.user!.id;

  const order = await orderService.deleteOrder(id, userId);

  if (!order) {
    return res.status(404).json({
      success: false,
      message: "Order not found",
    });
  }

  res.json({
    success: true,
    message: "Order deleted successfully",
    data: order,
  });
});
```

## Testing

A fake valid-format UUID was used to test PATCH and DELETE.

Expected result:

```json
{
  "success": false,
  "message": "Order not found"
}
```

Both ownership/not-found checks returned the clean response successfully.

During PATCH testing, an entire curl command was accidentally pasted after `Bearer`, causing:

```text
Invalid or expired token
```

The Authorization header must contain only:

```text
Authorization: Bearer ACTUAL_JWT_TOKEN
```

## Complete Security Flow

```text
JWT
↓
auth middleware
↓
authenticated userId
↓
Order ID from URL
↓
findFirst({
  id,
  userId,
  isDeleted: false
})
↓
Does active Order belong to User?
├── NO  -> return null -> route returns 404
└── YES -> update/delete allowed
```

## Concepts Learned

**Authentication**

```text
Who are you?
```

Handled by JWT and `auth`.

**Authorization / ownership**

```text
Are you allowed to access this Order?
```

Handled using `id + userId`.

**Soft delete**

```text
Keep the database row but set isDeleted = true.
```

**Safe relation response**

Use:

```ts
user: {
  omit: {
    password: true,
  },
}
```

instead of exposing the complete User relation.

**Service vs route error handling**

Service:

```ts
return null;
```

Route:

```ts
if (!order) {
  return res.status(404).json(...);
}
```

The service handles database/business logic. The route handles the HTTP response.

## Current Status

```text
All Order routes require JWT             ✅
Create uses User ID from JWT             ✅
Get all filters by owner                 ✅
Get one filters by owner                 ✅
Update checks ownership                  ✅
Delete checks ownership                  ✅
Soft-deleted Orders excluded             ✅
Already deleted Order protected          ✅
Missing/inaccessible Order returns 404   ✅
Password omitted from User relation      ✅
OrderItems include related Product       ✅
```

## Next Steps

```text
Role-based authorization (USER / ADMIN)
Input validation
Centralized error handling
Server-side Order price calculation
Stock validation
```

## Git Commit

```bash
git status
git add .
git commit -m "add order ownership and error handling"
git push
```

# Role-Based Authorization (RBAC) with JWT

This section documents how role-based authorization was added on top of the existing JWT authentication system.

## Authentication vs Authorization

Authentication asks:

```text
Who is this user?
```

Authorization asks:

```text
What is this user allowed to do?
```

The backend now uses both.

## Add Role to JWT

Previously, JWT only stored the User ID:

```ts
const token = jwt.sign(
  {
    id: user.id,
  },
  process.env.JWT_SECRET as string,
  {
    expiresIn: "7d",
  },
);
```

Now it also stores role:

```ts
const token = jwt.sign(
  {
    id: user.id,
    role: user.role,
  },
  process.env.JWT_SECRET as string,
  {
    expiresIn: "7d",
  },
);
```

Now the token can tell us both:

```text
id   -> who the User is
role -> USER or ADMIN
```

## Safe Login Response

The login response returns only safe User fields:

```ts
return {
  user: {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  },
  token,
};
```

This avoids returning the stored password hash.

## Add Role to `req.user`

Updated:

```text
src/types/express.d.ts
```

```ts
import "express";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: "USER" | "ADMIN";
      };
    }
  }
}
```

This tells TypeScript that `req.user` can contain both `id` and `role`.

## Update Auth Middleware

After `jwt.verify()`:

```ts
const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
  id: string;
  role: "USER" | "ADMIN";
};
```

Then:

```ts
req.user = {
  id: decoded.id,
  role: decoded.role,
};
```

Flow:

```text
JWT
↓
jwt.verify()
↓
decoded.id + decoded.role
↓
req.user.id + req.user.role
```

## Create Authorization Middleware

Created:

```text
src/middleware/authorize.middleware.ts
```

```ts
import { NextFunction, Request, Response } from "express";

export const authorize = (...allowedRoles: ("USER" | "ADMIN")[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user?.role;

    if (!userRole || !allowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: "Forbidden",
      });
    }

    next();
  };
};
```

## Why `...allowedRoles`?

This is a rest parameter.

```ts
authorize("ADMIN");
```

becomes:

```text
allowedRoles = ["ADMIN"]
```

And:

```ts
authorize("USER", "ADMIN");
```

becomes:

```text
allowedRoles = ["USER", "ADMIN"]
```

This makes the middleware reusable.

## Why `authorize()` Returns Another Function

This:

```ts
authorize("ADMIN");
```

creates a middleware configured for ADMIN access.

Conceptually:

```text
authorize("ADMIN")
↓
returns Express middleware
↓
middleware checks req.user.role
```

## Role Check

Inside:

```ts
const userRole = req.user?.role;
```

The role comes from the verified JWT.

Then:

```ts
allowedRoles.includes(userRole);
```

checks whether the User's role is allowed.

For ADMIN:

```text
["ADMIN"].includes("ADMIN")
→ true
```

For USER:

```text
["ADMIN"].includes("USER")
→ false
```

## Why 403 Forbidden?

If the User is logged in but does not have permission:

```ts
return res.status(403).json({
  success: false,
  message: "Forbidden",
});
```

Important difference:

```text
401 Unauthorized
→ invalid/missing authentication

403 Forbidden
→ authenticated successfully
→ but not allowed
```

## Middleware Order

Correct:

```ts
(auth, authorize("ADMIN"));
```

Why?

`auth` creates:

```text
req.user
```

Then `authorize` reads:

```text
req.user.role
```

So the correct order is:

```text
auth
↓
req.user created
↓
authorize
↓
role checked
```

## Make User Routes ADMIN-Only

Added:

```ts
import { auth } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/authorize.middleware.js";
```

Then applied:

```ts
router.get("/", auth, authorize("ADMIN"), ...)
router.get("/:id", auth, authorize("ADMIN"), ...)
router.post("/", auth, authorize("ADMIN"), ...)
router.patch("/:id", auth, authorize("ADMIN"), ...)
router.delete("/:id", auth, authorize("ADMIN"), ...)
```

So each User CRUD request goes through:

```text
JWT verification
↓
role verification
↓
route
```

## Create ADMIN Test User

A test User was manually changed in Prisma Studio from:

```text
USER
```

to:

```text
ADMIN
```

The test ADMIN account used:

```text
riyadauth@example.com
```

## Why Login Again After Changing Role?

The old JWT still contained the old role.

Changing PostgreSQL does not change an already-issued JWT.

Example:

```text
Old JWT:
role = USER
```

Then database changed to:

```text
role = ADMIN
```

The old JWT remains:

```text
role = USER
```

So a new login is required.

New login:

```text
reads current database role
↓
jwt.sign()
↓
new JWT contains ADMIN
```

## Test ADMIN Access

Logged in again as the ADMIN User and received a JWT containing:

```json
{
  "role": "ADMIN"
}
```

Then tested:

```bash
curl http://localhost:5001/api/users   -H "Authorization: Bearer ADMIN_JWT"
```

Result:

```text
Users retrieved successfully
```

This confirmed:

```text
ADMIN JWT
↓
auth passed
↓
authorize("ADMIN") passed
↓
route allowed
```

## Create Fresh Normal USER

Some older test Users were created before bcrypt hashing was enabled.

A fresh User was created after bcrypt support so the password was stored correctly as a bcrypt hash.

Example:

```text
normaluser@example.com
role = USER
```

Because the Prisma model uses:

```prisma
role UserRole @default(USER)
```

the role was assigned automatically.

## Test USER Login

The normal User logged in successfully and received a JWT containing:

```json
{
  "role": "USER"
}
```

## Test USER Against ADMIN Route

Then tested:

```bash
curl http://localhost:5001/api/users   -H "Authorization: Bearer USER_JWT"
```

Result:

```json
{
  "success": false,
  "message": "Forbidden"
}
```

This confirms:

```text
USER authenticated ✅
ADMIN permission ❌
403 Forbidden ✅
```

## Complete RBAC Flow

### ADMIN

```text
Login
↓
JWT contains role ADMIN
↓
auth
↓
req.user.role = ADMIN
↓
authorize("ADMIN")
↓
allowed
↓
route runs
```

### USER

```text
Login
↓
JWT contains role USER
↓
auth
↓
req.user.role = USER
↓
authorize("ADMIN")
↓
denied
↓
403 Forbidden
```

## Reusable Authorization

ADMIN only:

```ts
authorize("ADMIN");
```

USER only:

```ts
authorize("USER");
```

Either:

```ts
authorize("USER", "ADMIN");
```

## Important Security Note

Because role is stored inside the JWT:

```text
database role changes
do not automatically update
existing JWTs
```

A new token is needed after a role change.

A stricter production system could use shorter-lived access tokens or query current User data during authorization.

## Current RBAC Status

```text
Role added to JWT                 ✅
Role added to req.user            ✅
Auth middleware reads role        ✅
authorize middleware created      ✅
ADMIN-only User routes            ✅
ADMIN login tested                ✅
ADMIN access allowed              ✅
Fresh bcrypt USER created         ✅
USER login tested                 ✅
USER blocked with 403             ✅
```

## Security Layers Now

```text
Layer 1
bcrypt password hashing

Layer 2
JWT authentication

Layer 3
Order ownership checks

Layer 4
Role authorization
```

The backend can now answer:

```text
Who are you?
Do you own this resource?
Do you have the right role?
```

## Next Steps

```text
ADMIN-only Category create/update/delete
ADMIN-only Product create/update/delete
Public or authenticated Product/Category reads
Role-aware Order administration
Input validation
Centralized error handling
Stock validation
Server-side totalPrice calculation
```

## Git Commit

```bash
git status
git add .
git commit -m "add role based authorization"
git push
```

---

# Review Authentication, Ownership, and ADMIN Moderation

This stage secures the existing Review CRUD API.

The Review model, service, routes, User relation, Product relation, and soft delete were already created earlier.

The goal of this stage is to:

- Allow normal GET Review requests
- Require authentication when creating a Review
- Allow only a `USER` to create a Review
- Get the Review owner from the verified JWT
- Never trust `userId` from `req.body`
- Allow a User to update or delete only their own Review
- Allow an ADMIN to manage any active Review
- Return clean `404` and `403` JSON responses
- Hide password hashes from Review relations
- Preserve Review soft delete

---

## Existing Review Model

The Prisma schema already contains:

```prisma
model Review {
  id        String   @id @default(uuid()) @db.Uuid
  rating    Int
  comment   String?
  isDeleted Boolean  @default(false)

  userId String @db.Uuid
  user   User   @relation(fields: [userId], references: [id])

  productId String  @db.Uuid
  product   Product @relation(fields: [productId], references: [id])

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([userId])
  @@index([productId])
  @@map("reviews")
}
```

This means:

```text
Review belongs to one User
Review belongs to one Product
Review supports soft delete
```

No new Prisma model or migration was needed for this stage.

---

## Current Review Routes

```text
GET    /api/reviews       → Public: get active Reviews
GET    /api/reviews/:id   → Public: get one active Review
POST   /api/reviews       → USER only: create a Review
PATCH  /api/reviews/:id   → Owner or ADMIN: update a Review
DELETE /api/reviews/:id   → Owner or ADMIN: soft delete a Review
```

---

## Protect Review Creation

The create route now uses:

```ts
router.post("/", auth, authorize("USER"), async (req, res) => {
  const review = await reviewService.createReview(
    req.user!.id,
    req.body
  );

  res.json({
    success: true,
    message: "Review created successfully",
    data: review,
  });
});
```

The middleware flow is:

```text
Request
↓
auth verifies JWT
↓
req.user is created
↓
authorize("USER") checks the role
↓
route uses req.user.id
↓
Review is created
```

An ADMIN can moderate Reviews but does not create a normal customer Review through this route.

---

## Never Trust `userId` From the Request Body

Unsafe:

```ts
const userId = req.body.userId;
```

A client could send another User's ID and create a Review under that account.

The secure version uses:

```ts
req.user!.id
```

This ID comes from the verified JWT.

The Review service receives the authenticated ID separately:

```ts
const createReview = async (
  userId: string,
  data: {
    rating: number;
    comment?: string;
    productId: string;
  }
) => {
  const review = await prisma.review.create({
    data: {
      rating: data.rating,
      comment: data.comment,
      productId: data.productId,
      userId,
    },
  });

  return review;
};
```

The service explicitly selects allowed fields instead of spreading the complete request body.

This prevents the client from secretly sending fields such as:

```text
userId
isDeleted
createdAt
updatedAt
```

---

## Review Ownership Check

Before update or delete, the service finds the active Review:

```ts
const existingReview = await prisma.review.findFirst({
  where: {
    id,
    isDeleted: false,
  },
  select: {
    userId: true,
  },
});
```

If the Review does not exist or was already soft deleted:

```ts
return { status: "notFound" as const };
```

Then ownership is checked:

```ts
if (role !== "ADMIN" && existingReview.userId !== userId) {
  return { status: "forbidden" as const };
}
```

The rule is:

```text
ADMIN
→ may manage any active Review

USER who owns the Review
→ may update or delete it

USER who does not own the Review
→ receives 403 Forbidden
```

The owner ID comes from:

```ts
req.user!.id
```

The role comes from:

```ts
req.user!.role
```

Both values were created by the JWT authentication middleware.

---

## Clean 404 Response

If the Review is missing or soft deleted, the route returns:

```json
{
  "success": false,
  "message": "Review not found"
}
```

with HTTP status:

```text
404 Not Found
```

---

## Clean 403 Response

If a normal User tries to update another User's Review:

```json
{
  "success": false,
  "message": "You cannot update this review"
}
```

If a normal User tries to delete another User's Review:

```json
{
  "success": false,
  "message": "You cannot delete this review"
}
```

Both responses use:

```text
403 Forbidden
```

---

## Preserve Soft Delete

Normal Review GET requests use:

```ts
where: {
  isDeleted: false,
}
```

Delete does not remove the database row.

It updates:

```ts
data: {
  isDeleted: true,
}
```

Flow:

```text
DELETE Review
↓
Ownership or ADMIN permission checked
↓
isDeleted becomes true
↓
Review stays in PostgreSQL
↓
Normal GET requests no longer return it
```

---

## Safe User and Product Relations

GET Review requests return only useful public relation fields:

```ts
include: {
  product: {
    select: {
      id: true,
      name: true,
    },
  },
  user: {
    select: {
      id: true,
      name: true,
    },
  },
}
```

The User password is never selected.

The API does not return:

```text
password
email
role
isDeleted
```

through the Review User relation.

---

## Review Security Flow

```text
Create Review
↓
auth
↓
authorize("USER")
↓
userId from verified JWT
↓
allowed fields saved
```

```text
Update or Delete Review
↓
auth
↓
find active Review
↓
missing or deleted → 404
↓
ADMIN → allowed
↓
owner USER → allowed
↓
different USER → 403
```

---

## Current Review Security Status

```text
Review model exists                    ✅
Review relations exist                ✅
Public active Review GET routes       ✅
Authenticated Review creation         ✅
Create route restricted to USER       ✅
userId comes from verified JWT        ✅
Request body fields are restricted    ✅
Owner can update own Review            ✅
Owner can delete own Review            ✅
Other USER receives 403               ✅
ADMIN can moderate Reviews            ✅
Missing/deleted Review returns 404    ✅
Soft delete preserved                 ✅
Password hashes are never returned    ✅
```

---

## TypeScript and Prisma Checks

The completed Review changes were checked with:

```bash
npm run typecheck
npm run build
npx prisma validate
```

Results:

```text
TypeScript typecheck passed ✅
Production build passed     ✅
Prisma schema valid         ✅
```

---

## Git Commit

Check the changed files:

```bash
git status
```

Stage the current backend and README changes:

```bash
git add .
```

Create the commit:

```bash
git commit -m "secure category product and review routes"
```

Push the commit:

```bash
git push
```

---

# Secure Order Pricing and Transactional Stock Updates

This stage improves the existing authenticated Order creation flow.

Previously, the frontend sent:

```json
{
  "userId": "USER_UUID",
  "totalPrice": 1,
  "items": [
    {
      "productId": "PRODUCT_UUID",
      "quantity": 2,
      "price": 0.5
    }
  ]
}
```

This was unsafe because a client could change:

```text
userId
totalPrice
items[].price
```

The backend must treat all client input as untrusted.

---

## New Order Request Body

The frontend now sends only Product IDs and quantities:

```json
{
  "items": [
    {
      "productId": "PRODUCT_UUID",
      "quantity": 2
    }
  ]
}
```

The frontend no longer decides:

```text
Order owner
Product price
Order total price
Remaining stock
```

---

## Get the User From the Verified JWT

The Order route is still protected by:

```ts
auth
```

The route passes the authenticated User ID separately:

```ts
const order = await orderService.createOrder({
  userId: req.user!.id,
  items: req.body.items,
});
```

The route does not use:

```ts
req.body.userId
```

Flow:

```text
JWT
↓
auth middleware
↓
req.user.id
↓
Order userId
```

---

## Validate Order Items

Before starting database work, the service checks:

```text
items is an array
items is not empty
productId is a valid UUID
quantity is an integer
quantity is greater than zero
the same Product is not repeated
```

Examples of rejected quantities:

```text
0
-1
1.5
```

Invalid Order input returns a clean JSON error instead of creating an incomplete Order.

---

## Fetch Product Data From PostgreSQL

The service fetches the requested Products with Prisma:

```ts
const products = await tx.product.findMany({
  where: {
    id: {
      in: [...productIds],
    },
  },
  select: {
    id: true,
    price: true,
    stock: true,
    status: true,
    isDeleted: true,
  },
});
```

The database is now the trusted source for:

```text
Product price
Product stock
Product status
Product soft-delete state
```

---

## Reject Unavailable Products

Order creation rejects a Product when:

```text
Product does not exist
Product is soft deleted
Product status is not ACTIVE
Requested quantity exceeds stock
```

Responses use:

```text
404 → Product missing or deleted
400 → Product inactive or invalid request
409 → Insufficient stock
```

---

## Use Database Product Prices

Each OrderItem is built from the Product returned by Prisma:

```ts
return {
  productId: product.id,
  quantity: item.quantity,
  price: product.price,
};
```

Even if a malicious client sends:

```json
{
  "price": 0.01
}
```

that value is ignored.

The saved OrderItem price always comes from:

```text
PostgreSQL Product.price
```

---

## Calculate `totalPrice` on the Server

The backend calculates the total:

```ts
const totalPrice = orderItems.reduce(
  (total, item) => total + item.price * item.quantity,
  0
);
```

Formula:

```text
OrderItem total = database price × requested quantity

Order totalPrice = sum of all OrderItem totals
```

The client cannot choose the final Order price.

Order PATCH also no longer accepts `totalPrice`, so a client cannot change the calculated value afterward.

---

## Prevent Negative Stock

Stock is reduced with a conditional Prisma update:

```ts
const stockUpdate = await tx.product.updateMany({
  where: {
    id: item.productId,
    isDeleted: false,
    status: "ACTIVE",
    stock: {
      gte: item.quantity,
    },
  },
  data: {
    stock: {
      decrement: item.quantity,
    },
  },
});
```

The important condition is:

```ts
stock: {
  gte: item.quantity,
}
```

Stock is decremented only when enough stock still exists.

This protects against two requests trying to buy the final stock at the same time.

If the conditional update changes zero rows:

```ts
if (stockUpdate.count !== 1) {
  throw new OrderCreationError(
    "Insufficient product stock",
    409
  );
}
```

The transaction then rolls back.

---

## Prisma Transaction

Product checks, stock reductions, Order creation, and nested OrderItem creation run inside:

```ts
prisma.$transaction(async (tx) => {
  // Fetch Products
  // Validate availability and stock
  // Reduce stock
  // Calculate totalPrice
  // Create Order and OrderItems
});
```

The transaction provides all-or-nothing behavior:

```text
Everything succeeds
↓
stock is reduced
Order is created
OrderItems are created
```

or:

```text
Any step fails
↓
all database changes roll back
↓
no partial Order
no partial stock reduction
```

---

## Preserve Nested OrderItem Creation

The existing Prisma relation is preserved:

```ts
return tx.order.create({
  data: {
    userId: data.userId,
    totalPrice,
    orderItems: {
      create: orderItems,
    },
  },
  include: {
    orderItems: {
      include: {
        product: true,
      },
    },
  },
});
```

The response still includes:

```text
Order
↓
OrderItems
↓
related Product data
```

---

## Secure Order Creation Flow

```text
POST /api/orders
↓
auth verifies JWT
↓
userId comes from req.user.id
↓
validate items and quantities
↓
start Prisma transaction
↓
fetch Products from PostgreSQL
↓
reject missing/deleted/inactive Products
↓
check stock
↓
use database Product prices
↓
conditionally reduce stock
↓
calculate totalPrice on server
↓
create Order and nested OrderItems
↓
commit transaction
```

---

## Current Secure Order Status

```text
POST Order requires authentication       ✅
userId comes from verified JWT           ✅
Client totalPrice is ignored             ✅
Client OrderItem price is ignored        ✅
Items array is validated                 ✅
Quantities must be positive integers     ✅
Duplicate Products are rejected          ✅
Products are fetched with Prisma         ✅
Missing Products are rejected            ✅
Deleted Products are rejected            ✅
Inactive Products are rejected           ✅
Stock is checked                         ✅
Database Product prices are used         ✅
totalPrice is calculated on server       ✅
Product stock is reduced                 ✅
Negative stock is prevented              ✅
Order creation uses a transaction        ✅
Nested OrderItems are preserved          ✅
```

---

## TypeScript and Prisma Checks

The secure Order changes were checked with:

```bash
npm run typecheck
npm run build
npx prisma validate
```

Results:

```text
TypeScript typecheck passed ✅
Production build passed     ✅
Prisma schema valid         ✅
```

---

## Git Commit and Push

```bash
git status
git add README.md src/routes/order.route.ts src/services/order/order.service.ts
git commit -m "secure order pricing and stock updates"
git push
```
