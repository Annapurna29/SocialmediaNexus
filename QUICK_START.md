# Nexus - Quick Start Guide

## 🚀 Launch the App

```bash
npm run dev
```

Open your browser to `http://localhost:5173`

## 👥 Test User Credentials

Ready-to-use test accounts:

### User 1: Alex Chen (Designer)
- **Email**: `alex@nexus.dev`
- **Password**: `TestPass123!`
- **Username**: `alex_chen`
- **Bio**: Product designer & coffee enthusiast
- **Location**: San Francisco, CA
- **Posts**: 2 (Design & Coffee related)

### User 2: Jordan Smith (Engineer)
- **Email**: `jordan@nexus.dev`
- **Password**: `TestPass123!`
- **Username**: `jordan_smith`
- **Bio**: Software engineer | Open source contributor
- **Location**: Austin, TX
- **Posts**: 2 (React & Rust related)

### User 3: Sam Lee (Content Creator)
- **Email**: `sam@nexus.dev`
- **Password**: `TestPass123!`
- **Username**: `sam_lee`
- **Bio**: Content creator | Tech blogger
- **Location**: New York, NY
- **Posts**: 2 (Web dev & Productivity related)

## 🔑 How to Create Test Users

### Step 1: Create Accounts

1. Click **"Sign up"** on the landing page
2. Fill in the form for each user above
3. Click **"Sign up"** to create account
4. Account is created and you're logged in
5. Click **"Logout"** in Settings
6. Repeat for the other 2 users

### Step 2: Update Profiles (Optional)

For each user:
1. Log in with their credentials
2. Click on your **Profile**
3. Click **"Edit Profile"**
4. Update bio, location, and website
5. Click **"Save"**

### Step 3: Create Posts (Optional)

For each user, create these posts in their feed:

**Alex Chen**:
```
Just launched the redesign of our product dashboard! So excited to share it with everyone. It took months of research and iteration, but it was worth every minute. #design #productdesign #ux
```

```
Coffee tip: The best espresso comes from freshly roasted beans within 2 weeks of roasting. Just discovered this local roaster in SF and I'm hooked! ☕ #coffee #coffeelover #sf
```

**Jordan Smith**:
```
Just released a new open-source library for React state management. Check it out on GitHub! Built it to solve a problem we had in production. #opensource #react #typescript
```

```
Hot take: Rust is the future of systems programming. Spent the last week rewriting a performance-critical service and saw 3x improvement. #rust #programming #performance
```

**Sam Lee**:
```
New blog post: The Future of Web Development in 2025. Exploring AI, edge computing, and full-stack TypeScript. What are your predictions? #webdev #technology #future
```

```
Today I learned that most people's productivity peaks in the morning. I've been scheduling my deep work sessions accordingly and it's been game-changing! #productivity #lifehacks
```

### Step 4: Follow Each Other (Optional)

Each user should follow the other two:

1. Go to **Search**
2. Search for another username (e.g., "jordan_smith")
3. Click on their profile
4. Click **"Follow"**
5. Repeat for the third user

### Step 5: Send Messages (Optional)

1. Log in as one user
2. Go to **Messages**
3. Start a conversation with another user
4. Send a message
5. See real-time updates

## ✨ Key Features to Test

### Must-Try Features

1. **Search** - Find users and hashtags globally
   - Search for `@alex_chen`
   - Search for `#design`
   - Search for `typescript`

2. **Follow Users** - Build your network
   - Search for a user
   - Click on their profile
   - Click "Follow"

3. **Create Posts** - Share your thoughts
   - Click "Create" in sidebar
   - Type message with #hashtags
   - Click "Post"

4. **Like Posts** - Engage with content
   - Click heart icon on any post
   - See like count increase
   - Click again to unlike

5. **View Feed** - See posts from followed users
   - Go to "Home"
   - See posts in chronological order
   - See engagement metrics

6. **Send Messages** - Direct communication
   - Go to "Messages"
   - Start conversation
   - Send message in real-time

7. **Explore** - Discover trending content
   - Go to "Explore"
   - See trending hashtags
   - Click hashtag to filter posts

8. **Bookmarks** - Save posts for later
   - Click bookmark icon on post
   - Go to "Bookmarks"
   - See all saved posts

## 🌙 Dark Mode

Click the theme toggle icon in the sidebar to switch between light and dark themes.

## 🔐 Account Management

**Change Your Password**: Not yet implemented (future feature)

**Delete Account**: Not yet implemented (future feature)

**Privacy Settings**: Available in Settings (future implementation)

## 🐛 Troubleshooting

### Login Issues
- Check email and password are correct
- Make sure account was created successfully
- Clear browser cache and try again

### Search Not Working
- Ensure accounts are created first
- Search for exact usernames or partial matches
- Use `@` prefix for usernames, `#` for hashtags

### Messages Not Showing
- Ensure you follow the person you're messaging
- Refresh the page
- Check network tab in browser dev tools

### Posts Not Appearing
- Click "Create" button to create a post
- Posts appear immediately in feed
- Use hashtags for better discoverability

## 📱 Mobile Testing

Nexus is fully responsive:
- Works on phones (portrait & landscape)
- Works on tablets
- Touch-friendly interface
- Sidebar collapses on mobile

## 🎨 Design Features

- **Clean Interface**: Modern, minimal design
- **Dark Mode**: Full dark theme support
- **Real-time Updates**: Messages and notifications appear instantly
- **Responsive**: Works on all screen sizes
- **Smooth Animations**: Polished interactions

## 📊 App Statistics

After setup:
- 3 test users
- 6 sample posts
- 3 conversations
- 6+ hashtags
- Real-time messaging
- Full search functionality

## 🎯 Next Steps

1. Create the 3 test accounts
2. Explore the feed
3. Search for users and hashtags
4. Follow users
5. Create your own posts
6. Send messages
7. Toggle dark mode
8. Check out Explore page
9. Bookmark interesting posts
10. View Notifications

## 📚 More Resources

- **Full Testing Guide**: See `TESTING_GUIDE.md`
- **Setup Instructions**: See `TEST_USERS_SETUP.md`
- **Architecture**: See `ARCHITECTURE.md`
- **Documentation**: See `DOCUMENTATION.md`

## ✅ Verification Checklist

After setup, verify:
- [ ] Can sign up new account
- [ ] Can log in with credentials
- [ ] Can see profile
- [ ] Can create posts
- [ ] Can search users and hashtags
- [ ] Can follow/unfollow
- [ ] Can send messages
- [ ] Can like posts
- [ ] Can bookmark posts
- [ ] Can toggle dark mode
- [ ] Can view feed from followed users
- [ ] Can see notifications
- [ ] Can explore trending content

## 🚀 Deploy

Ready to deploy? Check the README.md for deployment options:
- Vercel
- Netlify
- AWS
- Firebase
- Railway
- Render

## 📞 Support

If you encounter issues:
1. Check the browser console for errors
2. Verify Supabase credentials in `.env`
3. Clear browser cache
4. Refresh the page
5. Check TESTING_GUIDE.md for troubleshooting

---

**You're all set!** Start exploring Nexus. 🎉

**Pro Tips:**
- Use multiple browser tabs to test multi-user scenarios
- Toggle dark mode to see all components work perfectly
- Search is case-insensitive and supports partial matches
- Try hashtags like #design, #rust, #react, #typescript
- Messages update in real-time when multiple users are online

Happy testing! 🚀
