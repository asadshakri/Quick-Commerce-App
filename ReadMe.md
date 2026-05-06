# 🛒 Quick-Commerce Prototype – API Documentation

Built a q-commerce prototype with JWT-based authentication and cart/order management. Payments are handled via Cashfree, with order placed only after successful payment. Simulated Delivery using Socket.IO is integrated to see live location of Delivery. Chat with Store functionality using Socket.IO is also implemented. Developed Admin Dashboard to add and manage products. This application is deployed on AWS EC2 instance using jenkins tool.

## 🎥 Demo 
[https://www.loom.com/share/07755a0c9f61425c9e58abc0e67734fa](https://www.loom.com/share/07755a0c9f61425c9e58abc0e67734fa)


## 🚀 Features

🔐 JWT-based authentication (Admin & User)

🛍️ Cart & Order management

💳 Payment integration (Cashfree)

📍 Real-time delivery tracking (Socket.IO)

💬 Chat with store (Socket.IO)

🧑‍💼 Admin dashboard for product management

☁️ Deployed on AWS EC2 using Jenkins


## 🧱 Tech Stack

Backend - Node.js (Express.js)
Frontend - HTML, CSS, JavaScript
Database - MongoDB (ODM- Mongoose)

## ⚙️ Setup Instructions

* Install all the dependencies from package.json file
```
npm install
```
* Create .env file to store the environment variables.
```
PORT=
TOKEN=
MONGO_URL=
DB_NAME=
PROTOCOL=
AWS_ACCESS_KEY=
AWS_SECRET_KEY=
AWS_BUCKET_NAME=
AWS_REGION=
HOST=
CASHFREE_API_KEY=
CASHFREE_API_SECRET=
BREVO_API_KEY=
```
* Run the application
```
node app.js
```

## 📡 API Endpoints

# 1. Admin Routes

## POST /admin/login

### Body

```json
{
  "email": "admin@gmail.com",
  "password": "admin123"
}
```

### Response

```json
{
  "message": "Admin login successful",
  "token": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "email": "admin@gmail.com"
}
```

---

## POST /admin/addProduct

### Body

```json
{
  "name": "Iphone 17",
  "description": "Smart Phone",
  "price": 70000,
  "imageUrl": "https://example.com/image.jpg"
}
```

### Response

```json
{
  "message": "Product added successfully",
  "productId": "699c1cfb437375bf8f18c630"
}
```

---

## GET /admin/product/:productId

### Response

```json
{
  "_id": "699c1cfb437375bf8f18c630",
  "name": "Head Phone",
  "price": 7000,
  "description": "Electronics",
  "imageUrl": "https://unixindia.in/...",
  "__v": 0
}
```

---

## PUT /admin/editProduct

### Body

```json
{
  "_id": "699c1cfb437375bf8f18c630",
  "name": "Head Phone",
  "price": 6000,
  "description": "Electronics",
  "imageUrl": "https://unixindia.in/..."
}
```

### Response

```json
{
  "message": "Product updated successfully"
}
```

---

## DELETE /admin/deleteProduct/:productId

### Response

```json
{
  "message": "Product deleted successfully"
}
```

---

## GET /admin/getAllOrders

### Response

```json
[
  {
    "_id": "699b5564779101c623c22fde",
    "status": "DELIVERED",
    "user": {
      "userId": "699870b965ab68b1bce8c790",
      "name": "asad"
    }
  }
]
```

---

## GET /admin/getOrder/:orderId

### Response

```json
{
  "_id": "699d7e0373175a533719212a",
  "deliveryLocation": {
    "lat": 25.5813,
    "lng": 85.0838
  }
}
```

---

## POST /admin/logout

### Response

```json
{
  "message": "Admin logged out successfully"
}
```

---

# 2. Customer Routes

## POST /user/signup

### Body

```json
{
  "name": "shakri",
  "email": "shakri@gmail.com",
  "password": "xxxxxx",
  "phone": "123456748",
  "address": "Delhi"
}
```

### Response

```json
{
  "message": "User registered successfully"
}
```

---

## POST /user/login

### Body

```json
{
  "email": "asad@gmail.com",
  "password": "xxxxxx"
}
```

### Response

```json
{
  "message": "login successful",
  "token": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "email": "asad@gmail.com"
}
```

---

## GET /user/getProducts

### Response

```json
[
  {
    "_id": "699c1cfb437375bf8f18c630",
    "name": "Head Phone",
    "price": 6000,
    "description": "Electronics",
    "imageUrl": "https://unixindia.in/..."
  }
]
```

---

## POST /user/addToCart

### Body

```json
{
  "productId": "699c1cfb437375bf8f18c630"
}
```

### Response

```json
{
  "message": "Product added to cart"
}
```

---

## GET /user/getCart

### Response

```json
{
  "cartProducts": [
    {
      "productId": {
        "name": "Head Phone",
        "price": 6000
      },
      "quantity": 1
    }
  ],
  "totalPrice": 6000
}
```

---

## DELETE /user/deleteCart/:productId

### Response

```json
{
  "message": "Item removed from cart"
}
```

---

## POST /user/checkout

### Body

```json
{
  "lat": 26.5813,
  "lng": 81.083
}
```

### Response

```json
{
  "message": "Order created, proceed to payment",
  "orderId": "699b5564779101c623c22fde"
}
```

---

## GET /user/getOrders

### Response

```json
[
  {
    "_id": "699b5564779101c623c22fde",
    "status": "DELIVERED",
    "receiptUrl": "https://s3-url"
  }
]
```

---

## GET /user/receipt/:orderId

### Response

```json
{
  "downloadUrl": "https://s3-url"
}
```

---

## GET /user/profile

### Response

```json
{
  "name": "Asad",
  "email": "asad@gmail.com",
  "phone": "9876543210",
  "address": "Patna"
}
```

---

## PATCH /user/updateProfile

### Body

```json
{
  "name": "AsadS",
  "phone": "9999999999",
  "address": "Delhi"
}
```

### Response

```json
{
  "message": "Profile updated successfully"
}
```

---

## DELETE /user/deleteUser

### Response

```json
{
  "message": "User deleted successfully"
}
```

---

## PATCH /user/changePassword

### Body

```json
{
  "oldPassword": "xxxx",
  "newPassword": "yyyy"
}
```

### Response

```json
{
  "message": "Password changed successfully"
}
```

---

## POST /user/logout

### Response

```json
{
  "message": "User logged out"
}
```

---

# 3. Message/Media/Chat Routes

## POST /message/add

### Body

```json
{
  "message": "hi",
  "roomName": "user1-user2"
}
```

### Response

```json
{
  "message": "Message sent successfully"
}
```

---

## GET /message/get/:roomName

### Response

```json
{
  "messages": [
    {
      "message": "hi",
      "user": { "name": "asad" }
    }
  ]
}
```

---

## POST /media/upload

### Body

Form-data:

* file (binary)
* roomName (string)

### Response

```json
{
  "message": "File uploaded successfully"
}
```

---

## GET /chat/list

### Response

```json
{
  "chatList": [
    {
      "id": "699870b965ab68b1bce8c790",
      "name": "asad",
      "email": "asad@gmail.com"
    }
  ]
}
```

---

# 4. Payment Routes

## GET /paymentPage

### Response

```html
<html>Payment Page</html>
```

---

## POST /pay

### Body

```json
{
  "orderId": "699870b965ab68b1bce8c790"
}
```

### Response

```json
{
  "paymentSessionId": "xxxxxxxxxxxxxx",
  "paymentId": "xxxxxxxxxxxxx"
}
```

---

## GET /payment-status/:orderId

### Response

```json
{
  "orderStatus": "Success",
  "paymentId": "ORDER-1771929365663"
}
```

---

## 📌 Notes

* Orders are created only after successful payment.
* Real-time delivery tracking using Socket.IO.
* Chat supports text and media.


