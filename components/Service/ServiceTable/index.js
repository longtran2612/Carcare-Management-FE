import { Table, Tag, Space, Button } from "antd";
import React, { useState, useEffect } from "react";
import { getServices, removeServiceApi } from "api/serviceAPI";
import ModalAddService from "components/Modal/ModalAddService";
import ModalQuestion from "components/Modal/ModalQuestion";

function ServiceTable({}) {
  const [services, setServices] = useState([]);
  const [servicesItem, setServicesItem] = useState(null);
  const [modalService, setModalService] = useState(false);
  const [modalQuestion, setModalQuestion] = useState(false);
  const [id, setId] = useState(null);

  const columns = [
    {
      title: "STT",
      dataIndex: "key",
      key: "key",
      render: (text, record, dataIndex) => {
        return <div>{dataIndex + 1}</div>;
      },
    },
    {
      title: "Mã dịch vụ",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Tên dịch vụ",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Trạng thái",
      key: "status",
      dataIndex: "status",
      render: (status) => {
        return (
          <>
            {status === "ACTIVE" ? (
              <Tag color={"green"}>{"Hoạt động"}</Tag>
            ) : (
              <Tag color={"red"}>{"Không hoạt động"}</Tag>
            )}
          </>
        );
      },
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space size={8}>
          <Button
            type="primary"
            onClick={() => {
              setModalService(true);
              setServicesItem(record);
            }}
          >
            Cập nhật
          </Button>
          <Button
            type="primary"
            danger
            onClick={() => {
              setModalQuestion(true);
              setId(record.id);
            }}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  const handleGetServices = async () => {
    try {
      getServices().then((res) => {
        if (res.data.StatusCode == 200) {
          setServices(res.data.Data);
        } else {
          message.error(res.data.message);
        }
      });
    } catch (err) {
      console.log(err);
    }
  };
  const handleRemoveService = async () => {
    try {
      const res = await removeServiceApi(id);
      if (res.data.StatusCode == 200) {
        handleGetServices();
        setModalQuestion(false);
        setId(null);
      }
    } catch (error) {}
  };

  useEffect(() => {
    handleGetServices();
  }, []);

  const handleSuccessCreateService = (data) => {
    let newArr = [...services];
    newArr.push(data);
    setServices(newArr);
  };

  return (
    <>
      <Button type="primary" onClick={() => setModalService(true)}>
        Thêm dịch vụ
      </Button>
      <Table columns={columns} dataSource={services} />
      <ModalAddService
        show={modalService}
        handleCancel={() => setModalService(false)}
        onSuccess={(data) => handleSuccessCreateService(data)}
        item={servicesItem}
      />
      <ModalQuestion
        title="Bạn có chắc chắn muốn xóa dịch vụ này không?"
        visible={modalQuestion}
        handleCancel={() => setModalQuestion(false)}
        handleOk={() => handleRemoveService()}
      />
    </>
  );
}

export default ServiceTable;
