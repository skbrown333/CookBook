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
} from '@elastic/eui';

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

/* Constants */
import { FIRESTORE } from '../../constants/constants';

/* Services */
import { ToastService } from '../../services/ToastService';

export interface ListViewProps {}

const emptyPost: Post = {
  id: '',
  title: '',
  body: '',
  tags: Array<Tag>(),
  cre_date: new Date(),
  doc_ref: '',
};

export const PostListView: FunctionComponent<ListViewProps> = () => {
  const handleSearch = (e) => e.queryText;
  const [posts, setPosts] = useState(Array<Post>());
  const [post, setPost] = useState(emptyPost);
  const [showEdit, setShowEdit] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [state] = useContext(Context);
  const firebase = useContext<Firebase | null>(FirebaseContext);
  const { cookbook } = state;
  const toast = new ToastService();

  useEffect(() => {
    getPosts();
  }, []);

  const handlePlus = () => {
    setPost(emptyPost);
    setShowAdd(true);
  };

  const getPosts = async () => {
    setPosts(
      await firebase?.getAll(
        cookbook.id,
        FIRESTORE.collections.posts,
        'cre_date',
        'desc',
      ),
    );
  };

  const cancelModal = () => {
    setShowEdit(false);
    setShowAdd(false);
    setShowDelete(false);
  };

  const handleEditPost = async (event) => {
    event.preventDefault();

    try {
      post.doc_ref.set(post);
      cancelModal();
      getPosts();
      toast.successToast('Edit successful');
    } catch (error) {
      toast.errorToast('failed to edit post', error.msg);
    }
  };

  const handleNewPost = async (event) => {
    event.preventDefault();

    try {
      await firebase?.add(cookbook.id, FIRESTORE.collections.posts, post);
      cancelModal();
      getPosts();
      toast.successToast('Added new post');
    } catch (error) {
      toast.errorToast('Failed adding post', error.msg);
    }
  };

  const updateSection = (key, value) => {
    if (!post) return;
    post[key] = value;
    setPost({ ...post });
  };

  const handleDelete = async () => {
    try {
      await post.doc_ref.delete();
      cancelModal();
      getPosts();
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
    const { title, body, tags, character } = post;
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
    return posts.map((post) => {
      return (
        <PostView
          post={post}
          handleEdit={() => {
            setPost(post);
            setShowEdit(true);
          }}
          handleDelete={() => {
            setPost(post);
            setShowDelete(true);
          }}
        />
      );
    });
  };

  return (
    <div id="post-list">
      <div className="post-list">
        <SearchCreateBar handlePlus={handlePlus} handleSearch={handleSearch} />
        <div className="post-list__content">{buildPosts()}</div>
      </div>
      <TwitchSidebar className="post-list__twitch" />

      {showAdd && Modal('New Post', handleNewPost)}
      {showEdit && Modal('Edit Post', handleEditPost)}
      {showDelete && destroyModal}
    </div>
  );
};
