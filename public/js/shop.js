const backend_url="http://52.66.111.54";

const token=localStorage.getItem("token");

const socket = io(backend_url, {
  auth: { token }
});

socket.on("connect", () => {
  console.log("socket connected:", socket.id);
});





let map = null;
let marker = null;
let lastLocation = null;

function initMap(lat = 25.5781, lng = 85.0810) {
  if (!map) {
    map = L.map("map").setView([lat, lng], 14);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors"
    }).addTo(map);

    marker = L.marker([lat, lng]).addTo(map);
  } else {
    map.setView([lat, lng], 14);
    marker.setLatLng([lat, lng]);
  }

  setTimeout(() => {
    map.invalidateSize();
  }, 300);
}


socket.on("locationUpdate", ({ lat, lng }) => {
  console.log("Live location:", lat, lng);

  lastLocation = { lat, lng };

  if (map && marker) {
    marker.setLatLng([lat, lng]);
    map.panTo([lat, lng]);
  }
});

window.addEventListener('DOMContentLoaded',()=>{
  const token = localStorage.getItem('token');
  if(!token){
    alert("Please login to access your profile");
    window.location.href="/user/main.html";
  }
  selectProducts();
 
});

async function showProfile(){
  const profileSection = document.getElementById('profileSection');
  profileSection.style.display = 'flex';
 document.getElementById("cartSection").style.display="none";
  document.getElementById("productSection").style.display="none";
  document.getElementById("ordersSection").style.display="none";
  document.getElementById("mapSection").style.display="none";
  document.getElementById("chatSection").style.display="none";
 
  const token = localStorage.getItem('token');
  const resultDetails= await axios.get(`${backend_url}/user/profile`,{ headers:{"authorization":token}});
  document.getElementById('name').value=resultDetails.data.name;
  document.getElementById('email').value=resultDetails.data.email;
  document.getElementById('phone').value=resultDetails.data.phone;
  document.getElementById('address').value=resultDetails.data.address;

  document.getElementById("profileForm").addEventListener("submit",(event)=>{
      event.preventDefault();
      const name=event.target.name.value;
      const phone=event.target.phone.value;
      const email=event.target.email.value;
      const address=event.target.address.value;
      const updatedDetails={name,email,phone,address};
      const token = localStorage.getItem('token');
      axios.patch(`${backend_url}/user/updateProfile`,updatedDetails,{ headers:{"authorization":token}}).then((response)=>{
          alert(response.data.message);
  
      }).catch((error)=>{
          console.log(error);
      })
  });

  document.getElementById("changePasswordBtn").addEventListener("click",()=>{
      document.getElementById("updateProfile").style.display='none';
      document.getElementById("changePasswordSection").style.display='block';
     document.getElementById("changePasswordForm").addEventListener("submit",(event)=>{
      event.preventDefault();
      const oldPassword=event.target.currentPassword.value;
      const newPassword=event.target.newPassword.value;
      const passwordDetails={oldPassword,newPassword};
      const token = localStorage.getItem('token');
      axios.patch(`${backend_url}/user/changePassword`,passwordDetails,{ headers:{"authorization":token}}).then((response)=>{
          alert(response.data.message);
          document.getElementById("changePasswordSection").style.display='none';
          document.getElementById("updateProfile").style.display='block';
  
      }).catch((error)=>{
          alert(error.response.data.message);
          console.log(error);
      })
     });
  });

 document.getElementById("deleteUserBtn").addEventListener("click",()=>{
  const confirmation=confirm("Are you sure you want to delete your account? This action cannot be undone.");
  if(confirmation){
      const token = localStorage.getItem('token');
      axios.delete(`${backend_url}/user/deleteUser`,{ headers:{"authorization":token}},{withCredentials:true}).then((response)=>{
          alert(response.data.message);
          localStorage.removeItem("token");
          localStorage.removeItem("email");
          localStorage.removeItem("orderId");
          window.location.href="/";
  
      }).catch((error)=>{
          console.log(error);
      })
  }
 });

}


function logout(){
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("orderId");
    axios.post("/user/logout", {}, { withCredentials: true })
    .then(() => window.location.href = "/");

}

