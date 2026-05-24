// Price catalog — universal across languages.
// Translations come from src/i18n/ui.ts (filter labels, table headers, etc.)
// Test names are bilingual RU/EN where standard — we'll translate full UI strings via locale helpers below.

import type { Locale } from "../i18n/ui";

interface PriceRow {
  code: string;
  name: { ru: string; kk: string; en: string };
  price: number;
  unit?: string; // "₸/аллерген" etc.
  city_variance?: { karaganda: number; temirtau: number };
  osms?: boolean;
  notes?: { ru: string; kk: string; en: string };
}

interface Section {
  id: string;
  category: "allergy" | "autoimmune" | "hormones" | "oncology" | "general";
  title: { ru: string; kk: string; en: string };
  rows: PriceRow[];
}

export const SECTIONS: Section[] = [
  // --- Аллергология
  {
    id: "allergy-core",
    category: "allergy",
    title: { ru: "Аллергологические анализы", kk: "Аллергологиялық талдаулар", en: "Allergy tests" },
    rows: [
      {
        code: "imasa ИФА",
        name: {
          ru: "imasa ИФА — реакция на ваше вещество",
          kk: "imasa ИФА — сіздің затыңызға реакция",
          en: "imasa ELISA — reaction to your substance",
        },
        price: 6500,
        unit: "per_allergen",
        city_variance: { karaganda: 6000, temirtau: 6000 },
        osms: true,
      },
      {
        code: "IgE спец.",
        name: {
          ru: "Специфический IgE — стандартный аллерген",
          kk: "Спецификалық IgE — стандартты аллерген",
          en: "Specific IgE — standard allergen",
        },
        price: 6500,
        unit: "per_allergen",
        city_variance: { karaganda: 6000, temirtau: 6000 },
        osms: true,
      },
      {
        code: "IgE общ.",
        name: {
          ru: "Общий IgE — первичная диагностика",
          kk: "Жалпы IgE — алғашқы диагностика",
          en: "General IgE — initial diagnostics",
        },
        price: 3000,
        osms: true,
      },
      {
        code: "ALEX-300",
        name: {
          ru: "ALEX-300 — молекулярная панель на 300 аллергенов",
          kk: "ALEX-300 — 300 аллергенге молекулалық панель",
          en: "ALEX-300 — molecular panel of 300 allergens",
        },
        price: 90000,
        notes: { ru: "1–3 рабочих дня", kk: "1–3 жұмыс күні", en: "1–3 working days" },
      },
    ],
  },
  // --- Сервисы
  {
    id: "allergy-services",
    category: "allergy",
    title: { ru: "Сопутствующие услуги", kk: "Қосалқы қызметтер", en: "Adjacent services" },
    rows: [
      {
        code: "Консультация",
        name: {
          ru: "Консультация аллерголога-иммунолога (взрослый/детский)",
          kk: "Аллерголог-иммунологтың кеңесі (ересек/балалар)",
          en: "Allergist-immunologist consultation (adult/child)",
        },
        price: 10000,
      },
      {
        code: "Забор крови",
        name: { ru: "Забор крови (в клинике)", kk: "Қан алу (клиникада)", en: "Blood draw (at clinic)" },
        price: 1000,
      },
      {
        code: "Забор крови выезд",
        name: { ru: "Забор крови на дому (выезд)", kk: "Қан алу үйде (шығу)", en: "Blood draw (home visit)" },
        price: 10000,
        notes: { ru: "только Астана", kk: "тек Астана", en: "Astana only" },
      },
    ],
  },
  // --- Аутоиммунные: базовые (нРИФ)
  {
    id: "autoimmune-basic",
    category: "autoimmune",
    title: {
      ru: "Аутоиммунные — базовые (нРИФ)",
      kk: "Аутоиммунды — негізгі (нРИФ)",
      en: "Autoimmune — basic (IIF)",
    },
    rows: [
      { code: "1.1", name: { ru: "АНФ на клетках НЕр2 (титр)", kk: "АНФ НЕр2 жасушаларында (титр)", en: "ANF on HEp2 cells (titer)" }, price: 12000 },
      { code: "1.2", name: { ru: "Антитела к двуспиральной ДНК (титр)", kk: "Қос ширатылған ДНҚ-ға антиденелер (титр)", en: "Anti-dsDNA antibodies (titer)" }, price: 9000 },
      { code: "1.3", name: { ru: "Антитела к цитоплазме нейтрофилов (cANCA/pANCA + PR3, MPO, GBM)", kk: "Нейтрофилдер цитоплазмасына антиденелер (cANCA/pANCA + PR3, MPO, GBM)", en: "Anti-neutrophil cytoplasmic antibodies (cANCA/pANCA + PR3, MPO, GBM)" }, price: 35000 },
      { code: "1.4", name: { ru: "Скрининг аутоиммунных заболеваний печени и ЖКТ", kk: "Бауыр мен АІЖ аутоиммунды ауруларының скринингі", en: "Autoimmune hepatic & GI disease screening" }, price: 17000 },
      { code: "1.5", name: { ru: "Антитела к рецептору фосфолипазы А2", kk: "Фосфолипаза А2 рецепторына антиденелер", en: "Anti-phospholipase A2 receptor antibodies" }, price: 25000 },
      { code: "1.6", name: { ru: "Антитела к цитоплазме нейтрофилов (cANCA/pANCA)", kk: "Нейтрофилдер цитоплазмасына антиденелер (cANCA/pANCA)", en: "ANCA (cANCA/pANCA)" }, price: 21000 },
      { code: "1.7", name: { ru: "Антитела IgG к островковым клеткам поджелудочной железы (ICA)", kk: "Ұйқы безінің аралшық жасушаларына IgG антиденелері (ICA)", en: "IgG to pancreatic islet cells (ICA)" }, price: 18000 },
      { code: "1.8", name: { ru: "Антитела к аквапорину-4 (AQP4)", kk: "Аквапорин-4-ке антиденелер (AQP4)", en: "Anti-aquaporin-4 (AQP4) antibodies" }, price: 28000 },
    ],
  },
  // --- Аутоиммунные: иммуноблот
  {
    id: "autoimmune-blot",
    category: "autoimmune",
    title: {
      ru: "Аутоиммунные — иммуноблот",
      kk: "Аутоиммунды — иммуноблот",
      en: "Autoimmune — immunoblot",
    },
    rows: [
      { code: "2.1", name: { ru: "ANA, IgG, 22 антигена", kk: "ANA, IgG, 22 антиген", en: "ANA IgG, 22 antigens" }, price: 34000 },
      { code: "2.2", name: { ru: "Иммуноблот при заболеваниях печени, 9 антигенов", kk: "Бауыр ауруларында иммуноблот, 9 антиген", en: "Hepatic immunoblot, 9 antigens" }, price: 34000 },
      { code: "2.3", name: { ru: "Иммуноблот при АФС, IgG/IgM к 10 антигенам", kk: "АФС иммуноблоты, IgG/IgM 10 антигенге", en: "APS immunoblot, IgG/IgM to 10 antigens" }, price: 34000 },
      { code: "2.4", name: { ru: "Иммуноблот при диабете I типа, 5 антигенов", kk: "I типті диабет иммуноблоты, 5 антиген", en: "Type-1 diabetes immunoblot, 5 antigens" }, price: 30000 },
      { code: "2.5", name: { ru: "ANA, IgG, 17 антигенов", kk: "ANA, IgG, 17 антиген", en: "ANA IgG, 17 antigens" }, price: 22000 },
      { code: "2.6", name: { ru: "Миозиты/дерматомиозиты/склеродермия, 8 антигенов", kk: "Миозит/дерматомиозит/склеродермия, 8 антиген", en: "Myositis/dermatomyositis/scleroderma, 8 antigens" }, price: 28000 },
    ],
  },
  // --- Аутоиммунные пакеты
  {
    id: "autoimmune-packages",
    category: "autoimmune",
    title: {
      ru: "Комплексные пакеты (выгоднее отдельных тестов)",
      kk: "Кешенді пакеттер (жеке тесттерден тиімдірек)",
      en: "Disease packages (better value than individual tests)",
    },
    rows: [
      { code: "4.1", name: { ru: "Системные заболевания соединительной ткани", kk: "Дәнекер тіннің жүйелі аурулары", en: "Systemic connective tissue diseases" }, price: 54000 },
      { code: "4.2", name: { ru: "Аутоиммунные васкулиты", kk: "Аутоиммунды васкулиттер", en: "Autoimmune vasculitis" }, price: 32000 },
      { code: "4.3", name: { ru: "Аутоиммунные заболевания почек", kk: "Бүйректің аутоиммунды аурулары", en: "Autoimmune kidney disease" }, price: 73000 },
      { code: "4.4", name: { ru: "Аутоиммунные заболевания печени", kk: "Бауырдың аутоиммунды аурулары", en: "Autoimmune liver disease" }, price: 62000 },
      { code: "4.5", name: { ru: "Антифосфолипидный синдром", kk: "Антифосфолипидті синдром", en: "Antiphospholipid syndrome" }, price: 27000 },
      { code: "4.7", name: { ru: "Вторичный антифосфолипидный синдром", kk: "Қайталама антифосфолипидті синдром", en: "Secondary antiphospholipid syndrome" }, price: 45000 },
      { code: "4.8", name: { ru: "Аутоиммунный сахарный диабет I типа", kk: "I типті аутоиммунды диабет", en: "Type-1 autoimmune diabetes" }, price: 47000 },
      { code: "4.9", name: { ru: "Воспалительные заболевания кишечника (НЯК, БК)", kk: "Ішектің қабыну аурулары (НЯК, БК)", en: "Inflammatory bowel disease (UC, CD)" }, price: 48000 },
      { code: "4.10", name: { ru: "Миозиты, склеродермия", kk: "Миозиттер, склеродермия", en: "Myositis, scleroderma" }, price: 39000 },
    ],
  },
];

export function formatPrice(p: number): string {
  // 90000 → "90 000"
  return p.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

export function getRowName(row: PriceRow, locale: Locale): string {
  return row.name[locale] ?? row.name.ru;
}

export function getSectionTitle(s: Section, locale: Locale): string {
  return s.title[locale] ?? s.title.ru;
}

export function getNotes(row: PriceRow, locale: Locale): string | undefined {
  return row.notes ? (row.notes[locale] ?? row.notes.ru) : undefined;
}
