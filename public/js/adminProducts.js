

const backendUrl="http://localhost:7000";


const socket = io(backendUrl, {
  auth: { token: localStorage.getItem("token") }
});


socket.on("connect", () => {
  console.log("Socket connected:", socket.id);
});

const STORE_LOCATION = {
  lat: 25.5781,
  lng: 85.0810
};

function logout(){
    localStorage.removeItem("adminEmail");
    localStorage.removeItem("token");
    localStorage.removeItem("roomName");
    localStorage.removeItem("chatWith");
    axios.post("/admin/logout", {}, { withCredentials: true })
  .then(() => window.location.href = "/admin");

}

window.onload = function() {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "/admin/admin.html";
    }
        products();
};

document.getElementById("addProductBtn").addEventListener("click", () => {
    const popup = document.createElement("div");
    popup.className = "popup";
  
    popup.innerHTML = `
      <div class="popup-content">
        <span id="closeBtn" class="close-btn">&times;</span>
  
        <h4>Add Product</h4>
        
        <input id="productName" class="form-control mb-2" placeholder="Product Name" required>
        <br>
        <input id="productDesc" class="form-control mb-2" placeholder="Description" required>
        <br>
        <input id="productPrice" type="number" class="form-control mb-2" placeholder="Price" required>
        <br>
        <input id="productUrl" type="text" class="form-control mb-3" placeholder="Image URL" required>
        <br>
  
        <button id="createProduct" class="btn btn-success w-100 mt-2">
          Add Product
        </button>
      </div>
    `;
  
    document.body.appendChild(popup);

    document.getElementById("closeBtn").addEventListener("click", () => {
        document.body.removeChild(popup);
    });

    document.getElementById("createProduct").addEventListener("click", () => {
        const name = document.getElementById("productName").value;
        const description = document.getElementById("productDesc").value;
        const price = parseFloat(document.getElementById("productPrice").value);
        const imageUrl = document.getElementById("productUrl").value;
         const token = localStorage.getItem("token");
        const productData = { name, description, price, imageUrl };

        axios.post(`${backendUrl}/admin/addProduct`, productData, { headers: { Authorization: token } })
            .then(response => {
                alert(response.data.message);
                document.body.removeChild(popup);
                popup.remove();
                products();
            })
            .catch(error => {
                alert(error.response.data.message || "Error adding product");
            });
    });
}
);


async function products(){
    try{
     
        document.getElementById("productSection").style.display="block";
        document.getElementById("ordersSection").style.display="none";
        document.getElementById("chatSection").style.display="none";
    
        const Products=await axios.get(`${backendUrl}/user/getProducts`);
        const productsContainer=document.getElementById("productList");
        productsContainer.innerHTML="";
        Products.data.forEach(product=>{
          const productCard=document.createElement("div");
          productCard.className="product-card product-item";
          productCard.innerHTML=`
            <img src="${product.imageUrl}" alt="${product.name}" class="product-image" />
            <span display="block">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <p>₹${product.price}</p>
            <button class="btn btn-warning" data-id="${product._id}">Edit</button>
            <button class="btn btn-danger" data-id="${product._id}">Delete</button>
            </span>
          `;
          productsContainer.appendChild(productCard);
        });
    
      document.querySelectorAll(".btn-warning").forEach(button=>{
        button.addEventListener("click",async()=>{
          const productId=button.getAttribute("data-id");
           
          const popup= document.createElement("div");
            popup.className="popup";
            popup.innerHTML=`
              <div class="popup-content">
                <span id="closeBtn" class="close-btn">&times;</span>
          
                <h4>Edit Product</h4>
                
                <input id="productName" class="form-control mb-2" placeholder="Product Name" required>
                <br>
                <input id="productDesc" class="form-control mb-2" placeholder="Description" required>
                <br>
                <input id="productPrice" type="number" class="form-control mb-2" placeholder="Price" required>
                <br>
                <input id="productUrl" type="text" class="form-control mb-3" placeholder="Image URL" required>
                <br>
          
                <button id="updateProduct" class="btn btn-success w-100 mt-2">
                  Update Product
                </button>
              </div>
            `;

            document.body.appendChild(popup);

            document.getElementById("closeBtn").addEventListener("click",()=>{
              document.body.removeChild(popup);
            });

            const productDetails= await axios.get(`${backendUrl}/admin/getProduct/${productId}`);
            document.getElementById("productName").value=productDetails.data.name;
            document.getElementById("productDesc").value=productDetails.data.description;
            document.getElementById("productPrice").value=productDetails.data.price;
            document.getElementById("productUrl").value=productDetails.data.imageUrl;

            document.getElementById("updateProduct").addEventListener("click",()=>{
              const name=document.getElementById("productName").value;
              const description=document.getElementById("productDesc").value;
              const price=parseFloat(document.getElementById("productPrice").value);
              const imageUrl=document.getElementById("productUrl").value;
              const token=localStorage.getItem("token");
              const updatedData={name,description,price,imageUrl,id:productId};

              axios.put(`${backendUrl}/admin/editProduct`,updatedData)
                .then(response=>{
                  alert(response.data.message);
                  document.body.removeChild(popup);
                  products();
                })
                .catch(error=>{
                  alert(error.response.data.message || "Error updating product");
            });
          });
            });
        })

        document.querySelectorAll(".btn-danger").forEach(button=>{
            button.addEventListener("click",()=>{
                const productId=button.getAttribute("data-id");
                const token=localStorage.getItem("token");
                if(confirm("Are you sure you want to delete this product?"))
                {
                axios.delete(`${backendUrl}/admin/deleteProduct/${productId}`,{headers:{Authorization:token}})
                    .then(response=>{
                    alert(response.data.message);
                    products();
                    })
                    .catch(error=>{
                    alert(error.response.data.message || "Error deleting product");
                    });
                }
            });
        });
    } 
        catch(error){
            console.error("Error fetching products:",error);
        }
    }



