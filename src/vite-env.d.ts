/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_SENTRY_DSN?: string;
	readonly VITE_GA_MEASUREMENT_ID?: string;
	readonly VITE_ANDROID_APP_ID?: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
