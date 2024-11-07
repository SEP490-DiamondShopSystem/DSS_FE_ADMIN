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
import {Breadcrumb, Layout, Menu} from 'antd';
import {Link, Outlet, useLocation, useNavigate} from 'react-router-dom'; // Add Outlet here
import {imageExporter} from '../assets/images';
import TopNavbar from '../components/TopNavBar/TopNavBar';
import '../css/antd.css';
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

			if (isDeliverer) {
				navigate('/orders');
			}
		}
	}, [userDetail, navigate]);

	const items = [
		(adminRole || managerRole || staffRole) &&
			getItem('Dashboard', '/dashboard', <DashboardOutlined />),
		(adminRole || managerRole || staffRole) &&
			getItem('Quản Lí Tài Khoản', '/accounts', <UserOutlined />),
		(adminRole || managerRole || staffRole) &&
			getItem('Quản Lý Sản Phẩm', '/products', <ProductOutlined />, [
				getItem('Danh Sách Trang Sức', '/products/jewelry-list', <RightOutlined />),
				getItem('Danh Sách Kim Cương', '/products/diamond-list', <DiamondOutlined />),
				getItem('Danh Sách Loại Trang Sức', '/products/jewelry-model-category-list', <RightOutlined />),
				getItem('Danh Sách Mẫu Trang Sức', '/products/jewelry-model-list', <RightOutlined />),
				getItem('Danh Sách Kim Loại', '/products/metal-list', <DiamondOutlined />),
			]),
			getItem('Quản Lí Đặt Hàng', '/orders', <OrderedListOutlined />),
		(adminRole || managerRole || staffRole) &&
			getItem('Quản Lí Khuyến Mãi', '/promotion', <GiftOutlined />),
		(adminRole || managerRole || staffRole) &&
			getItem('Quản Lí Vận Chuyển', '/deliveries', <DeliveredProcedureOutlined />),
		(adminRole || managerRole || staffRole) &&
			getItem('Quản Lí Giá Kim Cương', '/price', <TagOutlined />),
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
		<Layout style={{minHeight: '100vh'}}>
			<Sider
				collapsed={collapsed}
				className="shadow-sm"
				collapsible
				theme="light"
				onCollapse={toggleCollapsed}
			>
				<Link to="/dashboard" style={{display: 'block', height: '100px'}}>
					<img
						src={collapsed ? imageExporter.tinylogo : imageExporter.logo}
						alt="logo"
						style={{
							width: collapsed ? '80%' : '40%',
							height: 'auto',
							display: 'block',
							margin: '10px auto',
							objectFit: 'cover',
						}}
					/>
				</Link>
				<Menu
					onClick={handleClickMenuItem}
					theme="light"
					selectedKeys={[selectMenu]}
					mode="vertical"
					openKeys={openKeys}
					onOpenChange={onOpenChange}
				>
					{items.map((item) =>
						item.children ? (
							<SubMenu key={item.key} icon={item.icon} title={item.label}>
								{item.children.map((child) => (
									<Menu.Item key={child.key}>
										<Link to={child.key} style={{fontWeight: 'bold'}}>
											{child.label}
										</Link>
									</Menu.Item>
								))}
							</SubMenu>
						) : (
							item && ( // Ensure item is truthy before rendering
								<Menu.Item key={item.key} icon={item.icon}>
									<Link to={item.key} style={{fontWeight: 'bold'}}>
										{item.label}
									</Link>
								</Menu.Item>
							)
						)
					)}
				</Menu>
			</Sider>
			<Layout style={{backgroundColor: '#eaeaea', minHeight: '100vh'}}>
				{showHeaderFooter && <TopNavbar />}
				<Content style={{padding: '0 16px'}}>
					<Breadcrumb style={{margin: '16px 0'}}>
						<Breadcrumb.Item>
							<Link to="/dashboard">Home</Link>
						</Breadcrumb.Item>
						{breadcrumbItems}
					</Breadcrumb>
					<div
						style={{
							minHeight: 790,
							backgroundColor: '#ffffff',
							padding: '16px',
							overflowy: 'auto',
							borderRadius: '8px', // Optional: add some rounding for better appearance
						}}
					>
						{/* Render child routes */}
						<Outlet/>
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
