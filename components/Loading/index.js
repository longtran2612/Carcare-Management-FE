import React from "react";
import { useSelector } from "react-redux";

const Loading = () => {
  const loading = useSelector((state) => state.loading.loading);

  if (loading) {
    return (
      <div className="wrapper-loading">
        <div className="spinner-3"></div>
      </div>
    );
  } else {
    return <></>;
  }
};

export default Loading;
