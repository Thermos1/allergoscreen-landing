# Allergoscreen Landing — `www.allergoscreen.kz`

Маркетинговый сайт лаборатории «Аллергоскрин» (Караганда / Астана / Алматы / Темиртау). Astro 6 + Tailwind + 3 языка (RU / KK / EN). Чат-виджет интегрирован с SIPmind tenant 0001 (Дима).

## Локально

```bash
pnpm install
pnpm dev      # http://localhost:4321
pnpm build
pnpm preview
```

## Переменные окружения

| Var | Где живёт | Назначение |
|---|---|---|
| `PUBLIC_SIPMIND_API_KEY` | build-time | Widget-only ключ tenant 0001. Создавать в SIPmind Dashboard → Account → API Keys. **Не использовать Admin-ключ.** |
| `PUBLIC_SIPMIND_API_BASE` | build-time | По умолчанию `https://sipmind.net`. |
| `PUBLIC_SITE_URL` | build-time | По умолчанию `https://www.allergoscreen.kz`. На staging — другой. |
| `TELEGRAM_BOT_TOKEN` | runtime | Бот для нотификаций о лидах с формы. |
| `TELEGRAM_CHAT_ID` | runtime | `-5103750900` (operator group Allergoscreen). |
| `LEADS_DIR` | runtime | Папка JSONL-логов. В Coolify — persistent volume на `/data`. |

## Деплой (PS.KZ Coolify)

1. **GitHub:** запушить репо.
2. **Coolify (PS.KZ, http://94.247.130.164:8000):**
   - New Resource → Application → Public Repository
   - Build Pack: **Dockerfile**
   - Build args: `PUBLIC_SIPMIND_API_KEY`, `PUBLIC_SITE_URL`
   - Runtime env: `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`
   - Persistent storage: volume `/data` (для JSONL-логов)
   - Domain: на staging — sslip.io, Let's Encrypt автоматом
3. **DNS:** A-запись `www.allergoscreen.kz` и `allergoscreen.kz` → `94.247.130.164` (только когда staging апрувнут).
4. **Old site:** старый сайт на `185.98.5.103` оставить неделю на случай отката.

## Структура

```
src/
  pages/
    index.astro            ← RU homepage (default locale)
    kk/index.astro         ← Kazakh homepage
    en/index.astro         ← English homepage
    services.astro         ← каталог анализов
    locations.astro        ← 4 филиала
    about.astro            ← о лаборатории + технология ImAsa
    osms.astro             ← ОСМС
    privacy.astro
    offer.astro
    api/contact.ts         ← POST endpoint формы
  components/
    Widget.astro           ← SIPmind chat виджет
    Header.astro           ← с language switcher
    Footer.astro
    BregisBanner.astro     ← sticky-CTA на лабораторный портал
  layouts/Base.astro
  i18n/ui.ts               ← переводы RU/KK/EN
  lib/{telegram,leads-store,rate-limit}.ts
  styles/globals.css
public/
  brand/                   ← логотип, og-image
```

## Ассеты

См. [`ASSETS_NEEDED.md`](./ASSETS_NEEDED.md) — что попросить у Динары/SMM до запуска основного домена. Сейчас стоят плейсхолдеры.

## Чат-виджет

Виджет в `src/components/Widget.astro` — копия паттерна NIISE, перекрашен под Allergoscreen. Подключается к `sipmind.net/api/v1/widget/*` по Bearer `PUBLIC_SIPMIND_API_KEY`. Бэкенд резолвит ключ → tenant 0001 → промпт Димы → RAG + GPT-4o-mini. Welcome message приходит с бэка: «Здравствуйте! Лаборатория Аллергоскрин, меня зовут Дима. Слушаю вас.»

## Bregis-баннер

Sticky CTA «Получить результаты → allergoscreen.bregis.kz». Юридическое требование РК — пациент должен иметь защищённый канал получения результатов (не WhatsApp). Не убирать.
