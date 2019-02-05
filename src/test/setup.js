const fs = require('fs')
const puppeteer = require('puppeteer')
const { execSync } = require('child_process')

function logAndExecute(command, opts = {}) {
  console.log(`Running command > "${command}"`)
  execSync(command, opts)
}

module.exports = async function() {
  // Datbase setup
  console.log('\nRunning migration and seeder...')
  const migrationFile = process.env.JAVA_PROJECT_DIR + '/src/main/sql/migration.sql'
  const seederFile = process.env.JAVA_PROJECT_DIR + '/src/main/sql/seeder.sql'
  if (! fs.existsSync(migrationFile)) {
    console.error('\n+~~~~~~~~~+')
    console.error('| Error ! |')
    console.error('+~~~~~~~~~+\n')
    console.error(`migration.sql (${migrationFile}) not found!`)
    console.error('Are you in the right directory?')
    process.exit(0)
  }
  if (! fs.existsSync(seederFile)) {
    console.error('\n+~~~~~~~~~+')
    console.error('| Error ! |')
    console.error('+~~~~~~~~~+\n')
    console.error(`seeder.sql (${seederFile}) not found!`)
    console.error('Are you in the right directory?')
    process.exit(0)
  }

	try {
    let user = process.env.DB_USER
    let pass = process.env.DB_PASSWORD
    logAndExecute(`mysql -u ${user} -p${pass} < ${migrationFile}`, {stdio: [0, 'pipe', '/dev/null']})
    logAndExecute(`mysql -u ${user} -p${pass} < ${seederFile}`, {stdio: [0, 'pipe', '/dev/null']})
	} catch (e) {
    console.error('\n+~~~~~~~~~+')
    console.error('| Error ! |')
    console.error('+~~~~~~~~~+\n')
    console.error('Running the above command failed.')
    console.error('Is your mysql server running?')
    process.exit(0)
  }

  // const browser = await puppeteer.launch({headless: false})
  const browser = await puppeteer.launch()

  // store the browser instance so we can teardown it later
  global.__BROWSER__ = browser

  // file the wsEndpoint for TestEnvironments
  fs.writeFileSync('.puppeteer-ws-endpoint', browser.wsEndpoint())
}
