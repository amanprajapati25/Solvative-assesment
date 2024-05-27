import axios from "axios";
import { ITEMS_PER_PAGE } from "./Pagination";

export const apiRequest = (query, currentPage) => {
  const options = {
    method: 'GET',
    url: 'https://wft-geo-db.p.rapidapi.com/v1/geo/cities',
    params: { countryIds: 'IN', namePrefix: query, limit: ITEMS_PER_PAGE, offset: (currentPage - 1) * ITEMS_PER_PAGE },
    headers: {
      'x-rapidapi-host': 'wft-geo-db.p.rapidapi.com',
      'x-rapidapi-key': '44b9336c26msh2d2b72ba82f818bp113b5bjsnec09062e8a81',
    },
  };
  return axios.request(options); 
};
