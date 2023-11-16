/* eslint-env browser */
const states = {};

const ERRORS = {
  en: {
    message: (stateName, line, created) => `You attempted to create a duplicate Evo state named "${stateName}". The state you attempted to create here: "${line}" was already created here: "${created}"`,
    created: (createdAt) => `The original code that created this state is found ${createdAt}`
  },
  fr: {
    message: (stateName, line, created) => `Vous avez tenté de créer un état Evo en double nommé "${stateName}". L'état que vous avez tenté de créer ici : "${line}" a déjà été créé ici : "${created}"`,
    created: (createdAt) => `Le code original qui a créé cet état se trouve ${createdAt}`
  },
  es: {
    message: (stateName, line, created) => `Has intentado crear un estado Evo duplicado llamado "${stateName}". El estado que intentaste crear aquí: "${line}" ya fue creado aquí: "${created}"`,
    created: (createdAt) => `El código original que creó este estado se encuentra en ${createdAt}`
  },
  de: {
    message: (stateName, line, created) => `Sie haben versucht, einen doppelten Evo-Zustand namens "${stateName}" zu erstellen. Der Zustand, den Sie hier erstellen wollten: "${line}", wurde bereits hier erstellt: "${created}"`,
    created: (createdAt) => `Der ursprüngliche Code, der diesen Zustand erstellt hat, wurde gefunden ${createdAt}`
  },
  it: {
    message: (stateName, line, created) => `Hai tentato di creare uno stato Evo duplicato chiamato "${stateName}". Lo stato che hai cercato di creare qui: "${line}" è già stato creato qui: "${created}"`,
    created: (createdAt) => `Il codice originale che ha creato questo stato è stato trovato ${createdAt}`
  },
  ru: {
    message: (stateName, line, created) => `Вы попытались создать дубликат состояния Evo с именем "${stateName}". Состояние, которое вы пытались создать здесь: "${line}", уже было создано здесь: "${created}"`,
    created: (createdAt) => `Оригинальный код, который создал это состояние, находится здесь: ${createdAt}`
  },
  pt: {
    message: (stateName, line, created) => `Você tentou criar um estado Evo duplicado com o nome "${stateName}". O estado que você tentou criar aqui: "${line}" já foi criado aqui: "${created}"`,
    created: (createdAt) => `O código original que criou este estado foi encontrado ${createdAt}`
  },
  ja: {
    message: (stateName, line, created) => `名前が"${stateName}"の重複した Evo ステートを作成しようとしました。ここで作成しようとしたステート: "${line}" は既にここで作成されています: "${created}"`,
    created: (createdAt) => `このステートを作成した元のコードが見つかりました: ${createdAt}`
  },
  zh: {
    message: (stateName, line, created) => `您尝试创建了一个重复的 Evo 状态，名称为"${stateName}"。您在这里尝试创建的状态: "${line}" 在这里已经被创建: "${created}"`,
    created: (createdAt) => `创建此状态的原始代码位于 ${createdAt}`
  },
  ko: {
    message: (stateName, line, created) => `이름이 "${stateName}"인 중복 Evo 상태를 생성하려고 시도했습니다. 여기에서 만들려고 한 상태: "${line}"은(는) 이미 여기에서 만들어졌습니다: "${created}"`,
    created: (createdAt) => `이 상태를 생성한 원본 코드가 여기에 있습니다: ${createdAt}`
  }
}

const isSafari = navigator.userAgent.includes('Safari') && !navigator.userAgent.includes('Chrome');
const isFirefox = navigator.userAgent.includes('Firefox');

function getI18NMsg(key) {
  let locale = (document.documentElement.lang || navigator.language).split('-')[0].toLowerCase();
  if (!ERRORS.hasOwnProperty(locale)) {
    locale = 'en';
  }

  return ERRORS[locale][key];
}

export class EvoStateError extends Error {
  constructor(stateName) {
    const { createdAt } = states[stateName];
    const original = getI18NMsg('created')(createdAt);
    const temp = new Error();
    const lines = temp.stack.split('\n');
    const num = (isSafari || isFirefox) ? 2 : 3;
    const line = lines[num].trim().replace(/^\s*at /, '');
    let message = getI18NMsg('message')(stateName, line, createdAt);
    super(message);

    if(isFirefox) {
      this.stack += `\n${original}`;
    }
  }
}

const stateProxyHandler = {};

/**
 * Declare a new state
 * @param {string} stateName
 * @param {any} defaultState
 */
export function createState(stateName, defaultState) {
  if (states.hasOwnProperty(stateName)) {
    throw new EvoStateError(stateName);
  }

  const createdAt = new Error();
  const lines = createdAt.stack.split('\n');
  const num = (lines[1].includes('@')) ? 1 : 2;
  const line = lines[num].replace(/^\s+at /, '');


  states[stateName] = new Proxy({
    createdAt: line,
    state: {defaultState}
  }, stateProxyHandler);
}

// eslint-disable-next-line no-unused-vars
export function getState(stateName) {
  
}