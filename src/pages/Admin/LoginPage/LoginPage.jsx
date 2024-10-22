import React, {useState, useEffect} from 'react';

import {Form, Input, Button, Checkbox, message} from 'antd';
import {imageExporter} from '../../../assets/images';
import styles from './Login.module.css';
import {Helmet} from 'react-helmet';
import {useDispatch} from 'react-redux';
import {handleLogin, handleLoginStaff, setUser} from '../../../redux/slices/userLoginSlice';
import {Link, useNavigate} from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import {setLocalStorage} from '../../../utils/localstorage';

const LoginPage = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [form] = Form.useForm();
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const onFinish = (values) => {
		console.log('Received values:', values);
		const {email, password, role} = values;

		const data = {
			email,
			password,
			isExternalLogin: true,
			isStaffLogin: role ? true : false,
		};
		// if (role) {
		// 	dispatch(handleLoginStaff(data))
		// 		.then((res) => {
		// 			console.log(res.payload);

		// 			if (res.payload) {
		// 				const decodedData = jwtDecode(res.payload.accessToken);
		// 				console.log(decodedData);
		// 				setLocalStorage('user', JSON.stringify(decodedData));
		// 				setLocalStorage('userId', decodedData.UserId);
		// 				dispatch(setUser(decodedData));
		// 				message.success('Đăng nhập thành công!');
		// 				form.resetFields();

		// 				navigate('/');
		// 			} else {
		// 				message.error(
		// 					'Đăng nhập không thành công. Vui lòng kiểm tra thông tin đăng nhập của bạn!'
		// 				);
		// 			}
		// 		})
		// 		.catch((error) => {
		// 			setIsLoading(false);
		// 			console.log(error);
		// 			message.error('Email hoặc mật khẩu không đúng!');
		// 		});
		// } else {

		// }
		dispatch(handleLogin(data))
			.then((res) => {
				if (res.payload) {
					const decodedData = jwtDecode(res.payload.accessToken);
					console.log(decodedData);
					setLocalStorage('user', JSON.stringify(decodedData));
					setLocalStorage('userId', decodedData.UserId);
					dispatch(setUser(decodedData));
					message.success('Đăng nhập thành công!');
					form.resetFields();

					navigate('/');
				} else {
					message.error(
						'Đăng nhập không thành công. Vui lòng kiểm tra thông tin đăng nhập của bạn!'
					);
				}
			})
			.catch((error) => {
				setIsLoading(false);
				console.log(error);
				message.error('Email hoặc mật khẩu không đúng!');
			});
	};

	return (
		<>
			<Helmet>
				<title>Đăng Nhập | Diamond Shop Admin</title>
			</Helmet>
			<div className={styles.loginPageContainer}>
				<div className={styles.leftSide}>
					<div className={styles.loginHeader}>
						<h1>Đăng Nhập</h1>
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
								label="Email"
								name="email"
								rules={[
									{
										required: true,
										message: 'Hãy nhập email của bạn!',
										type: 'email',
									},
								]}
							>
								<Input className={styles.inputField} />
							</Form.Item>

							<Form.Item
								className={styles.formItem}
								label="Password"
								name="password"
								rules={[{required: true, message: 'Please input your password!'}]}
							>
								<Input.Password className={styles.inputField} />
							</Form.Item>

							{/* <div className={styles.formItemsContainer}>
								<Form.Item name="role" valuePropName="checked" initialValue={false}>
									<Checkbox value={true}>Bạn là Staff</Checkbox>
								</Form.Item>
							</div> */}

							<Form.Item className={styles.centerButton}>
								<Button
									// loading={isLoading}
									type="primary"
									htmlType="submit"
									className={styles.loginButton}
								>
									Đăng Nhập
								</Button>
							</Form.Item>
						</Form>
						<p className={styles.signUpLink}>
							Bạn chưa có tài khoản? <Link to="/register">Đăng Ký</Link>
						</p>
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
