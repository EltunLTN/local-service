const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create Admin User
  const adminPassword = await bcrypt.hash('Admin123!', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@ustabul.az' },
    update: {},
    create: {
      email: 'admin@ustabul.az',
      password: adminPassword,
      role: 'ADMIN',
      emailVerified: new Date(),
    },
  })
  console.log('✅ Admin user created:', admin.email)

  // Create Categories with Subcategories
  const categories = [
    {
      name: 'Santexnika',
      slug: 'santexnika',
      description: 'Su təchizatı, kanalizasiya, isitmə sistemləri',
      icon: '🔧',
      color: '#2563EB',
      order: 1,
      subcategories: [
        { name: 'Su borusu təmiri', slug: 'su-borusu-temiri', basePrice: 30 },
        { name: 'Kran quraşdırılması', slug: 'kran-qurasdirilmasi', basePrice: 20 },
        { name: 'Tualet təmiri', slug: 'tualet-temiri', basePrice: 25 },
        { name: 'Kanalizasiya təmizlənməsi', slug: 'kanalizasiya-temizlenmesi', basePrice: 40 },
        { name: 'Su qızdırıcı quraşdırılması', slug: 'su-qizdirici', basePrice: 50 },
        { name: 'İsitmə sistemi', slug: 'isitme-sistemi', basePrice: 60 },
      ],
    },
    {
      name: 'Elektrik',
      slug: 'elektrik',
      description: 'Elektrik işləri, kabel çəkilişi, rozetka quraşdırılması',
      icon: '⚡',
      color: '#F59E0B',
      order: 2,
      subcategories: [
        { name: 'Rozetka quraşdırılması', slug: 'rozetka-qurasdirilmasi', basePrice: 15 },
        { name: 'İşıqlandırma', slug: 'isiqlandirma', basePrice: 20 },
        { name: 'Kabel çəkilişi', slug: 'kabel-cekilisi', basePrice: 35 },
        { name: 'Elektrik paneli', slug: 'elektrik-paneli', basePrice: 50 },
        { name: 'Qısaqapanma təmiri', slug: 'qisaqapanma-temiri', basePrice: 30 },
      ],
    },
    {
      name: 'Kondisioner',
      slug: 'kondisioner',
      description: 'Kondisioner quraşdırılması, təmiri və texniki xidmət',
      icon: '❄️',
      color: '#06B6D4',
      order: 3,
      subcategories: [
        { name: 'Kondisioner quraşdırılması', slug: 'kondisioner-qurasdirilmasi', basePrice: 80 },
        { name: 'Kondisioner təmiri', slug: 'kondisioner-temiri', basePrice: 40 },
        { name: 'Freon doldurulması', slug: 'freon-doldurulmasi', basePrice: 30 },
        { name: 'Texniki xidmət', slug: 'kondisioner-texniki-xidmet', basePrice: 25 },
      ],
    },
    {
      name: 'Təmizlik',
      slug: 'temizlik',
      description: 'Ev və ofis təmizliyi, dezinfeksiya',
      icon: '🧹',
      color: '#10B981',
      order: 4,
      subcategories: [
        { name: 'Ev təmizliyi', slug: 'ev-temizliyi', basePrice: 40 },
        { name: 'Ofis təmizliyi', slug: 'ofis-temizliyi', basePrice: 60 },
        { name: 'Pəncərə yuyulması', slug: 'pencere-yuyulmasi', basePrice: 20 },
        { name: 'Xalça yuyulması', slug: 'xalca-yuyulmasi', basePrice: 25 },
        { name: 'Dezinfeksiya', slug: 'dezinfeksiya', basePrice: 50 },
      ],
    },
    {
      name: 'Rəngləmə',
      slug: 'rengleme',
      description: 'Divar rəngləmə, dekorativ rəngləmə',
      icon: '🎨',
      color: '#8B5CF6',
      order: 5,
      subcategories: [
        { name: 'Divar rəngləmə', slug: 'divar-rengleme', basePrice: 35 },
        { name: 'Tavan rəngləmə', slug: 'tavan-rengleme', basePrice: 30 },
        { name: 'Dekorativ rəngləmə', slug: 'dekorativ-rengleme', basePrice: 50 },
        { name: 'Fasad rəngləmə', slug: 'fasad-rengleme', basePrice: 45 },
      ],
    },
    {
      name: 'Mebel',
      slug: 'mebel',
      description: 'Mebel yığılması, təmiri və sökülməsi',
      icon: '🪑',
      color: '#D97706',
      order: 6,
      subcategories: [
        { name: 'Mebel yığılması', slug: 'mebel-yigilmasi', basePrice: 30 },
        { name: 'Mebel təmiri', slug: 'mebel-temiri', basePrice: 25 },
        { name: 'Mebel sökülməsi', slug: 'mebel-sokulmesi', basePrice: 20 },
        { name: 'Xüsusi mebel sifarişi', slug: 'xususi-mebel', basePrice: 100 },
      ],
    },
    {
      name: 'Ev təmiri',
      slug: 'ev-temiri',
      description: 'Ümumi ev təmiri, kafel döşəmə, suvaq işləri',
      icon: '🏠',
      color: '#EF4444',
      order: 7,
      subcategories: [
        { name: 'Kafel döşəmə', slug: 'kafel-doseme', basePrice: 40 },
        { name: 'Suvaq işləri', slug: 'suvaq-isleri', basePrice: 35 },
        { name: 'Laminat döşəmə', slug: 'laminat-doseme', basePrice: 30 },
        { name: 'Qapı quraşdırılması', slug: 'qapi-qurasdirilmasi', basePrice: 40 },
        { name: 'Pəncərə quraşdırılması', slug: 'pencere-qurasdirilmasi', basePrice: 50 },
      ],
    },
    {
      name: 'Əşya daşıma',
      slug: 'esya-dasima',
      description: 'Köçürmə, əşya daşıma xidmətləri',
      icon: '📦',
      color: '#64748B',
      order: 8,
      subcategories: [
        { name: 'Ev köçürməsi', slug: 'ev-kocurmesi', basePrice: 100 },
        { name: 'Ofis köçürməsi', slug: 'ofis-kocurmesi', basePrice: 150 },
        { name: 'Əşya daşıma', slug: 'esya-dasima-xidmeti', basePrice: 40 },
        { name: 'Yükləmə/boşaltma', slug: 'yukleme-bosaltma', basePrice: 30 },
      ],
    },
  ]

  for (const cat of categories) {
    const { subcategories, ...categoryData } = cat
    const category = await prisma.category.upsert({
      where: { slug: categoryData.slug },
      update: categoryData,
      create: categoryData,
    })
    console.log(`✅ Category: ${category.name}`)

    for (const sub of subcategories) {
      await prisma.subcategory.upsert({
        where: { slug: sub.slug },
        update: { ...sub, categoryId: category.id },
        create: { ...sub, categoryId: category.id },
      })
    }
  }

  // Create System Settings
  const settings = [
    { key: 'platform_name', value: 'UstaBul', type: 'string', category: 'general' },
    { key: 'platform_fee', value: '10', type: 'number', category: 'payment' },
    { key: 'min_order_amount', value: '10', type: 'number', category: 'payment' },
    { key: 'max_order_amount', value: '5000', type: 'number', category: 'payment' },
    { key: 'support_email', value: 'support@ustabul.az', type: 'string', category: 'general' },
    { key: 'support_phone', value: '+994 12 345 67 89', type: 'string', category: 'general' },
  ]

  for (const setting of settings) {
    await prisma.systemSetting.upsert({
      where: { key: setting.key },
      update: setting,
      create: setting,
    })
  }
  console.log('✅ System settings created')

  console.log('\n🎉 Seeding completed!')
  console.log('📧 Admin login: admin@ustabul.az / Admin123!')
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
