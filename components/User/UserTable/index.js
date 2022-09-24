import { Table, Tag, Space, Button } from "antd";
import React, { useState, useEffect } from "react";
import { getUsers } from "api/userAPI";
import ModalQuestion from "components/Modal/ModalQuestion";
import ModalAddUser from "components/Modal/ModelAddUser";
import { message } from "antd";
import { useRouter } from "next/router";
import UserDetail from "../UserDetail";

function UserTable({}) {
  const [users, setUsers] = useState([]);
  const [modalUser, setModalUser] = useState(false);
  const [modalQuestion, setModalQuestion] = useState(false);
  const [id, setId] = useState(null);
  const router = useRouter();
  const { userId } = router.query;

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

  const handleUsers = async () => {
    try {
      getUsers().then((res) => {
        if (res.data.StatusCode == 200) {
          setUsers(res.data.Data);
        } else {
          message.error(res.data.message);
        }
      });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    handleUsers();
    console.log(users);
  }, []);

  return (
    <>
      {userId ? (
        <UserDetail
          userId={userId}
          onUpdateUser={handleUsers}
        />
      ) : (
        <div>
          <Button type="primary" onClick={() => setModalUser(true)}>
            Thêm người dùng
          </Button>
          <Table
            columns={columns}
            dataSource={users}
            onRow={(record, rowIndex) => {
              return {
                onClick: (event) => {
                  router.push(`/admin?userId=${record.id}`);
                },
              };
            }}
          />
          <ModalAddUser
            show={modalUser}
            handleCancel={() => setModalUser(false)}
            handleOk={() => console.log("bao")}
          />
        </div>
      )}
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
