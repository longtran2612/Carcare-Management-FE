import { Table, Tag, Space, Button } from "antd";
import React, { useState, useEffect } from "react";
import { getCar } from "api/carAPI";
import ModalAddService from "components/Modal/ModalAddService";
import ModalQuestion from "components/Modal/ModalQuestion";

function CarTable({}) {
  const [cars, setCars] = useState([]);
  // const [servicesItem, setServicesItem] = useState(null);
  const [modalCar, setModalCar] = useState(false);
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
      title: "MÃ",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Tên xe",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Mẫu xe",
      dataIndex: "carModelId",
      key: "carModelId",
    },
    {
      title: "Biển số xe",
      dataIndex: "licensePlate",
      key: "licensePlate",
    },
    {
      title: "Màu xe",
      dataIndex: "color",
      key: "color",
    },
    {
      title: "Sở hữu",
      dataIndex: "userId",
      key: "userId",
    },
    // {
    //   title: "Hành động",
    //   key: "action",
    //   render: (_, record) => (
    //     <Space size={8}>
    //       <Button
    //         type="primary"
    //         onClick={() => {
    //           setModalCar(true);
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

  const handleGetCar = async () => {
    try {
      getCar().then((res) => {
        if (res.data.StatusCode == 200) {
          setCars(res.data.Data);
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
    handleGetCar();
  }, []);

  // const handleSuccessCreateService = (data) => {
  //   let newArr = [...services];
  //   newArr.push(data);
  //   setServices(newArr);
  // };

  return (
    <>
      <Button type="primary" onClick={() => setModalCar(true)}>
        Thêm Xe
      </Button>
      <Table columns={columns} dataSource={cars} />
      {/* <ModalAddService
        show={modalCar}
        handleCancel={() => setModalCar(false)}
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

export default CarTable;
