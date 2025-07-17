

document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const header = document.getElementById('header');
    
    // Crear overlay dinámicamente
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    document.body.appendChild(overlay);
    
    // Función para alternar el menú
    function toggleMenu() {
        navMenu.classList.toggle('active');
        overlay.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : 'auto';
        
        // Cambiar ícono del botón
        const icon = navToggle.querySelector('i');
        if (navMenu.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    }
    
    // Evento para el botón hamburguesa
    navToggle.addEventListener('click', function(e) {
        e.stopPropagation(); // Evitar que el evento se propague
        toggleMenu();
    });
    
    // Cerrar menú al hacer clic en overlay
    overlay.addEventListener('click', toggleMenu);
    
    // Cerrar menú al hacer clic en un enlace
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                toggleMenu();
            }
        });
    });
    
    // Cerrar menú al hacer clic fuera
    document.addEventListener('click', function(e) {
        if (navMenu.classList.contains('active') && 
            !navMenu.contains(e.target) && 
            e.target !== navToggle) {
            toggleMenu();
        }
    });
    
    // Efecto al hacer scroll
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
});

// Countdown functionality
// function initCountdown() {
//     const weddingDate = new Date('2025-07-15T17:00:00').getTime();
    
//     function updateCountdown() {
//         const now = new Date().getTime();
//         const distance = weddingDate - now;
        
//         if (distance > 0) {
//             const days = Math.floor(distance / (1000 * 60 * 60 * 24));
//             const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
//             const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
//             const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            
//             document.getElementById('days').textContent = days;
//             document.getElementById('hours').textContent = hours;
//             document.getElementById('minutes').textContent = minutes;
//             document.getElementById('seconds').textContent = seconds;
//         } else {
//             document.getElementById('days').textContent = '0';
//             document.getElementById('hours').textContent = '0';
//             document.getElementById('minutes').textContent = '0';
//             document.getElementById('seconds').textContent = '0';
//         }
//     }
    
//     updateCountdown();
//     setInterval(updateCountdown, 1000);
// }

// Función para actualizar la cuenta regresiva
function updateCountdown() {
    // Fecha objetivo (15 de Junio, 2024 a las 00:00:00)
    const targetDate = new Date('December 22, 2025 20:00:00').getTime();
    const now = new Date().getTime();
    const distance = targetDate - now;

    // Si la fecha ya pasó
    if (distance < 0) {
        document.getElementById('countdown').innerHTML = '<div class="countdown-ended">¡El evento ha comenzado!</div>';
        return;
    }

    // Cálculos para días, horas, minutos y segundos
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Actualizar los elementos HTML
    document.getElementById('days').textContent = days.toString().padStart(2, '0');
    document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
    document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
    document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
}

// Actualizar la cuenta regresiva cada segundo
updateCountdown(); // Ejecutar inmediatamente para evitar retraso inicial
setInterval(updateCountdown, 1000);

// Scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.timeline-item, .event-card, .gift-card, .gallery-item');
    animateElements.forEach(el => observer.observe(el));
}

