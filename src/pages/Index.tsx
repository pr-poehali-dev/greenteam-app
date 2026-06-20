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
  {
    author: 'Greenway Global',
    badge: 'Telegram',
    color: 'blue',
    time: '2 часа назад',
    text: 'Запускаем осеннюю акцию для партнёров! Новые бонусы по программе лояльности уже доступны в личном кабинете.',
    likes: 124,
    comments: 18,
  },
  {
    author: 'HR GreenTeam',
    badge: 'Новость',
    color: 'pink',
    time: 'Вчера',
    text: 'Поздравляем команду продаж с рекордным месяцем! Спасибо каждому за вклад в общий результат 💚',
    likes: 89,
    comments: 7,
  },
  {
    author: 'Отдел обучения',
    badge: 'Анонс',
    color: 'green',
    time: '2 дня назад',
    text: 'Новый онбординг-курс для новичков уже в Боттендере. Прокачай знания о продуктах за 5 дней.',
    likes: 56,
    comments: 12,
  },
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

const Index = () => {
  const [active, setActive] = useState('feed');
  const [botMsg, setBotMsg] = useState('');

  return (
    <div className="min-h-screen bg-[hsl(210,40%,98%)]">
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/80 border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-brand-gradient flex items-center justify-center shadow-lg">
              <Icon name="Leaf" className="text-white" size={22} />
            </div>
            <div className="leading-tight">
              <p className="font-display font-extrabold text-lg">GreenTeam</p>
              <p className="text-[11px] text-muted-foreground -mt-0.5">Greenway Global</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="rounded-full relative">
              <Icon name="Bell" size={20} />
              <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-brand-pink ring-2 ring-white" />
            </Button>
            <Avatar className="h-9 w-9 border-2 border-brand-green/40">
              <AvatarFallback className="bg-brand-green/15 text-brand-green font-semibold">Я</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-8">
        <div className="relative overflow-hidden rounded-3xl bg-brand-gradient p-8 sm:p-12 text-white shadow-xl animate-scale-in">
          <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10 animate-float" />
          <div className="absolute right-24 bottom-0 h-24 w-24 rounded-full bg-white/10" />
          <div className="relative">
            <Badge className="bg-white/20 hover:bg-white/20 text-white border-0 mb-4 backdrop-blur">
              Внутренний портал команды
            </Badge>
            <h1 className="font-display font-black text-3xl sm:text-5xl max-w-2xl leading-tight">
              Привет, GreenTeam! 👋
            </h1>
            <p className="mt-3 text-white/90 max-w-lg text-base sm:text-lg">
              Новости, события и жизнь компании Greenway Global — в одном месте.
            </p>
          </div>
        </div>
      </section>

      {/* Nav */}
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 mt-6 sticky top-16 z-30">
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
          {nav.map((n) => (
            <button
              key={n.id}
              onClick={() => setActive(n.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full whitespace-nowrap text-sm font-semibold transition-all ${
                active === n.id
                  ? 'bg-brand-gradient text-white shadow-lg'
                  : 'bg-white text-muted-foreground hover:text-foreground border'
              }`}
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
            <div className="space-y-5 animate-fade-in">
              {feed.map((post, i) => (
                <Card key={i} className="p-5 rounded-2xl border-0 shadow-sm hover-lift">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-11 w-11">
                      <AvatarFallback className={colorMap[post.color]}>{initials(post.author)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold">{post.author}</p>
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
                    <button className="flex items-center gap-1.5 hover:text-brand-green transition-colors ml-auto">
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
                <Card key={i} className="p-5 rounded-2xl border-0 shadow-sm hover-lift flex items-center gap-4">
                  <div className={`h-14 w-14 shrink-0 rounded-2xl flex flex-col items-center justify-center ${colorMap[e.color]}`}>
                    <Icon name="Calendar" size={22} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-lg">{e.title}</h3>
                      <Badge variant="secondary" className="rounded-full text-[10px]">{e.tag}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground flex items-center gap-3 mt-1">
                      <span className="flex items-center gap-1"><Icon name="Clock" size={14} />{e.date}</span>
                      <span className="flex items-center gap-1"><Icon name="MapPin" size={14} />{e.place}</span>
                    </p>
                  </div>
                  <Button size="sm" className="rounded-full bg-brand-blue hover:bg-brand-blue/90">Пойду</Button>
                </Card>
              ))}
            </div>
          )}

          {active === 'birthdays' && (
            <div className="space-y-5 animate-fade-in">
              <div className="space-y-3">
                <h3 className="font-display font-bold text-xl flex items-center gap-2">
                  <Icon name="Cake" size={20} className="text-brand-pink" /> Ближайшие дни рождения
                </h3>
                {birthdays.map((b, i) => (
                  <Card key={i} className="p-4 rounded-2xl border-0 shadow-sm hover-lift flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-brand-pink/15 text-brand-pink font-semibold">{initials(b.name)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-semibold">{b.name}</p>
                      <p className="text-sm text-muted-foreground">{b.role}</p>
                    </div>
                    {b.today ? (
                      <Badge className="rounded-full bg-brand-pink hover:bg-brand-pink">Сегодня 🎉</Badge>
                    ) : (
                      <span className="text-sm font-medium text-muted-foreground">{b.date}</span>
                    )}
                  </Card>
                ))}
              </div>
              <div className="space-y-3">
                <h3 className="font-display font-bold text-xl flex items-center gap-2">
                  <Icon name="Award" size={20} className="text-brand-green" /> Стаж в компании
                </h3>
                <div className="grid sm:grid-cols-3 gap-3">
                  {anniversaries.map((a, i) => (
                    <Card key={i} className="p-4 rounded-2xl border-0 shadow-sm hover-lift text-center">
                      <div className="mx-auto h-14 w-14 rounded-full bg-brand-green/15 flex items-center justify-center text-brand-green font-display font-black text-lg">
                        {a.years}
                      </div>
                      <p className="mt-2 text-xs font-semibold text-brand-green">{a.years === 1 ? 'год' : 'лет'} в команде</p>
                      <p className="mt-1 font-semibold text-sm">{a.name}</p>
                      <p className="text-xs text-muted-foreground">{a.role}</p>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}

          {active === 'team' && (
            <div className="animate-fade-in">
              <h3 className="font-display font-bold text-xl mb-4 flex items-center gap-2">
                <Icon name="Network" size={20} className="text-brand-blue" /> Структура дирекции
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {directors.map((d, i) => (
                  <Card key={i} className="p-5 rounded-2xl border-0 shadow-sm hover-lift">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-14 w-14 border-2 border-brand-blue/30">
                        <AvatarFallback className="bg-brand-blue/15 text-brand-blue font-semibold">{initials(d.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{d.name}</p>
                        <p className="text-sm text-brand-blue font-medium">{d.role}</p>
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
                <div className="bg-brand-gradient p-5 text-white flex items-center gap-3">
                  <div className="h-11 w-11 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur">
                    <Icon name="Bot" size={24} />
                  </div>
                  <div>
                    <p className="font-display font-bold">Боттендер</p>
                    <p className="text-xs text-white/80">Помощник для новичков · онлайн</p>
                  </div>
                </div>
                <div className="p-5 space-y-4 bg-[hsl(210,40%,98%)]">
                  <div className="max-w-[80%] bg-white rounded-2xl rounded-tl-sm p-3 shadow-sm">
                    <p className="text-sm">Привет! 👋 Я Боттендер. Помогу освоиться в GreenTeam. Что тебя интересует?</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {['Где найти онбординг?', 'Как получить доступы?', 'Контакты HR'].map((q) => (
                      <button key={q} className="text-xs px-3 py-2 rounded-full bg-white border hover:border-brand-blue hover:text-brand-blue transition-colors">
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="p-4 flex gap-2 border-t bg-white">
                  <Input
                    value={botMsg}
                    onChange={(e) => setBotMsg(e.target.value)}
                    placeholder="Напиши сообщение..."
                    className="rounded-full"
                  />
                  <Button size="icon" className="rounded-full bg-brand-green hover:bg-brand-green/90 shrink-0">
                    <Icon name="Send" size={18} />
                  </Button>
                </div>
              </Card>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="space-y-5">
          <Card className="p-5 rounded-2xl border-0 shadow-sm bg-brand-gradient text-white">
            <Icon name="Send" size={22} />
            <p className="font-display font-bold mt-2 text-lg">Telegram-канал</p>
            <p className="text-sm text-white/85 mt-1">Все новости компании теперь и здесь, в портале.</p>
            <Button className="mt-4 w-full rounded-full bg-white text-brand-blue hover:bg-white/90 font-semibold">
              Открыть канал
            </Button>
          </Card>

          <Card className="p-5 rounded-2xl border-0 shadow-sm">
            <p className="font-semibold flex items-center gap-2 mb-3">
              <Icon name="Cake" size={18} className="text-brand-pink" /> Сегодня празднует
            </p>
            <div className="flex items-center gap-3">
              <Avatar className="h-11 w-11">
                <AvatarFallback className="bg-brand-pink/15 text-brand-pink font-semibold">АС</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-sm">Анна Соколова</p>
                <p className="text-xs text-muted-foreground">Поздравь коллегу 🎉</p>
              </div>
            </div>
          </Card>

          <Card className="p-5 rounded-2xl border-0 shadow-sm">
            <p className="font-semibold flex items-center gap-2 mb-3">
              <Icon name="Bell" size={18} className="text-brand-blue" /> Уведомления
            </p>
            <ul className="space-y-3 text-sm">
              <li className="flex gap-2"><Icon name="CalendarDays" size={16} className="text-brand-green mt-0.5" /> Корпоратив через 8 дней</li>
              <li className="flex gap-2"><Icon name="Award" size={16} className="text-brand-pink mt-0.5" /> У Дмитрия 5 лет в компании</li>
              <li className="flex gap-2"><Icon name="GraduationCap" size={16} className="text-brand-blue mt-0.5" /> Новый курс в Боттендере</li>
            </ul>
          </Card>
        </aside>
      </main>

      <footer className="border-t bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 text-center text-sm text-muted-foreground">
          GreenTeam · Внутренний портал Greenway Global 💚💙💗
        </div>
      </footer>
    </div>
  );
};

export default Index;
