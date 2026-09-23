function renderOptimisationsData() {
    if (typeof TokenSaverData === 'undefined') return;

    const optimisations = Array.isArray(TokenSaverData.optimisations)
        ? TokenSaverData.optimisations.map(normaliseOptimisation)
        : [];
    const cards = document.getElementById('optimisationCards');
    const appliedBody = document.getElementById('appliedOptimisationsBody');

    if (!optimisations.length) {
        const emptyState = createEmptyState('No pending recommendations', 'TokenSaver has no optimisation opportunities to show for the current data window.');
        setHTML('optimisationSavingPotential', formatCurrency(0));
        setHTML('optimisationMonthlyPotential', `${formatCurrency(0)} monthly projection`);
        setText('optimisationRecommendationCount', '0');
        setText('optimisationAppliedCount', '0 applied');
        setText('optimisationTokensRecoverable', '0');
        setText('optimisationLowRiskCount', '0');
        if (cards) cards.innerHTML = emptyState;
        if (appliedBody) appliedBody.innerHTML = `<tr><td colspan="6">${emptyState}</td></tr>`;
        return;
    }

    const recommended = optimisations.filter(item => item.status === 'recommended');
    const applied = optimisations.filter(item => item.status === 'applied');
    const dailySaving = recommended.reduce((sum, item) => sum + item.savingCost, 0);
    const recoverableTokens = recommended.reduce((sum, item) => sum + item.savingTokens, 0);
    const lowRiskCount = recommended.filter(item => item.risk === 'low').length;

    setHTML('optimisationSavingPotential', formatCurrency(dailySaving));
    setHTML('optimisationMonthlyPotential', `${formatCurrency(dailySaving * 30)} monthly projection`);
    setText('optimisationRecommendationCount', String(recommended.length));
    setText('optimisationAppliedCount', `${applied.length} applied`);
    setText('optimisationTokensRecoverable', formatCompact(recoverableTokens));
    setText('optimisationLowRiskCount', String(lowRiskCount));

    if (cards) {
        cards.innerHTML = recommended.length ? recommended.map(item => {
            const originalIndex = optimisations.indexOf(item);
            return `
                <article class="optimisation-card">
                    <div class="optimisation-card-header">
                        <div>
                            <span class="status-badge info">${item.category}</span>
                            <h2>${item.title}</h2>
                        </div>
                        <span class="status-badge ${riskStatus(item.risk)}">${item.risk} risk</span>
                    </div>
                    <p>${item.qualityImpact}</p>
                    <div class="optimisation-stats">
                        <div>
                            <span>Tokens saved</span>
                            <strong>${formatCompact(item.savingTokens)}</strong>
                        </div>
                        <div>
                            <span>Cost saved</span>
                            <strong>${formatCurrency(item.savingCost)}</strong>
                        </div>
                        <div>
                            <span>Effort</span>
                            <strong>${item.effort}</strong>
                        </div>
                    </div>
                    <div class="optimisation-footer">
                        <span>${item.project} - ${item.agent}</span>
                        <button class="action-btn" onclick="applyOptimisation(${originalIndex})">
                            <i class="fas fa-check"></i> Apply
                        </button>
                    </div>
                </article>
            `;
        }).join('') : createEmptyState('No pending recommendations', 'All current optimisation opportunities have already been reviewed or applied.');
    }

    if (appliedBody) {
        appliedBody.innerHTML = applied.length ? applied.map(item => `
            <tr>
                <td><strong>${item.title}</strong></td>
                <td>${item.project}</td>
                <td>${item.agent}</td>
                <td>${item.category}</td>
                <td>${formatCurrency(item.savingCost)} / ${formatCompact(item.savingTokens)}</td>
                <td><span class="status-badge success">Applied</span></td>
            </tr>
        `).join('') : `<tr><td colspan="6">${createEmptyState('No applied optimisations yet', 'Apply a recommendation to start tracking realised savings here.')}</td></tr>`;
    }
}

function applyOptimisation(index) {
    const optimisations = Array.isArray(TokenSaverData.optimisations) ? TokenSaverData.optimisations : [];
    const optimisation = optimisations[index];
    if (!optimisation) return;

    optimisation.status = 'applied';
    renderOptimisationsData();
    showToast('Optimisation Applied', `${optimisation.title} is now active.`, 'success');
}

function normaliseOptimisation(optimisation) {
    return {
        title: optimisation?.title || 'Untitled optimisation',
        project: optimisation?.project || 'Unassigned Project',
        agent: optimisation?.agent || 'Unknown Agent',
        category: optimisation?.category || 'General',
        status: optimisation?.status || 'recommended',
        risk: optimisation?.risk || 'medium',
        effort: optimisation?.effort || 'Review',
        savingTokens: Number(optimisation?.savingTokens) || 0,
        savingCost: Number(optimisation?.savingCost) || 0,
        qualityImpact: optimisation?.qualityImpact || 'Review before applying to confirm behaviour stays acceptable.'
    };
}

renderOptimisationsData();
