import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  HomeOutlined,
  InfoOutlined,
  LogoutOutlined,
  SettingOutlined,
  LoginOutlined,
  UserOutlined,
  DropboxOutlined,
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
  const dispatch = useDispatch();
  const { isLogin , user } = useSelector((state) => state.authSlice);
  const router = useRouter();

  const handleOnClick = (e) => {
    setKeyMenu(e.key);
  };

  const handleLogout = () => {
    logout()
      .then((res) => {
        if (res.data.StatusCode == 200) {
          dispatch(setLogout());
          router.push("/login");
        } else {
          if (res.status == 422) {
            message.error(res.data.message);
          }
        }
      })
      .catch((err) => {
        message.error(err.message);
      });
  };
  const headerStyle = {
    display: "flex",
    justifyContent: "right",
    alignItems: "right",
    padding: "4px 0",
    backgroundColor: "#C7E5F4",
    boxShadow: " 0 4px 4px -2px #D0EDF3",
  };
  return (
    <div className="header">
      <Menu
        mode="horizontal"
        style={headerStyle}
        onClick={handleOnClick}
        selectedKeys={keyMenu}
      >
        {/* {user.roles === 'ROLE_USER' (

        <Menu.Item key={1} icon={<HomeOutlined />}>
          <Link href="/home">Trang chủ</Link>
        </Menu.Item>

        <Menu.Item key={4} icon={<ShopOutlined />}>
          <Link href="/store">Cửa hàng</Link>
        </Menu.Item>

        <Menu.Item key={2} icon={<CarOutlined />}>
          <Link href="/service">Dịch vụ</Link>
        </Menu.Item>
        
  )} */}

        {isLogin ? (
          <SubMenu key="10_1" icon={<UserOutlined />} title="Cá nhân">
            <Menu.Item key="10_3" icon={<InfoOutlined />}>
              <Link href="/car">Thông tin cá nhân</Link>
            </Menu.Item>
            <Menu.Item key="10_4" icon={<SettingOutlined />}>
              <Link href="/car">Cài đặt</Link>
            </Menu.Item>
            <Menu.Item key="10_1" icon={<LogoutOutlined />}>
              {/* <Link a>Đăng xuất</Button> */}
              <a onClick={() => handleLogout()}>Đăng xuất</a>
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
