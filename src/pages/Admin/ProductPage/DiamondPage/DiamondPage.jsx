import React, {useState} from 'react';

import {DeleteFilled, EditFilled, PlusOutlined} from '@ant-design/icons';
import {Button, Image, Input, Select, Space, Table, Tag} from 'antd';
import {Filter} from '../../../../components/Filter';
import '../../../../css/antd.css';
import {AddModalDiamond} from './AddModalDiamond/AddModalDiamond';

const {Search} = Input;

const dataSource = [
	{
		key: '1',
		id: 'P001',
		image: 'https://example.com/image1.jpg',
		productName: 'Diamond Ring',
		shape: 'round',
		sku: 'SKU001',
		status: 'Activated',
		price: '$5000',
		name: 'Mike',
	},
	{
		key: '2',
		id: 'P002',
		image: 'https://example.com/image2.jpg',
		productName: 'Gold Necklace',
		shape: 'radiant',
		sku: 'SKU002',
		status: 'Expired',
		price: '$3000',
		name: 'John',
	},
];

const columns = [
	{
		title: 'ID',
		dataIndex: 'id',
		key: 'id',
		align: 'center',
	},
	{
		title: 'Image',
		dataIndex: 'image',
		key: 'image',
		align: 'center',
		render: (text) => <Image src={text} alt="product" style={{width: 50, height: 50}} />,
	},
	{
		title: 'Product Name',
		dataIndex: 'productName',
		key: 'productName',
		align: 'center',
	},
	{
		title: 'Shape',
		key: 'shape',
		dataIndex: 'shape',
		align: 'center',
	},
	{
		title: 'SKU',
		key: 'sku',
		dataIndex: 'sku',
		align: 'center',
	},
	{
		title: 'Status',
		key: 'status',
		dataIndex: 'status',
		align: 'center',
		render: (status) => {
			let color = status.length > 5 ? 'geekblue' : 'green';
			if (status === 'Expired') {
				color = 'volcano';
			}
			return <Tag color={color}>{status.toUpperCase()}</Tag>;
		},
	},
	{
		title: 'Price',
		key: 'price',
		dataIndex: 'price',
		align: 'center',
	},
	{
		title: 'Action',
		key: 'action',
		align: 'center',
		render: (_, record) => (
			<Space size="middle">
				<Button type="primary" ghost>
					<EditFilled />
				</Button>
				<Button danger>
					<DeleteFilled />
				</Button>
			</Space>
		),
	},
];

const DiamondPage = () => {
	const [active, setActive] = useState('all');
	const [type, setType] = useState('');
	const [shape, setShape] = useState('');
	const [searchText, setSearchText] = useState('');
	const [showModal, setShowModal] = useState(false);

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

	const filteredData = dataSource.filter((item) => {
		const matchesShape = shape ? item.shape === shape : true;
		const matchesSearch = item.productName.toLowerCase().includes(searchText.toLowerCase());
		const matchesStatus =
			active === 'all' ? true : item.status.toLowerCase() === active.toLowerCase();

		// console.log('matchesType', matchesType);
		// console.log('matchesMetal', matchesMetal);
		// console.log('matchesSearch', matchesSearch);
		// console.log('matchesStatus', matchesStatus);

		return matchesShape && matchesSearch && matchesStatus;
	});

	const showModelAdd = () => {
		setShowModal(true);
	};

	// console.log(filteredData);

	return (
		<div className="mx-20 my-10">
			<Filter filter={filter} handleStatusBtn={handleStatusBtn} active={active} />
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
						dataSource={filteredData}
						columns={columns}
						className="custom-table-header"
					/>
				</div>
			</div>
			<AddModalDiamond setShowModal={setShowModal} showModal={showModal} />
		</div>
	);
};

export default DiamondPage;
