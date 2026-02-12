const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const modal = document.getElementById("modal");
const closeBtn = document.getElementById("closeBtn");
const actionBox = document.querySelector(".actions");
const victoryPhoto = document.getElementById("victoryPhoto");

const BOUQUET_IMAGE = "image/1.jpg";

function moveNoButton() {
    const area = actionBox.getBoundingClientRect();
    const maxX = Math.max(0, area.width - noBtn.offsetWidth);
    const maxY = 30;
    const x = Math.floor(Math.random() * maxX);
    const y = Math.floor(Math.random() * maxY);

    noBtn.style.position = "relative";
    noBtn.style.left = `${x}px`;
    noBtn.style.top = `${y}px`;

    const memes = [
        "No? cap.",
        "This button is allergic to rejection.",
        "Bro just click yes.",
        "No button rage quit."
    ];
    noBtn.textContent = memes[Math.floor(Math.random() * memes.length)];
}

function showModal() {
    victoryPhoto.src = BOUQUET_IMAGE;
    victoryPhoto.style.display = "block";
    modal.classList.add("show");
    modal.setAttribute("aria-hidden", "false");
}

function hideModal() {
    modal.classList.remove("show");
    modal.setAttribute("aria-hidden", "true");
}

noBtn.addEventListener("mouseenter", moveNoButton);
noBtn.addEventListener("click", moveNoButton);
yesBtn.addEventListener("click", showModal);
closeBtn.addEventListener("click", hideModal);
modal.addEventListener("click", (event) => {
    if (event.target === modal) hideModal();
});