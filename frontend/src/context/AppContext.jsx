import { createContext, useContext, useReducer, useEffect } from 'react';
import api from '../utils/axiosInstance';

const AppContext = createContext();

const initialState = {
  currentLocation: 'Bangalore',
  selectedCommunity: 'all',
  posts: [],
  communities: [],
  notifications: 3,
  loading: false,
  userVotes: {},
  bookmarkedPosts: [],
};

const appReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };

    case 'SET_LOCATION':
      return {
        ...state,
        currentLocation: action.payload,
        selectedCommunity: 'all',
      };

    case 'SET_COMMUNITY':
      return { ...state, selectedCommunity: action.payload };

    case 'SET_POSTS':
      return { ...state, posts: action.payload };

    case 'SET_COMMUNITIES':
      return { ...state, communities: action.payload };

    case 'ADD_POST':
      return { ...state, posts: [action.payload, ...state.posts] };

    case 'DELETE_POST':
      return {
        ...state,
        posts: state.posts.filter((post) => post.id !== action.payload),
      };

    case 'UPDATE_POST':
      return {
        ...state,
        posts: state.posts.map((post) =>
          post.id === action.payload.id
            ? { ...post, ...action.payload.updates }
            : post
        ),
      };

    case 'ADD_COMMENT': {
      const { postId, comment } = action.payload;
      return {
        ...state,
        posts: state.posts.map(post =>
          post._id === postId
            ? { ...post, comments: [...(post.comments || []), comment] }
            : post
        )
      };
    }

    case 'DELETE_COMMENT':
      return {
        ...state,
        posts: state.posts.map((post) =>
          post.id === action.payload.postId
            ? {
                ...post,
                comments: (post.comments || []).filter(
                  (comment) => comment.id !== action.payload.commentId
                ),
              }
            : post
        ),
      };

    case 'VOTE_POST':
      const { postId, voteType } = action.payload;
      const currentVote = state.userVotes[postId];
      let newVote = voteType;

      if (currentVote === voteType) {
        newVote = null;
      }

      return {
        ...state,
        userVotes: { ...state.userVotes, [postId]: newVote },
        posts: state.posts.map((post) => {
          if (post.id === postId) {
            let upvoteChange = 0;
            let downvoteChange = 0;

            if (currentVote === 'up') upvoteChange -= 1;
            if (currentVote === 'down') downvoteChange -= 1;

            if (newVote === 'up') upvoteChange += 1;
            if (newVote === 'down') downvoteChange += 1;

            return {
              ...post,
              upvotes: post.upvotes + upvoteChange,
              downvotes: post.downvotes + downvoteChange,
            };
          }
          return post;
        }),
      };

    case 'TOGGLE_BOOKMARK':
      const bookmarked = state.bookmarkedPosts.includes(action.payload);
      return {
        ...state,
        bookmarkedPosts: bookmarked
          ? state.bookmarkedPosts.filter((id) => id !== action.payload)
          : [...state.bookmarkedPosts, action.payload],
      };

    case 'VOTE_POLL':
      return {
        ...state,
        posts: state.posts.map((post) => {
          if (post._id === action.payload.postId && post.poll) {
            const updatedOptions = post.poll.options.map((option, index) =>
              index === action.payload.optionIndex
                ? { ...option, votes: option.votes + 1 }
                : option
            );
            return {
              ...post,
              poll: {
                ...post.poll,
                options: updatedOptions,
                totalVotes: post.poll.totalVotes + 1,
              },
            };
          }
          return post;
        }),
      };

    default:
      return state;
  }
};



export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'SET_LOADING', payload: true });

      try {
        const [groupRes, postRes] = await Promise.all([
          api.get('/groups'),
          api.get('/posts'),
        ]);

        const posts = postRes.data.posts;

        const enrichedPosts = await Promise.all(
          posts.map(async (post) => {
            if (post.type === 'poll') {
              try {
                const pollRes = await api.get(`/polls/post/${post._id}`);
                return {
                  ...post,
                  poll: {
                    ...pollRes.data.poll,
                    totalVotes: pollRes.data.poll.options.reduce((sum, opt) => sum + opt.votes, 0),
                  },
                };
              } catch (err) {
                console.error(`Failed to fetch poll for post ${post._id}:`, err.message);
                return post;
              }
            }
            return post;
          })
        );

        dispatch({ type: 'SET_COMMUNITIES', payload: groupRes.data.groups });
        dispatch({ type: 'SET_POSTS', payload: enrichedPosts });
      } catch (err) {
        console.error('AppContext API fetch error:', err.message);
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    fetchData();
  }, [state.currentLocation]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};


export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
