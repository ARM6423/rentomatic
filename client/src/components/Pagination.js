import React, { useEffect } from "react";
import { ButtonGroup } from "react-bootstrap";

import "../index.css";

/** credits to https://dev.to/franciscomendes10866/how-to-create-a-table-with-pagination-in-react-4lpd */

const Pagination = ({ range, setPage, page, slice }) => {
  useEffect(() => {
    if (slice.length < 1 && page !== 1) {
      setPage(page - 1);
    }
  }, [slice, page, setPage]);
  return (
    <div className="page-tableFooter">
      <ButtonGroup size="sm">
        {range.map((el, index) => (
          <button
            key={index}
            className={
              "page_button" +
              (page === el ? " page_activeButton" : " page_inactiveButton")
            }
            onClick={() => setPage(el)}
          >
            {el}
          </button>
        ))}
      </ButtonGroup>
    </div>
  );
};

export default Pagination;
