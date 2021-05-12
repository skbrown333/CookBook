import React, {
  useState,
  useContext,
  useEffect,
  FunctionComponent,
} from "react";

/* Components */
import { EuiComboBox } from "@elastic/eui";

/* Styles */
import "./_tag-input.scss";

/* Models */
import { Tag } from "../../models/Tag";

/* Store */
import FirebaseContext from "../../firebase/context";

export interface TagInputProps {
  initialTags: Array<Tag>;
  className?: string;
  handleUpdate: (options) => void;
}

export const TagInput: FunctionComponent<TagInputProps> = ({
  initialTags,
  handleUpdate,
}) => {
  const firebase = useContext(FirebaseContext);
  const [selectedOptions, setSelected] = useState(initialTags);
  const [options, setOptions] = useState(Array<any>());
  const [loading, setLoading] = useState(false);

  const fetchTags = async () => {
    try {
      let x = await firebase?.getTags();
      let tags = Array<Object>();
      x?.forEach((doc) => {
        tags.push({ label: doc.data().value });
      });
      setOptions(tags);
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  const onFocus = () => {
    setLoading(true);
    fetchTags();
  };

  const onChange = (selectedOptions) => {
    setSelected(selectedOptions);
    handleUpdate(selectedOptions);
  };

  const onCreateOption = (searchValue) => {
    const normalizedSearchValue = searchValue.trim().toLowerCase();
    const newOption = {
      _id: "mock_tag_id",
      label: normalizedSearchValue,
      value: normalizedSearchValue,
    };

    if (!normalizedSearchValue) {
      return;
    }

    if (options.some((tag) => tag != normalizedSearchValue)) {
      setOptions([...options, newOption]);
      firebase?.addTag(normalizedSearchValue);
    }

    setSelected([...selectedOptions, newOption]);
  };

  return (
    <EuiComboBox
      fullWidth
      placeholder="add tags"
      options={options}
      onFocus={onFocus}
      selectedOptions={selectedOptions}
      onChange={onChange}
      onCreateOption={onCreateOption}
      isClearable={true}
      isLoading={loading}
      isDisabled={true}
    />
  );
};
