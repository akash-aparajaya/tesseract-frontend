import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "../hooks/useToast";
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
    const { showToast, ToastContainer } = useToast();

    const [menuOpen, setMenuOpen] = useState<string | null>(null);
    const [selectedEnvironment, setSelectedEnvironment] = useState<string>("");
    const [isCustomMode, setIsCustomMode] = useState(false);
    const [customEnvName, setCustomEnvName] = useState("");
    const [configuredEnvironments, setConfiguredEnvironments] = useState<EnvironmentProvider[]>([]);
    const [showAddForm, setShowAddForm] = useState(false);

    // Clone modal states
    const [showCloneModal, setShowCloneModal] = useState(false);
    const [cloneSource, setCloneSource] = useState<string>("");
    const [cloneTarget, setCloneTarget] = useState<string>("");
    const [cloneCustomMode, setCloneCustomMode] = useState(false);
    const [cloneCustomName, setCloneCustomName] = useState("");

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

    useEffect(() => {
        const handleClickOutside = () => setMenuOpen(null);
        if (menuOpen) {
            document.addEventListener('click', handleClickOutside);
            return () => document.removeEventListener('click', handleClickOutside);
        }
    }, [menuOpen]);

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

    // Get available environments that DON'T have providers
    const getAvailableTargetEnvs = () => {
        const presetEnvs = ['Local', 'Dev', 'Staging', 'Live'];
        const configuredNames = configuredEnvironments.map(e => e.name);
        return presetEnvs.filter(env => !configuredNames.includes(env));
    };

    // Open clone modal
    const openCloneModal = (envName: string) => {
        setCloneSource(envName);
        setCloneTarget("");
        setCloneCustomMode(false);
        setCloneCustomName("");
        setShowCloneModal(true);
        setMenuOpen(null);
    };

    // Execute clone
    const executeClone = () => {
        let targetName = cloneTarget;

        if (cloneCustomMode && cloneCustomName.trim()) {
            targetName = cloneCustomName.trim();
        }

        if (!targetName) {
            showToast("Please select or enter a target environment", "error");
            return;
        }

        // Check if target already has providers
        const smsKey = `env_${targetName}_sms_providers`;
        const emailKey = `env_${targetName}_email_providers`;
        const whatsappKey = `env_${targetName}_whatsapp_providers`;

        const smsData = JSON.parse(localStorage.getItem(smsKey) || '{"providers":[]}');
        const emailData = JSON.parse(localStorage.getItem(emailKey) || '{"providers":[]}');
        const whatsappData = JSON.parse(localStorage.getItem(whatsappKey) || '{"providers":[]}');

        const totalExisting = (smsData.providers?.length || 0) +
            (emailData.providers?.length || 0) +
            (whatsappData.providers?.length || 0);

        if (totalExisting > 0) {
            showToast("Target environment already has providers!", "error");
            return;
        }

        const services = ['sms', 'email', 'whatsapp'];

        services.forEach(service => {
            const sourceKey = `env_${cloneSource}_${service}_providers`;
            const sourceData = localStorage.getItem(sourceKey);
            if (sourceData) {
                const parsed = JSON.parse(sourceData);
                const destKey = `env_${targetName}_${service}_providers`;
                localStorage.setItem(destKey, JSON.stringify({
                    ...parsed,
                    timestamp: Date.now()
                }));
            }
        });

        loadConfiguredEnvironments();
        showToast(`Environment cloned to "${targetName}" successfully!`, "success");
        setShowCloneModal(false);
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

    const handleCloneTargetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        if (value === "__custom__") {
            setCloneCustomMode(true);
            setCloneTarget("");
        } else {
            setCloneCustomMode(false);
            setCloneTarget(value);
        }
    };

    const handleEnvCardClick = (env: EnvironmentProvider, service?: string) => {
        navigate(`/dashboard/provider-config/${env.name}`, {
            state: {
                project,
                environmentName: env.name,
                activeService: service || null
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

    const hasConfiguredEnvs = configuredEnvironments.length > 0;
    const availableTargets = getAvailableTargetEnvs();

    return (
        <div className={hasConfiguredEnvs ? "env-grid-container" : "env-container-simple"}>
            <ToastContainer />
            {hasConfiguredEnvs ? (
                <>
                    <div className="env-grid-header">
                        <h2>{project?.name} - Environments</h2>
                        <p>{configuredEnvironments.length} environment(s) configured</p>
                    </div>

                    <div className="env-grid">
                        {configuredEnvironments.map((env) => (
                            <div key={env.id} className="env-grid-card" onClick={() => handleEnvCardClick(env)}>
                                <div className="env-card-header">
                                    <span className="env-card-icon">{getEnvIcon(env.name)}</span>
                                    <span className="env-card-name">{env.name}</span>

                                    <div className="env-card-menu" onClick={(e) => e.stopPropagation()}>
                                        <button
                                            className="menu-dots-btn"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setMenuOpen(menuOpen === env.id ? null : env.id);
                                            }}
                                        >
                                            ⋮
                                        </button>
                                        {menuOpen === env.id && (
                                            <div className="menu-dropdown">
                                                <button onClick={(e) => {
                                                    e.stopPropagation();
                                                    openCloneModal(env.name);
                                                }}>
                                                    📋 Clone Environment
                                                </button>
                                            </div>
                                        )}
                                    </div>
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
                // Initial Big Centered Card with Illustration
                <div className="env-card-simple">
                    <div className="env-illustration">
                        <div className="illustration-container">
                            <span className="illustration-main">☁️</span>
                            <div className="illustration-services">
                                <span className="illustration-badge sms">💬</span>
                                <span className="illustration-badge email">✉️</span>
                                <span className="illustration-badge whatsapp">💚</span>
                            </div>
                        </div>
                    </div>
                    <h2>{project?.name}</h2>
                    <p>Select or create an environment to configure SMS, Email & WhatsApp providers</p>

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

            {/* Clone Modal */}
            {showCloneModal && (
                <div className="modal-overlay" onClick={() => setShowCloneModal(false)}>
                    <div className="modal-container clone-modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>📋 Clone Environment</h3>
                            <button className="close-btn" onClick={() => setShowCloneModal(false)}>×</button>
                        </div>
                        <div className="modal-body">
                            <div className="clone-source-info">
                                <label>Source Environment</label>
                                <div className="clone-source-name">🌍 {cloneSource}</div>
                            </div>

                            <div className="form-group">
                                <label>Select Target Environment</label>
                                <select
                                    className="provider-select"
                                    value={cloneCustomMode ? "__custom__" : cloneTarget}
                                    onChange={handleCloneTargetChange}
                                >
                                    <option value="">-- Select target --</option>
                                    {availableTargets.map(env => (
                                        <option key={env} value={env}>{env}</option>
                                    ))}
                                    <option value="__custom__">+ Custom Environment</option>
                                </select>
                            </div>

                            {cloneCustomMode && (
                                <div className="form-group">
                                    <label>Custom Environment Name</label>
                                    <input
                                        type="text"
                                        placeholder="Enter environment name"
                                        value={cloneCustomName}
                                        onChange={(e) => setCloneCustomName(e.target.value)}
                                        className="custom-input-small"
                                        autoFocus
                                    />
                                </div>
                            )}
                        </div>
                        <div className="modal-actions">
                            <button className="btn-cancel" onClick={() => setShowCloneModal(false)}>
                                Cancel
                            </button>
                            <button
                                className="btn-create"
                                onClick={executeClone}
                                disabled={!cloneTarget && !cloneCustomName.trim()}
                            >
                                Clone Environment
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}