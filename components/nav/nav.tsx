import styles from './Nav.module.scss';
import Link from 'next/link';
import useSite, { IMenu, IMenuItem } from '../../hooks/useSite'
import NavMenuItem from './navMenuItem'
import { useCallback, useEffect, useRef, useState } from 'react'
import { FaSearch } from 'react-icons/fa'
import { SEARCH_STATE, useSearch } from '../../hooks/useSearch'

function getPrimaryMenu(menus: IMenu[]): IMenuItem[]{
  const mainMenu = menus.find(menu => menu.slug === 'primary')
  
  if(!mainMenu) return

  // filter out submenu items appearing as main level items
    return mainMenu.menuItems.filter(menuItem => {
      if(menuItem.parentId){
        return
      }
      return menuItem
    })
}
enum SearchEnum {
  SEARCH_HIDDEN = 'hidden',
  SEARCH_VISIBLE = 'visible'
}
const Nav = () => {
  const formRef = useRef<HTMLFormElement>();
  const { metadata, menus } = useSite();
  const [searchVisibility, setSearchVisibility] = useState(SearchEnum.SEARCH_HIDDEN);
  const primaryMenu = getPrimaryMenu(menus)

  const { query, results, search, clearSearch, state } = useSearch({
    maxResults: 10,
  });
  const searchIsLoaded = state === SEARCH_STATE.LOADED;

  // When the search visibility changes, we want to add an event listener that allows us to
  // detect when someone clicks outside of the search box, allowing us to close the results
  // when focus is drawn away from search

  useEffect(() => {
    // If we don't have a query, don't need to bother adding an event listener
    // but run the cleanup in case the previous state instance exists

    if (searchVisibility === SearchEnum.SEARCH_HIDDEN) {
      // removeDocumentOnClick();
      return;
    }

    addDocumentOnClick();
    addResultsRoving();

    // When the search box opens up, additionally find the search input and focus
    // on the element so someone can start typing right away
    if(formRef.current){
      const searchInput: HTMLInputElement = Array.from(formRef.current.elements)
        .find((input: any) => input.type === 'search') as HTMLInputElement

      searchInput.focus();
    }

    return () => {
      // removeResultsRoving();
      // removeDocumentOnClick();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchVisibility]);

  /**
   * addDocumentOnClick
   */
  function addDocumentOnClick() {
    document.body.addEventListener('click', handleOnDocumentClick, true);
  }


  /**
   * handleOnDocumentClick
   */
  function handleOnDocumentClick(e) {
    if (!e.composedPath().includes(formRef.current)) {
      setSearchVisibility(SearchEnum.SEARCH_HIDDEN);
      clearSearch();
    }
  }

  /**
   * addResultsRoving
   */
  function addResultsRoving() {
    document.body.addEventListener('keydown', handleResultsRoving);
  }

  /**
   * handleResultsRoving
   */

  function handleResultsRoving(e) {
    const focusElement: any = document.activeElement;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (focusElement.nodeName === 'INPUT' && focusElement.nextSibling.children[0].nodeName !== 'P') {
        focusElement.nextSibling.children[0].firstChild.firstChild.focus();
      } else if (focusElement.parentElement.nextSibling) {
        focusElement.parentElement.nextSibling.firstChild.focus();
      } else {
        focusElement.parentElement.parentElement.firstChild.firstChild.focus();
      }
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (focusElement.nodeName === 'A' && focusElement.parentElement.previousSibling) {
        focusElement.parentElement.previousSibling.firstChild.focus();
      } else {
        focusElement.parentElement.parentElement.lastChild.firstChild.focus();
      }
    }
  }

  function handleOnToggleSearch(){
    setSearchVisibility(SearchEnum.SEARCH_VISIBLE);
  }

  /**
   * handleOnSearch
   */
  function handleOnSearch({ currentTarget }) {
    search({
      query: currentTarget.value,
    });
  }

  /**
   * escFunction
   */
  // pressing esc while search is focused will close it
  const escFunction = useCallback((event) => {
      if (event.keyCode === 27) {
        clearSearch();
        setSearchVisibility(SearchEnum.SEARCH_HIDDEN);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

  useEffect(() => {
    document.addEventListener('keydown', escFunction, false);

    return () => {
      document.removeEventListener('keydown', escFunction, false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <nav className={styles.nav}>
      <section className={styles.navSection}>
        {/* LOGO */}
        <p className={styles.navName}>
          <Link href="/">
            <a>{metadata.title}</a>
          </Link>
        </p>

        {/* NAVIGATION */}
        <ul className={styles.navMenu}>
          {primaryMenu.map((menuItem) => {
            return <NavMenuItem key={menuItem.id} dropDownClassNames={styles.navSubMenu} item={menuItem} />;
          })}
        </ul>

        {/* SEARCH */}
        <div className={styles.navSearch}>

          {/* IS HIDDEN */}
          {searchVisibility === SearchEnum.SEARCH_HIDDEN && (
            <button onClick={handleOnToggleSearch} disabled={!searchIsLoaded}>
              <span className={styles.navSrOnly}>Toggle Search</span>
              <FaSearch />
            </button>
          )}

          {/* IS VISIBLE */}
          {searchVisibility === SearchEnum.SEARCH_VISIBLE && (
            <form ref={formRef} data-search-is-active={!!query}>
              <input
                type="search"
                name="q"
                value={query || ''}
                onChange={handleOnSearch}
                autoComplete="off"
                placeholder="Search..."
                required
              />
              <div className={styles.navSearchResults}>
                {results.length > 0 && (
                  <ul>
                    {results.map(({ slug, title }) => {
                      return (
                        <li key={slug}>
                          <Link href={`/${slug}`}>
                            <a>{title}</a>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
                {results.length === 0 && (
                  <p>
                    Sorry, not finding anything for <strong>{query}</strong>
                  </p>
                )}
              </div>
            </form>
          )}
        </div>
      </section>
    </nav>
  )
}

export default Nav
