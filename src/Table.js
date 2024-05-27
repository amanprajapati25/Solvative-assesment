import React, { useEffect, useState, useRef, useCallback } from 'react';
import axios from 'axios';
import './App.css';
import Pagination, { ITEMS_PER_PAGE } from './Pagination';
import { debounce } from './debounce';
import spinner from './spinner.gif';
import { apiRequest } from './Api';

const Table = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const searchInputRef = useRef(null);

  const fetchData = async (query, page) => {
    if (!query.trim()) {
      setData([]);
      setTotalResults(0);
      return;
    }
  
    setLoading(true);

    apiRequest(query, page)
      .then(response => {
        setData(response.data.data);
        setTotalResults(response.data.metadata.totalCount);
      })
      .catch(error => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const debouncedFetchData = useCallback(debounce(fetchData, 500), []);

  
  useEffect(() => {
    debouncedFetchData(searchTerm, currentPage);
  }, [searchTerm, currentPage, debouncedFetchData]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key === '/') {
        event.preventDefault();
        searchInputRef.current.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleSearch = (event) => {
    event.preventDefault();
    setCurrentPage(1);
    fetchData(searchTerm, 1);
  };

  return (
    <div>
      <form onSubmit={handleSearch}>
        <div className='search-container'>
          <input
            ref={searchInputRef}
            className='search-bar'
            placeholder='Search Places...'
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="shortcut">
            Ctrl + /
          </span>
        </div>
        

      </form>
      {loading ? (
        <div className="spinner">
          <img src={spinner} alt="Loading..." />
        </div>
      ) : (
        <>
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Place Name</th>
                <th>Country</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td id='table-null-state' colSpan="3">{searchTerm ? 'No result found' : 'Start searching'}</td>
                </tr>
              ) : (
                data.map((row, index) => (
                  <tr key={row.id}>
                    <td>{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}</td>
                    <td>{row.city}</td>
                    <td>
                      <img
                        src={`https://countryflags.com/png/IN`}
                        alt={row.country}
                        style={{ width: '20px', marginRight: '10px' }}
                      />
                      {row.country}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          {totalResults > 0 && (
            <Pagination
              total={totalResults}
              page={currentPage}
              setPage={setCurrentPage}
              disableNext={currentPage >= Math.ceil(totalResults / ITEMS_PER_PAGE)}
            />
          )}
        </>
      )}
    </div>
  );
};

export default Table;
