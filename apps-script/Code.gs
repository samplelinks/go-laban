/**
 * GO LABAN - Website forms -> Google Sheet + email + automatic reply
 * Handles both the Contact form (contact.html) and the Franchise form (franchise.html).
 *
 * Every submission is:
 *   1. saved as a new row in this spreadsheet (tab "Contact" or "Franchise"),
 *   2. emailed to sales@golaban.com (hit Reply in Zoho and it goes straight to the customer), and
 *   3. answered automatically: the customer gets a branded thank-you email from sales@golaban.com
 *      (only when they typed an email address in the form).
 *
 * Setup: see SETUP.md in this folder.
 *
 * NOTE: All special characters in emails (dots, dashes, emojis) are written as HTML
 * entities (&middot; &mdash; &#128153; ...) and subjects use plain ASCII, so they
 * display correctly in every mail client.
 */

const NOTIFY_EMAIL = 'sales@golaban.com';   // where new enquiries are delivered (your Zoho inbox)
const FROM_EMAIL   = 'sales@golaban.com';   // the address customers see on the automatic reply
const BRAND        = 'Go Laban';
const AUTO_REPLY   = true;                  // set to false to stop automatic replies
const SITE         = 'https://golaban.com';
const LOGO_URL     = SITE + '/assets/logo.png';
const PHONE        = '+91 98421 32007';
const WHATSAPP     = 'https://wa.me/919842132007';
const INSTAGRAM    = 'https://www.instagram.com/golaban_007kvcofficial/';

