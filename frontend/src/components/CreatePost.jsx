import { useState, useEffect } from "react";
import { X, Type, BarChart3 } from "lucide-react";
import api from "../utils/axiosInstance";
import "./CreatePost.css";

const CreatePost = ({ onCreatePost, onCancel }) => {
  const [postType, setPostType] = useState("text");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("");
  const [selectedPostId, setSelectedPostId] = useState("");
  const [location, setLocation] = useState(null);
  const [groups, setGroups] = useState([]);
  const [posts, setPosts] = useState([]);
  const [pollOptions, setPollOptions] = useState(["", ""]);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const res = await api.get("/groups");
        setGroups(res.data.groups || []);
      } catch (err) {
        console.error("Failed to load groups:", err);
      }
    };

    const fetchPosts = async () => {
      try {
        const res = await api.get("/posts");
        setPosts(res.data.posts || []);
      } catch (err) {
        console.error("Failed to load posts:", err);
      }
    };

    fetchGroups();
    fetchPosts();
  }, []);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const loc = {
          type: "Point",
          coordinates: [coords.longitude, coords.latitude],
        };
        console.log("📍 [Location] Fetched:", loc);

        setLocation(loc);
      },
      () => {
        const fallbackLoc = {
          type: "Point",
          coordinates: [77.1025, 28.7041],
        };
        console.log("📍 [Location] Fallback:", fallbackLoc);

        setLocation(fallbackLoc);
      }
    );
  }, []);

  const handlePollOptionChange = (index, value) => {
    const newOptions = [...pollOptions];
    newOptions[index] = value;
    setPollOptions(newOptions);
  };

  const addPollOption = () => {
    if (pollOptions.length < 4) setPollOptions([...pollOptions, ""]);
  };

  const removePollOption = (index) => {
    if (pollOptions.length > 2) {
      setPollOptions(pollOptions.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !selectedGroup || !location) {
      alert("Title, Group, and Location are required.");
      return;
    }

    const payload = {
      title: title.trim(),
      groupId: selectedGroup,
      location,
      type: postType,
      createdAt: new Date().getTime(),
    };

    if (postType === "text") {
      payload.content = content.trim();
    }

    console.log("📤 [Submit] Payload:", payload);
    console.log(
      "🔐 [Submit] Token in localStorage:",
      localStorage.getItem("token")
    );

    try {
      const res = await api.post("/posts", payload);
      let createdPost = res.data.post;

      if (postType === "poll") {
        const validOptions = pollOptions
          .map((opt) => opt.trim())
          .filter((opt) => opt);
        if (validOptions.length < 2) {
          alert("Please provide at least 2 poll options.");
          return;
        }

        const targetPostId = selectedPostId || createdPost._id;

        await api.post("/polls", {
          question: title.trim(),
          options: validOptions,
          postId: targetPostId,
        });
        const updatedRes = await api.get(`/posts/${targetPostId}`);
        createdPost = updatedRes.data.post;
      }

      onCreatePost(createdPost);
      onCancel();
    } catch (err) {
      console.error(
        "Post or Poll creation failed:",
        err.response?.data || err.message
      );
      alert("Failed to create post/poll.");
    }
  };

  return (
    <div className="create-post-overlay">
      <div className="create-post-modal card">
        <div className="create-post-header">
          <h2>Create a {postType === "poll" ? "Poll" : "Post"}</h2>
          <button onClick={onCancel} className="close-btn">
            <X size={20} />
          </button>
        </div>

        <div className="post-type-selector">
          <button
            className={`type-btn ${postType === "text" ? "active" : ""}`}
            onClick={() => setPostType("text")}
          >
            <Type size={16} /> Post
          </button>
          <button
            className={`type-btn ${postType === "poll" ? "active" : ""}`}
            onClick={() => setPostType("poll")}
          >
            <BarChart3 size={16} /> Poll
          </button>
        </div>

        <form onSubmit={handleSubmit} className="create-post-form">
          <div className="form-group">
            <label htmlFor="group">Select Group</label>
            <select
              id="group"
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              required
            >
              <option value="">Choose a group</option>
              {groups.map((g) => (
                <option key={g._id} value={g._id}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What's your post about?"
              maxLength={300}
              required
            />
            <div className="char-count">{title.length}/300</div>
          </div>

          {postType === "text" && (
            <div className="form-group">
              <label htmlFor="content">Text (optional)</label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Tell your community more..."
                rows={6}
                maxLength={10000}
              />
              <div className="char-count">{content.length}/10000</div>
            </div>
          )}

          {postType === "poll" && (
            <>
              <div className="form-group">
                <label>Select Post to Attach Poll</label>
                <select
                  value={selectedPostId}
                  onChange={(e) => setSelectedPostId(e.target.value)}
                >
                  <option value="">Attach to newly created post</option>
                  {posts.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.title.length > 50
                        ? p.title.slice(0, 50) + "..."
                        : p.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Poll Options (Min 2)</label>
                {pollOptions.map((option, index) => (
                  <div key={index} className="poll-option">
                    <input
                      type="text"
                      value={option}
                      onChange={(e) =>
                        handlePollOptionChange(index, e.target.value)
                      }
                      required
                      placeholder={`Option ${index + 1}`}
                    />
                    {pollOptions.length > 2 && (
                      <button
                        type="button"
                        onClick={() => removePollOption(index)}
                        className="remove-option"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
                {pollOptions.length < 4 && (
                  <button
                    type="button"
                    onClick={addPollOption}
                    className="add-option"
                  >
                    + Add Option
                  </button>
                )}
              </div>
            </>
          )}

          <div className="form-actions">
            <button type="button" onClick={onCancel} className="btn-secondary">
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title || !selectedGroup}
              className="gradient-bg"
            >
              Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
