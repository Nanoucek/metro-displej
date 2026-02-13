export async function onRequest(context) {

  const token = context.env.GOLEMIO_TOKEN;

  // Pražského povstání — metro C
  const STOP_ID = "U699Z1P"; 

  const url =
    `https://api.golemio.cz/v2/pid/departureboards` +
    `?ids=${STOP_ID}` +
    `&limit=10` +
    `&minutesAfter=60`;

  const response = await fetch(url, {
    headers: {
      "X-Access-Token": token
    }
  });

  const data = await response.json();

  return new Response(JSON.stringify(data), {
    headers: {
      "content-type": "application/json"
    }
  });
}
