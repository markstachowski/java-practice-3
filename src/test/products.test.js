/**
 * This is intentionally one big file, as some of our tests depend on the
 * database structure being in a certain state, and running everything in
 * parallel will break that assumption.
 */

// helper fn we can call to add a helper function to the page context
let addFindParent = () => {
  window.findParent = (el, pred = () => true) =>
    el && el.parentElement && pred(el.parentElement)
    ? el.parentElement
    : findParent(el.parentElement, pred)
  // window.findChildren = (el, pred = () => true) {
  //   Array.from(el.children).filter(pred)
  // }
}

describe('Database Interaction', () => {
  it('Successfully connected to the datbase', async () => {
    const results = await global.db.query('SELECT 1 as one')
    expect(results[0].one).toBe(1)
  })
})

describe('Existing Functionality', () => {
  describe('Home Page (/)', () => {
    let page
    beforeAll(async () => {
      page = await global.__BROWSER__.newPage()
      await page.goto('http://localhost:8080')
    }, 3000)
    afterAll(async () => await page.close())

    it('Contains the text "Welcome".', async () => {
      const text = await page.evaluate(() => document.body.textContent)
      expect(text).toContain('Welcome')
    })

    it('Contains a link to create a new product (/products/create)', async () => {
      const hrefs = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('a.btn'))
          .map(link => link.href)
      })
      expect(hrefs).toContain('http://localhost:8080/products/create')
    })
    it('Contains a link to the products index page (/products)', async() => {
      const hrefs = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('a.btn'))
          .map(link => link.href)
      })
      expect(hrefs).toContain('http://localhost:8080/products')
    })
    afterAll(async () => {
      await page.close()
    })
  })

  describe('View Products Page (/products)', () => {
    let page
    beforeAll(async () => {
      page = await global.__BROWSER__.newPage()
      await page.goto('http://localhost:8080/products')
    })
    afterAll(async () => await page.close())

    it('The page contains a table element', async () => {
      const table = await page.evaluate(() => document.querySelector('table'))
      expect(table).not.toBeNull()
    })

    it('The products from the database seeder are in the table', async () => {
      const htmlContent = await page.content()
      const seededProducts = ['Hammer', 'Drill', 'Mower', 'Screwdriver']
      seededProducts.forEach(product => {
        expect(htmlContent).toContain(product)
      })
    })

    it('Has one less item on the page after the delete button is pushed', async () => {
      const numberOfProducts = await page.evaluate(
        () => Promise.resolve(document.querySelectorAll('tr').length)
      )
      // click the first delete button
      const deleteButton = await page.$('input[value=Delete]')
      await Promise.all([deleteButton.click(), page.waitForNavigation()])

      const newNumberOfProducts = await page.evaluate(
        () => Promise.resolve(document.querySelectorAll('tr').length)
      )
      expect(newNumberOfProducts).toBe(numberOfProducts - 1)
    })
  })

  describe('Create Product Page (/products/create)', () => {
    let page
    beforeAll(async () => {
      page = await global.__BROWSER__.newPage()
      await page.goto('http://localhost:8080/products/create')
    })
    afterAll(async () => await page.close())

    it('Has a form with <input /> elements for product name and price', async () => {
      const [nameInput, priceInput] = await page.evaluate(() => {
        return Promise.resolve([
          document.querySelector('input[name=name]'),
          document.querySelector('input[name=price]'),
        ])
      })
      expect(nameInput).toBeTruthy()
      expect(priceInput).toBeTruthy()
    })
    it('When the form is filled out and submitted, the entered values are found in the database', async () => {
      await page.type('input[name=name]', 'New Product')
      await page.type('input[name=price]', '4.99')
      // don't break anything if there is a quantity input
      await page.evaluate(() => {
        const input = document.querySelector('input[name=quantity]')
        if (input) { input.value = 1 }
      })
      await Promise.all([page.click('input[type=submit]'), page.waitForNavigation()])

      const results = await global.db.query("SELECT * FROM products WHERE name = 'New Product'")
      expect(results.length).toBeGreaterThan(0)
      expect(results[0].name).toBe('New Product')
      expect(results[0].price).toBe(4.99)
    })
  })
})

