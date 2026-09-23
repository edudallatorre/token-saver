const monitoringData = typeof TokenSaverData === 'undefined' ? null : TokenSaverData;
const monitoringSamples = monitoringData ? monitoringData.activity : [];

let monitoringLive = true;
let monitoringTick = 0;

function formatActivityTime() {
    return new Date().toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
}

function statusLabel(status) {
    if (status === 'critical') return 'Failed';
    if (status === 'warning') return 'Warning';
    return 'Success';
}

function createActivityRow(sample) {
    const row = document.createElement('tr');
    const searchText = `${sample.agent} ${sample.project} ${sample.model} ${sample.request} ${statusLabel(sample.status)}`.toLowerCase();

    row.dataset.agent = sample.agent;
    row.dataset.status = sample.status;
    row.dataset.search = searchText;
    row.innerHTML = `
        <td>${sample.time || formatActivityTime()}</td>
        <td><strong>${sample.agent}</strong></td>
        <td>${sample.project}</td>
        <td>${sample.model}</td>
        <td class="request-cell">${sample.request}</td>
        <td>${sample.tokens.toLocaleString('en-GB')}</td>
        <td>&pound;${sample.cost.toFixed(3)}</td>
        <td>${sample.latency}</td>
        <td><span class="status-badge ${sample.status}">${statusLabel(sample.status)}</span></td>
    `;

    return row;
}

function renderMonitoringStaticData() {
    if (!monitoringData) return;

    const metrics = monitoringData.metrics.monitoring;
    document.getElementById('liveRequestsMetric').textContent = String(metrics.liveRequests);
    document.getElementById('tokensPerMinuteMetric').textContent = `${(metrics.tokensPerMinute / 1000).toFixed(1)}K`;
    document.getElementById('avgLatencyMetric').textContent = `${metrics.avgLatencyMs}ms`;
    document.getElementById('errorRateMetric').textContent = `${metrics.errorRate.toFixed(1)}%`;
    document.getElementById('tokensSavedLiveMetric').textContent = `${(metrics.tokensSavedLive / 1000).toFixed(1)}K`;

    const agentFilter = document.getElementById('activityAgentFilter');
    if (agentFilter) {
        agentFilter.innerHTML = [
            '<option value="all">All agents</option>',
            ...monitoringData.agents.map(agent => `<option value="${agent.name}">${agent.name}</option>`)
        ].join('');
    }

    const agentHealthList = document.getElementById('agentHealthList');
    if (agentHealthList) {
        agentHealthList.innerHTML = monitoringData.agents.map(agent => `
            <div class="health-item">
                <div class="health-main">
                    <div class="health-title">${agent.name}</div>
                    <div class="health-meta">${agent.requests24h.toLocaleString('en-GB')} requests today - ${agent.avgLatencyMs}ms avg</div>
                </div>
                <span class="status-badge ${agent.status}">${agent.health}</span>
            </div>
        `).join('');
    }

    const activityBody = document.getElementById('liveActivityBody');
    if (activityBody) {
        activityBody.innerHTML = '';
        monitoringData.activity.forEach(activity => {
            activityBody.appendChild(createActivityRow(activity));
        });
    }

    const eventList = document.getElementById('monitoringEventList');
    if (eventList) {
        eventList.innerHTML = monitoringData.events.map(event => `
            <div class="event-item">
                <div class="event-main">
                    <div class="event-title">${event.title}</div>
                    <div class="event-meta">${event.meta}</div>
                </div>
                <span class="status-badge ${event.status}">${event.label}</span>
            </div>
        `).join('');
    }
}

function filterMonitoringActivity() {
    const agent = document.getElementById('activityAgentFilter')?.value || 'all';
    const status = document.getElementById('activityStatusFilter')?.value || 'all';
    const search = (document.getElementById('activitySearchFilter')?.value || '').trim().toLowerCase();

    document.querySelectorAll('#liveActivityBody tr').forEach(row => {
        const matchesAgent = agent === 'all' || row.dataset.agent === agent;
        const matchesStatus = status === 'all' || row.dataset.status === status;
        const matchesSearch = !search || row.dataset.search.includes(search);
        row.style.display = matchesAgent && matchesStatus && matchesSearch ? '' : 'none';
    });
}

function refreshThroughputChart() {
    const chart = document.getElementById('throughputChart');
    if (!chart) return;

    chart.querySelectorAll('.throughput-bar').forEach(bar => {
        const prompt = bar.querySelector('.prompt');
        const completion = bar.querySelector('.completion');
        prompt.style.height = `${Math.floor(48 + Math.random() * 46)}%`;
        completion.style.height = `${Math.floor(25 + Math.random() * 36)}%`;
    });
}

function updateMonitoringMetrics() {
    const liveRequests = document.getElementById('liveRequestsMetric');
    const tokensPerMinute = document.getElementById('tokensPerMinuteMetric');
    const avgLatency = document.getElementById('avgLatencyMetric');
    const errorRate = document.getElementById('errorRateMetric');
    const tokensSavedLive = document.getElementById('tokensSavedLiveMetric');

    if (!liveRequests || !tokensPerMinute || !avgLatency || !errorRate || !tokensSavedLive) return;

    const base = monitoringData?.metrics.monitoring || {
        liveRequests: 186,
        tokensPerMinute: 42800,
        avgLatencyMs: 812,
        errorRate: 0.7,
        tokensSavedLive: 8400
    };

    liveRequests.textContent = String(base.liveRequests - 10 + Math.floor(Math.random() * 38));
    tokensPerMinute.textContent = `${((base.tokensPerMinute + Math.random() * 9000) / 1000).toFixed(1)}K`;
    avgLatency.textContent = `${base.avgLatencyMs - 60 + Math.floor(Math.random() * 160)}ms`;
    errorRate.textContent = `${(base.errorRate - 0.3 + Math.random() * 0.6).toFixed(1)}%`;
    tokensSavedLive.textContent = `${((base.tokensSavedLive + Math.random() * 2700) / 1000).toFixed(1)}K`;
}

function addMonitoringActivity() {
    const body = document.getElementById('liveActivityBody');
    if (!body) return;

    const sample = monitoringSamples[monitoringTick % monitoringSamples.length];
    body.prepend(createActivityRow({ ...sample, time: null }));
    monitoringTick += 1;

    while (body.children.length > 8) {
        body.lastElementChild.remove();
    }

    filterMonitoringActivity();
}

function toggleMonitoringLive() {
    const button = document.getElementById('monitoringLiveBtn');
    monitoringLive = !monitoringLive;

    if (button) {
        button.classList.toggle('is-paused', !monitoringLive);
        button.innerHTML = monitoringLive
            ? '<span class="live-dot"></span> Live'
            : '<i class="fas fa-pause"></i> Paused';
    }

    showToast(
        monitoringLive ? 'Live Monitoring Resumed' : 'Live Monitoring Paused',
        monitoringLive ? 'Incoming activity is updating again.' : 'Incoming activity is temporarily paused.',
        'info'
    );
}

renderMonitoringStaticData();

setInterval(() => {
    if (!monitoringLive) return;
    updateMonitoringMetrics();
    refreshThroughputChart();
    addMonitoringActivity();
}, 4500);
