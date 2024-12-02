import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
	fetchPriceBoard,
	createDiamondPrice,
	updateDiamondPrices,
	deleteDiamondPrice,
} from '../../../../redux/slices/diamondPriceSlice';
import {message, Alert} from 'antd';
import {getPriceBoardSelector, LoadingDiamondPriceSelector} from '../../../../redux/selectors';

const formatPrice = (price) => {
	if (price === null || price === undefined) return 'N/A';
	if (price < 0) return 'Not Set';
	return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' VND';
};

const MainDiamondPricePage = () => {
	const dispatch = useDispatch();
	const {priceBoard, loading} = useSelector((state) => ({
		priceBoard: getPriceBoardSelector(state),
		loading: LoadingDiamondPriceSelector(state),
	}));
	const [filters, setFilters] = useState({
		shapeId: 1,
		isLabDiamond: false,
		cut: 1,
	});

	const handleFilterChange = (filterName) => (event) => {
		setFilters((prev) => ({
			...prev,
			[filterName]: event.target.checked || Number(event.target.value),
		}));
	};

	const [shapeId, setShapeId] = useState(1);
	const [isLabDiamond, setIsLabDiamond] = useState(false);
	const [cut, setCut] = useState(1);
	const [editedCells, setEditedCells] = useState([]);
	const [isEditing, setIsEditing] = useState(false);
	const [selectedPrices, setSelectedPrices] = useState([]);
	const [isCreating, setIsCreating] = useState(false);
	const [listPrices, setListPrices] = useState([]);
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

	useEffect(() => {
		dispatch(fetchPriceBoard({shapeId, isLabDiamond, cut, isSideDiamond: false}));
	}, [dispatch, shapeId, isLabDiamond, cut]);

	const handleShapeChange = (event) => {
		setShapeId(Number(event.target.value));
	};

	const handleDelete = () => {
		if (selectedPrices.length === 0) return;
		setShowDeleteConfirm(true); // Show confirmation popup
	};
	const handleCheckboxChange = (diamondPriceId) => {
		setSelectedPrices(
			(prev) =>
				prev.includes()
					? prev.filter((id) => id !== diamondPriceId) // Uncheck
					: [...prev, diamondPriceId] // Check
		);
	};
	const confirmDelete = async () => {
		const priceIds = selectedPrices;
		const payload = {
			priceIds,
			shapeId,
			isLabDiamond,
			isSideDiamond: false,
		};

		await dispatch(deleteDiamondPrice(payload)); // Wait for delete to finish
		setSelectedPrices([]);
		setShowDeleteConfirm(false);
		await dispatch(fetchPriceBoard({shapeId, isLabDiamond, cut, isSideDiamond: false})); // Fetch updated board
	};

	const savePrices = async () => {
		const listPrices = editedCells.map((cell) => ({
			DiamondCriteriaId: priceBoard.PriceTables[0].CriteriaId,
			price: Number(cell.price),
			cut: priceBoard.MainCut,
			color: Object.keys(priceBoard.PriceTables[0].ColorRange)[cell.rowIndex],
			clarity: Object.keys(priceBoard.PriceTables[0].ClarityRange)[cell.cellIndex],
		}));

		if (listPrices.length === 0) return;

		await dispatch(
			createDiamondPrice({listPrices, shapeId, isLabDiamond, isSideDiamond: false})
		)
			.unwrap()
			.then(() => {
				message.success('Thêm giá kim cương thành công!');
			})
			.catch((error) => {
				message.error(error?.data?.title || error?.detail);
			});

		setEditedCells([]);
		setIsCreating(false);

		await dispatch(fetchPriceBoard({shapeId, isLabDiamond, cut, isSideDiamond: false}));
	};

	const handleSave = async () => {
		// Check if any edited price is 0 or negative
		const invalidPrices = editedCells.filter((cell) => cell.price <= 0);

		if (invalidPrices.length > 0) {
			message.error('Giá kim cương phải lớn hơn 0. Vui lòng kiểm tra lại các giá trị.');
			return;
		}

		const updatedPrices = editedCells.map((cell) => ({
			diamondPriceId: cell.diamondPriceId,
			price: Number(cell.price),
		}));

		await dispatch(
			updateDiamondPrices({
				updatedDiamondPrices: updatedPrices,
				shapeId,
				isLabDiamond,
				isSideDiamond: false,
			})
		)
			.unwrap()
			.then(() => {
				message.success('Cập nhật giá kim cương thành công!');
			})
			.catch((error) => {
				message.error(error?.data?.title || error?.detail);
			});

		setEditedCells([]);
		setIsEditing(false);
		await dispatch(fetchPriceBoard({shapeId, isLabDiamond, cut, isSideDiamond: false}));
	};

	// Render missing ranges alert
	const renderMissingRangesAlert = () => {
		// Check if there are missing ranges
		const missingRanges = priceBoard.MissingRange || [];
		const uncoveredCaratRanges = priceBoard.UncoveredTableCaratRange || [];

		// Combine and deduplicate missing ranges
		const allMissingRanges = [
			...missingRanges.map((range) => `${range.Item1} - ${range.Item2} Carat`),
		];

		if (allMissingRanges.length === 0) return null;

		return (
			<Alert
				message="Các khoảng Carat chưa có sẵn"
				description={
					<ul className="list-disc pl-5">
						{allMissingRanges.map((range, index) => (
							<li key={index}>{range}</li>
						))}
					</ul>
				}
				type="warning"
				showIcon
				className="mb-4"
			/>
		);
	};
	const cancelDelete = () => {
		setShowDeleteConfirm(false);
	};
	const handleLabDiamondChange = (event) => {
		setIsLabDiamond(event.target.checked);
	};

	const handleCutChange = (event) => {
		setCut(Number(event.target.value));
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
	const handleEditCell = (rowIndex, cellIndex, diamondPriceId, newValue) => {
		const numericValue = parseFloat(newValue.replace(/\./g, '').replace(',', '.')) || 0;
		console.log(`Received diamondPriceId: ${diamondPriceId}`);

		setEditedCells((prev) => {
			const existingCell = prev.find(
				(cell) => cell.rowIndex === rowIndex && cell.cellIndex === cellIndex
			);

			if (existingCell) {
				if (newValue.trim() === '') {
					console.log(
						`Removing entry for price Id: ${diamondPriceId} due to empty value`
					);
					return prev.filter((cell) => cell !== existingCell);
				} else {
					console.log(
						`Updating existing entry with diamondPriceId: ${diamondPriceId}, Price: ${numericValue}`
					);
					return prev.map((cell) =>
						cell === existingCell ? {...existingCell, price: numericValue} : cell
					);
				}
			} else {
				const newEntry = {
					diamondPriceId: diamondPriceId,
					price: numericValue,
					rowIndex,
					cellIndex,
				};
				console.log(
					`Adding new entry with Price Id: ${diamondPriceId}, Price: ${numericValue}`
				);
				return [...prev, newEntry];
			}
		});
	};

	const handleAddPriceCell = (rowIndex, cellIndex, diamondPriceId, newValue) => {
		console.log(`Received DiamondPriceId: ${diamondPriceId}, New Value: ${newValue}`);
		const numericValue = parseFloat(newValue.replace(/\./g, '').replace(',', '.')) || 0;

		setEditedCells((prev) => {
			const existingCell = prev.find(
				(cell) => cell.rowIndex === rowIndex && cell.cellIndex === cellIndex
			);

			if (existingCell) {
				if (newValue.trim() === '' || numericValue === 0) {
					// Remove the existing cell entry if the new value is empty
					console.log(
						`Removing entry for DiamondPriceId: ${diamondPriceId} due to empty value`
					);
					return prev.filter((cell) => cell !== existingCell);
				} else {
					// Update the existing entry
					console.log(
						`Updating existing entry with DiamondPriceId: ${diamondPriceId}, New Price: ${numericValue}`
					);
					return prev.map((cell) =>
						cell === existingCell ? {...existingCell, price: numericValue} : cell
					);
				}
			} else {
				if (numericValue > 0) {
					// Add new entry only if the value is greater than zero
					const newCell = {
						diamondPriceId: diamondPriceId,
						price: numericValue,
						rowIndex,
						cellIndex,
					};
					console.log(
						`Adding new entry with DiamondPriceId: ${diamondPriceId}, Price: ${numericValue}`
					);
					return [...prev, newCell];
				}
				// If the numeric value is zero or the new value is empty, do not add a new entry
				return prev;
			}
		});
	};

	const clearFilters = () => {
		setShapeId(1);
		setIsLabDiamond(false);
		setCut(1);
	};

	if (loading) {
		return <div className="text-center text-lg font-semibold">Đang Tải...</div>;
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
											cell.DiamondPriceId
										);
										handleAddPriceCell(
											rowIndex,
											cellIndex,
											cell.DiamondPriceId,
											e.target.value
										);
									}}
									min={-1}
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
														cell.DiamondPriceId,
														e.target.value
													)
												}
												min={-1}
												step={1000}
												className="w-full text-center border rounded"
											/>
											<input
												type="checkbox"
												checked={selectedPrices.includes(
													cell.DiamondPriceId
												)}
												onChange={() =>
													handleCheckboxChange(cell.DiamondPriceId)
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
				<h1 className="text-5xl font-bold text-center text-blue-600">
					Bảng Giá Kim Cương Chính{' '}
				</h1>
				<div className="flex flex-wrap gap-4 items-center justify-between p-4 bg-offWhite rounded-lg shadow-md">
					{/* Shape Selection */}
					<div className="flex sm:flex-row items-center gap-2">
						<label htmlFor="cutSelect" className="text-lg font-semibold text-gray-800">
							Hình Dáng:
						</label>
						<select
							id="cutSelect"
							value={shapeId}
							onChange={handleShapeChange}
							className="border border-gray-300 p-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 bg-white text-gray-700"
							aria-label="Select Shape"
						>
							<option value="1">Round</option>
							<option value="2">Princess</option>
							<option value="3">Cushion</option>
							<option value="4">Emerald</option>
							<option value="5">Oval</option>
							<option value="6">Radiant</option>
							<option value="7">Asscher</option>
							<option value="8">Marquise</option>
							<option value="9">Heart</option>
							<option value="10">Pear</option>
						</select>
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
						<label className="text-lg font-semibold text-gray-800">
							Kim Cương Nhân Tạo
						</label>
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
					{/* )} */}

					{/* Clear Filters Button */}
					<div>
						<button
							onClick={clearFilters}
							className="bg-red text-white px-4 py-2 rounded hover:bg-redLight transition duration-200 font-semibold shadow hover:scale-105"
							aria-label="Clear Filters"
						>
							Xóa bộ lọc
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
				Bảng Giá Kim Cương Chính{' '}
			</h1>
			<div className="flex flex-wrap gap-4 items-center justify-between p-4 bg-offWhite rounded-lg shadow-md">
				{/* Shape Selection */}
				<div className="flex sm:flex-row items-center gap-2">
					<label htmlFor="cutSelect" className="text-lg font-semibold text-gray-800">
						Hình Dáng:
					</label>
					<select
						id="cutSelect"
						value={shapeId}
						onChange={handleShapeChange}
						className="border border-gray-300 p-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 bg-white text-gray-700"
						aria-label="Select Shape"
					>
						<option value="1">Round</option>
						<option value="2">Princess</option>
						<option value="3">Cushion</option>
						<option value="4">Emerald</option>
						<option value="5">Oval</option>
						<option value="6">Radiant</option>
						<option value="7">Asscher</option>
						<option value="8">Marquise</option>
						<option value="9">Heart</option>
						<option value="10">Pear</option>
					</select>
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
					<label className="text-lg font-semibold text-gray-800">
						Kim Cương Nhân Tạo
					</label>
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
				{/* )} */}

				{/* Clear Filters Button */}
				<div>
					<button
						onClick={clearFilters}
						className="bg-red text-white px-4 py-2 rounded hover:bg-redLight transition duration-200 font-semibold shadow hover:scale-105"
						aria-label="Clear Filters"
					>
						Xóa bộ lọc
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
							Lưu
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
						{isCreating ? 'Hủy' : 'Thêm Giá Mới'}
					</button>
				</div>
				{isEditing && (
					<div className="m-4 flex justify-around w-full text-center">
						<button
							onClick={handleDelete}
							className="border-2 bg-red text-white px-8 py-3 rounded-lg hover:bg-redLight transition duration-200 font-semibold shadow-md hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
							aria-label="Delete Selected"
						>
							Xóa Những Ô Được Chọn
						</button>
						{editedCells.length > 0 && (
							<button
								onClick={handleSave}
								className="border-2 bg-primary text-black px-8 py-3 rounded-lg hover:bg-primaryLight transition duration-200 font-semibold shadow-md hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
								aria-label="Save Changes"
							>
								Lưu
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
					aria-label={isEditing ? 'Hủy' : 'Cập Nhật Giá'}
				>
					{isEditing ? 'Hủy' : 'Cập Nhật Giá'}
				</button>
			</div>

			{/* Confirmation Popup */}
			{showDeleteConfirm && (
				<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
					<div className="bg-white p-6 rounded shadow-lg">
						<h2 className="text-xl font-semibold mb-4">Xác Nhận Xóa Giá Kim Cương</h2>
						<p>Bạn có muốn xóa giá của những ô này không?</p>
						<div className="flex justify-between mt-6">
							<button
								onClick={confirmDelete}
								className="bg-red text-white px-4 py-2 rounded hover:bg-red-600 transition duration-200"
							>
								Xóa
							</button>
							<button
								onClick={cancelDelete}
								className="bg-gray text-black px-4 py-2 rounded hover:bg-gray-400 transition duration-200"
							>
								Hủy
							</button>
						</div>
					</div>
				</div>
			)}
			{/* Table Rendering */}
			{renderMissingRangesAlert()}
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
							Lưu{' '}
						</button>
					) : (
						<button
							onClick={handleEditPriceToggle} // Replace with your cancel function
							className="border-2 bg-red text-white px-6 py-2 rounded hover:bg-red-600 transition duration-200 font-semibold"
						>
							Hủy
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
							Lưu
						</button>
					) : (
						<button
							onClick={handleAddPriceToggle} // Replace with your cancel function
							className="border-2 bg-red text-white px-6 py-2 rounded hover:bg-red-600 transition duration-200 font-semibold"
						>
							Hủy
						</button>
					)}
				</div>
			)}
		</div>
	);
};

export default MainDiamondPricePage;
