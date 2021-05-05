import React, {
  FunctionComponent,
  useEffect,
  useState,
  useContext,
} from "react";

/* Components */
import { EuiHeader, EuiHeaderSectionItemButton } from "@elastic/eui";
import { EuiIcon, EuiAvatar } from "@elastic/eui";
import { Firebase, FirebaseContext } from "../../firebase";
import { DISCORD } from "../../constants/constants";

export interface HeaderBarProps {}

export const HeaderBar: FunctionComponent<HeaderBarProps> = () => {
  const [user, setUser] = useState<any>(null);
  const context = useContext<Firebase | null>(FirebaseContext);
  useEffect(() => {
    init();
    async function init() {
      if (!context) return;
      try {
        const user = await context.getCurrentUser();
        setUser(user);
      } catch (err) {
        console.log(err);
      }
    }
  }, []);

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
              {user && (
                <EuiAvatar
                  imageUrl={DISCORD.getAvatarUrl(user.id, user.avatar)}
                  name={`${user.username}#${user.discriminator}`}
                  size="m"
                />
              )}
            </EuiHeaderSectionItemButton>,
          ],
          borders: "none",
        },
      ]}
    />
  );
};
