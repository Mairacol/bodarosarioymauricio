document.addEventListener("DOMContentLoaded", function () {
    
    // ==========================================
    // 1. APERTURA DE LA INVITACIÓN Y MÚSICA
    // ==========================================
    const introOverlay = document.getElementById("intro-overlay");
    const btnOpen = document.getElementById("btnOpenInvitation");
    const bgMusic = document.getElementById("bgMusic");
    const musicToggleBtn = document.getElementById("musicToggleBtn");
    const musicIcon = document.getElementById("musicIcon");
    const musicText = document.getElementById("musicText");

    let isPlaying = false;

    if (btnOpen) {
        btnOpen.addEventListener("click", function () {
            // Ocultar la pantalla de presentación
            if (introOverlay) {
                introOverlay.style.opacity = "0";
                setTimeout(() => {
                    introOverlay.style.display = "none";
                }, 800);
            }

            // Reproducir música de fondo
            if (bgMusic) {
                bgMusic.play().then(() => {
                    isPlaying = true;
                    updateMusicButtonState();
                }).catch(error => {
                    console.log("El navegador bloqueó la reproducción automática de audio:", error);
                });
            }

            // Activar animaciones de revelación iniciales si las hay
            triggerScrollAnimations();
        });
    }

    // Botón flotante para pausar / reproducir música
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
    // 2. CUENTA REGRESIVA (Hastas el Día 1 / 5 de Febrero)
    // ==========================================
    // Fecha objetivo: 5 de Febrero de 2027 (o la fecha principal que configures)
    const eventDate = new Date("February 5, 2027 00:00:00").getTime();

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = eventDate - now;

        if (distance < 0) {
            document.getElementById("days").textContent = "00";
            document.getElementById("hours").textContent = "00";
            document.getElementById("minutes").textContent = "00";
            document.getElementById("seconds").textContent = "00";
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        const daysElem = document.getElementById("days");
        const hoursElem = document.getElementById("hours");
        const minutesElem = document.getElementById("minutes");
        const secondsElem = document.getElementById("seconds");

        if (daysElem) daysElem.textContent = String(days).padStart(2, '0');
        if (hoursElem) hoursElem.textContent = String(hours).padStart(2, '0');
        if (minutesElem) minutesElem.textContent = String(minutes).padStart(2, '0');
        if (secondsElem) secondsElem.textContent = String(seconds).padStart(2, '0');
    }

    setInterval(updateCountdown, 1000);
    updateCountdown();

    // ==========================================
    // 3. DESPLIEGUE DE DATOS BANCARIOS (REGALOS)
    // ==========================================
    window.toggleGiftDetails = function(type) {
        const detailsElem = document.getElementById("gift-" + type);
        if (detailsElem) {
            detailsElem.classList.toggle("hidden");
        }
    };

    // ==========================================
    // 4. ANIMACIONES AL HACER SCROLL (REVEAL)
    // ==========================================
    function triggerScrollAnimations() {
        const reveals = document.querySelectorAll(".reveal");
        reveals.forEach(element => {
            element.classList.add("active");
        });
    }

    function checkScroll() {
        const reveals = document.querySelectorAll(".reveal");
        const windowHeight = window.innerHeight;
        const elementVisible = 150;

        reveals.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            if (elementTop < windowHeight - elementVisible) {
                element.classList.add("active");
            }
        });
    }

    window.addEventListener("scroll", checkScroll);
    checkScroll(); // Comprobar al cargar por si elementos ya son visibles

    // ==========================================
    // 5. GESTIÓN DE RSVP (Dinamismo por URL / Parámetros)
    // ==========================================
    const urlParams = new URLSearchParams(window.location.search);
    const guestParam = urlParams.get("invitado") || urlParams.get("code");
    const rsvpSection = document.getElementById("rsvpSection");

    if (guestParam) {
        if (rsvpSection) rsvpSection.style.display = "block";
        
        // Simulación de carga de invitados personalizados
        const familyNameElem = document.getElementById("familyName");
        const slotsElem = document.getElementById("slots");
        const guestsContainer = document.getElementById("guests");

        if (familyNameElem) familyNameElem.textContent = decodeURIComponent(guestParam);
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

});

// Función para cerrar el modal de agradecimiento
function closeThanksModal() {
    const thanksModal = document.getElementById("thanksModal");
    if (thanksModal) thanksModal.classList.add("hidden");
}
// ==========================================
    // 5. GESTIÓN DE UBICACIONES Y RSVP POR URL
    // ==========================================
    const urlParams = new URLSearchParams(window.location.search);
    const venueParam = urlParams.get("venue"); // Lee el parámetro ?venue=...
    const guestParam = urlParams.get("invitado") || urlParams.get("code");
    
    const civilBlock = document.querySelector('.venue-civil-block');
    const rsvpSection = document.getElementById("rsvpSection");

    // A. LÓGICA DE LOCACIONES (Civil vs Fiesta)
    if (civilBlock) {
        if (venueParam === "cyf") {
            // Si el link tiene ?venue=cyf, mostramos el civil (la fiesta ya se muestra sola)
            civilBlock.style.display = "flex";
        } else {
            // Si no tiene ?venue=cyf (es un invitado solo a fiesta), ocultamos el civil
            civilBlock.style.display = "none";
        }
    }

    // B. GESTIÓN DE RSVP (Personalizado por invitado)
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