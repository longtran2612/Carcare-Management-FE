import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  HomeOutlined,
  InfoOutlined,
  LogoutOutlined,
  SettingOutlined,
  LoginOutlined,
  UserOutlined,CarOutlined,
  DropboxOutlined,
} from "@ant-design/icons";
import { Button, Menu, message,Layout } from "antd";
import Link from "next/link";
import { logout } from "pages/api/authAPI";
import { setLogout } from "redux/slices/authSlice";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import logo from "public/images/logo.png";
import Image from "next/image";
// import './style.scss';
// import MenuDivider from "antd/lib/menu/MenuDivider";
const { Header } = Layout;

const { SubMenu } = Menu;

const MyHeader = () => {
  const [keyMenu, setKeyMenu] = useState(1);
  const dispatch = useDispatch();
  const { isLogin, user } = useSelector((state) => state.authSlice);
  const router = useRouter();

  const accessToken = Cookies.get("accessToken");

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
    justifyContent: "center",
    alignItems: "right",
    padding: "4px 0",
    boxShadow: " 0 4px 4px -2px #CCD6FC",
  };
  return (
    <div className="header">
     
      <Menu
        mode="horizontal"
        style={headerStyle}
        onClick={handleOnClick}
        selectedKeys={keyMenu}
      >
          <Image style={{justifyContent:'flex-start',display:"plex"}} src={logo} alt="logo" width={75} height={75} />
        {user.roles === "ROLE_USER" && (
          <>
            <Menu.Item key={1} icon={<HomeOutlined />}>
              <Link href="/home">Trang chủ</Link>
            </Menu.Item>

            <Menu.Item key={2} icon={<CarOutlined />}>
              <Link href="/service">Dịch vụ</Link>
            </Menu.Item>
          </>
        )}

        {accessToken ? (
          <SubMenu key="10_1" icon={<UserOutlined />} title="Cá nhân">
            <Menu.Item key="10_3" icon={<InfoOutlined />}>
              <Link href="/profile">Thông tin cá nhân</Link>
            </Menu.Item>
            <Menu.Item key="10_4" icon={<SettingOutlined />}>
              <Link href="/setting">Cài đặt</Link>
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
