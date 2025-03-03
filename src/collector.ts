const cpuQuery = '100 * pve_cpu_usage_ratio{job="proxmox_server"}';
const ramQuery = '100 * (pve_memory_usage_bytes{job="proxmox_server"} / pve_memory_size_bytes{job="proxmox_server"})';
const bootdiskQuery = '100 * (pve_disk_usage_bytes{job="proxmox_server"} / pve_disk_size_bytes{job="proxmox_server"})';
const statusQuery = 'pve_up or pve_storage_up or pve_lxc_up or pve_qemu_up';

const ip: string = '192.168.10.44';
const port: string = '9090';

let machines: any = [];
let queries = [cpuQuery, ramQuery, bootdiskQuery, statusQuery];

async function dataPrep(query: string) {
  return fetch(`http://${ip}:${port}/api/v1/query?query=${encodeURIComponent(query)}`, { method: "GET", headers: { "Content-Type": "application/json" } })
    .then(Response => {
      return Response.json()
    })
};

dataPrep(statusQuery).then(result => {
  for (let i = 0; i < result.data.result.length; i++) {
    console.log(result.data.result[i].metric.id)
    machines.unshift(result.data.result[i].metric.id)
  }
});

//dataPrep(statusQuery).then(result => {
//  console.log(JSON.stringify(result, null, 2))
//});

/*
per 1min
cpu usage per ct/vm in %
ram usage per ct/vm in % min/max MB
bootdisk usage per vm/ct % min/max MB
*/

const metrics: any = [];
export default (metrics);
