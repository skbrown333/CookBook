import React, {
  FunctionComponent,
  useEffect,
  useState,
  useContext,
  useCallback,
} from 'react';
import SwipeableViews from 'react-swipeable-views';
import { useHistory, useLocation } from 'react-router-dom';

/* Components */
import { PostListView } from '../PostListView/PostListView';
import { GuideListView } from '../GuideListView/GuideListView';
import { SearchCreateBar } from '../SearchCreateBar/SearchCreateBar';
import { TwitchSidebar } from '../TwitchSidebar/TwitchSidebar';
import debounce from 'lodash.debounce';

/* Services */
import { ToastService } from '../../services/ToastService';

/* Context */
import { Context } from '../../store/Store';
import { Firebase, FirebaseContext } from '../../firebase';
import { updateAddStatus, updateTwitch } from '../../store/actions';

/* Styles */
import './_home-page-view.scss';

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
    filterString.length > 0 ? filterString.split('+') : [];
  const [state, dispatch] = useContext(Context);
  const toast = new ToastService();
  const firebase = useContext<Firebase | null>(FirebaseContext);
  const { cookbook } = state;
  const history = useHistory();
  const [searchText, setSearchText] = useState(startQuery);
  const [filters, setFilters] = useState<any>([]);
  const [adding, setAdding] = useState(history.location.pathname);
  const [dbSearch, setDbSearch] = useState(startQuery);

  const handleChange = (index) => {
    switch (index) {
      case 0:
        history.push('/');
        break;
      case 1:
        history.push('/recipes');
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
      if (firebase) {
        try {
          dispatch(
            updateTwitch(await firebase.getTwitchStreams(cookbook.streams)),
          );
        } catch (err) {
          toast.errorToast('Error Getting Streams', err.message);
        }
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
        />
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
      </div>
      <TwitchSidebar className="home-view__twitch" />
    </div>
  );
};
