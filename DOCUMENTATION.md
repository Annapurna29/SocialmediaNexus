# Nexus - Modern Social Media Platform

## Overview

**Nexus** is a full-featured social media platform that combines the best elements of Instagram and Twitter into a unified, modern experience. Built with cutting-edge technologies and designed for scalability, Nexus offers a complete social networking solution.

**Tagline:** "Connect with the world"

## Brand Identity

### Theme Colors
- **Primary**: Blue (#3B82F6) to Cyan (#06B6D4) gradient
- **Background (Light)**: White (#FFFFFF), Gray-50 (#F9FAFB)
- **Background (Dark)**: Gray-900 (#111827), Gray-800 (#1F2937)
- **Text**: Gray-900 (light mode), White (dark mode)
- **Accent**: Blue-500 for interactive elements

### Typography
- **Font**: System fonts (Inter, San Francisco, Segoe UI)
- **Weights**: Regular (400), Semibold (600), Bold (700)

### Logo Style
Modern gradient text logo with blue-to-cyan color transition

## Core Features

### 1. User Authentication
- Email/password signup and login
- Automatic profile creation on signup
- Secure session management with JWT
- Protected routes and authenticated access

### 2. User Profiles
- Customizable profile with avatar, cover photo, bio
- Username, full name, location, website
- Follower/following counts and lists
- Post counts
- Public/private account settings
- Profile editing interface
- Verified badge support

### 3. Post Management
- Create text posts with hashtag support
- Like, comment, and share posts
- Bookmark posts for later
- View post engagement metrics
- Edit and delete own posts
- Media attachments (placeholder for future)

### 4. Social Interactions
- Follow/unfollow users
- Like posts and comments
- Comment on posts with nested replies
- Share posts
- Mention users with @ symbol
- Tag posts with # hashtags

### 5. Feed & Discovery
- **Home Feed**: Posts from followed users plus own posts
- **Explore Page**: Trending posts and hashtags
- **Search**: Find users and hashtags
- **Trending Hashtags**: View popular topics

### 6. Real-time Notifications
- Like notifications
- Comment notifications
- Follow notifications
- Mention notifications
- Real-time updates via Supabase subscriptions
- Read/unread status

### 7. Direct Messaging
- One-on-one conversations
- Real-time message delivery
- Message read status
- Conversation list
- Media sharing support (planned)

### 8. Additional Features
- **Bookmarks**: Save posts for later viewing
- **Stories**: 24-hour ephemeral content (UI ready)
- **Dark/Light Mode**: Full theme switching
- **Settings**: Account, privacy, and notification preferences
- **Responsive Design**: Mobile-first, works on all devices

## Technology Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Icons**: Lucide React
- **State Management**: React Context API
- **Real-time**: Supabase Realtime subscriptions

### Backend
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: Supabase Auth
- **Real-time**: Supabase Realtime
- **Storage**: Supabase Storage (ready for integration)
- **API**: Direct database queries via Supabase client

### Database Schema

#### Tables
1. **profiles** - User profile information
2. **posts** - User posts with content and media
3. **comments** - Post comments with nesting support
4. **likes** - Like tracking for posts and comments
5. **follows** - User follow relationships
6. **conversations** - Chat conversations
7. **messages** - Chat messages
8. **notifications** - User notifications
9. **stories** - 24-hour ephemeral content
10. **story_views** - Story view tracking
11. **bookmarks** - Saved posts
12. **hashtags** - Hashtag metadata
13. **post_hashtags** - Post-hashtag relationships

### Security Features
- Row Level Security (RLS) on all tables
- Authenticated-only access policies
- Ownership-based permissions
- Private account support
- Secure password hashing
- CSRF protection

## File Structure

```
nexus/
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   ├── Login.tsx
│   │   │   └── Signup.tsx
│   │   ├── layout/
│   │   │   └── Sidebar.tsx
│   │   ├── post/
│   │   │   ├── PostCard.tsx
│   │   │   └── CreatePost.tsx
│   │   └── views/
│   │       ├── Feed.tsx
│   │       ├── Profile.tsx
│   │       ├── Explore.tsx
│   │       ├── Messages.tsx
│   │       ├── Notifications.tsx
│   │       ├── Search.tsx
│   │       ├── Bookmarks.tsx
│   │       └── Settings.tsx
│   ├── contexts/
│   │   ├── AuthContext.tsx
│   │   └── ThemeContext.tsx
│   ├── lib/
│   │   └── supabase.ts
│   ├── utils/
│   │   └── date.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── .env
├── package.json
├── tailwind.config.js
├── vite.config.ts
└── tsconfig.json
```

## Key Components

### Authentication Flow
1. User lands on landing page
2. Chooses to sign up or log in
3. Creates account with email, password, username, full name
4. Automatically redirected to home feed
5. Session persists across page reloads

### Feed Algorithm
- Shows posts from users you follow
- Shows your own posts
- Ordered by most recent first
- Real-time updates when new posts appear

### Notification System
- Real-time via Supabase subscriptions
- Automatic notification creation on:
  - Post likes
  - Post comments
  - New followers
  - Mentions
- Notifications auto-mark as read when viewed

### Messaging System
- Find or create conversation with any user
- Real-time message delivery
- Read receipts
- Message history persistence

## API Integration Points

### Supabase Client
All data operations go through the Supabase client with these key methods:

- `supabase.from(table).select()` - Fetch data
- `supabase.from(table).insert()` - Create records
- `supabase.from(table).update()` - Update records
- `supabase.from(table).delete()` - Delete records
- `supabase.auth.signUp()` - User registration
- `supabase.auth.signInWithPassword()` - User login
- `supabase.auth.signOut()` - User logout
- `supabase.channel().subscribe()` - Real-time subscriptions

## Design Principles

### User Experience
1. **Intuitive Navigation**: Single-column feed, fixed sidebar
2. **Responsive Design**: Mobile-first approach
3. **Fast Interactions**: Optimistic UI updates
4. **Clear Feedback**: Loading states, success/error messages
5. **Accessible**: High contrast, keyboard navigation

### Visual Design
1. **Clean & Modern**: Minimal, focused interface
2. **Consistent**: Unified color scheme and spacing
3. **Premium Feel**: Subtle animations and transitions
4. **Readable**: Proper typography and contrast ratios
5. **Delightful**: Smooth interactions and micro-animations

## Future Enhancements

### Planned Features
1. **Media Upload**: Image and video post support
2. **Stories**: Full implementation with camera and filters
3. **Live Streaming**: Broadcast to followers
4. **Polls & Surveys**: Interactive post types
5. **Spaces/Communities**: Topic-based groups
6. **Creator Analytics**: Detailed engagement metrics
7. **Monetization**: Tips, subscriptions, ads
8. **Mobile Apps**: Native iOS and Android apps
9. **AI Features**:
   - Content recommendations
   - Automatic hashtag suggestions
   - Caption generation
   - Content moderation
10. **Advanced Search**: Full-text search across all content

### Technical Improvements
1. **Caching**: Redis for performance
2. **CDN**: Image and asset delivery
3. **Search**: Elasticsearch integration
4. **Analytics**: User behavior tracking
5. **Performance**: Code splitting, lazy loading
6. **PWA**: Offline support and installability
7. **Testing**: Unit, integration, and E2E tests
8. **CI/CD**: Automated deployment pipeline

## Deployment

### Prerequisites
- Node.js 18+ installed
- Supabase account and project
- Environment variables configured

### Build & Deploy
```bash
# Install dependencies
npm install

# Build for production
npm run build

# Preview production build
npm run preview
```

### Environment Variables
```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Hosting Options
- **Vercel**: Zero-config deployment
- **Netlify**: Continuous deployment
- **AWS S3 + CloudFront**: Scalable static hosting
- **Firebase Hosting**: Google Cloud integration

## Performance Metrics

### Target Performance
- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3s
- **Lighthouse Score**: > 90
- **Bundle Size**: < 500KB (gzipped)

### Optimization Techniques
- Code splitting by route
- Lazy loading of components
- Image optimization
- Tree shaking
- Minification and compression

## Security Best Practices

1. **Authentication**: Secure JWT-based sessions
2. **Authorization**: RLS policies on all tables
3. **Input Validation**: Client and server-side validation
4. **XSS Prevention**: React's built-in escaping
5. **CSRF Protection**: Token-based protection
6. **Rate Limiting**: API request throttling (planned)
7. **Data Encryption**: HTTPS everywhere

## Contributing Guidelines

### Code Style
- TypeScript for type safety
- Functional components with hooks
- Tailwind for styling
- Descriptive variable names
- Comments for complex logic

### Git Workflow
1. Create feature branch
2. Make changes with clear commits
3. Test thoroughly
4. Submit pull request
5. Code review and merge

## Support & Community

- **Documentation**: This file and inline code comments
- **Issues**: Report bugs via GitHub Issues
- **Discussions**: Feature requests and community chat
- **Updates**: Follow project roadmap

## License

MIT License - Feel free to use and modify for your projects.

---

**Built with care by the Nexus team**

Connect. Share. Engage. Welcome to Nexus.
