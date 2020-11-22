const puppeteer = require('puppeteer');

test('Adds 2 numbers', () => {
  const sum = 1 + 2;  

  expect(sum).toEqual(3);
});