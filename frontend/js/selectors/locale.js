
export const getLanguages = (state) => state.locale.languages;


export const geActiveLanguage = (state) =>
  state.locale.languages
    .filter((l) => l.active)[0];


export const gePersistedLanguage = (state) =>
  state.persisted.language;
