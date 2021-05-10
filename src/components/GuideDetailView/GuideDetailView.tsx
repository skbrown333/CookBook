import React, {
  FunctionComponent,
  useState,
  useEffect,
  ReactElement,
} from "react";

/* Components */
import {
  EuiDragDropContext,
  EuiDroppable,
  EuiDraggable,
  euiDragDropReorder,
} from "@elastic/eui";
import { TwitchSidebar } from "../TwitchSidebar/TwitchSidebar";

/* Styles */
import "./_guide-detail-view.scss";

/* Types */
import { Guide } from "../../models/Guide";

/* Constants */
import { mockGuide, newSection } from "../../constants/constants";
import { GuideDetailSideNav } from "./GuideDetailSideNav/GuideDetailSideNav";
import { GuideDetailSection } from "./GuideDetailSection/GuideDetailSection";
import { GuideDetailControls } from "./GuideDetailControls/GuideDetailControls";

export interface GuideDetailViewProps {}

export const GuideDetailView: FunctionComponent<GuideDetailViewProps> = (): ReactElement => {
  const [editing, setEditing] = useState<boolean>(false);
  const [collapsed, setCollapsed] = useState<Array<boolean>>(
    Array(mockGuide.sections.length).fill(false)
  );
  const [guide, setGuide] = useState<Guide | null>(
    JSON.parse(JSON.stringify(mockGuide))
  );

  const updateSection = (key, value, index) => {
    if (!guide) return;
    guide.sections[index][key] = value;
    setGuide({ ...guide });
  };

  const handleSetEditing = (isEditing) => {
    setEditing(isEditing);
  };

  const handleAddSection = () => {
    if (!guide) return;
    const { sections } = guide;
    sections.unshift({ ...newSection });
    collapsed.unshift(false);
    setCollapsed([...collapsed]);
    setGuide({ ...guide });
  };

  const handleCancel = () => {
    setGuide(JSON.parse(JSON.stringify(mockGuide)));
    setCollapsed(Array(mockGuide.sections.length).fill(false));
    setEditing(false);
  };

  const handleDelete = (index) => {
    if (!guide) return;
    let { sections } = guide;
    console.log("delete " + index);
    setCollapsed(
      collapsed
        .slice(0, index)
        .concat(collapsed.slice(index + 1, collapsed.length))
    );
    guide.sections = sections
      .slice(0, index)
      .concat(sections.slice(index + 1, sections.length));
    setGuide({ ...guide });
  };

  const handleSave = () => {
    if (!guide) return;
    setCollapsed(Array(guide.sections.length).fill(false));
    setEditing(false);
    setGuide({ ...guide });
  };

  const handleCollapse = (index) => {
    collapsed[index] = collapsed[index] ? !collapsed[index] : true;
    setCollapsed([...collapsed]);
  };

  const handleDragEnd = (result) => {
    const { source, destination } = result;
    if (!guide) return;
    let { sections } = guide;
    if (source && destination) {
      const items = euiDragDropReorder(
        sections,
        source.index,
        destination.index
      );
      setCollapsed([
        ...euiDragDropReorder(collapsed, source.index, destination.index),
      ]);
      guide.sections = [...items];
      setGuide({ ...guide });
    }
  };

  const buildSections = () => {
    if (!guide) return [<></>];

    return guide.sections.map((section, index) => {
      const { title, body, tags } = section;
      const isCollapsed = collapsed[index] && collapsed[index] === true;

      return editing ? (
        <EuiDraggable
          spacing="m"
          key={index}
          index={index}
          draggableId={index.toString()}
          isDragDisabled={!editing}
        >
          <GuideDetailSection
            title={title}
            body={body}
            index={index}
            editing={editing}
            tags={tags}
            isCollapsed={isCollapsed}
            handleCollapse={handleCollapse}
            handleDelete={handleDelete}
            updateSection={updateSection}
          />
        </EuiDraggable>
      ) : (
        <GuideDetailSection
          title={title}
          body={body}
          index={index}
          editing={editing}
          tags={tags}
          isCollapsed={isCollapsed}
          handleCollapse={handleCollapse}
          handleDelete={handleDelete}
          updateSection={updateSection}
        />
      );
    });
  };

  return (
    <div id="guide-detail" className="guide-detail">
      {guide && guide.sections && (
        <>
          <div
            className="guide-detail__controls"
            style={editing ? { paddingRight: 8 } : {}}
          >
            <GuideDetailControls
              editing={editing}
              handleCancel={handleCancel}
              handleSave={handleSave}
              handleAddSection={handleAddSection}
              handleSetEditing={handleSetEditing}
            />
          </div>

          <div className="guide-detail__content">
            <GuideDetailSideNav
              editing={editing}
              title={mockGuide.title}
              sections={guide.sections}
            />
            <div id="sections" className="guide-content__sections">
              {editing ? (
                <EuiDragDropContext onDragEnd={handleDragEnd}>
                  <EuiDroppable
                    droppableId="DROPPABLE_AREA"
                    spacing="m"
                    className="guide-content__droppable"
                  >
                    {buildSections()}
                  </EuiDroppable>
                </EuiDragDropContext>
              ) : (
                buildSections()
              )}
            </div>
            <TwitchSidebar className="guide-content__right" />
          </div>
        </>
      )}
    </div>
  );
};
