import { notification } from "antd";
import {SmileOutlined} from '@ant-design/icons';
const openNotification = (message = "", description = "") => {
  notification.open({
    message: message,
    description: description,
    icon:  <SmileOutlined style={{ color: '#A31983' }} />,
  
    style: {
     backgroundColor: "#D2E8F6",
      color: "white",
      // textAlign: "center",
      borderRadius: "10px",
    },

  });
};

export { openNotification };
