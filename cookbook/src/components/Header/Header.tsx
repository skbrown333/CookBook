import React, { FunctionComponent } from "react";

/* Components */
import {
  EuiHeader,
  EuiHeaderLogo,
  EuiHeaderLinks,
  EuiHeaderLink,
  EuiHeaderSectionItemButton,
} from "@elastic/eui";
import { EuiBadge, EuiIcon, EuiAvatar } from "@elastic/eui";

export interface HeaderBarProps {}

export const HeaderBar: FunctionComponent<HeaderBarProps> = () => {
  return (
    <EuiHeader
      theme="default"
      position="fixed"
      sections={[
        {
          items: [],
          borders: "right",
        },
        {
          items: [
            <EuiHeaderSectionItemButton
              aria-label="2 Notifications"
              notification={"2"}
            >
              <EuiIcon type="cheer" size="m" />
            </EuiHeaderSectionItemButton>,
            <EuiHeaderSectionItemButton aria-label="Account menu">
              <EuiAvatar name="John Username" size="s" />
            </EuiHeaderSectionItemButton>,
          ],
          borders: "none",
        },
      ]}
    />
  );
};
