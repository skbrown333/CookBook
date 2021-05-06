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
  editing: boolean;
}

export function TagSection(props) {
  const firebase = useContext(FirebaseContext);
  const [selectedOptions, setSelected] = useState(props.tags);
  const [options, setOptions] = useState(Array<any>());

  useEffect(() => {
    console.log("running");
    fetchTags();
  }, []);

  const fetchTags = async () => {
    let x = await firebase?.getTags();
    let tags = Array<string>();
    x?.forEach((doc) => {
      tags.push(doc.data().value);
    });
    setOptions(tags);
  };

  const onChange = (selectedOptions) => {
    setSelected(selectedOptions);
  };

  const onCreateOption = (searchValue) => {
    const normalizedSearchValue = searchValue.trim().toLowerCase();

    if (!normalizedSearchValue) {
      return;
    }

    if (options.some((tag) => tag != normalizedSearchValue)) {
      console.log("adding value");
      setOptions(options.concat(normalizedSearchValue));
    }

    setSelected(selectedOptions.concat(normalizedSearchValue));
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
