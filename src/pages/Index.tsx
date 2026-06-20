import { useState, useRef, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const nav = [
  { id: 'feed', label: 'Лента', icon: 'Newspaper' },
  { id: 'events', label: 'События', icon: 'CalendarDays' },
  { id: 'birthdays', label: 'Дни рождения', icon: 'Cake' },
  { id: 'team', label: 'Дирекция', icon: 'Network' },
  { id: 'onboarding', label: 'Онбординг', icon: 'GraduationCap' },
  { id: 'bot', label: 'Чат-бот', icon: 'Bot' },
];

const onboardingSteps = [
  {
    day: 'День 1',
    title: 'Добро пожаловать в GreenTeam!',
    color: '#FF6EC7',
    icon: 'Sparkles',
    tasks: [
      'Познакомься с командой — загляни в раздел «Дирекция»',
      'Получи доступы к корпоративным системам у HR',
      'Изучи корпоративные ценности и миссию Greenway Global',
      'Подпишись на корпоративный Telegram-канал',
    ],
  },
  {
    day: 'День 2–3',
    title: 'Погружение в продукт',
    color: '#00B5F0',
    icon: 'Package',
    tasks: [
      'Изучи линейку продуктов Greenway Global',
      'Пройди вводный курс по экосистеме бренда',
      'Познакомься с системой партнёрских уровней',
      'Посмотри видео-презентацию от руководителя дирекции',
    ],
  },
  {
    day: 'День 4–5',
    title: 'Инструменты и процессы',
    color: '#A8E63D',
    icon: 'Wrench',
    tasks: [
      'Освой CRM-систему — посмотри инструкцию',
      'Познакомься с процессом постановки задач',
      'Узнай о системе мотивации и бонусах',
      'Запланируй встречу с наставником',
    ],
  },
  {
    day: 'Неделя 2',
    title: 'Первые результаты',
    color: '#6C63FF',
    icon: 'TrendingUp',
    tasks: [
      'Поставь первые цели на месяц вместе с руководителем',
      'Прими участие в командной планёрке',
      'Пройди тест по знанию продукта',
      'Оставь отзыв об онбординге для HR 💚',
    ],
  },
];

const DIRECTORATES = [
  'CEO',
  'HRD',
  'Финансовая дирекция',
  'IT Дирекция',
  'Производственная дирекция',
  'Дирекция по логистике и ВЭД',
  'Дирекция клиентского сервиса',
  'Дирекция по правовым вопросам',
  'PR Дирекция',
  'Исполнительная дирекция',
  'Дирекция по экономике и развитию',
  'Дирекция по международному развитию',
];

const DIR_COLORS = [
  '#FF6EC7', '#00B5F0', '#A8E63D', '#FF9F43', '#6C63FF',
  '#FF6B6B', '#26de81', '#fd9644', '#45aaf2', '#a55eea',
  '#2bcbba', '#fc5c65',
];

type Employee = {
  id: number;
  name: string;
  role: string;
  directorate: string;
  isHead: boolean;
  phone: string;
  tg: string;
  startDate: string;   // дата начала работы YYYY-MM-DD
  birthday: string;    // день рождения YYYY-MM-DD
  photo: string;
  country: string;
  city: string;
  address: string;
};

const emptyEmployee = (): Employee => ({
  id: Date.now(),
  name: '',
  role: '',
  directorate: DIRECTORATES[0],
  isHead: false,
  phone: '',
  tg: '',
  startDate: '',
  birthday: '',
  photo: '',
  country: '',
  city: '',
  address: '',
});

// Стаж: если < 365 дней — показываем дни, иначе годы
const calcTenure = (startDate: string): string => {
  if (!startDate) return '';
  const start = new Date(startDate);
  const now = new Date();
  const diffMs = now.getTime() - start.getTime();
  if (diffMs < 0) return '';
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays < 365) return `${diffDays} ${declDays(diffDays)}`;
  const years = Math.floor(diffDays / 365);
  return `${years} ${declYears(years)}`;
};

const declDays = (n: number) => {
  if (n % 10 === 1 && n % 100 !== 11) return 'день';
  if ([2,3,4].includes(n % 10) && ![12,13,14].includes(n % 100)) return 'дня';
  return 'дней';
};
const declYears = (n: number) => {
  if (n % 10 === 1 && n % 100 !== 11) return 'год';
  if ([2,3,4].includes(n % 10) && ![12,13,14].includes(n % 100)) return 'года';
  return 'лет';
};

// Дни рождения: именинники сегодня и в ближайшие 7 дней
const getBirthdayStatus = (birthday: string): { label: string; urgent: boolean } | null => {
  if (!birthday) return null;
  const today = new Date();
  const bDay = new Date(birthday);
  const thisYear = new Date(today.getFullYear(), bDay.getMonth(), bDay.getDate());
  const diffMs = thisYear.getTime() - today.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return { label: 'Сегодня 🎉', urgent: true };
  if (diffDays === 1) return { label: 'Завтра 🎂', urgent: true };
  if (diffDays > 0 && diffDays <= 7) return { label: `Через ${diffDays} дн.`, urgent: false };
  return null;
};

const formatBirthday = (birthday: string): string => {
  if (!birthday) return '';
  const d = new Date(birthday);
  return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
};

const API = 'https://functions.poehali.dev/d42b88e7-b9e7-49e0-aa55-91f9406c1386';

const feed = [
  { author: 'Greenway Global', badge: 'Telegram', color: 'blue', time: '2 часа назад', text: 'Запускаем осеннюю акцию для партнёров! Новые бонусы по программе лояльности уже доступны в личном кабинете.', likes: 124, comments: 18 },
  { author: 'HR GreenTeam', badge: 'Новость', color: 'pink', time: 'Вчера', text: 'Поздравляем команду продаж с рекордным месяцем! Спасибо каждому за вклад в общий результат 💚', likes: 89, comments: 7 },
  { author: 'Отдел обучения', badge: 'Анонс', color: 'green', time: '2 дня назад', text: 'Новый онбординг-курс для новичков уже в Боттендере. Прокачай знания о продуктах за 5 дней.', likes: 56, comments: 12 },
];

const events = [
  { title: 'Корпоратив GreenTeam', date: '28 июня', place: 'Москва, Loft Hall', tag: 'Праздник', color: 'pink' },
  { title: 'Вебинар по новинкам', date: '2 июля', place: 'Онлайн, Zoom', tag: 'Обучение', color: 'blue' },
  { title: 'Тимбилдинг на природе', date: '12 июля', place: 'База «Сосны»', tag: 'Активность', color: 'green' },
];

const birthdays = [
  { name: 'Анна Соколова', date: 'Сегодня', role: 'Менеджер по продажам', today: true },
  { name: 'Игорь Лебедев', date: '22 июня', role: 'Аналитик', today: false },
  { name: 'Мария Кузнецова', date: '25 июня', role: 'HR-специалист', today: false },
];

const anniversaries = [
  { name: 'Дмитрий Орлов', years: 5, role: 'Руководитель направления' },
  { name: 'Елена Васильева', years: 3, role: 'Маркетолог' },
  { name: 'Павел Громов', years: 1, role: 'Менеджер' },
];

const colorMap: Record<string, string> = {
  pink: 'bg-brand-pink text-white',
  blue: 'bg-brand-blue text-white',
  green: 'bg-brand-green text-white',
};

const initials = (name: string) =>
  name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();

