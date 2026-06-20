import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

const nav = [
  { id: 'feed', label: 'Лента', icon: 'Newspaper' },
  { id: 'events', label: 'События', icon: 'CalendarDays' },
  { id: 'birthdays', label: 'Дни рождения', icon: 'Cake' },
  { id: 'team', label: 'Дирекция', icon: 'Network' },
  { id: 'bot', label: 'Боттендер', icon: 'Bot' },
];

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

const directors = [
  { name: 'Сергей Морозов', role: 'Генеральный директор', dept: 'Управление' },
  { name: 'Ольга Петрова', role: 'Директор по продажам', dept: 'Коммерция' },
  { name: 'Антон Зайцев', role: 'Директор по развитию', dept: 'Стратегия' },
  { name: 'Ирина Белова', role: 'HR-директор', dept: 'Персонал' },
];

const colorMap: Record<string, string> = {
  pink: 'bg-brand-pink text-white',
  blue: 'bg-brand-blue text-white',
  green: 'bg-brand-green text-white',
};

const initials = (name: string) =>
  name.split(' ').map((w) => w[0]).join('').slice(0, 2);

const GreenTeamLogo = ({ size = 44 }: { size?: number }) => {
  const r = size * 0.22;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" rx="24" fill="#00B5F0"/>
      {/* Буквы GREEN — верхний ряд */}
      <text
        x="50" y="38"
        textAnchor="middle"
        fontFamily="Nunito, Arial Rounded MT Bold, sans-serif"
        fontWeight="900"
        fontSize="30"
        fill="#FF6EC7"
        stroke="#fff"
        strokeWidth="2"
        paintOrder="stroke"
        letterSpacing="-1"
      >GREEN</text>
      {/* Зелёный ромб-листок по центру */}
      <path d="M50 42 C54 46 58 50 50 58 C42 50 46 46 50 42Z" fill="#A8E63D"/>
      <path d="M44 50 C48 46 52 46 56 50 C52 54 48 54 44 50Z" fill="#A8E63D"/>
      {/* Звёздочка внутри ромба */}
      <circle cx="50" cy="50" r="3" fill="#00B5F0"/>
      {/* Буквы TEAM — нижний ряд */}
      <text
        x="50" y="82"
        textAnchor="middle"
        fontFamily="Nunito, Arial Rounded MT Bold, sans-serif"
        fontWeight="900"
        fontSize="30"
        fill="#FF6EC7"
        stroke="#fff"
        strokeWidth="2"
        paintOrder="stroke"
        letterSpacing="-1"
      >TEAM</text>
    </svg>
  );
};

