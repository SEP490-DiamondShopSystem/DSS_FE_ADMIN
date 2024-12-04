import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Button, Form, InputNumber, Tabs, Card, Spin, message, Col, Row, Input, Select} from 'antd';
import {
	fetchAccountRule,
	fetchDiamondRule,
	fetchFrontendDisplayRule,
	fetchPromotionRule,
	fetchLocationRule,
	fetchOrderRule,
	fetchOrderRulePayment,
	fetchShopBankAccountRule,
	updateAccountRule,
	updateDiamondRule,
	updateFrontendDisplayRule,
	updatePromotionRule,
	updateLocationRules,
	updateOrderRule,
	updateOrderRulePayment,
	updateShopBankAccountRule,
} from '../../../redux/slices/configSlice';

import {selectIsLoading, selectConfigError} from '../../../redux/selectors';

const ConfigurationPage = () => {
	const dispatch = useDispatch();
	const [accountRule, setAccountRule] = useState(null);
	const [diamondRule, setDiamondRule] = useState(null);
	const [frontendDisplayRule, setFrontendDisplayRule] = useState(null);
	const [promotionRule, setPromotionRule] = useState(null);
	const [locationRule, setLocationRule] = useState(null);
	const [orderRule, setOrderRule] = useState(null);
	const [orderPaymentRule, setOrderPaymentRule] = useState(null);
	const [shopBankAccountRule, setShopBankAccountRule] = useState(null);

	const isLoading = useSelector(selectIsLoading);
	const error = useSelector(selectConfigError);

	const [accountForm] = Form.useForm();
	const [diamondForm] = Form.useForm();
	const [frontendForm] = Form.useForm();
	const [promotionForm] = Form.useForm();
	const [locationForm] = Form.useForm();
	const [orderForm] = Form.useForm();
	const [paymentForm] = Form.useForm();
	const [bankForm] = Form.useForm();

	const paymentMethods = [
		{value: 1, label: 'Chuyển Khoản Ngân Hàng'},
		{value: 2, label: 'ZaloPay'},
		{value: 3, label: 'Tiền Mặt'},
	];

	useEffect(() => {
		const fetchData = async () => {
			try {
				const [account, diamond, frontend, promotion, location, order, payment, bank] =
					await Promise.all([
						dispatch(fetchAccountRule()).unwrap(),
						dispatch(fetchDiamondRule()).unwrap(),
						dispatch(fetchFrontendDisplayRule()).unwrap(),
						dispatch(fetchPromotionRule()).unwrap(),
						dispatch(fetchLocationRule()).unwrap(),
						dispatch(fetchOrderRule()).unwrap(),
						dispatch(fetchOrderRulePayment()).unwrap(),
						dispatch(fetchShopBankAccountRule()).unwrap(),
					]);

				const transformedPayment = {
					...payment,
					LockedPaymentMethodOnCustomer: payment.LockedPaymentMethodOnCustomer.map(
						(methodValue) => {
							const method = paymentMethods.find(
								(m) => m.value.toString() === methodValue
							);
							return method ? method.value : methodValue; // Use value for Select compatibility
						}
					),
				};
				setAccountRule(account);
				setDiamondRule(diamond);
				setFrontendDisplayRule(frontend);
				setPromotionRule(promotion);
				setLocationRule(location);
				setOrderRule(order);
				setOrderPaymentRule(transformedPayment);
				setShopBankAccountRule(bank);
			} catch (error) {
				message.error('Failed to fetch configuration data.');
			}
		};
		fetchData();
	}, [dispatch]);
	const handleSuccess = (messageText) => {
		message.success(messageText);
	};

	useEffect(() => {
		if (error) message.error(error);
	}, [error]);
	const handleAccountSubmit = (values) => {
		dispatch(updateAccountRule(values))
			.unwrap()
			.then(() => handleSuccess('Cập Nhật Quy Định Tài Khoản Thành Công!'))
			.catch((error) => {
				message.error(error?.data?.title || error?.title);
			});
	};
	const handleDiamondSubmit = (values) => {
		dispatch(updateDiamondRule(values))
			.unwrap()
			.then(() => handleSuccess('Cập Nhật Quy Định Kim Cương Thành Công!'))
			.catch((error) => {
				message.error(error?.data?.title || error?.title);
			});
	};

	const handleFrontendSubmit = (values) => {
		dispatch(updateFrontendDisplayRule(values))
			.unwrap()
			.then(() => handleSuccess('Cập Nhật Quy Định Hiển Thị Thành Công!'))
			.catch((error) => {
				message.error(error?.data?.title || error?.title);
			});
	};
	const handleLocationSubmit = (values) => {
		dispatch(updateLocationRules(values))
			.unwrap()
			.then(() => handleSuccess('Cập Nhật Địa Chỉ Shop Thành Công!'))
			.catch((error) => {
				message.error(error?.data?.title || error?.title);
			});
	};
	const handleOrderSubmit = (values) => {
		dispatch(updateOrderRule(values))
			.unwrap()
			.then(() => handleSuccess('Cập Nhật Quy Định Đặt Hàng Thành Công!'))
			.catch((error) => {
				message.error(error?.data?.title || error?.title);
			});
	};
	const handleOrderPaymentSubmit = (values) => {
		const paymentMethodValues = values.LockedPaymentMethodOnCustomer.map((value) => {
			const method = paymentMethods.find((method) => method.value === value);
			return method ? method.value : value; // Send value to API
		});

		const updatedValues = {
			...values,
			LockedPaymentMethodOnCustomer: paymentMethodValues,
		};

		dispatch(updateOrderRulePayment(updatedValues))
			.unwrap()
			.then(() => handleSuccess('Cập Nhật Quy Định Thanh Toán Thành Công!'))
			.catch((error) => {
				message.error(error?.data?.title || error?.title);
			});
	};

	const handleBankAccountSubmit = (values) => {
		dispatch(updateShopBankAccountRule(values))
			.unwrap()
			.then(() => handleSuccess('Cập Nhật Tài Khoản Của Shop Thành Công!'))
			.catch((error) => {
				message.error(error?.data?.title || error?.title);
			});
	};
	const handlePromotionSubmit = (values) => {
		dispatch(updatePromotionRule(values))
			.unwrap()
			.then(() => handleSuccess('Cập Nhật Quy Định Khuyến Mãi Thành Công!'))
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
			<Tabs defaultActiveKey="account">
				<Tabs.TabPane tab="Quy Tắc Tài Khoản" key="account">
					<Card className="shadow-lg">
						<Form
							form={accountForm}
							initialValues={accountRule}
							onFinish={handleAccountSubmit}
							layout="vertical"
						>
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
									</Form.Item>
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
									</Form.Item>
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
									</Form.Item>
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
									</Form.Item>
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
									</Form.Item>
								</Col>
							</Row>

							{['Gold', 'Silver', 'Bronze'].map((rank) => (
								<Card
									key={rank}
									title={`Quyền lợi hạng ${rank}`}
									className="mt-4 shadow-md"
									type="inner"
								>
									<Row gutter={[16, 16]} wrap>
										<Col xs={24} sm={12} md={6}>
											<Form.Item
												name={[
													`${rank}RankBenefit`,
													'RankDiscountPercentOnOrder',
												]}
												label={`Phần trăm giảm giá đơn hàng (${rank})`}
												rules={[
													{
														required: true,
														message: 'Trường này là bắt buộc',
													},
												]}
											>
												<InputNumber className="w-full" />
											</Form.Item>
										</Col>
										<Col xs={24} sm={12} md={6}>
											<Form.Item
												name={[
													`${rank}RankBenefit`,
													'MaxAmountDiscountOnOrder',
												]}
												label={`Số tiền giảm tối đa cho đơn hàng (${rank})`}
												rules={[
													{
														required: true,
														message: 'Trường này là bắt buộc',
													},
												]}
											>
												<InputNumber className="w-full" />
											</Form.Item>
										</Col>
										<Col xs={24} sm={12} md={6}>
											<Form.Item
												name={[
													`${rank}RankBenefit`,
													'RankDiscountPercentOnShipping',
												]}
												label={`Phần trăm giảm giá vận chuyển (${rank})`}
												rules={[
													{
														required: true,
														message: 'Trường này là bắt buộc',
													},
												]}
											>
												<InputNumber className="w-full" />
											</Form.Item>
										</Col>
									</Row>
								</Card>
							))}

							<Button type="primary" htmlType="submit" className="mt-4">
								Lưu
							</Button>
						</Form>
					</Card>
				</Tabs.TabPane>

				<Tabs.TabPane tab="Quy Tắc Kim Cương" key="diamond">
					<Card className="shadow-lg">
						<Form
							form={diamondForm}
							initialValues={diamondRule}
							onFinish={handleDiamondSubmit}
							layout="vertical"
							key={JSON.stringify(diamondRule)}
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

				<Tabs.TabPane tab="Quy Tắc Hiển thị Giao diện" key="frontend">
					<Card className="shadow-lg">
						<Form
							form={frontendForm}
							initialValues={frontendDisplayRule}
							onFinish={handleFrontendSubmit}
							layout="vertical"
							key={JSON.stringify(frontendDisplayRule)}
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
				<Tabs.TabPane tab="Tài Khoản Ngân Hàng Của Shop" key="bank">
					<Card className="shadow-lg">
						<Form
							form={bankForm}
							initialValues={shopBankAccountRule}
							onFinish={handleBankAccountSubmit}
							layout="vertical"
							key={JSON.stringify(shopBankAccountRule)}
						>
							<Row gutter={[16, 16]} wrap>
								<Col xs={24} sm={12} md={6}>
									<Form.Item
										name="AccountNumber"
										label="Số Tài Khoản"
										rules={[
											{required: true, message: 'Trường này là bắt buộc'},
										]}
									>
										<InputNumber className="w-full" />
									</Form.Item>
								</Col>
								<Col xs={24} sm={12} md={6}>
									<Form.Item
										name="AccountName"
										label="Tên chủ tài khoản"
										rules={[
											{required: true, message: 'Trường này là bắt buộc'},
										]}
									>
										<Input className="w-full" />
									</Form.Item>
								</Col>
								<Col xs={24} sm={12} md={6}>
									<Form.Item
										name="BankBin"
										label="Mã bin ngân hàng"
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
				<Tabs.TabPane tab="Địa Chỉ Shop" key="location">
					<Card className="shadow-lg">
						<Form
							form={locationForm}
							initialValues={locationRule}
							onFinish={handleLocationSubmit}
							layout="vertical"
							key={JSON.stringify(locationRule)}
						>
							<Row gutter={[16, 16]} wrap>
								<Col xs={24} sm={12} md={6}>
									<Form.Item
										name="OriginalProvince"
										label="Tỉnh / Thành Phố"
										rules={[
											{required: true, message: 'Trường này là bắt buộc'},
										]}
									>
										<Input className="w-full" />
									</Form.Item>
								</Col>
								<Col xs={24} sm={12} md={6}>
									<Form.Item
										name="OrignalDistrict"
										label="Quận / Huyện"
										rules={[
											{required: true, message: 'Trường này là bắt buộc'},
										]}
									>
										<Input className="w-full" />
									</Form.Item>
								</Col>
								<Col xs={24} sm={12} md={6}>
									<Form.Item
										name="OrignalWard"
										label="Phường / Xã"
										rules={[
											{required: true, message: 'Trường này là bắt buộc'},
										]}
									>
										<Input className="w-full" />
									</Form.Item>
								</Col>
								<Col xs={24} sm={12} md={6}>
									<Form.Item
										name="OrignalRoad"
										label="Đường"
										rules={[
											{required: true, message: 'Trường này là bắt buộc'},
										]}
									>
										<Input className="w-full" />
									</Form.Item>
								</Col>
								<Col xs={24} sm={12} md={6}>
									<Form.Item
										name="OriginalLocationName"
										label="Địa chỉ đầy đủ của shop"
										rules={[
											{required: true, message: 'Trường này là bắt buộc'},
										]}
									>
										<Input className="w-full" />
									</Form.Item>
								</Col>
							</Row>
							<Button type="primary" htmlType="submit">
								Lưu
							</Button>
						</Form>
					</Card>
				</Tabs.TabPane>
				<Tabs.TabPane tab="Quy Tắc Đơn Hàng" key="order">
					<Card className="shadow-lg">
						<Form
							form={orderForm}
							initialValues={orderRule}
							onFinish={handleOrderSubmit}
							layout="vertical"
							key={JSON.stringify(orderRule)}
						>
							<Row gutter={[16, 16]} wrap>
								<Col xs={24} sm={12} md={6}>
									<Form.Item
										name="ExpectedDeliveryDate"
										label="Thời gian giao hàng dự kiến sau đặt hàng ( ngày )"
										rules={[
											{required: true, message: 'Trường này là bắt buộc'},
										]}
									>
										<InputNumber className="w-full" />
									</Form.Item>
								</Col>
								<Col xs={24} sm={12} md={6}>
									<Form.Item
										name="ExpiredOrderHour"
										label="Thời gian hết hạn thanh toán sau đặt hàng ( giờ )"
										rules={[
											{required: true, message: 'Trường này là bắt buộc'},
										]}
									>
										<InputNumber className="w-full" />
									</Form.Item>
								</Col>
								<Col xs={24} sm={12} md={6}>
									<Form.Item
										name="MaxOrderAmountForDelivery"
										label="Tổng giá trị đơn hàng tối đa cho vận chuyển"
										rules={[
											{required: true, message: 'Trường này là bắt buộc'},
										]}
									>
										<InputNumber className="w-full" />
									</Form.Item>
								</Col>
								<Col xs={24} sm={12} md={6}>
									<Form.Item
										name="MaxOrderAmountForFullPayment"
										label="Giá trị đơn hàng tối đa cho một lần thanh toán đủ"
										rules={[
											{required: true, message: 'Trường này là bắt buộc'},
										]}
									>
										<InputNumber className="w-full" />
									</Form.Item>
								</Col>
								<Col xs={24} sm={12} md={6}>
									<Form.Item
										name="DaysWaitForCustomerToPay"
										label="Thời gian cho phép khách hàng đến lấy ( ngày )"
										rules={[
											{required: true, message: 'Trường này là bắt buộc'},
										]}
									>
										<InputNumber className="w-full" />
									</Form.Item>
								</Col>
								<Col xs={24} sm={12} md={6}>
									<Form.Item
										name="MaxOrderAmountForCustomerToPlace"
										label="Số lượng đơn hàng đang xử lý tối đa cho một tài khoản"
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
				<Tabs.TabPane tab="Quy Tắc Thanh Toán" key="payment">
					<Card className="shadow-lg">
						<Form
							form={paymentForm}
							initialValues={orderPaymentRule}
							onFinish={handleOrderPaymentSubmit}
							layout="vertical"
							key={JSON.stringify(orderPaymentRule)}
							update
						>
							<Row gutter={[16, 16]} wrap>
								<Col xs={24} sm={12} md={6}>
									<Form.Item
										name="DepositPercent"
										label="Phần trăm đặt cọc đơn customized"
										rules={[
											{required: true, message: 'Trường này là bắt buộc'},
										]}
									>
										<InputNumber className="w-full" />
									</Form.Item>
								</Col>
								<Col xs={24} sm={12} md={6}>
									<Form.Item
										name="CODPercent"
										label="Phần trăm đặt cọc cho đơn COD"
										rules={[
											{required: true, message: 'Trường này là bắt buộc'},
										]}
									>
										<InputNumber className="w-full" />
									</Form.Item>
								</Col>
								<Col xs={24} sm={12} md={6}>
									<Form.Item
										name="PayAllFine"
										label="Tiền phạt nếu hủy đơn trả hết "
										rules={[
											{required: true, message: 'Trường này là bắt buộc'},
										]}
									>
										<InputNumber className="w-full" />
									</Form.Item>
								</Col>
								<Col xs={24} sm={12} md={6}>
									<Form.Item
										name="MaxMoneyFine"
										label="Tiền phạt nhiều nhất "
										rules={[
											{required: true, message: 'Trường này là bắt buộc'},
										]}
									>
										<InputNumber className="w-full" />
									</Form.Item>
								</Col>
								<Col xs={24} sm={12} md={6}>
									<Form.Item
										name="MinAmountForCOD"
										label="Giá trị tối thiểu cho đơn COD"
										rules={[
											{required: true, message: 'Trường này là bắt buộc'},
										]}
									>
										<InputNumber className="w-full" />
									</Form.Item>
								</Col>
								<Col xs={24} sm={12} md={6}>
									<Form.Item
										name="CODHourTimeLimit"
										label="Giới hạn thời gian để thanh toán đơn COD ( giờ )"
										rules={[
											{required: true, message: 'Trường này là bắt buộc'},
										]}
									>
										<InputNumber className="w-full" />
									</Form.Item>
								</Col>
								<Col xs={24} sm={12} md={6}>
									<Form.Item
										name="LockedPaymentMethodOnCustomer"
										label="Các phương thức thanh toán bị giới hạn cho người dùng"
										rules={[
											{required: true, message: 'Trường này là bắt buộc'},
										]}
									>
										<Select
											mode="multiple"
											allowClear
											className="w-full"
											placeholder="Chọn phương thức thanh toán"
											options={paymentMethods}
											optionFilterProp="label"
										/>
									</Form.Item>
								</Col>
							</Row>
							<Button type="primary" htmlType="submit">
								Lưu
							</Button>
						</Form>
					</Card>
				</Tabs.TabPane>
				<Tabs.TabPane tab="Quy Tắc Khuyến Mãi" key="promotion">
					<Card className="shadow-lg">
						<Form
							form={promotionForm}
							initialValues={promotionRule}
							onFinish={handlePromotionSubmit}
							layout="vertical"
							key={JSON.stringify(promotionRule)}
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
										name="MinCode"
										label="Mã giảm giá tối thiểu có thể dùng"
										rules={[
											{required: true, message: 'Trường này là bắt buộc'},
										]}
									>
										<InputNumber className="w-full" />
									</Form.Item>
								</Col>
								<Col xs={24} sm={12} md={6}>
									<Form.Item
										name="MaxCode"
										label="Mã giảm giá tối đa có thể dùng"
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
