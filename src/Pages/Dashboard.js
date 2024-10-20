import React from "react";
import { useEffect } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import "../assets/css/custom.css";
import { getDashboard } from "../store/dashboard/dashboard.action";
import { Chart as ChartJS } from "chart.js/auto";

import DateRangePicker from "react-bootstrap-daterangepicker";
import "bootstrap-daterangepicker/daterangepicker.css";
import dayjs from "dayjs";
import { useState } from "react";
import { getChart, getChartData } from "../store/dashboard/dashboard.action";
import {
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = (props) => {
  const { dashboard, analytic, host, user } = useSelector(
    (state) => state.dashboard
  );

  const [type, setType] = useState("UserHost");
  const dispatch = useDispatch();

  var date = new Date();
  var firstDay = new Date(date.getFullYear(), date.getMonth() - 1, 1);
  var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

  const startDate = dayjs(firstDay).format("YYYY-MM-DD");
  const endDate = dayjs(lastDay).format("YYYY-MM-DD");

  const [sDate, setSDate] = useState(startDate);
  const [eDate, setEDate] = useState(endDate);
  const [analyticData, setAnalyticData] = useState([]);
  const [analyticUser, setAnalyticUser] = useState([]);
  const [analyticHost, setAnalyticHost] = useState([]);

  let label = [];
  let dataUser = [];
  let dataHost = [];
  let data = [];

  const options = {
    responsive: true,
    maintainAspectRatio: true,

    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
      },
    },
  };
  useEffect(() => {
    dispatch(getDashboard());
    dispatch(getChart(type, sDate, eDate));
    dispatch(getChartData(type, sDate, eDate));
  }, [dispatch]);

  useEffect(() => {
    setAnalyticData(analytic);
  }, [analytic]);

  useEffect(() => {
    setAnalyticUser(user);
  }, [user]);

  useEffect(() => {
    setAnalyticHost(host);
  }, [host]);

  if (analyticData?.length > 0) {
    if (type === "LiveHost" || type === "Revenue") {
      if (type === "LiveHost") {
        analyticData.map((data_) => {
          const newDate = data_._id;

          var date;
          if (newDate._id) {
            date = newDate?._id.split("T");
          } else {
            date = newDate.split("T");
          }

          date?.length > 0 && label.push(date[0]);

          data.push(data_.count);
        });
      } else {
        analyticData.map((data_) => {
          const newDate = data_?._id;

          const date = newDate?.split("T");

          // date?.length > 0 && label.push(date[0]);

          data.push(data_.dollar);
        });
      }
    }
    // analyticData.map((data_) => {
    //   const newDate = data_._id;

    //   var date;
    //   if (newDate._id) {
    //     date = newDate?._id.split("T");
    //   } else {
    //     date = newDate.split("T");
    //   }

    //   date?.length > 0 && label.push(date[0]);

    //   data.push(data_.count);
    // });
  }

  if (analyticUser?.length > 0 || analyticHost?.length > 0) {
    analyticUser.map((data_) => {
      const newDate = data_._id;

      var date;
      if (newDate._id) {
        date = newDate?._id.split("T");
      } else {
        date = newDate.split("T");
      }

      date?.length > 0 && label.push(date[0]);

      dataUser.push(data_.count);
    });
  }

  if (analyticHost?.length > 0) {
    analyticHost.map((data_) => {
      const newDate = data_._id;

      var date;
      if (newDate._id) {
        date = newDate?._id.split("T");
      } else {
        date = newDate.split("T");
      }

      // date?.length > 0 && label.push(date[0]);

      dataHost.push(data_.count);
    });
  }

  const chartData = {
    labels: label,
    datasets: [
      {
        label: "User",
        data: dataUser,
        fill: true,
        // fillOpacity: 1,
        // backgroundColor: "rgba(255, 99, 132, 0.1)",
        borderColor: "rgb(255, 99, 132)",
        // borderColor: "rgb(231, 81, 90)",
        lineTension: 0.5,
      },

      {
        label: "Host",
        data: dataHost,
        fill: true,
        // fillOpacity: 0.9,
        // backgroundColor: "rgba(33, 150, 243, 0.169)",
        borderColor: "rgb(33, 150, 243)",
        // borderColor: "rgb(255, 99, 132)",
        lineTension: 0.5,
      },
    ],
  };

  const multiLineChartData = {
    labels: label,
    datasets: [
      {
        label: "User",
        data: data,
        fill: true,
        backgroundColor: "rgba(255, 99, 132, 0.1)",
        borderColor: "rgb(255, 99, 132)",
        lineTension: 0.5,
      },
      {
        label: "Host",
        data: data,
        fill: true,
        backgroundColor: "rgb(205,235,255,0.1)",
        borderColor: "#68B9F0",
        lineTension: 0.5,
      },
    ],
  };

  const defaultChart = {
    labels: label,
    datasets: [
      {
        label: type,
        data: data,
        fill: true,
        fillOpacity: 1,
        backgroundColor: "rgba(255, 99, 132, 0.1)",
        borderColor: "rgb(255, 99, 132)",
        // borderColor: "rgb(231, 81, 90)",
        lineTension: 0.5,
      },
    ],
  };

  const otherChart = {
    labels: label,
    datasets: [
      {
        label: type,
        data: data,
        fill: true,
        fillOpacity: 1,
        backgroundColor: "rgba(255, 99, 132, 0.1)",
        // borderColor: "rgb(33, 150, 243)",
        borderColor: "rgb(255, 99, 132)",
        lineTension: 0.5,
      },
    ],
  };

  const handleAnalytic = (type) => {
    sessionStorage.removeItem("online");
    setSDate(startDate);
    setEDate(endDate);
    setType(type);

    dispatch(getChart(type, startDate, endDate));
  };

  //Apply button function for analytic
  const handleApply = (event, picker) => {
    if (type === "UserHost" || type === "LiveHost" || type === "Revenue") {
      picker.element.val(
        picker.startDate.format("YYYY-MM-DD") +
          " - " +
          picker.endDate.format("YYYY-MM-DD")
      );
      const dayStart = dayjs(picker.startDate).format("YYYY-MM-DD");

      const dayEnd = dayjs(picker.endDate).format("YYYY-MM-DD");

      setSDate(dayStart);
      setEDate(dayEnd);

      dispatch(getChart(type, dayStart, dayEnd));
      dispatch(getChartData(type, dayStart, dayEnd));
    }
  };

  //Cancel button function for analytic
  const handleCancel = (event, picker) => {
    picker.element.val("");
    dispatch(getChart(type, startDate, endDate));
    dispatch(getChartData(type, startDate, endDate));
  };

  return (
    <>
      <div className="row my-2">
        <div className="col-xl-6 col-md-6 col-sm-12 col-12">
          <h4>Hi, Welcome back!</h4>
        </div>
        <div className="col-xl-6 col-md-6 col-sm-12 col-12 ">
          <div className="breadcrumb-four float-right">
            <ul className="breadcrumb">
              <li className="active">
                <Link to="/admin/dashboard">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="feather feather-home"
                  >
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                  </svg>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="row row-sm mt-3">
        <div className="col-xl-3 mt-2 col-lg-6 col-md-6 col-xm-12  layout-spacing">
          <Link to="/admin/user">
            <div
              className="card dashBoardColor layout-spacing "
              style={{
                cursor: "pointer",
                borderRadius: "15px",
              }}
            >
              <div
                className="row align-items-center "
                onClick={() => sessionStorage.setItem("online", true)}
              >
                <div className="col-4 d-flex justify-content-center align-items-center">
                  <div className="pl-3 pt-3 pr-3 pb-2 pt-0 ">
                    <div
                      className="TotalHost d-flex justify-content-center align-items-center iconBox"
                      style={{ backgroundColor: "#4d75ff" }}
                    >
                      <div className="text-center ">
                        <i
                          className="fa fa-users text-white"
                          style={{ fontSize: "35px" }}
                        ></i>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-8 d-flex justify-content-end">
                  <div className="pl-3 pt-3 pr-3 pb-2 pt-0">
                    <div className="">
                      <h6 className="mb-3 tx-12 text-white">Online User</h6>
                    </div>
                    <div className="pb-0 mt-0">
                      <h4 className="tx-20 font-weight-bold mb-1 text-white text-right">
                        {dashboard?.onlineUser ? dashboard.onlineUser : 0}
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
              <hr className="dashboard_line my-0 line" />
            </div>
          </Link>
        </div>

        {/* total user */}

        <div className="col-xl-3 mt-2 col-lg-6 col-md-6 col-xm-12 layout-spacing">
          <Link to="/admin/user">
            <div
              className="card dashBoardColor layout-spacing "
              style={{
                cursor: "pointer",
                borderRadius: "15px",
              }}
              onClick={() => handleAnalytic("UserHost")}
            >
              <div className="row align-items-center ">
                <div className="col-4 d-flex justify-content-center align-items-center">
                  <div className="pl-3 pt-3 pr-3 pb-2 pt-0 ">
                    <div
                      className="TotalHost d-flex justify-content-center align-items-center iconBox"
                      style={{ backgroundColor: "#e8538f" }}
                    >
                      <div className="text-center ">
                        <i
                          className="fa fa-user text-white"
                          style={{ fontSize: "35px" }}
                        ></i>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-8 d-flex justify-content-end">
                  <div className="pl-3 pt-3 pr-3 pb-2 pt-0">
                    <div className="">
                      <h6 className="mb-3 tx-12 text-white">Total User</h6>
                    </div>
                    <div className="pb-0 mt-0">
                      <h4 className="tx-20 font-weight-bold mb-1 text-white text-right">
                        {dashboard?.user ? dashboard.user : 0}
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
              <hr className="dashboard_line my-0 line" />
            </div>
          </Link>
        </div>
        {/* Live Host */}

        <div className="col-xl-3 mt-2 col-lg-6 col-md-6 col-xm-12  layout-spacing">
          {/* <Link to="/admin/host"> */}
          <div
            className="card dashBoardColor layout-spacing "
            style={{
              cursor: "pointer",
              borderRadius: "15px",
            }}
            onClick={() => handleAnalytic("LiveHost")}
          >
            <div className="row align-items-center ">
              <div className="col-4 d-flex justify-content-center align-items-center">
                <div className="pl-3 pt-3 pr-3 pb-2 pt-0 ">
                  <div
                    className="TotalHost d-flex justify-content-center align-items-center iconBox"
                    style={{ backgroundColor: "#4ec900" }}
                  >
                    <div className="text-center ">
                      <i
                        className="fa fa-user text-white"
                        style={{ fontSize: "35px" }}
                      ></i>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-8 d-flex justify-content-end">
                <div className="pl-3 pt-3 pr-3 pb-2 pt-0">
                  <div className="">
                    <h6 className="mb-3 tx-12 text-white">Live Host</h6>
                  </div>
                  <div className="pb-0 mt-0">
                    <h4 className="tx-20 font-weight-bold mb-1 text-white text-right">
                      {dashboard?.liveHost ? dashboard.liveHost : 0}
                    </h4>
                  </div>
                </div>
              </div>
            </div>
            <hr className="dashboard_line my-0 line" />
          </div>
          {/*    */}
        </div>
        {/* Online Host */}

        <div className="col-xl-3 mt-2 col-lg-6 col-md-6 col-xm-12  layout-spacing">
          <Link to="/admin/host">
            <div
              className="card dashBoardColor layout-spacing "
              style={{
                cursor: "pointer",
                borderRadius: "15px",
              }}
              onClick={() => sessionStorage.setItem("online", true)}
            >
              <div className="row align-items-center ">
                <div className="col-4 d-flex justify-content-center align-items-center">
                  <div className="pl-3 pt-3 pr-3 pb-2 pt-0 ">
                    <div
                      className="TotalHost d-flex justify-content-center align-items-center iconBox"
                      style={{ backgroundColor: "#ffc400" }}
                    >
                      <div className="text-center ">
                        <i
                          className="fa fa-user text-white"
                          style={{ fontSize: "35px" }}
                        ></i>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-8 d-flex justify-content-end">
                  <div className="pl-3 pt-3 pr-3 pb-2 pt-0">
                    <div className="">
                      <h6 className="mb-3 tx-12 text-white">Online Host</h6>
                    </div>
                    <div className="pb-0 mt-0">
                      <h4 className="tx-20 font-weight-bold mb-1 text-white text-right">
                        {dashboard?.onlineHost ? dashboard.onlineHost : 0}
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
              <hr className="dashboard_line my-0 line" />
            </div>
          </Link>
        </div>
        {/* Total Host */}

        <div className="col-xl-3 mt-2 col-lg-6 col-md-6 col-xm-12  layout-spacing">
          <Link to="/admin/host">
            <div
              className="card dashBoardColor layout-spacing "
              style={{
                cursor: "pointer",
                borderRadius: "15px",
              }}
              onClick={() => handleAnalytic("UserHost")}
            >
              <div className="row align-items-center ">
                <div className="col-4 d-flex justify-content-center align-items-center">
                  <div className="pl-3 pt-3 pr-3 pb-2 pt-0 ">
                    <div
                      className="TotalHost d-flex justify-content-center align-items-center iconBox"
                      style={{ backgroundColor: "#664dc9" }}
                    >
                      <div className="text-center ">
                        <i
                          className="fa fa-user text-white"
                          style={{ fontSize: "35px" }}
                        ></i>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-8 d-flex justify-content-end">
                  <div className="pl-3 pt-3 pr-3 pb-2 pt-0">
                    <div className="">
                      <h6 className="mb-3 tx-12 text-white">Total Host</h6>
                    </div>
                    <div className="pb-0 mt-0">
                      <h4 className="tx-20 font-weight-bold mb-1 text-white text-right">
                        {dashboard?.host ? dashboard.host : 0}
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
              <hr className="dashboard_line my-0 line" />
            </div>
          </Link>
        </div>
        {/* Total Revenue */}

        <div className="col-xl-3 mt-2 col-lg-6 col-md-6 col-xm-12  layout-spacing">
          <div
            className="card dashBoardColor layout-spacing "
            style={{
              cursor: "pointer",
              borderRadius: "15px",
            }}
            onClick={() => handleAnalytic("Revenue")}
          >
            <div className="row align-items-center ">
              <div className="col-4 d-flex justify-content-center align-items-center">
                <div className="pl-3 pt-3 pr-3 pb-2 pt-0 ">
                  <div
                    className="TotalHost d-flex justify-content-center align-items-center iconBox"
                    style={{ backgroundColor: "#48b6f7" }}
                  >
                    <div className="text-center ">
                      <i
                        className="fa fa-wallet text-white"
                        style={{ fontSize: "35px" }}
                      ></i>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-8 d-flex justify-content-end">
                <div className="pl-3 pt-3 pr-3 pb-2 pt-0">
                  <div className="">
                    <h6 className="mb-3 tx-12 text-white">Total Revenue</h6>
                  </div>
                  <div className="pb-0 mt-0">
                    <h4 className="tx-20 font-weight-bold mb-1 text-white text-right">
                      {dashboard?.revenue?.dollar
                        ? dashboard?.revenue?.dollar
                        : 0}
                      $
                    </h4>
                  </div>
                </div>
              </div>
            </div>
            <hr className="dashboard_line my-0 line" />
          </div>
        </div>
      </div>
      <div className="row d-flex justify-content-end">
        <div className="col-6 mt-2">
          <h4>{type === "UserHost" ? "User Host" : type} Chart</h4>
        </div>
        <div className="col-6">
          <div className="row">
            <div className="col-8 " style={{ textAlign: "end" }}>
              {/* {startDate === "" || endDate === "" ? (
                <div className="mr-2 "></div>
              ) : (
                <div
                  className="dateShow  mt-2 pt-1 text-white"
                  style={{ fontSize: "15px", fontWeight: "500" }}
                >
                  <span className="mr-2">{startDate}</span>
                  <span className="mr-2"> To </span>
                  <span>{endDate}</span>
                </div>
              )} */}
            </div>
            <div className="col-4 ">
              <div>
                <DateRangePicker
                  initialSettings={{
                    autoUpdateInput: false,
                    locale: {
                      cancelLabel: "Clear",
                    },
                    maxDate: new Date(),
                    buttonClasses: ["btn btn-dark"],
                  }}
                  onApply={handleApply}
                  onCancel={handleCancel}
                >
                  <input
                    type="text"
                    readOnly
                    className="daterange form-control float-right text-center "
                    placeholder="Select Date"
                    style={{
                      fontWeight: 300,
                      cursor: "pointer",
                      borderRadius: "7px",
                      border: "1px solid #e43559",
                      background: "#28273f",
                    }}
                  />
                </DateRangePicker>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 mb-5">
          {type === "UserHost" ? (
            analyticUser?.length > 0 || analyticHost?.length > 0 ? (
              <Line
                options={options}
                data={chartData}
                width={1146}
                height={250}
                style={{
                  display: "block",
                  boxSizing: "border-box",
                }}
              />
            ) : (
              <Line
                options={options}
                data={chartData}
                width={1146}
                height={250}
                style={{
                  display: "block",
                  boxSizing: "border-box",
                }}
              />
            )
          ) : type === "LiveHost" ? (
            analyticData?.length > 0 ? (
              <Line
                options={options}
                data={otherChart}
                width={1146}
                height={250}
                style={{
                  display: "block",
                  boxSizing: "border-box",
                }}
              />
            ) : (
              <Line
                options={options}
                data={otherChart}
                width={1146}
                height={250}
                style={{
                  display: "block",
                  boxSizing: "border-box",
                }}
              />
            )
          ) : type === "Revenue" ? (
            analyticData?.length > 0 ? (
              <Line
                options={options}
                data={otherChart}
                width={1146}
                height={250}
                style={{
                  display: "block",
                  boxSizing: "border-box",
                }}
              />
            ) : (
              <Line
                options={options}
                data={otherChart}
                width={1146}
                height={250}
                style={{
                  display: "block",
                  boxSizing: "border-box",
                }}
              />
            )
          ) : (
            <Line
              options={{ responsive: true }}
              data={defaultChart}
              width={1146}
              height={250}
              style={{
                display: "block",
                boxSizing: "border-box",
              }}
            />
            // <div>
            //   <p className="text-center" style={{ fontSize: "15px" }}>
            //     No Chart available
            //   </p>
            // </div>
          )}
        </div>
      </div>
    </>
  );
};

export default connect(null, { getDashboard, getChart, getChartData })(
  Dashboard
);
