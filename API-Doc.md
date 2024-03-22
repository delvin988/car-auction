# o>>> Auto Bid  <<<o

# Auto Bid Documentation
  Description
  Auto Bid is an Project for managing a collection of car, allowing users to buy, sell, and view details about their car.This documentation provides details on the available endpoints and how to use them.

# Getting Started
 To get started with the Auto Bid, follow these steps:

# Clone the repository.
  - Install dependencies using npm install.
  - Set up the database by running migrations with npm  run migrate.
  - Start the server with npm start / nodemon.


# o>>> Explore the Project endpoints detailed below. <<<o


# END POINTS

## POST /register

### Request Body

```json
{
    "email": <String>,
    "password": <String>,
    "firstName": <String>,
    "lastName": <String>,
    "role": <String>
}
```

### Response (201)

```json
{
  "id": 3,
  "email": "jane.smith@example.com"
}
```

### Response (400 - Bad Request - Password null or empty)

```json
{
  "message": "Password is required."
}
```

### Response (400 - Bad Request - Email is already registered)

```json
{
  "message": "Email already registered."
}
```

### Response (400 - Bad Request - Email is not in email format)

```json
{
  "message": "Must be in Email format."
}
```

### Response (400 - Bad Request - Email is null or empty)

```json
{
  "message": "Email is required."
}
```

## POST /login

### Request Body

```json
{
    "email": <String>,
    "password": <String>,
}
```

### Response (200)

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNzAxMTA3OTQ1fQ.oQDKqrF8aU0T_Gj5EeiCLRUfivD3Pomg1AynKP7wdPI"
}
```

### Response (400 - Bad Request - Email is null or empty)

```json
{
  "message": "Email is required."
}
```

### Response (400 - Bad Request - Password is null or empty)

```json
{
  "message": "Password is required."
}
```

### Response (401 - Bad Request - Password is null or empty)

```json
{
  "message": "Invalid email/password."
}
```

## GET /users

### Request User

```json
{
  "id": 1
}
```

### Response (200)

```json
{
  "id": 2,
  "email": "jane.smith@example.com",
  "firstName": "Jane",
  "lastName": "Smith",
  "role": "admin",
  "createdAt": "2024-02-21T05:19:23.143Z",
  "updatedAt": "2024-02-21T05:19:23.143Z"
}
```

## PUT /users

### Request User

```json
{
  "id": 1
}
```

### Request Body

```json
{
    "email":  <String>,
    "name":  <String>,
    "lastName":  <String>,
    "firstName":  <String>
 }
```

### Response (200)

```json
{
  "message": "Profile updated"
}
```

### Response (400 - Bad Request - Email is null)

```json
{
  "message": "Email is required"
}
```

### Response (400 - Bad Request - Email is already registered)

```json
{
  "message": "Email already registered"
}
```

### Response (400 - Bad Request - Email is not in email format)

```json
{
  "message": "Must be in Email format"
}
```

## GET /items

### Response (200)

```json
[
  {
    "id": 1,
    "name": "Nissan GT-R Skyline R34",
    "description": "Legenda mobil sport Jepang yang terkenal dengan kinerja dan keindahannya.",
    "imageUrl": "https://theitemdb.com/nissan_gtr_skyline_r34.jpg",
    "price": 1200000000,
    "createdAt": "2024-02-21T05:20:31.141Z",
    "updatedAt": "2024-02-21T05:20:31.141Z"
  },
  {
    "id": 2,
    "name": "Porsche 911",
    "description": "Ikon mobil sport Jerman dengan desain yang klasik dan performa yang luar biasa.",
    "imageUrl": "https://theitemdb.com/porsche_911.jpg",
    "price": 1500000000,
    "createdAt": "2024-02-21T05:20:31.141Z",
    "updatedAt": "2024-02-21T05:20:31.141Z"
  },
  {
    "id": 3,
    "name": "Toyota Supra",
    "description": "Coupe sport yang legendaris dengan kinerja yang luar biasa.",
    "imageUrl": "https://theitemdb.com/toyota_supra.jpg",
    "price": 900000000
    "createdAt": "2024-02-21T05:20:31.141Z",
    "updatedAt": "2024-02-21T05:20:31.141Z"
  },
  
  ...
]
```

## GET /items/:id

### Response (200)

```json
{
    "id": 1,
    "name": "Nissan GT-R Skyline R34",
    "description": "Legenda mobil sport Jepang yang terkenal dengan kinerja dan keindahannya.",
    "imageUrl": "https://theitemdb.com/nissan_gtr_skyline_r34.jpg",
    "price": 1200000000,
    "createdAt": "2024-02-21T05:20:31.141Z",
    "updatedAt": "2024-02-21T05:20:31.141Z"
}
```

### Response (404 - Not Found - Item id is not registered)

```json
{
  "message": "Item not Found"
}
```

## GET /items

### Request User

```json
{
  "id": 2
}
```

### Response (200)

```json
{
[
  {
    "id": 4,
    "amount": "300000",
    "UserId": 2,
    "ItemId": 1,
    "createdAt": "2024-02-21T05:20:31.172Z",
    "updatedAt": "2024-02-21T05:20:31.172Z"
  },
  {
    "id": 5,
    "amount": "200000",
    "UserId": 2,
    "ItemId": 3,
    "createdAt": "2024-02-21T05:20:31.172Z",
    "updatedAt": "2024-02-21T05:20:31.172Z"
  },
  {
    "id": 6,
    "amount": "400000",
    "UserId": 2,
    "ItemId": 3,
    "createdAt": "2024-02-21T05:20:31.172Z",
    "updatedAt": "2024-02-21T05:20:31.172Z"
  }
]
}
```

## POST /items/:ItemId

### Request Params

```json
{
  "ItemId": 1
}
```

### Request User

```json
{
  "id": 6
}
```

### Response (201)

```json
{
  "id": 11,
  "ItemId": 1,
  "UserId": 6,
  "updatedAt": "2024-02-21T17:56:37.035Z",
  "createdAt": "2024-02-21T17:56:37.035Z",
  "amount": "10000000"
}
```

### Response (404 - Not Found - Item id is not registered)

```json
{
  "message": "Item not Found"
}
```

## DELETE /items/:id

### Request Params

```json
{
  "id": 11
}
```

### Request User

```json
{
  "id": 6
}
```

### Response (200)

```json
{
  "message": "Order canceled"
}
```

### Response (404 - ErrorNotFound - Order id is not registered)

```json
{
  "message": "Item not Found"
}
```

### Response (403 - forbiddenforadmin - UserId is not bid bidder or admin)

```json
{
  "message": "Only Bidder can do this."
}
```

## GLOBAL ERROR

### Response (500 - Internal Server Error)

```json
{
  "message": "Internal Server Error"
}
```

### Response (401 - Unauthorized)

```json
{
  "message": "Invalid Token"
}
```

### Response (403 - Forbidden)

```json
{
  "message": "Forbidden Access"
}
```