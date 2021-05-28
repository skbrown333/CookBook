import React, { FunctionComponent } from 'react';
import SwipeableViews from 'react-swipeable-views';
import { useHistory } from 'react-router-dom';

/* Components */
import { PostListView } from '../PostListView/PostListView';
import { GuideListView } from '../GuideListView/GuideListView';

export interface HomePageViewProps {
  index?: number;
}

export const HomePageView: FunctionComponent<HomePageViewProps> = ({
  index = 0,
}) => {
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

  return (
    <SwipeableViews
      onChangeIndex={handleChange}
      index={index}
      enableMouseEvents
    >
      <PostListView />
      <GuideListView />
    </SwipeableViews>
  );
};
