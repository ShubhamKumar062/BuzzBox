import { useParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Comments from './Comments';
import './PostDetails.css';

const PostDetail = ({ currentUser, onAddComment }) => {
  const { state } = useApp();
  const { postId } = useParams();

  const post = state.posts.find(p => p._id === postId);

  if (!post) return <div className="post-detail">Post not found.</div>;

  return (
    <div className="post-detail">
      <div className="post-container">
        <h2>{post.title}</h2>
        <p className="post-author">Posted by u/{post.author?.username || 'User'}</p>
        <p>{post.content}</p>
        <hr />
        <Comments
          comments={post.comments || []}
          postId={post._id}
          currentUser={currentUser}
          onAddComment={onAddComment}
        />
      </div>
    </div>
  );
};

export default PostDetail;