async function selectProducts(){
  try{
     
    document.getElementById("cartSection").style.display="none";
    document.getElementById("productSection").style.display="block";
    document.getElementById("ordersSection").style.display="none";
    document.getElementById("mapSection").style.display="none";
    document.getElementById("chatSection").style.display="none";
    document.getElementById("profileSection").style.display="none";

    const Products=await axios.get(`${backend_url}/user/getProducts`);
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
        <button class="add-to-cart-btn btn btn-success" data-id="${product._id}">Add to Cart</button>
        </span>
      `;
      productsContainer.appendChild(productCard);
    });

    document.querySelectorAll(".add-to-cart-btn").forEach(button=>{
      button.addEventListener("click",()=>{
        const productId=button.getAttribute("data-id");
        addToCart(productId);
      });
    });


  }
  catch(error){
    console.error("Error fetching products:",error);
  }
}

async function addToCart(productId){
  try{
    const token=localStorage.getItem("token");
    await axios.post(`${backend_url}/user/addToCart`,{productId},{headers:{Authorization:token}});
    alert("Product added to cart!");
  }
  catch(error)
  {
    console.error("Error adding to cart:",error);
    alert(error.response.data.message || "Error adding product to cart");
  }
}

let cartStore = null;
async function getCart()
{
  try{
    const token=localStorage.getItem("token");
    document.getElementById("cartSection").style.display="block";
    document.getElementById("productSection").style.display="none";
    document.getElementById("ordersSection").style.display="none";
    document.getElementById("mapSection").style.display="none";
    document.getElementById("chatSection").style.display="none";
    document.getElementById("profileSection").style.display="none";

    const response=await axios.get(`${backend_url}/user/getCart`,{headers:{Authorization:token}});
    const cartItems=response.data.cartProducts;

   if(cartItems.length===0)
   {
    const cartContainer=document.getElementById("cartList");
    cartContainer.innerHTML="<h3 style='margin:auto'>Your cart is empty!</h3>";
    const totalPriceElement=document.getElementById("tprice");
    totalPriceElement.innerText="Total Price: ₹0";
    return;
   }
   cartStore = null;
   cartStore=cartItems;

    const cartContainer=document.getElementById("cartList");
    cartContainer.innerHTML="";
    cartItems.forEach(item=>{
      const cartItem=document.createElement("div");
      cartItem.className="cart-item";
      cartItem.innerHTML=`
        <h4>${item.productId.name}</h4>
        <p>₹${item.productId.price}</p>
        <p>Quantity: ${item.quantity}</p>
        <button class="btn btn-danger remove-from-cart-btn" data-id="${item.productId._id}">Remove</button>
      `;
      cartContainer.appendChild(cartItem);
    });

    const totalPrice=response.data.totalPrice;
    const totalPriceElement=document.getElementById("tprice");

    totalPriceElement.innerText=`Total Price: ₹${totalPrice}`;
      document.querySelectorAll(".remove-from-cart-btn").forEach(button=>{
        button.addEventListener("click",()=>{
          const productId=button.getAttribute("data-id");
          removeFromCart(productId);
        });
      });     
  }
  catch(error)
  {
    console.error("Error fetching cart items:",error);
    alert(error.response.data.message || "Error fetching cart items");
  }
}

async function removeFromCart(productId)
{
  try{
    const token=localStorage.getItem("token");
    await axios.delete(`${backend_url}/user/deleteCart/${productId}`,{headers:{Authorization:token}});
    alert("Product removed from cart!");
    getCart();
  }
  catch(error)
  {
    console.error("Error removing from cart:",error);
    alert(error.response.data.message || "Error removing product from cart");
  }
}


async function checkout() {
  try {
    const token = localStorage.getItem("token");

    if(!cartStore || cartStore.length===0)
    {
      alert("Your cart is empty!");
      return;
    }

    const Products=await axios.get(`${backend_url}/user/getProducts`);
    const ProductsIds=Products.data.map(p=>p._id.toString());

    const cartProductsIds=cartStore.map(item=>{
      return item.productId._id.toString();
    });

    const unavailableProducts=cartProductsIds.filter(id=>!ProductsIds.includes(id));
    if(unavailableProducts.length>0)
    {
      alert("Some products not available");
      return;
    }


    const position = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });

    const orderStatus = await axios.post(
      `${backend_url}/user/checkout`,
      {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      },
      { headers: { Authorization: token } }
    );

    const orderId=orderStatus.data.orderId;
  localStorage.setItem("orderId",orderId);
    if (orderStatus.status === 200) {
      const popup = window.open(
        `${backend_url}/paymentPage`,
        "payment"
      );

      window.addEventListener("message", (event) => {
        if (
          event.origin === backend_url &&
          event.data === "READY"
        ) {
          popup.postMessage({ token ,orderId}, backend_url);
        }
      });
    }

    getCart();
  } catch (error) {
    console.error("Error during checkout:", error);
    alert(error.response?.data?.message || "Error during checkout");
  }
}

async function orders(){
  try{
    document.getElementById("cartSection").style.display="none";
    document.getElementById("productSection").style.display="none";
    document.getElementById("ordersSection").style.display="block";
    document.getElementById("mapSection").style.display="none";
    document.getElementById("chatSection").style.display="none";
    document.getElementById("profileSection").style.display="none";

    const token=localStorage.getItem("token");
    const response=await axios.get(`${backend_url}/user/getOrders`,{headers:{Authorization:token}});
    const orders=response.data;
    const ordersContainer=document.getElementById("ordersList");
    ordersContainer.innerHTML="";
    orders.forEach(order=>{
      const orderItem=document.createElement("div");
      orderItem.className="order-item";
      orderItem.innerHTML=`
       
        <h4>Order ID: ${order._id}</h4>
        <p>Ordered by: ${order.user.name}</p>
        <div>
        <p>Items:</p>
        <ul>
          ${order.products.map(product=>`<li>${product.product.name} - Quantity: ${product.quantity} - Price: ₹${product.product.price*product.quantity}</li>`).join("")}
        </ul>
        <p>Status: ${order.status}</p>
        <button class="btn btn-danger" onclick="trackOrder('${order._id}')">Track Order</button>
        <button class="btn btn-warning" onclick="receipt('${order._id}')">Download Receipt</button>
        </div
      `;
      ordersContainer.appendChild(orderItem);
    });
  }
  catch(error)
  {
    console.error("Error fetching orders:",error);
    alert(error.response.data.message || "Error fetching orders");
  }
}


async function receipt(orderId)
{
  try{
    const token=localStorage.getItem("token");
    console.log(`Fetching receipt for order: ${orderId}`);
    const res=await axios.get(`${backend_url}/user/receipt/${orderId}`,{headers:{Authorization:token}});
  
    const data = res.data;
    if (data.downloadUrl) {
      alert(`report generated successfully!`); 
      console.log("Redirecting...");
     window.open(data.downloadUrl, '_blank');

    }
    else 
    {
      alert("Error generating report");
    }

  }
  catch(error)
  {
    console.error("Error fetching receipt:",error);
    alert(error.response.data.message || "Error fetching receipt");
  }
}




function trackOrder(orderId)
{
  alert("Tracking order: "+orderId+". Wait for live location updates on the map.");
  socket.emit("joinOrderRoom",orderId);
  liveTracking();
}

function liveTracking()
{
  document.getElementById("cartSection").style.display="none";
  document.getElementById("productSection").style.display="none";
  document.getElementById("ordersSection").style.display="none";
  document.getElementById("mapSection").style.display="block";
  document.getElementById("chatSection").style.display="none";
  document.getElementById("profileSection").style.display="none";
  
    if (lastLocation) {
      initMap(lastLocation.lat, lastLocation.lng);
    } else {
      initMap();
    }
}


const chatBody = document.getElementById("chatBody");
const input = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");


 function openChat(){
  try{
    document.getElementById("cartSection").style.display="none"
    document.getElementById("productSection").style.display="none";
    document.getElementById("ordersSection").style.display="none";
    document.getElementById("mapSection").style.display="none";
    document.getElementById("profileSection").style.display="none";
    const chat = document.getElementById("chatSection");
    chat.style.display = "flex";
    chat.style.flexDirection = "column";



    const myEmail=localStorage.getItem("email");
    const token=localStorage.getItem("token");
    const storeEmail="asadshakri3127@gmail.com";

    const roomName=[myEmail,storeEmail].sort().join("-");
    socket.emit("join-room",roomName);
    window.roomName=roomName;

    localStorage.setItem("roomName",roomName);

    chatBody.innerHTML="";
    document.getElementById("pName").textContent=`Chatting with Store`;
    fetchMessages(roomName);



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

  if (data.UserId === currentUserId) {
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
  const addedMessage= await axios.post(`${backend_url}/message/add`, {message:text,roomName:window.roomName}, {
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

    const response = await axios.get(`${backend_url}/message/get/${roomName}`,{
      headers: {
        "Authorization": token
      },
    });

    const messages = response.data.messages;

    const decoded = JSON.parse(atob(token.split(".")[1]));
    const currentUserId = decoded.userId;

    chatBody.innerHTML = "";

    messages.forEach(msg => {
      if (msg.user.userId === currentUserId)
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
    await axios.post(`${backend_url}/media/upload`, formData, {
      headers: {
        Authorization: localStorage.getItem("token")
      }
    });


    fileInput.value = "";

  } catch (err) {
    alert("Media upload failed");
  }
}