const cpuQuery: string = '100 * pve_cpu_usage_ratio{job="proxmox_server"}';
const ramQuery: string = '100 * (pve_memory_usage_bytes{job="proxmox_server"} / pve_memory_size_bytes{job="proxmox_server"})';
const bootdiskQuery: string = '100 * (pve_disk_usage_bytes{job="proxmox_server"} / pve_disk_size_bytes{job="proxmox_server"})';
const statusQuery: string = 'pve_up or pve_storage_up or pve_lxc_up or pve_qemu_up';

const ip: string = '100.81.211.38';
const port: string = '9090';

interface machinesType {
  name: string;
  cpu: number;
  ram: number;
  bootdisk: number;
  status: number;
}

let machines: machinesType[] = [];
let queries: string[] = [cpuQuery, ramQuery, bootdiskQuery, statusQuery];

async function query(query: any) {
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
};

// 0 = cpu, 1 = ram, 2 = bootdisk, 3 = status

/*
switch (i) {
      case 0:
        for (let i = 0; i < result.data.result.length; i++) {
          const fetchId = result.data.result[i].metric.id;
          machines.forEach(machine => {
            if (machine.name === fetchId) {
              machine.cpu = +result.data.result[i].value[1];
            }
          });
        }
        break;
*/

async function update() {
  for (let i = 0; i < queries.length; i++) {
    const result = await query(queries[i]);
    const fetchId = result.data.result[i].metric.id;

    for (let i = 0; i < queries.length; i++) {
      
    }
}};

async function setup() {
  await populateMachines();
  await update();
  console.log(machines);
}

setup();

//  console.log(JSON.stringify(result, null, 2))

/*
per 1min
cpu usage per ct/vm in %
ram usage per ct/vm in % min/max MB
bootdisk usage per vm/ct % min/max MB
*/

const metrics: any = [];
export default (metrics);
