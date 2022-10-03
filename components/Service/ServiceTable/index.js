import { Table, Tag, Button, Input, Row, Col, Select } from "antd";
import React, { useState, useEffect } from "react";
import {
  fetchCategoryServiceApi,
  getServices,
  removeServiceApi,
  searchService,
} from "pages/api/serviceAPI";
import ModalAddService from "components/Modal/ModalAddService";
import { useRouter } from "next/router";
import ServiceDetail from "../ServiceDetail";
import Loading from "components/Loading";

function ServiceTable({}) {
  const [services, setServices] = useState([]);
  const [modalService, setModalService] = useState(false);
  const [id, setId] = useState(null);
  const router = useRouter();
  const { serviceId } = router.query;
  const { Option } = Select;
  const [searchValue, setSearchValue] = useState({
    id:"",
    name:"",
    category_id: null,
  });
  const [categoryServices, setCategoryServices] = useState([]);
  const [loading, setLoading] = useState(false);

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
      title: "Mã dịch vụ",
      dataIndex: "id",
      key: "id",
      render: (id) => <a>{id}</a>,
    },
    {
      title: "Tên dịch vụ",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Danh mục dịch vụ",
      dataIndex: "category",
      key: "category",
      render: (category) => {
        return (
          <>
            {category === null ? (
              <Tag color={"red"}>{"Chưa có danh mục"}</Tag>
            ) : (
              <div>{category.name}</div>
            )}
          </>
        );
      },
    },

    {
      title: "Loại dịch vụ",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (price) => {
        return (
          <>
            {price === null ? (
              <Tag color={"red"}>{"Chưa có giá"}</Tag>
            ) : (
              <div>{price.price}</div>
            )}
          </>
        );
      },
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

  const handleGetServices = async () => {
    setLoading(true);
    try {
      const response = await searchService();
      setServices(response.data.Data.data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

  const fetchCategoryServices = async () => {
    setLoading(true);
    try {
      const response = await fetchCategoryServiceApi();
      setCategoryServices(response.data.Data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetServices();
    fetchCategoryServices();
  }, []);

  const handleSuccessCreateService = (data) => {
    let newArr = [...services];
    newArr.push(data);
    setServices(newArr);
  };

  const handleSearchService = async () => {
    setLoading(true);
    try {
      const response = await searchService(searchValue);
      console.log(response)
      setServices(response.data.Data.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };
  console.log(searchValue)

  return (
    <>
      {serviceId ? (
        <ServiceDetail
          serviceId={serviceId}
          onUpdateService={handleGetServices}
        />
      ) : (
        <div>
          <Button type="primary" onClick={() => setModalService(true)}>
            Thêm dịch vụ
          </Button>
          <Row style={{ margin: "20px 0px" }}>
          <Col span={4} style={{marginRight: "10px" }}>
              <Input
                value={searchValue.id}
                onChange={(e) => setSearchValue({ ...searchValue, id: e.target.value })}
                placeholder="Mã dịch vụ"
              />
            </Col>
            <Col span={4} style={{marginRight: "10px" }}>
              <Input
                value={searchValue.name}
                onChange={(e) => setSearchValue({ ...searchValue, name: e.target.value })}
                placeholder="Tên dịch vụ"
              />
            </Col>
            <Col span={4}>
              <Select
                showSearch
                style={{ width: "90%"}}
                optionFilterProp="children"
                placeholder="Danh mục dịch vụ"
                onChange={(value) =>
                  setSearchValue({ ...searchValue, category_id: value })
                }
                filterOption={(input, option) =>
                  option.children.toLowerCase().includes(input.toLowerCase())
                }
              >
                {categoryServices?.map((item) => {
                  return (
                    <Option value={item.id} key={item.id}>
                      {item.name}
                    </Option>
                  );
                })}
              </Select>
            </Col>
            <Col span={6}>
              <Button
                onClick={() => handleSearchService()}
                type="primary"
                loading={loading}
              >
                Tìm Kiếm
              </Button>
            </Col>
          </Row>
          <Table
            columns={columns}
            dataSource={services}
            onRow={(record, rowIndex) => {
              return {
                onClick: (event) => {
                  router.push(`/admin?serviceId=${record.id}`);
                },
              };
            }}
          />
        </div>
      )}
      <ModalAddService
        show={modalService}
        handleCancel={() => setModalService(false)}
        onSuccess={(data) => handleSuccessCreateService(data)}
      />
      <Loading loading={loading} />
    </>
  );
}

export default ServiceTable;
