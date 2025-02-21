const cpuQuery = '100 * pve_cpu_usage_ratio{job="proxmox_server"}';
const ramQuery = '100 * (pve_memory_usage_bytes{job="proxmox_server"} / pve_memory_size_bytes{job="proxmox_server"})';
const bootdiskQuery = '100 * (pve_disk_usage_bytes{job="proxmox_server"} / pve_disk_size_bytes{job="proxmox_server"})';
const statusQuery = 'pve_up or pve_storage_up or pve_lxc_up or pve_qemu_up';

const ip: string = '192.168.10.44';
const port: string = '9090';
let queries = []

async function dataPrep(query: string) {
  return fetch(`http://${ip}:${port}/api/v1/query?query=${encodeURIComponent(query)}`, { method: "GET", headers: { "Content-Type": "application/json" } })
    .then(Response => {
      return Response.json()
    })
};

queries = [cpuQuery, ramQuery, bootdiskQuery, statusQuery];
queries.forEach(query => {
  dataPrep(query).then(result => {
    console.log(JSON.stringify(result, null, 2));
  })
});

export const metrics = new Map();

/*
per 1min
cpu usage per ct/vm in %
ram usage per ct/vm in % min/max MB
bootdisk usage per vm/ct % min/max MB
*/

function add2map(data: any, identifier: string) {
  if (data.status == 'success' && data.data.result.length > 0) {
    // sperete loop for status
    for (let i = 0; i < data.data.result.length; i++) {
      if (data.data.result[i].metric.__name__ === "pve_up") {
        continue
      }
      else {
        metrics.set(
          data.data.result[i].metric.id + "|" + identifier,
          Math.round(parseFloat(data.data.result[i].value[1]))
        );
      }
    }
  }
}

const fetchOptions = { method: "GET", headers: { "Content-Type": "application/json" } };
async function getMetrics() {
  metrics.clear()

  return metrics
};

getMetrics();
