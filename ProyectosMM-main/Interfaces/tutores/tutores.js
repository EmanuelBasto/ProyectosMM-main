// Sistema de Gestión de Tutores - Interfaz Tutor
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    loadSection('inicio');
});

// ===============================================
// INICIALIZACIÓN Y CONFIGURACIÓN
// ===============================================

function initializeApp() {
    console.log('Inicializando aplicación del tutor');
    
    // Cargar datos del tutor desde localStorage o configuración
    loadTutorData();
    
    // Configurar fecha mínima para formularios
    setupDateRestrictions();
    
    // Inicializar contadores del dashboard
    updateDashboardCounters();
    
    // Configurar notificaciones
    setupNotifications();
}

function loadTutorData() {
    // Conectar con el backend para obtener datos del tutor
    if (typeof BackendAPI !== 'undefined') {
        BackendAPI.getTutorProfile()
            .then(profile => {
                updateTutorWelcomeMessage(profile);
                updateTutorAvatar(profile);
                
                // Guardar en localStorage para persistencia
                localStorage.setItem('tutorData', JSON.stringify(profile));
            })
            .catch(error => {
                console.error('Error cargando perfil del tutor:', error);
                // Mantener datos vacíos en caso de error
                const emptyData = {
                    firstName: '',
                    lastName: '',
                    email: '',
                    specialty: '',
                    experience: 0,
                    timezone: '',
                    maxDailySessions: 8,
                    maxWeeklySessions: 40,
                    sessionDuration: 45,
                    breakTime: 15
                };
                localStorage.setItem('tutorData', JSON.stringify(emptyData));
            });
    } else {
        // Fallback: datos vacíos
        const emptyData = {
            firstName: '',
            lastName: '',
            email: '',
            specialty: '',
            experience: 0,
            timezone: '',
            maxDailySessions: 8,
            maxWeeklySessions: 40,
            sessionDuration: 45,
            breakTime: 15
        };
        localStorage.setItem('tutorData', JSON.stringify(emptyData));
    }
}

function getInitials(name) {
    return name.split(' ').map(word => word[0]).join('').toUpperCase();
}

function setupDateRestrictions() {
    const today = new Date().toISOString().split('T')[0];
    const dateInputs = document.querySelectorAll('input[type="date"]');
    dateInputs.forEach(input => {
        if (!input.hasAttribute('data-no-restriction')) {
            input.min = today;
        }
    });
}

function updateDashboardCounters() {
    // Simular datos del dashboard (en producción vendrían del backend)
    const dashboardData = {
        pendingRequests: "",
        upcomingSessions: "",
        averageRating: "",
        totalStudents: ""
    };
    
    document.getElementById('pendingRequests').textContent = dashboardData.pendingRequests;
    document.getElementById('upcomingSessions').textContent = dashboardData.upcomingSessions;
    document.getElementById('averageRating').textContent = dashboardData.averageRating;
    document.getElementById('totalStudents').textContent = dashboardData.totalStudents;
}

// ===============================================
// NAVEGACIÓN Y CARGA DE SECCIONES
// ===============================================

function loadSection(section) {
    console.log(`Cargando sección: ${section}`);
    
    // Cerrar menú móvil si está abierto
    closeMobileMenu();
    
    // Actualizar navegación activa
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    const activeItem = document.querySelector(`[data-section="${section}"]`);
    if (activeItem) {
        activeItem.classList.add('active');
    }
    
    // Mostrar contenido según la sección
    showSectionContent(section);
}

function showSectionContent(section) {
    const mainContent = document.getElementById('mainContent');
    
    switch(section) {
        case 'inicio':
            loadInicioSection();
            break;
        case 'horarios':
            loadHorariosSection();
            break;
        case 'sesiones':
            loadSesionesSection();
            break;
        case 'estudiantes':
            loadEstudiantesSection();
            break;
        case 'valoraciones':
            loadValoracionesSection();
            break;
        case 'historial':
            loadHistorialSection();
            break;
        case 'notificaciones':
            loadNotificacionesSection();
            break;
        default:
            loadInicioSection();
    }
}

function loadInicioSection() {
    const template = document.getElementById('inicioTemplate');
    const mainContent = document.getElementById('mainContent');
    mainContent.innerHTML = template.innerHTML;
    
    // Actualizar datos dinámicos
    updateDashboardCounters();
    
    // Cargar datos dinámicos desde el backend
    loadPendingRequests();
    loadUpcomingSessions();
    loadRecentActivity();
}

// FUNCIONES PARA CARGAR DATOS DINÁMICOS DEL INICIO
function loadPendingRequests() {
    const requestsList = document.querySelector('.requests-list');
    if (!requestsList) return;
    
    // Conectar con el backend para obtener las solicitudes pendientes
    if (typeof BackendAPI !== 'undefined') {
        BackendAPI.getPendingRequests()
            .then(requests => {
                displayPendingRequests(requests);
            })
            .catch(error => {
                console.error('Error cargando solicitudes pendientes:', error);
                displayPendingRequests([]);
            });
    } else {
        // Fallback: mostrar lista vacía
        displayPendingRequests([]);
    }
}

function displayPendingRequests(requests) {
    const requestsList = document.querySelector('.requests-list');
    if (!requestsList) return;
    
    if (requests.length === 0) {
        requestsList.innerHTML = `
            <div class="no-requests-message">
                <div class="no-requests-icon">
                    <i class="fas fa-clock"></i>
                </div>
                <h4>No hay solicitudes pendientes</h4>
                <p>Las nuevas solicitudes de estudiantes aparecerán aquí.</p>
            </div>
        `;
        return;
    }
    
    // Generar elementos de solicitudes dinámicamente
    requestsList.innerHTML = requests.map(request => `
        <div class="request-item">
            <div class="request-info">
                <h4>${request.studentName || ''}</h4>
                <p>${request.subject || ''}</p>
                <span class="request-date">${request.date || ''}</span>
                <span class="request-type ${request.modality || ''}">${request.modality || ''}</span>
            </div>
            <div class="request-actions">
                <button class="btn btn-success" onclick="acceptRequest('${request.id}')">Aceptar</button>
                <button class="btn btn-warning" onclick="proposeNewTime('${request.id}')">Proponer Hora</button>
                <button class="btn btn-danger" onclick="rejectRequest('${request.id}')">Rechazar</button>
            </div>
        </div>
    `).join('');
}

function loadUpcomingSessions() {
    const sessionsList = document.querySelector('.sessions-list');
    if (!sessionsList) return;
    
    // Conectar con el backend para obtener las próximas sesiones
    if (typeof BackendAPI !== 'undefined') {
        BackendAPI.getUpcomingSessions()
            .then(sessions => {
                displayUpcomingSessions(sessions);
            })
            .catch(error => {
                console.error('Error cargando próximas sesiones:', error);
                displayUpcomingSessions([]);
            });
    } else {
        // Fallback: mostrar lista vacía
        displayUpcomingSessions([]);
    }
}

function displayUpcomingSessions(sessions) {
    const sessionsList = document.querySelector('.sessions-list');
    if (!sessionsList) return;
    
    if (sessions.length === 0) {
        sessionsList.innerHTML = `
            <div class="no-sessions-message">
                <div class="no-sessions-icon">
                    <i class="fas fa-calendar-alt"></i>
                </div>
                <h4>No tienes sesiones programadas</h4>
                <p>Las sesiones confirmadas aparecerán aquí.</p>
            </div>
        `;
        return;
    }
    
    // Generar elementos de sesiones dinámicamente
    sessionsList.innerHTML = sessions.map(session => `
        <div class="session-item">
            <div class="session-time">
                <span class="time">${session.time || ''}</span>
                <span class="duration">${session.duration || ''}</span>
            </div>
            <div class="session-info">
                <h4>${session.title || ''}</h4>
                <p>${session.studentName || ''}</p>
                <span class="session-date">${session.date || ''}</span>
            </div>
            <div class="session-actions">
                <button class="btn btn-primary" onclick="markAttendance('${session.id}')">Marcar Asistencia</button>
                <button class="btn btn-outline" onclick="viewSessionDetails('${session.id}')">Ver Detalles</button>
            </div>
        </div>
    `).join('');
}

function loadRecentActivity() {
    const activityList = document.querySelector('.activity-list');
    if (!activityList) return;
    
    // Conectar con el backend para obtener las actividades recientes
    if (typeof BackendAPI !== 'undefined') {
        BackendAPI.getRecentActivity()
            .then(activities => {
                displayRecentActivity(activities);
            })
            .catch(error => {
                console.error('Error cargando actividades recientes:', error);
                displayRecentActivity([]);
            });
    } else {
        // Fallback: mostrar lista vacía
        displayRecentActivity([]);
    }
}

