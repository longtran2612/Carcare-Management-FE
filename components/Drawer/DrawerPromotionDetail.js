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
import { updatePromotionDetail } from "pages/api/promotionDetail";
import { getServices } from "pages/api/serviceAPI";
import { getCategories } from "pages/api/categoryAPI";
import Loading from "components/Loading";
import { validateMessages } from "utils/messageForm";
import TextArea from "antd/lib/input/TextArea";
import { openNotification } from "utils/notification";
import { formatCountdown } from "antd/lib/statistic/utils";

function DrawerPromorionDetail({ lineId, show, onSuccess, handleCancel }) {
  const [promotionDetail, setPromotionDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [showLimitAmount, setShowLimitAmount] = useState(false);
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
        categoryIds: response.data.Data[0].categoryIds,
        serviceIds: response.data.Data[0].serviceIds,
        customerType: response.data.Data[0].customerType,
        limitUsedTime: response.data.Data[0].limitUsedTime,
        limitPromotionAmount: response.data.Data[0].limitPromotionAmount,
        promotionUsedAmount: response.data.Data[0].promotionUsedAmount,
      });
      setShowLimitAmount(response.data.Data[0].limitPromotionAmount);
      // setLoading(false);
    } catch (error) {
      console.log(error);
      // setLoading(false);
    }
  };
  const onFinish = async (values) => {
    console.log(values);
    const dataUpdate = {
      description: values.description,
      type: values.type,
      minimumSpend: values.minimumSpend,
      categoryIds: values.categoryIds,
      customerType: values.customerType,
    };
    if (values.type === "PERCENTAGE") {
      (dataUpdate.maximumDiscount = values.maximumDiscount),
        (dataUpdate.amount = values.amount),
        (dataUpdate.limitUsedTime = values.limitUsedTime),
        (dataUpdate.limitPromotionAmount = values.limitPromotionAmount);
    }
    if (values.type === "MONEY") {
      (dataUpdate.amount = values.amount),
        (dataUpdate.limitUsedTime = values.limitUsedTime),
        (dataUpdate.limitPromotionAmount = values.limitPromotionAmount);
    }
    if (values.type === "SERVICE") {
      dataUpdate.serviceIds = [values.serviceIds];
    }

    try {
      console.log("data update", dataUpdate);
      const response = await updatePromotionDetail(
        dataUpdate,
        promotionDetail.id
      );
      // onSuccess(response.data.Data);
      // handleCancel();
      openNotification("Thành công", "Cập nhật chi tiết khuyến mãi thành công");
      getPromotionDetail();
    } catch (error) {
      if (error?.response?.data?.message) {
        openNotification(error?.response?.data?.message);
      } else {
        openNotification("Thất bại", "Có lỗi xảy ra, vui lòng thử lại sau");
      }
    }
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

  const onChange = () => {
    setShowLimitAmount(form.getFieldValue("limitUsedTime"));
  };
  // useEffect(() => {
  //   if (form.getFieldValue("limitUsedTime")) {
  //     setShowLimitAmount(form.getFieldValue("limitUsedTime"));
  //   }
  // }, [show, form]);

  useEffect(() => {
    if (show) {
      getPromotionDetail();
      fetchCategories();
      fetchService();
    }
  }, [show, lineId]);

  return (
    <>
      <Drawer
        width={640}
        placement="right"
        closable
        onClose={() => {
          handleCancel();
          form.resetFields();
        }}
        open={show}
        visible={show}
        bodyStyle={{ padding: 40 }}
        extra={
          <Space>
            <Button onClick={handleCancel}>Hủy</Button>
            <Button
              onClick={() => {
                form
                  .validateFields()
                  .then((values) => {
                    onFinish(values);
                  })
                  .catch((info) => {
                    console.log("Validate Failed:", info);
                  });
              }}
              type="primary"
            >
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
            <span>Chi tiết khuyến mãi</span>
          </Divider>
          <Row gutter={[16, 2]}>
            <Col span={24}>
              <Form.Item label="Mô tả" name="description">
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
                <Select disabled>
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
                label="Giá trị đơn hàng tối thiểu"
                name="minimumSpend"
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
                  addonAfter="Đ"
                  min={0}
                />
              </Form.Item>
            </Col>
            {promotionDetail?.type === "MONEY" && (
              <Col span={12}>
                <Form.Item
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                  label="Giá trị khuyến mãi (Tiền)"
                  name="amount"
                >
                  <InputNumber
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                    addonAfter="Đ"
                    min={0}
                  />
                </Form.Item>
              </Col>
            )}
            {promotionDetail?.type === "PERCENTAGE" && (
              <Col span={12}>
                <Form.Item
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập Số % giảm từ 0 - 100",
                    },
                  ]}
                  label="Giá trị khuyến mãi (%)"
                  name="amount"
                >
                  <InputNumber addonAfter="%" min={0} max={100} />
                </Form.Item>
              </Col>
            )}
            {promotionDetail?.type === "SERVICE" && (
              <Col span={24}>
                <Form.Item
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                  label="Dịch vụ khuyến mãi"
                  name="serviceIds"
                >
                  <Select
                    showSearch
                    placeholder="Chọn dịch vụ khuyến mãi"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children.includes(input)
                    }
                    filterSort={(optionA, optionB) =>
                      optionA.children
                        .toLowerCase()
                        .localeCompare(optionB.children.toLowerCase())
                    }
                  >
                    {services.map((service) => (
                      <Select.Option value={service.id}>
                        {service.serviceCode + " - " + service.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            )}

            {promotionDetail?.type === "PERCENTAGE" && (
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
                  <InputNumber
                    addonAfter="Đ"
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                    min={0}
                  />
                </Form.Item>
              </Col>
            )}
            {promotionDetail?.type === "MONEY" && <Col span={12}></Col>}
            <Col span={12}>
              <Form.Item label="Nhóm người dùng áp dụng" name="customerType">
                <Select>
                  <Select.Option value={0}>Tất cả</Select.Option>
                  <Select.Option value={1}>Thân thiết</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            {promotionDetail?.type != "SERVICE" && (
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
            )}
            <Col span={12}>
              <Form.Item label="Giới hạn ngân sách" name="limitUsedTime">
                <Select onChange={onChange}>
                  <Select.Option value={false}>Không</Select.Option>
                  <Select.Option value={true}>Có</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            {showLimitAmount && (
              <>
                <Col span={12}>
                  <Form.Item
                    label="Ngân sách giới hạn"
                    name="limitPromotionAmount"
                  >
                    <InputNumber
                      addonAfter="Đ"
                      formatter={(value) =>
                        `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      }
                      parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                      min={0}
                    />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item
                    label="Tổng tiền đã giảm"
                    name="promotionUsedAmount"
                  >
                    <InputNumber
                      disabled
                      addonAfter="Đ"
                      formatter={(value) =>
                        `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      }
                      parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                      min={0}
                    />
                  </Form.Item>
                </Col>
              </>
            )}
          </Row>
        </Form>
      </Drawer>

      <Loading loading={loading} />
    </>
  );
}

export default DrawerPromorionDetail;
