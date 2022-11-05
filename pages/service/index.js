import { useState, useEffect } from "react";
import { Row, Col, Card, Typography } from "antd";
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
      setServices(res.data.Data);
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
      <div
        style={{ paddingBottom: "20px" }}
        id="features"
        className="text-center"
      >
        <div className="container">
          <div style={{ paddingBottom: "10px" }} className="section-title">
            <h2>Dịch vụ ở VL-CarCare</h2>
          </div>
          <Row style={{ overflow: "auto", height: "530px" }} gutter={[16,16]}>
            {services
              ? services.map((d, i) => (
                  <Col   xs={24} sm={24} md={12} lg={6} xl={6}>
                    <Card
                      style={{
                        borderRadius: "5px",
                        cursor: "pointer",
                        height: "220px",
                      }}
                      hoverable
                      cover={<Image width={220} height={220} src={d.image} />}
                    />

                    <Card.Meta
                      style={{display:"flex",marginTop:"5px",justifyContent:"space-between"}}
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
