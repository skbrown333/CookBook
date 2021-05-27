import React, {
  useState,
  useContext,
  FunctionComponent,
  useEffect,
} from 'react';

/* Components */
import { EuiComboBox } from '@elastic/eui';

/* Styles */
import './_tag-input.scss';

/* Models */
import { Tag } from '../../models/Tag';

/* Store */
import FirebaseContext from '../../firebase/context';
import { Context } from '../../store/Store';
import { FIRESTORE } from '../../constants/constants';

/* Services */
import { ToastService } from '../../services/ToastService';
import TagService from '../../services/TagService/TagService';

export interface TagInputProps {
  initialTags: Array<Tag>;
  className?: string;
  handleUpdate: (options) => void;
}

export const TagInput: FunctionComponent<TagInputProps> = ({
  initialTags,
  handleUpdate,
}) => {
  const [state] = useContext(Context);
  const firebase = useContext(FirebaseContext);
  const [selected, setSelected] = useState(initialTags);
  const [options, setOptions] = useState(Array<any>());
  const [loading, setLoading] = useState(false);
  const { cookbook } = state;
  const toast = new ToastService();
  const tagService = new TagService(cookbook._id);

  useEffect(() => {
    handleUpdate(selected);
  }, [selected]);

  const fetchTags = async () => {
    try {
      const tags = await tagService.get();
      setOptions(tags);
    } catch (err) {
      toast.errorToast('Error fetching tags', err.message);
    } finally {
      setLoading(false);
    }
  };

  const createTag = async (newOption) => {
    try {
      const tag = await tagService.create(newOption);
      setOptions([...options, tag]);
      setSelected([...selected, tag]);
      toast.successToast(`Added tag: ${tag.label}`);
    } catch (err) {
      toast.errorToast(
        'Failed to add tag',
        err && err.message ? err.message : '',
      );
    }
  };

  const onFocus = () => {
    if (!options.length) {
      setLoading(true);
      fetchTags();
    }
  };

  const onChange = (selected) => {
    setSelected(selected);
  };

  const onCreateOption = (searchValue) => {
    const normalizedSearchValue = searchValue.trim().toLowerCase();
    const newOption = {
      label: normalizedSearchValue,
    };

    if (!normalizedSearchValue) return;

    createTag(newOption);
  };

  return (
    <EuiComboBox
      fullWidth
      placeholder="add tags"
      options={options}
      onFocus={onFocus}
      selectedOptions={selected}
      onChange={onChange}
      onCreateOption={onCreateOption}
      isClearable={true}
      isLoading={loading}
    />
  );
};
