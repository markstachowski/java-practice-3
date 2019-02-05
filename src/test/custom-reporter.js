const { groupBy, countBy } = require('lodash')
const chalk = require('chalk')

const checkmark = chalk.green("\u2713")
const xMark = chalk.red("\u2717")
const heavyXMark = chalk.red("\u2718")

class CodeupReporter {
  constructor(config, options) {
    this._config = config
    this._options = options
  }

  onTestStart(...args) {
    console.log('Starting Tests...')
  }

  // (meta, results, stats) ?
  onTestResult(...args) {
    const results = args[1].testResults
    if (process.env.RESULT_OUTPUT === 'chron') {
      this.showChronologically(results)
    } else {
      this.showGrouped(results)
    }
  }

  /**
   * We need to call process.exit here, otherwise if there are failures jest
   * will exit with a non-zero exit code, which causes a bunch of additional
   * output when used through `npm run` that would hurt more than it would help.
   */
  onRunComplete(...args) {
    process.exit(0)
  }

  /**
   * Display test results in the order that the tests are encountered
   */
  showChronologically(results) {
    const number = countBy(results, result => result.status)
    console.log() // whitespace
    for (let result of results) {
      const mark = result.status === 'failed' ? xMark : checkmark
      console.log(` ${mark} ${result.ancestorTitles.join(' -> ')} -> ${result.title}`)
    }
    console.log()
    console.log(`${chalk.bold(number.passed)} Passed, ${chalk.bold(number.failed)} Failed`)
  }

  /**
   * Display test results grouped by tests passed and failed
   */
  showGrouped(results) {
    const {failed, passed} = groupBy(results, 'status')
    console.log() // whitespace
    console.log(chalk.bold(`Passed: ${(passed || []).length}`))
    for (const test of passed || []) {
      console.log(` ${checkmark} ${test.ancestorTitles.join(' -> ')} -> ${test.title}`)
    }
    console.log(chalk.bold(`Failures: ${(failed || []).length}`))
    for (const test of failed || []) {
      console.log(` ${xMark} ${test.ancestorTitles.join(' -> ')} -> ${test.title}`)
    }
  }
}

module.exports = CodeupReporter
