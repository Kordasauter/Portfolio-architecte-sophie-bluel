let submit = document.querySelector("#LogIn form");
submit.addEventListener("submit",function(event){
    event.preventDefault();
    let loginparameters = {
        email : event.target.querySelector("#email").value,
        password : event.target.querySelector("#password").value,
    }

    let loginJSON = JSON.stringify(loginparameters);
    // console.log(loginJSON);
    fetch("http://localhost:5678/api/users/login", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:loginJSON
    }).then((response)=>{
        // console.log(response);
        if(response.ok)
        {
            response.json().then((respJSON)=>{
                // console.log(respJSON.token);
                window.sessionStorage.setItem("userId", respJSON.userId);
                window.sessionStorage.setItem("token", respJSON.token);
            });
            document.location.href="./index.html"; 
        } else {
            
            let loginError = event.target.querySelector(".loginerror");
            loginError.style.cssText = "display:flex;color:red;justify-content: center;";
        }
    });
});
