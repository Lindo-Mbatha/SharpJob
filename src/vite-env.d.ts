/// <reference types="vite/client" />

declare const __APP_VERSION__: string;

interface ImportMetaEnv {
	readonly VITE_SENTRY_DSN?: string;
	readonly VITE_GA_MEASUREMENT_ID?: string;
	readonly VITE_ANDROID_APP_ID?: string;
	readonly VITE_SUPABASE_URL: string;
	readonly VITE_SUPABASE_ANON_KEY: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
