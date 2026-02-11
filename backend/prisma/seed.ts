import { PrismaClient, Role, CaseStatus, Priority } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding CrimeIntel database...');

  // Admin user
  const hashedPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@crimeintel.com' },
    update: {},
    create: {
      email: 'admin@crimeintel.com',
      password: hashedPassword,
      name: 'Admin User',
      role: Role.ADMIN,
    },
  });
  console.log(`✅ Admin user created: ${admin.email}`);

  // Demo investigator
  const investigatorPassword = await bcrypt.hash('investigator123', 12);
  const investigator = await prisma.user.upsert({
    where: { email: 'investigator@crimeintel.com' },
    update: {},
    create: {
      email: 'investigator@crimeintel.com',
      password: investigatorPassword,
      name: 'Marco Rossi',
      role: Role.INVESTIGATOR,
    },
  });
  console.log(`✅ Investigator created: ${investigator.email}`);

  // Demo cases
  const case1 = await prisma.case.create({
    data: {
      title: 'Operazione Alfa - Furto con scasso via Roma',
      description: 'Indagine su furto con scasso presso gioielleria, telecamere CCTV disponibili, tracce biologiche raccolte sul punto di ingresso',
      status: CaseStatus.ACTIVE,
      priority: Priority.HIGH,
      userId: investigator.id,
      locationLat: 41.9028,
      locationLng: 12.4964,
      locationName: 'Via Roma 42, Roma',
      tags: ['furto', 'scasso', 'cctv', 'dna'],
    },
  });

  const case2 = await prisma.case.create({
    data: {
      title: 'Caso Beta - Incidente stradale sospetto',
      description: 'Analisi incidente stradale con sospetto di manomissione veicolo. Dashcam e testimonianze disponibili.',
      status: CaseStatus.OPEN,
      priority: Priority.MEDIUM,
      userId: investigator.id,
      locationLat: 45.4642,
      locationLng: 9.19,
      locationName: 'SS36, Milano',
      tags: ['incidente', 'veicolo', 'dashcam'],
    },
  });

  console.log(`✅ Demo cases created: ${case1.title}, ${case2.title}`);

  // Audit log for seed
  await prisma.auditLog.create({
    data: {
      userId: admin.id,
      action: 'SEED_DATABASE',
      resource: 'system',
      details: { version: '7.0.0', timestamp: new Date().toISOString() },
    },
  });

  console.log('✅ Seed completed successfully');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
