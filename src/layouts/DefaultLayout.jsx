import {DashboardOutlined, UserOutlined, SettingOutlined} from '@ant-design/icons';
import {Layout, Menu} from 'antd';
import React, {useState} from 'react';
import {Link, useLocation, useNavigate} from 'react-router-dom';
import {imageExporter} from '../assets/images';
import TopNavbar from '../components/TopNavBar/TopNavBar'; // Import the TopNavbar component
import '../styles/menuStyle.css';

const {Footer, Sider, Content} = Layout;
const {SubMenu} = Menu; // Import SubMenu

const getItem = (label, key, icon, children) => ({key, icon, label, children});

export const DefaultLayout = ({children}) => {
	const navigate = useNavigate();
	const [collapsed, setCollapsed] = useState(false);
	const location = useLocation();
	const [selectMenu, setSelectMenu] = useState(location.pathname);

	const pageLocation = ['/dashboard', '/users'];

	const items = [
		getItem('Dashboard', '/dashboard', <DashboardOutlined />),
		getItem(
			'Manage User',
			'/users',
			<UserOutlined />
			// [
			// getItem('User List', '/users/list'),
			// getItem('User Settings', '/users/settings', <SettingOutlined />),
			// getItem('User Profile', '/users/profile'),
			// ]
		),
	];

	const handleClickMenuItem = (e) => {
		setSelectMenu(e.key);
		navigate(e.key);
	};

	const toggleCollapsed = () => {
		setCollapsed(!collapsed);
	};

	const isLoginPage = location.pathname === '/login';
	const isSignUpPage = location.pathname === '/signup';
	const showHeaderFooter = !(isLoginPage || isSignUpPage);

	return (
		<Layout style={{minHeight: '100vh'}}>
			<Sider
				collapsed={collapsed}
				className="shadow-sm"
				collapsible
				theme="light"
				onCollapse={toggleCollapsed}
				style={{display: pageLocation.includes(location.pathname) ? 'block' : 'none'}}
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
				<Content
					style={{
						overflow: 'auto',
						backgroundColor: '#FBFCFB',
					}}
				>
					<div
						style={{
							minHeight: 360,
							height: 790,
							backgroundColor: '#ffffff', // Optional: set a background color if needed
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
