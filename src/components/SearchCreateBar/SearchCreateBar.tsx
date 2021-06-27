import React, {
  FunctionComponent,
  useState,
  useContext,
  useEffect,
} from 'react';

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

/* Services */
import { ToastService } from '../../services/ToastService';

/* Constants */
import { ROLES } from '../../constants/constants';

/* Models */
import { Tag } from '../../models/Tag';

export interface SearchCreateBarProp {
  handlePlus: () => void;
  handleSearch: (e) => void;
  handleFilterChange: (filters: any) => void;
  className?: string;
  actualSearchText?: string;
  selectedFilterStrings?: any;
  initialTags: Array<Tag>;
}

export const SearchCreateBar: FunctionComponent<SearchCreateBarProp> = ({
  handlePlus,
  handleSearch,
  handleFilterChange,
  className,
  actualSearchText,
  selectedFilterStrings,
  initialTags,
}) => {
  const [state] = useContext(Context);
  const { cookbook, user } = state;
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<any>([]);
  const [searchText, setSearchText] = useState('');
  const [filterCount, setFilterCount] = useState(selectedFilterStrings.length);
  const toast = new ToastService();

  const getAppliedFilters = () => items.filter((item) => item.checked);

  useEffect(() => {
    if (filterCount != selectedFilterStrings.length) {
      console.log(selectedFilterStrings);
      handleFilterChange(getAppliedFilters());
      setFilterCount(selectedFilterStrings.length);
    }
  }, [selectedFilterStrings]);

  useEffect(() => {
    async function init() {
      setLoading(true);
      try {
        const tags = initialTags.map((tag) => {
          if (selectedFilterStrings.includes(tag.label)) {
            tag.checked = true;
          }
          return tag;
        });

        handleFilterChange(getAppliedFilters());

        setItems([...tags]);
        setLoading(false);
      } catch (err) {
        toast.errorToast('Error Fetching Tags', err.message);
      }
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

    item.checked = item.checked ? false : true;

    handleFilterChange(getAppliedFilters());

    setItems([...newItems]);
  }

  const button = (
    <EuiFilterButton
      iconType="arrowDown"
      onClick={onButtonClick}
      isSelected={isPopoverOpen}
      numFilters={items.length}
      hasActiveFilters={!!items.find((item) => item.checked)}
      numActiveFilters={items.filter((item) => item.checked).length}
    >
      Tags
    </EuiFilterButton>
  );

  return (
    <div className={`${className} search-controls`}>
      <EuiFilterGroup className="search-controls__filters">
        <EuiFieldSearch
          onChange={handleSearch}
          value={actualSearchText as string}
          fullWidth
        />
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
      {user && ROLES.admin.includes(cookbook.roles[user.uid]) && (
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
