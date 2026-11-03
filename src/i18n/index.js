import enUS from "./en-us";

// ADD LANGUAGES HERE
const languages = [
  { name: "English", native: "English", code: "en-us", flag: "gb" },
  { name: "Russian", native: "Русский", code: "ru", flag: "ru" },
  { name: "German", native: "Deutsch", code: "de", flag: "de" },
  { name: "French", native: "Français", code: "fr", flag: "fr" },
  { name: "Spanish", native: "Español", code: "es", flag: "es" },
  { name: "Portuguese", native: "Português", code: "pt-br", flag: "pt" }
];

export { languages };

// DO NOT MODIFY THIS EXPORT, LANGUAGE FILES CAN BE DYNAMICALLY LOADED
export default {
  "en-us": enUS
};
