function renderHotspotsData() {
    if (typeof TokenSaverData === 'undefined') return;

    const hotspots = Array.isArray(TokenSaverData.hotspots)
        ? TokenSaverData.hotspots.map(normaliseHotspot)
        : [];
    const tableBody = document.getElementById('hotspotsTableBody');
    const driverList = document.getElementById('hotspotDriverList');
    const mobileCards = document.getElementById('hotspotsMobileCards');

    if (!hotspots.length) {
        const emptyState = createEmptyState('No hot spots detected', 'Token usage is currently inside the expected range for monitored agents.');
        setText('hotspotCostDriver', 'None');
        setText('hotspotCostDriverChange', 'Stable');
        setText('hotspotCount', '0');
        setText('hotspotCriticalCount', '0 critical');
        setText('hotspotAvgTokens', '0');
        setHTML('hotspotPotentialSaving', formatCurrency(0));
        setText('hotspotPotentialTokens', '0 tokens');
        if (tableBody) tableBody.innerHTML = `<tr><td colspan="8">${emptyState}</td></tr>`;
        if (driverList) driverList.innerHTML = emptyState;
        if (mobileCards) mobileCards.innerHTML = emptyState;
        return;
    }

    const costDriver = hotspots.reduce((highest, current) => current.cost24h > highest.cost24h ? current : highest, hotspots[0]);
    const totalPotentialCost = hotspots.reduce((sum, item) => sum + item.potentialSavingCost, 0);
    const totalPotentialTokens = hotspots.reduce((sum, item) => sum + item.potentialSavingTokens, 0);
    const avgTokens = Math.round(hotspots.reduce((sum, item) => sum + item.avgTokensPerRequest, 0) / hotspots.length);
    const criticalCount = hotspots.filter(item => item.severity === 'critical').length;

    setText('hotspotCostDriver', costDriver.agent);
    setText('hotspotCostDriverChange', `${formatSignedPercent(costDriver.trend)} cost trend`);
    setText('hotspotCount', String(hotspots.length));
    setText('hotspotCriticalCount', `${criticalCount} critical`);
    setText('hotspotAvgTokens', formatNumber(avgTokens));
    setHTML('hotspotPotentialSaving', formatCurrency(totalPotentialCost));
    setText('hotspotPotentialTokens', `${formatCompact(totalPotentialTokens)} tokens`);

    if (tableBody) {
        tableBody.innerHTML = hotspots.map((hotspot, index) => `
            <tr>
                <td>
                    <strong>${hotspot.reason}</strong>
                    <div class="table-meta">${hotspot.title}</div>
                </td>
                <td>${hotspot.agent}</td>
                <td>${hotspot.project}</td>
                <td>${formatCompact(hotspot.tokens24h)}</td>
                <td>${formatCurrency(hotspot.cost24h)}</td>
                <td class="trend-up">${formatSignedPercent(hotspot.trend)}</td>
                <td><span class="status-badge ${hotspot.severity}">${severityText(hotspot.severity)}</span></td>
                <td class="table-actions">
                    <button class="action-btn secondary" onclick="openHotspotModal(${index})">Inspect</button>
                    <button class="action-btn" onclick="createOptimisationFromHotspot(${index})">Optimise</button>
                </td>
            </tr>
        `).join('');
    }

    const maxTokens = Math.max(...hotspots.map(item => item.tokens24h));
    if (driverList) {
        driverList.innerHTML = hotspots.map(hotspot => `
            <div class="driver-item">
                <div class="driver-header">
                    <span>${hotspot.agent}</span>
                    <strong>${formatCompact(hotspot.tokens24h)}</strong>
                </div>
                <div class="driver-meta">${hotspot.project} - ${hotspot.reason}</div>
                <div class="driver-bar">
                    <span style="width: ${Math.round((hotspot.tokens24h / maxTokens) * 100)}%;"></span>
                </div>
            </div>
        `).join('');
    }

    if (mobileCards) {
        mobileCards.innerHTML = hotspots.map((hotspot, index) => `
            <article class="mobile-data-card">
                <div class="mobile-data-card-header">
                    <div>
                        <h3>${hotspot.reason}</h3>
                        <p>${hotspot.agent} - ${hotspot.project}</p>
                    </div>
                    <span class="status-badge ${hotspot.severity}">${severityText(hotspot.severity)}</span>
                </div>
                <p class="mobile-card-copy">${hotspot.title}</p>
                <div class="mobile-data-grid">
                    <div><span>Tokens</span><strong>${formatCompact(hotspot.tokens24h)}</strong></div>
                    <div><span>Cost</span><strong>${formatCurrency(hotspot.cost24h)}</strong></div>
                    <div><span>Trend</span><strong>${formatSignedPercent(hotspot.trend)}</strong></div>
                    <div><span>Saving</span><strong>${formatCurrency(hotspot.potentialSavingCost)}</strong></div>
                </div>
                <div class="mobile-card-actions">
                    <button class="action-btn secondary" onclick="openHotspotModal(${index})">Inspect</button>
                    <button class="action-btn" onclick="createOptimisationFromHotspot(${index})">Optimise</button>
                </div>
            </article>
        `).join('');
    }
}

