import React from 'react';
import {Navigate, Route, Routes} from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import {DefaultLayout} from '../layouts/DefaultLayout';
import DashboardPage from '../pages/Admin/DashboardPage/DashboardPage';
import DiamondPage from '../pages/Admin/ProductPage/DiamondPage/DiamondPage';
import JewelryPage from '../pages/Admin/ProductPage/JewelryPage/JewelryPage';
import UserPage from '../pages/Admin/UserPage';
import OrderPage from '../pages/Admin/OrderPage/OrderPage';
import OrderDetail from '../pages/Admin/OrderPage/OrderDetail/OrderDetail';
import WarrantyPage from '../pages/Admin/WarrantyPage';
import PromotionPage from '../pages/Admin/PromotionPage';
import LoginPage from '../pages/Admin/LoginPage/LoginPage';

export const AdminRouters = () => {
	return (
		<DefaultLayout>
			<Routes>
				<Route path="/" element={<Navigate to="/dashboard" />} />
				<Route
					path="/dashboard"
					element={
						<PrivateRoute>
							<DashboardPage />
						</PrivateRoute>
					}
				/>
				<Route path="/login" element={<LoginPage />} />
				<Route
					path="/users"
					element={
						<PrivateRoute>
							<UserPage />
						</PrivateRoute>
					}
				/>
				<Route
					path="/orders"
					element={
						<PrivateRoute>
							<OrderPage />
						</PrivateRoute>
					}
				/>
				<Route
					path="/orders/:id"
					element={
						<PrivateRoute>
							<OrderDetail />
						</PrivateRoute>
					}
				/>
				<Route
					path="/products/jewelry-list"
					element={
						<PrivateRoute>
							<JewelryPage />
						</PrivateRoute>
					}
				/>
				<Route
					path="/products/diamond-list"
					element={
						<PrivateRoute>
							<DiamondPage />
						</PrivateRoute>
					}
				/>
				<Route
					path="/warranties"
					element={
						<PrivateRoute>
							<WarrantyPage />
						</PrivateRoute>
					}
				/>
				<Route
					path="/promotion"
					element={
						<PrivateRoute>
							<PromotionPage />
						</PrivateRoute>
					}
				/>

				{/* <Route path="/permission-denied" element={<PermissionDeniedPage />} />
				<Route path="*" element={<NotFoundPage />} /> */}
			</Routes>
		</DefaultLayout>
	);
};
