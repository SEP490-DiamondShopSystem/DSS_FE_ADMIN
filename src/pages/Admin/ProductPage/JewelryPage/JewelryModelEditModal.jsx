import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
	updateSizeMetalForJewelryModel,
	deleteSizeMetalFromJewelryModel,
	deleteSideDiamondOption,
	updateCraftmanFee,
} from '../../../../redux/slices/jewelry/jewelryModelSlice';
import {Button, Modal, Input, Table, message, Popconfirm} from 'antd';
import {
	getAllMetalsSelector,
	getAllSizesSelector,
	getAllShapesSelector,
} from '../../../../redux/selectors';
import {fetchAllSizes} from '../../../../redux/slices/jewelry/sizeSlice';
import {fetchAllMetals} from '../../../../redux/slices/jewelry/metalSlice';
import {fetchAllShapes} from '../../../../redux/slices/shapeSlice.js';
import AddSizeMetalModal from './AddSizeMetalModal';
import AddSideDiamondOptionModal from './AddSideDiamondOptionModal';

const JewelryModelEditModal = ({isVisible, onClose, model}) => {
	const dispatch = useDispatch();
	const [craftmanFee, setCraftmanFee] = useState(model.CraftmanFee || '');
	const [editingMetals, setEditingMetals] = useState(model.SizeMetals || []);
	const [editingSideDiamonds, setEditingSideDiamonds] = useState(model.SideDiamonds || []);
	const [isAddSizeMetalModalVisible, setIsAddSizeMetalModalVisible] = useState(false);
	const [isAddSideDiamondModalVisible, setIsAddSideDiamondModalVisible] = useState(false);

	const [isEditWeightModalVisible, setIsEditWeightModalVisible] = useState(false);
	const [currentEditingSizeMetal, setCurrentEditingSizeMetal] = useState(null);

	const availableMetals = useSelector(getAllMetalsSelector); // Selector for getting metals from the store
	useEffect(() => {
		dispatch(fetchAllMetals());
	}, [dispatch]);

	const availableSizes = useSelector(getAllSizesSelector); // Selector for getting sizes from the store
	useEffect(() => {
		dispatch(fetchAllSizes());
	}, [dispatch]);

	const availableShapes = useSelector(getAllShapesSelector); // Selector for getting shapes from the store
	useEffect(() => {
		dispatch(fetchAllShapes());
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
				message.success('Cập nhật phí gai công thành công!');
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
	const handleUpdateWeight = (metalId, sizeId, newWeight) => {
		const payload = {
			sizeMetals: [
				{
					MetalId: metalId,
					SizeId: sizeId,
					Weight: parseFloat(newWeight),
				},
			],
		};
		console.log('Dispatching updateSizeMetalForJewelryModel with payload:', payload);
		dispatch(
			updateSizeMetalForJewelryModel({modelId: model.Id, sizeMetals: payload.sizeMetals})
		)
			.unwrap()
			.then(() => {
				message.success('Cập nhật trọng lượng size kim loại thành công!');
				setEditingMetals((prev) =>
					prev.map((item) =>
						item.Metal.Id === metalId && item.Size.Id === sizeId
							? {...item, Weight: newWeight}
							: item
					)
				);
			})
			.catch((error) => {
				message.error(
					error?.title || error?.detail || 'Cập nhật trọng lượng size kim loại thất bại!'
				);
			});
	};

	const EditWeightModal = ({isVisible, onClose, sizeMetal, onUpdate}) => {
		const [weight, setWeight] = useState(sizeMetal?.Weight || '');

		useEffect(() => {
			if (sizeMetal) {
				setWeight(sizeMetal.Weight);
			}
		}, [sizeMetal]);

		const handleUpdate = () => {
			onUpdate(sizeMetal.Metal.Id, sizeMetal.Size.Id, weight);
			onClose();
		};

		return (
			<Modal
				title="Cập nhật trọng lượng size kim loại"
				visible={isVisible}
				onCancel={onClose}
				onOk={handleUpdate}
				okText="Update"
				cancelText="Cancel"
			>
				<Input
					type="number"
					value={weight}
					onChange={(e) => setWeight(e.target.value)}
					placeholder="Enter new weight"
				/>
			</Modal>
		);
	};

	const sizeMetalColumns = [
		{
			title: 'Kim Loại',
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
			title: 'Trọng Lượng',
			dataIndex: 'Weight',
			key: 'weight',
			render: (text) => `${text} g`,
		},
		{
			title: 'Tương Tác',
			key: 'actions',
			render: (_, record) => (
				<>
					<Button
						type="link"
						onClick={() => {
							setCurrentEditingSizeMetal(record);
							setIsEditWeightModalVisible(true);
						}}
					>
						Cập Nhật
					</Button>
					<Popconfirm
						title="Are you sure to delete this size metal?"
						onConfirm={() => handleDeleteSizeMetal(record.Metal.Id, record.Size.Id)}
					>
						<Button type="link" danger>
							Xóa
						</Button>
					</Popconfirm>
				</>
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
						Cập nhật giá gia công
					</Button>
				</div>
			</div>

			{/* Size Metals Section */}
			<div className="mb-6">
				<div className="flex justify-between items-center mb-4">
					<h3 className="text-lg font-semibold">Size Kim Loại</h3>
					<Button type="primary" onClick={() => setIsAddSizeMetalModalVisible(true)}>
						Thêm Size Kim Loại
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
				<div className="flex justify-between items-center mb-4">
					<h3 className="text-lg font-semibold mb-4">Các Lựa Chọn Kim Cương Tấm</h3>
					<Button type="primary" onClick={() => setIsAddSideDiamondModalVisible(true)}>
						Thêm Lựa Chọn Kim Cương Tấm
					</Button>
				</div>
				<Table
					columns={sideDiamondColumns}
					dataSource={editingSideDiamonds}
					rowKey="Id"
					pagination={false}
					locale={{emptyText: 'No side diamond options'}}
				/>
			</div>
			<AddSizeMetalModal
				isVisible={isAddSizeMetalModalVisible}
				onClose={() => setIsAddSizeMetalModalVisible(false)}
				model={model}
				availableMetals={availableMetals}
				availableSizes={availableSizes}
			/>
			<EditWeightModal
				isVisible={isEditWeightModalVisible}
				onClose={() => setIsEditWeightModalVisible(false)}
				sizeMetal={currentEditingSizeMetal}
				onUpdate={handleUpdateWeight}
			/>
			<AddSideDiamondOptionModal
				isVisible={isAddSideDiamondModalVisible}
				onClose={() => setIsAddSideDiamondModalVisible(false)}
				availableShapes={availableShapes}
				model={model}
			/>
		</Modal>
	);
};

export default JewelryModelEditModal;
