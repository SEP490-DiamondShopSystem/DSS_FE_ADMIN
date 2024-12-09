import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button, Modal, Select, InputNumber, message } from 'antd';
import { updateSizeMetalForJewelryModel } from '../../../../redux/slices/jewelry/jewelryModelSlice';

const UpdateSizeMetalModal = ({ 
  isVisible, 
  onClose, 
  model, 
  availableMetals, 
  availableSizes 
}) => {
  const dispatch = useDispatch();
  const [sizeMetal, setSizeMetal] = useState({
    metalId: null,
    sizeId: null,
    weight: null
  });

  const handleUpdateSizeMetal = () => {
    // Validate input
    if (!sizeMetal.metalId || !sizeMetal.sizeId || !sizeMetal.weight) {
      message.error('Please fill in all fields');
      return;
    }

    dispatch(
      updateSizeMetalForJewelryModel({
        modelId: model.Id,
        sizeMetals: [sizeMetal]
      })
    )
      .unwrap()
      .then(() => {
        message.success('Size Metal updated successfully');
        // Reset form and close modal
        setSizeMetal({
          metalId: null,
          sizeId: null,
          weight: null
        });
        onClose();
      })
      .catch((error) => {
        message.error(
          error?.title || error?.detail || 'Failed to update size metal'
        );
      });
  };

  return (
    <Modal
      title="Update Size Metal"
      visible={isVisible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button 
          key="update" 
          type="primary" 
          onClick={handleUpdateSizeMetal}
          disabled={!sizeMetal.metalId || !sizeMetal.sizeId || !sizeMetal.weight}
        >
          Update Size Metal
        </Button>
      ]}
    >
      <div className="space-y-4">
        <div>
          <label>Metal</label>
          <Select
            style={{ width: '100%' }}
            placeholder="Select Metal"
            value={sizeMetal.metalId}
            onChange={(value) => setSizeMetal(prev => ({ ...prev, metalId: value }))}
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
            value={sizeMetal.sizeId}
            onChange={(value) => setSizeMetal(prev => ({ ...prev, sizeId: value }))}
          >
            {availableSizes.map(size => (
              <Select.Option key={size.Id} value={size.Id}>
                {size.Value} {size.Unit}
              </Select.Option>
            ))}
          </Select>
        </div>

        <div>
          <label>Weight (g)</label>
          <InputNumber
            style={{ width: '100%' }}
            placeholder="Enter Weight"
            min={0}
            step={0.1}
            value={sizeMetal.weight}
            onChange={(value) => setSizeMetal(prev => ({ ...prev, weight: value }))}
          />
        </div>
      </div>
    </Modal>
  );
};

export default UpdateSizeMetalModal;