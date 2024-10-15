import React, { useState } from 'react';
import { Button, Form, Input, DatePicker, Upload, Table, Popconfirm, message, Space } from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import moment from 'moment';

const { RangePicker } = DatePicker;
const samplePromotions = [
  {
    key: 0,
    title: 'Summer Sale',
    apply: 'All Customers',
    validDate: '2024-06-01 to 2024-06-30',
    image: 'https://example.com/summer-sale.jpg',
    require: [
      {
        unit: 'Item',
        scope: 'Category A',
        productCode: 'CAT001',
        operator: '>',
        value: '2',
      },
    ],
    gift: [
      {
        giftType: 'Discount',
        unit: 'Percentage',
        productType: 'All Products',
        productCode: 'DISC10',
        value: '10%',
      },
    ],
  },
  {
    key: 1,
    title: 'Winter Clearance',
    apply: 'VIP Members',
    validDate: '2024-12-01 to 2024-12-31',
    image: 'https://example.com/winter-clearance.jpg',
    require: [
      {
        unit: 'Item',
        scope: 'Category B',
        productCode: 'CAT002',
        operator: '>=',
        value: '3',
      },
    ],
    gift: [
      {
        giftType: 'Free Item',
        unit: 'Piece',
        productType: 'Selected Products',
        productCode: 'FRI001',
        value: '1',
      },
    ],
  },
];

