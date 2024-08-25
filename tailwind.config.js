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
			},
			fontFamily: {
				body: ['"Open Sans"'],
			},
		},
	},
	plugins: [],
};
