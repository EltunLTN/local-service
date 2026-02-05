// Xidmət kateqoriyaları
export const SERVICE_CATEGORIES = [
  {
    id: 'elektrik',
    name: 'Elektrik',
    slug: 'elektrik',
    icon: 'Zap',
    color: '#FFC837',
    description: 'Elektrik quraşdırılması və təmiri',
    subcategories: [
      { id: 'rozetka', name: 'Rozetka quraşdırılması', price: 15 },
      { id: 'kabel', name: 'Kabel çəkilməsi', price: 50 },
      { id: 'panel', name: 'Elektrik paneli təmiri', price: 80 },
      { id: 'led', name: 'LED işıqlandırma', price: 30 },
      { id: 'lustre', name: 'Lüstr quraşdırılması', price: 25 },
    ],
  },
  {
    id: 'santexnik',
    name: 'Santexnik',
    slug: 'santexnik',
    icon: 'Droplets',
    color: '#2E5BFF',
    description: 'Su və kanalizasiya işləri',
    subcategories: [
      { id: 'kran', name: 'Kran təmiri/dəyişdirilməsi', price: 20 },
      { id: 'unitaz', name: 'Unitaz quraşdırılması', price: 60 },
      { id: 'boru', name: 'Boru təmiri', price: 40 },
      { id: 'duş', name: 'Duş kabina quraşdırılması', price: 100 },
      { id: 'qızdırıcı', name: 'Su qızdırıcı quraşdırılması', price: 50 },
    ],
  },
  {
    id: 'temir',
    name: 'Ev Təmiri',
    slug: 'temir',
    icon: 'Hammer',
    color: '#FF6B35',
    description: 'Ümumi ev təmiri işləri',
    subcategories: [
      { id: 'boya', name: 'Divar boyama', price: 15 },
      { id: 'parket', name: 'Parket döşəmə', price: 25 },
      { id: 'plitka', name: 'Plitka döşəmə', price: 30 },
      { id: 'gips', name: 'Gips karton işləri', price: 20 },
      { id: 'suvaq', name: 'Suvaq işləri', price: 18 },
    ],
  },
  {
    id: 'temizlik',
    name: 'Təmizlik',
    slug: 'temizlik',
    icon: 'Sparkles',
    color: '#00D084',
    description: 'Ev və ofis təmizliyi',
    subcategories: [
      { id: 'genel', name: 'Ümumi təmizlik', price: 50 },
      { id: 'pencere', name: 'Pəncərə yuma', price: 30 },
      { id: 'xalca', name: 'Xalça yuma', price: 40 },
      { id: 'divan', name: 'Divan təmizliyi', price: 35 },
      { id: 'kapital', name: 'Kapital təmizlik', price: 150 },
    ],
  },
  {
    id: 'kondisioner',
    name: 'Kondisioner',
    slug: 'kondisioner',
    icon: 'AirVent',
    color: '#7B3FF2',
    description: 'Kondisioner xidmətləri',
    subcategories: [
      { id: 'qurasdirilma', name: 'Quraşdırılma', price: 100 },
      { id: 'temizlik', name: 'Təmizlik', price: 40 },
      { id: 'temir', name: 'Təmir', price: 60 },
      { id: 'freon', name: 'Freon doldurma', price: 50 },
    ],
  },
  {
    id: 'mebel',
    name: 'Mebel',
    slug: 'mebel',
    icon: 'Sofa',
    color: '#8B5CF6',
    description: 'Mebel quraşdırılması və təmiri',
    subcategories: [
      { id: 'yigma', name: 'Mebel yığma', price: 30 },
      { id: 'temir', name: 'Mebel təmiri', price: 40 },
      { id: 'dasinma', name: 'Mebel daşınması', price: 80 },
      { id: 'sifarish', name: 'Sifarişlə mebel', price: 200 },
    ],
  },
  {
    id: 'bag',
    name: 'Bağ İşləri',
    slug: 'bag',
    icon: 'Flower2',
    color: '#10B981',
    description: 'Bağ və yaşıllaşdırma',
    subcategories: [
      { id: 'bicme', name: 'Qazon biçmə', price: 25 },
      { id: 'budama', name: 'Ağac budama', price: 35 },
      { id: 'ekleme', name: 'Bitki əkmə', price: 20 },
      { id: 'suvarma', name: 'Suvarma sistemi', price: 100 },
    ],
  },
  {
    id: 'texnika',
    name: 'Məişət Texnikası',
    slug: 'texnika',
    icon: 'Tv',
    color: '#6366F1',
    description: 'Məişət texnikası təmiri',
    subcategories: [
      { id: 'soyuducu', name: 'Soyuducu təmiri', price: 80 },
      { id: 'paltaryuyan', name: 'Paltaryuyan təmiri', price: 70 },
      { id: 'qabyuyan', name: 'Qabyuyan təmiri', price: 60 },
      { id: 'soba', name: 'Plitə/Soba təmiri', price: 50 },
    ],
  },
];

