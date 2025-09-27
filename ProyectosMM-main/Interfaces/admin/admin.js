// Funcionalidad para la interfaz del administrador
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar la aplicación
    initializeApp();
    
    // Configurar event listeners
    setupEventListeners();
    
    // Cargar datos del dashboard
    loadDashboardData();
    
    // Configurar notificaciones
    setupNotifications();
});

function initializeApp() {
    console.log('Sistema de Gestión de Tutores - Panel de Administración iniciado');
    
    // Configurar animaciones de entrada
    animateCards();
    
    // Configurar tooltips
    setupTooltips();
    
    // Inicializar tablas
    initializeTables();
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
    
    // Botones de acción rápida
    const actionBtns = document.querySelectorAll('.action-btn');
    actionBtns.forEach(button => {
        button.addEventListener('click', function() {
            const action = this.querySelector('span').textContent;
            handleQuickAction(action);
        });
    });
    
    // Botones de la tabla
    const tableButtons = document.querySelectorAll('.btn-icon');
    tableButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const action = this.title;
            const row = this.closest('tr');
            handleTableAction(action, row);
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

function animateCards() {
    const cards = document.querySelectorAll('.stat-card, .activity-item, .action-btn');
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
    const icons = document.querySelectorAll('.stat-icon, .activity-icon, .btn-icon');
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

function initializeTables() {
    // Configurar ordenamiento de tablas
    const tableHeaders = document.querySelectorAll('.data-table th');
    tableHeaders.forEach(header => {
        header.style.cursor = 'pointer';
        header.addEventListener('click', function() {
            sortTable(this);
        });
    });
}

function sortTable(header) {
    const table = header.closest('table');
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));
    const columnIndex = Array.from(header.parentNode.children).indexOf(header);
    
    // Alternar entre ascendente y descendente
    const isAscending = header.classList.contains('sort-asc');
    
    // Remover clases de ordenamiento de todos los headers
    table.querySelectorAll('th').forEach(th => {
        th.classList.remove('sort-asc', 'sort-desc');
    });
    
    // Agregar clase al header actual
    header.classList.add(isAscending ? 'sort-desc' : 'sort-asc');
    
    // Ordenar filas
    rows.sort((a, b) => {
        const aValue = a.children[columnIndex].textContent.trim();
        const bValue = b.children[columnIndex].textContent.trim();
        
        if (isAscending) {
            return bValue.localeCompare(aValue);
        } else {
            return aValue.localeCompare(bValue);
        }
    });
    
    // Reorganizar filas en la tabla
    rows.forEach(row => tbody.appendChild(row));
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
    const statsGrid = document.querySelector('.stats-grid');
    const dashboardContent = document.querySelector('.dashboard-content');
    const tablesSection = document.querySelector('.tables-section');
    
    // Ocultar todas las secciones
    [statsGrid, dashboardContent, tablesSection].forEach(section => {
        if (section) section.style.display = 'none';
    });
    
    // Mostrar contenido según la sección
    switch(section) {
        case 'Dashboard':
            contentHeader.innerHTML = '<h2>Dashboard Administrativo</h2><p>Gestiona todo el sistema de tutores y estudiantes</p>';
            [statsGrid, dashboardContent, tablesSection].forEach(section => {
                if (section) section.style.display = 'block';
            });
            break;
        case 'Usuarios':
            contentHeader.innerHTML = '<h2>Gestión de Usuarios</h2><p>Administra todos los usuarios del sistema</p>';
            showUsersContent();
            break;
        case 'Tutores':
            contentHeader.innerHTML = '<h2>Gestión de Tutores</h2><p>Administra los tutores del sistema</p>';
            showTutorsContent();
            break;
        case 'Estudiantes':
            contentHeader.innerHTML = '<h2>Gestión de Estudiantes</h2><p>Administra los estudiantes del sistema</p>';
            showStudentsContent();
            break;
        case 'Cursos':
            contentHeader.innerHTML = '<h2>Gestión de Cursos</h2><p>Administra los cursos disponibles</p>';
            showCoursesContent();
            break;
        case 'Horarios':
            contentHeader.innerHTML = '<h2>Gestión de Horarios</h2><p>Administra los horarios de sesiones</p>';
            showSchedulesContent();
            break;
        case 'Reportes':
            contentHeader.innerHTML = '<h2>Reportes y Estadísticas</h2><p>Genera reportes del sistema</p>';
            showReportsContent();
            break;
        case 'Configuración':
            contentHeader.innerHTML = '<h2>Configuración del Sistema</h2><p>Configura parámetros del sistema</p>';
            showSettingsContent();
            break;
    }
}

function showUsersContent() {
    // Implementar contenido de usuarios
    console.log('Mostrando contenido de usuarios');
}

function showTutorsContent() {
    // Implementar contenido de tutores
    console.log('Mostrando contenido de tutores');
}

function showStudentsContent() {
    // Implementar contenido de estudiantes
    console.log('Mostrando contenido de estudiantes');
}

function showCoursesContent() {
    // Implementar contenido de cursos
    console.log('Mostrando contenido de cursos');
}

function showSchedulesContent() {
    // Implementar contenido de horarios
    console.log('Mostrando contenido de horarios');
}

function showReportsContent() {
    // Implementar contenido de reportes
    console.log('Mostrando contenido de reportes');
}

function showSettingsContent() {
    // Implementar contenido de configuración
    console.log('Mostrando contenido de configuración');
}

function handleQuickAction(action) {
    console.log(`Acción rápida: ${action}`);
    
    switch(action) {
        case 'Agregar Usuario':
            showAddUserModal();
            break;
        case 'Crear Curso':
            showCreateCourseModal();
            break;
        case 'Programar Sesión':
            showScheduleSessionModal();
            break;
        case 'Generar Reporte':
            showGenerateReportModal();
            break;
    }
}

