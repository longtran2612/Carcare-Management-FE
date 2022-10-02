import React, { useState, useEffect } from "react";
import {
  Modal,
  Button,
  Form,
  Input,
  Select,
  Col,
  Row,
  InputNumber,
} from "antd";
import { createUser } from "pages/api/userAPI";
import { validateMessages } from "utils/messageForm";
import { openNotification } from "utils/notification";
import {
  getDistrictsByProvinceCode,
  getProvinces,
  getWardsByDistrictCode,
} from "@do-kevin/pc-vn";

const { TextArea } = Input;
const { Option } = Select;

const ModalAddUser = ({ show, onSuccess, handleCancel }) => {
  const [form] = Form.useForm();
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const [provinceSelected, setProvinceSelected] = useState("");
  const [districtSelected, setDistrictSelected] = useState("");
  const [wardSelected, setWardSelected] = useState("");

  const onFinish = async (values) => {
    let dataUser = {
      fullname: values.fullname,
      email: values.email,
      phone: values.phone,
      address:
        provinceSelected +
        ", " +
        districtSelected +
        ", " +
        wardSelected +
        ", " +
        values.address,
    };
    console.log(dataUser);

    try {
      const res = await createUser(values);
      console.log(res);
      openNotification("Tạo người dùng thành công!", "");
      handleCancel();
      onSuccess(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    const fetchProvinces = async () => {
      const provinces = getProvinces();
      setProvinces(provinces);
    };
    fetchProvinces();
  }, []);

  const handleProvinceChange = async (value) => {
    const districts = getDistrictsByProvinceCode(value);
    setDistricts(districts);
    setProvinceSelected(getProvinceByCode(value));
  };
  const handleDistrictChange = async (value) => {
    const ward = getWardsByDistrictCode(value);
    setWards(ward);
    setDistrictSelected(getDistrictByCode(value));
  };
  const handleWardChange = async (value) => {
    setWardSelected(getWardByCode(value));
  };

  const getProvinceByCode = (code) => {
    const province = provinces.find((item) => item.code === code);
    return province.name;
  };
  const getDistrictByCode = (code) => {
    const district = districts.find((item) => item.code === code);
    return district.name;
  };
  const getWardByCode = (code) => {
    const ward = wards.find((item) => item.code === code);
    return ward.name;
  };

  return (
    <>
      <Modal
        title="Thêm người dùng mới"
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
          onFinish={onFinish}
          autoComplete="off"
        >
          <Row>
            <Col span={22}>
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
            <Col span={10} className="MarRight20">
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
            <Col span={11}>
              <Form.Item
                rules={[
                  {
                    pattern: new RegExp(
                      "^[a-z][a-z0-9_.]{5,32}@[a-z0-9]{2,}(.[a-z0-9]{2,4}){1,2}$"
                    ),
                    required: true,
                    message: "Email không hợp lệ!",
                  },
                ]}
                name="email"
                label="Email"
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={7} className="MarRight20">
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn tỉnh/thành phố!",
                  },
                ]}
                name="province"
                label="Tỉnh/Thành phố"
              >
                <Select
                  onChange={handleProvinceChange}
                  placeholder="Chọn tỉnh/thành phố"
                  showSearch
                  filterOption={(input, option) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {provinces.map((province) => (
                    <Option value={province.code}>{province.name}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={7} className="MarRight20">
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn quận/huyện!",
                  },
                ]}
                name="district"
                label="Quận/Huyện"
              >
                <Select
                  placeholder="Chọn quận/huyện"
                  showSearch
                  filterOption={(input, option) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                  onChange={handleDistrictChange}
                >
                  {districts.map((district) => (
                    <Option value={district.code}>{district.name}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={7}>
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn phường/xã!",
                  },
                ]}
                name="ward"
                label="Phường/Xã"
              >
                <Select
                  onChange={handleWardChange}
                  placeholder="Chọn phường/xã"
                  showSearch
                  filterOption={(input, option) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {wards.map((ward) => (
                    <Option value={ward.code}>{ward.name}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={22}>
              <Form.Item
                rules={[
                  {
                    required: true,
                  },
                ]}
                name="address"
                label="Địa chỉ chi tiết"
              >
                <TextArea rows={3} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};

export default ModalAddUser;
