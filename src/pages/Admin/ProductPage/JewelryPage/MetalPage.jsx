import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllMetals, updateMetalPrice } from '../../../../redux/slices/jewelry/metalSlice';
import { getAllMetalsSelector, LoadingMetalSelector, MetalErrorSelector } from '../../../../redux/selectors';

const MetalPage = () => {
  const dispatch = useDispatch();
  const metals = useSelector(getAllMetalsSelector);
  const loading = useSelector(LoadingMetalSelector);
  const error = useSelector(MetalErrorSelector);
  const [editPrice, setEditPrice] = useState({});

  useEffect(() => {
    dispatch(fetchAllMetals());
  }, [dispatch]);

  const handlePriceChange = (id, newPrice) => {
    setEditPrice((prevState) => ({
      ...prevState,
      [id]: newPrice,
    }));
  };

  const handleSave = (metal) => {
    dispatch(updateMetalPrice({ id: metal.Id, price: parseInt(editPrice[metal.Id], 10) }))
      .unwrap()
      .then(() => {
        setEditPrice((prevState) => ({ ...prevState, [metal.Id]: '' }));
      })
      .catch((err) => console.error('Failed to update price:', err));
  };

  if (loading) return <p>Loading metals...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Manage Metal Prices</h1>
      <table className="w-full border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2 text-left">Name</th>
            <th className="border p-2 text-left">Current Price</th>
            <th className="border p-2 text-left">New Price</th>
            <th className="border p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {metals.map((metal) => (
            <tr key={metal.Id} className="border">
              <td className="border p-2">{metal.Name}</td>
              <td className="border p-2">{metal.Price.toLocaleString()} VND</td>
              <td className="border p-2">
                <input
                  type="number"
				  min={0}
				  
                  value={editPrice[metal.Id] || ''}
                  onChange={(e) => handlePriceChange(metal.Id, e.target.value)}
                  className="p-1 border rounded w-full"
                />
              </td>
              <td className="border p-2">
                <button
                  onClick={() => handleSave(metal)}
                  className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
                  disabled={!editPrice[metal.Id]}
                >
                  Save
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MetalPage;