const GreenTeamLogo = ({ size = 44 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="24" fill="#00B5F0"/>
    <text x="50" y="38" textAnchor="middle" fontFamily="Nunito, Arial Rounded MT Bold, sans-serif" fontWeight="900" fontSize="30" fill="#FF6EC7" stroke="#fff" strokeWidth="2" paintOrder="stroke" letterSpacing="-1">GREEN</text>
    <path d="M50 42 C54 46 58 50 50 58 C42 50 46 46 50 42Z" fill="#A8E63D"/>
    <path d="M44 50 C48 46 52 46 56 50 C52 54 48 54 44 50Z" fill="#A8E63D"/>
    <circle cx="50" cy="50" r="3" fill="#00B5F0"/>
    <text x="50" y="82" textAnchor="middle" fontFamily="Nunito, Arial Rounded MT Bold, sans-serif" fontWeight="900" fontSize="30" fill="#FF6EC7" stroke="#fff" strokeWidth="2" paintOrder="stroke" letterSpacing="-1">TEAM</text>
  </svg>
);

const Index = () => {
  const [active, setActive] = useState('feed');
  const [botMsg, setBotMsg] = useState('');

  // Дирекция
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [teamSearch, setTeamSearch] = useState('');
  const [expandedDir, setExpandedDir] = useState<string | null>(null);
  const [editEmp, setEditEmp] = useState<Employee | null>(null);
  const [isNewEmp, setIsNewEmp] = useState(false);
  const [viewEmp, setViewEmp] = useState<Employee | null>(null);
  const photoRef = useRef<HTMLInputElement>(null);

  // Загрузка из БД при старте
  useEffect(() => {
    fetch(API)
      .then(r => r.json())
      .then(data => setEmployees(data))
      .catch(() => setEmployees([]))
      .finally(() => setLoading(false));
  }, []);

  const saveEmployee = async () => {
    if (!editEmp) return;
    setSaving(true);
    try {
      if (isNewEmp) {
        const res = await fetch(API, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editEmp),
        });
        const created = await res.json();
        setEmployees(prev => [...prev, created]);
      } else {
        const res = await fetch(`${API}/${editEmp.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editEmp),
        });
        const updated = await res.json();
        setEmployees(prev => prev.map(e => e.id === updated.id ? updated : e));
      }
    } finally {
      setSaving(false);
      setEditEmp(null);
      setIsNewEmp(false);
    }
  };

  const deleteEmployee = async (id: number) => {
    setViewEmp(null);
    await fetch(`${API}/${id}`, { method: 'DELETE' });
    setEmployees(prev => prev.filter(e => e.id !== id));
  };

  const handleEmpPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editEmp) return;
    const reader = new FileReader();
    reader.onload = (ev) => setEditEmp({ ...editEmp, photo: ev.target?.result as string });
    reader.readAsDataURL(file);
  };



  // Случайные заглушки для пустых полей
  const randPhone = () => `+7 9${String(Math.floor(Math.random()*100)).padStart(2,'0')} ${String(Math.floor(Math.random()*1000)).padStart(3,'0')}-${String(Math.floor(Math.random()*100)).padStart(2,'0')}-${String(Math.floor(Math.random()*100)).padStart(2,'0')}`;
  const randYear = () => String(2018 + Math.floor(Math.random() * 7));
  const randBirthYear = () => String(1980 + Math.floor(Math.random() * 20));
  const randMonth = () => String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
  const randDay = () => String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
  const randDir = () => DIRECTORATES[Math.floor(Math.random() * DIRECTORATES.length)];
  const cities = ['Москва', 'Санкт-Петербург', 'Алматы', 'Минск', 'Новосибирск', 'Краснодар', 'Екатеринбург'];
  const countries = ['Россия', 'Казахстан', 'Беларусь', 'Россия', 'Россия', 'Россия', 'Россия'];
  const randCity = () => { const i = Math.floor(Math.random() * cities.length); return { city: cities[i], country: countries[i] }; };

  // Форматируем дату из любого формата
  const fmtDate = (raw: string, fallbackYear: string) => {
    if (!raw) return `${fallbackYear}-${randMonth()}-${randDay()}`;
    const num = Number(raw);
    if (!isNaN(num) && num > 10000) {
      try {
        const d = XLSX.SSF.parse_date_code(num);
        return `${d.y}-${String(d.m).padStart(2,'0')}-${String(d.d).padStart(2,'0')}`;
      } catch { /* fallback */ }
    }
    const parts = raw.split(/[-./\s]/);
    if (parts.length >= 3) {
      const [a, b, c] = parts;
      if (a.length === 4) return `${a}-${b.padStart(2,'0')}-${c.padStart(2,'0')}`;
      if (c && c.length === 4) return `${c}-${b.padStart(2,'0')}-${a.padStart(2,'0')}`;
    }
    return `${fallbackYear}-${randMonth()}-${randDay()}`;
  };

  // Общая обработка строк Excel → БД
  // Читаем ВСЕ строки, для каждой берём все непустые ячейки
  const processRows = async (rows: string[][]) => {
    const errors: string[] = [];
    let added = 0;

    // Находим строку с данными — пропускаем заголовки
    // Заголовок — строка где нет ничего похожего на имя (ФИО обычно 2+ слова)
    let startRow = 0;
    for (let i = 0; i < Math.min(rows.length, 5); i++) {
      const r = rows[i];
      if (!r) continue;
      const first = String(r[0] || '').trim();
      // Если первая ячейка содержит 2+ слова кириллицей — это уже данные
      if (/[А-ЯЁа-яё]{2,}\s+[А-ЯЁа-яё]{2,}/.test(first)) { startRow = i; break; }
      // Иначе считаем строку заголовком
      startRow = i + 1;
    }

    for (let i = startRow; i < rows.length; i++) {
      const r = rows[i];
      // Собираем все непустые значения строки
      const vals = (r || []).map(v => String(v ?? '').trim()).filter(Boolean);
      if (vals.length === 0) continue;

      // Имя — первое значение из строки с двумя словами кириллицей, иначе первая непустая ячейка
      let name = '';
      let nameIdx = 0;
      for (let j = 0; j < (r || []).length; j++) {
        const v = String(r[j] || '').trim();
        if (/[А-ЯЁа-яё]{2,}\s+[А-ЯЁа-яё]{2,}/.test(v)) { name = v; nameIdx = j; break; }
      }
      if (!name) { name = String(r[0] || '').trim() || `Сотрудник ${i}`; nameIdx = 0; }

      // Должность — ищем строку без цифр, не похожую на имя, не похожую на дирекцию
      let role = '';
      for (let j = 0; j < (r || []).length; j++) {
        if (j === nameIdx) continue;
        const v = String(r[j] || '').trim();
        if (v && !/^\+?[\d\s\-()]+$/.test(v) && !/\d{4}-\d{2}-\d{2}/.test(v) && v.length > 2) {
          // Не имя (одно слово или уже нашли) и не похоже на дирекцию
          if (!DIRECTORATES.includes(v)) { role = v; break; }
        }
      }
      if (!role) role = 'Должность не указана';

      // Дирекция — ищем точное совпадение с нашим списком
      let directorate = '';
      for (const v of (r || []).map(x => String(x || '').trim())) {
        if (DIRECTORATES.includes(v)) { directorate = v; break; }
      }
      if (!directorate) directorate = randDir();

      // Телефон — ищем по паттерну +7 или 8 или просто цифры
      let phone = '';
      for (const v of (r || []).map(x => String(x || '').trim())) {
        if (/^\+?[78][\s\d\-()]{9,}/.test(v) || /^\d{10,11}$/.test(v.replace(/\D/g,''))) {
          phone = v; break;
        }
      }
      if (!phone) phone = randPhone();

      // Telegram — ищем @
      let tg = '';
      for (const v of (r || []).map(x => String(x || '').trim())) {
        if (v.startsWith('@')) { tg = v; break; }
      }

      const loc = randCity();

      const emp: Omit<Employee, 'id'> = {
        name,
        role,
        directorate,
        isHead: false,
        phone,
        tg,
        startDate: `${randYear()}-${randMonth()}-${randDay()}`,
        birthday: `${randBirthYear()}-${randMonth()}-${randDay()}`,
        photo: '',
        country: loc.country,
        city: loc.city,
        address: '',
      };

      try {
        const res = await fetch(API, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(emp) });
        const created = await res.json();
        setEmployees(prev => [...prev, created]);
        added++;
      } catch { errors.push(`Строка ${i + 1} (${name}): ошибка сохранения`); }
    }
    return { added, errors };
  };

  // Импорт из URL
  const importFromUrl = async (url: string) => {
    setImporting(true);
    setImportResult(null);
    try {
      const res = await fetch(url);
      const arrayBuffer = await res.arrayBuffer();
      const data = new Uint8Array(arrayBuffer);
      const wb = XLSX.read(data, { type: 'array' });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const rows: string[][] = XLSX.utils.sheet_to_json(ws, { header: 1 });
      const result = await processRows(rows);
      setImportResult(result);
    } catch (err) {
      setImportResult({ added: 0, errors: ['Не удалось загрузить файл по ссылке'] });
    } finally {
      setImporting(false);
    }
  };

  // Импорт из Excel
  const handleXlsx = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);
    setImportResult(null);
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const data = new Uint8Array(ev.target?.result as ArrayBuffer);
      const wb = XLSX.read(data, { type: 'array' });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const rows: string[][] = XLSX.utils.sheet_to_json(ws, { header: 1 });

      const errors: string[] = [];
      let added = 0;

      // Пропускаем заголовок (строка 0)
      for (let i = 1; i < rows.length; i++) {
        const r = rows[i];
        if (!r || r.length === 0) continue;
        const name = String(r[0] || '').trim();
        const role = String(r[1] || '').trim();
        const directorate = String(r[2] || '').trim();
        if (!name || !role) { errors.push(`Строка ${i + 1}: нет имени или должности`); continue; }
        if (!DIRECTORATES.includes(directorate)) { errors.push(`Строка ${i + 1} (${name}): дирекция «${directorate}» не найдена`); continue; }

        const emp: Omit<Employee, 'id'> = {
          name,
          role,
          directorate,
          isHead: String(r[3] || '').toLowerCase().trim() === 'да',
          phone: String(r[4] || '').trim(),
          tg: String(r[5] || '').trim(),
          startDate: String(r[6] || '').trim(),
          birthday: String(r[7] || '').trim(),
          photo: '',
          country: String(r[8] || '').trim(),
          city: String(r[9] || '').trim(),
          address: String(r[10] || '').trim(),
        };

        try {
          const res = await fetch(API, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(emp),
          });
          const created = await res.json();
          setEmployees(prev => [...prev, created]);
          added++;
        } catch {
          errors.push(`Строка ${i + 1} (${name}): ошибка сохранения`);
        }
      }

  // Именинники сегодня и ближайшие 7 дней из базы сотрудников
  const upcomingBirthdays = employees
    .map(e => ({ emp: e, status: getBirthdayStatus(e.birthday) }))
    .filter(x => x.status !== null)
    .sort((a, b) => {
      if (a.status!.urgent && !b.status!.urgent) return -1;
      if (!a.status!.urgent && b.status!.urgent) return 1;
      return 0;
    });

  // Поиск по всем сотрудникам
  const searchResults = teamSearch.trim()
    ? employees.filter(e =>
        e.name.toLowerCase().includes(teamSearch.toLowerCase()) ||
        e.role.toLowerCase().includes(teamSearch.toLowerCase()) ||
        e.directorate.toLowerCase().includes(teamSearch.toLowerCase())
      )
    : null;

  // Сотрудники по дирекции
  const byDir = (dir: string) => employees.filter(e => e.directorate === dir);
  const headOf = (dir: string) => employees.find(e => e.directorate === dir && e.isHead);

  return (
    <div className="min-h-screen" style={{ background: '#f0f8ff' }}>

      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl border-b" style={{ background: 'rgba(0,181,240,0.12)' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <GreenTeamLogo size={42} />
            <div className="leading-tight">
              <p className="font-display font-black text-xl" style={{ color: '#00B5F0', letterSpacing: '-0.5px' }}>GreenTeam</p>
              <p className="text-[11px] text-muted-foreground -mt-0.5 font-semibold">Greenway Global</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="rounded-full relative">
              <Icon name="Bell" size={20} />
              <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-brand-pink ring-2 ring-white" />
            </Button>
            <Avatar className="h-9 w-9 border-2" style={{ borderColor: '#A8E63D' }}>
              <AvatarFallback className="font-bold" style={{ background: '#A8E63D', color: '#1a1a1a' }}>Я</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-8">
        <div className="rounded-3xl overflow-hidden shadow-2xl animate-scale-in" style={{ background: '#00B5F0' }}>
          <div className="relative">
            <img
              src="https://cdn.poehali.dev/projects/b3633dd3-0424-4d83-af84-1d2d5d55dfc4/bucket/cb4ec47f-04ed-494b-9fbf-54da89bba876.jpg"
              alt="Команда GreenTeam"
              className="w-full object-contain"
              style={{ maxHeight: '420px', objectPosition: 'center top' }}
            />
            <div className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none"
              style={{ background: 'linear-gradient(to top, #00B5F0 0%, transparent 100%)' }} />
          </div>
          <div className="px-8 sm:px-12 pb-8 text-white -mt-4 relative z-10">
            <div className="flex flex-wrap items-end gap-4 justify-between">
              <div>
                <p className="text-white/70 text-sm font-semibold uppercase tracking-widest mb-1">Внутренний портал</p>
                <h1 className="font-display font-black leading-none" style={{ fontSize: 'clamp(2.5rem, 7vw, 5rem)', letterSpacing: '-2px' }}>
                  Привет, <span style={{ color: '#FF6EC7' }}>GreenTeam!</span>
                </h1>
                <p className="mt-2 text-white/85 text-base sm:text-lg max-w-xl">
                  Новости, события и жизнь компании Greenway Global — в одном месте.
                </p>
              </div>
              <div className="flex gap-3 flex-shrink-0">
                <div className="rounded-2xl px-5 py-3 text-center" style={{ background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(8px)' }}>
                  <p className="font-display font-black text-2xl">{employees.length}</p>
                  <p className="text-xs text-white/80">сотрудников</p>
                </div>
                <div className="rounded-2xl px-5 py-3 text-center" style={{ background: 'rgba(168,230,61,0.3)', backdropFilter: 'blur(8px)' }}>
                  <p className="font-display font-black text-2xl">12</p>
                  <p className="text-xs text-white/80">дирекций</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Nav */}
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 mt-5 sticky top-16 z-30">
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
          {nav.map((n) => (
            <button
              key={n.id}
              onClick={() => setActive(n.id)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full whitespace-nowrap text-sm font-bold transition-all"
              style={active === n.id
                ? { background: '#00B5F0', color: '#fff', boxShadow: '0 4px 20px rgba(0,181,240,0.4)' }
                : { background: '#fff', color: '#555', border: '1.5px solid #e0e0e0' }}
            >
              <Icon name={n.icon} size={17} />
              {n.label}
            </button>
          ))}
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">

          {/* ЛЕНТА */}
          {active === 'feed' && (
            <div className="space-y-4 animate-fade-in">
              {feed.map((post, i) => (
                <Card key={i} className="p-5 rounded-2xl border-0 shadow-sm hover-lift bg-white">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-11 w-11">
                      <AvatarFallback className={colorMap[post.color]} style={{ fontFamily: 'Nunito', fontWeight: 900 }}>
                        {initials(post.author)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-bold">{post.author}</p>
                        <Badge variant="secondary" className="text-[10px] rounded-full">{post.badge}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{post.time}</p>
                    </div>
                    <Icon name="MoreHorizontal" size={18} className="text-muted-foreground" />
                  </div>
                  <p className="mt-3 text-[15px] leading-relaxed">{post.text}</p>
                  <div className="mt-4 flex items-center gap-5 text-sm text-muted-foreground">
                    <button className="flex items-center gap-1.5 hover:text-brand-pink transition-colors">
                      <Icon name="Heart" size={17} /> {post.likes}
                    </button>
                    <button className="flex items-center gap-1.5 hover:text-brand-blue transition-colors">
                      <Icon name="MessageCircle" size={17} /> {post.comments}
                    </button>
                    <button className="flex items-center gap-1.5 ml-auto hover:text-brand-green transition-colors">
                      <Icon name="Share2" size={17} />
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* СОБЫТИЯ */}
          {active === 'events' && (
            <div className="space-y-4 animate-fade-in">
              {events.map((e, i) => (
                <Card key={i} className="p-5 rounded-2xl border-0 shadow-sm hover-lift bg-white flex items-center gap-4">
                  <div className={`h-14 w-14 shrink-0 rounded-2xl flex items-center justify-center ${colorMap[e.color]}`}>
                    <Icon name="Calendar" size={22} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-lg">{e.title}</h3>
                      <Badge variant="secondary" className="rounded-full text-[10px]">{e.tag}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground flex items-center gap-3 mt-1">
                      <span className="flex items-center gap-1"><Icon name="Clock" size={14} />{e.date}</span>
                      <span className="flex items-center gap-1"><Icon name="MapPin" size={14} />{e.place}</span>
                    </p>
                  </div>
                  <Button size="sm" className="rounded-full text-white font-bold shrink-0" style={{ background: '#00B5F0' }}>Пойду</Button>
                </Card>
              ))}
            </div>
          )}

          {/* ДНИ РОЖДЕНИЯ */}
          {active === 'birthdays' && (
            <div className="space-y-5 animate-fade-in">
              <div className="space-y-3">
                <h3 className="font-display font-black text-xl flex items-center gap-2" style={{ color: '#FF6EC7' }}>
                  <Icon name="Cake" size={22} /> Ближайшие дни рождения
                </h3>
                {birthdays.map((b, i) => (
                  <Card key={i} className="p-4 rounded-2xl border-0 shadow-sm hover-lift bg-white flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="font-black text-white" style={{ background: '#FF6EC7', fontFamily: 'Nunito' }}>
                        {initials(b.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-bold">{b.name}</p>
                      <p className="text-sm text-muted-foreground">{b.role}</p>
                    </div>
                    {b.today
                      ? <Badge className="rounded-full text-white font-bold" style={{ background: '#FF6EC7' }}>Сегодня 🎉</Badge>
                      : <span className="text-sm font-semibold text-muted-foreground">{b.date}</span>}
                  </Card>
                ))}
              </div>
              <div className="space-y-3">
                <h3 className="font-display font-black text-xl flex items-center gap-2" style={{ color: '#4caf20' }}>
                  <Icon name="Award" size={22} /> Стаж в компании
                </h3>
                <div className="grid sm:grid-cols-3 gap-3">
                  {anniversaries.map((a, i) => (
                    <Card key={i} className="p-4 rounded-2xl border-0 shadow-sm hover-lift bg-white text-center">
                      <div className="mx-auto h-14 w-14 rounded-full flex items-center justify-center font-display font-black text-xl"
                        style={{ background: '#A8E63D', color: '#1a1a1a' }}>
                        {a.years}
                      </div>
                      <p className="mt-2 text-xs font-bold" style={{ color: '#4caf20' }}>
                        {a.years === 1 ? 'год' : 'лет'} в команде
                      </p>
                      <p className="mt-1 font-bold text-sm">{a.name}</p>
                      <p className="text-xs text-muted-foreground">{a.role}</p>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ДИРЕКЦИЯ */}
          {active === 'team' && (
            <div className="animate-fade-in space-y-4">

              {/* Загрузка */}
              {loading && (
                <div className="flex items-center justify-center py-16 gap-3 text-muted-foreground">
                  <div className="h-6 w-6 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: '#00B5F0', borderTopColor: 'transparent' }} />
                  Загружаю сотрудников...
                </div>
              )}

              {/* Поиск + кнопка добавить */}
              {!loading && (
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={teamSearch}
                    onChange={e => setTeamSearch(e.target.value)}
                    placeholder="Поиск по имени, должности, дирекции..."
                    className="rounded-full pl-9"
                  />
                </div>
                <Button
                  variant="outline"
                  className="rounded-full font-bold shrink-0"
                  style={{ borderColor: '#A8E63D', color: '#4caf20' }}
                  onClick={() => { setShowImport(true); setImportResult(null); }}
                >
                  <Icon name="FileSpreadsheet" size={16} className="mr-1" /> Excel
                </Button>
                <Button
                  className="rounded-full font-bold text-white shrink-0"
                  style={{ background: '#FF6EC7' }}
                  onClick={() => { setEditEmp(emptyEmployee()); setIsNewEmp(true); }}
                >
                  <Icon name="Plus" size={16} className="mr-1" /> Сотрудник
                </Button>
              </div>
              )}

              {/* Результаты поиска */}
              {!loading && searchResults && (
                <div className="space-y-2">
                  <p className="text-sm font-bold text-muted-foreground px-1">
                    Найдено: {searchResults.length} чел.
                  </p>
                  {searchResults.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">Никого не найдено</p>
                  )}
                  {searchResults.map(emp => {
                    const dirIdx = DIRECTORATES.indexOf(emp.directorate);
                    const color = DIR_COLORS[dirIdx] ?? '#00B5F0';
                    return (
                      <Card key={emp.id} className="p-4 rounded-2xl border-0 shadow-sm bg-white flex items-center gap-3 hover-lift cursor-pointer"
                        onClick={() => setViewEmp(emp)}>
                        <Avatar className="h-11 w-11 shrink-0">
                          <AvatarImage src={emp.photo} />
                          <AvatarFallback className="font-black text-white" style={{ background: color }}>
                            {initials(emp.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold truncate">{emp.name}</p>
                          <p className="text-sm text-muted-foreground truncate">{emp.role}</p>
                        </div>
                        <Badge variant="secondary" className="rounded-full text-xs shrink-0">{emp.directorate}</Badge>
                        {emp.isHead && <Icon name="Crown" size={16} style={{ color: '#FF9F43', flexShrink: 0 }} />}
                      </Card>
                    );
                  })}
                </div>
              )}

              {/* 12 дирекций — аккордеон */}
              {!loading && !searchResults && (
                <div className="space-y-3">
                  {DIRECTORATES.map((dir, idx) => {
                    const color = DIR_COLORS[idx];
                    const members = byDir(dir);
                    const head = headOf(dir);
                    const isOpen = expandedDir === dir;

                    return (
                      <Card key={dir} className="rounded-2xl border-0 shadow-sm overflow-hidden bg-white">
                        {/* Заголовок дирекции */}
                        <button
                          className="w-full flex items-center gap-3 p-4 text-left transition-colors hover:bg-gray-50"
                          onClick={() => setExpandedDir(isOpen ? null : dir)}
                        >
                          <div className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0"
                            style={{ background: color + '22' }}>
                            <Icon name="Building2" size={20} style={{ color }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-black text-base" style={{ color }}>{dir}</p>
                            {head ? (
                              <p className="text-xs text-muted-foreground truncate flex items-center gap-1">
                                <Icon name="Crown" size={11} style={{ color: '#FF9F43' }} />
                                {head.name} · {head.role}
                              </p>
                            ) : (
                              <p className="text-xs text-muted-foreground italic">Руководитель не назначен</p>
                            )}
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <Badge variant="secondary" className="rounded-full text-xs">
                              {members.length} чел.
                            </Badge>
                            <Icon name={isOpen ? 'ChevronUp' : 'ChevronDown'} size={18} className="text-muted-foreground" />
                          </div>
                        </button>

                        {/* Раскрытый список */}
                        {isOpen && (
                          <div className="border-t" style={{ borderColor: color + '33' }}>
                            {/* Руководитель */}
                            {head && (
                              <div className="px-4 py-3" style={{ background: color + '0d' }}>
                                <p className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color }}>
                                  Руководитель
                                </p>
                                <div className="flex items-center gap-3 cursor-pointer" onClick={() => setViewEmp(head)}>
                                  <Avatar className="h-12 w-12 border-2" style={{ borderColor: color }}>
                                    <AvatarImage src={head.photo} />
                                    <AvatarFallback className="font-black text-white" style={{ background: color }}>
                                      {initials(head.name)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1">
                                    <p className="font-black">{head.name}</p>
                                    <p className="text-sm font-semibold" style={{ color }}>{head.role}</p>
                                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                                      {calcTenure(head.startDate) && <span className="text-[10px] text-muted-foreground">{calcTenure(head.startDate)} в команде</span>}
                                      {getBirthdayStatus(head.birthday) && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: '#FF6EC7', color: '#fff' }}>🎂 {getBirthdayStatus(head.birthday)!.label}</span>}
                                    </div>
                                  </div>
                                  <Icon name="Crown" size={18} style={{ color: '#FF9F43', flexShrink: 0 }} />
                                </div>
                              </div>
                            )}

                            {/* Команда */}
                            {members.filter(m => !m.isHead).length > 0 && (
                              <div className="px-4 py-3 space-y-2">
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">
                                  Команда
                                </p>
                                {members.filter(m => !m.isHead).map(emp => {
                                  const bdStatus = getBirthdayStatus(emp.birthday);
                                  return (
                                    <div key={emp.id}
                                      className="flex items-center gap-3 p-2 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors"
                                      onClick={() => setViewEmp(emp)}>
                                      <Avatar className="h-9 w-9">
                                        <AvatarImage src={emp.photo} />
                                        <AvatarFallback className="font-black text-white text-sm" style={{ background: color + 'aa' }}>
                                          {initials(emp.name)}
                                        </AvatarFallback>
                                      </Avatar>
                                      <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-sm truncate">{emp.name}</p>
                                        <p className="text-xs text-muted-foreground truncate">{emp.role}</p>
                                      </div>
                                      <div className="flex flex-col items-end gap-1 shrink-0">
                                        {bdStatus && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: '#FF6EC7', color: '#fff' }}>🎂 {bdStatus.label}</span>}
                                        {calcTenure(emp.startDate) && <span className="text-[10px] text-muted-foreground">{calcTenure(emp.startDate)}</span>}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}

                            {members.length === 0 && (
                              <p className="px-4 py-4 text-sm text-muted-foreground italic">Сотрудники ещё не добавлены</p>
                            )}

                            <div className="px-4 py-3 border-t" style={{ borderColor: color + '22' }}>
                              <Button size="sm" variant="outline" className="rounded-full text-xs font-bold w-full"
                                style={{ borderColor: color, color }}
                                onClick={(e) => { e.stopPropagation(); setEditEmp({ ...emptyEmployee(), directorate: dir }); setIsNewEmp(true); }}>
                                <Icon name="UserPlus" size={14} className="mr-1" /> Добавить сотрудника
                              </Button>
                            </div>
                          </div>
                        )}
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ОНБОРДИНГ */}
          {active === 'onboarding' && (
            <div className="animate-fade-in space-y-4">
              {/* Hero онбординга */}
              <div className="rounded-2xl p-6 text-white relative overflow-hidden" style={{ background: '#00B5F0' }}>
                <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full opacity-20" style={{ background: '#FF6EC7' }} />
                <div className="absolute right-8 bottom-0 h-16 w-16 rounded-full opacity-20" style={{ background: '#A8E63D' }} />
                <div className="relative">
                  <Badge className="bg-white/20 text-white border-0 mb-3">Новый сотрудник</Badge>
                  <h2 className="font-display font-black text-2xl sm:text-3xl">Добро пожаловать<br/>в <span style={{ color: '#FF6EC7' }}>GreenTeam!</span></h2>
                  <p className="mt-2 text-white/85 text-sm max-w-md">
                    Мы рады, что ты с нами! Этот план поможет тебе быстро влиться в команду и начать работу.
                  </p>
                  <div className="mt-4 flex gap-3">
                    <div className="rounded-xl px-4 py-2 text-center" style={{ background: 'rgba(255,255,255,0.2)' }}>
                      <p className="font-display font-black text-xl">4</p>
                      <p className="text-xs text-white/80">этапа</p>
                    </div>
                    <div className="rounded-xl px-4 py-2 text-center" style={{ background: 'rgba(168,230,61,0.3)' }}>
                      <p className="font-display font-black text-xl">14</p>
                      <p className="text-xs text-white/80">заданий</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Шаги онбординга */}
              {onboardingSteps.map((step, si) => (
                <Card key={si} className="rounded-2xl border-0 shadow-sm overflow-hidden bg-white">
                  <div className="flex items-center gap-3 p-4" style={{ borderLeft: `4px solid ${step.color}` }}>
                    <div className="h-11 w-11 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: step.color + '20' }}>
                      <Icon name={step.icon} size={22} style={{ color: step.color }} />
                    </div>
                    <div>
                      <p className="text-xs font-black uppercase tracking-wider" style={{ color: step.color }}>{step.day}</p>
                      <p className="font-black text-base">{step.title}</p>
                    </div>
                  </div>
                  <div className="px-4 pb-4 space-y-2">
                    {step.tasks.map((task, ti) => (
                      <label key={ti} className="flex items-start gap-3 cursor-pointer group">
                        <div className="mt-0.5 h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors group-hover:border-current"
                          style={{ borderColor: step.color + '60' }}>
                          <div className="h-2.5 w-2.5 rounded-full" style={{ background: step.color + '40' }} />
                        </div>
                        <span className="text-sm leading-relaxed">{task}</span>
                      </label>
                    ))}
                  </div>
                </Card>
              ))}

              {/* Кнопка чат-бота */}
              <Card className="rounded-2xl border-0 shadow-sm p-5 bg-white flex items-center gap-4">
                <div className="h-14 w-14 rounded-2xl flex items-center justify-center shrink-0" style={{ background: '#FF6EC7' }}>
                  <Icon name="Bot" size={26} className="text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-black">Есть вопросы?</p>
                  <p className="text-sm text-muted-foreground">Наш чат-бот ответит на любой вопрос по работе в команде</p>
                </div>
                <Button className="rounded-full font-bold text-white shrink-0" style={{ background: '#FF6EC7' }}
                  onClick={() => window.open('https://t.me/green_team_2_0_bot', '_blank')}>
                  Открыть бот
                </Button>
              </Card>
            </div>
          )}

          {/* ЧАТ-БОТ */}
          {active === 'bot' && (
            <div className="animate-fade-in flex flex-col items-center justify-center py-8">
              <div className="w-full max-w-md text-center">
                {/* Большая иконка */}
                <div className="mx-auto h-28 w-28 rounded-3xl flex items-center justify-center shadow-xl mb-6"
                  style={{ background: 'linear-gradient(135deg, #00B5F0, #FF6EC7)' }}>
                  <Icon name="Bot" size={52} className="text-white" />
                </div>
                <h2 className="font-display font-black text-3xl mb-2">Чат-бот<br/><span style={{ color: '#FF6EC7' }}>GreenTeam</span></h2>
                <p className="text-muted-foreground mb-2">@green_team_2_0_bot</p>
                <p className="text-sm text-muted-foreground max-w-xs mx-auto mb-8">
                  Задай любой вопрос — о продуктах, процессах, команде или онбординге. Бот работает 24/7.
                </p>

                <Button
                  className="rounded-full font-black text-white px-8 py-6 text-lg shadow-lg hover:scale-105 transition-transform"
                  style={{ background: '#00B5F0' }}
                  onClick={() => window.open('https://t.me/green_team_2_0_bot', '_blank')}
                >
                  <Icon name="Send" size={20} className="mr-2" />
                  Открыть в Telegram
                </Button>

                <div className="mt-8 grid grid-cols-3 gap-3 text-center">
                  {[
                    { icon: 'Clock', label: 'Работает 24/7' },
                    { icon: 'Zap', label: 'Быстрые ответы' },
                    { icon: 'ShieldCheck', label: 'Корпоративный' },
                  ].map((f, i) => (
                    <div key={i} className="bg-white rounded-2xl p-3 shadow-sm">
                      <Icon name={f.icon} size={22} className="mx-auto mb-1" style={{ color: i === 0 ? '#FF6EC7' : i === 1 ? '#00B5F0' : '#A8E63D' }} />
                      <p className="text-xs font-semibold">{f.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="space-y-4">
          {/* Чат-бот — быстрый доступ */}
          <Card className="p-5 rounded-2xl border-0 shadow-sm text-white overflow-hidden relative" style={{ background: 'linear-gradient(135deg, #FF6EC7, #00B5F0)' }}>
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-20 bg-white" />
            <Icon name="Bot" size={22} />
            <p className="font-display font-black mt-2 text-lg">Чат-бот GreenTeam</p>
            <p className="text-sm text-white/85 mt-1">Задай вопрос боту — ответит мгновенно 24/7</p>
            <Button className="mt-4 w-full rounded-full font-black" style={{ background: '#fff', color: '#FF6EC7' }}
              onClick={() => window.open('https://t.me/green_team_2_0_bot', '_blank')}>
              <Icon name="Send" size={15} className="mr-1" /> @green_team_2_0_bot
            </Button>
          </Card>

          {/* Уведомления о днях рождения — авто из базы */}
          {upcomingBirthdays.length > 0 && (
            <Card className="p-5 rounded-2xl border-0 shadow-sm bg-white">
              <p className="font-bold flex items-center gap-2 mb-3" style={{ color: '#FF6EC7' }}>
                <Icon name="Cake" size={18} /> Дни рождения
              </p>
              <div className="space-y-3">
                {upcomingBirthdays.map(({ emp, status }) => {
                  const dirIdx = DIRECTORATES.indexOf(emp.directorate);
                  const color = DIR_COLORS[dirIdx] ?? '#FF6EC7';
                  return (
                    <div key={emp.id} className="flex items-center gap-2">
                      <Avatar className="h-9 w-9 shrink-0">
                        <AvatarImage src={emp.photo} />
                        <AvatarFallback className="font-black text-white text-xs" style={{ background: color }}>
                          {initials(emp.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm truncate">{emp.name}</p>
                        <p className="text-xs text-muted-foreground">{formatBirthday(emp.birthday)}</p>
                      </div>
                      <Badge className="rounded-full text-xs shrink-0 font-bold"
                        style={status!.urgent
                          ? { background: '#FF6EC7', color: '#fff' }
                          : { background: '#f0f8ff', color: '#00B5F0', border: '1px solid #00B5F0' }}>
                        {status!.label}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}

          {active === 'team' && (
            <Card className="p-5 rounded-2xl border-0 shadow-sm bg-white">
              <p className="font-bold flex items-center gap-2 mb-3" style={{ color: '#00B5F0' }}>
                <Icon name="Network" size={18} /> Дирекции
              </p>
              <div className="space-y-1">
                {DIRECTORATES.map((dir, idx) => {
                  const color = DIR_COLORS[idx];
                  const count = byDir(dir).length;
                  return (
                    <button key={dir}
                      className="w-full flex items-center gap-2 py-1.5 px-2 rounded-xl hover:bg-gray-50 transition-colors text-left"
                      onClick={() => { setExpandedDir(dir); setTeamSearch(''); }}>
                      <span className="h-2 w-2 rounded-full shrink-0" style={{ background: color }} />
                      <span className="text-xs font-semibold flex-1 truncate">{dir}</span>
                      <span className="text-xs text-muted-foreground">{count}</span>
                    </button>
                  );
                })}
              </div>
            </Card>
          )}

          {active !== 'team' && (
            <Card className="p-5 rounded-2xl border-0 shadow-sm bg-white">
              <p className="font-bold flex items-center gap-2 mb-3" style={{ color: '#00B5F0' }}>
                <Icon name="Bell" size={18} /> Уведомления
              </p>
              <ul className="space-y-3 text-sm">
                <li className="flex gap-2 items-start">
                  <span className="mt-0.5 h-5 w-5 shrink-0 rounded-full flex items-center justify-center" style={{ background: '#A8E63D' }}>
                    <Icon name="CalendarDays" size={12} className="text-[#1a1a1a]" />
                  </span>
                  Корпоратив через 8 дней
                </li>
                <li className="flex gap-2 items-start">
                  <span className="mt-0.5 h-5 w-5 shrink-0 rounded-full flex items-center justify-center" style={{ background: '#FF6EC7' }}>
                    <Icon name="Award" size={12} className="text-white" />
                  </span>
                  У Дмитрия 5 лет в компании
                </li>
                <li className="flex gap-2 items-start">
                  <span className="mt-0.5 h-5 w-5 shrink-0 rounded-full flex items-center justify-center" style={{ background: '#00B5F0' }}>
                    <Icon name="GraduationCap" size={12} className="text-white" />
                  </span>
                  Новый курс в Боттендере
                </li>
              </ul>
            </Card>
          )}
        </aside>
      </main>

      {/* Просмотр сотрудника */}
      <Dialog open={!!viewEmp} onOpenChange={() => setViewEmp(null)}>
        <DialogContent className="rounded-2xl max-w-sm p-0 overflow-hidden">
          {viewEmp && (() => {
            const dirIdx = DIRECTORATES.indexOf(viewEmp.directorate);
            const color = DIR_COLORS[dirIdx] ?? '#00B5F0';
            return (
              <>
                <div className="h-24 relative" style={{ background: color }}>
                  <div className="absolute inset-0 opacity-20"
                    style={{ backgroundImage: 'radial-gradient(circle at 80% 20%, white 0%, transparent 60%)' }} />
                  <div className="absolute -bottom-8 left-5">
                    <Avatar className="h-16 w-16 border-4 border-white shadow-xl">
                      <AvatarImage src={viewEmp.photo} />
                      <AvatarFallback className="font-black text-white text-xl" style={{ background: color }}>
                        {initials(viewEmp.name)}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  {viewEmp.isHead && (
                    <div className="absolute top-3 right-4 flex items-center gap-1 rounded-full px-2 py-1 text-xs font-bold"
                      style={{ background: 'rgba(255,255,255,0.25)', color: '#fff' }}>
                      <Icon name="Crown" size={13} /> Руководитель
                    </div>
                  )}
                </div>
                <div className="pt-12 px-5 pb-5 space-y-3">
                  <div>
                    <h2 className="font-display font-black text-xl">{viewEmp.name}</h2>
                    <p className="font-semibold text-sm" style={{ color }}>{viewEmp.role}</p>
                    <div className="flex gap-2 mt-2 flex-wrap">
                      <Badge variant="secondary" className="rounded-full text-xs">{viewEmp.directorate}</Badge>
                      {calcTenure(viewEmp.startDate) && (
                        <Badge className="rounded-full text-xs font-bold" style={{ background: '#A8E63D', color: '#1a1a1a' }}>
                          {calcTenure(viewEmp.startDate)} в команде
                        </Badge>
                      )}
                      {getBirthdayStatus(viewEmp.birthday) && (
                        <Badge className="rounded-full text-xs font-bold" style={{ background: '#FF6EC7', color: '#fff' }}>
                          {getBirthdayStatus(viewEmp.birthday)!.label}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    {viewEmp.phone && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Icon name="Phone" size={15} style={{ color } as React.CSSProperties} />
                        <a href={`tel:${viewEmp.phone}`} className="hover:underline">{viewEmp.phone}</a>
                      </div>
                    )}
                    {viewEmp.tg && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Icon name="Send" size={15} style={{ color } as React.CSSProperties} />
                        <span>{viewEmp.tg}</span>
                      </div>
                    )}
                    {viewEmp.birthday && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Icon name="Cake" size={15} style={{ color } as React.CSSProperties} />
                        <span>{formatBirthday(viewEmp.birthday)}</span>
                      </div>
                    )}
                    {viewEmp.startDate && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Icon name="CalendarCheck" size={15} style={{ color } as React.CSSProperties} />
                        <span>В компании с {new Date(viewEmp.startDate).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                      </div>
                    )}
                    {(viewEmp.country || viewEmp.city || viewEmp.address) && (
                      <div className="flex items-start gap-2 text-muted-foreground">
                        <Icon name="MapPin" size={15} className="mt-0.5 shrink-0" style={{ color } as React.CSSProperties} />
                        <span>{[viewEmp.country, viewEmp.city, viewEmp.address].filter(Boolean).join(', ')}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 pt-1">
                    <Button className="flex-1 rounded-full font-bold" variant="outline"
                      onClick={() => { setViewEmp(null); setEditEmp({ ...viewEmp }); setIsNewEmp(false); }}>
                      <Icon name="Pencil" size={14} className="mr-1" /> Изменить
                    </Button>
                    <Button className="rounded-full font-bold" variant="outline"
                      style={{ borderColor: '#ff4444', color: '#ff4444' }}
                      onClick={() => deleteEmployee(viewEmp.id)}>
                      <Icon name="Trash2" size={14} />
                    </Button>
                  </div>
                </div>
              </>
            );
          })()}
        </DialogContent>
      </Dialog>

      {/* Редактирование / добавление сотрудника */}
      <Dialog open={!!editEmp} onOpenChange={() => { setEditEmp(null); setIsNewEmp(false); }}>
        <DialogContent className="rounded-2xl max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display font-black" style={{ color: '#00B5F0' }}>
              {isNewEmp ? 'Новый сотрудник' : 'Редактировать профиль'}
            </DialogTitle>
          </DialogHeader>
          {editEmp && (
            <div className="space-y-4 mt-2">
              {/* Фото */}
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20 border-4 border-white shadow-lg cursor-pointer" onClick={() => photoRef.current?.click()}>
                  <AvatarImage src={editEmp.photo} />
                  <AvatarFallback className="font-black text-white text-2xl" style={{ background: '#00B5F0' }}>
                    {editEmp.name ? initials(editEmp.name) : '?'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <Button size="sm" variant="outline" className="rounded-full" onClick={() => photoRef.current?.click()}>
                    <Icon name="Upload" size={14} className="mr-1" /> Загрузить фото
                  </Button>
                  <p className="text-xs text-muted-foreground mt-1">JPG, PNG</p>
                  <input ref={photoRef} type="file" accept="image/*" className="hidden" onChange={handleEmpPhoto} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <Label className="text-xs font-bold text-muted-foreground">Имя и фамилия *</Label>
                  <Input className="mt-1 rounded-xl" placeholder="Иванова Мария" value={editEmp.name}
                    onChange={e => setEditEmp({ ...editEmp, name: e.target.value })} />
                </div>
                <div className="col-span-2">
                  <Label className="text-xs font-bold text-muted-foreground">Должность *</Label>
                  <Input className="mt-1 rounded-xl" placeholder="Менеджер по продажам" value={editEmp.role}
                    onChange={e => setEditEmp({ ...editEmp, role: e.target.value })} />
                </div>
                <div className="col-span-2">
                  <Label className="text-xs font-bold text-muted-foreground">Дирекция *</Label>
                  <Select value={editEmp.directorate} onValueChange={v => setEditEmp({ ...editEmp, directorate: v })}>
                    <SelectTrigger className="mt-1 rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {DIRECTORATES.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs font-bold text-muted-foreground">Телефон</Label>
                  <Input className="mt-1 rounded-xl" placeholder="+7 900 000-00-00" value={editEmp.phone}
                    onChange={e => setEditEmp({ ...editEmp, phone: e.target.value })} />
                </div>
                <div>
                  <Label className="text-xs font-bold text-muted-foreground">Telegram</Label>
                  <Input className="mt-1 rounded-xl" placeholder="@username" value={editEmp.tg}
                    onChange={e => setEditEmp({ ...editEmp, tg: e.target.value })} />
                </div>
                <div>
                  <Label className="text-xs font-bold text-muted-foreground flex items-center gap-1">
                    <Icon name="Cake" size={12} /> День рождения
                  </Label>
                  <Input type="date" className="mt-1 rounded-xl" value={editEmp.birthday}
                    onChange={e => setEditEmp({ ...editEmp, birthday: e.target.value })} />
                </div>
                <div>
                  <Label className="text-xs font-bold text-muted-foreground flex items-center gap-1">
                    <Icon name="CalendarCheck" size={12} /> Дата начала работы
                  </Label>
                  <Input type="date" className="mt-1 rounded-xl" value={editEmp.startDate}
                    onChange={e => setEditEmp({ ...editEmp, startDate: e.target.value })} />
                </div>

                {/* Разделитель — местоположение */}
                <div className="col-span-2 pt-1">
                  <p className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1 mb-2">
                    <Icon name="MapPin" size={12} /> Местоположение
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs font-bold text-muted-foreground">Страна</Label>
                      <Input className="mt-1 rounded-xl" placeholder="Россия" value={editEmp.country}
                        onChange={e => setEditEmp({ ...editEmp, country: e.target.value })} />
                    </div>
                    <div>
                      <Label className="text-xs font-bold text-muted-foreground">Город</Label>
                      <Input className="mt-1 rounded-xl" placeholder="Москва" value={editEmp.city}
                        onChange={e => setEditEmp({ ...editEmp, city: e.target.value })} />
                    </div>
                    <div className="col-span-2">
                      <Label className="text-xs font-bold text-muted-foreground">Адрес офиса</Label>
                      <Input className="mt-1 rounded-xl" placeholder="ул. Тверская, 10" value={editEmp.address}
                        onChange={e => setEditEmp({ ...editEmp, address: e.target.value })} />
                    </div>
                  </div>
                </div>

                <div className="col-span-2 flex items-center pb-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input type="checkbox" className="h-4 w-4 rounded accent-pink-400"
                      checked={editEmp.isHead}
                      onChange={e => setEditEmp({ ...editEmp, isHead: e.target.checked })} />
                    <span className="text-sm font-bold flex items-center gap-1">
                      <Icon name="Crown" size={15} style={{ color: '#FF9F43' }} /> Руководитель дирекции
                    </span>
                  </label>
                </div>
              </div>
              <Button
                className="w-full rounded-full font-black text-white mt-2"
                style={{ background: '#00B5F0' }}
                disabled={!editEmp.name || !editEmp.role || saving}
                onClick={saveEmployee}>
                {saving
                  ? <span className="flex items-center gap-2"><span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Сохраняю...</span>
                  : isNewEmp ? 'Добавить сотрудника' : 'Сохранить изменения'
                }
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Диалог импорта Excel */}
      <Dialog open={showImport} onOpenChange={v => { setShowImport(v); setImportResult(null); }}>
        <DialogContent className="rounded-2xl max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display font-black flex items-center gap-2" style={{ color: '#4caf20' }}>
              <Icon name="FileSpreadsheet" size={22} /> Импорт из Excel
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-1">
            {/* Быстрый импорт из хранилища */}
            <div className="rounded-2xl p-4 text-white relative overflow-hidden" style={{ background: 'linear-gradient(120deg, #FF6EC7, #00B5F0)' }}>
              <div className="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-white/10" />
              <p className="font-black text-sm mb-1 flex items-center gap-2">
                <Icon name="Zap" size={16} /> Быстрый импорт из вашего хранилища
              </p>
              <p className="text-xs text-white/85 mb-3">Файл уже загружен — нажми чтобы импортировать сразу</p>
              <Button
                className="rounded-full font-black w-full"
                style={{ background: '#fff', color: '#FF6EC7' }}
                disabled={importing}
                onClick={() => importFromUrl('https://cdn.poehali.dev/projects/b3633dd3-0424-4d83-af84-1d2d5d55dfc4/bucket/c98ca3c3-a412-415f-a68e-a9043c558567.xlsx')}
              >
                {importing
                  ? <span className="flex items-center gap-2 justify-center"><span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />Импортирую...</span>
                  : <span className="flex items-center gap-2 justify-center"><Icon name="CloudDownload" size={16} /> Загрузить сотрудников из файла</span>
                }
              </Button>
            </div>

            <div className="flex items-center gap-3 text-muted-foreground text-xs">
              <div className="flex-1 h-px bg-gray-200" />
              или загрузи новый файл вручную
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* Шаг 1 — скачать шаблон */}
            <div className="rounded-2xl p-4 border-2" style={{ borderColor: '#A8E63D', background: '#f8fff0' }}>
              <p className="font-black text-sm flex items-center gap-2 mb-1">
                <span className="h-5 w-5 rounded-full text-white text-xs flex items-center justify-center font-black" style={{ background: '#A8E63D', color: '#1a1a1a' }}>1</span>
                Скачай шаблон
              </p>
              <p className="text-xs text-muted-foreground mb-3">Заполни файл по образцу. Не меняй заголовки столбцов!</p>
              <Button size="sm" className="rounded-full font-bold" style={{ background: '#A8E63D', color: '#1a1a1a' }} onClick={downloadTemplate}>
                <Icon name="Download" size={14} className="mr-1" /> Скачать шаблон greenteam_шаблон.xlsx
              </Button>
            </div>

            {/* Шаг 2 — список дирекций */}
            <div className="rounded-2xl p-4 border-2 border-dashed border-gray-200">
              <p className="font-black text-sm flex items-center gap-2 mb-2">
                <span className="h-5 w-5 rounded-full text-white text-xs flex items-center justify-center font-black" style={{ background: '#00B5F0' }}>2</span>
                Точные названия дирекций для столбца «Дирекция»
              </p>
              <div className="flex flex-wrap gap-1">
                {DIRECTORATES.map((d, i) => (
                  <span key={d} className="text-[11px] px-2 py-0.5 rounded-full font-semibold"
                    style={{ background: DIR_COLORS[i] + '22', color: DIR_COLORS[i], border: `1px solid ${DIR_COLORS[i]}55` }}>
                    {d}
                  </span>
                ))}
              </div>
            </div>

            {/* Шаг 3 — загрузить файл */}
            <div className="rounded-2xl p-4" style={{ background: '#f0f8ff', border: '2px dashed #00B5F0' }}>
              <p className="font-black text-sm flex items-center gap-2 mb-3">
                <span className="h-5 w-5 rounded-full text-white text-xs flex items-center justify-center font-black" style={{ background: '#FF6EC7' }}>3</span>
                Загрузи заполненный файл
              </p>
              <input ref={xlsxRef} type="file" accept=".xlsx,.xls" className="hidden" onChange={handleXlsx} />
              <Button
                className="w-full rounded-full font-bold text-white"
                style={{ background: importing ? '#aaa' : '#00B5F0' }}
                disabled={importing}
                onClick={() => xlsxRef.current?.click()}
              >
                {importing
                  ? <span className="flex items-center gap-2"><span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Импортирую...</span>
                  : <span className="flex items-center gap-2"><Icon name="Upload" size={16} />Выбрать Excel-файл</span>
                }
              </Button>
            </div>

            {/* Результат импорта */}
            {importResult && (
              <div className={`rounded-2xl p-4 ${importResult.added > 0 ? 'bg-green-50' : 'bg-red-50'}`}>
                <p className="font-black text-sm flex items-center gap-2" style={{ color: importResult.added > 0 ? '#4caf20' : '#ff4444' }}>
                  <Icon name={importResult.added > 0 ? 'CheckCircle' : 'AlertCircle'} size={16} />
                  Добавлено сотрудников: {importResult.added}
                </p>
                {importResult.errors.length > 0 && (
                  <div className="mt-2 space-y-1">
                    <p className="text-xs font-bold text-red-500">Ошибки ({importResult.errors.length}):</p>
                    {importResult.errors.map((err, i) => (
                      <p key={i} className="text-xs text-red-400">• {err}</p>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <footer className="border-t bg-white mt-4">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 flex items-center justify-center gap-3">
          <GreenTeamLogo size={28} />
          <span className="text-sm text-muted-foreground font-semibold">GreenTeam · Внутренний портал Greenway Global</span>
        </div>
      </footer>
    </div>
  );
};

export default Index;