import { Table, Tag, Space, Button, Row, Col, Input } from "antd";
import React, { useState, useEffect, useRef} from "react";
import ModalQuestion from "components/Modal/ModalQuestion";
import { message } from "antd";
import { ClearOutlined ,SearchOutlined } from "@ant-design/icons"
import { getCategories } from "pages/api/categoryAPI";
import ModalAddCategory from "components/Modal/ModalAddCategory";
import CategoryDetail from "../CategoryDetail";
import { useRouter } from "next/router";
import Loading from "components/Loading";
import Highlighter from "react-highlight-words";

function CategoryTable({}) {
  const [categories, setCategories] = useState([]);
  const [modalCategory, setModalCategory] = useState(false);
  const [modalQuestion, setModalQuestion] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [id, setId] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { categoryId } = router.query;

  const [searchGlobal, setSearchGlobal] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);

  const handleSearch = (selectedKeys, dataIndex) => {
    setSearchText(selectedKeys[0]);
    setSearchGlobal(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = () => {
    setSearchText("");
    setSearchGlobal("");
  };
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys }) => (
      <div
        style={{
          padding: 8,
        }}
      >
        <Input
          ref={searchInput}
          placeholder={`Tìm ${dataIndex}`}
          value={selectedKeys[0]}
          onSearch={(value) => setSearchText(value)}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Tìm
          </Button>
          <Button
            onClick={() => {
              handleReset();
            }}
            size="small"
            style={{
              width: 90,
            }}
          >
            Xóa bộ lọc
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1890ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });



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


  const handleSuccessCategory = (data) => {
    let newArr = [...categories];
    newArr.push(data);
    setCategories(newArr);
  };


  useEffect(() => {
    handleCatetgory();
  }, []);


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
      filteredValue: [searchGlobal],
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
      ...getColumnSearchProps("name"),
    },
    {
      title: "Loại",
      dataIndex: "type",
      key: "type",
      ...getColumnSearchProps("type"),
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
          <Col span={8} style={{ marginRight: "10px" }}>
              <Input.Search
                placeholder="Tìm kiếm"
                onChange={(e) => setSearchGlobal(e.target.value)}
                onSearch={(value) => setSearchGlobal(value)}
                value={searchGlobal}
              />
            </Col>
            <Col span={4}>
              <Button
                onClick={() => setSearchGlobal("")}
                icon={<ClearOutlined />}
              >
                Xóa bộ lọc
              </Button>
            </Col>
          </Row>
          <Table
           onChange={handleSearch}
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
