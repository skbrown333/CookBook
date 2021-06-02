import React, {
  FunctionComponent,
  useEffect,
  useState,
  useContext,
} from 'react';
import SwipeableViews from 'react-swipeable-views';
import { useHistory, useParams, useRouteMatch, useLocation } from 'react-router-dom';

/* Components */
import { PostListView } from '../PostListView/PostListView';
import { GuideListView } from '../GuideListView/GuideListView';
import { SearchCreateBar } from '../SearchCreateBar/SearchCreateBar';
import { TwitchSidebar } from '../TwitchSidebar/TwitchSidebar';

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
  const startQuery = locationHook.search.slice(locationHook.search.indexOf('=') + 1).toUpperCase();
  console.log(startQuery);

  const [state, dispatch] = useContext(Context);
  const toast = new ToastService();
  const firebase = useContext<Firebase | null>(FirebaseContext);
  const { cookbook } = state;
  const history = useHistory();
  const [searchText, setSearchText] = useState(startQuery);
  const [filters, setFilters] = useState<any>([]);
  const [adding, setAdding] = useState(history.location.pathname);


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
      params.append("search", searchText.toLowerCase());
      console.log(searchText)
    } else {
      params.delete("search");
      console.log('searchText empty')
    }
    history.replace({search: params.toString()})
  }, [history, searchText]);

  const handleSearch = (event) => {
    const value = event.target.value.toUpperCase();
    setSearchText(value);
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
        />
        <SwipeableViews onChangeIndex={handleChange} index={index}>
          <PostListView
            adding={adding}
            filters={filters}
            searchText={searchText}
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
