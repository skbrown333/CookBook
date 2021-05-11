import React, { FunctionComponent } from "react";
import { useHistory } from "react-router-dom";

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
  const { title } = guide;

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
          size="m"
          className="guide-card__header__avatar"
          name={title}
          color={null}
          imageUrl={"https://ssb.wiki.gallery/images/d/d6/FalcoHeadSSBM.png"}
        ></EuiAvatar>
        {title}
      </div>
      <div className="guide-card__content">
        <div className="guide-card__content__description">
          A matchup guide for falco.
        </div>
        <div className="guide-card__content__footer">
          <EuiBadge color="hollow">matchup</EuiBadge>
        </div>
      </div>
    </EuiPanel>
  );
};
