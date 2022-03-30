import React, { FunctionComponent, useContext, useState } from 'react';

/* Component */
import { EuiSwitch, EuiTitle, EuiFieldText, EuiButtonIcon } from '@elastic/eui';

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
  const [donate_temp, setDonateTemp] = useState(cookbook.donation_url || '');
  const [banner_temp, setBannerTemp] = useState(cookbook.banner_url || '');
  const cookbookService = new CookbookService();
  const toast = new ToastService();

  const updateHelper = async (params) => {
    try {
      const updatedCookbook = await cookbookService.update(
        cookbook._id,
        user,
        params,
      );
      dispatch(updateCookbook(updatedCookbook));
      toast.successToast('Successfully Updated Cookbook');
    } catch (err: any) {
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
    } catch (err: any) {
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

  const checkDonateUrl = (test) => {
    return donate_temp.includes(test);
  };

  const transformUrl = (url) => {
    const https = 'https://';
    const www = 'www.';
    let new_url = url;
    if (!checkDonateUrl('.com')) {
      throw new Error("URL must include '.com'");
    }
    if (!checkDonateUrl(https) && !checkDonateUrl(www)) {
      new_url = https + www + donate_temp;
    } else if (!checkDonateUrl(https)) {
      new_url = https + donate_temp;
    }
    return new_url;
  };

  const donateUpdate = async (e) => {
    if (e.keyCode === 13) {
      try {
        const donate_url = transformUrl(donate_temp);
        await updateHelper({ donation_url: donate_url });
      } catch (e) {
        toast.errorToast('Invalid URL', e.message);
      }
    }
  };

  const bannerUpdate = async (e) => {
    if (e.keyCode === 13) {
      try {
        const banner_url = banner_temp;
        await updateHelper({ banner_url: banner_url });
      } catch (e) {
        toast.errorToast('Invalid URL', e.message);
      }
    }
  };

  const donationSection = () => {
    return (
      <div className="donation">
        <div className="donation__title">
          <EuiTitle size="m" className="donation__title__text">
            <h1>Donation URL</h1>
          </EuiTitle>
          {cookbook.donation_url && (
            <EuiButtonIcon
              className="donation__title__button"
              display="fill"
              color="danger"
              iconType="cross"
              aria-label="remove donation URL"
              onClick={() => {
                setDonateTemp('');
                updateHelper({ donation_url: '' });
              }}
            />
          )}
        </div>
        <EuiFieldText
          className="donation__input"
          placeholder="Set Donation URL"
          value={donate_temp}
          onChange={(e) => setDonateTemp(e.target.value)}
          onKeyDown={donateUpdate}
        />
      </div>
    );
  };

  const bannerSection = () => {
    return (
      <div className="banner">
        <div className="banner__title">
          <EuiTitle size="m" className="banner__title__text">
            <h1>Banner URL</h1>
          </EuiTitle>
          {cookbook.banner_url && (
            <EuiButtonIcon
              className="banner__title__button"
              display="fill"
              color="danger"
              iconType="cross"
              aria-label="remove banner URL"
              onClick={() => {
                setBannerTemp('');
                updateHelper({ banner_url: '' });
              }}
            />
          )}
        </div>
        <EuiFieldText
          className="banner__input"
          placeholder="Set Banner URL"
          value={banner_temp}
          onChange={(e) => setBannerTemp(e.target.value)}
          onKeyDown={bannerUpdate}
        />
      </div>
    );
  };

  return (
    <div className="general-view">
      <div className="general-view__header">General Options</div>
      <div className="general-view__content">
        {featureSection()}
        {donationSection()}
        {bannerSection()}
      </div>
    </div>
  );
};
