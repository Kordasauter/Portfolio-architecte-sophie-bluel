let gallery = document.querySelector(".gallery");
let tri = 0;
let works = 0;
let filtreActif = new Set();

function loadGallery()
{
     fetch("http://localhost:5678/api/works").then((response)=>response.json().then((JSON)=>{
        let filtreButton = new Set();

        gallery.innerHTML = "";
        works = JSON;
        
        for(let i = 0 ;i < JSON.length;i++)
        {
            filtreButton.add(JSON[i].category.id);
            filtreButton.add(JSON[i].category.name);
            if(tri == 0)
            {
                createFigure(JSON[i].imageUrl,JSON[i].title)
            }
            else if(JSON[i].categoryId == tri){
                createFigure(JSON[i].imageUrl,JSON[i].title)
            }
        }
        createfilter(Array.from(filtreButton))
    }));
}

function refreshGallery()
{
    gallery.innerHTML = "";
    for(let i = 0 ;i < works.length;i++)
    {
        if(filtreActif.has('0'))
            createFigure(works[i].imageUrl,works[i].title)
        else if(filtreActif.has(works[i].categoryId.toString()))
            createFigure(works[i].imageUrl,works[i].title)
    }
}

function createfilter(filtres)
{
    let divFiltre = document.querySelector(".filtres");
    divFiltre.innerHTML = "";

    createFilterButton(0,"Tous");
    document.querySelector("#Tous").checked = true;

    for(let i = 0;i < filtres.length;i=i+2)
        createFilterButton(filtres[i],filtres[i+1]);

    document.querySelectorAll("input[name=\"tri\"]").forEach((elem) => {
        elem.addEventListener("change",function(){
            tri= elem.value;
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



function createFilterButton(id,name)
{
    let divFiltre = document.querySelector(".filtres");
    let div = document.createElement("div");
    let input = document.createElement("input");
    let label = document.createElement("label");
    
    input.id=name;
    input.type = "checkbox";
    input.value = id;
    input.name = "tri";

    label.htmlFor = name;
    label.textContent = name;

    div.appendChild(input);
    div.appendChild(label);

    divFiltre.appendChild(div);
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
    // let edition = document.getElementById("edition");
    let edition = document.querySelectorAll(".edition");
    console.log(edition);
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
loadGallery();