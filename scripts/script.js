const gallery = document.querySelector(".gallery");
let works = 0;
let filtreActif = new Set();

const image = {
	name:"",
	url:"",
	description:"",
};

async function loadGallery()
{
	await fetch("http://localhost:5678/api/works").then((response)=>response.json().then((JSON)=>{
		gallery.innerHTML = "";
		works = JSON;
		
		for(let i = 0 ;i < JSON.length;i++)
			createFigure(JSON[i].imageUrl,JSON[i].title)
		
	}));
}

function refreshGallery()
{
	gallery.innerHTML = "";
	
	for(let i = 0 ;i < works.length;i++)
	{
		//filtreActif.has('0') = cas ou "tout" est coché
		//(filtreActif.size == 0) = cas où aucun des filtres n'est actif (en mode edition par exemple)
		if(filtreActif.has('0') || (filtreActif.size == 0))
			createFigure(works[i].imageUrl,works[i].title)
		else if(filtreActif.has(works[i].categoryId.toString()))
			createFigure(works[i].imageUrl,works[i].title)
	}
}

async function createFilter()
{
	let divFiltre = document.querySelector(".filtres");

	divFiltre.innerHTML = "";

	divFiltre.appendChild(createFilterButton(0,"Tous"));
	document.querySelector("#Tous").checked = true;

	await fetch("http://localhost:5678/api/categories").then((response)=>response.json().then((JSON)=>{
		for(let i = 0;i < Object.keys(JSON).length;i++)
		divFiltre.appendChild(createFilterButton(JSON[i].id,JSON[i].name));
	}));

	document.querySelectorAll("input[name=\"tri\"]").forEach((elem) => {
		elem.addEventListener("change",function(){
			if(elem.checked)
				filtreActif.add(elem.value);
			else
				filtreActif.delete(elem.value);
		   
			//Si "Tous" est coché et qu'un autre filtre est activé, alors on le décoche
			if(document.querySelector("#Tous").checked && (elem.id !="Tous"))
			{
				document.querySelector("#Tous").checked = false;
				filtreActif.delete('0');
			}
			else if (document.querySelector("#Tous").checked && (elem.id =="Tous"))
			{
				//Si "Tous" est coché, décoche les autres filtres
				document.querySelectorAll("input[name=\"tri\"]").forEach((checkbox) => {
					if((checkbox.id != "Tous") && checkbox.checked)
						checkbox.checked = false;
				});
			}
		   
			//applique les filtres si les checkbox sont cochées et les supprime si les cases sont décochées
			document.querySelectorAll("input[name=\"tri\"]").forEach((checkbox) => {
				if(checkbox.checked)
					filtreActif.add(checkbox.value);
				else
					filtreActif.delete(checkbox.value);
			});

			//Si tous les bouttons sont décoché, si c'est le cas, on coche Tous
			if(filtreActif.size == 0)
			{
				document.querySelector("#Tous").checked = true;
				filtreActif.add('0');
			}
			
			refreshGallery();
		});
	});
}



function createFilterButton(catId,catName)
{
	let div = document.createElement("div");

	//creation de la checkbox
	div.appendChild(Object.assign(document.createElement("input"), { 
		id: catName,
		type: "checkbox",
		value: catId,
		name: "tri"
	}));
	//creation du label
	div.appendChild(Object.assign(document.createElement("label"), { 
		htmlFor: catName,
		textContent: catName
	}));
	
	return div;
}

function createFigure(imageUrl,title)
{
	let figure = document.createElement("figure");
	let img = document.createElement("img");
	let figcaption = document.createElement("figcaption");

	img.src = imageUrl;
	img.alt = title;

	figcaption.textContent = title;

	figure.appendChild(img);
	figure.appendChild(figcaption);

	gallery.appendChild(figure);
}

function displayEditionMode()
{
	let login = window.sessionStorage.getItem("userId");
	let edition = document.querySelectorAll(".edition");
	if(login == "1")
	{
		edition.forEach(element => {
			element.style.display="flex";
		});
		document.querySelector(".filtres").style.display="none";
	}
}

function isLoged()
{
	let login = window.sessionStorage.getItem("userId");
	let loginbutton = document.getElementById("login");
	if(login != null)
	{
		loginbutton.innerHTML="logout";
		loginbutton.setAttribute("href","./index.html");
		loginbutton.addEventListener("click",(event)=>{
			if(event.type == "click")
			{
				window.sessionStorage.removeItem("userId");
				window.sessionStorage.removeItem("token");
			}
		});
		displayEditionMode();
	}
}

isLoged();
createFilter();
loadGallery();