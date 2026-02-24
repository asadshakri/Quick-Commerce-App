Quick-Commerce Prototype – API Documentation

Built a q-commerce prototype with JWT-based authentication and cart/order management. Payments are handled via Cashfree, with order placed only after successful payment. Simulated Delivery using Socket.IO is integrated to see live location of Delivery. Chat with Store functionality using Socket.IO is also implemented. Developed Admin Dashboard to add and manage products. This application is deployed on AWS EC2 instance using jenkins tool.

Tech Stack:-

Backend \- Node.js (Express.js)  
Frontend \- HTML, CSS, JavaScript  
Database \- MongoDB (ODM- Mongoose)

Steps run the application on local Machine-

* npm install   (Install all the dependencies from package.json file)  
* Create .env file to store the environment variables.  
* nodemon [app.js](http://app.js)

API ENDPOINT

1. Admin Routes

* POST /admin/login

Body                                                                       
{  
“email”: “[asadshakri3127@.com](mailto:asd@gmail.com)”  
“Password”: “admin123”  
}

Response  
{  
    message: "Admin login successful",  
    token: “xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx”,  
    email: “asadshakri3127@gmail.com”,  
 }

* POST /admin/addProduct

Body

{  
   “name”: "Iphone 17",   
   “description”: "Smart Phone",   
   “price”: 70000,  
   “imageUrl”: “xxxxxxxxxxxxxxxxxxxxxxxx”

}

* GET /admin/product/:productId

Response

{  
    "\_id": "699c1cfb437375bf8f18c630",  
    "name": "Head Phone",  
    "price": 7000,  
    "description": "Electronics",  
    "imageUrl": "https://unixindia.in/cdn/shop/files/01\_34af94b9-40d7-4956-805e-0cb7df907ef7.jpg?v=1747994450",  
    "\_\_v": 0  
}

* PUT /admin/editProduct

Body

{  
    "\_id": "699c1cfb437375bf8f18c630",  
    "name": "Head Phone",  
    "price": 6000,  
    "description": "Electronics",  
    "imageUrl": "https://unixindia.in/cdn/shop/files/01\_34af94b9-40d7-4956-805e-0cb7df907ef7.jpg?v=1747994450",  
}

* DELETE /admin/deleteProduct/:productId

* GET /admin/getAllOrders

Response

\[  
    {  
        "user": {  
            "userId": "699870b965ab68b1bce8c790",  
            "name": "asad"  
        },  
        "deliveryLocation": {  
            "lat": 25.581412273173303,  
            "lng": 85.08389152258657  
        },  
        "currentLocation": {  
            "lat": 25.581014800392506,  
            "lng": 85.08354453987619  
        },  
        "\_id": "699b5564779101c623c22fde",  
        "products": \[  
            {  
            {  
                "product": {  
                    "\_id": "699b525d89f45f1a03607269",  
                    "name": "Head Phone",  
                    "price": 4000,  
                },  
                "quantity": 2,  
                "\_id": "699b5564779101c623c22fe0"  
            }  
        \],  
        "status": "DELIVERED",  
    },  
    {........................}  
}

* GET /admin/getOrder/:orderId

Response  
{  
    "deliveryLocation": {  
        "lat": 25.581375899009778,  
        "lng": 85.0838028521236  
    },  
    "\_id": "699d7e0373175a533719212a"  
}

* POST /admin/logout




2. Customer Routes

* POST /user/signup

Body  
{  
    “address: "delhi",  
     “email”: "shakri@gmail.com".  
    “name”: "shakri",  
    “password”: “xxxxxxxx”   
    “phone”:  "123456748"

}

* POST /user/login

Body                                                                       
{  
“email”: “[asadshakri@.com](mailto:asd@gmail.com)”  
“Password”: “xxxxxx”  
}

Response  
{  
    message: "login successful",  
    token: “xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx”,  
    email: “asadshakri@gmail.com”,  
 }

* GET /user/getProducts

Response

\[  
    {  
        "\_id": "699c1cfb437375bf8f18c630",  
        "name": "Head Phone",  
        "price": 6000,  
        "description": "Electronics",  
        "imageUrl": "https://unixindia.in/cdn/shop/files/01\_34af94b9-40d7-4956-805e-0cb7df907ef7.jpg?v=1747994450",  
        "\_\_v": 0  
    },  
    {......}  
}

* POST /user/addToCart

Body  
{  
      “productId”: "699c1cfb437375bf8f18c630"  
}

* GET /user/getCart

Response  
{  
    "cartProducts": \[  
        {  
            "productId": {  
                "\_id": "699c1cfb437375bf8f18c630",  
                "name": "Head Phone",  
                "price": 6000,  
                "description": "Electronics",  
                "imageUrl": "https://unixindia.in/cdn/shop/files/01\_34af94b9-40d7-4956-805e-0cb7df907ef7.jpg?v=1747994450",  
                "\_\_v": 0  
            },  
            "quantity": 1,  
            "\_id": "699d7ccd73175a5337192115"  
        }  
    \],  
    "totalPrice": 6000  
}

* DELETE /user/deleteCart/:productId

* POST /user/checkout

Body  
{  
      lat: 26.5813,   
      lng: 81.083  
}

* GET /user/getOrders

Response

\[  
    {  
        "user": {  
            "userId": "699870b965ab68b1bce8c790",  
            "name": "asad"  
        },  
        "deliveryLocation": {  
            "lat": 25.581412273173303,  
            "lng": 85.08389152258657  
        },  
        "currentLocation": {  
            "lat": 25.581014800392506,  
            "lng": 85.08354453987619  
        },  
        "\_id": "699b5564779101c623c22fde",  
        "products": \[  
            {  
                "product": {  
                    "\_id": "699846e2bfa9cb8f730909a1",  
                    "name": "Iphone 17",  
                    "price": 60000,  
                    "description": "Smart Phone"  
                },  
                "quantity": 1,  
                "\_id": "699b5564779101c623c22fdf"  
            },  
        \],  
        "status": "DELIVERED",  
        "receiptUrl": "https://expense-tracker-07.s3.ap-south-1.amazonaws.com/Receipt/f5e07332-932f-4225-8c94-1499085121ba-699b5564779101c623c22fde.txt"  
    },  
    {.....................}  
}

* GET /user/receipt/:orderId

Response  
{  
    "downloadUrl": "https://expense-tracker-07.s3.ap-south-1.amazonaws.com/Receipt/f5e07332-932f-4225-8c94-1499085121ba-699b5564779101c623c22fde.txt"  
}

*  GET /user/profile

Response

{  
"name": "Asad",  
"email": "asad@gmail.com",  
"phone": "9876543210",  
"address": "Patna"  
}

* PATCH /user/updateProfile

Body  
{  
"name": "AsadS",  
"phone": "9999999999",  
"address": "Delhi"  
}

* DELETE / user / deleteUser

* PATCH / user / changePassword

* POST /user/logout

3. Message/Media/Chat Routes

* POST /message/add

Body  
{  
   “message”: "hi",  
    “roomName”: "[asadshakri3127@gmail.com](mailto:asadshakri3127@gmail.com)\-asadshakri@gmail.com"  
}

* GET /message/get/:roomName

Response  
{  
    "messages": \[  
        {  
            "user": {  
                "userId": "699870b965ab68b1bce8c790",  
                "name": "asad"  
            },  
            "\_id": "699a251bb25d4738475a169c",  
            "message": "ho",  
            "roomName": "asadshakri3127@gmail.com-asadshakri@gmail.com",  
            "createdAt": "2026-02-21T21:35:23.063Z",  
            "updatedAt": "2026-02-21T21:35:23.063Z",  
            "\_\_v": 0  
        },  
        {............}  
}

* POST /media/upload

Body(Form-data)

file(binary)  
roomName :[asadshakri3127@gmail.com](mailto:asadshakri3127@gmail.com)\-asadshakri@gmail.com

* GET /chat/list

Response  
{  
    "chatList": \[  
        {  
            "id": "699870b965ab68b1bce8c790",  
            "name": "asad",  
            "email": "asadshakri@gmail.com"  
        }  
    \]  
}

4. Payment Routes

* GET /paymentPage

Response- HTML file

* POST /pay

Body  
{  
“orderId”:”699870b965ab68b1bce8c790”  
}

Response

{  
paymentSessionId:”xxxxxxxxxxxxxx”  
paymentId:”xxxxxxxxxxxxx”  
}

* GET /payment-status/:orderId

Response  
{  
"orderStatus":"Success",  
"paymentId":"ORDER-1771929365663"  
}

