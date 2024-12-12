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
	handleChangeDiamondCustomize,
	handleCustomizeOrder,
	handleRejectCustomize,
} from '../../../../../redux/slices/customizeSlice';
import {AddModalDiamond} from './AddModalDiamond/AddModalDiamond';
import {Clarity, Color, Cut, ShapeName} from '../../../../../utils/constant';

const {Title, Text} = Typography;
const {Option} = Select;

const ORDER_STATUS_TEXTS = {
	Pending: 'Chờ Thêm Kim Cương Yêu Cầu',
	Priced: 'Đã Thêm Kim Cương Yêu Cầu',
	Shop_Rejected: 'Shop Đã Từ Chối',
	Customer_Rejected: 'Đã Từ Chối Đơn',
	Customer_Cancelled: 'Đã Hủy Đơn',
	Requesting: 'Chờ Shop Xác Nhận Đơn Yêu Cầu',
	Accepted: 'Đã Chấp Nhận Đơn Thiết Kế',
};

const getClarityLabel = (clarityValue) => {
	return Object.keys(Clarity).find((key) => Clarity[key] === clarityValue) || clarityValue;
};

const getColorLabel = (colorValue) => {
	return Object.keys(Color).find((key) => Color[key] === colorValue) || colorValue;
};

const getCutLabel = (cutValue) => {
	return Object.keys(Cut).find((key) => Cut[key] === cutValue) || cutValue;
};

const getShapeLabel = (shapeId) => {
	return Object.keys(ShapeName).find((key) => ShapeName[key] === shapeId) || shapeId;
};

