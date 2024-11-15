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
						/>
					</div>
					{/* <div className="pl-10" style={{width: '30%'}}>
						<TimeLineOrder
							orders={orders}
							statusOrder={statusOrder}
							paymentStatusOrder={paymentStatusOrder}
						/>
					</div> */}
				</div>
			)}
		</>
	);
};

export default OrderCustomizeDetail;
