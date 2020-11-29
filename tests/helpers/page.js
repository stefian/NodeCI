const puppeteer = require('puppeteer');
const sessionFactory = require('../factories/sessionFactory');
const userFactory = require('../factories/userFactory');

// Additional to calss Page from Puppeteer //
// for W3AI - to extend as class **recombinant Repo** //
class CustomPage {
  static async build() {
    const browser = await puppeteer.launch({
      headless: true
    });

    const page = await browser.newPage();
    const customPage = new CustomPage(page);

    return new Proxy(customPage, {
      get: function (target, property) {
        return customPage[property] || browser[property] || page[property];
      }
    });
  }

  constructor(page) {
    this.page = page;
  }

  async login() {
    const user = await userFactory(); // Create new user for the test //
    const { session, sig } = sessionFactory(user);

    await this.page.setCookie({ name: 'session', value: session, domain: 'localhost:3000' });
    await this.page.setCookie({ name: 'session.sig', value: sig, domain: 'localhost:3000' });
    // await this.page.reload({ waitUntil: 'domcontentloaded' });
    await this.page.goto('http://localhost:3000/blogs');
    await this.page.waitForSelector('a[href="/auth/logout"]'); // tests might fail here instead of expectation statement //
  }

  async getContentsOf(selector) {
    return this.page.$eval(selector, el => el.innerHTML);
  }

  get(path) {
    // Try to GET / fetch a list of records //
    return this.page.evaluate((_path) => {
      return fetch( _path, {
        method: 'GET',
        credentials: 'same-origin',
        headers: {
          'Content-Type':'application/json'
        }
      }).then(res => res.json());
    }, path);
  }

  post(path, data) {
    // Try to POST a record //
    return this.page.evaluate((_path, _data) => {
      return fetch(_path, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(_data)
      }).then(res => res.json());
    }, path, data);
  }
}

module.exports = CustomPage;