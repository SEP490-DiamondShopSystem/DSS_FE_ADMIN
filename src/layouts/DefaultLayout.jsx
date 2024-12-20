import React, {useEffect, useState} from 'react';
import {
	DashboardOutlined,
	UserOutlined,
	ProductOutlined,
	OrderedListOutlined,
	GiftOutlined,
	TagOutlined,
	DeliveredProcedureOutlined,
	SettingOutlined,
	EditOutlined, // New import for blogs
	SlidersFilled,
	MenuUnfoldOutlined,
	LogoutOutlined,
	MenuFoldOutlined, // More descriptive icon for customization requests
} from '@ant-design/icons';
import {
	DiamondOutlined, // Kept for diamond-related items
	CategoryOutlined, // New import for jewelry model categories
} from '@mui/icons-material';
import {Breadcrumb, message, Layout, Menu, Drawer, Button, Tooltip} from 'antd';
import {Link, Outlet, useLocation, useNavigate} from 'react-router-dom';
import {imageExporter} from '../assets/images';
import TopNavbar from '../components/TopNavBar/TopNavBar';
import {logout} from '../redux/slices/userLoginSlice';
import {GetUserDetailSelector} from '../redux/selectors';
import {useDispatch, useSelector} from 'react-redux';

const {Footer, Sider, Content} = Layout;
const {SubMenu} = Menu;

const getItem = (label, key, icon, children) => ({key, icon, label, children});

