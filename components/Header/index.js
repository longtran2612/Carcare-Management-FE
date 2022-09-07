import { useState } from "react";
import { useSelector } from 'react-redux';
import {
  InfoOutlined,
  CarOutlined,
  CarFilled,
  HomeOutlined,
  LoginOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import  Link  from "next/link";

// import logo from "public/images/logo.jpg";
// import './style.scss';
// import MenuDivider from "antd/lib/menu/MenuDivider";

const { SubMenu } = Menu;

const Header = () => {
  const [keyMenu, setKeyMenu] = useState(1);
  const { isLogin } = useSelector((state) => state.authSlice.isLogin);


  const handleOnClick = (e) => {
    setKeyMenu(e.key);
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

        <Menu.Item key={2} icon={<CarOutlined />}>
          <Link href="/thuexe">Thuê xe</Link>
        </Menu.Item>

        <Menu.Item key={3} icon={<CarFilled />}>
          <Link href="/chothuexe">Cho thuê xe</Link>
        </Menu.Item>

        <Menu.Item key={4} icon={<InfoOutlined />}>
          <Link href="/usermanual">Hướng dẫn</Link>
        </Menu.Item>


        
        {isLogin ? (
            <SubMenu key="10_1" icon={<UserOutlined />} title="Cá nhân">
                <Menu.Item key="10_1_2">
                    <Link
                        to="/login"
                        onClick={() =>
                            auth.logout(() => {
                                message.success('Bạn đã đăng xuất');
                                dispatch(setLogin(false));
                            })
                        }
                    >
                        Đăng xuất
                    </Link>
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
}

export default Header;
 