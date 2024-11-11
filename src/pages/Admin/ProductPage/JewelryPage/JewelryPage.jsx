import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {fetchAllJewelry} from '../../../../redux/slices/jewelry/jewelrySlice';
import {
	selectJewelryList,
	selectJewelryLoading,
	selectJewelryError,
} from '../../../../redux/selectors';
import JewelryDetail from './JewelryDetail';
import JewelryCreateForm from './JewelryCreateForm';

const JewelryPage = () => {
	const dispatch = useDispatch();
	const jewelryList = useSelector(selectJewelryList);
	const loading = useSelector(selectJewelryLoading);
	const error = useSelector(selectJewelryError);

	const [selectedJewelry, setSelectedJewelry] = React.useState(null);
	const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);

	// Log initial render and state updates
	useEffect(() => {
		console.log('Dispatching fetchAllJewelry');
		dispatch(fetchAllJewelry());
	}, [dispatch]);

	useEffect(() => {
		console.log('jewelryList updated:', jewelryList);
	}, [jewelryList]);

	useEffect(() => {
		console.log('loading state:', loading);
	}, [loading]);

	useEffect(() => {
		console.log('error state:', error);
	}, [error]);

	const handleJewelryClick = (jewelry) => {
		console.log('Selected jewelry:', jewelry);
		setSelectedJewelry(jewelry);
	};
	const handleAddJewelry = () => {
		setIsCreateFormOpen(true);
	};
	const handleCreateFormClose = () => {
		setIsCreateFormOpen(false);
	};
	return (
		<div>
			<h1>Jewelry Collection</h1>

			<div className="flex justify-end mb-5">
				<button
					onClick={handleAddJewelry}
					className="px-4 py-2 bg-primary text-black rounded-lg hover:bg-primaryDark"
				>
					Add Jewelry
				</button>
			</div>

			{loading && <p>Loading...</p>}
			{error && <p>Error: {error}</p>}
			{!loading && !error && (
				<div className="jewelry-list">
					{Array.isArray(jewelryList) &&
						jewelryList.map((jewelry) => (
							<div
								key={jewelry.Id}
								onClick={() => handleJewelryClick(jewelry)}
								className="jewelry-item flex items-center space-x-4 p-4 bg-tintWhite hover:bg-primaryLight shadow-lg rounded-lg cursor-pointer transition-transform transform hover:scale-105"
							>
								<img
									src={jewelry.thumbnail?.mediaPath || '/default-thumbnail.jpg'}
									alt={jewelry.SerialCode}
									className="w-20 h-20 object-cover rounded-md border-2 border-gray"
								/>
								<div className="text-black">
									<h2 className="text-lg font-semibold text-primary">
										{jewelry.SerialCode}
									</h2>
									<p className="text-sm text-gray">
										Category: {jewelry.Category?.Name}
									</p>
									<p className="text-sm font-medium text-darkGreen">
										Price: {jewelry.TotalPrice.toLocaleString()} VND
									</p>
								</div>
							</div>
						))}
				</div>
			)}
			{selectedJewelry && (
				<JewelryDetail jewelry={selectedJewelry} onClose={() => setSelectedJewelry(null)} />
			)}
			{/* Jewelry Create Form Modal */}
			{isCreateFormOpen && (
				<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
					<div className="bg-white p-6 rounded-lg shadow-lg">
						<JewelryCreateForm onClose={handleCreateFormClose} />
					</div>
				</div>
			)}
		</div>
	);
};

export default JewelryPage;