function displayRecentActivity(activities) {
    const activityList = document.querySelector('.activity-list');
    if (!activityList) return;
    
    if (activities.length === 0) {
        activityList.innerHTML = `
            <div class="no-activity-message">
                <div class="no-activity-icon">
                    <i class="fas fa-clock"></i>
                </div>
                <h4>No hay actividad reciente</h4>
                <p>Tu actividad aparecerá aquí cuando tengas interacciones con estudiantes.</p>
            </div>
        `;
        return;
    }
    
    // Generar elementos de actividad dinámicamente
    activityList.innerHTML = activities.map(activity => `
        <div class="activity-item">
            <div class="activity-icon">
                <i class="fas fa-${activity.icon || 'clock'}"></i>
            </div>
            <div class="activity-content">
                <h4>${activity.title || ''}</h4>
                <p>${activity.description || ''}</p>
                <span class="activity-time">${activity.time || ''}</span>
            </div>
        </div>
    `).join('');
}

function loadHorariosSection() {
    const mainContent = document.getElementById('mainContent');
    mainContent.innerHTML = `
        <div class="content-header">
            <h2>Gestión de Horarios</h2>
            <p>Configura tu disponibilidad y gestiona tu calendario de tutorías</p>
        </div>
        
        <div class="schedule-management">
            <div class="schedule-actions">
                <button class="btn btn-primary" onclick="openScheduleModal()">
                    <i class="fas fa-calendar-plus"></i> Configurar Disponibilidad
                </button>
                <button class="btn btn-outline" onclick="viewCurrentSchedule()">
                    <i class="fas fa-eye"></i> Ver Horario Actual
                </button>
            </div>
            
            <div class="current-availability">
                <h3>Disponibilidades Actuales</h3>
                <div class="availability-list">
                    <!-- Las disponibilidades se cargarán dinámicamente desde el backend -->
                </div>
            </div>
            
            <div class="schedule-blocks">
                <h3>Bloqueos Programados</h3>
                <div class="blocks-list">
                    <!-- Los bloqueos se cargarán dinámicamente desde el backend -->
                </div>
            </div>
            
            <div class="schedule-limits">
                <h3>Límites de Sesiones</h3>
                <div class="limits-display">
                    <!-- Los límites se cargarán dinámicamente desde el backend -->
                </div>
            </div>
        </div>
    `;
    
    // Cargar datos dinámicos desde el backend
    loadScheduleData();
}

// FUNCIONES PARA CARGAR DATOS DINÁMICOS DE HORARIOS
function loadScheduleData() {
    // Cargar disponibilidades actuales
    loadCurrentAvailability();
    
    // Cargar bloqueos programados
    loadScheduleBlocks();
    
    // Cargar límites de sesiones
    loadScheduleLimits();
}

function loadCurrentAvailability() {
    const availabilityList = document.querySelector('.availability-list');
    if (!availabilityList) return;
    
    // Conectar con el backend para obtener las disponibilidades actuales
    if (typeof BackendAPI !== 'undefined') {
        BackendAPI.getCurrentAvailability()
            .then(availability => {
                displayCurrentAvailability(availability);
            })
            .catch(error => {
                console.error('Error cargando disponibilidades:', error);
                displayCurrentAvailability([]);
            });
    } else {
        // Fallback: mostrar lista vacía
        displayCurrentAvailability([]);
    }
}

function displayCurrentAvailability(availability) {
    const availabilityList = document.querySelector('.availability-list');
    if (!availabilityList) return;
    
    if (availability.length === 0) {
        availabilityList.innerHTML = `
            <div class="no-availability-message">
                <div class="no-availability-icon">
                    <i class="fas fa-calendar-times"></i>
                </div>
                <h4>No hay disponibilidades configuradas</h4>
                <p>Configura tu disponibilidad para que los estudiantes puedan solicitar sesiones.</p>
                <button class="btn btn-primary" onclick="openScheduleModal()">
                    <i class="fas fa-calendar-plus"></i> Configurar Disponibilidad
                </button>
            </div>
        `;
        return;
    }
    
    // Generar elementos de disponibilidad dinámicamente
    availabilityList.innerHTML = availability.map(item => `
                    <div class="availability-item">
                        <div class="availability-info">
                <span class="day">${getDayName(item.day) || ''}</span>
                <span class="time">${item.startTime || ''} - ${item.endTime || ''}</span>
                <span class="modality ${item.modality || ''}">${item.modality || ''}</span>
                <span class="duration">${item.duration || 45} min</span>
                        </div>
                        <div class="availability-actions">
                <button class="btn btn-outline" onclick="editAvailability('${item.id}')">
                                <i class="fas fa-edit"></i> Editar
                            </button>
                <button class="btn btn-danger" onclick="deleteAvailability('${item.id}')">
                                <i class="fas fa-trash"></i> Eliminar
                            </button>
                        </div>
                    </div>
    `).join('');
}

function loadScheduleBlocks() {
    const blocksList = document.querySelector('.blocks-list');
    if (!blocksList) return;
    
    // Conectar con el backend para obtener los bloqueos programados
    if (typeof BackendAPI !== 'undefined') {
        BackendAPI.getScheduleBlocks()
            .then(blocks => {
                displayScheduleBlocks(blocks);
            })
            .catch(error => {
                console.error('Error cargando bloqueos:', error);
                displayScheduleBlocks([]);
            });
    } else {
        // Fallback: mostrar lista vacía
        displayScheduleBlocks([]);
    }
}

function displayScheduleBlocks(blocks) {
    const blocksList = document.querySelector('.blocks-list');
    if (!blocksList) return;
    
    if (blocks.length === 0) {
        blocksList.innerHTML = `
            <div class="no-blocks-message">
                <div class="no-blocks-icon">
                    <i class="fas fa-calendar-check"></i>
                        </div>
                <h4>No hay bloqueos programados</h4>
                <p>Los bloqueos de horario aparecerán aquí cuando los configures.</p>
            </div>
        `;
        return;
    }
    
    // Generar elementos de bloqueos dinámicamente
    blocksList.innerHTML = blocks.map(block => `
        <div class="block-item">
            <div class="block-info">
                <span class="block-dates">${block.dateRange || ''}</span>
                <span class="block-time">${block.timeRange || ''}</span>
                <span class="block-reason">${block.reason || ''}</span>
                ${block.description ? `<span class="block-description">${block.description}</span>` : ''}
            </div>
            <div class="block-actions">
                <button class="btn btn-outline" onclick="editBlock('${block.id}')">
                                <i class="fas fa-edit"></i> Editar
                            </button>
                <button class="btn btn-danger" onclick="deleteBlock('${block.id}')">
                                <i class="fas fa-trash"></i> Eliminar
                            </button>
                        </div>
                    </div>
    `).join('');
}

function loadScheduleLimits() {
    const limitsDisplay = document.querySelector('.limits-display');
    if (!limitsDisplay) return;
    
    // Conectar con el backend para obtener los límites de sesiones
    if (typeof BackendAPI !== 'undefined') {
        BackendAPI.getScheduleLimits()
            .then(limits => {
                displayScheduleLimits(limits);
            })
            .catch(error => {
                console.error('Error cargando límites:', error);
                displayScheduleLimits({});
            });
    } else {
        // Fallback: mostrar valores por defecto
        displayScheduleLimits({});
    }
}

function displayScheduleLimits(limits) {
    const limitsDisplay = document.querySelector('.limits-display');
    if (!limitsDisplay) return;
    
    limitsDisplay.innerHTML = `
        <div class="limits-grid">
            <div class="limit-item">
                <div class="limit-icon">
                    <i class="fas fa-calendar-day"></i>
                </div>
                <div class="limit-info">
                    <h4>Máximo por Día</h4>
                    <span class="limit-value">${limits.maxDailySessions || 'No configurado'}</span>
            </div>
            </div>
            <div class="limit-item">
                <div class="limit-icon">
                    <i class="fas fa-calendar-week"></i>
                </div>
                <div class="limit-info">
                    <h4>Máximo por Semana</h4>
                    <span class="limit-value">${limits.maxWeeklySessions || 'No configurado'}</span>
                </div>
            </div>
            <div class="limit-item">
                <div class="limit-icon">
                    <i class="fas fa-clock"></i>
                </div>
                <div class="limit-info">
                    <h4>Duración Estándar</h4>
                    <span class="limit-value">${limits.sessionDuration || 'No configurado'} min</span>
                </div>
            </div>
            <div class="limit-item">
                <div class="limit-icon">
                    <i class="fas fa-pause"></i>
                </div>
                <div class="limit-info">
                    <h4>Tiempo de Descanso</h4>
                    <span class="limit-value">${limits.breakTime || 'No configurado'} min</span>
                </div>
            </div>
        </div>
        <div class="limits-actions">
            <button class="btn btn-outline" onclick="openScheduleModal()">
                <i class="fas fa-cog"></i> Configurar Límites
            </button>
        </div>
    `;
}

