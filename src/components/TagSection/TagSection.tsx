import React, { useState, useContext, useEffect } from "react";

/* Components */
import { EuiButtonEmpty, EuiComboBox } from "@elastic/eui";

/* Styles */
import "./_tag-section.scss";

/* Models */
import { Tag } from "../../models/Tag";

/* Store */
import { Context } from "../../store/Store";

/* Actions */
import { updateTags } from "../../store/actions";

export interface TagSectionProps {
  initial_tags: Array<Tag>;
  className: string;
  editing: boolean;
}

export function TagSection(props) {
  const { tags } = useContext(Context)[0];
  const dispatch = useContext(Context)[1];
  const [selectedOptions, setSelected] = useState(Array<Tag>());
  const [options, setOptions] = useState(tags);

  useEffect(() => {
    console.log("effect");
    dispatch(updateTags(options));
  }, [options]);

  const onChange = (selectedOptions) => {
    setSelected(selectedOptions);
  };

  const onCreateOption = (searchValue) => {
    const normalizedSearchValue = searchValue.trim().toLowerCase();

    if (!normalizedSearchValue) {
      return;
    }

    const newOption = {
      _id: "mock_tag_id",
      value: searchValue,
      label: searchValue,
    };

    if (options.some((tag) => tag.label != normalizedSearchValue)) {
      console.log("adding value");
      setOptions([...options, newOption]);
    }

    setSelected([...selectedOptions, newOption]);
  };
  return (
    <EuiComboBox
      placeholder="add tags"
      options={options}
      selectedOptions={selectedOptions}
      onChange={onChange}
      onCreateOption={onCreateOption}
      isClearable={true}
    />
  );
}
