// Get the modal
var modal = document.getElementById("editModal");

// Get the button that opens the modal
// When the user clicks anywhere outside of the modal, close it
document.getElementById("editButton").addEventListener("click",function(){
	modal.style.display = "block";
	modalGallery()
});

//quand on click à l'exterieur de la modale, elle se ferme
window.addEventListener("click",function(event){
	if (event.target == modal) {
		modal.style.display = "none";
	}
});

function modalGallery()
{
	//initialise les elements
	let modalContent = newModal(false,"Galerie photo");
	let editGallery = Object.assign(document.createElement("span"), { className: "modPhoto" });
	let modalButton = Object.assign(document.createElement("input"), { 
		id: "modal-button", 
		type: "button", 
		value: "Ajouter une photo"
	});
	
	//crée et ajoute les vignettes à la galerie de la modale
	works.forEach(element => {
		editGallery.appendChild(createVignette(element.title,element.imageUrl,element.id));
	});

	//ajoute la galerie à la modale
	modalContent.appendChild(editGallery);

	//click sur "Ajouter une photo";
	modalButton.addEventListener("click",function(){
		modalAddPhoto()
	});

	modalContent.appendChild(separationBar());
	modalContent.appendChild(modalButton);
	
	//on applique le contenu de la modale à la modale
	modal.appendChild(modalContent);
}

function modalAddPhoto()
{
	//initialise les elements
	let modalContent = newModal(true,"Ajout photo");

	let addPhoto = Object.assign(document.createElement("span"), { className: "addPhoto" });

	addPhoto.appendChild(addPhotoForm());
	modalContent.appendChild(addPhoto);
	
	modal.appendChild(modalContent);
}

function inputImage()
{
	//div contenant l'input de l'image à uploader
	let div = Object.assign(document.createElement("div"), { className: "image-background" });

	//ajout du logo "image"
	div.appendChild(Object.assign(document.createElement("i"), { 
		className: "fa-regular fa-image fa-5x" 
	}));
	//ajout du bouton "+ Ajouter photo"
	div.appendChild(Object.assign(document.createElement("label"), { 
		htmlFor: "new-image", 
		textContent: "+ Ajouter photo", 
		classList: "add-file" 
	}));
	//ajout de l'input[type="file"] pour récupérer la photo
	div.appendChild(Object.assign(document.createElement("input"), { 
		type: "file", 
		id: "new-image", 
		name: "new-image", 
		accept: "image/png, image/jpeg"
	}));
	//ajout d'un label rappelant les restriction sur la taille et le format des photos
	div.appendChild(Object.assign(document.createElement("label"), { 
		textContent: "jpg, png : 4mo max",
		classList : "file-restriction"
	}));

	//affiche l'image en attente d'upload
	div.querySelector("#new-image").addEventListener("change", function(event){
		if(event.target.files[0].size <= 4194304)
		{
			div.childNodes.style = "display: none;";
			div.querySelector(".fa-image").style = "display: none;";
			div.querySelector(".add-file").style = "display: none;";
			div.querySelector(".file-restriction").style = "display: none;";
			div.appendChild(Object.assign(document.createElement("img"), { 
				src: URL.createObjectURL(event.target.files[0]), 
				alt: "new-image",
				classList: "new-pic"
			}));
		}
		else
		{ 
			//si l'image fais plus de 4Mo on reset le input file
			event.target.value = '';
			div.querySelector(".file-restriction").style = "color : red;";
		}
	});

	return div;
}

