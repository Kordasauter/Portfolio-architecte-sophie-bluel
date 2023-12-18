let submit = document.querySelector("#LogIn form");
submit.addEventListener("submit",function(event){
	event.preventDefault();
	let loginparameters = {
		email : event.target.querySelector("#email").value,
		password : event.target.querySelector("#password").value,
	}

	let loginJSON = JSON.stringify(loginparameters);
	// document.location.href = "index.html"; 
	fetch("http://localhost:5678/api/users/login", {
		method:"POST",
		headers:{"Content-Type":"application/json"},
		body:loginJSON
	}).then(async (response)=>{
		if(response.ok)
		{
			//await, car il faut attendre la réponse du serveur avec les userId et token
			await response.json().then( function(respJSON){
				 window.sessionStorage.setItem("userId", respJSON.userId);
				 window.sessionStorage.setItem("token", respJSON.token);
			});
			document.location.href = "index.html"; 
		} else {
			let loginError = event.target.querySelector(".loginerror");
			loginError.style.cssText = "display:flex;color:red;justify-content: center;";
		}
	});
});
