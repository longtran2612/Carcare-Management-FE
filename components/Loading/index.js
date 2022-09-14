import { Alert, Row, Spin } from "antd";
import React from "react";

function Loading({ loading }) {
  return (
    <>
      {loading && (
        <Row
          justify="space-around"
          align="middle"
          style={{
            height: "100vh",
          }}
        >
          <Spin tip="Đang tải..."></Spin>
        </Row>
      )}
    </>
  );
}

export default Loading;
