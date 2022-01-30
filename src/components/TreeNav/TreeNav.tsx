import React, { FunctionComponent, useContext, useMemo, useState } from 'react';
import { Guide } from '../../models/Guide';
import { Context } from '../../store/Store';
import { useHistory } from 'react-router-dom';
import {
  EuiButton,
  EuiDragDropContext,
  euiDragDropReorder,
  EuiDraggable,
  EuiDroppable,
  EuiIcon,
} from '@elastic/eui';
import { updateGuides } from '../../store/actions';

import './_tree-nav.scss';
import { ROLES } from '../../constants/constants';

interface TreeNavProps {}

export const TreeNav: FunctionComponent<TreeNavProps> = () => {
  const [state, dispatch] = useContext(Context);
  const history = useHistory();
  const { cookbook, user, guides } = state;
  const isDragDisabled =
    !user ||
    (!ROLES.admin.includes(cookbook.roles[user.uid]) && !user.super_admin);

  let content = null;

  const onDragEnd = ({ source, destination }: any) => {
    if (source && destination) {
      const items = euiDragDropReorder(guides, source.index, destination.index);
      dispatch(updateGuides([...items]));
    }
  };

  const onSectionDragEnd = (
    { source, destination }: any,
    sections,
    guideIndex,
  ) => {
    if (source && destination) {
      const items = euiDragDropReorder(
        sections,
        source.index,
        destination.index,
      );
      guides[guideIndex].sections = items;
      dispatch(updateGuides([...guides]));
    }
  };

  content = useMemo(() => {
    if (!guides) return [];
    return guides.map(buildGroups);
  }, [guides]);

  function buildGroups(guide, index) {
    return (
      <EuiDraggable
        spacing="m"
        key={guide._id}
        index={index}
        draggableId={`id-${guide._id}`}
        disableInteractiveElementBlocking
        customDragHandle
        isDragDisabled={isDragDisabled}
      >
        {(provided) => {
          return (
            <div className="guide">
              <div className="item">
                <span {...provided.dragHandleProps}>
                  <EuiIcon type="folderOpen" className="icon" />
                </span>
                <span className="title">{guide.title}</span>
              </div>

              <EuiDragDropContext
                onDragEnd={(result) =>
                  onSectionDragEnd(result, guide.sections, index)
                }
              >
                <EuiDroppable
                  droppableId="DROPPABLE_AREA2"
                  spacing="l"
                  className="droppable"
                >
                  <div className="sections">
                    {guide.sections.map((section, j) => {
                      return (
                        <EuiDraggable
                          spacing="m"
                          key={section.title}
                          index={j}
                          draggableId={`id-${section.title}`}
                          disableInteractiveElementBlocking
                          customDragHandle
                          isDragDisabled={isDragDisabled}
                        >
                          {(provided) => {
                            return (
                              <div
                                className="item inner"
                                onClick={() => {
                                  history.push(
                                    `/${cookbook.name}/recipes/${
                                      guide._id
                                    }/section/${encodeURIComponent(
                                      section.title,
                                    )}`,
                                  );
                                }}
                              >
                                <span {...provided.dragHandleProps}>
                                  <EuiIcon type="document" className="icon" />
                                </span>
                                <span className="title">{section.title}</span>
                              </div>
                            );
                          }}
                        </EuiDraggable>
                      );
                    })}
                  </div>
                </EuiDroppable>
              </EuiDragDropContext>
            </div>
          );
        }}
      </EuiDraggable>
    );
  }

  return (
    <div className="tree-nav">
      {content && (
        <EuiDragDropContext onDragEnd={onDragEnd}>
          <div
            className="nav"
            onClick={() => {
              history.push(`/${cookbook.name}`);
            }}
          >
            <EuiIcon type="home" className="icon" />
            <span className="title">Home</span>
          </div>
          <div
            className="nav"
            onClick={() => {
              history.push(`/${cookbook.name}`);
            }}
          >
            <EuiIcon type="document" className="icon" />
            <span className="title">Posts</span>
          </div>
          <EuiDroppable
            droppableId="DROPPABLE_AREA"
            spacing="l"
            className="droppable"
          >
            {content}
          </EuiDroppable>
        </EuiDragDropContext>
      )}
    </div>
  );
};