async function orders(){
  try{
    document.getElementById("productSection").style.display="none";
    document.getElementById("ordersSection").style.display="block";
     document.getElementById("chatSection").style.display="none";
    const token=localStorage.getItem("token");
    const response=await axios.get(`${backendUrl}/admin/getAllOrders`,{headers:{Authorization:token}});
    const orders=response.data;
    const ordersContainer=document.getElementById("orderList");
    ordersContainer.innerHTML="";
    orders.forEach(order=>{
      const orderItem=document.createElement("div");
      orderItem.className="order-item";
      orderItem.innerHTML=`
       
        <h4>Order ID: ${order._id}</h4>
        <p>Ordered by: ${order.user.name}</p>
        <p>Order Status: ${order.status}</p>
        <div>
        <p>Items:</p>
        <ul>
          ${order.products.map(product=>`<li>${product.product.name} - Quantity: ${product.quantity} - Price: ₹${product.product.price*product.quantity}</li>`).join("")}
        </ul>
        <button class="btn btn-primary" onclick="simulateDelivery('${order._id}')">Delivery</button>
        </div
      `;

      if(order.status==="DELIVERED")
      {
        orderItem.querySelector("button").disabled=true;
      }
      ordersContainer.appendChild(orderItem);
    });
  }
  catch(error)
  {
    console.error("Error fetching orders:",error);
    alert(error.response.data.message || "Error fetching orders");
  }
}


function interpolate(start, end, steps) {
  const points = [];
  for (let i = 0; i <= steps; i++) {
    points.push({
      lat: start.lat + ((end.lat - start.lat) * i) / steps,
      lng: start.lng + ((end.lng - start.lng) * i) / steps
    });
  }
  return points;
}


async function simulateDelivery(orderId) {
  try {
    const token = localStorage.getItem("token");

    const orderRes = await axios.get(
      `${backendUrl}/admin/getOrder/${orderId}`,
      { headers: { Authorization: token } }
    );

    const customerLocation = {
      lat: orderRes.data.deliveryLocation.lat,
      lng: orderRes.data.deliveryLocation.lng}
     const path = interpolate(STORE_LOCATION, customerLocation, 25);
  let index = 0;

  socket.emit("startDelivery", orderId);

  const interval = setInterval(() => {
    if (index >= path.length) {
      socket.emit("deliveryCompleted", orderId);
      clearInterval(interval);
      return;
    }

    socket.emit("locationUpdate", {
      orderId,
      lat: path[index].lat,
      lng: path[index].lng
    });

    index++;
  }, 2000);

}
  catch (err) {
    console.error("Simulation error:", err);
  }
}


const chatBody = document.getElementById("chatBody");
const input = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");


async function loadChatList() {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get(`${backendUrl}/chat/list`, {
      headers: { Authorization: token }
    });

    list = response.data.chatList;
    const ul = document.getElementById("chatListUI");
    ul.innerHTML = "";

    list.forEach(chat => {
      const li = document.createElement("li");
      li.className = "list-group-item list-group-item-action";

        li.textContent = chat.email;
        li.onclick = () => joinExistingChat(chat.email);

      ul.appendChild(li);
    });

  } catch (err) {
    console.log("Error loading chat list:", err);
  }
}

function joinExistingChat(friends_email){
  document.getElementById("chatSec").style.display="flex";
  document.getElementById("chatSec").style.flexDirection="column";
  localStorage.setItem("chatWith", friends_email);
  const myEmail="asadshakri3127@gmail.com"
  const roomName=[myEmail,friends_email].sort().join("-");
  chatBody.innerHTML="";
  socket.emit("join-room",roomName);
  window.roomName=roomName;
  localStorage.setItem("roomName",roomName);
  document.getElementById("pName").textContent=`Chatting with: ${friends_email}`;
  fetchMessages(roomName);
}





 function openChat(){
  try{
   
    document.getElementById("productSection").style.display="none";
    document.getElementById("ordersSection").style.display="none";

    const chat = document.getElementById("chatSection");
    chat.style.display = "flex";

    const storeEmail="asadshakri3127@gmail.com";

    loadChatList();



  }
  catch(error)
  {
    console.log("Error opening chat:",error);
    return;
  }
}


