import React, {
  FunctionComponent,
  useState,
  useContext,
  useEffect,
} from 'react';

/* Components */
import { TagInput } from '../TagInput/TagInput';
import { PostView } from './PostView/PostView';
import { CharacterSelect } from '../CharacterSelect/CharacterSelect';
import {
  EuiModal,
  EuiModalHeader,
  EuiModalBody,
  EuiModalFooter,
  EuiModalHeaderTitle,
  EuiButton,
  EuiButtonEmpty,
  EuiMarkdownEditor,
  EuiFieldText,
  EuiConfirmModal,
  EuiForm,
  EuiFormRow,
  EuiLoadingSpinner,
} from '@elastic/eui';
import useInfiniteScroll from 'react-infinite-scroll-hook';
import { MdContentCopy } from 'react-icons/md';

/* Styles */
import './_post-list-view.scss';

/* Models */
import { Post } from '../../models/Post';
import { Tag } from '../../models/Tag';

/* Plugins */
import { parsingList, processingList, uiList } from '../../plugins';

/* Context */
import { Context } from '../../store/Store';

/* Services */
import { ToastService } from '../../services/ToastService';
import { updateAddStatus } from '../../store/actions';
import { UserInput } from '../UserInput/UserInput';
import PostService from '../../services/PostService/PostService';
import { TwitchSidebar } from '../TwitchSidebar/TwitchSidebar';
import { URL_UTILS } from '../../constants/constants';

export interface ListViewProps {
  filters: any;
  searchText: string;
  adding: string;
}

const emptyPost: Post = {
  title: '',
  body: '',
  tags: Array<Tag>(),
  cre_date: new Date(),
  doc_ref: '',
};

