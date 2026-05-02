import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "../hooks/useToast";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "../styles/EnvironmentManagement.css";

// ============================================================
// PROVIDER FIELD DEFINITIONS
// ============================================================

type Provider = {
    id: number;
    name: string;
    fields: Record<string, string>;
};

const SMS_PROVIDER_FIELDS: Record<string, { name: string; label: string; type: string; required?: boolean; icon?: string }[]> = {
    MSG91: [
        { name: "apiKey", label: "API Key", type: "password", required: true, icon: "🔑" },
        { name: "endpoint", label: "Endpoint URL", type: "text", required: false, icon: "🌐" },
        { name: "senderId", label: "Sender ID", type: "text", required: true, icon: "📱" },
        { name: "templateId", label: "Template ID (DLT)", type: "text", required: true, icon: "📝" },
    ],
    Twilio: [
        { name: "accountSid", label: "Account SID", type: "text", required: true, icon: "🆔" },
        { name: "authToken", label: "Auth Token", type: "password", required: true, icon: "🔒" },
        { name: "phoneNumber", label: "Phone Number", type: "text", required: true, icon: "📞" },
        { name: "endpoint", label: "API Endpoint", type: "text", required: false, icon: "🌐" },
    ],
    Gupshup: [
        { name: "apiKey", label: "API Key", type: "password", required: true, icon: "🔑" },
        { name: "endpoint", label: "Endpoint URL", type: "text", required: false, icon: "🌐" },
        { name: "senderId", label: "Sender ID", type: "text", required: true, icon: "📱" },
    ],
    Vonage: [
        { name: "apiKey", label: "API Key", type: "password", required: true, icon: "🔑" },
        { name: "apiSecret", label: "API Secret", type: "password", required: true, icon: "🔒" },
        { name: "senderId", label: "Sender ID (optional)", type: "text", required: false, icon: "📱" },
        { name: "endpoint", label: "API Endpoint", type: "text", required: false, icon: "🌐" },
    ],
    Kaleyra: [
        { name: "apiKey", label: "API Key", type: "password", required: true, icon: "🔑" },
        { name: "endpoint", label: "Endpoint URL", type: "text", required: false, icon: "🌐" },
        { name: "senderId", label: "Sender ID", type: "text", required: true, icon: "📱" },
    ],
    Textlocal: [
        { name: "apiKey", label: "API Key", type: "password", required: true, icon: "🔑" },
        { name: "endpoint", label: "API Endpoint", type: "text", required: false, icon: "🌐" },
        { name: "senderId", label: "Sender ID (optional)", type: "text", required: false, icon: "📱" },
    ],
    TrueDialog: [
        { name: "apiKey", label: "API Key", type: "password", required: true, icon: "🔑" },
        { name: "apiSecret", label: "API Secret / Token", type: "password", required: true, icon: "🔒" },
        { name: "phoneNumber", label: "Phone Number", type: "text", required: true, icon: "📞" },
        { name: "endpoint", label: "API Endpoint", type: "text", required: false, icon: "🌐" },
    ],
};

