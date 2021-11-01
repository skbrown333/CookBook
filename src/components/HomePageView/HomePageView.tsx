import React, {
  FunctionComponent,
  useEffect,
  useState,
  useContext,
  useCallback,
} from 'react';
import SwipeableViews from 'react-swipeable-views';
import { useHistory, useLocation, useParams } from 'react-router-dom';

/* Components */
import { PostListView } from '../PostListView/PostListView';
import { GuideListView } from '../GuideListView/GuideListView';
import { SearchCreateBar } from '../SearchCreateBar/SearchCreateBar';
import { TwitchSidebar } from '../TwitchSidebar/TwitchSidebar';
import { ContributorSideBar } from '../ContributorSideBar/ContributorSideBar';
import debounce from 'lodash.debounce';

/* Services */
import { ToastService } from '../../services/ToastService';

/* Context */
import { Context } from '../../store/Store';
import { updateAddStatus, updateCookbook } from '../../store/actions';

/* Styles */
import './_home-page-view.scss';
import CookbookService from '../../services/CookbookService/CookbookService';

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
}

export default function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions(),
  );

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowDimensions;
}

export interface HomePageViewProps {
  index?: number;
}

export const HomePageView: FunctionComponent<HomePageViewProps> = ({
  index = 0,
}) => {
  const locationHook = useLocation();
  const params = new URLSearchParams(locationHook.search);
  const startQuery: any = params.get('search') || '';
  const filterString: any = locationHook.search.includes('filters=')
    ? locationHook.search.slice(locationHook.search.indexOf('filters=') + 8)
    : '';
  const filterStringArray =
    filterString.length > 0
      ? filterString.split('+').map((filter) => decodeURI(filter))
      : [];
  const [state, dispatch] = useContext(Context);
  const { cookbook, game } = state;
  const history = useHistory();
  const [searchText, setSearchText] = useState(startQuery);
  const [filters, setFilters] = useState<any>([]);
  const [adding, setAdding] = useState(history.location.pathname);
  const [dbSearch, setDbSearch] = useState(startQuery);
  const cookbookService = new CookbookService();
  const toast = new ToastService();
  const cookbookSlug = useParams().cookbook;
  const { height, width } = useWindowDimensions();

  const handleChange = (index) => {
    switch (index) {
      case 0:
        history.push(`/${cookbook.name}`);
        break;
      case 1:
        history.push(`/${cookbook.name}/recipes`);
        break;
    }
    setAdding(history.location.pathname);
  };

  const debouncedSearch = useCallback(
    debounce((search) => setDbSearch(search), 500),
    [], // will be created only once initially
  );

  useEffect(() => {
    async function init() {
      try {
        const cookbooks = await cookbookService.get({
          game: game._id,
          name: cookbookSlug,
        });
        dispatch(updateCookbook(cookbooks[0]));
      } catch (err) {
        toast.errorToast('Error', err);
      }
    }

    init();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();

    if (searchText) {
      params.append('search', searchText);
    } else {
      params.delete('search');
    }

    if (filters.length > 0) {
      const filterStrings = filters.map((filter) => encodeURI(filter.label));
      const filterString = filterStrings.join(' ');
      params.append('filters', filterString);
    } else {
      params.delete('filters');
    }
    history.push({ search: decodeURI(params.toString()) });
  }, [searchText, filters, index]);

  const handleSearch = (event) => {
    const value = event.target.value;
    setSearchText(value);
    debouncedSearch(value);
  };

  const handleFilterChange = (filters) => {
    setFilters([...filters]);
  };

  return (
    <div id="home-view">
      {cookbook && (
        <>
          <ContributorSideBar />
          <div className="home-view">
            <SearchCreateBar
              handleSearch={handleSearch}
              handleFilterChange={handleFilterChange}
              handlePlus={() => {
                setAdding(history.location.pathname);
                dispatch(updateAddStatus(true));
              }}
              actualSearchText={searchText}
              selectedFilterStrings={filterStringArray}
              className="home-search"
            />
            {width < 1280 && (
              <SwipeableViews onChangeIndex={handleChange} index={index}>
                <PostListView
                  adding={adding}
                  filters={filters}
                  searchText={dbSearch}
                />
                <GuideListView
                  adding={adding}
                  filters={filters}
                  searchText={searchText}
                />
              </SwipeableViews>
            )}
            {width >= 1280 && index === 0 && (
              <div style={{ marginTop: 48 }}>
                <PostListView
                  adding={adding}
                  filters={filters}
                  searchText={dbSearch}
                />
              </div>
            )}
            {width >= 1280 && index === 1 && (
              <div style={{ marginTop: 48 }}>
                <GuideListView
                  adding={adding}
                  filters={filters}
                  searchText={searchText}
                />
              </div>
            )}
          </div>
          <TwitchSidebar className="home-view__twitch" />
        </>
      )}
    </div>
  );
};