export const PostListView: FunctionComponent<ListViewProps> = ({
  filters,
  searchText,
  adding,
}) => {
  const [state, dispatch] = useContext(Context);
  const [posts, setPosts] = useState(Array<Post>());
  const [post, setPost] = useState(emptyPost);
  const [index, setIndex] = useState(0);
  const [showEdit, setShowEdit] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const { cookbook, user, add } = state;
  const toast = new ToastService();
  const [loading, setLoading] = useState<boolean>(true);
  const [hasNextPage, setHasNextPage] = useState<boolean>(true);
  const [page, setPage] = useState(1);
  const postService = new PostService(cookbook._id);

  useEffect(() => {
    setHasNextPage(true);
    setPosts([]);
  }, [filters, searchText]);

  useEffect(() => {
    if (!hasNextPage) return;
    if (posts.length === 0) {
      setPage(1);
    }
  }, [posts, hasNextPage]);

  useEffect(() => {
    if (!hasNextPage) return;
    if (posts.length === 0 && page === 1) {
      getPosts();
    }
  }, [page, filters]);

  useEffect(() => {
    if (add && !adding.includes('/recipes')) {
      setPost(emptyPost);
      setShowAdd(true);
    }
  }, [add, adding]);

  const getPosts = async () => {
    setLoading(true);
    try {
      const limit = 15;
      const newPosts = await postService.get({
        sort: 'cre_date',
        limit,
        ...(posts.length > 0 ? { page } : {}),
        filters: filters.map((filter) => filter._id),
        ...(searchText && searchText.length > 0 ? { search: searchText } : {}),
      });
      if (newPosts.length < limit) {
        setHasNextPage(false);
      }
      setPage(page + 1);
      setPosts([...posts, ...newPosts]);
    } catch (err: any) {
      toast.errorToast('Error Fetching Posts', err.message);
    } finally {
      setLoading(false);
    }
  };

  const cancelModal = () => {
    setShowEdit(false);
    setShowAdd(false);
    setShowDelete(false);
    dispatch(updateAddStatus(false));
  };

  const handleEditPost = async (event) => {
    event.preventDefault();
    try {
      const newPosts = [...posts];
      const updatedPost = await postService.update(post._id, user, post);
      newPosts[index] = updatedPost;
      setPosts([...newPosts]);
      cancelModal();
      toast.successToast('Edit successful');
    } catch (err: any) {
      toast.errorToast('failed to edit post', err.message);
    }
  };

  const handleNewPost = async (event) => {
    event.preventDefault();
    try {
      const newPost = await postService.create(post, user);
      cancelModal();
      setPosts([...[newPost], ...posts]);
      dispatch(updateAddStatus(false));
      toast.successToast('Added new post');
    } catch (err: any) {
      toast.errorToast('Failed adding post', err.message);
    }
  };

  const updateSection = (key, value) => {
    if (!post) return;
    post[key] = value;
    setPost({ ...post });
  };

  const handleDelete = async () => {
    try {
      await postService.delete(post._id, user);
      posts.splice(index, 1);
      setPosts([...posts]);
      cancelModal();
      toast.successToast('Deleted post');
    } catch (err: any) {
      toast.errorToast('Failed to Delete Post');
    }
  };

  const destroyModal = (
    <EuiConfirmModal
      title={`Delete post "${post ? post.title : ''}"?`}
      onCancel={() => setShowDelete(false)}
      onConfirm={handleDelete}
      cancelButtonText="Cancel"
      confirmButtonText="Delete"
      buttonColor="danger"
      defaultFocusedButton="confirm"
    >
      <p>You&rsquo;re about to delete this guide permanently</p>
    </EuiConfirmModal>
  );

  const Modal = (head, save) => {
    const { title, body, tags, character, cre_account } = post;
    return (
      <EuiModal
        className="post__modal"
        onClose={cancelModal}
        initialFocus="[name=popswitch]"
      >
        <EuiModalHeader>
          <EuiModalHeaderTitle>
            <h1>{head}</h1>
          </EuiModalHeaderTitle>
        </EuiModalHeader>
        <EuiModalBody>
          <EuiForm id="postForm" component="form">
            <EuiFormRow>
              <EuiFieldText
                placeholder="title"
                required
                value={title}
                onChange={(e) => updateSection('title', e.target.value)}
              />
            </EuiFormRow>
            <EuiFormRow className="user-input">
              <UserInput
                initialSelected={cre_account}
                handleUpdate={(user) => updateSection('cre_account', user)}
              />
            </EuiFormRow>
            <EuiFormRow fullWidth>
              <>
                <EuiMarkdownEditor
                  aria-label="Body markdown editor"
                  value={body}
                  onChange={(value) => updateSection('body', value)}
                  height={248}
                  parsingPluginList={parsingList}
                  processingPluginList={processingList}
                  uiPlugins={uiList}
                />
                <TagInput
                  className="guide-section__tags"
                  initialTags={tags}
                  handleUpdate={(tags) => updateSection('tags', tags)}
                ></TagInput>
              </>
            </EuiFormRow>
            <EuiFormRow label="Select Character (optional)">
              <CharacterSelect
                value={character ? character._id : null}
                onChange={(value) => updateSection('character', value)}
              />
            </EuiFormRow>
          </EuiForm>
        </EuiModalBody>
        <EuiModalFooter>
          <EuiButtonEmpty onClick={cancelModal}>Cancel</EuiButtonEmpty>
          <EuiButton
            type="submit"
            form="postForm"
            onClick={save}
            fill
            disabled={!title.length}
          >
            Save
          </EuiButton>
        </EuiModalFooter>
      </EuiModal>
    );
  };

  const buildPosts = () => {
    return posts.map((post, index) => {
      return (
        <PostView
          post={post}
          handleEdit={() => {
            setPost(post);
            setIndex(index);
            setShowEdit(true);
          }}
          handleDelete={() => {
            setPost(post);
            setIndex(index);
            setShowDelete(true);
          }}
          handleLike={async () => {
            const url = `${URL_UTILS.protocol}://${
              window.location.hostname
            }/${encodeURI(cookbook.name)}/posts/${post._id}`;
            navigator.clipboard.writeText(url).then(() => {
              toast.successToast('Copied to clipboard!', undefined, () => (
                <MdContentCopy />
              ));
            });
          }}
        />
      );
    });
  };

  const [sentryRef] = useInfiniteScroll({
    loading,
    hasNextPage: hasNextPage,
    onLoadMore: getPosts,
    // When there is an error, we stop infinite loading.
    // It can be reactivated by setting "error" state as undefined.
    disabled: false,
    // `rootMargin` is passed to `IntersectionObserver`.
    // We can use it to trigger 'onLoadMore' when the sentry comes near to become
    // visible, instead of becoming fully visible on the screen.
    rootMargin: '0px 0px 0px 0px',
  });

  return (
    <>
      {cookbook && (
        <div id="post-list">
          <div className="post-list">
            <div className="post-list__content">
              {buildPosts()}
              <div ref={sentryRef} />
              {loading && <EuiLoadingSpinner size="xl" />}
            </div>
            <TwitchSidebar className="post-sidebar" />
          </div>

          {showAdd && Modal('New Post', handleNewPost)}
          {showEdit && Modal('Edit Post', handleEditPost)}
          {showDelete && destroyModal}
        </div>
      )}
    </>
  );
};
