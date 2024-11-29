import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useParams} from 'react-router-dom';
import {
	getOrderChildLogSelector,
	getOrderDetailSelector,
	getOrderStatusDetailSelector,
	getPaymentStatusDetailSelector,
	LoadingOrderSelector,
} from '../../../../redux/selectors';
import {getOrderDetail, getOrderLog} from '../../../../redux/slices/orderSlice';
import InformationOrder from './Left/InformationOrder';
import TimeLineOrder from './Right/TimeLineOrder';
import Loading from '../../../../components/Loading';
import {Helmet} from 'react-helmet';

const OrderDetail = () => {
	const {id} = useParams();
	const dispatch = useDispatch();
	const orderDetail = useSelector(getOrderDetailSelector);
	const loading = useSelector(LoadingOrderSelector);
	const statusOrder = useSelector(getOrderStatusDetailSelector);
	const paymentStatusOrder = useSelector(getPaymentStatusDetailSelector);
	const childLogOrder = useSelector(getOrderChildLogSelector);

	const [orders, setOrders] = useState();

	useEffect(() => {
		if (id && !loading) {
			dispatch(getOrderDetail(id));
		}
	}, [id, statusOrder, paymentStatusOrder, childLogOrder]);

	useEffect(() => {
		if (orderDetail && !loading) {
			setOrders(orderDetail);
		}
	}, [orderDetail]);

	useEffect(() => {
		if (orders?.Id) {
			dispatch(getOrderLog(orders?.Id));
		}
	}, [orders, dispatch]);

	return (
		<>
			{loading ? (
				<Loading />
			) : (
				<div className="w-full flex flex-col lg:flex-row lg:items-start lg:space-x-10">
					<Helmet>
						<title>Dashboard</title>
					</Helmet>
					{/* Left Section */}
					<div className="w-full lg:w-2/3">
						<InformationOrder
							orders={orderDetail}
							statusOrder={statusOrder}
							paymentStatusOrder={paymentStatusOrder}
						/>
					</div>
					{/* Right Section */}
					<div className="w-full lg:w-1/3 mt-6 lg:mt-0">
						<TimeLineOrder
							orders={orderDetail}
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