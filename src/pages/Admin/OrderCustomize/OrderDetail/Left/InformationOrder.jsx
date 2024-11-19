import React, {useState} from 'react';

import {
	ArrowLeftOutlined,
	CheckCircleOutlined,
	ClockCircleFilled,
	CloseCircleOutlined,
	DeleteOutlined,
	SwapOutlined,
} from '@ant-design/icons';
import {Button, Col, Divider, Modal, Row, Table, Tag, Tooltip, Typography} from 'antd';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import {LoadingOrderSelector} from '../../../../../redux/selectors';
import {
	convertToVietnamDate,
	getOrderCustomizeStatus,
	getOrderStatusTag,
} from '../../../../../utils';
import {enums} from '../../../../../utils/constant';
import TimeLineOrder from '../Right/TimeLineOrder';
import {
	handleChangeDiamondCustomize,
	handleDeleteDiamondCustomize,
} from '../../../../../redux/slices/customizeSlice';

const {Title, Text} = Typography;

const InformationOrder = ({
	orders,
	statusOrder,
	paymentStatusOrder,
	diamondRequests,
	allDiamondsHaveId,
	allDiamondRequests,
}) => {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const loading = useSelector(LoadingOrderSelector);

	const orderStatus = getOrderStatusTag(paymentStatusOrder);
	const status = getOrderCustomizeStatus(statusOrder);
	const [expandedRowKeys, setExpandedRowKeys] = useState([]);

	const reverseEnum = (enumObj) => {
		return Object.fromEntries(
			Object.entries(enumObj).map(([key, value]) => [value, key.replace(/_/g, ' ')])
		);
	};

	const reversedEnums = {
		Clarity: reverseEnum(enums.Clarity),
		Color: reverseEnum(enums.Color),
		Culet: reverseEnum(enums.Culet),
		Cut: reverseEnum(enums.Cut),
		Girdle: reverseEnum(enums.Girdle),
		Polish: reverseEnum(enums.Polish),
		Symmetry: reverseEnum(enums.Symmetry),
		Status: reverseEnum(enums.CustomizeRequestStatus),
		Shapes: reverseEnum(enums.Shapes),
	};

	const statusColors = {
		1: 'orange', // Pending
		2: 'blue', // Priced
		3: 'purple', // Requesting
		4: 'green', // Accepted
		5: 'red', // Shop_Rejected
		6: 'volcano', // Customer_Rejected
	};

	const mainColumns = [
		{
			title: 'Mã Yêu Cầu',
			dataIndex: 'RequestCode',
			key: 'RequestCode',
			render: (text) => {
				return text;
			},
		},
		{
			title: 'Mẫu',
			dataIndex: 'JewelryModel',
			key: 'jewelryName',
			render: (text) => {
				return text?.Name;
			},
		},
		{
			title: 'Vật Liệu',
			dataIndex: 'Metal',
			key: 'metalName',
			render: (text) => {
				return text?.Name;
			},
		},
		{
			title: 'Kim Cương Tấm (Carat)',
			dataIndex: 'SideDiamond',
			key: 'sideDiamond',
			render: (text) => {
				return text?.CaratWeight;
			},
		},
		{
			title: 'Kim Cương Tấm (Số Lượng)',
			dataIndex: 'SideDiamond',
			key: 'sideDiamond',
			render: (text) => {
				return text?.Quantity;
			},
		},
		{
			title: 'Chữ Khắc',
			dataIndex: 'EngravedText',
			key: 'engravedText',
			render: (text) => text,
		},
		{
			title: 'Ngày Tạo Đơn',
			dataIndex: 'CreatedDate',
			key: 'createdAt',
			render: (text) => text,
		},
		{
			title: 'Ngày Hết Hạn',
			dataIndex: 'ExpiredDate',
			key: 'expiredDate',
			render: (text) => text,
		},
		{
			title: 'Trạng Thái',
			dataIndex: 'Status',
			key: 'status',
			render: (status) => {
				const statusLabel = reversedEnums.Status[status] || 'Không';
				const color = statusColors[status] || 'default';
				return <Tag color={color}>{statusLabel.toUpperCase()}</Tag>;
			},
		},
	];

	const subColumns = [
		{
			title: 'Ly (Carat)',
			dataIndex: 'CaratFrom',
			key: 'caratRange',
			render: (CaratFrom, record) => `${CaratFrom} - ${record.CaratTo}`,
		},

		{
			title: 'Độ Trong (Clarity)',
			key: 'clarityRange',
			render: (record) => {
				const clarityFrom = reversedEnums.Clarity[record.ClarityFrom] || 'Không';
				const clarityTo = reversedEnums.Clarity[record.ClarityTo] || 'Không';
				return `${clarityFrom} - ${clarityTo}`;
			},
		},
		{
			title: 'Màu Sắc (Color)',
			key: 'colorRange',
			render: (record) => {
				const colorFrom = reversedEnums.Color[record.ColorFrom] || 'Không';
				const colorTo = reversedEnums.Color[record.ColorTo] || 'Không';
				return `${colorFrom} - ${colorTo}`;
			},
		},
		{
			title: 'Chế Tác (Cut)',
			key: 'cutRange',
			render: (record) => {
				const cutFrom = reversedEnums.Cut[record.CutFrom] || 'Không';
				const cutTo = reversedEnums.Cut[record.CutTo] || 'Không';
				return `${cutFrom} - ${cutTo}`;
			},
		},
		{
			title: 'Chóp Đáy (Culet)',
			dataIndex: 'Culet',
			key: 'culet',
			render: (culet) => reversedEnums.Culet[culet] || 'Không',
		},
		{
			title: 'Viền Cạnh (Girdle)',
			dataIndex: 'Girdle',
			key: 'girdle',
			render: (girdle) => reversedEnums.Girdle[girdle] || 'Không',
		},
		{
			title: 'Độ Bóng (Polish)',
			dataIndex: 'Polish',
			key: 'polish',
			render: (polish) => reversedEnums.Polish[polish] || 'Không',
		},
		{
			title: 'Độ đối xứng (Symmetry)',
			dataIndex: 'Symmetry',
			key: 'symmetry',
			render: (symmetry) => reversedEnums.Symmetry[symmetry] || 'Không',
		},
		{
			title: 'Hình Dạng',
			dataIndex: 'DiamondShapeId',
			key: 'shape',
			render: (shape) => reversedEnums.Shapes[shape] || 'Không',
		},
		{
			title: 'Nguồn Gốc',
			dataIndex: 'IsLabGrown',
			key: 'IsLabGrown',
			render: (shape) => (shape ? 'Nhân Tạo' : 'Tự Nhiên'),
		},
		...(orders?.Status === 1
			? [
					{
						title: '',
						key: 'action',
						render: (_, record) => {
							console.log('record', record);

							return record?.DiamondId ? (
								<Tooltip title="Xóa Kim Cương Đã Thêm">
									<DeleteOutlined
										style={{color: 'red', cursor: 'pointer'}}
										onClick={() => handleDelete(record)}
									/>
								</Tooltip>
							) : null;
						},
					},
			  ]
			: []),
		...(orders?.Status === 2
			? [
					{
						title: '',
						key: 'action',
						render: (_, record) => {
							console.log('record', record);

							return record?.DiamondId ? (
								<Tooltip title="Thay Đổi Kim Cương Đã Thêm">
									<SwapOutlined
										style={{cursor: 'pointer'}}
										onClick={() => handleChange(record)}
									/>
								</Tooltip>
							) : null;
						},
					},
			  ]
			: []),
	];

	const sub2Columns = [
		{
			title: 'Ly (Carat)',
			dataIndex: 'Carat',
			key: 'carat',
		},

		{
			title: 'Độ Trong (Clarity)',
			dataIndex: 'Clarity',
			key: 'clarity',
			render: (clarity) => reversedEnums.Clarity[clarity] || 'Không',
		},

		{
			title: 'Màu Sắc (Color)',
			dataIndex: 'Color',
			key: 'color',
			render: (color) => reversedEnums.Color[color] || 'Không',
		},

		{
			title: 'Chế Tác (Cut)',
			dataIndex: 'Cut',
			key: 'cut',
			render: (cut) => reversedEnums.Cut[cut] || 'Không',
		},

		{
			title: 'Chóp Đáy (Culet)',
			dataIndex: 'Culet',
			key: 'culet',
			render: (culet) => reversedEnums.Culet[culet] || 'Không',
		},
		{
			title: 'Viền Cạnh (Girdle)',
			dataIndex: 'Girdle',
			key: 'girdle',
			render: (girdle) => reversedEnums.Girdle[girdle] || 'Không',
		},
		{
			title: 'Độ Bóng (Polish)',
			dataIndex: 'Polish',
			key: 'polish',
			render: (polish) => reversedEnums.Polish[polish] || 'Không',
		},
		{
			title: 'Độ đối xứng (Symmetry)',
			dataIndex: 'Symmetry',
			key: 'symmetry',
			render: (symmetry) => reversedEnums.Symmetry[symmetry] || 'Không',
		},
		{
			title: 'Hình Dạng',
			dataIndex: 'DiamondShapeId',
			key: 'shape',
			render: (shape) => reversedEnums.Shapes[shape] || 'Không',
		},
		{
			title: 'Nguồn Gốc',
			dataIndex: 'IsLabGrown',
			key: 'IsLabGrown',
			render: (shape) => (shape ? 'Nhân Tạo' : 'Tự Nhiên'),
		},
	];

	const handleExpand = (expanded, record) => {
		setExpandedRowKeys(expanded ? [record.Id] : []);
	};

	const expandedRowRender = (record) => (
		<Table
			columns={subColumns}
			dataSource={record.DiamondRequests}
			pagination={false}
			expandedRowRender={expandedRow2Render}
			rowKey={(item) => item.DiamondRequestId}
			summary={() => (
				<Table.Summary.Row>
					<Table.Summary.Cell colSpan={subColumns.length}>
						<Text strong>Thông tin đơn yêu cầu của khách</Text>
					</Table.Summary.Cell>
				</Table.Summary.Row>
			)}
		/>
	);

	const expandedRow2Render = (record) => (
		<Table
			columns={sub2Columns}
			// Wrap the single object `record.Diamond` in an array
			dataSource={record.Diamond ? [record.Diamond] : []}
			pagination={false}
			rowKey={(item) => item.Id}
			summary={() => (
				<Table.Summary.Row>
					<Table.Summary.Cell colSpan={subColumns.length}>
						<Text strong>Thông tin kim cương đã thêm cho đơn</Text>
					</Table.Summary.Cell>
				</Table.Summary.Row>
			)}
		/>
	);

	const handleChange = (request) => {
		Modal.confirm({
			title: 'Xác nhận xóa',
			content: 'Bạn có chắc chắn muốn xóa kim cương đã thêm trong yêu cầu này?',
			okText: 'Xóa',
			okType: 'danger',
			cancelText: 'Hủy',
			onOk: () => handleChangeConfirm(request),
			onCancel: () => {
				console.log('Cancel deletion');
			},
		});
	};

	const handleChangeConfirm = (request) => {
		console.log('request', request);
		dispatch(
			handleChangeDiamondCustomize({
				diamondId: request?.DiamondId,
				customizeRequestId: request?.CustomizeRequestId,
				diamondRequestId: request?.DiamondRequestId,
			})
		);
	};

	const handleDelete = (request) => {
		Modal.confirm({
			title: 'Xác nhận xóa',
			content: 'Bạn có chắc chắn muốn xóa kim cương đã thêm trong yêu cầu này?',
			okText: 'Xóa',
			okType: 'danger',
			cancelText: 'Hủy',
			onOk: () => handleDeleteConfirm(request),
			onCancel: () => {
				console.log('Cancel deletion');
			},
		});
	};

	const handleDeleteConfirm = (request) => {
		console.log('request', request);
		dispatch(
			handleDeleteDiamondCustomize({
				diamondId: request?.DiamondId,
				customizeRequestId: request?.CustomizeRequestId,
				diamondRequestId: request?.DiamondRequestId,
			})
		);
	};

	console.log('orders', orders);

	return (
		<div>
			<div className="mb-4">
				<Button
					icon={<ArrowLeftOutlined />}
					type="text"
					className="bg-primary"
					onClick={() => navigate('/request-customize')}
				>
					Quay lại
				</Button>
			</div>
			<Row>
				<Col span={24}>
					<Title level={3}>Chi Tiết Yêu Cầu</Title>
				</Col>
			</Row>

			<Divider style={{borderColor: '#d9d9d9'}} />
			<Row>
				<Col span={24}>
					<Title level={4}>Thông Tin Chung</Title>
				</Col>
			</Row>
			<div className="w-full flex">
				<div className="w-1/2">
					<Row gutter={[16, 16]} justify="center" align="middle" className="my-3">
						<Col span={12}>
							<Text strong style={{fontSize: 18}}>
								Khách hàng
							</Text>
							<br />
							<Text>
								{orders?.Account?.FirstName} {orders?.Account?.LastName}
							</Text>
						</Col>
						<Col span={12}>
							<Text strong style={{fontSize: 18}}>
								Email
							</Text>
							<br />
							<Text>{orders?.Account?.Email}</Text>
						</Col>
					</Row>
					<Row gutter={[16, 16]} justify="center" align="middle" className="my-3">
						<Col span={12}>
							<Text strong style={{fontSize: 18}}>
								Ngày Tạo Yêu Cầu
							</Text>
							<br />
							<Text>{convertToVietnamDate(orders?.CreatedDate)}</Text>
						</Col>
						<Col span={12}>
							<Text strong style={{fontSize: 18}}>
								Ngày Hết Hạn
							</Text>
							<br />
							<Text>{convertToVietnamDate(orders?.ExpiredDate)}</Text>
						</Col>
					</Row>
				</div>
				<div className="w-1/3">
					<TimeLineOrder
						orders={orders}
						statusOrder={statusOrder}
						paymentStatusOrder={paymentStatusOrder}
						diamondRequests={diamondRequests}
						allDiamondRequests={allDiamondRequests}
						allDiamondsHaveId={allDiamondsHaveId}
					/>
				</div>
			</div>
			<Row gutter={[16, 16]} justify="center" align="middle" className="my-3">
				<Col span={12}>
					<Text strong style={{fontSize: 18}}>
						Trạng Thái
					</Text>
					<br />
					{status === 'Pending' && (
						<p className="text-primary font-semibold bg-white p-2 rounded-full">
							<ClockCircleFilled /> Đơn Chưa Thêm Kim Cương
						</p>
					)}
					{status === 'Priced' && (
						<p className=" text-darkGreen font-semibold bg-white p-2 rounded-full">
							<CheckCircleOutlined /> Đơn Đã Có Giá Sản Phẩm
						</p>
					)}
					{status === 'Requesting' && (
						<p className=" text-darkGreen font-semibold bg-white p-2 rounded-full">
							<CheckCircleOutlined /> Khách Đồng Ý Đơn Thiết Kế
						</p>
					)}
					{status === 'Accepted' && (
						<p className=" text-darkGreen font-semibold bg-white p-2 rounded-full">
							<CheckCircleOutlined /> Đơn Thiết Kế Đã Được Chấp Nhận
						</p>
					)}
					{status === 'Shop_Rejected' && (
						<p className=" text-red font-semibold bg-white p-2 rounded-full">
							<CloseCircleOutlined /> Đơn Thiết Kế Đã Bị Từ Chối
						</p>
					)}
				</Col>
				<Col span={12}></Col>
			</Row>

			{/* <Row gutter={[16, 16]} justify="center" align="middle" className="my-3">
				<Col span={12}>
					<Text strong style={{fontSize: 18}}>
						Ngày Đặt Hàng
					</Text>
					<br />
					<Text>{convertToVietnamDate(orders?.CreatedDate)}</Text>
				</Col>

				<Col span={12}>
					{orders && orders?.CancelledReason === null && (
						<>
							<Text strong className="mb-5" style={{fontSize: 18}}>
								Phương Thức Thanh Toán
							</Text>
							<br />
							<Tag color={orderStatus.color}>{orderStatus.name.toUpperCase()}</Tag>
						</>
					)}
				</Col>
			</Row> */}

			<Divider style={{borderColor: '#d9d9d9'}} />
			<Row>
				<Col span={24}>
					<Title level={4}>Chi Tiết Yêu Cầu Thiết Kế</Title>
				</Col>
			</Row>
			<div className="mt-5 mx-10">
				<Table
					columns={mainColumns}
					dataSource={orders ? [orders] : []}
					pagination={false}
					rowKey="Id"
					size="large"
					expandedRowRender={expandedRowRender}
					expandedRowKeys={expandedRowKeys}
					onExpand={handleExpand}
				/>
			</div>
		</div>
	);
};

export default InformationOrder;