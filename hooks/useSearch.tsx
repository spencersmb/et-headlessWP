import Fuse from 'fuse.js';
import { createContext, useContext, useEffect, useState } from 'react'
import { getSearchData } from '../lib/search/searchApi'

const SEARCH_KEYS = ['slug', 'title'];

export enum SEARCH_STATE {
  LOADING = 'LOADING',
  READY = 'READY',
  ERROR = 'ERROR',
  LOADED = 'LOADED'
}

export const SearchContext = createContext<any>({});

export const SearchProvider = (props) => {
  const search = useSearchState();
  return <SearchContext.Provider value={search} {...props} />;
};

export function useSearch ({ defaultQuery = null, maxResults = 5 } = {}) {
  const search = useContext(SearchContext);
  const { client } = search;

  const [query, setQuery] = useState(defaultQuery);
  let results = [];

  // If we have a query, make a search. Otherwise, don't modify the
  // results to avoid passing back empty results

  if (client && query) {
    results = client.search(query).map(({ item }) => item);
  }

  if (maxResults && results.length > maxResults) {
    results = results.slice(0, maxResults);
  }

  // If the defaultQuery argument changes, the hook should reflect
  // that update and set that as the new state

  useEffect(() => setQuery(defaultQuery), [defaultQuery]);

  /**
   * handleSearch
   */
  function handleSearch({ query }) {
    setQuery(query);
  }

  /**
   * handleClearSearch
   */
  function handleClearSearch() {
    setQuery(null);
  }

  return {
    ...search, // state from useContext
    query, // what userHas Typed into input
    results,
    search: handleSearch, // function called when user types something into input
    clearSearch: handleClearSearch,
  };

}

export function useSearchState() {
  const [state, setState] = useState(SEARCH_STATE.READY);
  const [data, setData] = useState(null);

  let client;

  if (data) {
    client = new Fuse(data.posts, {
      keys: SEARCH_KEYS,
      isCaseSensitive: false,
    });
  }

  // On load, we want to immediately pull in the search index, which we're
  // storing clientside and gets built at compile time
  useEffect(() => {
    // Example how to do api call inside useEffect
    (async function getData() {
      setState(SEARCH_STATE.LOADING);

      let searchData;

      // Get local data
      try {
        searchData = await getSearchData();
      } catch (e) {
        setState(SEARCH_STATE.ERROR);
        return;
      }

      setData(searchData);
      setState(SEARCH_STATE.LOADED);
    })();
  }, []);

  return {
    state, // LOADED, LOADING, ERROR, READY
    data, // WP_JSON data
    client, // FUSE
  };

}
