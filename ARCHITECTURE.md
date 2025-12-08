# Nexus - Technical Architecture

## System Overview

Nexus is a modern, full-stack social media platform built with a serverless architecture using Supabase as the backend-as-a-service provider. The application follows a client-server model where the React frontend communicates directly with Supabase for all data operations.

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                          │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              React Application (SPA)                  │   │
│  │  - TypeScript for type safety                        │   │
│  │  - React Context for state management               │   │
│  │  - Tailwind CSS for styling                          │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Supabase Layer (BaaS)                     │
│  ┌────────────────┐  ┌────────────────┐  ┌──────────────┐  │
│  │ Authentication │  │   PostgreSQL   │  │   Realtime   │  │
│  │   (JWT Auth)   │  │   (Database)   │  │ (WebSockets) │  │
│  └────────────────┘  └────────────────┘  └──────────────┘  │
│  ┌────────────────┐  ┌────────────────┐                    │
│  │    Storage     │  │   Edge Funcs   │                    │
│  │ (File Upload)  │  │  (Serverless)  │                    │
│  └────────────────┘  └────────────────┘                    │
└─────────────────────────────────────────────────────────────┘
```

## Frontend Architecture

### Component Hierarchy

```
App.tsx (Root)
├── ThemeProvider (Context)
│   └── AuthProvider (Context)
│       ├── LandingPage (Unauthenticated)
│       │   ├── Login Modal
│       │   └── Signup Modal
│       └── MainApp (Authenticated)
│           ├── Sidebar (Navigation)
│           └── Views (Content)
│               ├── Feed
│               ├── Profile
│               ├── Explore
│               ├── Messages
│               ├── Notifications
│               ├── Search
│               ├── Bookmarks
│               └── Settings
```

### State Management

The application uses React Context API for global state:

**AuthContext**
- User authentication state
- Profile data
- Auth methods (signUp, signIn, signOut)
- Profile update methods

**ThemeContext**
- Theme preference (light/dark)
- Toggle method
- Persists to localStorage

### Data Flow

```
User Action → Component Event Handler → Supabase Client Call → Database Update
                                                ↓
                                         Real-time Event
                                                ↓
                                       Subscription Handler
                                                ↓
                                         State Update
                                                ↓
                                         UI Re-render
```

## Backend Architecture

### Database Schema

#### Entity Relationship Diagram

```
┌─────────────┐           ┌──────────────┐
│   profiles  │───────────│    posts     │
└─────────────┘ 1      ∞  └──────────────┘
      │                          │
      │ 1                    ∞   │
      │                          │
      ▼ ∞                        ▼ ∞
┌─────────────┐           ┌──────────────┐
│   follows   │           │   comments   │
└─────────────┘           └──────────────┘
                                 │
                             ∞   │
                                 │
                                 ▼ ∞
                          ┌──────────────┐
                          │    likes     │
                          └──────────────┘

┌─────────────┐           ┌──────────────┐
│   profiles  │───────────│conversations │
└─────────────┘ ∞      ∞  └──────────────┘
                                 │
                             1   │
                                 │
                                 ▼ ∞
                          ┌──────────────┐
                          │   messages   │
                          └──────────────┘
```

### Security Model

**Row Level Security (RLS) Policies**

Each table has specific RLS policies that enforce:

1. **Authentication Requirement**: All queries require authenticated users
2. **Ownership**: Users can only modify their own data
3. **Visibility**:
   - Public data visible to all authenticated users
   - Private data visible only to owner and approved followers
4. **Relationships**: Access based on follow relationships

Example RLS Policy Flow:
```
Query: SELECT * FROM posts WHERE user_id = 'xyz'
         ↓
RLS Check: Is requester authenticated?
         ↓
RLS Check: Is post owner's account public OR
           Is requester following post owner OR
           Is requester the post owner?
         ↓
Return Data OR Access Denied
```

### Real-time Architecture

Supabase Realtime uses PostgreSQL's replication functionality:

```
Database Change (INSERT/UPDATE/DELETE)
         ↓
PostgreSQL Replication Slot
         ↓
Supabase Realtime Server
         ↓
WebSocket Broadcast
         ↓
Client Subscriptions
         ↓
Local State Update
         ↓
UI Re-render
```

**Active Subscriptions:**
- Notifications (filtered by user_id)
- Messages (filtered by conversation_id)
- Stories (filtered by followed users)

## API Layer

### Supabase Client API

The application uses the Supabase JavaScript client for all backend operations:

**Authentication APIs**
```typescript
supabase.auth.signUp({ email, password, options })
supabase.auth.signInWithPassword({ email, password })
supabase.auth.signOut()
supabase.auth.getSession()
supabase.auth.onAuthStateChange(callback)
```

**Database APIs**
```typescript
// Read
supabase.from(table).select(columns).filters()

// Create
supabase.from(table).insert(data)

// Update
supabase.from(table).update(data).match(filters)

// Delete
supabase.from(table).delete().match(filters)

// RPC (Stored Procedures)
supabase.rpc(function_name, params)
```

**Realtime APIs**
```typescript
supabase
  .channel(channel_name)
  .on('postgres_changes', { event, schema, table, filter }, callback)
  .subscribe()
