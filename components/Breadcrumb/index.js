import React from "react";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { openAction } from "../../redux/action";

const Breadcrumb = ({ title, titleCategory }) => {
  const dispatch = useDispatch();
  
  return (
    <section
      className="bread-crumb"
    >
      <span className="crumb-border"></span>
      <div className="container">
        <div className="row">
          <div className="col-lg-12 col-md-12 col-12">
            {titleCategory ? <div className="title_full">{titleCategory}</div> : <div className="title_full">{title}</div>} {/* titleCategory kiểm tra title thuộc trang danh mục */}
            <ul className="breadcrumb">
              <li className="home">
                <Link href="/">
                  <a>
                    <span title="Trang chủ">Trang chủ</span>
                  </a>
                </Link>
              </li>
              <li>
                <strong>
                  <span>{title}</span>
                </strong>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Breadcrumb;