// SECCION DE HISTORIA DE AMOR
document.addEventListener('DOMContentLoaded', function() {
    // Obtener el modal
    const modal = document.getElementById("imageModal");
    const modalImg = document.getElementById("modalImage");
    const captionText = document.getElementById("caption");
    const closeModal = document.querySelector(".close-modal");
    
    // Obtener todas las imágenes de la línea de tiempo
    const timelineImages = document.querySelectorAll('.timeline-image img');
    
    // Agregar evento click a cada imagen
    timelineImages.forEach(img => {
        img.addEventListener('click', function() {
            modal.style.display = "block";
            modalImg.src = this.src;
            captionText.innerHTML = this.alt;
            
            // Deshabilitar scroll del body cuando el modal está abierto
            document.body.style.overflow = "hidden";
        });
    });
    
    // Cerrar modal al hacer click en la X
    closeModal.addEventListener('click', function() {
        modal.style.display = "none";
        document.body.style.overflow = "auto";
    });
    
    // Cerrar modal al hacer click fuera de la imagen
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = "none";
            document.body.style.overflow = "auto";
        }
    });
    
    // Cerrar modal con tecla ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === "Escape" && modal.style.display === "block") {
            modal.style.display = "none";
            document.body.style.overflow = "auto";
        }
    });
    
    // Efecto de zoom al pasar el mouse (ya existente)
    timelineImages.forEach(img => {
        const parent = img.parentElement;
        parent.addEventListener('mouseenter', function() {
            img.style.transform = 'scale(1.05)';
        });
        parent.addEventListener('mouseleave', function() {
            img.style.transform = 'scale(1)';
        });
    });
    // Efecto parallax para el fondo
    const storySection = document.querySelector('.our-story');
    
    window.addEventListener('scroll', function() {
        const scrollPosition = window.pageYOffset;
        storySection.style.backgroundPositionY = scrollPosition * 0.3 + 'px';
    });
    
    // Animación al hacer hover en los íconos
    const timelineIcons = document.querySelectorAll('.timeline-icon');
    
    timelineIcons.forEach(icon => {
        icon.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
            this.style.boxShadow = '0 0 0 4px #ff758c, 0 8px 25px rgba(0, 0, 0, 0.2)';
        });
        
        icon.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.boxShadow = '0 0 0 4px #ff758c, 0 5px 20px rgba(0, 0, 0, 0.1)';
        });
    });
});

// ----------------------------------------------------------------------------------
// SECCION DE CONFIRMACION DE ASISTENCIA
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('rsvp-form');
    const formMessage = document.createElement('div');
    formMessage.className = 'form-message';
    form.insertBefore(formMessage, form.firstChild);

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validación básica
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const attending = document.querySelector('input[name="attending"]:checked');
        
        let isValid = true;
        
        if (!name) {
            showError('Por favor ingresa tu nombre completo');
            isValid = false;
        }
        
        if (!email) {
            showError('Por favor ingresa tu email');
            isValid = false;
        } else if (!validateEmail(email)) {
            showError('Por favor ingresa un email válido');
            isValid = false;
        }
        
        if (!attending) {
            showError('Por favor selecciona si asistirás o no');
            isValid = false;
        }
        
        if (isValid) {
            // Mostrar carga
            const submitBtn = form.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
            
            // Simular envío (en producción, reemplazar con AJAX real)
            setTimeout(() => {
                showSuccess('¡Gracias por confirmar tu asistencia! Tu respuesta ha sido registrada.');
                form.reset();
                submitBtn.disabled = false;
                submitBtn.textContent = 'Confirmar Asistencia';
                
                // Aquí en producción harías el envío real con fetch o AJAX
                // sendFormData(new FormData(form));
            }, 1500);
        }
    });
    
    function showError(message) {
        formMessage.textContent = message;
        formMessage.className = 'form-message error';
        formMessage.style.display = 'block';
        
        // Scroll al mensaje de error
        formMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    function showSuccess(message) {
        formMessage.textContent = message;
        formMessage.className = 'form-message success';
        formMessage.style.display = 'block';
        
        // Scroll al mensaje de éxito
        formMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Ocultar mensaje después de 5 segundos
        setTimeout(() => {
            formMessage.style.display = 'none';
        }, 5000);
    }
    
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    // En producción, esta función enviaría los datos al servidor
    function sendFormData(formData) {
        fetch('process_rsvp.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showSuccess(data.message || '¡Gracias por confirmar tu asistencia!');
                form.reset();
            } else {
                showError(data.message || 'Hubo un error al enviar tu respuesta. Por favor intenta nuevamente.');
            }
        })
        .catch(error => {
            showError('Error de conexión. Por favor intenta nuevamente.');
        })
        .finally(() => {
            const submitBtn = form.querySelector('button[type="submit"]');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Confirmar Asistencia';
        });
    }
});

