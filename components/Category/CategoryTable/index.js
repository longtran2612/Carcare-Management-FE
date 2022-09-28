import { Table, Tag, Space, Button } from "antd";
import React, { useState, useEffect } from "react";
import ModalQuestion from "components/Modal/ModalQuestion";
import { message } from "antd";
import {getCategories} from 'pages/api/categoryAPI'

function CategoryTable({}) {
  const [categories, setCategories] = useState([]);
  const [modalCategory, setModalCategory] = useState(false);
  const [modalQuestion, setModalQuestion] = useState(false);
  const [id, setId] = useState(null);

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
      title: "Tên",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Loại",
      dataIndex: "phone",
      key: "phone",
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

  const handleCatetgory = async () => {
    try {
      getCategories().then((res) => {
        console.log(res);
        if (res.data.StatusCode == 200) {
          setCategories(res.data.Data);
        } else {
          message.error(res.data.message);
        }
      });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    handleCatetgory();
  
  }, []);

  return (
    <>
      <Button type="primary" onClick={() => setModalCategory(true)}>
        Thêm danh mục
      </Button>
      <Table columns={columns} dataSource={categories} />
      {/* <ModalAddUser
        show={modalCategory}
        handleCancel={() => setModalCategory(false)}
        handleOk={() => console.log("bao")}
      /> */}
      {/* <ModalQuestion
        title="Bạn có chắc chắn muốn xóa người dùng này không?"
        visible={modalQuestion}
        handleCancel={() => setModalQuestion(false)}
        // handleOk={() => handleRemoveService()}
      /> */}
    </>
  );
}

export default CategoryTable;
