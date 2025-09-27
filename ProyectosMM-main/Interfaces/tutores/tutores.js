// Funcionalidad para la interfaz del tutor
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar la aplicación
    initializeApp();
    
    // Configurar event listeners
    setupEventListeners();
    
    // Cargar datos del dashboard
    loadDashboardData();
    
    // Configurar notificaciones
    setupNotifications();
    
    // Configurar formularios
    setupForms();
});

function initializeApp() {
    console.log('Sistema de Gestión de Tutores - Panel del Tutor iniciado');
    
    // Configurar animaciones de entrada
    animateCards();
    
    // Configurar tooltips
    setupTooltips();
    
    // Inicializar funcionalidades específicas
    initializeSchedule();
    initializeStudents();
    initializeTasks();
    initializeMessages();
    initializeAvailability();
    initializeSessionManagement();
    initializeRatings();
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
    
    // Botones de horario
    const scheduleButtons = document.querySelectorAll('.schedule-actions .btn');
    scheduleButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            handleScheduleAction(this);
        });
    });
    
    // Botones de estudiantes
    const studentButtons = document.querySelectorAll('.student-actions .btn-icon');
    studentButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const action = this.title;
            const studentItem = this.closest('.student-item');
            handleStudentAction(action, studentItem);
        });
    });
    
    // Botones de tareas
    const taskButtons = document.querySelectorAll('.task-actions .btn');
    taskButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            handleTaskAction(this);
        });
    });
    
    // Mensajes
    const messageItems = document.querySelectorAll('.message-item');
    messageItems.forEach(item => {
        item.addEventListener('click', function() {
            const studentName = this.querySelector('h4').textContent;
            openMessageDialog(studentName);
        });
    });
    
    // Avatar del usuario
    const userAvatar = document.querySelector('.user-avatar');
    if (userAvatar) {
        userAvatar.addEventListener('click', function() {
            showUserMenu();
        });
    }
    
    // Campana de notificaciones
    const notificationBell = document.querySelector('.notification-bell');
    if (notificationBell) {
        notificationBell.addEventListener('click', function() {
            showNotifications();
        });
    }
}

function setupForms() {
    // Formulario de disponibilidades
    const availabilityForm = document.getElementById('availabilityForm');
    if (availabilityForm) {
        availabilityForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleAvailabilitySubmit(this);
        });
    }
}

// Funciones de gestión de disponibilidades
function openScheduleModal() {
    const availabilitySection = document.getElementById('availabilitySection');
    if (availabilitySection) {
        availabilitySection.style.display = 'block';
        availabilitySection.scrollIntoView({ behavior: 'smooth' });
    }
}

function closeAvailabilitySection() {
    const availabilitySection = document.getElementById('availabilitySection');
    if (availabilitySection) {
        availabilitySection.style.display = 'none';
    }
}

function handleAvailabilitySubmit(form) {
    const formData = new FormData(form);
    const availability = {
        day: formData.get('day'),
        startTime: formData.get('startTime'),
        endTime: formData.get('endTime'),
        modality: formData.get('modality'),
        location: formData.get('location'),
        recurrent: formData.get('recurrent') === 'on'
    };
    
    console.log('Nueva disponibilidad:', availability);
    showNotification('Disponibilidad agregada exitosamente', 'success');
    
    // Limpiar formulario
    form.reset();
    
    // Actualizar lista de disponibilidades
    updateAvailabilityList(availability);
}