function loadSesionesSection() {
    const mainContent = document.getElementById('mainContent');
    mainContent.innerHTML = `
        <div class="content-header">
            <h2>Gestión de Sesiones</h2>
            <p>Administra las solicitudes y sesiones de tutoría</p>
        </div>
        
        <div class="sessions-tabs">
            <button class="tab-btn active" onclick="showSessionTab('pending')">Pendientes</button>
            <button class="tab-btn" onclick="showSessionTab('confirmed')">Confirmadas</button>
            <button class="tab-btn" onclick="showSessionTab('rejected')">No Aceptados</button>
            <button class="tab-btn" onclick="showSessionTab('completed')">Completadas</button>
        </div>
        
        <div class="sessions-content">
            <div class="session-tab-content active" id="pendingSessions">
                <!-- Las sesiones pendientes se cargarán dinámicamente desde el backend -->
            </div>
            <div class="session-tab-content" id="confirmedSessions">
                <!-- Las sesiones confirmadas se cargarán dinámicamente desde el backend -->
            </div>
            <div class="session-tab-content" id="rejectedSessions">
                <!-- Las sesiones no aceptadas se cargarán dinámicamente desde el backend -->
            </div>
            <div class="session-tab-content" id="completedSessions">
                <!-- Las sesiones completadas se cargarán dinámicamente desde el backend -->
            </div>
        </div>
    `;
    
    // Cargar datos dinámicos desde el backend
    loadSessionsData();
}

// FUNCIONES PARA CARGAR DATOS DINÁMICOS DE SESIONES
function loadSessionsData() {
    // Cargar sesiones pendientes
    loadPendingSessions();
    
    // Cargar sesiones confirmadas
    loadConfirmedSessions();
    
    // Cargar sesiones rechazadas/no aceptadas
    loadRejectedSessions();
    
    // Cargar sesiones completadas
    loadCompletedSessions();
}

function loadPendingSessions() {
    const pendingSessionsContainer = document.getElementById('pendingSessions');
    if (!pendingSessionsContainer) return;
    
    // Conectar con el backend para obtener las sesiones pendientes
    if (typeof BackendAPI !== 'undefined') {
        BackendAPI.getPendingSessions()
            .then(sessions => {
                displayPendingSessions(sessions);
            })
            .catch(error => {
                console.error('Error cargando sesiones pendientes:', error);
                displayPendingSessions([]);
            });
    } else {
        // Fallback: mostrar lista vacía
        displayPendingSessions([]);
    }
}

function displayPendingSessions(sessions) {
    const pendingSessionsContainer = document.getElementById('pendingSessions');
    if (!pendingSessionsContainer) return;
    
    if (sessions.length === 0) {
        pendingSessionsContainer.innerHTML = `
            <div class="no-sessions-message">
                <div class="no-sessions-icon">
                    <i class="fas fa-clock"></i>
                </div>
                <h4>No hay sesiones pendientes</h4>
                <p>Las nuevas solicitudes de estudiantes aparecerán aquí.</p>
            </div>
        `;
        return;
    }
    
    // Generar elementos de sesiones pendientes dinámicamente
    pendingSessionsContainer.innerHTML = sessions.map(session => `
                <div class="session-item">
                    <div class="session-info">
                <h4>${session.subject || ''}</h4>
                <p><strong>Estudiante:</strong> ${session.studentName || ''}</p>
                <p><strong>Fecha:</strong> ${session.date || ''}</p>
                <p><strong>Hora:</strong> ${session.time || ''}</p>
                <p><strong>Modalidad:</strong> ${session.modality || ''}</p>
                <p><strong>Objetivo:</strong> ${session.objective || ''}</p>
                    </div>
                    <div class="session-actions">
                <button class="btn btn-success" onclick="acceptRequest('${session.id}')">Aceptar</button>
                <button class="btn btn-warning" onclick="proposeNewTime('${session.id}')">Proponer Nuevo Horario</button>
                <button class="btn btn-danger" onclick="rejectRequest('${session.id}')">Rechazar</button>
                    </div>
                </div>
    `).join('');
}

function loadConfirmedSessions() {
    const confirmedSessionsContainer = document.getElementById('confirmedSessions');
    if (!confirmedSessionsContainer) return;
    
    // Conectar con el backend para obtener las sesiones confirmadas
    if (typeof BackendAPI !== 'undefined') {
        BackendAPI.getConfirmedSessions()
            .then(sessions => {
                displayConfirmedSessions(sessions);
            })
            .catch(error => {
                console.error('Error cargando sesiones confirmadas:', error);
                displayConfirmedSessions([]);
            });
    } else {
        // Fallback: mostrar lista vacía
        displayConfirmedSessions([]);
    }
}

function displayConfirmedSessions(sessions) {
    const confirmedSessionsContainer = document.getElementById('confirmedSessions');
    if (!confirmedSessionsContainer) return;
    
    if (sessions.length === 0) {
        confirmedSessionsContainer.innerHTML = `
            <div class="no-sessions-message">
                <div class="no-sessions-icon">
                    <i class="fas fa-calendar-check"></i>
            </div>
                <h4>No hay sesiones confirmadas</h4>
                <p>Las sesiones confirmadas aparecerán aquí.</p>
        </div>
    `;
        return;
    }
    
    // Generar elementos de sesiones confirmadas dinámicamente
    confirmedSessionsContainer.innerHTML = sessions.map(session => `
        <div class="session-item">
            <div class="session-info">
                <h4>${session.subject || ''}</h4>
                <p><strong>Estudiante:</strong> ${session.studentName || ''}</p>
                <p><strong>Fecha:</strong> ${session.date || ''}</p>
                <p><strong>Hora:</strong> ${session.time || ''}</p>
                <p><strong>Modalidad:</strong> ${session.modality || ''}</p>
                <p><strong>Estado:</strong> <span class="status-badge confirmed">Confirmada</span></p>
            </div>
            <div class="session-actions">
                <button class="btn btn-primary" onclick="markAttendance('${session.id}')">Marcar Asistencia</button>
                <button class="btn btn-outline" onclick="viewSessionDetails('${session.id}')">Ver Detalles</button>
                <button class="btn btn-warning" onclick="rescheduleSession('${session.id}')">Reprogramar</button>
            </div>
        </div>
    `).join('');
}

function loadRejectedSessions() {
    const rejectedSessionsContainer = document.getElementById('rejectedSessions');
    if (!rejectedSessionsContainer) return;
    
    // Conectar con el backend para obtener las sesiones rechazadas
    if (typeof BackendAPI !== 'undefined') {
        BackendAPI.getRejectedSessions()
            .then(sessions => {
                displayRejectedSessions(sessions);
            })
            .catch(error => {
                console.error('Error cargando sesiones rechazadas:', error);
                displayRejectedSessions([]);
            });
    } else {
        // Fallback: mostrar lista vacía
        displayRejectedSessions([]);
    }
}

function displayRejectedSessions(sessions) {
    const rejectedSessionsContainer = document.getElementById('rejectedSessions');
    if (!rejectedSessionsContainer) return;
    
    if (sessions.length === 0) {
        rejectedSessionsContainer.innerHTML = `
            <div class="no-sessions-message">
                <div class="no-sessions-icon">
                    <i class="fas fa-times-circle"></i>
                </div>
                <h4>No hay sesiones rechazadas</h4>
                <p>Las sesiones rechazadas aparecerán aquí.</p>
            </div>
        `;
        return;
    }
    
    // Generar elementos de sesiones rechazadas dinámicamente
    rejectedSessionsContainer.innerHTML = sessions.map(session => `
        <div class="session-item">
            <div class="session-info">
                <h4>${session.subject || ''}</h4>
                <p><strong>Estudiante:</strong> ${session.studentName || ''}</p>
                <p><strong>Fecha:</strong> ${session.date || ''}</p>
                <p><strong>Hora:</strong> ${session.time || ''}</p>
                <p><strong>Modalidad:</strong> ${session.modality || ''}</p>
                <p><strong>Estado:</strong> <span class="status-badge rejected">Rechazada</span></p>
                <p><strong>Motivo:</strong> ${session.rejectionReason || 'No especificado'}</p>
            </div>
            <div class="session-actions">
                <button class="btn btn-outline" onclick="viewSessionDetails('${session.id}')">Ver Detalles</button>
                <button class="btn btn-primary" onclick="reconsiderSession('${session.id}')">Reconsiderar</button>
            </div>
        </div>
    `).join('');
}

