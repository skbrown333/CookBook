import React, {
  FunctionComponent,
  useEffect,
  useState,
  useContext,
} from 'react';
import SwipeableViews from 'react-swipeable-views';
import { useHistory } from 'react-router-dom';

/* Components */
import { PostListView } from '../PostListView/PostListView';
import { GuideListView } from '../GuideListView/GuideListView';
import { SearchCreateBar } from '../SearchCreateBar/SearchCreateBar';
import { TwitchSidebar } from '../TwitchSidebar/TwitchSidebar';
import { EuiButtonGroup } from '@elastic/eui';

/* Services */
import { ToastService } from '../../services/ToastService';

/* Context */
import { Context } from '../../store/Store';
import { Firebase, FirebaseContext } from '../../firebase';
import { updateAddStatus, updateTwitch, UPDATE_ADD } from '../../store/actions';

/* Styles */
import './_home-page-view.scss';

export interface HomePageViewProps {
  index?: number;
}

export const HomePageView: FunctionComponent<HomePageViewProps> = ({
  index = 0,
}) => {
  const [state, dispatch] = useContext(Context);
  const toast = new ToastService();
  const firebase = useContext<Firebase | null>(FirebaseContext);
  const { cookbook } = state;
  const history = useHistory();
  const [route, setRoute] = useState(history.location.pathname);
  const [searchText, setSearchText] = useState('');
  const [filters, setFilters] = useState<any>([]);
  const [adding, setAdding] = useState(route);
  const [toggleIdSelected, setToggleIdSelected] = useState(route);

  const handleChange = (index) => {
    switch (index) {
      case 0:
        history.push('/');
        setToggleIdSelected('/');
        break;
      case 1:
        history.push('/recipes');
        setToggleIdSelected('/recipes');
        break;
    }
    setRoute(history.location.pathname);
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

  const handleSearch = (event) => {
    const value = event.target.value.toUpperCase();
    setSearchText(value);
  };

  const handleFilterChange = (filters) => {
    setFilters(filters);
  };

  const toggleButtons = [
    {
      id: '/',
      label: 'posts',
      iconType: 'home',
    },
    {
      id: '/recipes',
      label: 'guides',
      iconType: 'discoverApp',
    },
  ];

  return (
    <div id="home-view">
      <div className="home-view">
        <SearchCreateBar
          handleSearch={handleSearch}
          handleFilterChange={handleFilterChange}
          handlePlus={() => {
            setAdding(route);
            dispatch(updateAddStatus(true));
          }}
        />
        <EuiButtonGroup
          className="home-view__nav"
          legend="This is a disabled group"
          options={toggleButtons}
          idSelected={toggleIdSelected}
          onChange={(id) => {
            setToggleIdSelected(id);
            history.push(id);
          }}
          buttonSize="m"
          isIconOnly
        />
        <SwipeableViews
          onChangeIndex={handleChange}
          index={index}
          enableMouseEvents
        >
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
