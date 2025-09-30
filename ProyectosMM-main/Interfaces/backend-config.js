// ===============================================
// CONFIGURACIÓN PARA INTEGRACIÓN BACKEND (COMPLETO)
// ===============================================
// Este archivo conecta las interfaces (Alumno/Tutor) con tu backend real.
// Incluye:
//  - Mapa de endpoints (BACKEND_CONFIG)
//  - Utilidades de red (apiRequest, tokens, headers)
//  - Funciones usadas por alumnos.js/tutores.js (perfil, sesiones, tutores, etc.)
//  - Conectores de notificaciones/calendario/ratings (stubs seguros si no existen aún)
//
// Nota: Si tu backend todavía no implementa algunos endpoints, estas funciones
// devuelven valores vacíos o lanzan errores controlados para que el front no se rompa.

// ===============================================
// 1) Mapa de Endpoints
// ===============================================
const BACKEND_CONFIG = {
  // URL base del backend (ajustado a tu servidor)
  BASE_URL: 'http://localhost:4000/api',

  // Autenticación
  // En BACKEND_CONFIG.AUTH
AUTH: {
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  REGISTER: '/auth/register',
  REFRESH_TOKEN: '/auth/refresh',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  VERIFY_EMAIL: '/auth/verify-email',
  PROFILE: '/auth/profile' // <-- NUEVO
},



  // Usuarios (generales)
  USERS: {
    GET_PROFILE: '/users/profile',            // GET /users/profile?email=
    UPDATE_PROFILE: '/users/profile',         // PUT
    GET_ALL_USERS: '/users',                  // GET
    CREATE_USER: '/users',                    // POST
    UPDATE_USER: '/users/:id',                // PUT
    DELETE_USER: '/users/:id',                // DELETE
    CHANGE_PASSWORD: '/users/change-password' // POST
  },

  // Tutores
  TUTORS: {
    GET_ALL_TUTORS: '/tutors',                        // GET (admite filtros como ?area=&modality=&day=&time=&duration=)
    GET_TUTOR_PROFILE: '/tutors/:id',                 // GET
    UPDATE_TUTOR_PROFILE: '/tutors/:id',              // PUT
    GET_TUTOR_AVAILABILITY: '/tutors/:id/availability', // GET
    SET_TUTOR_AVAILABILITY: '/tutors/:id/availability', // PUT/POST
    GET_TUTOR_SESSIONS: '/tutors/:id/sessions',       // GET
    GET_TUTOR_RATINGS: '/tutors/:id/ratings'         // GET
  },

  // Estudiantes
  STUDENTS: {
    GET_ALL_STUDENTS: '/students',                  // GET
    GET_STUDENT_PROFILE: '/students/:id',           // GET
    UPDATE_STUDENT_PROFILE: '/students/:id',        // PUT
    GET_STUDENT_SESSIONS: '/students/:id/sessions', // GET (también soportamos /students/sessions?email= como alternativa)
    GET_STUDENT_COURSES: '/students/:id/courses',   // GET
    GET_STUDENT_PROGRESS: '/students/:id/progress'  // GET
  },

  // Sesiones
  SESSIONS: {
    GET_ALL_SESSIONS: '/sessions',
    CREATE_SESSION: '/sessions',
    GET_SESSION: '/sessions/:id',
    UPDATE_SESSION: '/sessions/:id',
    DELETE_SESSION: '/sessions/:id',
    ACCEPT_SESSION: '/sessions/:id/accept',
    REJECT_SESSION: '/sessions/:id/reject',
    RESCHEDULE_SESSION: '/sessions/:id/reschedule',
    CANCEL_SESSION: '/sessions/:id/cancel',
    COMPLETE_SESSION: '/sessions/:id/complete',
    GET_SESSION_HISTORY: '/sessions/history'
  },

  // Áreas de apoyo
  SUPPORT_AREAS: {
    GET_ALL_AREAS: '/support-areas',
    CREATE_AREA: '/support-areas',
    UPDATE_AREA: '/support-areas/:id',
    DELETE_AREA: '/support-areas/:id',
    GET_AREA_TUTORS: '/support-areas/:id/tutors'
  },

  // Valoraciones
  RATINGS: {
    GET_ALL_RATINGS: '/ratings',
    CREATE_RATING: '/ratings',            // POST
    UPDATE_RATING: '/ratings/:id',        // PUT
    DELETE_RATING: '/ratings/:id',        // DELETE
    GET_TUTOR_RATINGS: '/ratings/tutor/:id',
    GET_SESSION_RATINGS: '/ratings/session/:id'
  },

  // Notificaciones
  NOTIFICATIONS: {
    GET_NOTIFICATIONS: '/notifications',
    MARK_AS_READ: '/notifications/:id/read',
    MARK_ALL_READ: '/notifications/mark-all-read',
    DELETE_NOTIFICATION: '/notifications/:id',
    GET_UNREAD_COUNT: '/notifications/unread-count'
  },

  // Mensajes
  MESSAGES: {
    GET_CONVERSATIONS: '/messages/conversations',
    GET_MESSAGES: '/messages/:conversationId',
    SEND_MESSAGE: '/messages',
    MARK_AS_READ: '/messages/:id/read',
    DELETE_MESSAGE: '/messages/:id'
  },

  // Reportes
  REPORTS: {
    GET_DASHBOARD_STATS: '/reports/dashboard',
    GET_SESSION_REPORTS: '/reports/sessions',
    GET_TUTOR_REPORTS: '/reports/tutors',
    GET_STUDENT_REPORTS: '/reports/students',
    EXPORT_REPORT: '/reports/export/:type'
  },

  // Configuración del sistema
  CONFIG: {
    GET_SYSTEM_CONFIG: '/config',
    UPDATE_SYSTEM_CONFIG: '/config',
    GET_CANCELLATION_POLICY: '/config/cancellation-policy',
    UPDATE_CANCELLATION_POLICY: '/config/cancellation-policy'
  }
};

