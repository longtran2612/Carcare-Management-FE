import { Table, Tag, Space, Button } from "antd";
import React, { useState, useEffect } from "react";
import { getCarModel } from "pages/api/carModel";
import { useRouter } from "next/router";
import ModalQuestion from "components/Modal/ModalQuestion";
import ModalAddCarModel from "components/Modal/ModalAddCarModal";
import CarModelDetail from "components/CarModel/CarModelDetail";

function CarModelTable({}) {
  const [carModels, setCarModels] = useState([]);
  const [modalCarModel, setModalCarModel] = useState(false);
  const [id, setId] = useState(null);
  const router = useRouter();
  const { carModelId } = router.query;

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
      title: "Mã",
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

  const handleSuccessCarModel = (data) => {
    let newArr = [...carModels];
    newArr.push(data);
    setServices(newArr);
  };

  return (
    <>
      {carModelId ? (
        <CarModelDetail 
          carModelId={carModelId}
          onUpdateCarModel={handleGetCarModel}
        />
      ) : (
        <div>
          <Button type="primary" onClick={() => setModalCarModel(true)}>
            Thêm mẫu xe
          </Button>
          <Table
            columns={columns}
            dataSource={carModels}
            onRow={(record, rowIndex) => {
              return {
                onClick: (event) => {
                  router.push(`/admin?carModelId=${record.id}`);
                },
              };
            }}
          />
        </div>
      )}
      <ModalAddCarModel
        show={modalCarModel}
        handleCancel={() => setModalCarModel(false)}
        onSuccess={(data) => handleSuccessCarModel(data)}
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

export default CarModelTable;
