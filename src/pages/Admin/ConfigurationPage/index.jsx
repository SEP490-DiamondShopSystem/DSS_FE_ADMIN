import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Button, Form, InputNumber, Tabs, Card, Spin, message, Col, Row} from 'antd';
import {
	fetchAccountRule,
	fetchDiamondRule,
	fetchFrontendDisplayRule,
	fetchPromotionRule,
	updateAccountRule,
	updateDiamondRule,
	updateFrontendDisplayRule,
	updatePromotionRule,
} from '../../../redux/slices/configSlice';

import {selectIsLoading, selectConfigError} from '../../../redux/selectors';

const ConfigurationPage = () => {
	const dispatch = useDispatch();

	// State from Redux
	const [accountRule, setAccountRule] = useState(null);
	const [diamondRule, setDiamondRule] = useState(null);
	const [frontendDisplayRule, setFrontendDisplayRule] = useState(null);
	const [promotionRule, setPromotionRule] = useState(null);

	const isLoading = useSelector(selectIsLoading);
	const error = useSelector(selectConfigError);

	// Local form states
	const [accountForm] = Form.useForm();
	const [diamondForm] = Form.useForm();
	const [frontendForm] = Form.useForm();
	const [promotionForm] = Form.useForm();

	// Ensure these actions are dispatched and resolve correctly
	useEffect(() => {
		const fetchData = async () => {
			try {
				const [account, diamond, frontend, promotion] = await Promise.all([
					dispatch(fetchAccountRule()).unwrap(),
					dispatch(fetchDiamondRule()).unwrap(),
					dispatch(fetchFrontendDisplayRule()).unwrap(),
					dispatch(fetchPromotionRule()).unwrap(),
				]);
				setAccountRule(account);
				setDiamondRule(diamond);
				setFrontendDisplayRule(frontend);
				setPromotionRule(promotion);
			} catch (error) {
				message.error('Failed to fetch configuration data.');
			}
		};
		fetchData();
	}, [dispatch]);
	// Handle success messages
	const handleSuccess = (messageText) => {
		message.success(messageText);
	};

	// Handle error messages
	useEffect(() => {
		if (error) message.error(error);
	}, [error]);
	// Handlers for form submissions
	const handleAccountSubmit = (values) => {
		dispatch(updateAccountRule(values))
			.unwrap()
			.then(() => handleSuccess('Diamond Rule updated successfully!'))
			.catch((error) => {
				message.error(error?.data?.title || error?.title);
			});
	};
	// Handlers for form submissions
	const handleDiamondSubmit = (values) => {
		dispatch(updateDiamondRule(values))
			.unwrap()
			.then(() => handleSuccess('Diamond Rule updated successfully!'))
			.catch((error) => {
				message.error(error?.data?.title || error?.title);
			});
	};

	const handleFrontendSubmit = (values) => {
		dispatch(updateFrontendDisplayRule(values))
			.unwrap()
			.then(() => handleSuccess('Frontend Display Rule updated successfully!'))
			.catch((error) => {
				message.error(error?.data?.title || error?.title);
			});
	};

	const handlePromotionSubmit = (values) => {
		dispatch(updatePromotionRule(values))
			.unwrap()
			.then(() => handleSuccess('Promotion Rule updated successfully!'))
			.catch((error) => {
				message.error(error?.data?.title || error?.title);
			});
	};

	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-screen">
				<Spin size="large" />
			</div>
		);
	}

	return (
		<div className="p-8 bg-gray-100 min-h-screen">
			<h1 className="text-2xl font-bold mb-6">Trang cài đặt cấu hình</h1>
			<Tabs defaultActiveKey="diamond">
				<Tabs.TabPane tab="Quy tắc tài khoản" key="account">
					<Card className="shadow-lg">
						<Form
							form={accountForm}
							initialValues={accountRule}
							onFinish={handleAccountSubmit}
							layout="vertical"
							key={JSON.stringify(accountRule)} // Force re-render on rule update
						>
							{' '}
							<Row gutter={[16, 16]} wrap>
								<Col xs={24} sm={12} md={6}>
									<Form.Item
										name="MaxAddress"
										label="Lượng địa chỉ tối đa trên một tài khoản"
										rules={[
											{required: true, message: 'Trường này là bắt buộc'},
										]}
									>
										<InputNumber className="w-full" />
									</Form.Item>{' '}
								</Col>
								<Col xs={24} sm={12} md={6}>
									<Form.Item
										name="VndPerPoint"
										label="Số tiền cho mỗi điểm"
										rules={[
											{required: true, message: 'Trường này là bắt buộc'},
										]}
									>
										<InputNumber className="w-full" />
									</Form.Item>{' '}
								</Col>
								<Col xs={24} sm={12} md={6}>
									<Form.Item
										name="TotalPointToBronze"
										label="Tổng điểm cần đạt để lên Đồng"
										rules={[
											{required: true, message: 'Trường này là bắt buộc'},
										]}
									>
										<InputNumber className="w-full" />
									</Form.Item>{' '}
								</Col>
								<Col xs={24} sm={12} md={6}>
									<Form.Item
										name="TotalPointToSilver"
										label="Tổng điểm cần đạt để lên Bạc"
										rules={[
											{required: true, message: 'Trường này là bắt buộc'},
										]}
									>
										<InputNumber className="w-full" />
									</Form.Item>{' '}
								</Col>
								<Col xs={24} sm={12} md={6}>
									<Form.Item
										name="TotalPointToGold"
										label="Tổng điểm cần đạt để lên Vàng"
										rules={[
											{required: true, message: 'Trường này là bắt buộc'},
										]}
									>
										<InputNumber className="w-full" />
									</Form.Item>{' '}
								</Col>
							</Row>
							<Button type="primary" htmlType="submit">
								Lưu
							</Button>
						</Form>
					</Card>
				</Tabs.TabPane>
				<Tabs.TabPane tab="Quy tắc Kim Cương" key="diamond">
					<Card className="shadow-lg">
						<Form
							form={diamondForm}
							initialValues={diamondRule}
							onFinish={handleDiamondSubmit}
							layout="vertical"
							key={JSON.stringify(diamondRule)} // Force re-render on rule update
						>
							<Row gutter={[16, 16]} wrap>
								<Col xs={24} sm={12} md={6}>
									<Form.Item
										name="MinimalSideDiamondAveragePrice"
										label="Giá trung bình thấp nhất của kim cương phụ"
										rules={[
											{required: true, message: 'Trường này là bắt buộc'},
										]}
									>
										<InputNumber
											placeholder={
												diamondRule?.MinimalSideDiamondAveragePrice
											}
											className="w-full"
										/>
									</Form.Item>
								</Col>
								<Col xs={24} sm={12} md={6}>
									<Form.Item
										name="MinimalMainDiamondPrice"
										label="Giá trung bình thấp nhất của kim cương chính"
										rules={[
											{required: true, message: 'Trường này là bắt buộc'},
										]}
									>
										<InputNumber
											className="w-full"
											placeholder={diamondRule?.MinimalMainDiamondPrice}
										/>
									</Form.Item>
								</Col>
								<Col xs={24} sm={12} md={6}>
									<Form.Item
										name="MinPriceOffset"
										label="Chênh lệch giá thấp nhất"
										rules={[
											{required: true, message: 'Trường này là bắt buộc'},
										]}
									>
										<InputNumber className="w-full" />
									</Form.Item>
								</Col>
								<Col xs={24} sm={12} md={6}>
									<Form.Item
										name="MaxPriceOffset"
										label="Chênh lệch giá cao nhất"
										rules={[
											{required: true, message: 'Trường này là bắt buộc'},
										]}
									>
										<InputNumber className="w-full" />
									</Form.Item>
								</Col>
								<Col xs={24} sm={12} md={6}>
									<Form.Item
										name="MinCaratRange"
										label="Carat tối thiểu"
										rules={[
											{required: true, message: 'Trường này là bắt buộc'},
										]}
									>
										<InputNumber className="w-full" step={0.01} />
									</Form.Item>
								</Col>
								<Col xs={24} sm={12} md={6}>
									<Form.Item
										name="MaxCaratRange"
										label="Carat tối đa"
										rules={[
											{required: true, message: 'Trường này là bắt buộc'},
										]}
									>
										<InputNumber className="w-full" step={0.01} />
									</Form.Item>
								</Col>
								<Col xs={24} sm={12} md={6}>
									<Form.Item
										name="BiggestSideDiamondCarat"
										label="Carat lớn nhất của kim cương phụ"
										rules={[
											{required: true, message: 'Trường này là bắt buộc'},
										]}
									>
										<InputNumber className="w-full" step={0.01} />
									</Form.Item>
								</Col>
								<Col xs={24} sm={12} md={6}>
									<Form.Item
										name="SmallestMainDiamondCarat"
										label="Carat nhỏ nhất của kim cương chính"
										rules={[
											{required: true, message: 'Trường này là bắt buộc'},
										]}
									>
										<InputNumber className="w-full" step={0.01} />
									</Form.Item>
								</Col>
								<Col xs={24} sm={12} md={6}>
									<Form.Item
										name="MainDiamondMaxFractionalNumber"
										label="Số phân đoạn tối đa của kim cương chính"
										rules={[
											{required: true, message: 'Trường này là bắt buộc'},
										]}
									>
										<InputNumber className="w-full" />
									</Form.Item>
								</Col>
								<Col xs={24} sm={12} md={6}>
									<Form.Item
										name="AverageOffsetVeryGoodCutFromIdealCut"
										label="Chênh lệch trung bình giữa Very Good Cut và Ideal Cut"
										rules={[
											{required: true, message: 'Trường này là bắt buộc'},
										]}
									>
										<InputNumber className="w-full" step={0.01} />
									</Form.Item>
								</Col>
								<Col xs={24} sm={12} md={6}>
									<Form.Item
										name="AverageOffsetGoodCutFromIdealCut"
										label="Chênh lệch trung bình giữa Good Cut và Ideal Cut"
										rules={[
											{required: true, message: 'Trường này là bắt buộc'},
										]}
									>
										<InputNumber className="w-full" step={0.01} />
									</Form.Item>
								</Col>
								<Col xs={24} sm={12} md={6}>
									<Form.Item
										name="PearlOffsetFromFancyShape"
										label="Chênh lệch Pearl so với Fancy Shape"
										rules={[
											{required: true, message: 'Trường này là bắt buộc'},
										]}
									>
										<InputNumber className="w-full" step={0.01} />
									</Form.Item>
								</Col>
								<Col xs={24} sm={12} md={6}>
									<Form.Item
										name="PrincessOffsetFromFancyShape"
										label="Chênh lệch Princess so với Fancy Shape"
										rules={[
											{required: true, message: 'Trường này là bắt buộc'},
										]}
									>
										<InputNumber className="w-full" step={0.01} />
									</Form.Item>
								</Col>
								<Col xs={24} sm={12} md={6}>
									<Form.Item
										name="CushionOffsetFromFancyShape"
										label="Chênh lệch Cushion so với Fancy Shape"
										rules={[
											{required: true, message: 'Trường này là bắt buộc'},
										]}
									>
										<InputNumber className="w-full" step={0.01} />
									</Form.Item>
								</Col>
								<Col xs={24} sm={12} md={6}>
									<Form.Item
										name="EmeraldOffsetFromFancyShape"
										label="Chênh lệch Emerald so với Fancy Shape"
										rules={[
											{required: true, message: 'Trường này là bắt buộc'},
										]}
									>
										<InputNumber className="w-full" step={0.01} />
									</Form.Item>
								</Col>
								<Col xs={24} sm={12} md={6}>
									<Form.Item
										name="OvalOffsetFromFancyShape"
										label="Chênh lệch Oval so với Fancy Shape"
										rules={[
											{required: true, message: 'Trường này là bắt buộc'},
										]}
									>
										<InputNumber className="w-full" step={0.01} />
									</Form.Item>
								</Col>
								<Col xs={24} sm={12} md={6}>
									<Form.Item
										name="RadiantOffsetFromFancyShape"
										label="Chênh lệch Radiant so với Fancy Shape"
										rules={[
											{required: true, message: 'Trường này là bắt buộc'},
										]}
									>
										<InputNumber className="w-full" step={0.01} />
									</Form.Item>
								</Col>
								<Col xs={24} sm={12} md={6}>
									<Form.Item
										name="AsscherOffsetFromFancyShape"
										label="Chênh lệch Asscher so với Fancy Shape"
										rules={[
											{required: true, message: 'Trường này là bắt buộc'},
										]}
									>
										<InputNumber className="w-full" step={0.01} />
									</Form.Item>
								</Col>
								<Col xs={24} sm={12} md={6}>
									{' '}
									<Form.Item
										name="MarquiseOffsetFromFancyShape"
										label="Chênh lệch Marquise so với Fancy Shape"
										rules={[
											{required: true, message: 'Trường này là bắt buộc'},
										]}
									>
										<InputNumber className="w-full" step={0.01} />
									</Form.Item>
								</Col>
								<Col xs={24} sm={12} md={6}>
									{' '}
									<Form.Item
										name="MaxLockTimeForCustomer"
										label="Thời gian khóa tối đa cho khách hàng (giờ)"
										rules={[
											{required: true, message: 'Trường này là bắt buộc'},
										]}
									>
										<InputNumber className="w-full" />
									</Form.Item>
								</Col>
							</Row>
							<Button type="primary" htmlType="submit">
								Lưu
							</Button>
						</Form>
					</Card>
				</Tabs.TabPane>

				<Tabs.TabPane tab="Quy tắc Hiển thị Giao diện" key="frontend">
					<Card className="shadow-lg">
						<Form
							form={frontendForm}
							initialValues={frontendDisplayRule}
							onFinish={handleFrontendSubmit}
							layout="vertical"
							key={JSON.stringify(frontendDisplayRule)} // Force re-render on rule update
						>
							<Row gutter={[16, 16]} wrap>
								<Col xs={24} sm={12} md={6}>
									<Form.Item
										name="MaxCarouselImages"
										label="Số ảnh tối đa trên băng chuyền"
										rules={[
											{required: true, message: 'Trường này là bắt buộc'},
										]}
									>
										<InputNumber className="w-full" />
									</Form.Item>
								</Col>
								<Col xs={24} sm={12} md={6}>
									<Form.Item
										name="MinCarouselImages"
										label="Số ảnh tối thiểu trên băng chuyền"
										rules={[
											{required: true, message: 'Trường này là bắt buộc'},
										]}
									>
										<InputNumber className="w-full" />
									</Form.Item>
								</Col>
								<Col xs={24} sm={12} md={6}>
									<Form.Item
										name="DisplayTimeInSeconds"
										label="Thời gian hiển thị (giây)"
										rules={[
											{required: true, message: 'Trường này là bắt buộc'},
										]}
									>
										<InputNumber className="w-full" />
									</Form.Item>
								</Col>
							</Row>
							<Button type="primary" htmlType="submit">
								Lưu
							</Button>
						</Form>
					</Card>
				</Tabs.TabPane>

				<Tabs.TabPane tab="Quy tắc Khuyến mãi" key="promotion">
					<Card className="shadow-lg">
						<Form
							form={promotionForm}
							initialValues={promotionRule}
							onFinish={handlePromotionSubmit}
							layout="vertical"
							key={JSON.stringify(promotionRule)} // Force re-render on rule update
						>
							{' '}
							<Row gutter={[16, 16]} wrap>
								<Col xs={24} sm={12} md={6}>
									<Form.Item
										name="MaxDiscountPercent"
										label="Phần trăm giảm giá tối đa"
										rules={[
											{required: true, message: 'Trường này là bắt buộc'},
										]}
									>
										<InputNumber className="w-full" />
									</Form.Item>
								</Col>
								<Col xs={24} sm={12} md={6}>
									<Form.Item
										name="BronzeUserDiscountPercent"
										label="Phần trăm giảm giá cho thành viên Đồng"
										rules={[
											{required: true, message: 'Trường này là bắt buộc'},
										]}
									>
										<InputNumber className="w-full" />
									</Form.Item>
								</Col>
								<Col xs={24} sm={12} md={6}>
									<Form.Item
										name="SilverUserDiscountPercent"
										label="Phần trăm giảm giá cho thành viên Bạc"
										rules={[
											{required: true, message: 'Trường này là bắt buộc'},
										]}
									>
										<InputNumber className="w-full" />
									</Form.Item>
								</Col>
								<Col xs={24} sm={12} md={6}>
									<Form.Item
										name="GoldUserDiscountPercent"
										label="Phần trăm giảm giá cho thành viên Vàng"
										rules={[
											{required: true, message: 'Trường này là bắt buộc'},
										]}
									>
										<InputNumber className="w-full" />
									</Form.Item>
								</Col>
							</Row>
							<Button type="primary" htmlType="submit">
								Lưu
							</Button>
						</Form>
					</Card>
				</Tabs.TabPane>
			</Tabs>
		</div>
	);
};

export default ConfigurationPage;
