export const mockData = {
  getLocationData: (location) => {
    const baseData = {
      communities: [
        {
          id: 'local-news',
          name: 'Local News & Events',
          members: 1247,
          postsToday: 8,
          lastActivity: new Date().toISOString(),
          isNew: false
        },
        {
          id: 'food-dining',
          name: 'Food & Dining',
          members: 892,
          postsToday: 12,
          lastActivity: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          isNew: false
        },
        {
          id: 'housing',
          name: 'Housing & Rentals',
          members: 634,
          postsToday: 5,
          lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          isNew: false
        },
        {
          id: 'transportation',
          name: 'Transportation',
          members: 445,
          postsToday: 3,
          lastActivity: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          isNew: true
        },
        {
          id: 'community-help',
          name: 'Community Help',
          members: 321,
          postsToday: 7,
          lastActivity: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          isNew: false
        }
      ],
      posts: [
        {
          id: 'post1',
          type: 'text',
          title: 'New coffee shop opening on Main Street!',
          content: 'Just saw they\'re setting up a new artisan coffee shop where the old bookstore used to be. Looks like they\'ll have outdoor seating too. Anyone know when they\'re opening?',
          author: 'CoffeeEnthusiast92',
          authorId: 'user2',
          community: 'food-dining',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          upvotes: 23,
          downvotes: 1,
          comments: [
            {
              id: 'comment1',
              author: 'LocalFoodie',
              content: 'I heard they\'re planning a soft opening next week! The owner used to run a place in Brooklyn.',
              timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
              upvotes: 5,
              downvotes: 0,
              replies: []
            }
          ]
        },
        {
          id: 'post2',
          type: 'poll',
          title: 'What should we do about the parking situation downtown?',
          content: '',
          author: 'CityPlannerJoe',
          authorId: 'user3',
          community: 'transportation',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          upvotes: 45,
          downvotes: 8,
          poll: {
            options: [
              { text: 'Build more parking structures', votes: 12 },
              { text: 'Implement paid street parking', votes: 8 },
              { text: 'Improve public transportation', votes: 25 },
              { text: 'Create more bike lanes', votes: 7 }
            ],
            totalVotes: 52
          },
          comments: []
        },
        {
          id: 'post3',
          type: 'text',
          title: 'Lost cat near Central Park - please help!',
          content: 'My orange tabby cat "Muffin" has been missing since yesterday evening. He\'s very friendly but might be hiding. Last seen near the playground area. Please DM if you see him!',
          author: 'CatMomSarah',
          authorId: 'user4',
          community: 'community-help',
          timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
          upvotes: 67,
          downvotes: 2,
          comments: [
            {
              id: 'comment2',
              author: 'PetLover123',
              content: 'I\'ll keep an eye out during my morning jog! Have you posted on the neighborhood Facebook groups too?',
              timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
              upvotes: 8,
              downvotes: 0,
              replies: [
                {
                  id: 'reply1',
                  author: 'CatMomSarah',
                  content: 'Yes, posted everywhere I can think of. Thank you so much for keeping an eye out!',
                  timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
                  upvotes: 3,
                  downvotes: 0,
                  replies: []
                }
              ]
            }
          ]
        },
        {
          id: 'post4',
          type: 'text',
          title: 'Street closure on Oak Avenue this weekend',
          content: 'FYI - Oak Avenue between 3rd and 7th will be closed this Saturday and Sunday for the annual street fair. Plan your routes accordingly!',
          author: 'TrafficUpdate',
          authorId: 'user5',
          community: 'local-news',
          timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
          upvotes: 34,
          downvotes: 3,
          comments: []
        },
        {
          id: 'post5',
          type: 'text',
          title: 'Anyone interested in starting a neighborhood book club?',
          content: 'I\'ve been thinking about starting a monthly book club that meets at the library or local cafes. Would love to connect with fellow readers in the area!',
          author: 'BookwormBeth',
          authorId: 'user6',
          community: 'local-news',
          timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
          upvotes: 28,
          downvotes: 1,
          comments: []
        }
      ]
    };
    const locationVariations = {
      'Downtown NYC': {
        communities: baseData.communities.map(c => ({
          ...c,
          members: Math.floor(c.members * 1.5)
        })),
        posts: baseData.posts
      },
      'Brooklyn Heights': {
        communities: baseData.communities.map(c => ({
          ...c,
          members: Math.floor(c.members * 0.8)
        })),
        posts: baseData.posts.map(p => ({
          ...p,
          upvotes: Math.floor(p.upvotes * 0.7)
        }))
      },
      'Williamsburg': {
        communities: [...baseData.communities, {
          id: 'arts-culture',
          name: 'Arts & Culture',
          members: 567,
          postsToday: 9,
          lastActivity: new Date().toISOString(),
          isNew: true
        }],
        posts: baseData.posts
      }
    };

    return locationVariations[location] || baseData;
  }
};