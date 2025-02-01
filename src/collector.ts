const cpuQuery = '100 * pve_cpu_usage_ratio{job="proxmox_server"}';
const cpuUrl: string = `http://192.168.10.44:9090/api/v1/query?query=${encodeURIComponent(cpuQuery)}`;

// RAM usage per CT/VM in %
const ramPercentQuery = '100 * (pve_memory_usage_bytes{job="proxmox_server"} / pve_memory_size_bytes{job="proxmox_server"})';
const ramUrl: string = `http://192.168.10.44:9090/api/v1/query?query=${encodeURIComponent(ramPercentQuery)}`;

// Bootdisk usage per CT/VM in %
const bootdiskPercentQuery = '100 * (pve_disk_usage_bytes{job="proxmox_server"} / pve_disk_size_bytes{job="proxmox_server"})';
const bootdiskUrl: string = `http://192.168.10.44:9090/api/v1/query?query=${encodeURIComponent(bootdiskPercentQuery)}`;

// Status check for running/online VMs/CTs
const statusQuery = 'pve_up or pve_storage_up or pve_lxc_up or pve_qemu_up';
const statusUrl = `http://192.168.10.44:9090/api/v1/query?query=${encodeURIComponent(statusQuery)}`;

export const metrics = new Map();

/*
per 1min
cpu usage per ct/vm in %
ram usage per ct/vm in % min/max MB
bootdisk usage per vm/ct % min/max MB
*/

function add2map(data: any, identifier: string) {
  if (data.status == 'success' && data.data.result.length > 0) {
    for (let i = 0; i < data.data.result.length; i++) {
      metrics.set(data.data.result[i].metric.id + "|" + identifier, Math.round(parseFloat(data.data.result[i].value[1])))
    }
  }
  else {
    console.log("Either failed status or empty data for", data);
    if (!Array.isArray(data.data.result)) {
      console.log("data.data.result is not an array:", data.data.result);
    } else if (data.data.result.length === 0) {
      console.log("data.data.result is empty:", data.data.result);
    }
  }
}

async function getMetrics() {
  const [cpuResponse, ramResponse, bootdiskResponse, statusResponse] = await Promise.all([
    fetch(cpuUrl, { method: 'GET', headers: { 'Content-Type': 'application/json' } }),
    fetch(ramUrl, { method: 'GET', headers: { 'Content-Type': 'application/json' } }),
    fetch(bootdiskUrl, { method: 'GET', headers: { 'Content-Type': 'application/json' } }),
    fetch(statusUrl, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
  ]);

  const cpuData = await cpuResponse.json();
  const ramData = await ramResponse.json();
  const bootdiskData = await bootdiskResponse.json();
  const statusData = await statusResponse.json();

  add2map(cpuData, "cpu");
  add2map(ramData, "ram");
  add2map(bootdiskData, "bootdisk");
  add2map(statusData, "status");

  console.log(metrics);
  return metrics
};

getMetrics();
