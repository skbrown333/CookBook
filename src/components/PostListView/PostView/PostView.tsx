import React, { FunctionComponent, useContext } from 'react';

/* Components */
import {
  EuiMarkdownFormat,
  EuiPanel,
  EuiBadge,
  EuiButtonIcon,
  EuiAvatar,
} from '@elastic/eui';

/* Styles */
import './_post-view.scss';

/* Constants */
import { CHARACTERS } from '../../../constants/constants';

/* Plugins */
import { parsingList, processingList } from '../../../plugins';

/* Store */
import { Context } from '../../../store/Store';

export interface PostProps {
  post: any;
  handleEdit: () => void;
  handleDelete: () => void;
}

export const PostView: FunctionComponent<PostProps> = ({
  post,
  handleEdit,
  handleDelete,
}) => {
  const [state] = useContext(Context);
  const { cookbook, user } = state;
  const { title, body, id, character, tags } = post;

  return (
    <EuiPanel
      id={`post-${id}`}
      hasShadow={false}
      hasBorder
      className="post"
      key={id}
    >
      <div className="post__content">
        <div className="post__title">
          <EuiAvatar
            className="post__title__avatar"
            name={title}
            color={null}
            iconType={character ? CHARACTERS[character] : CHARACTERS.sandbag}
            iconSize="xl"
          ></EuiAvatar>
          <div className="post__title--text">{title}</div>
          {user && cookbook.roles[user.uid] === 'admin' && (
            <div className="post__controls">
              <EuiButtonIcon
                aria-label="edit"
                className="post__header__edit"
                iconType="documentEdit"
                color="primary"
                onClick={handleEdit}
              />
              <EuiButtonIcon
                aria-label="delete"
                className="post__header__delete"
                iconType="trash"
                color="danger"
                onClick={handleDelete}
              />
            </div>
          )}
        </div>

        <div className={`post__body`}>
          <EuiMarkdownFormat
            parsingPluginList={parsingList}
            processingPluginList={processingList}
          >
            {body}
          </EuiMarkdownFormat>
        </div>
        <div className="post__footer">
          {tags.map((tag, index) => (
            <EuiBadge key={index} className="tag" color="hollow">
              #{tag.label}
            </EuiBadge>
          ))}
        </div>
      </div>
    </EuiPanel>
  );
};
