export const setLocalStorage = (name, items) => {
	localStorage.setItem(name, items);
};

export const getLocalStorage = (name) => {
	localStorage.getItem(name);
	// if (data) {
	// 	return JSON.parse(data);
	// }
};

export const removeLocalStorage = (key) => {
	try {
		localStorage.removeItem(key);
	} catch (error) {
		console.error(`Error removing ${key} from localStorage:`, error);
	}
};
