// Lógica de la Invitación del Baby Shower de Eli

document.addEventListener("DOMContentLoaded", () => {
    initCountdown();
    initLullabyPlayer();
    initScrollAnimations();
    
    // Welcome overlay logic for autoplay and 3D envelope transition
    const welcomeOverlay = document.getElementById("welcomeOverlay");
    const btnOpenInvitation = document.getElementById("btnOpenInvitation");
    const envelope = document.getElementById("envelope");
    if (welcomeOverlay && btnOpenInvitation) {
        btnOpenInvitation.addEventListener("click", () => {
            if (envelope) {
                // Start 3D flap opening and card slide-out
                envelope.classList.add("open");
            }
            
            // Auto play music when invitation is opened
            if (window.startLullabyMusic) {
                window.startLullabyMusic();
            }
            
            // Wait for envelope open animation to complete (1.6 seconds)
            setTimeout(() => {
                welcomeOverlay.classList.add("hidden");
            }, 1600);
        });
    }
});

/* ==========================================================================
   1. COUNTDOWN TIMER
   ========================================================================== */
function initCountdown() {
    // Target date: June 21, 2026 at 14:00 (Local Time)
    const targetDate = new Date("2026-06-21T14:00:00").getTime();

    const daysEl = document.getElementById("days");
    const hoursEl = document.getElementById("hours");
    const minutesEl = document.getElementById("minutes");
    const secondsEl = document.getElementById("seconds");

    function updateTimer() {
        const now = new Date().getTime();
        const distance = targetDate - now;

        if (distance < 0) {
            // Event has started or passed
            if (daysEl) daysEl.innerText = "00";
            if (hoursEl) hoursEl.innerText = "00";
            if (minutesEl) minutesEl.innerText = "00";
            if (secondsEl) secondsEl.innerText = "00";
            
            const titleEl = document.querySelector(".countdown-section h3");
            if (titleEl) {
                titleEl.innerHTML = "<i class='fa-solid fa-star gold-text'></i> ¡Llegó el gran día! <i class='fa-solid fa-star gold-text'></i>";
            }
            return;
        }

        // Calculations
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Format with leading zeros
        if (daysEl) daysEl.innerText = String(days).padStart(2, "0");
        if (hoursEl) hoursEl.innerText = String(hours).padStart(2, "0");
        if (minutesEl) minutesEl.innerText = String(minutes).padStart(2, "0");
        if (secondsEl) secondsEl.innerText = String(seconds).padStart(2, "0");
    }

    // Run immediately and then every second
    updateTimer();
    setInterval(updateTimer, 1000);
}



/* ==========================================================================
   3. LOCAL AUDIO MUSIC PLAYER (Hijo del corazón - Cantada)
   ========================================================================== */
let isPlaying = false;
let bgAudio = null;

function startLullabyMusic() {
    if (!bgAudio) {
        bgAudio = document.getElementById("bgAudio");
        
        // Loop handling: when audio ends, jump back to 10 seconds and play again
        if (bgAudio) {
            bgAudio.addEventListener("ended", () => {
                bgAudio.currentTime = 10;
                bgAudio.play().catch(err => console.error(err));
            });
        }
    }
    
    if (bgAudio) {
        // If music is at the beginning, skip first 10 seconds
        if (bgAudio.currentTime < 10) {
            bgAudio.currentTime = 10;
        }
        
        bgAudio.play()
            .then(() => {
                isPlaying = true;
                const musicPlayer = document.getElementById("musicPlayer");
                if (musicPlayer) {
                    musicPlayer.classList.add("playing");
                }
                const musicTooltip = document.getElementById("musicTooltip");
                if (musicTooltip) {
                    musicTooltip.innerHTML = 'Silenciar nana <i class="fa-solid fa-volume-xmark gold-text"></i>';
                    musicTooltip.classList.remove("prompt");
                }
            })
            .catch(err => {
                console.error("Audio playback blocked or failed:", err);
            });
    }
}

function stopLullabyMusic() {
    if (!bgAudio) {
        bgAudio = document.getElementById("bgAudio");
    }
    
    if (bgAudio) {
        bgAudio.pause();
        isPlaying = false;
        const musicPlayer = document.getElementById("musicPlayer");
        if (musicPlayer) {
            musicPlayer.classList.remove("playing");
        }
        const musicTooltip = document.getElementById("musicTooltip");
        if (musicTooltip) {
            musicTooltip.innerHTML = 'Escuchar canción <i class="fa-solid fa-baby gold-text"></i>';
        }
    }
}

function initLullabyPlayer() {
    const musicPlayer = document.getElementById("musicPlayer");
    const musicToggle = document.getElementById("musicToggle");
    const musicTooltip = document.getElementById("musicTooltip");
    
    if (!musicToggle) return;

    // Show tooltip callout initially after 3 seconds, then hide it
    setTimeout(() => {
        if (!isPlaying) {
            musicTooltip.classList.add("prompt");
        }
    }, 3000);

    // Expose startMusic globally so the welcome overlay can trigger it
    window.startLullabyMusic = startLullabyMusic;

    musicToggle.addEventListener("click", () => {
        if (isPlaying) {
            stopLullabyMusic();
        } else {
            startLullabyMusic();
        }
    });

    // Make baby Hercules trigger a fun wiggle visual animation on the character when clicked
    const babyHerc = document.getElementById("babyHerc");
    if (babyHerc) {
        babyHerc.addEventListener("click", () => {
            // Trigger a quick wiggle visual animation on the character
            babyHerc.style.animation = 'none';
            // Trigger reflow
            void babyHerc.offsetWidth;
            babyHerc.style.animation = 'characterWiggle 0.8s ease-in-out';
            
            setTimeout(() => {
                babyHerc.style.animation = 'characterFloat 4.5s infinite ease-in-out';
            }, 800);
        });
    }

    // CSS for wiggle
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
        @keyframes characterWiggle {
            0% { transform: scale(1) rotate(0deg); }
            20% { transform: scale(1.15) rotate(-8deg); filter: drop-shadow(0 0 15px var(--gold)); }
            40% { transform: scale(1.1) rotate(8deg); }
            60% { transform: scale(1.05) rotate(-4deg); }
            80% { transform: scale(1.02) rotate(2deg); }
            100% { transform: scale(1) rotate(0deg); }
        }
    `;
    document.head.appendChild(styleSheet);
}

/* ==========================================================================
   4. SCROLL ENTRANCE ANIMATIONS
   ========================================================================== */
function initScrollAnimations() {
    const cards = document.querySelectorAll(".card");
    
    const observerOptions = {
        root: null,
        rootMargin: "0px",
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Initial styles and start observing
    cards.forEach((card, index) => {
        card.style.opacity = "0";
        card.style.transform = "translateY(30px)";
        card.style.transition = "opacity 0.8s ease, transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)";
        
        // Add styling for visibility class
        const styleSheet = document.createElement("style");
        styleSheet.innerText = `
            .card.visible {
                opacity: 1 !important;
                transform: translateY(0) !important;
            }
        `;
        document.head.appendChild(styleSheet);

        observer.observe(card);
    });
}
