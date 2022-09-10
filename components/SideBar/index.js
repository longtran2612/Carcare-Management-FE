import { 
    BarChartOutlined, 
    UserOutlined, 
    TagsOutlined,
    ShoppingCartOutlined,
  } from '@ant-design/icons';
  import { Menu } from 'antd';
  import { Typography } from 'antd';
  import React, { useState } from 'react';
  import Link from 'next/link';
  const { Title } = Typography;
  import { useRouter } from 'next/router'

  
  function getItem(label, key, icon, children, type) {
    return {
      key,
      icon,
      children,
      label,
      type,
    };
  }
  
  const items = [
    getItem('Hóa đơn', 'order', <ShoppingCartOutlined />, [
      getItem('Tạo mới hóa đơn', 'order-create'),
      getItem('Danh sách hóa đơn', 'order-list')
    ]),
    
    getItem('Dịch vụ', 'service', <TagsOutlined />, [
      getItem('danh mục dịch vụ', 'service-category'),
      getItem('dịch vụ', 'service'),
      getItem('bảng giá', 'price'),
    ]),
    getItem('Sản phẩm', 'product', <TagsOutlined />, [
      getItem('danh mục sản phẩm', 'product-category'),
      getItem('Sản phẩm', 'product'),
      getItem('bảng giá', 'price'),
    ]),
    getItem('Quản lý khách hàng', 'customer', <UserOutlined />, [
      getItem('Nhóm khách hàng', 'customer-group'),
      getItem('Khách hàng', 'customer'),
    ]),
    getItem('Quản lý trương trình khuyến mãi', 'promotion', <BarChartOutlined />, [
      getItem('Danh sách trương trình khuyến mãi', 'promotion')
    ]),
    getItem('Thống kê - Báo cáo', 'report', <BarChartOutlined />, [
      getItem('Bán hàng - Trả hàng', 'sell-report'),
      getItem('Lợi nhuận - Doanh thu', 'income'),
    ]),
  ];
  
  const rootSubmenuKeys = ['order', 'service', 'product', 'customer', 'promotion','report'];
  
  const SideNav = (props) => {
    const [openKeys, setOpenKeys] = useState();
    const router = useRouter()
  
    const onOpenChange = (keys) => {
      const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
  
      if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
        setOpenKeys(keys);
      } else {
        setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
      }
    };
  
    const onSelect = (selected) => {
        router.push(`/${selected.key}`)
    }
  
    const onClick = (selected) => {
      router.push(`/${selected.key}`)
    }
  
    return (
      <div>
        <div className="logo">
          <Title level={5}>Dashboard</Title>
        </div>
        <Menu
          mode="inline"
          theme="dark"
          openKeys={openKeys}
          items={items}
          onSelect={onSelect}
          onClick={onClick}
        />
      </div>
    );
  };
  
  export default SideNav;