const TokenSaverData = {
    agents: [
        {
            name: 'Support Agent',
            type: 'Customer Support',
            project: 'Customer Support Platform',
            status: 'success',
            health: 'Healthy',
            requests24h: 5432,
            cost24h: 15.18,
            avgLatencyMs: 724
        },
        {
            name: 'Content Agent',
            type: 'Content Generation',
            project: 'Marketing Site',
            status: 'warning',
            health: 'Watch',
            requests24h: 3124,
            cost24h: 12.06,
            avgLatencyMs: 1160
        },
        {
            name: 'Research Agent',
            type: 'Research & Analysis',
            project: 'Sales Intelligence',
            status: 'warning',
            health: 'Slow',
            requests24h: 2486,
            cost24h: 10.94,
            avgLatencyMs: 1800
        },
        {
            name: 'Data Processor',
            type: 'Data Processing',
            project: 'Analytics Pipeline',
            status: 'success',
            health: 'Active',
            requests24h: 2968,
            cost24h: 6.84,
            avgLatencyMs: 690
        }
    ],
    projects: [
        {
            name: 'Customer Support Platform',
            status: 'success',
            agents: ['Support Agent'],
            cost24h: 15.18
        },
        {
            name: 'Marketing Site',
            status: 'warning',
            agents: ['Content Agent'],
            cost24h: 12.06
        },
        {
            name: 'Sales Intelligence',
            status: 'warning',
            agents: ['Research Agent'],
            cost24h: 10.94
        },
        {
            name: 'Analytics Pipeline',
            status: 'success',
            agents: ['Data Processor'],
            cost24h: 6.84
        }
    ],
    metrics: {
        overview: {
            totalTokens: 2840000,
            estimatedCost: 45.02,
            requests: 14010,
            tokensSaved: 412000
        },
        monitoring: {
            liveRequests: 186,
            tokensPerMinute: 42800,
            avgLatencyMs: 812,
            errorRate: 0.7,
            tokensSavedLive: 8400,
            avoidedCostLive: 0.18
        }
    },
    activity: [
        {
            time: '14:32:18',
            agent: 'Support Agent',
            project: 'Customer Support Platform',
            model: 'gpt-4',
            request: 'Ticket summary and reply draft',
            tokens: 1248,
            cost: 0.024,
            latency: '820ms',
            status: 'success'
        },
        {
            time: '14:31:54',
            agent: 'Content Agent',
            project: 'Marketing Site',
            model: 'gpt-4',
            request: 'Long-form blog outline generation',
            tokens: 3910,
            cost: 0.081,
            latency: '2.4s',
            status: 'warning'
        },
        {
            time: '14:31:22',
            agent: 'Research Agent',
            project: 'Sales Intelligence',
            model: 'gpt-4',
            request: 'Competitor pricing analysis',
            tokens: 2604,
            cost: 0.052,
            latency: '1.8s',
            status: 'success'
        },
        {
            time: '14:30:49',
            agent: 'Data Processor',
            project: 'Analytics Pipeline',
            model: 'gpt-3.5',
            request: 'Batch enrichment retry timeout',
            tokens: 918,
            cost: 0.006,
            latency: '5.1s',
            status: 'critical'
        },
        {
            time: '14:30:21',
            agent: 'Support Agent',
            project: 'Customer Support Platform',
            model: 'gpt-3.5',
            request: 'Repeated FAQ response from cache',
            tokens: 436,
            cost: 0.003,
            latency: '310ms',
            status: 'success'
        },
        {
            time: '14:29:48',
            agent: 'Content Agent',
            project: 'Marketing Site',
            model: 'gpt-4',
            request: 'Landing page copy variations',
            tokens: 3214,
            cost: 0.067,
            latency: '2.1s',
            status: 'warning'
        }
    ],
    events: [
        {
            title: 'Content Agent is approaching its hourly cost threshold',
            meta: 'Detected 3 minutes ago - suggested action: enable prompt compression',
            status: 'warning',
            label: 'Cost'
        },
        {
            title: 'Cache hit saved 1,240 tokens on Support Agent',
            meta: 'Detected 7 minutes ago - repeated customer support query',
            status: 'success',
            label: 'Saved'
        },
        {
            title: 'Research Agent latency increased above baseline',
            meta: 'Detected 12 minutes ago - model response time trending upward',
            status: 'warning',
            label: 'Latency'
        }
    ]
};

window.TokenSaverData = TokenSaverData;
