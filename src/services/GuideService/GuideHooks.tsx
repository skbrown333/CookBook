import React, { useCallback, useContext } from 'react';
import { CHARACTERS } from '../../constants/CharacterIcons';
import { updateCookbook, updateGuides } from '../../store/actions';
import { Context } from '../../store/Store';
import CookbookService from '../CookbookService/CookbookService';
import { ToastService } from '../ToastService';
import GuideService from './GuideService';

export const useDeleteSection = (setEditing) => {
  const [state, dispatch] = useContext(Context);
  const { cookbook, user } = state;
  const guideService = new GuideService(cookbook._id);
  const toast = new ToastService();

  const deleteGuide = useCallback(
    async (guide, section) => {
      if (!guide) return;
      const newSections = guide.sections.filter(
        (_section) => JSON.stringify(section) !== JSON.stringify(_section),
      );
      try {
        await guideService.update(guide._id, user, { sections: newSections });
        const guides = await guideService.getByCookbook(cookbook._id);
        dispatch(updateGuides([...guides], cookbook));
        setEditing(false);
      } catch (err: any) {
        toast.errorToast('Something went wrong', 'Guide was not saved');
      }
    },
    [cookbook],
  );

  return deleteGuide;
};

export const useSaveGuide = (setEditing?) => {
  const [state, dispatch] = useContext(Context);
  const { cookbook, user } = state;
  const cookbookService = new CookbookService();
  const guideService = new GuideService(cookbook._id);
  const toast = new ToastService();

  const saveGuide = useCallback(
    async (guide) => {
      if (!guide) return;
      try {
        await guideService.update(guide._id, user, {
          title: guide.title,
          character: guide.character,
          sections: guide.sections,
        });
        const _cookbook = await cookbookService.getById(cookbook._id);
        const guides = await guideService.getByCookbook(_cookbook._id);
        dispatch(updateGuides([...guides], _cookbook));
        toast.successToast('Guide saved!', 'Guide saved');
        setEditing?.(false);
      } catch (err: any) {
        toast.errorToast('Something went wrong', 'Guide was not saved');
      }
    },
    [cookbook],
  );

  return saveGuide;
};

export const useCreateGuide = () => {
  const [state, dispatch] = useContext(Context);
  const { cookbook, user } = state;
  const guideService = new GuideService(cookbook._id);
  const toast = new ToastService();

  const createGuide = useCallback(
    async (guide) => {
      const { character, title } = guide;
      try {
        const guide = await guideService.create(
          {
            character,
            sections: [],
            title,
          },
          user,
        );
        cookbook.guides.push(guide._id);
        dispatch(
          updateCookbook({
            ...cookbook,
          }),
        );
        const guides = await guideService.getByCookbook(cookbook._id);
        dispatch(updateGuides([...guides], cookbook));
        toast.successToast(
          guide.title,
          'Guide succesfully created',
          character ? CHARACTERS[cookbook.game.name][character] : null,
        );
      } catch (err: any) {
        toast.errorToast('Failed to create guide', err.message);
      }
    },
    [cookbook],
  );

  return createGuide;
};

export const useDeleteGuide = () => {
  const [state, dispatch] = useContext(Context);
  const { cookbook, user } = state;
  const cookbookService = new CookbookService();
  const guideService = new GuideService(cookbook._id);
  const toast = new ToastService();

  const deleteGuide = useCallback(
    async (guide) => {
      const { _id } = guide;
      try {
        await guideService.delete(_id, user);
        const _cookbook = await cookbookService.getById(cookbook._id);
        const guides = await guideService.getByCookbook(cookbook._id);
        dispatch(updateGuides([...guides], _cookbook));
        toast.successToast(guide.title, 'Guide succesfully deleted');
      } catch (err: any) {
        toast.errorToast('Failed to delete guide', err.message);
      }
    },
    [cookbook],
  );

  return deleteGuide;
};
