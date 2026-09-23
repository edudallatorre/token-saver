// Navigation
const navLinks = document.querySelectorAll('.nav-link');
const pages = document.querySelectorAll('.page');

function formatNumber(value) {
    return (Number(value) || 0).toLocaleString('en-GB');
}

function formatCompact(value) {
    const numericValue = Number(value) || 0;
    if (numericValue >= 1000000) return `${(numericValue / 1000000).toFixed(2)}M`;
    if (numericValue >= 1000) return `${Math.round(numericValue / 1000)}K`;
    return String(numericValue);
}

function formatCurrency(value) {
    return `&pound;${(Number(value) || 0).toFixed(2)}`;
}

function formatSignedPercent(value) {
    const numericValue = Number(value) || 0;
    return `${numericValue >= 0 ? '+' : ''}${numericValue.toFixed(1)}%`;
}

function setText(id, value) {
    const element = document.getElementById(id);
    if (element) element.textContent = value;
}

function setHTML(id, value) {
    const element = document.getElementById(id);
    if (element) element.innerHTML = value;
}

function createEmptyState(title, message) {
    return `
        <div class="empty-state">
            <div class="empty-state-icon"><i class="fas fa-circle-info"></i></div>
            <h3>${title}</h3>
            <p>${message}</p>
        </div>
    `;
}

function statusText(status) {
    if (status === 'critical') return 'Failed';
    if (status === 'warning') return 'Watch';
    if (status === 'applied') return 'Applied';
    if (status === 'recommended') return 'Recommended';
    return 'Active';
}

function riskStatus(risk) {
    if (risk === 'low') return 'success';
    if (risk === 'medium') return 'warning';
    return 'critical';
}

function severityText(severity) {
    if (severity === 'critical') return 'Critical';
    if (severity === 'warning') return 'Watch';
    return 'Low';
}

function getProjectAgents(projectName) {
    const agents = Array.isArray(TokenSaverData?.agents) ? TokenSaverData.agents : [];
    return agents.filter(agent => agent.project === projectName);
}

function renderSharedDashboardData() {
    if (typeof TokenSaverData === 'undefined') return;

    const overview = TokenSaverData.metrics?.overview || {};
    setText('overviewTotalTokens', formatCompact(overview.totalTokens));
    setHTML('overviewEstimatedCost', formatCurrency(overview.estimatedCost));
    setText('overviewRequests', formatNumber(overview.requests));
    setText('overviewTokensSaved', formatCompact(overview.tokensSaved));

    const agentsTableBody = document.getElementById('agentsTableBody');
    const agents = Array.isArray(TokenSaverData.agents) ? TokenSaverData.agents : [];
    if (agentsTableBody) {
        agentsTableBody.innerHTML = agents.length ? agents.map(agent => `
            <tr>
                <td><strong>${agent.name || 'Untitled Agent'}</strong></td>
                <td>${agent.type || 'Unclassified'}</td>
                <td><span class="status-badge ${agent.status || 'success'}">${statusText(agent.status)}</span></td>
                <td>${formatNumber(agent.requests24h)}</td>
                <td>${formatCurrency(agent.cost24h)}</td>
                <td>
                    <button class="action-btn secondary" onclick="openConfigModal('${agent.name || 'Untitled Agent'}')">Configure</button>
                </td>
            </tr>
        `).join('') : `<tr><td colspan="6">${createEmptyState('No agents configured', 'Create an agent to start tracking requests, latency and token usage.')}</td></tr>`;
    }

}

renderSharedDashboardData();

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const pageId = link.dataset.page;

        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');

        pages.forEach(p => p.classList.remove('active'));
        document.getElementById(pageId).classList.add('active');

        closeMobileMenu();
    });
});

// Notifications
const notificationBtn = document.getElementById('notificationBtn');
const notificationsDropdown = document.getElementById('notificationsDropdown');

notificationBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    notificationBtn.classList.toggle('active');
    notificationsDropdown.classList.toggle('active');
    userDropdown.classList.remove('active');
    userProfile.classList.remove('active');
});

function markAllRead() {
    document.querySelectorAll('.notification-item.unread').forEach(item => {
        item.classList.remove('unread');
    });
    showToast('Notifications', 'All notifications marked as read', 'success');
}