// Populyar xidmətlər (ana səhifə üçün)
export const POPULAR_SERVICES = [
  'Rozetka təmiri',
  'Kran təmiri',
  'Kondisioner təmizliyi',
  'Ev təmizliyi',
  'Pəncərə yuma',
];

// Vaxt slotları
export const TIME_SLOTS = [
  { id: '09-12', label: '09:00 - 12:00', start: '09:00', end: '12:00' },
  { id: '12-15', label: '12:00 - 15:00', start: '12:00', end: '15:00' },
  { id: '15-18', label: '15:00 - 18:00', start: '15:00', end: '18:00' },
  { id: '18-21', label: '18:00 - 21:00', start: '18:00', end: '21:00' },
];

// Təcililik seçimləri
export const URGENCY_OPTIONS = [
  { id: 'planned', label: 'Planlı', description: '1-3 gün ərzində', price: 0 },
  { id: 'today', label: 'Bu gün', description: '4-8 saat ərzində', price: 10 },
  { id: 'urgent', label: 'Təcili', description: '1-2 saat ərzində', price: 25 },
];

// Ödəniş üsulları
export const PAYMENT_METHODS = [
  { id: 'cash', label: 'Nağd', icon: 'Banknote' },
  { id: 'card', label: 'Kart', icon: 'CreditCard' },
  { id: 'later', label: 'İş bitdikdən sonra', icon: 'Clock' },
];

// Sifariş statusları
export const ORDER_STATUSES = {
  pending: { label: 'Gözləyir', color: '#FFC837', icon: 'Clock' },
  accepted: { label: 'Qəbul edildi', color: '#2E5BFF', icon: 'CheckCircle' },
  in_progress: { label: 'İcra olunur', color: '#7B3FF2', icon: 'Loader' },
  completed: { label: 'Tamamlandı', color: '#00D084', icon: 'Check' },
  cancelled: { label: 'Ləğv edildi', color: '#FF4757', icon: 'X' },
};

// Bakı rayonları
export const BAKU_DISTRICTS = [
  { id: 'yasamal', name: 'Yasamal', lat: 40.3856, lng: 49.8149 },
  { id: 'nasimi', name: 'Nəsimi', lat: 40.3917, lng: 49.8545 },
  { id: 'sabail', name: 'Səbail', lat: 40.3656, lng: 49.8352 },
  { id: 'narimanov', name: 'Nərimanov', lat: 40.4115, lng: 49.8682 },
  { id: 'xatai', name: 'Xətai', lat: 40.3947, lng: 49.9082 },
  { id: 'nizami', name: 'Nizami', lat: 40.3778, lng: 49.8028 },
  { id: 'binagadi', name: 'Binəqədi', lat: 40.4495, lng: 49.8202 },
  { id: 'suraxani', name: 'Suraxanı', lat: 40.4299, lng: 50.0173 },
  { id: 'sabunchu', name: 'Sabunçu', lat: 40.4458, lng: 49.9482 },
  { id: 'qaradağ', name: 'Qaradağ', lat: 40.3500, lng: 49.9667 },
  { id: 'pirallahi', name: 'Pirallahı', lat: 40.4833, lng: 50.3000 },
  { id: 'khazar', name: 'Xəzər', lat: 40.5118, lng: 50.1146 },
];

