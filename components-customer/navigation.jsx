import logo from "public/images/logo-header-customer.png";
import Image from "next/image";
import Link from "next/link";
import {
  InfoOutlined,
  LogoutOutlined,
  SettingOutlined,
  LoginOutlined,
  UserOutlined,
  DownOutlined,
  HighlightOutlined,
  ClearOutlined,
  BookOutlined,
} from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { setLogout } from "redux/slices/authSlice";
import { Menu, message, Dropdown } from "antd";
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

  const handleMenu = () => {
    if (accessToken) {
      return (
        <Menu>
          <Menu.Item key="1">
            <Link href="/customer/profile">
              <a>
                <UserOutlined /> Trang cá nhân
              </a>
            </Link>
          </Menu.Item>
          <Menu.Item key="2">
            <Link href="/customer">
              <a>
                <ClearOutlined /> Chức năng
              </a>
            </Link>
          </Menu.Item>
          <Menu.Item key="3">
            <Link href="/customer/order">
              <a>
                <ClearOutlined /> Dịch vụ đang sử dụng
              </a>
            </Link>
          </Menu.Item>
          <Menu.Item key="4">
            <Link href="/customer/bill">
              <a>
                <BookOutlined /> Lịch sử sử dụng dịch vụ
              </a>
            </Link>
          </Menu.Item>
          <Menu.Item key="5">
            <Link href="/customer/profile?key=2">
              <a>
                <SettingOutlined /> Đổi mật khẩu
              </a>
            </Link>
          </Menu.Item>
          <Menu.Divider />
          <Menu.Item key="6" onClick={handleLogout}>
            <LogoutOutlined /> Đăng xuất
          </Menu.Item>
        </Menu>
      );
    } else {
      return (
        <Menu>
          <Menu.Item key="0">
            <Link href="/login">
              <a>
                <LoginOutlined /> Đăng nhập
              </a>
            </Link>
          </Menu.Item>
          <Menu.Item key="1">
            <Link href="/registry">
              <a>
                <HighlightOutlined /> Đăng ký
              </a>
            </Link>
          </Menu.Item>
        </Menu>
      );
    }
  };

  return (
    <nav
      id="menu"
      style={{ position: "static", top: 0, marginBottom: 0 }}
      className="navbar navbar-default navbar-fixed-top"
    >
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
          <a className="navbar-brand page-scroll">
            <Link href="/home">
              <Image src={logo} width={120} height={90} />
            </Link>
            {/* VLCARCARE */}
          </a>{" "}
        </div>

        <div
          className="collapse navbar-collapse"
          id="bs-example-navbar-collapse-1"
        >
          <ul className="nav navbar-nav navbar-right">
            {accessToken && (
              <>
                <li>
                  <Link href="/customer/bill">
                    <a className="page-scroll">Hóa đơn</a>
                  </Link>
                </li>
                <li>
                  <Link href="/customer/order">
                    <a className="page-scroll">Dịch vụ</a>
                  </Link>
                </li>
              </>
            )}

            <li>
              <a className="page-scroll">
                <Dropdown overlay={handleMenu}>
                  <a onClick={(e) => e.preventDefault()}>
                    {accessToken ? "Cá nhân" : "Đăng ký/Đăng nhập"}{" "}
                    <DownOutlined />
                    {/* Cá nhân <DownOutlined /> */}
                  </a>
                </Dropdown>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};
