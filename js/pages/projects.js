function renderProjectsData() {
    if (typeof TokenSaverData === 'undefined') return;

    const projects = Array.isArray(TokenSaverData.projects) ? TokenSaverData.projects : [];
    const projectsTableBody = document.getElementById('projectsTableBody');
    const projectCards = document.getElementById('projectsMobileCards');

    if (!projects.length) {
        const emptyState = createEmptyState('No projects configured', 'Create a project to start grouping agents, budgets and optimisation signals.');
        if (projectsTableBody) {
            projectsTableBody.innerHTML = `<tr><td colspan="10">${emptyState}</td></tr>`;
        }
        if (projectCards) {
            projectCards.innerHTML = emptyState;
        }
        return;
    }

    if (projectsTableBody) {
        projectsTableBody.innerHTML = projects.map(project => {
            const safeProject = normaliseProject(project);
            return `
        <tr>
            <td><strong>${safeProject.name}</strong></td>
            <td>${safeProject.owner}</td>
            <td>${safeProject.agents.length} ${safeProject.agents.length === 1 ? 'agent' : 'agents'}</td>
            <td>${formatNumber(safeProject.requests24h)}</td>
            <td>${formatCompact(safeProject.tokens24h)}</td>
            <td>${formatCompact(safeProject.tokensSaved24h)}</td>
            <td>${formatCurrency(safeProject.cost24h)}</td>
            <td>
                <div class="budget-cell">
                    <span>${safeProject.budgetUsage}%</span>
                    <div class="budget-bar">
                        <span style="width: ${safeProject.budgetUsageCapped}%;"></span>
                    </div>
                </div>
            </td>
            <td><span class="status-badge ${safeProject.status}">${statusText(safeProject.status)}</span></td>
            <td>
                <button class="action-btn secondary" onclick="openProjectDetailsModal('${safeProject.name}')">View</button>
            </td>
        </tr>
            `;
        }).join('');
    }

    if (projectCards) {
        projectCards.innerHTML = projects.map(project => {
            const safeProject = normaliseProject(project);
            return `
                <article class="mobile-data-card">
                    <div class="mobile-data-card-header">
                        <div>
                            <h3>${safeProject.name}</h3>
                            <p>${safeProject.owner} - ${safeProject.agents.length} ${safeProject.agents.length === 1 ? 'agent' : 'agents'}</p>
                        </div>
                        <span class="status-badge ${safeProject.status}">${statusText(safeProject.status)}</span>
                    </div>
                    <div class="mobile-data-grid">
                        <div><span>Requests</span><strong>${formatNumber(safeProject.requests24h)}</strong></div>
                        <div><span>Tokens</span><strong>${formatCompact(safeProject.tokens24h)}</strong></div>
                        <div><span>Saved</span><strong>${formatCompact(safeProject.tokensSaved24h)}</strong></div>
                        <div><span>Cost</span><strong>${formatCurrency(safeProject.cost24h)}</strong></div>
                    </div>
                    <div class="budget-cell">
                        <span>${safeProject.budgetUsage}% of daily budget</span>
                        <div class="budget-bar">
                            <span style="width: ${safeProject.budgetUsageCapped}%;"></span>
                        </div>
                    </div>
                    <button class="action-btn secondary" onclick="openProjectDetailsModal('${safeProject.name}')">View</button>
                </article>
            `;
        }).join('');
    }
}

function openProjectDetailsModal(projectName) {
    const projects = Array.isArray(TokenSaverData.projects) ? TokenSaverData.projects : [];
    const project = normaliseProject(projects.find(item => item.name === projectName));
    if (!project) return;

    const agents = getProjectAgents(project.name);
    const bodyHTML = `
        <div class="detail-grid">
            <div class="detail-stat">
                <span>Owner</span>
                <strong>${project.owner}</strong>
            </div>
            <div class="detail-stat">
                <span>Requests 24h</span>
                <strong>${formatNumber(project.requests24h)}</strong>
            </div>
            <div class="detail-stat">
                <span>Tokens 24h</span>
                <strong>${formatCompact(project.tokens24h)}</strong>
            </div>
            <div class="detail-stat">
                <span>Monthly forecast</span>
                <strong>${formatCurrency(project.forecastMonth)}</strong>
            </div>
        </div>

        <div class="modal-section">
            <h4>Agents</h4>
            <div class="mini-list">
                ${agents.map(agent => `
                    <div class="mini-list-item">
                        <div>
                            <strong>${agent.name}</strong>
                            <span>${agent.type} - ${formatNumber(agent.requests24h)} requests</span>
                        </div>
                        <span class="status-badge ${agent.status}">${agent.health}</span>
                    </div>
                `).join('')}
            </div>
        </div>

        <div class="modal-section">
            <h4>Budget Health</h4>
            <div class="budget-cell">
                <span>${formatCurrency(project.cost24h)} of ${formatCurrency(project.budget24h)} daily budget</span>
                <div class="budget-bar">
                    <span style="width: ${project.budgetUsageCapped}%;"></span>
                </div>
            </div>
        </div>
    `;

    openModal(project.name, bodyHTML, () => {
        showToast('Project Reviewed', `${project.name} details checked.`, 'success');
    });
}

function normaliseProject(project) {
    if (!project) return null;

    const budget24h = Number(project.budget24h) > 0 ? Number(project.budget24h) : 1;
    const cost24h = Number(project.cost24h) || 0;
    const budgetUsage = Math.round((cost24h / budget24h) * 100);

    return {
        name: project.name || 'Untitled Project',
        owner: project.owner || 'Unassigned',
        agents: Array.isArray(project.agents) ? project.agents : [],
        status: project.status || 'success',
        requests24h: Number(project.requests24h) || 0,
        tokens24h: Number(project.tokens24h) || 0,
        tokensSaved24h: Number(project.tokensSaved24h) || 0,
        cost24h,
        budget24h,
        forecastMonth: Number(project.forecastMonth) || cost24h * 30,
        budgetUsage,
        budgetUsageCapped: Math.min(100, Math.max(0, budgetUsage))
    };
}

renderProjectsData();
