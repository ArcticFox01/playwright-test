# GitHub Actions Workflows for Playwright Testing

This directory contains GitHub Actions workflows that automate the testing pipeline for your Petstore API project using Playwright.

## 📁 Available Workflows

### 1. `ci.yml` - Simple CI Pipeline
A streamlined workflow for continuous integration that runs basic tests.

**Triggers:**
- Push to `main` or `master` branch
- Pull requests to `main` or `master` branch

**What it does:**
- Sets up Node.js 20 with npm caching
- Installs dependencies with `npm ci`
- Installs Playwright browsers
- Runs Petstore API tests only
- Uploads test reports as artifacts

### 2. `petstore-ci.yml` - Petstore-Specific Pipeline
A dedicated workflow focused exclusively on Petstore API testing with advanced features.

**Triggers:**
- Push to Petstore-related files (tests, utils, data)
- Pull requests affecting Petstore components
- Scheduled runs every 6 hours
- Manual dispatch with test type selection

**What it does:**
- Tests Petstore API across multiple Node.js versions (18, 20)
- Tests Petstore API across multiple browsers (Chromium, Firefox, WebKit)
- Allows selective testing (pet, store, users, or all)
- Includes security scanning and dependency checks
- Performs API health checks and response time monitoring
- Provides detailed failure notifications
- Supports manual test execution with customizable parameters

**Manual Execution Options:**
- Test type: all, pet, store, users
- Browser selection: chromium, firefox, webkit, all

### 3. `playwright.yml` - Comprehensive Testing Pipeline
A full-featured workflow for thorough testing across multiple environments.

**Triggers:**
- Push to `main` or `master` branch
- Pull requests to `main` or `master` branch
- Scheduled daily run at 2 AM UTC

**What it does:**
- Tests Petstore API across multiple Node.js versions (18, 20)
- Tests Petstore API across multiple browsers (Chromium, Firefox, WebKit)
- Runs Petstore mobile viewport tests
- Performs code quality checks (ESLint, Prettier, TypeScript)
- Uploads detailed test reports and traces
- Optional failure notifications (Scheduled daily runs at 2 AM UTC)
- Optional failure notifications (Slack/Discord)

## 🚀 Getting Started

### Enable the Workflows

1. **Push to your repository:**
   ```bash
   git add .github/workflows/
   git commit -m "Add GitHub Actions workflows"
   git push origin main
   ```

2. **Enable GitHub Actions:**
   - Go to your repository on GitHub
   - Click on "Actions" tab
   - If prompted, click "I understand my workflows, go ahead and enable them"

3. **Monitor your first run:**
   - The workflow will automatically trigger on your push
   - Check the "Actions" tab to see the progress

## 🔧 Configuration

### Environment Variables

Add environment variables to your repository secrets:

1. Go to your repository on GitHub
2. Settings → Secrets and variables → Actions
3. Click "New repository secret"

Common secrets for Playwright:
```yaml
# Example secrets to add:
BASE_URL: "https://your-staging-app.com"
API_KEY: "your-api-key"
DATABASE_URL: "your-database-connection"
```

### Browser Configuration

Your `playwright.config.ts` is already configured for CI with:
- `forbidOnly: !!process.env.CI` - Prevents `test.only` in CI
- `retries: process.env.CI ? 2 : 0` - Retries failed tests in CI
- `workers: process.env.CI ? 1 : undefined` - Single worker in CI for stability

To enable mobile testing for Petstore tests, uncomment the mobile projects in `playwright.config.ts`:

```typescript
/* Test against mobile viewports. */
{
  name: 'Mobile Chrome',
  use: { ...devices['Pixel 5'] },
},
{
  name: 'Mobile Safari',
  use: { ...devices['iPhone 12'] },
},
```

## 📊 Test Reports

### Viewing Results

1. **Download artifacts:**
   - Go to the workflow run in GitHub Actions
   - Click on the "Artifacts" section
   - Download the reports you need

2. **Local HTML report:**
   ```bash
   npm run test:report
   ```
   This opens the HTML report in your browser.

3. **Trace files:**
   Use the Playwright Trace Viewer to debug failed tests:
   ```bash
   npx playwright show-trace test-results/trace.zip
   ```

### Artifact Retention

- Test reports are kept for 30 days
- Traces are kept for 30 days
- HTML reports are kept for 30 days

## 🛠️ Local Development Scripts

Your `package.json` now includes useful scripts:

