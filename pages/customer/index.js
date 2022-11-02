import React,{useState,useEffect} from "react";
import { Tabs, Layout } from "antd";
import { Features } from "components-customer/features";
import { CustomerNavigation } from "components-customer/navigation";
import MyFooter from "components/Footer";
import Loading from "components/Loading";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
export default function CustomerPage() {
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const [accessToken, setAccessToken] = useState(Cookies.get("accessToken"));
  useEffect(() => {
    if(!accessToken){
      router.push("/login");
    } 
  }, [accessToken]);


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
