import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "../hooks/useToast";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "../styles/EnvironmentManagement.css";

// Provider field definitions
const PROVIDER_FIELDS_MAP: Record<string, { name: string; label: string; type: string; required?: boolean; icon?: string }[]> = {
    // SMS Providers
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
    // Email Providers
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
    // WhatsApp Providers
    WhatsApp_Twilio: [
        { name: "accountSid", label: "Account SID", type: "text", required: true, icon: "🆔" },
        { name: "authToken", label: "Auth Token", type: "password", required: true, icon: "🔒" },
        { name: "phoneNumber", label: "WhatsApp Number", type: "text", required: true, icon: "💬" },
    ],
    WhatsApp_Gupshup: [
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
    WhatsApp_Kaleyra: [
        { name: "apiKey", label: "API Key", type: "password", required: true, icon: "🔑" },
        { name: "senderId", label: "Sender ID", type: "text", required: true, icon: "📱" },
    ],
    WhatsApp_Vonage: [
        { name: "apiKey", label: "API Key", type: "password", required: true, icon: "🔑" },
        { name: "apiSecret", label: "API Secret", type: "password", required: true, icon: "🔒" },
        { name: "senderId", label: "Sender ID", type: "text", required: true, icon: "📱" },
    ],
};

const SERVICE_TYPES = ["SMS", "EMAIL", "WHATSAPP"];

const PROVIDERS_BY_SERVICE: Record<string, string[]> = {
    SMS: ["MSG91", "Twilio", "Gupshup", "Vonage", "Kaleyra", "Textlocal", "TrueDialog"],
    EMAIL: ["SendGrid", "AWS_SES", "Mailgun", "SMTP", "Postmark"],
    WHATSAPP: ["WhatsApp_Twilio", "WhatsApp_Gupshup", "Meta_Cloud", "WhatsApp_Kaleyra", "WhatsApp_Vonage"]
};

const SERVICE_ICONS: Record<string, string> = {
    SMS: "💬",
    EMAIL: "✉️",
    WHATSAPP: "💬"
};

const SERVICE_COLORS: Record<string, string> = {
    SMS: "#00c896",
    EMAIL: "#4f8ef7",
    WHATSAPP: "#25D366"
};

interface Provider {
    id: number;
    name: string;
    fields: Record<string, string>;
}

export default function ProviderConfig() {
    const navigate = useNavigate();
    const location = useLocation();
    const { project, environmentName, activeService: initialService } = location.state || {};
    const { showToast, ToastContainer } = useToast();
    const [expandedProviders, setExpandedProviders] = useState<Record<number, boolean>>({});
    const [activeService, setActiveService] = useState<string>(initialService || "SMS");
    const [showAddProviderModal, setShowAddProviderModal] = useState(false);
    const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState<{ id: number; name: string } | null>(null);
    const [showCancelConfirmModal, setShowCancelConfirmModal] = useState(false);
    const [selectedProvider, setSelectedProvider] = useState("");
    const [providerFields, setProviderFields] = useState<Record<string, string>>({});
    const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
    const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});
    const [editingProvider, setEditingProvider] = useState<Provider | null>(null);
    const [saving, setSaving] = useState(false);
    const [providers, setProviders] = useState<Provider[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [serviceProviderCounts, setServiceProviderCounts] = useState<Record<string, number>>({
        SMS: 0,
        EMAIL: 0,
        WHATSAPP: 0
    });

    useEffect(() => {
        if (!project || !environmentName) {
            showToast("Invalid request. Redirecting...", "error");
            setTimeout(() => navigate("/dashboard/project"), 1500);
            return;
        }
        loadProviders();
        updateAllServiceCounts();
    }, [environmentName, activeService]);

    // Add this useEffect to auto-expand all providers when they change
    // Remove the old useEffect and add this:
    useEffect(() => {
        if (providers.length > 0) {
            const expanded: Record<number, boolean> = {};
            providers.forEach(p => {
                // If only 1 provider, expand it. If multiple, collapse all
                expanded[p.id] = providers.length === 1;
            });
            setExpandedProviders(expanded);
        }
    }, [providers.length]);

    const loadProviders = () => {
        const storageKey = `env_${environmentName}_${activeService.toLowerCase()}_providers`;
        const savedData = localStorage.getItem(storageKey);

        if (savedData) {
            const parsed = JSON.parse(savedData);
            const oneHourAgo = Date.now() - 60 * 60 * 1000;
            if (parsed.timestamp > oneHourAgo && parsed.providers) {
                setProviders(parsed.providers);
            } else {
                setProviders([]);
            }
        } else {
            setProviders([]);
        }

        updateAllServiceCounts();
        setIsLoading(false);
    };

    const updateAllServiceCounts = () => {
        const counts: Record<string, number> = {};

        SERVICE_TYPES.forEach(service => {
            const key = `env_${environmentName}_${service.toLowerCase()}_providers`;
            const data = localStorage.getItem(key);
            if (data) {
                const parsed = JSON.parse(data);
                counts[service] = parsed.providers?.length || 0;
            } else {
                counts[service] = 0;
            }
        });

        setServiceProviderCounts(counts);
    };

    const saveToLocalStorage = (updatedProviders: Provider[]) => {
        const storageKey = `env_${environmentName}_${activeService.toLowerCase()}_providers`;
        const dataToSave = {
            providers: updatedProviders,
            timestamp: Date.now()
        };
        localStorage.setItem(storageKey, JSON.stringify(dataToSave));
    };
    const toggleProviderExpand = (providerId: number) => {
        setExpandedProviders(prev => ({
            ...prev,
            [providerId]: !prev[providerId]
        }));
    };
    const updateEnvironmentCounts = () => {
        const event = new CustomEvent('providerCountsUpdated');
        window.dispatchEvent(event);
    };

    const handleProviderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const provider = e.target.value;
        setSelectedProvider(provider);
        const fieldsDef = PROVIDER_FIELDS_MAP[provider] || [];
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

        const fieldsDef = PROVIDER_FIELDS_MAP[selectedProvider];
        for (const field of fieldsDef) {
            if (field.required && !providerFields[field.name]) {
                showToast(`${field.label} is required`, "error");
                return;
            }
        }

        setSaving(true);
        await new Promise(resolve => setTimeout(resolve, 500));

        let updatedProviders: Provider[];

        if (editingProvider) {
            updatedProviders = providers.map(p =>
                p.id === editingProvider.id
                    ? { ...p, name: selectedProvider, fields: { ...providerFields } }
                    : p
            );
            showToast(`${selectedProvider} updated successfully!`, "success");
        } else {
            const newProvider: Provider = {
                id: Date.now(),
                name: selectedProvider,
                fields: { ...providerFields },
            };
            updatedProviders = [newProvider, ...providers];
            showToast(`${selectedProvider} added successfully!`, "success");
        }

        setProviders(updatedProviders);
        saveToLocalStorage(updatedProviders);
        updateEnvironmentCounts();
        updateAllServiceCounts();
        setShowAddProviderModal(false);
        setEditingProvider(null);
        setSelectedProvider("");
        setProviderFields({});
        setSaving(false);
    };

    const editProvider = (provider: Provider) => {
        setEditingProvider(provider);
        setSelectedProvider(provider.name);
        setProviderFields({ ...provider.fields });
        setShowAddProviderModal(true);
    };

    const deleteProvider = () => {
        if (showDeleteConfirmModal) {
            const updatedProviders = providers.filter(p => p.id !== showDeleteConfirmModal.id);
            setProviders(updatedProviders);
            saveToLocalStorage(updatedProviders);
            updateEnvironmentCounts();
            updateAllServiceCounts();
            showToast(`${showDeleteConfirmModal.name} deleted`, "success");
            setShowDeleteConfirmModal(null);
        }
    };

    const handleCancelAddProvider = () => {
        if (selectedProvider || Object.values(providerFields).some(val => val)) {
            setShowCancelConfirmModal(true);
        } else {
            closeAddProviderModal();
        }
    };

    const closeAddProviderModal = () => {
        setShowAddProviderModal(false);
        setEditingProvider(null);
        setSelectedProvider("");
        setProviderFields({});
        setShowPasswords({});
    };

    const confirmCancel = () => {
        closeAddProviderModal();
        setShowCancelConfirmModal(false);
        showToast("Provider creation cancelled", "success");
    };

    const handleFinalSave = async () => {
        showToast(`Configuration saved for ${environmentName}!`, "success");
    };

    if (!project || !environmentName) {
        return <div className="loading">Loading...</div>;
    }

    if (isLoading) return <div className="loading">Loading...</div>;

    return (
        <div className="provider-config-container">
            <ToastContainer />

            <div className="config-header">
                <div className="config-title">
                    <h2>{project?.name} - {environmentName}</h2>
                    <p>Configure providers for this environment</p>
                </div>
            </div>

            <div className="config-content">
                {/* Left Sidebar - Services */}
                <div className="services-sidebar">
                    {SERVICE_TYPES.map((service) => (
                        <div
                            key={service}
                            className={`service-item ${activeService === service ? 'active' : ''}`}
                            onClick={() => {
                                setActiveService(service);
                                loadProviders();
                            }}
                            style={{
                                borderLeftColor: activeService === service ? SERVICE_COLORS[service] : 'transparent',
                                backgroundColor: activeService === service ? `${SERVICE_COLORS[service]}10` : 'transparent'
                            }}
                        >
                            <span className="service-icon">{SERVICE_ICONS[service]}</span>
                            <div className="service-info">
                                <div className="service-name">{service}</div>
                                <div className="service-stats">
                                    {serviceProviderCounts[service] || 0} provider(s)
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Right Panel - Providers */}
                <div className="providers-panel">
                    <div className="panel-header">
                        <div className="panel-title">
                            <span className="panel-icon">{SERVICE_ICONS[activeService]}</span>
                            <h3>{activeService} Providers</h3>
                        </div>
                        <button
                            className="add-provider-btn-main"
                            onClick={() => {
                                setEditingProvider(null);
                                setSelectedProvider("");
                                setProviderFields({});
                                setShowAddProviderModal(true);
                            }}
                            style={{ backgroundColor: SERVICE_COLORS[activeService] }}
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
                                    onClick={() => {
                                        setEditingProvider(null);
                                        setSelectedProvider("");
                                        setProviderFields({});
                                        setShowAddProviderModal(true);
                                    }}
                                    style={{ borderColor: SERVICE_COLORS[activeService], color: SERVICE_COLORS[activeService] }}
                                >
                                    + Add your first provider
                                </button>
                            </div>
                        ) : (
                            providers.map((provider) => {
                                const isExpanded = expandedProviders[provider.id] ?? false;
                                const isOnlyOne = providers.length === 1;
                                const showBody = isOnlyOne || isExpanded;

                                return (
                                    <div
                                        key={provider.id}
                                        className={`provider-view-card ${!isOnlyOne ? 'accordion-card' : ''}`}
                                        style={{
                                            borderTopColor: SERVICE_COLORS[activeService],
                                            cursor: !isOnlyOne ? 'pointer' : 'default'
                                        }}
                                        onClick={() => {
                                            if (!isOnlyOne) {
                                                toggleProviderExpand(provider.id);
                                            }
                                        }}
                                    >
                                        <div className="provider-view-header">
                                            <div className="provider-view-title">
                                                <span className="provider-view-icon">🔌</span>
                                                <span className="provider-view-name">{provider.name.replace('_', ' ')}</span>
                                                <span className="saved-badge" style={{ background: `${SERVICE_COLORS[activeService]}20`, color: SERVICE_COLORS[activeService] }}>
                                                    ✓ Configured
                                                </span>
                                            </div>
                                            <div className="provider-actions-buttons">
                                                <button
                                                    className="edit-provider-btn"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        editProvider(provider);
                                                    }}
                                                >
                                                    ✏️ Edit
                                                </button>
                                                <button
                                                    className="delete-provider-btn"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setShowDeleteConfirmModal({ id: provider.id, name: provider.name.replace('_', ' ') });
                                                    }}
                                                >
                                                    🗑️ Remove
                                                </button>
                                            </div>
                                        </div>

                                        {showBody && (
                                            <div className="provider-view-body" onClick={(e) => e.stopPropagation()}>
                                                <div className="credentials-view">
                                                    <div className="section-title">📋 Credentials</div>
                                                    {Object.entries(provider.fields).map(([key, value]) => {
                                                        const fieldConfig = PROVIDER_FIELDS_MAP[provider.name]?.find((f: any) => f.name === key);
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
                                                                            ? (visiblePasswords[passwordKey] ? (value || "—") : "••••••••")
                                                                            : (value || "—")}
                                                                    </span>
                                                                    {isPassword && value && (
                                                                        <button
                                                                            className="eye-btn-small"
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
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
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>

                    <div className="panel-actions">
                        <button className="btn-cancel" onClick={() => navigate(-1)}>
                            Cancel
                        </button>
                        <button
                            className="btn-submit"
                            onClick={handleFinalSave}
                            style={{ background: `linear-gradient(135deg, ${SERVICE_COLORS[activeService]}, #2563eb)` }}
                        >
                            Save Configuration
                        </button>
                    </div>
                </div>
            </div>

            {/* Add/Edit Provider Modal */}
            {showAddProviderModal && (
                <div className="modal-overlay" onClick={handleCancelAddProvider}>
                    <div className="modal-container provider-modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>{editingProvider ? `Edit ${activeService} Provider` : `Add ${activeService} Provider`}</h3>
                            <button className="close-btn" onClick={handleCancelAddProvider}>×</button>
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
                                    {PROVIDERS_BY_SERVICE[activeService]
                                        ?.filter(p => {
                                            // When editing, show the current provider
                                            if (editingProvider && editingProvider.name === p) return true;
                                            // Hide already added providers
                                            return !providers.some(provider => provider.name === p);
                                        })
                                        .map(p => (
                                            <option key={p} value={p}>{p.replace('_', ' ')}</option>
                                        ))
                                    }
                                </select>
                            </div>

                            {selectedProvider && PROVIDER_FIELDS_MAP[selectedProvider] && (
                                <div className="credentials-section">
                                    <div className="section-title">🔐 Credentials</div>
                                    {PROVIDER_FIELDS_MAP[selectedProvider].map((field: any) => (
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
                            <button className="btn-cancel" onClick={handleCancelAddProvider}>
                                Cancel
                            </button>
                            <button
                                className="btn-create"
                                onClick={saveProvider}
                                disabled={saving}
                                style={{ backgroundColor: SERVICE_COLORS[activeService] }}
                            >
                                {saving ? (editingProvider ? "Updating..." : "Adding...") : (editingProvider ? "Update Provider" : "Add Provider")}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteConfirmModal && (
                <div className="modal-overlay" onClick={() => setShowDeleteConfirmModal(null)}>
                    <div className="modal-container delete-confirm-modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <div className="warning-icon">⚠️</div>
                            <h3>Delete Provider</h3>
                            <button className="close-btn" onClick={() => setShowDeleteConfirmModal(null)}>×</button>
                        </div>
                        <div className="modal-body">
                            <p>Are you sure you want to delete <strong>{showDeleteConfirmModal.name}</strong>?</p>
                            <p className="warning-text">This action cannot be undone. All credentials for this provider will be permanently removed.</p>
                        </div>
                        <div className="modal-actions">
                            <button className="btn-cancel" onClick={() => setShowDeleteConfirmModal(null)}>
                                Cancel
                            </button>
                            <button className="btn-delete" onClick={deleteProvider}>
                                Delete Provider
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Cancel Confirmation Modal */}
            {showCancelConfirmModal && (
                <div className="modal-overlay" onClick={() => setShowCancelConfirmModal(false)}>
                    <div className="modal-container cancel-confirm-modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <div className="warning-icon">⚠️</div>
                            <h3>Cancel Provider Setup</h3>
                            <button className="close-btn" onClick={() => setShowCancelConfirmModal(false)}>×</button>
                        </div>
                        <div className="modal-body">
                            <p>You have entered credentials that haven't been saved.</p>
                            <p className="warning-text">Are you sure you want to cancel? All entered data will be lost.</p>
                        </div>
                        <div className="modal-actions">
                            <button className="btn-cancel" onClick={() => setShowCancelConfirmModal(false)}>
                                Continue Editing
                            </button>
                            <button className="btn-delete" onClick={confirmCancel}>
                                Discard Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}