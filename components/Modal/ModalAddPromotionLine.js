import React from "react";
import { Modal, Form, Input, Row, Col, DatePicker, Select } from "antd";
import moment from "moment";
import { createPromotionLine } from "pages/api/promotionLineAPI";
import { validateMessages } from "utils/messageForm";
import { openNotification } from "utils/notification";
const formatDate = "DD/MM/YYYY";

const ModalAddPromotionLine = ({
  promotionHeaderId,
  show,
  onSuccess,
  handleCancel,
  endDate
}) => {
  const [form] = Form.useForm();
  const onFinish = async (values) => {
    let dataCreate = {
      promotionHeaderId: promotionHeaderId,
      ...values,
    };
    try {
      console.log(dataCreate);
      const res = await createPromotionLine(dataCreate);
      openNotification("Thành công", "tạo mới dòng khuyến mãi thành công");
      handleCancel();
      onSuccess(res?.data?.Data);
      form.resetFields();
    } catch (error) {
      if (error?.response?.data?.message) {
        openNotification(error?.response?.data?.message[0]);
      } else {
        openNotification("Thất bại", "Có lỗi xảy ra, vui lòng thử lại sau");
      }
    }
  };

  return (
    <>
      <Modal
        title="Thêm chương trình khuyến mãi mới"
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
            <Col span={18}>
              <Form.Item
                label="Tên chương trình khuyến mãi"
                name="description"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                label="Loại khuyến mãi"
                name="type"
                rules={[
                  {
                    required: true,
                  },
                ]}
                initialValue="MONEY"
              >
                <Select>
                  <Select.Option value="MONEY">Giảm tiền</Select.Option>
                  <Select.Option value="PERCENTAGE">
                    Giảm tiền theo %
                  </Select.Option>
                  <Select.Option value="SERVICE">Dịch vụ</Select.Option>
                </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Ngày bắt đầu"
                name="fromDate"
                rules={[
                  {
                    required: true,
                  },
                ]}
                initialValue={moment()}
              >
                <DatePicker
                  disabledDate={(d) =>
                    !d ||
                    d.isBefore(moment()) ||
                    d.isAfter(form.getFieldValue("toDate"))
                  }
                  placeholder="Ngày bắt đầu"
                  format={formatDate}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Ngày kết thúc"
                name="toDate"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <DatePicker
                  disabledDate={(d) =>
                    !d || d.isSameOrBefore(form.getFieldValue("fromDate")) || d.isAfter(endDate)
                  }
                  placeholder="Ngày kết thúc"
                  format={formatDate}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};

export default ModalAddPromotionLine;
