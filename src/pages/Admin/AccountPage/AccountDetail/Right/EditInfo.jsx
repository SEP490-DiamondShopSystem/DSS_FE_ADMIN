import {Input} from 'antd';
import React from 'react';

export const EditInfo = ({user, editing, onChange, userInfo}) => {
	return (
		<div className="m-5 ">
			<div className="border border-lightGray2 py-3 px-10 rounded-lg mb-10">
				<p className="font-semibold text-xl">Thông tin cá nhân</p>
				<div className="flex items-center w-full">
					<div className="my-4 mr-5" style={{width: '50%'}}>
						<label className="font-semibold block mb-2" style={{color: '#babbbc'}}>
							Họ:
						</label>
						<Input
							className="font-semibold text-lg"
							disabled={!editing}
							name="FirstName"
							value={userInfo?.FirstName}
							onChange={onChange}
						/>
					</div>
					<div className="my-4" style={{width: '50%'}}>
						<label className="font-semibold block mb-2" style={{color: '#babbbc'}}>
							Tên:
						</label>
						<Input
							className="font-semibold text-lg"
							disabled={!editing}
							name="LastName"
							value={userInfo?.LastName}
							onChange={onChange}
						/>
					</div>
				</div>
				<div className="">
					<div className="my-4">
						<label className="font-semibold block mb-2" style={{color: '#babbbc'}}>
							Email:
						</label>
						<Input
							className="font-semibold text-lg"
							disabled={true}
							value={userInfo?.Email}
						/>
					</div>
				</div>
				<div className="">
					<div className="my-4">
						<label className="font-semibold block mb-2" style={{color: '#babbbc'}}>
							Số Điện Thoại:
						</label>
						<Input className="font-semibold text-lg" disabled={true} />
					</div>
				</div>
			</div>
			<div className="border border-lightGray2 py-3 px-10 rounded-lg ">
				<p className="font-semibold text-xl">Địa Chỉ</p>

				{userInfo?.Addresses?.map((address) => (
					<div className="">
						<div className="my-4">
							<Input
								className="font-semibold text-lg"
								disabled={true}
								value={`${address.Street} ${address.Ward} ${address.District} ${address.Province}`}
							/>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};
