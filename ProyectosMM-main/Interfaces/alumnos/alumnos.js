// Funcionalidad para la interfaz del estudiante
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar la aplicación
    initializeApp();
    
    // Configurar event listeners
    setupEventListeners();
    
    // Cargar datos del dashboard
    loadDashboardData();
    
    // Configurar formularios
    setupForms();
    setupAdditionalForms();
});

function initializeApp() {
    console.log('Sistema de Gestión de Tutores - Interfaz Estudiante iniciada');
    
    // Configurar animaciones de entrada
    animateCards();
    
    // Configurar tooltips
    setupTooltips();
}

function setupEventListeners() {
    // Navegación del sidebar
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remover clase active de todos los elementos
            navLinks.forEach(l => l.parentElement.classList.remove('active'));
            
            // Agregar clase active al elemento clickeado
            this.parentElement.classList.add('active');
            
            // Simular carga de contenido
            const section = this.querySelector('span').textContent;
            loadSection(section);
        });
    });
    
    // Botones de sesiones
    const sessionButtons = document.querySelectorAll('.btn');
    sessionButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            handleSessionAction(this);
        });
    });
    
    // Avatar del usuario
    const userAvatar = document.querySelector('.user-avatar');
    if (userAvatar) {
        userAvatar.addEventListener('click', function() {
            showUserMenu();
        });
    }
}

function setupForms() {
    // Formulario de reserva
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleBookingSubmit(this);
        });
    }
}

