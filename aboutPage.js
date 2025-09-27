function removeElement(element) {
    if (typeof (element) === "string") {
        element = document.querySelector(element);
    }
    return function () {
        element.parentNode.removeChild(element);
    };
}

const tl = new TimelineMax();

tl.to("#loader", { y: '100%', delay: 0.3 })
    .call(removeElement("#loader"));


// === About paragraph word splitting with <br> support ===
const aboutText = document.querySelector(".about-paragraph");

// Split into words but also keep <br> tags as separate tokens
const words = aboutText.innerHTML.split(/(\s+|<br\s*\/?>)/i);
aboutText.innerHTML = "";

function spanMaker(word) {
    // handle <br>
    if (word.match(/<br\s*\/?>/i)) {
        aboutText.appendChild(document.createElement("br"));
        return;
    }

    // handle spaces
    if (word.trim() === "") {
        aboutText.appendChild(document.createTextNode(" "));
        return;
    }

    // normal words → wrap in span
    const span = document.createElement("span");
    span.textContent = word;
    span.style.display = "inline-block";
    aboutText.appendChild(span);
    aboutText.appendChild(document.createTextNode(" "));
}

words.forEach(spanMaker);

// GSAP animations
gsap.from(".about-paragraph span", {
    y: 10,
    opacity: 0,
    ease: "elastic",
    duration: 1.4,
    stagger: 0.05
});

gsap.from(".about-title span", {
    x: 200,
    duration: 1,
    ease: "power2"
});
