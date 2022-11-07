import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Select, Col, Row, Cascader } from "antd";
import { createUser } from "pages/api/userAPI";
import { validateMessages } from "utils/messageForm";
import { openNotification } from "utils/notification";
import JsonData from "data/address-vn.json";

const { TextArea } = Input;
const { Option } = Select;

function ModalAddUser ({ show, onSuccess, handleCancel }) {
  const [form] = Form.useForm();
  const [addressData, setAddressData] = useState(JsonData);

  const [provinceSelected, setProvinceSelected] = useState("");
  const [districtSelected, setDistrictSelected] = useState("");
  const [wardSelected, setWardSelected] = useState("");
  const [provinceSelectedCode, setProvinceSelectedCode] = useState("");
  const [districtSelectedCode, setDistrictSelectedCode] = useState("");
  const [wardSelectedCode, setWardSelectedCode] = useState("");

  const onFinish = async (values) => {
    const dataUser = {
      fullname: values.fullname,
      email: values.email,
      phone: values.phone,
      address:values.address,
      district: districtSelected,
      province: provinceSelected,
      ward:wardSelected,
      districtCode: districtSelectedCode,
      provinceCode: provinceSelectedCode,
      wardCode:wardSelectedCode,
    };
    console.log("data create",dataUser);

    try {
      const res = await createUser(dataUser);
      console.log(res);
      openNotification("Thành công!", "Tạo mới người dùng thành công");
      handleCancel();
      onSuccess(res?.data?.Data);
      form.resetFields();

    } catch (error) {
      if (error?.response?.data?.message) {
        openNotification(error?.response?.data?.message[0]);
      } else {
        openNotification("Thất bại","Có lỗi xảy ra, vui lòng thử lại sau");
      }
    }
  };

  const onChange = (value, selectedOptions) => {
    console.log(value, selectedOptions);
    if (selectedOptions) {
      setProvinceSelected(selectedOptions[0]?.label);
      setDistrictSelected(selectedOptions[1]?.label);
      setWardSelected(selectedOptions[2]?.label);
      setProvinceSelectedCode(selectedOptions[0]?.value);
      setDistrictSelectedCode(selectedOptions[1]?.value);
      setWardSelectedCode(selectedOptions[2]?.value);
    }
  };
  const filter = (inputValue, path) =>
    path.some(
      (option) =>
        option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1
    );

  return (
    <>
      <Modal
        title="Thêm nhân viên mới"
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
          onFinish={onFinish}
          autoComplete="off"
        >
          <Row gutter={[16, 4]}>
            <Col span={24}>
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập họ tên!",
                  },
                ]}
                label="Tên người dùng"
                name="fullname"
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                rules={[
                  {
                    pattern: new RegExp("^(84|0[3|5|7|8|9])+([0-9]{8})$"),
                    required: true,
                    message:
                      "Số điện thoại không hợp lệ! Số điện thoại bao gồm 10 ký tự số bắt đầu là 84 hoặc 03, 05, 07, 08, 09",
                  },
                ]}
                name="phone"
                label="Số điện thoại"
              >
                <Input
                  minLength={10}
                  maxLength={10}
                  placeholder="số điện thoại"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="email" label="Email">
                <Input />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="addressvn" label="Tỉnh/Thành phố - Quận - Huyện">
                <Cascader
                  options={addressData}
                  onChange={onChange}
                  placeholder="Tỉnh/Thành phố - Quận - Huyện"
                  showSearch={{
                    filter,
                  }}
                  onSearch={(value) => console.log(value)}
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="address" label="Địa chỉ chi tiết">
                <TextArea rows={2} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};

export default ModalAddUser;