function animateCards() {
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

function setupTooltips() {
    // Agregar tooltips a los iconos
    const icons = document.querySelectorAll('.card-icon, .activity-icon');
    icons.forEach(icon => {
        icon.addEventListener('mouseenter', function() {
            showTooltip(this, this.getAttribute('data-tooltip') || 'Información');
        });
        
        icon.addEventListener('mouseleave', function() {
            hideTooltip();
        });
    });
}

function showTooltip(element, text) {
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = text;
    tooltip.style.cssText = `
        position: absolute;
        background: #333;
        color: white;
        padding: 0.5rem;
        border-radius: 5px;
        font-size: 0.8rem;
        z-index: 1000;
        pointer-events: none;
    `;
    
    document.body.appendChild(tooltip);
    
    const rect = element.getBoundingClientRect();
    tooltip.style.left = rect.left + rect.width / 2 - tooltip.offsetWidth / 2 + 'px';
    tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
}

function hideTooltip() {
    const tooltip = document.querySelector('.tooltip');
    if (tooltip) {
        tooltip.remove();
    }
}

function loadSection(section) {
    console.log(`Cargando sección: ${section}`);
    
    // Simular carga de contenido
    const mainContent = document.querySelector('.main-content');
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'loading';
    loadingDiv.innerHTML = `
        <div style="text-align: center; padding: 2rem;">
            <div class="spinner"></div>
            <p>Cargando ${section}...</p>
        </div>
    `;
    
    // Agregar estilos para el spinner
    const style = document.createElement('style');
    style.textContent = `
        .spinner {
            width: 40px;
            height: 40px;
            border: 4px solid #f3f3f3;
            border-top: 4px solid #d19800;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 1rem;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
    
    // Simular carga después de 1 segundo
    setTimeout(() => {
        loadingDiv.remove();
        style.remove();
        showSectionContent(section);
    }, 1000);
}

function showSectionContent(section) {
    const contentHeader = document.querySelector('.content-header');
    const dashboardCards = document.querySelector('.dashboard-cards');
    const activitySection = document.querySelector('.activity-section');
    const sessionsSection = document.querySelector('.sessions-section');
    
    // Ocultar todas las secciones
    [dashboardCards, activitySection, sessionsSection].forEach(section => {
        if (section) section.style.display = 'none';
    });
    
    // Mostrar contenido según la sección
    switch(section) {
        case 'Inicio':
            contentHeader.innerHTML = '<h2>Bienvenido</h2><p>Gestiona tu aprendizaje y mantén contacto con tus tutores</p>';
            [dashboardCards, activitySection, sessionsSection].forEach(section => {
                if (section) section.style.display = 'block';
            });
            break;
        case 'Mis Cursos':
            contentHeader.innerHTML = '<h2>Mis Cursos</h2><p>Gestiona todos tus cursos activos</p>';
            showCoursesContent();
            break;
        case 'Mis Tutores':
            contentHeader.innerHTML = '<h2>Mis Tutores</h2><p>Conecta con tus tutores asignados</p>';
            showTutorsContent();
            break;
        case 'Horarios':
            contentHeader.innerHTML = '<h2>Horarios</h2><p>Consulta tu calendario de sesiones</p>';
            showScheduleContent();
            break;
        case 'Progreso':
            contentHeader.innerHTML = '<h2>Progreso</h2><p>Revisa tu avance académico</p>';
            showProgressContent();
            break;
        case 'Mensajes':
            contentHeader.innerHTML = '<h2>Mensajes</h2><p>Comunícate con tutores y compañeros</p>';
            showMessagesContent();
            break;
        case 'Configuración':
            contentHeader.innerHTML = '<h2>Configuración</h2><p>Personaliza tu experiencia</p>';
            showSettingsContent();
            break;
    }
}

function showCoursesContent() {
    const mainContent = document.querySelector('.main-content');
    const coursesDiv = document.createElement('div');
    coursesDiv.className = 'courses-content';
    coursesDiv.innerHTML = `
        <div class="courses-grid">
            <div class="course-card">
                <div class="course-header">
                    <h3>Matemáticas Avanzadas</h3>
                    <span class="course-status active">Activo</span>
                </div>
                <div class="course-info">
                    <p><strong>Tutor:</strong> María González</p>
                    <p><strong>Progreso:</strong> 75%</p>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: 75%"></div>
                    </div>
                </div>
            </div>
            <div class="course-card">
                <div class="course-header">
                    <h3>Física Cuántica</h3>
                    <span class="course-status active">Activo</span>
                </div>
                <div class="course-info">
                    <p><strong>Tutor:</strong> Carlos Ruiz</p>
                    <p><strong>Progreso:</strong> 60%</p>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: 60%"></div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Agregar estilos para las tarjetas de cursos
    const style = document.createElement('style');
    style.textContent = `
        .courses-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 1.5rem;
        }
        
        .course-card {
            background: white;
            border-radius: 15px;
            padding: 2rem;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
            border-left: 5px solid #d19800;
        }
        
        .course-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1rem;
        }
        
        .course-status {
            padding: 0.3rem 0.8rem;
            border-radius: 20px;
            font-size: 0.8rem;
            font-weight: 600;
        }
        
        .course-status.active {
            background: #d4edda;
            color: #155724;
        }
        
        .progress-bar {
            width: 100%;
            height: 8px;
            background: #e9ecef;
            border-radius: 4px;
            overflow: hidden;
            margin-top: 0.5rem;
        }
        
        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #d19800 0%, #f4d03f 100%);
            transition: width 0.3s ease;
        }
    `;
    document.head.appendChild(style);
    
    mainContent.appendChild(coursesDiv);
}

function showTutorsContent() {
    // Implementar contenido de tutores
    console.log('Mostrando contenido de tutores');
}

function showScheduleContent() {
    // Implementar contenido de horarios
    console.log('Mostrando contenido de horarios');
}

function showProgressContent() {
    // Implementar contenido de progreso
    console.log('Mostrando contenido de progreso');
}

function showMessagesContent() {
    // Implementar contenido de mensajes
    console.log('Mostrando contenido de mensajes');
}

function showSettingsContent() {
    // Implementar contenido de configuración
    console.log('Mostrando contenido de configuración');
}

function handleSessionAction(button) {
    const action = button.textContent.trim();
    
    if (action === 'Unirse') {
        // Simular unirse a sesión
        button.textContent = 'Conectando...';
        button.disabled = true;
        
        setTimeout(() => {
            button.textContent = 'En sesión';
            button.style.background = 'linear-gradient(135deg, #28a745 0%, #20c997 100%)';
        }, 2000);
    } else if (action === 'Detalles') {
        // Mostrar detalles de la sesión
        showSessionDetails();
    }
}

function showSessionDetails() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Detalles de la Sesión</h3>
                <span class="close">&times;</span>
            </div>
            <div class="modal-body">
                <p><strong>Materia:</strong> Física Cuántica</p>
                <p><strong>Tutor:</strong> Carlos Ruiz</p>
                <p><strong>Fecha:</strong> Mañana</p>
                <p><strong>Hora:</strong> 16:30</p>
                <p><strong>Tipo:</strong> Virtual</p>
                <p><strong>Duración:</strong> 60 minutos</p>
                <p><strong>Descripción:</strong> Repaso de conceptos fundamentales de mecánica cuántica</p>
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary">Unirse</button>
                <button class="btn btn-secondary close-modal">Cerrar</button>
            </div>
        </div>
    `;
    
    // Agregar estilos para el modal
    const style = document.createElement('style');
    style.textContent = `
        .modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2000;
        }
        
        .modal-content {
            background: white;
            border-radius: 15px;
            padding: 2rem;
            max-width: 500px;
            width: 90%;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }
        
        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1.5rem;
            padding-bottom: 1rem;
            border-bottom: 1px solid #e9ecef;
        }
        
        .close {
            font-size: 1.5rem;
            cursor: pointer;
            color: #999;
        }
        
        .modal-body p {
            margin-bottom: 0.8rem;
        }
        
        .modal-footer {
            display: flex;
            gap: 1rem;
            justify-content: flex-end;
            margin-top: 1.5rem;
            padding-top: 1rem;
            border-top: 1px solid #e9ecef;
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(modal);
    
    // Event listeners para cerrar modal
    modal.querySelector('.close').addEventListener('click', () => {
        modal.remove();
        style.remove();
    });
    
    modal.querySelector('.close-modal').addEventListener('click', () => {
        modal.remove();
        style.remove();
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
            style.remove();
        }
    });
}

