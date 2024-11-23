import React, {useState} from 'react';

export const Filter = ({filter, active, handleStatusBtn}) => {
	return (
		<div className="flex items-center divide md:flex-wrap">
			{filter?.map((status, i) => (
				<div key={i} className="w-full md:w-auto">
					<button
						className={`hover:bg-primary ${
							active === status.value ? 'bg-primary' : 'bg-lightGray'
						} py-2 px-4 md:px-10 w-full md:w-auto text-sm md:text-base`}
						value={status.value}
						onClick={() => handleStatusBtn(status.value)}
					>
						{status.name}
					</button>
				</div>
			))}
		</div>
	);
};
