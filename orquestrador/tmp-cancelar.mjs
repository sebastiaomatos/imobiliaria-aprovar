import * as db from './src/db.js';
const phone = process.argv[2]; // mesmo formato que chegou (ex.: 5565XXXXXXXXX)
if (!phone) { console.error('passe o telefone'); process.exit(1); }
await db.cancelarAgendamentosPendentes(phone);
await db.updateLead(phone, { optout: true, whatsapp_optout_em: new Date().toISOString() });
console.log('cadência cancelada + lead marcado optout:', phone);
process.exit(0);