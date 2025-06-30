import { useState, useMemo } from "react";
import {
  TrendingUp,
  Clock,
  Star,
  MessageCircle,
  Share2,
  Bookmark,
} from "lucide-react";
import Comments from "./Comments";
import { useNavigate } from "react-router-dom";
import "./Feed1.css";

const Feed1 = ({ posts = [], onAddComment, currentUser, onPollVote }) => {
  const [sortBy, setSortBy] = useState("hot");
  const [visiblePosts, setVisiblePosts] = useState(5);
  const [activeCommentPostId, setActiveCommentPostId] = useState(null);
  const [votedPolls, setVotedPolls] = useState({});
  const navigate = useNavigate();

  const sortedPosts = useMemo(() => {
    const clone = [...posts];
    switch (sortBy) {
      case "hot":
        return clone.sort((a, b) => {
          const aVotes = (a.upvotes || 0) - (a.downvotes || 0);
          const bVotes = (b.upvotes || 0) - (b.downvotes || 0);
          return bVotes - aVotes;
        });
      case "new":
        return clone.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
      case "top":
        return clone.sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0));
      default:
        return clone;
    }
  }, [posts, sortBy]);

  const displayedPosts = sortedPosts.slice(0, visiblePosts);

  const handlePollClick = (postId, pollId, index) => {
    if (votedPolls[postId] !== undefined) return;

    onPollVote(postId, pollId, index);
    setVotedPolls((prev) => ({ ...prev, [postId]: index }));
  };

  return (
    <div className="feed-wrapper">
      <div className="feed-sort-options">
        <button
          onClick={() => setSortBy("hot")}
          className={sortBy === "hot" ? "active" : ""}
        >
          <TrendingUp size={16} /> Hot
        </button>
        <button
          onClick={() => setSortBy("new")}
          className={sortBy === "new" ? "active" : ""}
        >
          <Clock size={16} /> New
        </button>
        <button
          onClick={() => setSortBy("top")}
          className={sortBy === "top" ? "active" : ""}
        >
          <Star size={16} /> Top
        </button>
      </div>

      <div className="posts">
        {displayedPosts.map((post) => (
          <div className="post-card" key={post._id}>
            <div className="post-header">
              <span className="group-tag">
                {post.group?.name || "Community"}
              </span>
              <span className="author">
                u/{post.author?.username || "User"}
              </span>
              <span className="timestamp">
                {new Date(post.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>

            <h3 className="post-title">{post.title}</h3>
            {post.content && <p className="post-content">{post.content}</p>}

            {post.poll &&
              Array.isArray(post.poll.options) &&
              post.poll.options.length > 0 && (
                <div className="poll-container">
                  <strong>{post.poll.question}</strong>
                  <div className="poll-options">
                    {post.poll.options.map((optionObj, index) => (
                      <button
                        key={index}
                        onClick={() =>
                          handlePollClick(post._id, post.poll._id, index)
                        }
                        disabled={votedPolls[post._id] !== undefined}
                        className={`poll-btn ${
                          votedPolls[post._id] === index ? "voted" : ""
                        }`}
                      >
                        {optionObj.text} ({optionObj.votes})
                      </button>
                    ))}
                  </div>
                </div>
              )}

            <div className="post-actions">
              <span
                className="comment-toggle"
                onClick={() =>
                  setActiveCommentPostId((prev) =>
                    prev === post._id ? null : post._id
                  )
                }
                onDoubleClick={() => navigate(`/posts/${post._id}`)}
                title="Click to toggle comments, double click to open full thread"
              >
                <MessageCircle size={16} /> {post.comments?.length || 0}{" "}
                Comments
              </span>
              <span>
                <Share2 size={16} /> Share
              </span>
              <span>
                <Bookmark size={16} />
              </span>
            </div>

            {activeCommentPostId === post._id && (
              <Comments
                comments={post.comments || []}
                postId={post._id}
                currentUser={currentUser}
                onAddComment={onAddComment}
              />
            )}
          </div>
        ))}

        {visiblePosts < sortedPosts.length && (
          <div className="load-more">
            <button onClick={() => setVisiblePosts((prev) => prev + 5)}>
              Load More Posts
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Feed1;
