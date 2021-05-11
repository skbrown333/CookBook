import React, { FunctionComponent, useState } from "react";

/* Models */
import { Guide } from "../../models/Guide";

/* Components */
import { GuideCard } from "./GuideCard/GuideCard";

/* Constants */
import { mockGuide } from "../../constants/constants";

/* Styles */
import "./_guide-list-view.scss";

export interface GuideListViewProps {}

export const GuideListView: FunctionComponent<GuideListViewProps> = () => {
  const [guides, setGuides] = useState<Guide[]>([
    mockGuide,
    mockGuide,
    mockGuide,
    mockGuide,
    mockGuide,
    mockGuide,
    mockGuide,
    mockGuide,
    mockGuide,
    mockGuide,
    mockGuide,
    mockGuide,
    mockGuide,
    mockGuide,
    mockGuide,
    mockGuide,
    mockGuide,
    mockGuide,
    mockGuide,
    mockGuide,
    mockGuide,
    mockGuide,
    mockGuide,
    mockGuide,
    mockGuide,
  ]);

  const buildGuides = () => {
    return guides.map((guide, index) => {
      return <GuideCard guide={guide} key={index} />;
    });
  };
  return (
    <div className="guide-list">
      <div className="guide-list__content">{buildGuides()}</div>
    </div>
  );
};
