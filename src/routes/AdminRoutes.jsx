import React from 'react';
import {Navigate, Route, Routes} from 'react-router-dom';
import DefaultLayout from '../layouts/DefaultLayout';

import AccountPage from '../pages/Admin/AccountPage/AccountPage';
import DashboardPage from '../pages/Admin/DashboardPage/DashboardPage';
import DeliveryPage from '../pages/Admin/DeliveryPage/DeliveryPage';
import LoginPage from '../pages/Admin/LoginPage/LoginPage';
import OrderDetail from '../pages/Admin/OrderPage/OrderDetail/OrderDetail';
import OrderPage from '../pages/Admin/OrderPage/OrderPage';
import DiamondPage from '../pages/Admin/ProductPage/DiamondPage/DiamondPage';
import JewelryPage from '../pages/Admin/ProductPage/JewelryPage/JewelryPage';
import PromotionPage from '../pages/Admin/PromotionPage';
import SignUpPage from '../pages/Admin/SignUpPage/SignUp';
import WarrantyPage from '../pages/Admin/WarrantyPage';
import PrivateRoute from './PrivateRoute';

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
						<PrivateRoute roles={['deliverer', 'staff', 'admin', 'manager']}>
							<DashboardPage />
						</PrivateRoute>
					}
				/>
				<Route
					path="/accounts"
					element={
						<PrivateRoute roles={['deliverer', 'staff', 'admin', 'manager']}>
							<AccountPage />
						</PrivateRoute>
					}
				/>
				<Route
					path="/orders"
					element={
						<PrivateRoute roles={['deliverer', 'staff', 'admin', 'manager']}>
							<OrderPage />
						</PrivateRoute>
					}
				/>
				<Route
					path="/orders/:id"
					element={
						<PrivateRoute roles={['deliverer', 'staff', 'admin', 'manager']}>
							<OrderDetail />
						</PrivateRoute>
					}
				/>
				<Route
					path="/products/jewelry-list"
					element={
						<PrivateRoute roles={['deliverer', 'staff', 'admin', 'manager']}>
							<JewelryPage />
						</PrivateRoute>
					}
				/>
				<Route
					path="/products/diamond-list"
					element={
						<PrivateRoute roles={['deliverer', 'staff', 'admin', 'manager']}>
							<DiamondPage />
						</PrivateRoute>
					}
				/>
				<Route
					path="/warranties"
					element={
						<PrivateRoute roles={['deliverer', 'staff', 'admin', 'manager']}>
							<WarrantyPage />
						</PrivateRoute>
					}
				/>
				<Route
					path="/promotion"
					element={
						<PrivateRoute roles={['deliverer', 'staff', 'admin', 'manager']}>
							<PromotionPage />
						</PrivateRoute>
					}
				/>
				<Route
					path="/deliveries"
					element={
						<PrivateRoute roles={['deliverer', 'staff', 'admin', 'manager']}>
							<DeliveryPage />
						</PrivateRoute>
					}
				/>
			</Route>
		</Routes>
	);
};
