import { Table, Tag, Button } from "antd";
import React, { useState, useEffect } from "react";
import { getServices, removeServiceApi } from "api/serviceAPI";
import ModalAddService from "components/Modal/ModalAddService";
import { useRouter } from "next/router";
import ServiceDetail from "../ServiceDetail";

function ServiceTable({}) {
  const [services, setServices] = useState([]);
  const [modalService, setModalService] = useState(false);
  const [id, setId] = useState(null);
  const router = useRouter();
  const { serviceId } = router.query;

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
      {serviceId ? (
        <ServiceDetail
          serviceId={serviceId}
          onUpdateService={handleGetServices}
        />
      ) : (
        <div>
          <Button type="primary" onClick={() => setModalService(true)}>
            Thêm dịch vụ
          </Button>
          <Table
            columns={columns}
            dataSource={services}
            onRow={(record, rowIndex) => {
              return {
                onClick: (event) => {
                  router.push(`/admin?serviceId=${record.id}`);
                },
              };
            }}
          />
        </div>
      )}
      <ModalAddService
        show={modalService}
        handleCancel={() => setModalService(false)}
        onSuccess={(data) => handleSuccessCreateService(data)}
      />
    </>
  );
}

export default ServiceTable;
