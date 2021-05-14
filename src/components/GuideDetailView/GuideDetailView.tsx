import React, {
  FunctionComponent,
  useState,
  useEffect,
  ReactElement,
  useContext,
} from "react";
import { useLocation } from "react-router-dom";
import uniqid from "uniqid";

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
import { newSection } from "../../constants/constants";
import { GuideDetailSideNav } from "./GuideDetailSideNav/GuideDetailSideNav";
import { GuideDetailSection } from "./GuideDetailSection/GuideDetailSection";
import { GuideDetailControls } from "./GuideDetailControls/GuideDetailControls";

/* Firebase */
import FirebaseContext from "../../firebase/context";
import { Context } from "../../store/Store";
import { FIRESTORE } from "../../constants/constants";
import { ToastService } from "../../services/ToastService";

export interface GuideDetailViewProps {}

export const GuideDetailView: FunctionComponent<GuideDetailViewProps> =
  (): ReactElement => {
    const [editing, setEditing] = useState<boolean>(false);
    const [collapsed, setCollapsed] = useState<Array<boolean>>(
      Array<boolean>()
    );
    const [guide, setGuide] = useState<Guide | null>(null);
    const firebase = useContext(FirebaseContext);
    const [state] = useContext(Context);
    const { cookbook } = state;
    const [, , title] = useLocation().pathname.split("/");
    const toast = new ToastService();

    const getGuide = async () => {
      const [guide] = await firebase?.getByValue(
        cookbook.id,
        FIRESTORE.collections.guides,
        "title",
        title
      );
      setGuide(guide);
    };
    useEffect(() => {
      getGuide();
    }, []);

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
      newSection._id = uniqid(`${guide.character}-`);
      sections.unshift({ ...newSection });
      collapsed.unshift(false);
      setCollapsed([...collapsed]);
      setGuide({ ...guide });
    };

    const handleCancel = async () => {
      await getGuide();
      setCollapsed(Array(guide?.sections.length).fill(false));
      setEditing(false);
    };

    const handleDelete = (index) => {
      if (!guide) return;
      let { sections } = guide;
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
      try {
        guide.doc_ref.update({ sections: guide.sections });
        toast.successToast("Save success!", "Guide saved");
        setEditing(false);
        setCollapsed(Array(guide.sections.length).fill(false));
        getGuide();
      } catch (error) {
        toast.errorToast("Something went wrong", "Guide was not saved");
      }
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
                title={guide.title}
                sections={guide.sections}
                character={guide.character}
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
