import React, {useEffect, useRef, useState} from 'react';
import {CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined} from '@ant-design/icons';
import {Timeline} from 'antd';
import {useDispatch, useSelector} from 'react-redux';
import debounce from 'lodash/debounce';
import {getOrderLog} from '../../../../../redux/slices/orderSlice';
import {getOrderDetailSelector, getOrderLogsDetailSelector} from '../../../../../redux/selectors';
import {convertToVietnamDate} from '../../../../../utils';

const OrderStatus = {
	Pending: 1,
	Cancelled: 2,
	Processing: 3,
	Prepared: 4,
	Delivering: 5,
	Delivery_Failed: 6,
	Success: 7,
	Rejected: 8,
};

export const TimeLine = ({status, orders, loading, id}) => {
	const dispatch = useDispatch();
	const orderDetail = useSelector(getOrderDetailSelector);
	const orderLogList = useSelector(getOrderLogsDetailSelector);

	const [filteredSteps, setFilteredSteps] = useState([]);

	useEffect(() => {
		if (orderLogList) {
			const transformedSteps = orderLogList.map((log, index) => {
				const isLast = index === orderLogList.length - 1;
				const isErrorStatus = [3, 4, 7].includes(log?.Status);
				console.log('isErrorStatus', isErrorStatus);

				let icon = isErrorStatus ? (
					<CloseCircleOutlined style={{color: 'red'}} />
				) : log?.Status === 8 ? (
					<CheckCircleOutlined style={{color: 'green'}} />
				) : isLast ? (
					<ClockCircleOutlined />
				) : null;

				return {
					dot: icon,
					label: null, // Không sử dụng label để tránh hiển thị bên trái
					children: (
						<div>
							<div className="font-semibold">
								{convertToVietnamDate(log.CreatedDate)}
							</div>
							<div>{log.Message}</div>
						</div>
					),
				};
			});
			setFilteredSteps(transformedSteps);
		}
	}, [orderLogList]);

	return (
		<div className="w-full my-10">
			<Timeline reverse={true} items={filteredSteps} mode="left" />
		</div>
	);
};
