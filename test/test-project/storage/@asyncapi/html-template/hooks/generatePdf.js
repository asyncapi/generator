const puppeteer = require('puppeteer');
const path = require('path');

module.exports = {
    'generate:after': generatePdf
};

async function generatePdf(generator) {
    const targetDir = generator.targetDir;
    const parameters = generator.templateParams;
    
    //all actions of this hook depend on parameters passed by the user, if non are provided we should just stop the hook
    if (!parameters || parameters.pdf !== 'true') return;

    const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
    const page = await browser.newPage();

    await page.goto(`file://${path.join(targetDir, 'index.html')}`, { waitUntil: 'networkidle0' });

    await page.$$eval('div.payload-examples > div.js-prop', links => links.forEach(link => link.click()));
    await page.$$eval('div.headers-examples > div.js-prop', links => links.forEach(link => link.click()));
    await page.$$eval('div.all-messages div.js-prop', links => links.forEach(link => link.click()));
    

    await page.pdf({ format: 'A4', path: `${targetDir}/index.pdf`, printBackground: true });

    browser.close();
}
