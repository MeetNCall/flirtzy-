import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { OPEN_STICKER } from "../../store/Sticker/Sticker.type";
import { warning } from "../../util/Alert";
import StickerDialog from "../Dialog/StickerDialog";
import TablePaginationActions from "../../util/Pagination";
import { baseURL } from "../../util/config";
import dayjs from "dayjs";
import { TablePagination } from "@mui/material";
import { getSticker, deleteSticker } from "../../store/Sticker/Sticker.action";
import noImage from  "../../assets/img/No_image.png"
import $ from "jquery";

const Sticker = (props) => {
  const dispatch = useDispatch();

  const { sticker } = useSelector((state) => state.sticker);
  
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    const imageTest = document.querySelector('img');
        imageTest.onload = ()=>{
        // Image is loaded and your further steps :)
        const isLoaded = imageTest.complete && imageTest.naturalHeight !== 0
        console.log(isLoaded);
       }
   }, []);

  useEffect(() => {
    dispatch(getSticker());
  }, [dispatch]);
  

  useEffect(() => {
    setData(sticker);
  }, [sticker]);

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
      const bannerDta = sticker.filter((data) => {
        return data?.url?.toUpperCase()?.indexOf(value) > -1;
      });
      setData(bannerDta);
    } else {
      setData(sticker);
    }
  };
  const handleOpen = () => {
    dispatch({ type: OPEN_STICKER });
  };

  const handleEdit = (data) => {
    dispatch({ type: OPEN_STICKER, payload: data });
  };

  const handleDelete = (id) => {
    const data = warning();
    data
      .then((isDeleted) => {
        if (isDeleted) {
           
          props.deleteSticker(id);
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
          <h4 className="hostTitle">Sticker </h4>
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
                <a href={() => false}> Sticker </a>
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
                    class="btn text-white btn-danger  text-center"
                    onClick={handleOpen}
                  >
                    <i class="fa fa-plus pr-1" aria-hidden="true"></i> Add
                  </button>
                </div>
                {/* <div class="col-xl-4 col-md-4 float-right col-sm-12 col-12 filtered-list-search ">
                  <form class="form-inline my-2 my-lg-0 justify-content-center">
                    <div class="w-100">
                      <input
                        type="text"
                        class="w-100 form-control product-search br-30"
                        id="input-search"
                        placeholder="Search Banner..."
                        onChange={(e) => handleSearch(e)}
                      />
                      <button
                        class="btn bg-danger-gradient  text-white"
                        type="button"
                      >
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
                          class="feather feather-search"
                        >
                          <circle cx="11" cy="11" r="8"></circle>
                          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                      </button>
                    </div>
                  </form>
                </div> */}
              </div>
              <div class="table-responsive">
                <table class="table text-center  mb-4 table-striped">
                  <thead>
                    <tr className="text-center">
                      <th className="fw-bold">ID</th>
                      <th className="fw-bold">Image </th>

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
                                  src={baseURL + data?.sticker}
                                  alt="banner"
                                  draggable="false"
                                  className="mx-auto "
                                  style={{
                                    width: "100px",
                                    height: "100px",
                                    borderRadius: "12px",
                                  }}
                                />
                              </td>

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
                    { label: "All", value: data?.length },
                  ]}
                  component="div"
                  count={data?.length}
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

        <StickerDialog />
      </div>
    </>
  );
};
export default connect(null, { getSticker, deleteSticker })(Sticker);