function openHotspotModal(index) {
    const hotspots = Array.isArray(TokenSaverData.hotspots) ? TokenSaverData.hotspots : [];
    const hotspot = normaliseHotspot(hotspots[index]);
    if (!hotspot) return;

    const bodyHTML = `
        <div class="modal-section">
            <p class="modal-copy">${hotspot.title}</p>
        </div>
        <div class="detail-grid">
            <div class="detail-stat">
                <span>Agent</span>
                <strong>${hotspot.agent}</strong>
            </div>
            <div class="detail-stat">
                <span>Model</span>
                <strong>${hotspot.model}</strong>
            </div>
            <div class="detail-stat">
                <span>Tokens</span>
                <strong>${formatCompact(hotspot.tokens24h)}</strong>
            </div>
            <div class="detail-stat">
                <span>Cost</span>
                <strong>${formatCurrency(hotspot.cost24h)}</strong>
            </div>
        </div>
        <div class="modal-section">
            <h4>Recommended Action</h4>
            <p class="modal-copy">${hotspot.recommendation}</p>
            <p class="modal-copy">Estimated saving: ${formatCurrency(hotspot.potentialSavingCost)} and ${formatCompact(hotspot.potentialSavingTokens)} tokens per day.</p>
        </div>
    `;

    openModal('Hot Spot Details', bodyHTML, () => {
        createOptimisationFromHotspot(index);
    });
}

function createOptimisationFromHotspot(index) {
    const hotspots = Array.isArray(TokenSaverData.hotspots) ? TokenSaverData.hotspots : [];
    const hotspot = normaliseHotspot(hotspots[index]);
    if (!hotspot) return;

    showToast(
        'Optimisation Queued',
        `${hotspot.agent}: ${hotspot.recommendation}`,
        'success'
    );
}

function normaliseHotspot(hotspot) {
    if (!hotspot) return null;

    return {
        title: hotspot.title || 'Usage pattern needs review',
        agent: hotspot.agent || 'Unknown Agent',
        project: hotspot.project || 'Unassigned Project',
        model: hotspot.model || 'Unknown model',
        reason: hotspot.reason || 'Unclassified signal',
        tokens24h: Number(hotspot.tokens24h) || 0,
        requests24h: Number(hotspot.requests24h) || 0,
        avgTokensPerRequest: Number(hotspot.avgTokensPerRequest) || 0,
        cost24h: Number(hotspot.cost24h) || 0,
        trend: Number(hotspot.trend) || 0,
        severity: hotspot.severity || 'success',
        recommendation: hotspot.recommendation || 'Review request payload and model configuration.',
        potentialSavingCost: Number(hotspot.potentialSavingCost) || 0,
        potentialSavingTokens: Number(hotspot.potentialSavingTokens) || 0
    };
}

renderHotspotsData();
