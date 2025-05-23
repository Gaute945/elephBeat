/* import fs from 'fs';
import toml from 'toml';

const config = toml.parse(fs.readFileSync('config.toml', 'utf-8'));

const queries = [
];

async function query(query: string) {
  try {
    const response = await fetch(`http://${config.prometheus.ip}:${config.promethues.port}/api/v1/query?query=${encodeURIComponent(query)}`, { method: "GET", headers: { "Content-Type": "application/json" } });
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error querying prometheus API:', error);
    return null;
  }
}

setInterval(async () => {
  for (let i = 0; i < queries.length; i++) {
    await update(queries[i]);
  }
}, config.prometheus.fetchInterval);

*/