```bash
# Run Petstore tests (default)
npm test

# Run tests with visible browser
npm run test:headed

# Debug tests
npm run test:debug

# Open Playwright UI
npm run test:ui

# View HTML report
npm run test:report

# Install browsers
npm run install:browsers

# Code quality checks
npm run lint
npm run format
npm run type-check

# Run full CI pipeline locally
npm run ci

# Additional test commands
npm run test:all          # Run all tests in the project
npm run test:petstore     # Run all Petstore tests
npm run test:pet          # Run Pet API tests only
npm run test:store        # Run Store API tests only
npm run test:users        # Run User API tests only
```

## 🎯 Petstore-Specific Testing

### Test Categories

Your Petstore tests are organized into three main categories:

1. **Pet API Tests** (`pet.api.spec.ts`)
   - CRUD operations on pets
   - Find pets by status
   - Error handling for invalid IDs

2. **Store API Tests** (`store.api.spec.ts`)
   - Order management
   - Inventory status
   - Order retrieval and validation

3. **User API Tests** (`user.api.spec.ts`)
   - User CRUD operations
   - Login/logout functionality
   - Bulk user creation

### Running Specific Test Categories

```bash
# Run only Pet API tests
npm run test:pet

# Run only Store API tests
npm run test:store

# Run only User API tests
npm run test:users

# Run all Petstore tests
npm run test:petstore
```

### Environment Variables for Petstore Tests

Configure these in GitHub Secrets or local environment:

```yaml
# API Configuration
PETSTORE_BASE_URL: "https://petstore.swagger.io/v2"  # or your staging/production URL
PETSTORE_API_KEY: "your-api-key-if-required"

# Test Configuration
CI: true  # Automatically set in GitHub Actions
```

## 🔍 Debugging Failed CI Runs

### Common Issues

1. **Browser installation failures:**
   - Check if you have enough disk space
   - Verify your `playwright.config.ts` browser configuration

2. **Timeout issues:**
   - Increase `timeout-minutes` in the workflow
   - Check if your tests need more time for specific actions

3. **Environment variable issues:**
   - Ensure all required secrets are configured in GitHub
   - Verify the exact secret names in the workflow

### Debugging Steps

1. **Check workflow logs:**
   - Click on the failed job
   - Review each step's output

2. **Download artifacts:**
   - Get the test results and traces
   - Open traces locally to identify the issue

3. **Reproduce locally:**
   ```bash
   npm ci
   npx playwright test src/tests/api/petstore/ --project=chromium
   ```

4. **Run specific failing test:**
   ```bash
   npm run test:pet          # If pet tests failed
   npm run test:store        # If store tests failed
   npm run test:users        # If user tests failed
   ```

## 📈 Advanced Features

### Parallel Execution

The comprehensive workflow uses matrix strategy to:
- Run tests on multiple Node.js versions simultaneously
- Test different browsers in parallel
- Separate mobile tests for better organization

### Caching Optimization

- Node.js dependencies are cached between runs
- Browsers are installed fresh each time for reliability
- Artifact uploads prevent data loss

### Notification Integration

Configure notifications in `playwright.yml`:

1. **Slack:**
   - Create a webhook URL in your Slack workspace
   - Add `SLACK_WEBHOOK_URL` to repository secrets

2. **Discord:**
   - Create a webhook URL in your Discord server
   - Add `DISCORD_WEBHOOK_URL` to repository secrets

## 🔄 Customization

### Adding New Jobs

You can extend the workflows by adding new jobs:

```yaml
# Example: Add performance testing for Petstore API
performance:
  name: Petstore Performance Tests
  runs-on: ubuntu-latest
  steps:
    - name: Checkout
      uses: actions/checkout@v4
    - name: Run Lighthouse CI
      run: npm run lighthouse:ci
```

### Conditional Execution

Use `if` conditions to control job execution:

```yaml
- name: Deploy on success
  if: github.ref == 'refs/heads/main' && success()
  run: npm run deploy
```

## 📚 Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Playwright CI Configuration](https://playwright.dev/docs/ci)
- [Playwright Test Reporters](https://playwright.dev/docs/test-reporters)
- [Matrix Strategy in GitHub Actions](https://docs.github.com/en/actions/using-jobs/using-a-matrix-for-your-jobs)

## 🤝 Contributing

When modifying workflows:

1. Test changes in a feature branch first
2. Use the `ci.yml` workflow for initial testing
3. Validate with `playwright.yml` before merging to main
4. Update this documentation for any structural changes

## 🆘 Troubleshooting

If you encounter issues:

1. Check the "Actions" tab in your GitHub repository
2. Review the workflow logs for error messages
3. Verify all secrets are correctly configured
4. Test locally using `npm run ci`
5. Open an issue with the workflow run URL and error details