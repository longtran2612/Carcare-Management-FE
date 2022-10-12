import { Carousel } from "antd";
import bg1 from "public/img/intro-bg.jpg";
import bg2 from "public/img/intro-bg2.jpg";
import bg3 from "public/img/intro-bg3.jpg";

export const CustomerHeader = () => {
  return (
    <header id="header">
      <Carousel effect='scrollx' autoplay>
        <div className="intro bg1">
          <div className="overlay">
            <div className="container">
              <div className="row">
                <div className="col-md-12 intro-text">
                  <h1>
                    VL CARCARE
                    <span></span>
                  </h1>
                  <p>Hãy tặng chiếc xe của bạn món quà tuyệt vời nhất</p>
                  <a
                    href="#features"
                    className="btn btn-custom btn-lg page-scroll"
                  >
                    Xem thêm
                  </a>{" "}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="intro bg2">
          <div className="overlay">
            <div className="container">
              <div className="row">
                <div className="col-md-12 intro-text">
                  <h1>
                    VL CARCARE
                    <span></span>
                  </h1>
                  <p>Hãy tặng chiếc xe của bạn món quà tuyệt vời nhất</p>
                  <a
                    href="#features"
                    className="btn btn-custom btn-lg page-scroll"
                  >
                    Xem thêm
                  </a>{" "}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="intro bg3">
          <div className="overlay">
            <div className="container">
              <div className="row">
                <div className="col-md-12 intro-text">
                  <h1>
                    VL CARCARE
                    <span></span>
                  </h1>
                  <p>Hãy tặng chiếc xe của bạn món quà tuyệt vời nhất</p>
                  <a
                    href="#features"
                    className="btn btn-custom btn-lg page-scroll"
                  >
                    Xem thêm
                  </a>{" "}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Carousel>
    </header>
  );
};
