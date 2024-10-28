import {
	CheckCircleFilled,
	CloseCircleOutlined,
	DeleteOutlined,
	DownCircleFilled,
	EditFilled,
	StopOutlined,
	UpCircleFilled,
	UserOutlined,
} from '@ant-design/icons';
import {Button, Image, message} from 'antd';
import React, {useState} from 'react';

export const Information = ({
	user,
	handleEditing,
	editing,
	handleUpdate,
	showModal,
	showRemoveModal,
	handleBanAccount,
}) => {
	const copyToClipboard = () => {
		navigator.clipboard.writeText(user.Id);
		message.success('Đã sao chép!');
	};

	return (
		<div className="m-5">
			<div>
				<Image
					preview={false}
					width={70}
					height={70}
					alt="Small Image"
					className="border rounded-full"
				/>
			</div>
			<p className="font-semibold text-lg my-2">{user.Email}</p>
			<p className="font-semibold my-2" style={{color: '#939698'}}>
				Đăng nhập lần cuối: 1 phút trước
			</p>
			<div className="my-4 mr-20">
				<div
					className="border border-lightGray1 rounded-full w-full px-2 flex items-center justify-around"
					style={{backgroundColor: '#f2f2f3'}}
				>
					<div className="flex items-center justify-around w-full">
						<p className="font-semibold">User ID:</p>
						<p className="" style={{color: '#9a9b9d'}}>
							{user.Id}
						</p>
					</div>
					<button
						onClick={copyToClipboard}
						className="ml-3 py-1 px-3 rounded bg-blue-500 font-semibold hover:text-gray"
					>
						Copy
					</button>
				</div>
			</div>
			<div className="mt-10 font-semibold">
				<p className="text-lg">Vai trò</p>
				{user &&
					user?.Roles?.map((role) => (
						<div className="flex items-center mb-2">
							<p>
								<UserOutlined />
							</p>
							<p className="ml-3">{role?.RoleName}</p>
						</div>
					))}
				{editing && (
					<div className="flex items-center">
						<Button
							type="primary"
							className="flex items-center mb-2 mr-3"
							onClick={() => showModal(user.Id)}
						>
							<p>
								<UpCircleFilled />
							</p>
							<p className="ml-3">Thêm Vai Trò</p>
						</Button>

						<Button
							danger
							className="flex items-center mb-2"
							onClick={() => showRemoveModal(user.Id)}
						>
							<p>
								<DownCircleFilled />
							</p>
							<p className="ml-3">Xóa Vai Trò</p>
						</Button>
					</div>
				)}

				<div className="mt-10">
					{!editing ? (
						<Button
							type="primary"
							className="flex items-center mb-2"
							onClick={handleEditing}
						>
							<p>
								<EditFilled />
							</p>
							<p className="ml-3">Chỉnh Sửa</p>
						</Button>
					) : (
						<div className="flex items-center justify-between w-48">
							<Button
								type="primary"
								className="flex items-center mb-2"
								onClick={handleUpdate}
							>
								<p>
									<CheckCircleFilled />
								</p>
								<p className="ml-3">Lưu</p>
							</Button>
							<Button
								danger
								className="flex items-center mb-2  "
								onClick={handleEditing}
							>
								<p>
									<CloseCircleOutlined />
								</p>
								<p className="ml-3">Hủy</p>
							</Button>
						</div>
					)}

					<Button danger className="flex items-center mb-2" onClick={handleBanAccount}>
						<p>
							<StopOutlined />
						</p>
						<p className="ml-3">Cấm Người Dùng</p>
					</Button>
					<Button danger className="flex items-center mb-2">
						<p>
							<DeleteOutlined />
						</p>
						<p className="ml-3">Xóa Người Dùng</p>
					</Button>
				</div>
			</div>
		</div>
	);
};
