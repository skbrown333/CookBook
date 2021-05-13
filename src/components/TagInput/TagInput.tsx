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
import { Context } from "../../store/Store";
import { updateToasts } from "../../store/actions";
import { FIRESTORE } from "../../constants/constants";

export interface TagInputProps {
  initialTags: Array<Tag>;
  className?: string;
  handleUpdate: (options) => void;
}

export const TagInput: FunctionComponent<TagInputProps> = ({
  initialTags,
  handleUpdate,
}) => {
  const [state, dispatch] = useContext(Context);
  const firebase = useContext(FirebaseContext);
  const [selectedOptions, setSelected] = useState(initialTags);
  const [options, setOptions] = useState(Array<any>());
  const [loading, setLoading] = useState(false);
  const { cookbook } = state;

  const fetchTags = async () => {
    try {
      let x = await firebase?.getAll(cookbook.id, FIRESTORE.collections.tags);
      let tags = Array<Object>();
      x?.forEach((doc) => {
        tags.push({ label: doc.data().value });
      });
      setOptions(tags);
      setLoading(false);
    } catch (err) {
      dispatch(
        updateToasts(
          state.toasts.concat({
            title: "Error fetching tags",
            color: "danger",
            iconType: "alert",
            toastLifeTimeMs: 5000,
            text: <p>{err.message}</p>,
          })
        )
      );
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
      firebase?.add(cookbook.id, FIRESTORE.collections.tags, {
        value: normalizedSearchValue,
      });
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