import React, { useState, useEffect } from "react";
import { Modal, Row, Col, Form, Select, InputNumber } from "antd";
import { createPrice } from "pages/api/priceAPI";
import { getServices } from "pages/api/serviceAPI";

import { validateMessages } from "utils/messageForm";
import { openNotification } from "utils/notification";

const ModalAddPrice = ({ priceHeaderId, show, onSuccess, handleCancel }) => {
  const [form] = Form.useForm();
  const [currency, setCurrency] = useState("VND");
  const [serviceSelected, setServiceSelected] = useState(null);
  const onFinish = async (values) => {
    let priceCreateData = {
      name: serviceSelected.name,
      currency: currency,
      type: "New",
      price: values.price,
      priceHeaderId: priceHeaderId,
      serviceId: values.serviceId,
    };
    try {
      console.log(priceCreateData);
      const res = await createPrice(priceCreateData);
      openNotification("Thành công!", "tạo mới giá thành công");
      handleCancel();
      onSuccess(res?.data?.Data);
      form.resetFields();
    } catch (error) {
      if (error?.response?.data?.message) {
        openNotification(error?.response?.data?.message);
      } else {
        openNotification("Thất bại","Có lỗi xảy ra, vui lòng thử lại sau");
      }
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
  const handleChangedService = (value) => {
    const service = listService.find((item) => item.id === value);
    setServiceSelected(service);
  };

  useEffect(() => {
    if (show) {
      handleFetchService();
    }
  }, [show]);

  const selectCurrency = (
    <Select
      defaultValue="VND"
      style={{
        width: 60,
      }}
      value={currency}
      onChange={(value) => setCurrency(value)}
    >
      <Option value="VND">Đ</Option>
      <Option value="USD">$</Option>
      <Option value="EUR">€</Option>
      <Option value="GBP">£</Option>
      <Option value="CNY">¥</Option>
    </Select>
  );
  return (
    <>
      <Modal
        title="Thêm giá mới"
        visible={show}
        onOk={() => {
          form
            .validateFields()
            .then((values) => {
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
          <Row gutter={[16]}>
            <Col span={12}>
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
                  onChange={handleChangedService}
                  showSearch
                  placeholder="Chọn dịch vụ"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
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
            <Col span={12}>
              <Form.Item
                label="Giá"
                name="price"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <InputNumber
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                  addonAfter={selectCurrency}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};

export default ModalAddPrice;
