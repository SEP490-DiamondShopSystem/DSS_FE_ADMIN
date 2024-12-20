// USER INFO
export const LoadingUserSelector = (state) => state.userLoginSlice.loading;
export const UserInfoSelector = (state) => state.userLoginSlice.userInfo;
export const GetUserDetailSelector = (state) => state.userLoginSlice.userDetail;

//USER
export const getAllUserSelector = (state) => state.userSlice.users;
export const getDetailUserSelector = (state) => state.userSlice.userAccount;
export const getLoadingUserSelector = (state) => state.userSlice.loading;
export const getAllDelivererSelector = (state) => state.userSlice.delivererList;

//ORDER
export const getAllOrderSelector = (state) => state.orderSlice.orders;
export const LoadingOrderSelector = (state) => state.orderSlice.loading;
export const getOrderDetailSelector = (state) => state.orderSlice.orderDetail;
export const getOrderStatusDetailSelector = (state) => state.orderSlice.orderStatusDetail;
export const getPaymentStatusDetailSelector = (state) => state.orderSlice.orderPaymentStatusDetail;
export const getOrderLogsDetailSelector = (state) => state.orderSlice.orderLogs;
export const getOrderLogsSelector = (state) => state.orderSlice.orderLogsDetail;
export const getOrderChildLogSelector = (state) => state.orderSlice.orderChildLogDetail;
export const getOrderTransferSelector = (state) => state.paymentSlice.transfer;
export const getOrderTransferStaffSelector = (state) => state.orderSlice.transfer;
export const getOrderCompletedSelector = (state) => state.paymentSlice.completed;

//LOG
export const getOrderChildLogListSelector = (state) => state.logSlice.orderChildLogList;

//CUSTOMIZE
export const getAllOrderCustomizeSelector = (state) => state.customizeSlice.ordersCustomize;
export const LoadingCustomizeSelector = (state) => state.customizeSlice.loading;
export const getOrderDetailCustomizeSelector = (state) => state.customizeSlice.orderDetailCustomize;
export const getOrderStatusCustomizeDetailSelector = (state) =>
	state.customizeSlice.orderStatusCustomizeDetail;
export const getPaymentStatusCustomizeDetailSelector = (state) =>
	state.customizeSlice.orderPaymentStatusCustomizeDetail;
export const getOrderCustomizeDetailSelector = (state) => state.customizeSlice.orderCustomizeDetail;
export const GetDiamondUnAvailableSelector = (state) => state.customizeSlice.diamondUnAvailable;
export const ErrorCustomizeSelector = (state) => state.customizeSlice.error;

//DELIVERY
export const LoadingDeliverySelector = (state) => state.deliverySlice.loading;
export const getAllDeliverySelector = (state) => state.deliverySlice.deliveryList;

//PROMOTION
export const getAllPromotionSelector = (state) => state.promotionSlice.promotions;
export const LoadingPromotionSelector = (state) => state.promotionSlice.loading;
export const getPromotionDetailSelector = (state) => state.promotionSlice.promotionDetail;

//PROMOTION
export const getAllDiscountSelector = (state) => state.discountSlice.discounts;
export const LoadingDiscountSelector = (state) => state.discountSlice.loading;
export const getDiscountDetailSelector = (state) => state.discountSlice.discountDetail;

//DIAMOND
export const getAllShapeSelector = (state) => state.diamondSlice.diamondShape;
export const getAllDiamondSelector = (state) => state.diamondSlice.diamonds;
export const LoadingDiamondSelector = (state) => state.diamondSlice.loading;
export const GetDiamondFilterSelector = (state) => state.diamondSlice.filterLimits;
export const FetchDataSelector = (state) => state.diamondSlice.addData;

// DIAMOND PRICE
export const getPriceBoardSelector = (state) => state.diamondPriceSlice.priceBoard;
export const getAllPricesSelector = (state) => state.diamondPriceSlice.prices;
export const getAllShapesSelector = (state) => state.diamondPriceSlice.shapes;
export const LoadingDiamondPriceSelector = (state) => state.diamondPriceSlice.loading;
export const DiamondPriceErrorSelector = (state) => state.diamondPriceSlice.error;

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
export const selectJewelryList = (state) => state.jewelrySlice.jewelryList;
export const selectJewelryTotalPage = (state) => state.jewelrySlice.totalPage;
export const selectJewelryCurrentPage = (state) => state.jewelrySlice.currentPage;
export const selectJewelryDetail = (state) => state.jewelrySlice.jewelryDetail;
export const selectJewelryLoading = (state) => state.jewelrySlice.loading;
export const selectJewelryError = (state) => state.jewelrySlice.error;

