import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;
const API_DEV = import.meta.env.VITE_API_DEV;
const API_DEVTUNNEL = import.meta.env.VITE_DEVTUNNEL_API;

// Khởi tạo axios instance
export const api = axios.create({
	baseURL: API_DEV,
	headers: {
		'Content-Type': 'application/json',
	},
});

// Thêm interceptor để tự động thêm token vào mỗi request
api.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem('accessToken');
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

// Axios response interceptor để xử lý token expired và refresh
api.interceptors.response.use(
	(response) => {
		// Bất kỳ mã trạng thái nào nằm trong phạm vi 2xx sẽ kích hoạt chức năng này
		return response.data ? response.data : {statusCode: response.status};
	},
	(error) => {
		// Bất kỳ mã trạng thái nào nằm ngoài phạm vi 2xx sẽ kích hoạt chức năng này
		let res = {};
		if (error.response) {
			// Yêu cầu đã được gửi và server đã phản hồi
			res.data = error.response.data;
			res.status = error.response.status;
		} else if (error.request) {
			// Yêu cầu đã được gửi nhưng không có phản hồi nào
		} else {
			// Một điều gì đó đã xảy ra khi thiết lập yêu cầu
		}
		return Promise.reject(res);
	}
);
