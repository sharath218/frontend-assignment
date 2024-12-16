import React, { useState, useEffect } from "react";
import "./styles.css";

const currencySymbols = {
  RW: { currency: "RWF", symbol: "FRw" },
  AU: { currency: "AUD", symbol: "$" },
  CH: { currency: "CHF", symbol: "CHF" },
  VN: { currency: "VND", symbol: "₫" },
  PL: { currency: "PLN", symbol: "zł" },
  ES: { currency: "EUR", symbol: "€" },
  DK: { currency: "DKK", symbol: "kr" },
  DE: { currency: "EUR", symbol: "€" },
  SI: { currency: "EUR", symbol: "€" },
  CN: { currency: "CNY", symbol: "¥" },
  GB: { currency: "GBP", symbol: "£" },
  US: { currency: "USD", symbol: "$" },
  FR: { currency: "EUR", symbol: "€" },
  CA: { currency: "CAD", symbol: "C$" },
};

const API_URL =
  "https://raw.githubusercontent.com/saaslabsco/frontend-assignment/refs/heads/master/frontend-assignment.json";

const Table = () => {
  const [projects, setProjects] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  useEffect(() => {
    fetch(API_URL)
      .then((response) => response.json())
      .then((data) => {
        console.log({ data });

        setProjects(data);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const startIndex = (currentPage - 1) * itemsPerPage;
  console.log({ projects });

  const currentItems = projects.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(projects.length / itemsPerPage);

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(Number(event.target.value));
    setCurrentPage(1); // Reset to the first page
  };

  const maxVisibleButtons = 5;
  const startPage =
    Math.floor((currentPage - 1) / maxVisibleButtons) * maxVisibleButtons + 1;

  const pageButtons = Array.from(
    { length: Math.min(maxVisibleButtons, totalPages - startPage + 1) },
    (_, i) => startPage + i
  );

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <div className="app">
      <h1 className="header">Kickstarter Projects</h1>
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>S.No.</th>
              <th>Percentage funded</th>
              <th>Amount pledged</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((project, index) => (
              <tr key={project.id}>
                <td>{startIndex + index + 1}</td>
                <td>{project["percentage.funded"] + " %"} </td>
                <td>
                  {(currencySymbols[project.country].symbol || " ") +
                    " " +
                    project["amt.pledged"]}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <div>
          <span className="page-info">
            Page {currentPage} of {totalPages}
          </span>

          <select
            className="items-per-page-dropdown"
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
          >
            {[5, 10, 25, 50, 100].map((value) => (
              <option key={value} value={value}>
                {value} items per page
              </option>
            ))}
          </select>
        </div>

        <div className="pagination-box">
          <button
            className="pagination-button"
            onClick={handlePrevious}
            disabled={currentPage === 1}
          >
            Previous
          </button>

          {startPage > 1 && (
            <button
              className="pagination-button"
              onClick={() => setCurrentPage(startPage - 1)}
            >
              ...
            </button>
          )}

          {pageButtons.map((page) => (
            <button
              key={page}
              className={`pagination-button ${
                currentPage === page ? "active" : ""
              }`}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          ))}

          {startPage + maxVisibleButtons - 1 < totalPages && (
            <button
              className="pagination-button"
              onClick={() => setCurrentPage(startPage + maxVisibleButtons)}
            >
              ...
            </button>
          )}

          <button
            className="pagination-button"
            onClick={handleNext}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Table;
