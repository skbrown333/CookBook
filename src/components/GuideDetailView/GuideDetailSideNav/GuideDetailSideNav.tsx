import React, { FunctionComponent } from "react";

/* Components */
import {
  EuiAvatar,
  EuiPanel,
  EuiSideNav,
  EuiDragDropContext,
  EuiDroppable,
  EuiDraggable,
  euiDragDropReorder,
  EuiText,
} from "@elastic/eui";
import { Post } from "../../../models/Post";

/* Styles */
import "./_guide-detail-side-nav.scss";

/* Constants */
import { CHARACTERS } from "../../../constants/constants";

export interface GuideDetailSideNavProps {
  editing: boolean;
  title: string;
  sections: Array<Post>;
  character: string | null;
}

export const GuideDetailSideNav: FunctionComponent<GuideDetailSideNavProps> = ({
  editing,
  title,
  sections,
  character,
}) => {
  const buildSideNavItems = () => {
    if (!sections) return [];
    return sections.map((section, index) => {
      const { title } = section;
      return (
        <EuiDraggable
          spacing="m"
          key={index}
          index={index}
          draggableId={index.toString()}
        >
          <EuiText
            id="index"
            onClick={() => {
              let div = document.getElementById(`section-${index}`);
              if (div && document) {
                let topPos = div.offsetTop - 200;
                let sectionsDiv = document.getElementById("sections");
                if (sectionsDiv) sectionsDiv.scrollTop = topPos;
              }
            }}
          >
            {title}
          </EuiText>
        </EuiDraggable>
      );
    });
  };

  return (
    <EuiPanel
      className="guide-content__side-nav"
      style={editing ? { marginTop: 8 } : {}}
      hasShadow={false}
      hasBorder
    >
      <div className="side-nav__header">
        <EuiAvatar
          size="xl"
          className="side-nav__header__avatar"
          name={title}
          color={null}
          iconType={character ? CHARACTERS[character] : CHARACTERS.wireframe}
        ></EuiAvatar>
        {title}
      </div>
      <div className="side-nav__content">
        <EuiPanel className="side-nav-content__items" hasShadow={false}>
          <EuiDragDropContext onDragEnd={() => console.log("shit")}>
            <EuiDroppable
              droppableId="DROPPABLE_AREA"
              spacing="m"
              className="guide-content__droppable"
            >
              {buildSideNavItems()}
            </EuiDroppable>
          </EuiDragDropContext>
        </EuiPanel>
      </div>
    </EuiPanel>
  );
};
