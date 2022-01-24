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
  EuiBreadcrumbs,
  EuiHideFor,
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
  sectionTitle?: string;
  character: string | null;
  showControls: boolean;
  handleCancel: () => void;
  handleSave: () => void;
  handleSetEditing: (isEditing: boolean) => void;
  onExpand?: () => void;
}

export const GuideDetailHeader: FunctionComponent<GuideDetailHeaderProps> = ({
  editing,
  handleCancel,
  handleSave,
  handleSetEditing,
  title,
  sectionTitle,
  character,
  showControls,
  onExpand,
}) => {
  const [state] = useContext(Context);
  const { cookbook } = state;

  return (
    <div className="guide-header">
      <div className="guide-header__title">
        <EuiHideFor sizes={['l', 'xl']}>
          <EuiButtonIcon
            onClick={onExpand}
            aria-label="menu-flyout"
            iconType="menuRight"
            iconSize="l"
            color="success"
          />
        </EuiHideFor>
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
        <EuiBreadcrumbs
          breadcrumbs={[
            {
              text: title,
            },
            {
              text: sectionTitle,
            },
          ]}
          truncate={true}
          aria-label="An example of EuiBreadcrumbs"
        />
      </div>
      <div className="guide-header__controls">
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
    </div>
  );
};