function addPhotoForm()
{
	let form = document.createElement("form");
	let selectCategory = Object.assign(document.createElement("select"), { 
		name: "img-category", 
		id: "img-category", 
		required: true 
	});

	//option pour les catégorie d'image
	selectCategory.options[0] = new Option("","");
	selectCategory.options[0].disabled = true;

	//récupération de la liste des catégories et crée une option par catégorie
	fetch("http://localhost:5678/api/categories").then((response)=>response.json().then((JSON)=>{
		for(let i = 0;i < Object.keys(JSON).length;i++)
			selectCategory.options[selectCategory.options.length] = new Option(JSON[i].name,JSON[i].id);
	}));

	//upload de l'image
	form.addEventListener("submit",function(event){
		event.preventDefault();
		uploadPhoto(document.getElementById("new-image").files[0],document.getElementById("img-title").value,document.getElementById("img-category").value);
		
	});
	//input de l'image a uploader
	form.appendChild(inputImage());
	//label et input pour le titre de l'image
	form.appendChild(Object.assign(document.createElement("label"), { 
		htmlFor: "img-title", 
		classList: "lab-title", 
		textContent: "Titre" 
	}));
	form.appendChild(Object.assign(document.createElement("input"), { 
		type: "text", 
		name: "img-title", 
		id: "img-title", 
		required: true
	}));
	//label et select pour la catagorie de l'image
	form.appendChild(Object.assign(document.createElement("label"), { 
		htmlFor: "img-category", 
		classList: "lab-category", 
		textContent: "Catégorie" 
	}));
	form.appendChild(selectCategory);


	form.appendChild(separationBar());
	form.appendChild(Object.assign(document.createElement("input"), { 
		id: "modal-button-submit", 
		type: "submit", 
		value: "Valider" , 
		disabled: true
	}));

	//lors d'un changement dans le form, on verrifie si tous les champs sont rempli, si oui, on débloque le bouton envoyer
	form.addEventListener("change",function(event){
		if(form.querySelector("#img-category").value && form.querySelector("#img-title").value && form.querySelector("#new-image").value)
		{
			form.querySelector("#modal-button-submit").disabled = false;
			form.querySelector("#modal-button-submit").style = "background-color: #1D6154;cursor: pointer;";
		}
		else
		{
			form.querySelector("#modal-button-submit").disabled = true;
			form.querySelector("#modal-button-submit").style = "background-color: #A7A7A7;";
		}
	});

	return form;
}

function uploadPhoto(newImage,newTitle,newCategory)
{
	let formData = new FormData();
	formData.append("title",newTitle);
	formData.append("image",newImage);
	formData.append("category",parseInt(newCategory));

	fetch("http://localhost:5678/api/works", {
		method:"POST",
		headers:{Authorization: "Bearer " + window.sessionStorage.getItem("token")},
		body:formData
	}).then(async (response)=>{
			if(response.ok)
			{
				await loadGallery();
				//après upload retour à la modale galerie
				modalGallery();
			}
	});
}

function newModal(previousButton,title)
{
	let div = Object.assign(document.createElement("div"), { classList: "modal-content" });

	//reset le corps de la modale
	modal.innerHTML = "";

	if(previousButton)
	{
		//bouton retour
		div.appendChild(Object.assign(document.createElement("span"), { 
			classList: "previous",
			innerHTML: "<i class=\"fa-solid fa-arrow-left\"></i>" 
		}));

		//Click sur le bouton retour : retour à la galerie
		div.children[div.children.length-1].addEventListener("click", function(){
			modalGallery();
		});
	}

	//bouton fermer
	div.appendChild(Object.assign(document.createElement("span"), { 
		classList: "close",
		innerHTML: "&times;" 
	}));

	//click sur le bouton fermer : on stop l'affichage de la modale
	div.children[div.children.length-1].addEventListener("click", function(){
		modal.style.display = "none";
	});

	//Titre
	div.appendChild(Object.assign(document.createElement("h3"), { 
			innerHTML: title
		}));

	return div;
}

function separationBar()
{
	return Object.assign(document.createElement("div"), { classList: "separation-bar" });
}

function createVignette(name,imgUrl,id)
{
	let figure = document.createElement("figure");

	figure.appendChild(Object.assign(document.createElement("i"), { classList: "fa-solid fa-trash-can trash" }));
	figure.appendChild(Object.assign(document.createElement("img"), { 
		src: imgUrl, 
		alt: name
	}));

	//event listener en cas de click sur la corbeille
	figure.querySelector(".trash").addEventListener("click", function(){
		 fetch("http://localhost:5678/api/works/"+id, {
			method:"DELETE",
			headers:{Authorization: "Bearer " + window.sessionStorage.getItem("token")},
		}).then((response)=>{
			if(response.ok)
			{
				works.splice( works.findIndex(object => {
					return object.id === id;
				}),1);

				refreshGallery();

				//reset de la galerie photo de la modale
				document.querySelector(".modPhoto").innerHTML = "";

				//pour chaque projet dans works on crée une vignette
					works.forEach(element => {
						// document.querySelector(".modPhoto").appendChild(createVignette(element.name,element.url,element.id));
						document.querySelector(".modPhoto").appendChild(createVignette(element.title,element.imageUrl,element.id));
				});
			}
		});
	});

	return figure;
}