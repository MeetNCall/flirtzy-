import { TablePagination } from "@mui/material";
import dayjs from "dayjs";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getBanner, deleteBanner } from "../../store/Banner/banner.action";
import { OPEN_BANNER } from "../../store/Banner/banner.type";
import { warning } from "../../util/Alert";
import { baseURL } from "../../util/config";
import TablePaginationActions from "../../util/Pagination";
import BannerDialog from "../Dialog/BannerDialog";
import noImage from "../../assets/img/No_image.png" 
import $ from "jquery";

const Banner = (props) => {
  const dispatch = useDispatch();

  const { banner } = useSelector((state) => state.banner);
  
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    dispatch(getBanner())
  }, [dispatch]);

  useEffect(() => {
    setData(banner);
  }, [banner]);
  // pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = (e) => {
    const value = e.target.value.toUpperCase();
    if (value) {
      const bannerDta = banner.filter((data) => {
        return data?.url?.toUpperCase()?.indexOf(value) > -1;
      });
      setData(bannerDta);
    } else {
      setData(banner);
    }
  };
  const handleOpen = () => {
    dispatch({ type: OPEN_BANNER });
  };

  const handleEdit = (data) => {
    dispatch({ type: OPEN_BANNER, payload: data });
  };

  const handleDelete = (id) => {
    const data = warning();
    data
      .then((isDeleted) => {
        if (isDeleted) {
           
          props.deleteBanner(id);
        }
      })
      .catch((err) => console.log(err));
  };

    // set default image

    $(document).ready(function () {
      $("img").bind("error", function () {
        // Set the default image
        $(this).attr("src", noImage);
      });
    });


  return (
    <>
      <div className="row py-2">
        <div class="col-2">
          <h4 className="hostTitle">Banner </h4>
        </div>
        <div class="col-10">
          <div class="breadcrumb-four float-right">
            <ul class="breadcrumb">
              <li>
                <Link to="/admin/dashboard">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="feather feather-home"
                  >
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                  </svg>
                </Link>
              </li>

              <li class="active">
                <a href={() => false}> Banner </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="row layout-top-spacing">
        <div id="tableDropdown" class="col-lg-12 col-12 layout-spacing">
          <div class="statbox widget  ">
            <div class="widget-content widget-content-area">
              <div class="row ">
                <div class="col-xl-8 col-md-8 col-sm-12 col-12 mb-4">
                  <button
                    class="btn text-white btn-danger text-center"
                    onClick={handleOpen}
                  >
                    <i class="fa fa-plus pr-1" aria-hidden="true"></i> Add
                  </button>
                </div>
                
              </div>
              <div class="table-responsive">
                <table class="table text-center  mb-4 table-striped">
                  <thead>
                    <tr className="text-center">
                      <th className="fw-bold">ID</th>
                      <th className="fw-bold">Image </th>
                      <th className="fw-bold">Url</th>
                      <th className="fw-bold"> Created At</th>
                      <th className="fw-bold">Edit</th>
                      <th className="fw-bold">Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.length > 0 ? (
                      (rowsPerPage > 0
                        ? data?.slice(
                            page * rowsPerPage,
                            page * rowsPerPage + rowsPerPage
                          )
                        : data
                      ).map((data, i) => {
                        return (
                          <>
                            <tr className="text-center">
                              <td> {page * rowsPerPage + parseInt(i) + 1}</td>
                              <td>
                                <img
                                  src={baseURL + data?.image}
                                  alt="banner"
                                  draggable="false"
                                  className="mx-auto "
                                  style={{
                                    width: "150px",
                                    height: "95px",
                                    borderRadius: "12px",
                                  }}
                                />
                              </td>
                              <td> {data?.url}</td>

                              <td>
                                {dayjs(data?.createdAt).format("DD MMM YYYY")}
                              </td>

                              <td>
                                <button
                                  className="btn btn-info"
                                  onClick={() => handleEdit(data)}
                                >
                                  <i className="fas fa-edit" />
                                </button>
                              </td>
                              <td>
                                <button
                                  className="btn btn-danger"
                                  onClick={() => handleDelete(data._id)}
                                >
                                  <i className="fas fa-trash-alt" />
                                </button>
                              </td>
                            </tr>
                          </>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="12" className="text-center">
                          No Data Found !
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
                <TablePagination
                  rowsPerPageOptions={[
                    5,
                    10,
                    25,
                    50,
                    100,
                    { label: "All", value: data.length },
                  ]}
                  component="div"
                  count={data.length}
                  page={page}
                  onPageChange={handleChangePage}
                  rowsPerPage={rowsPerPage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  ActionsComponent={TablePaginationActions}
                />
              </div>
            </div>
          </div>
        </div>

        <BannerDialog />
      </div>
    </>
  );
};

export default connect(null, { getBanner, deleteBanner })(Banner);
