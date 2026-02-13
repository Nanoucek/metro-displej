export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  const stop = url.searchParams.get("stop");
  if (!stop) {
    return new Response(
      JSON.stringify({ error: "Missing ?stop=" }),
      { status: 400, headers: { "content-type": "application/json" } }
    );
  }

  const r = await fetch(
    `https://api.golemio.cz/v2/pid/departureboards/?ids=${stop}`,
    {
      headers: {
        "X-Access-Token": env.GOLEMIO_TOKEN,
        "Accept": "application/json"
      }
    }
  );

  return new Response(await r.text(), {
    status: r.status,
    headers: {
      "content-type": "application/json",
      "access-control-allow-origin": "*"
    }
  });
}
