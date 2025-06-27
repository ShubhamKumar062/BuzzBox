import { useState } from 'react';
import { Send, ChevronUp, ChevronDown, Reply } from 'lucide-react';
import './Comments.css';

const Comments = ({ comments, postId, currentUser, onAddComment }) => {
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [replyText, setReplyText] = useState('');

  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    onAddComment(postId, newComment.trim());
    setNewComment('');
  };

  const handleSubmitReply = (e, commentId) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    
    onAddComment(postId, `@${comments.find(c => c.id === commentId)?.author} ${replyText.trim()}`);
    setReplyText('');
    setReplyTo(null);
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const Comment = ({ comment, depth = 0 }) => (
    <div className={`comment ${depth > 0 ? 'reply' : ''}`} style={{ marginLeft: `${depth * 20}px` }}>
      <div className="comment-content">
        <div className="comment-voting">
          <button className="comment-vote-btn">
            <ChevronUp size={14} />
          </button>
          <span className="comment-score">{comment.upvotes - comment.downvotes}</span>
          <button className="comment-vote-btn">
            <ChevronDown size={14} />
          </button>
        </div>
        
        <div className="comment-main">
          <div className="comment-header">
            <span className="comment-author">u/{comment.author}</span>
            <span className="comment-time">{formatTime(comment.timestamp)}</span>
          </div>
          
          <div className="comment-body">
            <p>{comment.content}</p>
          </div>
          
          <div className="comment-actions">
            <button 
              className="comment-action-btn"
              onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
            >
              <Reply size={12} />
              Reply
            </button>
          </div>
          
          {replyTo === comment.id && (
            <form onSubmit={(e) => handleSubmitReply(e, comment.id)} className="reply-form">
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write a reply..."
                className="reply-input"
                rows={3}
              />
              <div className="reply-actions">
                <button type="button" onClick={() => setReplyTo(null)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={!replyText.trim()}>
                  Reply
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
      
      {comment.replies && comment.replies.map(reply => (
        <Comment key={reply.id} comment={reply} depth={depth + 1} />
      ))}
    </div>
  );

  return (
    <div className="comments-section">
      <div className="comments-header">
        <h4>Comments ({comments.length})</h4>
      </div>
      
      <form onSubmit={handleSubmitComment} className="comment-form">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="What are your thoughts?"
          className="comment-input"
          rows={3}
        />
        <div className="comment-form-actions">
          <button type="submit" disabled={!newComment.trim()}>
            <Send size={16} />
            Comment
          </button>
        </div>
      </form>
      
      <div className="comments-list">
        {comments.map(comment => (
          <Comment key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  );
};

export default Comments;