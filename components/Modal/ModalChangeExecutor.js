import React, { useState, useEffect } from "react";
import { Modal, Row, Col, Select, Form } from "antd";

import { getUserAvaliable } from "pages/api/userAPI";
import { updateOrder } from "pages/api/orderAPI";
import { openNotification } from "utils/notification";
import Loading from "components/Loading";


const ModalChangeExcutor = ({ order, show, onSuccess, handleCancel }) => {
  const [form] = Form.useForm();
  const [userChange, setUserChange] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChangeUser = async () => {
    setLoading(true);
    let dataUpdate = {
      executorId: userChange,
      serviceIds: order?.services?.map((service) => service.id),
    };
    try {
      const res = await updateOrder(order?.id, dataUpdate);
      openNotification("Thành công!", "Cập nhật nhân viên xử lý thành công");
      onSuccess();
      setLoading(false);
    } catch (error) {
      if (error?.response?.data?.message) {
        openNotification(error?.response?.data?.message);
      } else {
        openNotification("Thất bại", "Có lỗi xảy ra, vui lòng thử lại sau");
      }
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await getUserAvaliable();
      setUsers(response.data.Data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (show) {
      fetchUsers();
    }
  }, [show]);

  return (
    <>
      <Modal
        title="Thay đổi nhân viên xử lý"
        width={700}
        onCancel={() => handleCancel()}
        visible={show}
        onOk={() => {
          handleChangeUser();
          handleCancel();
        }}
        okText="Thay đổi"
        cancelText="Hủy"
      >
        <Row>
          <Col span={24}>
            <span>Danh sách nhân viên sẵn sàng</span>
            <Select
              style={{ width: "100%", marginBottom: "10px" }}
              showSearch
              placeholder="Nhân viên xử lý"
              optionFilterProp="children"
              filterOption={(input, option) => option.children.includes(input)}
              filterSort={(optionA, optionB) =>
                optionA.children
                  .toLowerCase()
                  .localeCompare(optionB.children.toLowerCase())
              }
              onChange={(value) => {
                setUserChange(value);
              }}
            >
              {users.map((item) => (
                <Select.Option value={item.id}>
                  {item.name + " - " + item.phone}
                </Select.Option>
              ))}
            </Select>
          </Col>
        </Row>
      </Modal>
      <Loading loading={loading} />
    </>
  );
};

export default ModalChangeExcutor;
