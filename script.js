document.addEventListener("DOMContentLoaded", function () {
    
    // ==========================================
    // 1. VARIABLES GENERALES Y ELEMENTOS
    // ==========================================
    const introOverlay = document.getElementById("intro-overlay");
    const startStep = document.getElementById("start-step");
    const doorContainer = document.getElementById("intro-door-container");
    const btnOpen = document.getElementById("btnOpenInvitation");
    
    // Música
    const bgMusic = document.getElementById("bgMusic");
    const musicToggleBtn = document.getElementById("musicToggleBtn");
    const musicIcon = document.getElementById("musicIcon");
    const musicText = document.getElementById("musicText");
    let isPlaying = false;


    // ==========================================
    // 2. APERTURA DE LA INVITACIÓN (EFECTO PUERTA)
    // ==========================================
    if (btnOpen) {
        btnOpen.addEventListener("click", function () {
            
            // A. Activar la animación de apertura de puertas y desvanecimiento de postal
            if (doorContainer) doorContainer.classList.add("door-opening");
            if (startStep) startStep.classList.add("opening-animation");

            // B. Reproducir música
            if (bgMusic) {
                bgMusic.play().then(() => {
                    isPlaying = true;
                    updateMusicButtonState();
                }).catch(error => {
                    console.log("Audio bloqueado:", error);
                });
            }

            // C. Desvanecer el overlay completo al terminar la animación
            setTimeout(() => {
                if (introOverlay) introOverlay.classList.add("overlay-hidden");
            }, 1000);

            // D. Remover del DOM y activar animaciones de scroll
            setTimeout(() => {
                if (introOverlay) introOverlay.remove();
                triggerScrollAnimations();
                checkScroll();
            }, 1200);
        });
    }


    // ==========================================
    // 3. CONTROL DE MÚSICA (BOTÓN FLOTANTE)
    // ==========================================
    if (musicToggleBtn && bgMusic) {
        musicToggleBtn.addEventListener("click", function () {
            if (isPlaying) {
                bgMusic.pause();
                isPlaying = false;
            } else {
                bgMusic.play().then(() => {
                    isPlaying = true;
                }).catch(e => console.log(e));
            }
            updateMusicButtonState();
        });
    }

    function updateMusicButtonState() {
        if (!musicIcon || !musicText) return;
        if (isPlaying) {
            musicIcon.className = "fa-solid fa-music";
            musicText.textContent = "Música";
        } else {
            musicIcon.className = "fa-solid fa-volume-xmark";
            musicText.textContent = "Silenciado";
        }
    }


    // ==========================================
    // 4. CUENTA REGRESIVA (5 de Febrero de 2027)
    // ==========================================
    const eventDate = new Date("February 5, 2027 00:00:00").getTime();

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = eventDate - now;

        if (distance < 0) {
            setCountdownValues("00", "00", "00", "00");
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        setCountdownValues(
            String(days).padStart(2, '0'),
            String(hours).padStart(2, '0'),
            String(minutes).padStart(2, '0'),
            String(seconds).padStart(2, '0')
        );
    }

    function setCountdownValues(d, h, m, s) {
        const daysElem = document.getElementById("days");
        const hoursElem = document.getElementById("hours");
        const minutesElem = document.getElementById("minutes");
        const secondsElem = document.getElementById("seconds");

        if (daysElem) daysElem.textContent = d;
        if (hoursElem) hoursElem.textContent = h;
        if (minutesElem) minutesElem.textContent = m;
        if (secondsElem) secondsElem.textContent = s;
    }

    setInterval(updateCountdown, 1000);
    updateCountdown();


    // ==========================================
    // 5. GESTIÓN DE URL (CIVIL, RSVP E INVITADOS)
    // ==========================================
    const urlParams = new URLSearchParams(window.location.search);
    const venueParam = urlParams.get("venue");
    const guestParam = urlParams.get("invitado") || urlParams.get("code");
    
    const civilBlock = document.querySelector('.venue-civil-block');
    const rsvpSection = document.getElementById("rsvpSection");

    if (civilBlock) {
        if (venueParam === "cyf") {
            civilBlock.style.display = "flex";
        } else {
            civilBlock.style.display = "none";
        }
    }

    if (guestParam && rsvpSection) {
        rsvpSection.style.display = "block";
        
        const familyNameElem = document.getElementById("familyName");
        const slotsElem = document.getElementById("slots");
        const guestsContainer = document.getElementById("guests");

        const codigoInvitado = decodeURIComponent(guestParam).trim();
        if (familyNameElem) familyNameElem.textContent = codigoInvitado;
        if (slotsElem) slotsElem.textContent = "Lugares reservados: 2";

        if (guestsContainer) {
            guestsContainer.innerHTML = `
                <div class="guest-input-group" style="margin-bottom: 20px; text-align: left;">
                    <label style="display: block; font-size: 0.85rem; margin-bottom: 5px;">Asistencia:</label>
                    <select class="guest-attendance" style="width: 100%; padding: 10px; border: 1px solid var(--border-color); background: var(--bg-color);">
                        <option value="yes">¡Sí, ahí estaré!</option>
                        <option value="no">No podré asistir</option>
                    </select>
                </div>
            `;
        }
    }

    const submitBtn = document.getElementById("submitBtn");
    if (submitBtn) {
        submitBtn.addEventListener("click", function () {
            const thanksModal = document.getElementById("thanksModal");
            if (thanksModal) thanksModal.classList.remove("hidden");
        });
    }


    // ==========================================
    // 6. ANIMACIONES AL HACER SCROLL (REVEAL)
    // ==========================================
    function triggerScrollAnimations() {
        const reveals = document.querySelectorAll(".reveal");
        // Activa la primera sección de golpe al abrir
        if (reveals.length > 0) {
            reveals[0].classList.add("active");
        }
    }

    function checkScroll() {
        const reveals = document.querySelectorAll(".reveal");
        const windowHeight = window.innerHeight;
        const elementVisible = 120;

        reveals.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            if (elementTop < windowHeight - elementVisible) {
                element.classList.add("active");
            }
        });
    }

    window.addEventListener("scroll", checkScroll);
    checkScroll();

}); // Fin del DOMContentLoaded


// ==========================================
// 7. FUNCIONES GLOBALES (FUERA DEL DOM)
// ==========================================
function closeThanksModal() {
    const thanksModal = document.getElementById("thanksModal");
    if (thanksModal) thanksModal.classList.add("hidden");
}

window.toggleGiftDetails = function(type) {
    const detailsElem = document.getElementById("gift-" + type);
    if (detailsElem) {
        detailsElem.classList.toggle("hidden");
    }
};