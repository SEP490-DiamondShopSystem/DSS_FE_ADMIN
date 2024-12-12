import {Tabs} from 'antd';
import React from 'react';

export const Filter = ({filter, active, handleStatusBtn}) => {
	const handleChangeTab = (key) => {
		handleStatusBtn(key);
	};

	return (
		<Tabs
			className="w-full"
			activeKey={active}
			onChange={handleChangeTab}
			tabBarGutter={16}
			type="card"
		>
			{filter?.map((status, i) => (
				<Tabs.TabPane
					key={status.value}
					tab={
						<span className="flex items-center gap-2">
							{status.icon} {/* Biểu tượng được truyền từ filter */}
							{status.name}
						</span>
					}
				/>
			))}
		</Tabs>
	);
};
