# Full Stack E-Commerce + Dashboard & CMS: Next.js 13 App Router, React, Tailwind, Prisma, MySQL, 2023

For DEMO, use [Stripe Testing Cards](https://stripe.com/docs/testing)

This is a repository for a Full Stack E-Commerce + Dashboard & CMS: Next.js 13 App Router, React, Tailwind, Prisma, MySQL

Key Features:

- **Next.js Frontend:** A fast, dynamic, and SEO-friendly frontend for your e-commerce store.
- **Node.js & Express Backend:** A scalable backend for handling API requests and business logic.
- **Prisma & MySQL:** Secure and efficient data storage with type-safe database access.
- **Authentication:** Secure authentication using Clerk for the admin dashboard (CMS) and Firebase for the store.
- **E-commerce Functionality:** Browse products, add to cart, and complete purchases with a seamless checkout process.
- **Content Management System (CMS):** Easily manage website content, products, categories, and pages with the built-in CMS.
- **Contributions:** Developers, designers, and contributors are welcome to enhance and maintain this project.

## Getting Started

Follow these instructions to get the project up and running on your local machine.

### Prerequisites

**Node version 14.x**

### Cloning the repository

```shell
git clone https://github.com/Ardianii1/Lab2.git
```

### Install packages

```shell
npm i
```

### Setup .env file


```js
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# This was inserted by `prisma init`:
# Environment variables declared in this file are automatically made available to Prisma.
# See the documentation for more detail: https://pris.ly/d/prisma-schema#accessing-environment-variables-from-the-schema

# Prisma supports the native connection string format for PostgreSQL, MySQL, SQLite, SQL Server, MongoDB and CockroachDB.
# See the documentation for all the connection string options: https://pris.ly/d/connection-strings

DATABASE_URL=''
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=""
STRIPE_API_KEY=
FRONTEND_STORE_URL=http://localhost:3002
STRIPE_WEBHOOK_SECRET=
```

### Connect to PlanetScale and Push Prisma
```shell
npx prisma generate
npx prisma db push
```


### Start the app

```shell
npm run dev
```

## Available commands

Running commands with npm `npm run [command]`

| command         | description                              |
| :-------------- | :--------------------------------------- |
| `dev`           | Starts a development instance of the app |
