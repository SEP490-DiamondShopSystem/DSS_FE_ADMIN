import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {fetchAllMetals, updateMetalPrice} from '../../../../redux/slices/jewelry/metalSlice';
import {
	getAllMetalsSelector,
	LoadingMetalSelector,
	MetalErrorSelector,
} from '../../../../redux/selectors';

const MetalPage = () => {
	const dispatch = useDispatch();
	const metals = useSelector(getAllMetalsSelector);
	const loading = useSelector(LoadingMetalSelector);
	const error = useSelector(MetalErrorSelector);
	const [editPrice, setEditPrice] = useState({});

	useEffect(() => {
		dispatch(fetchAllMetals());
	}, [dispatch]);

	const handlePriceChange = (id, newPrice) => {
		setEditPrice((prevState) => ({
			...prevState,
			[id]: newPrice,
		}));
	};

	const handleSave = (metal) => {
		dispatch(updateMetalPrice({id: metal.Id, price: parseInt(editPrice[metal.Id], 10)}))
			.unwrap()
			.then(() => {
				setEditPrice((prevState) => ({...prevState, [metal.Id]: ''}));
			})
			.catch((err) => {
				message.error(error?.data?.title || error?.detail);
			});
	};

	if (loading) return <p className="text-xl text-blue-500">Loading metals...</p>;

	return (
		<div className="p-6 bg-offWhite min-h-screen">
			<h1 className="text-3xl font-semibold text-primary mb-6">Manage Metal Prices</h1>

			{/* Metal Prices Table */}
			<table className="w-full border-collapse bg-white rounded-lg shadow-md border border-lightGray">
				<thead>
					<tr className="bg-gray-100">
						<th className="border p-3 text-left text-sm text-gray-700">Name</th>
						<th className="border p-3 text-left text-sm text-gray-700">
							Current Price
						</th>
						<th className="border p-3 text-left text-sm text-gray-700">New Price</th>
						<th className="border p-3 text-left text-sm text-gray-700">Actions</th>
					</tr>
				</thead>
				<tbody>
					{metals.map((metal) => (
						<tr key={metal.Id} className="border-b">
							<td className="border p-3 text-sm text-gray-700">{metal.Name}</td>
							<td className="border p-3 text-sm text-gray-700">
								{metal.Price.toLocaleString()} VND
							</td>
							<td className="border p-3">
								<input
									type="number"
									min={0}
									value={editPrice[metal.Id] || ''}
									onChange={(e) => handlePriceChange(metal.Id, e.target.value)}
									className="p-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-primary"
								/>
							</td>
							<td className="border p-3">
								<button
									onClick={() => handleSave(metal)}
									className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primaryDark disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-primary"
									disabled={!editPrice[metal.Id]}
								>
									Save
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default MetalPage;
