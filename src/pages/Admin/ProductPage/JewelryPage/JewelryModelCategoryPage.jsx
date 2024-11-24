import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchAllJewelryModelCategories,
  createJewelryModelCategory,
} from '../../../../redux/slices/jewelry/jewelryModelCategorySlice';
import {
  getAllJewelryModelCategoriesSelector,
  LoadingJewelryModelCategorySelector,
  JewelryModelCategoryErrorSelector,
} from '../../../../redux/selectors';

const JewelryModelCategoryPage = () => {
  const dispatch = useDispatch();
  const categories = useSelector(getAllJewelryModelCategoriesSelector);
  const loading = useSelector(LoadingJewelryModelCategorySelector);
  const error = useSelector(JewelryModelCategoryErrorSelector);

  const [newCategory, setNewCategory] = useState({
    name: '',
    description: '',
    isGeneral: false,
    parentCategoryId: '',
  });

  useEffect(() => {
    // Lấy tất cả danh mục khi component được tải
    dispatch(fetchAllJewelryModelCategories());
  }, [dispatch]);

  const handleCreateCategory = () => {
    if (newCategory.name.trim() && newCategory.description.trim()) {
      const categoryData = {
        name: newCategory.name,
        description: newCategory.description,
        isGeneral: newCategory.isGeneral,
        ...(newCategory.parentCategoryId && {
          parentCategoryId: newCategory.parentCategoryId,
        }),
      };

      dispatch(createJewelryModelCategory(categoryData))
        .unwrap()
        .then((res) => {
          setNewCategory({
            name: '',
            description: '',
            isGeneral: false,
            parentCategoryId: '',
          });
        })
        .catch((error) => {
          message.error(error?.data?.title || error?.detail);
        });
    } else {
      message.error(error?.data?.title || error?.detail);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewCategory((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  return (
    <div className="p-6 bg-offWhite min-h-screen">
      <h1 className="text-3xl font-semibold text-primary mb-6">
        Danh Mục Mẫu Trang Sức
      </h1>

      {/* Xử lý trạng thái đang tải và lỗi */}
      {loading ? (
        <div className="text-xl text-blue-500">Đang tải danh mục...</div>
      ) : error ? (
        <div className="text-xl text-red-500">Lỗi: {error}</div>
      ) : (
        <div className="mt-6">
          {/* Danh sách danh mục */}
          <div className="my-6">
            {/* <h2 className="text-2xl font-semibold text-primary">Danh Mục</h2> */}
            <ul>
              {categories.map((category) => (
                <li
                  key={category.Id}
                  className="py-3 px-4 bg-white rounded-lg shadow-md mb-4 border border-lightGray"
                >
                  <strong className="text-xl text-black">{category.Name}</strong>{' '}
                  - <span className="text-gray-600">{category.Description}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Form tạo danh mục mới */}
          <div className="border-t pt-6 mt-8">
            <h2 className="text-2xl font-semibold text-primary">Tạo Danh Mục Mới</h2>
            <div className="space-y-6 bg-white p-6 rounded-lg shadow-md mt-4 border border-lightGray">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Tên Danh Mục
                </label>
                <input
                  type="text"
                  name="name"
                  value={newCategory.name}
                  onChange={handleInputChange}
                  className="mt-2 block w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Tên danh mục"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Mô Tả
                </label>
                <textarea
                  name="description"
                  value={newCategory.description}
                  onChange={handleInputChange}
                  className="mt-2 block w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Mô tả danh mục"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isGeneral"
                  checked={newCategory.isGeneral}
                  onChange={handleInputChange}
                  className="mr-3"
                />
                <label className="text-gray-700">Danh Mục Chung</label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  ID Danh Mục Cha
                </label>
                <input
                  type="text"
                  name="parentCategoryId"
                  value={newCategory.parentCategoryId}
                  onChange={handleInputChange}
                  className="mt-2 block w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="ID danh mục cha"
                />
              </div>
              <div className="w-full mt-5">
                <button
                  onClick={handleCreateCategory}
                  className="w-full px-6 py-3 bg-primary text-white rounded-md hover:bg-primaryDark focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  Tạo Danh Mục
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JewelryModelCategoryPage;
