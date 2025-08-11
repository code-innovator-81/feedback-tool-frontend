# Product Feedback Tool - React Frontend

A modern, responsive React.js frontend for the Laravel Product Feedback Tool. This application provides a user-friendly interface for submitting, viewing, and commenting on product feedback.

## Features

### Authentication
- **User Registration & Login**: Secure authentication using Laravel Sanctum
- **Persistent Sessions**: Automatic token management and session persistence
- **Route Protection**: Protected routes for authenticated users only

### Feedback Management
- **Submit Feedback**: Rich form with validation for creating new feedback
- **View Feedback List**: Paginated list with filtering and search capabilities
- **Detailed Feedback View**: Individual feedback pages with full details
- **Category System**: Organized feedback by categories (Bug Report, Feature Request, Improvement, General)

### Comments System
- **Rich Text Comments**: Support for **bold**, *italic*, `code`, and @mentions
- **Real-time Preview**: Live preview of formatted comments before posting
- **Edit & Delete**: Users can modify their own comments
- **Interactive Formatting**: Toolbar for easy text formatting

### User Experience
- **Responsive Design**: Mobile-first design that works on all devices
- **Loading States**: Smooth loading indicators throughout the app
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Toast Notifications**: Real-time feedback for user actions
- **Intuitive Navigation**: Clear breadcrumbs and navigation structure

## Technology Stack

- **React 18.2.0**: Modern React with hooks and functional components
- **React Router 6**: Client-side routing and navigation
- **Axios**: HTTP client for API communication
- **Tailwind CSS**: Utility-first CSS framework for styling
- **React Toastify**: Toast notifications for user feedback

## Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Laravel backend API running on http://localhost:8000

### Step 1: Clone and Setup
```bash
# Clone the repository
git clone <repository-url>
cd feedback-tool-frontend

# Install dependencies
npm install
```

### Step 2: Environment Configuration
```bash
# Copy environment file
cp .env.example .env

# Configure environment variables
REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_APP_NAME=Product Feedback Tool
```

### Step 3: Install Tailwind CSS Typography Plugin
```bash
npm install @tailwindcss/typography
```

### Step 4: Start Development Server
```bash
npm start
```

The application will be available at `http://localhost:3000`

## 🏗️ Project Structure

```
src/
├── components/           # Reusable components
│   ├── Comments/        # Comment-related components
│   │   ├── CommentSection.js
│   │   ├── CommentForm.js
│   │   └── Comment.js
│   ├── Layout/          # Layout components
│   │   └── Navbar.js
│   └── UI/              # UI components
│       ├── LoadingSpinner.js
│       └── Pagination.js
├── contexts/            # React contexts
│   └── AuthContext.js   # Authentication context
├── pages/               # Page components
│   ├── LoginPage.js
│   ├── RegisterPage.js
│   ├── FeedbackListPage.js
│   ├── CreateFeedbackPage.js
│   └── FeedbackDetailPage.js
├── utils/               # Utility functions
│   └── apiClient.js     # Axios configuration
├── App.js               # Main app component
├── index.js             # Entry point
├── index.css            # Global styles
└── App.css              # Component styles
```

## Configuration

### API Client Configuration
The app uses a centralized API client (`utils/apiClient.js`) with:
- Automatic token management
- Request/response interceptors
- Error handling
- Base URL configuration

### Authentication Flow
1. User credentials are sent to Laravel API
2. API returns JWT token and user data
3. Token is stored in localStorage
4. Token is automatically included in subsequent requests
5. Invalid tokens trigger automatic logout

## Responsive Design

The application is built mobile-first and includes:
- Responsive navigation with mobile menu
- Optimized forms for touch devices
- Flexible grid layouts
- Touch-friendly interactive elements

## Key Features Implementation

### Comment Formatting
- **Bold**: `**text**` → **text**
- **Italic**: `*text*` → *text*
- **Code**: `` `code` `` → `code`
- **Mentions**: `@username` → @username (highlighted)

### Real-time Validation
- Client-side validation for all forms
- Real-time error feedback
- Character count indicators
- Prevention of duplicate submissions

### Advanced Search & Filtering
- Search by title and description
- Filter by category
- Pagination with page size options
- Persistent filter state

## State Management

The app uses React Context for:
- **Authentication State**: User data, login status, token management
- **Loading States**: Global and component-level loading indicators
- **Error Handling**: Centralized error message management

## Styling Guidelines

### Design System
- **Primary Color**: Indigo (indigo-600, indigo-700, etc.)
- **Neutral Colors**: Gray scale for backgrounds and text
- **Semantic Colors**: Red for errors, green for success, blue for info

### Component Patterns
- Consistent padding and margin using Tailwind spacing scale
- Hover and focus states for all interactive elements
- Loading states with spinners and disabled states
- Consistent form styling across all components

## Environment Variables

```bash
REACT_APP_API_URL=http://localhost:8000/api    # Laravel API base URL
REACT_APP_APP_NAME=Product Feedback Tool       # Application name
```

## Available Scripts

```bash
npm start          # Start development server
npm run build      # Build for production
npm test           # Run tests
npm run eject      # Eject from Create React App
```

## Security Features

- **XSS Protection**: All user input is properly sanitized
- **CSRF Protection**: Integrated with Laravel Sanctum
- **Route Protection**: Authentication required for sensitive routes
- **Token Expiry Handling**: Automatic logout on token expiration

## Error Handling

The application includes comprehensive error handling:
- Network errors with retry mechanisms
- Form validation errors
- API error responses
- Fallback UI for component errors

## Performance Optimizations

- **Code Splitting**: Lazy loading of components
- **Memoization**: React.memo for expensive components
- **Debounced Search**: Prevents excessive API calls
- **Optimized Images**: Proper image sizing and formats

## Contributing

1. Follow React best practices and hooks patterns
2. Use functional components with hooks
3. Implement proper error boundaries
4. Write meaningful component and prop names
5. Include loading states for async operations
6. Maintain consistent styling with Tailwind

## API Integration

The frontend integrates with the Laravel backend through these endpoints:

### Authentication
- `POST /api/register` - User registration
- `POST /api/login` - User login  
- `POST /api/logout` - User logout
- `GET /api/user` - Get current user

### Feedback
- `GET /api/feedback` - List feedback (with pagination/filters)
- `POST /api/feedback` - Create new feedback
- `GET /api/feedback/{id}` - Get specific feedback

### Comments
- `GET /api/feedback/{id}/comments` - Get feedback comments
- `POST /api/feedback/{id}/comments` - Add new comment
- `PUT /api/comments/{id}` - Update comment
- `DELETE /api/comments/{id}` - Delete comment

## Tips for Development

1. **Hot Reloading**: Changes are automatically reflected in the browser
2. **React DevTools**: Install the browser extension for debugging
3. **API Testing**: Use tools like Postman to test API endpoints
4. **Mobile Testing**: Use browser dev tools to test responsive design
5. **Performance**: Use React Profiler to identify performance bottlenecks

## Troubleshooting

### Common Issues

**CORS Errors**: Ensure Laravel backend has proper CORS configuration
```bash
# In Laravel backend
php artisan config:clear
php artisan cache:clear
```

**Authentication Issues**: Check that Laravel Sanctum is properly configured
```bash
# Verify API routes
php artisan route:list --path=api
```

**Build Errors**: Clear npm cache and reinstall dependencies
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

---

This frontend provides a complete, production-ready interface for the Product Feedback Tool with modern React practices and a focus on user experience.