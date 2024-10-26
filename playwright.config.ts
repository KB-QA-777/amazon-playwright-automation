import { PlaywrightTestConfig, devices } from '@playwright/test';

const config: PlaywrightTestConfig = {
  testDir: './tests',
  timeout: 90000,
  expect: {
    timeout: 15000
  },
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['line'],
    ['allure-playwright', {
      detail: true,
      outputFolder: 'allure-results',
      suiteTitle: false,
      categories: [
        {
          name: 'Failed tests',
          messageRegex: '.*',
          matchedStatuses: ['failed']
        },
        {
          name: 'Product defects',
          matchedStatuses: ['broken']
        },
        {
          name: 'Test defects',
          matchedStatuses: ['invalid']
        }
      ],
      environmentInfo: {
        'Test Environment': 'QA',
        'Browser': 'Chrome',
        'Platform': process.platform,
        'Node Version': process.version
      }
    }],
    ['html', { 
      outputFolder: 'playwright-report',
      open: 'never'
    }]
  ],
  use: {
    baseURL: 'https://www.amazon.in',
    trace: 'on',  // Enable tracing for all tests
    screenshot: 'on',  // Take screenshots for all tests
    video: 'on',  // Record video for all tests
    actionTimeout: 30000,
    navigationTimeout: 30000,
    viewport: null,
    launchOptions: {
      args: [
        '--start-maximized',
        '--window-size=1920,1080'
      ]
    },
    bypassCSP: true,
    ignoreHTTPSErrors: true,
    contextOptions: {
      reducedMotion: 'reduce',
      strictSelectors: false
    }
  },
  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        channel: 'chrome',
        launchOptions: {
          args: [
            '--start-maximized',
            '--disable-gpu',
            '--disable-dev-shm-usage',
            '--no-sandbox',
            '--window-size=1920,1080'
          ]
        }
      },
    }
  ],
};

export default config;