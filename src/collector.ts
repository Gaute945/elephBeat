const url: string = 'http://192.168.10.44:9090/api/v1/query?query=process_cpu_seconds_total';

/*
url = http://{promethusUrl}/api/v1/query?query={query}

per 1min
cpu usage per ct/vm in %
ram usage per ct/vm in % min/max MB
swap usage per vm/ct in % min/max MB
bootdisk usage per vm/ct % min/max MB
*/

export let name1: string;
export let value1: number;
export let name2: string;
export let value2: number;

const getRequest = async () => {
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const jsonResponse = await response.json();
  const item1 = jsonResponse.data.result[0];
  const item2 = jsonResponse.data.result[1];

  name1 = item1.metric.__name__;
  value1 = item1.value[1];
  name2 = item2.metric.__name__;
  value2 = item2.value[1];
};

getRequest();
