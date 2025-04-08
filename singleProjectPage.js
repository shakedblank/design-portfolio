const urlParams = new URLSearchParams(window.location.search);
const projectNum = urlParams.get('project');


const response = await fetch("ProjectsPage.json");
if (!response.ok) {
  throw new Error(`Response status: ${response.status}`);
}

const json = await response.json();
const projectObject= json.Projects[projectNum];


const mainTitle = document.querySelector("#Project-title");
const description = document.querySelector("#Project-description");
mainTitle.textContent= projectObject.innerTitle;
description.textContent= projectObject.innerP;