const DefaultLayout = () => {
	const dispatch = useDispatch();

	const navigate = useNavigate();
	const userDetail = useSelector(GetUserDetailSelector);

	const [collapsed, setCollapsed] = useState(false);
	const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
	const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
	const location = useLocation();
	const [delivererRole, setDelivererRole] = useState(false);
	const [staffRole, setStaffRole] = useState(false);
	const [adminRole, setAdminRole] = useState(false);
	const [managerRole, setManagerRole] = useState(false);
	const [selectMenu, setSelectMenu] = useState(location.pathname);
	const [openKeys, setOpenKeys] = useState([]);

	const [hasRedirected, setHasRedirected] = useState(false);
	const [showSignOutPopup, setShowSignOutPopup] = useState(false);

	const routeTranslations = {
		'/dashboard': 'Bảng Điều Khiển',
		'/accounts': 'Quản Lý Tài Khoản',
		'/products': 'Sản Phẩm',
		'/products/diamond-list': 'Danh Sách Kim Cương',
		'/products/jewelry-list': 'Danh Sách Trang Sức',
		'/products/jewelry-model-list': 'Danh Sách Mẫu Trang Sức',
		'/products/metal-list': 'Danh Sách Vật Liệu',
		'/orders': 'Quản Lý Đặt Hàng',
		'/request-customize': 'Các Yêu Cầu Thiết Kế',
		'/promotion': 'Khuyến Mãi',
		'/discount': 'Giảm Giá',
		'/delivery-fee': 'Phí Vận Chuyển',
		'/diamond-price': 'Giá Kim Cương',
		'/blogs': 'Quản Lí Bài Viết',
		'/config': 'Cài Đặt Hệ Thống',
		'/diamond-price/main-diamond-price': 'Bảng Giá Kim Cương Chính',
		'/diamond-price/side-diamond-price': 'Bảng Giá Kim Cương Tấm',
		'/jewelry-model-category-list': 'Danh Sách Loại Trang Sức',
	};

	// Responsive handling
	useEffect(() => {
		const handleResize = () => {
			const mobile = window.innerWidth <= 768;
			setIsMobile(mobile);

			// Auto-collapse sidebar on mobile
			if (mobile) {
				setCollapsed(true);
			}
		};

		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	// Role and redirection logic (same as previous implementation)
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

			const allowedDelivererPaths = ['^/orders(/\\d+)?$'];
			const currentPath = location.pathname;
			const isAllowedPath = allowedDelivererPaths.some((path) => {
				const regex = new RegExp(path);
				return regex.test(currentPath);
			});
			if (isDeliverer && !isAllowedPath && !hasRedirected) {
				navigate('/orders');
				setHasRedirected(true);
			}
			if (isAdmin && !isAllowedPath && !hasRedirected) {
				navigate('/accounts');
				setHasRedirected(true);
			}
		}
	}, [userDetail, navigate, location.pathname, hasRedirected]);

	// Menu items (same as previous implementation)
	const items = [
		(managerRole || staffRole) && getItem('Dashboard', '/dashboard', <DashboardOutlined />),
		adminRole && getItem('Quản Lí Tài Khoản', '/accounts', <UserOutlined />),

		(managerRole || staffRole) &&
			getItem('Quản Lý Sản Phẩm', '/products', <ProductOutlined />, [
				getItem('Danh Sách Kim Cương', '/products/diamond-list', <DiamondOutlined />),
				getItem('Danh Sách Trang Sức', '/products/jewelry-list', <ProductOutlined />),
				getItem(
					'Danh Sách Mẫu Trang Sức',
					'/products/jewelry-model-list',
					<EditOutlined />
				),
			]),
		managerRole && getItem('Danh Sách Kim Loại', '/products/metal-list', <DiamondOutlined />),
		(managerRole || staffRole || delivererRole) &&
			getItem('Quản Lí Đặt Hàng', '/orders', <OrderedListOutlined />),

		(managerRole || staffRole) &&
			getItem('Các Yêu Cầu Thiết Kế', '/request-customize', <SlidersFilled />),

		(managerRole || staffRole) && getItem('Quản Lí Khuyến Mãi', '/promotion', <GiftOutlined />),
		(managerRole || staffRole) && getItem('Quản Lí Giảm Giá', '/discount', <TagOutlined />),

		managerRole &&
			getItem('Quản Lí Phí Vận Chuyển', '/delivery-fee', <DeliveredProcedureOutlined />),
		managerRole &&
			getItem('Quản Lí Giá Kim Cương', '/dimond-price', <TagOutlined />, [
				getItem(
					'Quản Lí Giá Kim Cương Chính',
					'/diamond-price/main-diamond-price',
					<DiamondOutlined />
				),
				getItem(
					'Quản Lí Giá Kim Cương Tấm',
					'/diamond-price/side-diamond-price',
					<DiamondOutlined />
				),
			]),

		(managerRole || staffRole) && getItem('Quản Lí Bài Viết', '/blogs', <EditOutlined />),
		adminRole &&
			getItem(
				'Danh Sách Loại Trang Sức',
				'/jewelry-model-category-list',
				<CategoryOutlined />
			),
		adminRole && getItem('Cài Đặt Hệ Thống', '/config', <SettingOutlined />),
	];

	const handleClickMenuItem = (e) => {
		setSelectMenu(e.key);
		navigate(e.key);

		// Close mobile menu when an item is selected
		if (isMobile) {
			setMobileMenuVisible(false);
		}
	};

	const toggleCollapsed = () => {
		setCollapsed(!collapsed);
	};

	const onOpenChange = (keys) => {
		setOpenKeys(keys);
	};

	// Mobile menu toggle
	const toggleMobileMenu = () => {
		setMobileMenuVisible(!mobileMenuVisible);
	};

	const isLoginPage = location.pathname === '/login';
	const isSignUpPage = location.pathname === '/signup';
	const showHeaderFooter = !(isLoginPage || isSignUpPage);

	const breadcrumbItems = location.pathname
		.split('/')
		.filter((path) => path)
		.map((path, index) => {
			// Xây dựng đường dẫn đầy đủ cho từng cấp
			const fullPath = `/${location.pathname
				.split('/')
				.slice(1, index + 2)
				.join('/')}`;

			// Lấy bản dịch tiếng Việt cho route nếu có
			const breadcrumbLabel =
				routeTranslations[fullPath] || path.charAt(0).toUpperCase() + path.slice(1);

			return (
				<Breadcrumb.Item key={index}>
					<Link to={fullPath}>{breadcrumbLabel}</Link>
				</Breadcrumb.Item>
			);
		});

	// Thêm mục "Home" không nhấn được
	breadcrumbItems.unshift(
		<Breadcrumb.Item key="home">
			<span>Trang Chủ</span>
		</Breadcrumb.Item>
	);
	// Logout logic
	const handleLogout = () => {
		dispatch(logout());
		message.success('Logged out successfully!');
		navigate('/login');
	};

	return (
		<Layout className="min-h-screen flex">
			{/* Mobile Header for Navigation Toggle */}
			{isMobile && showHeaderFooter && (
				<div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm flex items-center p-2">
					<Button
						type="text"
						icon={mobileMenuVisible ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
						onClick={toggleMobileMenu}
						className="mr-2"
					/>
					<Link to="" className="flex-grow text-center">
						<img src={imageExporter.logo} alt="logo" className="h-10 mx-auto" />
					</Link>
				</div>
			)}

			{/* Mobile Menu Drawer */}
			{isMobile && (
				<Drawer
					title="Menu"
					placement="left"
					onClose={toggleMobileMenu}
					visible={mobileMenuVisible}
					className="menu-drawer"
					bodyStyle={{padding: 0, display: 'flex', flexDirection: 'column'}} // Add flexbox styles here
				>
					<Menu
						onClick={handleClickMenuItem}
						theme="light"
						selectedKeys={[selectMenu]}
						mode="inline"
						openKeys={openKeys}
						onOpenChange={onOpenChange}
						className="text-gray"
						style={{flexGrow: 1}} // This will make the menu take up available space
					>
						{items.map((item) =>
							item?.children ? (
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
					<div className="flex-grow"></div>
					<div className="w-full">
						<Tooltip className="w-full items-center" title="Log out" placement="bottom">
							<Button
								icon={<LogoutOutlined />}
								type="primary"
								shape="round"
								size="large"
								onClick={() => setShowSignOutPopup(true)}
								className="w-80 items-center justify-self-center transition-all duration-300 ease-in-out hover:bg-red hover:text-white"
								style={{
									backgroundColor: '#FF4D4F', // Red background
									color: '#fff', // White text color
									borderRadius: '8px',
									margin: '1rem',
									fontWeight: 'bold',
								}}
							>
								Đăng Xuất
							</Button>
						</Tooltip>
						{showSignOutPopup && (
							<div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
								<div className="bg-white p-4 rounded-lg">
									<p className="text-center mb-4">Bạn có muốn đăng xuất?</p>
									<div className="flex gap-5 justify-between">
										<Button onClick={handleLogout} type="primary">
											Đăng Xuất{' '}
										</Button>
										<Button onClick={() => setShowSignOutPopup(false)}>
											Hủy
										</Button>
									</div>
								</div>
							</div>
						)}
					</div>
				</Drawer>
			)}

			{/* Desktop Sidebar */}
			{!isMobile && (
				<Sider
					width={240}
					collapsed={collapsed}
					className="shadow-sm"
					collapsible
					theme="light"
					onCollapse={toggleCollapsed}
				>
					<Link to="" className="block h-24 mb-10">
						<img
							src={collapsed ? imageExporter.tinylogo : imageExporter.logo}
							alt="logo"
							className={`block mx-auto mt-2 ${
								collapsed ? 'w-4/5' : 'w-2/5'
							} h-auto object-cover`}
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
							item?.children ? (
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
			)}

			<Layout className="bg-white min-h-screen flex flex-col">
				{!isMobile && showHeaderFooter && <TopNavbar />}
				<Content className={`p-4 flex-1 ${isMobile ? 'mt-16' : ''}`}>
					<Breadcrumb className="mb-4">
						<Breadcrumb.Item></Breadcrumb.Item>
						{breadcrumbItems}
					</Breadcrumb>
					<div
						className={`
                        bg-white p-4 overflow-y-auto rounded-lg shadow-md 
                        ${isMobile ? 'min-h-[calc(100vh-200px)]' : 'min-h-[790px]'}
                    `}
					>
						<Outlet />
					</div>
				</Content>
				{showHeaderFooter && (
					<Footer
						className={`
                        text-center font-bold 
                        ${isMobile ? 'text-xs p-2' : ''}
                    `}
					>
						Diamond Admin Page ©{new Date().getFullYear()}
					</Footer>
				)}
			</Layout>
		</Layout>
	);
};

export default DefaultLayout;