const TimeLineOrder = ({
	orders,
	loading,
	statusOrder,
	paymentStatusOrder,
	diamondRequests,
	allDiamondsHaveId,
	allDiamondRequests,
	currentDiamondId,
	setCurrentDiamondId,
	filteredDiamondRequests,
	setFilteredDiamondRequests,
	isModalVisible,
	setIsModalVisible,
	isModalAddVisible,
	setIsModalAddVisible,
	showModal,
	showModalAdd,
	setChangeDiamond,
	changeDiamond,
	selectedDiamond,
	filteredRequests,
	setCompleted,
}) => {
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
	const [filters, setFilter] = useState({});

	useEffect(() => {
		if (allDiamondRequests) {
			// Filter the array to only include requests where `Diamond` is not null
			const filtered = allDiamondRequests.filter((request) => request.Diamond !== null);
			setFilteredDiamondRequests(filtered);
			// setChangeDiamond(filtered);
		}
	}, [allDiamondRequests]);

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
				IsLabGrown:
					selectedRequest?.IsLabGrown === null
						? false
						: selectedRequest?.IsLabGrown === false
						? false
						: true,
			});
		}
	}, [selectedRequest]);

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
		setSelectedRequest(
			orders?.Status === 1
				? diamondRequests.find((request) => request.DiamondRequestId === value)
				: filteredRequests.find((request) => request.DiamondRequestId === value)
		);
		setCurrentDiamondId(null);
	};

	const handleDiamondSelectChange = (diamond) => {
		setCurrentDiamondId(diamond);
	};

	const handleSaveDiamond = () => {
		if (orders?.Status === 1) {
			if (selectedRequest && currentDiamondId) {
				// Create the updated selection
				const updatedSelection = {
					...currentDiamondId,
					diamondRequestId: selectedRequest.DiamondRequestId,
				};

				// Check if the DiamondRequestId already exists in filteredDiamondRequests
				const existingRequestIndex = filteredDiamondRequests.findIndex(
					(request) => request.DiamondRequestId === selectedRequest.DiamondRequestId
				);

				let updatedList;
				if (existingRequestIndex !== -1) {
					// If the DiamondRequestId exists, update the existing entry
					updatedList = filteredDiamondRequests.map((request, index) => {
						if (index === existingRequestIndex) {
							return {...request, ...updatedSelection};
						}
						return request;
					});
				} else {
					// If the DiamondRequestId doesn't exist, add the new selection
					updatedList = [
						...filteredDiamondRequests,
						{
							DiamondRequestId: selectedRequest.DiamondRequestId,
							...updatedSelection,
						},
					];
				}

				// Update the state with the new list
				setFilteredDiamondRequests(updatedList);
			} else {
				message.warning('Vui lòng chọn cả yêu cầu và kim cương.');
			}
		} else {
			if (selectedRequest && currentDiamondId) {
				const updatedSelection = {
					DiamondRequestId: selectedRequest.DiamondRequestId,
					...currentDiamondId,
				};

				// Nếu đã tồn tại key là DiamondRequestId trong đối tượng changeDiamond
				if (changeDiamond !== null) {
					setChangeDiamond({
						...changeDiamond,
						[selectedRequest.DiamondRequestId]: {
							...changeDiamond[selectedRequest.DiamondRequestId],
							...updatedSelection,
						},
					});
				} else {
					// Nếu chưa tồn tại, thêm mới entry vào đối tượng
					setChangeDiamond({
						...changeDiamond,
						[selectedRequest.DiamondRequestId]: updatedSelection,
					});
				}
			} else {
				message.warning('Vui lòng chọn cả yêu cầu và kim cương.');
			}
		}
	};

	const handleAddDiamond = () => {
		Modal.confirm({
			title: `Xác nhận ${
				orders?.Status === 1 ? 'thêm  các' : 'cập nhật'
			} kim cương vào đơn thiết kế này`,
			content: 'Bạn có chắc chắn muốn tiếp tục?',
			okText: 'Xác nhận',
			cancelText: 'Hủy',
			onOk: handleOk,
		});
	};

	const generateRandomSKU = (length = 16) => {
		const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		let sku = '';

		for (let i = 0; i < length; i++) {
			const randomIndex = Math.floor(Math.random() * characters.length);
			sku += characters[randomIndex];
		}

		return sku;
	};

	const handleOk = () => {
		if (orders?.Status === 1) {
			const diamondAssigning = allDiamondRequests?.map((req) => {
				// Find the matching entry in filteredDiamondRequests based on DiamondRequestId
				const matchingDiamond = filteredDiamondRequests?.find(
					(item) => item?.DiamondRequestId === req?.DiamondRequestId
				);

				// If a matching item is found, extract its Id; otherwise, set diamondId as null
				const diamondId = matchingDiamond ? matchingDiamond?.Id : null;

				const createDiamondCommand = req?.DiamondId
					? {
							diamond4c: {
								cut: req?.Diamond?.Cut,
								color: req?.Diamond?.Color,
								clarity: req?.Diamond?.Clarity,
								carat: req?.Diamond?.Carat,
								isLabDiamond: req?.Diamond?.IsLabDiamond,
							},
							details: {
								polish: req?.Diamond?.Polish,
								symmetry: req?.Diamond?.Symmetry,
								girdle: req?.Diamond?.Girdle,
								fluorescence: req?.Diamond?.Fluorescence,
								culet: req?.Diamond?.Culet,
							},
							measurement: {
								withLenghtRatio: req?.Diamond?.WidthLengthRatio,
								depth: req?.Diamond?.Depth,
								table: req?.Diamond?.Table,
								measurement: req?.Diamond?.Measurement,
							},
							shapeId: req?.Diamond?.DiamondShapeId,
							sku: generateRandomSKU(16),
							certificate: 1,
							priceOffset: req?.Diamond?.PriceOffset,
					  }
					: null;

				return {
					diamondRequestId: req?.DiamondRequestId,
					diamondId,
					createDiamondCommand,
				};
			});

			dispatch(
				handleCustomizeOrder({
					requestId: orders?.Id,
					sideDiamondOptId: orders?.SideDiamondId,
					diamondAssigning,
				})
			)
				.unwrap()
				.then((res) => {
					message.success('Xác nhận kim cương cho yêu cầu thành công!');
					setIsModalVisible(false);
					setCompleted(res);
				})
				.catch((error) => {
					message.error(error?.data?.detail);
				});
		} else {
			const diamondData = changeDiamond
				? changeDiamond[selectedRequest?.DiamondRequestId]
				: {};
			const createDiamondCommand = diamondData?.Id
				? null
				: {
						diamond4c: {
							cut: diamondData?.Cut,
							color: diamondData?.Color,
							clarity: diamondData?.Clarity,
							carat: diamondData?.Carat,
							isLabDiamond: diamondData?.IsLabDiamond,
						},
						details: {
							polish: diamondData?.Polish,
							symmetry: diamondData?.Symmetry,
							girdle: diamondData?.Girdle,
							fluorescence: diamondData?.Fluorescence,
							culet: diamondData?.Culet,
						},
						measurement: {
							withLenghtRatio: diamondData?.WithLenghtRatio,
							depth: diamondData?.Depth,
							table: diamondData?.Table,
							measurement: diamondData?.Measurement,
						},
						shapeId: diamondData?.DiamondShapeId,
						sku: generateRandomSKU(16),
						certificate: 1,
						priceOffset: diamondData?.PriceOffset,
				  };
			console.log('createDiamondCommand', createDiamondCommand);
			dispatch(
				handleChangeDiamondCustomize({
					customizeRequestId: selectedRequest?.CustomizeRequestId,
					diamondRequestId: diamondData?.DiamondRequestId,
					diamondId: diamondData?.Id || null,
					createDiamondCommand,
				})
			)
				.unwrap()
				.then(() => {
					message.success('Kim cương đã được cập nhật thành công!');
					setIsModalVisible(!isModalVisible);
					setSelectedRequest(null);
					setChangeDiamond(null);
				})
				.catch((error) => {
					message.error(error?.data?.detail);
				});
		}
	};

	const handleCancel = () => {
		setIsModalVisible(false);
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

	const handleAccepted = async () => {
		dispatch(handleCustomizeOrder({requestId: orders?.Id}))
			.unwrap()
			.then((res) => {
				console.log('res', res);
				message.success('Chấp nhận đơn thiết kế thành công!');
				setIsModalVisible(false);
				setCompleted(res);
			})
			.catch((error) => {
				message.error(error?.data?.detail);
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

	const handleRejectStatus = async () => {
		// console.log('diamondAssigning', diamondAssigning);

		dispatch(handleRejectCustomize(id))
			.unwrap()
			.then(() => {
				message.success('Hủy Đơn Yêu Cầu Thành Công!');
				setIsModalVisible(false);
			})
			.catch((error) => {
				message.error(error?.data?.detail);
			});
	};

	const submitCancelOrder = async (values) => {
		const res = await dispatch(handleOrderReject({orderId: orders.Id, reason: values.reason}))
			.unwrap()
			.then(() => {
				message.success('Từ chối thành công!');
			})
			.catch((error) => {
				message.error(error?.data?.detail);
			});
		setIsCancelModalVisible(false);
	};

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

							{userRoleStaff ? (
								<div className="flex justify-around">
									<Button
										type="text"
										className="bg-primary font-semibold w-32 rounded-full"
										onClick={allDiamondsHaveId ? handleAddDiamond : showModal}
										disabled={loading}
									>
										{allDiamondsHaveId ? 'Xác Nhận Đơn' : 'Thêm Kim Cương'}
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

					{status === 'Shop_Rejected' && (
						<div className="border rounded-lg border-primary bg-tintWhite p-5 mb-5">
							<div className="flex items-center" style={{fontSize: 16}}>
								<p className="font-semibold">Trạng thái đơn thiết kế:</p>
								<p className="ml-5 text-red font-semibold">
									<CloseCircleOutlined /> {ORDER_STATUS_TEXTS.Shop_Rejected}
								</p>
							</div>
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
					{status === 'Customer_Rejected' && (
						<div className="border rounded-lg border-primary bg-tintWhite p-5 mb-5">
							<div className="flex items-center" style={{fontSize: 16}}>
								<p className="font-semibold">Trạng thái đơn thiết kế:</p>
								<p className="ml-5 text-red font-semibold">
									<CloseCircleOutlined /> {ORDER_STATUS_TEXTS.Customer_Rejected}
								</p>
							</div>
						</div>
					)}

					{status === 'Customer_Cancelled' && (
						<div className="border rounded-lg border-primary bg-tintWhite p-5 mb-5">
							<div className="flex items-center" style={{fontSize: 16}}>
								<p className="font-semibold">Trạng thái đơn thiết kế:</p>
								<p className="ml-5 text-red font-semibold">
									<CloseCircleOutlined /> {ORDER_STATUS_TEXTS.Customer_Cancelled}
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
							<div className="flex justify-around font-semibold text-darkBlue text-lg">
								Vui Lòng Chờ Khách Hàng Xác Nhận
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
				</>
			)}

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
					<label>Chọn Yêu Cầu</label>
					<div className="flex">
						<Select
							placeholder="Chọn Yêu Cầu"
							onChange={handleSelectChange}
							value={selectedRequest?.DiamondRequestId || undefined}
							allowClear
							className="w-full"
						>
							{orders?.Status === 1
								? diamondRequests?.map((request, i) => (
										<Select.Option key={request.DiamondRequestId}>
											{`Yêu Cầu #${request?.Position}`}
										</Select.Option>
								  ))
								: filteredRequests?.map((request) => (
										<Select.Option key={request.DiamondRequestId}>
											{`Yêu Cầu #${request?.Position}`}
										</Select.Option>
								  ))}
						</Select>
						<Button
							className="ml-5"
							disabled={selectedRequest === null || selectedRequest === undefined}
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
						<Button type="primary" onClick={handleSaveDiamond}>
							Chọn Kim Cương Này
						</Button>
					</div>

					{filteredDiamondRequests?.length > 0 && (
						<>
							<h4 className="mt-5 font-semibold text-lg">
								Thông Tin Kim Cương Đã Chọn:
							</h4>
							<Table
								columns={[
									{
										title: 'Yêu Cầu',
										dataIndex: 'Position',
										key: 'position',
										render: (text) => <span>{text}</span>,
									},
									{
										title: 'Kim Cương',
										dataIndex: 'Title',
										key: 'title',
										render: (text, record) => (
											<span>{text || record?.Diamond?.Title}</span>
										),
									},
								]}
								dataSource={filteredDiamondRequests}
								rowKey="DiamondRequestId"
								pagination={false}
								className="my-5"
							/>
						</>
					)}

					{changeDiamond && (
						<div className="my-5">
							<h4 className="mt-5 font-semibold text-lg">
								Thông Tin Kim Cương Thay Thế:
							</h4>
							<Table
								columns={[
									{
										title: 'Yêu Cầu',
										dataIndex: 'Position',
										key: 'position',
										// align: 'center',
										render: (text) => <span>{text}</span>,
									},
									{
										title: 'Kim Cương',
										dataIndex: 'Title',
										key: 'title',
										// align: 'center',
										render: (text, record) => (
											<>
												{text ? (
													text
												) : (
													<>
														<span>{record?.Carat} carat</span>{' '}
														<span>{getColorLabel(record?.Color)}</span>-
														<span>
															{getClarityLabel(record?.Clarity)}
														</span>{' '}
														<span>{getCutLabel(record?.Cut)} Cut</span>{' '}
														<span>
															{getShapeLabel(record?.DiamondShapeId)}
														</span>{' '}
														diamond
													</>
												)}
											</>
										),
									},
								]}
								dataSource={
									changeDiamond
										? [changeDiamond[selectedRequest?.DiamondRequestId]]
										: []
								}
								rowKey="Position" // unique key for each row
								pagination={false} // Optional: disable pagination if needed
								className="my-5"
							/>
						</div>
					)}
				</div>
			</Modal>
			<AddModalDiamond
				orders={orders}
				showModal={isModalAddVisible}
				setShowModal={setIsModalAddVisible}
				selectedRequest={selectedRequest}
				handleSaveDiamond={handleSaveDiamond}
				handleDiamondSelectChange={handleDiamondSelectChange}
				generateRandomSKU={generateRandomSKU}
				changeDiamond={changeDiamond}
				setChangeDiamond={setChangeDiamond}
				selectedDiamond={selectedDiamond}
				filteredRequests={filteredRequests}
				setIsModalVisible={setIsModalVisible}
				setSelectedRequest={setSelectedRequest}
			/>
		</div>
	);
};

export default TimeLineOrder;
