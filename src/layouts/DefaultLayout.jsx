import {DashboardOutlined, UserOutlined} from '@ant-design/icons';
import {Layout, Menu} from 'antd';
import React, {useState} from 'react';
import {Link, useLocation, useNavigate} from 'react-router-dom';
import {imageExporter} from '../assets/images';
import TopNavbar from '../components/TopNavBar/TopNavBar'; // Import the TopNavbar component
const {Footer, Sider, Content} = Layout;

const getItem = (label, key, icon) => ({key, icon, label});

export const DefaultLayout = ({children}) => {
	const navigate = useNavigate();
	const [collapsed, setCollapsed] = useState(false);
	const location = useLocation();
	const [selectMenu, setSelectMenu] = useState(location.pathname);

	const pageLocation = ['/dashboard', '/users'];

	const items = [
		getItem('Dashboard', '/dashboard', <DashboardOutlined />),
		getItem('Manage User', '/users', <UserOutlined />),
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
							width: collapsed ? '60%' : '100%',
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
					{items.map((item) => (
						<Menu.Item key={item.key} icon={item.icon}>
							<Link to={item.key}>{item.label}</Link>
						</Menu.Item>
					))}
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
					<Footer style={{textAlign: 'center'}}>
						SportLinker Admin Page ©{new Date().getFullYear()} Created by SportLinker
						Team
					</Footer>
				)}
			</Layout>
		</Layout>
	);
};