const EMAIL_PROVIDER_FIELDS: Record<string, { name: string; label: string; type: string; required?: boolean; icon?: string }[]> = {
    SendGrid: [
        { name: "apiKey", label: "API Key", type: "password", required: true, icon: "🔑" },
        { name: "endpoint", label: "API Endpoint", type: "text", required: false, icon: "🌐" },
        { name: "fromEmail", label: "From Email", type: "email", required: true, icon: "✉️" },
        { name: "fromName", label: "From Name", type: "text", required: false, icon: "👤" },
    ],
    AWS_SES: [
        { name: "accessKeyId", label: "Access Key ID", type: "text", required: true, icon: "🆔" },
        { name: "secretAccessKey", label: "Secret Access Key", type: "password", required: true, icon: "🔒" },
        { name: "region", label: "Region", type: "text", required: true, icon: "🌍" },
        { name: "fromEmail", label: "From Email", type: "email", required: true, icon: "✉️" },
    ],
    Mailgun: [
        { name: "apiKey", label: "API Key", type: "password", required: true, icon: "🔑" },
        { name: "domain", label: "Domain", type: "text", required: true, icon: "🌐" },
        { name: "endpoint", label: "API Endpoint", type: "text", required: false, icon: "🌍" },
        { name: "fromEmail", label: "From Email", type: "email", required: true, icon: "✉️" },
    ],
    SMTP: [
        { name: "host", label: "SMTP Host", type: "text", required: true, icon: "🖥️" },
        { name: "port", label: "Port", type: "number", required: true, icon: "🔌" },
        { name: "username", label: "Username", type: "text", required: true, icon: "👤" },
        { name: "password", label: "Password", type: "password", required: true, icon: "🔒" },
        { name: "fromEmail", label: "From Email", type: "email", required: true, icon: "✉️" },
    ],
    Postmark: [
        { name: "serverToken", label: "Server Token", type: "password", required: true, icon: "🔑" },
        { name: "endpoint", label: "API Endpoint", type: "text", required: false, icon: "🌐" },
        { name: "fromEmail", label: "From Email", type: "email", required: true, icon: "✉️" },
    ],
};

const WHATSAPP_PROVIDER_FIELDS: Record<string, { name: string; label: string; type: string; required?: boolean; icon?: string }[]> = {
    Twilio: [
        { name: "accountSid", label: "Account SID", type: "text", required: true, icon: "🆔" },
        { name: "authToken", label: "Auth Token", type: "password", required: true, icon: "🔒" },
        { name: "phoneNumber", label: "WhatsApp Number", type: "text", required: true, icon: "💬" },
    ],
    Gupshup: [
        { name: "apiKey", label: "API Key", type: "password", required: true, icon: "🔑" },
        { name: "senderId", label: "Sender ID", type: "text", required: true, icon: "📱" },
        { name: "appName", label: "App Name", type: "text", required: false, icon: "📱" },
    ],
    Meta_Cloud: [
        { name: "phoneNumberId", label: "Phone Number ID", type: "text", required: true, icon: "🆔" },
        { name: "accessToken", label: "Access Token", type: "password", required: true, icon: "🔑" },
        { name: "businessAccountId", label: "Business Account ID", type: "text", required: true, icon: "🏢" },
        { name: "endpoint", label: "API Endpoint", type: "text", required: false, icon: "🌐" },
    ],
    Kaleyra: [
        { name: "apiKey", label: "API Key", type: "password", required: true, icon: "🔑" },
        { name: "senderId", label: "Sender ID", type: "text", required: true, icon: "📱" },
    ],
    Vonage: [
        { name: "apiKey", label: "API Key", type: "password", required: true, icon: "🔑" },
        { name: "apiSecret", label: "API Secret", type: "password", required: true, icon: "🔒" },
        { name: "senderId", label: "Sender ID", type: "text", required: true, icon: "📱" },
    ],
};

// ============================================================
// SERVICE CONFIGURATION
// ============================================================

const SERVICE_CONFIG = {
    SMS: {
        icon: "💬",
        color: "#00c896",
        providers: ["MSG91", "Twilio", "Gupshup", "Vonage", "Kaleyra", "Textlocal", "TrueDialog"],
        providerFields: SMS_PROVIDER_FIELDS,
        configKey: "sms_config"
    },
    EMAIL: {
        icon: "✉️",
        color: "#4f8ef7",
        providers: ["SendGrid", "AWS_SES", "Mailgun", "SMTP", "Postmark"],
        providerFields: EMAIL_PROVIDER_FIELDS,
        configKey: "email_config"
    },
    WHATSAPP: {
        icon: "💬",
        color: "#25D366",
        providers: ["Twilio", "Gupshup", "Meta_Cloud", "Kaleyra", "Vonage"],
        providerFields: WHATSAPP_PROVIDER_FIELDS,
        configKey: "whatsapp_config"
    },
};

