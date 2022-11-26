import React, { FunctionComponent, useContext, useMemo } from 'react';
import { Context } from '../../store/Store';
import { useHistory } from 'react-router-dom';
import {
  EuiDragDropContext,
  euiDragDropReorder,
  EuiDroppable,
  EuiIcon,
} from '@elastic/eui';
import { updateGuides } from '../../store/actions';

import './_tree-nav.scss';
import CookbookService from '../../services/CookbookService/CookbookService';
import { TreeNavCategory } from './TreeNavCategory';
import { ToastService } from '../../services/ToastService';

interface TreeNavProps {}

export const TreeNav: FunctionComponent<TreeNavProps> = () => {
  const [state, dispatch] = useContext(Context);
  const history = useHistory();
  const { cookbook, user, guides } = state;
  const cookbookService = new CookbookService();
  const toast = new ToastService();

  const onDragEnd = async ({ source, destination }: any) => {
    if (source && destination) {
      const items = euiDragDropReorder(guides, source.index, destination.index);
      dispatch(updateGuides([...items]));
      try {
        await cookbookService.update(cookbook._id, user, {
          guides: items.map((item) => item?._id),
        });
      } catch (error: any) {
        toast.errorToast(error.message);
      }
    }
  };

  const content = useMemo(() => {
    if (!guides) return [];
    return guides.map((guide, index) => (
      <TreeNavCategory
        guide={guide}
        index={index}
        open={index === 0 || guides.length < 5}
      />
    ));
  }, [guides, cookbook]);

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
          {/* <div
            className="nav"
            onClick={() => {
              history.push(`/${cookbook.name}`);
            }}
          >
            <EuiIcon type="document" className="icon" />
            <span className="title">Posts</span>
          </div> */}
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
