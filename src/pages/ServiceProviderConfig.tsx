import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "../hooks/useToast";
import { FaEye, FaEyeSlash } from "react-icons/fa";

// ============================================================
// PROVIDER FIELD DEFINITIONS FOR EACH SERVICE
// ============================================================

// SMS Providers
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

// Email Providers
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

// WhatsApp Providers
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

const SERVICE_TABS = [
    { id: "SMS", label: "SMS", icon: "💬", color: "#00c896", providers: ["MSG91", "Twilio", "Gupshup", "Vonage", "Kaleyra", "Textlocal", "TrueDialog"], providerFields: SMS_PROVIDER_FIELDS, configKey: "sms_config" },
    { id: "EMAIL", label: "Email", icon: "✉️", color: "#4f8ef7", providers: ["SendGrid", "AWS_SES", "Mailgun", "SMTP", "Postmark"], providerFields: EMAIL_PROVIDER_FIELDS, configKey: "email_config" },
    { id: "WHATSAPP", label: "WhatsApp", icon: "💬", color: "#25D366", providers: ["Twilio", "Gupshup", "Meta_Cloud", "Kaleyra", "Vonage"], providerFields: WHATSAPP_PROVIDER_FIELDS, configKey: "whatsapp_config" },
];

const DEFAULT_ENVIRONMENTS = ["Select Environment", "Local", "Staging", "Dev", "Live"];

interface ProviderConfig {
    id: number;
    provider: string;
    fields: Record<string, string>;
    isEditing: boolean;
    showPasswords: Record<string, boolean>;
    showViewPasswords: Record<string, boolean>;
    isSaved: boolean;
}

interface EnvironmentConfig {
    id: number;
    name: string;
    isCustom: boolean;
    providers: ProviderConfig[];
}

