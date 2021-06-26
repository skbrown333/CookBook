import React, { FunctionComponent, useContext } from 'react';
import { useHistory } from 'react-router-dom';

/* Constants */
import { CHARACTERS, ROLES } from '../../../constants/constants';

/* Models */
import { Guide } from '../../../models/Guide';

/* Components */
import { EuiPanel, EuiAvatar, EuiBadge, EuiButtonIcon } from '@elastic/eui';

/* Store */
import { Context } from '../../../store/Store';

/* Styles */
import './_guide-card.scss';
import { TagHolder } from '../../TagHolder/TagHolder';

export interface GuideCardProps {
  guide: Guide;
  handleDelete: (event, guide) => void;
  handleEdit: (event, guide) => void;
}

export const GuideCard: FunctionComponent<GuideCardProps> = ({
  guide,
  handleDelete,
  handleEdit,
}) => {
  const history = useHistory();
  const [state] = useContext(Context);
  const { title, character, tags, description, slug } = guide;
  const { cookbook, user } = state;
  const redirectToGuide = () => {
    history.push(`/recipes/${slug}`);
  };

  return (
    <EuiPanel
      className="guide-card"
      hasShadow={false}
      onClick={redirectToGuide}
    >
      <div className="guide-card__header">
        <div className="guide-card__header__title">
          <EuiAvatar
            className="guide-card__header__avatar"
            name={title}
            color={null}
            iconType={
              character ? CHARACTERS[character.name] : CHARACTERS.sandbag
            }
            iconSize="xl"
            size="l"
          ></EuiAvatar>
          {title}
        </div>
        {user && ROLES.admin.includes(cookbook.roles[user.uid]) && (
          <div className="guide-card__header__controls">
            <EuiButtonIcon
              aria-label="edit"
              className="guide-card__header__edit"
              iconType="documentEdit"
              color="primary"
              onClick={(event) => handleEdit(event, guide)}
            />
            <EuiButtonIcon
              aria-label="delete"
              className="guide-card__header__delete"
              iconType="trash"
              color="danger"
              onClick={(event) => handleDelete(event, guide)}
            />
          </div>
        )}
      </div>
      <div className="guide-card__content">
        <div className="guide-card__content__description">{description}</div>
        {tags && (
          <TagHolder tags={tags} className="guide-card__content__footer" />
        )}
      </div>
    </EuiPanel>
  );
};
