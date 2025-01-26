const url = 'http://192.168.10.43:9100/metrics';

const getRequest = async () => {
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const jsonResponse = await response.json();
  console.log('Response:', jsonResponse);
};

getRequest();

