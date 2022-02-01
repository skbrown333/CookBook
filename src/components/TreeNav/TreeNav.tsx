import React, {
  FunctionComponent,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Guide } from '../../models/Guide';
import { Context } from '../../store/Store';
import { useHistory } from 'react-router-dom';
import {
  EuiButton,
  EuiButtonEmpty,
  EuiButtonIcon,
  EuiDragDropContext,
  euiDragDropReorder,
  EuiDraggable,
  EuiDroppable,
  EuiFieldText,
  EuiForm,
  EuiFormRow,
  EuiIcon,
  EuiModal,
  EuiModalBody,
  EuiModalFooter,
  EuiModalHeader,
  EuiModalHeaderTitle,
} from '@elastic/eui';
import { updateCookbook, updateGuides } from '../../store/actions';

import './_tree-nav.scss';
import { newSection, ROLES } from '../../constants/constants';
import CookbookService from '../../services/CookbookService/CookbookService';
import GuideService from '../../services/GuideService/GuideService';
import { ToastService } from '../../services/ToastService';

interface TreeNavProps {}

export const TreeNav: FunctionComponent<TreeNavProps> = () => {
  const [state, dispatch] = useContext(Context);
  const history = useHistory();
  const [collapsed, setCollapsed] = useState({});
  const [section, setSection] = useState(newSection);
  const [guideIndex, setGuideIndex] = useState(0);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showErrors, setShowErrors] = useState<boolean>(false);
  const { cookbook, user, guides } = state;
  const cookbookService = new CookbookService();
  const guideService = new GuideService(cookbook._id);
  const toast = new ToastService();
  const isDragDisabled =
    !user ||
    (!ROLES.admin.includes(cookbook.roles[user.uid]) && !user.super_admin);

  const onDragEnd = async ({ source, destination }: any) => {
    if (source && destination) {
      const items = euiDragDropReorder(guides, source.index, destination.index);
      dispatch(updateGuides([...items]));
      const token = await user.user.getIdToken();
      await cookbookService.update(
        cookbook._id,
        { guides: items.map((item) => item._id) },
        {
          Authorization: `Bearer ${token}`,
        },
      );
    }
  };

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

      const token = await user.user.getIdToken();
      await guideService.update(
        guides[guideIndex]._id,
        { sections: items },
        {
          Authorization: `Bearer ${token}`,
        },
      );
    }
  };

  const onAddSection = async (event) => {
    event.preventDefault();
    if (guideIndex == null) return;

    guides[guideIndex].sections.push(section);
    try {
      const token = await user.user.getIdToken();
      await guideService.update(
        guides[guideIndex]._id,
        {
          sections: guides[guideIndex].sections,
        },
        {
          Authorization: `Bearer ${token}`,
        },
      );
      const guideMap = {};
      const newGuides = await guideService.get({
        cookbook: cookbook,
      });
      cookbook.guides.forEach(
        (guide) => (guideMap[guide] = newGuides.find((_g) => _g._id === guide)),
      );
      dispatch(updateGuides([...Object.values(guideMap)]));
      setShowModal(false);
    } catch (err) {
      toast.errorToast('Failed to create guide', err.message);
    }
  };

  const onCancel = () => {
    setSection(newSection);
    setShowModal(false);
    setShowErrors(false);
  };

  const buildGroups = (guide, index) => {
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
              <div
                className="item"
                onClick={() => {
                  collapsed[guide._id] = !collapsed[guide._id];
                  setCollapsed({ ...collapsed });
                }}
              >
                <span {...provided.dragHandleProps}>
                  <EuiIcon
                    type={!collapsed[guide._id] ? 'folderOpen' : 'folderClosed'}
                    className="icon"
                  />
                </span>
                <span className="title">{guide.title}</span>
                {user &&
                (ROLES.admin.includes(cookbook.roles[user.uid]) ||
                  user.super_admin) ? (
                  <EuiButtonIcon
                    iconType="plus"
                    color="ghost"
                    className="add-section"
                    onClick={async (event) => {
                      event.stopPropagation();
                      setShowModal(true);
                      setGuideIndex(index);
                    }}
                  >
                    Add section
                  </EuiButtonIcon>
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
                  {!collapsed[guide._id] ? (
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

  const content = useMemo(() => {
    if (!guides) return [];
    return guides.map(buildGroups);
  }, [guides, cookbook]);

  return (
    <div className="tree-nav">
      {showModal && (
        <EuiModal onClose={onCancel} initialFocus="[name=popswitch]">
          <EuiModalHeader>
            <EuiModalHeaderTitle>
              <h1>Add Section</h1>
            </EuiModalHeaderTitle>
          </EuiModalHeader>
          <EuiModalBody>
            <EuiForm id="sectionForm" component="form">
              <EuiFormRow
                label="Title"
                isInvalid={showErrors}
                error="Title must be unique"
              >
                <EuiFieldText
                  value={section.title}
                  required
                  onChange={(e) => {
                    setShowErrors(
                      guides[guideIndex].sections.filter(
                        (s) => s.title === e.target.value,
                      ).length > 0,
                    );
                    setSection({ ...section, ...{ title: e.target.value } });
                  }}
                />
              </EuiFormRow>
            </EuiForm>
          </EuiModalBody>
          <EuiModalFooter>
            <EuiButtonEmpty onClick={onCancel}>Cancel</EuiButtonEmpty>
            <EuiButton
              type="submit"
              form="sectionForm"
              onClick={onAddSection}
              disabled={showErrors || section.title.length < 1}
              fill
            >
              Add
            </EuiButton>
          </EuiModalFooter>
        </EuiModal>
      )}
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
