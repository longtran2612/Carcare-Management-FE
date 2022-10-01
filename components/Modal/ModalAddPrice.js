import React, { useState, useEffect } from "react";
import { Modal,Row,Col, Button, Form, Input, Select, Switch, InputNumber } from "antd";
import { createPrice } from "pages/api/priceAPI";
import { getServices } from "pages/api/serviceAPI";

import { validateMessages } from "utils/messageForm";
import { openNotification } from "utils/notification";


const ModalAddPrice = ({ priceHeaderId,show, onSuccess, handleCancel }) => {
  const [form] = Form.useForm();
  const onFinish = async (values) => {
    let priceCreateData = {
      name: values.name,
      price: values.price,
      priceHeaderId: priceHeaderId,
      parentId: values.serviceId,
    };
    try {
      const res = await createPrice(priceCreateData);
      openNotification("Tạo giá thành công thành công!", "");
      handleCancel();
      onSuccess(res.data.Data);
    } catch (error) {
      console.log(error);
    }
  };

  const [listService, setListService] = useState([]);

  const handleFetchService = async () => {
    try {
      const res = await getServices();
      setListService(res.data.Data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (show) {
      handleFetchService();
    }
  }, [show]);

  return (
    <>
      <Modal
        title="Thêm giá mới"
        visible={show}
        onOk={() => {
          form
            .validateFields()
            .then((values) => {
              form.resetFields();
              onFinish(values);
            })
            .catch((info) => {
              console.log("Validate Failed:", info);
            });
        }}
        onCancel={handleCancel}
        width={700}
        okText="Xác nhận"
        cancelText="Hủy bỏ"
      >
        <Form
          form={form}
          layout="vertical"
          autoComplete="off"
          validateMessages={validateMessages}
        >
           <Row>
            <Col span={7} className="MarRight20">
          <Form.Item
            label="Tên giá"
            name="name"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input />
          </Form.Item>
          </Col>
          <Col span={7}  className="MarRight20">
          <Form.Item
            label="Giá"
            name="price"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <InputNumber prefix='VND' min={0} style={{width:'100%'}} />
          </Form.Item>
          </Col>
          <Col span={7} >
          <Form.Item
            label="Dịch vụ"
            rules={[
              {
                required: true,
              },
            ]}
            name="serviceId"
          >
            <Select
              showSearch
              placeholder="Chọn dịch vụ"
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              
            >
              {listService?.map((item) => {
                return (
                  <Select.Option key={item.id} value={item.id}>
                    {item.name}
                  </Select.Option>
                );
              })}
            </Select>
          </Form.Item>
          </Col>
          </Row>
        
        </Form>
      </Modal>
    </>
  );
};

export default ModalAddPrice;
