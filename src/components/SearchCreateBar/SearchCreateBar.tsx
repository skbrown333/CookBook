import React, { FunctionComponent, useContext } from 'react';

/* Styles */
import './_search-create-bar.scss';

/* Components */
import { EuiSearchBar, EuiButtonIcon } from '@elastic/eui';

/* Context */
import { Context } from '../../store/Store';

export interface SearchCreateBarProp {
  handlePlus: () => void;
  handleSearch: (e) => void;
  className?: string;
}

export const SearchCreateBar: FunctionComponent<SearchCreateBarProp> = ({
  handlePlus,
  handleSearch,
  className,
}) => {
  const [state] = useContext(Context);
  const { cookbook, user } = state;
  return (
    <div className={`${className} search-controls`}>
      <EuiSearchBar onChange={handleSearch} />
      {user && cookbook.roles[user.uid] === 'admin' && (
        <EuiButtonIcon
          aria-label="add"
          className="search-controls__button"
          display="fill"
          iconType="plus"
          color="success"
          size="m"
          onClick={handlePlus}
        >
          Create
        </EuiButtonIcon>
      )}
    </div>
  );
};
