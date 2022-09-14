import { useState } from "react";
import { useSelector } from "react-redux";
import {
  ShopOutlined,
  CarOutlined,
  CarFilled,
  HomeOutlined,
  LoginOutlined,
  UserOutlined,
  DropboxOutlined
} from "@ant-design/icons";
import { Button, Menu, message } from "antd";
import Link from "next/link";
import { logout } from "api/authAPI";
import { setLogout } from "redux/slices/authSlice";
import { useRouter } from "next/router";
import Cookies from "js-cookie";

// import logo from "public/images/logo.jpg";
// import './style.scss';
// import MenuDivider from "antd/lib/menu/MenuDivider";

const { SubMenu } = Menu;

const MyHeader = () => {
  const [keyMenu, setKeyMenu] = useState(1);
  const { isLogin } = useSelector((state) => state.authSlice);
  const router = useRouter();

  const handleOnClick = (e) => {
    setKeyMenu(e.key);
  };

  const handleLogout = () => {
    logout({
      refreshToken: Cookies.get("refreshToken"),
    })
      .then((res) => {
        console.log("res:", res);
        if (res.status == 200) {
          console.log(res.data);
          dispatch(setLogout());
          router.push("/login");
        } else {
          if (res.status == 400) {
            message.error(res.message);
          }
        }
      })
      .catch((err) => {
        message.error(err.message);
      });
  };
  const headerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "4px 0",
    boxShadow: " 0 4px 4px -2px #c4c4c4",
  };
  return (
    <div className="header">
      <Menu
        mode="horizontal"
        style={headerStyle}
        onClick={handleOnClick}
        selectedKeys={keyMenu}
      >
        <Menu.Item key={1} icon={<HomeOutlined />}>
          <Link href="/">Trang chủ</Link>
        </Menu.Item>

        <Menu.Item key={4} icon={<ShopOutlined />}>
          <Link href="/store">Cửa hàng</Link>
        </Menu.Item>

        <Menu.Item key={2} icon={<CarOutlined />}>
          <Link href="/service">Dịch vụ</Link>
        </Menu.Item>
        
        <Menu.Item key={2} icon={<DropboxOutlined />}>
          <Link href="/car">Sản phẩm</Link>
        </Menu.Item>

        <Menu.Item key={3} icon={<CarFilled />}>
          <Link href="/customer">Khách hàng</Link>
        </Menu.Item>

        {isLogin ? (
          <SubMenu key="10_1" icon={<UserOutlined />} title="Cá nhân">
            <Menu.Item key="10_1_2">
              {/* <Link a>Đăng xuất</Button> */}
              <Link href='/login' onClick={()=>handleLogout()}>Đăng xuất</Link>
            </Menu.Item>
          </SubMenu>
        ) : (
          <SubMenu key="11" icon={<LoginOutlined />} title="Đăng ký/Đăng nhập">
            <Menu.Item key="11_1">
              <Link href="/login">Đăng nhập</Link>
            </Menu.Item>
            <Menu.Item key="11_2">
              <Link href="/registry">Đăng ký</Link>
            </Menu.Item>
          </SubMenu>
        )}
      </Menu>
    </div>
  );
};

export default MyHeader;