function loadCompletedSessions() {
    const completedSessionsContainer = document.getElementById('completedSessions');
    if (!completedSessionsContainer) return;
    
    // Conectar con el backend para obtener las sesiones completadas
    if (typeof BackendAPI !== 'undefined') {
        BackendAPI.getCompletedSessions()
            .then(sessions => {
                displayCompletedSessions(sessions);
            })
            .catch(error => {
                console.error('Error cargando sesiones completadas:', error);
                displayCompletedSessions([]);
            });
    } else {
        // Fallback: mostrar lista vacía
        displayCompletedSessions([]);
    }
}

function displayCompletedSessions(sessions) {
    const completedSessionsContainer = document.getElementById('completedSessions');
    if (!completedSessionsContainer) return;
    
    if (sessions.length === 0) {
        completedSessionsContainer.innerHTML = `
            <div class="no-sessions-message">
                <div class="no-sessions-icon">
                    <i class="fas fa-check-circle"></i>
                </div>
                <h4>No hay sesiones completadas</h4>
                <p>Las sesiones completadas aparecerán aquí.</p>
            </div>
        `;
        return;
    }
    
    // Generar elementos de sesiones completadas dinámicamente
    completedSessionsContainer.innerHTML = sessions.map(session => `
        <div class="session-item">
            <div class="session-info">
                <h4>${session.subject || ''}</h4>
                <p><strong>Estudiante:</strong> ${session.studentName || ''}</p>
                <p><strong>Fecha:</strong> ${session.date || ''}</p>
                <p><strong>Hora:</strong> ${session.time || ''}</p>
                <p><strong>Modalidad:</strong> ${session.modality || ''}</p>
                <p><strong>Estado:</strong> <span class="status-badge completed">Completada</span></p>
                <p><strong>Asistencia:</strong> ${session.attendance || ''}</p>
            </div>
            <div class="session-actions">
                <button class="btn btn-outline" onclick="viewSessionDetails('${session.id}')">Ver Detalles</button>
                <button class="btn btn-secondary" onclick="viewSessionNotes('${session.id}')">Ver Notas</button>
            </div>
        </div>
    `).join('');
}

