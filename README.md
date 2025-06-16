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

[![Playwright & Cypress E2E Test Suites](https://github.com/radlisowski/radlisowski.github.io/actions/workflows/run-playwright-tests.yml/badge.svg)](https://github.com/radlisowski/radlisowski.github.io/actions/workflows/run-playwright-tests.yml)
[![run-cypress-tests.yml](https://github.com/radlisowski/radlisowski.github.io/actions/workflows/run-cypress-tests.yml/badge.svg)](https://github.com/radlisowski/radlisowski.github.io/actions/workflows/run-cypress-tests.yml)

This project employs [Playwright](https://playwright.dev/) and [Playwright](https://cypress.io/)for end-to-end testing, 
integrated seamlessly with GitHub Actions to ensure code reliability and performance.

### 🔄 Workflow Overview

The testing workflow is defined in `.github/workflows/run-playwright-tests.yml` and includes the following steps:

1. **Checkout Repository**: Retrieves the latest code from the repository.
2. **Start official Playwright container**: Spins up a Playwright docker container to execuit the tests in.
2. **Setup Node.js**: Configures the Node.js environment.
3. **Install Dependencies**: Installs necessary packages using `npm ci`.
4. **Install Playwright Browsers**: Sets up required browsers for testing.
5. **Run Tests**: Executes Playwright tests using `npx playwright test`.
6. **Upload Test Artifacts**: Stores test reports and artifacts for review.

Similarly, from Cypress the workflow is the same with a difference of not using the containerized 
image for Cypress env. Using standard Ubuntu image and installing dependencies. 
Cypress seems to play nice with it out of the box.

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
  pull_request:
    branches:
      - master

jobs:
  # Main test job that executes Playwright tests
  # This job handles the entire testing process from setup to execution
  test:
    # Use the official Playwright Docker image
    runs-on: ubuntu-latest
    container:
      image: mcr.microsoft.com/playwright:v1.52.0-jammy

    steps:
      # Checks out the main repository containing the application code
      - name: Checkout Portfolio Repository
        uses: actions/checkout@v3
      
      # Checks out a separate repository containing Playwright test files
      # Specifies custom repository path and location for test files
      # This allows separation of test code from application code
      - name: Checkout Playwright Tests Repository
        uses: actions/checkout@v3
        with:
          repository: radlisowski/Playwright-E2E-Automation
          path: playwright-tests
      
      # Installs all required dependencies for Playwright tests
      # npm ci ensures clean and consistent installation
      - name: Install Dependencies
        working-directory: ./playwright-tests
        run: npm ci
      
      - name: Set Environment for Firefox
        run: echo "HOME=/root" >> $GITHUB_ENV
      
      # Executes all Playwright tests in the test suite
      # Runs in the playwright-tests directory where test files are located

      - name: Run Playwright Tests
        working-directory: ./playwright-tests
        run: npx playwright test  