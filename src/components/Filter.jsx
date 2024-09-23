import React, {useState} from 'react';

export const Filter = ({filter, active, handleStatusBtn}) => {
	return (
		<div className="flex justify-around items-center w-20 divide-x">
			{filter?.map((status, i) => (
				<div key={i}>
					<button
						className={` hover:bg-primary ${
							active === status.value ? 'bg-primary' : 'bg-lightGray'
						} py-2 px-10 `}
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
