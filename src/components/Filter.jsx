import React, {useState} from 'react';

export const Filter = ({filter, active, handleStatusBtn}) => {
	return (
		<div className="flex justify-around items-center divide-x ">
			{filter?.map((status, i) => (
				<div key={i} className="w-full">
					<button
						className={` hover:bg-primary ${
							active === status.value ? 'bg-primary' : 'bg-lightGray'
						} py-2 px-10 w-full`}
						// style={{minWidth: '180px'}}
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
