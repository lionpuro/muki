/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
		future: {
		hoverOnlyWhenSupported: true,
	},
	theme: {
		extend: {
			colors: {
				primary: {
					50: "#f1f5fc",
					100: "#e6ebf9",
					200: "#d2daf3",
					300: "#b6c2eb",
					400: "#98a3e1",
					500: "#7f85d5",
					600: "#6a6ac8",
					700: "#5654ae",
					800: "#47468d",
					900: "#3e3f71",
					950: "#242442",
				},
			},
		},
	},
	plugins: [],
};
