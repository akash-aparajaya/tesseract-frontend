import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "../hooks/useToast";

// Provider field definitions (same as before)
const PROVIDER_FIELDS_MAP: Record<string, { name: string; label: string; type: string; required?: boolean }[]> = {
    MSG91: [
        { name: "apiKey", label: "API Key", type: "password", required: true },
        { name: "senderId", label: "Sender ID", type: "text", required: true },
        { name: "templateId", label: "Template ID (DLT)", type: "text", required: true },
    ],
    Twilio: [
        { name: "accountSid", label: "Account SID", type: "text", required: true },
        { name: "authToken", label: "Auth Token", type: "password", required: true },
        { name: "phoneNumber", label: "Phone Number", type: "text", required: true },
    ],
    Gupshup: [
        { name: "apiKey", label: "API Key", type: "password", required: true },
        { name: "senderId", label: "Sender ID", type: "text", required: true },
    ],
    Vonage: [
        { name: "apiKey", label: "API Key", type: "password", required: true },
        { name: "apiSecret", label: "API Secret", type: "password", required: true },
        { name: "senderId", label: "Sender ID (optional)", type: "text", required: false },
    ],
    Kaleyra: [
        { name: "apiKey", label: "API Key", type: "password", required: true },
        { name: "senderId", label: "Sender ID", type: "text", required: true },
    ],
    Textlocal: [
        { name: "apiKey", label: "API Key", type: "password", required: true },
        { name: "senderId", label: "Sender ID (optional)", type: "text", required: false },
    ],
    TrueDialog: [
        { name: "apiKey", label: "API Key", type: "password", required: true },
        { name: "apiSecret", label: "API Secret / Token", type: "password", required: true },
        { name: "phoneNumber", label: "Phone Number", type: "text", required: true },
    ],
};

const ALL_PROVIDERS = ["MSG91", "Twilio", "Gupshup", "Vonage", "Kaleyra", "Textlocal", "TrueDialog"];

const getEmptyEnvironment = (providerName: string) => {
    const fields = PROVIDER_FIELDS_MAP[providerName] || [];
    const initialFields: Record<string, string> = {};
    fields.forEach((field) => { initialFields[field.name] = ""; });
    return { id: Date.now() + Math.random(), name: "Local", fields: initialFields };
};

