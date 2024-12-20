import React from 'react';

import {Image, Pagination} from 'antd';
import {useSelector} from 'react-redux';
import diamondImg from '../../../../../assets/images/img-diamond.png';
import Loading from '../../../../../components/Loading';
import {LoadingDiamondSelector} from '../../../../../redux/selectors';
import {formatPrice} from '../../../../../utils';

export const DiamondList = ({
	diamond,
	handleDiamondSelectChange,
	currentDiamondId,
	shape,
	handleDiamondOptionDisable,
}) => {
	const loading = useSelector(LoadingDiamondSelector);

	return (
		<div>
			{loading ? (
				<Loading />
			) : (
				<>
					{!Array.isArray(diamond) ||
					(diamond.length === 0 && shape === null && shape === undefined) ? (
						<div className="flex items-center justify-center my-10">
							<p className="text-2xl">Chưa có sản phẩm nào</p>
						</div>
					) : (
						<>
							<div className="text-2xl flex justify-end mt-10">
								<p className="p-2">{diamond?.length} Kết quả</p>
							</div>

							<div className="transition-all duration-300 grid grid-cols-3 gap-10 ">
								{diamond?.map((diamondItem, i) => (
									<div
										key={i}
										className={`shadow-lg bg-white border-2 rounded-lg hover:border-2 hover:border-black cursor-pointer ${
											diamondItem?.Id === currentDiamondId?.Id
												? 'border-black pointer-events-none' // Disable if selected
												: 'border-white'
										}`}
										onClick={() => handleDiamondSelectChange(diamondItem)}
									>
										<div className="">
											<div
												className="flex justify-center mb-5"
												style={{background: '#b8b7b5'}}
											>
												<Image
													src={diamondImg}
													alt={diamondItem.Title}
													preview={false}
												/>
											</div>
											<div className="mx-10 my-5">
												<p>{diamondItem?.Title}</p>
												<div className="flex">
													{diamondItem?.SalePrice ===
													diamondItem?.TruePrice ? (
														<div className="">
															<p>
																{formatPrice(diamondItem.TruePrice)}
															</p>
														</div>
													) : (
														<div className="flex">
															<p
																style={{color: '#707070'}}
																className="line-through"
															>
																{formatPrice(diamondItem.TruePrice)}
															</p>
															<p className="ml-3">
																{formatPrice(diamondItem.SalePrice)}
															</p>
														</div>
													)}
												</div>
											</div>
										</div>
									</div>
								))}
							</div>
						</>
					)}
				</>
			)}
			{/* <Pagination align="end" /> */}
		</div>
	);
};