// User Dropdown
const userProfile = document.getElementById('userProfile');
const userDropdown = document.getElementById('userDropdown');

userProfile.addEventListener('click', (e) => {
    e.stopPropagation();
    userProfile.classList.toggle('active');
    userDropdown.classList.toggle('active');
    notificationsDropdown.classList.remove('active');
    notificationBtn.classList.remove('active');
});

// Time Filter
const timeFilter = document.getElementById('timeFilter');
const timeDropdown = document.getElementById('timeDropdown');
const timeFilterText = document.getElementById('timeFilterText');

timeFilter.addEventListener('click', (e) => {
    e.stopPropagation();
    timeFilter.classList.toggle('active');
    timeDropdown.classList.toggle('active');
});

const timeDropdownItems = timeDropdown.querySelectorAll('.dropdown-item');
timeDropdownItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.stopPropagation();
        timeFilterText.textContent = item.textContent;
        timeDropdown.classList.remove('active');
        timeFilter.classList.remove('active');
        showToast('Time Filter Updated', `Now showing data for: ${item.textContent}`, 'info');
    });
});

// Close dropdowns
document.addEventListener('click', () => {
    userDropdown.classList.remove('active');
    userProfile.classList.remove('active');
    timeDropdown.classList.remove('active');
    timeFilter.classList.remove('active');
    notificationsDropdown.classList.remove('active');
    notificationBtn.classList.remove('active');
});

// Copy Code Function
function copyCode(elementId) {
    const element = document.getElementById(elementId);
    const text = element.textContent;
    navigator.clipboard.writeText(text).catch(err => {
        console.error('Failed to copy:', err);
    });
}

