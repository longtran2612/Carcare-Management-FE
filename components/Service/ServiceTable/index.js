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

function ServiceTable({}) {
  const [services, setServices] = useState([]);
  const [modalService, setModalService] = useState(false);
  const [id, setId] = useState(null);
  const router = useRouter();
  const { serviceId } = router.query;
  const { Option } = Select;
  const [searchValue, setSearchValue] = useState({
    name: "",
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
    },
    {
      title: "Tên dịch vụ",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Loại dịch vụ",
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
  ];

  const handleGetServices = async () => {
    try {
      getServices().then((res) => {
        if (res.data.StatusCode == 200) {
          setServices(res.data.Data);
        } else {
          message.error(res.data.message);
        }
      });
    } catch (err) {
      console.log(err);
    }
  };

  const fetchCategoryServices = async () => {
    try {
      const response = await fetchCategoryServiceApi();
      setCategoryServices(response.data.Data);
    } catch (error) {
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
    try {
      setLoading(true);
      const response = await searchService(searchValue);
      setServices(response.data.Data.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

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
            <Col span={6}>
              <Input
                value={searchValue.name}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Tên dịch vụ"
              />
            </Col>
            <Col span={6}>
              <Select
                showSearch
                style={{ width: "90%", marginLeft: "10px" }}
                optionFilterProp="children"
                placeholder="Danh mục dịch vụ"
                onChange={(value) =>
                  setSearchValue({ ...searchValue, categoryID: value })
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
    </>
  );
}

export default ServiceTable;
