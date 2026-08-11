export const LANGS = ['en', 'uk', 'ru'] as const
export type Lang = (typeof LANGS)[number]

export const LANG_LABELS: Record<Lang, string> = {
  en: 'EN',
  uk: 'УКР',
  ru: 'РУС',
}

export function isLang(value: unknown): value is Lang {
  return typeof value === 'string' && (LANGS as readonly string[]).includes(value)
}

type Dictionary = {
  nav: { breed: string; kennel: string; gallery: string; film: string; pedigree: string; people: string; enquire: string }
  hero: {
    eyebrow: string
    title: string
    lead: string
    primary: string
    secondary: string
    stats: { value: string; label: string }[]
  }
  breed: { eyebrow: string; title: string; lead: string; points: { title: string; body: string }[] }
  kennel: { eyebrow: string; title: string; lead: string; facts: { term: string; detail: string }[] }
  gallery: { eyebrow: string; title: string; note: string; empty: string }
  film: { eyebrow: string; title: string; note: string; empty: string }
  pedigree: { eyebrow: string; title: string; lead: string; sire: string; dam: string; sireName: string; damName: string; sireLine: string; damLine: string; union: string }
  people: { eyebrow: string; title: string; lead: string; members: { name: string; role: string; body: string }[] }
  enquiry: {
    eyebrow: string
    title: string
    lead: string
    firstName: string
    lastName: string
    phone: string
    note: string
    notePlaceholder: string
    submit: string
    sending: string
    call: string
    callHint: string
    consent: string
    doneTitle: string
    doneBody: string
    doneAgain: string
    errors: { firstName: string; lastName: string; phone: string; generic: string; network: string }
  }
  footer: { rights: string; address: string; nav: string }
}