const SHEETS = {
  contact: {
    tab: 'Contact',
    fields: ['submittedAt', 'name', 'phone', 'email', 'enquiryType', 'outlet', 'message', 'page', 'autoReply'],
    headers: ['Submitted at', 'Name', 'Phone', 'Email', 'Enquiry type', 'Outlet', 'Message', 'Page', 'Auto-reply']
  },
  franchise: {
    tab: 'Franchise',
    fields: ['submittedAt', 'name', 'phone', 'email', 'city', 'space', 'timeline', 'message', 'page', 'autoReply'],
    headers: ['Submitted at', 'Name', 'Phone', 'Email', 'City', 'Space', 'Timeline', 'Message', 'Page', 'Auto-reply']
  }
};

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000);
  try {
    const p = (e && e.parameter) || {};
    if (p.website) return json_({ ok: true }); // honeypot: silently ignore bots

    const type = SHEETS[p.formType] ? p.formType : 'contact';
    const cfg = SHEETS[type];
    const clean = {};
    cfg.fields.forEach(f => clean[f] = String(p[f] || '').trim().slice(0, 3000));
    if (!clean.name || !clean.phone) return json_({ ok: false, error: 'Missing name or phone' });
    if (!clean.submittedAt) clean.submittedAt = Utilities.formatDate(new Date(), 'Asia/Kolkata', 'dd/MM/yyyy HH:mm');
    const hasEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(clean.email);

    // 1. Automatic reply to the customer
    clean.autoReply = 'No email given';
    if (AUTO_REPLY && hasEmail) {
      try { clean.autoReply = sendAutoReply_(type, clean); }
      catch (err) { clean.autoReply = 'Failed: ' + err; }
    }

    // 2. Save to sheet
    getSheet_(cfg).appendRow(cfg.fields.map(f => clean[f]));

    // 3. Notify sales@golaban.com
    const subject = type === 'franchise'
      ? `New franchise enquiry - ${clean.name} - ${clean.city || 'city not given'}`
      : `New website enquiry - ${clean.enquiryType || 'General'} - ${clean.name}`;
    const rows = cfg.fields.map((f, i) =>
      `<tr><td style="padding:8px 12px;background:#f2f6fc;font-weight:600;color:#0b4e94;white-space:nowrap">${cfg.headers[i]}</td>` +
      `<td style="padding:8px 12px;border-bottom:1px solid #eef2f7">${escape_(clean[f]) || '&mdash;'}</td></tr>`).join('');
    const html =
      `<div style="font-family:Arial,sans-serif;max-width:600px">` +
      `<div style="background:#0b4e94;color:#fff;padding:18px 22px;border-radius:12px 12px 0 0;font-size:18px;font-weight:700">` +
      `${BRAND} &middot; ${type === 'franchise' ? 'Franchise application' : 'Contact form'}</div>` +
      `<table style="width:100%;border-collapse:collapse;border:1px solid #e3eaf3">${rows}</table>` +
      `<p style="color:#5a6b85;font-size:13px">Call back: <a href="tel:${clean.phone.replace(/\s/g, '')}">${escape_(clean.phone)}</a>` +
      ` &middot; WhatsApp: <a href="https://wa.me/${waNumber_(clean.phone)}">open chat</a>` +
      (hasEmail ? ` &middot; Hit <b>Reply</b> to answer ${escape_(clean.name)} directly.` : '') + `</p></div>`;
    const opts = { htmlBody: html, name: `${BRAND} Website` };
    if (hasEmail) opts.replyTo = clean.email;
    MailApp.sendEmail(NOTIFY_EMAIL, subject, 'New submission from the Go Laban website.', opts);

    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

/**
 * Sends the branded thank-you email to the customer.
 * If sales@golaban.com is added as a "Send mail as" address in this Google account's Gmail
 * (see SETUP.md, step 7), the email is sent FROM sales@golaban.com through Zoho.
 * Otherwise it is sent from this Google account with Reply-To set to sales@golaban.com.
 */
function sendAutoReply_(type, d) {
  const first = d.name.split(/\s+/)[0];
  const isFr = type === 'franchise';
  const subject = isFr
    ? `Thanks for your franchise enquiry, ${first}! - Go Laban`
    : `We got your message, ${first}! - Go Laban`;

  const intro = isFr
    ? `Thank you for your interest in opening a <b>Go Laban</b> franchise${d.city ? ' in <b>' + escape_(d.city) + '</b>' : ''}! Our franchise team will call you on <b>${escape_(d.phone)}</b> to set up a discovery call, where we'll walk you through the full plan, costs and next steps.`
    : `Thank you for reaching out to <b>Go Laban</b>! We've received your message${d.enquiryType ? ' about <b>' + escape_(d.enquiryType.toLowerCase()) + '</b>' : ''} and our team will get back to you shortly.`;

  const summary = isFr
    ? [['City', d.city], ['Space', d.space], ['Timeline', d.timeline], ['Your note', d.message]]
    : [['Enquiry', d.enquiryType], ['Outlet', d.outlet], ['Your message', d.message]];
  const rows = summary.filter(r => r[1]).map(r =>
    `<tr><td style="padding:6px 0;color:#5a6b85;width:110px;vertical-align:top">${r[0]}</td><td style="padding:6px 0;color:#0b1b33">${escape_(r[1]).replace(/\n/g, '<br>')}</td></tr>`).join('');

  const btn = (href, label, bg) =>
    `<a href="${href}" style="display:inline-block;background:${bg};color:#ffffff;text-decoration:none;font-weight:700;padding:12px 22px;border-radius:999px;margin:4px 6px 4px 0">${label}</a>`;

  const html = `
<div style="background:#fff8ee;padding:24px 12px;font-family:Arial,Helvetica,sans-serif">
  <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:18px;overflow:hidden;border:1px solid #e3eaf3">
    <div style="background:#041a3d;padding:26px;text-align:center">
      <img src="${LOGO_URL}" alt="Go Laban" width="84" height="84" style="border-radius:50%;display:inline-block">
      <div style="color:#5bc236;font-size:12px;letter-spacing:3px;font-weight:700;margin-top:12px">DUBAI'S VIRAL DESSERTS</div>
    </div>
    <div style="padding:28px 28px 8px">
      <h1 style="margin:0 0 14px;font-size:24px;color:#0b1b33">Hi ${escape_(first)}, thank you!</h1>
      <p style="margin:0 0 18px;font-size:15px;line-height:1.6;color:#2b3a52">${intro}</p>
      ${rows ? `<div style="background:#f2f6fc;border-radius:12px;padding:12px 16px;margin-bottom:18px"><div style="font-size:12px;font-weight:700;letter-spacing:1.5px;color:#0b4e94;margin-bottom:4px">WHAT YOU SENT US</div><table style="width:100%;border-collapse:collapse;font-size:14px">${rows}</table></div>` : ''}
      <p style="margin:0 0 12px;font-size:15px;color:#2b3a52">Need us sooner? We're one tap away:</p>
      <div style="margin-bottom:22px">
        ${btn(WHATSAPP, 'WhatsApp us', '#25d366')}
        ${btn('tel:' + PHONE.replace(/\s/g, ''), 'Call ' + PHONE, '#0b4e94')}
      </div>
      ${isFr ? '' : `<p style="margin:0 0 20px;font-size:14px;color:#5a6b85">While you wait, have a look at <a href="${SITE}/menu.html" style="color:#1463c4;font-weight:700">our menu</a> &mdash; the De Paris box is calling.</p>`}
      <p style="margin:0 0 24px;font-size:15px;color:#2b3a52">Warm regards,<br><b>Team Go Laban</b></p>
    </div>
    <div style="background:#0b4e94;color:#cfe0f7;padding:18px 28px;font-size:12.5px;line-height:1.6">
      <b style="color:#fff">Our outlets:</b> Bypass Road (Kalavasal) &amp; KK Nagar, Madurai &middot; Sasthri Road, Trichy<br>
      <a href="${SITE}" style="color:#fff">golaban.com</a> &middot; <a href="${INSTAGRAM}" style="color:#fff">Instagram</a> &middot; <a href="mailto:${FROM_EMAIL}" style="color:#fff">${FROM_EMAIL}</a>
    </div>
  </div>
  <p style="text-align:center;font-size:11px;color:#8a97ab;margin-top:14px">You're receiving this because you submitted a form on golaban.com.</p>
</div>`;

  const text = `Hi ${first}, thank you for contacting Go Laban! ` +
    (isFr ? `Our franchise team will call you on ${d.phone} soon.` : `Our team will get back to you shortly.`) +
    ` Need us sooner? WhatsApp ${WHATSAPP} or call ${PHONE}. - Team Go Laban`;

  const opts = { htmlBody: html, name: BRAND, replyTo: FROM_EMAIL };

  // Preferred: send as sales@golaban.com (needs the Gmail "Send mail as" alias - SETUP.md step 7)
  const aliases = GmailApp.getAliases();
  if (aliases.indexOf(FROM_EMAIL) !== -1) {
    GmailApp.sendEmail(d.email, subject, text, Object.assign({ from: FROM_EMAIL }, opts));
    return 'Sent from ' + FROM_EMAIL;
  }
  // Fallback: from this Google account, replies still land in sales@golaban.com
  MailApp.sendEmail(d.email, subject, text, opts);
  return 'Sent (reply-to ' + FROM_EMAIL + ')';
}

// Visiting the /exec URL in a browser shows this - handy to confirm it's live.
function doGet() {
  return json_({ ok: true, service: 'Go Laban website forms', sendAsReady: GmailApp.getAliases().indexOf(FROM_EMAIL) !== -1 });
}

function getSheet_(cfg) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(cfg.tab);
  if (!sh) {
    sh = ss.insertSheet(cfg.tab);
    sh.appendRow(cfg.headers);
    sh.getRange(1, 1, 1, cfg.headers.length).setFontWeight('bold').setBackground('#0b4e94').setFontColor('#ffffff');
    sh.setFrozenRows(1);
  } else if (sh.getLastColumn() < cfg.headers.length) {
    // sheet was created by an older version of this script - add the new header(s)
    sh.getRange(1, 1, 1, cfg.headers.length).setValues([cfg.headers]).setFontWeight('bold').setBackground('#0b4e94').setFontColor('#ffffff');
  }
  return sh;
}

function waNumber_(phone) {
  const d = String(phone).replace(/\D/g, '');
  return d.length === 10 ? '91' + d : d;
}

function escape_(s) {
  return String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

/**
 * Run once from the editor to approve permissions.
 * Put YOUR OWN email in TEST_EMAIL to see exactly what customers receive.
 */
const TEST_EMAIL = 'sales@golaban.com';
function testSetup() {
  doPost({ parameter: { formType: 'contact', name: 'Test Customer', phone: '9842132007', email: TEST_EMAIL, enquiryType: 'General enquiry', outlet: 'Any outlet', message: 'Test message from setup', page: 'setup' } });
  Logger.log('Send-as sales@golaban.com ready: ' + (GmailApp.getAliases().indexOf(FROM_EMAIL) !== -1));
}