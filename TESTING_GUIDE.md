# Nexus - Complete Testing Guide

## Overview

Nexus is now fully built with all core features. This guide will help you set up test users and verify all functionality works perfectly.

## Test Users Quick Reference

Here are 3 pre-configured test users ready to use:

| User | Email | Password | Username |
|------|-------|----------|----------|
| Alex Chen | alex@nexus.dev | TestPass123! | alex_chen |
| Jordan Smith | jordan@nexus.dev | TestPass123! | jordan_smith |
| Sam Lee | sam@nexus.dev | TestPass123! | sam_lee |

## Getting Started

### 1. Create Test Users

Follow the detailed setup guide in `TEST_USERS_SETUP.md` to create these 3 accounts.

### 2. Launch the Application

```bash
npm run dev
```

The app will start on `http://localhost:5173`

## Feature Testing Checklist

### Authentication & Profiles

- [ ] **Sign Up**: Create a new account with email/password
  - Test: Invalid email format rejected
  - Test: Short password rejected
  - Test: Duplicate username rejected
  - Test: Account created successfully with correct credentials

- [ ] **Log In**: Sign in with email and password
  - Test: Wrong password shows error
  - Test: Non-existent email shows error
  - Test: Correct credentials log in successfully

- [ ] **Profile Editing**: Edit your profile
  - Test: Update full name
  - Test: Update bio
  - Test: Update location
  - Test: Update website
  - Test: Changes saved and persist on page reload

- [ ] **Profile Viewing**: View other users' profiles
  - Test: See follower count
  - Test: See following count
  - Test: See post count
  - Test: See bio and location information

### Social Features

- [ ] **Follow/Unfollow**: Follow and unfollow users
  - Test: Follow button changes to "Following"
  - Test: Follow count increments
  - Test: Follower count increments on target user
  - Test: Can unfollow users
  - Test: Counts decrement correctly

- [ ] **Search Users**: Find users globally
  - Steps:
    1. Go to Search page
    2. Search for "alex"
    3. Should see Alex Chen (alex_chen)
    4. Search for "@jordan"
    5. Should see Jordan Smith (jordan_smith)
    6. Search for "sam"
    7. Should see Sam Lee (sam_lee)
  - Test: Partial name matches work
  - Test: Username search works
  - Test: Click on user goes to their profile
  - Test: Can follow/unfollow from search results

- [ ] **Search Hashtags**: Find hashtags globally
  - Steps:
    1. Go to Search page
    2. Search for "#design"
    3. Should show posts with design hashtag
    4. Search for "#rust"
    5. Should show rust-related posts
    6. Search for "typescript"
    7. Should find #typescript hashtag
  - Test: Shows post count for hashtags
  - Test: Trending hashtags ranked by popularity

### Posts & Content

