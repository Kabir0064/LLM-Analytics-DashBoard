# LLM Analytics Dashboard

A modern, interactive dashboard for visualizing and analyzing Large Language Model (LLM) analytics data. Built with React, featuring real-time charts, KPI summaries, and comprehensive data visualization capabilities.

![Dashboard Preview](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![React Version](https://img.shields.io/badge/React-19.1.0-blue)
![License](https://img.shields.io/badge/License-MIT-green)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Screenshots](#screenshots)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Components](#components)
- [Authentication](#authentication)
- [Data Flow](#data-flow)
- [API Integration](#api-integration)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

The LLM Analytics Dashboard is a comprehensive web application designed to provide insights into LLM performance metrics, user interactions, and analytical data. It features an intuitive interface with interactive charts, real-time data visualization, and secure authentication through AWS Cognito.

### Key Capabilities

- **Interactive Data Visualization**: Multiple chart types including trend lines, pie charts, bar charts, and correlation analysis
- **KPI Monitoring**: Real-time key performance indicators with growth rate tracking
- **Secure Authentication**: AWS Cognito integration for user management
- **Responsive Design**: Mobile-friendly interface built with Tailwind CSS
- **Real-time Updates**: Dynamic data refresh and live chart updates

## ✨ Features

### 📊 Analytics & Visualization
- **Trend Analysis**: Time-series data visualization with trend indicators
- **Distribution Breakdown**: Pie charts for categorical data analysis
- **Comparative Analysis**: Bar charts for side-by-side comparisons
- **Correlation Charts**: Statistical correlation analysis between metrics
- **KPI Summary Cards**: Key metrics with growth rate indicators

### 🔐 Security & Authentication
- **AWS Cognito Integration**: Secure user authentication and authorization
- **OIDC Protocol**: OpenID Connect implementation for enterprise security
- **Session Management**: Automatic token refresh and session handling

### 🎨 User Experience
- **Modern UI/UX**: Clean, professional interface with smooth animations
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Interactive Elements**: Hover effects, tooltips, and dynamic content
- **Dark/Light Mode Ready**: Built with theming support

### 📈 Data Management
- **Payload Viewer**: Detailed view of raw data and SQL queries
- **Metadata Panel**: Contextual information about data sources
- **Data Tables**: Sortable and filterable data presentation
- **Code Syntax Highlighting**: SQL query visualization with syntax highlighting

## 📸 Screenshots

### Dashboard Overview
![Dashboard Main View](/frontend/public/screenshots/dashboard-main.png)

### Authentication Flow
![Login Screen](/frontend/public/screenshots/login-screen.png)

### Analytics Charts
![KPI Summary](/frontend/public/screenshots/kpi-summary.png)
![Trend Analysis](/frontend/public/screenshots/trend-chart.png)
![Distribution Chart](/frontend/public/screenshots/distribution-chart.png)

### Data Visualization
![Payload Viewer](/frontend/public/screenshots/payload-viewer.png)
![Data Table](/frontend/public/screenshots/data-table.png)

---

**📁 Image Location**: Place your screenshot images in the `frontend/public/screenshots/` directory with the following naming convention:
- `dashboard-main.png` - Main dashboard view
- `login-screen.png` - Authentication screen
- `kpi-summary.png` - KPI summary cards
- `trend-chart.png` - Trend line chart
- `distribution-chart.png` - Pie chart
- `payload-viewer.png` - Payload viewer component
- `data-table.png` - Data table component

## 🛠 Technology Stack

### Frontend Framework
- **React 19.1.0**: Latest React with concurrent features
- **Vite**: Fast build tool and development server
- **React Router DOM**: Client-side routing

### UI & Styling
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Animation library for smooth transitions
- **React Icons**: Comprehensive icon library
- **Recharts**: Declarative charting library for React

### Authentication & Backend
- **AWS Cognito**: User authentication and management
- **react-oidc-context**: OpenID Connect implementation
- **oidc-client-ts**: OIDC client library

### Development Tools
- **ESLint**: Code linting and quality assurance
- **PostCSS**: CSS processing
- **Autoprefixer**: CSS vendor prefixing

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager
- AWS Cognito User Pool (for authentication)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/llm-analytics-dashboard.git
   cd llm-analytics-dashboard/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure AWS Cognito**
   
   Update the authentication configuration in `src/main.jsx`:
   ```javascript
   const cognitoAuthConfig = {
     authority: 'https://cognito-idp.us-east-1.amazonaws.com/YOUR_USER_POOL_ID',
     client_id: 'YOUR_CLIENT_ID',
     redirect_uri: 'http://localhost:5173', // Change for production
     response_type: 'code',
     scope: 'openid email phone',
   };
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:5173` to view the application.

### Environment Variables

Create a `.env` file in the frontend directory:

```env
VITE_COGNITO_USER_POOL_ID=your_user_pool_id
VITE_COGNITO_CLIENT_ID=your_client_id
VITE_API_BASE_URL=your_api_endpoint
```

## 📁 Project Structure

```
frontend/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── charts/        # Chart components
│   │   ├── data/          # Data display components
│   │   └── layout/        # Layout components
│   ├── context/           # React context providers
│   ├── data/              # Data and mock files
│   │   └── mocks/         # Sample data for development
│   ├── pages/             # Page components
│   ├── App.jsx            # Main application component
│   ├── main.jsx           # Application entry point
│   └── index.css          # Global styles
├── package.json           # Dependencies and scripts
├── vite.config.js         # Vite configuration
├── tailwind.config.js     # Tailwind CSS configuration
└── eslint.config.js       # ESLint configuration
```

## 🧩 Components

### Chart Components (`src/components/charts/`)

#### KPISummary
- Displays key performance indicators in card format
- Shows growth rates and trend indicators
- Responsive grid layout

#### TrendLineChart
- Time-series data visualization
- Interactive tooltips and zoom capabilities
- Configurable color schemes

#### DistributionPieChart
- Categorical data breakdown
- Percentage calculations
- Customizable legends

#### ComparisonBarChart
- Side-by-side data comparison
- Horizontal and vertical orientations
- Animated data transitions

#### CorrelationChart
- Statistical correlation analysis
- Scatter plot visualization
- Correlation coefficient display

### Data Components (`src/components/data/`)

#### PayloadViewer
- Raw data payload display
- SQL query visualization
- Syntax highlighting with Prism.js

#### DataTable
- Sortable and filterable data tables
- Pagination support
- Export functionality

#### MetadataPanel
- Contextual information display
- Data source information
- Timestamp and version details

### Layout Components (`src/components/layout/`)

#### AppLayout
- Main application layout wrapper
- Navigation and header management
- Responsive sidebar support

## 🔐 Authentication

The application uses AWS Cognito for secure user authentication:

### Configuration
- **User Pool**: AWS Cognito User Pool for user management
- **App Client**: OAuth 2.0 client for authentication flow
- **OIDC**: OpenID Connect protocol implementation

### Authentication Flow
1. User clicks "Sign in with Cognito"
2. Redirected to Cognito hosted UI
3. User authenticates with credentials
4. Redirected back with authorization code
5. Application exchanges code for tokens
6. User session established

### Security Features
- **Token Management**: Automatic token refresh
- **Session Persistence**: Secure session storage
- **Logout**: Complete session termination

## 📊 Data Flow

### Data Sources
- **Mock Data**: Sample payloads for development and testing
- **API Integration**: Real-time data from backend services
- **User Input**: Interactive data selection and filtering

### Data Processing
1. **Payload Selection**: User selects analysis type
2. **Data Fetching**: Retrieval from API or mock data
3. **Transformation**: Data formatting for visualization
4. **Rendering**: Chart and component updates

### State Management
- **React Hooks**: Local component state
- **Context API**: Global application state
- **Props**: Component data passing

## 🔌 API Integration

### Current Implementation
- **Mock Data**: Sample payloads for development
- **Axios**: HTTP client for API requests
- **Error Handling**: Comprehensive error management

### API Endpoints (Future Implementation)
```javascript
// Example API structure
const API_ENDPOINTS = {
  analytics: '/api/analytics',
  payloads: '/api/payloads',
  metrics: '/api/metrics',
  users: '/api/users'
};
```

### Data Format
```javascript
// Expected payload structure
{
  id: number,
  title: string,
  intent: string,
  operation: string,
  kpi: string,
  result: {
    sql: string,
    data: array,
    tableData: object,
    timeSeriesData: array,
    narrative: string
  }
}
```

## 🚀 Deployment

### Development Build
```bash
npm run build
npm run preview
```

### Production Deployment

#### Vercel
1. Connect your GitHub repository to Vercel
2. Configure environment variables
3. Deploy automatically on push

#### Netlify
1. Build command: `npm run build`
2. Publish directory: `dist`
3. Configure environment variables

#### AWS Amplify
1. Connect repository to Amplify Console
2. Configure build settings
3. Set up environment variables

### Environment Configuration
```bash
# Production environment variables
VITE_COGNITO_USER_POOL_ID=prod_user_pool_id
VITE_COGNITO_CLIENT_ID=prod_client_id
VITE_API_BASE_URL=https://api.yourdomain.com
VITE_REDIRECT_URI=https://yourdomain.com
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes**
4. **Add tests** (if applicable)
5. **Commit your changes**
   ```bash
   git commit -m "Add: your feature description"
   ```
6. **Push to the branch**
   ```bash
   git push origin feature/your-feature-name
   ```
7. **Create a Pull Request**

### Development Guidelines
- Follow the existing code style
- Add comments for complex logic
- Update documentation for new features
- Test thoroughly before submitting

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support and questions:
- Create an issue in the GitHub repository
- Contact the development team
- Check the documentation

## 🔄 Changelog

### Version 1.0.0
- Initial release
- Basic dashboard functionality
- AWS Cognito authentication
- Chart components implementation
- Responsive design

---

**Built with ❤️ using React and modern web technologies** 