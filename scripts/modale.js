// Get the modal
var modal = document.getElementById("editModal");

// Get the button that opens the modal
var btn = document.getElementById("editButton");


// When the user clicks on the button, open the modal
btn.addEventListener("click",function(){
  modal.style.display = "block";
  modalGallery()
});

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

function modalGallery()
{
  //initialise les elements
  let modalContent = newModal(false,"Galerie photo");
  let editGallery =  Object.assign(document.createElement("span"), { className: "modPhoto" });
  let modalButton = Object.assign(document.createElement("input"), { 
    id: "modal-button", 
    type: "button", 
    value: "Ajouter une photo"
  });
  
  //crée et ajoute les vignettes à la gallerie de la modale
  imageList.forEach(element => {
    editGallery.appendChild(createVignette(element.name,element.url,element.id));
  });

  //ajoute la gallerie à la modale
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
  let modalForm = document.createElement("form");

  let addPhoto =  Object.assign(document.createElement("span"), { className: "addPhoto" });

  // addPhoto.appendChild(modalForm);
  addPhoto.appendChild(addPhotoForm());
  modalContent.appendChild(addPhoto);
  
  modal.appendChild(modalContent);
}

function inputImage()
{
  let div = Object.assign(document.createElement("div"), { className: "image-background" });

  //div contenant l'input de l'image à uploader
  div.appendChild(Object.assign(document.createElement("i"), { 
    className: "fa-regular fa-image fa-5x" 
  }));
  div.appendChild(Object.assign(document.createElement("label"), { 
    htmlFor: "new-image", 
    textContent: "+ Ajouter photo", 
    classList: "add-file" 
  }));
  div.appendChild(Object.assign(document.createElement("input"), { 
    type: "file", 
    id: "new-image", 
    name: "new-image", 
    accept: "image/png, image/jpeg"
  }));
  div.appendChild(Object.assign(document.createElement("label"), { 
    textContent: "jpg, png : 4mo max",
    classList : "file-restriction"
  }));

  //affiche l'image en attente d'upload
  div.querySelector("#new-image").addEventListener("change", function(event){
    if(event.target.files)
    {
      if(event.target.files[0].size <= 4194304)
      {
        console.log(event.target.files[0].size);
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
  selectCategory.options[selectCategory.options.length] = new Option("","");
  selectCategory.options[0].disabled = true;
  selectCategory.options[selectCategory.options.length] = new Option("Objet","1");
  selectCategory.options[selectCategory.options.length] = new Option("Appartements","2");
  selectCategory.options[selectCategory.options.length] = new Option("Hotels & restaurants","3");

  //upload de l'image
  form.addEventListener("submit",function(event){
    event.preventDefault();
    uploadPhoto(document.getElementById("new-image").files[0],document.getElementById("img-title").value,document.getElementById("img-category").value);
    
  });
  form.appendChild(inputImage());
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
  }).then((response)=>{
        console.log(response);
        if(response.ok)
        {
            loadGallery();
            modal.style.display = "none";
        } else {

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

    //Click sur le bouton retour : retour à la gallerie
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
  return Object.assign(document.createElement("div"), { 
    classList: "separation-bar"
  });
}
function modalFooter(isGallery)
{

}

function createVignette(name,imgUrl,id)
{
  let figure = document.createElement("figure");
  let img = document.createElement("img");
  let trash = document.createElement("i");
  
  trash.classList = "fa-solid fa-trash-can trash";

  img.src = imgUrl;
  img.alt = name;

  //event listener en cas de click sur la corbeille
  trash.addEventListener("click", function(){
    console.log("delete vignette " + name);

    fetch("http://localhost:5678/api/works/"+id, {
      method:"DELETE",
      headers:{Authorization: "Bearer " + window.sessionStorage.getItem("token")},
    }).then((response)=>{
      if(response.ok)
      {
          loadGallery();

          document.querySelector(".modPhoto").innerHTML = "";
          imageList.forEach(element => {
            if(id != element.id)
              document.querySelector(".modPhoto").appendChild(createVignette(element.name,element.url,element.id));
          });
      } else {

      }
    });
  });

  figure.appendChild(trash);
  figure.appendChild(img);

  return figure;
}