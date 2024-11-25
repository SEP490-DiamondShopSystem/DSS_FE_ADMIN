import {Button} from 'antd';
import React from 'react';

export const Filter = ({filter, active, handleStatusBtn}) => {
	return (
		<div className="flex items-center md:flex-wrap gap-1">
			{filter?.map((status, i) => (
				<div key={i} className="w-full md:w-auto">
					<Button
						type="text"
						className={` ${
							active === status.value ? 'bg-primary' : 'bg-lightGray'
						} py-2 px-4 md:px-5 md:w-auto text-sm md:text-base`}
						value={status.value}
						onClick={() => handleStatusBtn(status.value)}
					>
						{status.name}
					</Button>
				</div>
			))}
		</div>
	);
};