// ----------------------------------------------------------------------------------
// Table reservation functionality
document.addEventListener('DOMContentLoaded', function() {
    // Variables de estado
    let currentStep = 1;
    let verifiedGuest = null;
    let selectedTable = null;
    let tableCategory = null;
    let tableName = '';
    let selectedGuests = [];
    
    // Elementos del DOM
    const steps = {
        1: document.getElementById('step-verification'),
        2: document.getElementById('step-selection'),
        3: document.getElementById('step-customization'),
        4: document.getElementById('step-confirmation'),
        success: document.getElementById('reservation-success')
    };
    
    const verifyBtn = document.getElementById('verify-btn');
    const tablesGrid = document.getElementById('tables-grid');
    const guestSelectionContainer = document.getElementById('guest-selection-container');
    const guestSelection = document.getElementById('guest-selection');
    const confirmBtn = document.getElementById('confirm-reservation-btn');
    const newReservationBtn = document.getElementById('new-reservation-btn');
    
    // Datos simulados (en producción serían peticiones AJAX)
    const mockGuests = [
        { id: 1, name: 'María González', email: 'maria@example.com', rsvp: true },
        { id: 2, name: 'Juan Pérez', email: 'juan@example.com', rsvp: true },
        { id: 3, name: 'Ana Rodríguez', email: 'ana@example.com', rsvp: true },
        { id: 4, name: 'Carlos Sánchez', email: 'carlos@example.com', rsvp: true },
        { id: 5, name: 'Laura Martínez', email: 'laura@example.com', rsvp: true },
        { id: 6, name: 'Pedro López', email: 'pedro@example.com', rsvp: true }
    ];
    
    const mockTables = Array.from({ length: 20 }, (_, i) => {
        const tableNames = ['Jardín', 'Fuente', 'Cerezo', 'Mirador', 'Espejo', 'Estrella', 
                          'Luna', 'Sol', 'Rosa', 'Tulipán', 'Clavel', 'Orquídea', 
                          'Violeta', 'Margarita', 'Girasol', 'Azalea', 'Camelia', 'Dalia', 
                          'Hortensia', 'Jazmín'];
        const locations = ['Junto al jardín', 'Cerca de la fuente', 'Bajo el cerezo', 
                         'Vista panorámica', 'Zona íntima', 'Área central', 
                         'Cerca del escenario', 'Junto a la pista de baile'];
        const capacities = [4, 6, 8];
        
        const capacity = capacities[Math.floor(Math.random() * capacities.length)];
        const reserved = Math.floor(Math.random() * (capacity - 1));
        const available = capacity - reserved;
        
        let status;
        if (available === capacity) status = 'available';
        else if (available <= 2) status = 'almost-full';
        else status = 'available';
        
        return {
            id: `table-${i+1}`,
            name: `Mesa ${tableNames[i]}`,
            capacity,
            reserved,
            available,
            status,
            location: locations[Math.floor(Math.random() * locations.length)]
        };
    });
    
    // Inicializar la aplicación
    initApp();
    
    function initApp() {
        // Cargar mesas
        loadTables();
        
        // Event listeners
        verifyBtn.addEventListener('click', verifyGuest);
        
        document.querySelectorAll('input[name="table-category"]').forEach(radio => {
            radio.addEventListener('change', function() {
                tableCategory = this.value;
                updateGuestSelection();
            });
        });
        
        document.getElementById('table-name').addEventListener('input', function() {
            tableName = this.value;
        });
        
        confirmBtn.addEventListener('click', confirmReservation);
        newReservationBtn.addEventListener('click', resetForm);
    }
    
    function verifyGuest() {
        const name = document.getElementById('search-name').value.trim();
        const email = document.getElementById('search-email').value.trim();
        
        if (!name || !email) {
            showVerificationResult('Por favor completa todos los campos', false);
            return;
        }
        
        // Simular verificación (en producción sería AJAX)
        setTimeout(() => {
            const guest = mockGuests.find(g => 
                g.name.toLowerCase() === name.toLowerCase() && 
                g.email.toLowerCase() === email.toLowerCase()
            );
            
            if (guest && guest.rsvp) {
                verifiedGuest = guest;
                showVerificationResult(`¡Hola ${guest.name}! Confirmamos tu asistencia. Ahora selecciona tu mesa.`, true);
                nextStep();
            } else {
                showVerificationResult('No encontramos tu confirmación. Verifica tus datos o contacta a los novios.', false);
            }
        }, 800);
    }
    
    function showVerificationResult(message, isSuccess) {
        const resultDiv = document.getElementById('verification-result');
        resultDiv.textContent = message;
        resultDiv.className = `verification-result ${isSuccess ? 'success' : 'error'}`;
    }
    
    function loadTables() {
        tablesGrid.innerHTML = '';
        
        mockTables.forEach(table => {
            const tableCard = document.createElement('div');
            tableCard.className = `table-card ${table.available === 0 ? 'disabled' : ''}`;
            tableCard.setAttribute('data-table', table.id);
            
            let statusText, statusClass;
            if (table.available === 0) {
                statusText = 'Completa';
                statusClass = 'full';
            } else if (table.available <= 2) {
                statusText = 'Casi llena';
                statusClass = 'almost-full';
            } else {
                statusText = 'Disponible';
                statusClass = 'available';
            }
            
            tableCard.innerHTML = `
                <div class="table-header">
                    <h3>${table.name}</h3>
                    <div class="table-status ${statusClass}">${statusText}</div>
                </div>
                <div class="table-info">
                    <div class="table-capacity">
                        <i class="fas fa-users"></i>
                        <span>${table.available} espacios de ${table.capacity}</span>
                    </div>
                    <div class="table-location">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${table.location}</span>
                    </div>
                </div>
            `;
            
            if (table.available > 0) {
                tableCard.addEventListener('click', function() {
                    selectTable(table);
                });
            }
            
            tablesGrid.appendChild(tableCard);
        });
    }
    
    function selectTable(table) {
        selectedTable = table;
        
        // Actualizar UI
        document.querySelectorAll('.table-card').forEach(card => {
            card.classList.remove('selected');
        });
        
        document.querySelector(`.table-card[data-table="${table.id}"]`).classList.add('selected');
        
        // Mostrar info de mesa seleccionada
        const infoDiv = document.getElementById('selected-table-info');
        infoDiv.innerHTML = `
            <h4>${table.name}</h4>
            <p><strong>Capacidad:</strong> ${table.capacity} personas</p>
            <p><strong>Disponibilidad:</strong> ${table.available} espacios libres</p>
            <p><strong>Ubicación:</strong> ${table.location}</p>
            <div class="table-guests">
                <h4>Invitados en esta mesa:</h4>
                ${table.reserved > 0 ? 
                    Array.from({ length: table.reserved }, (_, i) => 
                        `<span class="guest-badge">Invitado ${i+1}</span>`
                    ).join('') : 
                    '<p>Esta mesa está vacía</p>'
                }
            </div>
        `;
        
        nextStep();
    }
    
    function updateGuestSelection() {
        if (!tableCategory) return;
        
        guestSelection.innerHTML = '';
        
        if (tableCategory === 'individual') {
            // Mesa individual - solo el usuario
            selectedGuests = [verifiedGuest];
            guestSelection.innerHTML = `
                <p class="info-text">Esta mesa es solo para ti. No se pueden agregar más invitados.</p>
                <div class="guest-item">
                    <div class="guest-avatar">${getInitials(verifiedGuest.name)}</div>
                    <div class="guest-info">
                        <div class="guest-name">${verifiedGuest.name}</div>
                        <div class="guest-email">${verifiedGuest.email}</div>
                    </div>
                </div>
            `;
        } else {
            // Mesa de amigos/familia - seleccionar compañeros
            const maxGuests = selectedTable.capacity - 1;
            const availableGuests = mockGuests.filter(g => g.id !== verifiedGuest.id);
            
            guestSelection.innerHTML = `
                <p class="info-text">Selecciona hasta ${maxGuests} compañeros para tu mesa:</p>
                <div class="guest-list">
                    ${availableGuests.map(guest => `
                        <div class="guest-item">
                            <input type="checkbox" class="guest-checkbox" id="guest-${guest.id}" value="${guest.id}">
                            <div class="guest-avatar">${getInitials(guest.name)}</div>
                            <div class="guest-info">
                                <div class="guest-name">${guest.name}</div>
                                <div class="guest-email">${guest.email}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <p class="capacity-info">Puedes seleccionar hasta ${maxGuests} invitados adicionales</p>
            `;
            
            // Event listeners para checkboxes
            document.querySelectorAll('.guest-checkbox').forEach(checkbox => {
                checkbox.addEventListener('change', function() {
                    const guestId = parseInt(this.value);
                    const guest = mockGuests.find(g => g.id === guestId);
                    
                    if (this.checked) {
                        if (selectedGuests.length < maxGuests) {
                            selectedGuests.push(guest);
                        } else {
                            this.checked = false;
                            alert(`Solo puedes seleccionar hasta ${maxGuests} invitados adicionales`);
                        }
                    } else {
                        selectedGuests = selectedGuests.filter(g => g.id !== guestId);
                    }
                });
            });
            
            // Incluir al usuario principal
            selectedGuests = [verifiedGuest];
        }
        
        nextStep();
    }
    
    function getInitials(name) {
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    }
    
    function confirmReservation() {
        if (!selectedTable || !tableCategory) {
            alert('Por favor completa todos los pasos');
            return;
        }
        
        // Validar número de invitados para mesas grupales
        if ((tableCategory === 'amigos' || tableCategory === 'familiar') && selectedGuests.length === 1) {
            alert(`Debes seleccionar al menos un compañero para mesa ${tableCategory}`);
            return;
        }
        
        // Mostrar carga
        confirmBtn.disabled = true;
        confirmBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Confirmando...';
        
        // Simular envío (en producción sería AJAX)
        setTimeout(() => {
            // Mostrar resumen de éxito
            showSuccess();
        }, 1500);
    }
    
    function showSuccess() {
        const successDiv = steps.success;
        const successDetails = document.getElementById('success-details');
        
        // Construir mensaje según categoría
        let message;
        if (tableCategory === 'individual') {
            message = `Tu mesa individual ${selectedTable.name} ha sido reservada exitosamente.`;
        } else {
            const type = tableCategory === 'amigos' ? 'de amigos' : 'familiar';
            message = `Tu mesa ${type} "${tableName || selectedTable.name}" ha sido reservada para ${selectedGuests.length} personas.`;
        }
        
        document.getElementById('success-message').textContent = message;
        
        // Mostrar detalles
        successDetails.innerHTML = `
            <h4>Detalles de tu reserva:</h4>
            <p><strong>Mesa:</strong> ${selectedTable.name}</p>
            <p><strong>Categoría:</strong> ${getCategoryName(tableCategory)}</p>
            ${tableName ? `<p><strong>Nombre de mesa:</strong> ${tableName}</p>` : ''}
            <p><strong>Invitados:</strong></p>
            <div class="guest-badges">
                ${selectedGuests.map(guest => 
                    `<span class="guest-badge">${guest.name}</span>`
                ).join('')}
            </div>
            <p class="hint">Recibirás un correo con los detalles de tu reserva</p>
        `;
        
        // Mostrar paso de éxito
        changeStep('success');
    }
    
    function getCategoryName(category) {
        switch(category) {
            case 'individual': return 'Individual';
            case 'amigos': return 'Amigos';
            case 'familiar': return 'Familiar';
            default: return '';
        }
    }
    
    function resetForm() {
        // Resetear estado
        currentStep = 1;
        verifiedGuest = null;
        selectedTable = null;
        tableCategory = null;
        tableName = '';
        selectedGuests = [];
        
        // Resetear UI
        document.getElementById('search-name').value = '';
        document.getElementById('search-email').value = '';
        document.getElementById('verification-result').style.display = 'none';
        
        document.querySelectorAll('.table-card').forEach(card => {
            card.classList.remove('selected');
        });
        
        document.getElementById('selected-table-info').innerHTML = '<p>Selecciona una mesa para ver detalles</p>';
        
        document.querySelector('input[name="table-category"]:checked')?.checked = false;
        document.getElementById('table-name').value = '';
        guestSelection.innerHTML = '<p class="info-text">Selecciona una categoría primero</p>';
        
        confirmBtn.disabled = false;
        confirmBtn.innerHTML = 'Confirmar Reserva';
        
        // Volver al primer paso
        changeStep(1);
    }
    
    function nextStep() {
        changeStep(currentStep + 1);
    }
    
    function changeStep(step) {
        // Ocultar todos los pasos
        Object.values(steps).forEach(step => {
            step.style.display = 'none';
        });
        
        // Mostrar el paso actual
        if (typeof step === 'number') {
            currentStep = step;
            steps[step].style.display = 'block';
            steps[step].classList.add('active');
        } else {
            steps[step].style.display = 'block';
        }
        
        // Scroll al inicio de la sección
        document.getElementById('mesas').scrollIntoView({ behavior: 'smooth' });
    }
});

// -----------------------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', function() {
    // Crear elementos del lightbox
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
        <span class="close-lightbox">&times;</span>
        <div class="lightbox-content">
            <img class="lightbox-image" src="" alt="">
            <div class="lightbox-caption"></div>
        </div>
        <div class="nav-lightbox prev-lightbox">&#10094;</div>
        <div class="nav-lightbox next-lightbox">&#10095;</div>
    `;
    document.body.appendChild(lightbox);
    
    // Variables de estado
    let currentImageIndex = 0;
    const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
    const images = galleryItems.map(item => ({
        src: item.getAttribute('data-src'),
        alt: item.querySelector('img').getAttribute('alt'),
        title: item.querySelector('h3').textContent
    }));
    
    // Abrir lightbox al hacer clic en una imagen
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            currentImageIndex = index;
            openLightbox();
        });
    });
    
    // Funciones del lightbox
    function openLightbox() {
        const lightboxImg = lightbox.querySelector('.lightbox-image');
        const lightboxCaption = lightbox.querySelector('.lightbox-caption');
        
        lightbox.style.display = 'flex';
        lightboxImg.src = images[currentImageIndex].src;
        lightboxImg.alt = images[currentImageIndex].alt;
        lightboxCaption.textContent = images[currentImageIndex].title;
        
        // Deshabilitar scroll del body
        document.body.style.overflow = 'hidden';
    }
    
    function closeLightbox() {
        lightbox.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    
    function navigate(direction) {
        currentImageIndex += direction;
        
        // Circular navigation
        if (currentImageIndex >= images.length) {
            currentImageIndex = 0;
        } else if (currentImageIndex < 0) {
            currentImageIndex = images.length - 1;
        }
        
        openLightbox();
    }
    
    // Event listeners
    lightbox.querySelector('.close-lightbox').addEventListener('click', closeLightbox);
    lightbox.querySelector('.prev-lightbox').addEventListener('click', () => navigate(-1));
    lightbox.querySelector('.next-lightbox').addEventListener('click', () => navigate(1));
    
    // Cerrar con ESC
    document.addEventListener('keydown', function(e) {
        if (lightbox.style.display === 'flex') {
            if (e.key === 'Escape') {
                closeLightbox();
            } else if (e.key === 'ArrowLeft') {
                navigate(-1);
            } else if (e.key === 'ArrowRight') {
                navigate(1);
            }
        }
    });
    
    // Cerrar al hacer clic fuera de la imagen
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // Preload images for better lightbox performance
    function preloadImages() {
        images.forEach(img => {
            const image = new Image();
            image.src = img.src;
        });
    }
    
    preloadImages();
});

