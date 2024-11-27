import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { Helmet } from 'react-helmet';
import { useDispatch, useSelector } from 'react-redux';
import { handleLogin, setUser } from '../../../redux/slices/userLoginSlice';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { setLocalStorage } from '../../../utils/localstorage';
import { LoadingUserSelector } from '../../../redux/selectors';
import styles from './Login.module.css';
import { imageExporter } from '../../../assets/images';

const LoginPage = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loading = useSelector(LoadingUserSelector);

  const onFinish = (values) => {
    const { email, password } = values;

    const data = {
      email,
      password,
      isExternalLogin: true,
    };

    dispatch(handleLogin(data))
      .unwrap()
      .then((res) => {
        const decodedData = jwtDecode(res.accessToken);
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
      <div className="h-screen flex flex-col md:flex-row">
        {/* Mobile View with Image Background */}
        <div className="relative flex md:hidden justify-center items-center bg-black bg-center w-full h-full">
          <div
            className="absolute inset-0"
            style={{
              opacity: 0.2,
              backgroundImage: `url(${imageExporter.background})`,
              backgroundSize: 'cover', // Ensures the background image covers the entire container
              backgroundPosition: 'center', // Centers the background image
              backgroundRepeat: 'no-repeat', // Ensures no repetition of the background
            }}
          ></div>
          <div className="relative z-10 w-11/12 max-w-md">
            <h1 className="text-white text-3xl font-bold mb-4 text-center">
              Đăng Nhập
            </h1>
            <Form
              layout="vertical"
              name="basic"
              form={form}
              onFinish={onFinish}
              className="space-y-4 bg-transparent"
            >
              <Form.Item
                label={<span className="text-white">Email</span>}
                name="email"
                rules={[
                  {
                    required: true,
                    message: 'Hãy nhập email của bạn!',
                    type: 'email',
                  },
                ]}
              >
                <Input className="p-2 border rounded-md w-full" />
              </Form.Item>
              <Form.Item
                label={<span className="text-white">Mật Khẩu</span>}
                name="password"
                rules={[{ required: true, message: 'Hãy nhập mật khẩu!' }]}
              >
                <Input.Password className="p-2 border rounded-md w-full" />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  className="w-full bg-blue text-white py-2 rounded-md hover:bg-blue"
                >
                  Đăng Nhập
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>

        {/* Desktop View without Image Background */}
        <div className="hidden md:flex flex-col justify-center items-center w-1/2 px-8 bg-gray-100">
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
                { required: true, message: 'Hãy nhập email của bạn!', type: 'email' },
              ]}
            >
              <Input className="p-2 border rounded-md w-full" />
            </Form.Item>
            <Form.Item
              label="Mật Khẩu"
              name="password"
              rules={[{ required: true, message: 'Hãy nhập mật khẩu!' }]}
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
        </div>

        {/* Image Background Visible only on Desktop */}
        <div className="hidden md:block w-1/2 bg-cover bg-center">
          <img
            className="w-full h-full object-cover"
            src={imageExporter.background}
            alt="background"
          />
        </div>
      </div>
    </>
  );
};

export default LoginPage;
