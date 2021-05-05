import React, { useState } from "react";

/* Components */
import { EuiButtonEmpty, EuiComboBox } from "@elastic/eui";

/* Styles */
import "./_tag-section.scss";

/* Services */
import { TagService } from "../../services/TagService";

/* Models */
import { Tag } from "../../models/Tag";

export interface TagSectionProps {
  tags?: Array<Tag>;
  className: string;
  editing: boolean;
}

export function TagSection(props) {
  const tag_service = new TagService();
  const tags = tag_service.getTags();
  const [selectedOptions, setSelected] = useState(Array<Tag>());
  const [options, setOptions] = useState(selectedOptions);

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

    console.log("out");
    if (!tag_service.tagExists(normalizedSearchValue)) {
      console.log("adding value");
      tag_service.addTag(normalizedSearchValue);
      setOptions(tag_service.getTags());
    }

    setSelected([...selectedOptions, newOption]);
  };

  if (props.editing)
    return (
      <EuiComboBox
        placeholder="add tags"
        options={tags}
        selectedOptions={selectedOptions}
        onChange={onChange}
        onCreateOption={onCreateOption}
        isClearable={true}
      />
    );
  return (
    <div className={"tag-holder " + props.className}>
      {options.map((tag) => (
        <EuiButtonEmpty className="tag" size="s" color="text">
          #{tag.label}
        </EuiButtonEmpty>
      ))}
    </div>
  );
}
