import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
	fetchPriceBoard,
	fetchDiamondPrices,
	createDiamondPrice,
	updateDiamondPrices,
	deleteDiamondPrice,
} from '../../../../redux/slices/diamondPriceSlice';
import {getPriceBoardSelector, LoadingDiamondPriceSelector} from '../../../../redux/selectors';

const formatPrice = (price) => {
	if (price === null || price === undefined) return 'N/A';
	if (price < 0) return 'Not Set';
	return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' VND';
};

const SideDiamondPricePage = () => {
	const dispatch = useDispatch();
	const {priceBoard, loading} = useSelector((state) => ({
		priceBoard: getPriceBoardSelector(state),
		loading: LoadingDiamondPriceSelector(state),
	}));
	const [filters, setFilters] = useState({
		isLabDiamond: false,
	});

	const handleFilterChange = (filterName) => (event) => {
		setFilters((prev) => ({
			...prev,
			[filterName]: event.target.checked || Number(event.target.value),
		}));
	};

	const [isLabDiamond, setIsLabDiamond] = useState(false);
	const [shapeId, setShapeId] = useState(99);

	const [isSideDiamond, setIsSideDiamond] = useState(true);
	const [editedCells, setEditedCells] = useState([]);
	const [isEditing, setIsEditing] = useState(false);
	const [selectedPrices, setSelectedPrices] = useState([]);
	const [isCreating, setIsCreating] = useState(false);
	const [listPrices, setListPrices] = useState([]);
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

	useEffect(() => {
		dispatch(fetchPriceBoard({isLabDiamond, isSideDiamond}));
	}, [dispatch, isLabDiamond, isSideDiamond]);

	const handleCheckboxChange = (criteriaId) => {
		setSelectedPrices(
			(prev) =>
				prev.includes(criteriaId)
					? prev.filter((id) => id !== criteriaId) // Uncheck
					: [...prev, criteriaId] // Check
		);
	};

	const handleDelete = () => {
		if (selectedPrices.length === 0) return;
		setShowDeleteConfirm(true); // Show confirmation popup
	};

	const confirmDelete = async () => {
		try {
			const deleteList = selectedPrices.map((criteriaId) => ({criteriaId}));
			const payload = {
				deleteList,
				isLabDiamond,
			};

			await dispatch(deleteDiamondPrice(payload)); // Wait for delete to finish
		} catch (error) {
			message.error(error?.data?.title || error?.detail);
		}
		setSelectedPrices([]);
		setShowDeleteConfirm(false);
		await dispatch(fetchPriceBoard({isLabDiamond, isSideDiamond})); // Fetch updated board
	};

	const savePrices = async () => {
		try {
			const listPrices = editedCells.map((cell) => ({
				diamondCriteriaId: cell.diamondCriteriaId,
				price: Number(cell.price),
			}));

			if (listPrices.length === 0) return;

			await dispatch(createDiamondPrice({listPrices, isLabDiamond, isSideDiamond, shapeId}));
		} catch (error) {
			message.error(error?.data?.title || error?.detail);
		}
		setEditedCells([]);
		setIsCreating(false);
		await dispatch(fetchPriceBoard({isLabDiamond, isSideDiamond})); // Fetch updated board
	};

	const handleSave = async () => {
		try {
			const updatedPrices = editedCells.map((cell) => ({
				diamondCriteriaId: cell.diamondCriteriaId,
				price: Number(cell.price),
			}));

			await dispatch(
				updateDiamondPrices({
					updatedDiamondPrices: updatedPrices,
					shapeId,
					isLabDiamond,
					isSideDiamond,
				})
			);
		} catch (error) {
			message.error(error?.data?.title || error?.detail);
		} // Wait for update to finish
		setEditedCells([]);
		setIsEditing(false);
		await dispatch(fetchPriceBoard({isLabDiamond, isSideDiamond, shapeId})); // Fetch updated board
	};

	const cancelDelete = () => {
		setShowDeleteConfirm(false);
	};
	const handleLabDiamondChange = (event) => {
		setIsLabDiamond(event.target.checked);
	};

	const handleAddPriceToggle = () => {
		setIsCreating(!isCreating);
		setIsEditing(false);
		setListPrices([]);
	};
	const handleEditPriceToggle = () => {
		setIsEditing(!isEditing);
		setIsCreating(false);
		setEditedCells([]);
	};
	const handleEditCell = (rowIndex, cellIndex, criteriaId, newValue) => {
		const numericValue = parseFloat(newValue.replace(/\./g, '').replace(',', '.')) || 0;
		console.log(`Received CriteriaId: ${criteriaId}`);

		setEditedCells((prev) => {
			const existingCell = prev.find(
				(cell) => cell.rowIndex === rowIndex && cell.cellIndex === cellIndex
			);

			if (existingCell) {
				if (newValue.trim() === '' || numericValue === 0) {
					// Remove the existing cell entry if the new value is empty
					console.log(`Removing entry for CriteriaId: ${criteriaId} due to empty value`);
					return prev.filter((cell) => cell !== existingCell);
				} else {
					// Update the existing entry
					console.log(
						`Updating existing entry with CriteriaId: ${criteriaId}, Price: ${numericValue}`
					);
					return prev.map((cell) =>
						cell === existingCell ? {...existingCell, price: numericValue} : cell
					);
				}
			} else {
				if (numericValue > 0) {
					// Add new entry only if the value is greater than zero
					const newEntry = {
						diamondCriteriaId: criteriaId,
						price: numericValue,
						rowIndex,
						cellIndex,
					};
					console.log(
						`Adding new entry with CriteriaId: ${criteriaId}, Price: ${numericValue}`
					);
					return [...prev, newEntry];
				}
				// If the numeric value is zero or the new value is empty, do not add a new entry
				return prev;
			}
		});
	};

	const handleAddPriceCell = (rowIndex, cellIndex, criteriaId, newValue) => {
		console.log(`Received CriteriaId: ${criteriaId}, New Value: ${newValue}`);
		const numericValue = parseFloat(newValue.replace(/\./g, '').replace(',', '.')) || 0;

		setEditedCells((prev) => {
			const existingCell = prev.find(
				(cell) => cell.rowIndex === rowIndex && cell.cellIndex === cellIndex
			);

			if (existingCell) {
				if (newValue.trim() === '' || numericValue === 0) {
					// Remove the existing cell entry if the new value is empty
					console.log(`Removing entry for CriteriaId: ${criteriaId} due to empty value`);
					return prev.filter((cell) => cell !== existingCell);
				} else {
					// Update the existing entry
					console.log(
						`Updating existing entry with CriteriaId: ${criteriaId}, New Price: ${numericValue}`
					);
					return prev.map((cell) =>
						cell === existingCell ? {...existingCell, price: numericValue} : cell
					);
				}
			} else {
				if (numericValue > 0) {
					// Add new entry only if the value is greater than zero
					const newCell = {
						diamondCriteriaId: criteriaId,
						price: numericValue,
						rowIndex,
						cellIndex,
					};
					console.log(
						`Adding new entry with CriteriaId: ${criteriaId}, Price: ${numericValue}`
					);
					return [...prev, newCell];
				}
				// If the numeric value is zero or the new value is empty, do not add a new entry
				return prev;
			}
		});
	};

	const clearFilters = () => {
		setIsLabDiamond(false);
		setIsSideDiamond(true);
	};

	if (loading) {
		return <div className="text-center text-lg font-semibold">Loading...</div>;
	}

	const renderPriceRows = (cellMatrix, colorRange, isCreating) => {
		return cellMatrix.map((row, rowIndex) => (
			<tr key={`row-${rowIndex}`} className="transition duration-200">
				<td className="border p-4 text-center bg-primary">{colorRange[rowIndex]}</td>

				{row.map((cell, cellIndex) => {
					const editedCell = editedCells.find(
						(edited) => edited.rowIndex === rowIndex && edited.cellIndex === cellIndex
					);
					const cellValue = editedCell ? editedCell.price : cell.Price;

					const cellClass = isCreating
						? cell.IsPriceKnown
							? `border p-4 text-center bg-gray col-${cellIndex}`
							: `border p-4 text-center col-${cellIndex}`
						: cell.IsPriceKnown
						? `border p-4 text-center col-${cellIndex}`
						: `border p-4 text-center bg-gray col-${cellIndex}`;

					return (
						<td key={`cell-${cellIndex}`} className={cellClass}>
							{isCreating && !cell.IsPriceKnown ? (
								<input
									type="number"
									onChange={(e) => {
										console.log(
											'Creating price for cell with CriteriaId:',
											cell.CriteriaId
										);
										handleAddPriceCell(
											rowIndex,
											cellIndex,
											cell.CriteriaId,
											e.target.value
										);
									}}
									min={0}
									step={1000}
									className="w-full text-center border rounded"
									placeholder="New Price"
								/>
							) : (
								<div>
									{isEditing && cell.IsPriceKnown ? (
										<div>
											<input
												type="number"
												value={cellValue}
												onChange={(e) =>
													handleEditCell(
														rowIndex,
														cellIndex,
														cell.CriteriaId,
														e.target.value
													)
												}
												min={0}
												step={1000}
												className="w-full text-center border rounded"
											/>
											<input
												type="checkbox"
												checked={selectedPrices.includes(cell.CriteriaId)}
												onChange={() =>
													handleCheckboxChange(cell.CriteriaId)
												}
												className="mr-2"
											/>
										</div>
									) : (
										formatPrice(cell.Price)
									)}
								</div>
							)}
						</td>
					);
				})}
			</tr>
		));
	};

	if (!priceBoard || !priceBoard.PriceTables || priceBoard.PriceTables.length === 0) {
		return (
			<div className="container mx-auto p-6 bg-offWhite rounded-lg shadow-lg">
				<h1 className="text-5xl font-bold mb-6 text-center text-blue-600">
					Side Diamond Price Board
				</h1>
				<div className="flex flex-wrap gap-4 items-center justify-between p-4 ">
					{/* Lab Diamond Checkbox */}
					<div className="flex items-center gap-2">
						<input
							type="checkbox"
							checked={isLabDiamond}
							onChange={handleLabDiamondChange}
							className="rounded focus:ring-blue-500"
						/>
						<label className="text-lg font-semibold">Lab Diamond</label>
					</div>

					{/* Clear Filters Button */}
					<div>
						<button
							onClick={clearFilters}
							className="bg-red-500 text-black px-4 py-2 rounded hover:bg-red-600 hover:text-red-200 transition duration-200 font-semibold"
						>
							Clear Filters
						</button>
					</div>
				</div>
				<div className="flex flex-wrap gap-4 items-center justify-between p-4">
					No price data available.
				</div>
			</div>
		);
	}

	return (
		<div className="container gap-4 mx-auto p-6 bg-white rounded-lg shadow-lg">
			<h1 className="text-5xl font-bold text-center text-blue-600">
				Side Diamond Price Board
			</h1>
			<div className="flex flex-wrap gap-4 items-center justify-between p-4 bg-offWhite rounded-lg shadow-md">
				{/* Lab Diamond Checkbox */}
				<div className="flex items-center gap-2">
					<input
						type="checkbox"
						checked={isLabDiamond}
						onChange={handleLabDiamondChange}
						className="rounded text-blue focus:ring-blue-500 hover:ring-2 transition duration-200"
						aria-label="Lab Diamond"
					/>
					<label className="text-lg font-semibold text-gray-800">Lab Diamond</label>
				</div>

				{/* Clear Filters Button */}
				<div>
					<button
						onClick={clearFilters}
						className="bg-red text-white px-4 py-2 rounded hover:bg-redLight transition duration-200 font-semibold shadow hover:scale-105"
						aria-label="Clear Filters"
					>
						Clear Filters
					</button>
				</div>
			</div>

			<div className="m-4 flex justify-around w-full text-center">
				{isCreating && editedCells.length > 0 && (
					<div className="mt-4 text-center">
						<button
							onClick={savePrices}
							className="border-2 bg-primary text-black px-8 py-3 rounded-lg hover:bg-primaryLight transition duration-200 font-semibold shadow-md hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
							aria-label="Save Changes"
						>
							Save Changes
						</button>
					</div>
				)}
				<div className="flex items-center gap-3">
					<button
						onClick={handleAddPriceToggle}
						className={`border-2 rounded-lg px-8 py-3 transition duration-200 ${
							isCreating
								? 'border-red bg-red text-white hover:bg-redLight'
								: 'border-green bg-green text-black hover:bg-greenLight'
						} font-semibold shadow-md`}
					>
						{isCreating ? 'Cancel Create Price' : 'Create Price'}
					</button>
				</div>
				{isEditing && (
					<div className="m-4 flex justify-around w-full text-center">
						<button
							onClick={handleDelete}
							className="border-2 bg-red text-white px-8 py-3 rounded-lg hover:bg-redLight transition duration-200 font-semibold shadow-md hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
							aria-label="Delete Selected"
						>
							Delete Selected
						</button>
						{editedCells.length > 0 && (
							<button
								onClick={handleSave}
								className="border-2 bg-primary text-black px-8 py-3 rounded-lg hover:bg-primaryLight transition duration-200 font-semibold shadow-md hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
								aria-label="Save Changes"
							>
								Save Changes
							</button>
						)}
					</div>
				)}
				<button
					onClick={handleEditPriceToggle}
					className={`border-2 rounded-lg px-8 py-3 transition duration-200 ${
						isEditing
							? 'border-red bg-red text-white hover:bg-redLight'
							: 'border-green bg-green text-black hover:bg-greenLight'
					} font-semibold shadow-md`}
					aria-label={isEditing ? 'Cancel Editing' : 'Edit Prices'}
				>
					{isEditing ? 'Cancel' : 'Edit Prices'}
				</button>
			</div>

			{/* Confirmation Popup */}
			{showDeleteConfirm && (
				<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
					<div className="bg-white p-6 rounded shadow-lg">
						<h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
						<p>Are you sure you want to delete the selected prices?</p>
						<div className="flex justify-between mt-6">
							<button
								onClick={confirmDelete}
								className="bg-red text-white px-4 py-2 rounded hover:bg-red-600 transition duration-200"
							>
								Delete
							</button>
							<button
								onClick={cancelDelete}
								className="bg-gray text-black px-4 py-2 rounded hover:bg-gray-400 transition duration-200"
							>
								Cancel
							</button>
						</div>
					</div>
				</div>
			)}
			{/* Table Rendering */}
			<div className="overflow-x-auto">
				<table className="min-w-full border border-gray-300 text-sm w-full">
					<thead className="bg-primary">
						<tr>
							<th className="border p-4 text-center text-Black">Color</th>
							{priceBoard.PriceTables[0].ClarityRange &&
								Object.keys(priceBoard.PriceTables[0].ClarityRange).map(
									(clarity) => (
										<th
											key={clarity}
											className="border p-4 text-center text-Black"
										>
											{clarity}
										</th>
									)
								)}
						</tr>
					</thead>
					<tbody>
						{priceBoard.PriceTables.map((table, tableIndex) => (
							<React.Fragment key={`table-${tableIndex}`}>
								<tr>
									<td
										className="border p-4 font-semibold text-center bg-second text-black"
										colSpan={Object.keys(table.ClarityRange).length + 1}
									>
										{table.CaratFrom} - {table.CaratTo} Carat
									</td>
								</tr>
								{renderPriceRows(
									table.CellMatrix,
									Object.keys(table.ColorRange),
									isCreating
								)}
							</React.Fragment>
						))}
					</tbody>
				</table>
			</div>

			{isEditing && (
				<div className="mt-4 text-center">
					{editedCells.length > 0 ? (
						<button
							onClick={handleSave}
							className="border-2 bg-blue-500 text-black px-6 py-2 rounded hover:bg-blue-600 transition duration-200 font-semibold"
						>
							Save Changes
						</button>
					) : (
						<button
							onClick={handleEditPriceToggle} // Replace with your cancel function
							className="border-2 bg-red text-white px-6 py-2 rounded hover:bg-red-600 transition duration-200 font-semibold"
						>
							Cancel
						</button>
					)}
				</div>
			)}
			{isCreating && (
				<div className="mt-4 text-center">
					{editedCells.length > 0 ? (
						<button
							onClick={savePrices}
							className="border-2 bg-blue text-black px-6 py-2 rounded hover:bg-blue-600 transition duration-200 font-semibold"
						>
							Save Changes
						</button>
					) : (
						<button
							onClick={handleAddPriceToggle} // Replace with your cancel function
							className="border-2 bg-red text-white px-6 py-2 rounded hover:bg-red-600 transition duration-200 font-semibold"
						>
							Cancel
						</button>
					)}
				</div>
			)}
		</div>
	);
};

export default SideDiamondPricePage;
