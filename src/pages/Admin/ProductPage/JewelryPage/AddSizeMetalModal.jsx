import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button, Modal, Select, InputNumber, message } from 'antd';
import { addSizeMetalForJewelryModel } from '../../../../redux/slices/jewelry/jewelryModelSlice';

const AddSizeMetalModal = ({ 
  isVisible, 
  onClose, 
  model, 
  availableMetals, 
  availableSizes 
}) => {
  const dispatch = useDispatch();
  const [metalSizeSpec, setMetalSizeSpec] = useState({
    metalId: null,
    sizeId: null,
    weight: null
  });

  const handleAddmetalSizeSpec = () => {
    // Validate input
    if (!metalSizeSpec.metalId || !metalSizeSpec.sizeId || !metalSizeSpec.weight) {
      message.error('Please fill in all fields');
      return;
    }

    dispatch(
        addSizeMetalForJewelryModel({
        modelId: model.Id,
        metalSizeSpec: metalSizeSpec
      })
    )
      .unwrap()
      .then(() => {
        message.success('Thêm size kim loại thành công!');
        // Reset form and close modal
        setMetalSizeSpec({
          metalId: null,
          sizeId: null,
          weight: null
        });
        onClose();
      })
      .catch((error) => {
        message.error(
          error?.title || error?.detail || 'Thêm size kim loại thất bại!'
        );
      });
  };

  return (
    <Modal
      title="Thêm Size Kim Loại"
      visible={isVisible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Hủy
        </Button>,
        <Button 
          key="update" 
          type="primary" 
          onClick={handleAddmetalSizeSpec}
          disabled={!metalSizeSpec.metalId || !metalSizeSpec.sizeId || !metalSizeSpec.weight}
        >
          Thêm size kim loại
        </Button>
      ]}
    >
      <div className="space-y-4">
        <div>
          <label>Kim Loại</label>
          <Select
            style={{ width: '100%' }}
            placeholder="Select Metal"
            value={metalSizeSpec.metalId}
            onChange={(value) => setMetalSizeSpec(prev => ({ ...prev, metalId: value }))}
          >
            {availableMetals.map(metal => (
              <Select.Option key={metal.Id} value={metal.Id}>
                {metal.Name}
              </Select.Option>
            ))}
          </Select>
        </div>

        <div>
          <label>Size</label>
          <Select
            style={{ width: '100%' }}
            placeholder="Select Size"
            value={metalSizeSpec.sizeId}
            onChange={(value) => setMetalSizeSpec(prev => ({ ...prev, sizeId: value }))}
          >
            {availableSizes.map(size => (
              <Select.Option key={size.Id} value={size.Id}>
                {size.Value} {size.Unit}
              </Select.Option>
            ))}
          </Select>
        </div>

        <div>
          <label>Trọng lượng (g)</label>
          <InputNumber
            style={{ width: '100%' }}
            placeholder="Enter Weight"
            min={0}
            step={0.1}
            value={metalSizeSpec.weight}
            onChange={(value) => setMetalSizeSpec(prev => ({ ...prev, weight: value }))}
          />
        </div>
      </div>
    </Modal>
  );
};

export default AddSizeMetalModal;