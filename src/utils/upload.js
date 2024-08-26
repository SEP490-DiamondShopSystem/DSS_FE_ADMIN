// export const handleFileUpload = async (event) => {
// 	const file = event.target.files[0];
// 	if (file) {
// 		const result = await uploadImageToCloudinary(file);
// 		if (result && result.secure_url) {
// 			setImageURL(result.secure_url); // Lưu URL của ảnh đã upload
// 		}
// 	}
// };

// export const handleMultipleFileUpload = async (event) => {
// 	const files = event.target.files;
// 	if (files.length) {
// 		const results = await uploadMultipleImages(files);
// 		setMultipleImageURL(results.map((result) => result.secure_url)); // Lưu danh sách URL của các ảnh đã upload
// 	}
// };

{
	/* <div>
	{imageURLs &&
		imageURLs.map((url, index) => (
			<img
				key={index}
				src={url}
				alt={`Uploaded ${index}`}
				style={{width: '300px', height: 'auto'}}
			/>
		))}
</div>; */
}
