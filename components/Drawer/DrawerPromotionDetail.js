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
import { getServices } from "pages/api/serviceAPI";
import { getCategories } from "pages/api/categoryAPI";
import Loading from "components/Loading";
import { validateMessages } from "utils/messageForm";
import TextArea from "antd/lib/input/TextArea";

function DrawerPromorionDetail({ lineId, show, onSuccess, handleCancel }) {
  const [promotionDetail, setPromotionDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
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
  const fetchCategories = async () => {
    try {
      const response = await getCategories();
      setCategories(response.data.Data);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchService = async () => {
    try {
      const response = await getServices();
      setServices(response.data.Data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (show) {
      getPromotionDetail();
      fetchCategories();
      fetchService();
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
        bodyStyle={{ padding: 40 }}
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
          <Divider>
            <Typography.Title level={4}> Chi tiết khuyến mãi</Typography.Title>{" "}
          </Divider>
          <Row gutter={[16, 4]}>
            <Col span={24}>
              <Form.Item
                label="Mô tả"
                name="description"
              >
               <TextArea rows={2} />
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
                <Select disabled="true">
                  <Select.Option value="MONEY">Giảm tiền</Select.Option>
                  <Select.Option value="PERCENTAGE">
                    Giảm tiền theo %
                  </Select.Option>
                  <Select.Option value="GIFT">Tặng quà</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            {promotionDetail?.type === "MONEY" ? (
              <Col span={12}>
                <Form.Item label="Giá trị" name="amount">
                  <InputNumber addonAfter="Đ" min={0} />
                </Form.Item>
              </Col>
            ) : (
              promotionDetail?.type === "PERCENTAGE" && (
                <Col span={12}>
                  <Form.Item label="Giá trị" name="amount">
                    <InputNumber
                      addonAfter="%"
                      min={0}
                      max={100}
                      maxLength={3}
                    />
                  </Form.Item>
                </Col>
              )
            )}
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
                <InputNumber addonAfter="Đ" min={0} />
              </Form.Item>
            </Col>
            {promotionDetail?.type != "MONEY" && (
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
            )}
            <Col span={12}>
              <Form.Item label="Danh mục dịch vụ áp dụng" name="categoryIds">
                <Select mode="multiple">
                  {categories.map((category) => (
                    <Select.Option value={category.id}>
                      {category.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Nhóm người dùng áp dụng" name="groupIds">
                <Select mode="multiple">
                  <Select.Option value="1">Thân thiết</Select.Option>
                  <Select.Option value="2">VIP</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Dịch vụ áp dụng" name="serviceIds">
                <Select mode="multiple">
                  {services.map((service) => (
                    <Select.Option value={service.id}>
                      {service.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            {promotionDetail?.type === "GIFT" && (
              <Col span={12}>
                <Form.Item label="Dịch vụ khuyến mãi" name="serviveReceive">
                  <Select>
                    {services.map((service) => (
                      <Select.Option value={service.id}>
                        {service.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            )}
          </Row>
        </Form>
      </Drawer>

      <Loading loading={loading} />
    </>
  );
}

export default DrawerPromorionDetail;
