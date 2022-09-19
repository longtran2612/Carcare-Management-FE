import React from "react";
import { Modal } from "antd";

const ModalQuestion = ({ visible, handleCancel, handleOk, title }) => {
  return (
    <>
      <Modal
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Xác nhận"
        cancelText="Hủy bỏ"
      >
        <p>{title}</p>
      </Modal>
    </>
  );
};

export default ModalQuestion;
