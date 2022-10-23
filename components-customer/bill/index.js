import React, { useEffect } from "react";
import { getAllBillsByCustomerId } from "pages/api/billAPI";
import Loading from "components/Loading";
import { Avatar, List, Space } from "antd";

const BillCustomer = () => {
  const [bills, setBills] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  const getAllBill = async () => {
    setLoading(true);
    try {
      const res = await getAllBillsByCustomerId("63510f855ac8423bc2f08fe9");
      console.log(res.data.Data);
      setBills(res.data.Data);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };
  useEffect(() => {
    getAllBill();
  }, []);

  return (
    <>
      <List
        itemLayout="vertical"
        size="large"
        pagination={{
          onChange: (page) => {
            console.log(page);
          },
          pageSize: 3,
        }}
        dataSource={bills}
        renderItem={(item) => (
          <List.Item
            key={item.title}
            extra={
              <img
                width={272}
                alt="logo"
                src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
              />
            }
          >
            <List.Item.Meta
              avatar={<Avatar src={item.avatar} />}
              title={<a href={item.href}>{item.title}</a>}
              description={item.description}
            />
            {item.content}
          </List.Item>
        )}
      />

      <Loading loading={loading} />
    </>
  );
};

export default BillCustomer;