// -----------------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar tooltips para los íconos de información
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Modal para contribución a luna de miel
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';
    modalOverlay.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <h3 class="modal-title">Contribuir a la Luna de Miel</h3>
            <form class="contribution-form" id="contribution-form">
                <div class="form-group">
                    <label for="contribution-amount">Monto de contribución</label>
                    <div class="amount-options">
                        <div class="amount-option" data-amount="500">$500</div>
                        <div class="amount-option" data-amount="1000">$1,000</div>
                        <div class="amount-option" data-amount="2000">$2,000</div>
                        <div class="amount-option" data-amount="5000">$5,000</div>
                    </div>
                    <div class="custom-amount">
                        <span>O personaliza:</span>
                        <input type="number" id="contribution-amount" name="amount" min="100" step="100" placeholder="Monto en MXN">
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="contributor-name">Tu nombre</label>
                    <input type="text" id="contributor-name" name="name" required>
                </div>
                
                <div class="form-group">
                    <label for="contributor-email">Tu email</label>
                    <input type="email" id="contributor-email" name="email" required>
                </div>
                
                <div class="form-group">
                    <label for="contributor-message">Mensaje para los novios (opcional)</label>
                    <textarea id="contributor-message" name="message" rows="3" placeholder="¡Deseamos que tengan un viaje maravilloso!"></textarea>
                </div>
                
                <button type="submit" class="btn-primary">Continuar al Pago</button>
            </form>
        </div>
    `;
    document.body.appendChild(modalOverlay);
    
    // Variables de estado
    let selectedAmount = 0;
    
    // Event listeners
    document.querySelector('.btn-secondary').addEventListener('click', function(e) {
        e.preventDefault();
        openModal();
    });
    
    modalOverlay.querySelector('.close-modal').addEventListener('click', closeModal);
    
    // Selección de monto
    modalOverlay.querySelectorAll('.amount-option').forEach(option => {
        option.addEventListener('click', function() {
            modalOverlay.querySelectorAll('.amount-option').forEach(opt => {
                opt.classList.remove('selected');
            });
            
            this.classList.add('selected');
            selectedAmount = parseInt(this.getAttribute('data-amount'));
            document.getElementById('contribution-amount').value = selectedAmount;
        });
    });
    
    // Cambio de monto personalizado
    document.getElementById('contribution-amount').addEventListener('input', function() {
        selectedAmount = parseInt(this.value) || 0;
        modalOverlay.querySelectorAll('.amount-option').forEach(opt => {
            opt.classList.remove('selected');
        });
    });
    
    // Envío del formulario
    document.getElementById('contribution-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('contributor-name').value.trim();
        const email = document.getElementById('contributor-email').value.trim();
        const amount = selectedAmount || parseInt(document.getElementById('contribution-amount').value);
        const message = document.getElementById('contributor-message').value.trim();
        
        if (!name || !email || !amount || amount < 100) {
            Swal.fire({
                icon: 'error',
                title: 'Datos incompletos',
                text: 'Por favor completa todos los campos con información válida',
                confirmButtonColor: '#ff758c'
            });
            return;
        }
        
        // Simular procesamiento de pago
        Swal.fire({
            title: 'Procesando tu contribución',
            html: `Estamos registrando tu contribución de $${amount.toLocaleString()} MXN`,
            timer: 2000,
            timerProgressBar: true,
            didOpen: () => {
                Swal.showLoading();
            }
        }).then(() => {
            closeModal();
            Swal.fire({
                icon: 'success',
                title: '¡Gracias por tu contribución!',
                text: `Hemos registrado tu contribución de $${amount.toLocaleString()} MXN para la luna de miel de Ana y Carlos.`,
                confirmButtonColor: '#ff758c'
            });
        });
    });
    
    // Cerrar modal al hacer clic fuera
    modalOverlay.addEventListener('click', function(e) {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });
    
    // Función para abrir modal
    function openModal() {
        modalOverlay.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        document.getElementById('contributor-name').focus();
    }
    
    // Función para cerrar modal
    function closeModal() {
        modalOverlay.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    
    // Copiar datos bancarios al hacer clic
    document.querySelectorAll('.bank-item strong').forEach(item => {
        item.style.cursor = 'pointer';
        item.addEventListener('click', function() {
            const textToCopy = this.textContent;
            navigator.clipboard.writeText(textToCopy).then(() => {
                const originalText = this.textContent;
                this.textContent = '¡Copiado!';
                setTimeout(() => {
                    this.textContent = originalText;
                }, 2000);
            });
        });
    });
    
    // Efecto de hover en tarjetas de tiendas
    document.querySelectorAll('.store-link').forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.querySelector('i').style.transform = 'translateX(3px)';
        });
        
        link.addEventListener('mouseleave', function() {
            this.querySelector('i').style.transform = 'translateX(0)';
        });
    });
});

// --------------------------------------------------------------------------------------
// Smooth scrolling
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const headerHeight = document.getElementById('header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}