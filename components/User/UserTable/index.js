import { Table, Tag, Space, Button } from "antd";
import React, { useState, useEffect } from "react";
import { getUsers } from "api/userAPI";
import ModalQuestion from "components/Modal/ModalQuestion";
import ModalAddUser
 from "components/Modal/ModelAddUser";
function UserTable({}) {
  const [users, setUsers] = useState([]);
  const [modalUser, setModalUser] = useState(false);
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
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",

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

  const handleUsers = async () => {
    try {
      console.log("handleUsers");
      getUsers().then((res) => {
        if (res.data.status == 1) {
          setUsers(res.data.data);
        } else {
          message.error(res.message);
        }
      });
    } catch (err) {
      console.log(err);
    }
  };
  // const handleRemoveService = async () => {
  //   try {
  //     const res = await removeServiceApi(id);
  //     if (res.data.status == 1) {
  //       handleGetServices();
  //       setModalQuestion(false);
  //       setId(null);
  //     }
  //   } catch (error) {}
  // };

  useEffect(() => {
    handleUsers();
    console.log(users);
  }, []);

  return (
    <>
      <Button type="primary" onClick={() => setModalUser(true)}>
        Thêm người dùng
      </Button>
      <Table columns={columns} dataSource={users} />
      <ModalAddUser
        show={modalUser}
        handleCancel={() => setModalUser(false)}
        handleOk={() => console.log("bao")}
      />
      <ModalQuestion
        title="Bạn có chắc chắn muốn xóa người dùng này không?"
        visible={modalQuestion}
        handleCancel={() => setModalQuestion(false)}
        // handleOk={() => handleRemoveService()}
      />
    </>
  );
}

export default UserTable;
