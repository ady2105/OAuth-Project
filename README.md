# OAuth-Project



```text
authentication/
├── backend/
│   ├── controllers/
│   │   └── authController.js    # Business logic for BOTH googleLogin() & githubLogin()
│   ├── models/
│   │   ├── dbConnection.js      # Connects to MongoDB Atlas using Google DNS 
│   │   └── userModel.js         # Unified Mongoose Schema targeting collection
│   ├── routes/
│   │   └── authRouter.js        # Maps GET /auth/google and GET /auth/github
│   ├── utils/
│   │   └── googleConfig.js      # Configures Google OAuth2 client with Client ID & Secret
│   ├── .env                     # Secrets (GOOGLE_CLIENT_SECRET, GITHUB_CLIENT_SECRET, DB_URL)
│   └── index.js                 # Server entrypoint (Express, CORS, Router mounting)
│
└── frontend/
   ├── src/
   │   ├── api.js               # Centralized Axios client (googleAuth & githubAuth)
   │   ├── App.jsx              # Routes: /login, /dashboard, and /auth/github/callback
   │   ├── GoogleLogin.jsx      # UI with both Google and GitHub buttons
   │   ├── GithubCallback.jsx   # Dedicated callback handler for GitHub redirects
   │   ├── RefreshHandler.jsx   # Syncs session across browser
   │   ├── Dashboard.jsx        # Unified user dashboard (name, email, avatar)
   │   └── PageNotFound.jsx     # Fallback 404 page
   ├── index.html               # HTML template
   ├── vite.config.js           # Vite configuration with Tailwind CSS plugin
   └── .env                     # Client IDs (VITE_GOOGLE_CLIENT_ID, VITE_GITHUB_CLIENT_ID)


```


