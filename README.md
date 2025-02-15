# Kanban API

A simple Kanban board API built with Node.js, Express, and MySQL.

## Installation

### 1. Set up the MySQL database
```sql
CREATE DATABASE kanban CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Install dependencies
```sh
cd kanban-backend
```

## Environment Variables
Create `.env.development` and `.env.production` files to configure different environments. Example:
```env
DB_HOST=localhost
DB_USER=user
DB_PASSWORD=password
DB_NAME=kanban
```

```sh
npm install
```

### 3. Initialize Knex
```sh
npx knex init
```

### 4. Run migrations
```sh
npx knex migrate:latest
```

### 5. Start the development server
```sh
npm run dev
```