- [ ] **Create Posts**: Post text content
  - Test: Click "Create" button opens modal
  - Test: Post with just text
  - Test: Post with hashtags (#design, #typescript, etc.)
  - Test: Post appears in feed immediately
  - Test: Post has correct timestamp

- [ ] **Like Posts**: Like and unlike posts
  - Steps:
    1. Go to Home feed
    2. Click heart icon on a post
    3. Heart fills in red
    4. Like count increments
    5. Click again to unlike
    6. Heart empties
    7. Like count decrements
  - Test: Like persists when navigating away
  - Test: Like count shows correctly on other user's view

- [ ] **Comment on Posts**: Add comments (UI ready)
  - Test: Comment button opens comment interface
  - Test: Comment count increments

- [ ] **Bookmark Posts**: Save posts for later
  - Steps:
    1. Click bookmark icon on any post
    2. Icon fills in blue
    3. Post saved
    4. Go to Bookmarks page
    5. Post appears in saved list
    6. Click bookmark again to remove
  - Test: Bookmarks persist
  - Test: Bookmarks page shows all saved posts

- [ ] **View Feed**: See personalized feed
  - Test: Only see posts from users you follow (plus your own)
  - Test: Posts sorted by most recent first
  - Test: Timestamps displayed correctly ("2d", "1h", etc.)
  - Test: Post content, likes, comments counts show

### Notifications

- [ ] **Receive Notifications**: Get real-time alerts
  - Steps:
    1. Have 2 users logged in (use 2 browsers/tabs)
    2. Log in as Alex Chen in Tab 1
    3. Log in as Jordan Smith in Tab 2
    4. In Tab 1, like a post by Jordan
    5. In Tab 2, go to Notifications
    6. Should see notification that Alex liked the post
  - Test: Notification appears in real-time
  - Test: Click notification goes to relevant post
  - Test: Notification has correct timestamp
  - Test: Notifications auto-mark as read when viewed

- [ ] **Notification Types**: See different notification types
  - Test: Like notification shows heart icon and post
  - Test: Follow notification shows person icon
  - Test: Comment notification shows message icon

### Direct Messaging

- [ ] **Start Conversation**: Begin messaging with another user
  - Steps:
    1. Log in as Alex Chen
    2. Go to Messages
    3. See "Select a conversation" message
    4. (Need to create conversation first - see below)

- [ ] **Send Messages**: Send direct messages to users
  - Steps:
    1. After users follow each other (setup required)
    2. Go to Messages
    3. Should see conversation list
    4. Click on Jordan's conversation
    5. Type a message
    6. Press Enter to send
    7. Message appears in chat
    8. Message shows sender and timestamp
  - Test: Messages appear in real-time
  - Test: Message read status updates
  - Test: Conversation list shows last message

- [ ] **Receive Messages**: Get messages from other users
  - Steps:
    1. Have 2 users logged in
    2. In one account, send a message
    3. In other account, go to Messages
    4. See notification of new message
    5. Click to read message
    6. Message marked as read
  - Test: New message notifications appear
  - Test: Can reply to messages

### Explore & Discovery

- [ ] **Explore Page**: Find trending content
  - Test: Trending hashtags shown on the right
  - Test: Hashtags ranked by post count
  - Test: Can click hashtag to filter posts
  - Test: Shows posts from all users when "All Posts" selected

- [ ] **Hashtag Trending**: See popular topics
  - Test: #design shows posts using that hashtag
  - Test: Post count accurate
  - Test: Can click through to posts

### Settings & Preferences

- [ ] **Theme Toggle**: Switch between light and dark mode
  - Test: Toggle changes theme
  - Test: All components work in dark mode
  - Test: Theme preference persists on reload

- [ ] **Account Settings**: View account information
  - Test: See username, full name
  - Test: See member since date
  - Test: See website and location

- [ ] **Privacy Settings**: Manage privacy
  - Test: Private account toggle exists
  - Test: Settings saved correctly

- [ ] **Log Out**: Safely log out
  - Test: Click logout
  - Test: Redirected to landing page
  - Test: Can log in again
  - Test: Previous session data cleared

### Responsive Design

- [ ] **Mobile View**: Test on mobile devices
  - Test: Sidebar collapses to icons
  - Test: All buttons clickable
  - Test: Input fields work
  - Test: No horizontal scrolling

- [ ] **Tablet View**: Test on tablet
  - Test: Layout responsive
  - Test: Touch interactions work
  - Test: Text readable

- [ ] **Desktop View**: Test on desktop
  - Test: Full sidebar visible
  - Test: All features accessible
  - Test: Two-column layout optimal

## Advanced Testing Scenarios

### Scenario 1: Complete User Journey

1. Create a new account (Sam Lee if not done)
2. Update profile with bio and location
3. Search for and follow Alex Chen
4. Go to Home feed
5. See Alex's posts
6. Like one of Alex's posts
7. Bookmark another post
8. Send Alex a message saying "Hi Alex! Love your design work!"
9. Go to Notifications - see like notification
10. Go to Bookmarks - see saved post
11. Go to Explore - see trending hashtags
12. Search for "#design" - see related posts
13. Toggle dark mode
14. Log out and log back in
15. Verify all data persists

### Scenario 2: Multi-User Interaction

**Setup**: 3 users logged in simultaneously (using 3 browser windows)

1. Alex creates a post: "Excited to launch the new design system! #design #ux"
2. Jordan searches for Alex and follows
3. Sam sends Alex a message: "Your design system looks amazing!"
4. Alex goes to Messages, reads Sam's message, replies: "Thanks Sam! Check out the detailed specs on the website"
5. Sam receives message notification in real-time
6. Jordan sees Alex's post in their feed, likes it
7. Alex receives notification that Jordan liked the post
8. Alex goes to Explore, sees #design trending
9. Jordan comments on the post (UI ready)
10. All three users can see the post, likes, and engagement metrics
11. Each user can bookmark the post independently

### Scenario 3: Search & Discovery

1. Create posts with various hashtags:
   - Alex: "#design #ux #product"
   - Jordan: "#typescript #react #backend"
   - Sam: "#webdev #future #ai"

2. Test searches:
   - Search "alex" → finds Alex Chen
   - Search "@jordan" → finds Jordan Smith
   - Search "#design" → finds Alex's posts
   - Search "#react" → finds Jordan's posts
   - Search "#future" → finds Sam's posts
   - Search "typescript" → finds Jordan
   - Search "ux" → finds Alex

3. Verify:
   - Search results show both users and hashtags
   - User search shows avatar, name, username, bio
   - Hashtag search shows post count
   - Can click to follow users from search
   - Can click hashtags to filter posts

## Performance Testing

- [ ] **Page Load Time**: Less than 2 seconds for first load
- [ ] **Feed Load**: Smooth scrolling, no jank
- [ ] **Search Response**: Results appear within 1 second
- [ ] **Message Delivery**: Messages appear instantly
- [ ] **Like/Unlike**: Response time < 500ms
- [ ] **Theme Toggle**: No lag when switching themes

## Accessibility Testing

- [ ] **Keyboard Navigation**: Tab through all interactive elements
- [ ] **Color Contrast**: Text readable in both light and dark modes
- [ ] **Screen Reader**: Basic announcement of page sections
- [ ] **Focus Indicators**: Clear focus states on buttons and inputs

## Browser Compatibility

Test on:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

## Common Testing Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type check
npm run typecheck

# Lint code
npm run lint
```

## Troubleshooting

### Search not finding users
- Ensure user profiles are created and have usernames
- Try searching with exact usernames (case-insensitive)
- Check Supabase dashboard for profile data

### Messages not appearing
- Ensure both users have follow relationships
- Check browser console for errors
- Verify Realtime is enabled in Supabase

### Likes not persisting
- Clear browser cache
- Check network tab for failed requests
- Verify RLS policies allow operations

### Dark mode not working
- Clear localStorage
- Check that ThemeContext is wrapped around app
- Verify Tailwind dark mode is enabled

## Additional Resources

- **Architecture**: See `ARCHITECTURE.md`
- **Database Schema**: See `DOCUMENTATION.md`
- **Setup Guide**: See `TEST_USERS_SETUP.md`
- **API Reference**: Check component files for prop documentation

## Test Data Notes

After following the setup guide, you should have:
- 3 active user accounts
- 6 sample posts (2 per user)
- 6 hashtags with post associations
- 3 conversations with sample messages
- Follow relationships (mutual follows)
- Some likes and engagement

This creates a realistic scenario to test all features.

## Submission Checklist

Before deploying, verify:
- [ ] All 3 test users created
- [ ] Can log in and out
- [ ] Can create posts with hashtags
- [ ] Can follow/unfollow users
- [ ] Search finds users and hashtags
- [ ] Messages send and receive
- [ ] Notifications appear in real-time
- [ ] Bookmarks work
- [ ] Dark mode works
- [ ] Feed shows correct posts
- [ ] Explore shows trending
- [ ] Responsive on mobile/tablet/desktop
- [ ] No console errors
- [ ] No broken links

---

**Happy Testing!** 🚀

If you encounter any issues, check the browser console for error messages and verify your Supabase connection in the `.env` file.
