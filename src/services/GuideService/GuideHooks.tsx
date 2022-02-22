import React, { useCallback, useContext } from 'react';
import { updateGuides } from '../../store/actions';
import { Context } from '../../store/Store';
import { ToastService } from '../ToastService';
import GuideService from './GuideService';

export const useDeleteGuide = (setEditing) => {
  const [state, dispatch] = useContext(Context);
  const { cookbook, user } = state;
  const guideService = new GuideService(cookbook._id);
  const toast = new ToastService();

  const deleteGuide = useCallback(async (guide, section) => {
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
  }, []);

  return deleteGuide;
};

export const useSaveGuide = (setEditing) => {
  const [state, dispatch] = useContext(Context);
  const { cookbook, user } = state;
  const guideService = new GuideService(cookbook._id);
  const toast = new ToastService();

  const deleteGuide = useCallback(async (guide) => {
    if (!guide) return;
    try {
      await guideService.update(guide._id, user, {
        sections: guide.sections,
      });
      toast.successToast('Guide saved!', 'Guide saved');
      const guides = await guideService.getByCookbook(cookbook._id);
      dispatch(updateGuides([...guides], cookbook));
      setEditing(false);
    } catch (err: any) {
      toast.errorToast('Something went wrong', 'Guide was not saved');
    }
  }, []);

  return deleteGuide;
};
