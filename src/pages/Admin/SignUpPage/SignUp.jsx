import React from 'react';

import {Button, Checkbox, Form, Input, message} from 'antd';
import {Helmet} from 'react-helmet';
import {useDispatch, useSelector} from 'react-redux';
import {Link, useNavigate} from 'react-router-dom';
import {imageExporter} from '../../../assets/images';
import {handleStaffRegister} from '../../../redux/slices/userLoginSlice';
import styles from './SignUp.module.css';
import {LoadingUserSelector} from '../../../redux/selectors';

const SignUpPage = () => {
	const [form] = Form.useForm();
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const loading = useSelector(LoadingUserSelector);

	const onFinish = (values) => {
		const {firstName, lastName, role} = values;
		const fullName = {
			firstName,
			lastName,
		};
		try {
			dispatch(handleStaffRegister({...values, fullName, isManager: role}))
				.then((res) => {
					if (res.payload) {
						message.success('Đăng ký thành công!');
						form.resetFields();

						navigate('/login');
					} else {
						message.error(error?.data?.title || error?.detail);
					}
				})
				.catch((error) => {
					setIsLoading(false);
					console.log(error);

					message.error(error?.data?.title || error?.detail);
				});
		} catch (error) {
			message.error(error?.data?.title || error?.detail);
		}
	};

	return (
		<>
			<Helmet>
				<title>Đăng Ký | Diamond Shop Admin</title>
			</Helmet>
			<div className={styles.signUpPageContainer}>
				<div className={styles.leftSide}>
					<img
						style={{
							width: '100%',
							maxHeight: '100%',
							objectPosition: 'center',
							objectFit: 'cover',
						}}
						src={imageExporter.background}
						alt="background"
					/>
				</div>
				<div className={styles.rightSide}>
					<div className={styles.signUpHeader}>
						<h1 className="text-primary font-semibold text-2xl">Đăng Ký</h1>
					</div>
					<div className={styles.signUpForm}>
						<Form form={form} layout="vertical" name="basic" onFinish={onFinish}>
							<Form.Item
								label="Họ"
								name="firstName"
								rules={[{required: true, message: 'Please input your first name!'}]}
							>
								<Input className={styles.inputForm} />
							</Form.Item>
							<Form.Item
								label="Tên"
								name="lastName"
								rules={[{required: true, message: 'Please input your last name!'}]}
							>
								<Input className={styles.inputForm} />
							</Form.Item>
							<Form.Item
								label="Email"
								name="email"
								rules={[
									{
										required: true,
										message: 'Please input your email!',
										type: 'email',
									},
								]}
							>
								<Input className={styles.inputForm} />
							</Form.Item>
							<Form.Item
								label="Mật Khẩu"
								name="password"
								rules={[{required: true, message: 'Please input your password!'}]}
							>
								<Input.Password className={styles.inputForm} />
							</Form.Item>
							<Form.Item
								label="Xác Nhận Mật Khẩu"
								name="confirmPassword"
								dependencies={['password']}
								rules={[
									{required: true, message: 'Please confirm your password!'},
									({getFieldValue}) => ({
										validator(_, value) {
											if (!value || getFieldValue('password') === value) {
												return Promise.resolve();
											}
											return Promise.reject(
												new Error('The two passwords do not match!')
											);
										},
									}),
								]}
							>
								<Input.Password className={styles.inputForm} />
							</Form.Item>{' '}
							<Form.Item name="role" valuePropName="checked" initialValue={false}>
								<Checkbox value={true}>Manager</Checkbox>
							</Form.Item>
							<Form.Item>
								<Button
									type="text"
									htmlType="submit"
									loading={loading}
									className={`bg-primary font-semibold ${styles.signUpButton}`}
								>
									Đăng Ký
								</Button>
							</Form.Item>
						</Form>
						<p className={styles.signInLink}>
							Bạn đã có tài khoản? <Link to="/login">Đăng Nhập</Link>
						</p>
					</div>
				</div>
			</div>
		</>
	);
};

export default SignUpPage;
