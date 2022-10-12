import logo from "public/images/logo-header-customer.png";
import Image from "next/image";
import Link from "next/link";
import {
  InfoOutlined,
  LogoutOutlined,
  SettingOutlined,
  LoginOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { setLogout } from "redux/slices/authSlice";
import { Menu,message } from "antd";
import { logout } from "pages/api/authAPI";
const { SubMenu } = Menu;
import Cookies from "js-cookie";
import { useRouter } from "next/router";

export const CustomerNavigation = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.authSlice);
  const accessToken = Cookies.get("accessToken");
  const router = useRouter();
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
  return (
    <nav id="menu" className="navbar navbar-default navbar-fixed-top">
      <div className="container">
        <div className="navbar-header">
          <button
            type="button"
            className="navbar-toggle collapsed"
            data-toggle="collapse"
            data-target="#bs-example-navbar-collapse-1"
          >
            {" "}
            <span className="sr-only">Toggle navigation</span>{" "}
            <span className="icon-bar"></span>{" "}
            <span className="icon-bar"></span>{" "}
            <span className="icon-bar"></span>{" "}
          </button>
          <a className="navbar-brand page-scroll" href="/home">
            <Image src={logo} width={120} height={90} />
            {/* VLCARCARE */}
          </a>{" "}
        </div>

        <div
          className="collapse navbar-collapse"
          id="bs-example-navbar-collapse-1"
        >
          <ul className="nav navbar-nav navbar-right">
            <li>
              <a href="#about" className="page-scroll">
                Về chúng tôi
              </a>
            </li>
            <li>
              <a href="#services" className="page-scroll">
                Dịch vụ
              </a>
            </li>
            <li>
              <a href="#features" className="page-scroll">
                Điều khoản
              </a>
            </li>
            <li>
              <a href="#contact" className="page-scroll">
                Liên hệ
              </a>
            </li>
            <li>
              <div className="page-scroll">
                <Menu>
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
                    <SubMenu
                      key="11"
                      icon={<LoginOutlined />}
                      title="Đăng ký/Đăng nhập"
                    >
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
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};
