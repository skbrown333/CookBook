import React, { FunctionComponent, useContext, useState } from 'react';

/* Component */
import { EuiSwitch, EuiTitle, EuiFieldText } from '@elastic/eui';

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
  const [donate, setDonate] = useState(
    cookbook.donation_link ? cookbook.donation_link : '',
  );
  const cookbookService = new CookbookService();
  const toast = new ToastService();

  const updateHelper = async (params) => {
    try {
      const token = await user.user.getIdToken();
      console.log(params);
      const updatedCookbook = await cookbookService.update(
        cookbook._id,
        params,
        {
          Authorization: `Bearer ${token}`,
        },
      );
      dispatch(updateCookbook(updatedCookbook));
      toast.successToast('Successfully Updated Cookbook');
    } catch (err) {
      toast.errorToast('Error Updating Cookbook', err.message);
    }
  };

  const handleChange = async (checked, option) => {
    try {
      setSaving(true);
      const params = {
        ...(option === 'preview' ? { preview: checked } : {}),
        ...(option === 'show_authors' ? { show_authors: checked } : {}),
      };
      await updateHelper(params);
    } catch (err) {
      toast.errorToast('Error Updating Cookbook', err.message);
    } finally {
      setSaving(false);
    }
  };

  const featureSection = () => {
    return (
      <>
        <EuiTitle size="m">
          <h1>Features</h1>
        </EuiTitle>
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
      </>
    );
  };

  const donateUpdate = async (e) => {
    if (e.keyCode === 13) {
      await updateHelper({ donation_url: donate });
      setDonate('');
    }
  };

  const donationSection = () => {
    return (
      <>
        <EuiTitle size="m">
          <h1>Donation Link</h1>
        </EuiTitle>
        {donate ? (
          <EuiTitle size="xs">
            <h1>{cookbook.donation_link}</h1>
          </EuiTitle>
        ) : (
          <>
            <EuiTitle size="xs">
              <h1>No Donation Link Set</h1>
            </EuiTitle>
          </>
        )}
        <EuiFieldText
          placeholder="donation link"
          value={donate}
          onChange={(e) => setDonate(e.target.value)}
          onKeyDown={donateUpdate}
        />
      </>
    );
  };

  return (
    <div className="general-view">
      <div className="general-view__header">General Options</div>
      <div className="general-view__content">
        {featureSection()}
        {donationSection()}
      </div>
    </div>
  );
};
