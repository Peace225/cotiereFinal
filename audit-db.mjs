import { PrismaClient } from '@prisma/client';
const p = new PrismaClient();

const tables = [
  'user', 'evenement', 'excursion', 'room', 'equipment',
  'marketProduit', 'studioBooking', 'excursionBooking',
  'hotelBooking', 'musicBooking', 'eventRequest',
  'equipmentRental', 'mediaAdRequest', 'afroubaRequest',
  'rdvInscription', 'payment', 'review', 'notification'
];

console.log('\n📊 AUDIT BASE DE DONNÉES NEON\n');
for (const t of tables) {
  try {
    const count = await p[t].count();
    const status = count > 0 ? '✅' : '⚠️ VIDE';
    console.log(`  ${status} ${t}: ${count} enregistrements`);
  } catch(e) {
    console.log(`  ❌ ${t}: erreur - ${e.message}`);
  }
}
await p.$disconnect();