function showUserMenu() {
    const menu = document.createElement('div');
    menu.className = 'user-menu';
    menu.innerHTML = `
        <div class="menu-item">
            <i class="fas fa-user"></i>
            <span>Mi Perfil</span>
        </div>
        <div class="menu-item">
            <i class="fas fa-cog"></i>
            <span>Configuración</span>
        </div>
        <div class="menu-item">
            <i class="fas fa-sign-out-alt"></i>
            <span>Cerrar Sesión</span>
        </div>
    `;
    
    // Agregar estilos para el menú de usuario
    const style = document.createElement('style');
    style.textContent = `
        .user-menu {
            position: absolute;
            top: 100%;
            right: 0;
            background: white;
            border-radius: 10px;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
            padding: 0.5rem 0;
            min-width: 200px;
            z-index: 1000;
        }
        
        .menu-item {
            display: flex;
            align-items: center;
            gap: 1rem;
            padding: 0.8rem 1rem;
            cursor: pointer;
            transition: background 0.3s ease;
        }
        
        .menu-item:hover {
            background: #f8f9fa;
        }
        
        .menu-item i {
            color: #d19800;
            width: 20px;
        }
    `;
    document.head.appendChild(style);
    
    const userInfo = document.querySelector('.user-info');
    userInfo.style.position = 'relative';
    userInfo.appendChild(menu);
    
    // Cerrar menú al hacer click fuera
    setTimeout(() => {
        document.addEventListener('click', function closeMenu(e) {
            if (!userInfo.contains(e.target)) {
                menu.remove();
                style.remove();
                document.removeEventListener('click', closeMenu);
            }
        });
    }, 100);
}

function loadDashboardData() {
    // Simular carga de datos del dashboard
    console.log('Cargando datos del dashboard...');
    
    // Aquí se harían las llamadas a la API para obtener datos reales
    // Por ahora solo mostramos datos de ejemplo
    updateDashboardStats();
}

