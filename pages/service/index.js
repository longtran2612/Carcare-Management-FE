import { useState, useEffect } from "react";
import { Row, Col, Card, Typography, Space, Button, Input } from "antd";
import { SearchOutlined, ClearOutlined } from "@ant-design/icons";
import Image from "next/image";
import { getServices } from "pages/api/serviceAPI";
import { useRouter } from "next/router";
import Loading from "components/Loading";
import { formatMoney } from "utils/format";
import { CustomerNavigation } from "components-customer/navigation";
const ServicePage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const getService = async () => {
    setLoading(true);
    try {
      const res = await getServices();
      setServices(res?.data?.Data);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    getService();
  }, []);
  return (
    <>
      <CustomerNavigation />

      <div style={{ backgroundColor:'#EDEBEB', minHeight: "80vh"}} id="features" className="text-center">
        <div style={{padding:'20px'}} className="container">
          <Row style={{paddingBottom:'20px'}} gutter={16}>
            <Col span={8}>
              <Input.Search
                placeholder="Tìm kiếm"
                // onChange={(e) => setSearchGlobal(e.target.value)}
                // onSearch={(value) => setSearchGlobal(value)}
                // value={searchGlobal}
              />
            </Col>
            <Col span={2}>
              <Button
                // onClick={() => setSearchGlobal("")}
                icon={<ClearOutlined />}
              >
                Xóa bộ lọc
              </Button>
            </Col>
          </Row>
          <Row
            style={{ overflow: "auto", height: "580px" }}
            gutter={[16, 16]}
          >
            {services
              ? services.map((d, i) => (
                  <Col xs={12} sm={12} md={12} lg={6} xl={6}>
                    <Card
                      style={{
                        cursor: "pointer",
                        height: "220px",
                        borderRadius: "5px",
                        boxShadow: "0 0 10px 0 rgba(0,0,0,0.1)",
                      }}
                      hoverable
                      cover={<Image layout="fill" src={d.imageUrl} />}
                    />

                    <Card.Meta
                      style={{
                        display: "flex",
                        marginTop: "5px",
                        justifyContent: "space-between",
                      }}
                      title={d.name}
                      description={formatMoney(d.servicePrice.price)}
                    />
                  </Col>
                ))
              : "loading"}
          </Row>
        </div>
      </div>

      <Loading loading={loading} />
    </>
  );
};
export default ServicePage;
