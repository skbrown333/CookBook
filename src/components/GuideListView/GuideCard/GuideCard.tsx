import React, { FunctionComponent } from "react";
import { useHistory } from "react-router-dom";

/* Constants */
import { CHARACTERS } from "../../../constants/constants";

/* Models */
import { Guide } from "../../../models/Guide";

/* Components */
import { EuiPanel, EuiAvatar, EuiBadge } from "@elastic/eui";

/* Styles */
import "./_guide-card.scss";

export interface GuideCardProps {
  guide: Guide;
}

export const GuideCard: FunctionComponent<GuideCardProps> = ({ guide }) => {
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
        <EuiAvatar
          className="guide-card__header__avatar"
          name={title}
          color={null}
          iconType={character ? CHARACTERS[character] : CHARACTERS.wireframe}
          iconSize="xl"
        ></EuiAvatar>
        {title}
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