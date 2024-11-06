import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllJewelryModelCategories, createJewelryModelCategory } from '../../../../redux/slices/jewelry/jewelryModelCategorySlice';
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
    // Fetch all categories on component mount
    dispatch(fetchAllJewelryModelCategories());
  }, [dispatch]);

  const handleCreateCategory = () => {
    if (newCategory.name.trim() && newCategory.description.trim()) {
      const categoryData = {
        name: newCategory.name,
        description: newCategory.description,
        isGeneral: newCategory.isGeneral,
        // Only include parentCategoryId if it's not empty
        ...(newCategory.parentCategoryId && { parentCategoryId: newCategory.parentCategoryId }),
      };
  
      dispatch(createJewelryModelCategory(categoryData));
      setNewCategory({
        name: '',
        description: '',
        isGeneral: false,
        parentCategoryId: '',
      }); // Reset form after submit
    } else {
      alert('Please fill in the name and description');
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
      <h1 className="text-3xl font-semibold text-primary mb-6">Jewelry Model Categories</h1>

      {/* Loading and Error Handling */}
      {loading ? (
        <div className="text-xl text-blue-500">Loading categories...</div>
      ) : error ? (
        <div className="text-xl text-red-500">Error: {error}</div>
      ) : (
        <div>
          {/* Categories List */}
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-primary">Categories</h2>
            <ul>
              {categories.map((category) => (
                <li key={category.Id} className="py-3 px-4 bg-white rounded-lg shadow-md mb-4 border border-lightGray">
                  <strong className="text-xl text-black">{category.Name}</strong> - <span className="text-gray-600">{category.Description}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Create New Category Form */}
          <div className="border-t pt-6 mt-8">
            <h2 className="text-2xl font-semibold text-primary">Create New Category</h2>
            <div className="space-y-6 bg-white p-6 rounded-lg shadow-md mt-4 border border-lightGray">
              <div>
                <label className="block text-sm font-medium text-gray-700">Category Name</label>
                <input
                  type="text"
                  name="name"
                  value={newCategory.name}
                  onChange={handleInputChange}
                  className="mt-2 block w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Category name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  name="description"
                  value={newCategory.description}
                  onChange={handleInputChange}
                  className="mt-2 block w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Category description"
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
                <label className="text-gray-700">Is General Category</label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Parent Category ID</label>
                <input
                  type="text"
                  name="parentCategoryId"
                  value={newCategory.parentCategoryId}
                  onChange={handleInputChange}
                  className="mt-2 block w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Parent Category ID"
                />
              </div>
              <div className="w-full mt-5">
                <button
                  onClick={handleCreateCategory}
                  className="w-full px-6 py-3 bg-primary text-white rounded-md hover:bg-primaryDark focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  Create Category
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
