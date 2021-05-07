import React, { useState, useContext, useEffect } from "react";

/* Components */
import { EuiComboBox } from "@elastic/eui";

/* Styles */
import "./_tag-section.scss";

/* Models */
import { Tag } from "../../models/Tag";

/* Store */
import FirebaseContext from "../../firebase/context";

export interface TagSectionProps {
  initial_tags: Array<Tag>;
  className: string;
}

export function TagSection(props) {
  const firebase = useContext(FirebaseContext);
  const [selectedOptions, setSelected] = useState(props.initial_tags);
  const [options, setOptions] = useState(Array<any>());

  const fetchTags = async () => {
    let x = await firebase?.getTags();
    let tags = Array<Object>();
    x?.forEach((doc) => {
      tags.push({ label: doc.data().value });
    });
    setOptions(tags);
  };

  const onFocus = () => {
    fetchTags();
  };

  const onChange = (selectedOptions) => {
    setSelected(selectedOptions);
    props.TagUpdate(selectedOptions);
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
      placeholder="add tags"
      options={options}
      onFocus={onFocus}
      selectedOptions={selectedOptions}
      onChange={onChange}
      onCreateOption={onCreateOption}
      isClearable={true}
    />
  );
}
