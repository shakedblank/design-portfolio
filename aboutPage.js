const aboutText = document.querySelector(".about-paragraph");
const words = aboutText.textContent.split(" "); // Use textContent to avoid breaking HTML structure
// Clear existing content
aboutText.innerHTML = "";

function spanMaker(word) {
    if(word== "br"){
        const span = document.createElement("br");
        aboutText.appendChild(span);
    }
    const span = document.createElement("span");
    span.textContent = word; 
    span.style.display = "inline-block"; 
    aboutText.appendChild(span);

    // Add a space after each span
    aboutText.appendChild(document.createTextNode(" "));
}

words.forEach(spanMaker);

gsap.from(".about-paragraph span", {
    y: 10, opacity: 0,
    ease: "elastic",
    duration: 1.4,
    stagger: 0.05
});


gsap.from(".about-title span",{x:200, duration:1, ease:"power2"});


