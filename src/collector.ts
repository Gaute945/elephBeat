import fs from 'fs';
import toml from 'toml';

const config = toml.parse(fs.readFileSync('config.toml', 'utf-8'));

interface machinesType {
  name: string;
  cpu: number;
  ram: number;
  bootdisk: number;
  status: number;
  [key: string]: number | string;
}

let machines: machinesType[] = [];

const queries = [
  '100 * pve_cpu_usage_ratio{job="proxmox_server"}', 
  '100 * (pve_memory_usage_bytes{job="proxmox_server"} / pve_memory_size_bytes{job="proxmox_server"})', 
  '100 * (pve_disk_usage_bytes{job="proxmox_server"} / pve_disk_size_bytes{job="proxmox_server"})', 
  'pve_up or pve_storage_up or pve_lxc_up or pve_qemu_up'
];

async function query(query: string) {
  try {
    const response = await fetch(`http://${config.proxmox.ip}:${config.proxmox.port}/api/v1/query?query=${encodeURIComponent(query)}`, { method: "GET", headers: { "Content-Type": "application/json" } });
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error querying Proxmox API:', error);
    return null;
  }
}

async function populateMachines() {
  const result = await query(queries[3]);
  if (result) {
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
  }
}

async function update(property: string) {
  const result = await query(property);
  if (result) {
    for (let i = 0; i < result.data.result.length; i++) {
      const fetchId = result.data.result[i].metric.id;
      machines.forEach(machine => {
        if (machine.name === fetchId) {
          switch (property) {
            case queries[0]:
              machine.cpu = +result.data.result[i].value[1];
              break;

            case queries[1]:
              machine.ram = +result.data.result[i].value[1];
              break;

            case queries[2]:
              machine.bootdisk = +result.data.result[i].value[1];
              break;

            case queries[3]:
              machine.status = +result.data.result[i].value[1];
              break;

            default:
              break;
          }
        }
      });
    }
  }
  return machines;
}

async function setup() {
  await populateMachines();
  for (let i = 0; i < queries.length; i++) {
    await update(queries[i])
  }
}

await setup();

async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

setInterval(async () => {
  for (let i = 0; i < queries.length; i++) {
    await update(queries[i]);
  }
}, config.proxmox.fetchInterval);

export default machines;
