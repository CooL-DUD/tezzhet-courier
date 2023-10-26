/** @format */

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	runtimeConfig: {
		public: {
			baseUrl: "https://api.tezzhet.kz/api",
			wsUrl: "wss://api.tezzhet.kz/ws",
			// baseUrl: "http://192.168.0.147:8005/api",
			// wsUrl: "ws://192.168.0.147:8005/ws",
			// baseUrl: "http://192.168.0.131:8000/api",
			// wsUrl: "ws://192.168.0.131:8000/ws",
		},
	},
	devtools: { enabled: false },
	ssr: false,
	css: ["@/assets/sass/main.scss"],
	modules: [
		"@emanuele-em/nuxt-swipe",
		"@samk-dev/nuxt-vcalendar",
		"@nuxtjs/i18n",
	],
	i18n: {
		lazy: true,
		langDir: "./locales/",
		strategy: "no_prefix",
		locales: [
			{
				name: "Русский",
				code: "ru",
				file: "ru",
			},
			{
				name: "Қазақша",
				code: "kz",
				file: "kz",
			},
		],
		defaultLocale: "ru",
	},
});
