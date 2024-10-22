module.exports = {
	mode: 'jit',
	content: ['./src/**/*.{js,jsx,ts,tsx}'],
	theme: {
		extend: {
			colors: {
				primary: '#dec986',
				second: '#ffed99',
				black: '#000000',
				gray: '#707070',
				tintWhite: '#f3f3f3',
				white: '#ffffff',
				red: '#F65252',
				green: '#00FF38',
				darkGreen: '#3ecc2c',
				blue: '#2898FF',
				// lightGray: '#e9eaec',
				offWhite: '#f7f7f7',
				lightGray: 'dddddd',
				lightGray1: 'e4e4e4',
			},
			fontFamily: {
				body: ['"Open Sans"'],
			},
		},
	},
	plugins: [],
};
