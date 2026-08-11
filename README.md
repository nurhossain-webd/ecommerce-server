# E-Commerce Backend API

A REST API for an e-commerce application built with Express, TypeScript, PostgreSQL, and Prisma ORM. It provides authentication, role-based permissions, soft-deleted resources, product reviews, secure order pricing, transactional stock updates, reusable request validation, and centralized JSON error handling.

The longer step-by-step learning notes are available in `READMEToLearnBackend.md`.

## Technologies

- Node.js
- Express 5
- TypeScript
- PostgreSQL
- Prisma ORM 7
- `@prisma/adapter-pg`
- bcrypt
- JSON Web Token (JWT)
- Zod
- dotenv
- CORS

## Folder Structure

```text
ecommerce-server/
├── prisma/
│   ├── migrations/
│   └── schema.prisma
├── src/
│   ├── generated/prisma/       # Generated Prisma Client
│   ├── lib/
│   │   └── prisma.ts
│   ├── middleware/
│   │   ├── auth.middleware.ts
│   │   ├── authorize.middleware.ts
│   │   ├── error.middleware.ts
│   │   └── validate.middleware.ts
│   ├── routes/
│   │   ├── auth.route.ts
│   │   ├── category.route.ts
│   │   ├── order.route.ts
│   │   ├── product.route.ts
│   │   ├── review.route.ts
│   │   └── user.route.ts
│   ├── services/
│   │   ├── auth/
│   │   ├── category/
│   │   ├── order/
│   │   ├── product/
│   │   ├── review/
│   │   └── user/
│   ├── types/
│   │   └── express.d.ts
│   ├── validations/
│   │   ├── auth.validation.ts
│   │   ├── category.validation.ts
│   │   ├── common.validation.ts
│   │   ├── order.validation.ts
│   │   ├── product.validation.ts
│   │   ├── review.validation.ts
│   │   └── user.validation.ts
│   ├── app.ts
│   └── server.ts
├── tests/
│   └── security.integration.mjs
├── .env
├── package.json
├── prisma.config.ts
└── tsconfig.json
```

## Installation

Requirements:

- Node.js
- npm
- A PostgreSQL database

Install dependencies:

```bash
npm install
```

Create a `.env` file in the project root using placeholders only:

```env
PORT=5001
DATABASE_URL="postgresql://DATABASE_USER:DATABASE_PASSWORD@DATABASE_HOST:5432/DATABASE_NAME?sslmode=verify-full"
JWT_SECRET="REPLACE_WITH_A_LONG_RANDOM_SECRET"
```

Never commit the real `.env` file or production credentials.

## Prisma Setup

Validate the Prisma schema:

```bash
npx prisma validate
```

Generate Prisma Client:

```bash
npx prisma generate
```

Create and apply a development migration:

```bash
npx prisma migrate dev --name YOUR_MIGRATION_NAME
```

Apply existing migrations in production:

```bash
npx prisma migrate deploy
```

Check migration status:

```bash
npx prisma migrate status
```

Open Prisma Studio:

```bash
npx prisma studio
```

## Running the Application

Development with automatic restart:

```bash
npm run dev
```

Type-check:

```bash
npm run typecheck
```

Production build and start:

```bash
npm run build
npm start
```

Default URL:

```text
http://localhost:5001
```

## Authentication

Users log in with email and password:

```http
POST /api/auth/login
```

The response contains safe User data and a JWT. The password hash is never returned.

Protected routes require:

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

### bcrypt Flow

When a User is created:

```text
plain password
→ bcrypt.hash(password, 10)
→ password hash stored in PostgreSQL
```

During login:

```text
submitted password
→ bcrypt.compare(submittedPassword, storedHash)
→ login succeeds only when they match
```

Plain-text passwords are never stored.

### JWT Flow

After successful login, the server signs a token containing:

```json
{
  "id": "USER_UUID",
  "role": "USER"
}
```

The token expires after seven days.

```text
Login
→ verify password
→ sign JWT with JWT_SECRET
→ client stores token
→ client sends Bearer token
→ auth middleware verifies token
```

### Authentication Middleware

The `auth` middleware:

1. Requires the Bearer authorization scheme.
2. Verifies the JWT signature and expiration.
3. Validates the decoded User ID and role.
4. Loads the current active User from PostgreSQL.
5. Rejects deleted or missing Users.
6. Stores the current `id` and database role in `req.user`.

Missing, malformed, invalid, or expired tokens return JSON with HTTP `401`.

## Role Authorization

The reusable middleware accepts allowed roles:

```ts
authorize("ADMIN")
authorize("USER")
authorize("USER", "ADMIN")
```

Middleware order is important:

```text
auth
→ req.user created
→ authorize checks req.user.role
→ route handler
```

An authenticated User without the required role receives HTTP `403`.

### USER vs ADMIN Permissions

