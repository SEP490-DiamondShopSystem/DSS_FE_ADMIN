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
	metalSLice: metalSlice.reducer,
	jewelryModelCategorySlice: jewelryModelCategorySlice.reducer,
	jewelrySlice: jewelrySlice.reducer,
	jewelryModelSlice: jewelryModelSlice.reducer,

});

const persistedReducer = persistReducer(rootPersistConfig, rootReducer);

export const store = configureStore({
	reducer: persistedReducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: false,
		}),
});

export const persistor = persistStore(store);

export * from './selectors'; // Export selectors
