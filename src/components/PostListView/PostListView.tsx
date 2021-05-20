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
  EuiPanel,
  EuiConfirmModal,
} from '@elastic/eui';

/* STyles */
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
    setPosts(await firebase?.getAll(cookbook.id, FIRESTORE.collections.posts));
  };

  const cancelModal = () => {
    setShowEdit(false);
    setShowAdd(false);
    setShowDelete(false);
  };

  const handleEditPost = async () => {
    try {
      post.doc_ref.set(post);
      cancelModal();
      getPosts();
      toast.successToast('Edit successful');
    } catch (error) {
      toast.errorToast('failed to edit post', error.msg);
    }
  };

  const handleNewPost = async () => {
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
    const { title, body, tags } = post;
    return (
      <EuiModal onClose={cancelModal} initialFocus="[name=popswitch]">
        <EuiModalHeader>
          <EuiModalHeaderTitle>
            <h1>{head}</h1>
          </EuiModalHeaderTitle>
        </EuiModalHeader>
        <EuiModalBody>
          {' '}
          <EuiFieldText
            placeholder="title"
            value={title}
            onChange={(e) => updateSection('title', e.target.value)}
          />
          <EuiMarkdownEditor
            aria-label="Body markdown editor"
            value={body}
            onChange={(value) => updateSection('body', value)}
            height={400}
            parsingPluginList={parsingList}
            processingPluginList={processingList}
            uiPlugins={uiList}
          />
          <TagInput
            className="guide-section__tags"
            initialTags={tags}
            handleUpdate={(tags) => updateSection('tags', tags)}
          ></TagInput>
        </EuiModalBody>
        <EuiModalFooter>
          <EuiButtonEmpty onClick={cancelModal}>Cancel</EuiButtonEmpty>
          <EuiButton type="submit" form="guideForm" onClick={save} fill>
            Save
          </EuiButton>
        </EuiModalFooter>
      </EuiModal>
    );
  };

  const buildPosts = () => {
    return posts.map((post) => {
      const { title, body, tags, id } = post;
      return (
        <PostView
          title={title}
          body={body}
          tags={tags}
          id={id}
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
    <EuiPanel className="post-list">
      <SearchCreateBar handlePlus={handlePlus} handleSearch={handleSearch} />
      {buildPosts()}
      {showAdd && Modal('New Post', handleNewPost)}
      {showEdit && Modal('Edit Post', handleEditPost)}
      {showDelete && destroyModal}
    </EuiPanel>
  );
};
