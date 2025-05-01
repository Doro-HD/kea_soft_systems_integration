import fs from 'fs';

/*
const response = await fetch('https://www.proshop.dk/Baerbar');
const result = await response.text();
fs.writeFileSync('index.html', result);
*/

import { load } from 'cheerio';

const page = fs.readFileSync('index.html', 'utf-8');
const $ = load(page);

const products = $('#products [product]').each((_index, element) => {
    const name = $(element).find('.site-product-link').text();
    const price = $(element).find('.site-currency-lg').text();

    console.log(name.trim(), price)
});