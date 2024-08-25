import {Menu, Space, Typography} from 'antd';
import React, {useState} from 'react';
import styles from '../styles/Menu.module.scss';
import {Link, useLocation} from 'react-router-dom';
import {DownOutlined} from '@ant-design/icons';

export const MenuHeader = () => {
	const location = useLocation();
	// Determine the selected key based on the current path
	const getSelectedKey = () => {
		switch (location.pathname) {
			// case '/diamond':
			// 	return 'diamond';
			// case '/jewelry':
			// 	return 'jewelry';
			case '/coupons':
				return 'coupons';
			case '/contact':
				return 'contact';
			default:
				return 'home';
		}
	};

	return (
		<div className="menu-header">
			<Menu
				mode="horizontal"
				selectedKeys={[getSelectedKey()]}
				className={styles['custom-menu']}
				items={[
					{label: <Link to="/">Home</Link>, key: 'home'},
					{
						label: (
							<>
								Diamond <DownOutlined />
							</>
						),
						key: 'diamond',
						children: [
							{
								label: <MegaMenu />,
								key: 'MegaMenu',
								style: {
									height: 'fit-content',
									padding: 0,
									backgroundColor: '#fff',
								},
							},
						],
					},
					{
						label: (
							<>
								Jewelry <DownOutlined />
							</>
						),
						key: 'jewelry',
					},
					{label: <Link to="/coupons">Coupons</Link>, key: 'coupons'},
					{label: 'Contact', key: 'contact'},
				]}
			/>
		</div>
	);
};

function MegaMenu() {
	const [selectedKeys, setSelectedKeys] = useState([]);

	const onMenuItemClick = (item) => {
		setSelectedKeys([item.key]);
	};

	return (
		<div style={{background: '#fff', paddingLeft: 20, paddingRight: 20}}>
			<Typography.Title level={3}>Menu Diamond</Typography.Title>
			<Space direction="horizontal" size="large">
				<Menu
					onClick={onMenuItemClick}
					selectedKeys={selectedKeys}
					mode="vertical"
					items={[
						{
							label: 'Shop Diamond by Shape',
							key: 'shape-group',
							type: 'group',
							children: [
								{label: 'Shop Diamond by Shape1', key: 'shape1'},
								{label: 'Shop Diamond by Shape2', key: 'shape2'},
								{label: 'Shop Diamond by Shape3', key: 'shape3'},
							],
						},
					]}
					style={{boxShadow: 'none', border: 'none'}}
				/>

				<Menu
					onClick={onMenuItemClick}
					selectedKeys={selectedKeys}
					mode="vertical"
					items={[
						{
							label: 'Build Your Own Jewelry',
							key: 'jewelry-group',
							type: 'group',
							children: [
								{label: 'Build Your Own Jewelry1', key: 'jewelry1'},
								{label: 'Build Your Own Jewelry2', key: 'jewelry2'},
								{label: 'Build Your Own Jewelry3', key: 'jewelry3'},
								{label: 'Build Your Own Jewelry4', key: 'jewelry4'},
							],
						},
					]}
					style={{boxShadow: 'none', border: 'none'}}
				/>
			</Space>
		</div>
	);
}
