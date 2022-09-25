import { Table, Tag, Space, Button } from "antd";
import React, { useState, useEffect } from "react";
import { getPriceHeaders } from "api/PriceHeaderAPI";
import ModalQuestion from "components/Modal/ModalQuestion";
import { useRouter } from "next/router";
import PriceHeaderDetail from "../PriceHeaderDetail";

function PriceHeaderTable({}) {
  const [priceHeaders, setPriceHeaders] = useState([]);
  // const [servicesItem, setServicesItem] = useState(null);
  const [modalPriceHeader, setModalPriceHeader] = useState(false);
  // const [modalQuestion, setModalQuestion] = useState(false);
  const [id, setId] = useState(null);
  const router = useRouter();
  const { priceHeaderId } = router.query;

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
      title: "Mã",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Tên bảng giá",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Từ ngày",
      dataIndex: "fromDate",
      key: "fromDate",
    },
    {
      title: "Đến ngày",
      dataIndex: "toDate",
      key: "toDate",
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
    // {
    //   title: "Hành động",
    //   key: "action",
    //   render: (_, record) => (
    //     <Space size={8}>
    //       <Button
    //         type="primary"
    //         onClick={() => {
    //           setModalPriceHeader(true);
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

  const handleGetPriceHeaders = async () => {
    try {
      getPriceHeaders().then((res) => {
        if (res.data.StatusCode == 200) {
          setPriceHeaders(res.data.Data);
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
    handleGetPriceHeaders();
  }, []);

  // const handleSuccessCreateService = (data) => {
  //   let newArr = [...services];
  //   newArr.push(data);
  //   setServices(newArr);
  // };

  return (
    <>
      {priceHeaderId ? (
        <PriceHeaderDetail
          priceHeaderId={priceHeaderId}
          onUpdatePriceHeaders={handleGetPriceHeaders}
        />
      ) : (
        <div>
          <Button type="primary" onClick={() => setModalPriceHeader(true)}>
            Thêm bảng giá
          </Button>
          <Table
            columns={columns}
            dataSource={priceHeaders}
            onRow={(record, rowIndex) => {
              return {
                onClick: (event) => {
                  router.push(`/admin?priceHeaderId=${record.id}`);
                },
              };
            }}
          />
        </div>
      )}
    </>
  );
}

export default PriceHeaderTable;