// ============================================================
// ENVIRONMENT LIST COMPONENT
// ============================================================

function EnvironmentList({ onSelectEnvironment, project }: { onSelectEnvironment: (envName: string) => void; project: any }) {
    const [environments, setEnvironments] = useState<string[]>(["Local", "Staging", "Dev", "Live"]);
    const [newEnvName, setNewEnvName] = useState("");
    const [showAddInput, setShowAddInput] = useState(false);
    const [providerCounts, setProviderCounts] = useState<Record<string, { count: number; providers: string[] }>>({});

    useEffect(() => {
        const counts: Record<string, { count: number; providers: string[] }> = {};

        environments.forEach(env => {
            const providersList: string[] = [];
            Object.values(SERVICE_CONFIG).forEach(service => {
                const config = project[service.configKey] || {};
                Object.entries(config).forEach(([provider, providerData]: [string, any]) => {
                    const envs = providerData.environments || [];
                    if (envs.some((e: any) => e.name === env)) {
                        providersList.push(provider);
                    }
                });
            });
            counts[env] = {
                count: providersList.length,
                providers: providersList.slice(0, 3)
            };
        });

        setProviderCounts(counts);
    }, [environments, project]);

    const addEnvironment = () => {
        if (newEnvName && !environments.includes(newEnvName)) {
            setEnvironments([...environments, newEnvName]);
            setNewEnvName("");
            setShowAddInput(false);
        }
    };

    return (
        <div className="env-list-container">
            <div className="env-list-header">
                <h2>🌍 Environments</h2>
                <p className="env-list-subtitle">Select an environment to manage its service providers</p>
            </div>

            <div className="env-grid">
                {environments.map((env) => {
                    const providerInfo = providerCounts[env] || { count: 0, providers: [] };
                    return (
                        <div key={env} className="env-card" onClick={() => onSelectEnvironment(env)}>
                            <div className="env-card-content">
                                <div className="env-card-icon">📁</div>
                                <div className="env-card-info">
                                    <div className="env-card-name">{env}</div>
                                    <div className="env-provider-count">
                                        📦 <span>{providerInfo.count}</span> provider(s) configured
                                    </div>
                                    {providerInfo.providers.length > 0 && (
                                        <div className="env-card-providers">
                                            {providerInfo.providers.map(p => (
                                                <span key={p} className="env-provider-badge sms">{p}</span>
                                            ))}
                                            {providerInfo.count > 3 && (
                                                <span className="env-provider-badge">+{providerInfo.count - 3} more</span>
                                            )}
                                        </div>
                                    )}
                                    <div className="env-card-action">
                                        Click to configure <span>→</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {showAddInput ? (
                    <div className="env-card add-env-card">
                        <div className="add-env-form">
                            <input
                                type="text"
                                placeholder="Enter environment name"
                                value={newEnvName}
                                onChange={(e) => setNewEnvName(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && addEnvironment()}
                                autoFocus
                            />
                            <div className="add-env-form-buttons">
                                <button onClick={addEnvironment}>Add</button>
                                <button onClick={() => setShowAddInput(false)}>Cancel</button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="env-card add-env-card" onClick={() => setShowAddInput(true)}>
                        <div className="env-card-content">
                            <div className="env-card-icon">➕</div>
                            <div className="env-card-info">
                                <div className="env-card-name">Add Environment</div>
                                <div className="env-card-action">Create new environment →</div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// ============================================================
// PROVIDER CONFIGURATION COMPONENT
// ============================================================

function ProviderConfig({ project, environmentName, onBack }: { project: any; environmentName: string; onBack: () => void }) {
    const { showToast, ToastContainer } = useToast();
    const [activeService, setActiveService] = useState<string>("SMS");
    const [showAddProviderModal, setShowAddProviderModal] = useState(false);
    const [selectedProvider, setSelectedProvider] = useState("");
    const [providerFields, setProviderFields] = useState<Record<string, string>>({});
    const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
    const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});
    const [saving, setSaving] = useState(false);
    const [isSavingToBackend, setIsSavingToBackend] = useState(false);
    const [providers, setProviders] = useState<Provider[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const currentService = SERVICE_CONFIG[activeService as keyof typeof SERVICE_CONFIG];

    // Load data from localStorage OR backend when service changes
    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);

            const savedData = localStorage.getItem(`env_${environmentName}_all_providers`);
            if (savedData) {
                const parsed = JSON.parse(savedData);
                const oneHourAgo = Date.now() - 60 * 60 * 1000;
                const currentServiceData = parsed[activeService];

                if (currentServiceData && currentServiceData.timestamp > oneHourAgo && currentServiceData.providers) {
                    setProviders(currentServiceData.providers);
                    setIsLoading(false);
                    return;
                }
            }

            const existingConfig = project[currentService.configKey] || {};
            const loadedProviders: any[] = [];

            for (const [provider, providerData] of Object.entries(existingConfig)) {
                const envs = (providerData as any).environments || [];
                const env = envs.find((e: any) => e.name === environmentName);
                if (env) {
                    loadedProviders.push({
                        id: env.id || Date.now(),
                        name: provider,
                        fields: (env.fields || {}) as Record<string, string>,
                    });
                }
            }

            setProviders(loadedProviders);
            setIsLoading(false);
        };

        loadData();
    }, [environmentName, activeService, project, currentService.configKey]);

    // Auto-save to localStorage whenever providers change
    useEffect(() => {
        if (!isLoading) {
            const savedData = localStorage.getItem(`env_${environmentName}_all_providers`);
            let allData = savedData ? JSON.parse(savedData) : {};

            allData = {
                ...allData,
                [activeService]: {
                    providers: providers,
                    timestamp: Date.now()
                }
            };

            localStorage.setItem(`env_${environmentName}_all_providers`, JSON.stringify(allData));
        }
    }, [providers, activeService, isLoading, environmentName]);

    const handleProviderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const provider = e.target.value;
        setSelectedProvider(provider);
        const fieldsDef = currentService.providerFields[provider] || [];
        const newFields: Record<string, string> = {};
        fieldsDef.forEach((field: any) => { newFields[field.name] = ""; });
        setProviderFields(newFields);
        setShowPasswords({});
    };

    const handleFieldChange = (fieldName: string, value: string) => {
        setProviderFields(prev => ({ ...prev, [fieldName]: value }));
    };

    const togglePasswordVisibility = (fieldName: string) => {
        setShowPasswords(prev => ({ ...prev, [fieldName]: !prev[fieldName] }));
    };

    const saveProvider = async () => {
        if (!selectedProvider) {
            showToast("Please select a provider", "error");
            return;
        }

        const fieldsDef = currentService.providerFields[selectedProvider];
        for (const field of fieldsDef) {
            if (field.required && !providerFields[field.name]) {
                showToast(`${field.label} is required`, "error");
                return;
            }
        }

        setSaving(true);
        await new Promise(resolve => setTimeout(resolve, 500));

        const newProvider: Provider = {
            id: Date.now(),
            name: selectedProvider,
            fields: { ...providerFields },
        };

        const newProviders = [newProvider, ...providers];
        setProviders(newProviders);
        setShowAddProviderModal(false);
        setSelectedProvider("");
        setProviderFields({});
        setSaving(false);
        showToast(`${selectedProvider} added successfully!`, "success");
    };

    const deleteProvider = (providerId: number, providerName: string) => {
        if (window.confirm(`Are you sure you want to delete ${providerName}?`)) {
            const newProviders = providers.filter(p => p.id !== providerId);
            setProviders(newProviders);
            showToast(`${providerName} deleted`, "success");
        }
    };

    const handleFinalSave = async () => {
        const serviceConfigMap: Record<string, { environments: any[] }> = {};

        for (const provider of providers) {
            if (!serviceConfigMap[provider.name]) {
                serviceConfigMap[provider.name] = { environments: [] };
            }
            serviceConfigMap[provider.name].environments.push({
                id: provider.id,
                name: environmentName,
                fields: provider.fields,
            });
        }

        const payload = { ...project, [currentService.configKey]: serviceConfigMap };
        console.log("Saving configuration:", payload);

        setIsSavingToBackend(true);
        await new Promise(resolve => setTimeout(resolve, 500));

        showToast(`Configuration saved for ${environmentName}!`, "success");
        setIsSavingToBackend(false);
    };

    if (isLoading) return <div className="loading">Loading...</div>;

    return (
        <div className="provider-config-container">
            <ToastContainer />

            <div className="config-header">
                <button className="back-btn" onClick={onBack}>
                    ← Back to Environments
                </button>
                <div className="config-title">
                    <h2>🌍 {environmentName}</h2>
                    <p>Configure providers for this environment</p>
                </div>
            </div>

            <div className="config-content">
                <div className="services-sidebar">
                    {Object.entries(SERVICE_CONFIG).map(([key, config]) => (
                        <div
                            key={key}
                            className={`service-item ${activeService === key ? 'active' : ''}`}
                            onClick={() => setActiveService(key)}
                            style={{
                                borderLeftColor: activeService === key ? config.color : 'transparent',
                                backgroundColor: activeService === key ? `${config.color}10` : 'transparent'
                            }}
                        >
                            <span className="service-icon">{config.icon}</span>
                            <div className="service-info">
                                <div className="service-name">{key}</div>
                                <div className="service-stats">
                                    {providers.length} provider(s)
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="providers-panel">
                    <div className="panel-header">
                        <div className="panel-title">
                            <span className="panel-icon">{currentService.icon}</span>
                            <h3>{activeService} Providers</h3>
                        </div>
                        <button
                            className="add-provider-btn-main"
                            onClick={() => setShowAddProviderModal(true)}
                            style={{ backgroundColor: currentService.color }}
                        >
                            + Add Provider
                        </button>
                    </div>

                    <div className="providers-list">
                        {providers.length === 0 ? (
                            <div className="empty-providers">
                                <span className="empty-icon">📭</span>
                                <p>No {activeService} providers configured yet</p>
                                <button
                                    className="empty-add-btn"
                                    onClick={() => setShowAddProviderModal(true)}
                                    style={{ borderColor: currentService.color, color: currentService.color }}
                                >
                                    + Add your first provider
                                </button>
                            </div>
                        ) : (
                            providers.map((provider) => (
                                <div key={provider.id} className="provider-view-card" style={{ borderTopColor: currentService.color }}>
                                    <div className="provider-view-header">
                                        <div className="provider-view-title">
                                            <span className="provider-view-icon">🔌</span>
                                            <span className="provider-view-name">{provider.name}</span>
                                            <span className="saved-badge" style={{ background: `${currentService.color}20`, color: currentService.color }}>
                                                ✓ Configured
                                            </span>
                                        </div>
                                        <button
                                            className="delete-provider-btn"
                                            onClick={() => deleteProvider(provider.id, provider.name)}
                                        >
                                            🗑️ Remove
                                        </button>
                                    </div>
                                    <div className="provider-view-body">
                                        <div className="credentials-view">
                                            <div className="section-title">📋 Credentials</div>
                                            {Object.entries(provider.fields).map(([key, value]) => {
                                                const val = value as string;
                                                const fieldConfig = currentService.providerFields[provider.name]?.find((f: any) => f.name === key);
                                                const isPassword = fieldConfig?.type === "password" || key.includes("Key") || key.includes("Token") || key.includes("Secret");
                                                const passwordKey = `${provider.id}_${key}`;

                                                return (
                                                    <div className="credential-row" key={key}>
                                                        <span className="credential-label">
                                                            {fieldConfig?.icon || "📝"} {fieldConfig?.label || key}:
                                                        </span>
                                                        <div className="credential-value">
                                                            <span>
                                                                {isPassword
                                                                    ? (visiblePasswords[passwordKey] ? (val || "—") : "••••••••")
                                                                    : (val || "—")}
                                                            </span>
                                                            {isPassword && value && (
                                                                <button
                                                                    className="eye-btn-small"
                                                                    onClick={() => {
                                                                        setVisiblePasswords((prev: Record<string, boolean>) => ({
                                                                            ...prev,
                                                                            [passwordKey]: !prev[passwordKey]
                                                                        }));
                                                                    }}
                                                                >
                                                                    {visiblePasswords[passwordKey] ? <FaEyeSlash /> : <FaEye />}
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="panel-actions">
                        <button className="btn-cancel" onClick={onBack}>
                            Cancel
                        </button>
                        <button
                            className="btn-submit"
                            onClick={handleFinalSave}
                            disabled={isSavingToBackend}
                            style={{ background: `linear-gradient(135deg, ${currentService.color}, #2563eb)` }}
                        >
                            {isSavingToBackend ? "Saving..." : "Save Configuration"}
                        </button>
                    </div>
                </div>
            </div>

            {showAddProviderModal && (
                <div className="modal-overlay" onClick={() => setShowAddProviderModal(false)}>
                    <div className="modal-container provider-modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Add {activeService} Provider</h3>
                            <button className="close-btn" onClick={() => setShowAddProviderModal(false)}>×</button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label>Select Provider *</label>
                                <select
                                    value={selectedProvider}
                                    onChange={handleProviderChange}
                                    className="provider-select"
                                >
                                    <option value="">-- Choose a provider --</option>
                                    {currentService.providers.map(p => (
                                        <option key={p} value={p}>{p}</option>
                                    ))}
                                </select>
                            </div>

                            {selectedProvider && currentService.providerFields[selectedProvider] && (
                                <div className="credentials-section">
                                    <div className="section-title">🔐 Credentials</div>
                                    {currentService.providerFields[selectedProvider].map((field: any) => (
                                        <div className="form-group" key={field.name}>
                                            <label>{field.label}{field.required && " *"}</label>
                                            <div className="input-with-icon">
                                                <input
                                                    type={field.type === "password" && !showPasswords[field.name] ? "password" : "text"}
                                                    value={providerFields[field.name] || ""}
                                                    onChange={(e) => handleFieldChange(field.name, e.target.value)}
                                                    placeholder={`Enter ${field.label}`}
                                                    required={field.required}
                                                />
                                                {field.type === "password" && (
                                                    <button
                                                        type="button"
                                                        className="eye-btn"
                                                        onClick={() => togglePasswordVisibility(field.name)}
                                                    >
                                                        {showPasswords[field.name] ? <FaEyeSlash /> : <FaEye />}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="modal-actions">
                            <button className="btn-cancel" onClick={() => setShowAddProviderModal(false)}>Cancel</button>
                            <button
                                className="btn-create"
                                onClick={saveProvider}
                                disabled={saving}
                                style={{ backgroundColor: currentService.color }}
                            >
                                {saving ? "Adding..." : "Add Provider"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function EnvironmentManagement() {
    const navigate = useNavigate();
    const location = useLocation();
    const { project } = location.state || {};
    const [selectedEnvironment, setSelectedEnvironment] = useState<string | null>(null);

    if (!project) {
        setTimeout(() => navigate("/dashboard/project"), 2000);
        return (
            <div className="loading">
                <p>No project data found. Redirecting...</p>
            </div>
        );
    }

    if (selectedEnvironment) {
        return (
            <ProviderConfig
                project={project}
                environmentName={selectedEnvironment}
                onBack={() => setSelectedEnvironment(null)}
            />
        );
    }

    return <EnvironmentList onSelectEnvironment={setSelectedEnvironment} project={project} />;
}