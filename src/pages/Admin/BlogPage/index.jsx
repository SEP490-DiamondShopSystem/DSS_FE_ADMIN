import React, {useEffect, useState, useRef} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
	createBlog,
	updateBlog,
	removeBlog,
	fetchAllBlogs,
	fetchBlogDetail,
} from '../../../redux/slices/blogSlice';
import {
	selectAllBlogs,
	selectBlogLoading,
	selectBlogError,
	selectBlogTotalPage,
	selectBlogDetail,
} from '../../../redux/selectors';
import {Table, Button, Modal, Form, Input, Tag, Select, Upload, message, Image} from 'antd';
import {PlusOutlined, UploadOutlined} from '@ant-design/icons';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import 'react-quill/dist/quill.bubble.css';
import 'tailwindcss/tailwind.css';
import DOMPurify from 'dompurify';
import ReactHtmlParser from 'html-react-parser';

const BlogPage = () => {
	const dispatch = useDispatch();
	const blogs = useSelector(selectAllBlogs) || [];
	const loading = useSelector(selectBlogLoading);
	const error = useSelector(selectBlogError);
	const blogDetail = useSelector(selectBlogDetail); // Assuming the state holds blog details

	const [isModalVisible, setIsModalVisible] = useState(false);
	const [isEditMode, setIsEditMode] = useState(false);
	const [selectedBlog, setSelectedBlog] = useState(null);
	const [updatingId, setUpdatingId] = useState(null);
	const [thumbnailFile, setThumbnailFile] = useState(null);
	const [tags, setTags] = useState([]);
	const [tagsInput, setTagsInput] = useState(''); // State for input value
	const [form] = Form.useForm();
	const quillRef = useRef(null);
	const [editorContent, setEditorContent] = useState('');
	const [isEditingContent, setIsEditingContent] = useState(false); // Track if content is being edited
	const sanitizedContent = DOMPurify.sanitize(editorContent);

	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState(5);
	const totalPage = useSelector(selectBlogTotalPage);

	const handleEditContent = () => {
		// Switch to edit mode and load content into the editor
		setIsEditingContent(true);
	};

	const handleCancelEditContent = () => {
		// Cancel editing and revert to viewing mode
		setIsEditingContent(false);
	};

	useEffect(() => {
		dispatch(fetchAllBlogs({CurrentPage: currentPage, PageSize: pageSize}));
	}, [dispatch, currentPage, pageSize]);

	const handlePreviousPage = () => {
		if (currentPage > 1) {
			setCurrentPage(currentPage - 1);
		}
	};

	const handleNextPage = () => {
		if (currentPage < totalPage) {
			setCurrentPage(currentPage + 1);
		}
	};
	const handleKeyDown = (e) => {
		if (e.key === 'Enter' || e.key === ',' || e.key === '#') {
			e.preventDefault(); // Prevent default behavior (like adding a comma)

			const newTag = tagsInput.trim(); // Get the tag text
			if (newTag && !tags.includes(newTag)) {
				setTags((prevTags) => {
					const updatedTags = [...prevTags, newTag]; // Add the new tag
					const uniqueTags = Array.from(new Set(updatedTags)); // Ensure unique tags
					console.log('Tags after adding new tag:', uniqueTags); // Log after adding a new tag
					return uniqueTags;
				});
				setTagsInput(''); // Clear the input field
			}
		}
	};

	const handleRemoveTag = (tagToRemove) => {
		setTags((prevTags) => {
			const updatedTags = prevTags.filter((tag) => tag !== tagToRemove);
			console.log('Tags after removing tag:', updatedTags); // Log after removing a tag
			return updatedTags;
		});
	};

	const handleTagChange = (e) => {
		const inputValue = e.target.value.trim();
		const updatedTags = inputValue
			.split(/,|#/g) // Split by comma or hash
			.map((tag) => tag.trim()) // Trim spaces around tags
			.filter((tag) => tag.length > 0); // Remove empty tags

		setTags(updatedTags);
		console.log('Tags after change:', updatedTags); // Log tags after change
	};

	const handleBlur = () => {
		if (tagsInput.trim()) {
			setTags((prevTags) => {
				const updatedTags = [...prevTags, tagsInput.trim()];
				return updatedTags;
			});
			setTagsInput('');
		}
	};

	const handleCreateOrUpdate = async () => {
		const values = await form.validateFields();
		if (!editorContent.trim()) {
			message.error('Nội dung bài viết không được để trống!');
			return;
		}

		const blogData = new FormData();
		if (isEditMode) {
			blogData.append('BlogId', updatingId);
		}
		blogData.append('Title', values.title);
		console.log('Tags:', tags);
		tags.forEach((tag, index) => {
			blogData.append(`BlogTags[${index}]`, tag);
		});
		blogData.append('Content', editorContent);

		if (thumbnailFile) {
			blogData.append('Thumbnail', thumbnailFile);
		}

		const result = await dispatch(isEditMode ? updateBlog(blogData) : createBlog(blogData))
			.unwrap()
			.then(() => {
				message.success(
					isEditMode ? 'Cập nhật bài viết thành công!' : 'Tạo bài viết mới thành công!'
				);
			})
			.catch((error) => {
				message.error(error?.data?.title || error?.detail);
			});

		// Reset state
		setIsModalVisible(false);
		form.resetFields();
		setThumbnailFile(null);
		setIsEditMode(false);
		setSelectedBlog(null);
		setEditorContent('');
		setTags([]);
		await dispatch(fetchAllBlogs({CurrentPage: currentPage, PageSize: pageSize}));
	};

	const handleEdit = async (blog) => {
		setIsEditMode(true);
		setSelectedBlog(blog);
		setUpdatingId(blog.Id);
		// const plainTextToHTML = (text) => {
		// 	// Wrap plain text in <p> tags
		// 	return `<p>${text.replace(/\n/g, '</p><p>')}</p>`;
		// };
		let actionResult;
		// Fetch blog details only if it's not already available
		if (!blogDetail || blogDetail.Id !== blog.Id) {
			actionResult = await dispatch(fetchBlogDetail({BlogId: blog.Id}));
			console.log('Action Result for fetchBlogDetail:', actionResult.payload); // Log the action result
		}

		// Use the fetched blog details (from actionResult.payload) for the form and state updates
		const detail = actionResult?.payload || blogDetail;
		if (detail) {
			form.setFieldsValue({title: detail.Title});

			if (detail.Thumbnail?.MediaPath) {
				setThumbnailFile({
					uid: '-1', // Unique identifier for the file
					name: detail.Thumbnail.MediaPath.split('/').pop(),
					status: 'done',
					url: detail.Thumbnail.MediaPath,
					preview: detail.Thumbnail.MediaPath,
				});
			} else {
				setThumbnailFile(null); // Clear if no thumbnail is provided
			}

			// Correctly set the editor content and tags
			// const htmlContent = plainTextToHTML(detail.Content || '');
			setEditorContent(detail.Content);
			console.log(' detail.Content :', detail.Content); // Log the action result

			const blogTags = Array.isArray(detail.Tags) ? detail.Tags : [];
			setTags(blogTags);
		}

		setIsModalVisible(true);
	};

	const handleDelete = (id) => {
		dispatch(removeBlog(id));
		message.success('Blog deleted successfully!');
	};

	const onCancel = async () => {
		setIsModalVisible(false);
		form.resetFields();
		setThumbnailFile(null);
		setIsEditMode(false);
		setSelectedBlog(null);
		setEditorContent(''); // Clear editor
		setTags([]); // Clear tags
		setIsEditingContent(false);
		await dispatch(fetchAllBlogs({CurrentPage: currentPage, PageSize: pageSize}));
	};

	const columns = [
		{
			title: 'Thumbnail',
			dataIndex: 'Thumbnail',
			key: 'Thumbnail',
			render: (thumbnail) => (
				<img
					src={thumbnail?.MediaPath}
					alt="Thumbnail"
					style={{
						width: 50,
						height: 50,
						objectFit: 'cover',
						borderRadius: '8px',
						boxShadow: '0 0 10px rgba(0,0,0,0.1)',
					}}
				/>
			),
		},
		{
			title: 'Tiêu Đề',
			dataIndex: 'Title',
			key: 'Title',
		},
		{
			title: 'Nhãn',
			dataIndex: 'Tags',
			key: 'Tags',
			render: (tags) =>
				tags.map((tag, index) => (
					<Tag
						key={index}
						color="blue"
						className="transition-all duration-300 ease-in-out"
					>
						{tag}
					</Tag>
				)),
		},
		{
			title: 'Actions',
			key: 'actions',
			render: (_, record) => (
				<div className="flex gap-2">
					<Button
						type="primary"
						onClick={() => handleEdit(record)}
						className="transition-all duration-300 ease-in-out hover:bg-blue-500"
					>
						Chỉnh Sửa
					</Button>
					<Button
						danger
						onClick={() => handleDelete(record.Id)}
						className="transition-all duration-300 ease-in-out hover:bg-red-500"
					>
						Xóa
					</Button>
				</div>
			),
		},
	];

	return (
		<div className="w-4/5 mx-auto p-6">
			<div className="flex justify-between items-center mb-4">
				<h1 className="text-xl font-bold">Quản Lý Bài Đăng</h1>
				<Button
					type="primary"
					icon={<PlusOutlined />}
					onClick={() => setIsModalVisible(true)}
					className="transition-all duration-300 ease-in-out hover:bg-green-500"
				>
					Tạo Bài Đăng
				</Button>
			</div>

			<Table
				dataSource={Array.isArray(blogs) ? blogs : []}
				columns={columns}
				rowKey={(record) => record.Id}
				loading={loading}
				className="rounded-lg shadow-lg"
			/>

			<Modal
				title={isEditMode ? 'Cập Nhật Bài Đăng' : 'Tạo Bài Đăng Mới'}
				visible={isModalVisible}
				onOk={handleCreateOrUpdate}
				onCancel={onCancel}
				width={900} // Make the modal wider
				className="rounded-lg p-6"
			>
				<Form layout="vertical" form={form} style={{width: '100%'}}>
					<Form.Item
						name="title"
						label="Tiêu Đề"
						rules={[{required: true, message: 'Vui lòng nhập tiêu đề bài đăng!'}]}
						className="mb-4"
					>
						<Input
							placeholder="Enter blog title"
							className="p-3 rounded-lg border-gray-300"
						/>
					</Form.Item>

					<Form.Item name="tags" label="Nhãn" className="mb-4">
						<div>
							<Input
								value={tagsInput}
								onChange={(e) => setTagsInput(e.target.value)}
								onPressEnter={() => {
									if (tagsInput.trim()) {
										setTags([...tags, tagsInput.trim()]);
										setTagsInput('');
									}
								}}
								placeholder="Nhấn Enter để thêm nhãn"
								className="p-3 rounded-lg border-gray-300 mb-2"
							/>
							<div>
								{tags.map((tag, index) => (
									<Tag
										key={index}
										color="blue"
										onClose={() => setTags(tags.filter((t) => t !== tag))}
										closable
										className="mb-1"
									>
										{tag}
									</Tag>
								))}
							</div>
						</div>
					</Form.Item>

					<Form.Item className="mb-6" label="Thumbnail" style={{marginBottom: '16px'}}>
						<div className="upload-section">
							<Upload.Dragger
								name="thumbnail"
								beforeUpload={(file) => {
									if (!file.name) {
										message.error('Invalid file selected.');
										return false;
									}
									const fileWithPreview = Object.assign(file, {
										preview: URL.createObjectURL(file),
									});
									setThumbnailFile(fileWithPreview);
									return false;
								}}
								onRemove={() => setThumbnailFile(null)}
								showUploadList={false}
								className="drag-upload-area rounded-lg border-dashed border-gray-400 bg-gray-50 p-6"
							>
								<p className="ant-upload-drag-icon">
									<UploadOutlined />
								</p>
								<p className="ant-upload-text">Tải Hình Ảnh Lên</p>
								<p className="ant-upload-hint text-sm text-gray-500">
									Supports single file upload. Ensure the file is an image.
								</p>
							</Upload.Dragger>
						</div>

						{thumbnailFile && (
							<div className="preview-section mt-4 relative">
								<Image
									src={thumbnailFile.preview || thumbnailFile.url}
									alt="Thumbnail Preview"
									style={{
										width: '100%',
										height: 'auto',
										borderRadius: '8px',
										boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
									}}
								/>
								<Button
									danger
									type="link"
									onClick={() => setThumbnailFile(null)}
									className="mt-2"
								>
									Xóa Tất Cả
								</Button>
							</div>
						)}
					</Form.Item>

					<Form.Item
						name="contents"
						label="Nội Dung"
						className="mb-6"
						rules={[
							{
								required: true,
								validator: (_, value) => {
									if (!editorContent.trim()) {
										return Promise.reject(
											'Nội dung bài viết không được để trống!'
										);
									}
									return Promise.resolve();
								},
							},
						]}
					>
						{isEditingContent ? (
							<div>
								<ReactQuill
									theme="snow"
									value={editorContent}
									onChange={setEditorContent}
									style={{height: 300, borderRadius: '8px'}}
									modules={{
										toolbar: [
											[{header: [1, 2, 3, false]}],
											[{font: []}],
											[{size: ['small', false, 'large', 'huge']}],
											['bold', 'italic', 'underline', 'strike'],
											[{color: []}, {background: []}],
											[{list: 'ordered'}, {list: 'bullet'}],
											[{align: []}],
											['link', 'image', 'video'],
											['clean'],
										],
									}}
								/>
								<Button
									onClick={handleCancelEditContent}
									className="mt-4 bg-gray-200 hover:bg-gray-300 text-black"
								>
									Hủy
								</Button>
							</div>
						) : (
							<div>
								<div className="rendered-content p-4 border rounded-lg shadow-lg bg-gray-100 overflow-y-auto max-h-44 ">
									{ReactHtmlParser(sanitizedContent)}
								</div>
								<Button
									onClick={handleEditContent}
									className="mt-4 bg-primary text-white"
								>
									Chỉnh Sửa Nội Dung
								</Button>
							</div>
						)}
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
};

export default BlogPage;
