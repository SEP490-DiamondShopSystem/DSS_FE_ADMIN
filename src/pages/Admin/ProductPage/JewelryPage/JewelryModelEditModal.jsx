import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
	updateSizeMetalForJewelryModel,
	deleteSizeMetalFromJewelryModel,
	deleteSideDiamondOption,
	updateCraftmanFee,
} from '../../../../redux/slices/jewelry/jewelryModelSlice';
import {Button, Modal, Input, Table, message, Popconfirm} from 'antd';
import {getAllMetalsSelector, getAllSizesSelector} from '../../../../redux/selectors';
import {fetchAllSizes} from '../../../../redux/slices/jewelry/sizeSlice';
import {fetchAllMetals} from '../../../../redux/slices/jewelry/metalSlice';
import UpdateSizeMetalModal from './UpdateSizeMetalModal';
const JewelryModelEditModal = ({isVisible, onClose, model}) => {
	const dispatch = useDispatch();
	const [craftmanFee, setCraftmanFee] = useState(model.CraftmanFee || '');
	const [editingMetals, setEditingMetals] = useState(model.SizeMetals || []);
	const [editingSideDiamonds, setEditingSideDiamonds] = useState(model.SideDiamonds || []);
	const [isUpdateSizeMetalModalVisible, setIsUpdateSizeMetalModalVisible] = useState(false);

	const availableMetals = useSelector(getAllMetalsSelector); // Selector for getting metals from the store
	useEffect(() => {
		dispatch(fetchAllMetals());
	}, [dispatch]);
	const availableSizes = useSelector(getAllSizesSelector); // Selector for getting metals from the store
	useEffect(() => {
		dispatch(fetchAllSizes());
	}, [dispatch]);
	const handleUpdateCraftmanFee = () => {
		dispatch(
			updateCraftmanFee({
				modelId: model.Id,
				newFee: parseFloat(craftmanFee),
			})
		)
			.unwrap()
			.then(() => {
				message.success('Craftman Fee updated successfully');
			})
			.catch((error) => {
				message.error(error?.title || error?.detail || 'Failed to update craftman fee');
			});
	};

	const handleDeleteSizeMetal = (metalId, sizeId) => {
		dispatch(
			deleteSizeMetalFromJewelryModel({
				modelId: model.Id,
				metalId: metalId,
				sizeId: sizeId,
			})
		)
			.unwrap()
			.then(() => {
				message.success('Size Metal deleted successfully');
				// Remove the deleted metal from local state
				setEditingMetals(
					editingMetals.filter(
						(item) => !(item.Metal.Id === metalId && item.Size.Id === sizeId)
					)
				);
			})
			.catch((error) => {
				message.error(error?.title || error?.detail || 'Không thể xóa kim loại size này!');
			});
	};

	const handleDeleteSideDiamondOption = (sideDiamondOptId) => {
		dispatch(deleteSideDiamondOption(sideDiamondOptId))
			.unwrap()
			.then(() => {
				message.success('Side Diamond Option deleted successfully');
				// Remove the deleted side diamond from local state
				setEditingSideDiamonds(
					editingSideDiamonds.filter((item) => item.Id !== sideDiamondOptId)
				);
			})
			.catch((error) => {
				message.error(
					error?.title || error?.detail || 'Failed to delete side diamond option'
				);
			});
	};

	const sizeMetalColumns = [
		{
			title: 'Metal',
			dataIndex: ['Metal', 'Name'],
			key: 'metalName',
		},
		{
			title: 'Size',
			dataIndex: ['Size', 'Value'],
			key: 'sizeValue',
			render: (text, record) => `${text} ${record.Size.Unit}`,
		},
		{
			title: 'Weight',
			dataIndex: 'Weight',
			key: 'weight',
			render: (text) => `${text} g`,
		},
		{
			title: 'Actions',
			key: 'actions',
			render: (_, record) => (
				<Popconfirm
					title="Are you sure to delete this size metal?"
					onConfirm={() => handleDeleteSizeMetal(record.Metal.Id, record.Size.Id)}
				>
					<Button type="link" danger>
						Delete
					</Button>
				</Popconfirm>
			),
		},
	];

	const sideDiamondColumns = [
		{
			title: 'Carat Weight',
			dataIndex: 'CaratWeight',
			key: 'caratWeight',
		},
		{
			title: 'Setting Type',
			dataIndex: 'SettingType',
			key: 'settingType',
		},
		{
			title: 'Quantity',
			dataIndex: 'Quantity',
			key: 'quantity',
		},
		{
			title: 'Actions',
			key: 'actions',
			render: (_, record) => (
				<Popconfirm
					title="Are you sure to delete this side diamond option?"
					onConfirm={() => handleDeleteSideDiamondOption(record.Id)}
				>
					<Button type="link" danger>
						Delete
					</Button>
				</Popconfirm>
			),
		},
	];

	return (
		<Modal
			title="Edit Jewelry Model"
			visible={isVisible}
			onCancel={onClose}
			footer={[
				<Button key="back" onClick={onClose}>
					Cancel
				</Button>,
			]}
			width={800}
		>
			{/* Craftman Fee Update Section */}
			<div className="mb-6">
				<h3 className="text-lg font-semibold mb-4">Update Craftman Fee</h3>
				<div className="flex items-center space-x-4">
					<Input
						type="number"
						value={craftmanFee}
						onChange={(e) => setCraftmanFee(e.target.value)}
						placeholder="Enter new craftman fee"
						className="w-64"
					/>
					<Button
						type="primary"
						onClick={handleUpdateCraftmanFee}
						disabled={!craftmanFee}
					>
						Update Fee
					</Button>
				</div>
			</div>

			{/* Size Metals Section */}
			<div className="mb-6">
				<div className="flex justify-between items-center mb-4">
					<h3 className="text-lg font-semibold">Size Metals</h3>
					<Button type="primary" onClick={() => setIsUpdateSizeMetalModalVisible(true)}>
						Add Size Metal
					</Button>
				</div>
				<Table
					columns={sizeMetalColumns}
					dataSource={editingMetals}
					rowKey={(record) => `${record.Metal.Id}-${record.Size.Id}`}
					pagination={false}
					locale={{emptyText: 'No size metals'}}
				/>
			</div>

			{/* Side Diamond Options Section */}
			<div>
				<h3 className="text-lg font-semibold mb-4">Side Diamond Options</h3>
				<Table
					columns={sideDiamondColumns}
					dataSource={editingSideDiamonds}
					rowKey="Id"
					pagination={false}
					locale={{emptyText: 'No side diamond options'}}
				/>
			</div>
			<UpdateSizeMetalModal
				isVisible={isUpdateSizeMetalModalVisible}
				onClose={() => setIsUpdateSizeMetalModalVisible(false)}
				model={model}
				availableMetals={availableMetals}
				availableSizes={availableSizes}
			/>
		</Modal>
	);
};

export default JewelryModelEditModal;
