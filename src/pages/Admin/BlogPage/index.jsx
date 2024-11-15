import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {createBlog, updateBlog, removeBlog, fetchAllBlogs} from '../../../redux/slices/blogSlice';
import {selectAllBlogs, selectBlogLoading, selectBlogError} from '../../../redux/selectors';
import {Table, Button, Modal, Form, Input, Tag, Upload, message} from 'antd';
import {PlusOutlined, UploadOutlined} from '@ant-design/icons';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import 'tailwindcss/tailwind.css';

const BlogPage = () => {
	const dispatch = useDispatch();
	const blogs = useSelector(selectAllBlogs);
	const loading = useSelector(selectBlogLoading);
	const error = useSelector(selectBlogError);

	const [isModalVisible, setIsModalVisible] = useState(false);
	const [isEditMode, setIsEditMode] = useState(false);
	const [selectedBlog, setSelectedBlog] = useState(null);

	const [form] = Form.useForm();

	useEffect(() => {
		dispatch(fetchAllBlogs({currentPage: 1, pageSize: 10}));
	}, [dispatch]);

	const handleCreateOrUpdate = async () => {
		try {
			const values = await form.validateFields();
			const blogData = {
				title: values.title,
				tags: values.tags ? values.tags.split(',') : [],
				thumbnail: values.thumbnail,
				contents: values.contents,
				id: selectedBlog?.id, // Add the ID for updating
			};

			if (isEditMode) {
				dispatch(updateBlog(blogData));
				message.success('Blog updated successfully!');
			} else {
				dispatch(createBlog(blogData));
				message.success('Blog created successfully!');
			}

			setIsModalVisible(false);
			form.resetFields();
			setIsEditMode(false);
			setSelectedBlog(null);
		} catch (errorInfo) {
			message.error('Please fill all required fields!');
		}
	};

	const handleEdit = (blog) => {
		setIsEditMode(true);
		setSelectedBlog(blog);
		form.setFieldsValue({
			title: blog.Title,
			tags: blog.BlogTags.join(', '),
			thumbnail: blog.Thumbnail,
			contents: blog.Contents,
		});
		setIsModalVisible(true);
	};

	const handleDelete = (id) => {
		dispatch(removeBlog(id));
		message.success('Blog deleted successfully!');
	};

	const columns = [
		{
			title: 'Title',
			dataIndex: 'Title',
			key: 'Title',
		},
		{
			title: 'Tags',
			dataIndex: 'BlogTags',
			key: 'BlogTags',
			render: (tags) => (
				<>
					{tags.map((tag, index) => (
						<Tag key={index} color="blue">
							{tag}
						</Tag>
					))}
				</>
			),
		},
		{
			title: 'Actions',
			key: 'actions',
			render: (text, record) => (
				<div className="flex gap-2">
					<Button type="primary" onClick={() => handleEdit(record)}>
						Edit
					</Button>
					<Button danger onClick={() => handleDelete(record.id)}>
						Delete
					</Button>
				</div>
			),
		},
	];

	return (
		<div className="p-6">
			<div className="flex justify-between items-center mb-4">
				<h1 className="text-xl font-bold">Manage Blogs</h1>
				<Button
					type="primary"
					icon={<PlusOutlined />}
					onClick={() => setIsModalVisible(true)}
				>
					Create Blog
				</Button>
			</div>

			<Table
				dataSource={blogs}
				columns={columns}
				rowKey={(record) => record.id}
				loading={loading}
			/>

			<Modal
				title={isEditMode ? 'Edit Blog' : 'Create Blog'}
				visible={isModalVisible}
				onOk={handleCreateOrUpdate}
				onCancel={() => {
					setIsModalVisible(false);
					form.resetFields();
					setIsEditMode(false);
					setSelectedBlog(null);
				}}
			>
				<Form layout="vertical" form={form}>
					<Form.Item
						name="title"
						label="Title"
						rules={[{required: true, message: 'Please enter the blog title!'}]}
					>
						<Input />
					</Form.Item>

					<Form.Item
						name="tags"
						label="Tags"
						rules={[{required: true, message: 'Please enter blog tags!'}]}
					>
						<Input placeholder="Separate tags with commas" />
					</Form.Item>

					<Form.Item
						name="thumbnail"
						label="Thumbnail URL"
						rules={[{required: true, message: 'Please enter the thumbnail URL!'}]}
					>
						<Input />
					</Form.Item>

					<Form.Item
						name="contents"
						label="Contents"
						rules={[{required: true, message: 'Please enter blog content!'}]}
					>
						<ReactQuill theme="snow" />
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
};

export default BlogPage;
