# 📚 Library Management System API

A simple and clean Library Management System API — built with **TypeScript**, **Express.js**, and **MongoDB (Mongoose)**.

## Key Features :

- Create, retrieve, update, and delete books.
- Borrow books while enforcing availability constraints.
- View a summary of borrowed books via MongoDB aggregation.
- Input validation and business logic control.
- Mongoose static methods, instance methods, and middleware integration.
- Clean error handling with structured JSON responses.
- Filtering, sorting, and pagination for book listings.

## Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/library-management-api.git
   cd library-management-api

2. **Install dependencies**
    ```bash
    npm install

3. **Create .env file**
    ```bash
    MONGO_USERNAME=
    MONGO_PASSWORD=
    DATABASE_NAME=
    PORT=5000

4. **Run development server**
    ```bash
    npm run dev

5. **Build production code**
    ```bash
    npm run build

6. **Start production server**
    ```bash
    npm start


## API Endpoints & Details

## Book Endpoints

### Create Book

**POST** `/api/books`

**Request Body:**

```json
{
  "title": "The Theory of Everything",
  "author": "Stephen Hawking",
  "genre": "SCIENCE",
  "isbn": "9780553380163",
  "description": "An overview of cosmology.",
  "copies": 5
}
```

**Response:**

```json
{
  "success": true,
  "message": "Book created successfully",
  "data": { ... }
}
```

### Get All Books

**GET** `/api/books`

**Query Parameters:**

- filter — Filter by genre

- sortBy — Field to sort by (createdAt, title, etc.)

- sort — asc | desc

- limit — Number of results to retrieve

**Example**
```bash
/api/books?filter=FANTASY&sortBy=createdAt&sort=desc&limit=5
```

**Response:**
```json
{
  "success": true,
  "message": "Books retrieved successfully",
  "data": [ ... ]
}
```

### Get Single Book

**GET** `/api/books/:bookId`

**Response:**
```json
{
  "success": true,
  "message": "Book retrieved successfully",
  "data": { ... }
}
```

### Update Book

**PATCH** `/api/books/:bookId`

**Request Body:**
```json
{
  "copies": 50
}
```

**Response:**
```json
{
  "success": true,
  "message": "Book updated successfully",
  "data": { ... }
}
```

### Delete Book

**DELETE** `/api/books/:bookId`

**Response:**
```json
{
  "success": true,
  "message": "Book deleted successfully",
  "data": null
}
```


## Borrow Endpoints

### Borrow Book

**POST** `/api/borrow`

**Request Body:**

```json
{
  "book": "64ab3f9e2a4b5c6d7e8f9012",
  "quantity": 2,
  "dueDate": "2025-07-18T00:00:00.000Z"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Book borrowed successfully",
  "data": { ... }
}
```

### Borrow Summary

**GET** `/api/borrow`

**Request Body:**

**Response:**

```json
{
  "success": true,
  "message": "Borrowed books summary retrieved successfully",
  "data": [
    {
      "book": {
        "title": "The Theory of Everything",
        "isbn": "9780553380163"
      },
      "totalQuantity": 5
    }
  ]
}
```