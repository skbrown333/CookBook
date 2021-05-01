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

export const TwitchSidebar: FunctionComponent = () => {
  const [streams, setStreams] = useState<TwitchStream[]>([])
  useEffect(() => {
    liveStreams().then(data => {
      setStreams(data)
    })
  }, [])
  return (
    <div className="matchup-content__right">
      <EuiPanel paddingSize="m">
      <EuiText >
        <h4>Live Twitch Streams</h4>
      </EuiText>
      <div className="twitch-streams">
        <EuiListGroup gutterSize="none">
        {streams.map(stream => {
          if(!stream) return
          return (
              <EuiListGroupItem 
                key={stream._id}
                title={stream.title}
                className="twitch-stream"
                id={stream.login_name + "-stream"}
                label={stream.display_name} 
                href={"https://www.twitch.tv/" + stream.login_name} 
                target="_blank"
                icon={
                  <EuiImage alt={stream.login_name + " channel image"} size={30} src={stream.profile_image_url} />
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