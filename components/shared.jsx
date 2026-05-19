/* global React */
const { useState, useEffect, useRef, useContext, createContext, useMemo } = React;

/* ------------------------------------------------------------------
   i18n — PL / EN / DE content for X39 LifeWave landing
   Source: PDF prezentacji LifeWave (16 stron) + Brand Brain v1.0
   ------------------------------------------------------------------ */
const COPY = {
  pl: {
    nav: { science: "Nauka", product: "Produkt", proof: "Dowody", team: "Zespół", faq: "FAQ", buy: "Kup plaster" },
    hero: {
      eyebrow: "LifeWave · Fototerapia · Komórki macierzyste",
      sceneA: { k: "Światło.", v: "Sygnał, który zna Twoje ciało." },
      sceneB: { k: "Plaster.", v: "Antena, która odbija Twoje ciepło." },
      sceneC: { k: "Regeneracja.", v: "Komórki macierzyste budzą się — bez iniekcji." },
      cta: "Kup plaster X39",
      ghost: "Dołącz do zespołu",
      scroll: "PRZEWIŃ",
      trust: ["100+ patentów", "80+ badań klinicznych", "90 dni gwarancji"],
    },
    body: {
      eyebrow: "Jak to działa",
      title: "Twoje ciało jest\nbaterią.",
      subtitle: "Nie chemia — światło. Nasze ciało emituje ciepło, które w rzeczywistości jest światłem podczerwonym. Plaster działa jak lustro, odbija to światło z powrotem na precyzyjnej długości fali. Nic nie przenika do krwi. To sygnał świetlny.",
      steps: [
        { n: "01", t: "Ciało emituje ciepło", d: "Twoja temperatura ciała to w rzeczywistości światło podczerwone — naturalna energia, którą wysyłasz 24h/dobę." },
        { n: "02", t: "Plaster jak lustro", d: "Zawiera opatentowane organiczne kryształy zamknięte w polimerowej powłoce. Odbijają światło na specyficznej długości fali." },
        { n: "03", t: "Sygnał wraca do ciała", d: "Fala świetlna o zmienionej, precyzyjnej częstotliwości aktywuje peptyd miedzi GHK-Cu w organizmie." },
      ],
      quote: { p: "Nasze DNA emituje światło — biofotony. Światło to nie tylko energia, to system komunikacji naszego organizmu.", c: "prof. Fritz-Albert Popp · biofizyk niemiecki, 1974" },
    },
    peptide: {
      eyebrow: "Cel sygnału",
      title: "Peptyd miedzi\nGHK-Cu.",
      subtitle: "Działa jak „główny modulator” Twojego organizmu. Badania pokazują, że jest w stanie zresetować ponad 4200 genów do młodszego, zdrowszego stanu — jak przywrócenie systemu operacyjnego komputera do ustawień fabrycznych.",
      reset: "4200",
      resetLabel: "genów zresetowanych do młodszego stanu",
      benefits: [
        { t: "Gojenie ran", d: "Przyspieszona regeneracja i redukcja stanów zapalnych." },
        { t: "Kolagen", d: "Zwiększona produkcja — młodsza, jędrniejsza skóra." },
        { t: "Naprawa DNA", d: "Ochrona antynowotworowa i naprawa uszkodzeń." },
        { t: "Mózg", d: "Poprawa pracy układu nerwowego i koncentracji." },
        { t: "Jelita", d: "Uszczelnienie i regeneracja układu trawiennego." },
      ],
      source: "Działanie peptydu miedzi GHK-Cu jest udokumentowane w bazie NIH PubMed.",
    },
    age: {
      eyebrow: "Dlaczego się starzejemy",
      title: "Z wiekiem sygnał\nsłabnie.",
      subtitle: "Komórki macierzyste to nasza naturalna „ekipa remontowa”. Mogą zamienić się w dowolną tkankę: serce, wątrobę, kości, skórę. Problem: z wiekiem ich aktywność dramatycznie spada.",
      points: [
        { age: "30", drop: "50%", label: "Produkcja spada o połowę. Pojawiają się pierwsze zmarszczki." },
        { age: "60", drop: "80-90%", label: "Pozostaje tylko 10-20% aktywnych komórek. Organizm nie nadąża z wymianą." },
      ],
      x39Line: "X39 podnosi poziom GHK-Cu, który aktywuje produkcję Twoich własnych komórek macierzystych.",
    },
    compare: {
      eyebrow: "Porównanie",
      title: "Iniekcje za 10 000 USD\n— czy plaster.",
      subtitle: "Te same komórki macierzyste. Inna metoda. Inny koszt. Inne ryzyko.",
      cols: [
        { tag: "Klasyczna terapia", title: "Iniekcje stem cells", items: [
          "Pobieranie komórek pępowinowych (obce DNA)",
          "Koszt: ok. 10 000 USD za sesję",
          "Bolesne i ryzykowne procedury",
          "Wymaga wizyt w klinice",
          "Stare i mało aktywne komórki",
        ]},
        { tag: "Plaster X39", title: "Fototerapia LifeWave", items: [
          "Aktywacja TWOICH własnych komórek",
          "Ułamek kosztów terapii klinicznych",
          "Bez iniekcji, bez chemii, bez ryzyka",
          "12h dziennie w domu, na karku",
          "Komórki w stanie młodzieńczym",
        ], highlight: true },
      ],
    },
    authority: {
      eyebrow: "Opinia lekarza",
      title: "40 lat w medycynie.\nNajpierw sceptyk.",
      subtitle: "Dr Don VerHulst — lekarz medycyny z 40-letnim stażem, naturopata. Zanim polecił X39 swoim pacjentom, sprawdził badania kliniczne.",
      ytId: "emaauU2X8vw",
      ytTitle: "Dr Don VerHulst — wywiad o X39 LifeWave",
      ytCaption: "YouTube · 10:15 · z napisami PL (auto)",
      bullets: [
        { t: "Badania kliniczne", d: "Sprawdzone: podwójnie ślepe, kontrolowane placebo, niezależne, recenzowane przez naukowców. Niektóre prowadzone w 2. na świecie ośrodku komórek regeneracyjnych — Uniwersytet w Irlandii." },
        { t: "Bezpieczeństwo", d: "Nic nie przenika do krwi. To nie jest transdermalny lek. To sygnał świetlny. Brak interakcji z farmaceutykami, witaminami, ziołami." },
        { t: "Efekty u pacjentów", d: "Najczęściej zgłaszane: lepszy sen, więcej energii, mniej bólu i zapalenia, jaśniejsze myślenie, poprawa skóry, lepsza praca jelit." },
      ],
    },
    timeline: {
      eyebrow: "Czego się spodziewać",
      title: "Pierwsze efekty\njuż w tygodniu.",
      subtitle: "Według danych LifeWave i obserwacji klinicystów — efekty pojawiają się stopniowo. 80% użytkowników zauważa coś znaczącego w 3-6 tygodni.",
      items: [
        { time: "1-30 dni", title: "Energia i sen", desc: "Lepszy sen, więcej energii w ciągu dnia. Ok. 50% użytkowników czuje różnicę od razu." },
        { time: "1-3 mies.", title: "Skóra i kolagen", desc: "Wygładzenie zmarszczek, poprawa jakości skóry dzięki produkcji kolagenu. Ponad 90% widzi zmiany." },
        { time: "6 mies.", title: "Układ krążenia", desc: "Badania kliniczne wykazały odmłodzenie układu sercowo-naczyniowego o ponad 8 lat." },
      ],
    },
    how: {
      eyebrow: "Stosowanie",
      title: "4 kroki,\n12 godzin.",
      subtitle: "Najprostszy biohack na świecie. Jeden plaster dziennie, 7 dni w tygodniu.",
      steps: [
        { n: "1", t: "Naklej rano", d: "Na czystą skórę — kark albo pod pępkiem. Bez kremów, bez olejków." },
        { n: "2", t: "Noś 12 godzin", d: "Czas aktywacji. Możesz pracować, ćwiczyć, brać prysznic." },
        { n: "3", t: "Zdejmij na noc", d: "Czas regeneracji. Plaster jest jednorazowy — wyrzuć." },
        { n: "4", t: "Powtórz", d: "Nowy plaster następnego dnia. Konsekwencja = pełne efekty." },
      ],
    },
    science: {
      eyebrow: "Nauka, nie science-fiction",
      title: "Brzmi nieprawdopodobnie.\nTo twarda nauka.",
      cards: [
        { n: "100+", t: "Patentów", d: "Patentów międzynarodowych chroniących wynalazek." },
        { n: "80+", t: "Badań klinicznych", d: "Podwójnie ślepe, placebo-controlled, peer-reviewed." },
        { n: "0", t: "Skutków ubocznych", d: "Bez inwazji. Brak substancji wprowadzanych do organizmu." },
      ],
    },
    guarantee: {
      eyebrow: "Gwarancja",
      title: "Przetestuj bez ryzyka.\n90 dni zwrotu.",
      subtitle: "LifeWave jest tak pewny technologii, że oferuje pełną gwarancję. Zamawiasz, używasz, a jeśli nie widzisz efektów — odsyłasz i dostajesz pełen zwrot. Bez pytań.",
      cta: "Zamów teraz w LifeWave",
      sub: "Realizacja 2-5 dni roboczych z laboratorium LifeWave.",
    },
    team: {
      eyebrow: "Dla partnerów",
      title: "Wejdź w biznes\nregeneracji.",
      subtitle: "Buduję wyselekcjonowany zespół dystrybutorów X39 w Polsce i polonii DACH. 8-12 osób na rok, nie 100. Kuratorska selekcja.",
      reasons: [
        { t: "AI-wsparcie codzienne", d: "Dostęp do 35+ skilli AI Piotra: content factory, generator scenariuszy, AI agent do leadów. Normalnie 5000+ zł/mc." },
        { t: "Strona biała marka", d: "Spersonalizowana wersja tej strony pod Twoją domeną — Twój referal, TidyCal, brand." },
        { t: "Leady z fabryki", d: "Overflow z lejków konsultacji Piotra (~200 rozmów/mc) — zainteresowani biohackingiem trafiają do partnerów." },
        { t: "Training co tydzień", d: "Cotygodniowe Zoom (1h) + Telegram klub — aktualizacje produktu, role-play obiekcji, najlepsze praktyki." },
      ],
      leaders: {
        title: "Top leaderzy LifeWave globalnie",
        sub: "Nie obietnica zarobku — fakt o skali firmy.",
        items: [
          { name: "Steve & Gina Merritt", rank: "Senior Presidential Directors", note: "Najwyższy rank w LifeWave." },
          { name: "Carl & Cathie Firestone", rank: "Senior Presidential Directors", note: "Najwyższy rank w LifeWave Corporation." },
          { name: "Jola Valle", rank: "Top European Leader · Hiszpania", note: "Jeden z liderów europejskiego rynku LifeWave." },
          { name: "Tutaj możesz być Ty", rank: "Polska — TOP 5 rynków EU", note: "Polska to jeden z pięciu czołowych rynków LifeWave w Europie." },
        ],
      },
      cta: "Umów 15-min rozmowę",
    },
    faq: {
      eyebrow: "FAQ",
      title: "Najczęstsze\npytania.",
      items: [
        { q: "Czy plaster X39 to lek?", a: "Nie. X39 nie jest wyrobem medycznym ani lekiem. To plaster fototerapeutyczny — wykorzystuje ciepło Twojego ciała do emisji specyficznej długości fali świetlnej. Nic nie przenika do organizmu." },
        { q: "Jak działa plaster X39?", a: "Plaster zawiera opatentowane organiczne kryształy. Twoje ciało emituje ciepło (podczerwień), kryształy odbijają to światło w precyzyjnej długości fali, która podnosi w organizmie poziom peptydu miedzi GHK-Cu — naturalnego sygnału aktywującego komórki macierzyste." },
        { q: "Czy jest bezpieczny?", a: "Tak. Plaster nie zawiera substancji wchłanialnych. Nie wchodzi w interakcje z lekami, suplementami, ziołami. Posiada 100+ patentów i 80+ badań klinicznych. Konsultuj się jednak ze swoim lekarzem." },
        { q: "Po jakim czasie zauważę efekty?", a: "50% użytkowników czuje różnicę od razu (energia, sen). 80% zauważa coś znaczącego w 3-6 tygodni. Pełen efekt regeneracyjny: 3-6 miesięcy konsekwencji." },
        { q: "Gdzie nakleić plaster?", a: "Standardowo na kark (między łopatkami) lub pod pępkiem. Skóra musi być czysta, sucha, bez kremów. Nosisz 12h, na noc zdejmujesz." },
        { q: "Czy muszę stosować codziennie?", a: "Tak, dla pełnych efektów — 7 dni w tygodniu. Plaster jednorazowy. W paczce 30 plastrów = miesiąc." },
        { q: "Czy mogę łączyć z lekami / suplementami?", a: "Tak — X39 to terapia światłem, nie chemia. Nie wchodzi w interakcje. Konsultuj się jednak z lekarzem jeśli bierzesz leki na receptę." },
        { q: "Jak działa gwarancja 90 dni?", a: "LifeWave oferuje pełną gwarancję zwrotu w 90 dni od zakupu — bez pytań. Jeśli nie widzisz efektów, odsyłasz nieużyte plastry i dostajesz pełen zwrot." },
      ],
    },
    footer: {
      brand: "X39 · regeneracja komórek",
      tagline: "Plaster fototerapii LifeWave. Niezależna dystrybucja — Piotr Muszyński.",
      cols: [
        { title: "Produkt", links: [["Jak działa", "#science"], ["Cena i zakup", "#buy"], ["FAQ", "#faq"]] },
        { title: "Zespół", links: [["Dla partnerów", "#team"], ["O mnie", "#about"], ["Kontakt", "#contact"]] },
        { title: "Prawne", links: [["Polityka prywatności", "polityka-prywatnosci.html"], ["Regulamin", "regulamin.html"], ["Cookies", "cookies.html"], ["Impressum", "impressum.html"]] },
      ],
      legal: "© 2026 Piotr Muszyński · Independent LifeWave Distributor",
      disclaimerMed: "Plastry X39 nie są wyrobem medycznym w rozumieniu Dyrektywy 93/42/EWG. Nie diagnozują, nie leczą ani nie zapobiegają chorobom. Konsultuj się ze swoim lekarzem.",
      disclaimerMlm: "Niezależny Dystrybutor LifeWave Corporation. Potencjał zarobkowy w biznesie z polecania zależy od indywidualnego zaangażowania. Brak gwarancji konkretnych przychodów.",
    },
    contact: {
      eyebrow: "Następny krok",
      title: "Zacznijmy od rozmowy.",
      subtitle: "15 minut bez zobowiązań. Powiesz co Cię boli, ja powiem szczerze czy X39 ma sens dla Ciebie.",
      cta1: "Umów 15 minut",
      cta2: "Napisz wiadomość",
    },
  },

  en: {
    nav: { science: "Science", product: "Product", proof: "Evidence", team: "Team", faq: "FAQ", buy: "Buy patch" },
    hero: {
      eyebrow: "LifeWave · Phototherapy · Stem Cells",
      sceneA: { k: "Light.", v: "A signal your body already knows." },
      sceneB: { k: "Patch.", v: "An antenna reflecting your own warmth." },
      sceneC: { k: "Regeneration.", v: "Stem cells wake up — without injections." },
      cta: "Buy X39 patch",
      ghost: "Join the team",
      scroll: "SCROLL",
      trust: ["100+ patents", "80+ clinical studies", "90-day guarantee"],
    },
    body: {
      eyebrow: "How it works",
      title: "Your body\nis a battery.",
      subtitle: "Not chemistry — light. Your body emits warmth, which is actually infrared light. The patch acts as a mirror, reflecting that light back at a precise wavelength. Nothing penetrates your bloodstream. It's a light signal.",
      steps: [
        { n: "01", t: "Body emits warmth", d: "Your body temperature is infrared light — a natural energy you radiate 24h a day." },
        { n: "02", t: "Patch acts as mirror", d: "It contains patented organic crystals sealed in a polymer film. They reflect light at a specific wavelength." },
        { n: "03", t: "Signal returns to body", d: "A precisely modulated light wave activates the copper peptide GHK-Cu in your system." },
      ],
      quote: { p: "Our DNA emits light — biophotons. Light is not just energy; it's our body's communication system.", c: "Prof. Fritz-Albert Popp · German biophysicist, 1974" },
    },
    peptide: {
      eyebrow: "Signal target",
      title: "Copper peptide\nGHK-Cu.",
      subtitle: "Acts as a master modulator. Research shows it can reset over 4,200 genes to a younger, healthier state — like restoring a computer OS to factory settings.",
      reset: "4,200",
      resetLabel: "genes reset to a younger state",
      benefits: [
        { t: "Wound healing", d: "Faster regeneration and reduced inflammation." },
        { t: "Collagen", d: "Increased production — younger, firmer skin." },
        { t: "DNA repair", d: "Anti-cancer protection and damage repair." },
        { t: "Brain", d: "Improved nervous system function and focus." },
        { t: "Gut", d: "Sealed lining and digestive tract regeneration." },
      ],
      source: "GHK-Cu copper peptide is well-documented in the NIH PubMed library.",
    },
    age: {
      eyebrow: "Why we age",
      title: "With age the\nsignal weakens.",
      subtitle: "Stem cells are your natural \"repair crew\" — they can become any tissue: heart, liver, bone, skin. The problem: their activity drops dramatically with age.",
      points: [
        { age: "30", drop: "50%", label: "Production drops by half. First wrinkles appear." },
        { age: "60", drop: "80-90%", label: "Only 10-20% of active cells remain. The body can't keep up with cell replacement." },
      ],
      x39Line: "X39 raises GHK-Cu levels, which activates production of your own stem cells.",
    },
    compare: {
      eyebrow: "Comparison",
      title: "$10,000 injections\n— or a patch.",
      subtitle: "Same stem cells. Different method. Different cost. Different risk.",
      cols: [
        { tag: "Classical therapy", title: "Stem cell injections", items: [
          "Harvested umbilical cells (foreign DNA)",
          "Cost: ~$10,000 per session",
          "Painful and risky procedures",
          "Requires clinic visits",
          "Often old, low-activity cells",
        ]},
        { tag: "X39 patch", title: "LifeWave phototherapy", items: [
          "Activates YOUR OWN cells",
          "Fraction of clinical costs",
          "No injections, no chemicals, no risk",
          "12h a day at home, on your neck",
          "Cells in a youthful state",
        ], highlight: true },
      ],
    },
    authority: {
      eyebrow: "A doctor's opinion",
      title: "40 years in medicine.\nA skeptic first.",
      subtitle: "Dr. Don VerHulst — MD with 40 years of practice, naturopath. Before recommending X39 to his patients, he reviewed the clinical research.",
      ytId: "emaauU2X8vw",
      ytTitle: "Dr. Don VerHulst — X39 LifeWave interview",
      ytCaption: "YouTube · 10:15 · auto subtitles",
      bullets: [
        { t: "Clinical research", d: "Double-blind, placebo-controlled, independent, peer-reviewed. Some studies conducted at the world's 2nd-ranked regenerative cell research center — University of Ireland." },
        { t: "Safety", d: "Nothing penetrates the bloodstream. Not a transdermal drug — a light signal. No interactions with pharmaceuticals, vitamins, herbs." },
        { t: "Patient outcomes", d: "Most commonly reported: better sleep, more energy, less pain and inflammation, clearer thinking, skin improvement, better gut function." },
      ],
    },
    timeline: {
      eyebrow: "What to expect",
      title: "First effects\nin the first week.",
      subtitle: "Based on LifeWave data and clinical observations — effects appear gradually. 80% of users notice something significant within 3-6 weeks.",
      items: [
        { time: "1-30 days", title: "Energy & sleep", desc: "Better sleep, more energy during the day. About 50% of users feel a difference immediately." },
        { time: "1-3 months", title: "Skin & collagen", desc: "Wrinkles smoothed, skin quality improves through collagen production. Over 90% see changes." },
        { time: "6 months", title: "Cardiovascular", desc: "Clinical studies have shown cardiovascular rejuvenation by over 8 years." },
      ],
    },
    how: {
      eyebrow: "Usage",
      title: "4 steps,\n12 hours.",
      subtitle: "The simplest biohack in the world. One patch a day, 7 days a week.",
      steps: [
        { n: "1", t: "Apply in the morning", d: "On clean skin — neck or below the navel. No creams, no oils." },
        { n: "2", t: "Wear for 12 hours", d: "Activation time. You can work, train, shower." },
        { n: "3", t: "Remove at night", d: "Recovery time. The patch is single-use — discard." },
        { n: "4", t: "Repeat", d: "Fresh patch the next day. Consistency = full effects." },
      ],
    },
    science: {
      eyebrow: "Science, not science-fiction",
      title: "Sounds improbable.\nIt's hard science.",
      cards: [
        { n: "100+", t: "Patents", d: "International patents protecting the invention." },
        { n: "80+", t: "Clinical studies", d: "Double-blind, placebo-controlled, peer-reviewed." },
        { n: "0", t: "Side effects", d: "Non-invasive. Nothing introduced into the body." },
      ],
    },
    guarantee: {
      eyebrow: "Guarantee",
      title: "Try it risk-free.\n90-day refund.",
      subtitle: "LifeWave is so confident in the technology, they offer a full guarantee. You order, you try it, and if you don't see results — you return and get a full refund. No questions.",
      cta: "Order from LifeWave",
      sub: "Fulfillment in 2-5 business days from the LifeWave lab.",
    },
    team: {
      eyebrow: "For partners",
      title: "Step into the\nregeneration business.",
      subtitle: "I'm building a selected team of X39 distributors in Poland and the Polish diaspora in DACH. 8-12 people per year — not 100. Curated selection.",
      reasons: [
        { t: "Daily AI support", d: "Access to Piotr's 35+ AI skills: content factory, scenario generator, AI agent for leads. Normally 5,000+ PLN/month." },
        { t: "White-label website", d: "Personalized version of this page under your domain — your referral, TidyCal, brand." },
        { t: "Leads from the factory", d: "Overflow from Piotr's consulting funnels (~200 calls/month) — biohacking-curious people are routed to partners." },
        { t: "Weekly training", d: "Weekly Zoom (1h) + Telegram club — product updates, objection role-plays, best practices." },
      ],
      leaders: {
        title: "Top LifeWave leaders globally",
        sub: "Not a guarantee — a fact about the company's scale.",
        items: [
          { name: "Steve & Gina Merritt", rank: "Senior Presidential Directors", note: "Highest rank in LifeWave." },
          { name: "Carl & Cathie Firestone", rank: "Senior Presidential Directors", note: "Highest rank in LifeWave Corporation." },
          { name: "Jola Valle", rank: "Top European Leader · Spain", note: "One of the leaders of the European LifeWave market." },
          { name: "This could be you", rank: "Poland — TOP 5 EU markets", note: "Poland is one of LifeWave's top five markets in Europe." },
        ],
      },
      cta: "Book a 15-min call",
    },
    faq: {
      eyebrow: "FAQ",
      title: "Frequently asked\nquestions.",
      items: [
        { q: "Is the X39 patch a drug?", a: "No. X39 is not a medical device or a drug. It's a phototherapy patch — it uses your body heat to emit a specific wavelength of light. Nothing enters the body." },
        { q: "How does the X39 patch work?", a: "The patch contains patented organic crystals. Your body emits warmth (infrared); the crystals reflect that light at a precise wavelength, which raises the level of copper peptide GHK-Cu — a natural signal activating stem cells." },
        { q: "Is it safe?", a: "Yes. The patch has no absorbable substances. It does not interact with medications, supplements, herbs. 100+ patents and 80+ clinical studies. Consult your doctor regardless." },
        { q: "When will I notice effects?", a: "50% of users feel a difference right away (energy, sleep). 80% notice something significant in 3-6 weeks. Full regenerative effect: 3-6 months of consistency." },
        { q: "Where do I apply the patch?", a: "Standard placement is on the neck (between the shoulder blades) or below the navel. Skin must be clean, dry, free of creams. Wear for 12 hours, remove at night." },
        { q: "Do I need to apply it daily?", a: "Yes, for full effects — 7 days a week. The patch is single-use. A pack of 30 = one month." },
        { q: "Can I combine with medications / supplements?", a: "Yes — X39 is light therapy, not chemistry. No interactions. Consult your doctor if you take prescription medications." },
        { q: "How does the 90-day guarantee work?", a: "LifeWave offers a full refund within 90 days of purchase — no questions asked. If you don't see results, you return unused patches and receive a full refund." },
      ],
    },
    footer: {
      brand: "X39 · cell regeneration",
      tagline: "LifeWave phototherapy patch. Independent distribution — Piotr Muszyński.",
      cols: [
        { title: "Product", links: [["How it works", "#science"], ["Pricing & purchase", "#buy"], ["FAQ", "#faq"]] },
        { title: "Team", links: [["For partners", "#team"], ["About me", "#about"], ["Contact", "#contact"]] },
        { title: "Legal", links: [["Privacy policy", "polityka-prywatnosci.html"], ["Terms", "regulamin.html"], ["Cookies", "cookies.html"], ["Impressum", "impressum.html"]] },
      ],
      legal: "© 2026 Piotr Muszyński · Independent LifeWave Distributor",
      disclaimerMed: "X39 patches are not medical devices within the meaning of Directive 93/42/EEC. They do not diagnose, treat, or prevent diseases. Consult your physician.",
      disclaimerMlm: "Independent LifeWave Distributor. Earning potential in referral business depends on individual commitment. No guarantee of specific income.",
    },
    contact: {
      eyebrow: "Next step",
      title: "Let's start with a conversation.",
      subtitle: "15 minutes, no strings. Tell me what hurts — I'll tell you honestly whether X39 makes sense for you.",
      cta1: "Book 15 minutes",
      cta2: "Write a message",
    },
  },

  de: {
    nav: { science: "Wissenschaft", product: "Produkt", proof: "Beweise", team: "Team", faq: "FAQ", buy: "Patch kaufen" },
    hero: {
      eyebrow: "LifeWave · Phototherapie · Stammzellen",
      sceneA: { k: "Licht.", v: "Ein Signal, das dein Körper kennt." },
      sceneB: { k: "Patch.", v: "Eine Antenne, die deine Wärme reflektiert." },
      sceneC: { k: "Regeneration.", v: "Stammzellen erwachen — ohne Injektionen." },
      cta: "X39 Patch kaufen",
      ghost: "Team beitreten",
      scroll: "SCROLLEN",
      trust: ["100+ Patente", "80+ klinische Studien", "90 Tage Garantie"],
    },
    body: {
      eyebrow: "So funktioniert es",
      title: "Dein Körper\nist eine Batterie.",
      subtitle: "Keine Chemie — Licht. Dein Körper strahlt Wärme aus, die in Wirklichkeit Infrarotlicht ist. Der Patch wirkt wie ein Spiegel, reflektiert dieses Licht in einer präzisen Wellenlänge zurück. Nichts dringt in dein Blut ein. Es ist ein Lichtsignal.",
      steps: [
        { n: "01", t: "Körper strahlt Wärme aus", d: "Deine Körpertemperatur ist Infrarotlicht — natürliche Energie, die du 24h am Tag ausstrahlst." },
        { n: "02", t: "Patch wirkt als Spiegel", d: "Enthält patentierte organische Kristalle in einer Polymerhülle. Reflektieren Licht in einer spezifischen Wellenlänge." },
        { n: "03", t: "Signal kehrt in den Körper zurück", d: "Eine präzise modulierte Lichtwelle aktiviert das Kupferpeptid GHK-Cu im Organismus." },
      ],
      quote: { p: "Unsere DNA emittiert Licht — Biophotonen. Licht ist nicht nur Energie, es ist das Kommunikationssystem unseres Organismus.", c: "Prof. Fritz-Albert Popp · deutscher Biophysiker, 1974" },
    },
    peptide: {
      eyebrow: "Signalziel",
      title: "Kupferpeptid\nGHK-Cu.",
      subtitle: "Wirkt als „Hauptmodulator” deines Organismus. Studien zeigen, dass es über 4.200 Gene in einen jüngeren, gesünderen Zustand zurücksetzen kann — wie ein Computer-Reset auf Werkseinstellungen.",
      reset: "4.200",
      resetLabel: "Gene auf einen jüngeren Zustand zurückgesetzt",
      benefits: [
        { t: "Wundheilung", d: "Schnellere Regeneration und Reduktion von Entzündungen." },
        { t: "Kollagen", d: "Erhöhte Produktion — jüngere, straffere Haut." },
        { t: "DNA-Reparatur", d: "Krebsschutz und Schadensreparatur." },
        { t: "Gehirn", d: "Verbesserung der Nervensystem-Funktion und Konzentration." },
        { t: "Darm", d: "Versiegelung und Regeneration des Verdauungstrakts." },
      ],
      source: "Die Wirkung des Kupferpeptids GHK-Cu ist in der NIH PubMed Datenbank gut dokumentiert.",
    },
    age: {
      eyebrow: "Warum wir altern",
      title: "Mit dem Alter\nwird das Signal schwächer.",
      subtitle: "Stammzellen sind unsere natürliche „Reparaturmannschaft” — sie können zu jedem Gewebe werden: Herz, Leber, Knochen, Haut. Das Problem: ihre Aktivität sinkt dramatisch mit dem Alter.",
      points: [
        { age: "30", drop: "50%", label: "Produktion halbiert sich. Erste Falten erscheinen." },
        { age: "60", drop: "80-90%", label: "Nur 10-20% aktiver Zellen bleiben. Der Körper kommt mit der Zellerneuerung nicht mehr nach." },
      ],
      x39Line: "X39 erhöht die GHK-Cu-Werte, was die Produktion deiner eigenen Stammzellen aktiviert.",
    },
    compare: {
      eyebrow: "Vergleich",
      title: "10.000 $ Injektionen\n— oder ein Patch.",
      subtitle: "Gleiche Stammzellen. Andere Methode. Andere Kosten. Anderes Risiko.",
      cols: [
        { tag: "Klassische Therapie", title: "Stammzell-Injektionen", items: [
          "Nabelschnurzellen (fremde DNA)",
          "Kosten: ~10.000 $ pro Sitzung",
          "Schmerzhafte und riskante Verfahren",
          "Erfordert Klinikbesuche",
          "Oft alte, wenig aktive Zellen",
        ]},
        { tag: "X39 Patch", title: "LifeWave Phototherapie", items: [
          "Aktivierung DEINER EIGENEN Zellen",
          "Bruchteil der klinischen Kosten",
          "Keine Injektionen, keine Chemie, kein Risiko",
          "12h am Tag zu Hause, am Nacken",
          "Zellen in einem jugendlichen Zustand",
        ], highlight: true },
      ],
    },
    authority: {
      eyebrow: "Eine Arztmeinung",
      title: "40 Jahre Medizin.\nZuerst Skeptiker.",
      subtitle: "Dr. Don VerHulst — Arzt mit 40 Jahren Praxis, Naturheilkundler. Bevor er X39 seinen Patienten empfahl, prüfte er die klinischen Studien.",
      ytId: "emaauU2X8vw",
      ytTitle: "Dr. Don VerHulst — X39 LifeWave Interview",
      ytCaption: "YouTube · 10:15 · automatische Untertitel",
      bullets: [
        { t: "Klinische Forschung", d: "Doppelblind, placebokontrolliert, unabhängig, peer-reviewed. Einige Studien am weltweit zweitrangigen Zentrum für regenerative Zellforschung — Universität in Irland." },
        { t: "Sicherheit", d: "Nichts dringt in den Blutkreislauf ein. Kein transdermales Medikament — ein Lichtsignal. Keine Wechselwirkungen mit Pharmazeutika, Vitaminen, Kräutern." },
        { t: "Patientenergebnisse", d: "Am häufigsten berichtet: besserer Schlaf, mehr Energie, weniger Schmerzen und Entzündungen, klareres Denken, Hautverbesserung, bessere Darmfunktion." },
      ],
    },
    timeline: {
      eyebrow: "Was erwarten",
      title: "Erste Effekte\nin der ersten Woche.",
      subtitle: "Laut LifeWave-Daten und klinischen Beobachtungen — Effekte erscheinen schrittweise. 80% der Nutzer bemerken etwas Signifikantes innerhalb von 3-6 Wochen.",
      items: [
        { time: "1-30 Tage", title: "Energie & Schlaf", desc: "Besserer Schlaf, mehr Energie tagsüber. Etwa 50% der Nutzer spüren sofort einen Unterschied." },
        { time: "1-3 Monate", title: "Haut & Kollagen", desc: "Falten geglättet, Hautqualität verbessert durch Kollagenproduktion. Über 90% sehen Veränderungen." },
        { time: "6 Monate", title: "Herz-Kreislauf", desc: "Klinische Studien zeigten eine Verjüngung des Herz-Kreislauf-Systems um über 8 Jahre." },
      ],
    },
    how: {
      eyebrow: "Anwendung",
      title: "4 Schritte,\n12 Stunden.",
      subtitle: "Der einfachste Biohack der Welt. Ein Patch täglich, 7 Tage die Woche.",
      steps: [
        { n: "1", t: "Morgens aufkleben", d: "Auf saubere Haut — Nacken oder unterhalb des Bauchnabels. Keine Cremes, keine Öle." },
        { n: "2", t: "12 Stunden tragen", d: "Aktivierungszeit. Du kannst arbeiten, trainieren, duschen." },
        { n: "3", t: "Nachts entfernen", d: "Erholungszeit. Der Patch ist einmalig — entsorgen." },
        { n: "4", t: "Wiederholen", d: "Neuer Patch am nächsten Tag. Konsistenz = volle Wirkung." },
      ],
    },
    science: {
      eyebrow: "Wissenschaft, keine Science-Fiction",
      title: "Klingt unwahrscheinlich.\nIst harte Wissenschaft.",
      cards: [
        { n: "100+", t: "Patente", d: "Internationale Patente schützen die Erfindung." },
        { n: "80+", t: "Klinische Studien", d: "Doppelblind, placebokontrolliert, peer-reviewed." },
        { n: "0", t: "Nebenwirkungen", d: "Nicht invasiv. Nichts wird in den Körper eingeführt." },
      ],
    },
    guarantee: {
      eyebrow: "Garantie",
      title: "Risikofrei testen.\n90 Tage Rückgabe.",
      subtitle: "LifeWave ist von der Technologie so überzeugt, dass eine volle Garantie angeboten wird. Du bestellst, nutzt — und wenn keine Ergebnisse sichtbar sind, sendest du zurück und erhältst eine volle Rückerstattung. Keine Fragen.",
      cta: "Jetzt bei LifeWave bestellen",
      sub: "Lieferung in 2-5 Werktagen aus dem LifeWave-Labor.",
    },
    team: {
      eyebrow: "Für Partner",
      title: "Steig in das\nRegenerationsgeschäft ein.",
      subtitle: "Ich baue ein selektiertes Team von X39-Distributoren in Polen und der polnischen Diaspora in DACH auf. 8-12 Personen pro Jahr — nicht 100. Kuratierte Auswahl.",
      reasons: [
        { t: "Tägliche KI-Unterstützung", d: "Zugang zu Piotrs 35+ KI-Skills: Content-Factory, Szenario-Generator, KI-Agent für Leads. Normalerweise 5.000+ PLN/Monat." },
        { t: "White-Label-Website", d: "Personalisierte Version dieser Seite unter deiner Domain — deine Referral, TidyCal, Marke." },
        { t: "Leads aus der Fabrik", d: "Überlauf aus Piotrs Beratungstrichtern (~200 Gespräche/Monat) — Biohacking-Interessierte werden an Partner weitergeleitet." },
        { t: "Wöchentliches Training", d: "Wöchentliches Zoom (1h) + Telegram-Club — Produkt-Updates, Einwand-Rollenspiele, Best Practices." },
      ],
      leaders: {
        title: "Top LifeWave-Leader weltweit",
        sub: "Keine Verdienstgarantie — eine Tatsache über die Unternehmensgröße.",
        items: [
          { name: "Steve & Gina Merritt", rank: "Senior Presidential Directors", note: "Höchster Rang bei LifeWave." },
          { name: "Carl & Cathie Firestone", rank: "Senior Presidential Directors", note: "Höchster Rang bei LifeWave Corporation." },
          { name: "Jola Valle", rank: "Top European Leader · Spanien", note: "Einer der Leader des europäischen LifeWave-Marktes." },
          { name: "Hier könntest du stehen", rank: "Polen — TOP 5 EU-Märkte", note: "Polen ist einer der fünf führenden LifeWave-Märkte in Europa." },
        ],
      },
      cta: "15-Min Gespräch buchen",
    },
    faq: {
      eyebrow: "FAQ",
      title: "Häufig gestellte\nFragen.",
      items: [
        { q: "Ist der X39 Patch ein Medikament?", a: "Nein. X39 ist kein Medizinprodukt und kein Medikament. Es ist ein Phototherapie-Patch — er nutzt deine Körperwärme, um eine spezifische Lichtwellenlänge zu emittieren. Nichts dringt in den Körper ein." },
        { q: "Wie funktioniert der X39 Patch?", a: "Der Patch enthält patentierte organische Kristalle. Dein Körper strahlt Wärme aus (Infrarot); die Kristalle reflektieren dieses Licht in einer präzisen Wellenlänge, die den Spiegel des Kupferpeptids GHK-Cu erhöht — ein natürliches Signal, das Stammzellen aktiviert." },
        { q: "Ist es sicher?", a: "Ja. Der Patch enthält keine resorbierbaren Stoffe. Keine Wechselwirkungen mit Medikamenten, Supplements, Kräutern. 100+ Patente und 80+ klinische Studien. Konsultiere dennoch deinen Arzt." },
        { q: "Wann werde ich Effekte bemerken?", a: "50% der Nutzer spüren sofort einen Unterschied (Energie, Schlaf). 80% bemerken in 3-6 Wochen etwas Signifikantes. Volle Regenerationswirkung: 3-6 Monate Konsistenz." },
        { q: "Wo klebe ich den Patch auf?", a: "Standardplatzierung am Nacken (zwischen den Schulterblättern) oder unterhalb des Bauchnabels. Haut muss sauber, trocken, ohne Cremes sein. 12h tragen, nachts entfernen." },
        { q: "Muss ich täglich anwenden?", a: "Ja, für volle Wirkung — 7 Tage die Woche. Patch ist einmalig. Eine Packung mit 30 Stück = ein Monat." },
        { q: "Kann ich mit Medikamenten / Supplements kombinieren?", a: "Ja — X39 ist Lichttherapie, keine Chemie. Keine Wechselwirkungen. Konsultiere dennoch deinen Arzt bei verschreibungspflichtigen Medikamenten." },
        { q: "Wie funktioniert die 90-Tage-Garantie?", a: "LifeWave bietet eine volle Rückerstattung innerhalb von 90 Tagen ab Kauf — keine Fragen gestellt. Wenn du keine Ergebnisse siehst, sendest du unbenutzte Patches zurück und erhältst eine volle Rückerstattung." },
      ],
    },
    footer: {
      brand: "X39 · Zellregeneration",
      tagline: "LifeWave Phototherapie-Patch. Unabhängige Distribution — Piotr Muszyński.",
      cols: [
        { title: "Produkt", links: [["So funktioniert es", "#science"], ["Preis & Kauf", "#buy"], ["FAQ", "#faq"]] },
        { title: "Team", links: [["Für Partner", "#team"], ["Über mich", "#about"], ["Kontakt", "#contact"]] },
        { title: "Rechtliches", links: [["Datenschutz", "polityka-prywatnosci.html"], ["AGB", "regulamin.html"], ["Cookies", "cookies.html"], ["Impressum", "impressum.html"]] },
      ],
      legal: "© 2026 Piotr Muszyński · Independent LifeWave Distributor",
      disclaimerMed: "X39 Patches sind keine Medizinprodukte im Sinne der Richtlinie 93/42/EWG. Sie diagnostizieren, behandeln oder verhindern keine Krankheiten. Konsultiere deinen Arzt.",
      disclaimerMlm: "Unabhängiger LifeWave Distributor. Verdienstpotenzial im Empfehlungsgeschäft hängt vom individuellen Engagement ab. Keine Garantie konkreter Einnahmen.",
    },
    contact: {
      eyebrow: "Nächster Schritt",
      title: "Beginnen wir mit einem Gespräch.",
      subtitle: "15 Minuten, keine Verpflichtungen. Sag mir, was schmerzt — ich sage dir ehrlich, ob X39 für dich Sinn macht.",
      cta1: "15 Minuten buchen",
      cta2: "Nachricht schreiben",
    },
  },
};

/* ------------------------------------------------------------------
   App-wide context (locale, partner config)
   ------------------------------------------------------------------ */
const AppCtx = createContext(null);
const useApp = () => useContext(AppCtx);

/* Reveal-on-scroll hook */
function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const target = el.classList.contains("x-reveal") ? el : el.querySelector(".x-reveal");
    if (!target) return;
    target.classList.add("is-pending");
    const fallback = setTimeout(() => target.classList.remove("is-pending"), 500);
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { target.classList.remove("is-pending"); clearTimeout(fallback); io.disconnect(); }
      }),
      { threshold: 0, rootMargin: "0px 0px -80px 0px" }
    );
    io.observe(el);
    return () => { io.disconnect(); clearTimeout(fallback); };
  }, []);
  return ref;
}

Object.assign(window, { COPY, AppCtx, useApp, useReveal });
