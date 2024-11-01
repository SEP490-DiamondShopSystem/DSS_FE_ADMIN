import React, {useEffect, useState} from 'react';

import {DeleteFilled, EditFilled, PlusOutlined} from '@ant-design/icons';
import {Button, Image, Input, message, Modal, Select, Space, Table, Tag} from 'antd';
import {Filter} from '../../../../components/Filter';
import '../../../../css/antd.css';
import {AddModalDiamond} from './AddModalDiamond/AddModalDiamond';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import {getAllDiamond, handleDeleteDiamond} from '../../../../redux/slices/diamondSlice';
import {getAllDiamondSelector, LoadingDiamondSelector} from '../../../../redux/selectors';
import {formatPrice} from '../../../../utils';

const {Search} = Input;

const DiamondPage = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const diamondList = useSelector(getAllDiamondSelector);
	const loading = useSelector(LoadingDiamondSelector);

	const [active, setActive] = useState('all');
	const [type, setType] = useState('');
	const [shape, setShape] = useState('');
	const [searchText, setSearchText] = useState('');
	const [showModal, setShowModal] = useState(false);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [diamonds, setDiamonds] = useState([]);
	const [diamondId, setDiamondId] = useState();

	const columns = [
		{
			title: 'Hình Ảnh',
			dataIndex: 'Thumbnail',
			key: 'Thumbnail',
			align: 'center',
			render: (text) => <Image src={text} alt="product" style={{width: 50, height: 50}} />,
		},

		{
			title: 'Kim Cương',
			dataIndex: 'Title',
			key: 'Title',
			align: 'center',
		},
		{
			title: 'Nguồn Gốc',
			key: 'IsLabDiamond',
			dataIndex: 'IsLabDiamond',
			align: 'center',
			render: (isLabDiamond) => {
				const color = isLabDiamond ? 'volcano' : 'green';
				const label = isLabDiamond ? 'Nhân Tạo' : 'Tự Nhiên';

				return (
					<Tag color={color} key={label}>
						{label.toUpperCase()}
					</Tag>
				);
			},
		},
		{
			title: 'SKU',
			key: 'CriteriaId',
			dataIndex: 'CriteriaId',
			align: 'center',
		},
		// {
		// 	title: 'Status',
		// 	key: 'status',
		// 	dataIndex: 'status',
		// 	align: 'center',
		// 	render: (status) => {
		// 		let color = status.length > 5 ? 'geekblue' : 'green';
		// 		if (status === 'Expired') {
		// 			color = 'volcano';
		// 		}
		// 		return <Tag color={color}>{status.toUpperCase()}</Tag>;
		// 	},
		// },
		{
			title: 'Giá',
			key: 'TruePrice',
			dataIndex: 'TruePrice',
			align: 'center',
		},
		{
			title: '',
			key: 'action',
			align: 'center',
			render: (_, record) => (
				<Space size="middle">
					{/* <Button type="primary" ghost>
					<EditFilled />
				</Button> */}
					<Button danger onClick={() => showDeleteModal(record.Id)}>
						<DeleteFilled />
					</Button>
				</Space>
			),
		},
	];

	useEffect(() => {
		dispatch(getAllDiamond());
	}, []);

	useEffect(() => {
		if (diamondList) {
			const diamondSetting = diamondList.map((diamond) => ({
				Id: diamond?.Id,
				ShapeName: diamond?.DiamondShape?.ShapeName,
				CriteriaId: diamond?.DiamondPrice?.CriteriaId,
				Carat: diamond?.Carat,
				Clarity: diamond?.Clarity,
				Color: diamond?.Color,
				Culet: diamond?.Culet,
				Depth: diamond?.Depth,
				IsLabDiamond: diamond?.IsLabDiamond,
				Measurement: diamond?.Measurement,
				Polish: diamond?.Polish,
				PriceOffset: diamond?.PriceOffset,
				Symmetry: diamond?.Symmetry,
				Table: diamond?.Table,
				Title: diamond?.Title,
				TruePrice: formatPrice(diamond?.TruePrice),
				WidthLengthRatio: diamond?.WidthLengthRatio,
				Girdle: diamond?.Girdle,
				Fluorescence: diamond?.Fluorescence,
				Thumbnail: diamond?.Thumbnail,
			}));
			setDiamonds(diamondSetting);
		}
	}, [diamondList]);

	console.log('diamonds', diamonds);

	const filter = [
		{name: 'All', value: 'all'},
		{name: 'Activated', value: 'activated'},
		{name: 'Expired', value: 'expired'},
	];

	const handleStatusBtn = (status) => {
		setActive(status);
	};

	const onSearch = (value) => {
		setSearchText(value);
	};

	const handleShapeChange = (value) => {
		setShape(value);
	};

	const showModelAdd = () => {
		setShowModal(true);
	};

	const showDeleteModal = (id) => {
		setIsModalVisible(true);
		setDiamondId(id);
		console.log('id', id);
	};

	const handleDelete = () => {
		console.log('Deleted successfully');
		dispatch(handleDeleteDiamond(diamondId)).then((res) => {
			console.log('res', res);

			if (res.payload !== undefined) {
				message.success('Xóa Kim Cương Thành Công!');
			} else {
				message.error('Có lỗi khi xóa kim cương.');
			}
		});
		setIsModalVisible(false);
	};

	const handleCancel = () => {
		setIsModalVisible(false);
	};

	// console.log(filteredData);

	return (
		<div className="mx-20 my-10">
			{/* <Filter filter={filter} handleStatusBtn={handleStatusBtn} active={active} /> */}
			<div>
				<div className="flex items-center justify-between">
					<div className="flex items-center my-5">
						<p className="mr-3">Tìm kiếm</p>
						<Search
							className="w-60"
							placeholder="input search text"
							allowClear
							onSearch={onSearch}
						/>
						<Space wrap className="ml-8">
							<Select
								defaultValue=""
								placeholder="Shape"
								style={{width: 120}}
								allowClear
								onChange={handleShapeChange}
								options={[
									{value: 'round', label: 'Round'},
									{value: 'princess', label: 'Princess'},
									{value: 'cushion', label: 'Cushion'},
									{value: 'oval', label: 'Oval'},
									{value: 'emerald', label: 'Emerald'},
									{value: 'pear', label: 'Pear'},
									{value: 'asscher', label: 'Asscher'},
									{value: 'heart', label: 'Heart'},
									{value: 'radiant', label: 'Radiant'},
									{value: 'marquise', label: 'Marquise'},
								]}
							/>
						</Space>
					</div>
					<div>
						<Button
							type="text"
							className="bg-primary"
							icon={<PlusOutlined />}
							onClick={showModelAdd}
						>
							Thêm
						</Button>
					</div>
				</div>
				<div>
					<Table
						dataSource={diamonds}
						columns={columns}
						className="custom-table-header"
						loading={loading}
						pagination={{pageSize: 5}}
					/>
				</div>
			</div>
			<AddModalDiamond setShowModal={setShowModal} showModal={showModal} />
			<Modal
				title="Xóa Kim Cương"
				visible={isModalVisible}
				onOk={handleDelete}
				onCancel={handleCancel}
			>
				<p>Bạn có chắc chắn muốn xóa kim cương này không?</p>
			</Modal>
		</div>
	);
};

export default DiamondPage;
