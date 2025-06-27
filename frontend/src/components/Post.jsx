import { useState } from 'react';
import { ChevronUp, ChevronDown, MessageCircle, Share2, MoreHorizontal, Clock, Bookmark } from 'lucide-react';
import Comments from './Comments';
import './Post.css';

const Post = ({ post, onVote, onAddComment, onPollVote, currentUser, userVotes, bookmarkedPosts, onToggleBookmark }) => {
  const [showComments, setShowComments] = useState(false);
  const [hasVotedPoll, setHasVotedPoll] = useState(false);

  const userVote = userVotes[post.id];
  const isBookmarked = bookmarkedPosts.includes(post.id);

  const handleVote = (voteType) => {
    onVote(post.id, voteType);
  };

  const handlePollVote = (optionIndex) => {
    if (!hasVotedPoll) {
      onPollVote(post.id, optionIndex);
      setHasVotedPoll(true);
    }
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

  const score = post.upvotes - post.downvotes;

  return (
    <article className="post card fade-in">
      <div className="post-content">
        <div className="voting-section">
          <button 
            className={`vote-btn ${userVote === 'up' ? 'active upvote' : ''}`}
            onClick={() => handleVote('up')}
          >
            <ChevronUp size={20} />
          </button>
          <span className="vote-score">{score}</span>
          <button 
            className={`vote-btn ${userVote === 'down' ? 'active downvote' : ''}`}
            onClick={() => handleVote('down')}
          >
            <ChevronDown size={20} />
          </button>
        </div>

        <div className="post-main">
          <div className="post-header">
            <div className="post-meta">
              <span className="community-tag">{post.community}</span>
              <span className="separator">•</span>
              <span className="author">u/{post.author}</span>
              <span className="separator">•</span>
              <span className="timestamp">
                <Clock size={12} />
                {formatTime(post.timestamp)}
              </span>
            </div>
            <div className="post-header-actions">
              <button 
                className={`action-btn ${isBookmarked ? 'bookmarked' : ''}`}
                onClick={() => onToggleBookmark(post.id)}
              >
                <Bookmark size={16} />
              </button>
              <button className="more-btn">
                <MoreHorizontal size={16} />
              </button>
            </div>
          </div>

          <h2 className="post-title">{post.title}</h2>
          
          {post.content && (
            <div className="post-body">
              <p>{post.content}</p>
            </div>
          )}

          {post.type === 'poll' && post.poll && (
            <div className="poll-container">
              <h4>Poll</h4>
              {post.poll.options.map((option, index) => (
                <button
                  key={index}
                  className={`poll-option ${hasVotedPoll ? 'disabled' : ''}`}
                  onClick={() => handlePollVote(index)}
                  disabled={hasVotedPoll}
                >
                  <div className="poll-option-content">
                    <span>{option.text}</span>
                    <span className="poll-votes">{option.votes} votes</span>
                  </div>
                  <div 
                    className="poll-bar"
                    style={{ 
                      width: post.poll.totalVotes > 0 
                        ? `${(option.votes / post.poll.totalVotes) * 100}%`
                        : '0%'
                    }}
                  />
                </button>
              ))}
              <div className="poll-info">
                Total votes: {post.poll.totalVotes}
              </div>
            </div>
          )}

          <div className="post-actions">
            <button 
              className="action-btn"
              onClick={() => setShowComments(!showComments)}
            >
              <MessageCircle size={16} />
              {post.comments?.length || 0} Comments
            </button>
            <button className="action-btn">
              <Share2 size={16} />
              Share
            </button>
          </div>
        </div>
      </div>

      {showComments && (
        <Comments 
          comments={post.comments || []} 
          postId={post.id}
          currentUser={currentUser}
          onAddComment={onAddComment}
        />
      )}
    </article>
  );
};

export default Post;