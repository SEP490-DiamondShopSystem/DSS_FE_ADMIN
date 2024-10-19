// USER INFO
export const LoadingUserSelector = (state) => state.userLoginSlice.loading;
export const UserInfoSelector = (state) => state.userLoginSlice.userInfo;
export const GetUserDetailSelector = (state) => state.userLoginSlice.userDetail;

//
export const getUserSelector = (state) => state.userSlice.userInfo;
export const getAllUserSelector = (state) => state.userSlice.users;
export const getLoadingUserSelector = (state) => state.userSlice.loading;
