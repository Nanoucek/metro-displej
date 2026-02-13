export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  const stop = url.searchParams.get("stop");
  if (!stop) {
    return new Response(JSON.stringify({ error: "Missing ?stop=" }), {
      status: 400,
      headers: { "content-type": "application/json; charset=utf-8" },
    });
  }

  const golemioUrl = `https://api.golemio.cz/v2/pid/departureboards/?ids=${encodeURIComponent(stop)}`;

  const r = await fetch(golemioUrl, {
    headers: {
      "X-Access-Token": env.GOLEMIO_TOKEN,
      "Accept": "application/json",
    },
  });

  const body = await r.text();

  return new Response(body, {
    status: r.status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "access-control-allow-origin": "*",
      "cache-control": "no-store",
    },
  });
}
