// USER INFO
export const LoadingUserSelector = (state) => state.userLoginSlice.loading;
export const UserInfoSelector = (state) => state.userLoginSlice.userInfo;
export const GetUserDetailSelector = (state) => state.userLoginSlice.userDetail;

//USER
export const getAllUserSelector = (state) => state.userSlice.users;
export const getDetailUserSelector = (state) => state.userSlice.userAccount;
export const getLoadingUserSelector = (state) => state.userSlice.loading;

//ORDER
export const getAllOrderSelector = (state) => state.orderSlice.orders;
export const LoadingOrderSelector = (state) => state.orderSlice.loading;
export const getOrderDetailSelector = (state) => state.orderSlice.orderDetail;
export const getOrderStatusDetailSelector = (state) => state.orderSlice.orderStatusDetail;
export const getPaymentStatusDetailSelector = (state) => state.orderSlice.orderPaymentStatusDetail;
export const getAllOrderCustomizeSelector = (state) => state.orderSlice.ordersCustomize;
export const getOrderDetailCustomizeSelector = (state) => state.orderSlice.orderDetailCustomize;

//DELIVERY
export const LoadingDeliverySelector = (state) => state.deliverySlice.loading;
export const getAllDeliverySelector = (state) => state.deliverySlice.deliveryList;

//PROMOTION
export const getAllPromotionSelector = (state) => state.promotionSlice.promotions;
export const LoadingPromotionSelector = (state) => state.promotionSlice.loading;
export const getPromotionDetailSelector = (state) => state.promotionSlice.promotionDetail;

//DIAMOND
export const getAllShapeSelector = (state) => state.diamondSlice.diamondShape;
export const getAllDiamondSelector = (state) => state.diamondSlice.diamonds;
export const LoadingDiamondSelector = (state) => state.diamondSlice.loading;

// DIAMOND PRICE
export const getPriceBoardSelector = (state) => state.diamondPriceSlice.priceBoard;
export const getAllPricesSelector = (state) => state.diamondPriceSlice.prices;
export const getAllShapesSelector = (state) => state.diamondPriceSlice.shapes;
export const LoadingDiamondPriceSelector = (state) => state.diamondPriceSlice.loading;
export const DiamondPriceErrorSelector = (state) => state.diamondPriceSlice.error;
<<<<<<< Updated upstream
// METAL
export const getAllMetalsSelector = (state) => state.metalSlice.metals;
export const LoadingMetalSelector = (state) => state.metalSlice.loading;
export const MetalErrorSelector = (state) => state.metalSlice.error;

// JEWELRY MODEL CATEGORY
export const getAllJewelryModelCategoriesSelector = (state) =>
	state.jewelryModelCategorySlice.categories;
export const LoadingJewelryModelCategorySelector = (state) =>
	state.jewelryModelCategorySlice.loading;
export const JewelryModelCategoryErrorSelector = (state) => state.jewelryModelCategorySlice.error;
// JEWELRY
export const getAllJewelrySelector = (state) => state.jewelrySlice.jewelryItems;
export const getTotalPageSelector = (state) => state.jewelrySlice.totalPage;
export const getCurrentPageSelector = (state) => state.jewelrySlice.currentPage;
export const getJewelryStatusSelector = (state) => state.jewelrySlice.status;
export const getJewelryErrorSelector = (state) => state.jewelrySlice.error;
export const getJewelryDetailSelector = (state) => state.jewelrySlice.jewelryDetail;
export const getCreateJewelryStatusSelector = (state) => state.jewelrySlice.createStatus;
export const getCreateJewelryErrorSelector = (state) => state.jewelrySlice.createError;
// JEWELRY MODEL
export const selectJewelryModels = (state) => state.jewelryModel.jewelryModels;
export const selectJewelryModelDetail = (state) => state.jewelryModel.jewelryModelDetail;
export const selectTotalPages = (state) => state.jewelryModel.totalPage;
export const selectCurrentPage = (state) => state.jewelryModel.currentPage;
export const selectJewelryModelStatus = (state) => state.jewelryModel.status;
export const selectJewelryModelError = (state) => state.jewelryModel.error;
=======
>>>>>>> Stashed changes