function updateDashboardStats() {
    // Actualizar estadísticas del dashboard
    const stats = {
        courses: 5,
        tutors: 3,
        sessions: 12,
        progress: 85
    };
    
    // Animar los números
    animateNumbers('.card-content h3', stats);
}

function animateNumbers(selector, values) {
    const elements = document.querySelectorAll(selector);
    const valueArray = Object.values(values);
    
    elements.forEach((element, index) => {
        if (valueArray[index] !== undefined) {
            animateNumber(element, valueArray[index]);
        }
    });
}

function animateNumber(element, targetValue) {
    const isPercentage = targetValue.toString().includes('%');
    const numericValue = parseInt(targetValue);
    let currentValue = 0;
    const increment = numericValue / 50;
    
    const timer = setInterval(() => {
        currentValue += increment;
        if (currentValue >= numericValue) {
            currentValue = numericValue;
            clearInterval(timer);
        }
        
        element.textContent = Math.floor(currentValue) + (isPercentage ? '%' : '');
    }, 30);
}

// Funciones de utilidad
function formatDate(date) {
    return new Intl.DateTimeFormat('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(date);
}

function formatTime(time) {
    return new Intl.DateTimeFormat('es-ES', {
        hour: '2-digit',
        minute: '2-digit'
    }).format(time);
}

// Funciones de búsqueda y reserva de tutores
function openBookingModal() {
    const tutorSearchSection = document.getElementById('tutorSearchSection');
    if (tutorSearchSection) {
        tutorSearchSection.style.display = 'block';
        tutorSearchSection.scrollIntoView({ behavior: 'smooth' });
    }
}

function closeTutorSearchSection() {
    const tutorSearchSection = document.getElementById('tutorSearchSection');
    if (tutorSearchSection) {
        tutorSearchSection.style.display = 'none';
    }
}

function searchTutors() {
    const subject = document.getElementById('subjectFilter').value;
    const modality = document.getElementById('modalityFilter').value;
    const date = document.getElementById('dateFilter').value;
    const time = document.getElementById('timeFilter').value;
    
    console.log('Buscando tutores con filtros:', { subject, modality, date, time });
    showNotification('Buscando tutores disponibles...', 'info');
    
    // Simular búsqueda
    setTimeout(() => {
        showNotification('Se encontraron 2 tutores disponibles', 'success');
    }, 1500);
}

function bookTutor(tutorId) {
    console.log('Reservando tutor:', tutorId);
    
    // Obtener información del tutor
    const tutorCard = event.target.closest('.tutor-card');
    const tutorName = tutorCard.querySelector('h4').textContent;
    
    // Mostrar formulario de reserva
    const bookingSection = document.getElementById('bookingSection');
    const selectedTutorInput = document.getElementById('selectedTutor');
    
    if (bookingSection && selectedTutorInput) {
        selectedTutorInput.value = tutorName;
        bookingSection.style.display = 'block';
        bookingSection.scrollIntoView({ behavior: 'smooth' });
    }
}

function viewTutorProfile(tutorId) {
    console.log('Viendo perfil del tutor:', tutorId);
    showNotification('Abriendo perfil del tutor...', 'info');
}

function closeBookingSection() {
    const bookingSection = document.getElementById('bookingSection');
    if (bookingSection) {
        bookingSection.style.display = 'none';
    }
}

function handleBookingSubmit(form) {
    const formData = new FormData(form);
    const booking = {
        tutor: formData.get('tutor'),
        subject: formData.get('subject'),
        objective: formData.get('objective'),
        date: formData.get('date'),
        time: formData.get('time'),
        duration: formData.get('duration'),
        modality: formData.get('modality'),
        location: formData.get('location')
    };
    
    console.log('Nueva reserva:', booking);
    showNotification('Tutoría reservada exitosamente', 'success');
    
    // Limpiar formulario
    form.reset();
    
    // Cerrar sección
    closeBookingSection();
    closeTutorSearchSection();
}

// Función de notificaciones
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">&times;</button>
    `;
    
    // Agregar estilos para las notificaciones
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            border-radius: 10px;
            padding: 1rem;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
            display: flex;
            align-items: center;
            gap: 1rem;
            z-index: 3000;
            animation: slideIn 0.3s ease;
        }
        
        .notification-success {
            border-left: 4px solid #28a745;
        }
        
        .notification-error {
            border-left: 4px solid #dc3545;
        }
        
        .notification-info {
            border-left: 4px solid #d19800;
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .notification-content i {
            color: #d19800;
        }
        
        .notification-close {
            background: none;
            border: none;
            font-size: 1.2rem;
            cursor: pointer;
            color: #999;
        }
        
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // Cerrar notificación
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.remove();
    });
    
    // Auto-cerrar después de 5 segundos
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// Función para ver detalles del curso
function verDetallesCurso(cursoId) {
    console.log('Viendo detalles del curso:', cursoId);
    
    const cursos = {
        1: {
            nombre: 'Matemáticas Discretas',
            tutor: 'Dr. García',
            descripcion: 'Curso de matemáticas discretas enfocado en lógica, teoría de conjuntos y combinatoria.',
            proximaSesion: '30/09/2025',
            modalidad: 'Presencial',
            aula: 'Aula 201'
        },
        2: {
            nombre: 'Programación Avanzada',
            tutor: 'Dr. López',
            descripcion: 'Programación avanzada con enfoque en algoritmos y estructuras de datos.',
            proximaSesion: '02/10/2025',
            modalidad: 'Virtual',
            aula: 'Zoom'
        },
        3: {
            nombre: 'Física Cuántica',
            tutor: 'Dra. Martínez',
            descripcion: 'Introducción a la física cuántica y sus aplicaciones.',
            proximaSesion: '05/10/2025',
            modalidad: 'Híbrida',
            aula: 'Aula 105'
        }
    };
    
    const curso = cursos[cursoId];
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Detalles del Curso</h3>
                <span class="close">&times;</span>
            </div>
            <div class="modal-body">
                <div class="curso-detalle">
                    <h4>${curso.nombre}</h4>
                    <p><strong>Tutor:</strong> ${curso.tutor}</p>
                    <p><strong>Descripción:</strong> ${curso.descripcion}</p>
                    <p><strong>Próxima Sesión:</strong> ${curso.proximaSesion}</p>
                    <p><strong>Modalidad:</strong> ${curso.modalidad}</p>
                    <p><strong>Ubicación:</strong> ${curso.aula}</p>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary" onclick="unirseACurso(${cursoId})">Unirse al Curso</button>
                <button class="btn btn-secondary close-modal">Cerrar</button>
            </div>
        </div>
    `;
    
    // Agregar estilos para el modal
    const style = document.createElement('style');
    style.textContent = `
        .modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2000;
        }
        
        .modal-content {
            background: white;
            border-radius: 15px;
            padding: 2rem;
            max-width: 500px;
            width: 90%;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }
        
        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1.5rem;
            padding-bottom: 1rem;
            border-bottom: 1px solid #e9ecef;
        }
        
        .close {
            font-size: 1.5rem;
            cursor: pointer;
            color: #999;
        }
        
        .curso-detalle h4 {
            color: #7f0222;
            margin-bottom: 1rem;
            font-size: 1.3rem;
        }
        
        .curso-detalle p {
            margin-bottom: 0.8rem;
            color: #666;
        }
        
        .modal-footer {
            display: flex;
            gap: 1rem;
            justify-content: flex-end;
            margin-top: 1.5rem;
            padding-top: 1rem;
            border-top: 1px solid #e9ecef;
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(modal);
    
    // Event listeners para cerrar modal
    modal.querySelector('.close').addEventListener('click', () => {
        modal.remove();
        style.remove();
    });
    
    modal.querySelector('.close-modal').addEventListener('click', () => {
        modal.remove();
        style.remove();
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
            style.remove();
        }
    });
}

function unirseACurso(cursoId) {
    console.log('Uniéndose al curso:', cursoId);
    showNotification('Te has unido exitosamente al curso', 'success');
    
    // Cerrar modal
    const modal = document.querySelector('.modal');
    if (modal) {
        modal.remove();
    }
}

// Funciones para Recordatorios
function closeRecordatoriosSection() {
    const section = document.getElementById('recordatoriosSection');
    if (section) {
        section.style.display = 'none';
    }
}

function irASesion(sesionId) {
    console.log('Yendo a sesión:', sesionId);
    showNotification('Redirigiendo a la sesión...', 'info');
    
    // Simular redirección
    setTimeout(() => {
        showNotification('¡Sesión iniciada!', 'success');
    }, 1000);
}

function verDetallesSesion(sesionId) {
    console.log('Viendo detalles de sesión:', sesionId);
    showNotification('Mostrando detalles de la sesión', 'info');
}

function marcarComoLeido(recordatorioId) {
    console.log('Marcando recordatorio como leído:', recordatorioId);
    showNotification('Recordatorio marcado como leído', 'success');
    
    // Remover el recordatorio de la lista
    const recordatorio = event.target.closest('.recordatorio-item');
    if (recordatorio) {
        recordatorio.style.opacity = '0.5';
        recordatorio.style.transform = 'translateX(-100%)';
        setTimeout(() => {
            recordatorio.remove();
        }, 300);
    }
}

// Funciones para Valoraciones
function closeValoracionesSection() {
    const section = document.getElementById('valoracionesSection');
    if (section) {
        section.style.display = 'none';
    }
}

function valorarSesion(sesionId) {
    console.log('Valorando sesión:', sesionId);
    
    // Abrir la sección de valoraciones y enfocar en el formulario
    const valoracionesSection = document.getElementById('valoracionesSection');
    if (valoracionesSection) {
        valoracionesSection.style.display = 'block';
        valoracionesSection.scrollIntoView({ behavior: 'smooth' });
        
        // Scroll al formulario de nueva valoración
        setTimeout(() => {
            const form = document.querySelector('.nueva-valoracion');
            if (form) {
                form.scrollIntoView({ behavior: 'smooth' });
            }
        }, 500);
    }
}

// Función para manejar el envío de valoraciones
function handleValoracionSubmit(form) {
    const formData = new FormData(form);
    const valoracion = {
        tutor: formData.get('tutor'),
        materia: formData.get('materia'),
        rating: formData.get('rating'),
        comentario: formData.get('comentario')
    };
    
    console.log('Nueva valoración:', valoracion);
    showNotification('Valoración enviada exitosamente', 'success');
    
    form.reset();
    
    // Agregar la nueva valoración a la lista
    addNuevaValoracion(valoracion);
}

function addNuevaValoracion(valoracion) {
    const valoracionesList = document.querySelector('.valoraciones-list');
    if (!valoracionesList) return;
    
    const tutorNames = {
        'garcia': 'Dr. García',
        'lopez': 'Dr. López',
        'martinez': 'Dra. Martínez'
    };
    
    const materiaNames = {
        'matematicas': 'Matemáticas',
        'programacion': 'Programación',
        'fisica': 'Física'
    };
    
    const nuevaValoracion = document.createElement('div');
    nuevaValoracion.className = 'valoracion-item';
    nuevaValoracion.innerHTML = `
        <div class="valoracion-header">
            <div class="tutor-info">
                <div class="tutor-avatar-small">
                    <i class="fas fa-user-tie"></i>
                </div>
                <div class="tutor-details">
                    <h4>${tutorNames[valoracion.tutor]}</h4>
                    <p>${materiaNames[valoracion.materia]}</p>
                </div>
            </div>
            <div class="valoracion-stars">
                ${generateStars(valoracion.rating)}
            </div>
            <span class="valoracion-fecha">Ahora</span>
        </div>
        <div class="valoracion-comentario">
            <p>"${valoracion.comentario}"</p>
        </div>
    `;
    
    valoracionesList.insertBefore(nuevaValoracion, valoracionesList.firstChild);
}

function generateStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars += '<i class="fas fa-star"></i>';
        } else {
            stars += '<i class="far fa-star"></i>';
        }
    }
    return stars;
}

// Funciones mejoradas para sesiones
function cancelSession(sessionId) {
    console.log('Cancelando sesión:', sessionId);
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Cancelar Sesión</h3>
                <span class="close">&times;</span>
            </div>
            <div class="modal-body">
                <p>¿Estás seguro de que quieres cancelar esta sesión?</p>
                <div class="form-group">
                    <label>Motivo de cancelación</label>
                    <select id="cancelReason">
                        <option value="">Seleccionar motivo</option>
                        <option value="conflicto">Conflicto de horario</option>
                        <option value="emergencia">Emergencia personal</option>
                        <option value="otro">Otro motivo</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Comentario adicional</label>
                    <textarea id="cancelComment" rows="3" placeholder="Explica brevemente el motivo..."></textarea>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-danger" onclick="confirmarCancelacion(${sessionId})">Confirmar Cancelación</button>
                <button class="btn btn-secondary close-modal">Cancelar</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Event listeners para cerrar modal
    modal.querySelector('.close').addEventListener('click', () => modal.remove());
    modal.querySelector('.close-modal').addEventListener('click', () => modal.remove());
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
}

function confirmarCancelacion(sessionId) {
    const reason = document.getElementById('cancelReason').value;
    const comment = document.getElementById('cancelComment').value;
    
    if (!reason) {
        showNotification('Por favor selecciona un motivo de cancelación', 'error');
        return;
    }
    
    console.log('Cancelando sesión:', { sessionId, reason, comment });
    showNotification('Sesión cancelada exitosamente', 'success');
    
    // Remover la sesión de la lista
    const sessionItem = event.target.closest('.session-item');
    if (sessionItem) {
        sessionItem.style.opacity = '0.5';
        sessionItem.style.transform = 'translateX(-100%)';
        setTimeout(() => {
            sessionItem.remove();
        }, 300);
    }
    
    // Cerrar modal
    const modal = document.querySelector('.modal');
    if (modal) modal.remove();
}

function rescheduleSession(sessionId) {
    console.log('Reprogramando sesión:', sessionId);
    showNotification('Abriendo formulario de reprogramación...', 'info');
    
    // Simular apertura de formulario de reprogramación
    setTimeout(() => {
        showNotification('Formulario de reprogramación disponible', 'success');
    }, 1000);
}

// Función para configurar formularios adicionales
function setupAdditionalForms() {
    // Formulario de valoraciones
    const valoracionForm = document.getElementById('valoracionForm');
    if (valoracionForm) {
        valoracionForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleValoracionSubmit(this);
        });
    }
}

// Función para mostrar notificaciones mejoradas
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Agregar estilos si no existen
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 3000;
                max-width: 400px;
                border-radius: 10px;
                box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
                animation: slideIn 0.3s ease;
            }
            
            .notification-success {
                background: #d4edda;
                color: #155724;
                border-left: 4px solid #28a745;
            }
            
            .notification-error {
                background: #f8d7da;
                color: #721c24;
                border-left: 4px solid #dc3545;
            }
            
            .notification-info {
                background: #d1ecf1;
                color: #0c5460;
                border-left: 4px solid #17a2b8;
            }
            
            .notification-content {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                padding: 1rem;
            }
            
            .notification-close {
                background: none;
                border: none;
                cursor: pointer;
                margin-left: auto;
            }
            
            @keyframes slideIn {
                from { transform: translateX(100%); }
                to { transform: translateX(0); }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

function getNotificationIcon(type) {
    const icons = {
        'success': 'check-circle',
        'error': 'exclamation-circle',
        'info': 'info-circle'
    };
    return icons[type] || 'info-circle';
}

// Exportar funciones para uso global
window.StudentInterface = {
    loadSection,
    showSessionDetails,
    showUserMenu,
    loadDashboardData,
    openBookingModal,
    searchTutors,
    bookTutor,
    showNotification,
    verDetallesCurso,
    closeRecordatoriosSection,
    irASesion,
    verDetallesSesion,
    marcarComoLeido,
    closeValoracionesSection,
    valorarSesion,
    cancelSession,
    rescheduleSession,
    confirmarCancelacion
};
