import React, { FunctionComponent, useContext } from 'react';

/* Components */
import {
  EuiMarkdownFormat,
  EuiPanel,
  EuiSpacer,
  EuiBadge,
  EuiButtonIcon,
} from '@elastic/eui';

/* Styles */
import './_post-view.scss';

/* Models */
import { Tag } from '../../../models/Tag';

/* Plugins */
import { parsingList, processingList } from '../../../plugins';

/* Store */
import { Context } from '../../../store/Store';

export interface PostProps {
  title: string;
  body: string;
  tags: Array<Tag>;
  id: string;
  handleEdit: () => void;
  handleDelete: () => void;
}

export const PostView: FunctionComponent<PostProps> = ({
  title,
  body,
  tags,
  id,
  handleEdit,
  handleDelete,
}) => {
  const [state] = useContext(Context);
  const { cookbook, user } = state;

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
          <div className="post__title--text">{title}</div>
        </div>

        <div className={`post__body`}>
          <EuiMarkdownFormat
            parsingPluginList={parsingList}
            processingPluginList={processingList}
          >
            {body}
          </EuiMarkdownFormat>
          <EuiSpacer size="s" />
          <div className="tag-holder post__tags">
            {tags.map((tag, index) => (
              <EuiBadge key={index} className="tag" color="hollow">
                #{tag.label}
              </EuiBadge>
            ))}
          </div>
        </div>
      </div>
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
    </EuiPanel>
  );
};
