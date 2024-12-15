import React, {useState, useEffect} from 'react';
import DiamondDetail from './DiamondDetail';
import {useParams} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {
	getDiamondDetail,
	handleAddPrice,
	handleLockDiamond,
} from '../../../../../redux/slices/diamondSlice';
import {DiamondUploadForm} from '../DiamondUploadForm';
import {LockDiamondModal} from '../LockDiamondModal/LockDiamondModal';
import {Form, message} from 'antd';
import {PriceExtraFeeModal} from '../PriceExtraFeeModal/PriceExtraFeeModal';
import {selectDiamondFiles} from '../../../../../redux/selectors';

const DiamondDetailPage = () => {
	const [form] = Form.useForm();
	const {id} = useParams();
	const dispatch = useDispatch();
	const diamondFiles = useSelector(selectDiamondFiles);

	const [diamond, setDiamond] = useState(null);
	const [selectedDiamondId, setSelectedDiamondId] = useState(null);
	const [isFormVisible, setIsFormVisible] = useState(false);
	const [isLockDiamondModalVisible, setIsLockDiamondModalVisible] = useState(false);
	const [lockDiamondId, setLockDiamondId] = useState();
	const [fetch, setFetch] = useState();
	const [isModalVisible, setIsModalVisible] = useState(false);

	console.log('diamond', diamond);

	useEffect(() => {
		dispatch(getDiamondDetail(id))
			.unwrap()
			.then((res) => {
				setDiamond(res);
			});
	}, [id, fetch, diamondFiles]);

	const handleView = (diamondId) => {
		setSelectedDiamondId(diamondId);
		setIsFormVisible(true);
	};

	const handleLockDiamondView = (diamondId) => {
		setIsLockDiamondModalVisible(true);
		setLockDiamondId(diamondId);
	};

	const handleLockDiamondCancel = () => {
		setIsLockDiamondModalVisible(false);
	};

	const handleLockDiamondSubmit = (values) => {
		dispatch(handleLockDiamond(values))
			.unwrap()
			.then((res) => {
				setIsLockDiamondModalVisible(false);
				if (diamond?.ProductLock === null) {
					message.success(`Khóa Kim Cương Thành Công`);
					setFetch(res);
				} else {
					message.success(`Mở Khóa Kim Cương Thành Công`);
					setFetch(res);
				}

				form.resetFields();
			})
			.catch((error) => {
				message.error(error?.detail);
			});
	};

	const handleOpenModal = () => {
		setIsModalVisible(true);
	};

	const handleCloseModal = () => {
		setIsModalVisible(false);
	};

	const handleSubmit = (values) => {
		console.log('priceOffset:', values);
		dispatch(handleAddPrice({id, priceOffset: values?.priceOffset, extraFee: values?.extraFee}))
			.unwrap()
			.then((res) => {
				message.success(`Thay Đổi Giá Kim Cương Thành Công`);
				setFetch(res);
			});
	};

	return (
		<div className="bg-gray-100 min-h-screen py-10">
			<div className="container mx-auto">
				<DiamondDetail
					diamond={diamond}
					handleView={handleView}
					id={id}
					handleLockDiamondView={handleLockDiamondView}
					handleOpenModal={handleOpenModal}
				/>
			</div>
			<DiamondUploadForm
				diamondId={id}
				visible={isFormVisible}
				onClose={() => setIsFormVisible(false)}
				diamondFilesFetch={diamondFiles}
			/>
			<LockDiamondModal
				isOpen={isLockDiamondModalVisible}
				onCancel={handleLockDiamondCancel}
				onSubmit={handleLockDiamondSubmit}
				lockDiamondId={lockDiamondId}
				form={form}
			/>
			<PriceExtraFeeModal
				form={form}
				isVisible={isModalVisible}
				onClose={handleCloseModal}
				onSubmit={handleSubmit}
			/>
		</div>
	);
};

export default DiamondDetailPage;
