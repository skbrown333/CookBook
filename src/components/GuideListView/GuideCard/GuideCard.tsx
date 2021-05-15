import React, { FunctionComponent } from "react";
import { useHistory } from "react-router-dom";

/* Constants */
import { CHARACTERS } from "../../../constants/constants";

/* Models */
import { Guide } from "../../../models/Guide";

/* Components */
import { EuiPanel, EuiAvatar, EuiBadge, EuiButtonIcon } from "@elastic/eui";

/* Styles */
import "./_guide-card.scss";

export interface GuideCardProps {
  guide: Guide;
  editing: boolean;
  handleDelete: (event, guide) => void;
}

export const GuideCard: FunctionComponent<GuideCardProps> = ({
  guide,
  editing,
  handleDelete,
}) => {
  const history = useHistory();
  const { title, character, tags, description } = guide;
  const redirectToGuide = () => {
    history.push(`/recipes/${guide.title}`);
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
        {editing ? (
          <EuiButtonIcon
            aria-label="delete"
            className="guide-card__header__delete"
            iconType="trash"
            color="danger"
            onClick={(event) => handleDelete(event, guide)}
          />
        ) : (
          ""
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
