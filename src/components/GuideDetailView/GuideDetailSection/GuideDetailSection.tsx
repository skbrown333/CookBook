import React, { FunctionComponent } from "react";

/* Components */
import {
  EuiButtonIcon,
  EuiFieldText,
  EuiMarkdownEditor,
  EuiMarkdownFormat,
  EuiPanel,
  EuiSpacer,
  EuiBadge,
} from "@elastic/eui";
import { TagSection } from "../../TagSection/TagSection";

/* Styles */
import "./_guide-detail-section.scss";

/*Models*/
import { Tag } from "../../../models/Tag";

export interface GuideDetailSectionProps {
  title: string;
  editing: boolean;
  index: number;
  isCollapsed: boolean;
  body: string;
  tags: Array<Tag>;
  updateSection: (key: string, value: string, index: number) => void;
  handleCollapse: (index: number) => void;
}

export const GuideDetailSection: FunctionComponent<GuideDetailSectionProps> = ({
  title,
  editing,
  index,
  isCollapsed,
  body,
  tags,
  updateSection,
  handleCollapse,
}) => {
  return (
    <EuiPanel
      id={`section-${index}`}
      hasShadow={false}
      hasBorder
      className="guide-section"
      key={index}
    >
      <div className="guide-section__title">
        {editing ? (
          <EuiFieldText
            placeholder="title"
            value={title}
            onChange={(e) => updateSection("title", e.target.value, index)}
          />
        ) : (
          <div>{title}</div>
        )}
        <EuiButtonIcon
          aria-label="collapse-icon"
          iconType={isCollapsed ? "arrowDown" : "arrowUp"}
          iconSize="l"
          size="m"
          className="guide-section__title--collapse"
          onClick={() => {
            handleCollapse(index);
          }}
        ></EuiButtonIcon>
      </div>
      {!isCollapsed && (
        <div className={`guide-section__body${editing ? " editing" : ""}`}>
          {editing ? (
            <>
              <EuiMarkdownEditor
                aria-label="Body markdown editor"
                value={body}
                onChange={(value) => updateSection("body", value, index)}
                height={400}
              />
              <TagSection
                className="guide-section__tags"
                initial_tags={tags}
                TagUpdate={(tags) => updateSection("tags", tags, index)}
              ></TagSection>
            </>
          ) : (
            <>
              <EuiMarkdownFormat>{body}</EuiMarkdownFormat>
              <EuiSpacer size="s" />
              <div className="tag-holder guide-section__tags">
                {tags.map((tag) => (
                  <EuiBadge className="tag" color="hollow">
                    #{tag.label}
                  </EuiBadge>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </EuiPanel>
  );
};
