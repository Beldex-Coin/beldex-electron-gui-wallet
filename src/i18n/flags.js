// Simplified flag graphics from frame 421:3329: [colour, relative size] stripes,
// stacked vertically unless `row` is set. Sizes are flex ratios so the
// graphic scales with the flag box.
const FLAGS = {
  "en-us": {
    stripes: [
      ["#e2e2e2", 6],
      ["#3b4b37", 4],
      ["#454747", 6]
    ]
  },
  ru: {
    stripes: [
      ["#e2e2e2", 6],
      ["#84967e", 4],
      ["#93000a", 6]
    ]
  },
  de: {
    stripes: [
      ["#0e0e0e", 6],
      ["#93000a", 4],
      ["#e7bf99", 6]
    ]
  },
  fr: {
    row: true,
    stripes: [
      ["#84967e", 8],
      ["#e2e2e2", 8],
      ["#93000a", 8]
    ]
  },
  es: {
    stripes: [
      ["#93000a", 4],
      ["#e7bf99", 8],
      ["#93000a", 4]
    ]
  },
  "pt-br": {
    row: true,
    stripes: [
      ["#00bf0a", 10],
      ["#93000a", 14]
    ]
  }
};
const FALLBACK_FLAG = { stripes: [["#454747", 16]] };

export function flagGraphic(code) {
  return FLAGS[code] || FALLBACK_FLAG;
}

// en-us -> EN_US, ru -> RU_RU
export function localeCode(code) {
  const [language, region = language] = code.toUpperCase().split("-");
  return `${language}_${region}`;
}
