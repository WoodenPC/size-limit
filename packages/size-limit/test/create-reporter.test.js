let createReporter = require('../create-reporter')

function results (types, config, isJSON = false) {
  let stdout = ''
  let plugins = {
    has (type) {
      return types.includes(type)
    }
  }
  let process = {
    stdout: {
      write (str) {
        stdout += str
      }
    }
  }
  let reporter = createReporter(process, isJSON)
  reporter.results(plugins, config)
  return stdout
}

it('renders results', () => {
  expect(results(['webpack', 'time'], {
    checks: [
      {
        name: 'limitless',
        size: 10,
        config: 'a',
        loadTime: 0.01,
        runTime: 0.05
      },
      {
        name: 'size',
        size: 102400,
        sizeLimit: 102400,
        loadTime: 1,
        runTime: 2,
        passed: true
      },
      {
        name: 'time',
        size: 102400,
        gzip: false,
        timeLimit: 4,
        loadTime: 1,
        runTime: 2,
        passed: true
      }
    ]
  })).toMatchSnapshot()
})

it('renders failed results', () => {
  expect(results(['gzip'], {
    checks: [
      {
        name: 'ok',
        size: 102400,
        sizeLimit: 102400,
        passed: true
      },
      {
        name: 'small fail',
        size: 102401,
        sizeLimit: 102400,
        passed: false
      },
      {
        name: 'big fail',
        size: 102500,
        sizeLimit: 102400,
        passed: false
      }
    ],
    failed: true,
    configPath: 'package.json'
  })).toMatchSnapshot()
})

it('renders single result', () => {
  expect(results(['file'], {
    checks: [
      {
        name: 'big fail',
        size: 101,
        sizeLimit: 100,
        passed: false
      }
    ],
    failed: true,
    configPath: '.size-limit.json'
  })).toMatchSnapshot()
})

it('renders config-less result', () => {
  expect(results(['time'], {
    checks: [
      {
        name: 'big fail',
        size: 1000,
        timeLimit: 0.5,
        loadTime: 0.2,
        runTime: 0.3,
        passed: false
      }
    ],
    failed: true
  })).toMatchSnapshot()
})

it('renders JSON results', () => {
  expect(results(['file'], {
    checks: [
      {
        name: 'big fail',
        path: '/a'
      },
      {
        name: 'big fail',
        size: 1000,
        timeLimit: 10,
        loadTime: 0.2,
        runTime: 0.3,
        passed: false,
        path: '/b'
      }
    ],
    failed: true
  }, true)).toMatchSnapshot()
})