```

## Performance Optimizations

### Frontend Optimizations

1. **Code Splitting**: Routes loaded on-demand
2. **Lazy Loading**: Components loaded when needed
3. **Memoization**: React.memo for expensive components
4. **Virtual Scrolling**: For long lists (future)
5. **Image Optimization**: Responsive images, lazy loading
6. **Bundle Size**: Tree shaking, minification

### Database Optimizations

1. **Indexes**: On frequently queried columns
   - posts(user_id, created_at)
   - follows(follower_id, following_id)
   - messages(conversation_id, created_at)

2. **Cached Counters**:
   - likes_count, comments_count, shares_count on posts
   - followers_count, following_count on profiles
   - Incremented via RPC functions

3. **Query Optimization**:
   - Select only needed columns
   - Use joins instead of multiple queries
   - Limit result sets

### Caching Strategy

**Client-Side**
- Theme preference (localStorage)
- Auth session (Supabase client)
- Component state (React state)

**Future Enhancements**
- Service Worker caching
- Redis for frequently accessed data
- CDN for static assets

## Scalability Considerations

### Current Architecture Scalability

**Strengths:**
- Serverless backend scales automatically
- PostgreSQL can handle millions of rows
- Real-time WebSockets scale horizontally
- Static frontend can be CDN-distributed

**Bottlenecks:**
- Database connections (mitigated by Supabase pooling)
- Real-time connections (limited by plan)
- Large result sets (needs pagination)

### Scaling Path

**Phase 1: Current (0-10K users)**
- Single Supabase project
- Direct database queries
- Basic caching

**Phase 2: Growth (10K-100K users)**
- Redis caching layer
- Read replicas
- CDN for assets
- Advanced indexing

**Phase 3: Scale (100K-1M users)**
- Microservices for heavy operations
- Message queue for async tasks
- Database sharding
- Edge caching

**Phase 4: Enterprise (1M+ users)**
- Multi-region deployment
- Dedicated infrastructure
- Advanced monitoring
- Auto-scaling clusters

## Security Architecture

### Authentication Flow

```
User Credentials
      ↓
Supabase Auth Service
      ↓
Password Hash Verification
      ↓
JWT Token Generation
      ↓
Client Storage (httpOnly cookie)
      ↓
Automatic Refresh
```

### Authorization Model

**Levels of Access:**
1. **Public**: Unauthenticated users (landing page only)
2. **Authenticated**: Logged-in users (read access)
3. **Owner**: Data creator (write access)
4. **Follower**: Users following an account (conditional access)
5. **Admin**: Platform administrators (future)

### Data Protection

1. **In Transit**: HTTPS/TLS 1.3
2. **At Rest**: AES-256 encryption (Supabase default)
3. **Secrets**: Environment variables, never in code
4. **Input Validation**: Client and server-side
5. **XSS Prevention**: React's automatic escaping
6. **SQL Injection**: Parameterized queries only

## Monitoring & Observability

### Current Logging

- Browser console errors
- Supabase dashboard metrics
- React error boundaries (future)

### Future Monitoring

- Application Performance Monitoring (APM)
- Error tracking (Sentry)
- Analytics (PostHog, Mixpanel)
- Log aggregation (Datadog, LogRocket)
- Uptime monitoring

## Deployment Architecture

### Development Environment
```
Local Machine
├── Node.js 18+
├── npm dependencies
├── .env configuration
└── Vite dev server (port 5173)
```

### Production Environment
```
CDN (Vercel/Netlify/CloudFlare)
├── Static Assets (HTML, CSS, JS)
├── Edge Functions (routing)
└── Automatic HTTPS

Supabase Cloud
├── PostgreSQL Database
├── Authentication Service
├── Real-time Service
└── Storage Service
```

### CI/CD Pipeline (Recommended)

```
Git Push → GitHub Actions → Build → Test → Deploy → Verify
            ↓
         Run Linter
         Run Type Check
         Run Tests
         Build Production
         Deploy to Preview
         Run E2E Tests
         Deploy to Production
```

## Technology Decisions

### Why React?
- Component-based architecture
- Large ecosystem and community
- Excellent TypeScript support
- Virtual DOM for performance
- Industry standard

### Why Supabase?
- Open source PostgreSQL
- Built-in authentication
- Real-time subscriptions
- Row Level Security
- Fast development
- Generous free tier

### Why TypeScript?
- Type safety prevents bugs
- Better IDE support
- Self-documenting code
- Easier refactoring
- Industry best practice

### Why Tailwind CSS?
- Utility-first approach
- Consistent design system
- Small bundle size
- Fast development
- Dark mode support

## Future Architecture Considerations

### Planned Improvements

1. **GraphQL Layer**: For complex queries
2. **Edge Functions**: For heavy computations
3. **Redis Cache**: For frequently accessed data
4. **Search Service**: Elasticsearch for advanced search
5. **Media Processing**: Image/video optimization pipeline
6. **Analytics Pipeline**: Real-time analytics processing
7. **CDN Integration**: Global content delivery
8. **Mobile Apps**: React Native or native apps

### Potential Migrations

1. **Database**: Might need sharding at scale
2. **Storage**: Move to dedicated CDN
3. **Search**: Dedicated search cluster
4. **Real-time**: Dedicated WebSocket servers
5. **Auth**: Custom OAuth provider

## Conclusion

Nexus is built on a modern, scalable architecture that balances rapid development with production-ready features. The serverless approach with Supabase allows the platform to scale automatically while maintaining security and performance. The component-based frontend architecture ensures maintainability and developer productivity.
