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
    // 5. GESTIÓN DE URL Y RSVP DINÁMICO (COMPLETO)
    // ==========================================
    const urlParams = new URLSearchParams(window.location.search);
    const venueParam = urlParams.get("venue"); 
    const tipoCeremonia = urlParams.get("ceremonia") || ""; 
    
    const rawParam = urlParams.get("invitado") || urlParams.get("code") || urlParams.get("nombre") || "";
    const displayTitle = decodeURIComponent(rawParam).trim() || "Invitados";
    
    const civilBlock = document.querySelector('.venue-civil-block');
    const rsvpSection = document.getElementById("rsvpSection");

    if (civilBlock) {
        if (venueParam === "cyf") {
            civilBlock.style.display = "flex";
        } else {
            civilBlock.style.display = "none";
        }
    }

    const totalSlots = parseInt(urlParams.get("pases") || urlParams.get("inv") || "1", 10);

    const muestraCivil = (venueParam === "cyf" || tipoCeremonia.includes("civil"));
    const muestraIglesia = (tipoCeremonia.includes("iglesia") || tipoCeremonia.includes("todas"));

    const familyNameEl = document.getElementById("familyName");
    const slotsEl = document.getElementById("slots");
    const guestLabelEl = document.getElementById("txtGuestLabel"); 
    const guestsContainer = document.getElementById("guests");
    const submitBtn = document.getElementById("submitBtn");
    const formError = document.getElementById("formError");

    if (rsvpSection) {
        rsvpSection.style.display = "block";

        if (familyNameEl) {
            familyNameEl.textContent = displayTitle;
        }
        
        if (guestLabelEl) {
            if (totalSlots === 1) {
                const generoDiscreto = urlParams.get("g") ? urlParams.get("g").toLowerCase() : "";
                
                if (generoDiscreto === "f") {
                    guestLabelEl.textContent = "INVITADA";
                } else if (generoDiscreto === "m") {
                    guestLabelEl.textContent = "INVITADO";
                } else {
                    const nombreUnico = rawParam ? rawParam.trim().toUpperCase() : "";
                    const nombresVaronesExcepcion = ["LUCAS", "MATIAS", "TOBIAS", "BAUTISTA", "JONAS", "NICOLAS", "TOMAS", "EZEQUIEL", "FRANCO", "JOAQUIN"];
                    
                    const esVaronExcepcion = nombresVaronesExcepcion.includes(nombreUnico);
                    const terminaEnA = nombreUnico.endsWith('A');

                    if (terminaEnA && !esVaronExcepcion) {
                        guestLabelEl.textContent = "INVITADA";
                    } else {
                        guestLabelEl.textContent = "INVITADO";
                    }
                }
            } else {
                guestLabelEl.textContent = "INVITADOS";
            }
        }

        if (slotsEl) {
            slotsEl.textContent = totalSlots === 1 ? "1 LUGAR RESERVADO" : `${totalSlots} LUGARES RESERVADOS`;
        }

        if (guestsContainer) {
            guestsContainer.innerHTML = ""; 

            for (let i = 1; i <= totalSlots; i++) {
                const guestCard = document.createElement("div");
                guestCard.className = "guest-editorial-card";

                let ceremoniasHTML = "";
                if (muestraCivil || muestraIglesia) {
                    ceremoniasHTML += `<div class="ceremonias-block">`;
                    
                    if (muestraCivil) {
                        ceremoniasHTML += `
                            <div class="ceremonia-row">
                                <label class="editorial-label">¿Asistirá al Civil?</label>
                                <div class="editorial-radio-group">
                                    <label class="radio-pill">
                                        <input type="radio" name="civil_${i}" value="Sí" checked> Sí
                                    </label>
                                    <label class="radio-pill">
                                        <input type="radio" name="civil_${i}" value="No"> No
                                    </label>
                                </div>
                            </div>
                        `;
                    }

                    if (muestraIglesia) {
                        ceremoniasHTML += `
                            <div class="ceremonia-row">
                                <label class="editorial-label">¿Asistirá a la Iglesia?</label>
                                <div class="editorial-radio-group">
                                    <label class="radio-pill">
                                        <input type="radio" name="iglesia_${i}" value="Sí" checked> Sí
                                    </label>
                                    <label class="radio-pill">
                                        <input type="radio" name="iglesia_${i}" value="No"> No
                                    </label>
                                </div>
                            </div>
                        `;
                    }

                    ceremoniasHTML += `</div>`;
                }

                guestCard.innerHTML = `
                    <div class="guest-card-top">
                        <span class="guest-number">Invitado ${i}</span>
                    </div>

                    <div class="field-block">
                        <input type="text" class="editorial-input guest-firstname" placeholder="Nombre" required>
                    </div>

                    <div class="field-block">
                        <input type="text" class="editorial-input guest-lastname" placeholder="Apellido" required>
                    </div>

                    <div class="field-block">
                        <label class="editorial-label">¿Asistirá a la Fiesta?</label>
                        <div class="editorial-radio-group">
                            <label class="radio-pill">
                                <input type="radio" name="attendance_${i}" value="Sí" checked> Sí
                            </label>
                            <label class="radio-pill">
                                <input type="radio" name="attendance_${i}" value="No"> No
                            </label>
                        </div>
                    </div>

                    <div class="field-block menu-block" id="menuBlock_${i}">
                        <label class="editorial-label">Menú</label>
                        <select class="editorial-select guest-menu">
                            <option value="" disabled selected>Seleccionar...</option>
                            <option value="General">Menú General</option>
                            <option value="Vegetariano">Vegetariano</option>
                            <option value="Celíaco">Celíaco / Sin TACC</option>
                            <option value="Vegano">Vegano</option>
                        </select>
                    </div>

                    ${ceremoniasHTML}

                    <div class="field-block">
                        <input type="text" class="editorial-input guest-diet" placeholder="Mensaje para los novios (opcional)">
                    </div>
                `;
                
                guestsContainer.appendChild(guestCard);

                const radioNo = guestCard.querySelector(`input[name="attendance_${i}"][value="No"]`);
                const radioSi = guestCard.querySelector(`input[name="attendance_${i}"][value="Sí"]`);
                const menuBlock = guestCard.querySelector(`#menuBlock_${i}`);
                const menuSelect = guestCard.querySelector(".guest-menu");

                radioNo.addEventListener('change', () => {
                    menuSelect.value = "";
                    menuSelect.required = false;
                    menuBlock.style.display = 'none'; 
                });

                radioSi.addEventListener('change', () => {
                    menuSelect.required = true;
                    menuBlock.style.display = 'block'; 
                });
            }
        }
    }


    // ==========================================
    // 6. ENVÍO DEL FORMULARIO A GOOGLE SHEETS
    // ==========================================
    const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzgtWIPiEETmrc3ZOT3ssYRGCMBu2dxKj9rlsvJOPT22i43SQ4g6RtGxaKAZnjK1ftIdw/exec";

    if (submitBtn) {
        submitBtn.addEventListener("click", function (e) {
            e.preventDefault();
            e.stopPropagation();

            const botCheck = document.getElementById("validationCode")?.value || "";
            if (botCheck !== "") return false;

            if (formError) formError.style.display = "none";

            const guestCards = document.querySelectorAll(".guest-editorial-card");
            let allValid = true;
            let rsvpData = [];

            guestCards.forEach((card, index) => {
                const firstNameInput = card.querySelector(".guest-firstname");
                const lastNameInput = card.querySelector(".guest-lastname");
                const attendanceInput = card.querySelector(`input[name="attendance_${index + 1}"]:checked`);
                const civilInput = card.querySelector(`input[name="civil_${index + 1}"]:checked`);
                const iglesiaInput = card.querySelector(`input[name="iglesia_${index + 1}"]:checked`);
                const menuSelect = card.querySelector(".guest-menu");
                const dietInput = card.querySelector(".guest-diet");

                const isAttending = attendanceInput ? attendanceInput.value === "Sí" : true;

                let firstNameValid = firstNameInput && !!firstNameInput.value.trim();
                let lastNameValid = lastNameInput && !!lastNameInput.value.trim();
                let menuValid = isAttending ? (menuSelect && !!menuSelect.value) : true;

                if (!firstNameValid || !lastNameValid || !menuValid) {
                    allValid = false;
                }

                rsvpData.push({
                    nombre: firstNameInput ? firstNameInput.value.trim() : "",
                    apellido: lastNameInput ? lastNameInput.value.trim() : "",
                    asistenciaFiesta: attendanceInput ? attendanceInput.value : "Sí",
                    asistenciaCivil: civilInput ? civilInput.value : "N/A",
                    asistenciaIglesia: iglesiaInput ? iglesiaInput.value : "N/A",
                    menu: isAttending && menuSelect ? menuSelect.value : "N/A",
                    restricciones: dietInput ? dietInput.value.trim() : ""
                });
            });

            if (!allValid) {
                if (formError) {
                    formError.style.display = "block";
                    formError.textContent = "Por favor, completá los campos requeridos.";
                }
                return false;
            }

            const currentScroll = window.scrollY;

            localStorage.setItem(`rsvp_confirmed_${displayTitle}`, "true");
            limpiarInterfazRsvp();
            mostrarModalAgradecimiento();
            window.scrollTo({ top: currentScroll, behavior: 'instant' });

            setTimeout(() => {
                const payload = {
                    familia: displayTitle,
                    invitados: rsvpData
                };

                if (APPS_SCRIPT_URL) {
                    fetch(APPS_SCRIPT_URL, {
                        method: "POST",
                        mode: "no-cors",
                        headers: { "Content-Type": "text/plain;charset=utf-8" },
                        body: JSON.stringify(payload)
                    }).catch(() => {});
                }
            }, 50);

            return false;
        });
    }

    function limpiarInterfazRsvp() {
        const guestsContainerEl = document.getElementById("guests");
        const submitButtonEl = document.getElementById("submitBtn");
        const headerBlockEl = document.querySelector(".rsvp-header-block");
        const cardHeaderEl = document.querySelector(".rsvp-inner > .card");

        if (guestsContainerEl) guestsContainerEl.style.display = "none";
        if (submitButtonEl) submitButtonEl.style.display = "none";
        if (headerBlockEl) headerBlockEl.style.display = "none";
        if (cardHeaderEl) cardHeaderEl.style.display = "none";

        const rsvpInner = document.querySelector('.rsvp-inner');
        if (rsvpInner && !document.getElementById("graciasExito")) {
            const mensajeDiv = document.createElement("div");
            mensajeDiv.id = "graciasExito";
            mensajeDiv.style.cssText = "text-align: center; padding: 40px 20px;";
            mensajeDiv.innerHTML = `
                <h3 style="font-family: var(--font-script); color: var(--text-charcoal); font-size: 2.8rem; margin-bottom: 15px; letter-spacing: 1px;">
                    ¡Muchas Gracias!
                </h3>
                <p style="color: var(--olive-soft); font-size: 1.1rem; font-family: var(--font-serif); letter-spacing: 1px; font-style: italic;">Tu respuesta ya fue registrada con éxito.</p>
            `;
            rsvpInner.appendChild(mensajeDiv);
        }
    }


    // ==========================================
    // 7. ANIMACIONES AL HACER SCROLL (REVEAL)
    // ==========================================
    function triggerScrollAnimations() {
        const reveals = document.querySelectorAll(".reveal");
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
// 8. FUNCIONES GLOBALES (FUERA DEL DOM)
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