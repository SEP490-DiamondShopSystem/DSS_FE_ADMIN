import React, {useEffect, useState} from 'react';
import {
	DashboardOutlined,
	DeliveredProcedureOutlined,
	GiftOutlined,
	OrderedListOutlined,
	ProductOutlined,
	RightOutlined,
	UserOutlined,
	TagOutlined,
} from '@ant-design/icons';
import {DiamondOutlined} from '@mui/icons-material';
import {Breadcrumb, Layout, Menu, message} from 'antd';
import {Link, Outlet, useLocation, useNavigate} from 'react-router-dom';
import {imageExporter} from '../assets/images';
import TopNavbar from '../components/TopNavBar/TopNavBar';
import {GetUserDetailSelector} from '../redux/selectors';
import {useSelector} from 'react-redux';

const {Footer, Sider, Content} = Layout;
const {SubMenu} = Menu;

const getItem = (label, key, icon, children) => ({key, icon, label, children});

const DefaultLayout = () => {
	const navigate = useNavigate();
	const userDetail = useSelector(GetUserDetailSelector);

	const [collapsed, setCollapsed] = useState(false);
	const location = useLocation();
	const [delivererRole, setDelivererRole] = useState(false);
	const [staffRole, setStaffRole] = useState(false);
	const [adminRole, setAdminRole] = useState(false);
	const [managerRole, setManagerRole] = useState(false);
	const [selectMenu, setSelectMenu] = useState(location.pathname);
	const [openKeys, setOpenKeys] = useState([]);

	const [hasRedirected, setHasRedirected] = useState(false);

	useEffect(() => {
		if (userDetail?.Roles) {
			const isDeliverer = userDetail.Roles.some((role) => role?.RoleName === 'deliverer');
			const isManager = userDetail.Roles.some((role) => role?.RoleName === 'manager');
			const isAdmin = userDetail.Roles.some((role) => role?.RoleName === 'admin');
			const isStaff = userDetail.Roles.some((role) => role?.RoleName === 'staff');
			setDelivererRole(isDeliverer);
			setStaffRole(isStaff);
			setManagerRole(isManager);
			setAdminRole(isAdmin);

			// Define allowed paths for deliverer role, including detail pages
			const allowedDelivererPaths = [
				'^/orders(/\\d+)?$',
				// '^/orders/customize(/\\d+)?$',
			];

			// Check if the current path matches any allowed path
			const currentPath = location.pathname;
			const isAllowedPath = allowedDelivererPaths.some((path) => {
				const regex = new RegExp(path);
				return regex.test(currentPath);
			});

			// Redirect only if deliverer is on a disallowed path and hasn't been redirected yet
			if (isDeliverer && !isAllowedPath && !hasRedirected) {
				navigate('/orders');
				setHasRedirected(true); // Mark as redirected to avoid repeated redirects
			}
		}
	}, [userDetail, navigate, location.pathname, hasRedirected]);

	const items = [
		(adminRole || managerRole || staffRole) &&
			getItem('Dashboard', '/dashboard', <DashboardOutlined />),
		adminRole && getItem('Quản Lí Tài Khoản', '/accounts', <UserOutlined />),
		(managerRole || staffRole) &&
			getItem('Quản Lý Sản Phẩm', '/products', <ProductOutlined />, [
				getItem('Danh Sách Trang Sức', '/products/jewelry-list', <RightOutlined />),
				getItem('Danh Sách Kim Cương', '/products/diamond-list', <DiamondOutlined />),
				getItem(
					'Danh Sách Loại Trang Sức',
					'/products/jewelry-model-category-list',
					<RightOutlined />
				),
				getItem(
					'Danh Sách Mẫu Trang Sức',
					'/products/jewelry-model-list',
					<RightOutlined />
				),
				getItem('Danh Sách Kim Loại', '/products/metal-list', <DiamondOutlined />),
			]),

		(managerRole || staffRole || delivererRole) &&
			getItem('Quản Lí Đặt Hàng', '/orders', <OrderedListOutlined />),

		(managerRole || staffRole) &&
			getItem('Quản Lí Yêu Cầu Thiết Kế', '/request-customize', <OrderedListOutlined />),

		,
		(managerRole || staffRole) && getItem('Quản Lí Khuyến Mãi', '/promotion', <GiftOutlined />),
		(managerRole || staffRole) && getItem('Quản Lí Giảm Giá', '/discount', <TagOutlined />),

		(managerRole || staffRole) &&
			getItem('Quản Lí Phí Vận Chuyển', '/delivery-fee', <DeliveredProcedureOutlined />),
		(managerRole || staffRole) &&
			getItem('Quản Lí Giá Kim Cương', '/dimond-price', <TagOutlined />, [
				getItem(
					'Quản Lí Giá Kim Cương Chính',
					'/diamond-price/main-diamond-price',
					<TagOutlined />
				),
				getItem(
					'Quản Lí Giá Kim Cương Tấm',
					'/diamond-price/side-diamond-price',
					<TagOutlined />
				),
			]),
		(adminRole || managerRole || staffRole) &&
			getItem('Quản Lí Bài Viết', '/blogs', <DeliveredProcedureOutlined />),
	];

	const handleClickMenuItem = (e) => {
		setSelectMenu(e.key);
		navigate(e.key);
	};

	const toggleCollapsed = () => {
		setCollapsed(!collapsed);
	};

	const onOpenChange = (keys) => {
		setOpenKeys(keys);
	};

	const isLoginPage = location.pathname === '/login';
	const isSignUpPage = location.pathname === '/signup';
	const showHeaderFooter = !(isLoginPage || isSignUpPage);

	// Breadcrumb logic
	const breadcrumbItems = location.pathname
		.split('/')
		.filter((path) => path)
		.map((path, index) => (
			<Breadcrumb.Item key={index}>
				<p to={`/${path}`}>{path.charAt(0).toUpperCase() + path.slice(1)}</p>
			</Breadcrumb.Item>
		));

	return (
		<Layout className="min-h-screen flex">
			<Sider
				width={240}
				collapsed={collapsed}
				className="shadow-sm"
				collapsible
				theme="light"
				onCollapse={toggleCollapsed}
			>
				<Link to="/dashboard" className="block h-24 mb-10">
					<img
						src={collapsed ? imageExporter.tinylogo : imageExporter.logo}
						alt="logo"
						className={`block mx-auto mt-2 ${
							collapsed ? 'w-4/5' : 'w-2/5'
						} h-auto object-cover `}
					/>
				</Link>
				<Menu
					onClick={handleClickMenuItem}
					theme="light"
					selectedKeys={[selectMenu]}
					mode="vertical"
					openKeys={openKeys}
					onOpenChange={onOpenChange}
					className="text-gray"
				>
					{items.map((item) =>
						item.children ? (
							<SubMenu key={item.key} icon={item.icon} title={item.label}>
								{item.children.map((child) => (
									<Menu.Item key={child.key}>
										<Link to={child.key} className="font-bold">
											{child.label}
										</Link>
									</Menu.Item>
								))}
							</SubMenu>
						) : (
							item && (
								<Menu.Item key={item.key} icon={item.icon}>
									<Link to={item.key} className="font-bold">
										{item.label}
									</Link>
								</Menu.Item>
							)
						)
					)}
				</Menu>
			</Sider>
			<Layout className="bg-gray-200 min-h-screen flex flex-col">
				{showHeaderFooter && <TopNavbar />}
				<Content className="p-4 flex-1">
					<Breadcrumb className="mb-4">
						<Breadcrumb.Item>
							<Link to="/dashboard">Home</Link>
						</Breadcrumb.Item>
						{breadcrumbItems}
					</Breadcrumb>
					<div className="min-h-[790px] bg-white p-4 overflow-y-auto rounded-lg shadow-md">
						<Outlet />
					</div>
				</Content>
				{showHeaderFooter && (
					<Footer className="text-center font-bold">
						Diamond Admin Page ©{new Date().getFullYear()} Created by Diamond Shop Team
					</Footer>
				)}
			</Layout>
		</Layout>
	);
};

export default DefaultLayout;
