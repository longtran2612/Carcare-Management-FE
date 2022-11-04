import React, { useEffect } from "react";
import { useRouter } from "next/router";
import HomePageCustomer from "pages/home";
import { loadUser } from "pages/api/authAPI";

function HomePage() {
  const router = useRouter();
  const handleAuthentication = async () => {
    try {
      loadUser().then((res) => {
        console.log("res:", res);
        if (res.data.StatusCode == 200) {
          if (res.data.Data.roles == "ROLE_USER") {
            router.push("/admin");
          } else {
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
      <HomePageCustomer />
    </>
  );
}

export default HomePage;
