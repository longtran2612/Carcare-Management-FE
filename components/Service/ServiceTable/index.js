import { Table , message } from "antd";
import React, { useState, useEffect } from "react";
import Column from "antd/lib/table/Column";
import {getServices} from 'api/serviceAPI';
function ServiceTable(props) {

	const [services, setServices] = useState([]);

	const handleGetServices = async () => {
		try {
			getServices().then((res) => {
				console.log("res:", res);
				if (res.data.status == 1) {
					setServices(res.data.data);
				} else {
					message.error(res.message);
				}
			})
		}catch(err){
			console.log(err)
	  
		  }
	}

	useEffect(() => {
		handleGetServices()
	  }, []);

	return (
		<Table  pagination={false}>
			<Column
				align="center"
				width="60px"
				title="STT"
				dataIndex="stt"
				key="stt"
			/>
			<Column title="MÃ" dataIndex="name" key="name" />
			<Column
				title="Mã dịch vụ"
				dataIndex="topicId"
				key="id"
				// render={(_, record) => {
				// 	const result = topics
				// 		.filter((topic) => topic.id === record.topicId)
				// 		.map((topic) => topic.name);

				// 	return <>{result}</>;
				// }}
			/>
			<Column
				title="Tên dịch vụ"
				width="80px"
				dataIndex="wordNumber"
				key="wordNumber"
			/>
			{/* <Column
				key="action"
				align="center"
				render={(_, record, index) => {
					const course = handleRedundantProperty(record.id);
					return (
						<CourseAction
							course={course}
							setInitialValue={setInitialValue}
							setIsModalVisible={setIsModalVisible}
							setIsAddMode={setIsAddMode}
							query={query}
						/>
					);
				}}
			/> */}
		</Table>
	);
}



export default ServiceTable;