// JEWELRY MODEL
export const selectJewelryModels = (state) => state.jewelryModel.jewelryModels;
export const selectJewelryModelDetail = (state) => state.jewelryModel.jewelryModelDetail;
export const selectTotalPages = (state) => state.jewelryModel.totalPage;
export const selectCurrentPage = (state) => state.jewelryModel.currentPage;
export const selectJewelryModelStatus = (state) => state.jewelryModel.status;
export const selectJewelryModelError = (state) => state.jewelryModel.error;

//PAYMENT
export const LoadingPaymentSelector = (state) => state.paymentSlice.loading;
export const GetAllPaymentSelector = (state) => state.paymentSlice.payment;

// DISTANCE
export const selectDistances = (state) => state.distanceSlice.distances;
export const GetAllWardSelector = (state) => state.distanceSlice.ward;
export const GetAllDistrictSelector = (state) => state.distanceSlice.district;
export const CalculateLocationSelector = (state) => state.distanceSlice.location;
export const selectLoading = (state) => state.distanceSlice.loading;
export const selectError = (state) => state.distanceSlice.error;
export const getAllJewelryModelsSelector = (state) => state.jewelryModelSlice.models;
export const getJewelryModelDetailSelector = (state) => state.jewelryModelSlice.modelDetail;
export const LoadingJewelryModelSelector = (state) => state.jewelryModelSlice.loading;
export const JewelryModelErrorSelector = (state) => state.jewelryModelSlice.error;
//SIZE
export const getAllSizesSelector = (state) => state.sizeSlice.sizes;
//ENUM
export const getAllEnumsSelector = (state) => state.enumSlice.enums;
//SHAPE
export const getAllDiamondShapesSelector = (state) => state.shapeSlice.shapes;
//DELIVERY FEE
export const getAllDeliveryFeesSelector = (state) => state.deliveryFeeSlice.fees;
export const LoadingDeliveryFeeSelector = (state) => state.deliveryFeeSlice.loading;
export const DeliveryFeelErrorSelector = (state) => state.deliveryFeeSlice.error;
//LOCATION
export const getAllLocationsSelector = (state) => state.locationSlice.locations;
//BLOG
export const selectAllBlogs = (state) => state.blogSlice.blogs;
export const selectBlogDetail = (state) => state.blogSlice.detailBlog;
export const selectBlogLoading = (state) => state.blogSlice.loading;
export const selectBlogError = (state) => state.blogSlice.error;
export const selectBlogCurrentPage = (state) => state.blogSlice.currentPage;
export const selectBlogTotalPage = (state) => state.blogSlice.totalPage;
//FILES
export const selectDiamondFiles = (state) => state.fileSlice.files;
export const selectFileLoading = (state) => state.fileSlice.loading;
export const selectFileError = (state) => state.fileSlice.error;
//ORDER FILES
export const selectOrderFiles = (state) => state.orderFileSlice.files;
export const selectOrderFilesLoading = (state) => state.orderFileSlice.loading;
export const selectOrderFilesError = (state) => state.orderFileSlice.error;
//DASHBOARD
export const GetAllTopSellingDiamondSelector = (state) => state.dashboardSlice.shapeSelling;
export const GetAllDashboardSelector = (state) => state.dashboardSlice.dashboard;
export const LoadingDashboardSelector = (state) => state.dashboardSlice.loading;
export const GetAccountCountSelector = (state) => state.dashboardSlice.accountCustomerCount;
export const GetOrderCompletedCountSelector = (state) => state.dashboardSlice.orderCompletedCount;
export const GetAllSellingJewelrySelector = (state) => state.dashboardSlice.topSellingJewelry;
// CONFIG
export const selectDiamondRule = (state) => state?.config?.diamondRule;
export const selectFrontendDisplayRule = (state) => state?.config?.frontendDisplayRule;
export const selectPromotionRule = (state) => state?.config?.promotionRule;
export const selectModelRule = (state) => state?.config?.modelRule;
export const selectLocationRule = (state) => state?.config?.locationRule;
export const selectOrderRule = (state) => state?.config?.orderRule;
export const selectOrderPaymentRule = (state) => state?.config?.orderPaymentRule;
export const selectShopBankAccountRule = (state) => state?.config?.shopBankAccountRule;
export const selectIsLoading = (state) => state?.config?.isLoading;
export const selectConfigError = (state) => state?.config?.error;
//CRITERIA
export const selectCriterias = (state) => state.criteriaRangeSlice.criterias;
export const selectCriteriaLoading = (state) => state.criteriaRangeSlice.loading;
export const selectCriteriaError = (state) => state.criteriaRangeSlice.error;
