import React, { FunctionComponent, useContext } from 'react';
import { useHistory } from 'react-router-dom';

/* Constants */
import { CHARACTERS } from '../../../constants/constants';

/* Models */
import { Guide } from '../../../models/Guide';

/* Components */
import { EuiPanel, EuiAvatar, EuiBadge, EuiButtonIcon } from '@elastic/eui';

/* Store */
import { Context } from '../../../store/Store';

/* Styles */
import './_guide-card.scss';

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
  const { title, character, tags, description } = guide;
  const { cookbook, user } = state;
  const guideParam = guide.slug != undefined ? guide.slug : guide._id;
  const redirectToGuide = () => {
    history.push(`/recipes/${guideParam}`);
  };

  return (
    <EuiPanel
      className="guide-card"
      hasShadow={false}
      hasBorder
      onClick={redirectToGuide}
    >
      <div className="guide-card__header">
        <div className="guide-card__header__title">
          <EuiAvatar
            className="guide-card__header__avatar"
            name={title}
            color={null}
            iconType={character ? CHARACTERS[character] : CHARACTERS.wireframe}
            iconSize="xl"
          ></EuiAvatar>
          {title}
        </div>
        {user && cookbook.roles[user.uid] === 'admin' && (
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
        <div className="guide-card__content__footer">
          {tags &&
            tags.map((tag, index) => {
              return (
                <EuiBadge key={`tag-${index}`} color="hollow">
                  {tag.label}
                </EuiBadge>
              );
            })}
        </div>
      </div>
    </EuiPanel>
  );
};
