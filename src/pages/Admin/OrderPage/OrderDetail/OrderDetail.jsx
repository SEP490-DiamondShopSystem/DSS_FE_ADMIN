import React, {useEffect, useRef, useState} from 'react';
import InformationOrder from './Left/InformationOrder';
import TimeLineOrder from './Right/TimeLineOrder';
import {useDispatch, useSelector} from 'react-redux';
import {
	getOrderDetailSelector,
	getOrderStatusDetailSelector,
	getPaymentStatusDetailSelector,
	LoadingOrderSelector,
} from '../../../../redux/selectors';
import {useLocation, useParams} from 'react-router-dom';
import Loading from 'react-loading';
import {getOrderDetail, getOrderLog} from '../../../../redux/slices/orderSlice';
import debounce from 'lodash/debounce';

const OrderDetail = () => {
	const {id} = useParams();
	const dispatch = useDispatch();
	const orderDetail = useSelector(getOrderDetailSelector);
	const loading = useSelector(LoadingOrderSelector);
	const statusOrder = useSelector(getOrderStatusDetailSelector);
	const paymentStatusOrder = useSelector(getPaymentStatusDetailSelector);

	const [orders, setOrders] = useState();
	const previousId = useRef(null);

	useEffect(() => {
		if (id && !loading) {
			dispatch(getOrderDetail(id));
		}
	}, [id]);

	useEffect(() => {
		if (orderDetail && !loading) {
			setOrders(orderDetail);
		}
	}, [orderDetail]);

	// const fetchDiamondData = debounce(() => {
	// 	if (orders?.Id && orders?.Id !== previousId.current) {
	// 		dispatch(getOrderLog(orders?.Id));
	// 		previousId.current = orders?.Id;
	// 	}
	// }, 1000);

	// useEffect(() => {
	// 	fetchDiamondData();
	// 	return () => fetchDiamondData.cancel();
	// }, [orders?.Id]);

	useEffect(() => {
		if (orders?.Id) {
			dispatch(getOrderLog(orders?.Id));
		}
	}, [orders, dispatch]);

	console.log('orders', orders);

	return (
		<>
			{loading ? (
				<Loading />
			) : (
				<div className="w-full flex">
					<div className="md:w-2/3">
						<InformationOrder
							orders={orders}
							statusOrder={statusOrder}
							paymentStatusOrder={paymentStatusOrder}
						/>
					</div>
					<div className="pl-10 md:w-1/3">
						<TimeLineOrder
							orders={orders}
							statusOrder={statusOrder}
							paymentStatusOrder={paymentStatusOrder}
							loading={loading}
							id={id}
						/>
					</div>
				</div>
			)}
		</>
	);
};

export default OrderDetail;