// Función para cambiar entre pestañas de sesiones
function showSessionTab(tabType) {
    // Ocultar todas las pestañas
    document.querySelectorAll('.session-tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remover clase active de todos los botones
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Mostrar la pestaña seleccionada
    const targetTab = document.getElementById(tabType + 'Sessions');
    if (targetTab) {
        targetTab.classList.add('active');
    }
    
    // Activar el botón correspondiente
    const targetBtn = document.querySelector(`[onclick="showSessionTab('${tabType}')"]`);
    if (targetBtn) {
        targetBtn.classList.add('active');
    }
}

// FUNCIONES SIMPLIFICADAS PARA GESTIÓN DE HORARIOS
function openScheduleModal() {
    const modal = document.getElementById('scheduleModal');
    modal.style.display = 'flex';
    
    // Limpiar formulario
    document.getElementById('simpleScheduleForm').reset();
}

function closeScheduleModal() {
    const modal = document.getElementById('scheduleModal');
    modal.style.display = 'none';
}

function saveSimpleSchedule() {
    const form = document.getElementById('simpleScheduleForm');
    const formData = new FormData(form);
    
    // Validar formulario
    const day = document.getElementById('scheduleDay').value;
    const start = document.getElementById('scheduleStart').value;
    const end = document.getElementById('scheduleEnd').value;
    const modality = document.getElementById('scheduleModality').value;
    const duration = document.getElementById('scheduleDuration').value;
    
    if (!day || !start || !end || !modality) {
        alert('Por favor completa todos los campos requeridos');
        return;
    }
    
    // Validar que la hora de fin sea mayor que la de inicio
    if (start >= end) {
        alert('La hora de fin debe ser mayor que la hora de inicio');
        return;
    }
    
    // Crear objeto de disponibilidad
    const availability = {
        id: `avail_${Date.now()}`,
        day: day,
        startTime: start,
        endTime: end,
        modality: modality,
        duration: parseInt(duration),
        createdAt: new Date().toISOString()
    };
    
    // Guardar en el backend y sincronizar con estudiantes
    if (typeof BackendAPI !== 'undefined') {
        BackendAPI.createTutorAvailability(availability)
            .then(() => {
                // Notificar a los estudiantes sobre la nueva disponibilidad
                BackendAPI.notifyStudentsAboutAvailability(availability)
                    .then(() => {
                        console.log('Disponibilidad creada y notificada a estudiantes');
                        alert('Disponibilidad guardada exitosamente');
                        closeScheduleModal();
                        
                        // Recargar la sección de horarios
                        if (document.getElementById('mainContent').innerHTML.includes('Gestión de Horarios')) {
                            loadHorariosSection();
                        }
                    })
                    .catch(error => {
                        console.error('Error notificando a estudiantes:', error);
                        alert('Disponibilidad guardada, pero hubo un problema notificando a los estudiantes');
                    });
            })
            .catch(error => {
                console.error('Error guardando disponibilidad:', error);
                alert('Error al guardar la disponibilidad');
            });
    } else {
        // Fallback: usar localStorage para simular
        const tutorAvailability = JSON.parse(localStorage.getItem('tutorAvailability') || '[]');
        tutorAvailability.push(availability);
        localStorage.setItem('tutorAvailability', JSON.stringify(tutorAvailability));
        
        // Simular notificación a estudiantes
        const studentNotifications = JSON.parse(localStorage.getItem('studentNotifications') || '[]');
        studentNotifications.push({
            id: `notif_${Date.now()}`,
            type: 'new_availability',
            tutorId: 'current_tutor',
            message: `Nueva disponibilidad: ${getDayName(day)} de ${start} a ${end} (${modality})`,
            createdAt: new Date().toISOString()
        });
        localStorage.setItem('studentNotifications', JSON.stringify(studentNotifications));
        
        alert('Disponibilidad guardada exitosamente');
        closeScheduleModal();
        
        // Recargar la sección de horarios
        if (document.getElementById('mainContent').innerHTML.includes('Gestión de Horarios')) {
            loadHorariosSection();
        }
    }
}

function getDayName(dayValue) {
    const days = {
        'monday': 'Lunes',
        'tuesday': 'Martes', 
        'wednesday': 'Miércoles',
        'thursday': 'Jueves',
        'friday': 'Viernes',
        'saturday': 'Sábado',
        'sunday': 'Domingo'
    };
    return days[dayValue] || dayValue;
}

function editAvailability(availabilityId) {
    // Obtener datos de la disponibilidad
    if (typeof BackendAPI !== 'undefined') {
        BackendAPI.getAvailabilityById(availabilityId)
            .then(availability => {
                openScheduleModal();
                populateScheduleForm(availability);
            })
            .catch(error => {
                console.error('Error obteniendo disponibilidad:', error);
                alert('Error al cargar la disponibilidad');
            });
    } else {
        // Fallback: buscar en localStorage
        const tutorAvailability = JSON.parse(localStorage.getItem('tutorAvailability') || '[]');
        const availability = tutorAvailability.find(av => av.id === availabilityId);
        
        if (availability) {
            openScheduleModal();
            populateScheduleForm(availability);
        } else {
            alert('Disponibilidad no encontrada');
        }
    }
}

function populateScheduleForm(availability) {
    document.getElementById('scheduleDay').value = availability.day;
    document.getElementById('scheduleStart').value = availability.startTime;
    document.getElementById('scheduleEnd').value = availability.endTime;
    document.getElementById('scheduleModality').value = availability.modality;
    document.getElementById('scheduleDuration').value = availability.duration;
    
    // Cambiar el botón para indicar que es una edición
    const saveBtn = document.querySelector('[onclick="saveSimpleSchedule()"]');
    saveBtn.textContent = 'Actualizar Disponibilidad';
    saveBtn.setAttribute('data-edit-id', availability.id);
}

function deleteAvailability(availabilityId) {
    if (confirm('¿Estás seguro de que quieres eliminar esta disponibilidad?')) {
        if (typeof BackendAPI !== 'undefined') {
            BackendAPI.deleteTutorAvailability(availabilityId)
                .then(() => {
                    // Notificar a estudiantes sobre la eliminación
                    BackendAPI.notifyStudentsAboutAvailabilityDeletion(availabilityId)
                        .then(() => {
                            console.log('Disponibilidad eliminada y notificada a estudiantes');
                            alert('Disponibilidad eliminada exitosamente');
                            
                            // Recargar la sección de horarios
                            if (document.getElementById('mainContent').innerHTML.includes('Gestión de Horarios')) {
                                loadHorariosSection();
                            }
                        })
                        .catch(error => {
                            console.error('Error notificando eliminación:', error);
                            alert('Disponibilidad eliminada, pero hubo un problema notificando a los estudiantes');
                        });
                })
                .catch(error => {
                    console.error('Error eliminando disponibilidad:', error);
                    alert('Error al eliminar la disponibilidad');
                });
        } else {
            // Fallback: eliminar de localStorage
            const tutorAvailability = JSON.parse(localStorage.getItem('tutorAvailability') || '[]');
            const filteredAvailability = tutorAvailability.filter(av => av.id !== availabilityId);
            localStorage.setItem('tutorAvailability', JSON.stringify(filteredAvailability));
            
            alert('Disponibilidad eliminada exitosamente');
            
            // Recargar la sección de horarios
            if (document.getElementById('mainContent').innerHTML.includes('Gestión de Horarios')) {
                loadHorariosSection();
            }
        }
    }
}

function loadEstudiantesSection() {
    const mainContent = document.getElementById('mainContent');
    mainContent.innerHTML = `
        <div class="content-header">
            <h2>Mis Estudiantes</h2>
            <p>Gestiona la información y progreso de tus estudiantes</p>
        </div>
        
        <div class="students-grid">
            <!-- Los estudiantes se cargarán dinámicamente desde el backend -->
        </div>
    `;
    
    // Cargar datos dinámicos desde el backend
    loadStudentsData();
}

function loadValoracionesSection() {
    const mainContent = document.getElementById('mainContent');
    mainContent.innerHTML = `
        <div class="content-header">
            <h2>Valoraciones</h2>
            <p>Revisa las calificaciones y comentarios de tus estudiantes</p>
        </div>
        
        <div class="ratings-summary">
            <!-- El resumen de calificaciones se cargará dinámicamente desde el backend -->
        </div>
        
        <div class="recent-ratings">
            <h3>Valoraciones Recientes</h3>
            <div class="ratings-list">
                <!-- Las valoraciones recientes se cargarán dinámicamente desde el backend -->
            </div>
        </div>
    `;
    
    // Cargar datos dinámicos desde el backend
    loadRatingsData();
}

function loadHistorialSection() {
    const mainContent = document.getElementById('mainContent');
    mainContent.innerHTML = `
        <div class="content-header">
            <h2>Historial de Sesiones</h2>
            <p>Consulta el historial completo de tus sesiones de tutoría</p>
        </div>
        
        <div class="history-filters">
            <div class="filter-group">
                <label>Filtrar por fecha:</label>
                <input type="date" id="historyDateFilter">
            </div>
            <div class="filter-group">
                <label>Filtrar por estudiante:</label>
                <select id="historyStudentFilter">
                    <option value="">Todos los estudiantes</option>
                    <option value="1"></option>
                    <option value="2"></option>
                </select>
            </div>
            <button class="btn btn-primary" onclick="filterHistory()">Filtrar</button>
        </div>
        
        <div class="history-list">
            <div class="history-item">
                <div class="history-date"></div>
                <div class="history-info">
                    <h4></h4>
                    <p>Con: </p>
                    <p>Duración: </p>
                </div>
                <div class="history-actions">
                    <button class="btn btn-outline" onclick="viewHistoryDetails(1)">Ver Detalles</button>
                </div>
            </div>
        </div>
    `;
}

function loadNotificacionesSection() {
    const mainContent = document.getElementById('mainContent');
    mainContent.innerHTML = `
        <div class="content-header">
            <h2>Notificaciones</h2>
            <p>Gestiona tus notificaciones y recordatorios</p>
        </div>
        
        <div class="notifications-list">
            <!-- Las notificaciones se cargarán dinámicamente desde el backend -->
        </div>
    `;
    
    // Cargar datos dinámicos desde el backend
    loadNotificationsData();
}

// FUNCIONES PARA CARGAR DATOS DINÁMICOS DE ESTUDIANTES
function loadStudentsData() {
    const studentsGrid = document.querySelector('.students-grid');
    if (!studentsGrid) return;
    
    // Conectar con el backend para obtener los estudiantes del tutor
    if (typeof BackendAPI !== 'undefined') {
        BackendAPI.getTutorStudents()
            .then(students => {
                displayStudents(students);
            })
            .catch(error => {
                console.error('Error cargando estudiantes:', error);
                displayStudents([]);
            });
    } else {
        // Fallback: mostrar lista vacía
        displayStudents([]);
    }
}

function displayStudents(students) {
    const studentsGrid = document.querySelector('.students-grid');
    if (!studentsGrid) return;
    
    if (students.length === 0) {
        studentsGrid.innerHTML = `
            <div class="no-students-message">
                <div class="no-students-icon">
                    <i class="fas fa-user-graduate"></i>
                </div>
                <h4>No tienes estudiantes asignados</h4>
                <p>Los estudiantes aparecerán aquí cuando soliciten tus servicios de tutoría.</p>
            </div>
        `;
        return;
    }
    
    // Generar tarjetas de estudiantes dinámicamente
    studentsGrid.innerHTML = students.map(student => `
        <div class="student-card">
            <div class="student-avatar">
                <i class="fas fa-user"></i>
            </div>
            <div class="student-info">
                <h4>${student.name || ''}</h4>
                <p>${student.email || ''}</p>
                <div class="student-stats">
                    <span>Sesiones: ${student.totalSessions || 0}</span>
                    <span>Promedio: ${student.averageGrade || 'N/A'}</span>
                </div>
            </div>
            <div class="student-actions">
                <button class="btn btn-primary" onclick="viewStudentProfile('${student.id}')">Ver Perfil</button>
                <button class="btn btn-outline" onclick="messageStudent('${student.id}')">Mensaje</button>
            </div>
        </div>
    `).join('');
}

// FUNCIONES PARA CARGAR DATOS DINÁMICOS DE VALORACIONES
function loadRatingsData() {
    // Cargar resumen de calificaciones
    loadRatingsSummary();
    
    // Cargar valoraciones recientes
    loadRecentRatings();
}

function loadRatingsSummary() {
    const ratingsSummary = document.querySelector('.ratings-summary');
    if (!ratingsSummary) return;
    
    // Conectar con el backend para obtener el resumen de calificaciones
    if (typeof BackendAPI !== 'undefined') {
        BackendAPI.getTutorRatingsSummary()
            .then(summary => {
                displayRatingsSummary(summary);
            })
            .catch(error => {
                console.error('Error cargando resumen de calificaciones:', error);
                displayRatingsSummary({});
            });
    } else {
        // Fallback: mostrar valores por defecto
        displayRatingsSummary({});
    }
}

function displayRatingsSummary(summary) {
    const ratingsSummary = document.querySelector('.ratings-summary');
    if (!ratingsSummary) return;
    
    ratingsSummary.innerHTML = `
        <div class="rating-overview">
            <h3>Calificación Promedio</h3>
            <div class="rating-display">
                <span class="rating-number">${summary.averageRating || '0.0'}</span>
                <div class="stars">
                    ${generateStars(summary.averageRating || 0)}
                </div>
                <p class="rating-count">Basado en ${summary.totalRatings || 0} valoraciones</p>
            </div>
        </div>
    `;
}

function loadRecentRatings() {
    const ratingsList = document.querySelector('.ratings-list');
    if (!ratingsList) return;
    
    // Conectar con el backend para obtener las valoraciones recientes
    if (typeof BackendAPI !== 'undefined') {
        BackendAPI.getTutorRecentRatings()
            .then(ratings => {
                displayRecentRatings(ratings);
            })
            .catch(error => {
                console.error('Error cargando valoraciones recientes:', error);
                displayRecentRatings([]);
            });
    } else {
        // Fallback: mostrar lista vacía
        displayRecentRatings([]);
    }
}

function displayRecentRatings(ratings) {
    const ratingsList = document.querySelector('.ratings-list');
    if (!ratingsList) return;
    
    if (ratings.length === 0) {
        ratingsList.innerHTML = `
            <div class="no-ratings-message">
                <div class="no-ratings-icon">
                    <i class="fas fa-star"></i>
                </div>
                <h4>No hay valoraciones aún</h4>
                <p>Las valoraciones de tus estudiantes aparecerán aquí.</p>
            </div>
        `;
        return;
    }
    
    // Generar elementos de valoraciones dinámicamente
    ratingsList.innerHTML = ratings.map(rating => `
        <div class="rating-item">
            <div class="rating-header">
                <span class="student-name">${rating.studentName || ''}</span>
                <div class="rating-stars">
                    ${generateStars(rating.value || 0)}
                </div>
                <span class="rating-date">${rating.createdAt || ''}</span>
            </div>
            <p class="rating-comment">${rating.comment || 'Sin comentarios'}</p>
        </div>
    `).join('');
}

function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    let stars = '';
    
    // Estrellas llenas
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    
    // Media estrella
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    
    // Estrellas vacías
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    
    return stars;
}

