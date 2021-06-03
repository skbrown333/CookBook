import React, {
  FunctionComponent,
  useEffect,
  useState,
  useContext,
  useCallback,
} from 'react';
import SwipeableViews from 'react-swipeable-views';
import { useHistory, useParams, useRouteMatch, useLocation } from 'react-router-dom';

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
  // const locationDom = window.location;
  // console.log('hook', locationHook.search)
  // console.log('native', locationDom.search);
  // const startQuery = locationHook.search.slice(locationHook.search.indexOf('=') + 1);
  const params = new URLSearchParams(locationHook.search);
  const startQuery:any = params.get('search') || '';
  console.log(startQuery);

  const [state, dispatch] = useContext(Context);
  const toast = new ToastService();
  const firebase = useContext<Firebase | null>(FirebaseContext);
  const { cookbook } = state;
  const history = useHistory();
  console.log(history);
  const [searchText, setSearchText] = useState(startQuery);
  const [filters, setFilters] = useState<any>([]);
  const [adding, setAdding] = useState(history.location.pathname);
  const [dbSearch, setDbSearch] = useState(startQuery);


  const handleChange = (index) => {
    console.log('hello');
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
    // here 
    console.log("this useEffect called")
    const params = new URLSearchParams();

    if (searchText) {
      params.append("search", searchText);
      console.log(searchText)
    } else {
      params.delete("search");
      console.log('searchText empty')
    }
    history.push({search: params.toString()})
  }, [searchText, index]);

  const handleSearch = (event) => {
    const value = event.target.value;
    setSearchText(value);
    debouncedSearch(value);
  };

  const handleFilterChange = (filters) => {
    setFilters(filters);
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
          actualSearchText = {searchText}
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