// App konfiqurasiyası
export const APP_CONFIG = {
  name: 'UstaBul',
  description: 'Azərbaycanda usta xidməti platforması',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  defaultLocale: 'az',
  currency: 'AZN',
  currencySymbol: '₼',
  phonePrefix: '+994',
  supportPhone: '+994 50 123 45 67',
  supportEmail: 'destek@ustabul.az',
  socialLinks: {
    facebook: 'https://facebook.com/ustabul',
    instagram: 'https://instagram.com/ustabul',
    whatsapp: 'https://wa.me/994501234567',
  },
};

// SEO metadata
export const SEO_CONFIG = {
  titleTemplate: '%s | UstaBul',
  defaultTitle: 'UstaBul - Azərbaycanda Usta Xidməti',
  description: 'Elektrik, santexnik, təmir, təmizlik və digər usta xidmətləri. Peşəkar ustaları tapın və sifarış edin.',
  keywords: ['usta', 'elektrik', 'santexnik', 'təmir', 'baku', 'azerbaycan', 'xidmət'],
  openGraph: {
    type: 'website',
    locale: 'az_AZ',
    siteName: 'UstaBul',
  },
};

// Reytinq seçimləri (filtr üçün)
export const RATING_OPTIONS = [
  { value: 5, label: '⭐ 5.0' },
  { value: 4.5, label: '⭐ 4.5+' },
  { value: 4, label: '⭐ 4.0+' },
  { value: 3.5, label: '⭐ 3.5+' },
];

// Məsafə seçimləri (filtr üçün)
export const DISTANCE_OPTIONS = [
  { value: 2, label: '2 km daxilində' },
  { value: 5, label: '5 km daxilində' },
  { value: 10, label: '10 km daxilində' },
  { value: 20, label: '20 km daxilində' },
];

// Sıralama seçimləri
export const SORT_OPTIONS = [
  { value: 'recommended', label: 'Tövsiyə edilən' },
  { value: 'rating', label: 'Ən yüksək reytinq' },
  { value: 'price_low', label: 'Qiymət: Aşağıdan yuxarıya' },
  { value: 'price_high', label: 'Qiymət: Yuxarıdan aşağıya' },
  { value: 'distance', label: 'Ən yaxın' },
  { value: 'reviews', label: 'Ən çox rəy alan' },
];

// Navigation menu items
export const NAV_ITEMS = [
  { label: 'Xidmətlər', href: '/xidmetler' },
  { label: 'Necə işləyir', href: '/nece-isleyir' },
  { label: 'Usta ol', href: '/usta-ol' },
];

// Footer navigation
export const FOOTER_LINKS = {
  xidmetler: [
    { label: 'Elektrik', href: '/xidmetler/elektrik' },
    { label: 'Santexnik', href: '/xidmetler/santexnik' },
    { label: 'Ev Təmiri', href: '/xidmetler/temir' },
    { label: 'Təmizlik', href: '/xidmetler/temizlik' },
    { label: 'Kondisioner', href: '/xidmetler/kondisioner' },
  ],
  haqqimizda: [
    { label: 'Haqqımızda', href: '/haqqimizda' },
    { label: 'Karyera', href: '/karyera' },
    { label: 'Blog', href: '/blog' },
    { label: 'Əlaqə', href: '/elaqe' },
  ],
  destsk: [
    { label: 'FAQ', href: '/faq' },
    { label: 'Məxfilik Siyasəti', href: '/mexfilik' },
    { label: 'İstifadə Şərtləri', href: '/sertler' },
    { label: 'Dəstək', href: '/destek' },
  ],
};
