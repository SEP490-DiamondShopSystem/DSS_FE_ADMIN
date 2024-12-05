import {Input, Button} from 'antd';
import React, {useState} from 'react';

export const EditInfo = ({
	user,
	editing,
	onChange,
	userInfo,
	addressChanges,
	setAddressChanges,
}) => {
	const handleAddressChange = (index, field, value) => {
		console.log(`Changing address at index ${index}:`, {field, value});

		const updatedAddresses = [...userInfo.Addresses];
		const address = updatedAddresses[index];

		// Update the specific address
		updatedAddresses[index] = {...address, [field]: value};

		// Track updates for added addresses
		setAddressChanges((prev) => {
			const newAddedAddresses = [...(prev.addedAddress || [])];

			// If it's a new address without an ID
			if (!address.Id) {
				newAddedAddresses[index] = {
					...(newAddedAddresses[index] || {}),
					[field.toLowerCase()]: value,
				};
			}

			return {
				...prev,
				addedAddress: newAddedAddresses,
			};
		});

		// For existing addresses, track updates
		if (address.Id) {
			setAddressChanges((prev) => ({
				...prev,
				updatedAddress: {
					...prev.updatedAddress,
					[address.Id]: {
						province: field === 'Province' ? value : address.Province,
						district: field === 'District' ? value : address.District,
						ward: field === 'Ward' ? value : address.Ward,
						street: field === 'Street' ? value : address.Street,
					},
				},
			}));
		}

		// Update the userInfo state
		onChange({
			target: {
				name: 'Addresses',
				value: updatedAddresses,
			},
		});
	};

	const handleAddAddress = () => {
		const newAddress = {
			Province: '', // Use defaults or placeholders if appropriate
			District: '',
			Ward: '',
			Street: '',
			IsDefault: false,
		};
		const updatedAddresses = [...userInfo.Addresses, newAddress];

		setAddressChanges((prev) => ({
			...prev,
			addedAddress: [
				...prev.addedAddress,
				{
					province: newAddress.Province,
					district: newAddress.District,
					ward: newAddress.Ward,
					street: newAddress.Street,
					isDefault: newAddress.IsDefault,
				},
			],
		}));

		onChange({
			target: {
				name: 'Addresses',
				value: updatedAddresses,
			},
		});
	};

	const handleRemoveAddress = (index) => {
		const removedAddress = userInfo.Addresses[index];
		console.log('Removed Address:', removedAddress);
		console.log('Removed Address ID:', removedAddress?.Id);
		if (userInfo.Addresses.length === 1 || removedAddress.IsDefault) {
			message.warning('Không thể xóa địa chỉ mặc định');
			return;
		}
		if (removedAddress?.Id) {
			setAddressChanges((prev) => {
				const newRemovedAddressId = [...prev.removedAddressId, removedAddress.Id];
				console.log('Updated Removed Address IDs:', newRemovedAddressId);
				return {
					...prev,
					removedAddressId: newRemovedAddressId,
				};
			});
		}

		const updatedAddresses = userInfo.Addresses.filter((_, i) => i !== index);
		onChange({target: {name: 'Addresses', value: updatedAddresses}});
	};
	const handleSetDefaultAddress = (index) => {
		const updatedAddresses = userInfo.Addresses.map((addr, i) => ({
			...addr,
			IsDefault: i === index,
		}));

		setAddressChanges((prev) => ({
			...prev,
			newDefaultAddressId: updatedAddresses[index]?.Id || '',
		}));

		onChange({
			target: {
				name: 'Addresses',
				value: updatedAddresses,
			},
		});
	};
	return (
		<div className="m-5">
			{/* Personal Information */}
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
				<div className="my-4">
					<label className="font-semibold block mb-2" style={{color: '#babbbc'}}>
						Số Điện Thoại:
					</label>
					<Input
						className="font-semibold text-lg"
						disabled={!editing}
						name="PhoneNumber"
						value={userInfo?.PhoneNumber}
						onChange={onChange}
					/>
				</div>
			</div>

			{/* Address Information */}
			<div className="border border-lightGray2 py-3 px-10 rounded-lg">
				<p className="font-semibold text-xl">Địa Chỉ</p>
				{userInfo?.Addresses?.length > 0 ? (
					userInfo?.Addresses?.map((address, index) => (
						<div key={index} className="my-4">
							{editing ? (
								<div className="space-y-2">
									<Input
										placeholder="Đường"
										className="font-semibold text-lg"
										disabled={!editing}
										name="Street"
										value={address.Street}
										onChange={(e) =>
											handleAddressChange(index, 'Street', e.target.value)
										}
									/>
									<Input
										placeholder="Phường/Xã"
										className="font-semibold text-lg"
										disabled={!editing}
										name="Ward"
										value={address.Ward}
										onChange={(e) =>
											handleAddressChange(index, 'Ward', e.target.value)
										}
									/>
									<Input
										placeholder="Quận/Huyện"
										className="font-semibold text-lg"
										disabled={!editing}
										name="District"
										value={address.District}
										onChange={(e) =>
											handleAddressChange(index, 'District', e.target.value)
										}
									/>
									<Input
										placeholder="Tỉnh/Thành phố"
										className="font-semibold text-lg"
										disabled={!editing}
										name="Province"
										value={address.Province}
										onChange={(e) =>
											handleAddressChange(index, 'Province', e.target.value)
										}
									/>
									<Button
										type="text"
										className="text-red-500"
										onClick={() => handleRemoveAddress(index)}
									>
										Xóa
									</Button>{' '}
									{editing && (
										<Button
											type="link"
											onClick={() => handleSetDefaultAddress(index)}
											disabled={address.IsDefault}
										>
											{address.IsDefault
												? 'Địa chỉ mặc định'
												: 'Đặt làm mặc định'}
										</Button>
									)}
								</div>
							) : (
								<>
									<Input
										className="font-semibold text-lg mb-2"
										disabled={true}
										value={`${address.Street}, ${address.Ward}, ${address.District}, ${address.Province}`}
									/>
								</>
							)}
						</div>
					))
				) : (
					<div className="font-semibold text-lg my-2">Không Có Địa Chỉ</div>
				)}
				{editing && (
					<Button type="dashed" onClick={handleAddAddress}>
						Thêm Địa Chỉ
					</Button>
				)}
			</div>
		</div>
	);
};
