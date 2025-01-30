const url: string = 'http://192.168.10.44:9090/api/v1/query';
const cpuQuery = '100 * pve_cpu_usage_ratio{job="proxmox_server"}';
const cpuUrl: string = `http://192.168.10.44:9090/api/v1/query?query=${encodeURIComponent(cpuQuery)}`;
export const metrics = new Map();

/*
url = http://{promethusUrl}/api/v1/query?query={query}
per 1min
cpu usage per ct/vm in %
ram usage per ct/vm in % min/max MB
swap usage per vm/ct in % min/max MB
bootdisk usage per vm/ct % min/max MB
*/

async function getMetrics() {
  const response = await fetch(cpuUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const jsonResponse = await response.json();
  const resultPath = jsonResponse.data.result;

  if (jsonResponse.status == 'success') {
    for (let i = 0; i < jsonResponse.data.result.length; i++) {
      //key = id
      //value = value
      metrics.set(resultPath[i].metric.id, resultPath[i].value[1])
    }
  }
  return metrics
};

getMetrics();