const Index = () => {
  const [active, setActive] = useState('feed');
  const [botMsg, setBotMsg] = useState('');

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
              <AvatarFallback className="font-bold text-white" style={{ background: '#A8E63D', color: '#1a1a1a' }}>Я</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      {/* Hero — фото полностью */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-8">
        <div className="rounded-3xl overflow-hidden shadow-2xl animate-scale-in" style={{ background: '#00B5F0' }}>
          {/* Фото команды — полное, без обрезки */}
          <div className="relative">
            <img
              src="https://cdn.poehali.dev/projects/b3633dd3-0424-4d83-af84-1d2d5d55dfc4/bucket/cb4ec47f-04ed-494b-9fbf-54da89bba876.jpg"
              alt="Команда GreenTeam"
              className="w-full object-contain"
              style={{ maxHeight: '420px', objectPosition: 'center top' }}
            />
            {/* Gradient overlay снизу */}
            <div className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none"
              style={{ background: 'linear-gradient(to top, #00B5F0 0%, transparent 100%)' }} />
          </div>
          {/* Текст под фото */}
          <div className="px-8 sm:px-12 pb-8 text-white -mt-4 relative z-10">
            <div className="flex flex-wrap items-end gap-4 justify-between">
              <div>
                <p className="text-white/70 text-sm font-semibold uppercase tracking-widest mb-1">Внутренний портал</p>
                <h1 className="font-display font-black leading-none" style={{ fontSize: 'clamp(2.5rem, 7vw, 5rem)', letterSpacing: '-2px' }}>
                  Привет,{' '}
                  <span style={{ color: '#FF6EC7' }}>GreenTeam!</span>
                </h1>
                <p className="mt-2 text-white/85 text-base sm:text-lg max-w-xl">
                  Новости, события и жизнь компании Greenway Global — в одном месте.
                </p>
              </div>
              <div className="flex gap-3 flex-shrink-0">
                <div className="rounded-2xl px-5 py-3 text-center" style={{ background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(8px)' }}>
                  <p className="font-display font-black text-2xl">248</p>
                  <p className="text-xs text-white/80">сотрудников</p>
                </div>
                <div className="rounded-2xl px-5 py-3 text-center" style={{ background: 'rgba(168,230,61,0.3)', backdropFilter: 'blur(8px)' }}>
                  <p className="font-display font-black text-2xl">12</p>
                  <p className="text-xs text-white/80">отделов</p>
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
                : { background: '#fff', color: '#555', border: '1.5px solid #e0e0e0' }
              }
            >
              <Icon name={n.icon} size={17} />
              {n.label}
            </button>
          ))}
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 grid lg:grid-cols-3 gap-6">
        {/* Main column */}
        <div className="lg:col-span-2 space-y-5">

          {active === 'feed' && (
            <div className="space-y-4 animate-fade-in">
              {feed.map((post, i) => (
                <Card key={i} className="p-5 rounded-2xl border-0 shadow-sm hover-lift bg-white">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-11 w-11">
                      <AvatarFallback className={colorMap[post.color]} style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 900 }}>
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

          {active === 'events' && (
            <div className="space-y-4 animate-fade-in">
              {events.map((e, i) => (
                <Card key={i} className="p-5 rounded-2xl border-0 shadow-sm hover-lift bg-white flex items-center gap-4">
                  <div className={`h-14 w-14 shrink-0 rounded-2xl flex flex-col items-center justify-center ${colorMap[e.color]}`}>
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
                      : <span className="text-sm font-semibold text-muted-foreground">{b.date}</span>
                    }
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
                      <div className="mx-auto h-14 w-14 rounded-full flex items-center justify-center font-display font-black text-xl text-white"
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

          {active === 'team' && (
            <div className="animate-fade-in">
              <h3 className="font-display font-black text-xl mb-4 flex items-center gap-2" style={{ color: '#00B5F0' }}>
                <Icon name="Network" size={22} /> Структура дирекции
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {directors.map((d, i) => (
                  <Card key={i} className="p-5 rounded-2xl border-0 shadow-sm hover-lift bg-white">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-14 w-14 border-2" style={{ borderColor: '#00B5F0' }}>
                        <AvatarFallback className="font-black text-white" style={{ background: '#00B5F0', fontFamily: 'Nunito' }}>
                          {initials(d.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-bold">{d.name}</p>
                        <p className="text-sm font-semibold" style={{ color: '#00B5F0' }}>{d.role}</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="mt-3 rounded-full">{d.dept}</Badge>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {active === 'bot' && (
            <div className="animate-fade-in">
              <Card className="rounded-2xl border-0 shadow-sm overflow-hidden">
                <div className="p-5 text-white flex items-center gap-3" style={{ background: '#00B5F0' }}>
                  <div className="h-11 w-11 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.2)' }}>
                    <Icon name="Bot" size={24} />
                  </div>
                  <div>
                    <p className="font-display font-black text-lg">Боттендер</p>
                    <p className="text-xs text-white/80">Помощник для новичков · онлайн</p>
                  </div>
                </div>
                <div className="p-5 space-y-4" style={{ background: '#f0f8ff' }}>
                  <div className="max-w-[80%] bg-white rounded-2xl rounded-tl-sm p-3 shadow-sm">
                    <p className="text-sm">Привет! 👋 Я Боттендер. Помогу освоиться в GreenTeam. Что тебя интересует?</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {['Где найти онбординг?', 'Как получить доступы?', 'Контакты HR'].map((q) => (
                      <button key={q} className="text-xs px-3 py-2 rounded-full bg-white border-2 font-semibold transition-colors hover:border-brand-blue hover:text-brand-blue"
                        style={{ borderColor: '#e0e0e0' }}>
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="p-4 flex gap-2 border-t bg-white">
                  <Input value={botMsg} onChange={(e) => setBotMsg(e.target.value)}
                    placeholder="Напиши сообщение..."
                    className="rounded-full" />
                  <Button size="icon" className="rounded-full shrink-0 text-white" style={{ background: '#A8E63D', color: '#1a1a1a' }}>
                    <Icon name="Send" size={18} />
                  </Button>
                </div>
              </Card>
            </div>
          )}

        </div>

        {/* Sidebar */}
        <aside className="space-y-4">
          <Card className="p-5 rounded-2xl border-0 shadow-sm text-white overflow-hidden relative" style={{ background: '#00B5F0' }}>
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-20" style={{ background: '#FF6EC7' }} />
            <Icon name="Send" size={22} />
            <p className="font-display font-black mt-2 text-lg">Telegram-канал</p>
            <p className="text-sm text-white/85 mt-1">Все новости компании — теперь и здесь.</p>
            <Button className="mt-4 w-full rounded-full font-black" style={{ background: '#fff', color: '#00B5F0' }}>
              Открыть канал
            </Button>
          </Card>

          <Card className="p-5 rounded-2xl border-0 shadow-sm bg-white">
            <p className="font-bold flex items-center gap-2 mb-3" style={{ color: '#FF6EC7' }}>
              <Icon name="Cake" size={18} /> Сегодня празднует
            </p>
            <div className="flex items-center gap-3">
              <Avatar className="h-11 w-11">
                <AvatarFallback className="font-black text-white" style={{ background: '#FF6EC7', fontFamily: 'Nunito' }}>АС</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-bold text-sm">Анна Соколова</p>
                <p className="text-xs text-muted-foreground">Поздравь коллегу 🎉</p>
              </div>
            </div>
          </Card>

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
        </aside>
      </main>

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