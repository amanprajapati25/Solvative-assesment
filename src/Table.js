import React, { useEffect, useState, useRef, useCallback } from 'react';
import axios from 'axios';
import './App.css';
import Pagination, { ITEMS_PER_PAGE } from './Pagination';
import { debounce } from './debounce';
import spinner from './spinner.gif'
const Table = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const searchInputRef = useRef(null);

  const fetchData = async (query, page = 1) => {
    if (!query.trim()) {
      setData([]);
      setTotalResults(0);
      return;
    }
  
    setLoading(true);
  
    const options = {
      method: 'GET',
      url: 'https://wft-geo-db.p.rapidapi.com/v1/geo/cities',
      params: { countryIds: 'IN', namePrefix: query, limit: ITEMS_PER_PAGE, offset: (page - 1) * ITEMS_PER_PAGE },
      headers: {
        'x-rapidapi-host': 'wft-geo-db.p.rapidapi.com',
        'x-rapidapi-key': '44b9336c26msh2d2b72ba82f818bp113b5bjsnec09062e8a81',
      },
    };
  
    try {
      const response = await axios.request(options);
      setData(response.data.data);
      setTotalResults(response.data.metadata.totalCount);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
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
        <div className='input-bor'>
          <input
            ref={searchInputRef}
            className='search-bar'
            placeholder='Search Places...'
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
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