const en: Dictionary = {
  nav: { breed: 'The breed', kennel: 'The kennel', gallery: 'Photography', film: 'Film', pedigree: 'Pedigree', people: 'The people', enquire: 'Enquire' },
  hero: {
    eyebrow: 'Cane Corso Italiano · Ukraine',
    title: 'Del Cani\nTerezzine',
    lead: 'A small kennel breeding Cane Corso Italiano to standard — black and blue, heavy bone, calm head. Every litter is registered with the Ukrainian Kennel & Felinological Union and leaves with a certified pedigree.',
    primary: 'Reserve a puppy',
    secondary: 'Call the kennel',
    stats: [
      { value: 'UKFU', label: 'registered kennel' },
      { value: '2×', label: 'health-tested parents' },
      { value: '100%', label: 'certified pedigrees' },
    ],
  },
  breed: {
    eyebrow: 'The breed',
    title: 'Built to guard,\nraised to live indoors.',
    lead: 'The Cane Corso is the Italian farm guardian: a working molosser with an old head, a short coat and a temperament that switches off completely once the gate is shut. Serious dogs for people who want a real one.',
    points: [
      { title: 'Size and build', body: 'Males 64–68 cm at the withers and 45–50 kg; females 60–64 cm and 40–45 kg. Heavy bone, dry muscle, an athlete rather than a mastiff.' },
      { title: 'Temperament', body: 'Territorial without being nervous. Deeply attached to family, reserved with strangers, and quiet in the house. Needs a handler who leads calmly.' },
      { title: 'Coat and colour', body: 'Short, dense, weatherproof. Black, grey-blue, fawn and brindle, often with a dark mask. Minimal grooming, a heavy seasonal shed.' },
      { title: 'What it needs', body: 'Two real walks a day, early socialisation, and consistent rules. Not a kennel dog and not a first dog — but an outstanding family guardian.' },
    ],
  },
  kennel: {
    eyebrow: 'The kennel',
    title: 'Few litters.\nNothing hurried.',
    lead: 'Del Cani Terezzine keeps a small number of dogs so every one of them lives in the house, not in a run. We plan one or two litters a year, choose sires for structure and head type, and place puppies only where they will be worked with.',
    facts: [
      { term: 'Registration', detail: 'Ukrainian Kennel & Felinological Union (UKFU), certified pedigree with every puppy' },
      { term: 'Health', detail: 'Hips and elbows screened, cardiac and eye checks on breeding stock' },
      { term: 'Handover', detail: 'From 8 weeks: vaccinated, microchipped, wormed, with a veterinary passport' },
      { term: 'After', detail: 'Lifetime advice on feeding, growth and training — and first refusal if you ever rehome' },
    ],
  },
  gallery: { eyebrow: 'Photography', title: 'The dogs', note: 'Adults and juniors from our lines. Tap any frame to open it full size.', empty: 'Photographs are being added.' },
  film: { eyebrow: 'Film', title: 'In motion', note: 'Short clips: movement, structure and temperament in the open.', empty: 'Video is being added — ask us for the current clips.' },
  pedigree: {
    eyebrow: 'Pedigree',
    title: 'Documented\non both sides.',
    lead: 'Every puppy leaves with a certified pedigree issued by the Ukrainian Kennel & Felinological Union. Below is the parent pairing behind our current line.',
    sire: 'Sire',
    dam: 'Dam',
    sireName: 'Ahiles del Cani Terezzine',
    damName: 'Rolanda iz Gvardiitora',
    sireLine: 'Male · Cane Corso Italiano · Black',
    damLine: 'Female · Cane Corso Italiano · Blue',
    union: 'Ukrainian Kennel & Felinological Union',
  },
  people: {
    eyebrow: 'The people',
    title: 'Who the dogs\nactually belong to.',
    lead: 'A family kennel, not a business park. The dogs share the house, the car and most of the sofa.',
    members: [
      { name: 'Roman Ivanov', role: 'Breeder, handler', body: 'Fifteen years with working molossers. Plans the pairings, runs the ring work and answers the phone.' },
      { name: 'Tereza Ivanova', role: 'Kennel name, whelping', body: 'The kennel carries her name. Runs whelping, early neurological stimulation and the first eight weeks of socialisation.' },
      { name: 'Dr. Olena Marchenko', role: 'Consulting veterinarian', body: 'Screens the breeding stock, supervises litters and signs off every puppy before it leaves.' },
    ],
  },
  enquiry: {
    eyebrow: 'Enquire',
    title: 'Leave a number.\nWe call you back.',
    lead: 'Tell us your name and a number that reaches you. We will call, ask what you want from the dog, and tell you honestly whether we have it.',
    firstName: 'First name',
    lastName: 'Last name',
    phone: 'Phone number',
    note: 'Anything we should know',
    notePlaceholder: 'Preferred sex and colour, timing, whether you have kept a guardian breed before…',
    submit: 'Request a call back',
    sending: 'Sending…',
    call: 'Call now',
    callHint: 'Opens your phone with our number ready to dial.',
    consent: 'We use your number to return the call and nothing else.',
    doneTitle: 'Got it — we will call you.',
    doneBody: 'Your enquiry is with the kennel. Expect a call within one working day.',
    doneAgain: 'Send another',
    errors: {
      firstName: 'Please enter your first name.',
      lastName: 'Please enter your last name.',
      phone: 'Please enter a phone number we can reach.',
      generic: 'Something went wrong. Please try again.',
      network: 'We could not reach the kennel. Check your connection and retry.',
    },
  },
  footer: { rights: 'All rights reserved.', address: 'Ukraine · viewings by appointment', nav: 'Sections' },
}

