import React, {useState, useEffect} from 'react';
import {Form, Input, Button, Checkbox, message} from 'antd';
import {imageExporter} from '../../../assets/images';
import styles from './Login.module.css';
import {Helmet} from 'react-helmet';
import {useDispatch} from 'react-redux';
import {handleLogin} from '../../../redux/slices/userLoginSlice';
import {useNavigate} from 'react-router-dom';

const LoginPage = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [form] = Form.useForm();
	const dispatch = useDispatch();
	const navigate = useNavigate();

	useEffect(() => {
		// Load saved credentials from local storage, if they exist
		const savedCredentials = localStorage.getItem('rememberedCredentials');
		if (savedCredentials) {
			const {phone, password} = JSON.parse(savedCredentials);
			form.setFieldsValue({phone, password, remember: true});
		}
	}, [form]);

	const onFinish = (values) => {
		console.log('Received values:', values);
		setIsLoading(true);

		dispatch(handleLogin(values))
			.then((response) => {
				const user = response.payload.metadata.user;
				if (user?.role === 'admin') {
					if (values.remember) {
						// Save credentials to local storage if "Remember password?" is checked
						localStorage.setItem(
							'rememberedCredentials',
							JSON.stringify({
								phone: values.phone,
								password: values.password,
							})
						);
					} else {
						// Remove saved credentials if "Remember password?" is not checked
						localStorage.removeItem('rememberedCredentials');
					}
					setIsLoading(false);
					navigate('/');
					message.success('Login successful!');
				} else {
					setIsLoading(false);
					message.error('You do not have permission to access this page!');
				}
			})
			.catch((error) => {
				setIsLoading(false);
				console.log(error);
				message.error('Incorrect phone or password!');
			});
	};

	return (
		<>
			<Helmet>
				<title>Sign In - SportLinker</title>
			</Helmet>
			<div className={styles.loginPageContainer}>
				<div className={styles.leftSide}>
					<div className={styles.loginHeader}>
						<h1>Sign In</h1>
					</div>
					<div className={styles.loginForm}>
						<Form
							layout="vertical"
							name="basic"
							form={form}
							onFinish={onFinish}
							className={styles.formContainer}
						>
							<Form.Item
								className={styles.formItem}
								label="Phone"
								name="phone"
								rules={[
									{required: true, message: 'Please input your phone!'},
									{
										pattern: /^0\d{9}$/,
										message:
											'Phone number must start with 0 and be exactly 10 digits!',
									},
								]}
							>
								<Input className={styles.inputField} type="tel" maxLength={10} />
							</Form.Item>

							<Form.Item
								className={styles.formItem}
								label="Password"
								name="password"
								rules={[{required: true, message: 'Please input your password!'}]}
							>
								<Input.Password className={styles.inputField} />
							</Form.Item>

							<div className={styles.formItemsContainer}>
								<Form.Item name="remember" valuePropName="checked">
									<Checkbox className={styles.rememberCheckbox}>
										Remember password?
									</Checkbox>
								</Form.Item>
							</div>

							<Form.Item className={styles.centerButton}>
								<Button
									loading={isLoading}
									type="primary"
									htmlType="submit"
									className={styles.loginButton}
								>
									Sign In
								</Button>
							</Form.Item>
						</Form>
					</div>
				</div>
				<div className={styles.rightSide}>
					<img
						style={{
							width: '100%',
							maxHeight: '100%',
							objectPosition: 'center',
							objectFit: 'cover',
						}}
						src={imageExporter.background}
						alt="background"
					></img>
				</div>
			</div>
		</>
	);
};

export default LoginPage;
