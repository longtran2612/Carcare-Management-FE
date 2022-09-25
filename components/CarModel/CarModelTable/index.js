import { Table, Tag, Space, Button } from "antd";
import React, { useState, useEffect } from "react";
import { getCarModel } from "pages/api/carModel";
import ModalAddService from "components/Modal/ModalAddService";
import ModalQuestion from "components/Modal/ModalQuestion";

function CarModelTable({}) {
  const [carModels, setCarModels] = useState([]);
  // const [servicesItem, setServicesItem] = useState(null);
  const [modalCarModel, setModalCarModel] = useState(false);
  // const [modalQuestion, setModalQuestion] = useState(false);
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
      title: "",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Tên mẫu xe",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Hãng xe",
      dataIndex: "brand",
      key: "brand",
    },
    {
      title: "Model",
      dataIndex: "model",
      key: "model",
    },
    {
      title: "Động cơ",
      dataIndex: "engine",
      key: "engine",
    },
    {
      title: "Truyền động",
      dataIndex: "transmission",
      key: "transmission",
    },
    {
      title: "Số nghế ngồi",
      dataIndex: "seats",
      key: "seats",
    },
    {
      title: "Nhiên liệu",
      dataIndex: "fuel",
      key: "fuel",
    },
    // {
    //   title: "Hành động",
    //   key: "action",
    //   render: (_, record) => (
    //     <Space size={8}>
    //       <Button
    //         type="primary"
    //         onClick={() => {
    //           setModalCarModel(true);
    //           setServicesItem(record);
    //         }}
    //       >
    //         Cập nhật
    //       </Button>
    //       <Button
    //         type="primary"
    //         danger
    //         onClick={() => {
    //           setModalQuestion(true);
    //           setId(record.id);
    //         }}
    //       >
    //         Xóa
    //       </Button>
    //     </Space>
    //   ),
    // },
  ];

  const handleGetCarModel = async () => {
    try {
      getCarModel().then((res) => {
        if (res.data.StatusCode == 200) {
          setCarModels(res.data.Data);
        } else {
          message.error(res.data.message);
        }
      });
    } catch (err) {
      console.log(err);
    }
  };
  // const handleRemoveService = async () => {
  //   try {
  //     const res = await removeServiceApi(id);
  //     if (res.data.StatusCode == 200) {
  //       handleGetServices();
  //       setModalQuestion(false);
  //       setId(null);
  //     }
  //   } catch (error) {}
  // };

  useEffect(() => {
    handleGetCarModel();
  }, []);

  // const handleSuccessCreateService = (data) => {
  //   let newArr = [...services];
  //   newArr.push(data);
  //   setServices(newArr);
  // };

  return (
    <>
      <Button type="primary" onClick={() => setModalCarModel(true)}>
        Thêm mẫu xe
      </Button>
      <Table columns={columns} dataSource={carModels} />
      {/* <ModalAddService
        show={modalService}
        handleCancel={() => setModalCarModel(false)}
        onSuccess={(data) => handleSuccessCreateService(data)}
        item={servicesItem}
      />
      <ModalQuestion
        title="Bạn có chắc chắn muốn xóa dịch vụ này không?"
        visible={modalQuestion}
        handleCancel={() => setModalQuestion(false)}
        handleOk={() => handleRemoveService()}
      /> */}
    </>
  );
}

export default CarModelTable;
