import React from "react";
import Image from "next/image";
import { Divider } from "antd";
import moment from "moment";
import { formatMoney } from "utils/format";
export class BillPrint extends React.PureComponent {
  render() {
    console.log(this.props)
    return (
      <div ref={ref}>
        <br />
        <div className="invoice-box">
          <table>
            <tr className="top">
              <td colspan="2">
                <table>
                  <tr>
                    <td className="title">
                      <Image
                        src={logo}
                        width={150}
                        height={100}
                        alt="Company logo"
                      />
                    </td>
                    <td>
                      Bill #: {billDetail?.billCode}
                      <br />
                      Ngày tạo:{" "}
                      {moment(billDetail?.createDate).format(
                        "HH:ss DD/MM/YYYY"
                      )}
                      <br />
                      Ngày thanh toán: {moment().format("HH:ss DD/MM/YYYY")}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr className="information">
              <td colspan="2">
                <table>
                  <tr>
                    <td>
                      VLCareCare
                      <br />
                      0772555445
                      <br />
                      12 Nguyễn Văn bảo
                      <br />
                      Phường 5,Gò Vấp, Hồ Chí Minh
                    </td>

                    <td>
                      Khách hàng : {billDetail?.customerName}
                      <br />
                      Số điện thoại : {billDetail?.customerPhoneNumber}
                      <br />
                      Xe : {billDetail?.carName} - {billDetail?.carLicensePlate}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr className="heading">
              <td>Thanh Toán</td>

              <td>
                {billDetail?.paymentType == "CASH"
                  ? "Tiền mặt"
                  : "Chuyển khoản"}
              </td>
            </tr>
            <tr className="heading">
              <td>Dịch vụ</td>

              <td>Thành tiền</td>
            </tr>

            {billDetail?.services?.map((item) => (
              <>
                <tr className="item">
                  <td>{item?.name}</td>

                  <td>{formatMoney(item?.servicePrice?.price)}</td>
                </tr>
              </>
            ))}
            {billDetail?.totalPromotionAmount && (
              <>
                <tr className="item">
                  <td>Khuyến mãi</td>
                  <td>
                    <a style={{ color: "red" }}>
                      -{formatMoney(billDetail?.totalPromotionAmount || 0)}
                    </a>
                  </td>
                </tr>
              </>
            )}

            <tr className="total">
              <td></td>

              <td>Tổng: {formatMoney(billDetail?.paymentAmount || 0)}</td>
            </tr>
          </table>
          <Divider style={{ paddingTop: "50px" }}>
            {" "}
            Cảm ơn quý khách vì đã sử dụng dịch vụ của chúng tôi
          </Divider>
        </div>
      </div>
    );
  }
}
