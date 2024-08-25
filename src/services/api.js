import axios from 'axios';

const API = 'https://reqres.in/api';

// let accessToken =
// 	localStorage.getItem('user') && JSON.parse(localStorage.getItem('user')).token.accessToken;

// let refreshToken =
// 	localStorage.getItem('user') && JSON.parse(localStorage.getItem('user')).token.refreshToken;

// let userId = localStorage.getItem('user') && JSON.parse(localStorage.getItem('user')).user.id;

// console.log('accessToken', accessToken);
// console.log('refreshToken', refreshToken);
// console.log('userId', userId);

export const api = axios.create({
	baseURL: API,
	// headers: {
	// 	authentication: accessToken,
	// 	'x-client-id': userId,
	// 	refresh: refreshToken,
	// 	'ngrok-skip-browser-warning': 'true', // Add this line for ngrok skip browser warning
	// },
});

// Axios response interceptor to handle token expiration and renewal
// api.interceptors.response.use(
// 	(response) => {
// 		return response;
// 	},
// 	async (error) => {
// 		if (error.response.status === 401) {
// 			console.log('401 error');
// 			window.location.href = '/';
// 		}
// 		if (error.response.status === 403) {
// 			console.log('403 error');
// 			window.location.href = '/permission-denied';
// 			toast.error('403 error');
// 		}
// 		return Promise.reject(error);
// 	}
// );
api.interceptors.response.use(
	function (response) {
		// Any status code that lie within the range of 2xx cause this function to trigger
		return response.data ? response.data : {statusCode: response.status};
	},
	function (error) {
		// Any status code that falls outside the range of 2xx cause this function to trigger
		let res = {};
		if (error.response) {
			// Request made and server responded
			res.data = error.response.data;
			res.status = error.response.status;
			res.header = error.response.header;
		} else if (error.request) {
			// The request was made but no response was received
			console.log(error.request);
		} else {
			// Something happened in setting up the require that trigger an Error
			console.log('Error', error.message);
		}
		return res;
		// return Promise.reject(error);
	}
);
