
// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
btn.onclick = function() {
  modal.style.display = "block";

  //clean photos in modification window
  document.querySelector(".modPhoto").innerHTML = "";

  imageList.forEach(element => {
    createVignette(element.name,element.url);
  });

}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

document.querySelector("#modal-button").addEventListener("click",function(){
  console.log("click sur \"Ajouter une photo\"");
});


function createVignette(name,imgUrl)
{
    // console.log(name + " " + imgUrl);
    // let photos = ;
    let figure = document.createElement("figure");
    let img = document.createElement("img");
    let trash = document.createElement("i");
    
    trash.classList = "fa-solid fa-trash-can trash";

    img.src = imgUrl;
    img.alt = name;

    trash.addEventListener("click", function(){
        console.log("delete vignette " + name);
    });
    
    // figure.innerHTML = "<i class=\"fa-solid fa-trash-can trash\"></i>"

    figure.appendChild(trash);
    figure.appendChild(img);

    // figure.style.width = "20%";
    // figure.appendChild(figcaption);

    document.querySelector(".modPhoto").appendChild(figure);
    // console.log(photos);
}