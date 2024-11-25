import React, {useEffect, useState} from 'react';
import Loading from 'react-loading';
import {useDispatch, useSelector} from 'react-redux';
import {useLocation, useParams} from 'react-router-dom';
import {
	ErrorCustomizeSelector,
	GetDiamondUnAvailableSelector,
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
	const diamondUnAvailable = useSelector(GetDiamondUnAvailableSelector);
	const error = useSelector(ErrorCustomizeSelector);

	const [orders, setOrders] = useState();
	const [currentDiamondId, setCurrentDiamondId] = useState(null);
	const [filteredDiamondRequests, setFilteredDiamondRequests] = useState([]);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [isModalAddVisible, setIsModalAddVisible] = useState(false);
	const [changeDiamond, setChangeDiamond] = useState(null);
	const [selectedDiamond, setSelectedDiamond] = useState({});

	const diamondRequests = orders?.DiamondRequests?.filter(
		(request) => request.DiamondId === null
	);

	const allDiamondRequests = orders?.DiamondRequests;

	const allDiamondsHaveId =
		orders?.DiamondRequests?.every((request) => request.DiamondId !== null) || false;

	const filteredRequests = allDiamondRequests?.filter(
		(request) => selectedDiamond?.DiamondRequestId === request?.DiamondRequestId
	);

	useEffect(() => {
		dispatch(getOrderCustomizeDetail({RequestId: id, AccountId: order?.AccountId}));
	}, [diamondUnAvailable, id, order]);

	useEffect(() => {
		if (orderDetail) {
			setOrders(orderDetail);
		}
	}, [orderDetail]);

	const showModal = (values) => {
		if (values) {
			setSelectedDiamond(values);
		}
		setIsModalVisible(true);
	};

	const showModalAdd = () => {
		setIsModalAddVisible(true);
	};

	console.log('orderDetail', orderDetail);
	console.log('statusOrder', statusOrder);
	console.log('selectedDiamond', selectedDiamond);

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
							currentDiamondId={currentDiamondId}
							setCurrentDiamondId={setCurrentDiamondId}
							filteredDiamondRequests={filteredDiamondRequests}
							setFilteredDiamondRequests={setFilteredDiamondRequests}
							isModalVisible={isModalVisible}
							setIsModalVisible={setIsModalVisible}
							isModalAddVisible={isModalAddVisible}
							setIsModalAddVisible={setIsModalAddVisible}
							showModal={showModal}
							showModalAdd={showModalAdd}
							setChangeDiamond={setChangeDiamond}
							changeDiamond={changeDiamond}
							selectedDiamond={selectedDiamond}
							filteredRequests={filteredRequests}
						/>
					</div>
				</div>
			)}
		</>
	);
};

export default OrderCustomizeDetail;
