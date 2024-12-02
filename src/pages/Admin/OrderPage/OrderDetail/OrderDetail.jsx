import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useParams} from 'react-router-dom';
import {
	getOrderChildLogSelector,
	getOrderCompletedSelector,
	getOrderDetailSelector,
	getOrderStatusDetailSelector,
	getOrderTransferSelector,
	getPaymentStatusDetailSelector,
	GetUserDetailSelector,
	LoadingOrderSelector,
} from '../../../../redux/selectors';
import {getOrderDetail, getOrderLog} from '../../../../redux/slices/orderSlice';
import InformationOrder from './Left/InformationOrder';
import TimeLineOrder from './Right/TimeLineOrder';
import Loading from '../../../../components/Loading';
import {Helmet} from 'react-helmet';
import {message} from 'antd';

const OrderDetail = () => {
	const {id} = useParams();
	const dispatch = useDispatch();
	const orderDetail = useSelector(getOrderDetailSelector);
	const loading = useSelector(LoadingOrderSelector);
	const paymentStatusOrder = useSelector(getPaymentStatusDetailSelector);
	const childLogOrder = useSelector(getOrderChildLogSelector);
	const userDetail = useSelector(GetUserDetailSelector);
	const statusDetail = useSelector(getOrderStatusDetailSelector);
	const transfer = useSelector(getOrderTransferSelector);

	const [orders, setOrders] = useState();
	const [statusOrder, setStatusOrder] = useState();
	const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 768);
	const [completed, setCompleted] = useState(null);

	console.log('orders', orders);

	// Handle responsive layout
	useEffect(() => {
		const handleResize = () => {
			setIsMobileView(window.innerWidth <= 768);
		};

		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	// Fetch order details
	useEffect(() => {
		dispatch(getOrderDetail(id))
			.unwrap()
			.then((res) => {
				setOrders(res);
				setStatusOrder(res?.Status);
			})
			.catch((error) => {
				message.error(error.title || error.data.title);
			});
	}, [
		id,
		statusOrder,
		paymentStatusOrder,
		childLogOrder,
		dispatch,
		statusDetail,
		transfer,
		completed,
	]);

	// Fetch order log
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
				<div className={`w-full ${isMobileView ? 'flex-col' : 'flex'}`}>
					<Helmet>
						<title>Order Detail</title>
					</Helmet>

					<div
						className={`
                        ${isMobileView ? 'w-full mb-6' : 'md:w-2/3'}`}
					>
						<InformationOrder
							userDetail={userDetail}
							orders={orderDetail}
							statusOrder={statusOrder}
							paymentStatusOrder={paymentStatusOrder}
						/>
					</div>

					<div
						className={`
                        ${isMobileView ? 'w-full' : ' md:w-1/3'}`}
					>
						<TimeLineOrder
							userDetail={userDetail}
							orders={orderDetail}
							statusOrder={statusOrder}
							paymentStatusOrder={paymentStatusOrder}
							loading={loading}
							id={id}
							setCompleted={setCompleted}
						/>
					</div>
				</div>
			)}
		</>
	);
};

export default OrderDetail;
