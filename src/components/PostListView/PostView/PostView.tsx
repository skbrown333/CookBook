import React, {
  FunctionComponent,
  useContext,
  useEffect,
  useState,
} from 'react';

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
  const [author, setAuthor] = useState<any>(null);
  const { title, body, id, character, tags, cre_account } = post;

  const getAuthor = async () => {
    if (!cre_account) return;
    const doc = await cre_account.get();
    const author = doc.data();
    setAuthor(author);
  };

  useEffect(() => {
    getAuthor();
  }, [post]);

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
            size="l"
          ></EuiAvatar>
          <div className="post__title--text">
            {title}
            <div className="post__title--text author">
              {author && `${author.username}#${author.discriminator}`}
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
