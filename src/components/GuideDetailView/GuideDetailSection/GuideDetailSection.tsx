import React, { FunctionComponent } from "react";

/* Components */
import {
  EuiButtonIcon,
  EuiFieldText,
  EuiMarkdownEditor,
  EuiMarkdownFormat,
  EuiPanel,
} from "@elastic/eui";

/* Styles */
import "./_guide-detail-section.scss";

export interface GuideDetailSectionProps {
  title: string;
  editing: boolean;
  index: number;
  isCollapsed: boolean;
  body: string;
  updateSection: (key: string, value: string, index: number) => void;
  handleCollapse: (index: number) => void;
}

export const GuideDetailSection: FunctionComponent<GuideDetailSectionProps> = ({
  title,
  editing,
  index,
  isCollapsed,
  body,
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
            <EuiMarkdownEditor
              aria-label="Body markdown editor"
              value={body}
              onChange={(value) => updateSection("body", value, index)}
              height={400}
            />
          ) : (
            <EuiMarkdownFormat>{body}</EuiMarkdownFormat>
          )}
        </div>
      )}
    </EuiPanel>
  );
};
