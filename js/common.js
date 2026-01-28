// Funciones comunes para todas las páginas

/**
 * Carga datos JSON desde un archivo
 * @param {string} url - URL del archivo JSON
 * @returns {Promise} - Promise con los datos
 */
async function loadJSON(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error loading JSON:', error);
        return null;
    }
}

/**
 * Guarda el progreso del usuario en localStorage
 * @param {string} seriesId - ID de la serie
 * @param {number} chapter - Número del capítulo
 * @param {number} score - Puntuación obtenida
 */
function saveProgress(seriesId, chapter, score) {
    const progress = JSON.parse(localStorage.getItem('deutschQuizProgress')) || {};
    
    if (!progress[seriesId]) {
        progress[seriesId] = {};
    }
    
    progress[seriesId][chapter] = {
        score: score,
        date: new Date().toISOString()
    };
    
    localStorage.setItem('deutschQuizProgress', JSON.stringify(progress));
}

/**
 * Obtiene el progreso guardado
 * @param {string} seriesId - ID de la serie
 * @returns {Object} - Progreso de la serie
 */
function getProgress(seriesId) {
    const progress = JSON.parse(localStorage.getItem('deutschQuizProgress')) || {};
    return progress[seriesId] || {};
}

/**
 * Calcula el progreso general del usuario
 * @returns {Object} - Estadísticas del progreso
 */
function calculateOverallProgress() {
    const progress = JSON.parse(localStorage.getItem('deutschQuizProgress')) || {};
    let totalQuizzes = 0;
    let completedQuizzes = 0;
    let totalScore = 0;
    let maxScore = 0;
    
    for (const series in progress) {
        for (const chapter in progress[series]) {
            completedQuizzes++;
            totalScore += progress[series][chapter].score;
            maxScore += 10; // Asumiendo 10 preguntas por quiz
        }
    }
    
    return {
        completed: completedQuizzes,
        totalScore: totalScore,
        maxScore: maxScore,
        percentage: maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0
    };
}

/**
 * Muestra una notificación al usuario
 * @param {string} message - Mensaje a mostrar
 * @param {string} type - Tipo de notificación (success, error, warning, info)
 */
function showNotification(message, type = 'info') {
    // Eliminar notificaciones anteriores
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Crear nueva notificación
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Estilos básicos para la notificación
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.padding = '15px 20px';
    notification.style.borderRadius = '5px';
    notification.style.color = 'white';
    notification.style.zIndex = '1000';
    notification.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
    
    // Colores según tipo
    const colors = {
        success: '#27ae60',
        error: '#e74c3c',
        warning: '#f39c12',
        info: '#3498db'
    };
    
    notification.style.backgroundColor = colors[type] || colors.info;
    
    document.body.appendChild(notification);
    
    // Eliminar después de 3 segundos
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

/**
 * Formatea una fecha a un formato legible
 * @param {string} dateString - String de fecha ISO
 * @returns {string} - Fecha formateada
 */
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('de-DE', options);
}

// Exportar funciones para uso global
window.DeutschQuiz = {
    loadJSON,
    saveProgress,
    getProgress,
    calculateOverallProgress,
    showNotification,
    formatDate
};