// FUNCIONES PARA CARGAR DATOS DINÁMICOS DE NOTIFICACIONES
function loadNotificationsData() {
    const notificationsList = document.querySelector('.notifications-list');
    if (!notificationsList) return;
    
    // Conectar con el backend para obtener las notificaciones del tutor
    if (typeof BackendAPI !== 'undefined') {
        BackendAPI.getTutorNotifications()
            .then(notifications => {
                displayNotifications(notifications);
            })
            .catch(error => {
                console.error('Error cargando notificaciones:', error);
                displayNotifications([]);
            });
    } else {
        // Fallback: mostrar lista vacía
        displayNotifications([]);
    }
}

function displayNotifications(notifications) {
    const notificationsList = document.querySelector('.notifications-list');
    if (!notificationsList) return;
    
    if (notifications.length === 0) {
        notificationsList.innerHTML = `
            <div class="no-notifications-message">
                <div class="no-notifications-icon">
                    <i class="fas fa-bell-slash"></i>
                </div>
                <h4>No hay notificaciones</h4>
                <p>Las notificaciones aparecerán aquí cuando recibas nuevas solicitudes o actualizaciones.</p>
            </div>
        `;
        return;
    }
    
    // Generar elementos de notificaciones dinámicamente
    notificationsList.innerHTML = notifications.map(notification => `
        <div class="notification-item ${notification.read ? 'read' : 'unread'}">
                <div class="notification-icon">
                <i class="fas ${getNotificationIcon(notification.type)}"></i>
                </div>
                <div class="notification-content">
                <h4>${notification.title || ''}</h4>
                <p>${notification.message || ''}</p>
                <span class="notification-time">${notification.createdAt || ''}</span>
                </div>
                <div class="notification-actions">
                <button class="btn btn-primary" onclick="viewNotification('${notification.id}')">Ver</button>
                ${!notification.read ? `<button class="btn btn-secondary" onclick="markAsRead('${notification.id}')">Marcar como leída</button>` : ''}
                </div>
            </div>
    `).join('');
}

function getNotificationIcon(type) {
    const icons = {
        'session_request': 'fa-calendar-plus',
        'session_accepted': 'fa-check-circle',
        'session_rejected': 'fa-times-circle',
        'session_completed': 'fa-calendar-check',
        'rating_received': 'fa-star',
        'message_received': 'fa-envelope',
        'general': 'fa-bell'
    };
    return icons[type] || 'fa-bell';
}

// ===============================================
// GESTIÓN DE HORARIOS (RF-05, RF-06, RF-07)
// ===============================================

function openScheduleModal() {
    document.getElementById('scheduleModal').style.display = 'flex';
}

function closeScheduleModal() {
    document.getElementById('scheduleModal').style.display = 'none';
}

