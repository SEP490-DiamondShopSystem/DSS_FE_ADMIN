import React from 'react';
import {Navigate, Route, Routes} from 'react-router-dom';

import {DefaultLayout} from '../layouts/DefaultLayout';
import DashboardPage from '../pages/Admin/DashboardPage/DashboardPage';
import DiamondPage from '../pages/Admin/ProductPage/DiamondPage/DiamondPage';
import JewelryPage from '../pages/Admin/ProductPage/JewelryPage/JewelryPage';
import UserPage from '../pages/Admin/UserPage';
import OrderPage from '../pages/Admin/OrderPage/OrderPage';
import OrderDetail from '../pages/Admin/OrderPage/OrderDetail/OrderDetail';
import WarrantyPage from '../pages/Admin/WarrantyPage';

export const AdminRouters = () => {
	return (
		<DefaultLayout>
			<Routes>
				<Route path="/" element={<Navigate to="/dashboard" />} />
				<Route path="/dashboard" element={<DashboardPage />} />
				<Route path="/users" element={<UserPage />} />
				<Route path="/orders" element={<OrderPage />} />
				<Route path="/orders/:id" element={<OrderDetail />} />
				<Route path="/products/jewelry-list" element={<JewelryPage />} />
				<Route path="/products/diamond-list" element={<DiamondPage />} />
				<Route path="/warranties" element={<WarrantyPage />} />

				{/* <Route path="/permission-denied" element={<PermissionDeniedPage />} />
				<Route path="*" element={<NotFoundPage />} /> */}
			</Routes>
		</DefaultLayout>
	);
};
