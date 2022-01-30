import {
  EuiAvatar,
  EuiButtonIcon,
  EuiContextMenuItem,
  EuiContextMenuPanel,
  EuiIcon,
  EuiPopover,
  EuiTreeView,
} from '@elastic/eui';
import { Link } from 'react-router-dom';
import React, {
  FunctionComponent,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Guide } from '../../models/Guide';
import GuideService from '../../services/GuideService/GuideService';
import { ToastService } from '../../services/ToastService';
import { Context } from '../../store/Store';
import { useHistory } from 'react-router-dom';

import './_sidebar.scss';
import { HeaderSwitcher } from '../Header/HeaderSwitcher/HeaderSwitcher';
import { DISCORD, ROLES } from '../../constants/constants';
import { TreeNav } from '../TreeNav/TreeNav';

interface SidebarProps {}

export const Sidebar: FunctionComponent<SidebarProps> = () => {
  const [state, dispatch] = useContext(Context);
  const history = useHistory();
  const { cookbook, user, guides } = state;
  const [_guides, setGuides] = useState<Guide[]>([...guides]);

  const GuideTree: FunctionComponent = () => {
    const guideItems: any = guides.map((guide) => {
      const { title, sections, _id } = guide;
      return {
        label: <div>{title}</div>,
        id: _id,
        icon: <EuiIcon type="folderClosed" />,
        iconWhenExpanded: <EuiIcon type="folderOpen" />,
        isExpanded: true,
        children: sections.map((section) => {
          const { title } = section;
          return {
            label: title,
            id: title,
            icon: <EuiIcon type="document" />,
            callback: () =>
              history.push(
                `/${cookbook.name}/recipes/${guide._id}/section/${section.title}`,
              ),
          };
        }),
      };
    });

    const treeItems = [
      {
        label: 'Posts',
        id: 'posts',
        icon: <EuiIcon type="document" />,
        callback: () => history.push(`/${cookbook.name}`),
      },
      ...guideItems,
    ];

    return <EuiTreeView items={treeItems} aria-label="Sample Folder Tree" />;
  };

  return (
    <div className="sidebar">
      <div className="sidebar__header">{cookbook && <HeaderSwitcher />}</div>
      <div className="sidebar__content">
        {/* <GuideTree /> */}
        {cookbook.banner_url && <img src={cookbook.banner_url} />}
        <TreeNav />
      </div>
      {cookbook && user && (
        <div className="sidebar__footer">
          <EuiAvatar
            imageUrl={DISCORD.getAvatarUrl(user.discord_id, user.avatar)}
            name={`${user.username}#${user.discriminator}`}
            size="m"
          />
          <span className="username">{`${user.username}#${user.discriminator}`}</span>

          {ROLES.admin.includes(cookbook.roles[user.uid]) ||
          user.super_admin ? (
            <span className="settings">
              <Link to={`/${cookbook.name}/settings`}>
                <EuiIcon type="gear" size="m" color="ghost" />
              </Link>
            </span>
          ) : null}
        </div>
      )}
    </div>
  );
};
