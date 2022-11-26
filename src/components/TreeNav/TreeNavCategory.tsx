import {
  EuiButtonIcon,
  EuiContextMenuItem,
  EuiContextMenuPanel,
  EuiDragDropContext,
  euiDragDropReorder,
  EuiDraggable,
  EuiDroppable,
  EuiIcon,
  EuiPopover,
} from '@elastic/eui';
import { useHistory } from 'react-router-dom';
import React, { useContext, useState } from 'react';
import { canManage } from '../../constants/constants';
import { useDeleteGuide } from '../../services/GuideService/GuideHooks';
import { Context } from '../../store/Store';
import { GuideModal } from '../GuideModal/GuideModal';
import { SectionModal } from '../SectionModal/SectionModal';
import GuideService from '../../services/GuideService/GuideService';
import { updateGuides } from '../../store/actions';
import { ConfirmationModal } from '../ConfirmationModal/ConfirmationModal';

export const TreeNavCategory = ({ guide, index, open }) => {
  const history = useHistory();
  const [state, dispatch] = useContext(Context);
  const { cookbook, user, guides } = state;
  const [guideModal, setGuideModal] = useState<boolean>(false);
  const [sectionModal, setSectionModal] = useState<boolean>(false);
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [popover, setPopover] = useState<boolean>(false);
  const [collapsed, setCollapsed] = useState<boolean>(!open);
  const deleteGuide = useDeleteGuide();
  const [guideService, setGuideService] = React.useState(
    new GuideService(cookbook._id),
  );
  const isDragDisabled = !canManage(user, cookbook);

  React.useEffect(() => {
    setGuideService(new GuideService(cookbook._id));
  }, [cookbook]);

  const menuItems = (index) => [
    <EuiContextMenuItem
      key="copy"
      className="add-section"
      icon="plus"
      onClick={(event) => {
        event.stopPropagation();
        setSectionModal(true);
        setPopover(false);
      }}
    >
      Add section
    </EuiContextMenuItem>,
    <EuiContextMenuItem
      key="edit"
      icon="pencil"
      onClick={async (event) => {
        event.stopPropagation();
        setGuideModal(true);
        setPopover(false);
      }}
    >
      Edit
    </EuiContextMenuItem>,
    <EuiContextMenuItem
      key="share"
      icon="trash"
      onClick={async (event) => {
        event.stopPropagation();
        setPopover(false);
        setDeleteModal(true);
      }}
    >
      Delete
    </EuiContextMenuItem>,
  ];

  const onSectionDragEnd = async (
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
      await guideService.update(guides[guideIndex]._id, user, {
        sections: items,
      });
    }
  };

  if (!guide) return null;

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
            <GuideModal
              open={guideModal}
              guide={guide}
              onClose={() => setGuideModal(false)}
              title="Edit Guide"
            />
            <SectionModal
              open={sectionModal}
              guide={guide}
              onCancel={() => setSectionModal(false)}
            />
            <ConfirmationModal
              open={deleteModal}
              title="Delete Guide"
              body={`Are you sure you want to delete "${guide.title}"?`}
              onConfirm={async () => {
                await deleteGuide(guide);
                setDeleteModal(false);
                history.push(`/${cookbook.name}`);
              }}
              onCancel={() => setDeleteModal(false)}
            />
            <div
              className="item"
              onClick={() => {
                setCollapsed(!collapsed);
              }}
            >
              {collapsed && (
                <span className="section-count">{guide.sections.length}</span>
              )}
              <span {...provided.dragHandleProps}>
                <EuiIcon
                  type={!collapsed ? 'folderOpen' : 'folderClosed'}
                  className="icon"
                />
              </span>
              <span className="title">{guide.title}</span>
              {canManage(user, cookbook) ? (
                <EuiPopover
                  id={`popover-${index}`}
                  className="add-section"
                  button={
                    <EuiButtonIcon
                      iconType="boxesVertical"
                      onClick={(event) => {
                        event.stopPropagation();
                        setPopover(!popover);
                      }}
                    >
                      Add section
                    </EuiButtonIcon>
                  }
                  isOpen={popover}
                  closePopover={() => setPopover(false)}
                  panelPaddingSize="none"
                  anchorPosition="downLeft"
                >
                  <EuiContextMenuPanel size="s" items={menuItems(index)} />
                </EuiPopover>
              ) : null}
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
                {!collapsed ? (
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
                                <span className="title">
                                  {section.title.replace(/\s+/g, '-')}
                                </span>
                              </div>
                            );
                          }}
                        </EuiDraggable>
                      );
                    })}
                  </div>
                ) : (
                  <></>
                )}
              </EuiDroppable>
            </EuiDragDropContext>
          </div>
        );
      }}
    </EuiDraggable>
  );
};
