import React, {useState} from 'react';
import {DeleteFilled, EditFilled, PlusOutlined} from '@ant-design/icons';
import {Button, Image, Input, Select, Space, Table, Tag} from 'antd';
import {Filter} from '../../../../components/Filter';
import '../../../../css/antd.css';

const {Search} = Input;

const dataSource = [
	{
		key: '1',
		id: 'P001',
		image: 'https://example.com/image1.jpg',
		productName: 'Diamond Ring',
		type: 'ring',
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
		type: 'bracelets',
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
		title: 'Type',
		key: 'type',
		dataIndex: 'type',
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

const JewelryPage = () => {
	const [active, setActive] = useState('all');
	const [type, setType] = useState('');
	const [metal, setMetal] = useState('');
	const [searchText, setSearchText] = useState('');

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

	const handleTypeChange = (value) => {
		setType(value);
	};

	const handleMetalChange = (value) => {
		setMetal(value);
	};

	const filteredData = dataSource.filter((item) => {
		const matchesType = type ? item.type === type : true;
		const matchesMetal = metal ? item.metal === metal : true;
		const matchesSearch = item.productName.toLowerCase().includes(searchText.toLowerCase());
		const matchesStatus =
			active === 'all' ? true : item.status.toLowerCase() === active.toLowerCase();

		// console.log('matchesType', matchesType);
		// console.log('matchesMetal', matchesMetal);
		// console.log('matchesSearch', matchesSearch);
		// console.log('matchesStatus', matchesStatus);

		return matchesType && matchesMetal && matchesSearch && matchesStatus;
	});

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
								style={{width: 120}}
								allowClear
								onChange={handleTypeChange}
								options={[
									{value: 'ring', label: 'Ring'},
									{value: 'pendant', label: 'Pendant'},
									{value: 'bracelets', label: 'Bracelets'},
									{value: 'earrings', label: 'Earrings'},
								]}
							/>
							<Select
								defaultValue=""
								style={{width: 120}}
								allowClear
								onChange={handleMetalChange}
								options={[
									{value: 'gold', label: 'Gold'},
									{value: 'silver', label: 'Silver'},
								]}
							/>
							<Select
								defaultValue=""
								style={{width: 120}}
								allowClear
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
						<Button type="text" className="bg-primary" icon={<PlusOutlined />}>
							Add
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
		</div>
	);
};

export default JewelryPage;
