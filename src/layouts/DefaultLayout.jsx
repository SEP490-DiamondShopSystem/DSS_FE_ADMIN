import React, {useState} from 'react';

import {
	DashboardOutlined,
	OrderedListOutlined,
	ProductOutlined,
	RightOutlined,
	SafetyOutlined,
	UserOutlined,
	TagOutlined,
} from '@ant-design/icons';
import {DiamondOutlined} from '@mui/icons-material';
import {Breadcrumb, Layout, Menu} from 'antd';
import {Link, useLocation, useNavigate} from 'react-router-dom';
import {imageExporter} from '../assets/images';
import TopNavbar from '../components/TopNavBar/TopNavBar';
import '../css/antd.css';

const {Footer, Sider, Content} = Layout;
const {SubMenu} = Menu;

const getItem = (label, key, icon, children) => ({key, icon, label, children});

export const DefaultLayout = ({children}) => {
	const navigate = useNavigate();
	const [collapsed, setCollapsed] = useState(false);
	const location = useLocation();
	const [selectMenu, setSelectMenu] = useState(location.pathname);

	// Thêm defaultOpenKeys để giữ SubMenu mở
	const [openKeys, setOpenKeys] = useState([]);

	const pageLocation = ['/dashboard', '/users', '/products', '/orders', '/promotion'];

	const items = [
		getItem('Dashboard', '/dashboard', <DashboardOutlined />),
		getItem('Manage User', '/users', <UserOutlined />),
		getItem('Manage Product', '/products', <ProductOutlined />, [
			getItem('Jewelry List', '/products/jewelry-list', <RightOutlined />),
			getItem('Diamond List', '/products/diamond-list', <DiamondOutlined />),
		]),
		getItem('Manage Order', '/orders', <OrderedListOutlined />),
		getItem('Manage Warranty', '/warranties', <SafetyOutlined />),
		getItem('Manage Promotion', '/promotion', <TagOutlined />),
	];

	const handleClickMenuItem = (e) => {
		setSelectMenu(e.key);
		navigate(e.key);
	};

	const toggleCollapsed = () => {
		setCollapsed(!collapsed);
	};

	// Xử lý mở SubMenu
	const onOpenChange = (keys) => {
		setOpenKeys(keys);
	};

	const isLoginPage = location.pathname === '/login';
	const isSignUpPage = location.pathname === '/signup';
	const showHeaderFooter = !(isLoginPage || isSignUpPage);

	// Tạo mảng các item cho Breadcrumb dựa trên pathname
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
							width: collapsed ? '100%' : '40%',
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
					mode="inline"
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
							<Menu.Item key={item.key} icon={item.icon}>
								<Link to={item.key} style={{fontWeight: 'bold'}}>
									{item.label}
								</Link>
							</Menu.Item>
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
							borderRadius: '8px', // Optional: add some rounding for better appearance
						}}
					>
						{children}
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