socket.on("new-message", (data) => {
  if (!data) return;

  const token = localStorage.getItem("token");
  const decoded = JSON.parse(atob(token.split(".")[1]));
  const currentUserId = decoded.userId;

  const msg = {
    message: data.message,
    mediaType: data.mediaType,
    user: { name: data.name },
    createdAt: data.createdAt || new Date()
  };

  if (data.name === "Admin") {
    sentMessage(msg);       
  } else {
    receivedMessage(msg);
  }

  chatBody.scrollTop = chatBody.scrollHeight;
});

sendBtn.addEventListener("click", sendMessage);
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") 
    sendMessage();
});

async function sendMessage() {

 try{
  const text = input.value.trim();
  if (!text || !window.roomName)
  { 
     return;
  }

  const token=localStorage.getItem("token");
  const addedMessage= await axios.post(`${backendUrl}/message/add`, {message:text,roomName:window.roomName}, {
    headers: {
      'Authorization': token
    }
  });

  socket.emit("new-message", { message: text, roomName: window.roomName });

  sentMessage({ message: text, createdAt: new Date() });
  
  input.value = "";
  chatBody.scrollTop = chatBody.scrollHeight;

 }
  catch(err){
    console.log("Error in sending message:", err);
    return;
}
}
async function fetchMessages(roomName) {
  try {

    const token = localStorage.getItem("token");
   console.log("Fetching messages for room:", roomName);
    const response = await axios.get(`${backendUrl}/message/get/${roomName}`,{
      headers: {
        "Authorization": token
      },
    });

    const messages = response.data.messages;

    const decoded = JSON.parse(atob(token.split(".")[1]));
    const currentUserId = decoded.userId;

    chatBody.innerHTML = "";

    messages.forEach(msg => {
      if (msg.user.userId === currentUserId || msg.user.userId === undefined)
        sentMessage(msg);
      else
        receivedMessage(msg);
    });

    chatBody.scrollTop = chatBody.scrollHeight;

  } catch (err) {
    console.log("Error in fetching messages:", err);
  }
}

function sentMessage(msg) {
  const div = document.createElement("div");
  div.classList.add("message", "sent", "shadow-sm");

  if (!msg.mediaType) {
    div.innerHTML = `
      ${msg.message}
      <div class="timestamp">${new Date(msg.createdAt).toLocaleString()}</div>
    `;
  } else if (msg.mediaType.startsWith("image")) {
    div.innerHTML = `
      <img src="${msg.message}" class="img-fluid rounded mt-1">
      <div class="timestamp">${new Date(msg.createdAt).toLocaleString()}</div>
    `;
  } else if (msg.mediaType.startsWith("video")) {
    div.innerHTML = `
      <video controls class="w-100 mt-1">
        <source src="${msg.message}">
      </video>
      <div class="timestamp">${new Date(msg.createdAt).toLocaleString()}</div>
    `;
  } else {
    div.innerHTML = `
      <a href="${msg.message}" target="_blank">📎 Download</a>
      <div class="timestamp">${new Date(msg.createdAt).toLocaleString()}</div>
    `;
  }

  chatBody.appendChild(div);
}

function receivedMessage(msg) {
  const div = document.createElement("div");
  div.classList.add("message", "received", "shadow-sm");

  if(!msg.mediaType){
    div.innerHTML = `
    <strong>${msg.user.name}</strong> ${msg.message}
    <div class="timestamp">
  ${new Date(msg.createdAt).toLocaleString()}
</div>
  `;
}
  else if (msg.mediaType?.startsWith("image")) {
    div.innerHTML = `
      <strong>${msg.user.name}</strong><br>
      <img src="${msg.message}" class="img-fluid rounded mt-1">
        <div class="timestamp">
  ${new Date(msg.createdAt).toLocaleString()}
</div>
    `;
  } else if (msg.mediaType?.startsWith("video")) {
    div.innerHTML = `
      <strong>${msg.user.name}</strong><br>
      <video controls class="w-100 mt-1">
        <source src="${msg.message}">
      </video>
        <div class="timestamp">
  ${new Date(msg.createdAt).toLocaleString()}
</div>
    `;
  } else {
    div.innerHTML = `
      <strong>${msg.user.name}</strong><br>
      <a href="${msg.message}" target="_blank">📎 Download</a>
          <div class="timestamp">
  ${new Date(msg.createdAt).toLocaleString()}
</div>
    `;
  }

  chatBody.appendChild(div);
}

async function sendMedia() {
  const fileInput = document.getElementById("mediaInput");
  const file = fileInput.files[0];
  if (!file || !window.roomName) return;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("roomName", window.roomName);

  try {
    await axios.post(`${backendUrl}/media/upload`, formData, {
      headers: {
        Authorization: localStorage.getItem("token")
      }
    });


    fileInput.value = "";

  } catch (err) {
    alert("Media upload failed");
  }
}

function closeChat()
{
  document.getElementById("chatSec").style.display="none";
}