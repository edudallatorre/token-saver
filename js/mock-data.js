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
            tokens24h: 865000,
            tokensSaved24h: 128000,
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
            tokens24h: 740000,
            tokensSaved24h: 84000,
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
            tokens24h: 690000,
            tokensSaved24h: 56000,
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
            tokens24h: 545000,
            tokensSaved24h: 144000,
            avgLatencyMs: 690
        }
    ],
    projects: [
        {
            name: 'Customer Support Platform',
            status: 'success',
            agents: ['Support Agent'],
            owner: 'Support Ops',
            requests24h: 5432,
            tokens24h: 865000,
            tokensSaved24h: 128000,
            cost24h: 15.18,
            budget24h: 25,
            forecastMonth: 455.40
        },
        {
            name: 'Marketing Site',
            status: 'warning',
            agents: ['Content Agent'],
            owner: 'Growth',
            requests24h: 3124,
            tokens24h: 740000,
            tokensSaved24h: 84000,
            cost24h: 12.06,
            budget24h: 14,
            forecastMonth: 361.80
        },
        {
            name: 'Sales Intelligence',
            status: 'warning',
            agents: ['Research Agent'],
            owner: 'Revenue',
            requests24h: 2486,
            tokens24h: 690000,
            tokensSaved24h: 56000,
            cost24h: 10.94,
            budget24h: 12,
            forecastMonth: 328.20
        },
        {
            name: 'Analytics Pipeline',
            status: 'success',
            agents: ['Data Processor'],
            owner: 'Data',
            requests24h: 2968,
            tokens24h: 545000,
            tokensSaved24h: 144000,
            cost24h: 6.84,
            budget24h: 15,
            forecastMonth: 205.20
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
    ],
    hotspots: [
        {
            title: 'Long-form content prompts are expanding context too aggressively',
            agent: 'Content Agent',
            project: 'Marketing Site',
            model: 'gpt-4',
            reason: 'High prompt-token ratio',
            tokens24h: 308000,
            requests24h: 642,
            avgTokensPerRequest: 480,
            cost24h: 5.34,
            trend: 18.4,
            severity: 'warning',
            recommendation: 'Enable prompt compression before generation requests.',
            potentialSavingCost: 1.52,
            potentialSavingTokens: 87000
        },
        {
            title: 'Research workflows keep full competitor history in every request',
            agent: 'Research Agent',
            project: 'Sales Intelligence',
            model: 'gpt-4',
            reason: 'Repeated context window',
            tokens24h: 276000,
            requests24h: 384,
            avgTokensPerRequest: 719,
            cost24h: 4.88,
            trend: 14.2,
            severity: 'warning',
            recommendation: 'Trim conversation history and cache competitor summaries.',
            potentialSavingCost: 1.34,
            potentialSavingTokens: 76000
        },
        {
            title: 'Support FAQ responses bypass cache during peak traffic',
            agent: 'Support Agent',
            project: 'Customer Support Platform',
            model: 'gpt-4',
            reason: 'Cache miss cluster',
            tokens24h: 214000,
            requests24h: 1210,
            avgTokensPerRequest: 177,
            cost24h: 3.96,
            trend: 9.8,
            severity: 'critical',
            recommendation: 'Enable semantic cache for repeated ticket intents.',
            potentialSavingCost: 1.86,
            potentialSavingTokens: 102000
        },
        {
            title: 'Batch enrichment retries are generating duplicate work',
            agent: 'Data Processor',
            project: 'Analytics Pipeline',
            model: 'gpt-3.5',
            reason: 'Retry loop',
            tokens24h: 132000,
            requests24h: 286,
            avgTokensPerRequest: 462,
            cost24h: 1.18,
            trend: 6.3,
            severity: 'success',
            recommendation: 'Deduplicate batch payloads before retrying failed jobs.',
            potentialSavingCost: 0.44,
            potentialSavingTokens: 39000
        }
    ],
    optimisations: [
        {
            title: 'Enable semantic cache for repeated support tickets',
            project: 'Customer Support Platform',
            agent: 'Support Agent',
            category: 'Caching',
            status: 'recommended',
            risk: 'low',
            effort: 'Quick',
            savingTokens: 102000,
            savingCost: 1.86,
            qualityImpact: 'No visible impact for repeated FAQ answers.'
        },
        {
            title: 'Compress marketing generation prompts before model calls',
            project: 'Marketing Site',
            agent: 'Content Agent',
            category: 'Prompt compression',
            status: 'recommended',
            risk: 'medium',
            effort: 'Review',
            savingTokens: 87000,
            savingCost: 1.52,
            qualityImpact: 'Review brand tone constraints before applying.'
        },
        {
            title: 'Trim research history to latest structured summary',
            project: 'Sales Intelligence',
            agent: 'Research Agent',
            category: 'Context trimming',
            status: 'recommended',
            risk: 'medium',
            effort: 'Code change',
            savingTokens: 76000,
            savingCost: 1.34,
            qualityImpact: 'May reduce long-tail source recall without summaries.'
        },
        {
            title: 'Route enrichment retries to the cheaper model profile',
            project: 'Analytics Pipeline',
            agent: 'Data Processor',
            category: 'Model routing',
            status: 'applied',
            risk: 'low',
            effort: 'Quick',
            savingTokens: 39000,
            savingCost: 0.44,
            qualityImpact: 'Applied to retries only; primary enrichment remains unchanged.'
        }
    ]
};

window.TokenSaverData = TokenSaverData;
