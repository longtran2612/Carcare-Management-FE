import { notification } from "antd";
import {SmileOutlined} from '@ant-design/icons';
const openNotification = (message = "", description = "") => {
  notification.open({
    message: message,
    description: description,
    icon:  <SmileOutlined style={{ color: '#440C37' }} />,
  
    style: {
     backgroundColor: "#C0DDF1",
      color: "white",
      // textAlign: "center",
      borderRadius: "10px",
    },

  });
};

export { openNotification };
