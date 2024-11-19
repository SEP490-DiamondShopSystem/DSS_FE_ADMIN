import React, {useEffect, useState} from 'react';

import {CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined} from '@ant-design/icons';
import {Button, Form, Input, message, Modal, Select, Table, Typography, Space} from 'antd';
import debounce from 'lodash/debounce';
import {useDispatch, useSelector} from 'react-redux';
import {useParams} from 'react-router-dom';
import Loading from '../../../../../components/Loading';
import {getAllDiamondSelector, GetUserDetailSelector} from '../../../../../redux/selectors';
import {getAllDiamond} from '../../../../../redux/slices/diamondSlice';
import {handleOrderReject, handleRefundOrder} from '../../../../../redux/slices/orderSlice';
import {getOrderCustomizeStatus} from '../../../../../utils';
import {DiamondList} from './DiamondList';
import {
	handleCustomizeOrder,
	handleRejectCustomize,
} from '../../../../../redux/slices/customizeSlice';
import {AddModalDiamond} from './AddModalDiamond/AddModalDiamond';

const {Title, Text} = Typography;
const {Option} = Select;

const ORDER_STATUS_TEXTS = {
	Pending: 'Chờ Thêm Kim Cương Yêu Cầu',
	Priced: 'Đã Thêm Kim Cương Yêu Cầu',
	Shop_Rejected: 'Đã Từ Chối',
	Customer_Rejected: 'Đã Hủy Đơn',
	Requesting: 'Chờ Shop Xác Nhận Đơn Yêu Cầu',
	Accepted: 'Shop Đã Chấp Nhận Đơn Thiết Kế',
};

