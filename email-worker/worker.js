/* ============================================================
   AURA STEPS — order-confirmation email Worker (Cloudflare)
   ------------------------------------------------------------
   Receives an order from the storefront and sends a branded
   confirmation email from support@aurastepsusa.com via Resend.

   Cloudflare env vars (Settings → Variables):
     RESEND_API_KEY   (required, secret)  e.g. re_xxxxxxxx
     MERCHANT_EMAIL   (optional)          also send yourself a copy
   ============================================================ */

const ALLOWED_ORIGIN = "https://aurastepsusa.com";
const FROM = "Aura Steps <support@aurastepsusa.com>";
const LOGO = "https://aurastepsusa.com/images/logo.png";

export default {
  async fetch(request, env) {
    const cors = {
      "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };
    if (request.method === "OPTIONS") return new Response(null, { headers: cors });
    if (request.method !== "POST") return json({ error: "method not allowed" }, 405, cors);

    // Only accept calls that originate from the store
    const origin = request.headers.get("Origin") || "";
    if (origin && origin !== ALLOWED_ORIGIN) return json({ error: "forbidden" }, 403, cors);

    let o;
    try { o = await request.json(); } catch { return json({ error: "bad json" }, 400, cors); }

    const email = String(o.email || "").trim();
    if (!email.includes("@")) return json({ error: "invalid email" }, 400, cors);
    if (!env.RESEND_API_KEY) return json({ error: "email not configured" }, 500, cors);

    const html = renderHtml(o);
    const text = renderText(o);
    const subject = `Your Aura Steps order ${o.ref || ""} is confirmed`;

    const send = (to) =>
      fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: "Bearer " + env.RESEND_API_KEY, "Content-Type": "application/json" },
        body: JSON.stringify({ from: FROM, to: [to], reply_to: "support@aurastepsusa.com", subject, html, text }),
      });

    const res = await send(email);
    if (!res.ok) return json({ error: "send failed", detail: await res.text() }, 502, cors);
    if (env.MERCHANT_EMAIL) { try { await send(env.MERCHANT_EMAIL); } catch (e) {} }

    return json({ ok: true }, 200, cors);
  },
};

function json(obj, status, cors) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json", ...cors },
  });
}

function esc(s) {
  return String(s == null ? "" : s).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function renderRows(items) {
  return (items || [])
    .map(
      (i) => `
      <tr>
        <td style="padding:14px 0;border-bottom:1px solid #ece3d4;">
          <div style="font-family:Georgia,'Times New Roman',serif;font-size:17px;color:#2b2622;">${esc(i.name)}</div>
          <div style="font-size:13px;color:#8a7d6b;margin-top:2px;">${esc(i.style)} · US ${esc(i.size)} · Qty ${esc(i.qty)}</div>
        </td>
        <td style="padding:14px 0;border-bottom:1px solid #ece3d4;text-align:right;font-size:15px;color:#2b2622;white-space:nowrap;">${esc(i.price)}</td>
      </tr>`
    )
    .join("");
}

function renderHtml(o) {
  const ship = o.shipping || {};
  const shipLines = [
    `${esc(o.firstName)} ${esc(o.lastName)}`,
    esc(ship.line1),
    ship.line2 ? esc(ship.line2) : "",
    `${esc(ship.city)}, ${esc(ship.state)} ${esc(ship.postal)}`,
    esc(ship.country),
  ].filter(Boolean).join("<br>");

  return `<!doctype html>
<html>
<body style="margin:0;padding:0;background:#faf7f1;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">Your Aura Steps order ${esc(o.ref)} is confirmed.</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#faf7f1;padding:28px 12px;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px;max-width:100%;">
        <tr><td align="center" style="padding:8px 0 22px;">
          <img src="${LOGO}" alt="Aura Steps" width="150" style="width:150px;height:auto;display:block;">
        </td></tr>
        <tr><td style="background:#ffffff;border:1px solid #ece3d4;border-radius:16px;padding:34px 34px 30px;">
          <p style="margin:0 0 6px;font-size:12px;letter-spacing:.22em;text-transform:uppercase;color:#b08d57;font-family:Arial,sans-serif;">Order confirmed</p>
          <h1 style="margin:0 0 14px;font-family:Georgia,'Times New Roman',serif;font-weight:600;font-size:30px;color:#4a2040;">Thank you, ${esc(o.firstName) || "there"}.</h1>
          <p style="margin:0 0 22px;font-family:Arial,sans-serif;font-size:15px;line-height:1.6;color:#55503f;">
            We've received your order and it's being prepared with care. Here are the details:
          </p>
          <p style="margin:0 0 18px;font-family:Arial,sans-serif;font-size:14px;color:#55503f;">
            <strong style="color:#2b2622;">Order</strong> ${esc(o.ref)}
          </p>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            ${renderRows(o.items)}
            <tr>
              <td style="padding:16px 0 0;font-family:Georgia,serif;font-size:18px;color:#2b2622;">Total</td>
              <td style="padding:16px 0 0;text-align:right;font-family:Georgia,serif;font-size:18px;font-weight:bold;color:#4a2040;">${esc(o.total)}</td>
            </tr>
          </table>
          <div style="margin:26px 0 0;padding:18px 20px;background:#faf7f1;border-radius:12px;">
            <p style="margin:0 0 6px;font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:#8a7d6b;font-family:Arial,sans-serif;">Shipping to</p>
            <p style="margin:0;font-family:Arial,sans-serif;font-size:14px;line-height:1.6;color:#2b2622;">${shipLines}</p>
          </div>
          <p style="margin:26px 0 0;font-family:Arial,sans-serif;font-size:14px;line-height:1.6;color:#55503f;">
            We'll email you again as soon as your order ships. Questions? Just reply to this email or reach us at
            <a href="mailto:support@aurastepsusa.com" style="color:#b08d57;">support@aurastepsusa.com</a>.
          </p>
        </td></tr>
        <tr><td align="center" style="padding:24px 10px 6px;">
          <p style="margin:0;font-family:Georgia,serif;font-style:italic;font-size:15px;color:#8a7d6b;">Walk in your own aura.</p>
          <p style="margin:8px 0 0;font-family:Arial,sans-serif;font-size:12px;color:#a99e8b;">
            Aura Steps · <a href="https://aurastepsusa.com" style="color:#a99e8b;">aurastepsusa.com</a>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function renderText(o) {
  const ship = o.shipping || {};
  const items = (o.items || []).map((i) => `- ${i.name} (${i.style}) US ${i.size} x${i.qty} — ${i.price}`).join("\n");
  return `Thank you, ${o.firstName || "there"}!

We've received your Aura Steps order and it's being prepared with care.

Order: ${o.ref}
${items}
Total: ${o.total}

Shipping to:
${o.firstName} ${o.lastName}
${ship.line1}${ship.line2 ? ", " + ship.line2 : ""}
${ship.city}, ${ship.state} ${ship.postal}
${ship.country}

We'll email you again when your order ships. Questions? Reply here or write to support@aurastepsusa.com.

Walk in your own aura,
Aura Steps
https://aurastepsusa.com`;
}
