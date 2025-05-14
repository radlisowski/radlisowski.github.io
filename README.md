# radlisowski.github.io

Welcome to my personal portfolio website! This project showcases my work, projects, and experiments in testing and 
web development, including integrations with GitHub Actions and Playwright for automated testing.

## 🌐 Live Site

Access the portfolio at: [radlisowski.github.io](https://radlisowski.github.io)

## 📁 Project Structure

The repository is organized as follows:

- `.github/workflows/`: Contains GitHub Actions workflow configurations.
- `.vscode/`: VS Code workspace settings.
- `ecommerce/`, `howFar/`, `weather/`: Subdirectories for individual projects.
- `images/`: Image assets used across the site.
- `*.html`: HTML pages for different sections of the portfolio.
- `main.js`: Main JavaScript file for interactive functionalities.
- `style.css`: Stylesheet for the website's design.

## 🚀 Features

- **Responsive Design**: Ensures optimal viewing experience across devices.
- **Project Showcases**: Highlights various projects with detailed descriptions.
- **Interactive Elements**: Enhances user engagement through dynamic content.
- **Automated Testing**: Integrates Playwright tests via GitHub Actions for continuous integration.

## 🧪 Playwright Testing with GitHub Actions

This project employs [Playwright](https://playwright.dev/) for end-to-end testing, integrated seamlessly with GitHub Actions to ensure code reliability and performance.

### 🔄 Workflow Overview

The testing workflow is defined in `.github/workflows/playwright.yml` and includes the following steps:

1. **Checkout Repository**: Retrieves the latest code from the repository.
2. **Setup Node.js**: Configures the Node.js environment.
3. **Install Dependencies**: Installs necessary packages using `npm ci`.
4. **Install Playwright Browsers**: Sets up required browsers for testing.
5. **Run Tests**: Executes Playwright tests using `npx playwright test`.
6. **Upload Test Artifacts**: Stores test reports and artifacts for review.

### 📝 Sample Workflow Configuration

```yaml
# Name of the workflow as it will appear in GitHub Actions UI
# This workflow runs Playwright E2E tests for the application
# Performs automated testing of login functionality and UI components
name: Playwright E2E Test Suite

# Defines the events that trigger this workflow
# Runs on push and pull requests to master branch
# Ensures complete test coverage for all code changes
on:
  push:
    branches:
      - master

jobs:
  # Main test job that executes Playwright tests
  # This job handles the entire testing process from setup to execution
  test:
    # Specifies the runner environment - using latest Ubuntu version
    # Ubuntu is chosen for its stability and compatibility with Node.js
    runs-on: ubuntu-latest

    steps:
      # Checks out the main repository containing the application code
      # Uses actions/checkout@v2 to clone the repository into the workflow's workspace
      - name: Checkout Portfolio Repository
        uses: actions/checkout@v2
      
      # Checks out a separate repository containing Playwright test files
      # Specifies custom repository path and location for test files
      # This allows separation of test code from application code
      - name: Checkout Playwright Tests Repository
        uses: actions/checkout@v2
        with:
          repository: radlisowski/Playwright-E2E-Automation
          path: playwright-tests
      
      # Configures Node.js environment for running tests
      # Uses Node.js version 18 for optimal compatibility with Playwright
      - name: Set up Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      # Installs all required dependencies and Playwright browsers
      # npm ci ensures clean and consistent installation
      # playwright install downloads required browser binaries
      - name: Install Dependencies and Playwright
        working-directory: ./playwright-tests/  # Ensure this points to a directory
        run: |
          npm ci
          npx playwright install --with-deps
      
      # Executes all Playwright tests in the test suite
      # Runs in the playwright-tests directory where test files are located
      - name: Run Playwright Tests
        working-directory: ./playwright-tests
        run: npx playwright test
        
        
        