function handleTableAction(action, row) {
    const userName = row.children[0].textContent;
    
    switch(action) {
        case 'Editar':
            showEditUserModal(userName);
            break;
        case 'Eliminar':
            showDeleteUserModal(userName);
            break;
    }
}

function showAddUserModal() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Agregar Nuevo Usuario</h3>
                <span class="close">&times;</span>
            </div>
            <div class="modal-body">
                <form id="addUserForm">
                    <div class="form-group">
                        <label for="userName">Nombre Completo</label>
                        <input type="text" id="userName" name="userName" required>
                    </div>
                    <div class="form-group">
                        <label for="userEmail">Email</label>
                        <input type="email" id="userEmail" name="userEmail" required>
                    </div>
                    <div class="form-group">
                        <label for="userType">Tipo de Usuario</label>
                        <select id="userType" name="userType" required>
                            <option value="">Seleccionar...</option>
                            <option value="student">Estudiante</option>
                            <option value="tutor">Tutor</option>
                            <option value="admin">Administrador</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="userPassword">Contraseña</label>
                        <input type="password" id="userPassword" name="userPassword" required>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary" onclick="submitAddUser()">Agregar Usuario</button>
                <button class="btn btn-secondary close-modal">Cancelar</button>
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
        
        .form-group {
            margin-bottom: 1.5rem;
        }
        
        .form-group label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 600;
            color: #333;
        }
        
        .form-group input,
        .form-group select {
            width: 100%;
            padding: 0.8rem;
            border: 2px solid #e9ecef;
            border-radius: 8px;
            font-size: 1rem;
            transition: border-color 0.3s ease;
        }
        
        .form-group input:focus,
        .form-group select:focus {
            outline: none;
            border-color: #d19800;
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

function submitAddUser() {
    const form = document.getElementById('addUserForm');
    const formData = new FormData(form);
    
    // Simular envío de datos
    console.log('Agregando usuario:', Object.fromEntries(formData));
    
    // Mostrar mensaje de éxito
    showNotification('Usuario agregado exitosamente', 'success');
    
    // Cerrar modal
    const modal = document.querySelector('.modal');
    if (modal) {
        modal.remove();
    }
}

function showEditUserModal(userName) {
    console.log(`Editando usuario: ${userName}`);
    // Implementar modal de edición
}

function showDeleteUserModal(userName) {
    if (confirm(`¿Estás seguro de que quieres eliminar al usuario ${userName}?`)) {
        console.log(`Eliminando usuario: ${userName}`);
        showNotification('Usuario eliminado exitosamente', 'success');
    }
}

function showCreateCourseModal() {
    console.log('Mostrando modal de crear curso');
    // Implementar modal de crear curso
}

function showScheduleSessionModal() {
    console.log('Mostrando modal de programar sesión');
    // Implementar modal de programar sesión
}

function showGenerateReportModal() {
    console.log('Mostrando modal de generar reporte');
    // Implementar modal de generar reporte
}

function showUserMenu() {
    const menu = document.createElement('div');
    menu.className = 'user-menu';
    menu.innerHTML = `
        <div class="menu-item">
            <i class="fas fa-user-shield"></i>
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
            'Nuevo usuario registrado',
            'Sesión completada',
            'Problema reportado',
            'Curso creado',
            'Reporte generado'
        ];
        
        const randomNotification = notifications[Math.floor(Math.random() * notifications.length)];
        showNotification(randomNotification, 'info');
    }, 30000); // Cada 30 segundos
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
                            <i class="fas fa-user-plus"></i>
                        </div>
                        <div class="notification-content">
                            <h4>Nuevo Usuario Registrado</h4>
                            <p>María González se registró como tutora</p>
                            <span class="notification-time">Hace 5 minutos</span>
                        </div>
                    </div>
                    <div class="notification-item">
                        <div class="notification-icon">
                            <i class="fas fa-calendar-check"></i>
                        </div>
                        <div class="notification-content">
                            <h4>Sesión Completada</h4>
                            <p>Carlos Ruiz completó una sesión de Matemáticas</p>
                            <span class="notification-time">Hace 1 hora</span>
                        </div>
                    </div>
                    <div class="notification-item">
                        <div class="notification-icon">
                            <i class="fas fa-exclamation-triangle"></i>
                        </div>
                        <div class="notification-content">
                            <h4>Problema Reportado</h4>
                            <p>Estudiante reportó problema con la plataforma</p>
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

function loadDashboardData() {
    // Simular carga de datos del dashboard
    console.log('Cargando datos del dashboard administrativo...');
    
    // Actualizar estadísticas
    updateDashboardStats();
    
    // Actualizar actividad reciente
    updateRecentActivity();
    
    // Actualizar estado del sistema
    updateSystemStatus();
}

function updateDashboardStats() {
    // Simular actualización de estadísticas
    const stats = {
        users: 1247,
        tutors: 89,
        students: 1158,
        courses: 156
    };
    
    // Animar los números
    animateNumbers('.stat-content h3', stats);
}

function updateRecentActivity() {
    // Simular actualización de actividad reciente
    console.log('Actualizando actividad reciente...');
}

function updateSystemStatus() {
    // Simular actualización del estado del sistema
    console.log('Actualizando estado del sistema...');
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

// Exportar funciones para uso global
window.AdminInterface = {
    loadSection,
    handleQuickAction,
    handleTableAction,
    showUserMenu,
    showNotifications,
    loadDashboardData
};
