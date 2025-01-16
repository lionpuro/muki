/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	future: {
		hoverOnlyWhenSupported: true,
	},
	theme: {
		extend: {
			boxShadow: {
				main: "0 0px 6px -1px rgb(0 0 0 / 0.1), 0 0px 4px -2px rgb(0 0 0 / 0.1)",
			},
			colors: {
				primary: {
					50: "#f1f6fd",
					100: "#dfecfa",
					200: "#c6def7",
					300: "#9ec9f2",
					400: "#71abea",
					500: "#4f8ce2",
					600: "#3a70d6",
					700: "#315cc4",
					800: "#2d4ca0",
					900: "#29427f",
					950: "#1d2a4e",
				},
			},
		},
	},
	plugins: [],
};
