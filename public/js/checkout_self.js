document.getElementById("renderBtn").addEventListener("click", async() => {
    const cashfree = Cashfree({
        mode: "sandbox",
    });
    try{
        const token=localStorage.getItem("token");
        const orderId=localStorage.getItem("orderId");
      const response=await axios.post("https://quick-commerce-gules.vercel.app/pay",{orderId},{ headers:{ "Authorization": token } })
      const paymentSessionId=response.data.paymentSessionId;
       console.log(paymentSessionId);
    let checkoutOptions = {
        paymentSessionId: paymentSessionId,
        redirectTarget: "_self",
    };
    await cashfree.checkout(checkoutOptions);
    //localStorage.removeItem("token");
}
catch(err)
{
    console.log(err);
}
});

window.opener.postMessage("READY", "https://quick-commerce-gules.vercel.app");

window.addEventListener("message", (event) => {
  console.log("Message received from:", event.origin);

  if (event.origin === "https://quick-commerce-gules.vercel.app") {
    localStorage.setItem("token", event.data.token);
    localStorage.setItem("orderId", event.data.orderId);
   
  }
});
