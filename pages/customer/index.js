import React,{useState} from "react";
import { Tabs, Layout } from "antd";
import { Features } from "components-customer/features";
import { CustomerNavigation } from "components-customer/navigation";
import MyFooter from "components/Footer";
import Loading from "components/Loading";
export default function CustomerPage() {
  const [loading, setLoading] = useState(false);
  return (
    <>
      <CustomerNavigation />
      <Layout.Content
      className="background-customer"
      >
        <Features />
      </Layout.Content>
      {/* <MyFooter/> */}
      <Loading loading={loading} />
    </>
  );
}
