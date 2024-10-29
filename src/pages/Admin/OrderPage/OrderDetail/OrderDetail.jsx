import React, {useEffect, useState} from 'react';
import InformationOrder from './Left/InformationOrder';
import TimeLineOrder from './Right/TimeLineOrder';
import {useDispatch, useSelector} from 'react-redux';
import {
	getOrderDetailSelector,
	getOrderStatusDetailSelector,
	getPaymentStatusDetailSelector,
	LoadingOrderSelector,
} from '../../../../redux/selectors';
import {getOrderDetail} from '../../../../redux/slices/orderSlice';
import {useParams} from 'react-router-dom';
import Loading from 'react-loading';

const OrderDetail = () => {
	const {id} = useParams();
	const dispatch = useDispatch();
	const orderDetail = useSelector(getOrderDetailSelector);
	const loading = useSelector(LoadingOrderSelector);
	const statusOrder = useSelector(getOrderStatusDetailSelector);
	const paymentStatusOrder = useSelector(getPaymentStatusDetailSelector);

	const [orders, setOrders] = useState();

	console.log('orderDetail', orders);

	useEffect(() => {
		dispatch(getOrderDetail(id));
	}, []);
	useEffect(() => {
		if (orderDetail) {
			setOrders(orderDetail);
		}
	}, [orderDetail]);
	return (
		<>
			{loading ? (
				<Loading />
			) : (
				<div className="w-full flex">
					<div className="" style={{width: '70%'}}>
						<InformationOrder
							orders={orders}
							statusOrder={statusOrder}
							paymentStatusOrder={paymentStatusOrder}
						/>
					</div>
					<div className="pl-10" style={{width: '30%'}}>
						<TimeLineOrder
							orders={orders}
							statusOrder={statusOrder}
							paymentStatusOrder={paymentStatusOrder}
						/>
					</div>
				</div>
			)}
		</>
	);
};

export default OrderDetail;
