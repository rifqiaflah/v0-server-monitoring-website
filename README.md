# Server Monitoring Dashboard

Dashboard monitoring server real-time yang mengintegrasikan Zabbix dan Elasticsearch untuk memantau infrastruktur IT Anda.

## Fitur

- **Real-time Monitoring**: Pemantauan status server secara real-time
- **Zabbix Integration**: Mengambil data host, metrics, dan problems dari Zabbix
- **Elasticsearch Analytics**: Analisis log security untuk deteksi:
  - Bruteforce attacks (`event.outcome: "failure"` OR `message: "*Failed password*"` OR `message: "*authentication failure*"`)
  - DDoS attempts (`message: "HTTP"`)
- **Visual Dashboard**:
  - Total server count
  - Server up/down status
  - Uptime percentage hari ini
  - Real-time clock
  - Security threat charts
  - Host performance metrics (CPU, RAM, Bandwidth)
  - Activity feed (problems & logs)

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Salin file `.env.example` menjadi `.env.local` dan sesuaikan:

```bash
cp .env.example .env.local
```

Edit `.env.local` dengan kredensial Zabbix dan Elasticsearch Anda.

### 3. Run Development Server

```bash
npm run dev
```

Dashboard akan tersedia di `http://localhost:3000`

## Integrasi

### Zabbix API

File `lib/zabbix.ts` menyediakan client untuk mengakses Zabbix API:

- `getHosts()` - Mendapatkan daftar hosts
- `getHostItems()` - Mendapatkan metrics host (CPU, RAM, Network)
- `getProblems()` - Mendapatkan daftar problems aktif
- `getTriggers()` - Mendapatkan triggers yang aktif

### Elasticsearch

File `lib/elasticsearch.ts` menyediakan client untuk query Elasticsearch:

- `getBruteforceAttempts()` - Query untuk deteksi bruteforce
- `getDDoSAttempts()` - Query untuk deteksi DDoS
- `getSecurityStats()` - Aggregated security statistics

### Data Sync

File `lib/data-sync.ts` menyediakan fungsi untuk sinkronisasi data dari Zabbix ke Elasticsearch.

Anda dapat menjalankan ini sebagai cron job atau scheduled task:

```typescript
import { syncZabbixToElasticsearch } from '@/lib/data-sync'

// Jalankan setiap 5 menit
setInterval(async () => {
  await syncZabbixToElasticsearch()
}, 5 * 60 * 1000)
```

## API Routes

Dashboard menggunakan Next.js API routes untuk fetching data:

- `GET /api/stats` - Server statistics (total, up, down)
- `GET /api/security-logs` - Security threat data dan grafik
- `GET /api/hosts` - Daftar Zabbix hosts dengan metrics
- `GET /api/activity` - Combined activity feed dari Zabbix dan Elasticsearch

## Production Deployment

1. Set semua environment variables di Vercel/hosting Anda
2. Deploy aplikasi
3. Setup cron job atau scheduled function untuk data sync
4. Monitor logs untuk memastikan integrasi berjalan dengan baik

## Tech Stack

- **Framework**: Next.js 16 dengan App Router
- **UI**: shadcn/ui components dengan Tailwind CSS v4
- **Charts**: Recharts
- **Data Fetching**: SWR untuk real-time updates
- **APIs**: Zabbix API & Elasticsearch REST API

## Notes

File API routes saat ini menggunakan mock data. Untuk production:

1. Uncomment bagian integrasi di setiap API route
2. Pastikan Zabbix dan Elasticsearch credentials sudah benar
3. Test koneksi ke kedua services
4. Setup data sync job untuk populate Elasticsearch