const TimeLineOrder = ({orders, loading, statusOrder, paymentStatusOrder}) => {
	const dispatch = useDispatch();
	const {id} = useParams();

	const userDetail = useSelector(GetUserDetailSelector);
	const diamondList = useSelector(getAllDiamondSelector);

	const [currentStep, setCurrentStep] = useState(0);
	const [status, setStatus] = useState();
	const [userRoleManager, setUserRoleManager] = useState(false);
	const [isCancelModalVisible, setIsCancelModalVisible] = useState(false);
	const [userRoleStaff, setUserRoleStaff] = useState(false);
	const [userRoleDeliverer, setUserRoleDeliverer] = useState(false);
	const [isAssigned, setIsAssigned] = useState(false);
	const [selectedRequest, setSelectedRequest] = useState(null);
	const [diamonds, setDiamonds] = useState([]);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [isModalAddVisible, setIsModalAddVisible] = useState(false);
	const [filters, setFilter] = useState({});
	const [currentDiamondId, setCurrentDiamondId] = useState(null);
	const [selectedDiamondList, setSelectedDiamondList] = useState([]);

	const diamondRequests = orders?.DiamondRequests?.filter(
		(request) => request.DiamondId === null
	);

	console.log('orders', orders);
	console.log('diamondRequests', diamondRequests);

	console.log('status', status);

	useEffect(() => {
		if (selectedRequest) {
			setFilter({
				shape: selectedRequest.DiamondShapeId,
				cut: {
					minCut: selectedRequest?.CutFrom,
					maxCut: selectedRequest?.CutTo,
				},
				color: {
					minColor: selectedRequest?.ColorFrom,
					maxColor: selectedRequest?.ColorTo,
				},
				clarity: {
					minClarity: selectedRequest?.ClarityFrom,
					maxClarity: selectedRequest?.ClarityTo,
				},
				carat: {
					minCarat: selectedRequest.CaratFrom,
					maxCarat: selectedRequest.CaratTo,
				},
				culet: selectedRequest?.Culet,
				symmetry: selectedRequest?.Symmetry,
				girdle: selectedRequest?.Girdle,
				polish: selectedRequest?.Polish,
				IsLabGrown: selectedRequest?.IsLabGrown === null ? false : true,
			});
		}
	}, [selectedRequest]);

	console.log('selectedRequest', selectedRequest);

	useEffect(() => {
		if (diamondList) {
			setDiamonds(diamondList?.Values);
		}
	}, [diamondList]);

	useEffect(() => {
		if (orders?.Id) {
			const savedIsAssigned =
				JSON.parse(localStorage.getItem(`isAssigned_${orders.Id}`)) || false;
			setIsAssigned(savedIsAssigned);
		}
	}, [orders]);

	useEffect(() => {
		if (userDetail?.Roles) {
			const isManager = userDetail?.Roles?.some((role) => role?.RoleName === 'manager');
			const isStaff = userDetail?.Roles?.some((role) => role?.RoleName === 'staff');
			const isDeliverer = userDetail?.Roles?.some((role) => role?.RoleName === 'deliverer');

			setUserRoleManager(isManager);
			setUserRoleStaff(isStaff);
			setUserRoleDeliverer(isDeliverer);
		}
	}, [userDetail]);

	useEffect(() => {
		if (statusOrder !== undefined) {
			const newStatus = getOrderCustomizeStatus(statusOrder);
			setStatus(newStatus);
		}
	}, [statusOrder]);

	const fetchDiamondData = debounce(() => {
		dispatch(
			getAllDiamond({
				pageSize: 10,
				start: 0,
				shapeId: filters?.shape,
				cutFrom: filters?.cut?.minCut,
				cutTo: filters?.cut?.maxCut,
				colorFrom: filters?.color?.minColor,
				colorTo: filters?.color?.maxColor,
				clarityFrom: filters?.clarity?.minClarity,
				clarityTo: filters?.clarity?.maxClarity,
				caratFrom: filters?.carat?.minCarat,
				caratTo: filters?.carat?.maxCarat,
				culet: filters?.culet,
				symmetry: filters?.symmetry,
				girdle: filters?.girdle,
				polish: filters?.polish,
				includeJewelryDiamond: false,
				isLab: filters?.IsLabGrown,
				diamondStatuses: 1,
			})
		);
	}, 500);

	useEffect(() => {
		if (selectedRequest) {
			fetchDiamondData();
		}

		return () => fetchDiamondData.cancel();
	}, [selectedRequest, dispatch, filters]);

	const handleSelectChange = (value) => {
		setSelectedRequest(diamondRequests.find((request) => request.DiamondRequestId === value));
		setCurrentDiamondId(null);
	};

	const handleDiamondSelectChange = (diamond) => {
		console.log('diamondSelect', diamond);

		setCurrentDiamondId(diamond);
	};

	const handleSaveDiamond = () => {
		if (selectedRequest && currentDiamondId) {
			const updatedSelection = {
				diamondId: currentDiamondId.Id,
				diamondRequestId: selectedRequest.DiamondRequestId,
				diamondTitle: currentDiamondId.Title,
			};
			const updatedList = selectedDiamondList.some(
				(item) => item.diamondRequestId === selectedRequest.DiamondRequestId
			)
				? selectedDiamondList.map((item) =>
						item.diamondRequestId === selectedRequest.DiamondRequestId
							? updatedSelection
							: item
				  )
				: [...selectedDiamondList, updatedSelection];

			setSelectedDiamondList(updatedList);
		} else {
			message.warning('Vui lòng chọn cả yêu cầu và kim cương.');
		}
	};

	const showModal = () => {
		setIsModalVisible(true);
	};

	const showModalAdd = () => {
		setIsModalAddVisible(true);
	};

	const handleAddDiamond = () => {
		Modal.confirm({
			title: 'Xác nhận đơn thiết kế này',
			content: 'Bạn có chắc chắn muốn tiếp tục?',
			okText: 'Xác nhận',
			cancelText: 'Hủy',
			onOk: handleOk,
		});
	};

	const handleOk = () => {
		const diamondAssigning = selectedDiamondList?.map((diamond) => ({
			diamondId: diamond.diamondId,
			diamondRequestId: diamond.diamondRequestId,
		}));

		dispatch(handleCustomizeOrder({requestId: id, diamondAssigning: diamondAssigning})).then(
			(res) => {
				console.log('res', res);

				if (res.payload.status === 200 || res.payload.status === 201) {
					message.success('Thêm Kim Cương Thành Công!');
					setIsModalVisible(false);
				} else if (res.payload.status === 400) {
					message.warning(res.error.message);
				}
			}
		);
	};

	const handleCancel = () => {
		setIsModalVisible(false);
		setSelectedDiamondList([]);
		setSelectedRequest(null);
	};

	const handleAcceptedConfirm = () => {
		Modal.confirm({
			title: 'Xác nhận đơn thiết kế này',
			content: 'Bạn có chắc chắn muốn tiếp tục?',
			okText: 'Xác nhận',
			cancelText: 'Hủy',
			onOk: handleAccepted,
		});
	};

	const handleReject = () => {
		Modal.confirm({
			title: 'Từ chối đơn thiết kế này',
			content: 'Bạn có chắc chắn muốn tiếp tục?',
			okText: 'Xác nhận',
			cancelText: 'Hủy',
			onOk: handleRejectStatus,
		});
	};

	const handleAccepted = async () => {
		const diamondAssigning = diamondRequests?.map((diamond) => ({
			DiamondId: diamond.DiamondId,
			DiamondRequestId: diamond.DiamondRequestId,
		}));

		dispatch(handleCustomizeOrder({requestId: id, diamondAssigning: diamondAssigning})).then(
			(res) => {
				console.log('res', res);

				if (res.payload.status === 200 || res.payload.status === 201) {
					message.success('Thêm Kim Cương Thành Công!');
					setIsModalVisible(false);
				} else if (res.payload.status === 400) {
					message.warning(res.error.message);
				}
			}
		);
	};
	const handleRejectStatus = async () => {
		// console.log('diamondAssigning', diamondAssigning);

		dispatch(handleRejectCustomize(id)).then((res) => {
			console.log('res', res);

			if (res.payload.status === 200 || res.payload.status === 201) {
				message.success('Hủy Đơn Yêu Cầu Thành Công!');
				setIsModalVisible(false);
			} else if (res.payload.status === 400) {
				message.warning(res.error.message);
			}
		});
	};

	const submitCancelOrder = async (values) => {
		const res = await dispatch(handleOrderReject({orderId: orders.Id, reason: values.reason}));
		console.log('err', res.payload);

		if (res.payload !== undefined) {
			message.success('Từ chối thành công!');
		} else if (res.payload.status === 400) {
			message.error('Lỗi khi từ chối đơn thiết kế.');
		}

		setIsCancelModalVisible(false);
	};

	console.log('selectedRequest', selectedRequest);

	return (
		<div>
			{loading ? (
				<Loading />
			) : (
				<>
					{status === 'Pending' && (
						<div className="border rounded-lg border-primary bg-tintWhite p-5 mb-5">
							<div className="flex items-center mb-5" style={{fontSize: 16}}>
								<p className="font-semibold">Trạng thái đơn yêu cầu:</p>
								<p className="ml-5 font-semibold bg-white p-2 rounded-full">
									<ClockCircleOutlined /> {ORDER_STATUS_TEXTS.Pending}
								</p>
							</div>

							{userRoleManager ? (
								<div className="flex justify-around">
									<Button
										type="text"
										className="bg-primary font-semibold w-32 rounded-full"
										onClick={showModal}
										disabled={loading}
									>
										Thêm Kim Cương
									</Button>
									<Button
										// type="text"
										danger
										className="font-semibold w-32 rounded-full"
										onClick={handleReject}
										disabled={loading}
									>
										Hủy Đơn
									</Button>
								</div>
							) : (
								<div className="flex justify-around text-primary font-semibold">
									Vui lòng chờ Manager xác nhận
								</div>
							)}
						</div>
					)}

					{status === 'Shop_Rejected' && paymentStatusOrder === 3 && (
						<div className="border rounded-lg border-primary bg-tintWhite p-5 mb-5">
							<div className="flex items-center" style={{fontSize: 16}}>
								<p className="font-semibold">Trạng thái đơn thiết kế:</p>
								<p className="ml-5 text-red font-semibold">
									<CloseCircleOutlined /> {ORDER_STATUS_TEXTS.Shop_Rejected}
								</p>
							</div>
							{/* <div className="flex justify-around">
								<Button
									type="text"
									className="bg-primary font-semibold w-full rounded-full"
									onClick={handleRefund}
									disabled={loading}
								>
									Xác nhận hoàn tiền
								</Button>
							</div> */}
						</div>
					)}
					{status === 'Shop_Rejected' && paymentStatusOrder === 4 && (
						<div className="border rounded-lg border-primary bg-tintWhite p-5 mb-5">
							<div className="flex items-center " style={{fontSize: 16}}>
								<p className="font-semibold">Trạng thái đơn thiết kế:</p>
								<p className="ml-5 text-red font-semibold">
									<CloseCircleOutlined /> {ORDER_STATUS_TEXTS.Shop_Rejected}
								</p>
							</div>
						</div>
					)}
					{status === 'Accepted' && (
						<div className="border rounded-lg border-primary bg-tintWhite p-5 mb-5">
							<div className="flex items-center " style={{fontSize: 16}}>
								<p className="font-semibold">Trạng thái đơn thiết kế:</p>
								<p className="ml-5 text-darkGreen font-semibold bg-white p-2 rounded-full">
									<CheckCircleOutlined /> {ORDER_STATUS_TEXTS.Accepted}
								</p>
							</div>
						</div>
					)}
					{status === 'Customer_Rejected' && paymentStatusOrder === 3 && (
						<div className="border rounded-lg border-primary bg-tintWhite p-5 mb-5">
							<div className="flex items-center mb-5" style={{fontSize: 16}}>
								<p className="font-semibold">Trạng thái đơn thiết kế:</p>
								<p className="ml-5 text-red font-semibold">
									<CloseCircleOutlined /> {ORDER_STATUS_TEXTS.Customer_Rejected}
								</p>
							</div>
							{/* <div className="flex justify-around">
								<Button
									type="text"
									className="bg-primary font-semibold w-full rounded-full"
									onClick={handleRefund}
									disabled={loading}
								>
									Xác nhận hoàn tiền
								</Button>
							</div> */}
						</div>
					)}
					{status === 'Customer_Rejected' && paymentStatusOrder === 4 && (
						<div className="border rounded-lg border-primary bg-tintWhite p-5 mb-5">
							<div className="flex items-center " style={{fontSize: 16}}>
								<p className="font-semibold">Trạng thái đơn thiết kế:</p>
								<p className="ml-5 text-red font-semibold">
									<CloseCircleOutlined /> {ORDER_STATUS_TEXTS.Customer_Rejected}
								</p>
							</div>
						</div>
					)}
					{status === 'Priced' && (
						<div className="border rounded-lg border-primary bg-tintWhite p-5 mb-5">
							<div className="flex items-center mb-5" style={{fontSize: 16}}>
								<p className="font-semibold">Trạng thái đơn thiết kế:</p>
								<p className="ml-5 text-darkGreen font-semibold bg-white p-2 rounded-full">
									<CheckCircleOutlined /> {ORDER_STATUS_TEXTS.Priced}
								</p>
							</div>
							<div className="flex justify-around font-semibold text-primary text-lg">
								Chờ Khách Hàng Xác Nhận
							</div>
						</div>
					)}

					{status === 'Requesting' && (
						<div className="border rounded-lg border-primary bg-tintWhite p-5 mb-5">
							<div className="flex items-center mb-5" style={{fontSize: 16}}>
								<p className="font-semibold">Trạng thái đơn yêu cầu:</p>
								<p className="ml-5 text-primary font-semibold bg-white p-2 rounded-full">
									<ClockCircleOutlined /> {ORDER_STATUS_TEXTS.Requesting}
								</p>
							</div>

							<div className="flex justify-around">
								<Button
									type="text"
									className="bg-primary font-semibold w-32 rounded-full"
									onClick={handleAcceptedConfirm}
									disabled={loading}
								>
									Xác Nhận
								</Button>
								<Button
									// type="text"
									danger
									className="font-semibold w-32 rounded-full"
									onClick={handleReject}
									disabled={loading}
								>
									Hủy Đơn
								</Button>
							</div>
						</div>
					)}

					{/* {status === 'Requesting' && isAssigned && (
						<div className="border rounded-lg border-primary bg-tintWhite p-5 mb-5">
							<div className="flex items-center mb-5" style={{fontSize: 16}}>
								<p className="font-semibold">Trạng thái đơn thiết kế:</p>
								<p className="ml-5">
									<CheckCircleOutlined /> {ORDER_STATUS_TEXTS.Requesting}
								</p>
							</div>

							{userRoleDeliverer ? (
								<div className="flex justify-around">
									<Button
										type="text"
										className="bg-primary font-semibold rounded-full w-full"
										onClick={handleDeliveringStatus}
									>
										Bắt Đầu Giao Hàng
									</Button>
								</div>
							) : (
								<div>
									<p className="mt-3 text-center font-semibold text-primary">
										Chờ Deliverer Giao Hàng
									</p>
								</div>
							)}
						</div>
					)} */}

					{/* Bị báo cáo */}
					{currentStep === 7 && (
						<div className="border rounded-lg border-primary bg-tintWhite p-5 mb-5">
							<div className="flex items-center mb-5" style={{fontSize: 16}}>
								<p className="font-semibold">Trạng thái đơn thiết kế:</p>
								<p className="ml-5 text-red">Bị báo cáo</p>
							</div>
							<div className="flex justify-around">
								<Button
									type="text"
									className="bg-primary font-semibold w-full rounded-full"
									onClick={() => setCurrentStep(0)}
								>
									Tiếp tục
								</Button>
							</div>
						</div>
					)}
				</>
			)}

			{/* <Title level={3}>Trạng Thái Đơn Hàng</Title>
			<TimeLine status={status} /> */}

			<Modal
				title="Hủy Đơn"
				visible={isCancelModalVisible}
				onCancel={() => setIsCancelModalVisible(false)}
				footer={null}
			>
				<Form onFinish={submitCancelOrder}>
					<Form.Item
						label="Lý do hủy"
						name="reason"
						rules={[{required: true, message: 'Vui lòng nhập lý do hủy đơn'}]}
					>
						<Input.TextArea />
					</Form.Item>
					<div className="flex items-center justify-center">
						<Button type="text" className="bg-primary" htmlType="submit">
							Xác nhận hủy
						</Button>
					</div>
				</Form>
			</Modal>
			<Modal
				title="Chọn Kim Cương"
				visible={isModalVisible}
				onOk={handleAddDiamond}
				onCancel={handleCancel}
				style={{minWidth: 1200}}
			>
				<div>
					<label>Chọn Kim Cương Yêu Cầu</label>
					<div className="flex">
						<Select
							placeholder="Chọn Kim Cương Yêu Cầu"
							onChange={handleSelectChange}
							className="w-full"
							// style={{width: 200}}
						>
							{diamondRequests &&
								diamondRequests.map((request) => (
									<Select.Option
										key={request.DiamondRequestId}
										value={request.DiamondRequestId}
									>
										{`Yêu Cầu ${request.DiamondRequestId}`}
									</Select.Option>
								))}
						</Select>
						<Button
							className="ml-5"
							disabled={selectedRequest === null}
							onClick={showModalAdd}
						>
							Tạo Kim Cương Theo Yêu Cầu
						</Button>
					</div>
					<div style={{marginTop: 16}}>
						<label>Chọn Kim Cương Đang Có</label>
						<DiamondList
							diamond={diamonds}
							filters={filters}
							handleDiamondSelectChange={handleDiamondSelectChange}
							currentDiamondId={currentDiamondId}
						/>
					</div>

					<div style={{marginTop: 16}}>
						<Button
							type="primary"
							onClick={handleSaveDiamond}
							// disabled={selectedDiamondList?.length === diamondRequests?.length}
						>
							Chọn Kim Cương Này
						</Button>
					</div>

					{selectedDiamondList.length > 0 && (
						<>
							<h4 className="mt-5 font-semibold">Thông Tin Yêu Cầu Kim Cương:</h4>
							{selectedDiamondList?.map((item, i) => (
								<div key={i}>
									<p>
										Yêu Cầu {item.RequestCode}: {item.diamondTitle}
									</p>
								</div>
							))}
						</>
					)}
				</div>
			</Modal>
			<AddModalDiamond
				showModal={isModalAddVisible}
				setShowModal={setIsModalAddVisible}
				selectedRequest={selectedRequest}
			/>
		</div>
	);
};

export default TimeLineOrder;
