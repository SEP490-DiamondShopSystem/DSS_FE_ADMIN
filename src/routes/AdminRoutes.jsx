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
import PrivateRoute from './PrivateRoute';
import DeliveryPage from '../pages/Admin/DeliveryPage/DeliveryPage';

export const AdminRouters = () => {
	return (
		<Routes>
			{/* Các route không cần DefaultLayout */}
			<Route path="/login" element={<LoginPage />} />
			<Route path="/register" element={<SignUpPage />} />

			{/* Các route cần bao quanh bởi DefaultLayout */}
			<Route element={<DefaultLayout />}>
				<Route path="/" element={<Navigate to="/dashboard" />} />
				<Route
					path="/dashboard"
					element={
						<PrivateRoute roles={['staff', 'admin', 'manager']}>
							<DashboardPage />
						</PrivateRoute>
					}
				/>
				<Route
					path="/users"
					element={
						<PrivateRoute roles={['staff', 'admin', 'manager']}>
							<UserPage />
						</PrivateRoute>
					}
				/>
				<Route
					path="/orders"
					element={
						<PrivateRoute roles={['staff', 'admin', 'manager']}>
							<OrderPage />
						</PrivateRoute>
					}
				/>
				<Route
					path="/orders/:id"
					element={
						<PrivateRoute roles={['staff', 'admin', 'manager']}>
							<OrderDetail />
						</PrivateRoute>
					}
				/>
				<Route
					path="/products/jewelry-list"
					element={
						<PrivateRoute roles={['staff', 'admin', 'manager']}>
							<JewelryPage />
						</PrivateRoute>
					}
				/>
				<Route
					path="/products/diamond-list"
					element={
						<PrivateRoute roles={['staff', 'admin', 'manager']}>
							<DiamondPage />
						</PrivateRoute>
					}
				/>
				<Route
					path="/warranties"
					element={
						<PrivateRoute roles={['staff', 'admin', 'manager']}>
							<WarrantyPage />
						</PrivateRoute>
					}
				/>
				<Route
					path="/promotion"
					element={
						<PrivateRoute roles={['staff', 'admin', 'manager']}>
							<PromotionPage />
						</PrivateRoute>
					}
				/>
				<Route
					path="/deliveries"
					element={
						<PrivateRoute roles={['staff', 'admin', 'manager']}>
							<DeliveryPage />
						</PrivateRoute>
					}
				/>
			</Route>
		</Routes>
	);
};