export default function ServiceProviderConfig() {
    const navigate = useNavigate();
    const location = useLocation();
    const { showToast, ToastContainer } = useToast();
    const { project } = location.state || {};

    const [activeTab, setActiveTab] = useState<string>("SMS");
    const [environments, setEnvironments] = useState<EnvironmentConfig[]>([]);
    const [selectedEnvId, setSelectedEnvId] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [savingProviderId, setSavingProviderId] = useState<number | null>(null);
    const [showDeleteProviderModal, setShowDeleteProviderModal] = useState<{ envId: number; providerId: number; providerName: string } | null>(null);
    const [showDeleteEnvModal, setShowDeleteEnvModal] = useState<{ envId: number; envName: string; hasProviders: boolean } | null>(null);
    const [showUnsavedChangesModal, setShowUnsavedChangesModal] = useState<{ targetTab: string } | null>(null);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    const currentService = SERVICE_TABS.find(tab => tab.id === activeTab)!;
    const providerFields = currentService.providerFields;
    const availableProviders = currentService.providers;
    const configKey = currentService.configKey;
    const serviceColor = currentService.color;

    // ============================================================
    // LOCALSTORAGE FUNCTIONS
    // ============================================================

    const getStorageKey = () => `service_config_${project?.id}_${activeTab}`;

    const saveToLocalStorage = () => {
        // Make sure we save the current state as-is
        const dataToSave = {
            environments: environments.map(env => ({
                ...env,
                providers: env.providers.map(p => ({
                    ...p,
                    isEditing: false, // Ensure all providers are saved in view mode
                    showPasswords: {}, // Reset password visibility states
                    showViewPasswords: {} // Reset view password states
                }))
            })),
            activeTab,
            timestamp: new Date().getTime()
        };
        localStorage.setItem(getStorageKey(), JSON.stringify(dataToSave));
    };

    const loadFromLocalStorage = () => {
        const savedData = localStorage.getItem(getStorageKey());
        if (savedData) {
            const parsed = JSON.parse(savedData);
            setEnvironments(parsed.environments);
            setSelectedEnvId(parsed.environments[0]?.id || null);
            showToast("Loaded saved progress from localStorage", "success");
        } else {
            showToast("No saved data found", "error");
        }
    };

    const clearLocalStorage = () => {
        localStorage.removeItem(getStorageKey());
        showToast("Cleared saved progress", "success");
    };

    // Auto-save to localStorage every 10 seconds
    useEffect(() => {
        if (!isLoading && environments.length > 0 && project) {
            const timer = setTimeout(() => {
                saveToLocalStorage();
            }, 10000);
            return () => clearTimeout(timer);
        }
    }, [environments, activeTab, isLoading, project]);


    // Check for unsaved changes
    // Check for unsaved changes
    useEffect(() => {
        const unsaved = environments.some(env =>
            env.providers.some(p => p.isEditing || !p.isSaved)
        );
        setHasUnsavedChanges(unsaved);
    }, [environments]);

    useEffect(() => {
        if (!project) {
            showToast("Invalid request. Redirecting...", "error");
            setTimeout(() => navigate("/dashboard/project"), 1500);
            return;
        }

        // First, try to load from localStorage
        const savedData = localStorage.getItem(getStorageKey());

        if (savedData) {
            const parsed = JSON.parse(savedData);
            const oneHourAgo = new Date().getTime() - 60 * 60 * 1000;

            if (parsed.timestamp > oneHourAgo && parsed.environments && parsed.environments.length > 0) {
                // Ensure all providers are in view mode (isEditing = false)
                const loadedEnvs = parsed.environments.map((env: EnvironmentConfig) => ({
                    ...env,
                    providers: env.providers.map((p: ProviderConfig) => ({
                        ...p,
                        isEditing: false, // Force view mode
                        showPasswords: {},
                        showViewPasswords: {}
                    }))
                }));
                setEnvironments(loadedEnvs);
                setSelectedEnvId(loadedEnvs[0]?.id || null);
                setIsLoading(false);
                return;
            }
        }

        // No valid saved data, load from project (backend)
        const existingConfig = project[configKey] || {};
        const loadedEnvs: EnvironmentConfig[] = [];

        for (const [provider, providerData] of Object.entries(existingConfig)) {
            const envs = (providerData as any).environments || [];
            for (const env of envs) {
                const envName = env.name;
                const isCustom = !DEFAULT_ENVIRONMENTS.includes(envName);
                let envIndex = loadedEnvs.findIndex(e => e.name === envName);

                if (envIndex === -1) {
                    loadedEnvs.push({
                        id: Date.now() + Math.random(),
                        name: envName,
                        isCustom,
                        providers: [],
                    });
                    envIndex = loadedEnvs.length - 1;
                }

                loadedEnvs[envIndex].providers.push({
                    id: env.id || Date.now() + Math.random(),
                    provider: provider,
                    fields: env.fields || {},
                    isEditing: false,
                    showPasswords: {},
                    showViewPasswords: {},
                    isSaved: true,
                });
            }
        }

        if (loadedEnvs.length === 0) {
            loadedEnvs.push({
                id: Date.now(),
                name: "Select Environment",
                isCustom: false,
                providers: [],
            });
        }

        setEnvironments(loadedEnvs);
        setSelectedEnvId(loadedEnvs[0].id);
        setIsLoading(false);
    }, [project, configKey, navigate, showToast]);

    const addEnvironment = () => {
        const newEnv = {
            id: Date.now(),
            name: "Select Environment",
            isCustom: false,
            providers: [],
        };
        setEnvironments([newEnv, ...environments]);
        setSelectedEnvId(newEnv.id);
        showToast("New environment added", "success");
    };

    const removeEnvironment = (id: number) => {
        const env = environments.find(e => e.id === id);
        if (!env) return;

        const hasProviders = env.providers.some(p => p.isSaved && p.provider);

        if (hasProviders) {
            setShowDeleteEnvModal({
                envId: id,
                envName: env.name,
                hasProviders: true
            });
            return;
        }

        if (environments.length === 1) {
            showToast("You must keep at least one environment", "error");
            return;
        }
        const newEnvironments = environments.filter(env => env.id !== id);
        setEnvironments(newEnvironments);
        if (selectedEnvId === id) {
            setSelectedEnvId(newEnvironments[0]?.id || null);
        }
        showToast(`Environment "${env.name}" deleted`, "success");
    };

    const confirmDeleteEnvironment = () => {
        if (!showDeleteEnvModal) return;

        const { envId, envName } = showDeleteEnvModal;

        if (environments.length === 1) {
            showToast("You must keep at least one environment", "error");
            setShowDeleteEnvModal(null);
            return;
        }

        const newEnvironments = environments.filter(env => env.id !== envId);
        setEnvironments(newEnvironments);
        if (selectedEnvId === envId) {
            setSelectedEnvId(newEnvironments[0]?.id || null);
        }
        showToast(`Environment "${envName}" deleted successfully`, "success");
        setShowDeleteEnvModal(null);
    };

    const updateEnvName = (id: number, newName: string) => {
        setEnvironments(environments.map(env =>
            env.id === id ? { ...env, name: newName, isCustom: !DEFAULT_ENVIRONMENTS.includes(newName) } : env
        ));
    };

    const addProvider = (envId: number) => {
        const env = environments.find(e => e.id === envId);

        if (!env || env.name === "Select Environment" || env.name === "") {
            showToast("Please select a valid environment name first", "error");
            return;
        }

        setEnvironments(environments.map(env =>
            env.id === envId
                ? {
                    ...env,
                    providers: [
                        ...env.providers,
                        {
                            id: Date.now(),
                            provider: "",
                            fields: {},
                            isEditing: true,  // ✅ New providers start in edit mode
                            showPasswords: {},
                            showViewPasswords: {},
                            isSaved: false,
                        },
                    ],
                }
                : env
        ));
        setTimeout(() => saveToLocalStorage(), 100);
    };

    const removeProvider = (envId: number, providerId: number) => {
        setEnvironments(environments.map(env =>
            env.id === envId
                ? { ...env, providers: env.providers.filter(p => p.id !== providerId) }
                : env
        ));
        showToast("Provider removed", "success");
    };

    const updateProviderSelection = (envId: number, providerId: number, selectedProvider: string) => {
        const fieldsDef = providerFields[selectedProvider] || [];
        const newFields: Record<string, string> = {};
        fieldsDef.forEach((field: any) => { newFields[field.name] = ""; });

        setEnvironments(environments.map(env =>
            env.id === envId
                ? {
                    ...env,
                    providers: env.providers.map(p =>
                        p.id === providerId
                            ? { ...p, provider: selectedProvider, fields: newFields, isEditing: true }
                            : p
                    ),
                }
                : env
        ));
    };

    const updateField = (envId: number, providerId: number, fieldName: string, value: string) => {
        setEnvironments(environments.map(env =>
            env.id === envId
                ? {
                    ...env,
                    providers: env.providers.map(p =>
                        p.id === providerId
                            ? { ...p, fields: { ...p.fields, [fieldName]: value } }
                            : p
                    ),
                }
                : env
        ));
    };

    const toggleEditMode = (envId: number, providerId: number) => {
        setEnvironments(environments.map(env =>
            env.id === envId
                ? {
                    ...env,
                    providers: env.providers.map(p =>
                        p.id === providerId
                            ? { ...p, isEditing: !p.isEditing }
                            : p
                    ),
                }
                : env
        ));
    };

    const togglePasswordVisibility = (envId: number, providerId: number, fieldName: string) => {
        setEnvironments(environments.map(env =>
            env.id === envId
                ? {
                    ...env,
                    providers: env.providers.map(p =>
                        p.id === providerId
                            ? {
                                ...p,
                                showPasswords: { ...p.showPasswords, [fieldName]: !p.showPasswords[fieldName] }
                            }
                            : p
                    ),
                }
                : env
        ));
    };

    const toggleViewPasswordVisibility = (envId: number, providerId: number, fieldName: string) => {
        setEnvironments(environments.map(env =>
            env.id === envId
                ? {
                    ...env,
                    providers: env.providers.map(p =>
                        p.id === providerId
                            ? {
                                ...p,
                                showViewPasswords: { ...p.showViewPasswords, [fieldName]: !p.showViewPasswords[fieldName] }
                            }
                            : p
                    ),
                }
                : env
        ));
    };

    const saveProvider = async (envId: number, providerId: number) => {
        const env = environments.find(e => e.id === envId);
        const provider = env?.providers.find(p => p.id === providerId);

        if (!provider) return;

        if (!provider.provider) {
            showToast("Please select a provider", "error");
            return;
        }

        const fieldsDef = providerFields[provider.provider];
        if (fieldsDef) {
            for (const field of fieldsDef) {
                if (field.required && !provider.fields[field.name]) {
                    showToast(`${provider.provider}: ${field.label} is required`, "error");
                    return;
                }
            }
        }

        setSavingProviderId(providerId);
        await new Promise(resolve => setTimeout(resolve, 500));

        setEnvironments(environments.map(envItem =>
            envItem.id === envId
                ? {
                    ...envItem,
                    providers: envItem.providers.map(p =>
                        p.id === providerId
                            ? {
                                ...p,
                                isEditing: false,  // ✅ Always false after save
                                isSaved: true,
                                showPasswords: {},
                                showViewPasswords: {}
                            }
                            : p
                    ),
                }
                : envItem
        ));

        setSavingProviderId(null);
        showToast(`${provider.provider} configuration saved!`, "success");

        // Save to localStorage
        setTimeout(() => saveToLocalStorage(), 100);
    };

    const confirmDeleteProvider = () => {
        if (showDeleteProviderModal) {
            removeProvider(showDeleteProviderModal.envId, showDeleteProviderModal.providerId);
            setShowDeleteProviderModal(null);
        }
    };

    const handleFinalSave = async () => {
        const serviceConfigMap: Record<string, { environments: any[] }> = {};
        for (const env of environments) {
            for (const provider of env.providers) {
                if (!provider.provider || !provider.isSaved) continue;
                if (!serviceConfigMap[provider.provider]) {
                    serviceConfigMap[provider.provider] = { environments: [] };
                }
                serviceConfigMap[provider.provider].environments.push({
                    id: provider.id,
                    name: env.name,
                    fields: provider.fields,
                });
            }
        }

        const payload = { ...project, [configKey]: serviceConfigMap };
        console.log("Final save:", payload);

        // ✅ Save to localStorage first
        saveToLocalStorage();

        showToast(`${currentService.label} configuration saved to localStorage!`, "success");

        // Later when backend is ready, uncomment this:
        // setTimeout(() => navigate("/dashboard/project"), 1500);
    };

    const getAvailableProviders = (envId: number) => {
        const env = environments.find(e => e.id === envId);
        if (!env) return availableProviders;

        const usedProviders = env.providers.filter(p => p.isSaved && p.provider)
            .map(p => p.provider);

        return availableProviders.filter(p => !usedProviders.includes(p));
    };

    const switchTab = (targetTab: string) => {
        setActiveTab(targetTab);
        setShowUnsavedChangesModal(null);
        setIsLoading(true);
        setTimeout(() => setIsLoading(false), 100);
    };

    const selectedEnv = environments.find(env => env.id === selectedEnvId);

    if (isLoading) return <div className="loading">Loading...</div>;
    if (!project) return <div className="loading">Invalid project</div>;

    return (
        <div className="config-container">
            <ToastContainer />

            {/* <div className="config-header">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h2>Configure Services for <span className="project-name-highlight">{project.name}</span></h2>
                        <p className="config-subtitle">Manage provider settings across different environments</p>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                            className="btn-cancel"
                            onClick={saveToLocalStorage}
                            style={{ padding: '8px 16px' }}
                        >
                            💾 Save Progress
                        </button>
                        <button
                            className="btn-cancel"
                            onClick={loadFromLocalStorage}
                            style={{ padding: '8px 16px' }}
                        >
                            📂 Load Saved
                        </button>
                    </div>
                </div>
            </div> */}

            {/* Service Tabs */}
            <div className="service-tabs">
                {SERVICE_TABS.map((tab) => (
                    <button
                        key={tab.id}
                        className={`service-tab ${activeTab === tab.id ? 'active' : ''}`}
                        onClick={() => {
                            if (hasUnsavedChanges && activeTab !== tab.id) {
                                setShowUnsavedChangesModal({ targetTab: tab.id });
                            } else {
                                setActiveTab(tab.id);
                                setIsLoading(true);
                                setTimeout(() => setIsLoading(false), 100);
                            }
                        }}
                        style={{ borderBottomColor: activeTab === tab.id ? tab.color : 'transparent' }}
                    >
                        <span className="tab-icon">{tab.icon}</span>
                        <span className="tab-label">{tab.label}</span>
                    </button>
                ))}
            </div>

            <div className="split-view-card">
                {/* Left Sidebar - Environment List */}
                <div className="environments-sidebar">
                    <div className="sidebar-header">
                        <h3><span>🌍</span> Environments</h3>
                        <button className="add-env-btn-sidebar" onClick={addEnvironment}>+ Add</button>
                    </div>

                    <div className="environments-list-sidebar" style={{ maxHeight: "calc(100vh - 300px)", overflowY: "auto" }}>
                        {environments.map((env) => (
                            <div
                                key={env.id}
                                className={`env-item ${selectedEnvId === env.id ? 'active' : ''}`}
                                onClick={() => setSelectedEnvId(env.id)}
                                style={{ borderLeftColor: selectedEnvId === env.id ? serviceColor : 'transparent' }}
                            >
                                <div className="env-item-content">
                                    <span className="env-icon">📁</span>
                                    <div className="env-info">
                                        <div className="env-name">{env.name}</div>
                                        <div className="env-provider-badges">
                                            {env.providers.filter(p => p.isSaved).map(p => (
                                                <span key={p.id} className="provider-mini-badge" style={{ background: `${serviceColor}20`, color: serviceColor }}>
                                                    {p.provider}
                                                </span>
                                            ))}
                                            {env.providers.length === 0 && (
                                                <span className="provider-mini-badge">No providers</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    className="remove-env-btn-sidebar"
                                    onClick={(e) => { e.stopPropagation(); removeEnvironment(env.id); }}
                                    title="Remove environment"
                                >×</button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Panel - Configuration Form */}
                <div className="config-panel">
                    {selectedEnv && (
                        <div className="config-form">
                            <div className="panel-header" style={{ borderBottomColor: `${serviceColor}30` }}>
                                <div className="panel-header-left">
                                    <span className="panel-icon">📂</span>
                                    <div>
                                        <h3>{selectedEnv.name}</h3>
                                        <p className="panel-subtitle">
                                            {selectedEnv.providers.filter(p => p.isSaved).length} {currentService.label.toLowerCase()} provider(s) configured
                                        </p>
                                    </div>
                                </div>
                                <div className="env-name-editor">
                                    <select
                                        value={selectedEnv.name}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (value === "custom") {
                                                updateEnvName(selectedEnv.id, "");
                                            } else {
                                                updateEnvName(selectedEnv.id, value);
                                            }
                                        }}
                                        className="env-select"
                                    >
                                        {DEFAULT_ENVIRONMENTS.map(opt => (
                                            <option key={opt} value={opt}>{opt}</option>
                                        ))}
                                        <option value="custom">+ Custom</option>
                                    </select>
                                    {!DEFAULT_ENVIRONMENTS.includes(selectedEnv.name) && selectedEnv.name !== "Select Environment" && (
                                        <input
                                            type="text"
                                            value={selectedEnv.name}
                                            onChange={(e) => updateEnvName(selectedEnv.id, e.target.value)}
                                            placeholder="Enter custom name"
                                            className="custom-env-input"
                                            autoFocus
                                        />
                                    )}
                                </div>
                            </div>

                            <div className="providers-container">
                                {selectedEnv.providers.map((provider) => {
                                    const usedProviders = selectedEnv
                                        ? selectedEnv.providers.filter(p => p.isSaved && p.provider).map(p => p.provider)
                                        : [];
                                    const hasAvailableProviders = getAvailableProviders(selectedEnv.id).length > 0;

                                    return (
                                        <div key={provider.id} className="provider-card" style={{ borderTopColor: serviceColor }}>
                                            <div className="provider-card-header">
                                                <div className="provider-title">
                                                    <span className="provider-icon">🔌</span>
                                                    <span className="provider-name">
                                                        {provider.provider || "New Provider"}
                                                    </span>
                                                    {provider.isSaved && (
                                                        <span className="saved-badge" style={{ background: `${serviceColor}20`, color: serviceColor }}>
                                                            ✓ Saved
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="provider-actions">
                                                    {provider.isSaved && !provider.isEditing && (
                                                        <button
                                                            type="button"
                                                            className="icon-btn edit-btn"
                                                            onClick={() => toggleEditMode(selectedEnv.id, provider.id)}
                                                            title="Edit"
                                                        >✏️</button>
                                                    )}
                                                    {provider.isEditing && (
                                                        <button
                                                            type="button"
                                                            className="save-btn"
                                                            onClick={() => saveProvider(selectedEnv.id, provider.id)}
                                                            disabled={savingProviderId === provider.id}
                                                            style={{ backgroundColor: serviceColor }}
                                                        >
                                                            {savingProviderId === provider.id ? "Saving..." : "Save"}
                                                        </button>
                                                    )}
                                                    <button
                                                        type="button"
                                                        className="icon-btn delete-btn"
                                                        onClick={() => setShowDeleteProviderModal({
                                                            envId: selectedEnv.id,
                                                            providerId: provider.id,
                                                            providerName: provider.provider || "this provider"
                                                        })}
                                                        title="Remove"
                                                    >
                                                        🗑️
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="provider-card-body">
                                                {provider.isEditing ? (
                                                    <>
                                                        <div className="form-group">
                                                            <label>Select Provider *</label>
                                                            {hasAvailableProviders ? (
                                                                <>
                                                                    <select
                                                                        value={provider.provider}
                                                                        onChange={(e) => updateProviderSelection(selectedEnv.id, provider.id, e.target.value)}
                                                                        className="provider-select"
                                                                        required
                                                                    >
                                                                        <option value="">-- Choose a provider --</option>
                                                                        {availableProviders
                                                                            .filter(p => !usedProviders.includes(p))
                                                                            .map(p => (
                                                                                <option key={p} value={p}>{p}</option>
                                                                            ))}
                                                                    </select>
                                                                    {provider.provider && providerFields[provider.provider] && (
                                                                        <div className="credentials-section" style={{ marginTop: "16px" }}>
                                                                            <div className="section-title"><span>🔐</span> Credentials</div>
                                                                            {providerFields[provider.provider].map((field: any) => (
                                                                                <div className="form-group" key={field.name}>
                                                                                    <label>
                                                                                        <span>{field.icon || "📝"}</span> {field.label}
                                                                                        {field.required && <span className="required-star"> *</span>}
                                                                                    </label>
                                                                                    <div className="input-with-icon">
                                                                                        <input
                                                                                            type={field.type === "password" && !provider.showPasswords[field.name] ? "password" : "text"}
                                                                                            value={provider.fields[field.name] || ""}
                                                                                            onChange={(e) => updateField(selectedEnv.id, provider.id, field.name, e.target.value)}
                                                                                            placeholder={`Enter ${field.label}`}
                                                                                            required={field.required}
                                                                                        />
                                                                                        {field.type === "password" && (
                                                                                            <button
                                                                                                type="button"
                                                                                                className="eye-btn"
                                                                                                onClick={() => togglePasswordVisibility(selectedEnv.id, provider.id, field.name)}
                                                                                                title={provider.showPasswords[field.name] ? "Hide password" : "Show password"}
                                                                                            >
                                                                                                {provider.showPasswords[field.name] ? <FaEyeSlash /> : <FaEye />}
                                                                                            </button>
                                                                                        )}
                                                                                    </div>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    )}
                                                                </>
                                                            ) : (
                                                                <p className="no-providers-msg" style={{ color: serviceColor }}>
                                                                    ✓ All available {currentService.label.toLowerCase()} providers have been configured for this environment.
                                                                </p>
                                                            )}
                                                        </div>
                                                    </>
                                                ) : (
                                                    <div className="view-mode">
                                                        <div className="provider-info-row">
                                                            <span className="info-label">Provider:</span>
                                                            <span className="info-value">{provider.provider}</span>
                                                        </div>
                                                        <div className="credentials-view">
                                                            <div className="section-title small">Configured Credentials</div>
                                                            {Object.entries(provider.fields).map(([key, value]) => {
                                                                const fieldConfig = providerFields[provider.provider]?.find((f: any) => f.name === key);
                                                                const isPassword = fieldConfig?.type === "password" || key.includes("Key") || key.includes("Token") || key.includes("Secret") || key.includes("Password");

                                                                return (
                                                                    <div className="info-row" key={key}>
                                                                        <span className="info-label">
                                                                            {fieldConfig?.icon || "📝"} {fieldConfig?.label || key}:
                                                                        </span>
                                                                        <div className="info-value-with-eye">
                                                                            <span className="info-value">
                                                                                {isPassword
                                                                                    ? (provider.showViewPasswords[key] ? (value || "—") : "••••••••")
                                                                                    : value || "—"}
                                                                            </span>
                                                                            {isPassword && value && (
                                                                                <button
                                                                                    type="button"
                                                                                    className="eye-btn-small"
                                                                                    onClick={() => toggleViewPasswordVisibility(selectedEnv.id, provider.id, key)}
                                                                                    title={provider.showViewPasswords[key] ? "Hide" : "Show"}
                                                                                >
                                                                                    {provider.showViewPasswords[key] ? <FaEyeSlash /> : <FaEye />}
                                                                                </button>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}

                                {getAvailableProviders(selectedEnv.id).length > 0 && (
                                    <button
                                        type="button"
                                        className="add-provider-btn"
                                        onClick={() => addProvider(selectedEnv.id)}
                                        disabled={selectedEnv.name === "Select Environment" || selectedEnv.name === ""}
                                        style={{
                                            borderColor: serviceColor,
                                            color: serviceColor,
                                            opacity: selectedEnv.name === "Select Environment" || selectedEnv.name === "" ? 0.5 : 1,
                                            cursor: selectedEnv.name === "Select Environment" || selectedEnv.name === "" ? "not-allowed" : "pointer"
                                        }}
                                    >
                                        + Add {currentService.label} Provider
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={() => navigate("/dashboard/project")}>
                    Cancel
                </button>
                <button type="button" className="btn-submit" onClick={handleFinalSave}>
                    Save {currentService.label} Configuration
                </button>
            </div>

            {/* Delete Provider Confirmation Modal */}
            {showDeleteProviderModal && (
                <div className="modal-overlay" onClick={() => setShowDeleteProviderModal(null)}>
                    <div className="modal-container delete-confirm" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Delete Provider</h3>
                            <button className="close-btn" onClick={() => setShowDeleteProviderModal(null)}>×</button>
                        </div>
                        <div className="delete-confirm-content">
                            <p>Are you sure you want to delete <strong>{showDeleteProviderModal.providerName}</strong>?</p>
                            <p className="warning-text">This action cannot be undone. All credentials for this provider will be permanently removed.</p>
                        </div>
                        <div className="modal-actions">
                            <button className="btn-cancel" onClick={() => setShowDeleteProviderModal(null)}>
                                Cancel
                            </button>
                            <button className="btn-delete" onClick={confirmDeleteProvider}>
                                Delete Provider
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Environment Confirmation Modal */}
            {showDeleteEnvModal && (
                <div className="modal-overlay" onClick={() => setShowDeleteEnvModal(null)}>
                    <div className="modal-container delete-confirm" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Delete Environment</h3>
                            <button className="close-btn" onClick={() => setShowDeleteEnvModal(null)}>×</button>
                        </div>
                        <div className="delete-confirm-content">
                            {showDeleteEnvModal.hasProviders ? (
                                <>
                                    <p>Cannot delete <strong>{showDeleteEnvModal.envName}</strong>!</p>
                                    <p className="warning-text">
                                        ⚠️ This environment has configured providers. Please delete all providers first before deleting the environment.
                                    </p>
                                </>
                            ) : (
                                <>
                                    <p>Are you sure you want to delete environment <strong>{showDeleteEnvModal.envName}</strong>?</p>
                                    <p className="warning-text">This action cannot be undone.</p>
                                </>
                            )}
                        </div>
                        <div className="modal-actions">
                            <button className="btn-cancel" onClick={() => setShowDeleteEnvModal(null)}>
                                Cancel
                            </button>
                            {!showDeleteEnvModal.hasProviders && (
                                <button className="btn-delete" onClick={confirmDeleteEnvironment}>
                                    Delete Environment
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Unsaved Changes Warning Modal */}
            {showUnsavedChangesModal && (
                <div className="modal-overlay" onClick={() => setShowUnsavedChangesModal(null)}>
                    <div className="modal-container delete-confirm" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Unsaved Changes</h3>
                            <button className="close-btn" onClick={() => setShowUnsavedChangesModal(null)}>×</button>
                        </div>
                        <div className="delete-confirm-content">
                            <p>You have unsaved changes in the current configuration.</p>
                            <p className="warning-text">If you switch tabs now, your changes will be lost.</p>
                        </div>
                        <div className="modal-actions">
                            <button className="btn-cancel" onClick={() => setShowUnsavedChangesModal(null)}>
                                Stay Here
                            </button>
                            <button className="btn-delete" onClick={() => switchTab(showUnsavedChangesModal.targetTab)}>
                                Discard & Switch
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}