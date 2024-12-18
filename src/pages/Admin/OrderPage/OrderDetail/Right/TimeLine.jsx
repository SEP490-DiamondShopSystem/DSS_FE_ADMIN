import {CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined} from '@ant-design/icons';
import {Button, Image, Modal, Timeline} from 'antd';
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {getOrderChildLogListSelector, getOrderLogsSelector} from '../../../../../redux/selectors';
import {getProcessingDetail} from '../../../../../redux/slices/logSlice';
import {getOrderLog} from '../../../../../redux/slices/orderSlice';

export const TimeLine = ({status, orders, loading, id}) => {
	const dispatch = useDispatch();
	const orderLogList = useSelector(getOrderLogsSelector);
	const childLogList = useSelector(getOrderChildLogListSelector);

	const [log, setLog] = useState(null);
	const [filteredSteps, setFilteredSteps] = useState([]);
	const [modalVisible, setModalVisible] = useState(false);
	// const [orderLogList, setOrderLogList] = useState();

	useEffect(() => {
		if (orders) {
			const transformedSteps = orderLogList?.map((log, index) => {
				const isLast = index === orderLogList?.length - 1;

				const isErrorStatus = [3, 4, 7].includes(log.Status);

				const isSuccessStatus = log.Status === 8;

				const isStatus2 = log.Status === 2;

				const isStatus6 = log.Status === 6;

				let icon = isErrorStatus ? (
					<CloseCircleOutlined style={{color: 'red'}} />
				) : isSuccessStatus ? (
					<CheckCircleOutlined style={{color: 'green'}} />
				) : isLast ? (
					<ClockCircleOutlined />
				) : null;

				return {
					dot: icon,
					label: null,
					children: (
						<div>
							<div className="font-semibold">{log.CreatedDate}</div>
							<div>{log.Message}</div>
							{/* Hiển thị nút cho cả trạng thái 2 và 5 */}
							{(isStatus2 || isStatus6) && (
								<Button
									type="link"
									className="text-primary"
									onClick={() => {
										handleViewDetailProcessing(log);
									}}
								>
									Xem chi tiết
								</Button>
							)}
						</div>
					),
				};
			});

			setFilteredSteps(transformedSteps);
		}
	}, [orderLogList]);

	useEffect(() => {
		if (log) {
			dispatch(getProcessingDetail({orderId: log.OrderId, logId: log.Id}));
		}
	}, [log, dispatch]);

	const handleViewDetailProcessing = (log) => {
		setLog(log);

		setModalVisible(true);
	};

	const handleCloseModal = () => {
		setModalVisible(false); // Close modal
	};

	return (
		<div className="w-full my-10">
			<Timeline reverse={true} items={filteredSteps} mode="left" />

			<Modal
				title="Chi tiết trạng thái"
				visible={modalVisible}
				onCancel={handleCloseModal}
				footer={null}
			>
				<Timeline mode="left">
					{Array.isArray(childLogList?.ChildLogs) &&
						childLogList.ChildLogs.map((log) => (
							<Timeline.Item key={log?.Id}>
								<div className="font-semibold">{log?.CreatedDate}</div>
								<div>{log?.Message}</div>
								{log?.LogImages?.map((image, index) => (
									<Image
										key={index}
										src={image?.MediaPath}
										height={50}
										width={50}
										style={{marginRight: 10, marginTop: 5}}
									/>
								))}
							</Timeline.Item>
						))}
				</Timeline>
			</Modal>
		</div>
	);
};
