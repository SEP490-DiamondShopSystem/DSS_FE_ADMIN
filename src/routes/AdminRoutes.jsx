import React from 'react';
import {Navigate, Route, Routes} from 'react-router-dom';
import {DefaultLayout} from '../layouts/DefaultLayout';
import DashboardPage from '../pages/Admin/DashboardPage/DashboardPage';
import DiamondPage from '../pages/Admin/ProductPage/DiamondPage/DiamondPage';
import JewelryPage from '../pages/Admin/ProductPage/JewelryPage/JewelryPage';
import UserPage from '../pages/Admin/UserPage';

export const AdminRouters = () => {
	return (
		<DefaultLayout>
			<Routes>
				<Route path="/" element={<Navigate to="/dashboard" />} />
				<Route path="/dashboard" element={<DashboardPage />} />
				<Route path="/users" element={<UserPage />} />
				{/* <Route path="/products" element={<ProductPage />} /> */}
				<Route path="/products/jewelry-list" element={<JewelryPage />} />
				<Route path="/products/diamond-list" element={<DiamondPage />} />

				{/* <Route path="/permission-denied" element={<PermissionDeniedPage />} />
				<Route path="*" element={<NotFoundPage />} /> */}
			</Routes>
		</DefaultLayout>
	);
};
