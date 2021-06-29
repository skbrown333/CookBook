import React, { FunctionComponent, useContext } from 'react';

/* Components */
import {
  EuiAvatar,
  EuiIcon,
  EuiDragDropContext,
  EuiDroppable,
  EuiDraggable,
  EuiSideNav,
  EuiText,
} from '@elastic/eui';
import { Post } from '../../../models/Post';

/* Styles */
import './_guide-detail-side-nav.scss';

/* Constants */
import { CHARACTERS } from '../../../constants/constants';

/* Store */
import { Context } from '../../../store/Store';

export interface GuideDetailSideNavProps {
  editing: boolean;
  title: string;
  sections: Array<Post>;
  character: any | null;
  handleDragEnd: (result) => void;
}

export const GuideDetailSideNav: FunctionComponent<GuideDetailSideNavProps> = ({
  editing,
  title,
  sections,
  character,
  handleDragEnd,
}) => {
  const [state] = useContext(Context);
  const { cookbook } = state;
  const buildDraggable = () => {
    if (!sections) return [];
    return sections.map((section, index) => {
      const { title } = section;
      return (
        <EuiDraggable
          spacing="m"
          key={index}
          index={index}
          draggableId={index.toString()}
          customDragHandle={true}
        >
          {(provided) => (
            <div className="guide-content__side-nav__item">
              <div
                {...provided.dragHandleProps}
                className="guide-content__side-nav__handle"
                aria-label="Drag Handle"
              >
                <EuiIcon type="grab" />
              </div>
              <EuiText
                id="index"
                onClick={() => {
                  const div = document.getElementById(`section-${index}`);
                  if (div && document) {
                    const topPos = div.offsetTop - 200;
                    const sectionsDiv = document.getElementById('sections');
                    if (sectionsDiv) sectionsDiv.scrollTop = topPos;
                  }
                }}
              >
                {title}
              </EuiText>
            </div>
          )}
        </EuiDraggable>
      );
    });
  };

  const buildSideNaveItems = () => {
    if (!sections) return;
    return sections.map((section, index) => {
      const { title } = section;
      return {
        name: title,
        id: index,
        onClick: () => {
          const div = document.getElementById(`section-${index}`);
          if (div && document) {
            const topPos = div.offsetTop - 200;
            const sectionsDiv = document.getElementById('sections');
            if (sectionsDiv) sectionsDiv.scrollTop = topPos;
          }
        },
      };
    });
  };

  return (
    <div
      className="guide-content__side-nav"
      style={editing ? { marginTop: 8 } : {}}
    >
      <div className="side-nav__header">
        <EuiAvatar
          size="xl"
          className="side-nav__header__avatar"
          name={title}
          color={null}
          iconType={
            character
              ? CHARACTERS[cookbook.game.name][character.name]
              : CHARACTERS.melee.sandbag
          }
        ></EuiAvatar>
        {title}
      </div>
      {editing ? (
        <div className="side-nav__draggable side-nav__content">
          <EuiDragDropContext onDragEnd={handleDragEnd}>
            <EuiDroppable
              droppableId="DROPPABLE_AREA"
              spacing="m"
              className="guide-content__droppable"
            >
              {buildDraggable()}
            </EuiDroppable>
          </EuiDragDropContext>
        </div>
      ) : (
        <div className="side-nav__content">
          <EuiSideNav
            className="side-nav-content__items"
            aria-label="Basic example"
            style={{ width: 192 }}
            items={[
              {
                name: 'Sections',
                id: 0,
                items: buildSideNaveItems(),
              },
            ]}
          />
        </div>
      )}
    </div>
  );
};
