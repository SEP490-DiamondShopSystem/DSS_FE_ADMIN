import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
	fetchPriceBoard,
	fetchDiamondPrices,
	createDiamondPrice,
	updateDiamondPrices,
	deleteDiamondPrice,
} from '../../../redux/slices/diamondPriceSlice';
import {getPriceBoardSelector, LoadingDiamondPriceSelector} from '../../../redux/selectors';

// Helper function to format price with periods as thousands separators
const formatPrice = (price) => {
	if (!price) return 'N/A';
	return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' VND';
};

const DiamondPricePage = () => {
	const dispatch = useDispatch();
	const priceBoard = useSelector(getPriceBoardSelector);
	const loading = useSelector(LoadingDiamondPriceSelector);

	const [isFancyShapePrice, setIsFancy] = useState(false);
	const [isLabDiamond, setIsLabDiamond] = useState(false);
	const [cut, setCut] = useState(1);
	const [isSideDiamond, setIsSideDiamond] = useState(false);
	const [editedPrices, setEditedPrices] = useState({});
	const [editedCells, setEditedCells] = useState([]);
	const [isEditing, setIsEditing] = useState(false);
	const [selectedPrices, setSelectedPrices] = useState([]); // Track selected prices

	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false); // State for confirmation popup

	useEffect(() => {
		dispatch(fetchPriceBoard({isFancyShapePrice, isLabDiamond, cut, isSideDiamond}));
	}, [dispatch, isFancyShapePrice, isLabDiamond, cut, isSideDiamond]);

	const handleShapeChange = (event) => {
		setIsFancy(event.target.checked);
	};
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

	const confirmDelete = () => {
		const deleteList = selectedPrices.map((criteriaId) => ({criteriaId}));

		const payload = {
			deleteList,
			isFancyShapePrice,
			isLabDiamond,
			isSideDiamond,
		};

		dispatch(deleteDiamondPrice(payload));
		setSelectedPrices([]); // Clear selection after deletion
		setShowDeleteConfirm(false); // Hide confirmation popup
	};

	const cancelDelete = () => {
		setShowDeleteConfirm(false); // Hide confirmation popup
	};
	const handleLabDiamondChange = (event) => {
		setIsLabDiamond(event.target.checked);
	};

	const handleCutChange = (event) => {
		setCut(Number(event.target.value));
	};

	const handleSideDiamondChange = (event) => {
		setIsSideDiamond(event.target.checked);
	};

	const handleEditCell = (rowIndex, cellIndex, newValue) => {
		const diamondCriteriaId =
			priceBoard.PriceTables[rowIndex].CellMatrix[rowIndex][cellIndex].CriteriaId;
		const numericValue = parseFloat(newValue.replace(/\./g, '').replace(',', '.')) || 0;
		setEditedCells((prev) => {
			const existingCell = prev.find(
				(cell) => cell.rowIndex === rowIndex && cell.cellIndex === cellIndex
			);

			if (existingCell) {
				return prev.map((cell) =>
					cell === existingCell ? {...existingCell, price: numericValue} : cell
				);
			} else {
				const newEntry = {
					diamondCriteriaId,
					price: numericValue,
					rowIndex,
					cellIndex,
				};
				return [...prev, newEntry];
			}
		});
	};

	const handleSave = () => {
		const updatedPrices = editedCells.map((cell) => ({
			diamondCriteriaId: cell.diamondCriteriaId,
			price: Number(cell.price),
		}));

		dispatch(
			updateDiamondPrices({
				updatedDiamondPrices: updatedPrices,
				isFancyShapePrice,
				isLabDiamond,
				isSideDiamond,
			})
		);
		dispatch(fetchPriceBoard({isFancyShapePrice, isLabDiamond, cut, isSideDiamond}));
	};

	const clearFilters = () => {
		setIsFancy(false);
		setIsLabDiamond(false);
		setCut(1);
		setIsSideDiamond(false);
	};

	if (loading) {
		return <div className="text-center text-lg font-semibold">Loading...</div>;
	}

	const renderPriceRows = (cellMatrix, colorRange) => {
		return cellMatrix.map((row, rowIndex) => (
			<tr key={`row-${rowIndex}`} className="hover:bg-gray-100 transition duration-200">
				<td className="border p-4 text-center bg-primary">{colorRange[rowIndex]}</td>
				{row.map((cell, cellIndex) => {
					const editedCell = editedCells.find(
						(edited) => edited.rowIndex === rowIndex && edited.cellIndex === cellIndex
					);
					const cellValue = editedCell ? editedCell.price : cell.Price;

					return (
						<td key={`cell-${cellIndex}`} className="border p-4 text-center">
							{isEditing && cell.IsPriceKnown ? (
								<div>
									<input
										type="number"
										value={cellValue}
										onChange={(e) =>
											handleEditCell(rowIndex, cellIndex, e.target.value)
										}
										min={1000}
										step={1000}
										className="w-full text-center border rounded"
									/>
									<input
										type="checkbox"
										checked={selectedPrices.includes(cell.CriteriaId)}
										onChange={() => handleCheckboxChange(cell.CriteriaId)}
										className="mr-2"
									/>
								</div>
							) : (
								formatPrice(cell.Price)
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
					Diamond Price Board
				</h1>
				<div className="flex flex-wrap gap-4 items-center justify-between p-4 ">
					{/* Shape Selection */}
					<div className="flex sm:flex-row items-center gap-2">
						<input
							type="checkbox"
							checked={isFancyShapePrice}
							onChange={handleShapeChange}
							className="rounded focus:ring-blue-500"
						/>
						<label className="text-lg font-semibold">Fancy Shapes</label>
					</div>

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

					{/* Cut Selection */}
					<div className="flex sm:flex-row items-center gap-2">
						<label htmlFor="cutSelect" className="text-lg font-semibold">
							Cut:
						</label>
						<select
							id="cutSelect"
							value={cut}
							onChange={handleCutChange}
							className="border border-gray-300 p-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
						>
							<option value="1">Good</option>
							<option value="2">Very Good</option>
							<option value="3">Excellent</option>
						</select>
					</div>

					{/* Side Diamond Checkbox */}
					<div className="flex items-center gap-2">
						<input
							type="checkbox"
							checked={isSideDiamond}
							onChange={handleSideDiamondChange}
							className="rounded focus:ring-blue-500"
						/>
						<label className="text-lg font-semibold">Side Diamond</label>
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
			<h1 className="text-5xl font-bold text-center text-blue-600">Diamond Price Board</h1>
			<div className="flex flex-wrap gap-4 items-center justify-between p-4 bg-offWhite rounded-lg shadow-md">
				{/* Shape Selection */}
				<div className="flex sm:flex-row items-center gap-2">
					<input
						type="checkbox"
						checked={isFancyShapePrice}
						onChange={handleShapeChange}
						className="rounded text-blue focus:ring-blue-500 hover:ring-2 transition duration-200"
						aria-label="Fancy Shapes"
					/>
					<label className="text-lg font-semibold text-gray-800">Fancy Shapes</label>
				</div>

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

				{/* Cut Selection */}
				<div className="flex sm:flex-row items-center gap-2">
					<label htmlFor="cutSelect" className="text-lg font-semibold text-gray-800">
						Cut:
					</label>
					<select
						id="cutSelect"
						value={cut}
						onChange={handleCutChange}
						className="border border-gray-300 p-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 bg-white text-gray-700"
						aria-label="Select Cut"
					>
						<option value="1">Good</option>
						<option value="2">Very Good</option>
						<option value="3">Excellent</option>
					</select>
				</div>

				{/* Side Diamond Checkbox */}
				<div className="flex items-center gap-2">
					<input
						type="checkbox"
						checked={isSideDiamond}
						onChange={handleSideDiamondChange}
						className="rounded text-blue focus:ring-blue-500 hover:ring-2 transition duration-200"
						aria-label="Side Diamond"
					/>
					<label className="text-lg font-semibold text-gray-800">Side Diamond</label>
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

			<div className="flex w-full justify-end text-center my-4">
				{isEditing && (
					<div className="m-4 flex justify-around w-full text-center">
						<button
							onClick={handleDelete}
							className="border-2 bg-red text-white px-6 py-2 rounded hover:bg-redLight transition duration-200 font-semibold shadow hover:scale-105"
							aria-label="Delete Selected"
						>
							Delete Selected
						</button>
						<button
							onClick={handleSave}
							className="border-2 bg-primary text-black px-6 py-2 rounded hover:bg-primaryLight transition duration-200 font-semibold shadow hover:scale-105"
							aria-label="Save Changes"
						>
							Save Changes
						</button>
					</div>
				)}
				<button
					onClick={() => setIsEditing((prev) => !prev)}
					className={`border-2 border-${isEditing ? 'red' : 'green'} bg-${
						isEditing ? 'red' : 'green'
					} text-white px-6 py-2 rounded-xl hover:bg-${
						isEditing ? 'redLight' : 'greenLight'
					} transition duration-200 font-semibold shadow-md transform hover:scale-105`}
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
								{renderPriceRows(table.CellMatrix, Object.keys(table.ColorRange))}
							</React.Fragment>
						))}
					</tbody>
				</table>
			</div>

			{isEditing && (
				<div className="mt-4 text-center">
					<button
						onClick={handleSave}
						className="border-2 bg-blue-500 text-black px-6 py-2 rounded hover:bg-blue-600 transition duration-200 font-semibold"
					>
						Save Changes
					</button>
				</div>
			)}
		</div>
	);
};

export default DiamondPricePage;