function updateAvailabilityList(availability) {
    const availabilityList = document.querySelector('.availability-list');
    if (availabilityList) {
        const newItem = document.createElement('div');
        newItem.className = 'availability-item';
        newItem.innerHTML = `
            <div class="availability-info">
                <span class="day">${availability.day}</span>
                <span class="time">${availability.startTime} - ${availability.endTime}</span>
                <span class="modality ${availability.modality}">${availability.modality}</span>
            </div>
            <div class="availability-actions">
                <button class="btn-icon" onclick="editAvailability(${Date.now()})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-icon" onclick="deleteAvailability(${Date.now()})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        availabilityList.appendChild(newItem);
    }
}

function editAvailability(id) {
    console.log('Editando disponibilidad:', id);
    showNotification('Funcionalidad de edición en desarrollo', 'info');
}

function deleteAvailability(id) {
    if (confirm('¿Estás seguro de que quieres eliminar esta disponibilidad?')) {
        console.log('Eliminando disponibilidad:', id);
        showNotification('Disponibilidad eliminada', 'success');
    }
}

// Funciones de gestión de sesiones
function initializeSessionManagement() {
    console.log('Inicializando gestión de sesiones');
}

function closeSessionManagementSection() {
    const sessionSection = document.getElementById('sessionManagementSection');
    if (sessionSection) {
        sessionSection.style.display = 'none';
    }
}

function showSessionTab(tab) {
    // Remover clase active de todos los tabs
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    
    // Agregar clase active al tab seleccionado
    event.target.classList.add('active');
    
    console.log('Mostrando tab:', tab);
    
    // Aquí se cargaría el contenido específico del tab
    switch(tab) {
        case 'pending':
            loadPendingSessions();
            break;
        case 'confirmed':
            loadConfirmedSessions();
            break;
        case 'completed':
            loadCompletedSessions();
            break;
    }
}

function loadPendingSessions() {
    console.log('Cargando sesiones pendientes');
}

function loadConfirmedSessions() {
    console.log('Cargando sesiones confirmadas');
}

function loadCompletedSessions() {
    console.log('Cargando sesiones completadas');
}

function acceptSession(sessionId) {
    console.log('Aceptando sesión:', sessionId);
    showNotification('Sesión aceptada exitosamente', 'success');
}

function proposeNewTime(sessionId) {
    console.log('Proponiendo nuevo horario para sesión:', sessionId);
    showNotification('Funcionalidad de reprogramación en desarrollo', 'info');
}

function rejectSession(sessionId) {
    if (confirm('¿Estás seguro de que quieres rechazar esta sesión?')) {
        console.log('Rechazando sesión:', sessionId);
        showNotification('Sesión rechazada', 'success');
    }
}

// Funciones de valoraciones
function initializeRatings() {
    console.log('Inicializando sistema de valoraciones');
}

function closeRatingsSection() {
    const ratingsSection = document.getElementById('ratingsSection');
    if (ratingsSection) {
        ratingsSection.style.display = 'none';
    }
}

// Funciones mejoradas de navegación
function loadSection(section) {
    console.log(`Cargando sección: ${section}`);
    
    // Ocultar todas las secciones especiales
    hideAllSpecialSections();
    
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

function hideAllSpecialSections() {
    const sections = ['availabilitySection', 'sessionManagementSection', 'ratingsSection'];
    sections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (section) {
            section.style.display = 'none';
        }
    });
}

function showSectionContent(section) {
    const contentHeader = document.querySelector('.content-header');
    const dashboardCards = document.querySelector('.dashboard-cards');
    const dashboardContent = document.querySelector('.dashboard-content');
    const tasksMessagesSection = document.querySelector('.tasks-messages-section');
    
    // Ocultar todas las secciones
    [dashboardCards, dashboardContent, tasksMessagesSection].forEach(section => {
        if (section) section.style.display = 'none';
    });
    
    // Mostrar contenido según la sección
    switch(section) {
        case 'Inicio':
            contentHeader.innerHTML = '<h2>Bienvenida, Tutor</h2><p>Gestiona tus estudiantes y sesiones de tutoría</p>';
            [dashboardCards, dashboardContent, tasksMessagesSection].forEach(section => {
                if (section) section.style.display = 'block';
            });
            break;
        case 'Mis Estudiantes':
            contentHeader.innerHTML = '<h2>Mis Estudiantes</h2><p>Gestiona todos tus estudiantes asignados</p>';
            showStudentsContent();
            break;
        case 'Mis Cursos':
            contentHeader.innerHTML = '<h2>Mis Cursos</h2><p>Administra los cursos que impartes</p>';
            showCoursesContent();
            break;
        case 'Horarios':
            contentHeader.innerHTML = '<h2>Mis Horarios</h2><p>Gestiona tu calendario de sesiones</p>';
            showScheduleContent();
            break;
        case 'Tareas':
            contentHeader.innerHTML = '<h2>Mis Tareas</h2><p>Administra las tareas pendientes</p>';
            showTasksContent();
            break;
        case 'Progreso':
            contentHeader.innerHTML = '<h2>Progreso de Estudiantes</h2><p>Revisa el avance de tus estudiantes</p>';
            showProgressContent();
            break;
        case 'Mensajes':
            contentHeader.innerHTML = '<h2>Mensajes</h2><p>Comunícate con tus estudiantes</p>';
            showMessagesContent();
            break;
        case 'Configuración':
            contentHeader.innerHTML = '<h2>Configuración</h2><p>Personaliza tu experiencia</p>';
            showSettingsContent();
            break;
    }
}

function showStudentsContent() {
    // Mostrar sección de estudiantes
    const dashboardContent = document.querySelector('.dashboard-content');
    if (dashboardContent) {
        dashboardContent.style.display = 'block';
    }
    console.log('Mostrando contenido de estudiantes');
}

function showCoursesContent() {
    // Implementar contenido de cursos
    console.log('Mostrando contenido de cursos');
}

function showScheduleContent() {
    // Mostrar gestión de horarios
    const availabilitySection = document.getElementById('availabilitySection');
    if (availabilitySection) {
        availabilitySection.style.display = 'block';
    }
    console.log('Mostrando contenido de horarios');
}

function showTasksContent() {
    // Mostrar sección de tareas
    const tasksMessagesSection = document.querySelector('.tasks-messages-section');
    if (tasksMessagesSection) {
        tasksMessagesSection.style.display = 'block';
    }
    console.log('Mostrando contenido de tareas');
}

function showProgressContent() {
    // Implementar contenido de progreso
    console.log('Mostrando contenido de progreso');
}

function showMessagesContent() {
    // Mostrar sección de mensajes
    const tasksMessagesSection = document.querySelector('.tasks-messages-section');
    if (tasksMessagesSection) {
        tasksMessagesSection.style.display = 'block';
    }
    console.log('Mostrando contenido de mensajes');
}

function showSettingsContent() {
    // Implementar contenido de configuración
    console.log('Mostrando contenido de configuración');
}

// Funciones adicionales para botones
function showAllStudents() {
    console.log('Mostrando todos los estudiantes');
    showNotification('Cargando lista completa de estudiantes...', 'info');
}

function showAllTasks() {
    console.log('Mostrando todas las tareas');
    showNotification('Cargando lista completa de tareas...', 'info');
}

function showAllMessages() {
    console.log('Mostrando todos los mensajes');
    showNotification('Cargando lista completa de mensajes...', 'info');
}

function initializeAvailability() {
    console.log('Inicializando gestión de disponibilidades');
}

function animateCards() {
    const cards = document.querySelectorAll('.card, .schedule-item, .student-item, .task-item, .message-item');
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
    const icons = document.querySelectorAll('.card-icon, .btn-icon');
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

function initializeSchedule() {
    // Configurar funcionalidades del horario
    console.log('Inicializando horario del tutor');
    
    // Simular actualización de horario en tiempo real
    setInterval(() => {
        updateScheduleStatus();
    }, 60000); // Cada minuto
}

function initializeStudents() {
    // Configurar funcionalidades de estudiantes
    console.log('Inicializando gestión de estudiantes');
}

function initializeTasks() {
    // Configurar funcionalidades de tareas
    console.log('Inicializando gestión de tareas');
}

function initializeMessages() {
    // Configurar funcionalidades de mensajes
    console.log('Inicializando sistema de mensajes');
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
    const dashboardContent = document.querySelector('.dashboard-content');
    const tasksMessagesSection = document.querySelector('.tasks-messages-section');
    
    // Ocultar todas las secciones
    [dashboardCards, dashboardContent, tasksMessagesSection].forEach(section => {
        if (section) section.style.display = 'none';
    });
    
    // Mostrar contenido según la sección
    switch(section) {
        case 'Inicio':
            contentHeader.innerHTML = '<h2>Bienvenida, María</h2><p>Gestiona tus estudiantes y sesiones de tutoría</p>';
            [dashboardCards, dashboardContent, tasksMessagesSection].forEach(section => {
                if (section) section.style.display = 'block';
            });
            break;
        case 'Mis Estudiantes':
            contentHeader.innerHTML = '<h2>Mis Estudiantes</h2><p>Gestiona todos tus estudiantes asignados</p>';
            showStudentsContent();
            break;
        case 'Mis Cursos':
            contentHeader.innerHTML = '<h2>Mis Cursos</h2><p>Administra los cursos que impartes</p>';
            showCoursesContent();
            break;
        case 'Horarios':
            contentHeader.innerHTML = '<h2>Mis Horarios</h2><p>Gestiona tu calendario de sesiones</p>';
            showScheduleContent();
            break;
        case 'Tareas':
            contentHeader.innerHTML = '<h2>Mis Tareas</h2><p>Administra las tareas pendientes</p>';
            showTasksContent();
            break;
        case 'Progreso':
            contentHeader.innerHTML = '<h2>Progreso de Estudiantes</h2><p>Revisa el avance de tus estudiantes</p>';
            showProgressContent();
            break;
        case 'Mensajes':
            contentHeader.innerHTML = '<h2>Mensajes</h2><p>Comunícate con tus estudiantes</p>';
            showMessagesContent();
            break;
        case 'Configuración':
            contentHeader.innerHTML = '<h2>Configuración</h2><p>Personaliza tu experiencia</p>';
            showSettingsContent();
            break;
    }
}

function showStudentsContent() {
    // Implementar contenido de estudiantes
    console.log('Mostrando contenido de estudiantes');
}

function showCoursesContent() {
    // Implementar contenido de cursos
    console.log('Mostrando contenido de cursos');
}

function showScheduleContent() {
    // Implementar contenido de horarios
    console.log('Mostrando contenido de horarios');
}

function showTasksContent() {
    // Implementar contenido de tareas
    console.log('Mostrando contenido de tareas');
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

function handleScheduleAction(button) {
    const action = button.textContent.trim();
    const scheduleItem = button.closest('.schedule-item');
    const sessionName = scheduleItem.querySelector('h4').textContent;
    const studentName = scheduleItem.querySelector('p').textContent;
    
    switch(action) {
        case 'Iniciar':
            startSession(sessionName, studentName);
            break;
        case 'Detalles':
            showSessionDetails(sessionName, studentName);
            break;
        case 'Programar':
            scheduleSession(sessionName, studentName);
            break;
    }
}

function startSession(sessionName, studentName) {
    console.log(`Iniciando sesión: ${sessionName} con ${studentName}`);
    
    // Simular inicio de sesión
    showNotification(`Sesión "${sessionName}" iniciada con ${studentName}`, 'success');
    
    // Cambiar estado del botón
    const button = event.target;
    button.textContent = 'En Sesión';
    button.style.background = 'linear-gradient(135deg, #28a745 0%, #20c997 100%)';
    button.disabled = true;
}

function showSessionDetails(sessionName, studentName) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Detalles de la Sesión</h3>
                <span class="close">&times;</span>
            </div>
            <div class="modal-body">
                <p><strong>Materia:</strong> ${sessionName}</p>
                <p><strong>Estudiante:</strong> ${studentName}</p>
                <p><strong>Fecha:</strong> Hoy</p>
                <p><strong>Hora:</strong> 11:00</p>
                <p><strong>Tipo:</strong> Virtual</p>
                <p><strong>Duración:</strong> 45 minutos</p>
                <p><strong>Objetivos:</strong> Repaso de conceptos fundamentales</p>
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary">Iniciar Sesión</button>
                <button class="btn btn-secondary close-modal">Cerrar</button>
            </div>
        </div>
    `;
    
    showModal(modal);
}

function scheduleSession(sessionName, studentName) {
    console.log(`Programando sesión: ${sessionName} con ${studentName}`);
    showNotification('Sesión programada exitosamente', 'success');
}

function handleStudentAction(action, studentItem) {
    const studentName = studentItem.querySelector('h4').textContent;
    
    switch(action) {
        case 'Mensaje':
            openMessageDialog(studentName);
            break;
        case 'Ver Perfil':
            showStudentProfile(studentName);
            break;
    }
}

function openMessageDialog(studentName) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Mensaje para ${studentName}</h3>
                <span class="close">&times;</span>
            </div>
            <div class="modal-body">
                <div class="message-input">
                    <textarea placeholder="Escribe tu mensaje aquí..." rows="4"></textarea>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary">Enviar Mensaje</button>
                <button class="btn btn-secondary close-modal">Cancelar</button>
            </div>
        </div>
    `;
    
    showModal(modal);
}

function showStudentProfile(studentName) {
    console.log(`Mostrando perfil de: ${studentName}`);
    showNotification(`Abriendo perfil de ${studentName}`, 'info');
}

function handleTaskAction(button) {
    const action = button.textContent.trim();
    const taskItem = button.closest('.task-item');
    const taskName = taskItem.querySelector('h4').textContent;
    
    switch(action) {
        case 'Revisar':
            reviewTask(taskName);
            break;
        case 'Preparar':
            prepareSession(taskName);
            break;
        case 'Evaluar':
            evaluateStudents(taskName);
            break;
    }
}

function reviewTask(taskName) {
    console.log(`Revisando tarea: ${taskName}`);
    showNotification(`Abriendo tarea: ${taskName}`, 'info');
}

function prepareSession(taskName) {
    console.log(`Preparando sesión: ${taskName}`);
    showNotification(`Preparando sesión: ${taskName}`, 'info');
}

function evaluateStudents(taskName) {
    console.log(`Evaluando estudiantes: ${taskName}`);
    showNotification(`Abriendo evaluación: ${taskName}`, 'info');
}

function showUserMenu() {
    const menu = document.createElement('div');
    menu.className = 'user-menu';
    menu.innerHTML = `
        <div class="menu-item">
            <i class="fas fa-user-tie"></i>
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

function setupNotifications() {
    // Simular notificaciones en tiempo real
    setInterval(() => {
        const notifications = [
            'Nuevo mensaje de estudiante',
            'Tarea pendiente de revisión',
            'Sesión programada para mañana',
            'Estudiante completó tarea',
            'Recordatorio de sesión'
        ];
        
        const randomNotification = notifications[Math.floor(Math.random() * notifications.length)];
        showNotification(randomNotification, 'info');
    }, 45000); // Cada 45 segundos
}

function showNotifications() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Notificaciones</h3>
                <span class="close">&times;</span>
            </div>
            <div class="modal-body">
                <div class="notification-list">
                    <div class="notification-item">
                        <div class="notification-icon">
                            <i class="fas fa-comment"></i>
                        </div>
                        <div class="notification-content">
                            <h4>Nuevo Mensaje</h4>
                            <p>Juan Pérez te envió un mensaje</p>
                            <span class="notification-time">Hace 5 minutos</span>
                        </div>
                    </div>
                    <div class="notification-item">
                        <div class="notification-icon">
                            <i class="fas fa-file-alt"></i>
                        </div>
                        <div class="notification-content">
                            <h4>Tarea Pendiente</h4>
                            <p>Revisar tarea de Ana Martínez</p>
                            <span class="notification-time">Hace 1 hora</span>
                        </div>
                    </div>
                    <div class="notification-item">
                        <div class="notification-icon">
                            <i class="fas fa-calendar-check"></i>
                        </div>
                        <div class="notification-content">
                            <h4>Sesión Programada</h4>
                            <p>Sesión de Matemáticas mañana a las 9:00</p>
                            <span class="notification-time">Hace 2 horas</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Agregar estilos para el modal de notificaciones
    const style = document.createElement('style');
    style.textContent = `
        .notification-list {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }
        
        .notification-item {
            display: flex;
            align-items: center;
            gap: 1rem;
            padding: 1rem;
            border-radius: 10px;
            background: #f8f9fa;
            transition: background 0.3s ease;
        }
        
        .notification-item:hover {
            background: #e9ecef;
        }
        
        .notification-icon {
            width: 40px;
            height: 40px;
            background: linear-gradient(135deg, #d19800 0%, #f4d03f 100%);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
        }
        
        .notification-content h4 {
            color: #333;
            margin-bottom: 0.5rem;
        }
        
        .notification-content p {
            color: #666;
            margin-bottom: 0.5rem;
        }
        
        .notification-time {
            color: #999;
            font-size: 0.9rem;
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(modal);
    
    // Event listeners para cerrar modal
    modal.querySelector('.close').addEventListener('click', () => {
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

function showModal(modal) {
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
        
        .message-input textarea {
            width: 100%;
            padding: 1rem;
            border: 2px solid #e9ecef;
            border-radius: 8px;
            font-size: 1rem;
            resize: vertical;
            min-height: 100px;
        }
        
        .message-input textarea:focus {
            outline: none;
            border-color: #d19800;
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

function updateScheduleStatus() {
    // Simular actualización del estado del horario
    console.log('Actualizando estado del horario...');
}

function loadDashboardData() {
    // Simular carga de datos del dashboard
    console.log('Cargando datos del dashboard del tutor...');
    
    // Actualizar estadísticas
    updateDashboardStats();
    
    // Actualizar horario
    updateSchedule();
    
    // Actualizar estudiantes
    updateStudents();
    
    // Actualizar tareas
    updateTasks();
    
    // Actualizar mensajes
    updateMessages();
}

function updateDashboardStats() {
    // Simular actualización de estadísticas
    const stats = {
        students: 12,
        courses: 5,
        sessions: 8,
        rating: 4.8
    };
    
    // Animar los números
    animateNumbers('.card-content h3', stats);
}

function updateSchedule() {
    // Simular actualización del horario
    console.log('Actualizando horario...');
}

function updateStudents() {
    // Simular actualización de estudiantes
    console.log('Actualizando estudiantes...');
}

function updateTasks() {
    // Simular actualización de tareas
    console.log('Actualizando tareas...');
}

function updateMessages() {
    // Simular actualización de mensajes
    console.log('Actualizando mensajes...');
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
    const isDecimal = targetValue.toString().includes('.');
    const numericValue = parseFloat(targetValue);
    let currentValue = 0;
    const increment = numericValue / 50;
    
    const timer = setInterval(() => {
        currentValue += increment;
        if (currentValue >= numericValue) {
            currentValue = numericValue;
            clearInterval(timer);
        }
        
        if (isDecimal) {
            element.textContent = currentValue.toFixed(1);
        } else {
            element.textContent = Math.floor(currentValue) + (isPercentage ? '%' : '');
        }
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

// Exportar funciones para uso global
window.TutorInterface = {
    loadSection,
    handleScheduleAction,
    handleStudentAction,
    handleTaskAction,
    showUserMenu,
    showNotifications,
    loadDashboardData
};
