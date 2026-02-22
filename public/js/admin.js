const backendUrl="http://localhost:7000";



function loginAdmin(event){
    event.preventDefault();
    const email=event.target.email.value;
    const password=event.target.passwd.value;
    const adminDetails={email,password};
    const span=document.getElementById("message");
    span.innerHTML="";
    axios.post(`${backendUrl}/admin/login`,adminDetails).then((response)=>{
      alert(response.data.message);
      localStorage.setItem("adminEmail",response.data.email);
      localStorage.setItem("token",response.data.token);
      window.location.href="/admin/adminProducts.html";
    }).catch((error)=>{
      if(error.response.status=="404" || error.response.status=="401")
      {
         span.innerHTML=`${error.response.data.message}`
         span.style.color="red";
      }
    })

}