function showScheduleTab(tabName) {
    // Ocultar todas las pestañas
    document.querySelectorAll('.schedule-tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Ocultar todos los botones
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Mostrar la pestaña seleccionada
    document.getElementById(tabName + 'Tab').classList.add('active');
    
    // Activar el botón correspondiente
    event.target.classList.add('active');
}

function saveScheduleSettings() {
    const activeTab = document.querySelector('.schedule-tab-content.active');
    const tabId = activeTab.id;
    
    switch(tabId) {
        case 'recurringTab':
            saveRecurringAvailability();
            break;
        case 'blocksTab':
            saveBlockedPeriod();
            break;
        case 'limitsTab':
            saveSessionLimits();
            break;
    }
    
    showNotification('Configuración guardada exitosamente', 'success');
    closeScheduleModal();
}

function saveRecurringAvailability() {
    const form = document.getElementById('recurringForm');
    const formData = new FormData(form);
    
    const availability = {
        day: formData.get('recurringDay'),
        modality: formData.get('recurringModality'),
        startTime: formData.get('recurringStart'),
        endTime: formData.get('recurringEnd'),
        location: formData.get('recurringLocation'),
        link: formData.get('recurringLink')
    };
    
    console.log('Guardando disponibilidad recurrente:', availability);
    
    // Validar disponibilidad (RF-06: Prevención de choques)
    if (validateAvailabilityConflict(availability)) {
        showNotification('Conflicto de horario detectado. Verifica tu disponibilidad.', 'warning');
        return;
    }
    
    // Guardar en localStorage (en producción sería en el backend)
    const availabilities = JSON.parse(localStorage.getItem('tutorAvailabilities') || '[]');
    availabilities.push(availability);
    localStorage.setItem('tutorAvailabilities', JSON.stringify(availabilities));
}

function saveBlockedPeriod() {
    const form = document.getElementById('blocksForm');
    const formData = new FormData(form);
    
    const block = {
        startDate: formData.get('blockStartDate'),
        endDate: formData.get('blockEndDate'),
        startTime: formData.get('blockStartTime'),
        endTime: formData.get('blockEndTime'),
        reason: formData.get('blockReason'),
        description: formData.get('blockDescription')
    };
    
    console.log('Guardando bloqueo:', block);
    
    // Guardar en localStorage
    const blocks = JSON.parse(localStorage.getItem('tutorBlocks') || '[]');
    blocks.push(block);
    localStorage.setItem('tutorBlocks', JSON.stringify(blocks));
}

function saveSessionLimits() {
    const limits = {
        maxDailySessions: document.getElementById('maxDailySessions').value,
        maxWeeklySessions: document.getElementById('maxWeeklySessions').value,
        sessionDuration: document.getElementById('sessionDuration').value,
        breakTime: document.getElementById('breakTime').value,
        timezone: document.getElementById('timezone').value
    };
    
    console.log('Guardando límites de sesiones:', limits);
    
    // Guardar en localStorage
    localStorage.setItem('tutorLimits', JSON.stringify(limits));
    
    // Actualizar datos del tutor
    const tutorData = JSON.parse(localStorage.getItem('tutorData') || '{}');
    Object.assign(tutorData, limits);
    localStorage.setItem('tutorData', JSON.stringify(tutorData));
}

function validateAvailabilityConflict(newAvailability) {
    // RF-06: Prevención de choques
    const existingAvailabilities = JSON.parse(localStorage.getItem('tutorAvailabilities') || '[]');
    
    return existingAvailabilities.some(existing => {
        return existing.day === newAvailability.day &&
               existing.startTime < newAvailability.endTime &&
               existing.endTime > newAvailability.startTime;
    });
}

// ===============================================
// GESTIÓN DE SOLICITUDES (RF-11, RF-12, RF-13)
// ===============================================

function acceptRequest(requestId) {
    const confirmAccept = confirm('¿Estás seguro de que quieres aceptar esta solicitud?');
    if (confirmAccept) {
        console.log('Aceptando solicitud:', requestId);
        
        // Actualizar estado de la solicitud
        updateRequestStatus(requestId, 'accepted');
        
        // Actualizar estado en el calendario del estudiante usando BackendAPI
        if (typeof BackendAPI !== 'undefined') {
            BackendAPI.syncSessionStatus(requestId, 'accepted', 'tutor', 'tutor')
                .then(() => {
                    console.log('Estado sincronizado con el estudiante');
                })
                .catch(error => {
                    console.error('Error sincronizando estado:', error);
                });
        } else {
            // Fallback: usar función local
            updateStudentCalendarStatus(requestId, 'accepted');
        }
        
        // Enviar notificación al estudiante (RF-15)
        sendNotificationToStudent(requestId, 'accepted');
        
        // Actualizar contador de solicitudes pendientes
        updatePendingRequestsCounter(-1);
        
        showNotification('Solicitud aceptada exitosamente', 'success');
        
        // Remover la solicitud de la lista
        removeRequestFromList(requestId);
    }
}

function rejectRequest(requestId) {
    const reason = prompt('Motivo del rechazo (opcional):');
    const confirmReject = confirm('¿Estás seguro de que quieres rechazar esta solicitud?');
    if (confirmReject) {
        console.log('Rechazando solicitud:', requestId, 'Motivo:', reason);
        
        // Actualizar estado de la solicitud
        updateRequestStatus(requestId, 'rejected', reason);
        
        // Actualizar estado en el calendario del estudiante usando BackendAPI
        if (typeof BackendAPI !== 'undefined') {
            BackendAPI.syncSessionStatus(requestId, 'rejected', 'tutor', 'tutor')
                .then(() => {
                    console.log('Estado sincronizado con el estudiante');
                })
                .catch(error => {
                    console.error('Error sincronizando estado:', error);
                });
        } else {
            // Fallback: usar función local
            updateStudentCalendarStatus(requestId, 'rejected');
        }
        
        // Enviar notificación al estudiante (RF-15)
        sendNotificationToStudent(requestId, 'rejected', reason);
        
        // Actualizar contador de solicitudes pendientes
        updatePendingRequestsCounter(-1);
        
        showNotification('Solicitud rechazada', 'info');
        
        // Remover la solicitud de la lista
        removeRequestFromList(requestId);
    }
}

function proposeNewTime(requestId) {
    const newDate = prompt('Proponer nueva fecha (formato: YYYY-MM-DD):');
    const newTime = prompt('Proponer nueva hora (formato: HH:MM):');
    const message = prompt('Mensaje adicional para el estudiante:');
    
    if (newDate && newTime) {
        console.log('Proponiendo nuevo horario para solicitud:', requestId);
        
        // Validar nueva fecha/hora (RF-12: Reglas de reprogramación)
        if (validateRescheduleRules(newDate, newTime)) {
            // Actualizar estado de la solicitud
            updateRequestStatus(requestId, 'reschedule_proposed', {
                newDate: newDate,
                newTime: newTime,
                message: message
            });
            
            // Actualizar estado en el calendario del estudiante usando BackendAPI
            if (typeof BackendAPI !== 'undefined') {
                BackendAPI.syncSessionStatus(requestId, 'postponed', 'tutor', 'tutor')
                    .then(() => {
                        console.log('Estado sincronizado con el estudiante');
                    })
                    .catch(error => {
                        console.error('Error sincronizando estado:', error);
                    });
            } else {
                // Fallback: usar función local
                updateStudentCalendarStatus(requestId, 'postponed');
            }
            
            // Enviar notificación al estudiante (RF-15)
            sendNotificationToStudent(requestId, 'reschedule_proposed', {
                newDate: newDate,
                newTime: newTime,
                message: message
            });
            
            showNotification('Nueva hora propuesta enviada al estudiante', 'success');
        } else {
            showNotification('La nueva fecha/hora no cumple con las reglas de reprogramación', 'error');
        }
    }
}

function validateRescheduleRules(newDate, newTime) {
    // RF-12: Reglas de reprogramación
    const today = new Date();
    const proposedDate = new Date(newDate);
    const minAdvanceHours = 12; // Mínimo 12 horas de anticipación
    
    // Verificar que la fecha sea futura
    if (proposedDate <= today) {
        return false;
    }
    
    // Verificar ventana mínima de anticipación
    const timeDiff = proposedDate.getTime() - today.getTime();
    const hoursDiff = timeDiff / (1000 * 60 * 60);
    
    if (hoursDiff < minAdvanceHours) {
        return false;
    }
    
    // Verificar límites de sesiones (RF-07)
    return validateSessionLimits(newDate);
}

function validateSessionLimits(date) {
    const tutorLimits = JSON.parse(localStorage.getItem('tutorLimits') || '{}');
    const maxDailySessions = tutorLimits.maxDailySessions || 8;
    
    // Contar sesiones existentes para esa fecha
    const existingSessions = JSON.parse(localStorage.getItem('tutorSessions') || '[]');
    const sessionsOnDate = existingSessions.filter(session => session.date === date);
    
    return sessionsOnDate.length < maxDailySessions;
}

// ===============================================
// REGISTRO DE ASISTENCIA (RF-19)
// ===============================================

function markAttendance(sessionId) {
    // Obtener datos de la sesión
    const sessionData = getSessionData(sessionId);
    
    // Actualizar modal con datos de la sesión
    document.getElementById('attendanceSessionTitle').textContent = sessionData.title;
    document.getElementById('attendanceStudentName').textContent = `Con: ${sessionData.studentName}`;
    document.getElementById('attendanceSessionTime').textContent = `${sessionData.date} - ${sessionData.time}`;
    
    // Mostrar modal
    document.getElementById('attendanceModal').style.display = 'flex';
}

function closeAttendanceModal() {
    document.getElementById('attendanceModal').style.display = 'none';
}

function saveAttendance() {
    const attendanceStatus = document.querySelector('input[name="attendance"]:checked').value;
    const notes = document.getElementById('attendanceNotes').value;
    const nextSession = document.getElementById('nextSession').value;
    
    console.log('Guardando asistencia:', {
        status: attendanceStatus,
        notes: notes,
        nextSession: nextSession
    });
    
    // Guardar asistencia en localStorage
    const attendanceData = {
        sessionId: Date.now(), // En producción sería el ID real
        status: attendanceStatus,
        notes: notes,
        nextSession: nextSession,
        timestamp: new Date().toISOString()
    };
    
    const attendances = JSON.parse(localStorage.getItem('tutorAttendances') || '[]');
    attendances.push(attendanceData);
    localStorage.setItem('tutorAttendances', JSON.stringify(attendances));
    
    // Enviar notificación al estudiante sobre la sesión completada (RF-15)
    sendSessionCompletedNotification(attendanceData);
    
    showNotification('Asistencia registrada exitosamente', 'success');
    closeAttendanceModal();
}

// ===============================================
// NOTIFICACIONES (RF-15, RF-16, RF-17, RF-18)
// ===============================================

function setupNotifications() {
    // RF-16: Recordatorios automáticos
    setupAutomaticReminders();
    
    // RF-17: Resumen semanal
    setupWeeklySummary();
}

function setupAutomaticReminders() {
    // Simular recordatorios automáticos
    setInterval(() => {
        checkUpcomingSessions();
    }, 60000); // Verificar cada minuto
}

function checkUpcomingSessions() {
    const now = new Date();
    const sessions = JSON.parse(localStorage.getItem('tutorSessions') || '[]');
    
    sessions.forEach(session => {
        const sessionDate = new Date(session.date + ' ' + session.time);
        const timeDiff = sessionDate.getTime() - now.getTime();
        const hoursDiff = timeDiff / (1000 * 60 * 60);
        
        // Recordatorio 24 horas antes
        if (hoursDiff > 23 && hoursDiff < 24.5) {
            showNotification(`Recordatorio: Sesión con ${session.studentName} mañana a las ${session.time}`, 'info');
        }
        
        // Recordatorio 1 hora antes
        if (hoursDiff > 0.5 && hoursDiff < 1.5) {
            showNotification(`Recordatorio: Sesión con ${session.studentName} en 1 hora`, 'warning');
        }
    });
}

function setupWeeklySummary() {
    // RF-17: Resumen semanal (ejecutar cada lunes)
    const today = new Date();
    const lastMonday = new Date(today);
    lastMonday.setDate(today.getDate() - today.getDay() + 1);
    
    const lastSummary = localStorage.getItem('lastWeeklySummary');
    if (!lastSummary || new Date(lastSummary) < lastMonday) {
        generateWeeklySummary();
        localStorage.setItem('lastWeeklySummary', new Date().toISOString());
    }
}

function generateWeeklySummary() {
    const sessions = JSON.parse(localStorage.getItem('tutorSessions') || '[]');
    const weekSessions = sessions.filter(session => {
        const sessionDate = new Date(session.date);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return sessionDate >= weekAgo;
    });
    
    const summary = {
        totalSessions: weekSessions.length,
        completedSessions: weekSessions.filter(s => s.status === 'completed').length,
        averageRating: calculateAverageRating(),
        newStudents: getNewStudentsCount()
    };
    
    showNotification(`Resumen semanal: ${summary.totalSessions} sesiones, ${summary.completedSessions} completadas`, 'info');
}

function sendNotificationToStudent(requestId, type, data = null) {
    // RF-15: Notificaciones transaccionales
    const notification = {
        id: Date.now(),
        requestId: requestId,
        type: type,
        data: data,
        timestamp: new Date().toISOString(),
        read: false
    };
    
    // En producción, esto se enviaría al backend
    console.log('Enviando notificación al estudiante:', notification);
    
    // Simular notificación en la interfaz del estudiante
    simulateStudentNotification(notification);
}

function simulateStudentNotification(notification) {
    // Simular que el estudiante recibe la notificación
    const studentNotifications = JSON.parse(localStorage.getItem('studentNotifications') || '[]');
    studentNotifications.push(notification);
    localStorage.setItem('studentNotifications', JSON.stringify(studentNotifications));
}

function sendSessionCompletedNotification(attendanceData) {
    const notification = {
        id: Date.now(),
        type: 'session_completed',
        data: attendanceData,
        timestamp: new Date().toISOString(),
        read: false
    };
    
    console.log('Enviando notificación de sesión completada:', notification);
    simulateStudentNotification(notification);
}

// ===============================================
// FUNCIONES AUXILIARES
// ===============================================

function updateRequestStatus(requestId, status, data = null) {
    const requests = JSON.parse(localStorage.getItem('tutorRequests') || '[]');
    const requestIndex = requests.findIndex(req => req.id === requestId);
    
    if (requestIndex !== -1) {
        requests[requestIndex].status = status;
        requests[requestIndex].updatedAt = new Date().toISOString();
        if (data) {
            requests[requestIndex].data = data;
        }
        localStorage.setItem('tutorRequests', JSON.stringify(requests));
    }
}

function updatePendingRequestsCounter(change) {
    const currentCount = parseInt(document.getElementById('pendingRequests').textContent);
    document.getElementById('pendingRequests').textContent = Math.max(0, currentCount + change);
}

function removeRequestFromList(requestId) {
    const requestItem = document.querySelector(`[onclick*="${requestId}"]`).closest('.request-item');
    if (requestItem) {
        requestItem.remove();
    }
}

function getSessionData(sessionId) {
    // Simular datos de sesión
    return {
        id: sessionId,
        title: '',
        studentName: '',
        date: '',
        time: ''
    };
}

function calculateAverageRating() {
    const ratings = JSON.parse(localStorage.getItem('tutorRatings') || '[]');
    if (ratings.length === 0) return 0;
    
    const sum = ratings.reduce((acc, rating) => acc + rating.value, 0);
    return (sum / ratings.length).toFixed(1);
}

// FUNCIÓN PARA ACTUALIZAR MENSAJE DE BIENVENIDA DEL TUTOR
function updateTutorWelcomeMessage(profile) {
    const welcomeElement = document.getElementById('tutorWelcomeName');
    if (welcomeElement && profile.firstName) {
        welcomeElement.textContent = profile.firstName;
    }
}

// FUNCIÓN PARA ACTUALIZAR AVATAR DEL TUTOR
function updateTutorAvatar(profile) {
    const tutorNameElement = document.getElementById('tutorName');
    const tutorInitialsElement = document.getElementById('tutorInitials');
    const profileInitialsElement = document.getElementById('profileInitials');
    
    if (profile.firstName && profile.lastName) {
        const fullName = `${profile.firstName} ${profile.lastName}`;
        const initials = `${profile.firstName.charAt(0)}${profile.lastName.charAt(0)}`.toUpperCase();
        
        if (tutorNameElement) {
            tutorNameElement.textContent = fullName;
        }
        if (tutorInitialsElement) {
            tutorInitialsElement.textContent = initials;
        }
        if (profileInitialsElement) {
            profileInitialsElement.textContent = initials;
        }
    }
}

function getNewStudentsCount() {
    const students = JSON.parse(localStorage.getItem('tutorStudents') || '[]');
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    return students.filter(student => new Date(student.joinedAt) >= weekAgo).length;
}

function showNotification(message, type = 'info') {
    // RF-18: Notificación simulada en la interfaz
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remover después de 5 segundos
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

function getNotificationIcon(type) {
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    return icons[type] || 'info-circle';
}

// ===============================================
// EVENT LISTENERS
// ===============================================

function setupEventListeners() {
    // Menú de usuario
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.user-info')) {
            document.getElementById('userMenu').style.display = 'none';
        }
    });
    
    // Cerrar modales al hacer clic fuera
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('schedule-modal') || 
            e.target.classList.contains('attendance-modal') || 
            e.target.classList.contains('profile-modal')) {
            e.target.style.display = 'none';
        }
    });
}