export default function ProjectEditForm() {
    const navigate = useNavigate();
    const location = useLocation();
    const { showToast, ToastContainer } = useToast();
    const project = location.state?.project;

    const [formData, setFormData] = useState({
        project_name: "",
        project_description: "",
        services: [] as string[],
    });
    const [smsProviders, setSmsProviders] = useState<Record<string, { environments: any[] }>>({});

    useEffect(() => {
        if (!project) {
            showToast("Project data not found. Redirecting...", "error");
            setTimeout(() => navigate("/dashboard/project"), 1500);
            return;
        }
        setFormData({
            project_name: project.name,
            project_description: project.description || "",
            services: project.services.map((s: string) => s.toUpperCase()),
        });
        // Load existing SMS config if any (from project.sms_config, or empty)
        setSmsProviders(project.sms_config || {});
    }, [project, navigate, showToast]);

    // Provider management functions
    const initProvider = (providerName: string) => {
        if (smsProviders[providerName]) return;
        setSmsProviders((prev) => ({ ...prev, [providerName]: { environments: [getEmptyEnvironment(providerName)] } }));
    };
    const removeProvider = (providerName: string) => {
        const newState = { ...smsProviders };
        delete newState[providerName];
        setSmsProviders(newState);
    };
    const addEnvironment = (providerName: string) => {
        const provider = smsProviders[providerName];
        if (!provider) return;
        const newEnv = getEmptyEnvironment(providerName);
        newEnv.name = `Environment ${provider.environments.length + 1}`;
        setSmsProviders((prev) => ({
            ...prev,
            [providerName]: { environments: [...provider.environments, newEnv] },
        }));
    };
    const removeEnvironment = (providerName: string, envId: number) => {
        const provider = smsProviders[providerName];
        if (!provider) return;
        const newEnvs = provider.environments.filter((env) => env.id !== envId);
        if (newEnvs.length === 0) {
            removeProvider(providerName);
        } else {
            setSmsProviders((prev) => ({ ...prev, [providerName]: { environments: newEnvs } }));
        }
    };
    const updateEnvName = (providerName: string, envId: number, newName: string) => {
        setSmsProviders((prev) => ({
            ...prev,
            [providerName]: {
                environments: prev[providerName].environments.map((env) =>
                    env.id === envId ? { ...env, name: newName } : env
                ),
            },
        }));
    };
    const updateEnvField = (providerName: string, envId: number, fieldName: string, value: string) => {
        setSmsProviders((prev) => ({
            ...prev,
            [providerName]: {
                environments: prev[providerName].environments.map((env) =>
                    env.id === envId ? { ...env, fields: { ...env.fields, [fieldName]: value } } : env
                ),
            },
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.services.length === 0) {
            showToast("Please select at least one service", "error");
            return;
        }
        if (formData.services.includes("SMS")) {
            const providersSelected = Object.keys(smsProviders);
            if (providersSelected.length === 0) {
                showToast("Please select at least one SMS provider", "error");
                return;
            }
            for (const providerName of providersSelected) {
                const provider = smsProviders[providerName];
                const fieldsDef = PROVIDER_FIELDS_MAP[providerName];
                if (!fieldsDef) continue;
                for (const env of provider.environments) {
                    for (const field of fieldsDef) {
                        if (field.required && !env.fields[field.name]) {
                            showToast(`${providerName} - ${env.name}: ${field.label} is required`, "error");
                            return;
                        }
                    }
                }
            }
        }
        const payload = {
            ...formData,
            sms_config: smsProviders,
        };
        try {
            // Replace with actual API call if you have one
            console.log("Saving configuration:", payload);
            showToast("Provider configuration saved successfully!", "success");
            setTimeout(() => navigate("/dashboard/project"), 1500);
        } catch (error) {
            showToast(error instanceof Error ? error.message : "Error saving configuration", "error");
        }
    };

    if (!project) return <div className="loading">Loading project...</div>;

    return (
        <div className="form-container">
            <ToastContainer />
            <h2>Configure Providers: {project.name}</h2>
            <form onSubmit={handleSubmit}>
                {/* Read-only or editable project details */}
                <div className="form-group">
                    <label>Project Name</label>
                    <input type="text" value={formData.project_name} onChange={(e) => setFormData({ ...formData, project_name: e.target.value })} required />
                </div>
                <div className="form-group">
                    <label>Description</label>
                    <textarea rows={3} value={formData.project_description} onChange={(e) => setFormData({ ...formData, project_description: e.target.value })} />
                </div>
                <div className="form-group">
                    <label>Services</label>
                    <div className="services-grid">
                        {["SMS", "EMAIL"].map((service) => (
                            <div key={service} className="checkbox-item" onClick={() => {
                                setFormData((prev) => ({
                                    ...prev,
                                    services: prev.services.includes(service) ? prev.services.filter(s => s !== service) : [...prev.services, service],
                                }));
                            }}>
                                <input type="checkbox" checked={formData.services.includes(service)} readOnly />
                                <label>{service}</label>
                            </div>
                        ))}
                    </div>
                </div>

                {/* SMS Provider Configuration Section (only shown if SMS is selected) */}
                {formData.services.includes("SMS") && (
                    <div className="form-group sms-providers-section">
                        <label>SMS Providers</label>
                        <p className="helper-text">
                            Select the SMS providers you want to use for this project. For each provider,
                            you can add multiple environments (e.g., Local, Testing, Production) and enter
                            the required credentials.
                        </p>
                        <div className="providers-list">
                            {ALL_PROVIDERS.map((provider) => {
                                const isSelected = !!smsProviders[provider];
                                return (
                                    <div key={provider} className="provider-card">
                                        <div className="provider-header">
                                            <label className="provider-checkbox">
                                                <input
                                                    type="checkbox"
                                                    checked={isSelected}
                                                    onChange={(e) => e.target.checked ? initProvider(provider) : removeProvider(provider)}
                                                />
                                                <span className="provider-name">{provider}</span>
                                            </label>
                                        </div>
                                        {isSelected && (
                                            <div className="provider-environments">
                                                {smsProviders[provider]?.environments.map((env) => (
                                                    <div key={env.id} className="environment-block">
                                                        <div className="env-header">
                                                            <input
                                                                type="text"
                                                                className="env-name-input"
                                                                value={env.name}
                                                                onChange={(e) => updateEnvName(provider, env.id, e.target.value)}
                                                                placeholder="Environment name (e.g., Production)"
                                                            />
                                                            <button
                                                                type="button"
                                                                className="remove-env-btn"
                                                                onClick={() => removeEnvironment(provider, env.id)}
                                                                title="Remove environment"
                                                            >
                                                                ×
                                                            </button>
                                                        </div>
                                                        <div className="env-fields">
                                                            {PROVIDER_FIELDS_MAP[provider]?.map((field) => (
                                                                <div className="form-group" key={field.name}>
                                                                    <label>
                                                                        {field.label}
                                                                        {field.required && <span className="required-star"> *</span>}
                                                                    </label>
                                                                    <input
                                                                        type={field.type}
                                                                        value={env.fields[field.name] || ""}
                                                                        onChange={(e) => updateEnvField(provider, env.id, field.name, e.target.value)}
                                                                        placeholder={`Enter ${field.label}`}
                                                                        required={field.required}
                                                                    />
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}
                                                <button type="button" className="add-env-btn" onClick={() => addEnvironment(provider)}>
                                                    + Add Environment
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                <div className="form-actions">
                    <button type="button" className="btn-cancel" onClick={() => navigate("/dashboard/project")}>Cancel</button>
                    <button type="submit" className="btn-submit">Save Configuration</button>
                </div>
            </form>
        </div>
    );
}