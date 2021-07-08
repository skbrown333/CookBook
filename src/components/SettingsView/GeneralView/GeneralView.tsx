import React, { FunctionComponent, useContext, useState } from 'react';

/* Component */
import { EuiSwitch } from '@elastic/eui';

/* Services */
import { ToastService } from '../../../services/ToastService';
import CookbookService from '../../../services/CookbookService/CookbookService';

/* Store */
import { Context } from '../../../store/Store';

/* Styles */
import './_general-view.scss';
import { updateCookbook } from '../../../store/actions';

export interface GeneralViewProps {}

export const GeneralView: FunctionComponent<GeneralViewProps> = () => {
  const [saving, setSaving] = useState<boolean>(false);
  const [state, dispatch] = useContext(Context);
  const { user, cookbook } = state;
  const cookbookService = new CookbookService();
  const toast = new ToastService();

  const handleChange = async (checked, option) => {
    try {
      setSaving(true);
      const params = {
        ...(option === 'preview' ? { preview: checked } : {}),
        ...(option === 'show_authors' ? { show_authors: checked } : {}),
      };
      const token = await user.user.getIdToken();
      const updatedCookbook = await cookbookService.update(
        cookbook._id,
        params,
        {
          Authorization: `Bearer ${token}`,
        },
      );
      dispatch(updateCookbook(updatedCookbook));
    } catch (err) {
      toast.errorToast('Error Updating Cookbook', err.message);
    } finally {
      setSaving(false);
    }
  };
  return (
    <div className="general-view">
      <div className="general-view__header">Feature Options</div>
      <div className="general-view__content">
        <EuiSwitch
          label="Preview Mode"
          checked={!!cookbook.preview}
          disabled={saving}
          onChange={(e) => {
            handleChange(e.target.checked, 'preview');
          }}
        />
        <EuiSwitch
          label="Show Authors"
          checked={!!cookbook.show_authors}
          disabled={saving}
          onChange={(e) => {
            handleChange(e.target.checked, 'show_authors');
          }}
        />
      </div>
    </div>
  );
};
