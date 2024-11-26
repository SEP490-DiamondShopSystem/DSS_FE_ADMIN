import React, {useState, useEffect} from 'react';

import {Form, Input, Button, Checkbox, message} from 'antd';
import {imageExporter} from '../../../assets/images';
import styles from './Login.module.css';
import {Helmet} from 'react-helmet';
import {useDispatch, useSelector} from 'react-redux';
import {handleLogin, handleLoginStaff, setUser} from '../../../redux/slices/userLoginSlice';
import {Link, useNavigate} from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import {setLocalStorage} from '../../../utils/localstorage';
import {LoadingUserSelector} from '../../../redux/selectors';

const LoginPage = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [form] = Form.useForm();
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const loading = useSelector(LoadingUserSelector);

	const onFinish = (values) => {
		console.log('Received values:', values);
		const {email, password, role} = values;

		const data = {
			email,
			password,
			isExternalLogin: true,
			isStaffLogin: role ? true : false,
		};

		dispatch(handleLogin(data))
			.unwrap()
			.then((res) => {
				const decodedData = jwtDecode(res.accessToken);
				console.log(decodedData);
				setLocalStorage('user', JSON.stringify(decodedData));
				setLocalStorage('userId', decodedData.UserId);
				dispatch(setUser(decodedData));
				message.success('Đăng nhập thành công!');
				form.resetFields();

				navigate('/');
			})
			.catch((error) => {
				message.error(error?.data?.title || error?.title);
			});
	};

	return (
		<>
			<Helmet>
				<title>Login | Diamond Shop Admin</title>
			</Helmet>
			<div className="flex flex-col md:flex-row h-screen">
				<div className="flex flex-col justify-center items-center md:w-1/2 px-4 md:px-16 py-8 bg-gray-100">
					<h1 className="text-primary text-3xl font-bold mb-4">Đăng Nhập</h1>
					<Form
						layout="vertical"
						name="basic"
						form={form}
						onFinish={onFinish}
						className="w-full max-w-md space-y-4"
					>
						<Form.Item
							label="Email"
							name="email"
							rules={[
								{required: true, message: 'Hãy nhập email của bạn!', type: 'email'},
							]}
						>
							<Input className="p-2 border rounded-md w-full" />
						</Form.Item>

						<Form.Item
							label="Mật Khẩu"
							name="password"
							rules={[{required: true, message: 'Hãy nhập mật khẩu!'}]}
						>
							<Input.Password className="p-2 border rounded-md w-full" />
						</Form.Item>

						<Form.Item>
							<Button
								type="primary"
								htmlType="submit"
								loading={loading}
								className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
							>
								Đăng Nhập
							</Button>
						</Form.Item>
					</Form>
					{/* <p className="mt-4 text-sm">
						Bạn chưa có tài khoản?{' '}
						<Link to="/register" className="text-blue-500 underline">
							Đăng Ký
						</Link>
					</p> */}
				</div>
				<div className="sm:hidden md:block md:w-1/2 bg-cover bg-center">
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
