# SuecaUI Application

This UI application is built using React and Tailwind CSS. Follow the steps below to set up and run the application locally.

### Prerequisites

    Node.js: Make sure you have Node.js installed. You can download it from nodejs.org.
    npm: This project uses npm by default.

## Install Dependencies

Using **npm**:

    npm install

## Environment Variables

Create a .env.local file in the 'sueca-ui' directory of the project and on the 'server' directory. This file is used to set up environment variables needed for the UI application. Check the .env.example files to see more in detail.

    REACT_APP_UI_SECRET: This is the token used to authenticate requests from the UI.
    UI_SECRET: This is the token used to authenticate requests from the UI so we can match the two and check if the request is valid.

## Commands

Start the Development Server

Using **npm**:

    npm start

This will run the app in development mode. Open http://localhost:3000 to view it in your browser. The page will reload if you make edits.

## Running the UI

Make sure your backend server is running and the environment variables are setup correctly.
Start the UI application as described above.
Open your browser and navigate to http://localhost:3000.
