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
const imageOne = document.querySelector("#image-one");
const imageTwo = document.querySelector("#image-two");
const imageThree = document.querySelector("#image-three");
const imageFour = document.querySelector("#image-four");
const imageFive = document.querySelector("#image-five");
const imageSix = document.querySelector("#image-six");

mainTitle.textContent= projectObject.innerTitle;
description.textContent= projectObject.innerP;
imageOne.src=projectObject.image1;
imageTwo.src=projectObject.image2;
imageThree.src=projectObject.smallImage1;
imageFour.src=projectObject.smallImage2;
imageFive.src=projectObject.smallImage3;
imageSix.src=projectObject.smallImage4;

