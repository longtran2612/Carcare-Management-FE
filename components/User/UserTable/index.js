import { Table } from 'antd';
import React from 'react';
const columns = [
  {
    title: 'Tên',
    dataIndex: 'name',
    filters: [
      {
        text: 'Joe',
        value: 'Joe',
      },
      {
        text: 'Jim',
        value: 'Jim',
      },
      {
        text: 'Submenu',
        value: 'Submenu',
        children: [
          {
            text: 'Green',
            value: 'Green',
          },
          {
            text: 'Black',
            value: 'Black',
          },
        ],
      },
    ],
    // specify the condition of filtering result
    // here is that finding the name started with `value`
    onFilter: (value, record) => {console.log("onFilter", value, record); return record.name.indexOf(value) === 0},
    sorter: (a, b) => a.name.length - b.name.length,
    sortDirections: ['descend'],
  },
  {
    title: 'Số điện thoại',
    dataIndex: 'phone',
    defaultSortOrder: 'descend',
    sorter: (a, b) => a.phone - b.phone,
    
  },
  {
    title: 'Email',
    dataIndex: 'email',

  },
  {
    title: 'Tuổi',
    dataIndex: 'age',
    defaultSortOrder: 'descend',
    sorter: (a, b) => a.age - b.age,
  },
  {
    title: 'Địa chỉ',
    dataIndex: 'address',
    filters: [
      {
        text: 'London',
        value: 'London',
      },
      {
        text: 'New York',
        value: 'New York',
      },
    ],
    onFilter: (value, record) => record.address.indexOf(value) === 0,
  },

];
const data = [
  {
    key: '1',
    name: 'John Brown',
    phone: '012923232',
    email: 'long@gmail.com',
    age: 32,
    address: 'New York No. 1 Lake Park',
  },
  {
    key: '2',
    name: 'Jim Green',
    phone: '012923232',
    email: 'long@gmail.com',
    age: 42,
    address: 'London No. 1 Lake Park',
  },
  {
    key: '3',
    name: 'Joe Black',
    phone: '012923232',
    email: 'long@gmail.com',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
  },
  {
    key: '4',
    name: 'Jim Red',
    phone: '012923232',
    email: 'long@gmail.com',
    age: 32,
    address: 'London No. 2 Lake Park',
  },
  {
    key: '5',
    name: 'Jim Red',
    phone: '012923232',
    email: 'long@gmail.com',
    age: 32,
    address: 'London No. 2 Lake Park',
  },
  {
    key: '6',
    name: 'Jim Red',
    phone: '012923232',
    email: 'long@gmail.com',
    age: 32,
    address: 'London No. 2 Lake Park',
  },
  {
    key: '7',
    name: 'Jim Red',
    phone: '012923232',
    email: 'long@gmail.com',
    age: 32,
    address: 'London No. 2 Lake Park',
  },
  {
    key: '8',
    name: 'Jim Red',
    phone: '012923232',
    email: 'long@gmail.com',
    age: 32,
    address: 'London No. 2 Lake Park',
  },
];

const onChange = (pagination, filters, sorter, extra) => {
  console.log('params', pagination, filters, sorter, extra);
};

const UserTable = () => <Table columns={columns} dataSource={data} onChange={onChange} />;

export default UserTable;