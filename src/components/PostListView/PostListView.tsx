import React, {
  FunctionComponent,
  useState,
  useContext,
  useEffect,
} from 'react';

/* Components */
import { SearchCreateBar } from '../SearchCreateBar/SearchCreateBar';
import { TagInput } from '../TagInput/TagInput';
import { PostView } from './PostView/PostView';
import { TwitchSidebar } from '../TwitchSidebar/TwitchSidebar';
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

/* Styles */
import './_post-list-view.scss';

/* Models */
import { Post } from '../../models/Post';
import { Tag } from '../../models/Tag';

/* Plugins */
import { parsingList, processingList, uiList } from '../../plugins';

/* Context */
import { Firebase, FirebaseContext } from '../../firebase';
import { Context } from '../../store/Store';

/* Services */
import { ToastService } from '../../services/ToastService';
import { updateTwitch } from '../../store/actions';
import { UserInput } from '../UserInput/UserInput';
import PostService from '../../services/PostService/PostService';

export interface ListViewProps {}

const emptyPost: Post = {
  title: '',
  body: '',
  tags: Array<Tag>(),
  cre_date: new Date(),
  doc_ref: '',
};

export const PostListView: FunctionComponent<ListViewProps> = () => {
  const [state, dispatch] = useContext(Context);
  const [posts, setPosts] = useState(Array<Post>());
  const [post, setPost] = useState(emptyPost);
  const [index, setIndex] = useState(0);
  const [showEdit, setShowEdit] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const firebase = useContext<Firebase | null>(FirebaseContext);
  const { cookbook, user } = state;
  const toast = new ToastService();
  const [loading, setLoading] = useState<boolean>(true);
  const [hasNextPage, setHasNextPage] = useState<boolean>(true);
  const [filters, setFilters] = useState<any>(undefined);
  const [searchText, setSearchText] = useState('');
  const postService = new PostService(cookbook._id);

  const handleSearch = (event) => {
    const value = event?.target.value.toUpperCase();
    setSearchText(value);
  };

  useEffect(() => {
    async function init() {
      if (firebase) {
        try {
          dispatch(
            updateTwitch(await firebase.getTwitchStreams(cookbook.streams)),
          );
        } catch (err) {
          toast.errorToast('Error Getting Streams', err.message);
        }
      }
    }

    init();
  }, []);

  useEffect(() => {
    setHasNextPage(true);
    setPosts([]);
  }, [filters]);

  useEffect(() => {
    if (!hasNextPage) return;
    if (posts.length === 0) {
      getPosts();
    }
  }, [posts, hasNextPage]);

  const handleFilterChange = (filters) => {
    setFilters(filters);
  };

  const handlePlus = () => {
    setPost(emptyPost);
    setShowAdd(true);
  };

  const getPosts = async () => {
    setLoading(true);
    try {
      const limit = 15;
      const newPosts = await postService.get({
        // limit,
        // skip: posts.length,
        // filters,
      });
      if (newPosts.length < limit) {
        setHasNextPage(false);
      }
      setPosts([...posts, ...newPosts]);
    } catch (err) {
      toast.errorToast('Error Fetching Posts', err.message);
    } finally {
      setLoading(false);
    }
  };

  const cancelModal = () => {
    setShowEdit(false);
    setShowAdd(false);
    setShowDelete(false);
  };

  const handleEditPost = async (event) => {
    event.preventDefault();
    try {
      const newPosts = [...posts];
      const { title, body, character, tags, cre_account } = post;
      const token = await user.user.getIdToken();
      await postService.update(post._id, post, {
        Authorization: `Bearer ${token}`,
      });
      newPosts[index] = {
        ...newPosts[index],
        ...{
          title,
          cre_account,
          ...(body ? { body } : {}),
          ...(character ? { character } : {}),
          ...(tags ? { tags } : {}),
        },
      };

      setPosts([...newPosts]);
      cancelModal();
      toast.successToast('Edit successful');
    } catch (error) {
      toast.errorToast('failed to edit post', error.message);
    }
  };

  const handleNewPost = async (event) => {
    event.preventDefault();
    try {
      const token = await user.user.getIdToken();
      const newPost = await postService.create(post, {
        Authorization: `Bearer ${token}`,
      });
      cancelModal();
      setPosts([...[newPost], ...posts]);
      toast.successToast('Added new post');
    } catch (error) {
      toast.errorToast('Failed adding post', error.message);
    }
  };

  const updateSection = (key, value) => {
    if (!post) return;
    post[key] = value;
    setPost({ ...post });
  };

  const handleDelete = async () => {
    try {
      const token = await user.user.getIdToken();
      await postService.delete(post._id, {
        Authorization: `Bearer ${token}`,
      });
      posts.splice(index, 1);
      setPosts([...posts]);
      cancelModal();
      toast.successToast('Deleted post');
    } catch (error) {
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
                value={character}
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
    return posts
      .filter((post) => {
        return (
          post.title.toUpperCase().indexOf(searchText) > -1 ||
          post.body.toUpperCase().indexOf(searchText) > -1
        );
      })
      .map((post, index) => {
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
    rootMargin: '0px 0px 400px 0px',
  });

  return (
    <div id="post-list">
      <div className="post-list">
        <SearchCreateBar
          handlePlus={handlePlus}
          handleSearch={handleSearch}
          handleFilterChange={handleFilterChange}
        />
        <div className="post-list__content">
          {buildPosts()}
          <div ref={sentryRef} />
          {loading && <EuiLoadingSpinner size="xl" />}
        </div>
      </div>
      <TwitchSidebar className="post-list__twitch" />

      {showAdd && Modal('New Post', handleNewPost)}
      {showEdit && Modal('Edit Post', handleEditPost)}
      {showDelete && destroyModal}
    </div>
  );
};
