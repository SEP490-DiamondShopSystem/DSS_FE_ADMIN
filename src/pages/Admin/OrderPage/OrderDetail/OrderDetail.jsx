import React, {useEffect, useState} from 'react';
import InformationOrder from './Left/InformationOrder';
import TimeLineOrder from './Right/TimeLineOrder';
import {useDispatch, useSelector} from 'react-redux';
import {getOrderDetailSelector} from '../../../../redux/selectors';
import {getOrderDetail} from '../../../../redux/slices/orderSlice';
import {useParams} from 'react-router-dom';

const OrderDetail = () => {
	const {id} = useParams();
	const dispatch = useDispatch();
	const orderDetail = useSelector(getOrderDetailSelector);
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
		<div className="w-full flex">
			<div className="" style={{width: '70%'}}>
				<InformationOrder orders={orders} />
			</div>
			<div className="pl-10" style={{width: '30%'}}>
				<TimeLineOrder orders={orders} />
			</div>
		</div>
	);
};

export default OrderDetail;
