# ResearchFlow

This project is a web application for managing research workflows, built with React and Fluent UI.

## Getting Started

To get a local copy up and running, follow these simple steps:

### Prerequisites

* Node.js and npm (or Yarn)
  ```sh
  npm install npm@latest -g
  ```

### Installation

1. Clone the repo:
   ```sh
   git clone https://github.com/jvinson5183/ResearchFlow.git
   ```
2. Navigate to the project directory:
   ```sh
   cd ResearchFlow/researchflow
   ```
3. Install NPM packages:
   ```sh
   npm install
   ```

### Running the Application

To start the development server:

```sh
npm start
```

This runs the app in development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.
You may also see any lint errors in the console.

### Building for Production

To build the app for production:

```sh
npm run build
```

This bundles React in production mode and optimizes the build for the best performance.
The build is minified and the filenames include the hashes.
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Core Technologies & Libraries

*   **React:** JavaScript library for building user interfaces.
*   **TypeScript:** Superset of JavaScript that adds static typing.
*   **Fluent UI React Components:** Microsoft's UI library for web applications.
*   **Radix UI Colors:** Used for the base color palette, adapted into the Fluent UI theme.
*   **Griffel:** CSS-in-JS styling solution used by Fluent UI.
*   **Create React App (CRA):** Standard way to create single-page React applications.

## Key Patterns & Conventions

*(This section will be updated as the project progresses)*

*   **Theming:** Custom theme based on Radix Colors, integrated with Fluent UI's `FluentProvider`.
*   **Component-Based Architecture:** Following React's component model.
*   **CSS-in-JS:** Primarily through Griffel, as leveraged by Fluent UI.
*   **Global Styles:** Basic CSS resets and global defaults applied via `src/styles/global.css`.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

# Contributing

This project welcomes contributions and suggestions. Most contributions require you to agree to a
Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us
the rights to use your contribution. For details, visit https://cla.microsoft.com.

When you submit a pull request, a CLA-bot will automatically determine whether you need to provide
a CLA and decorate the PR appropriately (e.g., label, comment). Simply follow the instructions
provided by the bot. You will only need to do this once across all repos using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.
