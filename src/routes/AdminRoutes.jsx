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
import JewelryModelCategoryPage from '../pages/Admin/ProductPage/JewelryPage/JewelryModelCategoryPage';
import JewelryModelPage from '../pages/Admin/ProductPage/JewelryPage/JewelryModelPage';
import PromotionPage from '../pages/Admin/PromotionPage';
import DiscountPage from '../pages/Admin/DiscountPage';
import SignUpPage from '../pages/Admin/SignUpPage/SignUp';
import WarrantyPage from '../pages/Admin/WarrantyPage';
import PrivateRoute from './PrivateRoute';
import AccountDetail from '../pages/Admin/AccountPage/AccountDetail/AccountDetail';
import MainDiamondPricePage from '../pages/Admin/DiamondPricePage/MainDiamondPricePage';
import MetalPage from '../pages/Admin/ProductPage/JewelryPage/MetalPage';
import OrderCustomizePage from '../pages/Admin/OrderCustomize/OrderCustomize';
import DeliveryFeePage from '../pages/Admin/DeliveryFeePage';
import OrderCustomizeDetail from '../pages/Admin/OrderCustomize/OrderDetail/OrderDetail';
import SideDiamondPricePage from '../pages/Admin/DiamondPricePage/SideDiamondPricePage';
import BlogPage from '../pages/Admin/BlogPage';
export const AdminRouters = () => {
	return (
		<Routes>
			<Route path="/login" element={<LoginPage />} />
			<Route path="/register" element={<SignUpPage />} />

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
						<PrivateRoute roles={['staff', 'admin', 'manager']}>
							<AccountPage />
						</PrivateRoute>
					}
				/>
				<Route
					path="/accounts/:id"
					element={
						<PrivateRoute roles={['staff', 'admin', 'manager']}>
							<AccountDetail />
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
					path="/request-customize"
					element={
						<PrivateRoute roles={['deliverer', 'staff', 'admin', 'manager']}>
							<OrderCustomizePage />
						</PrivateRoute>
					}
				/>
				<Route
					path="/request-customize/:id"
					element={
						<PrivateRoute roles={['deliverer', 'staff', 'admin', 'manager']}>
							<OrderCustomizeDetail />
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
					path="/products/jewelry-model-category-list"
					element={
						<PrivateRoute roles={['deliverer', 'staff', 'admin', 'manager']}>
							<JewelryModelCategoryPage />
						</PrivateRoute>
					}
				/>
				<Route
					path="/products/jewelry-model-list"
					element={
						<PrivateRoute roles={['deliverer', 'staff', 'admin', 'manager']}>
							<JewelryModelPage />
						</PrivateRoute>
					}
				/>
				<Route
					path="/products/metal-list"
					element={
						<PrivateRoute roles={['deliverer', 'staff', 'admin', 'manager']}>
							<MetalPage />
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
					path="/discount"
					element={
						<PrivateRoute roles={['staff', 'admin', 'manager']}>
							<DiscountPage />
						</PrivateRoute>
					}
				/>
				<Route
					path="/diamond-price/main-diamond-price"
					element={
						<PrivateRoute roles={['deliverer', 'staff', 'admin', 'manager']}>
							<MainDiamondPricePage />
						</PrivateRoute>
					}
				/>
				<Route
					path="/diamond-price/side-diamond-price"
					element={
						<PrivateRoute roles={['deliverer', 'staff', 'admin', 'manager']}>
							<SideDiamondPricePage />
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
				<Route
					path="/delivery-fee"
					element={
						<PrivateRoute roles={['staff', 'admin', 'manager']}>
							<DeliveryFeePage />
						</PrivateRoute>
					}
				/>
				<Route
					path="/blogs"
					element={
						<PrivateRoute roles={['staff', 'admin', 'manager']}>
							<BlogPage />
						</PrivateRoute>
					}
				/>
			</Route>
		</Routes>
	);
};
