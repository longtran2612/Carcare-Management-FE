import { Table, Tag, Space, Button } from "antd";
import React, { useState, useEffect } from "react";
import { getCar } from "pages/api/carAPI";
import ModalAddService from "components/Modal/ModalAddService";
import ModalQuestion from "components/Modal/ModalQuestion";
import ModalAddCar from "components/Modal/ModalAddCar";
import { useRouter } from "next/router";
import CarDetail from "../CarDetail";
function CarTable({}) {
  const [cars, setCars] = useState([]);
  const [modalCar, setModalCar] = useState(false);
  const [id, setId] = useState(null);
  const router = useRouter();
  const { carId } = router.query;

  const columns = [
    {
      title: "STT",
      dataIndex: "key",
      key: "key",
      width: 70,
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
      dataIndex: "carModel",
      key: "carModel",
      render: (carModel) => {
        return <div>{carModel.name}</div>;
      }
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
      dataIndex: "user",
      key: "user",
      render: (user) => {
        return <div>{user.name}</div>;
      }
      
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

  const handleSuccessCreateCar = (data) => {
    let newArr = [...cars];
    newArr.push(data);
    setCars(newArr);
  };

  return (
    <>
      {carId ? (
        <CarDetail carId={carId} onUpdateCar={handleGetCar} />
      ) : (
        <div>
          <Button type="primary" onClick={() => setModalCar(true)}>
            Thêm Xe
          </Button>
          <Table
            columns={columns}
            dataSource={cars}
            onRow={(record, rowIndex) => {
              return {
                onClick: (event) => {
                  router.push(`/admin?carId=${record.id}`);
                },
              };
            }}
          />
        </div>
      )}
      <ModalAddCar
        show={modalCar}
        handleCancel={() => setModalCar(false)}
        onSuccess={(data) => handleSuccessCreateCar(data)}
      />
      {/* <ModalQuestion
        title="Bạn có chắc chắn muốn xóa dịch vụ này không?"
        visible={modalQuestion}
        handleCancel={() => setModalQuestion(false)}
        handleOk={() => handleRemoveService()}
      /> */}
    </>
  );
}

export default CarTable;
