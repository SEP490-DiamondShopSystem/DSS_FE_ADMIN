import {combineReducers, configureStore} from '@reduxjs/toolkit';
import {persistReducer, persistStore} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import {userSlice} from './slices/userSlice';
import {userLoginSlice} from './slices/userLoginSlice';
import {orderSlice} from './slices/orderSlice';
import {deliverySlice} from './slices/deliverySlice';
import {promotionSlice} from './slices/promotionSlice';
import {diamondSlice} from './slices/diamondSlice';
import {diamondPriceSlice} from './slices/diamondPriceSlice';
import {metalSlice} from './slices/jewelry/metalSlice';
import {jewelryModelCategorySlice} from './slices/jewelry/jewelryModelCategorySlice';
import {jewelrySlice} from './slices/jewelry/jewelrySlice';
import {jewelryModelSlice} from './slices/jewelry/jewelryModelSlice';
import {paymentSlice} from './slices/paymentSlice';
import {distanceSlice} from './slices/distanceSlice';
import {sizeSlice} from './slices/jewelry/sizeSlice';
import {enumSlice} from './slices/jewelry/enumSlice';
import {shapeSlice} from './slices/shapeSlice';
import {discountSlice} from './slices/discountSlice';
import {customizeSlice} from './slices/customizeSlice';
import {deliveryFeeSlice} from './slices/deliveryFeeSlice';
import {locationSlice} from './slices/locationSlice';
import {blogSlice} from './slices/blogSlice';
import {dashboardSlice} from './slices/dashboard';
import {fileSlice} from './slices/filesSlice';
import {logSlice} from './slices/logSlice';
import {configSlice} from './slices/configSlice';
import {criteriaRangeSlice} from './slices/criteriaRangeSlice';
import {orderFileSlice} from './slices/orderFileSlice';
import {transactionSlice} from './slices/transactionSlice';
const rootPersistConfig = {
	key: 'root',
	storage,
	safelist: ['userSlice'], // Add 'transactionSlice' to persist
};

const rootReducer = combineReducers({
	userSlice: userSlice.reducer,
	userLoginSlice: userLoginSlice.reducer,
	orderSlice: orderSlice.reducer,
	deliverySlice: deliverySlice.reducer,
	promotionSlice: promotionSlice.reducer,
	diamondSlice: diamondSlice.reducer,
	diamondPriceSlice: diamondPriceSlice.reducer,
	metalSlice: metalSlice.reducer,
	jewelryModelCategorySlice: jewelryModelCategorySlice.reducer,
	jewelrySlice: jewelrySlice.reducer,
	jewelryModelSlice: jewelryModelSlice.reducer,
	paymentSlice: paymentSlice.reducer,
	distanceSlice: distanceSlice.reducer,
	sizeSlice: sizeSlice.reducer,
	enumSlice: enumSlice.reducer,
	shapeSlice: shapeSlice.reducer,
	discountSlice: discountSlice.reducer,
	deliveryFeeSlice: deliveryFeeSlice.reducer,
	locationSlice: locationSlice.reducer,
	customizeSlice: customizeSlice.reducer,
	blogSlice: blogSlice.reducer,
	dashboardSlice: dashboardSlice.reducer,
	fileSlice: fileSlice.reducer,
	orderFileSlice: orderFileSlice.reducer,
	logSlice: logSlice.reducer,
	configSlice: configSlice.reducer,
	criteriaRangeSlice: criteriaRangeSlice.reducer,
	transactionSlice: transactionSlice.reducer,
});

const persistedReducer = persistReducer(rootPersistConfig, rootReducer);

export const store = configureStore({
	reducer: persistedReducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: false,
			// immutableCheck: false,
		}),
});

export const persistor = persistStore(store);

export * from './selectors'; // Export selectors
