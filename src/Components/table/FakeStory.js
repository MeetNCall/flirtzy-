import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteFakeStory,
  getFakeStory,
} from "../../store/fakeStory/fakeStory.action";
import { OPEN_FAKE_STORY_DIALOGUE } from "../../store/fakeStory/fakeStory.type";
import { Link, useHistory } from "react-router-dom/cjs/react-router-dom";
import { warning } from "../../util/Alert";
import { TablePagination } from "@mui/material";
import TablePaginationActions from "../../util/Pagination";
import $ from "jquery";
import noImage from "../../assets/img/female.png";
import male from "../../assets/img/boy copy.png";
import FakeStoryDialogue from "../Dialog/FakeStoryDialogue";

const FakeStory = () => {
  const dispatch = useDispatch();

  const { fakeStory } = useSelector((state) => state.fakeStory);
  

  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    dispatch(getFakeStory());
  }, [dispatch]);

  useEffect(() => {
    setData(fakeStory);
  }, [fakeStory]);

  // pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // handle host edit
  const handleEdit = (id) => {
    sessionStorage.setItem("storyId", id);
    dispatch({ type: OPEN_FAKE_STORY_DIALOGUE, payload: id });
  };

  const handleOpen = () => {
    dispatch({ type: OPEN_FAKE_STORY_DIALOGUE });
  };

  const handleDelete = (id) => {
    const data = warning();
    data
      .then((isDeleted) => {
        if (isDeleted) {
           
          dispatch(deleteFakeStory(id));
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div>
      <div className="row py-2">
        <div class="col-2">
          <h4 className="hostTitle">Fake Story </h4>
        </div>
        <div class="col-12">
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
                <a href={() => false}>Fake Story </a>
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
                <div class="col-xl-4 col-md-4 float-right col-sm-12 col-12 filtered-list-search "></div>
              </div>
              <div class="table-responsive">
                <table class="table text-center  mb-4 table-striped">
                  <thead>
                    <tr className="text-center">
                      <th className="fw-bold">ID</th>
                      <th className="fw-bold">Image</th>
                      <th className="fw-bold">Name</th>
                      <th className="fw-bold">Edit</th>
                      <th className="fw-bold">Delete</th>
                      {/* <th className="fw-bold">History</th> */}
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
                                  src={data?.image}
                                  alt="host"
                                  draggable="false"
                                  className="mx-auto table_image"
                                />
                              </td>

                              <td> {data?.hostId?.name}</td>

                              <td>
                                <button
                                  className="btn btn-secondary"
                                  onClick={() => handleEdit(data)}
                                >
                                  <i className="fas fa-edit" />
                                </button>
                              </td>

                              <td>
                                <button
                                  className="btn btn-danger"
                                  onClick={() => handleDelete(data?._id)}
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
                        <td colSpan="13" className="text-center">
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
        <FakeStoryDialogue />
      </div>
    </div>
  );
};

export default FakeStory;
