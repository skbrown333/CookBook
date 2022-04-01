import React, { FunctionComponent, useContext } from 'react';

/* Components */
import {
  EuiMarkdownFormat,
  EuiPanel,
  EuiBadge,
  EuiButtonIcon,
  EuiAvatar,
} from '@elastic/eui';
import { MdContentCopy } from 'react-icons/md';

/* Styles */
import './_post-view.scss';

/* Constants */
import { canManage, CHARACTERS } from '../../../constants/constants';

/* Plugins */
import { parsingList, processingList } from '../../../plugins';

/* Store */
import { Context } from '../../../store/Store';

export interface PostProps {
  post: any;
  handleEdit: () => void;
  handleDelete: () => void;
  handleLike: () => void;
}

export const PostView: FunctionComponent<PostProps> = ({
  post,
  handleEdit,
  handleDelete,
  handleLike,
}) => {
  const [state] = useContext(Context);
  const { cookbook, user } = state;
  const { title, body, _id, character, tags, cre_account, likes } = post;

  return (
    <EuiPanel id={`post-${_id}`} hasShadow={false} className="post" key={_id}>
      <div className="post__content">
        <div className="post__title">
          <EuiAvatar
            className="post__title__avatar"
            name={title}
            color={null}
            iconType={
              character
                ? CHARACTERS[cookbook.game.name][character.name]
                : CHARACTERS.melee.sandbag
            }
            iconSize="xl"
            size="l"
          ></EuiAvatar>
          <div className="post__title--text">
            {title}
            <div className="post__title--text author">
              {cre_account &&
                cookbook.show_authors &&
                `@${cre_account.username}`}
            </div>
          </div>
          <div className="post__controls">
            <div className="post__controls__like">
              {/* {likes != null && likes > 0 && (
                <div className="count">{likes}</div>
              )} */}
              <EuiButtonIcon
                aria-label="edit"
                className="like"
                iconType={() => <MdContentCopy />}
                color="primary"
                onClick={handleLike}
              />
            </div>
            {canManage(user, cookbook) && (
              <>
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
              </>
            )}
          </div>
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
            <EuiBadge key={index} className="tag" color={tag.color || 'hollow'}>
              #{tag.label}
            </EuiBadge>
          ))}
        </div>
      </div>
    </EuiPanel>
  );
};
