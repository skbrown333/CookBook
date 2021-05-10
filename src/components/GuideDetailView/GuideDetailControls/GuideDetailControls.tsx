import React, { FunctionComponent } from "react";

/* Components */
import { EuiButtonIcon } from "@elastic/eui";

/* Styles */
import "./_guide-detail-controls.scss";

export interface GuideDetailControlsProps {
  editing: boolean;
  handleCancel: () => void;
  handleSave: () => void;
  handleAddSection: () => void;
  handleSetEditing: (isEditing: boolean) => void;
}

export const GuideDetailControls: FunctionComponent<GuideDetailControlsProps> = ({
  editing,
  handleCancel,
  handleAddSection,
  handleSave,
  handleSetEditing,
}) => {
  return (
    <>
      {editing ? (
        <>
          <EuiButtonIcon
            aria-label="cancel"
            className="guide-controls__button"
            display="fill"
            iconType="cross"
            color="danger"
            onClick={handleCancel}
            size="m"
            iconSize="l"
          />
          <EuiButtonIcon
            className="guide-controls__button"
            display="fill"
            iconType="save"
            color="success"
            onClick={handleSave}
            size="m"
            iconSize="l"
          />
          <EuiButtonIcon
            className="guide-controls__button"
            display="fill"
            iconType="plus"
            color="success"
            onClick={handleAddSection}
            size="m"
            iconSize="l"
          />
        </>
      ) : (
        <EuiButtonIcon
          className="guide-controls__button"
          display="fill"
          iconType="pencil"
          size="m"
          iconSize="l"
          onClick={() => handleSetEditing(!editing)}
        />
      )}
    </>
  );
};
