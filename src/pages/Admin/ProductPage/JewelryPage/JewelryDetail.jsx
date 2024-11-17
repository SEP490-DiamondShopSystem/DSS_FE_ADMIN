import React from 'react';

const JewelryDetail = ({ jewelry, onClose }) => {
	if (!jewelry) return null;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
			<div className="bg-white px-6 pb-5 rounded-lg shadow-lg w-full max-w-[50%] space-y-4 overflow-y-auto max-h-[80vh]">
				<div className="w-full flex justify-end">
					<button
						onClick={onClose}
						className="text-gray-600 hover:text-black font-bold text-lg"
					>
						&times;
					</button>
				</div>
				<h2 className="text-2xl font-semibold text-primary mb-4 text-center">{jewelry.SerialCode}</h2>

				<div className="flex space-x-4">
					<img
						src={jewelry.Thumbnail?.MediaPath || '/default-thumbnail.jpg'}
						alt={jewelry.SerialCode}
						className="w-40 h-40 object-cover rounded-md border-2 border-gray-300 shadow-sm"
					/>
					<div className="space-y-2">
						<p>
							<span className="font-semibold text-gray-700">Model:</span>{' '}
							{jewelry.ModelCode || 'N/A'}
						</p>
						<p>
							<span className="font-semibold text-gray-700">Category:</span>{' '}
							{jewelry.Category?.Name}
						</p>
						<p>
							<span className="font-semibold text-gray-700">Weight:</span>{' '}
							{jewelry.Weight} g
						</p>
						<p>
							<span className="font-semibold text-gray-700">Total Price:</span>{' '}
							{jewelry.TotalPrice?.toLocaleString()} VND
						</p>
						<p>
							<span className="font-semibold text-gray-700">Metal:</span>{' '}
							{jewelry.Metal?.Name}
						</p>
						<p>
							<span className="font-semibold text-gray-700">Metal Price:</span>{' '}
							{jewelry.Metal?.Price?.toLocaleString()} VND
						</p>
						<p>
							<span className="font-semibold text-gray-700">Size:</span>{' '}
							{jewelry.Size?.Value} {jewelry.Size?.Unit}
						</p>
						{jewelry?.EngravedFont && (
							<p>
								<span className="font-semibold text-gray-700">Engraved Font:</span>{' '}
								{jewelry.EngravedFont}
							</p>
						)}
						{jewelry?.EngravedText && (
							<p>
								<span className="font-semibold text-gray-700">Engraved Text:</span>{' '}
								{jewelry.EngravedText}
							</p>
						)}
					</div>
				</div>

				{jewelry.Diamonds?.length > 0 && (
					<div className="space-y-2 mt-4">
						<h3 className="text-lg font-semibold text-primary">Diamond Details</h3>
						<ul className="space-y-2">
							{jewelry.Diamonds.map((Diamond, index) => (
								<li
									key={index}
									className="p-4 border border-gray-200 rounded-md bg-gray-50 shadow-sm flex flex-wrap justify-between"
								>
									<p>
										<span className="font-bold text-gray-800">Title:</span>{' '}
										{Diamond.Title}
									</p>
									{Diamond.DiamondShape?.ShapeName && (
										<p>
											<span className="font-semibold text-gray-700">
												Shape:
											</span>{' '}
											{Diamond.DiamondShape.ShapeName}
										</p>
									)}
									<p>
										<span className="font-semibold text-gray-700">Carat:</span>{' '}
										{Diamond.Carat}
									</p>
									<p>
										<span className="font-semibold text-gray-700">Clarity:</span>{' '}
										{Diamond.Clarity}
									</p>
									<p>
										<span className="font-semibold text-gray-700">Cut:</span>{' '}
										{Diamond.Cut}
									</p>
									<p>
										<span className="font-semibold text-gray-700">Color:</span>{' '}
										{Diamond.Color}
									</p>
									<p>
										<span className="font-semibold text-gray-700">Fluorescence:</span>{' '}
										{Diamond.Fluorescence}
									</p>
									{Diamond.DiamondPrice?.Price && (
										<p>
											<span className="font-semibold text-green-600">
												Price:
											</span>{' '}
											${Diamond.DiamondPrice.Price.toLocaleString()}
										</p>
									)}
								</li>
							))}
						</ul>
					</div>
				)}

				{jewelry.review && (
					<div className="space-y-2 mt-4">
						<h3 className="text-lg font-semibold text-primary">Review</h3>
						<p>
							<span className="font-semibold text-gray-700">Rating:</span>{' '}
							{jewelry.Review.StarRating} / 5
						</p>
						<p>{jewelry.review.content}</p>
					</div>
				)}
			</div>
		</div>
	);
};

export default JewelryDetail;
