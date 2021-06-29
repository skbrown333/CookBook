import React, { FunctionComponent, useState, useContext } from 'react';

/* Components */
import {
  EuiButtonIcon,
  EuiAvatar,
  EuiText,
  EuiTitle,
  EuiFlyout,
  EuiFlyoutBody,
  EuiFlyoutHeader,
} from '@elastic/eui';

/* Constants */
import { CHARACTERS } from '../../../constants/constants';

/* Models */
import { Post } from '../../../models/Post';

/* Styles */
import './_guide-detail-header.scss';
import { Context } from '../../../store/Store';

export interface GuideDetailHeaderProps {
  editing: boolean;
  title: string;
  character: string | null;
  showControls: boolean;
  sections: Array<Post>;
  allCollapsed: boolean;
  handleCancel: () => void;
  handleSave: () => void;
  handleAddSection: () => void;
  handleSetEditing: (isEditing: boolean) => void;
  handleCollapseAll: () => void;
  handleExpandAll: () => void;
}

export const GuideDetailHeader: FunctionComponent<GuideDetailHeaderProps> = ({
  editing,
  allCollapsed,
  handleCancel,
  handleAddSection,
  handleSave,
  handleSetEditing,
  handleCollapseAll,
  handleExpandAll,
  title,
  character,
  sections,
  showControls,
}) => {
  const [state] = useContext(Context);
  const [flyoutVis, setFlyoutVis] = useState(false);
  const { cookbook } = state;

  const toggleFlyout = () => {
    setFlyoutVis(!flyoutVis);
  };

  const navItems = () => {
    return sections.map((section, index) => {
      const { title } = section;
      return (
        <div className="nav-item">
          <EuiText
            id={`nav-${index}`}
            size="m"
            onClick={() => {
              toggleFlyout();
              const div = document.getElementById(`section-${index}`);
              if (div && document) {
                const topPos = div.offsetTop - 200;
                const sectionsDiv = document.getElementById('sections');
                if (sectionsDiv) sectionsDiv.scrollTop = topPos;
              }
            }}
          >
            {title}
          </EuiText>
        </div>
      );
    });
  };

  const flyout = () => {
    return (
      <EuiFlyout ownFocus side="left" onClose={toggleFlyout}>
        <EuiFlyoutHeader>
          <EuiTitle>
            <h2>Sections</h2>
          </EuiTitle>
        </EuiFlyoutHeader>
        <EuiFlyoutBody>{navItems()}</EuiFlyoutBody>
      </EuiFlyout>
    );
  };

  return (
    <div className="guide-header">
      <div className="guide-header__title">
        <EuiButtonIcon
          onClick={toggleFlyout}
          aria-label="menu-flyout"
          iconType="menu"
          iconSize="l"
        />
        <EuiAvatar
          size="xl"
          className="guide-header__avatar"
          name={title}
          color={null}
          iconType={
            character
              ? CHARACTERS[cookbook.game.name][character]
              : CHARACTERS.melee.sandbag
          }
        />
        <EuiTitle>
          <p>{title}</p>
        </EuiTitle>
      </div>
      <div className="guide-header__controls">
        {allCollapsed ? (
          <EuiButtonIcon
            aria-label="expand all"
            className="guide-header__controls__button"
            display="fill"
            iconType="arrowDown"
            size="m"
            iconSize="l"
            onClick={handleExpandAll}
          />
        ) : (
          <EuiButtonIcon
            aria-label="collapse all"
            className="guide-header__controls__button"
            display="fill"
            iconType="arrowUp"
            size="m"
            iconSize="l"
            onClick={handleCollapseAll}
          />
        )}
        {editing ? (
          <>
            <EuiButtonIcon
              aria-label="cancel"
              className="guide-header__controls__button"
              display="fill"
              iconType="cross"
              color="danger"
              onClick={handleCancel}
              size="m"
              iconSize="l"
            />
            <EuiButtonIcon
              aria-label="save"
              className="guide-header__controls__button"
              display="fill"
              iconType="save"
              color="success"
              onClick={handleSave}
              size="m"
              iconSize="l"
            />
            <EuiButtonIcon
              aria-label="add"
              className="guide-header__controls__button"
              display="fill"
              iconType="plus"
              color="success"
              onClick={handleAddSection}
              size="m"
              iconSize="l"
            />
          </>
        ) : (
          showControls && (
            <EuiButtonIcon
              aria-label="edit"
              className="guide-header__controls__edit"
              display="fill"
              iconType="pencil"
              size="m"
              iconSize="l"
              onClick={() => handleSetEditing(!editing)}
            />
          )
        )}
      </div>
      {flyoutVis && flyout()}
    </div>
  );
};
