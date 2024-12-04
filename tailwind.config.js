module.exports = {
	content: ["./src/**/*.{html,js}"],
	theme: {
		extend: {
			fontFamily: {
				sfpro: ["SF Pro"],
				segoefluenticons: ["Segoe Fluent Icons"],
			},
			colors: {
				fill_primary_background: "#181818",
				fill_secondary_background: "#1F1F1F",

				fill_border: "#2B2B2B",

				fill_primary_hover: "#2A2D2E",

				fill_item_hover: "#3D3D3D",
        		fill_item_danger_hover: "#CA4949",

				color_primary_text: "#9CA3AE",

				color_secondary_text: "#9D9D9D",
        		color_secondary_text_hover: "#F5F5F5",

				
			},
		},
	},
	plugins: [],
}