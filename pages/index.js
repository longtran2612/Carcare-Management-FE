import React ,{useEffect} from "react";
import { Layout } from 'antd';
import  MyHeader from "components/Header";
import  MyFooter  from "components/Footer";
const {Content} = Layout;
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import {loadUser} from "pages/api/authAPI";

function HomePage() {
    const router = useRouter();
    const handleAuthentication = async () => {
        try {
          loadUser().then((res) => {
            console.log("res:", res);
            if (res.data.StatusCode == 200) {
              if(res.data.Data.roles == "ROLE_ADMIN"){
                router.push("/admin");
              }else{
                router.push("/home");
              }
            } else {
              if (res.data.StatusCode == 400) {
                message.error(res.message);
              }
            }
          });
        } catch (err) {
          console.log(err);
        }
      };
      useEffect(() => {
        handleAuthentication();
      }, []);
  return (
    <>
      <Layout
      style={{
        minHeight: "100vh",
        backgroundColor:'white'
      }}
    >
        <MyHeader />
        <Content>Content</Content>
        <MyFooter />
      </Layout>
    </>
  );
}

export default HomePage;
