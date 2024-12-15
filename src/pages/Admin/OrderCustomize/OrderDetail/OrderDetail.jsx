import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useLocation, useParams} from 'react-router-dom';
import {
	ErrorCustomizeSelector,
	GetDiamondUnAvailableSelector,
	getOrderCustomizeDetailSelector,
	getOrderStatusCustomizeDetailSelector,
	getPaymentStatusCustomizeDetailSelector,
	LoadingCustomizeSelector,
	LoadingOrderSelector,
} from '../../../../redux/selectors';
import {getOrderCustomizeDetail} from '../../../../redux/slices/customizeSlice';
import InformationOrder from './Left/InformationOrder';
import Loading from '../../../../components/Loading';

const OrderCustomizeDetail = () => {
	const {id} = useParams();
	const location = useLocation();
	const order = location.state?.record;
	const dispatch = useDispatch();

	const loading = useSelector(LoadingCustomizeSelector);
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
	const [diamondRequests, setDiamondRequests] = useState(null);
	const [fetchRequest, setFetchRequest] = useState(null);
	const [completed, setCompleted] = useState(null);

	const allDiamondRequests = orders?.DiamondRequests;

	console.log('allDiamondRequests', allDiamondRequests);

	const allDiamondsHaveId =
		orders?.DiamondRequests?.every((request) => request.DiamondId !== null) || false;

	const filteredRequests = allDiamondRequests?.filter(
		(request) => selectedDiamond?.DiamondRequestId === request?.DiamondRequestId
	);

	useEffect(() => {
		if (orders?.DiamondRequests) {
			const filteredDiamondRequests = orders?.DiamondRequests?.filter(
				(request) => request.DiamondId === null
			);
			setDiamondRequests(filteredDiamondRequests);
		}
	}, [orders?.DiamondRequests]);

	// Xóa giá trị nếu không còn trong danh sách mới

	useEffect(() => {
		dispatch(getOrderCustomizeDetail({RequestId: id}))
			.unwrap()
			.then((res) => {
				setFetchRequest(null);
				setOrders(res);
			});
	}, [diamondUnAvailable, id, order, fetchRequest, completed]);

	const showModal = (values) => {
		if (values) {
			setSelectedDiamond(values);
		}
		setIsModalVisible(true);
	};

	const showModalAdd = () => {
		setIsModalAddVisible(true);
	};

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
							setFetchRequest={setFetchRequest}
							setCompleted={setCompleted}
						/>
					</div>
				</div>
			)}
		</>
	);
};

export default OrderCustomizeDetail;