| Resource | USER | ADMIN |
|---|---|---|
| Users | No management access | Full User management |
| Categories | Public read only | Read, create, update, soft delete |
| Products | Public read only | Read, create, update, soft delete |
| Orders | Create and manage own Orders | Current routes still use owner access |
| Reviews | Create and manage own Reviews | Update/delete any active Review |

Only `USER` accounts create customer Reviews. ADMIN accounts moderate existing Reviews.

## Ownership Protection

Order routes never trust a frontend `userId`.

```text
verified JWT
→ req.user.id
→ Order userId
```

Order reads, updates, and deletes filter by:

```text
Order ID
authenticated User ID
isDeleted = false
```

A User cannot read, update, or delete another User's Order. A missing, deleted, or foreign-owned Order returns the same clean `404` response.

Review update/delete follows a similar ownership check:

- The Review owner may update or delete it.
- A different USER receives `403`.
- ADMIN may moderate any active Review.

## Prisma Relations

The main relations are:

```text
User 1 ─── many Orders
User 1 ─── many Reviews
Category 1 ─── many Products
Product 1 ─── many Reviews
Order 1 ─── many OrderItems
Product 1 ─── many OrderItems
```

Foreign-key fields use UUIDs and are indexed where appropriate.

### `include`

`include` loads related records with the main record:

```ts
include: {
  category: true,
}
```

This returns a Product together with its Category.

### Nested `include`

Nested includes load relations inside relations:

```ts
include: {
  orderItems: {
    include: {
      product: true,
    },
  },
}
```

This returns an Order, its OrderItems, and each OrderItem's Product.

### `omit`

`omit` removes sensitive or unnecessary fields:

```ts
user: {
  omit: {
    password: true,
  },
}
```

User and Order responses never expose password hashes. Review relations use `select` to return only the User `id` and `name`.

## Soft Delete

User, Category, Product, Review, and Order models contain:

```prisma
isDeleted Boolean @default(false)
```

Delete operations update `isDeleted` instead of physically removing the row:

```ts
data: {
  isDeleted: true,
}
```

Normal reads filter with:

```ts
where: {
  isDeleted: false,
}
```

Deleted Users cannot log in or continue using previously issued tokens. Deleted Products cannot be ordered, and deleted Orders cannot be modified.

## Order and OrderItem Relationship

An Order stores overall information:

- Owner (`userId`)
- Status
- Server-calculated `totalPrice`
- Soft-delete state

An OrderItem stores one Product line:

- `orderId`
- `productId`
- Quantity
- Product price captured when the Order was placed

Nested Prisma creation connects OrderItems to the newly created Order automatically.

## Secure Order Price Calculation

The client sends only Product IDs and quantities:

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

The backend does not trust client-supplied:

- `userId`
- `totalPrice`
- `items[].price`

The server fetches each active Product from PostgreSQL, uses its database price, creates OrderItem prices, and calculates:

```text
totalPrice = sum(Product.price × quantity)
```

Order PATCH requests also cannot change `totalPrice`.

## Stock Handling

Order creation runs inside a Prisma interactive transaction:

```text
validate items
→ fetch Products
→ reject missing/deleted/inactive Products
→ verify available stock
→ conditionally decrement stock
→ calculate totalPrice
→ create Order and nested OrderItems
→ commit transaction
```

The stock update includes:

```ts
stock: {
  gte: requestedQuantity,
}
```

and uses an atomic decrement. If another request buys the final stock first, the losing request receives `409`, and the entire transaction rolls back. Stock cannot become negative through Order creation.

## Request Validation

Zod schemas validate route parameters and request bodies before business logic runs.

Validation covers:

- UUID route parameters
- User names, emails, and password lengths
- Login credentials
- Category and Product statuses
- Nonnegative Product prices and stock
- Positive integer Order quantities
- Review ratings from 1 to 5
- Required fields and allowed update fields

Schemas are strict. Unexpected fields such as User `role`, Order `userId`, Order `totalPrice`, and OrderItem `price` are rejected.

