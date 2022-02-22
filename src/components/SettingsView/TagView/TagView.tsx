import React, {
  FunctionComponent,
  useContext,
  useState,
  useEffect,
} from 'react';

/* Component */
import {
  EuiBasicTable,
  EuiButton,
  EuiButtonEmpty,
  EuiButtonIcon,
  EuiColorPicker,
  EuiModal,
  EuiModalBody,
  EuiModalFooter,
  EuiModalHeader,
  EuiModalHeaderTitle,
} from '@elastic/eui';
import { SearchCreateBar } from '../../SearchCreateBar/SearchCreateBar';

/* Services */
import { ToastService } from '../../../services/ToastService';
import TagService from '../../../services/TagService/TagService';

/* Store */
import { Context } from '../../../store/Store';

/* Constants */

/* Styles */
import './_tag-view.scss';

export interface TagViewProps {}

export const TagView: FunctionComponent<TagViewProps> = () => {
  const [tagItems, setTagItems] = useState([]);
  const [tagToRemove, setTagToRemove] = useState<any>(null);
  const [showRemoveTag, setShowRemoveTag] = useState<boolean>(false);
  const [searchText, setSearchText] = useState('');
  const [state, dispatch] = useContext(Context);
  const { user, cookbook } = state;
  const tagService = new TagService(cookbook._id);
  const toast = new ToastService();

  useEffect(() => {
    async function init() {
      const tags = await tagService.get();

      setTagItems(
        tags.map((tag) => {
          const { label, color, _id } = tag;
          return {
            label,
            color,
            _id,
          };
        }),
      );
    }
    init();
  }, [cookbook]);

  const closeRemoveModal = () => {
    setShowRemoveTag(false);
  };

  const showRemoveModal = () => {
    setShowRemoveTag(true);
  };

  const handleTagUpdate = async (color, tag) => {
    try {
      const newTag = await tagService.update(tag._id, user, { color });
      const newTags: any = [...tagItems].map((item: any) => {
        if (item._id !== newTag._id) return item;
        const { label, _id } = tag;
        return {
          label,
          color: newTag.color,
          _id,
        };
      });
      setTagItems(newTags);
    } catch (err: any) {
      toast.errorToast(`Failed updating tag`, err.message);
    }
  };

  const handleRemoveTag = async () => {
    try {
      await tagService.delete(tagToRemove._id, user);
      const newTags: any = [...tagItems].filter((item: any) => {
        if (item._id !== tagToRemove._id) return item;
      });
      setTagItems(newTags);
      toast.successToast(`Tag Updated`);
    } catch (err: any) {
      toast.errorToast(`Failed updating tag`, err.message);
    }
    closeRemoveModal();
  };

  const updateSearchText = (event) => {
    const value = event.target.value;
    setSearchText(value);
  };

  const removeTagModal = (
    <EuiModal
      className="tag-view__modal"
      onClose={closeRemoveModal}
      initialFocus="[name=popswitch]"
    >
      <EuiModalHeader>
        <EuiModalHeaderTitle>
          <h1>Remove Tag</h1>
        </EuiModalHeaderTitle>
      </EuiModalHeader>
      <EuiModalBody>
        Are you sure you want to remove: <br />
        {tagToRemove && (
          <span
            className="tag"
            style={{ display: 'flex', alignItems: 'center', padding: 12 }}
          >
            <div
              className="tag-color"
              style={{ backgroundColor: tagToRemove.color }}
            ></div>
            <div className="tag-name">{`${tagToRemove.label}`}</div>
          </span>
        )}
      </EuiModalBody>
      <EuiModalFooter>
        <EuiButtonEmpty onClick={closeRemoveModal}>Cancel</EuiButtonEmpty>
        <EuiButton onClick={handleRemoveTag} fill>
          Confirm
        </EuiButton>
      </EuiModalFooter>
    </EuiModal>
  );

  const columns = [
    {
      field: 'label',
      name: 'Label',
      render: (label) => {
        return (
          <>
            <div className="tagname">{`#${label}`}</div>
          </>
        );
      },
    },
    {
      field: 'color',
      name: 'Color',
      render: (color, tag) => {
        return (
          <>
            <EuiColorPicker
              onChange={(color) => handleTagUpdate(color, tag)}
              color={color}
              isClearable
            />
            <EuiButtonIcon
              onClick={() => {
                setTagToRemove(tag);
                showRemoveModal();
              }}
              iconType="minusInCircle"
              color="danger"
              style={{ marginLeft: 12 }}
            ></EuiButtonIcon>
          </>
        );
      },
    },
  ];
  return (
    <div className="tag-view">
      <div className="tag-view__header">Tags</div>
      <div className="tag-view__content">
        {showRemoveTag && tagToRemove && removeTagModal}
        <SearchCreateBar
          handlePlus={() => {}}
          handleSearch={updateSearchText}
          disableTags
        />
        <EuiBasicTable
          items={tagItems.filter(
            (item: any) =>
              `${item.label}`.toUpperCase().indexOf(searchText.toUpperCase()) >
              -1,
          )}
          rowHeader="label"
          columns={columns}
        />
      </div>
    </div>
  );
};