describe('Quantity Feature', () => {
	let page
	beforeAll(async () => {
		page = await global.__BROWSER__.newPage()
	})
  afterAll(async () => await page.close())

  describe('Database', () => {
    it('The products table has a column named quantity', async () => {
      const sql = `
      SELECT * FROM information_schema.columns
      WHERE TABLE_SCHEMA = 'products_db'
      AND TABLE_NAME = 'products'
      AND COLUMN_NAME = 'quantity'`
      const results = await global.db.query(sql)
      expect(results.length).toBe(1)
    })
  })

  describe('Create form (/products/create)', () => {
    it('Contains an <input /> element with the name "quantity"', async () => {
      await page.goto('http://localhost:8080/products/create')
      const input = await page.$('input[name=quantity]')
      expect(input).not.toBeNull()
    })
    it('When the form is filled out and submitted, the entered values are found in the database', async () => {
      await page.type('input[name=name]', 'Another Product')
      await page.type('input[name=quantity]', '2')
      await page.type('input[name=price]', '4.99')
      await Promise.all([page.click('input[type=submit]'), page.waitForNavigation()])
      const results = await global.db.query("SELECT * FROM products WHERE name = 'Another Product'")
      expect(results.length).toBeGreaterThan(0)
      expect(results[0].quantity).toBe(2)
    })
  })

  describe('Products table (/products)', () => {

    beforeAll(async () => {
      await page.goto('http://localhost:8080/products')
      await page.evaluate(addFindParent)
    })

    it('Has a table heading (<th>) for quantity', async () => {
      const containsQuantity = await page.$$eval(
        'th',
        ths => Array.from(ths).map(th => th.innerText.toLowerCase())
          .some(th => th.includes('quantity'))
      )
      expect(containsQuantity).toBe(true)
    })

    it('Each row on the products table contains an element with a class of .btn-increment', async () => {
      const [incButtons, trs] = await Promise.all([
        page.evaluate(() => document.querySelectorAll('.btn-increment').length),
        page.evaluate(() => document.querySelectorAll('tr').length),
      ])
      expect(incButtons).toBeGreaterThanOrEqual(trs - 1) // subtract one to account for the tr in the thead
    })

    it('Each row on the products table contains an element with a class of .btn-decrement', async () => {
      const [incButtons, trs] = await Promise.all([
        page.evaluate(() => document.querySelectorAll('.btn-decrement').length),
        page.evaluate(() => document.querySelectorAll('tr').length),
      ])
      expect(incButtons).toBeGreaterThanOrEqual(trs - 1) // subtract one to account for the tr in the thead
    })
    it('Clicking the increment button updates the quantity for that product in the database', async () => {
      const productName = await page.$eval('.btn-increment', btn => {
        let tr = findParent(btn, e => e.tagName.toLowerCase() === 'tr')
			  let productName = tr.children[0].innerText.trim()
        return Promise.resolve(productName)
      })
      let oldQuantity = await global.db.query('SELECT quantity from products where name = ?', productName)
        .then(results => results[0].quantity)

      await Promise.all([page.click('.btn-increment'), page.waitForNavigation()])
      let newQuantity = await global.db.query('SELECT quantity from products where name = ?', productName)
        .then(results => results[0].quantity)
      expect(newQuantity).toBe(oldQuantity + 1)
    })
    it('Clicking the decrement button updates the quantity for that product in the database', async () => {
      await page.evaluate(addFindParent)
      const productName = await page.$eval('.btn-decrement', btn => {
        let tr = findParent(btn, e => e.tagName.toLowerCase() === 'tr')
			  let productName = tr.children[0].innerText.trim()
        return Promise.resolve(productName)
      })
      let oldQuantity = await global.db.query('SELECT quantity from products where name = ?', productName)
        .then(results => results[0].quantity)

      await Promise.all([page.click('.btn-decrement'), page.waitForNavigation()])
      let newQuantity = await global.db.query('SELECT quantity from products where name = ?', productName)
        .then(results => results[0].quantity)
      expect(newQuantity).toBe(oldQuantity - 1)
    })
  })
})
