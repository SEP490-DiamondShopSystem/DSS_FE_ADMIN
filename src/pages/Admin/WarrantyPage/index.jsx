import React, {useState} from 'react';
import {Image, Input, Select, Space, Table, Tag} from 'antd';
import {Filter} from '../../../components/Filter';

const {Search} = Input;
const dataSource = [
	{
		id: '1',
		image: 'https://via.placeholder.com/50',
		productName: 'Sản Phẩm 1',
		shipDate: '2023-09-10',
		expireDate: '2024-09-10',
		sku: 'SKU001',
		owner: 'Nguyễn Văn A',
		status: 'Active',
		type: 'jewelry',
	},
	{
		id: '2',
		image: 'https://via.placeholder.com/50',
		productName: 'Sản Phẩm 2',
		shipDate: '2023-08-22',
		expireDate: '2024-08-22',
		sku: 'SKU002',
		owner: 'Trần Thị B',
		status: 'Expired',
		type: 'diamond',
	},
	{
		id: '3',
		image: 'https://via.placeholder.com/50',
		productName: 'Sản Phẩm 3',
		shipDate: '2023-07-15',
		expireDate: '2024-07-15',
		sku: 'SKU003',
		owner: 'Lê Văn C',
		status: 'Expired',
		type: 'jewelry',
	},
	{
		id: '4',
		image: 'https://via.placeholder.com/50',
		productName: 'Sản Phẩm 4',
		shipDate: '2023-06-30',
		expireDate: '2024-06-30',
		sku: 'SKU004',
		owner: 'Phạm Thị D',
		status: 'Active',
		type: 'diamond',
	},
	{
		id: '5',
		image: 'https://via.placeholder.com/50',
		productName: 'Sản Phẩm 5',
		shipDate: '2023-05-20',
		expireDate: '2024-05-20',
		sku: 'SKU005',
		owner: 'Hoàng Văn E',
		status: 'Active',
		type: 'jewelry',
	},
	{
		id: '6',
		image: 'https://via.placeholder.com/50',
		productName: 'Sản Phẩm 6',
		shipDate: '2023-04-12',
		expireDate: '2024-04-12',
		sku: 'SKU006',
		owner: 'Đặng Thị F',
		status: 'Active',
		type: 'diamond',
	},
	{
		id: '7',
		image: 'https://via.placeholder.com/50',
		productName: 'Sản Phẩm 7',
		shipDate: '2023-03-25',
		expireDate: '2024-03-25',
		sku: 'SKU007',
		owner: 'Nguyễn Văn G',
		status: 'Expired',
		type: 'jewelry',
	},
	{
		id: '8',
		image: 'https://via.placeholder.com/50',
		productName: 'Sản Phẩm 8',
		shipDate: '2023-02-10',
		expireDate: '2024-02-10',
		sku: 'SKU008',
		owner: 'Trần Thị H',
		status: 'Expired',
		type: 'diamond',
	},
	{
		id: '9',
		image: 'https://via.placeholder.com/50',
		productName: 'Sản Phẩm 9',
		shipDate: '2023-01-18',
		expireDate: '2024-01-18',
		sku: 'SKU009',
		owner: 'Lê Văn I',
		status: 'Expired',
		type: 'jewelry',
	},
	{
		id: '10',
		image: 'https://via.placeholder.com/50',
		productName: 'Sản Phẩm 10',
		shipDate: '2022-12-30',
		expireDate: '2023-12-30',
		sku: 'SKU010',
		owner: 'Phạm Thị K',
		status: 'Expired',
		type: 'diamond',
	},
	{
		id: '11',
		image: 'https://via.placeholder.com/50',
		productName: 'Sản Phẩm 11',
		shipDate: '2022-11-20',
		expireDate: '2023-11-20',
		sku: 'SKU011',
		owner: 'Nguyễn Văn L',
		status: 'Active',
		type: 'jewelry',
	},
	{
		id: '12',
		image: 'https://via.placeholder.com/50',
		productName: 'Sản Phẩm 12',
		shipDate: '2022-10-15',
		expireDate: '2023-10-15',
		sku: 'SKU012',
		owner: 'Trần Thị M',
		status: 'Expired',
		type: 'diamond',
	},
	{
		id: '13',
		image: 'https://via.placeholder.com/50',
		productName: 'Sản Phẩm 13',
		shipDate: '2022-09-10',
		expireDate: '2023-09-10',
		sku: 'SKU013',
		owner: 'Lê Văn N',
		status: 'Expired',
		type: 'jewelry',
	},
	{
		id: '14',
		image: 'https://via.placeholder.com/50',
		productName: 'Sản Phẩm 14',
		shipDate: '2022-08-05',
		expireDate: '2023-08-05',
		sku: 'SKU014',
		owner: 'Phạm Thị O',
		status: 'Active',
		type: 'diamond',
	},
	{
		id: '15',
		image: 'https://via.placeholder.com/50',
		productName: 'Sản Phẩm 15',
		shipDate: '2022-07-20',
		expireDate: '2023-07-20',
		sku: 'SKU015',
		owner: 'Hoàng Văn P',
		status: 'Expired',
		type: 'jewelry',
	},
	{
		id: '16',
		image: 'https://via.placeholder.com/50',
		productName: 'Sản Phẩm 16',
		shipDate: '2022-06-10',
		expireDate: '2023-06-10',
		sku: 'SKU016',
		owner: 'Đặng Thị Q',
		status: 'Active',
		type: 'diamond',
	},
	{
		id: '17',
		image: 'https://via.placeholder.com/50',
		productName: 'Sản Phẩm 17',
		shipDate: '2022-05-05',
		expireDate: '2023-05-05',
		sku: 'SKU017',
		owner: 'Nguyễn Văn R',
		status: 'Expired',
		type: 'jewelry',
	},
	{
		id: '18',
		image: 'https://via.placeholder.com/50',
		productName: 'Sản Phẩm 18',
		shipDate: '2022-04-01',
		expireDate: '2023-04-01',
		sku: 'SKU018',
		owner: 'Trần Thị S',
		status: 'Expired',
		type: 'diamond',
	},
	{
		id: '19',
		image: 'https://via.placeholder.com/50',
		productName: 'Sản Phẩm 19',
		shipDate: '2022-03-10',
		expireDate: '2023-03-10',
		sku: 'SKU019',
		owner: 'Lê Văn T',
		status: 'Active',
		type: 'jewelry',
	},
	{
		id: '20',
		image: 'https://via.placeholder.com/50',
		productName: 'Sản Phẩm 20',
		shipDate: '2022-02-15',
		expireDate: '2023-02-15',
		sku: 'SKU020',
		owner: 'Phạm Thị U',
		status: 'Active',
		type: 'diamond',
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
		title: 'Hình Ảnh',
		dataIndex: 'image',
		key: 'image',
		align: 'center',
		render: (text) => <Image src={text} alt="product" style={{width: 50, height: 50}} />,
	},
	{
		title: 'Tên Sản Phẩm',
		dataIndex: 'productName',
		key: 'productName',
		align: 'center',
	},
	{
		title: 'Ngày Vận Chuyển',
		key: 'shipDate',
		dataIndex: 'shipDate',
		align: 'center',
	},
	{
		title: 'Ngày Hết Hạn Bảo Hành',
		key: 'expireDate',
		dataIndex: 'expireDate',
		align: 'center',
	},
	{
		title: 'SKU',
		key: 'sku',
		dataIndex: 'sku',
		align: 'center',
	},
	{
		title: 'Người Sở Hữu',
		key: 'owner',
		dataIndex: 'owner',
		align: 'center',
	},
	{
		title: 'Status',
		key: 'status',
		dataIndex: 'status',
		align: 'center',
		render: (status) => {
			let color = status === 'Expired' ? 'volcano' : 'geekblue';
			return <Tag color={color}>{status.toUpperCase()}</Tag>;
		},
	},
	{
		title: 'Loại',
		key: 'type',
		dataIndex: 'type',
		align: 'center',
	},
];

const WarrantyPage = () => {
	const [active, setActive] = useState('all');
	const [searchText, setSearchText] = useState('');
	const [type, setType] = useState('');

	const filter = [
		{name: 'All', value: 'all'},
		{name: 'Active', value: 'Active'},
		{name: 'Expired', value: 'Expired'},
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

	const filteredData = dataSource.filter((item) => {
		const matchesStatus = active === 'all' || item.status === active;
		const matchesSearch = item.sku.toLowerCase().includes(searchText.toLowerCase());
		const matchesType = type === '' || item.type === type;
		return matchesStatus && matchesSearch && matchesType;
	});

	return (
		<div className="mx-20 my-10">
			<Filter filter={filter} handleStatusBtn={handleStatusBtn} active={active} />
			<div className="flex items-center ">
				<p>Tìm theo SKU:</p>
				<Search
					className="w-60 my-10 ml-5"
					placeholder="Tìm kiếm"
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
							{value: 'jewelry', label: 'Jewelry'},
							{value: 'diamond', label: 'Diamond'},
						]}
					/>
				</Space>
			</div>
			<Table dataSource={filteredData} columns={columns} pagination={{pageSize: 5}} />
		</div>
	);
};

export default WarrantyPage;
