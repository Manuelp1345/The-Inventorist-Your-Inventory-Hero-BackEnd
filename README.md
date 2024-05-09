# The-Inventorist-Your-Inventory-Hero-Back-End

This is the back-end of the The Inventorist app, a simple inventory management system that allows users to keep track of their products and their quantities. The app is built with Node.js, Express, and MariaDB.

## How to Run the App

To run the app, follow these steps:

clone the repository

```bash
git clone https://github.com/Manuelp1345/The-Inventorist-Your-Inventory-Hero-BackEnd.git
```

```bash
cd the-inventorist-your-inventory-hero-backend
```

install the dependencies and create the database

```bash
npm install
```

1. Create a dabaase in MariaDB with the name.
2. Create a `.env` file in the root directory of the project and add the following environment variables:

```

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=your_database_name
JWT_SECRET=your_secret

```

3. Run the following commands:

```bash

npm run dev
```

The app will be running at `http://localhost:3000`.

## API Documentation

For detailed information on the available API endpoints and how to use them, please refer to the [API documentation](/E:/Programacion/the-inventorist-your-inventory-hero-backend/API.md).
