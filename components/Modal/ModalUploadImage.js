import React from "react";
import { Modal } from "antd";

const ModalUploadImage = ({ visible, handleCancel, handleOk, listImage }) => {
  return (
    <Modal
      visible={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      okText="Xác nhận"
      cancelText="Hủy bỏ"
    >
      <div className="image-view">
        {listImage?.map((image, index) => {
          return (
            <div className="image-view--content" key={index}>
              <img src={image} />
            </div>
          );
        })}
      </div>
    </Modal>
  );
};

export default ModalUploadImage;
