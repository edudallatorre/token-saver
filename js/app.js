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

// Alerts Page Functions
function openCreateAlertModal() {
    const bodyHTML = `
        <div class="form-group">
            <label class="form-label">Alert Name</label>
            <input type="text" class="form-input" placeholder="Enter alert rule name" id="alertName">
        </div>
        <div class="form-group">
            <label class="form-label">Condition</label>
            <select class="form-select" id="alertCondition">
                <option value="">Select condition</option>
                <option value="cost">Cost exceeds</option>
                <option value="tokens">Token usage exceeds</option>
                <option value="latency">Latency exceeds</option>
                <option value="error">Error rate exceeds</option>
            </select>
        </div>
        <div class="form-group">
            <label class="form-label">Threshold</label>
            <input type="text" class="form-input" placeholder="e.g., 100, 5%" id="alertThreshold">
        </div>
        <div class="form-group">
            <label class="form-label">Scope</label>
            <select class="form-select" id="alertScope">
                <option value="all">All agents</option>
                <option value="per-agent">Per agent</option>
                <option value="per-project">Per project</option>
            </select>
        </div>
    `;

    openModal('Create New Alert Rule', bodyHTML, () => {
        const name = document.getElementById('alertName').value;
        const condition = document.getElementById('alertCondition').value;
        if (name && condition) {
            showToast('Alert Created', `${name} alert rule has been created successfully!`, 'success');
        } else {
            showToast('Error', 'Please fill in all required fields', 'error');
        }
    });
}

function acknowledgeAlert(alertId) {
    showToast('Alert Acknowledged', `Alert #${alertId} has been acknowledged`, 'success');
}

function editAlertRule(ruleId) {
    showToast('Edit Alert Rule', `Opening editor for ${ruleId} rule...`, 'info');
}

// Settings Page Functions
function saveAccountSettings() {
    const fullName = document.getElementById('settingsFullName').value;
    const email = document.getElementById('settingsEmail').value;

    if (fullName && email) {
        showToast('Settings Saved', 'Your account settings have been updated successfully!', 'success');
    } else {
        showToast('Error', 'Please fill in all required fields', 'error');
    }
}

function copyApiKey(keyType) {
    const keys = {
        'prod': 'ts_live_abc123xyz',
        'dev': 'ts_test_def456abc',
        'staging': 'ts_test_ghi789def'
    };

    const key = keys[keyType];
    if (key) {
        navigator.clipboard.writeText(key).then(() => {
            showToast('API Key Copied', `${keyType} API key copied to clipboard`, 'success');
        }).catch(() => {
            showToast('Error', 'Failed to copy API key', 'error');
        });
    }
}

function revokeApiKey(keyType) {
    if (confirm(`Are you sure you want to revoke the ${keyType} API key? This action cannot be undone.`)) {
        showToast('API Key Revoked', `${keyType} API key has been revoked`, 'success');
    }
}

function generateNewApiKey() {
    const bodyHTML = `
        <div class="form-group">
            <label class="form-label">Key Name</label>
            <input type="text" class="form-input" placeholder="Enter a name for this API key" id="newApiKeyName">
        </div>
        <div class="form-group">
            <label class="form-label">Environment</label>
            <select class="form-select" id="newApiKeyEnv">
                <option value="live">Production (live)</option>
                <option value="test">Development/Testing</option>
            </select>
        </div>
    `;

    openModal('Generate New API Key', bodyHTML, () => {
        const name = document.getElementById('newApiKeyName').value;
        const env = document.getElementById('newApiKeyEnv').value;
        if (name) {
            showToast('API Key Generated', `New ${env} API key "${name}" has been generated`, 'success');
        } else {
            showToast('Error', 'Please enter a key name', 'error');
        }
    });
}

function saveNotificationSettings() {
    showToast('Settings Saved', 'Your notification preferences have been updated successfully!', 'success');
}

function viewBillingHistory() {
    showToast('Billing History', 'Opening billing history and invoices...', 'info');
}

function managePlan() {
    showToast('Manage Plan', 'Opening plan management...', 'info');
}

function changePassword() {
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (!currentPassword || !newPassword || !confirmPassword) {
        showToast('Error', 'Please fill in all password fields', 'error');
        return;
    }

    if (newPassword !== confirmPassword) {
        showToast('Error', 'New passwords do not match', 'error');
        return;
    }

    if (newPassword.length < 8) {
        showToast('Error', 'Password must be at least 8 characters long', 'error');
        return;
    }

    showToast('Password Changed', 'Your password has been updated successfully!', 'success');
    document.getElementById('currentPassword').value = '';
    document.getElementById('newPassword').value = '';
    document.getElementById('confirmPassword').value = '';
}

function enable2FA() {
    showToast('Enable 2FA', 'Opening two-factor authentication setup...', 'info');
}

function revokeSession(sessionId) {
    if (confirm('Are you sure you want to revoke this session?')) {
        showToast('Session Revoked', `${sessionId} session has been terminated`, 'success');
    }
}

function saveGeneralSettings() {
    showToast('Settings Saved', 'Your general preferences have been updated successfully!', 'success');
}

function exportAllData() {
    if (confirm('This will prepare a complete export of all your data. Continue?')) {
        showToast('Export Started', 'Your data export is being prepared. You will receive an email when ready.', 'success');
    }
}

function deleteHistoricalData() {
    if (confirm('WARNING: This will permanently delete all historical usage data. Are you absolutely sure?')) {
        showToast('Data Deletion Scheduled', 'Historical data deletion has been scheduled', 'info');
    }
}

function deleteAccount() {
    const confirmation = prompt('Type "DELETE" to confirm account deletion:');
    if (confirmation === 'DELETE') {
        showToast('Account Deletion', 'Your account deletion request has been submitted', 'error');
    } else if (confirmation !== null) {
        showToast('Cancelled', 'Account deletion cancelled', 'info');
    }
}
