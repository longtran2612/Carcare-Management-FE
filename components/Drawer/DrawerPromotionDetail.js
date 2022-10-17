import React, { useState, useEffect } from "react";
import { getPromotionDetailByLineId } from "pages/api/promotionDetail";
import { Drawer, Form,Row ,Col,Button,Input  } from "antd";
import Loading from "components/Loading";
import { validateMessages } from "utils/messageForm";

function DrawerPromorionDetail({ lineId, show, onSuccess, handleCancel }) {
  const [promotionDetail, setPromotionDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const getPromotionDetail = async () => {
    setLoading(true);
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
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
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
        closable={false}
        onClose={handleCancel}
        open={show}
      >
        <Form
          form={form}
          layout="vertical"
          autoComplete="off"
          validateMessages={validateMessages}
        >
          <Row gutter={[16, 4]}>
            <Col span={18}>
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
            <Col span={6}>
              <Form.Item
                label="Loại khuyến mãi"
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
          </Row>
        </Form>
      </Drawer>

      <Loading loading={loading} />
    </>
  );
}

export default DrawerPromorionDetail;
