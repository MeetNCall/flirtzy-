import { TablePagination } from "@mui/material";
import dayjs from "dayjs";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getPurchasePlan } from "../../store/CoinPlan/CoinPlan.action";
import TablePaginationActions from "../../util/Pagination";

const PurchasePlanTable = (props) => {
  const { purchasePlan, total } = useSelector((state) => state.coinPlan);
  const dispatch = useDispatch();

  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    dispatch(getPurchasePlan());
  }, [dispatch]);

  useEffect(() => {
    setData(purchasePlan);
  }, [purchasePlan]);

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
      const data = purchasePlan.filter((data) => {
        return (
          data?.name?.toUpperCase()?.indexOf(value) > -1 ||
          data?.paymentGateway?.toUpperCase()?.indexOf(value) > -1 ||
          data?.coin?.toString()?.indexOf(value) > -1 ||
          data?.dollar?.toString()?.indexOf(value) > -1 ||
          data?.planLevel?.toString()?.indexOf(value) > -1
        );
      });
      setData(data);
    } else {
      setData(purchasePlan);
    }
  };
  return (
    <>
      <div className="row py-2">
        <div class="col-2">
          <h4 className="hostTitle">Purchase Plan </h4>
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
                <a href={() => false}> Purchase Plan </a>
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
                  <h4>Total Coin : {total}</h4>
                </div>
                <div class="col-xl-4 col-md-4 float-right col-sm-12 col-12 filtered-list-search ">
                  <form class="form-inline my-2 my-lg-0 justify-content-center">
                    <div class="w-100">
                      <input
                        type="text"
                        class="w-100 form-control product-search br-30"
                        id="input-search"
                        placeholder="Search Purchase Plan..."
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
                </div>
              </div>
              <div class="table-responsive">
                <table class="table text-center  mb-4 table-striped">
                  <thead>
                    <tr className="text-center">
                      <th className="fw-bold">No </th>
                      <th className="fw-bold">Name</th>
                      <th className="fw-bold">Coin</th>
                      <th className="fw-bold">Dollar</th>
                      <th className="fw-bold">Payment Gate way</th>

                      <th className="fw-bold">Purchase Date</th>
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
                              <td>{data?.name}</td>
                              <td> {data?.coin}</td>
                              <td> {data?.dollar}</td>
                              <td>{data?.paymentGateway}</td>
                              <td>{data?.purchaseDate}</td>
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
      </div>
    </>
  );
};

export default connect(null, { getPurchasePlan })(PurchasePlanTable);
