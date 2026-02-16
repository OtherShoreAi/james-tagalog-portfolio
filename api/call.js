// api/call.js — Vercel Serverless Function
// Placeholder for Retell AI outbound call integration
//
// To wire up:
// 1. Add RETELL_API_KEY to Vercel environment variables
// 2. Add your agent IDs below
// 3. Uncomment the Retell API fetch call
// 4. Set BACKEND_READY = true in js/main.js

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, phone, email, scenario } = req.body || {};

  if (!name || !phone || !email || !scenario) {
    return res.status(400).json({ error: 'Missing required fields: name, phone, email, scenario' });
  }

  if (!/^\+?[\d\s\-().]{7,}$/.test(phone)) {
    return res.status(400).json({ error: 'Invalid phone number format' });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  const validScenarios = ['customer-service', 'lead-qualification', 'appointment-setting'];
  if (!validScenarios.includes(scenario)) {
    return res.status(400).json({ error: 'Invalid scenario' });
  }

  // --- RETELL AI INTEGRATION (uncomment when ready) ---
  //
  // const RETELL_API_KEY = process.env.RETELL_API_KEY;
  // const AGENT_IDS = {
  //   'customer-service': 'agent_xxxx',
  //   'lead-qualification': 'agent_yyyy',
  //   'appointment-setting': 'agent_zzzz'
  // };
  //
  // const retellRes = await fetch('https://api.retellai.com/v2/create-phone-call', {
  //   method: 'POST',
  //   headers: {
  //     'Authorization': 'Bearer ' + RETELL_API_KEY,
  //     'Content-Type': 'application/json'
  //   },
  //   body: JSON.stringify({
  //     agent_id: AGENT_IDS[scenario],
  //     customer_number: phone,
  //     metadata: { name, email }
  //   })
  // });
  //
  // if (!retellRes.ok) {
  //   console.error('Retell API error:', await retellRes.text());
  //   return res.status(502).json({ error: 'Failed to initiate call' });
  // }
  //
  // const callData = await retellRes.json();
  // return res.status(200).json({ success: true, callId: callData.call_id });

  // Placeholder response (remove when wiring up Retell)
  console.log('Demo call requested:', { name, phone, email, scenario });
  return res.status(200).json({
    success: true,
    message: 'Placeholder — Retell API not yet connected',
    callId: 'placeholder_' + Date.now()
  });
}
