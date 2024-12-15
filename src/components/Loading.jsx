import React from 'react';

import ReactLoading from 'react-loading';

const Loading = () => {
	return (
		<div className="flex flex-col items-center justify-center my-10">
			<ReactLoading height={'3%'} width={'3%'} type="balls" color="#dec986" />
			<div className="my-10 font-semibold text-3xl text-primary">Diamond Shop</div>
		</div>
	);
};

export default Loading;
