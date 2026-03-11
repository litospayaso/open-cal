import fs from 'fs';

const languages = ['fr', 'de', 'it', 'es', 'en'];
const maxTimeout = 8000;

let page = 28;
let maxPages = 80;

Array.prototype.forEachAsync = async function(fn) {
  for (let t of this) { await fn(t) }
}


const makeRequest = async (page, lan) => {
  return new Promise(async (resolve) => {
    setTimeout(() => {
      resolve(null);
    }, 15000);
    const url = `https://${lan === 'en' ? 'world' : lan}.openfoodfacts.org/cgi/search.pl?action=process&sort_by=unique_scans_n&page_size=100&json=true&fields=code,product_name${lan === 'en' ? '' : '_'.concat(lan)},brands&page=${page}`;
    const response = await fetch(url);
    //checking if response is valid json
    if (response.ok) {
      const data = await response.json();
      resolve(data);
    } else {
      page--;
      resolve(null);
    }
  });
}

const appendProducts = async (products, lan) => {
  //create file if doesn't exists:
  if (!fs.existsSync(`assets/data/popular_${lan}.json`)) {
    fs.writeFileSync(`assets/data/popular_${lan}.json`, ``);
  }
  const data = JSON.stringify(products);
  fs.appendFileSync(`assets/data/popular_${lan}.json`, data);

  // replacing ][ with ,
  const file = await fs.readFileSync(`assets/data/popular_${lan}.json`, `utf8`);
  const data2 = file.replace(/]\[/g, `,`);
  fs.writeFileSync(`assets/data/popular_${lan}.json`, data2);
}

const requestLanguage = async (language) => {
  return new Promise(async (resolve) => {
    for (;page <= maxPages;page++) {
      console.log(`${language} - Page ${page}`);
      process.stdout.write(`Waiting ${maxTimeout / 1000} seconds.`);
      const interval = setInterval(() => process.stdout.write(`.`), 1000);
      await new Promise(resolve => setTimeout(resolve, maxTimeout));
      interval.close();
      process.stdout.write(`\n`);
      process.stdout.write(`making request page ${page}`);
      const pageInterval = setInterval(() => process.stdout.write(`.`), 1000);
      const data = await makeRequest(page, language);
      pageInterval.close();
      process.stdout.write(`\n`);
      if (data && data.products) {
        appendProducts(data.products.filter((product) => product[`product_name${language === 'en' ? '' : '_'.concat(language)}`]).map((product) => `${product.code} :: ${product[`product_name${language === 'en' ? '' : '_'.concat(language)}`]} - ${product.brands}`), language);
      } else {
        console.log(`Page ${page} failed`);
        console.log(`Retrying...`);
        page--;
      }
    }
    resolve()
  });
}

const main = async () => {
  languages.forEachAsync(async (lan) => {
    await requestLanguage(lan);
    page = 0;
  });
}

main();