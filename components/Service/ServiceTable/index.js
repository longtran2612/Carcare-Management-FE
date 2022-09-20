import { Table, Tag, Space, Button } from "antd";
import React, { useState, useEffect } from "react";
import { getServices, removeServiceApi } from "api/serviceAPI";
import ModalAddService from "components/Modal/ModalAddService";
import ModalQuestion from "components/Modal/ModalQuestion";

function ServiceTable({}) {
  const [services, setServices] = useState([]);
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
          {
            status === 'ACTIVE' ? (
              <Tag color={"green"}>
                {"Hoạt động"}
              </Tag>
            ) : (
              <Tag color={"red"}>
                {"Không hoạt động"}
              </Tag>
            )
          }
      
          </>
        );
      },
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space size={8}>
          <Button type="primary">Cập nhật</Button>
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
        if (res.data.status == 1) {
          setServices(res.data.data);
        } else {
          message.error(res.message);
        }
      });
    } catch (err) {
      console.log(err);
    }
  };
  const handleRemoveService = async () => {
    try {
      const res = await removeServiceApi(id);
      if (res.data.status == 1) {
        handleGetServices();
        setModalQuestion(false);
        setId(null);
      }
    } catch (error) {}
  };

  useEffect(() => {
    handleGetServices();
  }, []);

  return (
    <>
      <Button type="primary" onClick={() => setModalService(true)}>
        Thêm dịch vụ
      </Button>
      <Table columns={columns} dataSource={services} />
      <ModalAddService
        show={modalService}
        handleCancel={() => setModalService(false)}
        handleOk={() => console.log("bao")}
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
