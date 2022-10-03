import React, { useEffect, useState, useRef } from "react";
import {
  Col,
  Row,
  Image,
  Button,
  Form,
  Select,
  Typography,
  Input,
  DatePicker,
  Timeline,
  InputNumber,
  Upload,
} from "antd";
import { useRouter } from "next/router";
import { openNotification } from "utils/notification";
import { getCarById } from "pages/api/carAPI";
import { getCarModel } from "pages/api/carModel";
import { getUsers } from "pages/api/userAPI";
import { validateMessages } from "utils/messageForm";
import moment from "moment";
import ModalUploadImage from "components/Modal/ModalUploadImage";
import { UploadOutlined } from "@ant-design/icons";
import Loading from "components/Loading";
const formatDate = "YYYY/MM/DD";
const { Title } = Typography;

const CarDetail = ({ carId, onUpdateCar }) => {
  const router = useRouter();
  const [form] = Form.useForm();
  const { TextArea } = Input;
  const [carDetail, setCarDetail] = useState({});
  const [modalUpload, setModalUpload] = useState(false);
  const [carModels, setCarModels] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [listFiles, setListFiles] = useState({
    images: [],
    imageBlob: [],
  });
  const [modalQuestion, setModalQuestion] = useState(false);
  console.log(carDetail);
  const fetchcarDetail = async () => {
    setLoading(true);
    try {
      const response = await getCarById(carId);
      setCarDetail(response.data.Data);
      form.setFieldsValue({
        id: response.data.Data.id,
        name: response.data.Data.name,
        color: response.data.Data.color,
        licensePlate: response.data.Data.licensePlate,
        description: response.data.Data.description,
        user: response.data.Data.user,
        carModel: response.data.Data.carModel,
      });
      setLoading(false);
    } catch (error) {
      setLoading(false);
      openNotification(error.response.Message);
    }
  };

  useEffect(() => {
    getCarModels();
    getUsersData();
    if (carId) {
      fetchcarDetail();
    }
  }, [carId]);

  const getCarModels = async () => {
    setLoading(true);
    try {
      const res = await getCarModel();
      setCarModels(res.data.Data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  const getUsersData = async () => {
    setLoading(true);
    try {
      const res = await getUsers();
      setUsers(res.data.Data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const onFinish = async (values) => {
    try {
      let body = {
        name: values.name,
        email: values.email,
        address: values.address,
        status: values.status,
        image: values.image,
        birthDay: values.birthDay,
      };
      const res = await updateUserById(body, carId);
      if (res.data.StatusCode == "200") {
        openNotification("Cập nhật người dùng thành công!", "");
        onUpdateCar();
      }
    } catch (error) {
      console.log(error);
    }
  };
  // handle upload image

  const handleFileChosen = (info) => {
    console.log(info);
    const result = info.fileList.map((file) => {
      const blob = new Blob([file.originFileObj], {
        type: file.type,
      });
      return (window.URL || window.webkitURL).createObjectURL(blob);
    });
    setListFiles({ images: info.fileList, imageBlob: result });
    setModalUpload(true);
  };

  const handleUploadImages = async () => {
    try {
      const formData = new FormData();
      listFiles.images.map((image) => {
        formData.append("files", image.originFileObj);
      });

      const response = await uploadImagesUser(formData);
      setListFiles({ images: [], imageBlob: [] });
      setModalUpload(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      
      <Row>
        <Col span={6}>
          <Image width={300} height={250} src={carDetail.imageUrl} />
          <div
            style={{
              marginTop: "10px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Upload
              onChange={(info) => handleFileChosen(info)}
              multiple
              showUploadList={false}
              fileList={listFiles.imageBlob}
            >
              <Button icon={<UploadOutlined />}>Tải hình lên</Button>
            </Upload>
          </div>
        </Col>
        <Col span={17}>
          <Form
            form={form}
            layout="vertical"
            autoComplete="off"
            validateMessages={validateMessages}
          >
            <Row>
              <Col span={11} className="MarRight40">
                <Form.Item
                  label="Tên mẫu xe"
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
              <Col span={5} className="MarRight20">
                <Form.Item
                  label="Màu sắc"
                  name="color"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={5} className="MarRight20">
                <Form.Item
                  label="Biển số xe"
                  name="licensePlate"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              {/* <Col span={11} className="MarRight40">
              <Form.Item label="Mẫu xe" name="carModelId">
                <Select
                  showSearch
                  placeholder="Chọn mẫu xe"
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
                  {carModels.map((item, index) => {
                    return (
                      <Select.Option key={index} value={item.id}>
                        {item.name}
                      </Select.Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
            <Col span={10}>
              <Form.Item
                label="Người sở hữu"
                name="userId"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Select
                  showSearch
                  placeholder="Người sở hữu"
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
                  {users.map((item, index) => {
                    return (
                      <Select.Option key={index} value={item.id}>
                        {item.name}
                      </Select.Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col> */}
              <Col span={23}>
                <Form.Item label="Mô tả" name="description">
                  <TextArea rows={4} />
                </Form.Item>
              </Col>
              <Col span={14} className="MarRight40">
                <Title level={4}>Người sở hữu</Title>
                <Timeline style={{marginTop:'20px'}}>
                  <Timeline.Item>Tên: {carDetail?.user?.name}</Timeline.Item>
                  <Timeline.Item>
                    Số điện thoại: {carDetail?.user?.phone}
                  </Timeline.Item>
                </Timeline>
              </Col>
              <Col span={6}>
                <Title level={4}>Thông tin mẫu xe</Title>
                <Timeline style={{marginTop:'20px'}}>
                  <Timeline.Item>
                    Loại xe: {carDetail?.carModel?.model}
                  </Timeline.Item>
                  <Timeline.Item>
                    Nhãn hiệu: {carDetail?.carModel?.brand}
                  </Timeline.Item>
                  <Timeline.Item>
                    Nhiên liệu: {carDetail?.carModel?.fuel}
                  </Timeline.Item>
                  <Timeline.Item>
                    Hộp số: {carDetail?.carModel?.transmission}
                  </Timeline.Item>
                  <Timeline.Item>
                    Chỗ ngồi: {carDetail?.carModel?.seats}
                  </Timeline.Item>
                </Timeline>
              </Col>
            </Row>
            <div style={{bottom:'0',right:'20px'}} className="service-action">
              <div style={{ marginRight: "20px" }}>
                <Button
                  onClick={() => {
                    router.push("/admin");
                  }}
                >
                  Đặt lại
                </Button>
              </div>
              <div>
                <Button
                  type="primary"
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
                >
                  Cập nhật
                </Button>
              </div>
            </div>
          </Form>
        </Col>
      </Row>
      <ModalUploadImage
        visible={modalUpload}
        handleCancel={() => setModalUpload(false)}
        handleOk={() => handleUploadImages()}
        listImage={listFiles.imageBlob}
      />
      <Loading loading={loading} />
    </>
  );
};

export default CarDetail;
