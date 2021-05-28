import React, { FunctionComponent, Fragment, useState } from 'react';
import SwipeableViews from 'react-swipeable-views';
import { useHistory } from 'react-router-dom';

/* Components */
import { PostListView } from '../PostListView/PostListView';
import { GuideListView } from '../GuideListView/GuideListView';
import { SearchCreateBar } from '../SearchCreateBar/SearchCreateBar';
import { TwitchSidebar } from '../TwitchSidebar/TwitchSidebar';

/* Styles */
import './_home-page-view.scss';

export interface HomePageViewProps {
  index?: number;
}

export const HomePageView: FunctionComponent<HomePageViewProps> = ({
  index = 0,
}) => {
  const [searchText, setSearchText] = useState('');
  const [filters, setFilters] = useState<any>([]);
  const [showAdd, setShowAdd] = useState<boolean>(false);
  const history = useHistory();
  const handleChange = (index) => {
    switch (index) {
      case 0:
        history.push('/');
        break;
      case 1:
        history.push('/recipes');
    }
  };

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
          handlePlus={() => setShowAdd(true)}
        />
        <SwipeableViews
          onChangeIndex={handleChange}
          index={index}
          enableMouseEvents
        >
          <PostListView />
          <GuideListView />
        </SwipeableViews>
      </div>
      <TwitchSidebar className="home-view__twitch" />
    </div>
  );
};