// ===============================================
// 2) Utilidades: Token, Headers, Limpieza de sesión
// ===============================================
function getAuthToken() {
  const t = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
  if (!t) return null;
  // Evita strings basura guardadas accidentalmente
  if (t === 'undefined' || t === 'null' || t.trim() === '') return null;
  return t;
}


function setAuthToken(token, remember = false) {
  if (!token) return;
  if (remember) localStorage.setItem('authToken', token);
  else sessionStorage.setItem('authToken', token);
}

function clearAuth() {
  localStorage.removeItem('authToken');
  sessionStorage.removeItem('authToken');
  localStorage.removeItem('userSession');
  sessionStorage.removeItem('userEmail');
}

// Guarda y lee email del usuario (para llamadas por email en alumnos.js)
function setUserEmail(email, remember = false) {
  if (!email) return;
  if (remember) localStorage.setItem('userEmail', email);
  else sessionStorage.setItem('userEmail', email);
}
function getUserEmail() {
  return localStorage.getItem('userEmail') || sessionStorage.getItem('userEmail') || '';
}

// Headers comunes
function getDefaultHeaders(method = 'GET') {
  const base = {};
  // Solo agrega Content-Type cuando vayas a mandar body JSON
  if (method && method.toUpperCase() !== 'GET' && method.toUpperCase() !== 'HEAD') {
    base['Content-Type'] = 'application/json';
  }
  const token = getAuthToken();
  if (token) base['Authorization'] = `Bearer ${token}`;
  // Evita caching agresivo del navegador
  base['Cache-Control'] = 'no-cache';
  return base;
}


// ===============================================
// 3) apiRequest (fetch con manejo de errores y JSON opcional)
// ===============================================
async function apiRequest(endpoint, options = {}) {
  const url = `${BACKEND_CONFIG.BASE_URL}${endpoint}`;
  const config = {
    method: 'GET',
    cache: 'no-store',                  // <- fuerza no-cache del lado fetch
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',      // <- y del lado request
      ...(getAuthToken() ? { 'Authorization': `Bearer ${getAuthToken()}` } : {})
    },
    ...options
  };

  const res = await fetch(url, config);

  // Trata 304 como error de cache y no de "no encontrado"
  if (res.status === 304) {
    throw new Error('HTTP 304');
  }

  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try {
      const data = await res.json();
      msg = data?.message || data?.error || msg;
    } catch {}
    throw new Error(msg);
  }

  const ct = (res.headers.get('content-type') || '').toLowerCase();
  if (!ct.includes('application/json')) return null;
  return res.json();
}



// ===============================================
// 4) Autenticación (front → backend)
// ===============================================
async function loginUser(email, password, remember = false) {
  const response = await apiRequest(BACKEND_CONFIG.AUTH.LOGIN, {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });

  // si el backend retorna { token, usuario }, guardamos token + email
  if (response?.token) setAuthToken(response.token, remember);
  setUserEmail(email, remember);
  return response;
}

async function logoutUser() {
  try {
    await apiRequest(BACKEND_CONFIG.AUTH.LOGOUT, { method: 'POST' });
  } catch (e) {
    // no pasa nada si no existe endpoint; limpiamos igual
  } finally {
    clearAuth();
  }
}

