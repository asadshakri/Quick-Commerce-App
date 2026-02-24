const backendUrl="http://52.66.111.54";

window.onload=function(){
  if(localStorage.getItem("token"))
  {
    window.location.href="/admin/productPage";
  }
}

function loginAdmin(event){
    event.preventDefault();
    const email=event.target.email.value;
    const password=event.target.passwd.value;
    const adminDetails={email,password};
    const span=document.getElementById("message");
    span.innerHTML="";
    axios.post(`${backendUrl}/admin/login`,adminDetails,{withCredentials: true}).then((response)=>{
      alert(response.data.message);
      localStorage.setItem("adminEmail",response.data.email);
      localStorage.setItem("token",response.data.token);
      window.location.href = "/admin/productPage";
    }).catch((error)=>{
      if(error.response && (error.response.status=="404" || error.response.status=="401"))
      {
         span.innerHTML=`${error.response.data.message}`
         span.style.color="red";
      }
    })

}