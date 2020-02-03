/*
Make HTTP/HTTPS/graphql requests without any additional libraries in nodejs
*/

const https = require('https');
const http = require('http');
const url = require('url');

const GRAPHQL_ENDPOINT = 'http://localhost:500/graphql'
const GRAPHQL_API_KEY = 'optional_api_key'

const HttpRequest = (fullurl, options, body) =>
  new Promise((resolve, reject) => {
    const urlObject = url.parse(fullurl);
    const allOptions = Object.assign(options, {
      hostname: urlObject.hostname,
      path: urlObject.path,
      port: urlObject.port,
    });

    const request = fullurl.toUpperCase().indexOf('HTTPS') === 0 ? https.request : http.request;

    const req = request(allOptions, res => {
      let result = '';
      res.setEncoding('utf8');
      res.on('data', chunk => (result += chunk));
      res.on('end', () => {
        resolve(result);
      });
    });

    req.on('error', err => reject(err));
    req.write(body);
    req.end();
  });

const GraphqlRequest = async (query, variables) => {
  const headers = { 'Content-Type': 'application/json', 'x-api-key': GRAPHQL_API_KEY };
  const options = { method: 'POST', headers };
  const body = JSON.stringify({ query, variables });

  const result = await HttpRequest(GRAPHQL_ENDPOINT, options, body).catch(err => {
    console.log('\nERROR GraphqlRequest:', err);
  });

  return result;
};
