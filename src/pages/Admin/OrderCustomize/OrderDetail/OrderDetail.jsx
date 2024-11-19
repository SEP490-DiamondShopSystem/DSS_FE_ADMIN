import React, {useEffect, useState} from 'react';
import Loading from 'react-loading';
import {useDispatch, useSelector} from 'react-redux';
import {useLocation, useParams} from 'react-router-dom';
import {
	getOrderCustomizeDetailSelector,
	getOrderStatusCustomizeDetailSelector,
	getPaymentStatusCustomizeDetailSelector,
	LoadingOrderSelector,
} from '../../../../redux/selectors';
import {getOrderCustomizeDetail} from '../../../../redux/slices/customizeSlice';
import InformationOrder from './Left/InformationOrder';

const OrderCustomizeDetail = () => {
	const {id} = useParams();
	const location = useLocation();
	const order = location.state?.record;
	const dispatch = useDispatch();

	const orderDetail = useSelector(getOrderCustomizeDetailSelector);
	const loading = useSelector(LoadingOrderSelector);
	const statusOrder = useSelector(getOrderStatusCustomizeDetailSelector);
	const paymentStatusOrder = useSelector(getPaymentStatusCustomizeDetailSelector);

	const [orders, setOrders] = useState();

	const diamondRequests = orders?.DiamondRequests?.filter(
		(request) => request.DiamondId === null
	);

	const allDiamondRequests = orders?.DiamondRequests;

	const allDiamondsHaveId =
		orders?.DiamondRequests?.every((request) => request.DiamondId !== null) || false;

	useEffect(() => {
		dispatch(getOrderCustomizeDetail({RequestId: id, AccountId: order?.AccountId}));
	}, []);
	useEffect(() => {
		if (orderDetail) {
			setOrders(orderDetail);
		}
	}, [orderDetail]);

	console.log('orderDetail', orderDetail);
	console.log('statusOrder', statusOrder);

	return (
		<>
			{loading ? (
				<Loading />
			) : (
				<div className="w-full flex">
					<div className="" style={{width: '100%'}}>
						<InformationOrder
							orders={orders}
							statusOrder={statusOrder}
							paymentStatusOrder={paymentStatusOrder}
							diamondRequests={diamondRequests}
							allDiamondRequests={allDiamondRequests}
							allDiamondsHaveId={allDiamondsHaveId}
						/>
					</div>
				</div>
			)}
		</>
	);
};

export default OrderCustomizeDetail;