const uk: Dictionary = {
  nav: { breed: 'Порода', kennel: 'Розплідник', gallery: 'Фото', film: 'Відео', pedigree: 'Родовід', people: 'Люди', enquire: 'Заявка' },
  hero: {
    eyebrow: 'Cane Corso Italiano · Україна',
    title: 'Del Cani\nTerezzine',
    lead: 'Невеликий розплідник кане-корсо італьяно за стандартом — чорні та блакитні, важкий кістяк, спокійна голова. Кожен послід зареєстрований в Українській Кінологічній та Феліноголічній Спілці, кожне цуценя їде із сертифікованим родоводом.',
    primary: 'Забронювати цуценя',
    secondary: 'Зателефонувати',
    stats: [
      { value: 'UKFU', label: 'зареєстрований розплідник' },
      { value: '2×', label: 'батьки з тестами здоров’я' },
      { value: '100%', label: 'сертифіковані родоводи' },
    ],
  },
  breed: {
    eyebrow: 'Порода',
    title: 'Створений охороняти,\nвихований жити вдома.',
    lead: 'Кане-корсо — італійський фермерський охоронець: робочий молос зі старовинною головою, короткою шерстю і темпераментом, який повністю вимикається, щойно зачинено ворота. Серйозний собака для тих, хто хоче справжнього.',
    points: [
      { title: 'Розмір і будова', body: 'Кобелі 64–68 см у холці та 45–50 кг; суки 60–64 см і 40–45 кг. Важкий кістяк, суха мускулатура — радше атлет, ніж мастиф.' },
      { title: 'Темперамент', body: 'Територіальний, але не нервовий. Глибоко прив’язаний до родини, стриманий із чужими, тихий у домі. Потребує спокійного, послідовного господаря.' },
      { title: 'Шерсть і забарвлення', body: 'Коротка, щільна, погодостійка. Чорний, сіро-блакитний, палевий і тигровий, часто з темною маскою. Догляд мінімальний, линяння сезонне й рясне.' },
      { title: 'Що потрібно', body: 'Дві повноцінні прогулянки на день, рання соціалізація та стабільні правила. Не вольєрний і не перший собака — але видатний сімейний охоронець.' },
    ],
  },
  kennel: {
    eyebrow: 'Розплідник',
    title: 'Мало послідів.\nБез поспіху.',
    lead: 'Del Cani Terezzine тримає небагато собак, щоб кожен жив у домі, а не у вольєрі. Плануємо один-два поміти на рік, добираємо кобелів за структурою і типом голови, віддаємо цуценят лише туди, де з ними працюватимуть.',
    facts: [
      { term: 'Реєстрація', detail: 'Українська Кінологічна та Феліноголічна Спілка (UKFU), сертифікований родовід з кожним цуценям' },
      { term: 'Здоров’я', detail: 'Знімки кульшових і ліктьових суглобів, кардіо- та офтальмоперевірки племінних собак' },
      { term: 'Передача', detail: 'Від 8 тижнів: вакциноване, чиповане, дегельмінтизоване, з ветпаспортом' },
      { term: 'Після', detail: 'Довічні поради щодо годівлі, росту й виховання — і право першого викупу, якщо колись віддаватимете' },
    ],
  },
  gallery: { eyebrow: 'Фото', title: 'Наші собаки', note: 'Дорослі та юніори наших ліній. Натисніть на кадр, щоб відкрити повністю.', empty: 'Фотографії додаються.' },
  film: { eyebrow: 'Відео', title: 'У русі', note: 'Короткі ролики: рух, структура й темперамент на просторі.', empty: 'Відео додається — запитайте у нас актуальні ролики.' },
  pedigree: {
    eyebrow: 'Родовід',
    title: 'Задокументовано\nз обох боків.',
    lead: 'Кожне цуценя їде із сертифікованим родоводом Української Кінологічної та Феліноголічної Спілки. Нижче — батьківська пара нашої поточної лінії.',
    sire: 'Батько',
    dam: 'Мати',
    sireName: 'Ahiles del Cani Terezzine',
    damName: 'Rolanda iz Gvardiitora',
    sireLine: 'Кобель · Cane Corso Italiano · Чорний',
    damLine: 'Сука · Cane Corso Italiano · Блакитна',
    union: 'Українська Кінологічна та Феліноголічна Спілка',
  },
  people: {
    eyebrow: 'Люди',
    title: 'Кому насправді\nналежать ці собаки.',
    lead: 'Сімейний розплідник, а не бізнес-центр. Собаки ділять із нами дім, машину і більшу частину дивана.',
    members: [
      { name: 'Роман Іванов', role: 'Заводчик, хендлер', body: 'П’ятнадцять років із робочими молосами. Планує в’язки, веде рингову підготовку і відповідає на дзвінки.' },
      { name: 'Тереза Іванова', role: 'Ім’я розплідника, вирощування', body: 'Розплідник має її ім’я. Веде пологи, ранню неврологічну стимуляцію та перші вісім тижнів соціалізації.' },
      { name: 'Олена Марченко', role: 'Ветеринарний лікар', body: 'Перевіряє племінне поголів’я, супроводжує поміти й оглядає кожне цуценя перед від’їздом.' },
    ],
  },
  enquiry: {
    eyebrow: 'Заявка',
    title: 'Залиште номер.\nМи передзвонимо.',
    lead: 'Напишіть ім’я і номер, за яким вас знайти. Ми зателефонуємо, розпитаємо, чого ви чекаєте від собаки, і чесно скажемо, чи є в нас такий.',
    firstName: 'Ім’я',
    lastName: 'Прізвище',
    phone: 'Номер телефону',
    note: 'Що нам варто знати',
    notePlaceholder: 'Бажана стать і забарвлення, строки, чи тримали ви охоронну породу раніше…',
    submit: 'Передзвоніть мені',
    sending: 'Надсилаємо…',
    call: 'Подзвонити',
    callHint: 'Відкриє телефон із нашим номером, готовим до набору.',
    consent: 'Ваш номер потрібен лише для зворотного дзвінка.',
    doneTitle: 'Прийнято — ми зателефонуємо.',
    doneBody: 'Заявка вже в розпліднику. Чекайте на дзвінок протягом одного робочого дня.',
    doneAgain: 'Надіслати ще одну',
    errors: {
      firstName: 'Вкажіть, будь ласка, ім’я.',
      lastName: 'Вкажіть, будь ласка, прізвище.',
      phone: 'Вкажіть номер, за яким до вас додзвонитися.',
      generic: 'Щось пішло не так. Спробуйте ще раз.',
      network: 'Не вдалося зв’язатися з розплідником. Перевірте з’єднання.',
    },
  },
  footer: { rights: 'Усі права застережено.', address: 'Україна · перегляд за домовленістю', nav: 'Розділи' },
}

