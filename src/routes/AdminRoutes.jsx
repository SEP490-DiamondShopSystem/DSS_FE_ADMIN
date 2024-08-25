import React from 'react';
import {Navigate, Route, Routes} from 'react-router-dom';
import {DefaultLayout} from '../layouts/DefaultLayout';
import UserPage from '../pages/Admin/UserPage';
import DashboardPage from '../pages/Admin/DashboardPage';

export const AdminRouters = () => {
	return (
		<DefaultLayout>
			<Routes>
				<Route path="/" element={<Navigate to="/dashboard" />} />
				<Route path="/dashboard" element={<DashboardPage />} />
				<Route path="/users" element={<UserPage />} />

				{/* <Route path="/permission-denied" element={<PermissionDeniedPage />} />
				<Route path="*" element={<NotFoundPage />} /> */}
			</Routes>
		</DefaultLayout>
	);
};
