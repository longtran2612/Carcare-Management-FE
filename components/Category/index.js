import React from 'react'
import { Button, Col, Pagination, Row, Space } from "antd";
import {PlusCircleOutlined} from '@ant-design/icons';
import CategoryTable from './CategoryTable';


 const CategoryPage = () => {
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const showModal = () => {
    setIsModalVisible(true);
  };
  const handleOnClick = () => {
    showModal();
  };

  return <>
  <Row justify="space-between" gutter={[8, 8]}>
				<Col xs={24} sm={24} md={24} lg={4} xl={4}>
					{/* <Button
						type="primary"
						onClick={handleOnClick}
						icon={<PlusCircleOutlined />}
					>
						Thêm Khách Hàng
					</Button> */}
				</Col>
				{/* <CourseSearch topics={topics} onChange={handleSearchChange} /> */}
			</Row>
      
			<Space direction="vertical" style={{ width: "100%" }}>
				<div>
        <CategoryTable/>
				</div>
				<div style={{ textAlign: "right" }}>
					{/* <Pagination
						current={page + 1}
						total={totalPages * 10}
						onChange={handlePageChange}
						showSizeChanger={false}
					/> */}
				</div>
			</Space>

  
  </>
  W
}
export default CategoryPage;