import { ProviderField } from "./types";

export const SMS_PROVIDER_FIELDS: Record<string, ProviderField[]> = {
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

export const EMAIL_PROVIDER_FIELDS: Record<string, ProviderField[]> = {
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

export const WHATSAPP_PROVIDER_FIELDS: Record<string, ProviderField[]> = {
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

export const SERVICE_CONFIG = {
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