import React from 'react';

export const ITEMS_PER_PAGE = 3;

export default function Pagination({
  total,
  page,
  setPage,
  disableNext,
  totalPage,
  hideGotoPage = false
}) {
  const numberOfPages = totalPage || Math.ceil(total / ITEMS_PER_PAGE);
  const [input, setInput] = React.useState("");

  function showError(msg) {
    console.log(msg)
  }

  function handleSearch() {
    const inputInt = +input;
    if (inputInt <= 0) {
      return showError("Page number should be greater than 0.");
    }
    if (inputInt > numberOfPages) {
      return showError(`Entered page number is greater than total pages.`);
    }
    setPage(inputInt);
  }

  function handleKeyPress(event) {
    if (event.which === 13 || event.keyCode === 13) {
      handleSearch();
    }
  }

  return (
    <div className="table-pagination">
      <div className="pagination-info">
        <p>Total Result{total > 1 ? 's' : ''}: {total}</p>
      </div>
      <div className="pagination-controls">
        <div className='pagination-res'>
          <div>
            <button
            className="pagination-button"
            onClick={() => setPage(page - 1)}
            disabled={page <= 1}
            title={"Previous Page"}
            >
              &#60;
            </button>

            <button
            className="pagination-button"
            onClick={() => setPage(page + 1)}
            disabled={disableNext}
            title={"Next Page"}
          >
            &#62;
          </button>
          </div>
          <p>Page {page} of {numberOfPages}</p>

        </div>
        
        
        {numberOfPages > 2 && !hideGotoPage && (
          <div>
            <input 
                type="number"
                className="btn-page"
                placeholder="Page No."
                min={1}
                max={numberOfPages}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
            />
            <button
              className="btn-page"
              type="button"
              onClick={handleSearch}
            >
              Go To
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