async function registerUser(userData) {
  return apiRequest(BACKEND_CONFIG.AUTH.REGISTER, {
    method: 'POST',
    body: JSON.stringify(userData)
  });
}

// ===============================================
// 5) Usuarios y Perfiles
// ===============================================
async function getUserProfile() {
  // Variante general si usas /users/profile con email
  const email = getUserEmail();
  const qs = email ? `?${new URLSearchParams({ email }).toString()}` : '';
  return apiRequest(`${BACKEND_CONFIG.USERS.GET_PROFILE}${qs}`);
}

async function updateUserProfile(profileData) {
  return apiRequest(BACKEND_CONFIG.USERS.UPDATE_PROFILE, {
    method: 'PUT',
    body: JSON.stringify(profileData)
  });
}

// ===============================================
// 6) Estudiantes (perfil/sesiones) usados por alumnos.js
// ===============================================

// Asegúrate de tener esta clave en BACKEND_CONFIG.AUTH:
/// AUTH: { ..., PROFILE: '/auth/profile' }

// ===============================================
// 6) Estudiantes (perfil/sesiones) usados por alumnos.js
// ===============================================
async function getStudentProfile() {
  const email = getUserEmail();
  if (!email) return {};

  const base = BACKEND_CONFIG.BASE_URL;
  const headers = getDefaultHeaders();

  // 1) /auth/profile?email=... con "cache-busting"
  if (true) {
    try {
      const res = await fetch(
        `${base}${BACKEND_CONFIG.AUTH.PROFILE || '/auth/profile'}?email=${encodeURIComponent(email)}&_=${Date.now()}`,
        { headers, cache: 'no-store' }
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const p = data.profile || data || {};
      const fullName = p.fullName || [p.firstName, p.lastName].filter(Boolean).join(' ').trim();

      return {
        firstName: p.firstName || '',
        lastName : p.lastName  || '',
        fullName : fullName || '',
        email    : p.email || email || '',
        studentId: p.studentId || p.matricula || p.matrícula || ''
      };
    } catch (e) {
      console.warn('getStudentProfile(/auth/profile) fallback -> try /users/profile:', e.message);
      // continúa con el fallback abajo
    }
  }

  // 2) Fallback: /users/profile?email=...
  try {
    const qs = `?${new URLSearchParams({ email, _: Date.now() }).toString()}`;
    return await apiRequest(`${BACKEND_CONFIG.USERS.GET_PROFILE}${qs}`, { cache: 'no-store' });
  } catch (e2) {
    console.warn('getStudentProfile fallback {}:', e2.message);
    return {};
  }
}






async function getStudentSessions() {
  const email = getUserEmail();
  if (!email) return [];

  const base = BACKEND_CONFIG.BASE_URL;

  // 1) /students/sessions?email=
  try {
    const url = `${base}/students/sessions?${new URLSearchParams({ email })}`;
    const r = await fetch(url, { headers: getDefaultHeaders() });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const ct = (r.headers.get('content-type') || '').toLowerCase();
    const data = ct.includes('application/json') ? await r.json() : null;
    const list = Array.isArray(data) ? data : (data?.sessions || []);
    return list || [];
  } catch (e1) {
    console.warn('getStudentSessions(/students/sessions) falló → intento /sessions:', e1.message);
  }

  // 2) Fallback: /sessions?email=
  try {
    const url2 = `${base}/sessions?${new URLSearchParams({ email })}`;
    const r2 = await fetch(url2, { headers: getDefaultHeaders() });
    if (!r2.ok) throw new Error(`HTTP ${r2.status}`);
    const ct2 = (r2.headers.get('content-type') || '').toLowerCase();
    const data2 = ct2.includes('application/json') ? await r2.json() : null;
    const list2 = Array.isArray(data2) ? data2 : (data2?.sessions || []);
    return list2 || [];
  } catch (e2) {
    console.warn('getStudentSessions fallback []:', e2.message);
    return [];
  }
}


// Próximas sesiones para dashboard Inicio
function _cryptoRandomId() { return 'id_' + Math.random().toString(36).slice(2, 10); }
function _formatDateStr(d) { try { const x=new Date(d); return x.toLocaleDateString('es-ES',{day:'2-digit',month:'2-digit',year:'numeric'});} catch { return d||''; } }

async function getUpcomingSessions() {
  const sessions = await getStudentSessions();
  const now = new Date();
  return sessions
    .filter(s => new Date(s.date || s.startDate || Date.now()) >= now)
    .sort((a,b)=> new Date(a.date||a.startDate) - new Date(b.date||b.startDate))
    .slice(0,5)
    .map(s => ({
      id: s.id || s.sessionId || _cryptoRandomId(),
      title: s.title || s.titulo || 'Sesión de apoyo',
      tutor: s.tutor || s.tutorName || s.tutor_nombre || 'Tutor',
      modality: s.modality || s.modalidad || '—',
      date: _formatDateStr(s.date || s.fecha || s.startDate),
      time: s.time || s.hora || '',
      duration: (s.duration || s.duracion) ? `${s.duration || s.duracion} min` : '',
      link: s.link || s.enlace || '',
      location: s.location || s.ubicacion || ''
    }));
}

async function getRecentActivity() {
  const email = getUserEmail();
  if (!email) return [];
  const qs = new URLSearchParams({ email }).toString();
  try {
    const data = await apiRequest(`/students/activity?${qs}`);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

// ===============================================
// 7) Tutores (búsqueda y perfil) usados por alumnos.js
// ===============================================
async function getTutorProfile(tutorId) {
  if (!tutorId) throw new Error('tutorId requerido');
  const ep = BACKEND_CONFIG.TUTORS.GET_TUTOR_PROFILE.replace(':id', encodeURIComponent(String(tutorId)));
  return apiRequest(ep);
}

async function searchTutorsByAvailability({ area = '', modality = '', day = '', time = '', duration = '' } = {}) {
  // Preferimos GET con query (más cacheable). Si tu backend implementó POST, puedes cambiar aquí.
  const qp = new URLSearchParams();
  if (area) qp.set('area', area);
  if (modality) qp.set('modality', modality);
  if (day) qp.set('day', day);
  if (time) qp.set('time', time);
  if (duration) qp.set('duration', duration);

  try {
    const list = await apiRequest(`${BACKEND_CONFIG.TUTORS.GET_ALL_TUTORS}?${qp.toString()}`);
    return (Array.isArray(list) ? list : []).map(t => ({
      id: t.id,
      name: t.name || t.nombre || 'Tutor',
      specialty: t.specialty || t.especialidad || area || 'Apoyo',
      rating: t.rating || t.promedio || 0,
      reviewsCount: t.reviewsCount || t.num_reviews || 0,
      available: t.available !== false,
      nextAvailable: t.nextAvailable || '',
      modalities: t.modalities || t.modalidades || (modality ? [modality] : []),
      price: t.price || t.tarifa || null
    }));
  } catch (e) {
    console.warn('searchTutorsByAvailability fallback []:', e.message);
    return [];
  }
}

// ===============================================
// 8) Sesiones / Ratings / Notificaciones (conectores)
// ===============================================
async function getSessions(filters = {}) {
  const queryParams = new URLSearchParams(filters).toString();
  const endpoint = queryParams ? `${BACKEND_CONFIG.SESSIONS.GET_ALL_SESSIONS}?${queryParams}` : BACKEND_CONFIG.SESSIONS.GET_ALL_SESSIONS;
  return apiRequest(endpoint);
}

async function createSession(sessionData) {
  return apiRequest(BACKEND_CONFIG.SESSIONS.CREATE_SESSION, {
    method: 'POST',
    body: JSON.stringify(sessionData)
  });
}

async function updateSession(sessionId, sessionData) {
  return apiRequest(BACKEND_CONFIG.SESSIONS.UPDATE_SESSION.replace(':id', sessionId), {
    method: 'PUT',
    body: JSON.stringify(sessionData)
  });
}

async function cancelSession(sessionId, reason) {
  return apiRequest(BACKEND_CONFIG.SESSIONS.CANCEL_SESSION.replace(':id', sessionId), {
    method: 'POST',
    body: JSON.stringify({ reason })
  });
}

async function createRating(ratingData) {
  return apiRequest(BACKEND_CONFIG.RATINGS.CREATE_RATING, {
    method: 'POST',
    body: JSON.stringify(ratingData)
  });
}

async function createSessionAndNotify(sessionData) {
  const response = await createSession(sessionData);
  try {
    await apiRequest('/notifications/new-session-request', {
      method: 'POST',
      body: JSON.stringify({
        sessionId: response.id,
        tutorId: sessionData.tutorId,
        studentId: sessionData.studentId,
        sessionData
      })
    });
  } catch {
    // si aún no hay endpoint, seguimos sin romper el flujo
  }
  return response;
}

// Estados de sesión entre usuarios (si ya lo implementaste en backend)
async function syncSessionStatus(sessionId, newStatus, userId, userType) {
  const response = await apiRequest(`/sessions/${sessionId}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status: newStatus, userId, userType, timestamp: new Date().toISOString() })
  });
  // Notificar al otro usuario
  try {
    await notifyUserStatusChange(sessionId, newStatus, userId, userType);
  } catch {}
  return response;
}

async function notifyUserStatusChange(sessionId, status, userId, userType) {
  return apiRequest('/notifications/session-status-change', {
    method: 'POST',
    body: JSON.stringify({ sessionId, status, userId, userType })
  });
}

async function syncCalendars(studentId, tutorId, sessionData) {
  return apiRequest('/calendar/sync', {
    method: 'POST',
    body: JSON.stringify({ studentId, tutorId, sessionData })
  });
}

async function handleBidirectionalNotification(senderId, receiverId, type, data) {
  return apiRequest('/notifications/bidirectional', {
    method: 'POST',
    body: JSON.stringify({ senderId, receiverId, type, data })
  });
}

async function updateTutorAvailabilityAndNotify(tutorId, availabilityData) {
  const response = await apiRequest(`/tutors/${tutorId}/availability`, {
    method: 'PUT',
    body: JSON.stringify(availabilityData)
  });
  try {
    await apiRequest('/notifications/availability-update', {
      method: 'POST',
      body: JSON.stringify({ tutorId, availabilityData })
    });
  } catch {}
  return response;
}

// Dashboard
async function getDashboardStats() {
  const email = getUserEmail();
  if (!email) return { availableTutors: 0, scheduledSessions: 0, averageRating: 0, totalHours: 0 };
  try {
    const qs = new URLSearchParams({ email }).toString();
    return await apiRequest(`${BACKEND_CONFIG.REPORTS.GET_DASHBOARD_STATS}?${qs}`);
  } catch {
    const sessions = await getStudentSessions();
    const future = sessions.filter(s => new Date(s.date || s.startDate || Date.now()) >= new Date());
    const totalMin = sessions.reduce((acc, s) => acc + (parseInt(s.duration || s.duracion || 0, 10) || 0), 0);
    return {
      availableTutors: 0,
      scheduledSessions: future.length,
      averageRating: 0,
      totalHours: Math.round(totalMin / 60)
    };
  }
}

// ===============================================
// 9) Stubs/Helpers extra (sustituye cuando tengas endpoints reales)
// ===============================================
function getTutorIdByNameStub(name) {
  // Reemplaza por un endpoint real cuando lo tengas
  return null;
}

// ===============================================
// 10) Export para navegador (window.BackendAPI)
// ===============================================
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    BACKEND_CONFIG,
    apiRequest,
    getDefaultHeaders,
    getAuthToken,
    setAuthToken,
    setUserEmail,
    getUserEmail,

    // auth
    loginUser,
    logoutUser,
    registerUser,

    // usuarios
    getUserProfile,
    updateUserProfile,

    // alumnos.js
    getStudentProfile,
    getStudentSessions,
    getUpcomingSessions,
    getRecentActivity,

    // tutores
    getTutorProfile,
    searchTutorsByAvailability,

    // sesiones/ratings/notifications
    getSessions,
    createSession,
    updateSession,
    cancelSession,
    createRating,
    createSessionAndNotify,
    syncSessionStatus,
    notifyUserStatusChange,
    syncCalendars,
    handleBidirectionalNotification,
    updateTutorAvailabilityAndNotify,

    // reportes
    getDashboardStats,

    // stub
    getTutorIdByNameStub
  };
} else {
  window.BackendAPI = {
    // Config y helpers base
    BACKEND_CONFIG,
    baseURL: BACKEND_CONFIG.BASE_URL,
    getHeaders: getDefaultHeaders,

    // Utils/token
    apiRequest,
    getAuthToken,
    setAuthToken,
    setUserEmail,
    getUserEmail,

    // Auth
    loginUser,
    logoutUser,
    registerUser,

    // Usuarios
    getUserProfile,
    updateUserProfile,

    // Alumno
    getStudentProfile,
    getStudentSessions,
    getUpcomingSessions,
    getRecentActivity,

    // Tutor
    getTutorProfile,
    searchTutorsByAvailability,

    // Sesiones/ratings/notifs
    getSessions,
    createSession,
    updateSession,
    cancelSession,
    createRating,
    createSessionAndNotify,
    syncSessionStatus,
    notifyUserStatusChange,
    syncCalendars,
    handleBidirectionalNotification,
    updateTutorAvailabilityAndNotify,

    // Reportes
    getDashboardStats,

    // Stub
    getTutorIdByName: getTutorIdByNameStub
  };
}


