import React, { FunctionComponent } from "react";

/* Components */
import { EuiAvatar, EuiPanel, EuiSideNav } from "@elastic/eui";
import { Post } from "../../../models/Post";

/* Styles */
import "./_guide-detail-side-nav.scss";

export interface GuideDetailSideNavProps {
  editing: boolean;
  title: string;
  sections: Array<Post>;
}

export const GuideDetailSideNav: FunctionComponent<GuideDetailSideNavProps> = ({
  editing,
  title,
  sections,
}) => {
  const buildSideNaveItems = () => {
    if (!sections) return;
    return sections.map((section, index) => {
      const { title } = section;
      return {
        name: title,
        id: index,
        onClick: () => {
          let div = document.getElementById(title);
          if (div && document) {
            let topPos = div.offsetTop - 200;
            let sectionsDiv = document.getElementById("sections");
            if (sectionsDiv) sectionsDiv.scrollTop = topPos;
          }
        },
      };
    });
  };

  return (
    <EuiPanel
      className="guide-content__side-nav"
      style={editing ? { marginTop: 8 } : {}}
      hasShadow={false}
      hasBorder
    >
      <div className="side-nav__header">{title}</div>
      <div className="side-nav__content">
        <EuiAvatar
          size="xl"
          name={title}
          imageUrl={
            "https://www.textures-resource.com/resources/sheet_icons/4/3300.png"
          }
        ></EuiAvatar>
        <EuiSideNav
          className="guide-content__side-nav__items"
          aria-label="Basic example"
          style={{ width: 192 }}
          items={[
            {
              name: "Sections",
              id: 0,
              items: buildSideNaveItems(),
            },
          ]}
        />
      </div>
    </EuiPanel>
  );
};
