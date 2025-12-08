# Test Users Setup Guide

## Quick Setup

To fully test Nexus with 3 test users, follow these steps:

### Test User Accounts

**User 1: Alex Chen**
- Email: `alex@nexus.dev`
- Password: `TestPass123!`
- Username: `alex_chen`
- Full Name: `Alex Chen`
- Bio: Product designer & coffee enthusiast
- Location: San Francisco, CA

**User 2: Jordan Smith**
- Email: `jordan@nexus.dev`
- Password: `TestPass123!`
- Username: `jordan_smith`
- Full Name: `Jordan Smith`
- Bio: Software engineer | Open source contributor
- Location: Austin, TX

**User 3: Sam Lee**
- Email: `sam@nexus.dev`
- Password: `TestPass123!`
- Username: `sam_lee`
- Full Name: `Sam Lee`
- Bio: Content creator | Tech blogger
- Location: New York, NY

## Step 1: Create the First User (Alex Chen)

1. Open the Nexus app in your browser
2. Click "Sign up"
3. Fill in the form:
   - Full Name: `Alex Chen`
   - Username: `alex_chen`
   - Email: `alex@nexus.dev`
   - Password: `TestPass123!`
4. Click "Sign up"
5. You'll be logged in as Alex Chen

## Step 2: Create the Second User (Jordan Smith)

1. Click the "Logout" button in Settings
2. Click "Sign up" again
3. Fill in the form:
   - Full Name: `Jordan Smith`
   - Username: `jordan_smith`
   - Email: `jordan@nexus.dev`
   - Password: `TestPass123!`
4. Click "Sign up"
5. You'll be logged in as Jordan Smith

## Step 3: Create the Third User (Sam Lee)

1. Click the "Logout" button in Settings
2. Click "Sign up" again
3. Fill in the form:
   - Full Name: `Sam Lee`
   - Username: `sam_lee`
   - Email: `sam@nexus.dev`
   - Password: `TestPass123!`
4. Click "Sign up"
5. You'll be logged in as Sam Lee

## Step 4: Populate User Profiles

After creating all 3 accounts, log in as each user and update their profile:

### For Alex Chen:
1. Log in with `alex@nexus.dev` / `TestPass123!`
2. Go to Profile → Edit Profile
3. Update:
   - Bio: `Product designer & coffee enthusiast. Building beautiful digital experiences.`
   - Location: `San Francisco, CA`
   - Website: `https://alexchen.design`
4. Save

### For Jordan Smith:
1. Log in with `jordan@nexus.dev` / `TestPass123!`
2. Go to Profile → Edit Profile
3. Update:
   - Bio: `Software engineer | Open source contributor | Coffee & Code`
   - Location: `Austin, TX`
   - Website: `https://jordansmith.dev`
4. Save

### For Sam Lee:
1. Log in with `sam@nexus.dev` / `TestPass123!`
2. Go to Profile → Edit Profile
3. Update:
   - Bio: `Content creator | Tech blogger | Always learning something new`
   - Location: `New York, NY`
   - Website: `https://samlee.blog`
4. Save

## Step 5: Create Posts

Log in as each user and create sample posts:

### Alex Chen Posts:
Post 1:
```
Just launched the redesign of our product dashboard! So excited to share it with everyone. It took months of research and iteration, but it was worth every minute. #design #productdesign #ux
```

Post 2:
```
Coffee tip: The best espresso comes from freshly roasted beans within 2 weeks of roasting. Just discovered this local roaster in SF and I'm hooked! ☕ #coffee #coffeelover #sf
```

### Jordan Smith Posts:
Post 1:
```
Just released a new open-source library for React state management. Check it out on GitHub! Built it to solve a problem we had in production. #opensource #react #typescript
```

Post 2:
```
Hot take: Rust is the future of systems programming. Spent the last week rewriting a performance-critical service and saw 3x improvement. #rust #programming #performance
```

### Sam Lee Posts:
Post 1:
```
New blog post: The Future of Web Development in 2025. Exploring AI, edge computing, and full-stack TypeScript. What are your predictions? #webdev #technology #future
```

Post 2:
```
Today I learned that most people's productivity peaks in the morning. I've been scheduling my deep work sessions accordingly and it's been game-changing! #productivity #lifehacks
```

## Step 6: Follow Each Other

For each user, perform these follow actions:

### Alex Chen (log in as Alex):
- Search for "jordan_smith" in the Search page → Visit profile → Follow
- Search for "sam_lee" in the Search page → Visit profile → Follow

### Jordan Smith (log in as Jordan):
- Search for "alex_chen" in the Search page → Visit profile → Follow
- Search for "sam_lee" in the Search page → Visit profile → Follow

### Sam Lee (log in as Sam):
- Search for "alex_chen" in the Search page → Visit profile → Follow
- Search for "jordan_smith" in the Search page → Visit profile → Follow

## Step 7: Send Messages

Log in as each user and send messages:

### Alex → Jordan:
1. Log in as Alex Chen
2. Go to Messages
3. Start a new message with Jordan Smith
4. Send: "Hey Jordan! Did you see my latest design post?"

### Jordan → Alex:
1. Log in as Jordan Smith
2. Go to Messages (should see Alex's message)
3. Reply: "Yes! The dashboard redesign looks amazing. Great work on the UX!"

And continue with more messages...

## Step 8: Like and Engage

Log in as different users and like posts:

### Alex likes:
- Jordan's "open-source library" post
- Sam's "Web Dev 2025" post

### Jordan likes:
- Alex's "dashboard redesign" post
- Sam's "Web Dev 2025" post

### Sam likes:
- Alex's "dashboard redesign" post
- Jordan's "open-source library" post
- Jordan's "Rust" post

## Testing Features

Once you've set up all test users, you can test:

### Messaging
- Log in as Alex
- Go to Messages
- See conversations with Jordan and Sam
- Send/receive messages in real-time

### Search
- Search for "@alex_chen", "@jordan_smith", "@sam_lee"
- Search for hashtags like "#design", "#typescript", "#rust"
- Visit user profiles from search results

### Feed
- Log in as each user
- See posts from the users you follow
- Like and unlike posts
- See engagement metrics

### Notifications
- Like a post from another user
- Go to Notifications
- See real-time notifications

### Profiles
- Visit each user's profile
- See follow/following counts
- See post counts
- Edit your own profile

### Dark Mode
- Click the theme toggle in the sidebar
- Verify all components work in dark mode

## Quick Access

Once set up, you can quickly switch between accounts:

1. Click "Logout" in Settings
2. Click "Log in"
3. Use one of the test email/password combinations

## Notes

- All test data is persistent in the database
- You can delete posts by visiting your profile
- Follow relationships can be managed from profile pages
- Messages are stored and retrieved in real-time
- The app supports multiple concurrent users

## User IDs Reference

After creation, these are the default user IDs (format: UUID):
- Alex Chen: Created by Supabase Auth
- Jordan Smith: Created by Supabase Auth
- Sam Lee: Created by Supabase Auth

Check Supabase dashboard → Auth → Users to see the exact IDs.
