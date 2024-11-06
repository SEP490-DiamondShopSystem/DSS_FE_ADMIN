module.exports = {
	mode: 'jit',
	content: ['./src/**/*.{js,jsx,ts,tsx}'],
	theme: {
		extend: {
			colors: {
				primary: '#dec986', // A soft, warm primary color
				secondary: '#ffed99', // A light, sunny secondary color
				black: '#000000', // Pure black
				gray: '#707070', // Standard gray
				tintWhite: '#f3f3f3', // Soft white tint
				white: '#ffffff', // Pure white
				red: '#F65252',
				redLight: '#F77D7D', // Light version for hover
				green: '#00FF38',
				greenLight: '#66FF8C', // Light version for hover
				darkGreen: '#3ecc2c',
				blue: '#2898FF', // Bright blue
        
				offWhite: '#f7f7f7', // Slightly off-white
				lightGray: '#dddddd', // Light gray
				lightGray1: '#e4e4e4', // Another light gray shade
				lightGray2: '#d8d8db', // Yet another light gray shade

				// Additional colors
				yellow: '#FFC107', // A strong yellow for alerts or highlights
				orange: '#FF5722', // Bright orange for warnings or accents
				purple: '#9C27B0', // Purple for accents
				teal: '#009688', // Teal for additional richness
				pink: '#E91E63', // A vibrant pink for highlights
				darkBlue: '#1A237E', // Dark blue for deeper tones
				lightBlue: '#03A9F4', // Lighter blue for softer elements

				// Custom shades
				primaryLight: '#F4E1A3', // A lighter shade of primary
				primaryDark: '#BFA05D', // A darker shade of primary
				success: '#4CAF50', // Success color
				info: '#2196F3', // Info color
				warning: '#FF9800', // Warning color
				danger: '#F44336', // Danger color
			},
			fontFamily: {
				body: ['"Open Sans"'],
			},
		},
	},
	plugins: [],
};
