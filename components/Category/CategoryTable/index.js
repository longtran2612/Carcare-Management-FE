import { Table, Tag, Space, Button, Row, Col, Input } from "antd";
import React, { useState, useEffect } from "react";
import ModalQuestion from "components/Modal/ModalQuestion";
import { message } from "antd";
import { getCategories } from "pages/api/categoryAPI";
import ModalAddCategory from "components/Modal/ModalAddCategory";
import CategoryDetail from "../CategoryDetail";
import { useRouter } from "next/router";
import Loading from "components/Loading";

function CategoryTable({}) {
  const [categories, setCategories] = useState([]);
  const [modalCategory, setModalCategory] = useState(false);
  const [modalQuestion, setModalQuestion] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [id, setId] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { categoryId } = router.query;

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
      filteredValue: [searchText],
      onFilter: (value, record) => {
        return (
          String(record.id).toLowerCase().includes(value.toLowerCase()) ||
          String(record.name).toLowerCase().includes(value.toLowerCase()) ||
          String(record.type).toLowerCase().includes(value.toLowerCase()) ||
          String(record.status).toLowerCase().includes(value.toLowerCase())
        );
      },
    },
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Loại",
      dataIndex: "type",
      key: "type",
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
    setLoading(true);
    try {
      getCategories().then((res) => {
        if (res.data.StatusCode == 200) {
          setCategories(res.data.Data);
        } else {
          message.error(res.data.message);
        }
        setLoading(false);
      });
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

  useEffect(() => {
    handleCatetgory();
  }, []);

  const handleSuccessCategory = (data) => {
    let newArr = [...categories];
    newArr.push(data);
    setCategories(newArr);
  };





  return (
    <>
      {categoryId ? (
        <CategoryDetail
          categoryId={categoryId}
          onUpdateCategory={handleCatetgory}
        />
      ) : (
        <div>
          <Button type="primary" onClick={() => setModalCategory(true)}>
            Thêm danh mục
          </Button>
          <Row style={{ margin: "20px 0px" }}>
            <Col span={4} style={{ marginRight: "10px" }}>
              <Input.Search
                placeholder="Tìm kiếm"
                onChange={(e) => setSearchText(e.target.value)}
                onSearch={(value) => setSearchText(value)}
                value={searchText}
              />
            </Col>
          </Row>
          <Table
            columns={columns}
            dataSource={categories}
            onRow={(record, rowIndex) => {
              return {
                onClick: (event) => {
                  router.push(`/admin?categoryId=${record.id}`);
                },
              };
            }}
          />
        </div>
      )}
      <ModalAddCategory
        show={modalCategory}
        handleCancel={() => setModalCategory(false)}
        onSuccess={(data) => handleSuccessCategory(data)}
      />
      {/* <ModalQuestion
        title="Bạn có chắc chắn muốn xóa người dùng này không?"
        visible={modalQuestion}
        handleCancel={() => setModalQuestion(false)}
        // handleOk={() => handleRemoveService()}
      /> */}
      <Loading loading={loading} />
    </>
  );
}

export default CategoryTable;
