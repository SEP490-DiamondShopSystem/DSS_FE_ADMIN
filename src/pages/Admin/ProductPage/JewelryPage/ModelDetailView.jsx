import React, { useState } from 'react';
import { Button, Tooltip, Modal, Tabs } from 'antd';
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  CloseOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';

const { TabPane } = Tabs;

const ModelDetailsView = ({
  selectedModel,
  onEdit,
  onView,
  onDelete,
  onClose,
  isEditModalVisible,
}) => {
  const getTextForEnum = (settingType) => {
    const SettingType = {
      0: 'Prong',
      1: 'Bezel',
      2: 'Tension',
      3: 'Pave',
      4: 'Bar',
      5: 'Flush',
    };

    return SettingType[settingType] || 'Unknown'; // Fallback for undefined values
  };

  const renderDetailRow = (label, value) => {
    if (!value && value !== 0 && value !== false) return null;

    // Convert boolean to Vietnamese text for display
    const displayValue = typeof value === 'boolean' ? (value ? 'Có' : 'Không') : value;

    return (
      <div className="flex items-center mb-2 p-2 bg-gradient-to-r from-blue-50 to-blue-100 rounded-md shadow-sm hover:shadow-md transition-all duration-300">
        <span className="font-semibold text-blue-800 mr-2 w-1/2">{label}:</span>
        <span className="text-gray-900 flex-1 font-medium">{displayValue}</span>
      </div>
    );
  };

  const renderItemsList = (items, renderItemContent) => {
    if (!items || items.length === 0)
      return <div className="text-center text-gray-500">Không có dữ liệu</div>;

    return items.map((item, index) => (
      <div
        key={index}
        className="bg-gray-50 border-b last:border-b-0 p-3 hover:bg-blue-50 transition-colors duration-300 rounded-lg mb-2 shadow-sm"
      >
        {renderItemContent(item)}
      </div>
    ));
  };

  // Function to show confirmation popup before delete
  const onDeleteWithConfirmation = () => {
    Modal.confirm({
      title: 'Xác nhận xóa mẫu',
      content: 'Bạn có chắc chắn muốn xóa mẫu này? Hành động này không thể hoàn tác.',
      okText: 'Xóa',
      okType: 'default',
      cancelText: 'Hủy',
      onOk: onDelete, // This will execute the onDelete function if the user confirms
      onCancel: () => {}, // This will execute if the user cancels
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50 overflow-auto backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto p-8 border-4 border-blue-200 relative transform transition-all duration-500 hover:scale-[1.01] hover:shadow-3xl">
        <div className="absolute top-4 right-4">
          <Tooltip title="Đóng">
            <Button
              type="text"
              shape="circle"
              icon={<CloseOutlined className="text-gray-600 hover:text-red-500" />}
              onClick={onClose}
              className="hover:bg-red-50"
            />
          </Tooltip>
        </div>

        <h2 className="text-3xl font-bold text-blue-800 text-center mb-8 border-b-4 border-blue-300 pb-4">
          {selectedModel?.Name}
        </h2>

        <div className="grid grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-4">
            {renderDetailRow('Danh Mục', selectedModel.Category?.Name)}
            {renderDetailRow('Mã Mẫu', selectedModel.ModelCode)}
            {renderDetailRow(
              'Phí Chế Tác',
              selectedModel.CraftmanFee && `${selectedModel.CraftmanFee} VND`
            )}
            {renderDetailRow('Mô Tả', selectedModel.Description)}
            {renderDetailRow(
              'Chiều Rộng',
              selectedModel.Width && `${selectedModel.Width} mm`
            )}
            {renderDetailRow('Có Khắc Được', selectedModel.IsEngravable)}
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {renderDetailRow(
              'Số Lượng Kim Cương Chính',
              selectedModel.MainDiamondCount
            )}
            {renderDetailRow(
              'Số Lượng Tùy Chọn Kim Cương Phụ',
              selectedModel.SideDiamondOptionCount
            )}
            {selectedModel.MetalSupported &&
              renderDetailRow(
                'Kim Loại Hỗ Trợ',
                selectedModel.MetalSupported.join(', ')
              )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-3 gap-4 my-5">
          <Button
            type="danger"
            icon={<DeleteOutlined />}
            onClick={onDeleteWithConfirmation} // Using the new function for confirmation
            block
            className="bg-red hover:bg-red text-white"
          >
            Xóa Mẫu
          </Button>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={onEdit}
            block
            className="bg-blue hover:bg-blue-700 transition-colors"
          >
            Sửa Mẫu
          </Button>
          <Button
            type="default"
            icon={<EyeOutlined />}
            onClick={onView}
            block
            className="border-blue text-blue-500 hover:border-blue-600 hover:text-blue-600"
          >
            Xem Mẫu
          </Button>
        </div>

        {/* Tab Navigation */}
        <Tabs defaultActiveKey="mainDiamonds" className="mt-8">
          <TabPane tab="Kim Cương Chính" key="mainDiamonds">
            <div className="max-h-40 overflow-y-auto">
              {renderItemsList(selectedModel.MainDiamonds, (diamond) => (
                <>
                  {renderDetailRow(
                    'Loại Gắn',
                    getTextForEnum(diamond.SettingType)
                  )}
                  {renderDetailRow('Số Lượng', diamond.Quantity)}
                  {renderDetailRow(
                    'ID Yêu Cầu Kim Cương Chính',
                    diamond.MainDiamondReqId
                  )}

                  <div className="grid grid-cols-4 gap-2">
                    {diamond.Shapes &&
                      diamond.Shapes.map((shape, shapeIndex) => (
                        <React.Fragment key={shapeIndex}>
                        <div className="border rounded-xl ">
                          {renderDetailRow(
                            'Hình Dáng',
                            shape.Shape?.ShapeName
                          )}
                          {shape?.CaratFrom &&
                            shape?.CaratTo &&
                            renderDetailRow(
                              'Khoảng Carat',
                              `${shape?.CaratFrom} - ${shape?.CaratTo} carats`
                            )}</div>
                        </React.Fragment>
                      ))}
                  </div>
                </>
              ))}
            </div>
          </TabPane>

          <TabPane tab="Kích Thước Kim Loại" key="sizeMetals">
            <div className="max-h-40 overflow-y-auto">
              {renderItemsList(selectedModel.SizeMetals, (sizeMetal) => (
                <div className="grid grid-cols-2 gap-2">
                  {sizeMetal.Size &&
                    renderDetailRow(
                      'Kích Thước',
                      `${sizeMetal.Size.Value} ${sizeMetal.Size.Unit}`
                    )}
                  {renderDetailRow('Kim Loại', sizeMetal.Metal?.Name)}
                  {renderDetailRow(
                    'Trọng Lượng',
                    sizeMetal.Weight && `${sizeMetal.Weight} g`
                  )}
                  {renderDetailRow(
                    'Giá',
                    sizeMetal.Metal?.Price && `${sizeMetal.Metal.Price} VND`
                  )}
                </div>
              ))}
            </div>
          </TabPane>

          <TabPane tab="Kim Cương Tấm" key="sideDiamonds">
            <div className="max-h-40 overflow-y-auto">
              {renderItemsList(selectedModel.SideDiamonds, (sideDiamond) => (
                <div className="grid grid-cols-4 gap-2">
                  {renderDetailRow('Trọng Lượng Carat', sideDiamond.CaratWeight)}
                  {renderDetailRow('Loại Gắn', sideDiamond.SettingType)}
                  {renderDetailRow('Số Lượng', sideDiamond.Quantity)}
                  {sideDiamond.ColorMin &&
                    sideDiamond.ColorMax &&
                    renderDetailRow(
                      'Khoảng Màu',
                      `${sideDiamond.ColorMin} - ${sideDiamond.ColorMax}`
                    )}
                  {sideDiamond.ClarityMin &&
                    sideDiamond.ClarityMax &&
                    renderDetailRow(
                      'Khoảng Độ Tinh Khiết',
                      `${sideDiamond.ClarityMin} - ${sideDiamond.ClarityMax}`
                    )}
                </div>
              ))}
            </div>
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
};

export default ModelDetailsView;
