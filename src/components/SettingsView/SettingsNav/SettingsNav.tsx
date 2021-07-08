import React, { FunctionComponent } from 'react';

/* Components */
import { EuiIcon, EuiToken, EuiTreeView } from '@elastic/eui';

/* Styles */
import './_settings-nav.scss';

const GENERAL_INDEX = 0;
const ACCESS_INDEX = 1;
const TAGS_INDEX = 2;

export interface SettingsNavProps {
  handleNavigate: (index: number) => void;
}

export const SettingsNav: FunctionComponent<SettingsNavProps> = ({
  handleNavigate,
}) => {
  const items: any = [
    {
      label: 'General',
      id: 'general',
      icon: <EuiIcon type="gear" />,
      callback: () => {
        handleNavigate(GENERAL_INDEX);
      },
    },
    {
      label: 'Access',
      id: 'access',
      icon: <EuiIcon type="users" />,
      callback: () => {
        handleNavigate(ACCESS_INDEX);
      },
    },
    {
      label: 'Tags',
      id: 'tags',
      icon: <EuiIcon type="tag" />,
      callback: () => {
        handleNavigate(TAGS_INDEX);
      },
    },
  ];
  return (
    <div className="settings-nav">
      <div className="settings-nav__header">Settings</div>
      <div className="settings-nav__content">
        <EuiTreeView items={items} aria-label="Sample Folder Tree" />
      </div>
    </div>
  );
};
