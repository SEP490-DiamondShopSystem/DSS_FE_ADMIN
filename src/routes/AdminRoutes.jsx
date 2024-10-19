import React from 'react';
import {Navigate, Route, Routes} from 'react-router-dom';
import DefaultLayout from '../layouts/DefaultLayout';

import DashboardPage from '../pages/Admin/DashboardPage/DashboardPage';
import DiamondPage from '../pages/Admin/ProductPage/DiamondPage/DiamondPage';
import JewelryPage from '../pages/Admin/ProductPage/JewelryPage/JewelryPage';
import UserPage from '../pages/Admin/UserPage';
import OrderPage from '../pages/Admin/OrderPage/OrderPage';
import OrderDetail from '../pages/Admin/OrderPage/OrderDetail/OrderDetail';
import WarrantyPage from '../pages/Admin/WarrantyPage';
import PromotionPage from '../pages/Admin/PromotionPage';
import LoginPage from '../pages/Admin/LoginPage/LoginPage';
import SignUpPage from '../pages/Admin/SignUpPage/SignUp';

export const AdminRouters = () => {
	return (
		<Routes>
			{/* Các route không cần DefaultLayout */}
			<Route path="/login" element={<LoginPage />} />
			<Route path="/register" element={<SignUpPage />} />

			{/* Các route cần bao quanh bởi DefaultLayout */}
			<Route element={<DefaultLayout />}>
				<Route path="/" element={<Navigate to="/dashboard" />} />
				<Route path="/dashboard" element={<DashboardPage />} />
				<Route path="/users" element={<UserPage />} />
				<Route path="/orders" element={<OrderPage />} />
				<Route path="/orders/:id" element={<OrderDetail />} />
				<Route path="/products/jewelry-list" element={<JewelryPage />} />
				<Route path="/products/diamond-list" element={<DiamondPage />} />
				<Route path="/warranties" element={<WarrantyPage />} />
				<Route path="/promotion" element={<PromotionPage />} />
			</Route>
		</Routes>
	);
};
