import React, { useState, useEffect, FunctionComponent } from 'react';
import YTPlayer from 'yt-player';

export interface YoutubeEmbedProps {
  id: string;
}

export interface YoutubeIframe {
  load: (x) => void;
  on: (x, y) => void;
  play: () => void;
  seek: (x) => void;
  mute: () => void;
  pause: () => void;
  getState: () => string;
}

export const YoutubeEmbed: FunctionComponent<YoutubeEmbedProps> = ({ id }) => {
  const dummy: YoutubeIframe = {
    load: (x) => {},
    on: (x, y) => {},
    play: () => {},
    pause: () => {},
    seek: (x) => {},
    mute: () => {},
    getState: () => '',
  };

  const [player, setPlayer] = useState(dummy);
  const [paused, setPaused] = useState(false);

  const div_id = `youtube-clip-${id}`;
  useEffect(() => {
    setPlayer(
      new YTPlayer('#' + div_id, {
        autoplay: true,
        controls: false,
        modestBranding: true,
      }),
    );
  }, []);

  useEffect(() => {
    player.mute();
    player.on('unstarted', () => player.play());
    player.on('ended', () => player.seek(0));
    player.load(id);
  }, [player]);

  const clickHandler = () => {
    if (['unstarted', 'ended'].includes(player.getState())) player.play();
    else {
      if (paused) {
        player.play();
        setPaused(false);
      } else {
        player.pause();
        setPaused(true);
      }
    }
  };

  return (
    <>
      <div className="media__cover" onClick={clickHandler} />
      <div id={div_id} className="markdown__video markdown__media" />;
    </>
  );
};
