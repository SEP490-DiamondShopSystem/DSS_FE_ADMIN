import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  PlusIcon, 
  FolderIcon, 
} from 'lucide-react';
import { 
  fetchAllJewelryModelCategories, 
  createJewelryModelCategory 
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

  const [isFormExpanded, setIsFormExpanded] = useState(false);

  useEffect(() => {
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
        .then(() => {
          message.success('Tạo danh mục trang sức mới thành công!');
          setNewCategory({
            name: '',
            description: '',
            isGeneral: false,
            parentCategoryId: '',
          });
          setIsFormExpanded(false);
        })
        .catch((error) => {
          message.error(error?.data?.title || error?.detail);
        });
    } else {
      message.error('Vui lòng điền đầy đủ các trường bắt buộc');
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
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold text-gray-800 flex items-center">
          <FolderIcon className="mr-4 text-primary" size={40} />
          Loại Trang Sức
        </h1>
        <button 
          onClick={() => setIsFormExpanded(!isFormExpanded)}
          className="bg-primary text-white px-4 py-2 rounded-lg flex items-center hover:bg-primaryDark transition-colors"
        >
          <PlusIcon className="mr-2" size={20} />
          Thêm danh mục
        </button>
      </div>

      {loading && (
        <div className="text-center py-8 text-primary">
          <span className="loading-spinner">Đang tải...</span>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Lỗi: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {isFormExpanded && !loading && (
        <div className="bg-white shadow-md rounded-lg p-6 mb-8 border border-gray-200 transition-all duration-300">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
            <PlusIcon className="mr-3 text-primary" size={24} />
            Tạo danh mục mới
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tên danh mục
              </label>
              <input
                type="text"
                name="name"
                value={newCategory.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Nhập tên danh mục"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Danh mục cha (Tuỳ chọn)
              </label>
              <select
                name="parentCategoryId"
                value={newCategory.parentCategoryId}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Không chọn danh mục cha</option>
                {categories.map((category) => (
                  <option key={category.Id} value={category.Id}>
                    {category.Name}
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mô tả
              </label>
              <textarea
                name="description"
                value={newCategory.description}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                rows="3"
                placeholder="Nhập mô tả danh mục"
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                name="isGeneral"
                checked={newCategory.isGeneral}
                onChange={handleInputChange}
                className="mr-3 text-primary focus:ring-primary"
              />
              <label className="text-gray-700">Danh mục chung</label>
            </div>
            <div>
              <button
                onClick={handleCreateCategory}
                className="w-full bg-primary text-white py-2 rounded-md hover:bg-primaryDark transition-colors"
              >
                Tạo danh mục
              </button>
            </div>
          </div>
        </div>
      )}

      {!loading && categories.length > 0 && (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center">
            <h2 className="text-xl font-semibold text-gray-800">
              Các danh mục hiện có
            </h2>
          </div>
          <ul>
            {categories.map((category) => (
              <li 
                key={category.Id} 
                className="px-6 py-4 border-b border-gray-200 hover:bg-gray-50 transition-colors last:border-b-0"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {category.Name}
                    </h3>
                    <p className="text-gray-600">{category.Description}</p>
                    {category.ParentCategory && (
                      <p className="text-sm text-gray-500">
                        Danh mục cha: {category.ParentCategory.Name}
                      </p>
                    )}
                  </div>
                  {category.isGeneral && (
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                      Chung
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {!loading && categories.length === 0 && (
        <div className="text-center py-8 bg-white shadow-md rounded-lg">
          <p className="text-gray-500">
            Chưa có danh mục nào. Tạo danh mục đầu tiên của bạn!
          </p>
        </div>
      )}
    </div>
  );
};

export default JewelryModelCategoryPage;