const PromotionPage = () => {
  const [form] = Form.useForm();
  const [promotions, setPromotions] = useState(samplePromotions);
  const [editingKey, setEditingKey] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const handleCreatePromotion = (values) => {
    const newPromotion = {
      ...values,
      key: promotions.length,
      validDate: `${values.validDate[0].format('YYYY-MM-DD')} to ${values.validDate[1].format('YYYY-MM-DD')}`,
    };
    setPromotions([...promotions, newPromotion]);
    message.success('Promotion created successfully!');
    form.resetFields();
    setIsEditing(false);
  };

  const handleEdit = (record) => {
    setIsEditing(true);
    setEditingKey(record.key);
    const [startDate, endDate] = record.validDate.split(' to ');
    form.setFieldsValue({
      ...record,
      validDate: [moment(startDate), moment(endDate)],
    });
  };

  const handleUpdate = async () => {
    try {
      const row = await form.validateFields();
      const newData = [...promotions];
      const index = newData.findIndex((item) => item.key === editingKey);
      if (index > -1) {
        const item = newData[index];
        const updatedPromotion = {
          ...item,
          ...row,
          validDate: `${row.validDate[0].format('YYYY-MM-DD')} to ${row.validDate[1].format('YYYY-MM-DD')}`,
        };
        newData.splice(index, 1, updatedPromotion);
        setPromotions(newData);
        setEditingKey('');
        setIsEditing(false);
        form.resetFields();
        message.success('Promotion updated successfully!');
      }
    } catch (err) {
      message.error('Please correct the form errors.');
    }
  };

  const handleDeletePromotion = (key) => {
    const newData = promotions.filter((item) => item.key !== key);
    setPromotions(newData);
    message.success('Promotion deleted successfully!');
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingKey(''); // Reset the editing key
    form.resetFields();
};


  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      editable: true,
    },
    {
      title: 'Apply',
      dataIndex: 'apply',
      editable: true,
    },
    {
      title: 'Valid Date',
      dataIndex: 'validDate',
    },
    {
      title: 'Action',
      render: (_, record) => (
        <span>
        <Button type="link" disabled={editingKey !== '' && editingKey !== record.key} onClick={() => handleEdit(record)}>
            Edit
        </Button>
        <Popconfirm title="Sure to delete?" onConfirm={() => handleDeletePromotion(record.key)}>
            <Button type="link" danger>
                Delete
            </Button>
        </Popconfirm>
    </span>
      ),
    },
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">
        {isEditing ? 'Edit Promotion' : 'Create New Promotion'}
      </h2>
      <Form
        form={form}
        onFinish={isEditing ? handleUpdate : handleCreatePromotion}
        layout="vertical"
        className="space-y-4"
      >
        {/* Title and Apply */}
        <Form.Item
          name="title"
          label="Title"
          rules={[{ required: true, message: 'Please enter a title' }]}
          className="w-full"
        >
          <Input placeholder="Enter promotion title" className="border-gray-300 rounded-md w-full p-2" />
        </Form.Item>

        <Form.Item
          name="apply"
          label="Apply"
          rules={[{ required: true, message: 'Please enter apply field' }]}
          className="w-full"
        >
          <Input placeholder="Enter application" className="border-gray-300 rounded-md w-full p-2" />
        </Form.Item>

        {/* Valid Date */}
        <Form.Item
          name="validDate"
          label="Valid date"
          rules={[{ required: true, message: 'Please select a valid date range' }]}
          className="w-full"
        >
          <RangePicker className="w-full" />
        </Form.Item>

        {/* Image Upload */}
        <Form.Item name="image" label="Image">
          <Upload listType="picture-card" className="border-gray-300 rounded-md">
            <div className="text-gray-500">
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Upload</div>
            </div>
          </Upload>
        </Form.Item>

  {/* Require Section */}
  <h3 className="text-lg font-semibold">Require</h3>
        <Form.List name="require">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, fieldKey, ...restField }) => (
                <Space key={key} className="flex mb-4 space-x-4" align="baseline">
                  <Form.Item
                    {...restField}
                    name={[name, 'unit']}
                    fieldKey={[fieldKey, 'unit']}
                    rules={[{ required: true, message: 'Missing unit' }]}
                  >
                    <Input placeholder="Unit" className="border-gray-300 rounded-md p-2" />
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, 'scope']}
                    fieldKey={[fieldKey, 'scope']}
                    rules={[{ required: true, message: 'Missing applicable scope' }]}
                  >
                    <Input placeholder="Applicable scope" className="border-gray-300 rounded-md p-2" />
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, 'productCode']}
                    fieldKey={[fieldKey, 'productCode']}
                    rules={[{ required: true, message: 'Missing product code' }]}
                  >
                    <Input placeholder="Product code" className="border-gray-300 rounded-md p-2" />
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, 'operator']}
                    fieldKey={[fieldKey, 'operator']}
                    rules={[{ required: true, message: 'Missing operator' }]}
                  >
                    <Input placeholder="Operator" className="border-gray-300 rounded-md p-2" />
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, 'value']}
                    fieldKey={[fieldKey, 'value']}
                    rules={[{ required: true, message: 'Missing value' }]}
                  >
                    <Input placeholder="Required value" className="border-gray-300 rounded-md p-2" />
                  </Form.Item>

                  <MinusCircleOutlined onClick={() => remove(name)} className="text-red-500" />
                </Space>
              ))}
              <Form.Item>
                <Button type="dashed" onClick={() => add()} className="w-full">
                  <PlusOutlined /> Add Require
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        {/* Gift Section */}
        <h3 className="text-lg font-semibold">Gift</h3>
        <Form.List name="gift">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, fieldKey, ...restField }) => (
                <Space key={key} className="flex mb-4 space-x-4" align="baseline">
                  <Form.Item
                    {...restField}
                    name={[name, 'giftType']}
                    fieldKey={[fieldKey, 'giftType']}
                    rules={[{ required: true, message: 'Missing gift type' }]}
                  >
                    <Input placeholder="Gift type" className="border-gray-300 rounded-md p-2" />
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, 'unit']}
                    fieldKey={[fieldKey, 'unit']}
                    rules={[{ required: true, message: 'Missing unit' }]}
                  >
                    <Input placeholder="Unit" className="border-gray-300 rounded-md p-2" />
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, 'productType']}
                    fieldKey={[fieldKey, 'productType']}
                    rules={[{ required: true, message: 'Missing product type' }]}
                  >
                    <Input placeholder="Product type" className="border-gray-300 rounded-md p-2" />
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, 'productCode']}
                    fieldKey={[fieldKey, 'productCode']}
                    rules={[{ required: true, message: 'Missing product code' }]}
                  >
                    <Input placeholder="Product code" className="border-gray-300 rounded-md p-2" />
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, 'value']}
                    fieldKey={[fieldKey, 'value']}
                    rules={[{ required: true, message: 'Missing value' }]}
                  >
                    <Input placeholder="Value" className="border-gray-300 rounded-md p-2" />
                  </Form.Item>

                  <MinusCircleOutlined onClick={() => remove(name)} className="text-red-500" />
                </Space>
              ))}
              <Form.Item>
                <Button type="dashed" onClick={() => add()} className="w-full">
                  <PlusOutlined /> Add Gift
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        {/* Submit Button */}
        <Form.Item>
          <div className="flex justify-end space-x-4">
            {isEditing && (
              <Button type="default" className="bg-gray-300 rounded-md p-2" onClick={handleCancelEdit}>
                Cancel
              </Button>
            )}
            <Button type="primary" htmlType="submit" className="bg-yellow-500 text-white rounded-md p-2">
              {isEditing ? 'Save' : 'Create'}
           

            </Button>
          </div>
        </Form.Item>
      </Form>

      {/* Display Promotions */}
      <h2 className="text-2xl font-semibold mt-10 mb-6">Promotions List</h2>
      <Table columns={columns} dataSource={promotions} />
    </div>
  );
};

export default PromotionPage;
