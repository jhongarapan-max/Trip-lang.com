const startBtn = document.getElementById("startBtn");
const introCard = document.getElementById("introCard");
const questionCard = document.getElementById("questionCard");
const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const statusText = document.getElementById("statusText");
const modal = document.getElementById("successModal");
const closeBtn = document.getElementById("closeBtn");
const successImage = document.getElementById("successImage");
const musicBtn = document.getElementById("musicBtn");
const bgMusic = document.getElementById("bgMusic");

const ACCEPT_IMAGE = "image/1.jpg";

const noButtonLines = [
    "No, never ever",
    "Are you sure?",
    "Think again, pretty please",
    "I will run now",
    "Catch me first",
    "Still no? really?",
    "Last chance to press yes",
    "Okay I disappear"
];

const statusLines = [
    "Nice try. This one is shy.",
    "No button activated evasive mode.",
    "Romance defense level increased.",
    "The universe is voting yes.",
    "Your destiny is glowing pink.",
    "Only yes unlocks the good ending."
];

let dodgeCount = 0;
let autoUnmutePending = true;

function syncMusicButton() {
    if (!musicBtn || !bgMusic) return;

    const mutedOrPaused = bgMusic.paused || bgMusic.muted;
    musicBtn.textContent = mutedOrPaused ? "Sound: Off" : "Sound: On";
    musicBtn.classList.toggle("is-muted", mutedOrPaused);
}

async function startMusicOnLoad() {
    if (!bgMusic) return;

    bgMusic.muted = false;
    bgMusic.volume = 0.75;
    try {
        await bgMusic.play();
    } catch (error) {
        // Fallback: start muted if unmuted autoplay is blocked.
        bgMusic.muted = true;
        try {
            await bgMusic.play();
        } catch (innerError) {
            // Some browsers block autoplay until user interaction.
        }
    }
    syncMusicButton();
}

async function enableSoundOnFirstInteraction() {
    if (!bgMusic || !autoUnmutePending) return;
    autoUnmutePending = false;
    bgMusic.muted = false;
    try {
        await bgMusic.play();
    } catch (error) {
        bgMusic.muted = true;
    }
    syncMusicButton();
}

async function toggleMusic() {
    if (!bgMusic) return;
    autoUnmutePending = false;

    if (bgMusic.paused) {
        bgMusic.muted = false;
        try {
            await bgMusic.play();
        } catch (error) {
            bgMusic.muted = true;
            try {
                await bgMusic.play();
            } catch (innerError) {
                // Keep current state if playback remains blocked.
            }
        }
        syncMusicButton();
        return;
    }

    bgMusic.muted = !bgMusic.muted;
    syncMusicButton();
}

function launchHeartBurst() {
    const totalHearts = 18;
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    for (let i = 0; i < totalHearts; i += 1) {
        const heart = document.createElement("span");
        const dx = (Math.random() - 0.5) * 320;
        const dy = -70 - Math.random() * 220;
        const rot = `${Math.floor((Math.random() - 0.5) * 90)}deg`;
        const size = `${14 + Math.floor(Math.random() * 20)}px`;

        heart.className = "burst-heart";
        heart.textContent = i % 4 === 0 ? "*" : "<3";
        heart.style.setProperty("--x", `${centerX}px`);
        heart.style.setProperty("--y", `${centerY + 80}px`);
        heart.style.setProperty("--dx", `${dx}px`);
        heart.style.setProperty("--dy", `${dy}px`);
        heart.style.setProperty("--rot", rot);
        heart.style.setProperty("--size", size);

        document.body.appendChild(heart);
        setTimeout(() => heart.remove(), 1000);
    }
}

function openQuestionCard() {
    if (!introCard || !questionCard) return;

    introCard.classList.add("fade-out");
    setTimeout(() => {
        introCard.classList.add("hidden");
        questionCard.classList.remove("hidden");
        questionCard.classList.add("suspense");
        statusText.textContent = "Wait for it...";

        setTimeout(() => {
            questionCard.classList.add("reveal-buttons");
            statusText.textContent = "Now choose your ending.";
        }, 900);

        // Fallback: force buttons visible even if animation is interrupted/disabled.
        setTimeout(() => {
            const row = questionCard.querySelector(".button-row");
            if (row) {
                row.style.opacity = "1";
                row.style.transform = "none";
                row.style.filter = "none";
            }
        }, 1200);

        setTimeout(() => {
            statusText.textContent = "Choose carefully, my heart is watching.";
        }, 2100);
    }, 260);
}

function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
}

function dodgeNoButton(event) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }

    const rect = noBtn.getBoundingClientRect();
    const padding = 12;
    const maxX = window.innerWidth - rect.width - padding;
    const maxY = window.innerHeight - rect.height - padding;

    noBtn.classList.add("escaping");
    noBtn.style.left = `${randomInRange(padding, Math.max(padding, maxX))}px`;
    noBtn.style.top = `${randomInRange(padding, Math.max(padding, maxY))}px`;

    const scale = Math.max(0.34, 1 - dodgeCount * 0.09);
    noBtn.style.transform = `scale(${scale})`;

    const noTextIndex = Math.min(dodgeCount + 1, noButtonLines.length - 1);
    noBtn.textContent = noButtonLines[noTextIndex];

    statusText.textContent = statusLines[dodgeCount % statusLines.length];

    dodgeCount += 1;

    if (dodgeCount >= 4) {
        yesBtn.classList.add("boost");
        yesBtn.textContent = "Yes, I choose us";
    }

    if (dodgeCount >= 8) {
        noBtn.style.opacity = "0";
        noBtn.style.pointerEvents = "none";
        statusText.textContent = "No button has resigned. Only yes remains.";
    }
}

function showSuccess() {
    launchHeartBurst();

    if (successImage) {
        successImage.src = ACCEPT_IMAGE;
        successImage.style.display = "block";
    }

    modal.classList.add("show");
    modal.setAttribute("aria-hidden", "false");
    statusText.textContent = "Best choice unlocked. Main character moment.";

    if (noBtn.classList.contains("escaping")) {
        noBtn.style.opacity = "0";
        noBtn.style.pointerEvents = "none";
    }
}

function hideSuccess() {
    modal.classList.remove("show");
    modal.setAttribute("aria-hidden", "true");
}

yesBtn.addEventListener("click", showSuccess);
closeBtn.addEventListener("click", hideSuccess);
startBtn.addEventListener("click", openQuestionCard);
if (musicBtn) {
    musicBtn.addEventListener("click", toggleMusic);
}

noBtn.addEventListener("mouseenter", dodgeNoButton);
noBtn.addEventListener("click", dodgeNoButton);
noBtn.addEventListener("touchstart", dodgeNoButton, { passive: false });
noBtn.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
        dodgeNoButton(event);
    }
});

modal.addEventListener("click", (event) => {
    if (event.target === modal) {
        hideSuccess();
    }
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal.classList.contains("show")) {
        hideSuccess();
    }
});

if (bgMusic) {
    startMusicOnLoad();
    bgMusic.addEventListener("play", syncMusicButton);
    bgMusic.addEventListener("pause", syncMusicButton);
    bgMusic.addEventListener("volumechange", syncMusicButton);

    document.addEventListener("pointerdown", enableSoundOnFirstInteraction, { passive: true });
    document.addEventListener("keydown", enableSoundOnFirstInteraction);
}
