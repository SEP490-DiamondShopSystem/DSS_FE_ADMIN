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
	const [editedPrices, setEditedPrices] = useState({}); // Store edited prices
	const [editedCells, setEditedCells] = useState([]); // Store edited cells with IDs and prices
	const [isEditing, setIsEditing] = useState(false);

	useEffect(() => {
		dispatch(fetchPriceBoard({isFancyShapePrice, isLabDiamond, cut, isSideDiamond}));
	}, [dispatch, isFancyShapePrice, isLabDiamond, cut, isSideDiamond]);

	const handleShapeChange = (event) => {
		setIsFancy(event.target.checked);
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
				// Update the existing entry
				console.log(
					`Cell edited at [Row: ${rowIndex}, Cell: ${cellIndex}] - New Value: ${newValue}, diamondCriteriaId: ${diamondCriteriaId}`
				);
				return prev.map((cell) =>
					cell === existingCell ? {...existingCell, price: numericValue} : cell
				);
			} else {
				// Add a new entry
				const newEntry = {
					diamondCriteriaId, // Use the correct ID here
					price: numericValue,
					rowIndex,
					cellIndex,
				};
				console.log(`Adding new edited cell:`, newEntry);
				return [...prev, newEntry];
			}
		});
	};

	// Function to save changes
	const handleSave = () => {
		// Transform editedCells to match the required format
		const updatedPrices = editedCells.map((cell) => ({
			diamondCriteriaId: cell.diamondCriteriaId, // Correctly reference diamondCriteriaId
			price: Number(cell.price), // Ensure price is a number
		}));

		console.log(
			'Sending updatedDiamondPrices:',
			updatedPrices,
			'isFancyShapePrice:',
			isFancyShapePrice,
			'isLabDiamond:',
			isLabDiamond,
			'isSideDiamond:',
			isSideDiamond
		);

		// Dispatch the action with the updated data
		dispatch(
			updateDiamondPrices({
				updatedDiamondPrices: updatedPrices,
				isFancyShapePrice,
				isLabDiamond,
				isSideDiamond,
			})
		);
	};
	// Function to clear filters
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
							) : (
								formatPrice(cell.Price)
							)}
						</td>
					);
				})}
			</tr>
		));
	};

	if (loading) {
		return <div className="text-center text-lg font-semibold">Loading...</div>;
	}

	if (!priceBoard || !priceBoard.PriceTables || priceBoard.PriceTables.length === 0) {
		return (
			<div className="container mx-auto p-6 bg-offWhite rounded-lg shadow-lg">
				<h1 className="text-5xl font-bold mb-6 text-center text-blue-600">
					Diamond Price Board
				</h1>
				<div className="flex flex-wrap gap-4 items-center justify-between p-4">
					{/* Filters and No data message... */}
					No price data available.
				</div>
			</div>
		);
	}
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
				No price data available.
			</div>
		);
	}
	return (
		<div className="container gap-4 mx-auto p-6 bg-white rounded-lg shadow-lg">
			<h1 className="text-5xl font-bold text-center text-blue-600">Diamond Price Board</h1>
			<div className=" flex justify-end text-center mb-4">
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
				<button
					onClick={() => setIsEditing((prev) => !prev)}
					className={`border-2 border-${isEditing ? 'red' : 'green'}-500 bg-${
						isEditing ? 'red' : 'green'
					}-500 text-black px-6 py-2 rounded-xl hover:bg-${
						isEditing ? 'red' : 'green'
					}-600 hover:border-${
						isEditing ? 'red' : 'green'
					}-600 transition duration-200 font-semibold shadow-md transform hover:scale-105`}
				>
					{isEditing ? 'Cancel Editing' : 'Edit Prices'}
				</button>
			</div>
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

			{/* Save Button */}
			{isEditing && (
				<div className="mt-4 text-center">
					<button
						onClick={handleSave}
						className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition duration-200 font-semibold"
					>
						Save Changes
					</button>
				</div>
			)}
		</div>
	);
};

export default DiamondPricePage;
