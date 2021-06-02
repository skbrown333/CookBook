import React, {
  FunctionComponent,
  useState,
  useContext,
  useEffect,
} from 'react';

import { useHistory, useParams, useRouteMatch, useLocation } from 'react-router-dom';

/* Styles */
import './_search-create-bar.scss';

/* Components */
import {
  EuiButtonIcon,
  EuiLoadingChart,
  EuiFilterSelectItem,
  EuiPopoverTitle,
  EuiFieldSearch,
  EuiIcon,
  EuiSpacer,
  EuiPopover,
  EuiFilterGroup,
  EuiFilterButton,
} from '@elastic/eui';

/* Context */
import { Context } from '../../store/Store';
import TagService from '../../services/TagService/TagService';

export interface SearchCreateBarProp {
  handlePlus: () => void;
  handleSearch: (e) => void;
  handleFilterChange?: (filters: any) => void;
  className?: string;
  actualSearchText?: string,
}

export const SearchCreateBar: FunctionComponent<SearchCreateBarProp> = ({
  handlePlus,
  handleSearch,
  handleFilterChange,
  className,
  actualSearchText,
}) => {
  const locationHook = useLocation();
  // const locationDom = window.location;
  // console.log('hook', locationHook.search)
  // console.log('native', locationDom.search);
  const startQuery = locationHook.search.slice(locationHook.search.indexOf('=') + 1).toUpperCase();
  console.log(startQuery);

  const [state] = useContext(Context);
  const { cookbook, user } = state;
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<any>([]);
  const [searchText, setSearchText] = useState('');
  const tagService = new TagService(cookbook._id);

  useEffect(() => {
    async function init() {
      setLoading(true);
      setItems([]);
      const tags = await tagService.get();
      setItems([...tags]);
      setLoading(false);
    }
    init();
  }, []);

  const handleSearchFilter = (event) => {
    const value = event.target.value.toUpperCase();
    setSearchText(value);
  };

  const onButtonClick = async () => {
    setSearchText('');
    setIsPopoverOpen(!isPopoverOpen);
  };

  const closePopover = () => {
    setIsPopoverOpen(false);
  };

  function updateItem(item) {
    const newItems = [...items];

    switch (item.checked) {
      case 'on':
        item.checked = undefined;
        break;

      default:
        item.checked = 'on';
    }

    if (handleFilterChange) {
      handleFilterChange(
        newItems
          .filter((item) => item.checked && item.checked === 'on')
          .map((i) => {
            return {
              label: i.label,
              _id: i._id,
            };
          }),
      );
    }

    setItems([...newItems]);
  }

  const button = (
    <EuiFilterButton
      iconType="arrowDown"
      onClick={onButtonClick}
      isSelected={isPopoverOpen}
      numFilters={items.length}
      hasActiveFilters={!!items.find((item) => item.checked === 'on')}
      numActiveFilters={items.filter((item) => item.checked === 'on').length}
    >
      Tags
    </EuiFilterButton>
  );

  return (
    <div className={`${className} search-controls`}>
      <EuiFilterGroup className="search-controls__filters">
        <EuiFieldSearch onChange={handleSearch} value = {decodeURI(actualSearchText?.toLowerCase() as string)} fullWidth />
        <EuiPopover
          id="popoverExampleMultiSelect"
          button={button}
          isOpen={isPopoverOpen}
          closePopover={closePopover}
          panelPaddingSize="none"
        >
          <EuiPopoverTitle paddingSize="s">
            <EuiFieldSearch
              compressed
              onChange={handleSearchFilter}
              isClearable={false}
            />
          </EuiPopoverTitle>

          <div className="euiFilterSelect__items">
            {!loading &&
              items.length > 0 &&
              items
                .filter((item) => {
                  return item.label.toUpperCase().indexOf(searchText) > -1;
                })
                .map((item, index) => (
                  <EuiFilterSelectItem
                    checked={item.checked}
                    key={index}
                    onClick={() => {
                      updateItem(item);
                    }}
                  >
                    {item.label}
                  </EuiFilterSelectItem>
                ))}
            {/*
              Use when loading items initially
            */}
            {loading && (
              <div className="euiFilterSelect__note">
                <div className="euiFilterSelect__noteContent">
                  <EuiLoadingChart size="m" />
                </div>
              </div>
            )}
            {/*
              Use when no results are returned
            */}
            {!loading && items.length < 1 && (
              <div className="euiFilterSelect__note">
                <div className="euiFilterSelect__noteContent">
                  <EuiIcon type="minusInCircle" />
                  <EuiSpacer size="xs" />
                  <p>No filters found</p>
                </div>
              </div>
            )}
          </div>
        </EuiPopover>
      </EuiFilterGroup>
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