const ru: Dictionary = {
  nav: { breed: 'Порода', kennel: 'Питомник', gallery: 'Фото', film: 'Видео', pedigree: 'Родословная', people: 'Люди', enquire: 'Заявка' },
  hero: {
    eyebrow: 'Cane Corso Italiano · Украина',
    title: 'Del Cani\nTerezzine',
    lead: 'Небольшой питомник кане-корсо итальяно по стандарту — чёрные и голубые, тяжёлый костяк, спокойная голова. Каждый помёт зарегистрирован в Украинском Кинологическом и Фелинологическом Союзе, каждый щенок уезжает с сертифицированной родословной.',
    primary: 'Забронировать щенка',
    secondary: 'Позвонить',
    stats: [
      { value: 'UKFU', label: 'зарегистрированный питомник' },
      { value: '2×', label: 'родители с тестами здоровья' },
      { value: '100%', label: 'сертифицированные родословные' },
    ],
  },
  breed: {
    eyebrow: 'Порода',
    title: 'Создан охранять,\nвоспитан жить дома.',
    lead: 'Кане-корсо — итальянский фермерский охранник: рабочий молос со старинной головой, короткой шерстью и темпераментом, который полностью выключается, как только закрыты ворота. Серьёзная собака для тех, кто хочет настоящую.',
    points: [
      { title: 'Размер и сложение', body: 'Кобели 64–68 см в холке и 45–50 кг; суки 60–64 см и 40–45 кг. Тяжёлый костяк, сухая мускулатура — скорее атлет, чем мастиф.' },
      { title: 'Темперамент', body: 'Территориальный, но не нервный. Глубоко привязан к семье, сдержан с чужими, тих в доме. Нужен спокойный и последовательный хозяин.' },
      { title: 'Шерсть и окрас', body: 'Короткая, плотная, погодостойкая. Чёрный, серо-голубой, палевый и тигровый, часто с тёмной маской. Уход минимальный, линька сезонная и обильная.' },
      { title: 'Что нужно', body: 'Две полноценные прогулки в день, ранняя социализация и стабильные правила. Не вольерная и не первая собака — но выдающийся семейный охранник.' },
    ],
  },
  kennel: {
    eyebrow: 'Питомник',
    title: 'Мало помётов.\nБез спешки.',
    lead: 'Del Cani Terezzine держит немного собак, чтобы каждая жила в доме, а не в вольере. Планируем один-два помёта в год, подбираем кобелей по структуре и типу головы, отдаём щенков только туда, где с ними будут работать.',
    facts: [
      { term: 'Регистрация', detail: 'Украинский Кинологический и Фелинологический Союз (UKFU), сертифицированная родословная с каждым щенком' },
      { term: 'Здоровье', detail: 'Снимки тазобедренных и локтевых суставов, кардио- и офтальмопроверки племенных собак' },
      { term: 'Передача', detail: 'С 8 недель: вакцинирован, чипирован, дегельминтизирован, с ветпаспортом' },
      { term: 'После', detail: 'Пожизненные консультации по кормлению, росту и воспитанию — и право первого выкупа, если когда-нибудь будете отдавать' },
    ],
  },
  gallery: { eyebrow: 'Фото', title: 'Наши собаки', note: 'Взрослые и юниоры наших линий. Нажмите на кадр, чтобы открыть полностью.', empty: 'Фотографии добавляются.' },
  film: { eyebrow: 'Видео', title: 'В движении', note: 'Короткие ролики: движение, структура и темперамент на просторе.', empty: 'Видео добавляется — спросите у нас актуальные ролики.' },
  pedigree: {
    eyebrow: 'Родословная',
    title: 'Задокументировано\nс обеих сторон.',
    lead: 'Каждый щенок уезжает с сертифицированной родословной Украинского Кинологического и Фелинологического Союза. Ниже — родительская пара нашей текущей линии.',
    sire: 'Отец',
    dam: 'Мать',
    sireName: 'Ahiles del Cani Terezzine',
    damName: 'Rolanda iz Gvardiitora',
    sireLine: 'Кобель · Cane Corso Italiano · Чёрный',
    damLine: 'Сука · Cane Corso Italiano · Голубая',
    union: 'Украинский Кинологический и Фелинологический Союз',
  },
  people: {
    eyebrow: 'Люди',
    title: 'Кому на самом деле\nпринадлежат эти собаки.',
    lead: 'Семейный питомник, а не бизнес-центр. Собаки делят с нами дом, машину и большую часть дивана.',
    members: [
      { name: 'Роман Иванов', role: 'Заводчик, хендлер', body: 'Пятнадцать лет с рабочими молосами. Планирует вязки, ведёт ринговую подготовку и отвечает на звонки.' },
      { name: 'Тереза Иванова', role: 'Имя питомника, выращивание', body: 'Питомник носит её имя. Ведёт роды, раннюю неврологическую стимуляцию и первые восемь недель социализации.' },
      { name: 'Елена Марченко', role: 'Ветеринарный врач', body: 'Проверяет племенное поголовье, сопровождает помёты и осматривает каждого щенка перед отъездом.' },
    ],
  },
  enquiry: {
    eyebrow: 'Заявка',
    title: 'Оставьте номер.\nМы перезвоним.',
    lead: 'Напишите имя и номер, по которому вас найти. Мы позвоним, расспросим, чего вы ждёте от собаки, и честно скажем, есть ли у нас такая.',
    firstName: 'Имя',
    lastName: 'Фамилия',
    phone: 'Номер телефона',
    note: 'Что нам стоит знать',
    notePlaceholder: 'Желаемый пол и окрас, сроки, держали ли вы охранную породу раньше…',
    submit: 'Перезвоните мне',
    sending: 'Отправляем…',
    call: 'Позвонить',
    callHint: 'Откроет телефон с нашим номером, готовым к набору.',
    consent: 'Ваш номер нужен только для обратного звонка.',
    doneTitle: 'Принято — мы позвоним.',
    doneBody: 'Заявка уже в питомнике. Ждите звонка в течение одного рабочего дня.',
    doneAgain: 'Отправить ещё одну',
    errors: {
      firstName: 'Укажите, пожалуйста, имя.',
      lastName: 'Укажите, пожалуйста, фамилию.',
      phone: 'Укажите номер, по которому до вас дозвониться.',
      generic: 'Что-то пошло не так. Попробуйте ещё раз.',
      network: 'Не удалось связаться с питомником. Проверьте соединение.',
    },
  },
  footer: { rights: 'Все права защищены.', address: 'Украина · просмотр по договорённости', nav: 'Разделы' },
}

export const dictionaries: Record<Lang, Dictionary> = { en, uk, ru }
