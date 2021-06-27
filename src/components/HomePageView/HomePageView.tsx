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
import { ContributorSideBar } from '../ContributorSideBar/ContributorSideBar';
import debounce from 'lodash.debounce';

/* Context */
import { Context } from '../../store/Store';
import { updateAddStatus } from '../../store/actions';

/* Services */
import TagService from '../../services/TagService/TagService';

/* Styles */
import './_home-page-view.scss';
import { Tag } from '../../models/Tag';

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
  const [, dispatch] = useContext(Context);
  const history = useHistory();
  const [searchText, setSearchText] = useState(startQuery);
  const [filters, setFilters] = useState<any>([]);
  const [adding, setAdding] = useState(history.location.pathname);
  const [dbSearch, setDbSearch] = useState(startQuery);

  const [state] = useContext(Context);
  const { cookbook } = state;
  const tagService = new TagService(cookbook._id);
  const [tags, setTags] = useState(Array<Tag>());

  useEffect(() => {
    const init = async () => {
      const tags = await tagService.get();
      setTags(tags);
    };
    init();
  }, []);

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
      <ContributorSideBar />
      <div className="home-view">
        {tags.length > 0 && (
          <SearchCreateBar
            initialTags={tags}
            handleSearch={handleSearch}
            handleFilterChange={handleFilterChange}
            handlePlus={() => {
              setAdding(history.location.pathname);
              dispatch(updateAddStatus(true));
            }}
            actualSearchText={searchText}
            selectedFilterStrings={filterStringArray}
          />
        )}
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
