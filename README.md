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
"./app.js"
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
schema: "prisma/schema.prisma"
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
