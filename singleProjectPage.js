const urlParams = new URLSearchParams(window.location.search);
const projectNum = urlParams.get('project');

const loaderTitle = document.querySelector("#loader-h");


const response = await fetch("ProjectsPage.json");
if (!response.ok) {
  throw new Error(`Response status: ${response.status}`);
}

const json = await response.json();
const projectObject= json.Projects[projectNum];

loaderTitle.textContent = projectObject.innerTitle;
const mainTitle = document.querySelector("#Project-title");
const description = document.querySelector("#Project-description");
const secondery = document.querySelector("#secondey-paragraph");

const imageOne = document.querySelector("#image-one");
const imageTwo = document.querySelector("#image-two");
const imageThree = document.querySelector("#image-three");
const imageFour = document.querySelector("#image-four");
const imageFive = document.querySelector("#image-five");
const imageSix = document.querySelector("#image-six");
const imageSeven = document.querySelector("#image-s");


mainTitle.textContent= projectObject.innerTitle;
description.textContent= projectObject.innerP;
secondery.textContent= projectObject.seconderyP;

if(projectObject.image1== undefined){
  document.querySelector("#projects-wrapper").removeChild(imageOne);
}else{imageOne.src=projectObject.image1;};

if(projectObject.image2== undefined){
  document.querySelector("#projects-wrapper").removeChild(imageTwo);
}else{imageTwo.src=projectObject.image2;};

if(projectObject.smallImage1== undefined){
  document.querySelector("#small-images").removeChild(imageThree);
}else{imageThree.src=projectObject.smallImage1;};

if(projectObject.smallImage2== undefined){
  document.querySelector("#small-images").removeChild(imageFour);
}else{imageFour.src=projectObject.smallImage2;};

if(projectObject.smallImage3== undefined){
  document.querySelector("#small-images").removeChild(imageFive);
}else{imageFive.src=projectObject.smallImage3;};


if(projectObject.smallImage4== undefined){
  document.querySelector("#small-images").removeChild(imageSix);
}else{imageSix.src=projectObject.smallImage4;};




function removeElement(element) {
  if (typeof(element) === "string") {
    element = document.querySelector(element);
  }
  return function() {
    element.parentNode.removeChild(element);
  };
}

const tl = new TimelineMax();

tl.to("#loader", {y:'100%',delay:0.3})
      .call(removeElement("#loader"));
