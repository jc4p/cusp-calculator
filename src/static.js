const PLANET_SORT_ORDER = ['Sun', 'Moon', 'Ascendant', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'];

const HOUSES_WITH_INFO = {
  "House1": {
    "title": "House I",
    "description": "What makes you you. What you like to wear. Who you want to be. The way you are, and the way you present to the world.",
    "ruling_planet": "Mars",
    "ruling_sign": "Aries"
  },
  "House2": {
    "title": "House II",
    "description": "Overall wealth, income, and security.",
    "ruling_planet": "Venus",
    "ruling_sign": "Taurus"
  },
  "House3": {
    "title": "House III",
    "description": "Your intellect, your communication skills, your problem solving skills.",
    "ruling_planet": "Mercury",
    "ruling_sign": "Gemini"
  },
  "House4": {
    "title": "House IV",
    "description": "Your home and family life.",
    "ruling_planet": "Cancer",
    "ruling_sign": "Moon"
  },
  "House5": {
    "title": "House V",
    "description": "Your love life. Sources of romance, fun, pleasure, leisure.",
    "ruling_planet": "Sun",
    "ruling_sign": "Leo"
  },
  "House6": {
    "title": "House VI",
    "description": "Your daily routine, how you perform the step by step actions of work. Health and fitness.",
    "ruling_planet": "Mercury",
    "ruling_sign": "Virgo"
  },
  "House7": {
    "title": "House VII",
    "description": "Serious arrangements and partnerships. Marriage, dating, or closing a new deal at work. How you handle them after the partnership has been signed off. ",
    "ruling_planet": "Venus",
    "ruling_sign": "Libra"
  },
  "House8": {
    "title": "House VIII",
    "description": "Transformational power. Rebirth. Regeneration. ",
    "ruling_planet": "Mars",
    "ruling_sign": "Scorpio"
  },
  "House9": {
    "title": "House IX",
    "description": "Moral center. Source of widest dreams, and how you approach difficult things like ethics.",
    "ruling_planet": "Jupiter",
    "ruling_sign": "Sagittarius"
  },
  "House10": {
    "title": "House X",
    "description": "Fame, rank, honors, all ways to climb the ladder of success.",
    "ruling_planet": "Saturn",
    "ruling_sign": "Capricorn"
  },
  "House11": {
    "title": "House XI",
    "description": "Source of all friendships, intimiate to biggest circles of friends.",
    "ruling_planet": "Uranus",
    "ruling_sign": "Aquarius"
  },
  "House12": {
    "title": "House XII",
    "description": "Your subconscious, instinct, secrets, the things that drive you without you even recognizing it. Source of self love, and self-undoing.",
    "ruling_planet": "Neptune",
    "ruling_sign": "Pisces"
  }
};

const SIGNS_WITH_INFO = {
  "Aries": {
    "icon": "https://cdn.glitch.com/e4e4a6b3-d941-4ce7-83d9-950d6528f824%2Fic_aries.svg",
    "title": "The Ram",
    "element": "Fire",
    "quality": "Cardinal",
    "ruler": "Mars",
    "dates": "3/20 - 4/19",
    "startColor": "#58A054",
    "endColor": "#FD500B"
  },
  "Taurus": {
    "icon": "https://cdn.glitch.com/e4e4a6b3-d941-4ce7-83d9-950d6528f824%2Fic_taurus.svg",
    "title": "The Bull",
    "element": "Earth",
    "quality": "Fixed",
    "ruler": "Venus",
    "dates": "4/19 - 5/20",
    "startColor": "#127A7D",
    "endColor": "#FF8E3B"
  },
  "Gemini": {
    "icon": "https://cdn.glitch.com/e4e4a6b3-d941-4ce7-83d9-950d6528f824%2Fic_gemini.svg",
    "title": "The Twins",
    "element": "Air",
    "quality": "Mutable",
    "ruler": "Mercury",
    "dates": "5/20 - 6/20",
    "startColor": "#91B9BB",
    "endColor": "#F49DF5"
  },
  "Cancer": {
    "icon": "https://cdn.glitch.com/e4e4a6b3-d941-4ce7-83d9-950d6528f824%2Fic_cancer.svg",
    "title": "The Crab",
    "element": "Water",
    "quality": "Cardinal",
    "ruler": "Moon",
    "dates": "6/20 - 7/22",
    "startColor": "#91B9BB",
    "endColor": "#58A054"
  },
  "Leo": {
    "icon": "https://cdn.glitch.com/e4e4a6b3-d941-4ce7-83d9-950d6528f824%2Fic_leo.svg",
    "title": "The Lion",
    "element": "Fire",
    "quality": "Fixed",
    "ruler": "Sun",
    "dates": "7/22 - 8/22",
    "startColor": "#FF8E3B",
    "endColor": "#DF61AB"
  },
  "Virgo": {
    "icon": "https://cdn.glitch.com/e4e4a6b3-d941-4ce7-83d9-950d6528f824%2Fic_virgo.svg",
    "title": "The Virgin",
    "element": "Earth",
    "quality": "Mutable",
    "ruler": "Mercury",
    "dates": "8/22 - 9/22",
    "startColor": "#58A054",
    "endColor": "#FD500B"
  },
  "Libra" : {
    "icon": "https://cdn.glitch.com/e4e4a6b3-d941-4ce7-83d9-950d6528f824%2Fic_libra.svg",
    "title": "The Scales",
    "element": "Air",
    "quality": "Cardinal",
    "ruler": "Venus",
    "dates": "9/22 - 10/23",
    "startColor": "#5467A1",
    "endColor": "#DF61AB"
  },
  "Scorpio": {
    "icon": "https://cdn.glitch.com/e4e4a6b3-d941-4ce7-83d9-950d6528f824%2Fic_scorpio.svg",
    "title": "The Scorpion",
    "element": "Water",
    "quality": "Fixed",
    "ruler": "Mars",
    "dates": "10/23 - 11/21",
    "startColor": "#127A7D",
    "endColor": "#5467A1"
  },
  "Sagittarius": {
    "icon": "https://cdn.glitch.com/e4e4a6b3-d941-4ce7-83d9-950d6528f824%2Fic_sagittarius.svg",
    "title": "The Archer",
    "element": "Fire",
    "quality": "Mutable",
    "ruler": "Jupiter",
    "dates": "11/21 - 12/21",
    "startColor": "#FD500B",
    "endColor": "#91B9BB"
  },
  "Capricorn": {
    "icon": "https://cdn.glitch.com/e4e4a6b3-d941-4ce7-83d9-950d6528f824%2Fic_capricorn.svg",
    "title": "The Goat",
    "element": "Earth",
    "quality": "Cardinal",
    "ruler": "Saturn",
    "dates": "12/21 - 1/19",
    "startColor": "#F0C8CA",
    "endColor": "#58A054"
  },
  "Aquarius": {
    "icon": "https://cdn.glitch.com/e4e4a6b3-d941-4ce7-83d9-950d6528f824%2Fic_aquarius.svg",
    "title": "The Water Bearer",
    "element": "Air",
    "quality": "Fixed",
    "ruler": "Uranus",
    "dates": "1/19 - 2/18",
    "startColor": "#F0C8CA",
    "endColor": "#91B9BB"
  },
  "Pisces": {
    "icon": "https://cdn.glitch.com/e4e4a6b3-d941-4ce7-83d9-950d6528f824%2Fic_pisces.svg",
    "title": "The Fish",
    "element": "Water",
    "quality": "Mutable",
    "ruler": "Neptune",
    "dates": "2/18 - 3/20",
    "startColor": "#5467A1",
    "endColor": "#F0C8CA"
  }
};

const PLANETS_WITH_INFO = {
  "Sun": {
    "icon": "https://cdn.glitch.com/e4e4a6b3-d941-4ce7-83d9-950d6528f824%2Fic_sun.svg?1495986813996",
    "title": "your base personality",
    "description": "The chisel that lays the rough outline of your character."
  }, 
  "Moon": {
    "icon": "https://cdn.glitch.com/e4e4a6b3-d941-4ce7-83d9-950d6528f824%2Fic_moon.svg?1495986815349",
    "title": "your emotional center",
    "description": "The source of your deepest emotions. Controls all things internal, from your guiding inner voice to the layout of your home."
  },
  "Ascendant": {
    "title": "the mask you wear",
    "description": "Who you want to be, how you approach things, the personality you deault to when threatened or uncomfortable."
  },
  "Mercury": {
    "icon": "https://cdn.glitch.com/e4e4a6b3-d941-4ce7-83d9-950d6528f824%2Fic_mercury.svg?1495986815195",
    "title": "communications Center",
    "description": "Source of the hyper-rational side of your brain. In charge of how you communicate, via all sources. Everything from how you externalize an idea you've been thinking about for months, to how you prefer to text."
  }, 
  "Venus": {
    "icon": "https://cdn.glitch.com/e4e4a6b3-d941-4ce7-83d9-950d6528f824%2Fic_venus.svg?1495986814230",
    "title": "your heart and love life",
    "description": "What you like, who you like, and what you like to like with them."
  }, 
  "Mars": {
    "icon": "https://cdn.glitch.com/e4e4a6b3-d941-4ce7-83d9-950d6528f824%2Fic_mars.svg?1495986815095",
    "title": "war and ambition",
    "description": "Your drive, at everything from getting out of bed in the morning to war. How you deal with competition, and how you plan to outlast it"
  }, 
  "Jupiter": {
    "icon": "https://cdn.glitch.com/e4e4a6b3-d941-4ce7-83d9-950d6528f824%2Fic_jupiter.svg?1495986814784",
    "title": "wealth and opportunity",
    "description": "How you make money, how you find stability. Your source of confidence and faith. Source of reflection and connecting of the dots."
  },
  "Saturn": {
    "icon": "https://cdn.glitch.com/e4e4a6b3-d941-4ce7-83d9-950d6528f824%2Fic_saturn.svg?1495986813967",
    "title": "wule and routine",
    "description": "Your source of willpower, how you tackle the menial, how you handle the rules and what you're supposed to do."
  },
  "Uranus": {
    "icon": "https://cdn.glitch.com/e4e4a6b3-d941-4ce7-83d9-950d6528f824%2Fic_uranus.svg?1495986814154",
    "title": "surprise and excitement",
    "description": "How do you break the mold?"
  },
  "Neptune": {
    "icon": "https://cdn.glitch.com/e4e4a6b3-d941-4ce7-83d9-950d6528f824%2Fic_neptune.svg?1495986813774",
    "title": "hopes and dreams",
    "description": "Your source of inspiration, where your wildest dreams come from. Artistic center."
  },
  "Pluto": {
    "icon": "https://cdn.glitch.com/e4e4a6b3-d941-4ce7-83d9-950d6528f824%2Fic_pluto.svg?1495986813910",
    "title": "center of transformation",
    "description": "How do you handle coming of age? Your step-style throughout life, source of all change (and obsessions)."
  }
};

export { SIGNS_WITH_INFO, PLANETS_WITH_INFO, PLANET_SORT_ORDER, HOUSES_WITH_INFO };