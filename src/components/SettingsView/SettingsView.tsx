import React, {
  FunctionComponent,
  useContext,
  useState,
  useEffect,
} from 'react';

import { useParams } from 'react-router-dom';

/* Component */
import { SettingsNav } from './SettingsNav/SettingsNav';
import { GeneralView } from './GeneralView/GeneralView';
import { AccessView } from './AccessView/AccessView';
import { TagView } from './TagView/TagView';

/* Services */
import CookbookService from '../../services/CookbookService/CookbookService';
import { ToastService } from '../../services/ToastService';

/* Store */
import { Context } from '../../store/Store';
import { updateCookbook } from '../../store/actions';

/* Styles */
import './_settings-view.scss';
import { EuiPanel } from '@elastic/eui';

const GENERAL_INDEX = 0;
const ACCESS_INDEX = 1;
const TAGS_INDEX = 2;

export interface SettingsViewProps {}

export const SettingsView: FunctionComponent<SettingsViewProps> = () => {
  const [state, dispatch] = useContext(Context);
  const [index, setIndex] = useState(0);
  const { cookbook, game } = state;
  const cookbookSlug = useParams().cookbook;
  const cookbookService = new CookbookService();
  const toast = new ToastService();

  const VIEWS = {
    [GENERAL_INDEX]: <GeneralView />,
    [ACCESS_INDEX]: <AccessView />,
    [TAGS_INDEX]: <TagView />,
  };

  useEffect(() => {
    async function init() {
      try {
        const cookbooks = await cookbookService.get({
          game: game._id,
          name: cookbookSlug,
        });
        dispatch(updateCookbook(cookbooks[0]));
      } catch (err) {
        toast.errorToast('Error', err);
      }
    }
    init();
  }, []);

  const handleNavigate = (index: number) => {
    setIndex(index);
  };

  return (
    <>
      {cookbook && (
        <div className="settings-view">
          <div className="settings-view__nav">
            <SettingsNav handleNavigate={handleNavigate} />
          </div>
          <div className="settings-view__content">
            <EuiPanel>{VIEWS[index]}</EuiPanel>
          </div>
        </div>
      )}
    </>
  );
};
