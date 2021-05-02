import React, { FunctionComponent, useState, useEffect } from "react";

import {
  EuiPanel,
  EuiImage,
  EuiText,
  EuiListGroup,
  EuiListGroupItem,
} from "@elastic/eui";
import {  liveStreams } from './Streams'

/* Styles */
import "./_twitch-sidebar.scss";

/* Types */
import { TwitchStream } from "../../models/TwitchStream";

export interface TwitchSidebarProps {
  className: string
}

export const TwitchSidebar: FunctionComponent<TwitchSidebarProps> = (props) => {
  const [streams, setStreams] = useState<TwitchStream[]>([])
  useEffect(() => {
    liveStreams().then(data => {
      setStreams(data)
    })
  }, [])
  return (
    <div className={props.className}>
      <EuiPanel paddingSize="m">
      <EuiText >
        <h4>Live Twitch Streams</h4>
      </EuiText>
      <div className="twitch-streams">
        <EuiListGroup gutterSize="none">
        {streams.map(stream => {
          if(!stream) return
          const {_id, title, login_name, display_name, profile_image_url} = stream
          return (
              <EuiListGroupItem 
                key={_id}
                title={title}
                className="twitch-stream"
                id={login_name + "-stream"}
                label={display_name} 
                href={"https://www.twitch.tv/" + login_name} 
                target="_blank"
                icon={
                  <EuiImage alt={login_name + " channel image"} size={30} src={profile_image_url} />
                }
                />
          )
        })}
        </EuiListGroup>
      </div>
      </EuiPanel>
    </div>
  )
}