// Toast Notifications
function showToast(title, message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <div class="toast-icon">
            <i class="fas fa-${type === 'success' ? 'check' : type === 'error' ? 'xmark' : 'info-circle'}"></i>
        </div>
        <div class="toast-content">
            <div class="toast-title">${title}</div>
            <div class="toast-message">${message}</div>
        </div>
    `;

    document.getElementById('toastContainer').appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideInRight 0.3s ease reverse';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Modal Functions
let currentModal = null;

function openModal(title, bodyHTML, onSubmit) {
    currentModal = onSubmit;
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalBody').innerHTML = bodyHTML;
    document.getElementById('modalOverlay').classList.add('active');
}

function closeModal() {
    document.getElementById('modalOverlay').classList.remove('active');
    currentModal = null;
}

function handleModalSubmit() {
    if (currentModal) {
        currentModal();
    }
    closeModal();
}

// Create Agent Modal
function openCreateAgentModal() {
    const bodyHTML = `
        <div class="form-group">
            <label class="form-label">Agent Name</label>
            <input type="text" class="form-input" placeholder="Enter agent name" id="agentName">
        </div>
        <div class="form-group">
            <label class="form-label">Agent Type</label>
            <select class="form-select" id="agentType">
                <option value="">Select type</option>
                <option value="support">Customer Support</option>
                <option value="content">Content Generation</option>
                <option value="sales">Sales Assistant</option>
                <option value="research">Research & Analysis</option>
            </select>
        </div>
        <div class="form-group">
            <label class="form-label">Description</label>
            <textarea class="form-textarea" placeholder="Describe your agent..." id="agentDesc"></textarea>
        </div>
    `;

    openModal('Create New Agent', bodyHTML, () => {
        const name = document.getElementById('agentName').value;
        const type = document.getElementById('agentType').value;
        if (name && type) {
            showToast('Agent Created', `${name} has been created successfully!`, 'success');
        } else {
            showToast('Error', 'Please fill in all fields', 'error');
        }
    });
}

// Create Project Modal
function openCreateProjectModal() {
    const bodyHTML = `
        <div class="form-group">
            <label class="form-label">Project Name</label>
            <input type="text" class="form-input" placeholder="Enter project name" id="projectName">
        </div>
        <div class="form-group">
            <label class="form-label">Description</label>
            <textarea class="form-textarea" placeholder="Describe your project..." id="projectDesc"></textarea>
        </div>
    `;

    openModal('Create New Project', bodyHTML, () => {
        const name = document.getElementById('projectName').value;
        if (name) {
            showToast('Project Created', `${name} has been created successfully!`, 'success');
        } else {
            showToast('Error', 'Please enter a project name', 'error');
        }
    });
}

// Config Modal
function openConfigModal(agentName) {
    const bodyHTML = `
        <div class="form-group">
            <label class="form-label">Agent Name</label>
            <input type="text" class="form-input" value="${agentName}" id="configName">
        </div>
        <div class="form-group">
            <label class="form-label">Max Tokens</label>
            <input type="number" class="form-input" value="4096" id="configTokens">
        </div>
        <div class="form-group">
            <label class="form-label">Temperature</label>
            <input type="number" class="form-input" value="0.7" step="0.1" id="configTemp">
        </div>
    `;

    openModal(`Configure ${agentName}`, bodyHTML, () => {
        showToast('Configuration Saved', `${agentName} updated successfully!`, 'success');
    });
}

// Navigate to Settings
function navigateToSettings() {
    navLinks.forEach(l => l.classList.remove('active'));
    document.querySelector('[data-page="settings"]').classList.add('active');
    pages.forEach(p => p.classList.remove('active'));
    document.getElementById('settings').classList.add('active');
    userDropdown.classList.remove('active');
    userProfile.classList.remove('active');
}

// Mobile menu
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const mobileOverlay = document.getElementById('mobileOverlay');
const sidebar = document.getElementById('sidebar');
const menuIcon = document.getElementById('menuIcon');

function openMobileMenu() {
    sidebar.classList.add('active');
    mobileOverlay.classList.add('active');
    menuIcon.classList.remove('fa-bars');
    menuIcon.classList.add('fa-xmark');
    document.body.style.overflow = 'hidden';
}

function closeMobileMenu() {
    sidebar.classList.remove('active');
    mobileOverlay.classList.remove('active');
    menuIcon.classList.remove('fa-xmark');
    menuIcon.classList.add('fa-bars');
    document.body.style.overflow = '';
}

function toggleMobileMenu() {
    if (sidebar.classList.contains('active')) {
        closeMobileMenu();
    } else {
        openMobileMenu();
    }
}

mobileMenuToggle.addEventListener('click', toggleMobileMenu);
mobileOverlay.addEventListener('click', closeMobileMenu);

window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
        closeMobileMenu();
    }
});

// Close modal on overlay click
document.getElementById('modalOverlay').addEventListener('click', (e) => {
    if (e.target.id === 'modalOverlay') {
        closeModal();
    }
});

// Authentication
const CORRECT_PASSWORD = 'TokenSaver2026*';
const loginScreen = document.getElementById('loginScreen');
const appContainer = document.getElementById('appContainer');
const loginForm = document.getElementById('loginForm');
const passwordInput = document.getElementById('passwordInput');
const loginError = document.getElementById('loginError');

// Check if already logged in
function checkAuth() {
    const isAuthenticated = sessionStorage.getItem('ts_authenticated');
    if (isAuthenticated === 'true') {
        loginScreen.classList.add('hidden');
        appContainer.classList.add('active');
        // Welcome toast
        setTimeout(() => {
            showToast('Welcome to TokenSaver AI', 'Your dashboard is ready!', 'success');
        }, 500);
    }
}

// Handle login
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const password = passwordInput.value;

    if (password === CORRECT_PASSWORD) {
        // Success
        sessionStorage.setItem('ts_authenticated', 'true');
        loginError.classList.remove('show');
        loginScreen.classList.add('hidden');
        appContainer.classList.add('active');

        // Welcome toast
        setTimeout(() => {
            showToast('Login Successful', 'Welcome to TokenSaver AI Dashboard!', 'success');
        }, 300);
    } else {
        // Error
        loginError.classList.add('show');
        passwordInput.value = '';
        passwordInput.focus();

        // Shake animation
        loginError.style.animation = 'none';
        setTimeout(() => {
            loginError.style.animation = 'shake 0.5s';
        }, 10);
    }
});

// Logout function
function handleLogout() {
    sessionStorage.removeItem('ts_authenticated');
    showToast('Logging out', 'Goodbye! See you soon.', 'info');
    setTimeout(() => {
        loginScreen.classList.remove('hidden');
        appContainer.classList.remove('active');
        passwordInput.value = '';
        loginError.classList.remove('show');
    }, 1000);
}

// Check auth on load
window.addEventListener('load', checkAuth);
