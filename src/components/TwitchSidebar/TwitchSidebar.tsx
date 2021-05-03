import React, { FunctionComponent, useContext } from "react";

import {
  EuiPanel,
  EuiImage,
  EuiText,
  EuiListGroup,
  EuiListGroupItem,
} from "@elastic/eui";

/* Styles */
import "./_twitch-sidebar.scss";

/* Store */
import { Context } from '../../store/Store'

export interface TwitchSidebarProps {
  className: string
}
export const TwitchSidebar: FunctionComponent<TwitchSidebarProps> = (props) => {
  const {streams} = useContext(Context)[0]

  const buildStreams = () => {
    if(!streams) return
    return streams.map(stream => {
            if(!stream) return
            const {
              title,
              user_name,
              profile_image_url
            } = stream
            return (
                <EuiListGroupItem 
                  key={user_name}
                  title={title}
                  className="twitch-stream"
                  id={user_name + "-stream"}
                  label={user_name} 
                  href={"https://www.twitch.tv/" + user_name} 
                  target="_blank"
                  icon={
                    <EuiImage alt={user_name + " channel image"} size={30} src={profile_image_url} />
                  }
                  />
            )
          })
  }

  return (
    <div className={props.className}>
      <EuiPanel paddingSize="m">
      <EuiText >
        <h4>Live Twitch Streams</h4>
      </EuiText>
      <div className="twitch-streams">
        <EuiListGroup gutterSize="none">
          {buildStreams()}
        </EuiListGroup>
      </div>
      </EuiPanel>
    </div>
  )
}