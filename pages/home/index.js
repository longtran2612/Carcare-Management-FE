import React ,{useEffect} from "react";
import { Layout } from 'antd';
import  MyHeader from "components/Header";
import  MyFooter  from "components/Footer";
const {Content} = Layout;
import { useRouter } from "next/router";
import Cookies from "js-cookie";

function HomePage() {

    const router = useRouter();
    const handleAuthentication = async () => {
        let accessToken = Cookies.get("accessToken");
        console.log(accessToken);
        if (accessToken == null) {
          router.push("/login");
          return;
        }
        try {
          loadUser().then((res) => {
            console.log("res:", res);
            if (res.data.StatusCode == 200) {
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