Validation failures return HTTP `400`:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "body.price",
      "message": "Price cannot be negative"
    }
  ]
}
```

## Centralized Error Handling

Express 5 automatically forwards rejected async handlers to the global error middleware.

The final middleware stack includes:

```text
routes
→ JSON 404 handler
→ global error handler
```

Common mappings include:

| Error | Status |
|---|---:|
| Invalid request or malformed JSON | 400 |
| Missing/invalid authentication | 401 |
| Insufficient role/ownership permission | 403 |
| Missing record or route | 404 |
| Duplicate unique value | 409 |
| Foreign-key/relation conflict | 409 |
| Insufficient stock | 409 |
| Unexpected server failure | 500 |

Unexpected failures return only:

```json
{
  "success": false,
  "message": "Internal server error"
}
```

Prisma internals and stack traces are not returned to clients.

## API Endpoints

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/` | Public | Server health response |
| POST | `/api/auth/login` | Public | Log in and receive JWT |
| GET | `/api/users` | ADMIN | Get active Users |
| GET | `/api/users/:id` | ADMIN | Get active User |
| POST | `/api/users` | ADMIN | Create USER account |
| PATCH | `/api/users/:id` | ADMIN | Update active User |
| DELETE | `/api/users/:id` | ADMIN | Soft delete User |
| GET | `/api/categories` | Public | Get active Categories |
| GET | `/api/categories/:id` | Public | Get active Category |
| POST | `/api/categories` | ADMIN | Create Category |
| PATCH | `/api/categories/:id` | ADMIN | Update Category |
| DELETE | `/api/categories/:id` | ADMIN | Soft delete Category |
| GET | `/api/products` | Public | Get active Products |
| GET | `/api/products/:id` | Public | Get active Product |
| POST | `/api/products` | ADMIN | Create Product |
| PATCH | `/api/products/:id` | ADMIN | Update Product |
| DELETE | `/api/products/:id` | ADMIN | Soft delete Product |
| GET | `/api/orders` | Authenticated | Get own active Orders |
| GET | `/api/orders/:id` | Owner | Get own active Order |
| POST | `/api/orders` | Authenticated | Create Order securely |
| PATCH | `/api/orders/:id` | Owner | Update own active Order status |
| DELETE | `/api/orders/:id` | Owner | Soft delete own Order |
| GET | `/api/reviews` | Public | Get active Reviews |
| GET | `/api/reviews/:id` | Public | Get active Review |
| POST | `/api/reviews` | USER | Create Review |
| PATCH | `/api/reviews/:id` | Owner/ADMIN | Update Review |
| DELETE | `/api/reviews/:id` | Owner/ADMIN | Soft delete Review |

## Example Request Bodies

### Login

```json
{
  "email": "user@example.com",
  "password": "your-password"
}
```

### Create User (ADMIN)

```json
{
  "name": "Example User",
  "email": "user@example.com",
  "password": "strong-password"
}
```

Clients cannot assign an ADMIN role through this request.

### Create Category (ADMIN)

```json
{
  "name": "Electronics",
  "status": "ACTIVE"
}
```

### Create Product (ADMIN)

```json
{
  "name": "Mechanical Keyboard",
  "description": "Hot-swappable keyboard",
  "price": 89.99,
  "stock": 20,
  "status": "ACTIVE",
  "categoryId": "CATEGORY_UUID"
}
```

### Create Order

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

### Update Order Status

```json
{
  "status": "CONFIRMED"
}
```

### Create Review (USER)

```json
{
  "rating": 5,
  "comment": "Excellent product",
  "productId": "PRODUCT_UUID"
}
```

## Important Problems and Solutions

| Problem | Solution |
|---|---|
| Plain passwords could be stored | Hash passwords with bcrypt before Prisma creation |
| Password hashes appeared through relations | Use Prisma `omit` or narrow `select` fields |
| Frontend could impersonate another User | Derive `userId` from verified JWT |
| Stale JWT remained valid after User deletion | Load the current active User in auth middleware |
| USER could access ADMIN routes | Apply `auth` followed by `authorize("ADMIN")` |
| User could access another User's Order | Filter by both Order ID and authenticated User ID |
| Frontend could fake Product and total prices | Read Product prices from PostgreSQL and calculate totals server-side |
| Concurrent Orders could oversell stock | Use a transaction and conditional atomic stock decrement |
| Deleted resources remained visible | Filter normal reads with `isDeleted: false` |
| Invalid bodies reached Prisma | Add strict reusable Zod schemas and validation middleware |
| Prisma/async failures returned HTML or internals | Add centralized JSON error handling and Prisma error mappings |
| Production build used ESM Prisma code under CommonJS | Set `package.json` to `"type": "module"` |

## Testing

Run TypeScript checks:

```bash
npm run typecheck
```

Build the project:

```bash
npm run build
```

Run the complete integration/security suite:

```bash
npm run test:security
```

The security suite uses uniquely named fixtures, tests the actual Express API and configured PostgreSQL database, and removes its test records in `finally`.

Coverage includes:

- Login success and failure
- Missing, malformed, invalid, and expired JWTs
- USER and ADMIN permissions
- Password leak detection
- Soft deletes
- Category and Product CRUD permissions
- Order ownership and fake IDs
- Database-derived pricing and totals
- Transaction rollback and concurrent stock protection
- Review ownership and ADMIN moderation
- Validation, duplicate values, and foreign keys
- JSON-only error responses

Check Prisma separately when needed:

```bash
npx prisma validate
npx prisma migrate status
```

Check dependency vulnerabilities:

```bash
npm audit
```
