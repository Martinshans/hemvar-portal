export const NS3451_CATEGORIES = [
  {
    code: '2',
    label: 'Bygning',
    subcategories: [
      { code: '21', label: 'Grunn og fundamenter' },
      { code: '22', label: 'Bæresystemer' },
      { code: '23', label: 'Yttervegger' },
      { code: '24', label: 'Innervegger' },
      { code: '25', label: 'Dekker' },
      { code: '26', label: 'Yttertak' },
      { code: '27', label: 'Fast inventar' },
    ],
  },
  {
    code: '3',
    label: 'VVS',
    subcategories: [
      { code: '31', label: 'Sanitær' },
      { code: '32', label: 'Varme' },
      { code: '33', label: 'Brannslokking' },
      { code: '34', label: 'Gass og trykkluft' },
      { code: '36', label: 'Ventilasjon og luftbehandling' },
    ],
  },
  {
    code: '4',
    label: 'Elkraft',
    subcategories: [
      { code: '41', label: 'Basisinstallasjoner for elkraft' },
      { code: '42', label: 'Høyspenningsanlegg' },
      { code: '43', label: 'Lavspenningsanlegg' },
      { code: '44', label: 'Lysanlegg' },
      { code: '45', label: 'Elvarme' },
    ],
  },
  {
    code: '5',
    label: 'Tele og automatisering',
    subcategories: [
      { code: '51', label: 'Basisinstallasjoner for tele og automatisering' },
      { code: '52', label: 'Integrert kommunikasjon' },
      { code: '53', label: 'Telefoni og personsøking' },
      { code: '54', label: 'Alarm- og signalanlegg' },
      { code: '56', label: 'Automatisering' },
    ],
  },
  {
    code: '6',
    label: 'Andre installasjoner',
    subcategories: [
      { code: '61', label: 'Reservekraft' },
      { code: '63', label: 'Heiser' },
    ],
  },
  {
    code: '7',
    label: 'Utendørs',
    subcategories: [
      { code: '71', label: 'Bearbeidet terreng' },
      { code: '72', label: 'Utendørs konstruksjoner' },
      { code: '73', label: 'Utendørs VVS' },
      { code: '74', label: 'Utendørs elkraft' },
      { code: '76', label: 'Veier og plasser' },
    ],
  },
]

export function getCategoryLabel(code) {
  for (const cat of NS3451_CATEGORIES) {
    if (cat.code === code) return cat.label
    const sub = cat.subcategories.find((s) => s.code === code)
    if (sub) return sub.label
  }
  return code
}

export function getMainCategory(code) {
  return NS3451_CATEGORIES.find((c) => c.code === code?.[0])
}
