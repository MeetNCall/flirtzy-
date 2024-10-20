import React from "react";

//pagination
import TablePagination from "react-js-pagination";

const ServerPagination = (props) => {
  const handlePage = (page) => {
    props.handlePageChange(page);
  };

  const handleRowsPerPage = (value) => {
    props.handleRowsPerPage(value);
  };
  return (
    <>
      <div className="d-md-flex justify-content-end">
        <div className="d-flex">
          <span style={{ marginTop: "12px" }} className="text-info d-flex">
            Rows{" "}
            {/* <p style={{ margin: "0px 15px" }}>
              {props.activePage} - {props.rowsPerPage} of {props.userTotal}
            </p> */}
          </span>

          <select
            class="form-select form-control mr-3 ml-2 mb-2 mb-md-0 mb-lg-0 dropdown border"
            style={{
              marginLeft: 5,
              width: "70px",
              height: "calc(1.2em + 1.2rem + 0px)",
              border: "none",
              background: "none",
              marginTop: "5px",
              borderRight: "4px solid transparent",
            }}
            onChange={(e) => {
              handleRowsPerPage(e.target.value);
            }}
          >
            <option class="text-white" value="5">
              5
            </option>
            <option class="text-white" value="10" selected>
              10
            </option>
            <option class="text-white" value="25">
              25
            </option>
            <option class="text-white" value="50">
              50
            </option>
            <option class="text-white" value="100">
              100
            </option>
            <option class="text-white" value="200">
              200
            </option>
            <option class="text-white" value="500">
              500
            </option>
            <option class="text-white" value="1000">
              1000
            </option>
            <option class="text-white" value="5000">
              5000
            </option>
            <option class="text-white" value={props.userTotal}>
              ALL
            </option>
          </select>
        </div>
        <div className="align-middle">
          <TablePagination
            activePage={props.activePage}
            itemsCountPerPage={props.rowsPerPage}
            totalItemsCount={props.userTotal}
            pageRangeDisplayed={2}
            onChange={(page) => handlePage(page)}
            itemClass="page-item"
            linkClass="page-link"
          />
        </div>
      </div>
    </>
  );
};

export default ServerPagination;
