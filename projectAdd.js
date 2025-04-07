export function projectBox(num,src, innerTitle ,innerP,newPage="index.html",targetClass){
    const projectHome = document.getElementById(targetClass);
    const project= document.createElement("div");
    project.className="project-continer";
    const projectImg= document.createElement("img");
    projectImg.src=src;
    projectImg.className="projectimg";
    const projectDiv= document.createElement("div");
    projectDiv.className="project-text-home";
    const projectTitle= document.createElement("h4");
    projectTitle.className="poppins-bold";
    projectTitle.innerText=innerTitle;
    const projectP= document.createElement("p");
    projectP.innerText=innerP;
    projectP.className="poppins-medium";
    
    projectHome.appendChild(project);
    project.appendChild(projectImg);
    project.appendChild(projectDiv);
    projectDiv.appendChild(projectTitle);
    projectDiv.appendChild(projectP);
    
    function changePage(page){
        window.location.href = page+"?project="+num;
    }
    
    project.addEventListener("click", function(){changePage(newPage)});
    }

export function jsonFill(file) {
        return fetch(file) // Return the fetch promise
            .then(response => response.json())
            .then(data => {
                data.Projects.forEach(project => {
                    projectBox(
                        project.num,
                        project.src,
                        project.innerTitle,
                        project.innerP,
                        project.newPage,
                        project.targetClass
                    );
                });
            })
            .catch(error => console.error("Error loading JSON:", error));
    }
    