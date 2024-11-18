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
import {Table, Button, Modal, Form, Input, Tag, Select, Upload, message} from 'antd';
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
		try {
			const values = await form.validateFields();
			if (!editorContent.trim()) {
				return;
			}

			const blogData = new FormData();

			if (isEditMode) {
				blogData.append('BlogId', updatingId); // or use 'updatingId' if that's available
			}
			blogData.append('Title', values.title);

			// Check if tags are populated correctly
			console.log('Tags:', tags);
			tags.forEach((tag, index) => {
				blogData.append(`BlogTags[${index}]`, tag); // Append each tag directly
			});

			blogData.append('Content', editorContent);

			// Ensure thumbnail is correctly handled
			if (thumbnailFile) {
				blogData.append('Thumbnail', thumbnailFile);
			}

			const result = await dispatch(isEditMode ? updateBlog(blogData) : createBlog(blogData));
			// Log the data to the console before dispatching the API call
			message.success(
				isEditMode ? 'Blog updated successfully!' : 'Blog created successfully!'
			);

			// Reset state
			setIsModalVisible(false);
			form.resetFields();
			setThumbnailFile(null);
			setIsEditMode(false);
			setSelectedBlog(null);
			setEditorContent('');
			setTags([]);
		} catch (error) {
			console.error('Error creating/updating blog:', error);
		}
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

			setThumbnailFile({
				MediaPath: detail.Thumbnail?.MediaPath,
				ContentType: detail.Thumbnail?.ContentType,
			});

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
			title: 'Title',
			dataIndex: 'Title',
			key: 'Title',
		},
		{
			title: 'Tags',
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
						Edit
					</Button>
					<Button
						danger
						onClick={() => handleDelete(record.Id)}
						className="transition-all duration-300 ease-in-out hover:bg-red-500"
					>
						Delete
					</Button>
				</div>
			),
		},
	];

	return (
		<div className="w-4/5 mx-auto p-6">
			<div className="flex justify-between items-center mb-4">
				<h1 className="text-xl font-bold">Manage Blogs</h1>
				<Button
					type="primary"
					icon={<PlusOutlined />}
					onClick={() => setIsModalVisible(true)}
					className="transition-all duration-300 ease-in-out hover:bg-green-500"
				>
					Create Blog
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
				title={isEditMode ? 'Edit Blog' : 'Create Blog'}
				visible={isModalVisible}
				onOk={handleCreateOrUpdate}
				onCancel={onCancel}
				className="rounded-lg p-6"
			>
				<Form layout="vertical" form={form}>
					<Form.Item
						name="title"
						label="Title"
						rules={[{required: true, message: 'Please enter the blog title!'}]}
					>
						<Input
							placeholder="Enter blog title"
							className="p-2 rounded-lg border-gray-300"
						/>
					</Form.Item>

					<Form.Item name="tags" label="Tags">
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
								placeholder="Press enter to add tags"
								className="p-2 rounded-lg border-gray-300 mb-2"
							/>
							<div>
								{tags.map((tag, index) => (
									<Tag
										key={index}
										color="blue"
										onClose={() => setTags(tags.filter((t) => t !== tag))}
										closable
									>
										{tag}
									</Tag>
								))}
							</div>
						</div>
					</Form.Item>
					<Form.Item label="Thumbnail">
						<Upload
							beforeUpload={(file) => {
								if (!file || !file.name) {
									message.error('Invalid file selected.');
									return false;
								}
								const fileWithPreview = Object.assign(file, {
									preview: URL.createObjectURL(file),
								});

								setThumbnailFile(fileWithPreview);
								return false;
							}}
							fileList={
								thumbnailFile
									? [
											{
												uid: '-1',
												name: thumbnailFile.name || 'Unknown file',
												status: 'done', // Set status to 'done' for pre-upload files
												url:
													thumbnailFile.preview ||
													thumbnailFile.MediaPath, // Use preview or MediaPath for the URL
												file: thumbnailFile,
												thumbUrl:
													thumbnailFile.preview ||
													thumbnailFile.MediaPath, // Use preview for thumbUrl
											},
									  ]
									: []
							} // Show the file in the list if thumbnailFile is available
							onRemove={() => setThumbnailFile(null)} // Remove file from state
							showUploadList={{
								showRemoveIcon: true,
								showPreviewIcon: true,
							}}
						>
							{/* Image Preview outside Upload component */}
							{thumbnailFile && (
								<div className="mt-2">
									<img
										src={thumbnailFile.preview || thumbnailFile.MediaPath} // Display preview or MediaPath as image source
										alt={thumbnailFile.name}
										style={{
											width: 100,
											height: 100,
											objectFit: 'cover',
											borderRadius: '8px',
										}}
									/>
								</div>
							)}
							<Button
								icon={<UploadOutlined />}
								className="transition-all duration-300 ease-in-out hover:bg-blue-500"
							>
								Upload Thumbnail
							</Button>
						</Upload>
					</Form.Item>

					<Form.Item
						name="contents"
						label="Content"
						rules={[{required: false, message: 'Please enter blog content!'}]}
					>
						{isEditingContent ? (
							<div>
								<ReactQuill
									theme="snow"
									value={editorContent} // Pass the content here when editing
									onChange={setEditorContent} // Ensure state is updated when typing
									modules={{
										toolbar: [
											[{header: [1, 2, 3, false]}],
											[{font: []}],
											[{size: ['small', false, 'large', 'huge']}],
											['bold', 'italic', 'underline', 'strike'],
											[{color: []}, {background: []}],
											[{script: 'sub'}, {script: 'super'}],
											[{list: 'ordered'}, {list: 'bullet'}],
											[{indent: '-1'}, {indent: '+1'}],
											[{align: []}],
											['blockquote', 'code-block'],
											['link', 'image'],
											['clean'],
										],
									}}
									formats={[
										'header',
										'font',
										'size',
										'bold',
										'italic',
										'underline',
										'strike',
										'color',
										'background',
										'script',
										'list',
										'bullet',
										'indent',
										'align',
										'blockquote',
										'code-block',
										'link',
										'image',
										'video',
									]}
								/>
								<Button
									onClick={handleCancelEditContent}
									className="mt-2 bg-primary text-white"
								>
									Cancel Edit
								</Button>
							</div>
						) : (
							<div>
								<div className="rendered-content overflow-y-auto max-h-40 p-6 border rounded-lg shadow-lg bg-white">
									{ReactHtmlParser(sanitizedContent)}
								</div>
								<Button
									onClick={handleEditContent}
									className="mt-2 bg-primary text-white"
								>
									Edit Content
								</Button>
							</div>
						)}
					</Form.Item>
				</Form>
			</Modal>
			{/* Pagination Controls */}
			{/* <div className="pagination-controls flex justify-center space-x-4 mt-4">
				<Button
					onClick={handlePreviousPage}
					disabled={currentPage === 1}
					className="bg-primary text-black hover:bg-primaryDark disabled:opacity-50"
				>
					Previous
				</Button>
				<span className="text-lg">{`Page ${currentPage} of ${totalPage}`}</span>
				<Button
					onClick={handleNextPage}
					disabled={currentPage === totalPage}
					className="bg-primary text-black hover:bg-primaryDark disabled:opacity-50"
				>
					Next
				</Button>
				<Select
					value={pageSize}
					onChange={(value) => setPageSize(value)}
					className="form-select p-2 border border-gray rounded-md"
				>
					<Select.Option value={5}>5 per page</Select.Option>
					<Select.Option value={10}>10 per page</Select.Option>
					<Select.Option value={20}>20 per page</Select.Option>
				</Select>
			</div> */}
		</div>
	);
};

export default BlogPage;
