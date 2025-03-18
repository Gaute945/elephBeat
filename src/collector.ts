const cpuQuery = '100 * pve_cpu_usage_ratio{job="proxmox_server"}';
const ramQuery = '100 * (pve_memory_usage_bytes{job="proxmox_server"} / pve_memory_size_bytes{job="proxmox_server"})';
const bootdiskQuery = '100 * (pve_disk_usage_bytes{job="proxmox_server"} / pve_disk_size_bytes{job="proxmox_server"})';
const statusQuery = 'pve_up or pve_storage_up or pve_lxc_up or pve_qemu_up';

const ip: string = '192.168.10.44';
const port: string = '9090';

interface machinesType {
  name: string;
  cpu: number;
  bootdisk: number;
  status: number;
}

let machines: machinesType[] = [];
let queries = [cpuQuery, ramQuery, bootdiskQuery, statusQuery];

async function query(query: string) {
  const response = await fetch(`http://${ip}:${port}/api/v1/query?query=${encodeURIComponent(query)}`, { method: "GET", headers: { "Content-Type": "application/json" } })
  return response.json();
};

async function populateMachines() {
  const result = await query(statusQuery);
  for (let i = 0; i < result.data.result.length; i++) {
    const name: string = result.data.result[i].metric.id;
    const machine = {
      name,
      cpu: 0,
      ram: 0,
      bootdisk: 0,
      status: 0
    };
    machines.push(machine);
  }
  // console.log(machines);
};

async function update() {
  const result = await query(cpuQuery);
  //console.log(JSON.stringify(result));
  for (let i = 0; i < result.data.result.length; i++) {
    const fetchId = result.data.result[i].metric.id;
    machines.forEach(machine => {
      if (machine.name === fetchId) {
        machine.cpu = +result.data.result[i].value[1];
      }
    });
  }
}

async function main() {
  await populateMachines();
  await update();
  console.log(machines);
}

main();

//  console.log(JSON.stringify(result, null, 2))

/*
per 1min
cpu usage per ct/vm in %
ram usage per ct/vm in % min/max MB
bootdisk usage per vm/ct % min/max MB
*/

const metrics: any = [];
export default (metrics);
