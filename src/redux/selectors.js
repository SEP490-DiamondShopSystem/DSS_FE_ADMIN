// USER INFO
export const LoadingUserSelector = (state) => state.userLoginSlice.loading;
export const UserInfoSelector = (state) => state.userLoginSlice.userInfo;
export const GetUserDetailSelector = (state) => state.userLoginSlice.userDetail;

//USER
export const getAllUserSelector = (state) => state.userSlice.users;
export const getLoadingUserSelector = (state) => state.userSlice.loading;

//ORDER
export const getAllOrderSelector = (state) => state.orderSlice.orders;
export const LoadingOrderSelector = (state) => state.orderSlice.loading;
export const getOrderDetailSelector = (state) => state.orderSlice.orderDetail;

//DELIVERY
export const LoadingDeliverySelector = (state) => state.deliverySlice.loading;
export const getAllDeliverySelector = (state) => state.deliverySlice.deliveryList;
