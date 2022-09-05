import Img404 from "../public/images/404.png";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

const NotFound = () => {
  const [count, setCount] = useState(30);
  const router = useRouter();
  useEffect(() => {
    let interval = setInterval(() => {
      setCount((prev) => {
        if (prev === 1) {
          clearInterval(interval);
          router.push("/");
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);
  return (
    <div className="container">
      <div className="row">
        <div className="col-md-12 d-flex justify-content-center">
          <img src={Img404.src} />
        </div>
      </div>
      <div
        className="text-center"
        style={{ fontStyle: "italic", color: "#6ec1b7" }}
      >
        <Link href="/">
          <a>Quay lại trang chủ sau {count}s</a>
        </Link>
        <div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
