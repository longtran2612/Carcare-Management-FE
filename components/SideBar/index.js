import React , {useState} from 'react'
import {
	AppstoreAddOutlined,
	BookOutlined,
	CarryOutOutlined,
	DashboardOutlined,
	ReadOutlined,
	UnorderedListOutlined,
	UserOutlined,
	VideoCameraOutlined,
} from "@ant-design/icons";
import { Layout, Menu } from "antd";
import Link from "next/link";
const { Sider } = Layout;
const { SubMenu } = Menu;


const SideBar = ()=> {
    const [collapsed, setCollapsed] = useState(false);

	const onCollapse = (collapsed) => {
		setCollapsed(collapsed);
	};
  return (
    <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
			{/* <div className="logo">{name}</div> */}
			<Menu theme="dark" defaultSelectedKeys={["1"]} mode="inline">
						<Menu.Item key="1" icon={<DashboardOutlined />}>
							<Link href='/'>Trang chủ</Link>
						</Menu.Item>
						<Menu.Item key="2" icon={<CarryOutOutlined />}>
							<Link href='/service'>Quản lý dịch vụ</Link>
						</Menu.Item>
						<Menu.Item key="3" icon={<CarryOutOutlined />}>
							<Link href='/product'>Quản lý sản phẩm</Link>
						</Menu.Item>
                        <Menu.Item key="4" icon={<CarryOutOutlined />}>
							<Link href='/promotion'>Quản lý khuyến mãi</Link>
						</Menu.Item>
                        <Menu.Item key="5" icon={<CarryOutOutlined />}>
							<Link href='/order'>Quản lý hóa đơn</Link>
						</Menu.Item>
						<Menu.Item key="6" icon={<UserOutlined />}>
							<Link href='/users'>Quản lý người dùng</Link>
						</Menu.Item>
					
			</Menu>
		</Sider>
  )
}

export default SideBar;