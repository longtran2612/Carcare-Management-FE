import React, { useState, useEffect } from "react";
import { getPromotionDetailByLineId } from "pages/api/promotionDetail";
import {
  Drawer,
  Form,
  Row,
  Col,
  Button,
  Input,
  Select,
  Space,
  InputNumber,
  Typography,
  Divider,
} from "antd";
import Loading from "components/Loading";
import { validateMessages } from "utils/messageForm";

function DrawerPromorionDetail({ lineId, show, onSuccess, handleCancel }) {
  const [promotionDetail, setPromotionDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const getPromotionDetail = async () => {
    // setLoading(true);
    try {
      const response = await getPromotionDetailByLineId(lineId);
      setPromotionDetail(response.data.Data[0]);
      console.log(response.data.Data[0]);
      form.setFieldsValue({
        description: response.data.Data[0].description,
        type: response.data.Data[0].type,
        value: response.data.Data[0].value,
        amount: response.data.Data[0].amount,
        maximumDiscount: response.data.Data[0].maximumDiscount,
        minimumSpend: response.data.Data[0].minimumSpend,
      });
      // setLoading(false);
    } catch (error) {
      console.log(error);
      // setLoading(false);
    }
  };
  const onFinish = (values) => {
    console.log(values);
  };

  useEffect(() => {
    if (show) {
      getPromotionDetail();
    }
  }, [show]);

  return (
    <>
      <Drawer
        width={640}
        placement="right"
        closable
        onClose={handleCancel}
        open={show}
        visible={show}
        bodyStyle={{ padding:40 }}
        extra={
          <Space>
            <Button onClick={handleCancel}>Hủy</Button>
            <Button onClick={onFinish} type="primary">
              Lưu
            </Button>
          </Space>
        }
      >
        <Form
          form={form}
          layout="vertical"
          autoComplete="off"
          validateMessages={validateMessages}
        >
          <Divider><Typography.Title level={4} > Chi tiết khuyến mãi</Typography.Title> </Divider>
          <Row gutter={[16, 4]}>
            <Col span={24}>
              <Form.Item
                label="Mô tả"
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
            <Col span={12}>
              <Form.Item
                label="Loại khuyến mãi"
                name="type"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Select disabled='true'>
                  <Select.Option value="MONEY">Giảm tiền</Select.Option>
                  <Select.Option value="PERCENTAGE">
                    Giảm tiền theo %
                  </Select.Option>
                  <Select.Option value="GIFT">Tặng quà</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Giá trị"
                name="amount"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <InputNumber min={0} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Giá trị đơn hàng tối thiểu"
                name="minimumSpend"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <InputNumber min={0} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Số tiền tối đa được giảm"
                name="maximumDiscount"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <InputNumber min={0} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Drawer>

      <Loading loading={loading} />
    </>
  );
}

export default DrawerPromorionDetail;
