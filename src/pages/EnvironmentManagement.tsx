import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/EnvironmentManagement.css";

interface EnvironmentProvider {
    id: string;
    name: string;
    serviceCounts: {
        sms: number;
        email: number;
        whatsapp: number;
    };
    lastModified: string;
}

export default function EnvironmentManagement() {
    const navigate = useNavigate();
    const location = useLocation();
    const { project } = location.state || {};

    const [selectedEnvironment, setSelectedEnvironment] = useState<string>("");
    const [isCustomMode, setIsCustomMode] = useState(false);
    const [customEnvName, setCustomEnvName] = useState("");
    const [configuredEnvironments, setConfiguredEnvironments] = useState<EnvironmentProvider[]>([]);
    const [showAddForm, setShowAddForm] = useState(false);

    useEffect(() => {
        if (!project) {
            setTimeout(() => navigate("/dashboard/project"), 2000);
            return;
        }
        loadConfiguredEnvironments();

        const handleProviderUpdate = () => loadConfiguredEnvironments();
        window.addEventListener('providerCountsUpdated', handleProviderUpdate);
        window.addEventListener('storage', handleProviderUpdate);

        return () => {
            window.removeEventListener('providerCountsUpdated', handleProviderUpdate);
            window.removeEventListener('storage', handleProviderUpdate);
        };
    }, [project]);

    const loadConfiguredEnvironments = () => {
        const envNames = ['Local', 'Dev', 'Staging', 'Live'];
        const allKeys = Object.keys(localStorage);
        const customEnvs = new Set<string>();

        allKeys.forEach(key => {
            const match = key.match(/^env_(.+)_(sms|email|whatsapp)_providers$/);
            if (match && !envNames.includes(match[1])) {
                customEnvs.add(match[1]);
            }
        });

        const allEnvs = [...envNames, ...customEnvs];
        const environments: EnvironmentProvider[] = [];

        allEnvs.forEach(envName => {
            const smsKey = `env_${envName}_sms_providers`;
            const emailKey = `env_${envName}_email_providers`;
            const whatsappKey = `env_${envName}_whatsapp_providers`;

            const smsData = JSON.parse(localStorage.getItem(smsKey) || '{"providers":[]}');
            const emailData = JSON.parse(localStorage.getItem(emailKey) || '{"providers":[]}');
            const whatsappData = JSON.parse(localStorage.getItem(whatsappKey) || '{"providers":[]}');

            const serviceCounts = {
                sms: smsData.providers?.length || 0,
                email: emailData.providers?.length || 0,
                whatsapp: whatsappData.providers?.length || 0
            };

            const totalProviders = serviceCounts.sms + serviceCounts.email + serviceCounts.whatsapp;

            if (totalProviders > 0) {
                const timestamps = [
                    smsData.timestamp,
                    emailData.timestamp,
                    whatsappData.timestamp
                ].filter(Boolean);

                environments.push({
                    id: envName,
                    name: envName,
                    serviceCounts,
                    lastModified: timestamps.length ? new Date(Math.max(...timestamps)).toLocaleDateString() : 'N/A'
                });
            }
        });

        environments.sort((a, b) => {
            const aTime = a.lastModified !== 'N/A' ? new Date(a.lastModified).getTime() : 0;
            const bTime = b.lastModified !== 'N/A' ? new Date(b.lastModified).getTime() : 0;
            return bTime - aTime;
        });

        setConfiguredEnvironments(environments);
    };

    const addEnvironment = () => {
        let envName = selectedEnvironment;

        if (isCustomMode && customEnvName.trim()) {
            envName = customEnvName.trim();
        }

        if (envName) {
            navigate(`/dashboard/provider-config/${envName}`, {
                state: { project, environmentName: envName }
            });
        }
    };

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        if (value === "__custom__") {
            setIsCustomMode(true);
            setSelectedEnvironment("");
        } else {
            setIsCustomMode(false);
            setSelectedEnvironment(value);
        }
    };

    const handleEnvCardClick = (env: EnvironmentProvider, service?: string) => {
        navigate(`/dashboard/provider-config/${env.name}`, {
            state: {
                project,
                environmentName: env.name,
                activeService: service || null  // Pass the service if badge is clicked
            }
        });
    };

    const getEnvIcon = (name: string) => {
        const icons: Record<string, string> = {
            'Local': '🏠',
            'Dev': '💻',
            'Staging': '🚀',
            'Live': '🌍'
        };
        return icons[name] || '🔧';
    };

    if (!project) {
        return (
            <div className="loading">
                <p>Loading...</p>
            </div>
        );
    }

    // If there are configured environments, show grid view
    const hasConfiguredEnvs = configuredEnvironments.length > 0;

    return (
        <div className={hasConfiguredEnvs ? "env-grid-container" : "env-container-simple"}>
            {hasConfiguredEnvs ? (
                // Grid View
                <>
                    <div className="env-grid-header">
                        <h2>{project?.name} - Environments</h2>
                        <p>{configuredEnvironments.length} environment(s) configured</p>
                    </div>

                    <div className="env-grid">
                        {configuredEnvironments.map((env) => (
                            <div
                                key={env.id}
                                className="env-grid-card"
                                onClick={() => handleEnvCardClick(env)}
                            >
                                <div className="env-card-header">
                                    <span className="env-card-icon">{getEnvIcon(env.name)}</span>
                                    <span className="env-card-name">{env.name}</span>
                                </div>

                                <div className="env-service-badges">
                                    {env.serviceCounts.sms > 0 && (
                                        <span
                                            className="service-badge sms"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleEnvCardClick(env, 'SMS');
                                            }}
                                        >
                                            💬 SMS ({env.serviceCounts.sms})
                                        </span>
                                    )}
                                    {env.serviceCounts.email > 0 && (
                                        <span
                                            className="service-badge email"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleEnvCardClick(env, 'EMAIL');
                                            }}
                                        >
                                            ✉️ Email ({env.serviceCounts.email})
                                        </span>
                                    )}
                                    {env.serviceCounts.whatsapp > 0 && (
                                        <span
                                            className="service-badge whatsapp"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleEnvCardClick(env, 'WHATSAPP');
                                            }}
                                        >
                                            💚 WhatsApp ({env.serviceCounts.whatsapp})
                                        </span>
                                    )}
                                </div>

                                <div className="env-card-footer">
                                    <span className="env-modified">Modified: {env.lastModified}</span>
                                    <span className="env-arrow">→</span>
                                </div>
                            </div>
                        ))}

                        {/* Add new environment card - same size as others */}
                        {!showAddForm ? (
                            <div className="env-grid-card add-new-card" onClick={() => setShowAddForm(true)}>
                                <div className="add-card-content">
                                    <span className="add-icon">+</span>
                                    <span className="add-text">Add Environment</span>
                                </div>
                            </div>
                        ) : (
                            <div className="env-grid-card add-form-card" onClick={(e) => e.stopPropagation()}>
                                <div className="env-card-simple-small">
                                    <div className="env-icon-small">🌍</div>
                                    <h3>Add Environment</h3>

                                    <div className="env-controls-small">
                                        <select
                                            className="env-dropdown"
                                            value={isCustomMode ? "__custom__" : selectedEnvironment}
                                            onChange={handleSelectChange}
                                        >
                                            <option value="">-- Select --</option>
                                            <option value="Local">Local</option>
                                            <option value="Dev">Dev</option>
                                            <option value="Staging">Staging</option>
                                            <option value="Live">Live</option>
                                            <option value="__custom__">+ Custom</option>
                                        </select>

                                        {isCustomMode && (
                                            <input
                                                type="text"
                                                placeholder="Enter name"
                                                value={customEnvName}
                                                onChange={(e) => setCustomEnvName(e.target.value)}
                                                onKeyPress={(e) => e.key === 'Enter' && addEnvironment()}
                                                className="custom-input-small"
                                                autoFocus
                                            />
                                        )}

                                        {((selectedEnvironment && !isCustomMode) || (isCustomMode && customEnvName.trim())) && (
                                            <button className="add-btn-small" onClick={addEnvironment}>
                                                Continue →
                                            </button>
                                        )}

                                        <button className="cancel-add-btn-small" onClick={() => {
                                            setShowAddForm(false);
                                            setIsCustomMode(false);
                                            setSelectedEnvironment("");
                                            setCustomEnvName("");
                                        }}>
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </>
            ) : (
                // Initial Big Centered Card
                <div className="env-card-simple">
                    <div className="env-icon"></div>
                    <h2>{project?.name}</h2>
                    <p>Select or create an environment to configure providers</p>

                    <div className="env-controls">
                        <select
                            className="env-dropdown"
                            value={isCustomMode ? "__custom__" : selectedEnvironment}
                            onChange={handleSelectChange}
                        >
                            <option value="">-- Select environment --</option>
                            <option value="Local">Local</option>
                            <option value="Dev">Dev</option>
                            <option value="Staging">Staging</option>
                            <option value="Live">Live</option>
                            <option value="__custom__">+ Add Custom</option>
                        </select>

                        {isCustomMode && (
                            <input
                                type="text"
                                placeholder="Enter environment name"
                                value={customEnvName}
                                onChange={(e) => setCustomEnvName(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && addEnvironment()}
                                className="custom-input"
                                autoFocus
                            />
                        )}

                        {((selectedEnvironment && !isCustomMode) || (isCustomMode && customEnvName.trim())) && (
                            <button className="add-btn" onClick={addEnvironment}>
                                Continue →
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}