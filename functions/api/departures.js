export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);

  // stanice (název) – default Pražského povstání
  const name = url.searchParams.get("name") || "Pražského povstání";
  const limit = url.searchParams.get("limit") || "30";

  if (!env.GOLEMIO_TOKEN) {
    return json(
      { ok: false, error: "Chybí GOLEMIO_TOKEN v Cloudflare (Environment variables)." },
      500
    );
  }

  const apiUrl =
    "https://api.golemio.cz/v2/pid/departureboards" +
    `?names=${encodeURIComponent(name)}` +
    `&limit=${encodeURIComponent(limit)}` +
    `&preferredTimezone=Europe/Prague`;

  const res = await fetch(apiUrl, {
    headers: {
      "X-Access-Token": env.GOLEMIO_TOKEN,
      "Accept": "application/json",
    },
  });

  const text = await res.text();
  if (!res.ok) {
    return json(
      { ok: false, status: res.status, apiUrl, body: text.slice(0, 2000) },
      500
    );
  }

  // vrací JSON z Golemio
  return new Response(text, {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "no-store",
    },
  });
}

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj, null, 2), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}
