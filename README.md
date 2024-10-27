# Amazon E2E Test Automation Framework

## Author
**Kartik Bhargava**

## Overview
A comprehensive end-to-end test automation framework for Amazon.in using Playwright with TypeScript. This framework implements the Page Object Model pattern and includes detailed reporting through Allure.

## Features
- Page Object Model architecture
- TypeScript implementation
- Allure reporting with screenshots and videos
- Automatic test retries for flaky tests
- Detailed error logging and tracing
- Full screen test execution
- Cross-browser support
- Comprehensive documentation

## Test Coverage
The framework currently covers the following test scenarios:
1. Amazon.in navigation
2. Product search functionality
3. Search suggestion validation
4. Product selection and verification
5. New tab handling
6. Apple Store navigation
7. Apple Watch variant selection
8. Quick Look functionality verification

## Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)
- Chrome browser
- Visual Studio Code (recommended)

## Project Structure
```
amazon-test-framework/
├── pages/
│   ├── BasePage.ts
│   ├── HomePage.ts
│   └── ProductPage.ts
├── tests/
│   └── amazonSearch.test.ts
├── playwright.config.ts
├── package.json
├── tsconfig.json
└── README.md
```

### Key Components
- **BasePage.ts**: Contains common functionality for all page objects
- **HomePage.ts**: Amazon homepage specific methods and selectors
- **ProductPage.ts**: Product page specific methods and selectors
- **amazonSearch.test.ts**: Test scenarios implementation
- **playwright.config.ts**: Framework configuration

## Installation

1. Clone the repository
```bash
git clone https://github.com/KB-QA-777/amazon-playwright-automation.git
cd amazon-test-framework
```

2. Install dependencies
```bash
npm install
```

3. Install Playwright browsers
```bash
npx playwright install
```

4. Install Allure command-line tool
```bash
npm install -g allure-commandline
```

## Running Tests

### Basic Test Execution
```bash
npm test
```

### Run with Reports
```bash
npm run test:report
```

### Debug Mode
```bash
DEBUG=pw:api npm test
```

### View Reports
```bash
# Generate and open Allure report
npm run report

# View Playwright trace
npm run show-trace

# View HTML report
npm run show-report
```

## Framework Components

### Page Objects
1. **BasePage**
   - Common functionality
   - Navigation methods
   - Wait utilities
   - Screenshot capture

2. **HomePage**
   - Search functionality
   - Category selection
   - Suggestion handling
   - Product selection

3. **ProductPage**
   - Product details
   - Quick Look functionality
   - Apple Watch selection
   - Modal handling

### Configuration Options
```typescript
// playwright.config.ts key settings
{
  viewport: null,  // Full screen mode
  trace: 'on',    // Trace enabled
  video: 'on',    // Video recording
  screenshot: 'on' // Automatic screenshots
}
```

### Test Reports
The framework generates multiple report formats:
1. **Allure Reports**
   - Test execution summary
   - Step-by-step execution details
   - Screenshots and videos
   - Environment information
   - Test categories

2. **Playwright HTML Report**
   - Execution timeline
   - Test case details
   - Error screenshots
   - Trace viewer

## Best Practices Implemented
1. **Code Organization**
   - Page Object Model
   - Type safety with TypeScript
   - Clean code principles
   - Proper error handling

2. **Test Structure**
   - Clear step definitions
   - Detailed assertions
   - Error recovery mechanisms
   - Proper cleanup

3. **Reporting**
   - Comprehensive logging
   - Screenshot capture
   - Video recording
   - Trace information

4. **Error Handling**
   - Try-catch blocks
   - Retry mechanisms
   - Error screenshots
   - Detailed error logs

## Environment Setup Recommendations
1. **IDE Setup**
   - VSCode with Playwright extension
   - TypeScript extension
   - ESLint configuration

2. **Browser Setup**
   - Chrome browser installed
   - Proper screen resolution (1920x1080 recommended)

3. **System Requirements**
   - Windows/Mac/Linux
   - 8GB RAM minimum
   - Stable internet connection

## Troubleshooting
Common issues and solutions:

1. **Test Timeouts**
   - Increase timeout in configuration
   - Check internet connection
   - Verify selector stability

2. **Selector Issues**
   - Use more specific selectors
   - Implement wait strategies
   - Check element visibility

3. **Report Generation Issues**
   - Clear previous reports
   - Check allure-commandline installation
   - Verify write permissions

## Contributing Guidelines
1. Fork the repository
2. Create a feature branch
3. Follow coding standards
4. Add proper documentation
5. Submit pull request

## Future Enhancements
- [ ] Add API testing integration
- [ ] Implement cross-browser testing
- [ ] Add data-driven testing
- [ ] Implement CI/CD integration
- [ ] Add performance metrics

## Contact
For any queries or support, please contact:
- **Author**: Kartik Bhargava
- **Email**: kbhargava.qa@gmail.com
- **GitHub**: https://github.com/KB-QA-777/amazon-playwright-automation.git

## License
This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments
- Playwright Documentation
- TypeScript Documentation
- Allure Framework
- Amazon.in for test environment

## Version History
- 1.0.0 (2024-10-27)
  - Initial release
  - Basic test implementation
  - Allure reporting integration

---
© 2024 Kartik Bhargava. All Rights Reserved.
