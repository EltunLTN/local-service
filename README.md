# 🛠️ UstaBul - Azərbaycanda Usta Xidməti Platforması

![UstaBul Logo](public/logo.svg)

UstaBul, Azərbaycanda usta xidmətlərini tapmaq və sifariş etmək üçün yaradılmış tam funksional veb platformasıdır. Bu layihə Next.js 14, TypeScript, Tailwind CSS və Prisma ilə qurulmuşdur.

## 🌟 Xüsusiyyətlər

### Müştərilər üçün
- 🔍 **Usta axtarışı** - Kateqoriya, rayon, qiymət və reytinqə görə filtrləmə
- 📱 **Sifariş yaratma** - Addım-addım sifariş formu
- 💬 **Canlı mesajlaşma** - Ustalarla birbaşa əlaqə
- ⭐ **Rəy sistemi** - İşdən sonra ustanı qiymətləndirmə
- 📍 **Xəritə inteqrasiyası** - Yaxınlıqdakı ustaları görmə
- 🔔 **Bildirişlər** - Sifariş statusu haqqında xəbərdarlıq

### Ustalar üçün
- 📊 **Dashboard** - Statistika və analitika
- 📅 **Təqvim** - İş qrafiki idarəetməsi
- 💰 **Gəlir izləmə** - Aylıq/həftəlik gəlir hesabatları
- 🖼️ **Portfolio** - İş nümunələrini paylaşma
- ✅ **Sifariş idarəetməsi** - Qəbul/rədd/tamamlama

## 🛠️ Texnologiyalar

- **Frontend:** Next.js 14 (App Router), React 18, TypeScript
- **Styling:** Tailwind CSS, CSS Variables, Framer Motion
- **UI Components:** Radix UI Primitives
- **Backend:** Next.js API Routes
- **Database:** PostgreSQL + Prisma ORM
- **Auth:** NextAuth.js (Credentials + OAuth)
- **State:** Zustand
- **Forms:** React Hook Form + Zod
- **Realtime:** Pusher (optional)

## 📁 Layihə Strukturu

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── giris/             # Login page
│   ├── qeydiyyat/         # Register page
│   ├── hesab/             # User dashboard
│   ├── mesajlar/          # Messages
│   ├── sifaris/           # Orders
│   ├── usta/              # Master profiles
│   ├── usta-ol/           # Master registration
│   ├── usta-panel/        # Master dashboard
│   └── xidmetler/         # Services search
├── components/
│   ├── ui/                # Reusable UI components
│   ├── layout/            # Layout components
│   ├── forms/             # Form components
│   ├── cards/             # Card components
│   └── profile/           # Profile components
├── hooks/                  # Custom React hooks
├── lib/                    # Utilities, API, constants
├── store/                  # Zustand stores
├── types/                  # TypeScript types
└── prisma/                 # Database schema & migrations
```

## 🚀 Quraşdırma

### Tələblər
- Node.js 18+
- PostgreSQL veya Supabase
- pnpm (tövsiyə olunur)

### 1. Repo-nu klonlayın

```bash
git clone https://github.com/yourusername/ustabul.git
cd ustabul
```

### 2. Asılılıqları quraşdırın

```bash
pnpm install
```

### 3. Environment dəyişənləri

`.env.example` faylını `.env` olaraq kopyalayın və dəyərləri doldurun:

```bash
cp .env.example .env
```

Mütləq tələb olunanlar:
- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_SECRET` - NextAuth üçün gizli açar
- `NEXTAUTH_URL` - Saytın URL-i

### 4. Database-i hazırlayın

```bash
# Prisma client generasiya
pnpm prisma generate

# Migration-ları icra edin
pnpm prisma migrate dev

# (Opsional) Demo data əlavə edin
pnpm prisma db seed
```

### 5. Development server-i başladın

```bash
pnpm dev
```

Brauzer açın: [http://localhost:3000](http://localhost:3000)

## 📜 Əmrlər

```bash
# Development
pnpm dev              # Dev server başlat
pnpm build            # Production build
pnpm start            # Production server

# Database
pnpm prisma studio    # Prisma Studio aç
pnpm prisma migrate dev  # Migration yarat
pnpm prisma db push   # Schema-nı push et
pnpm prisma db seed   # Seed data əlavə et

# Code quality
pnpm lint             # ESLint
pnpm type-check       # TypeScript check
```

## 🎨 Dizayn Sistemi

### Rənglər
- **Primary Blue:** `#2E5BFF`
- **Success Green:** `#00D084`
- **Error Red:** `#FF4757`
- **Warning Orange:** `#FFA502`
- **Background:** `#F8FAFC`

### Tipografiya
- **Headings:** Manrope (700, 600)
- **Body:** Inter (400, 500, 600)

### Spacing
8px grid sistemi: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96px

## 📱 Responsivlik

- **Mobile:** 320px - 767px
- **Tablet:** 768px - 1023px
- **Desktop:** 1024px - 1279px
- **Large Desktop:** 1280px+

## 🔐 Autentifikasiya

NextAuth.js ilə dəstəklənən metodlar:
- ✅ Email/Password
- ✅ Google OAuth
- 🔜 Facebook OAuth (planlaşdırılır)

## 📖 API Dokumentasiyası

### Əsas Endpointlər

| Endpoint | Method | Təsvir |
|----------|--------|--------|
| `/api/masters` | GET | Ustaların siyahısı |
| `/api/masters/[id]` | GET | Usta profili |
| `/api/orders` | GET/POST | Sifarişlər |
| `/api/orders/[id]` | GET/PUT | Sifariş detalları |
| `/api/messages` | GET/POST | Mesajlar |
| `/api/user/profile` | GET/PUT | Profil |
| `/api/master/stats` | GET | Usta statistikası |

## 🤝 Töhfə

1. Fork edin
2. Feature branch yaradın (`git checkout -b feature/amazing-feature`)
3. Dəyişiklikləri commit edin (`git commit -m 'Add amazing feature'`)
4. Branch-ı push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📄 Lisenziya

Bu layihə MIT lisenziyası altındadır. Ətraflı məlumat üçün [LICENSE](LICENSE) faylına baxın.

## 👥 Komanda

- **Developer:** [Your Name]
- **Designer:** [Designer Name]

## 📞 Əlaqə

- **Email:** info@ustabul.az
- **Website:** [www.ustabul.az](https://www.ustabul.az)
- **Telefon:** +994 50 123 45 67

---

Made with ❤️ in Azerbaijan 🇦🇿