// Funciones para el menú móvil
function toggleMobileMenu() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    
    sidebar.classList.toggle('mobile-open');
    overlay.classList.toggle('active');
}

function closeMobileMenu() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    
    sidebar.classList.remove('mobile-open');
    overlay.classList.remove('active');
}

// ===============================================
// FUNCIONES DEL MENÚ DE USUARIO
// ===============================================

function showUserMenu() {
    const menu = document.getElementById('userMenu');
    menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
}

function showProfile() {
    document.getElementById('profileModal').style.display = 'flex';
    document.getElementById('userMenu').style.display = 'none';
}

function closeProfileModal() {
    document.getElementById('profileModal').style.display = 'none';
}

function saveProfile() {
    const form = document.getElementById('profileForm');
    const formData = new FormData(form);
    
    const profileData = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        specialty: formData.get('specialty'),
        experience: formData.get('experience')
    };
    
    console.log('Guardando perfil:', profileData);
    
    // Actualizar datos del tutor
    const tutorData = JSON.parse(localStorage.getItem('tutorData') || '{}');
    Object.assign(tutorData, profileData);
    localStorage.setItem('tutorData', JSON.stringify(tutorData));
    
    // Actualizar interfaz
    document.getElementById('tutorName').textContent = `${profileData.firstName} ${profileData.lastName}`;
    document.getElementById('tutorWelcomeName').textContent = `${profileData.firstName} ${profileData.lastName}`;
    
    showNotification('Perfil actualizado exitosamente', 'success');
    closeProfileModal();
}

function resetProfileForm() {
    document.getElementById('profileForm').reset();
}

function showSettings() {
    showNotification('Configuración disponible próximamente', 'info');
}

function logout() {
    if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
        localStorage.removeItem('tutorData');
        showNotification('Sesión cerrada exitosamente', 'info');
        // En producción, redirigir al login
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1000);
    }
}

// ===============================================
// FUNCIONES ADICIONALES
// ===============================================

function viewCurrentSchedule() {
    showNotification('Vista de horario disponible próximamente', 'info');
}

function editAvailability(id) {
    showNotification(`Editando disponibilidad ${id}`, 'info');
}

function deleteAvailability(id) {
    if (confirm('¿Estás seguro de que quieres eliminar esta disponibilidad?')) {
        showNotification(`Disponibilidad ${id} eliminada`, 'success');
    }
}

function viewStudentProfile(id) {
    showNotification(`Viendo perfil del estudiante ${id}`, 'info');
}

function messageStudent(id) {
    showNotification(`Enviando mensaje al estudiante ${id}`, 'info');
}

function viewNotification(id) {
    showNotification(`Viendo notificación ${id}`, 'info');
}

function markAsRead(id) {
    showNotification(`Notificación ${id} marcada como leída`, 'success');
}

function filterHistory() {
    showNotification('Filtrando historial...', 'info');
}

function viewHistoryDetails(id) {
    showNotification(`Viendo detalles del historial ${id}`, 'info');
}

function showAllActivity() {
    showNotification('Mostrando toda la actividad', 'info');
}

function showSessionTab(tab) {
    showNotification(`Mostrando pestaña: ${tab}`, 'info');
}

// Función para actualizar el estado en el calendario del estudiante
function updateStudentCalendarStatus(requestId, status) {
    // Esta función se comunicará con el backend para actualizar el estado
    // y el calendario del estudiante se actualizará automáticamente
    
    console.log(`Actualizando estado de sesión ${requestId} a: ${status}`);
    
    // Simular llamada al backend
    if (typeof BackendAPI !== 'undefined') {
        BackendAPI.updateSessionStatus(requestId, status)
            .then(() => {
                console.log('Estado actualizado en el backend');
                // El calendario del estudiante se actualizará automáticamente
                // cuando se recargue la página o se haga una nueva consulta
            })
            .catch(error => {
                console.error('Error actualizando estado:', error);
            });
    }
    
    // También podemos usar localStorage para simular la sincronización
    const sessionData = {
        id: requestId,
        status: status,
        updatedAt: new Date().toISOString()
    };
    
    // Guardar en localStorage para que el estudiante pueda ver el cambio
    const studentSessions = JSON.parse(localStorage.getItem('studentSessions') || '[]');
    const sessionIndex = studentSessions.findIndex(session => session.id === requestId);
    
    if (sessionIndex !== -1) {
        studentSessions[sessionIndex].status = status;
        studentSessions[sessionIndex].updatedAt = new Date().toISOString();
        localStorage.setItem('studentSessions', JSON.stringify(studentSessions));
    }
}

// Exportar funciones para uso global
window.TutorInterface = {
    loadSection,
    acceptRequest,
    rejectRequest,
    proposeNewTime,
    markAttendance,
    closeAttendanceModal,
    saveAttendance,
    openScheduleModal,
    closeScheduleModal,
    showScheduleTab,
    saveScheduleSettings,
    showUserMenu,
    showProfile,
    closeProfileModal,
    saveProfile,
    resetProfileForm,
    showSettings,
    logout,
    updateStudentCalendarStatus
};

