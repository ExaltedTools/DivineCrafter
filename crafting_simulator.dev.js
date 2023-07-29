/*
// TODO
Glyphic fossil, Bloodstained fossil (vaal mods are obselete in db atm), Tangled fossil?
decent mobile support
have metamods more accessible
integrate %atype %weight in modpool info
alt / full item output
add golden wreath
search affixes in modpool/bench
right-click mod : maximize numeric values
map quality can go to 35
common bases more readily available
being able to clear history/spending without resetting the item
allow users to set harvest craft prices
minimum dps / maximum dps in relation to possible divining
bind prefix/suffix switch in modpool for modpool/bench
right-click : view in modpool, maximize value
check out right click build on calculator on mobile
re-create tiny's trials
elreon's div card jewellery mod
calc : change G1/2/3 tooltip to be accurate when in alt+aug+regal mode
make poec_simCatToRWeight also behave with maven mod tags being different potentially
implicit tags needed for catalysts
apex cleaver : 40 quality
have a way to import the emulator item to the calculator

This is data from a CTRL+C, please use ALT+CTRL+C, if this still yields the same data this means that "advanced mod descriptions" is not enabled in your game UI options which it needs to be. Good day!

--- TODO ---
conq orb slam can bypass the conversion limitation for 2 conversion mods
resist swap all relevant affixes https://poedb.tw/us/Harvest#ModEquivalencies
[OK] fix harvest rem/add use case where essence mod could not be added back where all the options are present (same prob with add only mods, like other, fossil, delve, incursion)
fix harvest non-crit to crit where it could fail but also could work : need to go through permutations of possibilities, removing from modpool/groups what would be removed from possibility
[OK] reroll keeping prefix/suffix ignores cannot roll caster/attack

---METAMODS REF---
fossils / essences won't let you use them if there is any metamods on it (except multimod) (OK)
harvest R/A ignores cannot roll caster/attack (OK)
harvest reroll will ignore cannot roll attack/caster but will respect cannot be changed (OK)
beast prefix>suffix>prefix will respect cannot be changed by not removing a mod, but will add a new one (also, need to have an ilvl for the beast) (OK)

FUTURE stuff :
Harvest reroll lucky : prefixes, suffixes, all+implicits
Harvest augment lucky
Harvest resistance swaps
Harvest reforge rare lucky keeping prefixes, suffixes
Harvest vanilla augment lucky
Harvest Fracture
bench crafting costs : import data from datasource
add random inf to an item with no inf
split beast
changing quality once crafting has started
quality affect flask duration
highlight tags on item when harvest method is selected that matches (maybe try and do the same in modpool/bench)
eventually get heist tools/gear actual items
tempering orbs/ tailoring orbs / enchanted fossil
*/
var crsim_vendor = {
    "mbms": {
        "name": "Movement speed", "desc": "Magic Boots with 10% increased Movement Speed",
        "ing": ["<rrn>Normal</rrn> Boots", "Quicksilver Flask", "Orb of Augmentation"],
        "bases": null, "bgroups": "|3|", "mods": null, "rarity": {"normal": true},
        "result": {"rarity": "magic", "mods": [{"id": 2135, "tier": -1}]}
    },
    "mbms+": {
        "name": "+ movement speed", "desc": "Magic Boots with #+5% increased Movement Speed",
        "ing": ["<rrm>Magic</rrm> or <rrr>Rare</rrr> Boots with +X% Movement Speed", "Quicksilver Flask", "Orb of Augmentation"],
        "bases": null, "bgroups": "|3|", "mods": "|2135|", "rarity": {"magic": true, "rare": true},
        "result": {"rarity": "magic", "mods": [{"id": 2135, "tier": "+", "maxtier": 2}]}
    },
    "mwpd": {
        "name": "Flat phys. dmg", "desc": "Magic Weapon with lowest tier of Adds # to # Physical Damage",
        "ing": ["<rrn>Normal</rrn> Weapon", "Granite Flask", "Orb of Augmentation"],
        "bases": null, "bgroups": "|6|7|", "mods": null, "rarity": {"normal": true},
        "result": {"rarity": "magic", "mods": [{"id": 1976, "tier": -1}]}
    },
    "mwpd+": {
        "name": "+ flat phys. dmg", "desc": "Magic Weapon with Adds # to # Physical Damage one tier higher",
        "ing": ["<rrm>Magic</rrm> or <rrr>Rare</rrr> Weapon with Adds # to # Physical Damage", "Granite Flask", "Orb of Augmentation"],
        "bases": null, "bgroups": "|6|7|", "mods": "|1976|", "rarity": {"magic": true, "rare": true},
        "result": {"rarity": "magic", "mods": [{"id": 1976, "tier": "+", "maxtier": 2}]}
    },
    "mwpc": {
        "name": "Flat cold dmg", "desc": "Magic Weapon with lowest tier of Adds # to # Cold Damage",
        "ing": ["<rrn>Normal</rrn> Weapon", "Sapphire Flask", "Orb of Augmentation"],
        "bases": null, "bgroups": "|6|7|", "mods": null, "rarity": {"normal": true},
        "result": {"rarity": "magic", "mods": [{"id": 1970, "tier": -1}]}
    },
    "mwpc+": {
        "name": "+ flat cold dmg", "desc": "Magic Weapon with Adds # to # Cold Damage one tier higher",
        "ing": ["<rrm>Magic</rrm> or <rrr>Rare</rrr> Weapon with Adds # to # Cold Damage", "Sapphire Flask", "Orb of Augmentation"],
        "bases": null, "bgroups": "|6|7|", "mods": "|1970|", "rarity": {"magic": true, "rare": true},
        "result": {"rarity": "magic", "mods": [{"id": 1970, "tier": "+", "maxtier": 2}]}
    },
    "mwpf": {
        "name": "Flat fire dmg", "desc": "Magic Weapon with lowest tier of Adds # to # Fire Damage",
        "ing": ["<rrn>Normal</rrn> Weapon", "Ruby Flask", "Orb of Augmentation"],
        "bases": null, "bgroups": "|6|7|", "mods": null, "rarity": {"normal": true},
        "result": {"rarity": "magic", "mods": [{"id": 1972, "tier": -1}]}
    },
    "mwpf+": {
        "name": "+ flat fire dmg", "desc": "Magic Weapon with Adds # to # Fire Damage one tier higher",
        "ing": ["<rrm>Magic</rrm> or <rrr>Rare</rrr> Weapon with Adds # to # Fire Damage", "Ruby Flask", "Orb of Augmentation"],
        "bases": null, "bgroups": "|6|7|", "mods": "|1972|", "rarity": {"magic": true, "rare": true},
        "result": {"rarity": "magic", "mods": [{"id": 1972, "tier": "+", "maxtier": 2}]}
    },
    "mwpl": {
        "name": "Flat light. dmg", "desc": "Magic Weapon with lowest tier of Adds # to # Lightning Damage",
        "ing": ["<rrn>Normal</rrn> Weapon", "Topaz Flask", "Orb of Augmentation"],
        "bases": null, "bgroups": "|6|7|", "mods": null, "rarity": {"normal": true},
        "result": {"rarity": "magic", "mods": [{"id": 1974, "tier": -1}]}
    },
    "mwpl+": {
        "name": "+ flat light. dmg", "desc": "Magic Weapon with Adds # to # Lightning Damage one tier higher",
        "ing": ["<rrm>Magic</rrm> or <rrr>Rare</rrr> Weapon with Adds # to # Lightning Damage", "Topaz Flask", "Orb of Augmentation"],
        "bases": null, "bgroups": "|6|7|", "mods": "|1974|", "rarity": {"magic": true, "rare": true},
        "result": {"rarity": "magic", "mods": [{"id": 1974, "tier": "+", "maxtier": 2}]}
    },
    "mwcs": {
        "name": "Flat cold dmg to spells", "desc": "Magic Weapon with Adds # to # Cold Damage to Spells",
        "ing": ["<rrm>Magic</rrm> Sceptre, Wand, Rune Dagger", "Sapphire Ring", "Orb of Alteration"],
        "bases": "|17|18|67|19|", "bgroups": null, "mods": null, "rarity": {"magic": true},
        "subset": {"label": "Ring", "choices": ["Normal", "Magic", "Rare"]},
        "result": {"rarity": "magic", "mods": [{"id": 2283, "tier": [8, 7, 6]}]}
    },
    "mwfs": {
        "name": "Flat fire dmg to spells", "desc": "Magic Weapon with Adds # to # Fire Damage to Spells",
        "ing": ["<rrm>Magic</rrm> Sceptre, Wand, Rune Dagger", "Ruby Ring", "Orb of Alteration"],
        "bases": "|17|18|67|19|", "bgroups": null, "mods": null, "rarity": {"magic": true},
        "subset": {"label": "Ring", "choices": ["Normal", "Magic", "Rare"]},
        "result": {"rarity": "magic", "mods": [{"id": 2287, "tier": [8, 7, 6]}]}
    },
    "mwls": {
        "name": "Flat light. dmg to spells", "desc": "Magic Weapon with Adds # to # Lightning Damage to Spells",
        "ing": ["<rrm>Magic</rrm> Sceptre, Wand, Rune Dagger", "Topaz Ring", "Orb of Alteration"],
        "bases": "|17|18|67|19|", "bgroups": null, "mods": null, "rarity": {"magic": true},
        "subset": {"label": "Ring", "choices": ["Normal", "Magic", "Rare"]},
        "result": {"rarity": "magic", "mods": [{"id": 2291, "tier": [8, 7, 6]}]}
    },
    "mwls": {
        "name": "% phys. dmg.", "desc": "Magic Weapon with #% Increased Physical Damage",
        "ing": ["Weapon", "<rrm>Magic</rrm> or <rrr>Rare</rrr> Rustic Sash", "Blacksmith's Whetstone"],
        "bases": null, "bgroups": "|6|7|", "mods": null, "rarity": {"magic": true, "normal": true, "rare": true},
        "subset": {"label": "Sash", "choices": ["Magic", "Rare"]},
        "result": {"rarity": "magic", "mods": [{"id": 2015, "tier": [8, 7]}]}
    },
    "mwsd": {
        "name": "% spell dmg.",
        "desc": "Magic Weapon with #% Increased Spell Damage",
        "ing": ["Rune Dagger, Scepter, Wand", "<rrm>Magic</rrm> or <rrr>Rare</rrr> Chain Belt", "Blacksmith's Whetstone"],
        "bases": "|19|17|18|67|",
        "bgroups": null,
        "mods": null,
        "rarity": {"magic": true, "normal": true, "rare": true},
        "subset": {"label": "Belt", "choices": ["Magic", "Rare"]},
        "result": {"rarity": "magic", "mods": [{"id": 2312, "tier": [8, 7]}]}
    },
    "mwsds": {
        "name": "% spell dmg.", "desc": "Magic Weapon with #% Increased Spell Damage",
        "ing": ["Staff", "<rru>Unique</rru> Chain Belt", "Blacksmith's Whetstone"],
        "bases": "|21|", "bgroups": null, "mods": null, "rarity": {"magic": true, "normal": true, "rare": true},
        "result": {"rarity": "magic", "mods": [{"id": 2312, "tier": 6}]}
    },
    "mwskp": {
        "name": "+1 Phys. Spell Gems", "desc": "Magic Weapon with +1 to Level of all Physical Spell Skill Gems",
        "ing": ["<rrn>Normal</rrn> Rune Dagger, Sceptre, Staff, Wand", "2 or more quality Skill gems with a combined total of 40% quality & the <rrm>Physical</rrm> tag"],
        "bases": "|19|17|18|67|21|", "bgroups": null, "mods": null, "rarity": {"normal": true},
        "result": {"rarity": "magic", "mods": [{"id": 1711, "tier": -1}]}
    },
    "mwskpc": {
        "name": "+1 Cold Spell Gems", "desc": "Magic Weapon with +1 to Level of all Cold Spell Skill Gems",
        "ing": ["<rrn>Normal</rrn> Rune Dagger, Sceptre, Staff, Wand", "2 or more quality Skill gems with a combined total of 40% quality & the <rrm>Cold</rrm> tag"],
        "bases": "|19|17|18|67|21|", "bgroups": null, "mods": null, "rarity": {"normal": true},
        "result": {"rarity": "magic", "mods": [{"id": 1699, "tier": -1}]}
    },
    "mwskf": {
        "name": "+1 Fire Spell Gems", "desc": "Magic Weapon with +1 to Level of all Fire Spell Skill Gems",
        "ing": ["<rrn>Normal</rrn> Rune Dagger, Sceptre, Staff, Wand", "2 or more quality Skill gems with a combined total of 40% quality & the <rrm>Fire</rrm> tag"],
        "bases": "|19|17|18|67|21|", "bgroups": null, "mods": null, "rarity": {"normal": true},
        "result": {"rarity": "magic", "mods": [{"id": 1706, "tier": -1}]}
    },
    "mwskl": {
        "name": "+1 Light. Spell Gems", "desc": "Magic Weapon with +1 to Level of all Lightning Spell Skill Gems",
        "ing": ["<rrn>Normal</rrn> Rune Dagger, Sceptre, Staff, Wand", "2 or more quality Skill gems with a combined total of 40% quality & the <rrm>Lightning</rrm> tag"],
        "bases": "|19|17|18|67|21|", "bgroups": null, "mods": null, "rarity": {"normal": true},
        "result": {"rarity": "magic", "mods": [{"id": 1709, "tier": -1}]}
    },
    "mwskc": {
        "name": "+1 Chaos. Spell Gems", "desc": "Magic Weapon with +1 to Level of all Chaos Spell Skill Gems",
        "ing": ["<rrn>Normal</rrn> Rune Dagger, Sceptre, Staff, Wand", "2 or more quality Skill gems with a combined total of 40% quality & the <rrm>Chaos</rrm> tag"],
        "bases": "|19|18|67|21|", "bgroups": null, "mods": null, "rarity": {"normal": true},
        "result": {"rarity": "magic", "mods": [{"id": 1697, "tier": -1}]}
    },
    "mhmg": {
        "name": "+1 Minion Gems", "desc": "Helmet with +1 to Level of Socketed Minion Gems",
        "ing": ["<rrm>Magic</rrm> Helmet", "Orb of Alteration", "Life Flask with the suffix 'of Animation'"],
        "bases": null, "bgroups": "|4|", "mods": null, "rarity": {"magic": true},
        "result": {"rarity": "magic", "mods": [{"id": 1994, "tier": -1}]}
    },
    "mjcr": {
        "name": "Chaos resistance", "desc": "Magic Ring or Amulet with #% to Chaos Resistance",
        "ing": ["<rrn>Normal</rrn> Ring or Amulet", "Orb of Augmentation", "Amethyst Flask"],
        "bases": "|1|2|58|", "bgroups": null, "mods": null, "rarity": {"normal": true},
        "result": {"rarity": "magic", "mods": [{"id": 661, "tier": -1}]}
    },
    "mjcr+": {
        "name": "+ chaos resistance", "desc": "Magic Ring or Amulet with #+5% to Chaos Resistance",
        "ing": ["<rrn>Magic</rrn> or <rrr>Rare</rrr> Ring or Amulet", "Orb of Augmentation", "Amethyst Flask"],
        "bases": "|1|2|58|", "bgroups": null, "mods": "|661|", "rarity": {"magic": true, "rare": true},
        "result": {"rarity": "magic", "mods": [{"id": 661, "tier": "+", "maxtier": 2}]}
    }
};
var crsim_catadesc = {
    1: "Adds quality that enhances Attribute modifiers, Replaces other quality types",
    2: "Adds quality that enhances Attack modifiers, Replaces other quality types",
    3: "Adds quality that enhances Resistance, Replaces other quality types",
    4: "Adds quality that enhances Life and Mana modifiers, Replaces other quality types",
    5: "Adds quality that enhances Caster modifiers, Replaces other quality types",
    6: "Adds quality that enhances Defence modifiers, Replaces other quality types",
    7: "Adds quality that enhances Elemental Damage modifiers, Replaces other quality types",
    8: "Adds quality that enhances Speed modifiers, Replaces other quality types",
    9: "Adds quality that enhances Critical modifiers, Replaces other quality types",
    10: "Adds quality that enhances Physical and Chaos Damage modifiers, Replaces other quality types"
};
var crsim_resswaps = [
    {"text": "+#% to [RES] Resistance", "bgrp": true, "special": false, "addmgrps": ""},
    {
        "text": "+#% to [RES] Resistance, #% of [RES] Damage Leeched as Life",
        "bgrp": true,
        "special": false,
        "addmgrps": ""
    },
    {"text": "+#% to maximum [RES] Resistance", "bgrp": false, "special": false, "addmgrps": "12|"},
    {
        "text": "+#% to [RES] Resistance, #% of Physical Damage from Hits taken as [RES] Damage",
        "bgrp": true,
        "special": false,
        "addmgrps": ""
    },
    {
        "text": "Added Small Passive Skills also grant: +#% to [RES] Resistance",
        "bgrp": false,
        "special": false,
        "addmgrps": ""
    },
    {
        "text": "+#% to Fire Resistance, # to # added Fire Damage against Burning Enemies",
        "bgrp": true,
        "special": true,
        "addmgrps": ""
    },
    {
        "text": "+#% to Cold Resistance, #% increased Damage with Hits against Chilled Enemies",
        "bgrp": true,
        "special": true,
        "addmgrps": ""
    },
    {
        "text": "+#% to Lightning Resistance, #% increased Critical Strike Chance against Shocked Enemies",
        "bgrp": true,
        "special": true,
        "addmgrps": ""
    }
];
var crsim_resswapspc = {
    "Fire": ["+#% to Fire Resistance, # to # added Fire Damage against Burning Enemies"],
    "Cold": ["+#% to Cold Resistance, #% increased Damage with Hits against Chilled Enemies"],
    "Lightning": ["+#% to Lightning Resistance, #% increased Critical Strike Chance against Shocked Enemies"],
};
var crsim_bypass = false;
var crsim_skipinitimeout = false;
var crsim_hnerf = true;
var crsim_hollowid = 757;
var crsim_veiledmgrp = 10;
var crsim_vaaltbl = ["white sockets", "implicit", "brick", "nothing"];
var crsim_locustbl = ["white sockets", "implicits", "brick", "destroy"];
var crsim_igncorimp = "|8209|8224|8246|8201|";
var crsim_aspectids = "|3656|3655|3653|3654|";
var crsim_aspects = {
    "bcat": 3656,
    "bavian": 3655,
    "bspider": 3653,
    "bcrab": 3654
};
var crsim_catlbls = {
    1: "Attribute",
    2: "Attack",
    3: "Resistance",
    4: "Life and Mana",
    5: "Caster",
    6: "Defense",
    7: "Elemental Damage",
    8: "Speed",
    9: "Critical",
    10: "Physical and Chaos Damage"
};
var crsim_catdata = null;
var crsim_mvdata = null;
var crsim_nofossil = "|";
var crsim_validmgroups = "|1|2|3|4|5|6|7|8|9|10|11|12|13|14|15|";
var crsim_nonadmgroups = "|13|12|9|8|14|10|";
var crsim_qualbgroups = "|2|3|4|5|6|7|8|11|";
var crsim_veilbgroups = "|1|2|3|4|5|6|7|8|";
var crsim_recombgroups = "|1|2|3|4|5|6|7|8|";
var crsim_eldritchbgroups = "|2|3|4|5|";
var crsim_eldritchinvalidbases = "|";
var crsim_qualnbases = "|4|";
var crsim_settings = null;
var crsim_curessmod = null;
var crsim_mgrpdata = {};
var crsim_affbymgrp = {};
var crsim_params = {
    "mode": null,
    "currency": null,
    "action": null,
    "subaction": null,
    "ssaction": null,
    "disabled": "|",
    "cursor": ""
};
var crsim_spending = {
    "currency": {},
    "actions": {}
};

var crsim_preasons = {"crafting_bench": []};
var crsim_dreasons = {"crafting_bench": []};
var crsim_opened = null;
var crsim_data = null;
var crsim_log = null;
var crsim_catalyst = null;
var crsim_actions = {
    "currency": {
        "transmute": {"desc": "Upgrades a normal item to a magic item", "name": "Orb of Transmutation"},
        "alteration": {"desc": "Reforges a magic item with new random properties", "name": "Orb of Alteration"},
        "augmentation": {"desc": "Enchants a magic item with a new random property", "name": "Orb of Augmentation"},
        "regal": {"desc": "Upgrades a magic item to a rare item", "name": "Regal Orb"},
        "alchemy": {"desc": "Upgrades a normal item to a rare item", "name": "Orb of Alchemy"},
        "chaos": {"desc": "Reforges a rare item with new random modifiers", "name": "Chaos Orb"},
        "exalted": {"desc": "Enchants a rare item with a new random property", "name": "Exalted Orb"},
        "scour": {"desc": "Removes all properties from an item", "name": "Orb of Scouring"},
        "annul": {"desc": "Removes a random modifier from an item", "name": "Orb of Annulment"},
        "crusader": {"desc": "Enchants a rare item with a new Crusader modifier", "name": "Crusader's Exalted Orb"},
        "hunter": {"desc": "Enchants a rare item with a new Hunter modifier", "name": "Hunter's Exalted Orb"},
        "redeemer": {"desc": "Enchants a rare item with a new Redeemer modifier", "name": "Redeemer's Exalted Orb"},
        "warlord": {"desc": "Enchants a rare item with a new Warlord modifier", "name": "Warlord's Exalted Orb"},
        "blessed": {
            "desc": "Randomises the numeric values of the implicit properties of an item",
            "name": "Blessed Orb"
        },
        "divine": {"desc": "Randomises the numeric values of the random properties on an item", "name": "Divine Orb"},
        "veiled": {
            "desc": "Reforges a rare item with new random modifiers, including a veiled modifier.",
            "name": "Veiled Chaos Orb"
        },
        "woke": {
            "desc": "Destroys an item, applying its influence to another of the same item class. The second item is reforged as a rare item with both influence types and new modifiers",
            "name": "Awakener's Orb"
        },
        "maven": {
            "desc": "Removes one Influenced Modifier from an item with at least two Influenced Modifiers and upgrades another Influenced Modifier",
            "name": "Orb of Dominance"
        },
        "fracturing": {
            "desc": "Fracture a random modifier on a rare item with at least 4 modifiers, locking it in place.",
            "name": "Fracturing Orb"
        },
        "vaal": {"desc": "Corrupts an item, modifying it unpredictably", "name": "Vaal Orb"},
    },
    "actions": {
        "recombinate": {
            "name": "Recombinate",
            "desc": "Destroys two items to create a new item with a combination of their properties. Sometimes, the resultant item is modified unpredictably",
            "img": "recombinate"
        },
        "fossil": {
            "name": "Fossil",
            "subname": "Fossils",
            "desc": "Fossil crafting",
            "img": "fossil_6",
            "subset": "custom",
            "subsel": 4
        }, // Automatically updates resonator in relation to selection
        "harvest": {
            "name": "Harvest", "img": "aharvest", "desc": "Harvest crafting", "subname": "Method", "subset": { // Augment with, Replace, Annul, Divine -> Harvest subset
                "haugment": {
                    "name": "Add/Remove",
                    "img": "haugment",
                    "toggled": "harvestTypeChooser",
                    "desc": "Enchants an item with a new random property of a specific type<div class='hnerf_desc'>and remove another random modifier</div>"
                },
                "hreplace": {
                    "name": "Replace",
                    "img": "hreplace",
                    "toggled": "harvestTypeChooser",
                    "desc": "Replaces a random property of a specific type with another one of the same type<div class='mmi'>Ignores the cannot roll caster/attack metamods for 'influence'</div>"
                },
                "hnonto": {
                    "name": "Non-type to type",
                    "img": "hreplace",
                    "toggled": "harvestTypeChooser",
                    "desc": "Replaces a random property of another type with one of a specific type"
                },
                "hannul": {
                    "name": "Annul",
                    "img": "hannul",
                    "toggled": "harvestTypeChooser",
                    "desc": "Removes a random modifier of a specific type"
                },
                "hdivine": {
                    "name": "Divine",
                    "img": "hdivine",
                    "toggled": "harvestTypeChooser",
                    "desc": "Randomises the numeric values of the random properties of a specific type"
                },
                "hreroll": {
                    "name": "Reforge",
                    "img": "hreroll",
                    "toggled": "harvestTypeChooser",
                    "desc": "Reforge a Rare item with new random modifiers, including a modifier with the selected type<div class='mmi'>Ignores the cannot roll caster/attack metamods</div>"
                },
                "hrerollp": {
                    "name": "Reforge+",
                    "img": "hrerollp",
                    "toggled": "harvestTypeChooser",
                    "desc": "Reforge a Rare item with new random modifiers, including a modifier with the selected type, modifiers of the selected type are more common<div class='mmi'>Ignores the cannot roll caster/attack metamods</div>"
                },
                "hresist": {
                    "name": "Resists",
                    "img": "aharvest",
                    "toggled": "harvestResistsChooser",
                    "desc": "Change a modifier that grants a certain Resistance into a similar-tier modifier that grants another Resistance"
                },
                "hhight": {"name": "High-tier", "img": "aharvest", "toggled": "harvestHightierChooser", "desc": ""},
                "hother": {"name": "Other", "img": "aharvest", "toggled": "harvestOtherChooser", "desc": ""}
            }
        },
        "essence": {
            "name": "Essence",
            "subname": "Essences",
            "desc": "Essences",
            "img": "essence_Horror",
            "subset": "custom"
        }, // Essence type -> tier
        "catalyst": {
            "name": "Catalyst",
            "subname": "Catalysts",
            "desc": "Catalysts",
            "img": "acatalyst",
            "subset": "custom"
        },
        "beast_crafting": {
            "name": "Beast crafting",
            "img": "method_imprint",
            "desc": "Beast crafting",
            "subname": "Method",
            "subset": { // prefix to suffix, suffix to prefix, imprint
                "pretosuf": {
                    "name": "Prefix > Suffix",
                    "desc": "Remove a prefix, add a new suffix",
                    "img": "bpretsuf",
                    "isize": 38
                },
                "suftopre": {
                    "name": "Suffix > Prefix",
                    "desc": "Remove a suffix, add a new prefix",
                    "img": "bsuftpre",
                    "isize": 38
                },
                "imprint": {"name": "Imprint", "desc": "Create an imprint of a magic item", "img": "bimprint"},
                "breroll": {
                    "name": "Reroll values",
                    "desc": "Randomises the numeric values of implicit and explicit modifiers of a rare item",
                    "img": "breroll"
                },
                "bcat": {"name": "Cat", "desc": "Craft an Aspect of the Cat onto item", "img": "bcat"},
                "bavian": {"name": "Avian", "desc": "Craft an Aspect of the Avian onto item", "img": "bavian"},
                "bspider": {"name": "Spider", "desc": "Craft an Aspect of the Spider onto item", "img": "bspider"},
                "bcrab": {"name": "Crab", "desc": "Craft an Aspect of the Crab onto item", "img": "bcrab"}
            }
        },
        "eldritch": {
            "name": "Eldritch crafting",
            "img": "EldritchChaosOrb",
            "desc": "Eldritch crafting",
            "subname": "Method",
            "subset": {
                "eldritchchaos": {
                    "name": "Chaos",
                    "desc": "If The Searing Exarch is dominant, reroll prefix modifiers. If The Eater of Worlds is dominant, reroll suffix modifiers.<div class='mmi'>Ignores the prefixes/suffixes cannot be changed metamods</div>",
                    "img": "EldritchChaosOrb"
                },
                "eldritchexalt": {
                    "name": "Exalted",
                    "desc": "If The Searing Exarch is dominant, add a prefix modifier. If The Eater of Worlds is dominant, add a suffix modifier.",
                    "img": "EldritchExaltedOrb"
                },
                "eldritchannul": {
                    "name": "Annul",
                    "desc": "If The Searing Exarch is dominant, remove a prefix modifier. If The Eater of Worlds is dominant, remove a suffix modifier.",
                    "img": "EldritchOrbofAnnulment"
                },
                "eldritchconflict": {
                    "name": "Orb of Conflict",
                    "desc": "Unpredictably raise the strength of one Searing Exarch or Eater of Worlds modifier on an item and lower the strength of another. Lesser modifiers that have their strength lowered will be removed.",
                    "img": "OrbofConflict"
                },
                "eldritchemberlesser": {
                    "name": "Lesser Ember",
                    "desc": "Adds a Lesser Searing Exarch implicit modifier to a Body Armour, Boots, Gloves or Helmet. This replaces any existing implicit modifiers other than Eater of Worlds implicit modifiers.",
                    "img": "LesserEldritchEmber"
                },
                "eldritchembergreater": {
                    "name": "Greater Ember",
                    "desc": "Adds a Greater Searing Exarch implicit modifier to a Body Armour, Boots, Gloves or Helmet. This replaces any existing implicit modifiers other than Eater of Worlds implicit modifiers.",
                    "img": "GreaterEldritchEmber"
                },
                "eldritchembergrand": {
                    "name": "Grand Ember",
                    "desc": "Adds a Grand Searing Exarch implicit modifier to a Body Armour, Boots, Gloves or Helmet. This replaces any existing implicit modifiers other than Eater of Worlds implicit modifiers.",
                    "img": "GrandEldritchEmber"
                },
                "eldritchemberexceptional": {
                    "name": "Exceptional Ember",
                    "desc": "Adds a Exceptionnal Searing Exarch implicit modifier to a Body Armour, Boots, Gloves or Helmet. This replaces any existing implicit modifiers other than Eater of Worlds implicit modifiers.",
                    "img": "ExceptionalEldritchEmber"
                },
                "eldritchichorlesser": {
                    "name": "Lesser Ichor",
                    "desc": "Adds a Lesser Eater of Worlds implicit modifier to a Body Armour, Boots, Gloves or Helmet. This replaces any existing implicit modifiers other than Searing Exarch implicit modifiers.",
                    "img": "LesserEldritchIchor"
                },
                "eldritchichorgreater": {
                    "name": "Greater Ichor",
                    "desc": "Adds a Greater Eater of Worlds implicit modifier to a Body Armour, Boots, Gloves or Helmet. This replaces any existing implicit modifiers other than Searing Exarch implicit modifiers.",
                    "img": "GreaterEldritchIchor"
                },
                "eldritchichorgrand": {
                    "name": "Grand Ichor",
                    "desc": "Adds a Grand Eater of Worlds implicit modifier to a Body Armour, Boots, Gloves or Helmet. This replaces any existing implicit modifiers other than Searing Exarch implicit modifiers.",
                    "img": "GrandEldritchIchor"
                },
                "eldritchichorexceptional": {
                    "name": "Exceptional Ichor",
                    "desc": "Adds a Exceptionnal Eater of Worlds implicit modifier to a Body Armour, Boots, Gloves or Helmet. This replaces any existing implicit modifiers other than Searing Exarch implicit modifiers.",
                    "img": "ExceptionalEldritchIchor"
                }
            }
        },
        "scourge": {
            "name": "Scourge crafting",
            "img": "tainted_exalt",
            "desc": "Scourge crafting",
            "subname": "Method",
            "subset": {
                "scourgetogglecorrupt": {
                    "name": "Corruption",
                    "desc": "Force a swap from corrupted to uncorrupted or vice-versa",
                    "img": "method_vaal"
                },
                "scourgettexalt": {
                    "name": "Tainted Exalted Orb",
                    "desc": "Unpredictably adds or removes a modifier on a corrupted rare item",
                    "img": "tainted_exalt"
                },
                "scourgettdivine": {
                    "name": "Tainted Divine Teardrop",
                    "desc": "Unpredictably raises or lowers the tier of each modifiers on a corrupted rare item",
                    "img": "tainted_divine"
                }
            }
        },
        "corruption_altar": {
            "name": "Locus of Corruption",
            "desc": "Potently corrupts an item, modifying it drastically and unpredictably",
            "img": "locus",
            "isize": 66
        }, // Double corrupt
        "syndicate": {
            "name": "Syndicate", "img": "sim_syndicate", "desc": "Syndicate", "subname": "Method", "subset": {
                "aisling": {
                    "name": "Aisling Veil",
                    "desc": "Replace a random modifier on a rare item with a veiled modifier<div class='mmi'>Unveil ignores the cannot roll caster/attack metamods</div>",
                    "img": "aisling"
                },
                "leoslam": {
                    "name": "Leo Slam",
                    "desc": "Enchants a rare item with a new random property",
                    "img": "leoslam"
                }
            }
        },
        "vendor": {
            "name": "Vendor recipees",
            "subname": "Vendor recipees",
            "desc": "Vendor recipees",
            "img": "vendor",
            "subset": "custom"
        }
    }
};

function poec_openCraftingSim() {
    if ($("#poecCraftingSim").length == 0) {
        vHTML = "<div id='poecAffOptions' class='justload'>";
        vHTML += "<div id='poecAppLoading' class='poec_loading_msg'>" + applyLang("Loading Emulator data...") + "</div>";
        vHTML += "</div>";

        $("<div>").attr("id", "poecCraftingSim").html(vHTML).appendTo($("#poecEmulatorZone"));

        if (crsim_skipinitimeout) {
            crsim_skipinitimeout = false;
            poec_emuInitLoad();
        } else {
            setTimeout(function () {
                poec_emuInitLoad();
            }, 1);
        }
    } else {
        poec_openCraftingSimGO();
    }
}

function poec_openCraftingSimGO() {
    poec_simApplyHarvestState();
    poec_simInitHarvestToggler();
    poec_simGoToStart();

    // DATA SETUP
    // Build catalyst data
    poec_simBuildCatalystData();

    $("#poecZoneChooser").children("div").removeClass("sel");
    $("#poecZoneChooser").children("div.emulator").addClass("sel");
    $("#poecCalculatorZone").hide();
    $("#poecEmulatorZone").show();
}

function poec_emuInitLoad() {
    // Build Crafting Simulator Interface
    vHTML = "";
    var addenabled = "";
    if (crsim_hnerf) {
        addenabled = " enabled";
    }
    vHTML += "<div class='wrapper'><div class='title'><div id='simFullHarvestBtn' class='" + addenabled + "' onClick='poec_simToggleHarvestNerf()'><div><img src='images/manual/fullharvest.png'/></div></div><img src='images/manual/wraecrafter.png'/><div class='mcui-button dark' onClick='poec_simGoToStep(6)' id='simRestoreBtn'>" + applyLang("Restore saved item") + "</div><div class='mcui-button yellow' onClick='poec_simRestart(null,true)' id='simRestartBtn'>" + applyLang("Restart") + "</div><div class='mcui-button yellow' id='simBackStepBtn' onClick='poec_backOneStep()'>&#10149;</div></div><div class='content'><div class='wrapper'>";

    ///////////////////
    // Source choice //
    ///////////////////
    vHTML += "<div id='simSourceInt'>";
    vHTML += "<div class='step1 step' step='1'>"; // Settings or item chooser
    vHTML += "<div class='stitle'>" + applyLang("Choose item creation mode") + "</div>";
    vHTML += "<div class='content'><div>";
    vHTML += "<div id='crsimStep1CSBtn'>";
    vHTML += "<div class='mcui-button dark big' onClick='poec_simUseCurrentSettings()'>" + applyLang("Use calculator settings") + "</div>";
    vHTML += "<div class='or'>" + applyLang("or") + "</div>";
    vHTML += "</div>";
    vHTML += "<div class='mcui-button dark big' onClick='poec_simGoToStep(2)'>" + applyLang("Create new item") + "</div>";
    vHTML += "<div class='or'>" + applyLang("or") + "</div>";
    vHTML += "<div class='mcui-button dark big' onClick='poec_importItem(\"sim\")'>" + applyLang("Import item") + "</div>";
    vHTML += "</div></div>";
    vHTML += "</div>";
    vHTML += "<div class='step2 step scroll' id='simStepBGroupChoice' step='2'>"; // Base group choice
    vHTML += "<div class='stitle'>" + applyLang("Choose a base group") + "</div>";
    vHTML += "<div class='content'><div>";
    for (var i = 0; i < poecd['bgroups']['seq'].length; i++) {
        vHTML += "<div class='mcui-button dark' onClick='poec_simPickBaseGroup(" + poecd['bgroups']['seq'][i]["id_bgroup"] + ")'>" + poecl["bgroup"][poecd['bgroups']['seq'][i]["id_bgroup"]] + "</div>";
    }
    vHTML += "</div></div>";
    vHTML += "</div>";
    vHTML += "<div class='step3 step scroll' id='simStepBaseChoice' step='3'>"; // Base choice
    vHTML += "<div class='stitle'>" + applyLang("Choose a base") + "<div id='simFLBase' class='simfl'></div></div>";
    vHTML += "<div class='content'><div>";
    for (var i = 0; i < arrMasters.length; i++) {
        vHTML += "<div class='mcui-button dark master bgroup" + arrMasters[i]["id_bgroup"] + "' onClick='poec_simPickBase(" + arrMasters[i]["id_base"] + ")'>" + poecl["base"][arrMasters[i]["id_base"]] + "</div>";
    }
    for (var i = 0; i < arrChilds.length; i++) {
        vHTML += "<div class='mcui-button dark child mbase" + arrChilds[i]["master_base"] + "' onClick='poec_simPickBChild(" + arrChilds[i]["id_base"] + ")'>" + poecl["base"][arrChilds[i]["id_base"]] + "</div>";
    }
    vHTML += "</div></div>";
    vHTML += "</div>";
    vHTML += "<div class='step4 step' id='simStepItemChoice' step='4'>"; // Item choice
    vHTML += "<div class='stitle'>" + applyLang("Choose an item") + "<div id='simFLItem' class='simfl'></div></div>";
    vHTML += "<div class='content'><div>";

    for (var i = 0; i < poecd['bitems']['seq'].length; i++) {
        var iinfo = poec_outputItemDetails(poecd["bitems"]["seq"][i], 0.2, true);
        vHTML += "<div class='item base" + poecd['bitems']['seq'][i]["id_base"] + "' iid='" + poecd['bitems']['seq'][i]["id_bitem"] + "' onClick='poec_simPickItem(" + poecd['bitems']['seq'][i]["id_bitem"] + ")'><div class='div_stable poec_item med_shadow'><div><div class='img'><img src='" + poec_getBItemIMG(poecd['bitems']['seq'][i]["imgurl"], poecd['bitems']['seq'][i]["id_bitem"]) + "'/></div><div class='info affixes'><div class='name'>" + poecl["bitem"][poecd['bitems']['seq'][i]["id_bitem"]] + "</div><div class='sep'></div>" + iinfo + "</div></div></div></div>";

    }
    vHTML += "</div></div>";
    vHTML += "</div>";
    vHTML += "<div class='step5 step' id='simStepOptionsChoice' step='5'>"; // Options : Influences / ILVL / Fracture affix
    vHTML += "<div class='stitle'>" + applyLang("Choose options") + "<div id='simFLOptions' class='simfl'></div></div>";
    vHTML += "<div class='content'><div>";
    // Influences
    vHTML += "<div id='simOptionsInfluences' class='simopt noselect'>";
    vHTML += "<div class='label'>" + applyLang("Choose zero to two influence(s)") + "</div>";
    for (var i = 0; i < poecd['mgroups']['seq'].length; i++) {
        if (poecd['mgroups']['seq'][i]['is_influence'] == 1) {
            vHTML += "<div class='inf big abtn iconed bid" + poecd['mgroups']['seq'][i]["id_mgroup"] + "' bid='" + poecd['mgroups']['seq'][i]["id_mgroup"] + "' onClick='poec_simSelectInf(this)'><div class='icon'><img src='images/manual/influence_" + poecd['mgroups']['seq'][i]["id_mgroup"] + ".png'></div>" + poecl["mgroup"][poecd['mgroups']['seq'][i]["id_mgroup"]] + "</div>";
        }
    }
    vHTML += "</div>";

    // ILVL
    vHTML += "<div id='simOptionsILvl' class='simopt'>";
    vHTML += "<div class='label'>" + applyLang("Select item level") + "</div>";
    for (var i = 1; i <= 100; i++) {
        vHTML += "<div class='ilvl abtn ilvl" + i + "' bid='" + i + "' onClick='poec_simSelectILvl(this)'>" + i + "</div>";
    }
    vHTML += "</div>";

    // Quality
    vHTML += "<div id='simOptionsQuality' class='simopt'>";
    vHTML += "<div class='label'>" + applyLang("Set item quality") + "</div>";
    for (var i = 0; i <= 30; i++) {
        vHTML += "<div class='qual abtn qual" + i + "' bid='" + i + "' onClick='poec_simSelectQuality(this)'>" + i + "</div>";
    }
    vHTML += "</div>";

    vHTML += "<div></div><div class='mcui-button green big' onClick='poec_simFinishSetup()'>" + applyLang("Proceed") + "</div>";

    vHTML += "</div></div>";
    vHTML += "</div>";
    vHTML += "<div class='step6 step' id='simStepImportChoice' step='6'>"; // Import
    vHTML += "<div class='stitle'>" + applyLang("Input import settings") + "</div>";
    vHTML += "<div class='content'><div>";
    vHTML += "<div class='gen_msg' id='simImportInstructions'>" + applyLang("Paste a gist or pastebin link into the below text input to proceed") + ".</div>";
    vHTML += "<div><input type='text' id='simImportInput' class='simieinput' onKeyUp='poec_simImportCheck()'></div>";
    vHTML += "<div class='simietitle'><div class='title'>" + applyLang("OR") + "</div></div>";
    vHTML += "<div class='gen_msg' id='simImportInstructions'>" + applyLang("Paste dataset into the below text area to proceed") + ".</div>";
    vHTML += "<div><textarea id='simImportArea' class='simietextarea' onKeyUp='poec_simImportCheck()'></textarea></div>";
    vHTML += "<div id='simImportBtn' class='mcui-button green' onClick='poec_simImportGo(null,true)'>" + applyLang("Import") + "</div>";
    vHTML += "</div></div>";
    vHTML += "</div>";
    vHTML += "</div>";

    ////////////////////
    // Main interface //
    ////////////////////
    vHTML += "<div id='simMainInterface'><div class='div_stable' id='crsimTbl'><div>";
    vHTML += "<div class='editor'>";
    vHTML += "<div class='options noselect' id='crsimOptions'>";
    vHTML += "<div class='mainbtns'>";
    vHTML += "<div class='currency' id='crsimOptCur'>";
    $.each(crsim_actions["currency"], function (acode, asets) {
        if (asets["disabled"] == undefined) {
            crsim_dreasons[acode] = [];
            crsim_preasons[acode] = [];
            crsim_actions["currency"][acode]["enabled"] = true;
            if (crsim_actions["currency"][acode]["noready"]) {
                var addcls = " not_ready";
            } else {
                var addcls = "";
            }
            vHTML += "<div class='ac_" + acode + addcls + "' acode='" + acode + "' onClick='poec_simSelectCurrency(this)'><img src='images/manual/method_" + acode + ".png'/><div class='ccnt'></div></div>";
        }
    });
    vHTML += "</div>";
    vHTML += "<div class='actions' id='crsimActions'>";
    //vHTML+=        "<div class='label'>"+applyLang("Action")+"</div>";
    $.each(crsim_actions["actions"], function (acode, asets) {
        crsim_dreasons[acode] = [];
        crsim_preasons[acode] = [];
        crsim_actions["actions"][acode]["enabled"] = true;
        crsim_spending["actions"][acode] = 0;
        if (crsim_actions["actions"][acode]["noready"]) {
            var addcls = " not_ready";
        } else {
            var addcls = "";
        }
        vHTML += "<div class='ac_" + acode + addcls + " abtn' acode='" + acode + "' atype='actions' onClick='poec_simSelectAction(this)'><img src='images/manual/" + asets["img"] + ".png'/></div>";
    });
    vHTML += "</div>";
    vHTML += "</div>";
    vHTML += "<div class='subset' id='crsimSubsets'>";
    $.each(crsim_actions["actions"], function (acode, asets) {
        switch (acode) {
            case 'recombinate' :
                crsim_spending["actions"][acode] = 0;
                break;
            default :
                crsim_spending["actions"][acode] = {};
                break;
        }
        if (asets["subset"] != undefined) {
            if (asets["subset"] == "custom") {
                switch (acode) {
                    case 'vendor' :
                        var newset = {};
                        asets["ssubset"] = "";
                        $.each(crsim_vendor, function (key, vals) {
                            crsim_spending["actions"][acode][key] = 0;
                            var ings = "<div class='mmi ings'><div class='title'>Ingredients</div><ul>";
                            for (var w = 0; w < vals["ing"].length; w++) {
                                ings += "<li>" + vals["ing"][w] + "</li>";
                            }
                            ings += "</ul></div>";
                            crsim_dreasons["vendor" + key] = [];
                            newset[key] = {"name": vals["name"], "desc": vals["desc"] + ings, "img": "vendor"};
                            if (vals["subset"] != undefined) {
                                asets["ssubset"] += "<div class='ssubset vdsschooser' id='vendorSS" + key + "'>";
                                asets["ssubset"] += "<div class='label'>" + applyLang(vals["subset"]["label"]) + "</div>";
                                for (var i = 0; i < vals["subset"]["choices"].length; i++) {
                                    if (i == 0) {
                                        var sel = " sel";
                                    } else {
                                        var sel = "";
                                    }
                                    asets["ssubset"] += "<div class='acss_" + vals["subset"]["choices"][i] + " abtn" + sel + "' sscode='" + vals["subset"]["choices"][i] + "' onClick='poec_simSelectSSAction(this)'>" + applyLang(vals["subset"]["choices"][i]) + "</div>";
                                }
                                asets["ssubset"] += "</div>";
                            }
                        })
                        asets["subset"] = newset;
                        break;
                    case 'essence' :
                        var newset = {};
                        for (var i = 0; i < poecd['essences']['seq'].length; i++) {
                            crsim_spending["actions"][acode][poecd['essences']['seq'][i]["id_essence"]] = 0;
                            newset[poecd['essences']['seq'][i]["id_essence"]] = {
                                "name": poecl["essence"][poecd['essences']['seq'][i]["id_essence"]],
                                "img": "essence_" + poecd['essences']['seq'][i]["name_essence"]
                            };
                        }
                        asets["subset"] = newset;
                        break;
                    case 'catalyst' :
                        var newset = {};
                        for (var i = 0; i < poecd['catalysts']['seq'].length; i++) {
                            crsim_spending["actions"][acode][poecd['catalysts']['seq'][i]["id_catalyst"]] = 0;
                            newset[poecd['catalysts']['seq'][i]["id_catalyst"]] = {
                                "name": poecl["catalyst"][poecd['catalysts']['seq'][i]["id_catalyst"]],
                                "img": "catalyst_" + poecd['catalysts']['seq'][i]["id_catalyst"],
                                "desc": applyLang(crsim_catadesc[poecd['catalysts']['seq'][i]["id_catalyst"]])
                            };
                        }
                        asets["subset"] = newset;
                        break;
                    case 'fossil' :
                        var newset = {};
                        crsim_spending["actions"][acode]["reso1"] = 0;
                        crsim_spending["actions"][acode]["reso2"] = 0;
                        crsim_spending["actions"][acode]["reso3"] = 0;
                        crsim_spending["actions"][acode]["reso4"] = 0;
                        for (var i = 0; i < poecd['fossils']['seq'].length; i++) {
                            if (crsim_nofossil.indexOf("|" + poecd['fossils']['seq'][i]["id_fossil"] + "|") > -1) {
                            } else {
                                crsim_dreasons["fossil" + poecd['fossils']['seq'][i]["id_fossil"]] = [];
                                crsim_preasons["fossil" + poecd['fossils']['seq'][i]["id_fossil"]] = [];
                                crsim_spending["actions"][acode][poecd['fossils']['seq'][i]["id_fossil"]] = 0;
                                var desc = "";
                                var mod_data = jQuery.parseJSON(poecd['fossils']['seq'][i]['mod_data']);
                                var fttdata = poec_parseFossilEffect(mod_data);
                                if (fttdata["more"].length > 0) {
                                    desc += "<div>More :";
                                    for (var j = 0; j < fttdata["more"].length; j++) {
                                        if (j > 0) {
                                            desc += ",";
                                        }
                                        desc += " " + fttdata["more"][j]["name"];
                                    }
                                    desc += "</div>";
                                }
                                if (fttdata["less"].length > 0) {
                                    desc += "<div>Less :";
                                    for (var j = 0; j < fttdata["less"].length; j++) {
                                        if (j > 0) {
                                            desc += ",";
                                        }
                                        desc += " " + fttdata["less"][j]["name"];
                                    }
                                    desc += "</div>";
                                }
                                if (fttdata["block"].length > 0) {
                                    desc += "<div>No :";
                                    for (var j = 0; j < fttdata["block"].length; j++) {
                                        if (j > 0) {
                                            desc += ",";
                                        }
                                        desc += " " + fttdata["block"][j]["name"];
                                    }
                                    desc += "</div>";
                                }
                                if (poecd['fossils']['seq'][i]["description"]) {
                                    desc += "<div>" + poecd['fossils']['seq'][i]["description"] + "</div>";
                                }
                                newset[poecd['fossils']['seq'][i]["id_fossil"]] = {
                                    "name": poecl["fossil"][poecd['fossils']['seq'][i]["id_fossil"]],
                                    "img": "fossil_" + poecd['fossils']['seq'][i]["id_fossil"],
                                    "desc": desc
                                };
                            }
                        }
                        newset["gilded"] = {
                            "name": applyLang("Gilded"),
                            "img": "fossil_gilded",
                            "desc": applyLang("Item is overvalued by vendors")
                        };
                        newset["perfect"] = {
                            "name": applyLang("Perfect"),
                            "img": "fossil_perfect",
                            "desc": applyLang("Improved Quality")
                        };
                        newset["tangled"] = {
                            "name": applyLang("Tangled"),
                            "img": "fossil_tangled",
                            "desc": applyLang("Can have any Fossil modifiers")
                        };
                        crsim_dreasons["fossilperfect"] = [];
                        crsim_dreasons["fossilgilded"] = [];
                        crsim_dreasons["fossiltangled"] = [];
                        crsim_preasons["fossilperfect"] = [];
                        crsim_preasons["fossilgilded"] = [];
                        crsim_preasons["fossiltangled"] = [];
                        asets["subset"] = newset;
                        break;
                }
            }
            if (asets["subsel"] != undefined) {
                var addcls = "subsel";
            } else {
                var addcls = "";
            }
            vHTML += "<div class='acs_" + acode + " " + addcls + "' id='crsimActSub_" + acode + "'>";
            vHTML += "<div class='label'>" + applyLang(asets["subname"]) + "</div>";
            var isfirst = 1;
            $.each(asets["subset"], function (scode, ssets) {
                ssets["enabled"] = true;
                if (isfirst == 1) {
                    var addcls = " sel";
                    isfirst = 0;
                } else {
                    var addcls = "";
                }
                if (ssets["img"] != undefined) {
                    var img = "<div class='icon'><img src='images/manual/" + ssets["img"] + ".png'/></div>";
                    addcls += " iconed";
                } else {
                    var img = "";
                }
                vHTML += "<div class='acs_" + acode + scode + " abtn " + addcls + "' atype='subset' scode='" + scode + "' onClick='poec_simSelectSubAction(this)'>" + img + applyLang(ssets["name"]) + "</div>";
                if (acode == "harvest") {
                    crsim_spending["actions"]["harvest"][scode] = {};
                    crsim_dreasons[scode] = [];
                    crsim_preasons[scode] = [];
                } else {
                    switch (acode) {
                        case 'beast_crafting' :
                            crsim_dreasons["beast_crafting" + scode] = [];
                            crsim_preasons["beast_crafting" + scode] = [];
                            break;
                        case 'syndicate' :
                            crsim_dreasons["syndicate" + scode] = [];
                            crsim_preasons["syndicate" + scode] = [];
                            break;
                        case 'scourge' :
                            crsim_dreasons[scode] = [];
                            crsim_preasons[scode] = [];
                            break;
                        case 'eldritch' :
                            crsim_dreasons[scode] = [];
                            crsim_preasons[scode] = [];
                            break;
                    }
                    crsim_spending["actions"][acode][scode] = 0;
                }
            });
            switch (acode) {
                case 'fossil' :
                    var topts = "";
                    for (var i = 0; i < poecd['mtypes']['seq'].length; i++) {
                        if (poecd['mtypes']['seq'][i]["tangled"] == "1") {
                            topts += "<div class='acss_" + poecd['mtypes']['seq'][i]["id_mtype"] + " tags abtn' sscode='" + poecd['mtypes']['seq'][i]["id_mtype"] + "' onClick='poec_simSelectSSAction(this)'>" + poecl["mtype"][poecd['mtypes']['seq'][i]["id_mtype"]] + "</div>";
                        }
                    }
                    vHTML += "<div class='ssubset sml' id='fossilTangledMoreChooser'>";
                    vHTML += "<div class='label'>" + applyLang("Greatly more") + "</div>";
                    vHTML += topts;
                    vHTML += "</div>";
                    vHTML += "<div class='ssubset sml' id='fossilTangledNoChooser'>";
                    vHTML += "<div class='label'>" + applyLang("No") + "</div>";
                    vHTML += topts;
                    vHTML += "</div>";
                    break;
                case 'vendor' :
                    vHTML += asets["ssubset"];
                    break;
                case 'essence' :
                    // Tier choice
                    vHTML += "<div class='ssubset' id='essenceTiersChooser'>";
                    vHTML += "<div class='label'>" + applyLang("Tier") + "</div>";
                    vHTML += "<div id='essenceTiersArea'></div>";
                    vHTML += "</div>";
                    break;
                case 'catalyst' :
                    vHTML += "<div class='ssubset' id='catalystMode'>";
                    vHTML += "<div class='label'>" + applyLang("Mode") + "</div>";
                    vHTML += "<div class='acss_max abtn sel' sscode='max' onClick='poec_simSelectSSAction(this)'>" + applyLang("Maximum") + "</div>";
                    vHTML += "<div class='acss_single abtn' sscode='single' onClick='poec_simSelectSSAction(this)'>" + applyLang("Single") + "</div>";
                    vHTML += "</div>";
                    break;
                case 'harvest' :
                    vHTML += "<div class='ssubset' id='harvestTypeChooser'>";
                    vHTML += "<div class='label'>" + applyLang("Type") + "</div>";
                    var isfirst = 1;
                    for (var i = 0; i < poecd['mtypes']['seq'].length; i++) {
                        if (poecd['mtypes']['seq'][i]["harvest"] == "1") {
                            if (isfirst == 1) {
                                var addcls = " sel";
                                isfirst = 0;
                            } else {
                                var addcls = "";
                            }
                            vHTML += "<div class='acss_" + poecd['mtypes']['seq'][i]["id_mtype"] + " tags ss abtn " + addcls + "' atype='ssubset' sscode='" + poecd['mtypes']['seq'][i]["id_mtype"] + "' onClick='poec_simSelectSSAction(this)'>" + poecl["mtype"][poecd['mtypes']['seq'][i]["id_mtype"]] + "</div>";
                            $.each(crsim_spending["actions"]["harvest"], function (scode, val) {
                                crsim_spending["actions"]["harvest"][scode][poecd['mtypes']['seq'][i]["id_mtype"]] = 0;
                            });
                        }
                    }
                    $.each(crsim_spending["actions"]["harvest"], function (scode, val) {
                        crsim_spending["actions"]["harvest"][scode]["inf"] = 0;
                    });
                    vHTML += "<div class='acss_inf abtn' sscode='inf' onClick='poec_simSelectSSAction(this)'>" + applyLang("Influence") + "</div>";
                    vHTML += "</div>";
                    vHTML += "<div class='ssubset' id='harvestResistsChooser'>";
                    vHTML += "<div class='label'>" + applyLang("From > to") + "</div>";
                    vHTML += "<div class='acss_hrftc abtn sel' sscode='hrftc' desc='" + applyLang("Change a modifier that grants a Fire Resistance into a similar-tier modifier that grants Cold Resistance") + "' onClick='poec_simSelectSSAction(this)'>" + applyLang("Fire to Cold") + "</div>";
                    vHTML += "<div class='acss_hrftl abtn' sscode='hrftl' desc='" + applyLang("Change a modifier that grants a Fire Resistance into a similar-tier modifier that grants Lightning Resistance") + "' onClick='poec_simSelectSSAction(this)'>" + applyLang("Fire to Lightning") + "</div>";
                    vHTML += "<div class='acss_hrctf abtn' sscode='hrctf' desc='" + applyLang("Change a modifier that grants a Cold Resistance into a similar-tier modifier that grants Fire Resistance") + "' onClick='poec_simSelectSSAction(this)'>" + applyLang("Cold to Fire") + "</div>";
                    vHTML += "<div class='acss_hrctl abtn' sscode='hrctl' desc='" + applyLang("Change a modifier that grants a Cold Resistance into a similar-tier modifier that grants Lightning Resistance") + "' onClick='poec_simSelectSSAction(this)'>" + applyLang("Cold to Lightning") + "</div>";
                    vHTML += "<div class='acss_hrltf abtn' sscode='hrltf' desc='" + applyLang("Change a modifier that grants a Lightning Resistance into a similar-tier modifier that grants Fire Resistance") + "' onClick='poec_simSelectSSAction(this)'>" + applyLang("Lightning to Fire") + "</div>";
                    vHTML += "<div class='acss_hrltc abtn' sscode='hrltc' desc='" + applyLang("Change a modifier that grants a Lightning Resistance into a similar-tier modifier that grants Cold Resistance") + "' onClick='poec_simSelectSSAction(this)'>" + applyLang("Lightning to Cold") + "</div>";
                    crsim_spending["actions"]["harvest"]["hresist"]["hrftc"] = 0;
                    crsim_spending["actions"]["harvest"]["hresist"]["hrftl"] = 0;
                    crsim_spending["actions"]["harvest"]["hresist"]["hrctf"] = 0;
                    crsim_spending["actions"]["harvest"]["hresist"]["hrctl"] = 0;
                    crsim_spending["actions"]["harvest"]["hresist"]["hrltf"] = 0;
                    crsim_spending["actions"]["harvest"]["hresist"]["hrltc"] = 0;
                    vHTML += "</div>";
                    vHTML += "<div class='ssubset' id='harvestOtherChooser'>";
                    vHTML += "<div class='label'>" + applyLang("Option") + "</div>";
                    vHTML += "<div class='acss_hresf abtn sel' sscode='hresf' desc='" + applyLang("Reforge a rare item keeping prefixes") + "' onClick='poec_simSelectSSAction(this)'>" + applyLang("Ref. k/ prefixes") + "</div>";
                    vHTML += "<div class='acss_hrepf abtn' sscode='hrepf' desc='" + applyLang("Reforge a rare item keeping suffixes") + "' onClick='poec_simSelectSSAction(this)'>" + applyLang("Ref. k/ suffixes") + "</div>";
                    vHTML += "<div class='acss_rfmlk abtn' sscode='rfmlk' desc='" + applyLang("Reforge a rare item, being much more likely to receive the same modifier types") + "<div class=\"mmi\">Ignores the cannot roll caster/attack metamods<br><br>ATTENTION : Currently bugged in the game for attribute modifiers and PREVENTS them from appearing!</div>' onClick='poec_simSelectSSAction(this)'>" + applyLang("Ref. more likely") + "</div>";
                    vHTML += "<div class='acss_rfllk abtn' sscode='rfllk' desc='" + applyLang("Reforge a rare item, being much less likely to receive the same modifier types") + "<div class=\"mmi\">Ignores the cannot roll caster/attack metamods</div>' onClick='poec_simSelectSSAction(this)'>" + applyLang("Ref. less likely") + "</div>";
                    vHTML += "<div class='acss_hrrvpsi abtn' sscode='hrrvpsi' desc='" + applyLang("Reroll the values of Prefix, Suffix and Implicit modifiers on a Rare item, with Lucky modifier values") + "' onClick='poec_simSelectSSAction(this)'>" + applyLang("Div. all lucky") + "</div>";
                    vHTML += "<div class='acss_hrrvp abtn' sscode='hrrvp' desc='" + applyLang("Reroll the values of Prefix modifiers on a Magic or Rare item, with Lucky modifier values") + "' onClick='poec_simSelectSSAction(this)'>" + applyLang("Div. pref. lucky") + "</div>";
                    vHTML += "<div class='acss_hrrvs abtn' sscode='hrrvs' desc='" + applyLang("Reroll the values of Suffix modifiers on a Magic or Rare item, with Lucky modifier values") + "' onClick='poec_simSelectSSAction(this)'>" + applyLang("Div. suf. lucky") + "</div>";
                    vHTML += "</div>";
                    crsim_spending["actions"]["harvest"]["hother"]["hrepf"] = 0;
                    crsim_spending["actions"]["harvest"]["hother"]["hresf"] = 0;
                    crsim_spending["actions"]["harvest"]["hother"]["rfmlk"] = 0;
                    crsim_spending["actions"]["harvest"]["hother"]["rfllk"] = 0;
                    crsim_spending["actions"]["harvest"]["hother"]["hrrvpsi"] = 0;
                    crsim_spending["actions"]["harvest"]["hother"]["hrrvp"] = 0;
                    crsim_spending["actions"]["harvest"]["hother"]["hrrvs"] = 0;
                    vHTML += "<div class='ssubset' id='harvestHightierChooser'>";
                    vHTML += "<div class='label'>" + applyLang("Option") + "</div>";
                    vHTML += "<div class='acss_htnmo abtn sel' sscode='htnmo' atype='ssubset' desc='" + applyLang("Upgrade a Normal item to a Magic item, adding one random high-tier modifier") + "' onClick='poec_simSelectSSAction(this)'>" + applyLang("Normal to magic > one mod") + "</div>";
                    vHTML += "<div class='acss_htnmt abtn' sscode='htnmt' atype='ssubset' desc='" + applyLang("Upgrade a Normal item to a Magic item, adding two random high-tier modifiers") + "' onClick='poec_simSelectSSAction(this)'>" + applyLang("Normal to magic > two mod") + "</div>";
                    vHTML += "<div class='acss_htmrt abtn' sscode='htmrt' atype='ssubset' desc='" + applyLang("Upgrade a Magic item to a Rare item, adding two random high-tier modifiers") + "' onClick='poec_simSelectSSAction(this)'>" + applyLang("Magic to rare > two mod") + "</div>";
                    vHTML += "<div class='acss_htmrr abtn' sscode='htmrr' atype='ssubset' desc='" + applyLang("Upgrade a Magic item to a Rare item, adding three random high-tier modifiers") + "' onClick='poec_simSelectSSAction(this)'>" + applyLang("Magic to rare > three mod") + "</div>";
                    vHTML += "<div class='acss_htmrf abtn' sscode='htmrf' atype='ssubset' desc='" + applyLang("Upgrade a Magic item to a Rare item, adding four random high-tier modifiers") + "' onClick='poec_simSelectSSAction(this)'>" + applyLang("Magic to rare > four mod") + "</div>";
                    vHTML += "</div>";
                    crsim_spending["actions"]["harvest"]["hhight"]["htnmo"] = 0;
                    crsim_spending["actions"]["harvest"]["hhight"]["htnmt"] = 0;
                    crsim_spending["actions"]["harvest"]["hhight"]["htmrt"] = 0;
                    crsim_spending["actions"]["harvest"]["hhight"]["htmrr"] = 0;
                    crsim_spending["actions"]["harvest"]["hhight"]["htmrf"] = 0;
                    crsim_dreasons["htnmo"] = [];
                    crsim_dreasons["htnmt"] = [];
                    crsim_dreasons["htmrt"] = [];
                    crsim_dreasons["htmrr"] = [];
                    crsim_dreasons["htmrf"] = [];
                    break;
            }
            vHTML += "</div>";
        }
    });
    vHTML += "</div>";
    vHTML += "</div>";

    vHTML += "</div>";

    vHTML += "</div><div>";

    vHTML += "<div class='div_stable' id='crsimBottomZone'><div>";
    vHTML += "<div class='itemzone'>"; // Item zone

    vHTML += "<div class='div_stable' id='crsimItemZone'><textarea id='simClipboardData'></textarea><div>";
    vHTML += "<div class='details'>";
    vHTML += '<div class="poec_item med_shadow" id="simItemHolder"><div class="wrap"><div id="simClipBtn" class="abtn" onClick="poec_simCopyToClipboard()"><img src="images/manual/clip.png"/></div>';
    vHTML += '<div class="header">';
    vHTML += '<div class="sides left" id="simItemLInf"></div>';
    vHTML += '<div class="sides right" id="simItemRInf"></div>';
    vHTML += '<div class="ititle" id="simItemMTitle"></div>';
    vHTML += '<div class="base" id="simItemBase"></div>';
    vHTML += '</div>';
    vHTML += '<div class="affixes" id="simItemAffixes">';

    vHTML += '</div>';
    vHTML += "</div></div>";
    vHTML += "</div><div class='hoverer' id='simItemCol'><div id='simItemHoverer' onClick='poec_simApplyCraft()'>";
    vHTML += "<div class='hovbox'><img src='images/manual/item_box.png'/><div id='crsimItemImage'></div></div>";
    vHTML += "<div class='craftbtn'></div>";
    vHTML += "</div><div id='simItemAInfo'></div><div id='simUnveilZone'><div class='unveilbtn' onClick='poec_simUnveilMod(null,false)'></div></div><div id='simImprintZone'><div class='abtn' onClick='poec_simApplyImprint()' atype='imprint'><img src='images/manual/sim_imprint.png'/></div></div></div>";
    vHTML += "</div></div>";

    vHTML += "</div>";
    vHTML += "<div class='modpool' id='crsimMasterModpool'>"; // Modpool

    /*
    vHTML+="<div class='sim_zonetoggler zn2 noselect' zones='modpoolbench'>";
    vHTML+=  "<div class='toggle sel' zone='crsimModpoolZone' onClick='poec_simToggleZone(this)'>"+applyLang("Modpool")+"</div>";
    vHTML+=  "<div class='toggle' zone='crsimBenchZone' onClick='poec_simToggleZone(this)'>"+applyLang("Bench")+"</div>";
    vHTML+="</div>";
    */

    vHTML += "<div id='crsimMPSearchZone' class='poec_search_input'><input type='text' class='init' id='crsimMPSearchInput' initerm='" + applyLang("Search for an affix") + "' value=''/><div class='clear' onClick='poec_simClearMPSearch()' tabindex='0'><div>X</div></div></div>";

    vHTML += "<div id='crsimModpoolZone' class='sim_zonecontent modpoolbench sel'>";

    vHTML += "<div id='crsimMPZoneToggler' class='sim_zonetoggler zn3 noselect mpafftypes' zones='modpoolatype' bound='mpafftypes'>";
    vHTML += "<div class='toggle sel prefixes prefix' zone='crsimMPPrefix' bval='prefixes' onClick='poec_simToggleZone(this)'>" + applyLang("Prefixes") + "<div class='nsearch'></div></div>";
    vHTML += "<div class='toggle suffixes suffix' zone='crsimMPSuffix' bval='suffixes' onClick='poec_simToggleZone(this)'>" + applyLang("Suffixes") + "<div class='nsearch'></div></div>";
    vHTML += "<div class='toggle implicits implicit' zone='crsimMPImplicit' bval='implicits' onClick='poec_simToggleZone(this)'>" + applyLang("Implicits") + "<div class='nsearch'></div></div>";
    vHTML += "</div>";
    vHTML += "<div id='crsimMPPrefix' class='sim_zonecontent prefix modpoolatype scroller sel'></div>";
    vHTML += "<div id='crsimMPSuffix' class='sim_zonecontent suffix modpoolatype scroller'></div>";
    vHTML += "<div id='crsimMPImplicit' class='sim_zonecontent implicit modpoolatype scroller'></div>";

    vHTML += "</div>";

    /*
    vHTML+="<div id='crsimBenchZone' class='sim_zonecontent modpoolbench'>";

      vHTML+="<div id='crsimBCraftZone'>";
        vHTML+="<div class='sim_zonetoggler zn2 noselect mpafftypes' zones='benchcraftatype' bound='mpafftypes'>";
        vHTML+=  "<div class='toggle sel prefixes' zone='crsimBCPrefix' bval='prefixes' onClick='poec_simToggleZone(this)'>"+applyLang("Prefixes")+"</div>";
        vHTML+=  "<div class='toggle suffixes' zone='crsimBCSuffix' bval='suffixes' onClick='poec_simToggleZone(this)'>"+applyLang("Suffixes")+"</div>";
        vHTML+="</div>";
        vHTML+="<div id='crsimBCPrefix' class='sim_zonecontent benchcraftatype scroller sel'></div>";
        vHTML+="<div id='crsimBCSuffix' class='sim_zonecontent benchcraftatype scroller'></div>";
      vHTML+="</div>";
      vHTML+="<div id='crsimNoBenchMsg'>";
      vHTML+=  "<div class='gen_msg'>"+applyLang("You cannot use the bench to craft on this base item type.")+"</div>";
      vHTML+="</div>";

    vHTML+="</div>";
    */

    vHTML += "</div>";
    vHTML += "<div class='logzone'>"; // Logzone

    vHTML += "<div id='crsimHistorySpendingToggler' class='sim_zonetoggler zn3 noselect' zones='historyspending'>";
    vHTML += "<div class='toggle sel' zone='crsimHistoryZone' onClick='poec_simToggleZone(this)'>" + applyLang("History") + "<div class='mcui-button yellow' id='simHistoryUndoBtn' onClick='poec_simRevertHistory()'><div class='mirror'>&#10149;</div> " + applyLang("Undo") + "</div></div>";
    vHTML += "<div class='toggle " + crsim_prefcur + " none' id='crsimSpendingToggler' zone='crsimSpendingZone' onClick='poec_simToggleZone(this)'>" + applyLang("Spending") + "<div id='crsimSpendingPreview'><div class='chaos'><img src='images/manual/method_chaos.png'><div class='num'></div></div><div class='exalted'><img src='images/manual/method_divine.png'><div class='num'></div></div></div></div>";
    vHTML += "<div class='toggle' id='crsimImpExpToggler' zone='crsimExportZone' onClick='poec_simToggleZone(this)'>" + applyLang("Export") + "</div>";
    vHTML += "</div>";

    vHTML += "<div id='crsimHistoryZone' class='sim_zonecontent historyspending sel'>";
    vHTML += "<div class='history' id='crsimHistoryOutput'>";
    vHTML += "<div class='content scroller' id='crsimHistory'><div id='crsimOriginalIS' lindex='-1'>" + applyLang("Starting State") + " <span class='grey'>(" + applyLang("Hover") + ")</span></div><table id='crsimHistoryTbl' cellspacing='0' class='div_stable'></table></div>";
    vHTML += "</div>";
    vHTML += "</div>";

    vHTML += "<div id='crsimSpendingZone' class='sim_zonecontent historyspending'>";
    vHTML += "<div class='spending " + crsim_prefcur + "' id='crsimSpendingOutput'>";
    vHTML += "<div class='content scroller' id='crsimSpending'></div>";
    vHTML += "</div>";
    vHTML += "</div>";

    vHTML += "<div id='crsimExportZone' class='sim_zonecontent historyspending'><div>";
    vHTML += "<div id='crsimExportToggled'>";
    vHTML += "<div class='gen_msg'>" + applyLang("Copy the content below to a file to save and save to .txt format") + ".</div>";
    vHTML += "<textarea id='crsimExportArea' class='simietextarea' onClick='$(this).select()'></textarea>";
    vHTML += "</div>";
    vHTML += "<div id='crsimExportToggler'>";
    vHTML += "<div class='mcui-button green' id='crsimGenExpDataBtn' onClick='poec_simExportData()'>" + applyLang("Generate export data") + "</div>";
    vHTML += "</div>";
    vHTML += "</div></div>";

    vHTML += "</div>";
    vHTML += "</div></div>";

    vHTML += "</div></div></div>";

    vHTML += "</div></div></div>";

    poec_simInitMVData();

    $("#contentCurtain").click(function () {
        poec_closeCraftingSim();
    });
    $("#poecCraftingSim").html(vHTML);
    $("#simItemHoverer").removeClass("capply").hover(function () {
        poec_simCApply();
        poec_simChangeCursor();
    }, function () {
        poec_simRestoreCursor();
    });
    $("<div>").attr("id", "poecSimHoverer").addClass("med_shadow").appendTo($("body"));
    poec_initAffContext();
    poec_initMPSearcher();
    $(window).keyup(function (e) {
        if (e.keyCode == 8) {
            if ($("#simHistoryUndoBtn").is(":visible") && !$("#crsimMPSearchInput").hasClass("hasfocus")) {
                poec_simRevertHistory();
            }
        }
    });
    $(window).keydown(function (e) {
        if (e.ctrlKey && e.key === 'z') {
            if ($("#simHistoryUndoBtn").is(":visible") && !$("#crsimMPSearchInput").hasClass("hasfocus")) {
                poec_simRevertHistory();
            }
        }
    });
    $("#poecCraftingSim").find("div.currency").children("div").hover(function () {
        var hpos = $(this).offset();
        var acode = $(this).attr("acode");
        $("#poecSimHoverer").css({
            "margin-left": 0,
            "top": hpos.top + $(this).outerHeight(),
            "left": hpos.left
        }).html(applyLang(crsim_actions["currency"][acode]["desc"]) + poec_simCheckReasons(acode)).show();
    }, function () {
        $("#poecSimHoverer").hide();
    });
    $("#poecCraftingSim").find("div.abtn:not(.ss)").hover(function () {
        var hpos = $(this).offset();
        var atype = $(this).attr("atype");
        switch (atype) {
            case "actions":
                var code = $(this).attr("acode");
                var desc = crsim_actions[atype][code]["desc"] + poec_simCheckReasons(code);
                break;
            case "subset":
                var code = $(this).attr("scode");
                var desc = crsim_actions["actions"][crsim_params["action"]]["subset"][code]["desc"];
                switch (crsim_params["action"]) {
                    case 'fossil' :
                        desc += poec_simCheckReasons("fossil" + code);
                        break;
                    case 'beast_crafting' :
                        desc += poec_simCheckReasons(crsim_params["action"] + code);
                        break;
                    case 'syndicate' :
                        desc += poec_simCheckReasons(crsim_params["action"] + code);
                        break;
                    case 'vendor' :
                        desc += poec_simCheckReasons(crsim_params["action"] + code);
                        break;
                    default :
                        desc += poec_simCheckReasons(code);
                        break;
                }
                break;
            case "imprint":
                var desc = applyLang("Apply imprint");
                break;
            case 'ssubset' :
                var code = $(this).attr("sscode");
                var desc = $(this).attr("desc");
                desc += poec_simCheckReasons(code);
                break;
            default:
                var desc = $(this).attr("desc");
                break;
        }
        if (desc) {
            $("#poecSimHoverer").css({
                "margin-left": 0,
                "top": hpos.top + $(this).outerHeight(),
                "left": hpos.left
            }).html(applyLang(desc)).show();
            if (atype == "actions") {
                if ($("#crsimActions").children("div.abtn").length - $(this).index() < 3) {
                    var tmpleft = $("#poecSimHoverer").offset().left;
                    $("#poecSimHoverer").css({"left": 0});
                    $("#poecSimHoverer").css({
                        "left": tmpleft,
                        "margin-left": 0 - $("#poecSimHoverer").outerWidth() + $(this).outerWidth()
                    });
                }
            }
        }
    }, function () {
        $("#poecSimHoverer").hide();
    });

    $("#crsimOriginalIS").hover(function () {
        poec_simShowHistoryState(this);
    }, function () {
        poec_simHideHistoryState();
    });

    poec_openCraftingSimGO();
}

var poec_simmpstm = null;

function poec_initMPSearcher() {
    poec_simClearMPSearch();
    $("#crsimMPSearchInput").focus(function () {
        if ($(this).hasClass("init")) {
            $(this).removeClass("init").val("");
        }
        $(this).addClass("focused");
        $(this).parent().addClass("active");
        $(this).select();
        $(this).addClass("hasfocus");
    }).blur(function (event) {
        if (!$(event.relatedTarget).hasClass("clear")) {
            var val = $("#crsimMPSearchInput").val().trim();
            if (val == "") {
                poec_simClearMPSearch();
            }
        }
        $(this).removeClass("hasfocus");
    }).keyup(function (e) {
        clearTimeout(poec_simmpstm);
        poec_simmpstm = setTimeout(function () {
            poec_simMPSearchGO();
        }, 250);
    });
}

function poec_simClearMPSearch() {
    $("#crsimMPSearchInput").removeClass("focused").addClass("init").val($("#crsimMPSearchInput").attr("initerm"));
    $("#crsimMPSearchInput").parent().removeClass("active");
    clearTimeout(poec_simmpstm);
    poec_simMPSearchGO();
}

function poec_simMPSearchGO() {
    var val = "";
    if (!$("#crsimMPSearchInput").hasClass("init")) {
        val = $("#crsimMPSearchInput").val().trim();
    }
    $("#crsimModpoolZone").find(".sfound").removeClass("sfound"); // Remove previous search if any
    $("#crsimModpoolZone").find(".opened").removeClass("opened"); // Close anything that was opened
    $("#crsimModpoolZone").find(".search_not_found").removeClass("show");
    if (val == "") {
        // Reset
        $("#crsimModpoolZone").removeClass("searching");
        $("#crsimMPZoneToggler").children(".toggle").find(".nsearch").html("");
    } else {
        // Search
        $("#crsimModpoolZone").addClass("searching");
        if (val.substring(0, 1) == "~") {
            val = val.substring(1);
            var vals = val.trim().replace(/\s\s+/g, ' ').split(" ");
        } else {
            var vals = val.split(",");
        }
        for (var i = 0; i < vals.length; i++) {
            vals[i] = vals[i].trim();
        }
        var cntpt = {"prefix": 0, "suffix": 0, "implicit": 0};
        $("#crsimModpoolZone").find(".affix.stmgrp").each(function () {
            var search = $(this).attr("search");
            var pass = true;
            for (var i = 0; i < vals.length; i++) {
                if (search.indexOf(vals[i]) > -1) {
                } else {
                    pass = false;
                }
            }
            if (pass) {
                $(this).addClass("sfound");
                cntpt[$(this).attr("atype")]++;
            }
        });
        $.each(cntpt, function (key, num) {
            if (num == 0) {
                num = "";
                $("#crsimModpoolZone").find(".modpoolatype." + key).find(".search_not_found").addClass("show");
            } else {
                num = "(" + num + ")";
            }
            $("#crsimMPZoneToggler").children(".toggle." + key).find(".nsearch").html(num);
        });
    }
}

function poec_initAffContext() {
    if ($("#poecSAffContext").length == 0) {
        $("<div>").attr("id", "poecSAffContext").addClass("med_shadow").appendTo($("body"));
        $("#poecSAffContext").hover(function () {
        }, function () {
            poec_simCloseAffixContext();
        });
    }
}

function poec_simInitMVData() {
    if (crsim_mvdata == null) {
        crsim_mvdata = {};
        $.each(poecd["maeven"]["ind"], function (mvid, mvdata) {
            var houtput = "";
            var strcheck = "";
            var amtypes = [];
            if (mvdata["mtypes"]) {
                if (mvdata["mtypes"].length > 1) {
                    strcheck = mvdata["mtypes"];
                    amtypes = mvdata["mtypes"].substring(1, mvdata["mtypes"].length - 1).split("|");
                    for (var z = 0; z < amtypes.length; z++) {
                        if (poecd["mtypes"]["seq"][poecd["mtypes"]["ind"][amtypes[z]]]["jewellery_tag"] == 0) {
                            if (crsim_igntypes.indexOf("|" + amtypes[z] + "|") > -1) {
                            } else {
                                houtput += "<div class='mt tmt" + amtypes[z] + " sml_shadow'>" + poecl["mtype"][amtypes[z]] + "</div>";
                            }
                        }
                    }
                }
            }
            crsim_mvdata[mvid] = {
                "strcheck": strcheck,
                "amtypes": amtypes,
                "houtput": houtput
            };
        });
    }
}

function poec_simBuildCatalystData() {
    if (crsim_catdata == null) {
        poec_cbfTypeToID = {};
        poec_cbfIDToType = {};
        for (var i = 0; i < poecd["mtypes"]["seq"].length; i++) {
            poec_cbfIDToType[poecd["mtypes"]["seq"][i]["poedb_id"]] = poecd["mtypes"]["seq"][i]["id_mtype"];
            poec_cbfTypeToID[poecd["mtypes"]["seq"][i]["id_mtype"]] = poecd["mtypes"]["seq"][i]["poedb_id"];
        }
        crsim_catdata = {};
        for (var i = 0; i < poecd["catalysts"]["seq"].length; i++) {
            crsim_catdata[poecd["catalysts"]["seq"][i]["id_catalyst"]] = poecd["catalysts"]["seq"][i]["tags"].substring(1, poecd["catalysts"]["seq"][i]["tags"].length - 1).split("|");
            for (var k = 0; k < crsim_catdata[poecd["catalysts"]["seq"][i]["id_catalyst"]].length; k++) {
                crsim_catdata[poecd["catalysts"]["seq"][i]["id_catalyst"]][k] = poec_cbfIDToType[crsim_catdata[poecd["catalysts"]["seq"][i]["id_catalyst"]][k]];
            }
        }
    }
}

function poec_simInitHarvestToggler() {
    $("<div>").addClass("tooltip").html("<div class='enabled'>" + applyLang("Pre-nerf Harvest") + "</div><div class='disabled'>" + applyLang("Post-nerf Harvest") + "</div>").appendTo($("#simFullHarvestBtn").children("div"));
    $("#simFullHarvestBtn").hover(function () {
        $("#simFullHarvestBtn").find(".tooltip").show();
    }, function () {
        $("#simFullHarvestBtn").find(".tooltip").hide();
    });
}

function poec_simToggleHarvestNerf() {
    if (crsim_hnerf) {
        $("#simFullHarvestBtn").removeClass("enabled");
        crsim_hnerf = false;
    } else {
        $("#simFullHarvestBtn").addClass("enabled");
        crsim_hnerf = true;
    }
    poec_simApplyHarvestState();
}

function poec_simApplyHarvestState() {
    if (crsim_hnerf) {
        $("#crsimActSub_harvest").find(".acs_harvesthreplace").addClass("nerfed");
        $("#crsimActSub_harvest").find(".acs_harvesthannul").addClass("nerfed");
        $("#crsimActSub_harvest").find(".acs_harvesthdivine").addClass("nerfed");
        $("#crsimActSub_harvest").find(".acs_harvesthrerollp").addClass("nerfed");
        $("#crsimActSub_harvest").find(".acs_harvesthnonto").addClass("nerfed");
        $("#crsimActSub_harvest").find(".acss_hresf").addClass("nerfed");
        $("#crsimActSub_harvest").find(".acss_hrepf").addClass("nerfed");
        $("#crsimActSub_harvest").find(".acss_hrrvpsi").addClass("nerfed");
        $("#crsimActSub_harvest").find(".acss_hrrvp").addClass("nerfed");
        $("#crsimActSub_harvest").find(".acss_hrrvs").addClass("nerfed");
        $("body").addClass("harvest_nerf");
    } else {
        $("#crsimActSub_harvest").find(".nerfed").removeClass("nerfed");
        $("body").removeClass("harvest_nerf");
    }
}

function poec_simCheckReasons(code) {
    var reasons = "";
    var scourging = false;
    if (code.indexOf("scourge") > -1) {
        scourging = true;
    }
    if (crsim_settings["corrupted"] == 1 && !scourging) {
        reasons += "<div>" + applyLang("Item is corrupted") + "</div>";
    } else {
        if (crsim_preasons[code] != undefined) { // Check permanent reasons
            if (crsim_preasons[code].length > 0) {
                reasons += "<div>" + crsim_preasons[code][0] + "</div>";
            }
        }
        if (scourging) {
            if (code != "scourgetogglecorrupt" && crsim_settings["corrupted"] == 0) {
                reasons += "<div>" + applyLang("Item is not corrupted") + "</div>";
            }
        }
        if (reasons == "") {
            if (crsim_dreasons[code] != undefined) { // Check situationnal reasons
                if (crsim_dreasons[code].length > 0) {
                    reasons += "<div>" + crsim_dreasons[code][0] + "</div>";
                }
            }
        }
    }
    if (reasons != "") {
        return "<div class='reasons'>" + reasons + "</div>";
    } else {
        return "";
    }
}

function poec_simGoToStart() {
    if (crsim_settings === null) {
        $("#simMainInterface").hide();
        $("#simRestartBtn").hide();
        $("#simBackStepBtn").removeClass("hidden");
        poec_simGoToStep(1);
        $("#simSourceInt").show();
    }
}

function poec_simCApply() {
    if (crsim_params["mode"] != null) {
        $("#simItemHoverer").addClass("capply");
    } else {
        $("#simItemHoverer").removeClass("capply");
    }
}

function poec_simChangeCursor() {
    if (crsim_params["mode"] == null) {
        poec_simRestoreCursor();
    } else {
        var ipos = 39;
        if (crsim_params["mode"] == "currency") {
            if (crsim_params["currency"] == null) {
                crsim_params["mode"] = null;
                poec_simRestoreCursor();
            } else {
                crsim_params["cursor"] = "url('images/manual/method_" + crsim_params["currency"] + ".png') " + ipos + " " + ipos + ", default";
                $("#simItemHoverer").css({"cursor": crsim_params["cursor"]});
            }
        } else {
            if (crsim_actions["actions"][crsim_params["action"]] != undefined) {
                if (crsim_actions["actions"][crsim_params["action"]]["subset"]) {
                    if (crsim_actions["actions"][crsim_params["action"]]["subsel"] != undefined) {
                        if (crsim_params["subaction"] != undefined) {
                            if (crsim_params["subaction"].length > 0) {
                                switch (crsim_params["action"]) {
                                    case 'fossil' :
                                        if (crsim_settings["rarity"] == "normal") {
                                            var ir = "n";
                                        } else {
                                            var ir = "r";
                                        }
                                        crsim_params["cursor"] = "url('images/manual/sreso_" + ir + "_" + crsim_params["subaction"].length + ".png') " + ipos + " " + ipos + ", default";
                                        $("#simItemHoverer").css({"cursor": crsim_params["cursor"]});
                                        break;
                                }
                            } else {
                                poec_simRestoreCursor();
                            }
                        } else {
                            poec_simRestoreCursor();
                        }
                    } else {
                        if (crsim_params["subaction"]) {
                            if (crsim_actions["actions"][crsim_params["action"]]["subset"][crsim_params["subaction"]]["img"]) {
                                if (crsim_actions["actions"][crsim_params["action"]]["isize"]) {
                                    ipos = crsim_actions["actions"][crsim_params["action"]]["isize"] / 2;
                                }
                                crsim_params["cursor"] = "url('images/manual/" + crsim_actions["actions"][crsim_params["action"]]["subset"][crsim_params["subaction"]]["img"] + ".png') " + ipos + " " + ipos + ", default";
                                $("#simItemHoverer").css({"cursor": crsim_params["cursor"]});
                            }
                        } else {
                            $("#simItemHoverer").css({"cursor": "default"});
                        }
                    }
                } else {
                    if (crsim_actions["actions"][crsim_params["action"]]["img"]) {
                        if (crsim_actions["actions"][crsim_params["action"]]["isize"]) {
                            ipos = crsim_actions["actions"][crsim_params["action"]]["isize"] / 2;
                        }
                        crsim_params["cursor"] = "url('images/manual/" + crsim_actions["actions"][crsim_params["action"]]["img"] + ".png') " + ipos + " " + ipos + ", default";
                        $("#simItemHoverer").css({"cursor": crsim_params["cursor"]});
                    } else {
                        poec_simRestoreCursor(); // TODO : fallback to? text?
                    }
                }
            }
        }
    }
}

function poec_simRestoreCursor() {
    $("#simItemHoverer").css({"cursor": "default"}).removeClass("capply");
}

function poec_closeCraftingSim() {
    $("#poecZoneChooser").children("div").removeClass("sel");
    $("#poecZoneChooser").children("div.calculator").addClass("sel");
    $("#poecEmulatorZone").hide();
    $("#poecCalculatorZone").show();
}

function poec_simRestart(delta, init) {
    if (crsim_log) {
        if (crsim_log.length == 0) {
            delta = true;
            init = false;
        }
    }
    if (init) {
        $("#simRestartBtn").mcuiNotice({
            text: applyLang("You will lose current project<br/>are you sure you wish to proceed?"),
            type: "confirm",
            complete: function (delta) {
                poec_simRestart(delta, false);
            }
        }).showNotice();
    } else {
        if (delta == true) {
            crsim_settings = null;
            crsim_log = null;
            crsim_data = null;
            crsim_catalyst = null;
            $("#crsimActions").children(".abtn").removeClass("sel");
            $("#crsimOptCur").children(".abtn").removeClass("sel");
            $("#crsimSubsets").children("div").hide();
            $("#crsimSpending").html("");
            $("#crsimHistoryTbl").html("");
            poec_simGoToStart();
        }
    }
}

function poec_simGoToStep(step) {
    $("#simSourceInt").find(".step").hide();
    $("#simRestoreBtn").hide();
    switch (step) {
        case 1 :
            $("#crsimStep1CSBtn").hide();
            if (poec_cBase) {
                $("#crsimStep1CSBtn").show();
            }
            $("#simRestoreBtn").show();
            break;
        case 3 :
            // Show only bases under base group
            $("#simStepBaseChoice").find(".master").hide();
            $("#simStepBaseChoice").find(".child").hide();
            $("#simStepBaseChoice").find(".master.bgroup" + crsim_settings["bgroup"]).show();
            $("#simFLBase").html("<div>" + poecl["bgroup"][crsim_settings["bgroup"]] + "</div>");
            break;
        case 4 :
            // Show only items under base
            $("#simStepItemChoice").find(".item").hide();
            if ($("#simStepItemChoice").find(".item.base" + crsim_settings["base"]).length > 0) {
                if ($("#simStepItemChoice").find(".item.base" + crsim_settings["base"]).length == 1) {
                    var ifound = $("#simStepItemChoice").find(".item.base" + crsim_settings["base"]);
                    crsim_settings["bitem"] = parseInt($(ifound[0]).attr("iid"));
                    step = 5;
                    poec_simGoToStep(step);
                } else {
                    $("#simStepItemChoice").find(".item.base" + crsim_settings["base"]).show();
                    $("#simFLItem").html("<div>" + poecl["bgroup"][crsim_settings["bgroup"]] + "</div><div class='sep'>➤</div><div>" + poecl["base"][crsim_settings["base"]] + "</div>");
                }
            } else {
                // Go to options
                step = 5;
                poec_simGoToStep(step);
            }
            break;
        case 5 :
            var additem = "";
            if (crsim_settings["bitem"]) {
                additem += "<div class='sep'>➤</div><div>" + poecl["bitem"][crsim_settings["bitem"]] + "</div>";
            }
            $("#simFLOptions").html("<div>" + poecl["bgroup"][crsim_settings["bgroup"]] + "</div><div class='sep'>➤</div><div>" + poecl["base"][crsim_settings["base"]] + "</div>" + additem);
            if (crsim_settings["ilvl"] == null) {
                crsim_settings["ilvl"] = 100;
            }
            poec_simSelectILvl($("#simOptionsILvl").find(".ilvl" + crsim_settings["ilvl"]));
            if (parseInt(crsim_settings["ilvl"]) < 68) {
                $("#simOptionsInfluences").find(".sel").removeClass("sel");
                $("#simOptionsInfluences").addClass("disabled");
                crsim_settings["influences"] = null;
            }
            if (crsim_settings["quality"] == undefined) {
                crsim_settings["quality"] = 20;
            }
            poec_simSelectQuality($("#simOptionsQuality").find(".qual" + crsim_settings["quality"]));
            if (crsim_qualbgroups.indexOf("|" + crsim_settings["bgroup"] + "|") > -1) {
                if (crsim_qualnbases.indexOf("|" + crsim_settings["base"] + "|") > -1) {
                    $("#simOptionsQuality").hide();
                } else {
                    $("#simOptionsQuality").show();
                }
            } else {
                $("#simOptionsQuality").hide();
            }
            $("#simOptionsInfluences").find(".sel").removeClass("sel");
            var is_influence = parseInt(poecd["bgroups"]["seq"][poecd["bgroups"]["ind"][crsim_settings["bgroup"]]]["is_influenced"]);
            if (is_influence == 1) {
                if (crsim_settings["bitem"] == 8201) {
                    $("#simOptionsInfluences").hide();
                } else {
                    $("#simOptionsInfluences").show();
                }
            } else {
                $("#simOptionsInfluences").hide();
            }
            break;
        case 6 :
            $("#simImportArea").val("");
            $("#simImportBtn").hide();
            break;
    }
    $("#simSourceInt").find(".step" + step).show();
    if (step > 1) {
        if (step == 2) {
            if (poec_cBase) {
                $("#simBackStepBtn").show();
            } else {
                $("#simBackStepBtn").hide();
            }
        } else {
            $("#simBackStepBtn").show();
        }
    } else {
        $("#simBackStepBtn").hide();
    }
}

function poec_simShowItemImporter(type) {
    switch (type) {
        case 'woker' :
            var title = applyLang("Awakener's Orb");
            var action = applyLang("Awaken");
            var jsact = "poec_simAwaken(null)";
            break;
        case 'recomb' :
            var title = applyLang("Recombinator");
            var action = applyLang("Recombinate");
            var jsact = "poec_simRecombinate(null)";
            break;
    }
    if ($("#poecSimWoker").length == 0) {
        $("<div>").attr("id", "poecSimWoker").addClass("over_shadow").html("<div class='wrap'><div class='title'></div><div class='note'>" + applyLang("Use the export function to get<br/>the item to be destroyed's data") + "</div><textarea id='poecSimWokeData'></textarea><div><div class='mcui-button green' id='poecSimWokeGoBtn'></div><div class='mcui-button red' id='poecSimWokeCancelBtn' onClick='poec_simWokerClose()'>" + applyLang("Cancel") + "</div></div></div>").appendTo($("body"));
        if ($("#poecSimWCurtain").length == 0) {
            $("<div>").attr("id", "poecSimWCurtain").appendTo($("body"));
        }
        $("#poecSimWokeData").focus(function () {
            if ($(this).hasClass("init")) {
                $(this).attr("initerm", $(this).val());
                $(this).removeClass("init").val("");
            }
            if ($(this).hasClass("error")) {
                $(this).removeClass("error").val(poec_simWokeInfo);
            }
        }).blur(function () {
            if ($(this).val() == "") {
                $(this).val($(this).attr("initerm")).addClass("init");
            }
        });
    }
    $("#poecSimWCurtain").show();
    $("#poecSimWokeData").addClass("init").val("Paste data here!");
    $("#poecSimWoker").find(".title").html(title);
    $("#poecSimWokeGoBtn").html(action).attr("onclick", jsact);
    $("#poecSimWoker").show().css({
        "margin-left": 0 - ($("#poecSimWoker").outerWidth() / 2),
        "margin-top": 0 - ($("#poecSimWoker").outerHeight() / 2)
    });
}

var poec_simWokeInfo = "";
var poec_simWokePick = null;

function poec_simSelectCurrency(vThis) {
    if (!$(vThis).hasClass("disabled")) {
        if ($(vThis).hasClass("not_ready")) {
            $(vThis).mcuiNotice({text: applyLang("Upcoming feature"), type: "alert"}).showNotice();
        } else {
            var acode = $(vThis).attr("acode");
            $(vThis).parent().children("div").removeClass("sel");
            $(vThis).addClass("sel");
            poec_simSetParams("currency");
            switch (acode) {
                case 'woke' :
                    poec_simShowItemImporter("woker");
                    break;
            }
        }
    }
}

function poec_simWokerClose() {
    $("#poecSimWoker").hide();
    $("#poecSimWCurtain").hide();
    $("#crsimOptCur").find(".ac_woke").removeClass("sel");
    poec_simSetParams("currency");
}

var simRecombBases = {
    "boots": "|201|43|42|39|41|44|40|",
    "gloves": "|202|37|36|33|35|38|34|",
    "armours": "|45|46|47|48|49|50|51|",
    "helmets": "|203|56|55|52|54|57|53|",
    "shields": "|5|6|7|8|9|10|"
};
var simRecombDistrib = {
    0: {0: 10000},
    1: {0: 3334, 1: 6666},
    2: {1: 6666, 2: 3334},
    3: {1: 3000, 2: 5000, 3: 2000},
    4: {1: 1000, 2: 5500, 3: 3500},
    5: {2: 5000, 3: 5000},
    6: {2: 3000, 3: 7000},
    7: {2: 3000, 3: 5000, 4: 2000},
    8: {2: 1000, 3: 5500, 4: 3500}
};

function poec_simGetRecombNAffixes(num) {
    var rolled = poec_rand(0, 10000, true);
    var cweight = 0;
    var picked = null;
    $.each(simRecombDistrib[num], function (dnum, distrib) {
        var endw = cweight + distrib;
        if (rolled >= cweight && rolled <= endw) {
            picked = dnum;
        }
        cweight += distrib;
    });
    return picked;
}

function poec_simRecombinate(recomb) {
    var pass = false;
    var recomb_success = false;
    if (crsim_bypass) {
        if (recomb) {
            pass = true;
            recomb_success = true;
            recomb_data = {
                "settings": {
                    "bgroup": recomb["settings"]["bgroup"],
                    "base": recomb["settings"]["base"],
                    "bitem": recomb["settings"]["bitem"],
                    "quality": recomb["settings"]["quality"],
                    "corrupted": recomb["settings"]["corrupted"],
                    "influences": recomb["settings"]["influences"],
                    "ilvl": recomb["settings"]["ilvl"]
                },
                "data": {
                    "iaffixes": recomb["crsets"]["affixes"],
                    "implicits": recomb["crsets"]["implicits"],
                    "eldritch": recomb["crsets"]["eldritch"]
                },
                "catalyst": null
            };
        }
        var usebase = crsim_bypass["base"];
        var usebgroup = crsim_bypass["bgroup"];
        var usebitem = crsim_bypass["bitem"];
        var useilvl = crsim_bypass["ilvl"];
        var usequality = crsim_bypass["quality"];
        var useinfluences = crsim_bypass["influences"];
        var usecorrupted = crsim_bypass["corrupted"];
        var useaffixes = crsim_bypass["iaffixes"];
        var useimplicits = crsim_bypass["implicits"];
        var useeldritch = crsim_bypass["eldritch"];
        var useiaffbt = crsim_bypass["iaffbt"];
        var usecatalyst = crsim_bypass["catalyst"];
    } else {
        if (!$("#poecSimWokeData").hasClass("init") && !$("#poecSimWokeData").hasClass("error")) {
            pass = true;
            poec_simRecombInfo = $("#poecSimWokeData").val();
            try {
                // Emu export data
                var recomb_data = jQuery.parseJSON(poec_simRecombInfo);
                recomb_success = true;
            } catch (err) {
                // Check for game alt+ctrl+c

            }
            var usebase = crsim_settings["base"];
            var usebgroup = crsim_settings["bgroup"];
            var usebitem = crsim_settings["bitem"];
            var useilvl = crsim_settings["ilvl"];
            var usequality = crsim_settings["quality"];
            var useinfluences = crsim_settings["influences"];
            var usecorrupted = crsim_settings["corrupted"];
            var useaffixes = crsim_data["iaffixes"];
            var useimplicits = crsim_data["implicits"];
            var useeldritch = crsim_data["eldritch"];
            var useiaffbt = crsim_data["iaffbt"];
            var usecatalyst = crsim_catalyst;
            //console.log(crsim_settings);
            //console.log(crsim_data);
        }
    }
    if (pass) {
        var error = false;
        if (recomb_success) {
            // Check if bases are compatible
            var bfound = false;
            $.each(simRecombBases, function (bkey, bstr) {
                if (bstr.indexOf("|" + usebase + "|") > -1 && bstr.indexOf("|" + recomb_data["settings"]["base"] + "|") > -1) {
                    bfound = true;
                }
            });
            if (!bfound) {
                if (parseInt(usebase) == parseInt(recomb_data["settings"]["base"])) {
                    bfound = true;
                }
            }
            if (bfound) {
                // Log
                if (!crsim_bypass) {
                    var craftDetail = {
                        "add": null,
                        "upg": null,
                        "rem": null,
                        "sts": null,
                        "det": null,
                        "nums": 1,
                        "ilvl": crsim_settings["ilvl"],
                        "quality": crsim_settings["quality"],
                        "bitem": crsim_settings["bitem"],
                        "base": crsim_settings["base"],
                        "bgroup": crsim_settings["bgroup"],
                        "destroyed": crsim_settings["destroyed"],
                        "corrupted": crsim_settings["corrupted"],
                        "rarity": crsim_settings["rarity"],
                        "imprint": null,
                        "catalyst": jQuery.parseJSON(JSON.stringify(crsim_catalyst)),
                        "influences": jQuery.parseJSON(JSON.stringify(crsim_settings["influences"])),
                        "affixes": jQuery.parseJSON(JSON.stringify(crsim_data["iaffixes"])),
                        "eldritch": jQuery.parseJSON(JSON.stringify(crsim_data["eldritch"])),
                        "implicits": jQuery.parseJSON(JSON.stringify(crsim_data["implicits"])),
                        "psn": {"prefix": crsim_data["iaffbt"]["prefix"], "suffix": crsim_data["iaffbt"]["suffix"]}
                    };
                    poec_updateCraftLog(craftDetail, null, null);
                }
                // Roll 50/50 for which base is picked
                var rolled = poec_rand(0, 2, true);
                var basechanged = false;
                if (rolled == 1) {
                    // Use imported base
                    if (!crsim_bypass) {
                        if (recomb_data["settings"]["bitem"] != usebitem) {
                            // Bitem changed
                            poec_simUpdateBitemCopy(recomb_data["settings"]["bitem"], recomb_data["settings"]["base"], recomb_data["settings"]["bgroup"]);
                            if (recomb_data["settings"]["base"] != usebase) {
                                // Base changed
                                basechanged = true;
                            }
                        }
                    }
                    useinfluences = recomb_data["settings"]["influences"];
                    usebase = recomb_data["settings"]["base"];
                    usebgroup = recomb_data["settings"]["bgroup"];
                    usebitem = recomb_data["settings"]["bitem"];
                    usequality = recomb_data["settings"]["quality"];
                    usecorrupted = recomb_data["settings"]["corrupted"];
                    useimplicits = recomb_data["data"]["implicits"];
                    useeldritch = recomb_data["data"]["eldritch"];
                    usecatalyst = recomb_data["catalyst"];
                }
                // Ilvl is avg of both
                useilvl = Math.floor((parseInt(recomb_data["settings"]["ilvl"]) + parseInt(useilvl)) / 2);
                // Put all modifiers into a pool
                var rpool = {"prefix": [], "suffix": []};
                for (var i = 0; i < recomb_data["data"]["iaffixes"].length; i++) {
                    // Imported item
                    var go = true;
                    if (poec_constants["constraints"]["influence_mgroups"].indexOf("|" + recomb_data["data"]["iaffixes"][i]["mgrp"] + "|") > -1) {
                        // Check if influence is still on the item
                        var finf = false;
                        if (useinfluences) {
                            for (var j = 0; j < useinfluences.length; j++) {
                                if (useinfluences[j] == recomb_data["data"]["iaffixes"][i]["mgrp"]) {
                                    finf = true;
                                }
                            }
                        }
                        if (!finf) {
                            go = false;
                        }
                    }
                    if (go) {
                        rpool[recomb_data["data"]["iaffixes"][i]["atype"]].push(jQuery.parseJSON(JSON.stringify(recomb_data["data"]["iaffixes"][i])));
                    }
                }
                for (var i = 0; i < useaffixes.length; i++) {
                    // Original item
                    var go = true;
                    if (poec_constants["constraints"]["influence_mgroups"].indexOf("|" + useaffixes[i]["mgrp"] + "|") > -1) {
                        // Check if influence is still on the item
                        var finf = false;
                        if (useinfluences) {
                            for (var j = 0; j < useinfluences.length; j++) {
                                if (useinfluences[j] == useaffixes[i]["mgrp"]) {
                                    finf = true;
                                }
                            }
                        }
                        if (!finf) {
                            go = false;
                        }
                    }
                    if (go) {
                        rpool[useaffixes[i]["atype"]].push(jQuery.parseJSON(JSON.stringify(useaffixes[i])));
                    }
                }
                // Set maximum number of affixes in relation to base
                var maxafftmp = parseInt(poecd["bgroups"]["seq"][poecd["bgroups"]["ind"][usebgroup]]["max_affix"]) / 2;
                var usemaxaff = {"prefix": maxafftmp, "suffix": maxafftmp};
                switch (parseInt(usebitem)) {
                    case 8209 :
                        usemaxaff = {"prefix": 2, "suffix": 4};
                        break; // Cogwork
                    case 8224 :
                        usemaxaff = {"prefix": 4, "suffix": 2};
                        break; // Geodesic
                    case 8246 :
                        usemaxaff = {"prefix": 2, "suffix": 2};
                        break; // Simplex
                }
                // Roll number of affixes generated
                var npref = poec_simGetRecombNAffixes(rpool["prefix"].length);
                var nsuff = poec_simGetRecombNAffixes(rpool["suffix"].length);
                //console.log(npref+" prefixes ("+rpool["prefix"].length+")"+nsuff+" suffixes ("+rpool["suffix"].length+")");
                var nump = 0;
                var nums = 0;
                var curaffixes = [];
                var curmodgroups = "|";
                // Prefixes
                while (rpool["prefix"].length > 0 && nump < usemaxaff["prefix"] && nump < npref) {
                    // Roll for an affix
                    var rolled = poec_rand(0, rpool["prefix"].length, true);
                    // Check if affix is eligible to be added
                    var mconflict = false;
                    for (var zy = 0; zy < rpool["prefix"][rolled]["modgroups"].length; zy++) {
                        if (curmodgroups.indexOf("|" + rpool["prefix"][rolled]["modgroups"][zy] + "|") > -1) {
                            mconflict = true;
                            break;
                        }
                    }
                    if (mconflict) {
                    } else {
                        curaffixes.push(jQuery.parseJSON(JSON.stringify(rpool["prefix"][rolled])));
                        if (curaffixes[curaffixes.length - 1]["nvalues"]) {
                            curaffixes[curaffixes.length - 1]["rolls"] = poec_simRollValues(curaffixes[curaffixes.length - 1]["nvalues"]);
                        }
                        for (var zy = 0; zy < rpool["prefix"][rolled]["modgroups"].length; zy++) {
                            curmodgroups += rpool["prefix"][rolled]["modgroups"][zy] + "|";
                        }
                        nump++;
                    }
                    // Remove affix from array
                    rpool["prefix"].splice(rolled, 1);
                }
                // Suffixes
                while (rpool["suffix"].length > 0 && nums < usemaxaff["suffix"] && nums < nsuff) {
                    // Roll for an affix
                    var rolled = poec_rand(0, rpool["suffix"].length, true);
                    // Check if affix is eligible to be added
                    var mconflict = false;
                    for (var zy = 0; zy < rpool["suffix"][rolled]["modgroups"].length; zy++) {
                        if (curmodgroups.indexOf("|" + rpool["suffix"][rolled]["modgroups"][zy] + "|") > -1) {
                            mconflict = true;
                            break;
                        }
                    }
                    if (mconflict) {
                    } else {
                        curaffixes.push(jQuery.parseJSON(JSON.stringify(rpool["suffix"][rolled])));
                        if (curaffixes[curaffixes.length - 1]["nvalues"]) {
                            curaffixes[curaffixes.length - 1]["rolls"] = poec_simRollValues(curaffixes[curaffixes.length - 1]["nvalues"]);
                        }
                        for (var zy = 0; zy < rpool["suffix"][rolled]["modgroups"].length; zy++) {
                            curmodgroups += rpool["suffix"][rolled]["modgroups"][zy] + "|";
                        }
                        nums++;
                    }
                    // Remove affix from array
                    rpool["suffix"].splice(rolled, 1);
                }
                // Set rarity
                var rarity = "normal";
                if (nump > 0 || nums > 0) {
                    rarity = "magic";
                    if (nump > 1 || nums > 1) {
                        rarity = "rare";
                    }
                }
                // Roll for added affix
                var exalt = false;
                var fside = null;
                if (curaffixes.length < usemaxaff["prefix"] + usemaxaff["suffix"]) {
                    var rolled = poec_rand(0, 10000, true);
                    if (rolled <= 2500) {
                        // Added affix
                        // Check if we are forced to add on a specific side
                        if (rarity == "magic") {
                            if (nump == 0) {
                                fside = "prefix";
                            } else {
                                if (nums == 0) {
                                    fside = "suffix";
                                }
                            }
                        } else {
                            if (nump == usemaxaff["prefix"]) {
                                fside = "suffix";
                            } else {
                                if (nump == usemaxaff["suffix"]) {
                                    fside = "prefix";
                                }
                            }
                        }
                        var rolled = poec_rand(0, 10000, true);
                        var special = false;
                        var smods = [];
                        if (rolled <= 1000) {
                            // Special affix
                            // Check if there is an eligible special affix
                            for (var i = 0; i < poecd['basemods'][usebase].length; i++) {
                                var mod = poecd['modifiers']['seq'][poecd['modifiers']['ind'][poecd['basemods'][usebase][i]]];
                                if (mod["id_mgroup"] == 15) {
                                    if (!fside || mod["affix"] == fside) {
                                        var mconflict = false;
                                        for (var zy = 0; zy < mod["modgroups"].length; zy++) {
                                            if (curmodgroups.indexOf("|" + mod["modgroups"][zy] + "|") > -1) {
                                                mconflict = true;
                                            }
                                        }
                                        if (mconflict) {
                                        } else {
                                            smods.push(mod);
                                        }
                                    }
                                }
                            }
                            if (smods.length > 0) {
                                special = true;
                            }
                        }
                        if (special) {
                            // Roll a special mod
                            var rolled = poec_rand(0, smods.length, true);
                            var naffix = {
                                atype: smods[rolled]["affix"],
                                bench: 0,
                                frac: 0,
                                id: smods[rolled]["id_modifier"],
                                maven: 0,
                                mgrp: "15",
                                modgroups: smods[rolled]["modgroups"],
                                nvalues: poecd["tiers"][smods[rolled]["id_modifier"]][usebase][0]["nvalues"],
                                rolls: null,
                                tindex: 0,
                                weight: 0
                            };
                            if (naffix["nvalues"]) {
                                naffix["rolls"] = poec_simRollValues(naffix["nvalues"]);
                            }
                            curaffixes.push(naffix);
                            if (rarity == "normal") {
                                rarity = "magic";
                            } else {
                                if (rarity == "magic" && curaffixes.length > 2) {
                                    rarity = "rare";
                                }
                            }
                        } else {
                            // Roll a regular exalt
                            exalt = true;
                        }
                    }
                }
                useiaffbt = {"prefix": nump, "suffix": nums};
                poec_simSetRarity(rarity);
                // Set everything back
                if (crsim_bypass) {
                    crsim_bypass["base"] = usebase;
                    crsim_bypass["bgroup"] = usebgroup;
                    crsim_bypass["bitem"] = usebitem;
                    crsim_bypass["ilvl"] = useilvl;
                    crsim_bypass["quality"] = usequality;
                    crsim_bypass["influences"] = useinfluences;
                    crsim_bypass["corrupted"] = usecorrupted;
                    crsim_bypass["iaffixes"] = jQuery.parseJSON(JSON.stringify(curaffixes));
                    crsim_bypass["implicits"] = useimplicits;
                    crsim_bypass["eldritch"] = useeldritch;
                    crsim_bypass["iaffbt"] = useiaffbt;
                    crsim_bypass["catalyst"] = usecatalyst;
                } else {
                    crsim_settings["base"] = usebase;
                    crsim_settings["bgroup"] = usebgroup;
                    crsim_settings["bitem"] = usebitem;
                    crsim_settings["ilvl"] = useilvl;
                    crsim_settings["quality"] = usequality;
                    crsim_settings["influences"] = useinfluences;
                    crsim_settings["corrupted"] = usecorrupted;
                    crsim_data["iaffixes"] = jQuery.parseJSON(JSON.stringify(curaffixes));
                    crsim_data["implicits"] = useimplicits;
                    crsim_data["eldritch"] = useeldritch;
                    crsim_data["iaffbt"] = useiaffbt;
                    crsim_data["maxaffgrp"] = usemaxaff;
                    crsim_catalyst = usecatalyst;
                }
                if (basechanged && !crsim_bypass) {
                    poec_simBuildFullModpool(crsim_settings["base"]);
                    poec_simSetIniDisabled(false);
                    poec_simSetItemModpool();
                }
                // Set metamods
                poec_simUpdateMeta();
                if (exalt) {
                    if (rarity == "normal") {
                        poec_simSetRarity("magic");
                    } else {
                        if (rarity == "magic" && curaffixes.length == 2) {
                            // Set rarity to rare before slam
                            poec_simSetRarity("rare");
                        }
                    }
                    // Exalt
                    poec_simRollAffix(null, null, fside, null, 1, true, true, false, false, false, false, null, false);
                }
                if (!crsim_bypass) {
                    poec_simApplyCraftGO(null, null, true);
                    poec_simWokerClose();
                } else {
                    return true;
                }
            } else {
                error = applyLang("Incompatible bases");
            }
        } else {
            error = applyLang("Invalid dataset");
        }
        if (error) {
            if (crsim_bypass) {
                poec_simThrowError(applyLang(error));
            } else {
                $("#poecSimWokeData").val(error).addClass("error");
            }
            return false;
        }
    } else {
        return false;
    }
}

function poec_simAwaken(woking) {
    var pass = false;
    var woke_success = false;
    if (crsim_bypass) {
        if (woking) {
            pass = true;
            woke_success = true;
            woke_data = {
                "settings": {
                    "bgroup": woking["settings"]["bgroup"],
                    "influences": woking["settings"]["influences"]
                },
                "data": {
                    "iaffixes": woking["crsets"]["affixes"]
                }
            };
        }
        var usebgroup = crsim_bypass["bgroup"];
        var useinfluences = crsim_bypass["influences"];
        var useaffixes = crsim_bypass["iaffixes"];
    } else {
        if (!$("#poecSimWokeData").hasClass("init") && !$("#poecSimWokeData").hasClass("error")) {
            pass = true;
            poec_simWokeInfo = $("#poecSimWokeData").val();
            try {
                var woke_data = jQuery.parseJSON(poec_simWokeInfo);
                woke_success = true;
            } catch (err) {

            }
        }
        var usebgroup = crsim_settings["bgroup"];
        var useinfluences = crsim_settings["influences"];
        var useaffixes = crsim_data["iaffixes"];
    }

    if (pass) {
        poec_simWokePick = null;
        var error = false;
        if (woke_success) {
            if (woke_data["settings"]["bgroup"] == usebgroup) {
                if (woke_data["settings"]["influences"] == null) {
                    error = applyLang("Item has no influences");
                } else {
                    if (woke_data["settings"]["influences"].length == 1) {
                        if (woke_data["settings"]["influences"][0] != useinfluences[0]) {
                            if (woke_data["data"]["iaffixes"]) {
                                var dinfmods = [];
                                for (var i = 0; i < woke_data["data"]["iaffixes"].length; i++) {
                                    if (crsim_infgrps.indexOf("|" + woke_data["data"]["iaffixes"][i]["mgrp"] + "|") > -1) {
                                        dinfmods.push(woke_data["data"]["iaffixes"][i]);
                                    }
                                }
                                if (dinfmods.length > 0) {
                                    var nvcombs = [];
                                    for (var j = 0; j < useaffixes.length; j++) {
                                        for (var k = 0; k < dinfmods.length; k++) {
                                            if (crsim_infgrps.indexOf("|" + useaffixes[j]["mgrp"] + "|") > -1) {
                                                if (useaffixes[j]["mgrp"] != dinfmods[k]["mgrp"] && useaffixes[j]["id"] != dinfmods[k]["id"]) {
                                                    nvcombs.push({
                                                        "m1": j,
                                                        "m2": k
                                                    });
                                                }
                                            }
                                        }
                                    }
                                    if (nvcombs.length > 0) {
                                        // Pick one at random
                                        var rndpick = poec_rand(0, nvcombs.length, true);
                                        poec_simWokePick = {
                                            "m1": jQuery.parseJSON(JSON.stringify(useaffixes[nvcombs[rndpick]["m1"]])),
                                            "m2": jQuery.parseJSON(JSON.stringify(dinfmods[nvcombs[rndpick]["m2"]]))
                                        };
                                        if (!crsim_bypass) {
                                            poec_simApplyCraftGO(null, null, false);
                                            poec_simWokerClose();
                                        } else {
                                            return true;
                                        }
                                    } else {
                                        error = applyLang("No possible combination of modifiers to spawn");
                                    }
                                } else {
                                    error = applyLang("No influence modifiers on item");
                                }
                            } else {
                                error = applyLang("No affixes on item");
                            }
                        } else {
                            error = applyLang("Items have the same influence");
                        }
                    } else {
                        error = applyLang("Source influences invalid");
                    }
                }
            } else {
                error = applyLang("Items incompatible");
            }
        } else {
            error = applyLang("Invalid dataset");
        }
        if (error) {
            if (crsim_bypass) {
                poec_simThrowError(applyLang(error));
            } else {
                $("#poecSimWokeData").val(error).addClass("error");
            }
            return false;
        }
    } else {
        return false;
    }
}

function poec_simSelectAction(vThis) {
    if (!$(vThis).hasClass("disabled")) {
        if ($(vThis).hasClass("not_ready")) {
            $(vThis).mcuiNotice({text: applyLang("Upcoming feature"), type: "alert"}).showNotice();
        } else {
            var acode = $(vThis).attr("acode");
            $("#crsimOptions").find(".actions").children("div").removeClass("sel");
            $(vThis).addClass("sel");
            $("#crsimOptions").find(".subset").children("div").hide();
            if (crsim_actions["actions"][acode]["subset"] != undefined) {
                $("#crsimOptions").find(".subset").children(".acs_" + acode).show();
            }
            poec_simSetParams("action");
            switch (acode) {
                case 'recombinate' :
                    poec_simShowItemImporter("recomb");
                    break;
            }
        }
    }
}

function poec_simSelectSubAction(vThis) {
    if (!$(vThis).hasClass("disabled")) {
        // Check if is multiple select
        var maxsel = 1;
        if (crsim_actions["actions"][crsim_params["action"]]["subsel"] != undefined) {
            maxsel = crsim_actions["actions"][crsim_params["action"]]["subsel"];
        }

        var scode = $(vThis).attr("scode");
        if (maxsel == 1) {
            $(vThis).parent().children("div").removeClass("sel");
            $(vThis).addClass("sel");
        } else {
            var nsel = $(vThis).parent().children(".sel").length;
            if ($(vThis).hasClass("sel")) {
                $(vThis).removeClass("sel");
            } else {
                if (nsel < maxsel) {
                    $(vThis).addClass("sel");
                }
            }
        }

        switch (crsim_params["action"]) {
            case 'essence' :
                $(".esstchooser").removeClass("sel");
                $("#crsimESSTChooser_" + scode).addClass("sel");
                break;
            case 'vendor' :
                $(".vdsschooser").removeClass("sel");
                $("#vendorSS" + scode).addClass("sel");
                break;
        }

        if (crsim_actions["actions"][crsim_params["action"]]["subset"][scode]["toggled"] != undefined) {
            $(vThis).parent().children(".ssubset").hide();
            $("#" + crsim_actions["actions"][crsim_params["action"]]["subset"][scode]["toggled"]).show();

            if (crsim_actions["actions"][crsim_params["action"]]["subset"][scode]["toggled"] == "harvestTypeChooser") { // Harvest specific bypass
                if (scode == "hdivine") {
                    $("#harvestTypeChooser").find(".acss_inf").addClass("disabled");
                    if ($("#harvestTypeChooser").find(".acss_inf").hasClass("sel")) {
                        // Kick selection if selected
                        $("#harvestTypeChooser").find(".acss_inf").removeClass("sel");
                        $("#harvestTypeChooser").children("div:eq(1)").addClass("sel");
                    }
                } else {
                    $("#harvestTypeChooser").find(".acss_inf").removeClass("disabled");
                }
                if (scode == "haugment") {
                    $("#harvestTypeChooser").find(".acss_inf").addClass("disabled");
                    if ($("#harvestTypeChooser").find(".acss_inf").hasClass("sel")) {
                        // Kick selection if selected
                        $("#harvestTypeChooser").find(".acss_inf").removeClass("sel");
                        $("#harvestTypeChooser").children("div:eq(1)").addClass("sel");
                    }
                } else {
                    $("#harvestTypeChooser").find(".acss_inf").removeClass("disabled");
                }
            }
        }

        poec_simSetParams("action");
    }
}

function poec_simSelectSSAction(vThis) {
    if (!$(vThis).hasClass("disabled")) {
        var sscode = $(vThis).attr("sscode");
        $(vThis).parent().children("div").removeClass("sel");
        $(vThis).addClass("sel");
        poec_simSetParams("action");
    }
}

function poec_simSetParams(mode) {
    crsim_params["mode"] = mode;
    if (mode == "currency") {
        crsim_params["currency"] = $("#crsimOptions").find("div.currency").find(".sel").attr("acode");
        if (crsim_params["action"]) {
            $("#crsimOptions").find("div.actions").children(".ac_" + crsim_params["action"]).removeClass("sel");
            if (crsim_actions["actions"][crsim_params["action"]]["subset"] != undefined) {
                $("#crsimOptions").find("div.subset").children(".acs_" + crsim_params["action"]).hide();
            }
        }
        crsim_params["action"] = null;
        crsim_params["subaction"] = null;
        crsim_params["ssaction"] = null;
    } else {
        crsim_params["action"] = $("#crsimOptions").find("div.actions").find(".sel").attr("acode");
        if (crsim_params["currency"]) {
            $("#crsimOptions").find("div.currency").children(".ac_" + crsim_params["currency"]).removeClass("sel");
        }
        crsim_params["ssaction"] = null;
        if (crsim_actions["actions"][crsim_params["action"]]["subset"] != undefined) {
            crsim_params["subaction"] = $("#crsimOptions").find("div.subset").children(".acs_" + crsim_params["action"]).children(".sel").attr("scode");
            if (crsim_actions["actions"][crsim_params["action"]]["subsel"] != undefined) {
                if (crsim_actions["actions"][crsim_params["action"]]["subsel"] > 1) {
                    crsim_params["subaction"] = [];
                    $("#crsimOptions").find("div.subset").children(".acs_" + crsim_params["action"]).children(".sel").each(function () {
                        crsim_params["subaction"].push($(this).attr("scode"));
                    });
                }
            }
            if ($("#crsimOptions").find("div.subset").children(".acs_" + crsim_params["action"]).children(".ssubset:visible").length > 0) {
                crsim_params["ssaction"] = $("#crsimOptions").find("div.subset").children(".acs_" + crsim_params["action"]).children(".ssubset:visible").find(".sel").attr("sscode");
            }
            if (crsim_params["action"] == "essence") { // Essence tiers bypass
                $(".esstchooser").removeClass("sel");
                $("#crsimESSTChooser_" + crsim_params["subaction"]).addClass("sel");
                crsim_params["ssaction"] = $("#crsimESSTChooser_" + crsim_params["subaction"]).find(".sel").attr("sscode");
                crsim_curessmod = $("#crsimESSTChooser_" + crsim_params["subaction"]).find(".sel").attr("essmod");
            } else {
                if (crsim_params["action"] == "fossil") {
                    var has_tangled = false;
                    for (var z = 0; z < crsim_params["subaction"].length; z++) {
                        if (crsim_params["subaction"][z] == "tangled") {
                            has_tangled = true;
                        }
                    }
                    if (has_tangled) {
                        if ($("#fossilTangledMoreChooser").find(".sel").length == 0) {
                            $("#fossilTangledMoreChooser").find(".tags:eq(0)").addClass("sel");
                            $("#fossilTangledNoChooser").find(".tags:eq(1)").addClass("sel");
                        }
                        $("#fossilTangledMoreChooser").find(".tags").removeClass("disabled");
                        $("#fossilTangledNoChooser").find(".tags").removeClass("disabled");
                        $("#fossilTangledMoreChooser").show();
                        $("#fossilTangledNoChooser").show();
                        crsim_params["ssaction"] = {
                            "pos": $("#fossilTangledMoreChooser").find(".sel").attr("sscode"),
                            "neg": $("#fossilTangledNoChooser").find(".sel").attr("sscode")
                        };
                        $("#fossilTangledMoreChooser").find(".tags.acss_" + crsim_params["ssaction"]["neg"]).addClass("disabled");
                        $("#fossilTangledNoChooser").find(".tags.acss_" + crsim_params["ssaction"]["pos"]).addClass("disabled");
                    } else {
                        $("#fossilTangledMoreChooser").hide();
                        $("#fossilTangledNoChooser").hide();
                        crsim_params["ssaction"] = null;
                    }
                    console.log(crsim_params["ssaction"]);
                }
            }
        } else {
            crsim_params["subaction"] = null;
        }
        crsim_params["currency"] = null;
    }
}

function poec_simUseImportFunction() {
    var iret = poec_parseImportData();

    crsim_settings = iret["settings"];

    poec_simShowMainInt(iret["crsets"], false);
}

function poec_simUseCurrentSettings() {
    // Take interface settings automatically : minimum required : base group and base, optional : item, ilvl, influences, fractured affix, catalysts
    var bitem = poec_nBase["i"];
    if (bitem == 0) {
        bitem = null;
    }
    var infs = null;
    if (poec_cInfluences) {
        if (poec_cInfluences.length > 1) {
            var infs = poec_cInfluences.substring(1, poec_cInfluences.length - 1).split("|");
        }
    }
    var ilvl = poec_cILvl;
    if (ilvl == null) {
        ilvl = 100;
    }

    crsim_settings = {
        "bgroup": parseInt(poec_nBase["g"]),
        "base": poec_cBase,
        "bitem": poec_nBase["i"],
        "ilvl": ilvl,
        "rarity": "normal", // TODO : set in relation to configured affixes, also, set configured affixes
        "influences": infs,
        "eldritch": null,
        "quality": 20,
        "corrupted": 0,
        "destroyed": 0
    };

    if (poec_cCatalyst) {
        crsim_catalyst = {"id": poec_cCatalyst, "val": parseInt(poec_cCatValue)};
    }

    if (poec_cFossils) {
        $("#crsimActSub_fossil").find(".abtn").removeClass("sel");
        var sfossils = poec_cFossils.substring(1, poec_cFossils.length - 1).split("|");
        for (var i = 0; i < sfossils.length; i++) {
            $("#crsimActSub_fossil").find(".abtn.acs_fossil" + sfossils[i]).addClass("sel");
        }
    }

    var frac = 0;
    if (poec_isFractured == 1 && poec_isSlam == 0) {
        frac = 1;
    }

    // Get current config affixes
    var crsim_crsets = {
        "affixes": [],
        "implicits": [],
        "meta_flags": {},
        "eldritch": null,
        "iaffbt": {"prefix": 0, "suffix": 0}
    };
    if (poec_cImps) {
        $.each(poec_cImps, function (modid, tilvl) {
            var atype = poecd["modifiers"]["seq"][poecd["modifiers"]["ind"][modid]]["affix"];
            if (tilvl != null) {
                if (!crsim_crsets["eldritch"]) {
                    crsim_crsets["eldritch"] = {};
                }
                crsim_crsets["eldritch"][atype] = tilvl;
                var tierlen = poecd['tiers'][modid][crsim_settings["base"]].length;
                var trueind = tierlen - tilvl;
                var naffix = {
                    "atype": atype,
                    "id": modid,
                    "mgrp": poecd["modifiers"]["seq"][poecd["modifiers"]["ind"][modid]]["id_mgroup"],
                    "modgroups": poecd["modifiers"]["seq"][poecd["modifiers"]["ind"][modid]]["modgroups"],
                    "weight": poecd['tiers'][modid][crsim_settings["base"]][trueind]["weighting"],
                    "nvalues": poecd['tiers'][modid][crsim_settings["base"]][trueind]["nvalues"],
                    "tindex": trueind
                };
                naffix["rolls"] = poec_simRollValues(naffix["nvalues"]);
                crsim_crsets["implicits"].push(naffix);
            }
        });
    }
    if (poec_cBuild) {
        $.each(poec_cBuild, function (modid, tilvl) {
            if (tilvl > -1) {
                // TODO Parse crafted affixes for meta flags
                var atype = poecd["modifiers"]["seq"][poecd["modifiers"]["ind"][modid]]["affix"];
                var ftier = null;
                for (var j = 0; j < poecd['tiers'][modid][crsim_settings["base"]].length; j++) {
                    var htilvl = parseInt(poecd['tiers'][modid][crsim_settings["base"]][j]["ilvl"]);
                    if (htilvl == tilvl) {
                        ftier = j;
                        break;
                    }
                }
                if (ftier != null) {
                    var naffix = {
                        "atype": atype,
                        "id": modid,
                        "mgrp": poecd["modifiers"]["seq"][poecd["modifiers"]["ind"][modid]]["id_mgroup"],
                        "modgroups": poecd["modifiers"]["seq"][poecd["modifiers"]["ind"][modid]]["modgroups"],
                        "weight": poecd['tiers'][modid][crsim_settings["base"]][ftier]["weighting"],
                        "nvalues": poecd['tiers'][modid][crsim_settings["base"]][ftier]["nvalues"],
                        "tindex": ftier,
                        "frac": frac,
                        "maven": 0
                    };
                    if (naffix["mgrp"] == 11) {
                        naffix["bench"] = 1;
                    } else {
                        naffix["bench"] = 0;
                    }
                    naffix["rolls"] = poec_simRollValues(naffix["nvalues"]);
                    crsim_crsets["affixes"].push(naffix);
                    crsim_crsets["iaffbt"][atype]++;
                    if (poecd["modifiers"]["seq"][poecd["modifiers"]["ind"][modid]]["meta"]) {
                        crsim_crsets["meta_flags"][poecd["modifiers"]["seq"][poecd["modifiers"]["ind"][modid]]["meta"]] = true;
                    }
                } else {
                    console.log("Could not find tier '" + tilvl + " for mod '" + modid + "'");
                }
            }
        });
        if (crsim_crsets["iaffbt"]["prefix"] > 1 || crsim_crsets["iaffbt"]["suffix"] > 1) {
            crsim_settings["rarity"] = "rare";
        } else {
            if (crsim_crsets["affixes"].length > 0) {
                crsim_settings["rarity"] = "magic";
            }
        }
    }

    if (bitem) {
        poec_simShowMainInt(crsim_crsets, false);
    } else {
        if ($("#simStepItemChoice").find(".item.base" + crsim_settings["base"]).length > 0) {
            poec_simGoToStep(4);
        } else {
            poec_simGoToStep(5);
        }
    }
}

function poec_simUseSimulatorItem(idata) {
    crsim_settings = {
        "base": idata["base"],
        "bgroup": poecd["bases"]["seq"][poecd["bases"]["ind"][idata["base"]]]["id_bgroup"],
        "bitem": idata["bitem"],
        "corrupted": 0,
        "destroyed": 0,
        "eldritch": idata["eldritch"],
        "exmods": null,
        "ilvl": idata["ilvl"],
        "influences": idata["influences"],
        "quality": idata["quality"],
        "rarity": idata["rarity"]
    };
    crsim_log = [];
    crsim_catalyst = idata["catalyst"];
    var iaffbt = {"prefix": 0, "suffix": 0};
    for (var i = 0; i < idata["affixes"].length; i++) {
        iaffbt[idata["affixes"][i]["atype"]]++;
    }
    var crsim_crsets = {
        "implicits": idata["implicits"],
        "affixes": idata["affixes"],
        "eldritch": idata["eldritch"],
        "meta_flags": {},
        "iaffbt": iaffbt,
        "imprint": null
    };
    poec_simShowMainInt(crsim_crsets, true);
    poec_simResetSpending();
    poec_simUpdateSpending(null, null, null, null);
    poec_buildFullHistory();
    poec_simSetParams("currency");
}

function poec_simUseImportSettings(impdata) {
    $("#simImportArea").val("");
    crsim_settings = impdata["settings"];
    crsim_params = impdata["params"];
    crsim_log = impdata["log"];
    crsim_opened = impdata["opened"];
    crsim_catalyst = impdata["catalyst"];
    var crsim_crsets = {
        "implicits": impdata["data"]["implicits"],
        "affixes": impdata["data"]["iaffixes"],
        "eldritch": impdata["data"]["eldritch"],
        "meta_flags": impdata["data"]["meta_flags"],
        "iaffbt": impdata["data"]["iaffbt"],
        "imprint": impdata["data"]["imprint"]
    };
    poec_simShowMainInt(crsim_crsets, true);
    crsim_spending = impdata["spending"];
    poec_simUpdateSpending(null, null, null, null);
    poec_buildFullHistory();
}

function poec_simShowMainInt(crsim_crsets, imported) {
    $("#simSourceInt").hide();
    poec_simBuildIntBase(crsim_crsets, imported);
    $("#simMainInterface").show();
    $("#simRestoreBtn").hide();
    $("#simRestartBtn").show();
    $("#simBackStepBtn").addClass("hidden");
}

function poec_simPickBaseGroup(vGroup) {
    crsim_settings = {
        "bgroup": vGroup,
        "base": null,
        "bitem": null,
        "ilvl": null,
        "rarity": "normal",
        "influences": null
    };
    poec_simGoToStep(3);
}

function poec_simPickBase(vBase) {
    crsim_settings["base"] = vBase;
    // Check for child choice
    if ($("#simStepBaseChoice").find(".mbase" + vBase).length > 0) {
        $("#simStepBaseChoice").find(".master").hide();
        $("#simStepBaseChoice").find(".child").hide();
        $("#simStepBaseChoice").find(".child.mbase" + vBase).show();
    } else {
        poec_simGoToStep(4);
    }
}

function poec_simPickBChild(vChild) {
    crsim_settings["base"] = vChild;
    poec_simGoToStep(4);
}

function poec_simPickItem(vItem) {
    crsim_settings["bitem"] = vItem;
    poec_simGoToStep(5);
}

function poec_backOneStep() {
    var cstep = parseInt($("#simSourceInt").find(".step:visible").attr("step"));
    if (cstep == 6) {
        cstep = 1;
    } else {
        if (cstep == 5) {
            // Check if we go back to 4 or 3
            if ($("#simStepItemChoice").find(".item.base" + crsim_settings["base"]).length > 1) {
                cstep = 4;
            } else {
                cstep = 3;
            }
        } else {
            cstep--;
        }
    }
    if (cstep < 1) {
        cstep = 1;
    }
    if (cstep < 5 && crsim_settings) {
        crsim_settings["influences"] = null;
        crsim_settings["ilvl"] = null;
        crsim_settings["bitem"] = null;
        if (cstep < 4) {
            crsim_settings["base"] = null;
            if (cstep < 3) {
                crsim_settings["bgroup"] = null;
            }
        }
    }
    poec_simGoToStep(cstep);
}

function poec_simSelectInf(vThis) {
    if (!$("#simOptionsInfluences").hasClass("disabled")) {
        var ival = parseInt($(vThis).attr("bid"));
        if ($(vThis).hasClass("sel")) {
            $(vThis).removeClass("sel");
            if (crsim_settings["influences"].length == 1) {
                crsim_settings["influences"] = null;
            } else {
                for (var i = 0; i < crsim_settings["influences"].length; i++) {
                    if (crsim_settings["influences"][i] != ival) {
                        crsim_settings["influences"] = [crsim_settings["influences"][i]];
                    }
                }
            }
        } else {
            if (crsim_settings["influences"] == null) {
                crsim_settings["influences"] = [ival];
                $(vThis).addClass("sel");
            } else {
                var ninf = crsim_settings["influences"].length;
                if (ninf == 1) {
                    crsim_settings["influences"].push(ival);
                    $(vThis).addClass("sel");
                }
            }
        }
    }
}

function poec_simSelectILvl(vThis) {
    var ival = parseInt($(vThis).attr("bid"));
    $("#simOptionsILvl").find(".ilvl").removeClass("sel");
    $(vThis).addClass("sel");
    crsim_settings["ilvl"] = ival;
    if (parseInt(crsim_settings["ilvl"]) < 68) {
        $("#simOptionsInfluences").find(".sel").removeClass("sel");
        $("#simOptionsInfluences").addClass("disabled");
        crsim_settings["influences"] = null;
    } else {
        $("#simOptionsInfluences").removeClass("disabled");
    }
}

function poec_simSelectQuality(vThis) {
    var ival = parseInt($(vThis).attr("bid"));
    $("#simOptionsQuality").find(".qual").removeClass("sel");
    $(vThis).addClass("sel");
    crsim_settings["quality"] = ival;
}

function poec_simFinishSetup() {
    poec_simShowMainInt(null, false);
}

function poec_simApplyDReason(reason, arrto) {
    for (var i = 0; i < arrto.length; i++) {
        crsim_dreasons[arrto[i]].push(reason);
    }
}

function poec_simApplyPReason(reason, arrto) {
    for (var i = 0; i < arrto.length; i++) {
        crsim_preasons[arrto[i]].push(reason);
    }
}

function poec_simUpdateDominance() {
    if (crsim_bypass) {
        var usedominance = crsim_bypass["dominance"];
        var useldritch = crsim_bypass["eldritch"];
    } else {
        var usedominance = crsim_data["dominance"];
        var useldritch = crsim_data["eldritch"];
    }
    usedominance = null;
    if (useldritch) {
        if (useldritch["eldritch_blue"] > 0 && useldritch["eldritch_red"] > 0) {
            if (useldritch["eldritch_blue"] != useldritch["eldritch_red"]) {
                if (useldritch["eldritch_blue"] > useldritch["eldritch_red"]) {
                    usedominance = "searing";
                } else {
                    usedominance = "tangled";
                }
            }
        } else {
            if (useldritch["eldritch_blue"] > 0) {
                usedominance = "tangled";
            } else {
                if (useldritch["eldritch_red"] > 0) {
                    usedominance = "searing";
                }
            }
        }
    }
    if (crsim_bypass) {
        crsim_bypass["dominance"] = usedominance;
    } else {
        crsim_data["dominance"] = usedominance;
    }
}

function poec_simBuildFullModpool(usebase) {
    var affixes = {"prefix": {}, "suffix": {}, "corrupted": {}, "eldritch_blue": {}, "eldritch_red": {}};
    crsim_data["mtypes"] = {};
    for (var i = 0; i < poecd['basemods'][usebase].length; i++) {
        var mod = jQuery.parseJSON(JSON.stringify(poecd['modifiers']['seq'][poecd['modifiers']['ind'][poecd['basemods'][usebase][i]]]));
        if (crsim_validmgroups.indexOf("|" + mod["id_mgroup"] + "|") > -1 && (mod["affix"] == "prefix" || mod["affix"] == "suffix" || mod["affix"] == "corrupted" || mod["affix"] == "eldritch_blue" || mod["affix"] == "eldritch_red")) {
            var skip_affix = false;
            if (crsim_settings["exmods"] != "" && mod["exkey"]) {
                if (crsim_settings["exmods"] == mod["exkey"]) {
                    skip_affix = true;
                }
            }
            if (mod["ubt"]) {
                if (mod["ubt"] != crsim_settings["bitem"]) {
                    skip_affix = true;
                }
            }
            if (!skip_affix) {
                mod["umtiers"] = poecd['tiers'][mod["id_modifier"]][usebase].length;
                // Get tiers
                var mtiers = [];
                for (var j = 0; j < poecd['tiers'][mod["id_modifier"]][usebase].length; j++) {
                    var htilvl = parseInt(poecd['tiers'][mod["id_modifier"]][usebase][j]["ilvl"]);
                    if (htilvl <= crsim_settings["ilvl"] || mod["id_mgroup"] == 11 || mod["id_mgroup"] == 13 || mod["id_mgroup"] == 10) {
                        // Get sanctified fossil modifier
                        var sancmod = 1 + (1 * ((htilvl - 40) / 100));
                        mtiers.push(jQuery.parseJSON(JSON.stringify(poecd['tiers'][mod["id_modifier"]][usebase][j])));
                        mtiers[mtiers.length - 1]["sancmod"] = sancmod;
                        // Build values output
                        mtiers[mtiers.length - 1]["valout"] = poec_simOutputTValues(poecd['tiers'][mod["id_modifier"]][usebase][j]["nvalues"]);
                    }
                }
                crsim_data["mtypes"][mod["id_modifier"]] = poec_simGetModMTypes(mod["mtypes"]);
                // STORE DATA
                if (mtiers.length > 0) {
                    if (mod["notable"] == 1) {
                        if (crsim_data["is_notable"] && crsim_data["unique_notable"]) {
                            mod["modgroups"].push("unique_notable");
                        }
                    }
                    for (var zy = 0; zy < mod["modgroups"].length; zy++) {
                        if (crsim_mgrpdata[mod["id_modifier"]] == undefined) {
                            crsim_mgrpdata[mod["id_modifier"]] = [];
                        }
                        crsim_mgrpdata[mod["id_modifier"]].push(mod["modgroups"][zy]);
                        if (crsim_affbymgrp[mod["modgroups"][zy]] == undefined) {
                            crsim_affbymgrp[mod["modgroups"][zy]] = [];
                        }
                        crsim_affbymgrp[mod["modgroups"][zy]].push(mod["id_modifier"]);
                    }
                    mod["tiers"] = mtiers;
                    if (affixes[mod["affix"]][mod["id_mgroup"]] == undefined) {
                        affixes[mod["affix"]][mod["id_mgroup"]] = [];
                    }
                    affixes[mod["affix"]][mod["id_mgroup"]].push(mod);
                }
            }
        }
    }
    crsim_data["fmodpool"] = affixes;
    //console.log(crsim_data["fmodpool"]);
}

function poec_simSetIniDisabled(imported) {
    crsim_params["disabled"] = "|";

    // Set catalyst toggler
    if (crsim_data["is_catalyst"] == 0) {
        crsim_params["disabled"] += "catalyst|";
        poec_simApplyPReason(applyLang("Only active on jewellery"), ["catalyst"]);
    }
    // Filter by base type : conq orbs, only magic items, etc
    if (crsim_data["is_influenced"] == 0) {
        crsim_params["disabled"] += "crusader|warlord|redeemer|hunter|woke|";
        poec_simApplyPReason(applyLang("Base cannot be influenced"), ["crusader", "warlord", "redeemer", "hunter", "woke"]);
    }
    if (crsim_settings["ilvl"] < 68) {
        crsim_params["disabled"] += "crusader|warlord|redeemer|hunter|woke|";
        poec_simApplyPReason(applyLang("Item level too low"), ["crusader", "warlord", "redeemer", "hunter", "woke"]);
    }
    if (crsim_data["is_rare"] == 0) {
        crsim_params["disabled"] += "regal|chaos|alchemy|exalted|";
        poec_simApplyPReason(applyLang("Base cannot be rare"), ["regal", "chaos", "alchemy", "exalted"]);
    }
    if (crsim_data["is_essence"] == 0) {
        crsim_params["disabled"] += "essence|fossil20|"; // TODO : block glyphic here
        poec_simApplyPReason(applyLang("Base cannot apply essences"), ["essence"]);
    } else {
        // Build essence descs, tiers
        var vTChooser = "";
        $("#crsimActSub_essence").children(".abtn").each(function () {
            var scode = $(this).attr("scode");
            var etiers = jQuery.parseJSON(poecd["essences"]["seq"][poecd["essences"]["ind"][scode]]["tiers"]);
            if (etiers[crsim_settings["base"]]) {
                crsim_actions["actions"]["essence"]["subset"][scode]["desc"] = poecl["mod"][etiers[crsim_settings["base"]]];
                // For each essence, build tier chooser
                if (poecd['tiers'][etiers[crsim_settings["base"]]]) {
                    if (poecd['tiers'][etiers[crsim_settings["base"]]][crsim_settings["base"]]) {
                        var ntiers = poecd['tiers'][etiers[crsim_settings["base"]]][crsim_settings["base"]].length;
                        vTChooser += "<div id='crsimESSTChooser_" + scode + "' class='esstchooser'>";
                        crsim_spending["actions"]["essence"][scode] = {};
                        for (var j = 0; j < poecd['tiers'][etiers[crsim_settings["base"]]][crsim_settings["base"]].length; j++) {
                            if (j == ntiers - 1) {
                                var addsel = "sel";
                            } else {
                                var addsel = "";
                            }
                            vTChooser += "<div class='abtn " + addsel + "' sscode='" + j + "' essmod='" + etiers[crsim_settings["base"]] + "' onClick='poec_simSelectSSAction(this)'>T" + (ntiers - j) + "</div>";
                            if (!imported) {
                                crsim_spending["actions"]["essence"][scode][j] = 0;
                            }
                        }
                        vTChooser += "</div>";
                    }
                }
            }
        });
        $("#essenceTiersArea").html(vTChooser);
        $(".esstchooser").removeClass("sel");
        $("#crsimESSTChooser_" + crsim_settings["subaction"]).addClass("sel");
    }
    if (crsim_data["is_craftable"] == 0) {
        crsim_params["disabled"] += "crafting_bench|";
        poec_simApplyPReason(applyLang("Base cannot be crafted"), ["crafting_bench"]);
    }
    if (crsim_data["is_fossil"] == 0) {
        crsim_params["disabled"] += "fossil|";
        poec_simApplyPReason(applyLang("Base cannot be fossil crafted"), ["fossil"]);
    }
    if (crsim_holgrps.indexOf("|" + crsim_settings["bgroup"] + "|") > -1) {
    } else {
        // Disable hollow
        crsim_params["disabled"] += "fossil18|";
        poec_simApplyPReason(applyLang("Base cannot have sockets"), ["fossil18"]);
    }
    if (crsim_qualbgroups.indexOf("|" + crsim_settings["bgroup"] + "|") > -1) {
    } else {
        crsim_params["disabled"] += "fossilperfect|";
        poec_simApplyPReason(applyLang("Base cannot have quality"), ["fossilperfect"]);
    }
    if (crsim_veilbgroups.indexOf("|" + crsim_settings["bgroup"] + "|") > -1) {
    } else {
        crsim_params["disabled"] += "veiled|syndicateaisling|";
        poec_simApplyPReason(applyLang("Base cannot have veiled modifiers"), ["veiled", "syndicateaisling"]);
    }
    if (crsim_recombgroups.indexOf("|" + crsim_settings["bgroup"] + "|") > -1) {
    } else {
        crsim_params["disabled"] += "recombinate|";
        poec_simApplyPReason(applyLang("Base cannot be recombinated"), ["recombinate"]);
    }
    if (crsim_eldritchbgroups.indexOf("|" + crsim_settings["bgroup"] + "|") > -1) {
        if (crsim_eldritchinvalidbases.indexOf("|" + crsim_settings["base"] + "|") > -1) {
            crsim_params["disabled"] += "eldritch|";
            poec_simApplyPReason(applyLang("Base cannot have eldritch influence"), ["eldritch"]);
        }
    } else {
        crsim_params["disabled"] += "eldritch|";
        poec_simApplyPReason(applyLang("Base cannot have eldritch influence"), ["eldritch"]);
    }
    switch (parseInt(crsim_settings["bgroup"])) {
        case 10 :
            crsim_params["disabled"] += "vaal|corruption_altar|";
            poec_simApplyPReason(applyLang("Base has no corrupted mods"), ["vaal", "corruption_altar"]);
            break;
        case 11 :
            crsim_params["disabled"] += "corruption_altar|";
            poec_simApplyPReason(applyLang("Cannot use corruption altar"), ["corruption_altar"]);
            break;
        case 14 :
            crsim_params["disabled"] += "harvest|vaal|corruption_altar|";
            poec_simApplyPReason(applyLang("Cannot use harvest crafts"), ["harvest"]);
            poec_simApplyPReason(applyLang("Base cannot be corrupted"), ["vaal", "corruption_altar"]);
            break;
        case 13 :
            crsim_params["disabled"] += "vaal|corruption_altar|";
            poec_simApplyPReason(applyLang("Base cannot be corrupted"), ["vaal", "corruption_altar"]);
            break;
    }
    if (crsim_settings["bgroup"] == 14) {
        crsim_params["disabled"] += "beast_craftingimprint|";
        poec_simApplyPReason(applyLang("Base cannot be imprinted"), ["beast_craftingimprint"]);
    }

    // Filter vendor recipees
    var nvact = 0;
    $("#crsimSubsets").find(".acs_vendor").children(".abtn").each(function () {
        var scode = $(this).attr("scode");
        var basefound = false;
        if (crsim_vendor[scode]["bgroups"] != null) {
            if (crsim_vendor[scode]["bgroups"].indexOf("|" + crsim_settings["bgroup"] + "|") > -1) {
                basefound = true;
            }
        }
        if (!basefound) {
            if (crsim_vendor[scode]["bases"] != null) {
                if (crsim_vendor[scode]["bases"].indexOf("|" + crsim_settings["base"] + "|") > -1) {
                    basefound = true;
                }
            }
        }
        if (!basefound) {
            $(this).removeClass("sel").addClass("hidden");
        } else {
            $(this).removeClass("hidden");
            nvact++;
        }
    });
    if (nvact == 0) {
        crsim_params["disabled"] += "vendor|";
        poec_simApplyPReason(applyLang("No vendor recipee for this item base"), ["vendor"]);
    }
}

function poec_simSetItemModpool() {
    crsim_cmpfull = {};
    $("#crsimMPPrefix").html(poec_simBuildMPHtml(poec_simBuildModpool("prefix"), "prefix", "mp"));
    $("#crsimMPSuffix").html(poec_simBuildMPHtml(poec_simBuildModpool("suffix"), "suffix", "mp"));
    $("#crsimMPImplicit").html(poec_simBuildMPHtml(poec_simBuildModpool(["corrupted", "eldritch_red", "eldritch_blue"]), "implicit", "mp"));
}

function poec_simGetBitemInfo(usebitem, usebase, usebgroup) {
    var itemcopy = null;
    if (usebitem) {
        itemcopy = jQuery.parseJSON(JSON.stringify(poecd["bitems"]["seq"][poecd["bitems"]["ind"][usebitem]]));
        itemcopy["name_bitem"] = poecl["bitem"][usebitem];
        itemcopy["img"] = poec_getBItemIMG(itemcopy["imgurl"], usebitem);
        itemcopy["master"] = null;
    } else {
        if (usebase) {
            // Create "item" from selected base
            itemcopy = {
                "implicits": "[]",
                "properties": "[]",
                "requirements": "null",
                "drop_level": null,
                "name_bitem": poecl["base"][usebase]
            }
            if (poecd["bases"]["seq"][poecd["bases"]["ind"][usebase]]["master_base"] && usebgroup != 13) {
                itemcopy["master"] = poecl["base"][poecd["bases"]["seq"][poecd["bases"]["ind"][usebase]]["master_base"]];
                // Take base item image
                itemcopy["img"] = "images/manual/game/bases/base" + poecd["bases"]["seq"][poecd["bases"]["ind"][usebase]]["master_base"] + ".png";
            } else {
                itemcopy["img"] = "images/manual/game/bases/base" + poecd["bases"]["seq"][poecd["bases"]["ind"][usebase]]["id_base"] + ".png";
            }
        } else {
            return false;
        }
    }
    return itemcopy;
}

function poec_simUpdateBitemCopy(usebitem, usebase, usebgroup) {
    crsim_itemcopy = poec_simGetBitemInfo(usebitem, usebase, usebgroup);

    if (crsim_itemcopy["master"]) {
        $("#simItemMTitle").html(crsim_itemcopy["master"]);
    }

    // Set base item image
    $("#crsimItemImage").css({"background-image": "url(" + crsim_itemcopy["img"] + ")"});

    // Set item name
    if (crsim_itemcopy["name_bitem"].length > 32) {
        $("#simItemBase").addClass("sml");
    } else {
        $("#simItemBase").removeClass("sml");
    }
    $("#simItemBase").html(crsim_itemcopy["name_bitem"]);
}

var crsim_modregex = /\((.*?)\)/gm;
var crsim_itemcopy = null;
var crsim_cmpfull = {};

function poec_simBuildIntBase(crsim_crsets, imported) {
    var maxafftmp = parseInt(poecd["bgroups"]["seq"][poecd["bgroups"]["ind"][crsim_settings["bgroup"]]]["max_affix"]) / 2;

    crsim_data = {
        "fmodpool": null,
        "eldritch": null,
        "dominance": null,
        "mtypes": null,
        "implicits": null,
        "rollable_implicits": 0,
        "cmodpool": {"prefix": [], "suffix": []},
        "hmodpool": {"prefix": [], "suffix": []},
        "maxaffgrp": {"prefix": maxafftmp, "suffix": maxafftmp},
        "is_rare": parseInt(poecd["bgroups"]["seq"][poecd["bgroups"]["ind"][crsim_settings["bgroup"]]]["is_rare"]),
        "is_fossil": parseInt(poecd["bgroups"]["seq"][poecd["bgroups"]["ind"][crsim_settings["bgroup"]]]["is_fossil"]),
        "is_craftable": parseInt(poecd["bgroups"]["seq"][poecd["bgroups"]["ind"][crsim_settings["bgroup"]]]["is_craftable"]),
        "is_influenced": parseInt(poecd["bgroups"]["seq"][poecd["bgroups"]["ind"][crsim_settings["bgroup"]]]["is_influenced"]),
        "is_essence": parseInt(poecd["bgroups"]["seq"][poecd["bgroups"]["ind"][crsim_settings["bgroup"]]]["is_ess"]),
        "is_catalyst": parseInt(poecd["bgroups"]["seq"][poecd["bgroups"]["ind"][crsim_settings["bgroup"]]]["is_catalyst"]),
        "is_notable": parseInt(poecd["bgroups"]["seq"][poecd["bgroups"]["ind"][crsim_settings["bgroup"]]]["is_notable"]),
        "unique_notable": parseInt(poecd["bases"]["seq"][poecd["bases"]["ind"][crsim_settings["base"]]]["unique_notable"]),
        "iaffixes": [],
        "meta_flags": {},
        "imprint": null,
        "enchant": "",
        "iaffbt": {"prefix": 0, "suffix": 0}
    };

    $.each(crsim_dreasons, function (code, artbl) {
        crsim_dreasons[code] = [];
    });
    $.each(crsim_preasons, function (code, artbl) {
        crsim_preasons[code] = [];
    });

    if (poecd["bases"]["seq"][poecd["bases"]["ind"][crsim_settings["base"]]]["enchant"]) {
        var enchant = poecd["bases"]["seq"][poecd["bases"]["ind"][crsim_settings["base"]]]["enchant"].split("\n");
        var strenchant = "";
        for (var i = 0; i < enchant.length; i++) {
            strenchant += "<div class='affix enchant'>" + enchant[i] + "</div>";
        }
        strenchant += "<div class='sep'></div>";
        crsim_data["enchant"] = strenchant;
    }

    crsim_settings["exmods"] = "";
    if (crsim_settings["bitem"]) {
        crsim_settings["exmods"] = poecd["bitems"]["seq"][poecd["bitems"]["ind"][crsim_settings["bitem"]]]["exmods"];
    }

    switch (parseInt(crsim_settings["bitem"])) {
        case 8209 :
            crsim_data["maxaffgrp"] = {"prefix": 2, "suffix": 4};
            break; // Cogwork
        case 8224 :
            crsim_data["maxaffgrp"] = {"prefix": 4, "suffix": 2};
            break; // Geodesic
        case 8246 :
            crsim_data["maxaffgrp"] = {"prefix": 2, "suffix": 2};
            break; // Simplex
        case 8201 :
            crsim_settings["influences"] = [2, 3, 4, 5, 6, 7];
            break; // Astrolabe
    }

    crsim_data["cmaxaffgrp"] = crsim_data["maxaffgrp"];

    crsim_opened = {
        "mp": {"prefix": null, "suffix": null},
        "cb": {"prefix": null, "suffix": null},
        "im": {"eldritch_red": null, "eldritch_blue": null, "corrupted": null}
    };

    if (!imported) {
        poec_simResetSpending();
        crsim_log = [];
    }

    $("#simImprintZone").removeClass("imprinted");

    if (crsim_crsets) {
        crsim_data["iaffixes"] = jQuery.parseJSON(JSON.stringify(crsim_crsets["affixes"]));
        crsim_data["meta_flags"] = jQuery.parseJSON(JSON.stringify(crsim_crsets["meta_flags"]));
        crsim_data["iaffbt"] = jQuery.parseJSON(JSON.stringify(crsim_crsets["iaffbt"]));
        crsim_data["eldritch"] = jQuery.parseJSON(JSON.stringify(crsim_crsets["eldritch"]));
        if (crsim_crsets["implicits"]) {
            if (crsim_crsets["implicits"].length > 0) {
                crsim_data["implicits"] = jQuery.parseJSON(JSON.stringify(crsim_crsets["implicits"]));
            }
        }
        if (crsim_crsets["imprint"]) {
            crsim_data["imprint"] = jQuery.parseJSON(JSON.stringify(crsim_crsets["imprint"]));
        }
    }

    poec_simUpdateDominance();

    if (crsim_settings["veils"] != undefined) {
        if (Array.isArray(crsim_settings["veils"])) {
            for (var h = 0; h < crsim_settings["veils"].length; h++) {
                poec_simAddVeiledAffix(crsim_settings["veils"][h]);
            }
        }
    }

    $("#simItemMTitle").html(applyLang("Crafting project"));

    poec_simUpdateBitemCopy(crsim_settings["bitem"], crsim_settings["base"], crsim_settings["bgroup"]);

    // Parse implicits into variables
    if (!crsim_data["implicits"]) {
        var imps = crsim_itemcopy["implicits"];
        if (imps != "[]" && imps != "[false]") {
            crsim_data["implicits"] = [];
            imps = jQuery.parseJSON(imps);
            for (var i = 0; i < imps.length; i++) {
                if (imps[i]) {
                    crsim_data["implicits"].push(poec_simParseImplicit(imps[i]));
                }
            }
        }
    }
    if (crsim_data["implicits"]) {
        crsim_data["rollable_implicits"] = crsim_data["implicits"].length;
    }

    crsim_mgrpdata = {};
    crsim_affbymgrp = {};

    // Build full mod pool
    poec_simBuildFullModpool(crsim_settings["base"]);

    $("#simHistoryUndoBtn").hide();

    poec_simSetIniDisabled(imported);

    // Set rarity
    poec_simSetRarity(crsim_settings["rarity"]);
    poec_updateItemAffixes();
    poec_updateActionEnabling();

    // Build modpool
    poec_simSetItemModpool();

    poec_simRefreshModPool();
}

function poec_simParseImplicit(imp) {
    var ivalues = imp.match(crsim_modregex);
    var iname = imp.replace(crsim_modregex, "#");
    var irolls = [];
    if (ivalues) {
        if (ivalues.length > 0) {
            for (var j = 0; j < ivalues.length; j++) {
                ivalues[j] = ivalues[j].substring(1, ivalues[j].length - 1).split("-");
                ivalues[j][0] = parseInt(ivalues[j][0]);
                ivalues[j][1] = parseInt(ivalues[j][1]);
                if (Math.ceil(ivalues[j][0]) != ivalues[j][0] || Math.ceil(ivalues[j][1]) != ivalues[j][1]) {
                    irolls.push(Math.round(poec_rand((ivalues[j][0] * 100), (ivalues[j][1] * 100) + 1, true)) / 100);
                } else {
                    irolls.push(poec_rand(ivalues[j][0], ivalues[j][1] + 1, true));
                }
            }
        }
    }
    return {"name": iname, "nvalues": ivalues, "rolls": irolls};
}

function poec_simGetModMTypes(mtypes) {
    var strcheck = "|";
    var amtypes = [];
    var houtput = "";
    if (mtypes) {
        if (mtypes.length > 1) {
            strcheck = mtypes;
            amtypes = mtypes.substring(1, mtypes.length - 1).split("|");
            for (var z = 0; z < amtypes.length; z++) {
                if (poecd["mtypes"]["seq"][poecd["mtypes"]["ind"][amtypes[z]]]["jewellery_tag"] == 0) {
                    if (crsim_igntypes.indexOf("|" + amtypes[z] + "|") > -1) {
                    } else {
                        houtput += "<div class='mt tmt" + amtypes[z] + " sml_shadow'>" + poecl["mtype"][amtypes[z]] + "</div>";
                    }
                }
            }
        }
    }
    return {"strcheck": strcheck, "mtarr": amtypes, "houtput": houtput};
}

function poec_simOutputTValues(nvalues) {
    var vOUT = "";
    if (nvalues && nvalues != "[]") {
        nvalues = jQuery.parseJSON(nvalues);
        for (var i = 0; i < nvalues.length; i++) {
            if (Array.isArray(nvalues[i])) {
                vOUT += "<div>" + nvalues[i][0] + "-" + nvalues[i][1] + "</div>";
            } else {
                vOUT += "<div>" + nvalues[i] + "</div>";
            }
        }
    }
    return vOUT;
}

function poec_setItemOutputInfluence() {
    $("#simItemLInf").html("");
    $("#simItemRInf").html("");
    if (crsim_settings["influences"] !== null) {
        var lmgpr = 0;
        var rmgpr = 0;
        if (crsim_settings["influences"].length == 1) {
            lmgpr = crsim_settings["influences"][0];
            rmgpr = crsim_settings["influences"][0];
        } else {
            lmgpr = crsim_settings["influences"][0];
            rmgpr = crsim_settings["influences"][1];
        }
        $("#simItemLInf").html('<div class="inf mgrp' + lmgpr + '"></div>');
        $("#simItemRInf").html('<div class="inf mgrp' + rmgpr + '"></div>');
    } else {
        if (crsim_data["eldritch"]) {
            var lmgpr = "red";
            var rmgpr = "blue";
            if (crsim_data["eldritch"]["eldritch_red"] > 0 && crsim_data["eldritch"]["eldritch_blue"] > 0) {
            } else {
                if (crsim_data["eldritch"]["blue"]) {
                    lmgpr = "blue";
                } else {
                    rmgpr = "red";
                }
            }
            $("#simItemLInf").html('<div class="inf mgrp' + lmgpr + '"></div>');
            $("#simItemRInf").html('<div class="inf mgrp' + rmgpr + '"></div>');
        } else {
            if (crsim_hasfrac) {
                $("#simItemLInf").html('<div class="inf frac"></div>');
                $("#simItemRInf").html('<div class="inf frac"></div>');
            }
        }
    }
}

function poec_simGetFullItem(idata, ibitem, ftitle, otype, force_implicits) {
    /*
  action: "harvest"
  add: [{…}]
  affixes: Array(2)
  0: {atype: "prefix", id: "1735", mgrp: "4", modgroup: "EnemiesExplodeOnDeath", weight: "25", …}
  1: {id: "1775", mgrp: "1", tindex: 4, atype: "prefix", modgroup: "IncreasedLife", …}
  length: 2
  __proto__: Array(0)
  catalyst: null
  corrupted: 0
  currency: null
  destroyed: 0
  forced: null
  implicits: Array(1)
  0: {name: "+#% to all Elemental Resistances", nvalues: Array(1), rolls: Array(1)}
  length: 1
  __proto__: Array(0)
  imprint: null
  influences: ["4"]
  mode: "action"
  nums: 1
  psn: {prefix: 2, suffix: 0}
  quality: 20
  rarity: "rare"
  rem: null
  ssaction: "inf"
  sts: null
  subaction: "haugment"
  upg: null
  base :
  bgroup :
  bitem :
  */

    if (crsim_catdata == null) {
        poec_simBuildCatalystData();
    }

    if (otype == undefined) {
        otype = "basic";
    }

    var iinfo = "";
    iinfo += "<div class='affixes'>";
    var quality = parseInt(idata["quality"]) / 100;
    var propmods = poec_simGetItemProps(idata["affixes"]);

    if (idata["catalyst"]) {
        iinfo += "<div class='affix property qualed cataqual'>" + applyLang("Quality") + " (" + crsim_catlbls[idata["catalyst"]["id"]] + " " + applyLang("Modifiers") + "): <span class='value'>+" + idata["catalyst"]["val"] + "%</span></div>";
        iinfo += "<div class='sep properties'></div>";
    }
    /*
  console.log(idata);
  console.log(ibitem);
  console.log(crsim_settings);
  */
    if (idata["base"]) {
        var critemcopy = poec_simGetBitemInfo(idata["bitem"], idata["base"], idata["bgroup"]);
        var bitemilvl = idata["ilvl"];
        var bitemid = idata["bitem"];
        var bitembase = idata["base"];
    } else {
        if (ibitem == null && crsim_settings != null) {
            var critemcopy = jQuery.parseJSON(JSON.stringify(crsim_itemcopy));
            var bitemilvl = crsim_settings["ilvl"];
            var bitemid = crsim_settings["bitem"];
            var bitembase = crsim_settings["base"];
        } else {
            if (ibitem != null && ibitem != 0) {
                var critemcopy = jQuery.parseJSON(JSON.stringify(poecd["bitems"]["seq"][poecd["bitems"]["ind"][ibitem]]));
                critemcopy["name_bitem"] = poecl["bitem"][ibitem];
            } else {
                var critemcopy = {
                    "properties": "[]",
                    "requirements": "null",
                    "drop_level": null,
                    "name_bitem": poecl["base"][idata["base"]]
                };
                if (poecd["bases"]["seq"][poecd["bases"]["ind"][idata["base"]]]["master_base"]) {
                    ftitle = poecl["base"][poecd["bases"]["seq"][poecd["bases"]["ind"][idata["base"]]]["master_base"]];
                }
            }
            var bitemilvl = idata["ilvl"];
            var bitemid = ibitem;
            var bitembase = idata["base"];
        }
    }

    // Properties
    var props = critemcopy["properties"];
    if (props != "[]") {
        iinfo += poec_parseItemProperty(applyLang("Quality"), quality, props, quality, propmods, false);
        props = jQuery.parseJSON(props);
        $.each(props, function (name, value) {
            iinfo += poec_parseItemProperty(name, value, props, quality, propmods, false);
        });
        iinfo += "<div class='sep properties'></div>";
    }

    // Requirements
    var addreq = "";
    if (critemcopy["requirements"].length > 2 && critemcopy["requirements"] != "null") {
        var jsireqs = jQuery.parseJSON(critemcopy["requirements"]);
        $.each(jsireqs, function (nreq, rval) {
            addreq += ", <span class='value'>" + rval + "</span> " + nreq.replace("intelligence", "Int").replace("strength", "Str").replace("dexterity", "Dex");
        });
    }
    if (critemcopy["drop_level"]) {
        addreq = "<span class='value'>" + critemcopy["drop_level"] + "</span>" + addreq;
    }
    if (addreq) {
        iinfo += "<div class='affix property'>Item level: <span class='value'>" + bitemilvl + "</span></div>";
        iinfo += "<div class='affix property'>Requires level: " + addreq + "</div>";
        iinfo += "<div class='sep requirements'></div>";
    }

    if (idata["enchant"] != undefined) {
        iinfo += idata["enchant"];
    }

    // Implicits
    if ((ibitem == null && crsim_settings != null) || force_implicits == true) {
        if (idata["implicits"]) {
            var numimps = 0;
            for (var i = 0; i < idata["implicits"].length; i++) {
                if (idata["implicits"][i]["name"] != undefined) {
                    var implicit = idata["implicits"][i]["name"];
                    var isplit = implicit.split(", ");
                    var roffset = 0;
                    for (var j = 0; j < isplit.length; j++) {
                        var numrolls = isplit[j].split("#");
                        roffset += numrolls - 1;
                    }
                    if (idata["implicits"][i]["nvalues"]) {
                        for (var j = 0; j < idata["implicits"][i]["rolls"].length; j++) {
                            var addrange = "";
                            if (Array.isArray(idata["implicits"][i]["nvalues"][j])) {
                                addrange = "(" + idata["implicits"][i]["nvalues"][j][0] + "-" + idata["implicits"][i]["nvalues"][j][1] + ")";
                            }
                            implicit = implicit.replace("#", idata["implicits"][i]["rolls"][j] + addrange);
                        }
                    }
                    iinfo += "<div class='affix implicit'>" + implicit + "</div>";
                    numimps++;
                } else {
                    var tnum = poecd['tiers'][idata["implicits"][i]["id"]][bitembase].length - idata["implicits"][i]["tindex"];
                    var naffix = poecl["mod"][idata["implicits"][i]["id"]];
                    var tnaffix = poecd["modifiers"]["seq"][poecd["modifiers"]["ind"][idata["implicits"][i]["id"]]]["name_modifier"];
                    var mtypes = poecd["modifiers"]["seq"][poecd["modifiers"]["ind"][idata["implicits"][i]["id"]]]["mtypes"];

                    var othmod = 0;
                    if (otype == "simulator") {
                        var catmod = 1;
                    } else {
                        var catmod = poec_simParseCatValue(idata["implicits"][i]);
                    }

                    var caffix = naffix;
                    if (naffix.indexOf("#") > -1) {
                        var isplit = tnaffix.split(", ");
                        var roffset = 0;
                        for (var j = 0; j < isplit.length; j++) {
                            if (!crsim_bypass) {
                                if (crsim_edps.indexOf("|" + isplit[j] + "|") > -1) {
                                    epsfto["min"] += idata["implicits"][i]["rolls"][roffset];
                                    epsfto["max"] += idata["implicits"][i]["rolls"][roffset + 1];
                                }
                            }
                            var numrolls = isplit[j].split("#");
                            roffset += numrolls - 1;
                        }

                        var nvalues = [];
                        if (idata["implicits"][i]["nvalues"]) {
                            nvalues = jQuery.parseJSON(idata["implicits"][i]["nvalues"]);
                        }
                        for (var j = 0; j < idata["implicits"][i]["rolls"].length; j++) {
                            var addrange = "";
                            if (Array.isArray(nvalues[j])) {
                                addrange += "(" + poec_simApplyCatMod(nvalues[j][0], catmod) + "-" + poec_simApplyCatMod(nvalues[j][1], catmod) + ")";
                            }
                            naffix = naffix.replace("#", poec_simApplyCatMod(idata["implicits"][i]["rolls"][j], catmod + othmod) + addrange);
                            caffix = caffix.replace("#", poec_simApplyCatMod(idata["implicits"][i]["rolls"][j], catmod + othmod));
                        }
                    }

                    var tags = poec_simParseAffixMTypes(mtypes);
                    iinfo += "<div class='adet'>" + poec_simParseIAType(idata["implicits"][i]["atype"]) + " implicit (Tier: " + tnum + ")" + tags + "</div>";
                    iinfo += "<div class='affix implicit'>" + naffix + "</div>";
                    numimps++;
                }
            }
            if (numimps > 0) {
                iinfo += "<div class='sep implicits'></div>";
            }
        }
    } else {
        if (idata["implicits"]) {
            for (var i = 1; i < idata["implicits"].length; i = i + 2) {
                iinfo += "<div class='affix implicit'>" + idata["implicits"][i] + "</div>";
            }
            iinfo += "<div class='sep implicits'></div>";
        }
    }

    // Set affixes
    crsim_hasfrac = false;
    if (idata["affixes"]) {
        var affbytype = {"prefix": "", "suffix": "", "crafted": "", "veiled": ""};
        var othmod = 0;
        if (bitemid == 8246) {
            othmod = 0.25;
        }
        for (var i = 0; i < idata["affixes"].length; i++) {
            if (idata["affixes"][i]["id"] > 0) {
                if (ibitem == null) {
                    var catmod = poec_simParseNCatValue(idata["affixes"][i], idata["catalyst"]);
                } else {
                    var catmod = 1;
                }

                // Tier/Name info
                if (idata["affixes"][i]["maven"] == 0) {
                    if (idata["affixes"][i]["tindex"] > -1) {
                        if (poecd['tiers'][idata["affixes"][i]["id"]][bitembase] == undefined) {
                            var tnum = "???";
                        } else {
                            var tnum = poecd['tiers'][idata["affixes"][i]["id"]][bitembase].length - idata["affixes"][i]["tindex"];
                        }
                    } else {
                        var tnum = "???";
                    }
                    var naffix = poecl["mod"][idata["affixes"][i]["id"]];
                    var mtypes = poecd["modifiers"]["seq"][poecd["modifiers"]["ind"][idata["affixes"][i]["id"]]]["mtypes"];
                } else {
                    var tnum = "E";
                    var naffix = poecd["maeven"]["ind"][idata["affixes"][i]["maven"]]["oname"];
                    var mtypes = poecd["maeven"]["ind"][idata["affixes"][i]["maven"]]["mtypes"];
                }

                // Output STD version

                // Output ALT version
                if (naffix.indexOf("#") > -1) {
                    var isplit = naffix.split(", ");
                    var roffset = 0;
                    for (var j = 0; j < isplit.length; j++) {
                        var numrolls = isplit[j].split("#");
                        roffset += numrolls - 1;
                    }

                    var nvalues = [];
                    if (idata["affixes"][i]["nvalues"]) {
                        nvalues = jQuery.parseJSON(idata["affixes"][i]["nvalues"]);
                    }
                    if (idata["affixes"][i]["rolls"] != undefined) {
                        for (var j = 0; j < idata["affixes"][i]["rolls"].length; j++) {
                            var addrange = "";
                            if (Array.isArray(nvalues[j])) {
                                addrange += "(" + poec_simApplyCatMod(nvalues[j][0], catmod) + "-" + poec_simApplyCatMod(nvalues[j][1], catmod) + ")";
                            }
                            naffix = naffix.replace("#", poec_simApplyCatMod(idata["affixes"][i]["rolls"][j], catmod + othmod) + addrange);
                        }
                    } else {

                    }
                }
                // Mgroup info
                if (idata["affixes"][i]["mgrp"] != 1) {
                    var mgroup = " \"" + poecd["mgroups"]["seq"][poecd["mgroups"]["ind"][idata["affixes"][i]["mgrp"]]]["name_mgroup"] + "\"";
                } else {
                    var mgroup = "";
                }
                // Tags info
                var tags = poec_simParseAffixMTypes(mtypes);
                var ihtml = "";
                ihtml += "<div class='adet'>" + idata["affixes"][i]["atype"] + " modifier" + mgroup + " (Tier: " + tnum + ")" + tags + "</div>";
                var addcatlbl = "";
                if (catmod != 1) {
                    addcatlbl += " (" + idata["catalyst"]["val"] + "% Increased)";
                }
                if (idata["affixes"][i]["frac"] == 1) {
                    crsim_hasfrac = true;
                }
                var tmpsettings = (crsim_settings) ? crsim_settings : simulator_settings;
                if (tmpsettings != undefined) {
                    if (tmpsettings["bgroup"] == 11 || tmpsettings["bgroup"] == 15) {
                        naffix = poec_parseMapName(naffix);
                    }
                }
                ihtml += "<div class='affix taff bench" + idata["affixes"][i]["bench"] + " frac" + idata["affixes"][i]["frac"] + "' aind='" + i + "' affid='" + idata["affixes"][i]["id"] + "'>" + naffix + addcatlbl + "</div>";

                if (idata["affixes"][i]["bench"] == 1) {
                    affbytype["crafted"] += ihtml;
                } else {
                    affbytype[idata["affixes"][i]["atype"]] += ihtml;
                }
            } else {
                switch (idata["affixes"][i]["id"]) {
                    case -1 :
                        var ihtml = "<div class='adet'>Veiled " + idata["affixes"][i]["atype"] + "</div>";
                        ihtml += "<div class='affix taff veiled' aind='" + i + "' affid='" + idata["affixes"][i]["id"] + "'><img src='images/manual/veiled.gif'/></div>";
                        affbytype["veiled"] += ihtml;
                        break;
                }
            }
        }
        iinfo += affbytype["prefix"] + affbytype["suffix"] + affbytype["crafted"] + affbytype["veiled"];
    }

    var tlefti = "";
    var trighti = "";
    if (idata["influences"] !== null) {
        var lmgpr = 0;
        var rmgpr = 0;
        if (idata["influences"].length == 1) {
            lmgpr = idata["influences"][0];
            rmgpr = idata["influences"][0];
        } else {
            lmgpr = idata["influences"][0];
            rmgpr = idata["influences"][1];
        }
        tlefti = '<div class="inf mgrp' + lmgpr + '"></div>';
        trighti = '<div class="inf mgrp' + rmgpr + '"></div>';
    } else {
        if (idata["eldritch"]) {
            var lmgpr = "red";
            var rmgpr = "blue";
            if (idata["eldritch"]["eldritch_red"] > 0 && idata["eldritch"]["eldritch_blue"] > 0) {
            } else {
                if (idata["eldritch"]["blue"]) {
                    lmgpr = "blue";
                } else {
                    rmgpr = "red";
                }
            }
            tlefti = '<div class="inf mgrp' + lmgpr + '"></div>';
            trighti = '<div class="inf mgrp' + rmgpr + '"></div>';
        } else {
            if (crsim_hasfrac) {
                tlefti = '<div class="inf frac"></div>';
                trighti = '<div class="inf frac"></div>';
            }
        }
    }

    if (ftitle == undefined) {
        ftitle = applyLang("History State");
    }

    var addstuff = "";
    if (otype == "simulator") {
        idata["bitem"] = ibitem;
        addstuff = "<div class='item_data hidden'>" + JSON.stringify(idata) + "</div>";
    }

    return '<div class="poec_item ' + idata["rarity"] + ' ' + otype + '"><div class="wrap"><div class="header"><div class="sides left">' + tlefti + '</div><div class="sides right">' + trighti + '</div><div class="ititle">' + ftitle + '</div><div class="base">' + critemcopy["name_bitem"] + '</div></div>' + iinfo + '</div></div>' + addstuff + '</div>';
}

function poec_simGetItemProps(affixes) {
    var propmods = {};
    if (affixes) {
        for (var i = 0; i < affixes.length; i++) {
            if (affixes[i]["id"] > 0) {
                //var naffix=poecl["mod"][affixes[i]["id"]];
                var naffix = poecd["modifiers"]["seq"][poecd["modifiers"]["ind"][affixes[i]["id"]]]["name_modifier"];
                for (var j = 0; j < crsim_ipsex.length; j++) {
                    naffix = naffix.replace(crsim_ipsex[j]["from"], crsim_ipsex[j]["to"]);
                }
                var brknaff = naffix.split(",");
                var cntval = 0;
                for (var j = 0; j < brknaff.length; j++) {
                    brknaff[j] = brknaff[j].trim();
                    if (brknaff[j].indexOf("#") > -1) {
                        var nhash = brknaff[j].split("#");
                        nhash = nhash.length - 1;
                        if (crsim_iprmods[brknaff[j]] != undefined) {
                            for (var k = 0; k < crsim_iprmods[brknaff[j]]["affects"].length; k++) {
                                if (propmods[crsim_iprmods[brknaff[j]]["affects"][k]] == undefined) {
                                    propmods[crsim_iprmods[brknaff[j]]["affects"][k]] = {"m": 1, "f": 0};
                                }
                                if (crsim_iprmods[brknaff[j]]["type"] == "m") {
                                    propmods[crsim_iprmods[brknaff[j]]["affects"][k]]["m"] += affixes[i]["rolls"][cntval] / 100;
                                } else {
                                    if (nhash > 1) {
                                        propmods[crsim_iprmods[brknaff[j]]["affects"][k]]["f"] += affixes[i]["rolls"][cntval + k];
                                    } else {
                                        propmods[crsim_iprmods[brknaff[j]]["affects"][k]]["f"] += affixes[i]["rolls"][cntval];
                                    }
                                }
                            }
                        }
                        cntval++;
                    }
                }
            }
        }
    }
    return propmods;
}

function poec_simParseIAType(atype) {
    switch (atype) {
        case 'eldritch_blue' :
            return "Eater of Worlds";
            break;
        case 'eldritch_red' :
            return "Searing Exarch";
            break;
        case 'corrupted' :
            return "Corrupted";
            break;
    }
}

var crsim_iprops = "|evasion|energy_shield|armour|critical_strike_chance|attack_time|physical_damage_min|physical_damage_max|block|quality|ward|";
var crsim_iprmods = {
    "#% increased Physical Damage": {"affects": ["physical_damage_min", "physical_damage_max"], "type": "m"},
    "Adds # to # Physical Damage": {"affects": ["physical_damage_min", "physical_damage_max"], "type": "f"},
    "#% increased Attack Speed": {"affects": ["attack_time"], "type": "m"},
    "#% increased Critical Strike Chance": {"affects": ["critical_strike_chance"], "type": "m"},
    "+#% Chance to Block": {"affects": ["block"], "type": "f"},
    "+# to Armour": {"affects": ["armour"], "type": "f"},
    "#% increased Armour": {"affects": ["armour"], "type": "m"},
    "+# to Evasion Rating": {"affects": ["evasion"], "type": "f"},
    "#% increased Evasion Rating": {"affects": ["evasion"], "type": "m"},
    "+# to maximum Energy Shield": {"affects": ["energy_shield"], "type": "f"},
    "#% increased Energy Shield": {"affects": ["energy_shield"], "type": "m"},
    "#% increased Ward": {"affects": ["ward"], "type": "m"},
    "+# to Ward": {"affects": ["ward"], "type": "f"},
    "#% increased Armour and Energy Shield": {"affects": ["armour", "energy_shield"], "type": "m"},
    "#% increased Armour and Evasion": {"affects": ["armour", "evasion"], "type": "m"},
    "#% increased Evasion and Energy Shield": {"affects": ["evasion", "energy_shield"], "type": "m"},
    "#% increased Armour| Evasion and Energy Shield": {"affects": ["armour", "evasion", "energy_shield"], "type": "m"},
    "+#% to Quality": {"affects": ["quality"], "type": "f"},
};
var crsim_edps = "|Adds # to # Fire Damage|Adds # to # Cold Damage|Adds # to # Lightning Damage|";
var crsim_ipsex = [{
    "from": "#% increased Armour, Evasion and Energy Shield",
    "to": "#% increased Armour| Evasion and Energy Shield"
}];
var crsim_hasfrac = false;

function poec_updateItemAffixes() {
    var iinfo = "";
    var vCLIP = "";
    var vaffs = 0;

    poec_simCloseExporter();

    if (crsim_settings["destroyed"] == 1) {
        $("#simItemCol").addClass("destroyed corrupted");
        $("#simItemAffixes").html("<div class='destroyed'><img src='images/manual/destroyed.png'/></div>");
    } else {
        $("#simItemCol").removeClass("destroyed");
        var quality = parseInt(crsim_settings["quality"]) / 100;

        vCLIP += "Rarity: " + crsim_settings["rarity"].capitalize() + "\n";
        vCLIP += "Crafted Item" + "\n";
        vCLIP += $("#simItemBase").text() + "\n";
        vCLIP += "--------" + "\n";
        var vclprop = "";
        var vclreqs = "";
        var vclimps = "";
        var vclaffs = "";

        var propmods = poec_simGetItemProps(crsim_data["iaffixes"]);

        //console.log(propmods);

        if (crsim_data["is_catalyst"] && crsim_catalyst) {
            iinfo += "<div class='affix property qualed cataqual'>" + applyLang("Quality") + " (" + crsim_catlbls[crsim_catalyst["id"]] + " " + applyLang("Modifiers") + "): <span class='value'>+" + crsim_catalyst["val"] + "%</span></div>";
            iinfo += "<div class='sep properties'></div>";
            vclprop += "Quality (" + crsim_catlbls[crsim_catalyst["id"]] + " Modifiers): +" + crsim_catalyst["val"] + "% (augmented)" + "\n";
        }

        if (crsim_settings["base"] == 178) {
            iinfo += "<div class='affix red'>" + applyLang("This item cannot be crafted in the game") + "</div>";
            iinfo += "<div class='sep'></div>";
        }

        // Properties
        var props = crsim_itemcopy["properties"];
        var haspdps = false;
        var epsfto = {"min": 0, "max": 0};
        if (props != "[]") {
            if (quality > 0) {
                vclprop += "Quality: +" + Math.round(quality * 100) + "% (augmented)" + "\n";
            }
            iinfo += poec_parseItemProperty(applyLang("Quality"), quality, props, quality, propmods, false);
            props = jQuery.parseJSON(props);
            $.each(props, function (name, value) {
                if (name == "physical_damage_min") {
                    haspdps = true;
                }
                iinfo += poec_parseItemProperty(name, value, props, quality, propmods, false);
                var vstr = poec_parseItemProperty(name, value, props, quality, propmods, true);
                if (vstr) {
                    vclprop += vstr.capitalize() + "\n";
                }
            });
            iinfo += "<div class='sep properties'></div>";
        }

        // Requirements
        var addreq = "";
        if (crsim_itemcopy["requirements"].length > 2 && crsim_itemcopy["requirements"] != "null") {
            var jsireqs = jQuery.parseJSON(crsim_itemcopy["requirements"]);
            $.each(jsireqs, function (nreq, rval) {
                vclreqs += nreq.replace("intelligence", "Int").replace("strength", "Str").replace("dexterity", "Dex") + ": " + rval + "\n";
                addreq += ", <span class='value'>" + rval + "</span> " + nreq.replace("intelligence", "Int").replace("strength", "Str").replace("dexterity", "Dex");
            });
        }
        if (crsim_itemcopy["drop_level"]) {
            addreq = "<span class='value'>" + crsim_itemcopy["drop_level"] + "</span>" + addreq;
            if (crsim_itemcopy["drop_level"] > 1) {
                vclreqs += "Level: " + crsim_itemcopy["drop_level"] + "\n";
            }
        }
        if (addreq) {
            iinfo += "<div class='affix property'>Item level: <span class='value'>" + crsim_settings["ilvl"] + "</span></div>";
            iinfo += "<div class='affix property'>Requires level: " + addreq + "</div>";
            iinfo += "<div class='sep requirements'></div>";
        }

        iinfo += crsim_data["enchant"];

        // Implicits
        if (crsim_data["implicits"]) {
            var numimps = 0;
            for (var i = 0; i < crsim_data["implicits"].length; i++) {
                if (crsim_data["implicits"][i]["name"] != undefined) {
                    var implicit = crsim_data["implicits"][i]["name"];
                    var isplit = implicit.split(", ");
                    var roffset = 0;
                    for (var j = 0; j < isplit.length; j++) {
                        if (crsim_edps.indexOf("|" + isplit[j] + "|") > -1) {
                            epsfto["min"] += crsim_data["implicits"][i]["rolls"][roffset];
                            epsfto["max"] += crsim_data["implicits"][i]["rolls"][roffset + 1];
                        }
                        var numrolls = isplit[j].split("#");
                        roffset += numrolls - 1;
                    }
                    var iclip = crsim_data["implicits"][i]["name"];
                    if (crsim_data["implicits"][i]["nvalues"]) {
                        for (var j = 0; j < crsim_data["implicits"][i]["rolls"].length; j++) {
                            var addrange = "";
                            if (Array.isArray(crsim_data["implicits"][i]["nvalues"][j])) {
                                addrange = "(" + crsim_data["implicits"][i]["nvalues"][j][0] + "-" + crsim_data["implicits"][i]["nvalues"][j][1] + ")";
                            }
                            implicit = implicit.replace("#", crsim_data["implicits"][i]["rolls"][j] + addrange);
                            iclip = iclip.replace("#", crsim_data["implicits"][i]["rolls"][j]);
                        }
                    }
                    iinfo += "<div class='affix implicit'>" + implicit + "</div>";
                    vclimps += iclip + " (implicit)" + "\n";
                    numimps++;
                } else {
                    var tnum = poecd['tiers'][crsim_data["implicits"][i]["id"]][crsim_settings["base"]].length - crsim_data["implicits"][i]["tindex"];
                    var naffix = poecl["mod"][crsim_data["implicits"][i]["id"]];
                    var tnaffix = poecd["modifiers"]["seq"][poecd["modifiers"]["ind"][crsim_data["implicits"][i]["id"]]]["name_modifier"];
                    var mtypes = poecd["modifiers"]["seq"][poecd["modifiers"]["ind"][crsim_data["implicits"][i]["id"]]]["mtypes"];

                    var othmod = 0;
                    var catmod = poec_simParseCatValue(crsim_data["implicits"][i]);

                    var caffix = naffix;
                    if (naffix.indexOf("#") > -1) {
                        var isplit = tnaffix.split(", ");
                        var roffset = 0;
                        for (var j = 0; j < isplit.length; j++) {
                            if (crsim_edps.indexOf("|" + isplit[j] + "|") > -1) {
                                epsfto["min"] += crsim_data["implicits"][i]["rolls"][roffset];
                                epsfto["max"] += crsim_data["implicits"][i]["rolls"][roffset + 1];
                            }
                            var numrolls = isplit[j].split("#");
                            roffset += numrolls - 1;
                        }

                        var nvalues = [];
                        if (crsim_data["implicits"][i]["nvalues"]) {
                            nvalues = jQuery.parseJSON(crsim_data["implicits"][i]["nvalues"]);
                        }
                        for (var j = 0; j < crsim_data["implicits"][i]["rolls"].length; j++) {
                            var addrange = "";
                            if (Array.isArray(nvalues[j])) {
                                addrange += "(" + poec_simApplyCatMod(nvalues[j][0], catmod) + "-" + poec_simApplyCatMod(nvalues[j][1], catmod) + ")";
                            }
                            naffix = naffix.replace("#", poec_simApplyCatMod(crsim_data["implicits"][i]["rolls"][j], catmod + othmod) + addrange);
                            caffix = caffix.replace("#", poec_simApplyCatMod(crsim_data["implicits"][i]["rolls"][j], catmod + othmod));
                        }
                    }

                    caffix = caffix.split(", ");
                    for (var u = 0; u < caffix.length; u++) {
                        vclimps += caffix[u] + "\n";
                    }

                    var tags = poec_simParseAffixMTypes(mtypes);
                    iinfo += "<div class='adet'>" + poec_simParseIAType(crsim_data["implicits"][i]["atype"]) + " implicit (Tier: " + tnum + ")" + tags + "</div>";
                    iinfo += "<div class='affix implicit'>" + naffix + "</div>";
                    numimps++;
                }
            }
            if (numimps > 0) {
                iinfo += "<div class='sep implicits'></div>";
            }
        }

        // Reset meta flags
        crsim_data["meta_flags"] = {};
        var addmeta = "";
        var hasbench = "";
        var benchcnt = 0;

        // Set affixes
        crsim_hasfrac = false;
        var afftcnts = {"prefix": 0, "suffix": 0, "crafted": 0};
        var affcnt = 0;
        if (crsim_data["iaffixes"]) {
            var affbytype = {"prefix": "", "suffix": "", "crafted": "", "veiled": ""};
            var othmod = 0;
            if (crsim_settings["bitem"] == 8246) {
                othmod = 0.25;
            }
            for (var i = 0; i < crsim_data["iaffixes"].length; i++) {
                affcnt++;
                if (crsim_data["iaffixes"][i]["id"] > 0) {
                    if (poecd["modifiers"]["seq"][poecd["modifiers"]["ind"][crsim_data["iaffixes"][i]["id"]]]["meta"]) {
                        crsim_data["meta_flags"][poecd["modifiers"]["seq"][poecd["modifiers"]["ind"][crsim_data["iaffixes"][i]["id"]]]["meta"]] = true;
                        addmeta += " " + poecd["modifiers"]["seq"][poecd["modifiers"]["ind"][crsim_data["iaffixes"][i]["id"]]]["meta"];
                    }
                    var catmod = poec_simParseCatValue(crsim_data["iaffixes"][i]);

                    // Tier/Name info
                    if (crsim_data["iaffixes"][i]["maven"] == 0) {
                        var tiervalid = false;
                        if (crsim_data["iaffixes"][i]["tindex"] > -1) {
                            if (poecd['tiers'][crsim_data["iaffixes"][i]["id"]][crsim_settings["base"]] == undefined) {
                                var tnum = "???";
                            } else {
                                var tnum = poecd['tiers'][crsim_data["iaffixes"][i]["id"]][crsim_settings["base"]].length - crsim_data["iaffixes"][i]["tindex"];
                                tiervalid = true;
                            }
                        } else {
                            var tnum = "???";
                        }
                        var naffix = poecl["mod"][crsim_data["iaffixes"][i]["id"]];
                        var tnaffix = poecd["modifiers"]["seq"][poecd["modifiers"]["ind"][crsim_data["iaffixes"][i]["id"]]]["name_modifier"];
                        var mtypes = poecd["modifiers"]["seq"][poecd["modifiers"]["ind"][crsim_data["iaffixes"][i]["id"]]]["mtypes"];

                        if (crsim_data["iaffixes"][i]["tindex"] > -1 && tiervalid) {
                            if (poecd['tiers'][crsim_data["iaffixes"][i]["id"]][crsim_settings["base"]][crsim_data["iaffixes"][i]["tindex"]]["alias"]) {
                                naffix = poecd['tiers'][crsim_data["iaffixes"][i]["id"]][crsim_settings["base"]][crsim_data["iaffixes"][i]["tindex"]]["alias"];
                                tnaffix = naffix;
                            }
                        }
                    } else {
                        var tnum = "E";
                        var naffix = poecd["maeven"]["ind"][crsim_data["iaffixes"][i]["maven"]]["oname"];
                        var tnaffix = poecd["maeven"]["ind"][crsim_data["iaffixes"][i]["maven"]]["oname"];
                        var mtypes = poecd["maeven"]["ind"][crsim_data["iaffixes"][i]["maven"]]["mtypes"];
                    }

                    // Output STD version

                    // Output ALT version
                    var caffix = naffix;
                    if (naffix.indexOf("#") > -1) {
                        var isplit = tnaffix.split(", ");
                        var roffset = 0;
                        for (var j = 0; j < isplit.length; j++) {
                            if (crsim_edps.indexOf("|" + isplit[j] + "|") > -1) {
                                epsfto["min"] += crsim_data["iaffixes"][i]["rolls"][roffset];
                                epsfto["max"] += crsim_data["iaffixes"][i]["rolls"][roffset + 1];
                            }
                            var numrolls = isplit[j].split("#");
                            roffset += numrolls - 1;
                        }

                        var nvalues = [];
                        if (crsim_data["iaffixes"][i]["nvalues"]) {
                            nvalues = jQuery.parseJSON(crsim_data["iaffixes"][i]["nvalues"]);
                        }
                        for (var j = 0; j < crsim_data["iaffixes"][i]["rolls"].length; j++) {
                            var addrange = "";
                            if (Array.isArray(nvalues[j])) {
                                addrange += "(" + poec_simApplyCatMod(nvalues[j][0], catmod) + "-" + poec_simApplyCatMod(nvalues[j][1], catmod) + ")";
                            }
                            naffix = naffix.replace("#", poec_simApplyCatMod(crsim_data["iaffixes"][i]["rolls"][j], catmod + othmod) + addrange);
                            caffix = caffix.replace("#", poec_simApplyCatMod(crsim_data["iaffixes"][i]["rolls"][j], catmod + othmod));
                        }
                    }
                    // Mgroup info
                    if (crsim_data["iaffixes"][i]["mgrp"] != 1) {
                        var mgroup = " \"" + poecd["mgroups"]["seq"][poecd["mgroups"]["ind"][crsim_data["iaffixes"][i]["mgrp"]]]["name_mgroup"] + "\"";
                    } else {
                        var mgroup = "";
                    }
                    // Tags info
                    var tags = poec_simParseAffixMTypes(mtypes);
                    var ihtml = "";
                    ihtml += "<div class='adet'>" + crsim_data["iaffixes"][i]["atype"] + " modifier" + mgroup + " (Tier: " + tnum + ")" + tags + "</div>";
                    var addcatlbl = "";
                    if (catmod != 1) {
                        addcatlbl += " (" + crsim_catalyst["val"] + "% Increased)";
                    }
                    if (crsim_data["iaffixes"][i]["frac"] == 1) {
                        crsim_hasfrac = true;
                    }
                    if (crsim_settings["bgroup"] == 11 || crsim_settings["bgroup"] == 15) {
                        naffix = poec_parseMapName(naffix);
                    }
                    ihtml += "<div class='affix taff bench" + crsim_data["iaffixes"][i]["bench"] + " frac" + crsim_data["iaffixes"][i]["frac"] + "' aind='" + i + "' affid='" + crsim_data["iaffixes"][i]["id"] + "'>" + naffix + addcatlbl + "</div>";
                    afftcnts[crsim_data["iaffixes"][i]["atype"]]++;

                    caffix = caffix.split(", ");

                    if (crsim_data["iaffixes"][i]["bench"] == 1) {
                        hasbench = " benched ";
                        hasbench += " bench" + crsim_data["iaffixes"][i]["atype"] + " ";
                        benchcnt++;
                        affbytype["crafted"] += ihtml;
                        afftcnts["crafted"]++;
                        for (var u = 0; u < caffix.length; u++) {
                            caffix[u] += " (crafted)";
                        }
                    } else {
                        affbytype[crsim_data["iaffixes"][i]["atype"]] += ihtml;
                    }

                    for (var u = 0; u < caffix.length; u++) {
                        vclaffs += caffix[u] + "\n";
                    }
                } else {
                    switch (crsim_data["iaffixes"][i]["id"]) {
                        case -1 :
                            var ihtml = "<div class='adet'>Veiled " + crsim_data["iaffixes"][i]["atype"] + "</div>";
                            ihtml += "<div class='affix taff veiled' aind='" + i + "' affid='" + crsim_data["iaffixes"][i]["id"] + "'><img src='images/manual/veiled.gif'/></div>";
                            afftcnts[crsim_data["iaffixes"][i]["atype"]]++;
                            affbytype["veiled"] += ihtml;
                            vaffs++;
                            break;
                    }
                }
            }
            iinfo += affbytype["prefix"] + affbytype["suffix"] + affbytype["crafted"] + affbytype["veiled"];
        }

        if (crsim_settings["corrupted"] == 1) {
            iinfo += "<div class='affix red'>" + applyLang("Corrupted") + "</div>";
            $("#simItemCol").addClass("corrupted");
        } else {
            $("#simItemCol").removeClass("corrupted");
        }

        if (benchcnt >= 3) {
            addmeta += " mmlimit ";
        }
        if (crsim_settings["influences"]) {
            addmeta += " influenced ";
        }

        $("#crsimBottomZone").find(".modpool").removeClass("benched no_caster no_attack nchg_suf nchg_pre mul_mods normal magic rare influenced mmlimit").addClass(addmeta + hasbench + crsim_settings["rarity"]);
        $("#simItemAffixes").html(iinfo);

        $("#simItemAffixes").find(".affix.taff").contextmenu(function (e) {
            poec_simToggleAffixContext(e, this);
        });

        poec_setItemOutputInfluence();

        var vINF = "";
        var tdps = {"min": 0, "max": 0};
        var atsp = parseFloat($("#simItemAffixes").find(".prop_attack_time").find(".value").text());
        if (haspdps) {
            // Update
            var min = parseInt($("#simItemAffixes").find(".prop_physical_damage_min").find(".value:eq(0)").text());
            var max = parseInt($("#simItemAffixes").find(".prop_physical_damage_min").find(".value:eq(1)").text());
            tdps["min"] += min;
            tdps["max"] += max;
            var pdps = Math.round(((min + max) / 2) * atsp);
            vINF += "<div class='stat med_shadow'><div class='lbl'>" + applyLang("pDPS") + " :</div><div class='val'>" + pdps + "</div></div>";
        }
        if (epsfto["min"] > 0) {
            var pdps = Math.round(((epsfto["min"] + epsfto["max"]) / 2) * atsp);
            tdps["min"] += epsfto["min"];
            tdps["max"] += epsfto["max"];
            vINF += "<div class='stat med_shadow'><div class='lbl'>" + applyLang("eDPS") + " :</div><div class='val'>" + pdps + "</div></div>";
        }
        if (haspdps && epsfto["min"] > 0) {
            var pdps = Math.round(((tdps["min"] + tdps["max"]) / 2) * atsp);
            vINF += "<div class='stat med_shadow'><div class='lbl'>" + applyLang("tDPS") + " :</div><div class='val'>" + pdps + "</div></div>";
        }
        if (affcnt > 0) {
            vINF += "<div class='stat med_shadow affbtype'>P<span class='p'>" + afftcnts["prefix"] + "</span> S<span class='s'>" + afftcnts["suffix"] + "</span> C<span class='c'>" + afftcnts["crafted"] + "</span></div>";
        }
        $("#simItemAInfo").html(vINF);
    }

    if (vaffs > 0) {
        $("#simUnveilZone").show();
    } else {
        $("#simUnveilZone").hide();
    }

    // Clipboard
    if (vclprop != "") {
        vCLIP += vclprop.replace("Energy shield", "Energy Shield").replace("Evasion", "Evasion Rating") + "--------\n";
    }
    if (vclreqs != "") {
        vCLIP += "Requirements:\n" + vclreqs + "--------\n";
    }
    vCLIP += "Item Level: " + crsim_settings["ilvl"] + "\n" + "--------\n";
    if (vclimps != "") {
        vCLIP += vclimps + "--------\n";
    }
    if (vclaffs != "") {
        vCLIP += vclaffs + "--------\n";
    }
    if (crsim_settings["influences"]) {
        for (var u = 0; u < crsim_settings["influences"].length; u++) {
            vCLIP += poecl["mgroup"][crsim_settings["influences"][u]] + " Item" + "\n";
        }
    }
    $("#simClipboardData").val(vCLIP);
}

function poec_simUpdateMeta() {
    if (crsim_bypass) {
        var useaffixes = crsim_bypass["iaffixes"];
        var usemetas = crsim_bypass["meta_flags"];
    } else {
        var useaffixes = crsim_data["iaffixes"];
        var usemetas = crsim_data["meta_flags"];
    }

    var addmeta = "";
    var hasbench = "";
    var benchcnt = 0;
    usemetas = {};
    for (var i = 0; i < useaffixes.length; i++) {
        if (useaffixes[i]["id"] > 0) {
            if (poecd["modifiers"]["seq"][poecd["modifiers"]["ind"][useaffixes[i]["id"]]]["meta"]) {
                usemetas[poecd["modifiers"]["seq"][poecd["modifiers"]["ind"][useaffixes[i]["id"]]]["meta"]] = true;
                addmeta += " " + poecd["modifiers"]["seq"][poecd["modifiers"]["ind"][useaffixes[i]["id"]]]["meta"];
            }
            if (useaffixes[i]["bench"] == 1) {
                hasbench = " benched ";
                benchcnt++;
            }
        }
    }

    if (crsim_bypass) {
        crsim_bypass["meta_flags"] = usemetas;
    } else {
        crsim_data["meta_flags"] = usemetas;
        $("#crsimBottomZone").find(".modpool").removeClass("benched no_caster no_attack nchg_suf nchg_pre mul_mods mmlimit").addClass(addmeta + hasbench);
    }
}

function poec_simParseCatValue(mod) {
    var val = 1;
    if (crsim_data["is_catalyst"] && crsim_catalyst) {
        for (var j = 0; j < crsim_catdata[crsim_catalyst["id"]].length; j++) {
            if (crsim_data["mtypes"][mod["id"]]) {
                if (crsim_data["mtypes"][mod["id"]]["strcheck"].indexOf("|" + crsim_catdata[crsim_catalyst["id"]][j] + "|") > -1) {
                    val += (crsim_catalyst["val"] / 100);
                    break;
                }
            }
        }
    }
    return val;
}

function poec_simParseNCatValue(mod, cat) {
    var val = 1;
    if (cat) {
        for (var j = 0; j < crsim_catdata[cat["id"]].length; j++) {
            if (crsim_data["mtypes"][mod["id"]]) {
                if (crsim_data["mtypes"][mod["id"]]["strcheck"].indexOf("|" + crsim_catdata[cat["id"]][j] + "|") > -1) {
                    val += (cat["val"] / 100);
                    break;
                }
            }
        }
    }
    return val;
}

function poec_simApplyCatMod(val, mod) {
    if (mod != 1) {
        if (val - Math.floor(val) != 0) {
            return Math.floor(((val * 100) * mod)) / 100;
        } else {
            return Math.floor(val * mod);
        }
    } else {
        return val;
    }
}

var crsim_igntypes = "|28|17|19|";

function poec_simParseAffixMTypes(mtypes) {
    if (mtypes) {
        if (mtypes.length > 1) {
            amtypes = mtypes.substring(1, mtypes.length - 1).split("|");
            var strmtypes = "";
            for (var i = 0; i < amtypes.length; i++) {
                if (poecd["mtypes"]["seq"][poecd["mtypes"]["ind"][amtypes[i]]]["jewellery_tag"] == 0) {
                    if (crsim_igntypes.indexOf("|" + amtypes[i] + "|") > -1) {
                    } else {
                        strmtypes += ", " + poecl["mtype"][amtypes[i]];
                    }
                }
            }
            strmtypes = "<span class='mtypes'> &mdash; " + strmtypes.substring(2, strmtypes.length) + "</span>";
            return strmtypes;
        } else {
            return "";
        }
    } else {
        return "";
    }
}

var crsim_infgrps = "|2|3|4|5|6|7|";
var crsim_mavengrps = "|2|3|4|5|";
var crsim_holgrps = "|2|3|4|5|";
var crsim_mavenact = false;

function poec_updateActionEnabling() {
    $.each(crsim_dreasons, function (code, artbl) {
        crsim_dreasons[code] = [];
    });
    // Filter by rarity first
    var disabled = crsim_params["disabled"];
    switch (crsim_settings["rarity"]) {
        case 'normal' :
            disabled += "alteration|augmentation|regal|chaos|exalted|scour|annul|crusader|hunter|redeemer|warlord|divine|crafting_bench|beast_crafting|hannul|harvesthannul|hdivine|harvesthdivine|hnonto|harvesthnonto|haugment|harvesthaugment|hresist|harvesthresist|hother|harvesthother|maven|breroll|veiled|syndicateaisling|syndicateleoslam|scourgescourgettexalt|scourgescourgettdivine|eldritchchaos|eldritcheldritchchaos|eldritchexalt|eldritcheldritchexalt|eldritchannul|eldritcheldritchannul|htmrt|harvesthtmrt|htmrr|harvesthtmrr|htmrf|harvesthtmrf|fracturing|";
            poec_simApplyDReason(applyLang("Cannot be used on a normal item"), ["alteration", "augmentation", "regal", "chaos", "exalted", "scour", "annul", "crusader", "hunter", "redeemer", "warlord", "divine", "crafting_bench", "beast_crafting", "hannul", "hdivine", "hnonto", "haugment", "hresist", "hother", "maven", "beast_craftingbreroll", "veiled", "syndicateaisling", "syndicateleoslam", "scourgettexalt", "scourgettdivine", "eldritchchaos", "eldritchexalt", "eldritchannul", "htmrt", "htmrr", "htmrf", "fracturing"]);
            break;
        case 'magic' :
            disabled += "transmute|alchemy|chaos|exalted|crusader|hunter|redeemer|warlord|fossil|essence|beast_craftingpretosuf|beast_craftingsuftopre|beast_craftingbreroll|veiled|syndicateaisling|syndicateleoslam|scourgescourgettexalt|scourgescourgettdivine|htnmo|harvesthtnmo|htnmt|harvesthtnmt|fracturing|";
            poec_simApplyDReason(applyLang("Cannot be used on a magic item"), ["transmute", "alchemy", "chaos", "exalted", "crusader", "hunter", "redeemer", "warlord", "fossil", "essence", "beast_craftingbreroll", "beast_craftingpretosuf", "beast_craftingsuftopre", "veiled", "syndicateaisling", "syndicateleoslam", "scourgettexalt", "scourgettdivine", "htnmo", "htnmt", "fracturing"]);
            break;
        case 'rare' :
            disabled += "transmute|alteration|augmentation|regal|alchemy|beast_craftingimprint|hhight|harvesthhight|";
            poec_simApplyDReason(applyLang("Cannot be used on a rare item"), ["transmute", "alteration", "augmentation", "regal", "alchemy", "beast_craftingimprint", "hhight"]);
            break;
    }

    /*
  if($("#simImprintZone").hasClass("imprinted")){
    disabled+="beast_craftingimprint|";
    poec_simApplyDReason(applyLang("Already imprinted"),["beast_craftingimprint"]);
  }
  */

    // Filter by influence
    var wokedis = false;
    if (crsim_settings["influences"] != null) {
        disabled += "crusader|hunter|redeemer|warlord|fracturing|";
        poec_simApplyDReason(applyLang("Already influenced"), ["crusader", "hunter", "redeemer", "warlord", "fracturing"]);
        if (crsim_settings["influences"].length > 1) {
            disabled += "woke|";
            wokedis = true;
            poec_simApplyDReason(applyLang("Already dual-influence"), ["woke"]);
        }
        disabled += "eldritch|";
        poec_simApplyDReason(applyLang("Cannot be used when conqueror influence is present"), ["eldritch"]);
    } else {
        disabled += "maven|woke|";
        poec_simApplyDReason(applyLang("Item is not influenced"), ["maven", "woke"]);

        if (!crsim_data["eldritch"]) {
            disabled += "eldritchchaos|eldritcheldritchchaos|eldritchexalt|eldritcheldritchexalt|eldritchannul|eldritcheldritchannul|eldritchconflict|eldritcheldritchconflict|";
            poec_simApplyDReason(applyLang("Item requires eldritch influence"), ["eldritchchaos", "eldritchconflict", "eldritchexalt", "eldritchannul"]);
        } else {
            if (!crsim_data["dominance"]) {
                disabled += "eldritchchaos|eldritcheldritchchaos|eldritchexalt|eldritcheldritchexalt|eldritchannul|eldritcheldritchannul|";
                poec_simApplyDReason(applyLang("Item has no dominance"), ["eldritchchaos", "eldritchexalt", "eldritchannul"]);
            }
            if (crsim_data["eldritch"]["eldritch_blue"] > 0 && crsim_data["eldritch"]["eldritch_red"] > 0) {
            } else {
                disabled += "eldritchconflict|eldritcheldritchconflict|";
                poec_simApplyDReason(applyLang("Item requires both searing and tangled modifiers to be present"), ["eldritchconflict"]);
            }
        }
    }

    if (crsim_data["eldritch"] !== null) {
        disabled += "crusader|hunter|redeemer|warlord|";
        poec_simApplyDReason(applyLang("Cannot add conqueror influence when eldritch influence is present"), ["crusader", "hunter", "redeemer", "warlord"]);
    }

    // Filter by number of affixes
    if (!Array.isArray(crsim_data["iaffixes"])) {
        crsim_data["iaffixes"] = [];
    }
    if (crsim_data["iaffixes"].length >= crsim_data["cmaxaffgrp"]["prefix"] + crsim_data["cmaxaffgrp"]["suffix"]) { // crsim_data["iaffbt"]
        disabled += "augmentation|exalted|crusader|hunter|redeemer|warlord|haugment|syndicateleoslam|";
        poec_simApplyDReason(applyLang("No space for more affixes"), ["augmentation", "exalted", "syndicateleoslam", "crusader", "hunter", "redeemer", "warlord", "haugment"]);
    }

    if (crsim_data["iaffixes"].length == 0) {
        disabled += "annul|hannul|hreplace|divine|hdivine|hnonto|"
        poec_simApplyDReason(applyLang("Nothing to remove"), ["annul", "hannul", "hnonto", "hreplace"]);
        poec_simApplyDReason(applyLang("Nothing to affect"), ["divine", "hdivine"]);
    }

    if (crsim_data["rollable_implicits"] == 0) {
        disabled += "blessed|";
        poec_simApplyDReason(applyLang("No implicit to affect"), ["blessed"]);
    }

    // Maven : check if there is at least two inf mods and if base group is body armour, boots, gloves, helmets
    crsim_mavenact = true;
    if (crsim_mavengrps.indexOf("|" + crsim_settings["bgroup"] + "|") > -1) {
        var ninfmod = 0;
        for (var i = 0; i < crsim_data["iaffixes"].length; i++) {
            if (crsim_infgrps.indexOf("|" + crsim_data["iaffixes"][i]["mgrp"] + "|") > -1) {
                ninfmod++;
            }
        }
        if (ninfmod < 2) {
            disabled += "maven|";
            poec_simApplyDReason(applyLang("Not enough influenced modifiers"), ["maven"]);
        }
    } else {
        disabled += "maven|";
        poec_simApplyDReason(applyLang("Only works on body armours, boots, gloves and helmets"), ["maven"]);
        crsim_mavenact = true;
    }

    // Check for fractured
    var ninfmods = 0;
    var vaffs = 0;
    var nveils = 0;
    var ncrafted = 0;
    //console.log(crsim_data["iaffixes"]);
    for (var i = 0; i < crsim_data["iaffixes"].length; i++) {
        if (crsim_data["iaffixes"][i]["id"] > 0) {
            if (crsim_data["iaffixes"][i]["frac"] == 1) {
                disabled += "crusader|hunter|redeemer|warlord|beast_craftingimprint|fracturing|";
                poec_simApplyDReason(applyLang("Cannot be applied on a fractured item"), ["crusader", "hunter", "redeemer", "warlord", "beast_craftingimprint", "fracturing"]);
                //break;
            }
            if (crsim_infgrps.indexOf("|" + crsim_data["iaffixes"][i]["mgrp"] + "|") > -1) {
                ninfmods++;
            }
            if (crsim_data["iaffixes"][i]["mgrp"] == 10) {
                nveils++;
            }
            if (crsim_aspectids.indexOf("|" + crsim_data["iaffixes"][i]["id"] + "|") > -1) {
                disabled += "beast_craftingbcat|beast_craftingbcrab|beast_craftingbavian|beast_craftingbspider|";
                poec_simApplyDReason(applyLang("Already an aspect crafted"), ["beast_craftingbcat", "beast_craftingbcrab", "beast_craftingbspider", "beast_craftingbavian"]);
            }
            if (crsim_data["iaffixes"][i]["bench"] == 1) {
                ncrafted++;
            }
        } else {
            if (crsim_data["iaffixes"][i]["id"] == -1) {
                vaffs++;
            }
        }
    }

    if (crsim_data["iaffixes"].length < 4) {
        disabled += "fracturing|";
        poec_simApplyDReason(applyLang("Cannot be used if item has less than 4 affixes"), ["fracturing"]);
    }

    if (vaffs > 0 || nveils > 0) {
        //console.log(vaffs);
        //console.log(nveils);
        disabled += "syndicateaisling|";
        poec_simApplyDReason(applyLang("Item already has a veiled modifier"), ["syndicateaisling"]);
    }

    /*
  if(ncrafted>0){
    disabled+="syndicateaisling|";
    poec_simApplyDReason(applyLang("Cannot be applied when item has a crafted modifier"),["syndicateaisling"]);
  }
  */

    if (crsim_data["iaffbt"]["suffix"] >= crsim_data["cmaxaffgrp"]["suffix"]) {
        disabled += "beast_craftingbcat|beast_craftingbcrab|beast_craftingbavian|beast_craftingbspider|";
        poec_simApplyDReason(applyLang("No space to add aspect"), ["beast_craftingbcat", "beast_craftingbcrab", "beast_craftingbspider", "beast_craftingbavian"]);
    }

    if (!wokedis && ninfmods == 0) {
        disabled += "woke|";
        poec_simApplyDReason(applyLang("No influenced modifier on item"), ["woke"]);
    }

    if ($("#crsimMasterModpool").is(".nchg_pre, .nchg_suf, .no_attack, .no_caster")) {
        disabled += "essence|fossil|";
        poec_simApplyDReason(applyLang("Cannot be used on an item that has a metamod (other than multimod) on it"), ["essence", "fossil"]);
    }

    if (crsim_settings["corrupted"] == 0) {
        disabled += "scourgescourgettexalt|scourgescourgettdivine|";
        poec_simApplyDReason(applyLang("Item is not corrupted"), ["scourgettexalt", "scourgettdivine"]);
    }

    // Vendor recipees
    $("#crsimSubsets").find(".acs_vendor").children(".abtn:not(.hidden)").each(function () {
        var scode = $(this).attr("scode");
        var pass = false;
        var freason = "";
        // Rarity check
        if (crsim_vendor[scode]["rarity"][crsim_settings["rarity"]] == true) {
            // Item state check (mods)
            if (crsim_vendor[scode]["mods"] != null) {
                var mfound = 0;
                for (var i = 0; i < crsim_data["iaffixes"].length; i++) {
                    if (crsim_data["iaffixes"][i]["id"] > 0) {
                        if (crsim_vendor[scode]["mods"].indexOf("|" + crsim_data["iaffixes"][i]["id"] + "|") > -1) {
                            mfound++;
                        }
                    }
                }
                if (mfound > 0) {
                    pass = true;
                } else {
                    freason = "Required mods not found";
                }
            } else {
                pass = true;
            }
        } else {
            freason = "Does not meet rarity requirement";
        }
        if (!pass) {
            disabled += "vendor" + scode + "|";
            $("#vendorSS" + scode).removeClass("sel");
            poec_simApplyDReason(applyLang(freason), ["vendor" + scode]);
        }
    });

    $.each(crsim_actions["currency"], function (acode, asets) {
        if (disabled.indexOf("|" + acode + "|") > -1 || crsim_settings["corrupted"] == 1) {
            crsim_actions["currency"][acode]["enabled"] = false;
            $("#crsimOptCur").find(".ac_" + acode).removeClass("sel").addClass("disabled");
            if (crsim_params["mode"] == "currency" && crsim_params["currency"] == acode) {
                crsim_params["mode"] = null;
                crsim_params["currency"] = null;
            }
        } else {
            crsim_actions["currency"][acode]["enabled"] = true;
            $("#crsimOptCur").find(".ac_" + acode).removeClass("disabled");
        }
    });

    $.each(crsim_actions["actions"], function (acode, asets) {
        if (disabled.indexOf("|" + acode + "|") > -1 || (crsim_settings["corrupted"] == 1 && acode != "scourge")) {
            crsim_actions["actions"][acode]["enabled"] = false;
            $("#crsimActions").find(".ac_" + acode).removeClass("sel").addClass("disabled");
            if (crsim_params["mode"] == "action" && crsim_params["action"] == acode) {
                crsim_params["mode"] = null;
                crsim_params["action"] = null;
                crsim_params["subaction"] = null;
                crsim_params["ssaction"] = null;
            }
        } else {
            crsim_actions["actions"][acode]["enabled"] = true;
            $("#crsimActions").find(".ac_" + acode).removeClass("disabled");

            // Subset
            if (crsim_actions["actions"][acode]["subset"] != undefined) {
                $.each(crsim_actions["actions"][acode]["subset"], function (scode, ssets) {
                    if (disabled.indexOf("|" + acode + scode + "|") > -1) {
                        $("#crsimSubsets").find(".acs_" + acode).find(".acs_" + acode + scode).removeClass("sel").addClass("disabled");
                        if (crsim_params["subaction"] == scode) {
                            crsim_params["subaction"] = null;
                            crsim_params["ssaction"] = null;
                        }
                    } else {
                        $("#crsimSubsets").find(".acs_" + acode).find(".acs_" + acode + scode).removeClass("disabled");
                    }
                    switch (acode + scode) {
                        case "harvesthhight" :
                            $("#harvestHightierChooser").find("div.abtn").removeClass("disabled");
                            $("#harvestHightierChooser").find("div.abtn").each(function () {
                                var sscode = $(this).attr("sscode");
                                if (disabled.indexOf("|" + sscode + "|") > -1) {
                                    $(this).removeClass("sel").addClass("disabled");
                                    if (crsim_params["ssaction"] == sscode) {
                                        crsim_params["ssaction"] = null;
                                    }
                                }
                            });
                            break;
                    }
                });
            }
        }
    });

    poec_simChangeCursor();
}

/**************/
/* MAIN LOGIC */
/**************/
var csflashtm = null;

function poec_simApplyCraft() {
    if ($("#simItemHoverer").hasClass("capply")) {
        // Flash cursor
        clearTimeout(csflashtm);
        $("#simItemHoverer").css({"cursor": "none"});
        csflashtm = setTimeout(function () {
            $("#simItemHoverer").css({"cursor": crsim_params["cursor"]});
            poec_simApplyCraftGO(null, null, false);
        }, 75);
    }
}

var crsim_rmptm = null;
var crsim_fossiling = false;

function poec_simApplyCraftGO(forced, override, nolog) {
    if (!override) {
        crsim_bypass = null;
        var craftDetail = {
            "add": null,
            "upg": null,
            "rem": null,
            "sts": null,
            "det": null,
            "nums": 1,
            "ilvl": crsim_settings["ilvl"],
            "quality": crsim_settings["quality"],
            "bitem": crsim_settings["bitem"],
            "base": crsim_settings["base"],
            "bgroup": crsim_settings["bgroup"],
            "destroyed": crsim_settings["destroyed"],
            "corrupted": crsim_settings["corrupted"],
            "rarity": crsim_settings["rarity"],
            "imprint": null,
            "catalyst": jQuery.parseJSON(JSON.stringify(crsim_catalyst)),
            "influences": jQuery.parseJSON(JSON.stringify(crsim_settings["influences"])),
            "affixes": jQuery.parseJSON(JSON.stringify(crsim_data["iaffixes"])),
            "eldritch": jQuery.parseJSON(JSON.stringify(crsim_data["eldritch"])),
            "implicits": jQuery.parseJSON(JSON.stringify(crsim_data["implicits"])),
            "psn": {"prefix": crsim_data["iaffbt"]["prefix"], "suffix": crsim_data["iaffbt"]["suffix"]}
        };
        var crafts = {
            "mode": crsim_params["mode"],
            "action": crsim_params["action"],
            "subaction": crsim_params["subaction"],
            "ssaction": crsim_params["ssaction"]
        };

        var useisrare = crsim_data["is_rare"];
        var useiaffbt = crsim_data["iaffbt"];
        var useaffixes = crsim_data["iaffixes"];
        var useimplicits = crsim_data["implicits"];
        var usedominance = crsim_data["dominance"];
        var useldritch = crsim_data["eldritch"];
        var usecmaxaffgrp = crsim_data["cmaxaffgrp"];
        var usefmodpool = crsim_data["fmodpool"];
        var usebase = crsim_settings["base"];
        var useimprint = crsim_data["imprint"];
        var usecorrupted = crsim_settings["corrupted"];
        var usequality = crsim_settings["quality"];
        var useinfluence = crsim_settings["influences"];
        var usecatalyst = crsim_catalyst;
        var usemgrpdata = crsim_mgrpdata;
        var usecuressmod = crsim_curessmod;
        var usetmetas = crsim_data["meta_flags"];
    } else {
        var craftDetail = {};
        if (override["mode"] == "currency") {
            var trueaction = override["action"];
        } else {
            var trueaction = override["mode"];
            override["mode"] = "action";
        }
        var crafts = {
            "mode": override["mode"],
            "action": trueaction,
            "subaction": override["action"],
            "ssaction": override["subaction"]
        };

        var useisrare = crsim_bypass["is_rare"];
        var useiaffbt = crsim_bypass["iaffbt"];
        var useaffixes = crsim_bypass["iaffixes"];
        var useimplicits = crsim_bypass["implicits"];
        var usedominance = crsim_bypass["dominance"];
        var useldritch = crsim_bypass["eldritch"];
        var usecmaxaffgrp = crsim_bypass["cmaxaffgrp"];
        var usefmodpool = crsim_bypass["fmodpool"];
        var usebase = crsim_bypass["base"]
        var useimprint = crsim_bypass["imprint"];
        var usecorrupted = crsim_bypass["corrupted"];
        var usequality = crsim_bypass["quality"];
        var useinfluence = crsim_bypass["influences"];
        var usecatalyst = crsim_bypass["catalyst"];
        var usemgrpdata = crsim_bypass["mgrpdata"];
        var usecuressmod = crafts["subaction"];
        var usetmetas = crsim_bypass["meta_flags"];
    }

    var success = true;

    if (forced) {
        if (forced["bench"] == true) {
            // Check if there is a veiled affix, if so, prevent action (nerf)
            var hasveiled = false;
            for (var i = 0; i < crsim_data["iaffixes"].length; i++) {
                if (crsim_data["iaffixes"][i]["id"] > 0) {
                } else {
                    hasveiled = true;
                }
            }
            if (hasveiled) {
                /*
        success=false;
        forced["action"]='fail';
        var errtxt="Cannot add a bench craft to an item that has a veiled modifier";
        $("#simItemHoverer").mcuiNotice({text:errtxt,type:"alert"}).showNotice();
        $("#simItemHoverer").mcuiNotice().setText(errtxt);
        crsim_lock=false;
        */
            }
            // Check if there is a veiled affix, if so, remove it (nerfed)
            /*
      var naffixes=[];
      crsim_data["iaffbt"]={"prefix":0,"suffix":0};
      for(var i=0;i<crsim_data["iaffixes"].length;i++){
        if(crsim_data["iaffixes"][i]["id"]>0){
          naffixes.push(crsim_data["iaffixes"][i]);
          crsim_data["iaffbt"][crsim_data["iaffixes"][i]["atype"]]++;
        }
      }
      crsim_data["iaffixes"]=jQuery.parseJSON(JSON.stringify(naffixes));
      */
        }

        if (forced["bench"] == true) {
            // Check if there is a benched fractured and force fail if so
            var hasmultimod = false;
            var hasfracbench = false;
            for (var i = 0; i < crsim_data["iaffixes"].length; i++) {
                if (crsim_data["iaffixes"][i]["id"] == 2964) {
                    hasmultimod = true;
                }
                if (crsim_data["iaffixes"][i]["mgrp"] == 11 && crsim_data["iaffixes"][i]["frac"] == 1) {
                    hasfracbench = true;
                }
            }
            if (hasfracbench && !hasmultimod) {
                success = false;
                forced["action"] = 'fail';
                var errtxt = "Cannot add a bench craft to an item that has a fracture bench modifier";
                $("#simItemHoverer").mcuiNotice({text: errtxt, type: "alert"}).showNotice();
                $("#simItemHoverer").mcuiNotice().setText(errtxt);
                crsim_lock = false;
            }
        }

        switch (forced["action"]) {
            case 'unveil' :
                crsim_data["iaffixes"][forced["swapindex"]] = {
                    "atype": poecd["modifiers"]["seq"][poecd["modifiers"]["ind"][forced["mid"]]]["affix"],
                    "bench": 0,
                    "frac": 0,
                    "maven": 0,
                    "id": forced["mid"],
                    "mgrp": crsim_veiledmgrp,
                    "modgroups": poecd["modifiers"]["seq"][poecd["modifiers"]["ind"][forced["mid"]]]["modgroups"],
                    "nvalues": poecd["tiers"][forced["mid"]][crsim_settings["base"]][0]["nvalues"],
                    "rolls": jQuery.parseJSON(forced["nvalues"]),
                    "tindex": 0,
                    "weight": poecd["tiers"][forced["mid"]][crsim_settings["base"]][0]["weighting"]
                };
                break;
            case 'rem' :
                // Remove
                var naffarr = [];
                for (var i = 0; i < crsim_data["iaffixes"].length; i++) {
                    if (crsim_data["iaffixes"][i]["id"] == forced["affid"]) {
                        craftDetail["rem"] = jQuery.parseJSON(JSON.stringify(crsim_data["iaffixes"][i]));
                        crsim_data["iaffbt"][crsim_data["iaffixes"][i]["atype"]]--;
                    } else {
                        naffarr.push(jQuery.parseJSON(JSON.stringify(crsim_data["iaffixes"][i])));
                    }
                }
                crsim_data["iaffixes"] = naffarr;
                break;
            case 'swap' :
                if (forced["trueswap"]) {
                    for (var i = 0; i < crsim_data["iaffixes"].length; i++) {
                        if (crsim_data["iaffixes"][i]["id"] == forced["affid"]) {
                            craftDetail["rem"] = jQuery.parseJSON(JSON.stringify(crsim_data["iaffixes"][i]));
                            if (forced["tindex"] == "e") {
                                crsim_data["iaffixes"][i]["maven"] = poecd["maeven"]["bmods"][crsim_settings["base"] + "-" + crsim_data["iaffixes"][i]["id"]];
                                crsim_data["iaffixes"][i]["tindex"] = "e";
                                crsim_data["iaffixes"][i]["nvalues"] = poecd["maeven"]["ind"][crsim_data["iaffixes"][i]["maven"]]["nvalues"];
                                crsim_data["iaffixes"][i]["rolls"] = poec_simRollValues(poecd["maeven"]["ind"][crsim_data["iaffixes"][i]["maven"]]["nvalues"]);
                            } else {
                                crsim_data["iaffixes"][i]["maven"] = 0;
                                crsim_data["iaffixes"][i]["tindex"] = forced["tindex"];
                                crsim_data["iaffixes"][i]["nvalues"] = poecd['tiers'][forced["affid"]][crsim_settings["base"]][forced["tindex"]]["nvalues"];
                                crsim_data["iaffixes"][i]["rolls"] = poec_simRollValues(poecd['tiers'][forced["affid"]][crsim_settings["base"]][forced["tindex"]]["nvalues"]);
                            }
                            craftDetail["add"] = [jQuery.parseJSON(JSON.stringify(crsim_data["iaffixes"][i]))];
                            break;
                        }
                    }
                } else {
                    // REM/ADD
                    var naffarr = [];
                    for (var i = 0; i < crsim_data["iaffixes"].length; i++) {
                        if (crsim_data["iaffixes"][i]["bench"] == 1) { // Remove the bench mod
                            craftDetail["rem"] = jQuery.parseJSON(JSON.stringify(crsim_data["iaffixes"][i]));
                            crsim_data["iaffbt"][crsim_data["iaffixes"][i]["atype"]]--;
                        } else {
                            naffarr.push(jQuery.parseJSON(JSON.stringify(crsim_data["iaffixes"][i])));
                        }
                    }
                    crsim_data["iaffixes"] = naffarr;
                    var newaff = {
                        "atype": poecd["modifiers"]["seq"][poecd["modifiers"]["ind"][forced["affid"]]]["affix"],
                        "id": forced["affid"],
                        "mgrp": poecd["modifiers"]["seq"][poecd["modifiers"]["ind"][forced["affid"]]]["id_mgroup"],
                        "modgroups": crsim_mgrpdata[forced["affid"]],
                        "nvalues": poecd['tiers'][forced["affid"]][crsim_settings["base"]][forced["tindex"]]["nvalues"],
                        "rolls": poec_simRollValues(poecd['tiers'][forced["affid"]][crsim_settings["base"]][forced["tindex"]]["nvalues"]),
                        "tindex": forced["tindex"],
                        "weight": poecd['tiers'][forced["affid"]][crsim_settings["base"]][forced["tindex"]]["weighting"],
                        "bench": 1,
                        "frac": 0,
                        "maven": 0
                    };
                    crsim_data["iaffixes"].push(newaff);
                    craftDetail["add"] = [newaff];
                    crsim_data["iaffbt"][poecd["modifiers"]["seq"][poecd["modifiers"]["ind"][forced["affid"]]]["affix"]]++;
                }
                break;
            case 'add' :
                // Check for inf validity
                var blockinf = false;
                var newinf = false;
                var ifrac = false;
                if (crsim_infgrps.indexOf("|" + poecd["modifiers"]["seq"][poecd["modifiers"]["ind"][forced["affid"]]]["id_mgroup"] + "|") > -1) {
                    if (crsim_hasfrac) {
                        ifrac = true;
                        blockinf = true;
                    } else {
                        if (crsim_settings["influences"]) {
                            var ifound = false;
                            for (var i = 0; i < crsim_settings["influences"].length; i++) {
                                if (poecd["modifiers"]["seq"][poecd["modifiers"]["ind"][forced["affid"]]]["id_mgroup"] == crsim_settings["influences"][i]) {
                                    ifound = true;
                                }
                            }
                            if (!ifound) {
                                if (crsim_settings["influences"].length >= 2) {
                                    blockinf = true;
                                } else {
                                    newinf = true;
                                }
                            }
                        } else {
                            newinf = true;
                        }
                    }
                }

                if (blockinf) {
                    success = false;
                    if (ifrac) {
                        var errtxt = applyLang("Cannot add an influence on a fractured item");
                    } else {
                        var errtxt = applyLang("Cannot add a third influence");
                    }
                    $("#simItemHoverer").mcuiNotice({text: errtxt, type: "alert"}).showNotice();
                    $("#simItemHoverer").mcuiNotice().setText(errtxt);
                } else {
                    var bench = 0;
                    if (forced["ptype"] == "cb") {
                        bench = 1;
                    }
                    var newaff = {
                        "atype": poecd["modifiers"]["seq"][poecd["modifiers"]["ind"][forced["affid"]]]["affix"],
                        "id": forced["affid"],
                        "mgrp": poecd["modifiers"]["seq"][poecd["modifiers"]["ind"][forced["affid"]]]["id_mgroup"],
                        "modgroups": crsim_mgrpdata[forced["affid"]],
                        "tindex": forced["tindex"],
                        "bench": bench,
                        "frac": 0
                    };
                    if (forced["tindex"] == "e") {
                        newaff["maven"] = poecd["maeven"]["bmods"][crsim_settings["base"] + "-" + forced["affid"]];
                        newaff["nvalues"] = poecd["maeven"]["ind"][newaff["maven"]]["nvalues"];
                        newaff["rolls"] = poec_simRollValues(poecd["maeven"]["ind"][newaff["maven"]]["nvalues"]);
                        newaff["weight"] = 0;
                    } else {
                        newaff["maven"] = 0;
                        newaff["nvalues"] = poecd['tiers'][forced["affid"]][crsim_settings["base"]][forced["tindex"]]["nvalues"];
                        newaff["rolls"] = poec_simRollValues(poecd['tiers'][forced["affid"]][crsim_settings["base"]][forced["tindex"]]["nvalues"]);
                        newaff["weight"] = poecd['tiers'][forced["affid"]][crsim_settings["base"]][forced["tindex"]]["weighting"]
                    }
                    crsim_data["iaffixes"].push(newaff);
                    craftDetail["add"] = [newaff];
                    crsim_data["iaffbt"][poecd["modifiers"]["seq"][poecd["modifiers"]["ind"][forced["affid"]]]["affix"]]++;
                    // Check to switch rarity
                    var nrarity = "normal";
                    if (crsim_data["iaffixes"].length > 0) {
                        nrarity = "magic";
                        if (crsim_data["iaffbt"]["prefix"] > 1 || crsim_data["iaffbt"]["suffix"] > 1) {
                            nrarity = "rare";
                        }
                    }
                    if ((nrarity == "magic" || nrarity == "normal") && crsim_settings["rarity"] == "rare") {
                        nrarity = "rare";
                    }
                    poec_simSetRarity(nrarity);
                    if (newinf) {
                        if (!crsim_settings["influences"]) {
                            crsim_settings["influences"] = [];
                        }
                        crsim_settings["influences"].push(poecd["modifiers"]["seq"][poecd["modifiers"]["ind"][forced["affid"]]]["id_mgroup"]);
                    }
                }
                break;
            case 'frac' :
                if (forced["extra"] == 1) {
                    craftDetail["add"] = [jQuery.parseJSON(JSON.stringify(crsim_data["iaffixes"][forced["tindex"]]))];
                } else {
                    craftDetail["rem"] = jQuery.parseJSON(JSON.stringify(crsim_data["iaffixes"][forced["tindex"]]));
                }
                crsim_data["iaffixes"][forced["tindex"]]["frac"] = forced["extra"];
                break;
            default  :
                break;
        }
    } else {
        crsim_fossiling = false;
        if (crafts["mode"] == "action" && crafts["action"] == "fossil") {
            var newsel = poec_simParsePoolFossils(crafts["subaction"]);
            //if(newsel.length>0){
            crsim_fossiling = poec_workoutFOMTypes(newsel, crafts["ssaction"]);
            crsim_fossiling["strfossils"] = "|";
            for (var z = 0; z < newsel.length; z++) {
                crsim_fossiling["strfossils"] += newsel[z] + "|";
            }
            //}
        }

        switch (crafts["mode"]) {
            case 'currency' :
                // Double-check option validity
                var cpass = true;
                var usecurrency = crsim_params["currency"];
                if (override) {
                    usecurrency = crafts["action"];
                } else {
                    cpass = crsim_actions["currency"][crsim_params["currency"]]["enabled"];
                }
                if (cpass) {
                    switch (usecurrency) {
                        case 'transmute' :
                            poec_simSetRarity("magic");
                            poec_simRerollItem("magic", null, null, null, false, false, false, false, null, false, false, false, false);
                            break;
                        case 'alteration' :
                            poec_simRerollItem("magic", null, null, null, false, false, false, true, null, false, false, false, false);
                            break;
                        case 'augmentation' :
                            craftDetail["add"] = poec_simRollAffix(null, null, null, null, 1, true, true, false, false, false, false, null, false);
                            poec_remCatQuality(2);
                            break;
                        case 'regal' :
                            poec_simSetRarity("rare");
                            craftDetail["add"] = poec_simRollAffix(null, null, null, null, 1, true, true, false, false, false, false, null, false);
                            poec_remCatQuality(5);
                            break;
                        case 'alchemy' :
                            poec_simSetRarity("rare");
                            poec_simRerollItem("rare", null, null, null, false, false, false, false, null, false, false, false, false);
                            break;
                        case 'chaos' :
                            poec_simRerollItem("rare", null, null, null, false, false, false, true, null, false, false, false, false);
                            break;
                        case 'exalted' :
                            var ret = poec_simRollAffix(null, null, null, null, 1, true, true, false, false, false, false, null, false);
                            if (ret.length > 0) {
                                craftDetail["add"] = ret;
                                poec_remCatQuality(20);
                            } else {
                                success = false;
                                if (!override) {
                                    var errtxt = applyLang("No mod available to add in the pool");
                                    $("#simItemHoverer").mcuiNotice({text: errtxt, type: "alert"}).showNotice();
                                    $("#simItemHoverer").mcuiNotice().setText(errtxt);
                                } else {
                                    poec_simThrowError(applyLang("No mod available to add in the pool"));
                                }
                            }
                            break;
                        case 'scour' :
                            poec_simClearItem(true);
                            break;
                        case 'annul' :
                            craftDetail["rem"] = poec_simRemoveAffix(null, null, null, true, false, true, false, true, null);
                            poec_remCatQuality(20);
                            break;
                        case 'vaal' :
                            craftDetail["sts"] = poec_simCorrupt(crsim_vaaltbl, crafts);
                            break;
                        case 'crusader' :
                            poec_simAddInfluence(4);
                            craftDetail["add"] = poec_simRollAffix(4, null, null, null, 1, true, true, false, false, false, false, null, false);
                            poec_remCatQuality(20);
                            break;
                        case 'redeemer' :
                            poec_simAddInfluence(7);
                            craftDetail["add"] = poec_simRollAffix(7, null, null, null, 1, true, true, false, false, false, false, null, false);
                            poec_remCatQuality(20);
                            break;
                        case 'hunter' :
                            poec_simAddInfluence(5);
                            craftDetail["add"] = poec_simRollAffix(5, null, null, null, 1, true, true, false, false, false, false, null, false);
                            poec_remCatQuality(20);
                            break;
                        case 'warlord' :
                            poec_simAddInfluence(6);
                            craftDetail["add"] = poec_simRollAffix(6, null, null, null, 1, true, true, false, false, false, false, null, false);
                            poec_remCatQuality(20);
                            break;
                        case 'blessed' :
                            craftDetail["sts"] = poec_simRerollImplicits(false);
                            break;
                        case 'divine' :
                            craftDetail["sts"] = poec_simRerollValues(null, null, false);
                            break;
                        case 'fracturing' :
                            var rndpick = poec_rand(0, useaffixes.length, true);
                            useaffixes[rndpick]["frac"] = 1;
                            break;
                        case 'veiled' :
                            // Check for veiled lock
                            var hasveiled = {"prefix": false, "suffix": false};
                            var haslock = {"prefix": false, "suffix": false};
                            var hasfrac = false;
                            for (var i = 0; i < useaffixes.length; i++) {
                                if (useaffixes[i]["mgrp"] == 10 || useaffixes[i]["mgrp"] == -1) {
                                    hasveiled[useaffixes[i]["atype"]] = true;
                                    if (useaffixes[i]["frac"]) {
                                        hasfrac = true;
                                    }
                                }
                                if (useaffixes[i]["mgrp"] == 11) {
                                    // Check if its a veiled crafted mod
                                    // Check if there is a veiled mod (10) that is equivalent
                                    if (usefmodpool["prefix"][10]) {
                                        for (var zj = 0; zj < usefmodpool["prefix"][10].length; zj++) {
                                            if (poecl["mod"][usefmodpool["prefix"][10][zj]["id_modifier"]] == poecl["mod"][useaffixes[i]["id"]]) {
                                                hasveiled[useaffixes[i]["atype"]] = true;
                                                if (useaffixes[i]["frac"]) {
                                                    hasfrac = true;
                                                }
                                            }
                                        }
                                    }
                                    if (usefmodpool["suffix"][10]) {
                                        for (var zj = 0; zj < usefmodpool["suffix"][10].length; zj++) {
                                            if (poecl["mod"][usefmodpool["suffix"][10][zj]["id_modifier"]] == poecl["mod"][useaffixes[i]["id"]]) {
                                                hasveiled[useaffixes[i]["atype"]] = true;
                                                if (useaffixes[i]["frac"]) {
                                                    hasfrac = true;
                                                }
                                            }
                                        }
                                    }
                                    /*
                  for(var zy=0;zy<useaffixes[i]["modgroups"].length;zy++){
                    if(crsim_affbymgrp[useaffixes[i]["modgroups"][zy]]!=undefined){
                      for(var j=0;j<crsim_affbymgrp[useaffixes[i]["modgroups"][zy]].length;j++){
                        if(crsim_affbymgrp[useaffixes[i]["modgroups"][zy]][j]!=useaffixes[i]["id"]){
                          if(poecd['modifiers']['seq'][poecd['modifiers']['ind'][crsim_affbymgrp[useaffixes[i]["modgroups"][zy]][j]]]["id_mgroup"]==10){
                            hasveiled[useaffixes[i]["atype"]]=true;
                            if(useaffixes[i]["frac"]){
                              hasfrac=true;
                            }
                          }
                        }
                      }
                    }
                  }
                  */
                                }
                                if (useaffixes[i]["modgroups"]) {
                                    for (var zy = 0; zy < useaffixes[i]["modgroups"].length; zy++) {
                                        switch (useaffixes[i]["modgroups"][zy]) {
                                            case 'ItemGenerationCannotChangePrefixes' :
                                                haslock["prefix"] = true;
                                                break;
                                            case 'ItemGenerationCannotChangeSuffixes' :
                                                haslock["suffix"] = true;
                                                break;
                                        }
                                    }
                                }
                            }

                            if ((hasveiled["prefix"] && haslock["prefix"]) || (hasveiled["suffix"] && haslock["suffix"]) || hasfrac) {
                                var errtxt = "Could not generate mod (Can't use while veiled affix is present)";
                                //var errtxt="Could not generate mod (Locking a veiled/crafted affix to use a veiled chaos orb is not allowed)";
                                success = false;
                                crsim_lock = false;
                                if (!override) {
                                    $("#simItemHoverer").mcuiNotice({text: errtxt, type: "alert"}).showNotice();
                                    $("#simItemHoverer").mcuiNotice().setText(errtxt);
                                } else {
                                    poec_simThrowError(applyLang(errtxt));
                                }
                            } else {
                                poec_simRerollItem("rare", null, null, null, false, false, false, true, null, false, false, true, false);
                            }
                            break;
                        case 'woke' :
                            var cont = true;
                            if (override) {
                                cont = poec_simAwaken(override["woking"]);
                            }
                            if (cont) {
                                useinfluence.push(poec_simWokePick["m2"]["mgrp"]);
                                if (override) {
                                    crsim_bypass["influences"] = useinfluence;
                                } else {
                                    crsim_settings["influences"] = useinfluence;
                                }
                                poec_simSetRarity("rare");
                                console.log(poec_simWokePick);
                                poec_simRerollItem("rare", null, null, null, true, false, false, false, null, poec_simWokePick, false, false, false);
                            }
                            break;
                        case 'maven' :
                            success = false;
                            // Get the number of upgradable influence mods
                            var nelig = [];
                            for (var i = 0; i < useaffixes.length; i++) {
                                if (crsim_infgrps.indexOf("|" + useaffixes[i]["mgrp"] + "|") > -1) {
                                    var atype = useaffixes[i]["atype"];
                                    var metaprotect = false;
                                    if (atype == "prefix") {
                                        if (usetmetas["nchg_pre"]) {
                                            metaprotect = true;
                                        }
                                    } else {
                                        if (usetmetas["nchg_suf"]) {
                                            metaprotect = true;
                                        }
                                    }
                                    if (!metaprotect) {
                                        nelig.push(i);
                                    }
                                }
                            }
                            if (nelig.length >= 2) {
                                // If >=2 , pick one at random to be removed
                                var rndpick = poec_rand(0, nelig.length, true);
                                var rchc = 1 / nelig.length;
                                var rem = nelig.splice(rndpick, 1);
                                rem = rem[0];
                                // From the rest, pick one at random to be upgraded one tier (up to elevated)
                                var rndpick = poec_rand(0, nelig.length, true);
                                var uchc = 1 / nelig.length;
                                var aug = nelig[rndpick];
                                // Check if we upgrade tier or tag as maven
                                var ntiers = poecd['tiers'][useaffixes[aug]["id"]][usebase].length; // Current assumption is it can bypass ilvl
                                craftDetail["upg"] = jQuery.parseJSON(JSON.stringify(useaffixes[aug]));
                                craftDetail["upg"]["chance"] = uchc;
                                if (useaffixes[aug]["tindex"] + 1 == ntiers || useaffixes[aug]["tindex"] == "e") {
                                    // Upgrade to maven
                                    useaffixes[aug]["maven"] = poecd["maeven"]["bmods"][usebase + "-" + useaffixes[aug]["id"]];
                                    useaffixes[aug]["nvalues"] = poecd["maeven"]["ind"][useaffixes[aug]["maven"]]["nvalues"];
                                    useaffixes[aug]["rolls"] = poec_simRollValues(poecd["maeven"]["ind"][useaffixes[aug]["maven"]]["nvalues"]);
                                    useaffixes[aug]["tindex"] = "e";
                                    useaffixes[aug]["weight"] = 0;
                                } else {
                                    // Upgrade one tier
                                    var utier = poecd['tiers'][useaffixes[aug]["id"]][usebase][useaffixes[aug]["tindex"] + 1];
                                    useaffixes[aug]["nvalues"] = utier["nvalues"];
                                    useaffixes[aug]["rolls"] = poec_simRollValues(utier["nvalues"]);
                                    useaffixes[aug]["tindex"] = useaffixes[aug]["tindex"] + 1;
                                    useaffixes[aug]["weight"] = utier["weighting"];
                                }
                                // Remove other mod
                                useiaffbt[useaffixes[rem]["atype"]]--;
                                craftDetail["rem"] = jQuery.parseJSON(JSON.stringify(useaffixes[rem]));
                                craftDetail["rem"]["chance"] = rchc;
                                var affcopy = jQuery.parseJSON(JSON.stringify(useaffixes));
                                useaffixes.splice(rem, 1);
                                success = true;

                                if (!override) {
                                    crsim_data["iaffixes"] = useaffixes;
                                    crsim_data["iaffbt"] = useiaffbt;
                                } else {
                                    crsim_bypass["iaffixes"] = useaffixes;
                                    crsim_bypass["iaffbt"] = useiaffbt;
                                }
                            } else {
                                var errtxt = applyLang("Not enough eligible affixes present");
                                if (!override) {
                                    $("#simItemHoverer").mcuiNotice({text: errtxt, type: "alert"}).showNotice();
                                    $("#simItemHoverer").mcuiNotice().setText(errtxt);
                                } else {
                                    poec_simThrowError(errtxt);
                                }
                            }
                            break;
                    }
                    if (success && !override) {
                        crsim_spending["currency"][crsim_params["currency"]]++;
                        poec_simUpdateSpending("currency", crsim_params["currency"], crsim_spending["currency"][crsim_params["currency"]], null);
                    }
                } else {
                    success = false;
                    console.log("Currency option disabled, should not happen");
                }
                break;
            case 'action' :
                success = false;
                switch (crafts["action"]) {
                    case 'recombinate' :
                        success = true;
                        break;
                    case 'corruption_altar' :
                        craftDetail["sts"] = poec_simCorrupt(crsim_locustbl, crafts);
                        success = true;
                        break;
                    case 'essence' :
                        var etier = crafts["ssaction"];

                        // The item already has a mod of this type
                        var efail = false;
                        for (var i = 0; i < useaffixes.length; i++) {
                            if (useaffixes[i]["frac"]) {
                                for (var zy = 0; zy < poecd["modifiers"]["seq"][poecd["modifiers"]["ind"][usecuressmod]]["modgroups"].length; zy++) {
                                    for (var zw = 0; zw < useaffixes[i]["modgroups"].length; zw++) {
                                        if (poecd["modifiers"]["seq"][poecd["modifiers"]["ind"][usecuressmod]]["modgroups"][zy] == useaffixes[i]["modgroups"][zw]) {
                                            efail = true;
                                        }
                                    }
                                }
                            }
                        }

                        if (efail) {
                            var errtxt = applyLang("The item already has a mod of this type");
                            if (!override) {
                                $("#simItemHoverer").mcuiNotice({text: errtxt, type: "alert"}).showNotice();
                                $("#simItemHoverer").mcuiNotice().setText(errtxt);
                            } else {
                                poec_simThrowError(applyLang(errtxt));
                            }
                        } else {
                            poec_simRerollItem("rare", null, [{
                                "mod": usecuressmod,
                                "tier": etier
                            }], null, false, false, false, false, null, false, false, false, false);
                            if (!override) {
                                poec_simUpdateSpending("action", "essence", 1, null);
                            }
                            success = true;
                        }
                        break;
                    case 'catalyst' :
                        if (override) {
                            var userarity = crsim_bypass["rarity"];
                        } else {
                            var userarity = crsim_settings["rarity"];
                        }
                        success = true;
                        var cinc = 5;
                        switch (userarity) {
                            case 'magic' :
                                cinc = 2;
                                break;
                            case 'rare' :
                                cinc = 1;
                                break;
                        }
                        var numused = 1;
                        if (crafts["ssaction"] == "max") {
                            if (usecatalyst) {
                                var numused = Math.ceil((20 - usecatalyst["val"]) / cinc);
                            } else {
                                var numused = Math.ceil(20 / cinc);
                            }
                            cinc = 20;
                        }
                        var rstcata = false;
                        if (usecatalyst) {
                            if (usecatalyst["id"] == crafts["subaction"]) {
                                if (usecatalyst["val"] >= 20) {
                                    var errtxt = applyLang("Already at maximum value");
                                    if (!override) {
                                        $("#simItemHoverer").mcuiNotice({errtxt, type: "alert"}).showNotice();
                                        $("#simItemHoverer").mcuiNotice().setText(errtxt);
                                    } else {
                                        poec_simThrowError(applyLang(errtxt));
                                    }
                                    success = false;
                                } else {
                                    usecatalyst["val"] += cinc;
                                    if (usecatalyst["val"] >= 20) {
                                        usecatalyst["val"] = 20;
                                    }
                                }
                            } else {
                                rstcata = true;
                            }
                        } else {
                            rstcata = true;
                        }
                        if (rstcata) {
                            usecatalyst = {"id": crafts["subaction"], "val": cinc};
                        }
                        if (success) {
                            if (override) {
                                crsim_bypass["catalyst"] = usecatalyst;
                            } else {
                                crsim_catalyst = usecatalyst;
                                craftDetail["nums"] = numused;
                                poec_simUpdateSpending("action", "catalyst", numused, null);
                            }
                        }
                        break;
                    case 'fossil' :
                        success = true;
                        if (crafts["subaction"] != undefined) {
                            if (crafts["subaction"].length > 0) {
                                // Special fossils PRE
                                var ferr = false;
                                var addmods = null;
                                for (var m = 0; m < crafts["subaction"].length; m++) {
                                    if (crsim_specialfossils.indexOf("|" + crafts["subaction"][m] + "|") > -1) {
                                        switch (crafts["subaction"][m]) {
                                            case '20' : // Glyphic
                                                // Pick an essence modifier
                                                var glyphs = [];
                                                for (var i = 0; i < poecd["essences"]["seq"].length; i++) {
                                                    if (poecd["essences"]["seq"][i]["corrupt"] == "1") {
                                                        var tiers = jQuery.parseJSON(poecd["essences"]["seq"][i]["tiers"]);
                                                        var gmod = poecd["modifiers"]["seq"][poecd["modifiers"]["ind"][tiers[usebase]]];
                                                        glyphs.push(gmod);
                                                    }
                                                }
                                                if (glyphs.length == 0) {
                                                    ferr = "Could not find corrupted essence modifiers";
                                                } else {
                                                    if (override) {
                                                        var usemtypes = crsim_bypass["mtypes"];
                                                    } else {
                                                        var usemtypes = crsim_data["mtypes"];
                                                    }
                                                    // Base weight of 1000 per mod
                                                    // Modify weighting according to other fossils in the selection
                                                    // Pick one affix and force it on the item for the reroll
                                                    var totw = 0;
                                                    var arre = [];
                                                    for (var i = 0; i < glyphs.length; i++) {
                                                        var fmod = {
                                                            "tmtypes": usemtypes[glyphs[i]["id_modifier"]]["strcheck"],
                                                            "mtypes": usemtypes[glyphs[i]["id_modifier"]]["mtarr"]
                                                        };
                                                        modw = poec_getModdedWeight(fmod, crsim_fossiling["fmtypes"], 1000, crsim_fossiling["hybrids"]);
                                                        arre.push({"index": i, "weight": modw});
                                                        totw += modw;
                                                    }
                                                    var rnd = poec_rand(1, totw, true);
                                                    var simTWeight = 0;
                                                    affix = null;
                                                    for (var i = 0; i < arre.length; i++) {
                                                        var rs = simTWeight + 1;
                                                        var re = simTWeight + arre[i]["weight"];
                                                        if (rnd >= rs && rnd <= re) {
                                                            affix = arre[i];
                                                            break;
                                                        }
                                                        simTWeight += arre[i]["weight"];
                                                    }
                                                    if (affix) {
                                                        addmods = [{
                                                            "mod": glyphs[affix["index"]]["id_modifier"],
                                                            "tier": 0
                                                        }];
                                                    } else {
                                                        ferr = "Could not roll essence modifier (Should not happen)";
                                                    }
                                                }
                                                break;
                                        }
                                    }
                                }
                                if (!ferr) {
                                    poec_simSetRarity("rare");
                                    poec_simRerollItem("rare", true, addmods, null, false, false, false, false, null, false, false, false, false);
                                    // Manage special fossils
                                    for (var m = 0; m < crafts["subaction"].length; m++) {
                                        if (crsim_specialfossils.indexOf("|" + crafts["subaction"][m] + "|") > -1) {
                                            switch (crafts["subaction"][m]) {
                                                case 'perfect' :
                                                    // Roll new quality
                                                    var nqual = parseInt(poec_rand(15, 31, true));
                                                    usequality = nqual;
                                                    break;
                                                case 'gilded' :
                                                    // Check for implicit presence
                                                    var afound = false;
                                                    if (useimplicits) {
                                                        var afound = false;
                                                        for (var n = 0; n < useimplicits.length; n++) {
                                                            if (useimplicits[n]["name"] == applyLang("Item sells for much more to vendors")) {
                                                                afound = true;
                                                                break;
                                                            }
                                                        }
                                                    } else {
                                                        useimplicits = [];
                                                    }
                                                    if (!afound) {
                                                        useimplicits.push({
                                                            "name": applyLang("Item sells for much more to vendors"),
                                                            "nvalues": "[]",
                                                            "rolls": []
                                                        });
                                                    }
                                                    break;
                                            }
                                        }
                                    }
                                } else {
                                    success = false;
                                }
                            }
                        }
                        if (success) {
                            if (!override) {
                                crsim_data["implicits"] = useimplicits;
                                crsim_settings["quality"] = usequality;
                                poec_simUpdateSpending("action", "fossil", 1, null);
                            } else {
                                crsim_bypass["implicits"] = useimplicits;
                                crsim_bypass["quality"] = usequality;
                            }
                        } else {
                            poec_simThrowError(applyLang(ferr));
                        }
                        break;
                    case 'harvest' :
                        success = poec_simCheckHarvestValid();
                        if (success !== false) {
                            var rerollto = "rare";
                            if (useisrare == 0) {
                                rerollto = "magic";
                            }
                            switch (crafts["subaction"]) {
                                case 'hreroll' :
                                    poec_simRerollItem(rerollto, null, null, null, false, crafts["ssaction"], false, true, null, false, true, false, false);
                                    break;
                                case 'hrerollp' :
                                    poec_simRerollItem(rerollto, null, null, null, false, crafts["ssaction"], true, true, null, false, true, false, false);
                                    break;
                                case 'haugment' :
                                    craftDetail["add"] = poec_simRollAffix(null, crafts["ssaction"], null, null, 1, true, false, false, false, false, false, null, false);
                                    if (crsim_hnerf) {
                                        var ruleout = "|";
                                        for (var i = 0; i < useaffixes.length; i++) {
                                            if (useaffixes[i]["id"] == craftDetail["add"][0]["id"]) {
                                                ruleout += i + "|";
                                                break;
                                            }
                                        }
                                        craftDetail["rem"] = poec_simRemoveAffix(null, null, null, true, false, true, ruleout, false, null);
                                    }
                                    break;
                                case 'hreplace' :
                                    craftDetail["rem"] = poec_simRemoveAffix(crafts["ssaction"], null, null, true, false, false, success, false, null);
                                    if (crafts["ssaction"] == "inf") { // Ignores cannot roll attack/caster when
                                        var ameta = false;
                                    } else {
                                        var ameta = true;
                                    }
                                    craftDetail["add"] = poec_simRollAffix(null, crafts["ssaction"], null, null, 1, ameta, false, false, false, false, false, null, false);
                                    break;
                                case 'hannul' :
                                    craftDetail["rem"] = poec_simRemoveAffix(crafts["ssaction"], null, null, true, false, false, false, false, null);
                                    break;
                                case 'hdivine' :
                                    craftDetail["sts"] = poec_simRerollValues(crafts["ssaction"], null, false);
                                    break;
                                case 'hnonto' :
                                    //console.log(success);
                                    //console.log(jQuery.parseJSON(JSON.stringify(useaffixes)));
                                    craftDetail["rem"] = poec_simRemoveAffix(crafts["ssaction"], null, null, true, true, false, false, false, success);
                                    poec_simUpdateMeta();
                                    craftDetail["add"] = poec_simRollAffix(null, crafts["ssaction"], null, null, 1, true, false, false, false, false, false, null, false);
                                    /*
                  if(success==true){
                    // Can be removed from anywhere
                    craftDetail["rem"]=poec_simRemoveAffix(crafts["ssaction"],null,null,true,true,false,false,false);
                    poec_simUpdateMeta();
                    craftDetail["add"]=poec_simRollAffix(null,crafts["ssaction"],null,null,1,true,false,false,false,false,false,null,false);
                  }else{
                    // Can only remove from one side
                    craftDetail["rem"]=poec_simRemoveAffix(crafts["ssaction"],success,null,true,true,false,false,false);
                    poec_simUpdateMeta();
                    craftDetail["add"]=poec_simRollAffix(null,crafts["ssaction"],success,null,1,true,false,false,false,false,false,null,false);
                  }
                  */
                                    break;
                                case 'hother' :
                                    switch (crafts["ssaction"]) {
                                        case 'hrepf' :
                                            poec_simRerollItem(rerollto, null, null, null, false, false, false, true, "suffix", false, false, false, false);
                                            break;
                                        case 'hresf' :
                                            poec_simRerollItem(rerollto, null, null, null, false, false, false, true, "prefix", false, false, false, false);
                                            break;
                                        case 'rfmlk' :
                                            poec_simRerollItem(rerollto, null, null, null, false, false, false, true, false, false, true, false, 1);
                                            break;
                                        case 'rfllk' :
                                            poec_simRerollItem(rerollto, null, null, null, false, false, false, true, false, false, true, false, 2);
                                            break;
                                        case 'hrrvpsi' :
                                            craftDetail["sts"] = poec_simRerollValues(null, {
                                                "prefix": true,
                                                "suffix": true,
                                                "implicit": true
                                            }, true);
                                            break;
                                        case 'hrrvp' :
                                            craftDetail["sts"] = poec_simRerollValues(null, {
                                                "prefix": true,
                                                "suffix": false,
                                                "implicit": false
                                            }, true);
                                            break;
                                        case 'hrrvs' :
                                            craftDetail["sts"] = poec_simRerollValues(null, {
                                                "prefix": false,
                                                "suffix": true,
                                                "implicit": false
                                            }, true);
                                            break;
                                    }
                                    break;
                                case 'hhight' :
                                    switch (crafts["ssaction"]) {
                                        case 'htnmo' :
                                            poec_simSetRarity("magic");
                                            poec_simRollAffix(null, null, null, null, 1, true, true, false, false, false, false, null, true);
                                            break;
                                        case 'htnmt' :
                                            poec_simSetRarity("magic");
                                            poec_simRollAffix(null, null, null, null, 2, true, true, false, false, false, false, null, true);
                                            break;
                                        case 'htmrt' :
                                            poec_simSetRarity("rare");
                                            poec_simRollAffix(null, null, null, null, 2, true, true, false, false, false, false, null, true);
                                            break;
                                        case 'htmrr' :
                                            poec_simSetRarity("rare");
                                            poec_simRollAffix(null, null, null, null, 3, true, true, false, false, false, false, null, true);
                                            break;
                                        case 'htmrf' :
                                            poec_simSetRarity("rare");
                                            poec_simRollAffix(null, null, null, null, 4, true, true, false, false, false, false, null, true);
                                            break;
                                    }
                                    break;
                                case 'hresist' :
                                    // Find mod to in modpool
                                    if (success["fromind"].length > 0) {
                                        var swappick = null;
                                        if (success["fromind"].length > 1) {
                                            var rnum = poec_rand(0, success["fromind"].length, true);
                                            swappick = success["fromind"][rnum];
                                        } else {
                                            swappick = success["fromind"][0];
                                        }

                                        var tindex = useaffixes[swappick["ind"]]["tindex"];
                                        useaffixes[swappick["ind"]]["modgroups"] = usefmodpool[swappick["type"]][swappick["mgrp"]][swappick["to"]]["modgroups"];
                                        useaffixes[swappick["ind"]]["id"] = usefmodpool[swappick["type"]][swappick["mgrp"]][swappick["to"]]["id_modifier"];
                                        useaffixes[swappick["ind"]]["nvalues"] = usefmodpool[swappick["type"]][swappick["mgrp"]][swappick["to"]]["tiers"][tindex]["nvalues"];
                                        useaffixes[swappick["ind"]]["rolls"] = poec_simRollValues(useaffixes[swappick["ind"]]["nvalues"]);

                                        if (override) {
                                            crsim_bypass["iaffixes"] = useaffixes;
                                        } else {
                                            crsim_data["iaffixes"] = useaffixes;
                                        }
                                    } else {
                                        console.log("Could not find a target mod, should not happen!");
                                    }
                                    break;
                            }
                        }
                        if (success && !override) {
                            poec_simUpdateSpending("action", "harvest", 1, null);
                        }
                        break;
                    case 'syndicate' :
                        switch (crafts["subaction"]) {
                            case 'leoslam' :
                                var ret = poec_simRollAffix(null, null, null, null, 1, true, true, false, false, false, false, null, false);
                                if (ret.length > 0) {
                                    craftDetail["add"] = ret;
                                    poec_remCatQuality(20);
                                    success = true;
                                    if (!override) {
                                        poec_simUpdateSpending("action", "syndicate", 1, null);
                                    }
                                } else {
                                    success = false;
                                    var errtxt = applyLang("No mod available to add in the pool");
                                    if (!override) {
                                        $("#simItemHoverer").mcuiNotice({text: errtxt, type: "alert"}).showNotice();
                                        $("#simItemHoverer").mcuiNotice().setText(errtxt);
                                    } else {
                                        poec_simThrowError(applyLang(errtxt));
                                    }
                                }
                                break;
                            case 'aisling' :
                                // Check for veiled lock
                                var hasveiled = {"prefix": false, "suffix": false};
                                var haslock = {"prefix": false, "suffix": false};
                                for (var i = 0; i < useaffixes.length; i++) {
                                    if (useaffixes[i]["mgrp"] == 10 || useaffixes[i]["mgrp"] == -1) {
                                        hasveiled[useaffixes[i]["atype"]] = true;
                                    }
                                    if (useaffixes[i]["mgrp"] == 11) {
                                        // Check if there is a veiled mod (10) that is equivalent
                                        if (usefmodpool["prefix"][10]) {
                                            for (var zj = 0; zj < usefmodpool["prefix"][10].length; zj++) {
                                                if (poecl["mod"][usefmodpool["prefix"][10][zj]["id_modifier"]] == poecl["mod"][useaffixes[i]["id"]]) {
                                                    hasveiled[useaffixes[i]["atype"]] = true;
                                                }
                                            }
                                        }
                                        if (usefmodpool["suffix"][10]) {
                                            for (var zj = 0; zj < usefmodpool["suffix"][10].length; zj++) {
                                                if (poecl["mod"][usefmodpool["suffix"][10][zj]["id_modifier"]] == poecl["mod"][useaffixes[i]["id"]]) {
                                                    hasveiled[useaffixes[i]["atype"]] = true;
                                                }
                                            }
                                        }
                                        /*
                    // Check if its a veiled crafted mo
                    for(var zy=0;zy<useaffixes[i]["modgroups"].length;zy++){
                      if(crsim_affbymgrp[useaffixes[i]["modgroups"][zy]]!=undefined){
                        for(var j=0;j<crsim_affbymgrp[useaffixes[i]["modgroups"][zy]].length;j++){
                          if(crsim_affbymgrp[useaffixes[i]["modgroups"][zy]][j]!=useaffixes[i]["id"]){
                            if(poecd['modifiers']['seq'][poecd['modifiers']['ind'][crsim_affbymgrp[useaffixes[i]["modgroups"][zy]][j]]]["id_mgroup"]==10){
                              //hasveiled[useaffixes[i]["atype"]]=true;
                            }
                          }
                        }
                      }
                    }
                    */
                                    }
                                    for (var zy = 0; zy < useaffixes[i]["modgroups"].length; zy++) {
                                        switch (useaffixes[i]["modgroups"][zy]) {
                                            case 'ItemGenerationCannotChangePrefixes' :
                                                haslock["prefix"] = true;
                                                break;
                                            case 'ItemGenerationCannotChangeSuffixes' :
                                                haslock["suffix"] = true;
                                                break;
                                        }
                                    }
                                }

                                if (hasveiled["prefix"] || hasveiled["suffix"]) {
                                    var errtxt = "Could not generate mod (Can't use while veiled affix is present)";
                                    //var errtxt="Could not generate mod (Locking a veiled/crafted affix to use aisling bench is not allowed)";
                                    success = false;
                                    crsim_lock = false;
                                    if (!override) {
                                        $("#simItemHoverer").mcuiNotice({text: errtxt, type: "alert"}).showNotice();
                                        $("#simItemHoverer").mcuiNotice().setText(errtxt);
                                    } else {
                                        poec_simThrowError(applyLang(errtxt));
                                    }
                                } else {
                                    // Remove a mod (nerf)
                                    craftDetail["rem"] = poec_simRemoveAffix(null, null, null, true, false, true, false, false, null);

                                    if (override) {
                                        useiaffbt = crsim_bypass["iaffbt"];
                                        usecmaxaffgrp = crsim_bypass["cmaxaffgrp"];
                                    } else {
                                        useiaffbt = crsim_data["iaffbt"];
                                        usecmaxaffgrp = crsim_data["cmaxaffgrp"];
                                    }

                                    var losuf = usecmaxaffgrp["suffix"] - useiaffbt["suffix"];
                                    var lopre = usecmaxaffgrp["prefix"] - useiaffbt["prefix"];
                                    var loaff = losuf + lopre;
                                    if (loaff > 1) {
                                        // Check if we hit double veil
                                        //var rolled=poec_rand(0,99,true);
                                        var rolled = 99; // Nerf
                                        var veiltype = null;
                                        if (losuf == 0 || lopre == 0) {
                                            if (losuf == 0) {
                                                veiltype = "prefix";
                                            } else {
                                                veiltype = "suffix";
                                            }
                                        }
                                        if (rolled < 15) {
                                            // Double
                                            if (veiltype == null) {
                                                // Roll 50/50
                                                var rolled = poec_rand(0, 2, true);
                                                if (rolled == 1) {
                                                    veiltype = "prefix";
                                                } else {
                                                    veiltype = "suffix";
                                                }
                                                poec_simAddVeiledAffix(veiltype);

                                                if (crsim_bypass) {
                                                    useiaffbt = crsim_bypass["iaffbt"];
                                                    usecmaxaffgrp = crsim_bypass["cmaxaffgrp"];
                                                } else {
                                                    useiaffbt = crsim_data["iaffbt"];
                                                    usecmaxaffgrp = crsim_data["cmaxaffgrp"];
                                                }

                                                if (useiaffbt[veiltype] >= usecmaxaffgrp[veiltype]) {
                                                    if (veiltype == "suffix") {
                                                        veiltype = "prefix";
                                                    } else {
                                                        veiltype = "suffix";
                                                    }
                                                } else {
                                                    // Roll 50/50
                                                    var rolled = poec_rand(0, 2, true);
                                                    if (rolled == 1) {
                                                        veiltype = "prefix";
                                                    } else {
                                                        veiltype = "suffix";
                                                    }
                                                }
                                                poec_simAddVeiledAffix(veiltype);
                                            } else {
                                                poec_simAddVeiledAffix(veiltype);
                                                poec_simAddVeiledAffix(veiltype);
                                            }
                                        } else {
                                            // Simple
                                            if (veiltype == null) {
                                                // Roll 50/50
                                                var rolled = poec_rand(0, 2, true);
                                                if (rolled == 1) {
                                                    veiltype = "prefix";
                                                } else {
                                                    veiltype = "suffix";
                                                }
                                            }
                                            poec_simAddVeiledAffix(veiltype);
                                        }
                                    } else {
                                        if (loaff == 1) {
                                            // Forced simple
                                            if (losuf > 0) {
                                                var veiltype = "suffix";
                                            } else {
                                                var veiltype = "prefix";
                                            }
                                            poec_simAddVeiledAffix(veiltype);
                                        } else {
                                            console.log("No space to apply aisling, should not happen!");
                                        }
                                    }
                                    poec_simUpdateMeta();
                                    success = true;
                                    if (success && !override) {
                                        poec_simUpdateSpending("action", "syndicate", 1, null);
                                    }
                                }
                                break;
                        }
                        break;
                    case 'eldritch' :
                        var errors = "";
                        success = true;
                        poec_simUpdateDominance();
                        switch (crafts["subaction"]) {
                            case 'eldritchchaos' :
                                if (usedominance) {
                                    if (usedominance == "searing") {
                                        var target = "prefix";
                                    } else {
                                        var target = "suffix";
                                    }

                                    // Get the number of affixes of the target type and remove them
                                    var naffs = [];
                                    var numaff = 0;
                                    var newaffbt = {"prefix": 0, "suffix": 0};
                                    for (var i = 0; i < useaffixes.length; i++) {
                                        if (useaffixes[i]["atype"] == target && useaffixes[i]["frac"] == 0) {
                                            numaff++;
                                        } else {
                                            naffs.push(useaffixes[i]);
                                            newaffbt[useaffixes[i]["atype"]]++;
                                        }
                                    }

                                    var numaffs = naffs.length;
                                    var rnd = poec_rand(0, 1, false);
                                    var noaffix = -1;
                                    $.each(numOfAffixes[usecmaxaffgrp["prefix"]], function (num, range) {
                                        if (range["s"] <= rnd && range["e"] >= rnd) {
                                            noaffix = num;
                                        }
                                    });
                                    noaffix -= numaffs;

                                    if (noaffix + newaffbt[target] > usecmaxaffgrp[target]) {
                                        noaffix = usecmaxaffgrp[target] - newaffbt[target];
                                    }
                                    useaffixes = jQuery.parseJSON(JSON.stringify(naffs));
                                    useiaffbt[target] = newaffbt[target];

                                    if (override) {
                                        crsim_bypass["iaffbt"] = useiaffbt;
                                        crsim_bypass["iaffixes"] = useaffixes;
                                    } else {
                                        crsim_data["iaffbt"] = useiaffbt;
                                        crsim_data["iaffixes"] = useaffixes;
                                    }

                                    if (noaffix > 0) {
                                        poec_simRollAffix(null, null, target, null, noaffix, true, true, false, false, false, false, null, false);
                                    }

                                    /*
                  if(numaff==0){
                    success=false;
                    var errtxt=applyLang("Cannot be used as there is no mod to reroll");
                    $("#simItemHoverer").mcuiNotice({text:errtxt,type:"alert"}).showNotice();
                    $("#simItemHoverer").mcuiNotice().setText(errtxt);
                  }else{
                    crsim_data["iaffixes"]=jQuery.parseJSON(JSON.stringify(naffs));
                    crsim_data["iaffbt"][target]=newaffbt;

                    // Add X rerolled ones
                    poec_simRollAffix(null,null,target,null,numaff,true,true,false,false,false,false,null,false);
                  }
                  */
                                } else {
                                    success = false;
                                }
                                break;
                            case 'eldritchexalt' :
                                if (usedominance) {
                                    if (usedominance == "searing") {
                                        var target = "prefix";
                                    } else {
                                        var target = "suffix";
                                    }
                                    var ret = poec_simRollAffix(null, null, target, null, 1, true, true, false, false, false, false, null, false);
                                    if (ret != null) {
                                        craftDetail["add"] = ret;
                                        poec_remCatQuality(20);
                                    } else {
                                        success = false;
                                        var errtxt = applyLang("Cannot add another modifier");
                                        if (!override) {
                                            $("#simItemHoverer").mcuiNotice({text: errtxt, type: "alert"}).showNotice();
                                            $("#simItemHoverer").mcuiNotice().setText(errtxt);
                                        } else {
                                            poec_simThrowError(applyLang(errtxt));
                                        }
                                    }
                                } else {
                                    success = false;
                                }
                                break;
                            case 'eldritchannul' :
                                if (usedominance) {
                                    if (usedominance == "searing") {
                                        var keep = "prefix";
                                    } else {
                                        var keep = "suffix";
                                    }
                                    var ret = poec_simRemoveAffix(null, keep, null, true, false, true, false, true, null);
                                    if (ret) {
                                        craftDetail["rem"] = ret;
                                        poec_remCatQuality(20);
                                    } else {
                                        success = false;
                                        var errtxt = applyLang("No eligible mod to remove, prevents usage");
                                        if (!override) {
                                            $("#simItemHoverer").mcuiNotice({text: errtxt, type: "alert"}).showNotice();
                                            $("#simItemHoverer").mcuiNotice().setText(errtxt);
                                        } else {
                                            poec_simThrowError(applyLang(errtxt));
                                        }
                                    }
                                } else {
                                    success = false;
                                }
                                break;
                            case 'eldritchconflict' :
                                // Rand pick searing or tangled
                                var rolled = poec_rand(0, 2, true);
                                if (rolled == 1) {
                                    var raise = "eldritch_blue";
                                } else {
                                    var raise = "eldritch_red";
                                }

                                var eldb = -1;
                                var eldr = -1;
                                for (var i = 0; i < useimplicits.length; i++) {
                                    if (useimplicits[i]["atype"] == "eldritch_blue") {
                                        eldb = i;
                                    }
                                    if (useimplicits[i]["atype"] == "eldritch_red") {
                                        eldr = i;
                                    }
                                }

                                if (raise == "eldritch_blue") {
                                    raise = eldb;
                                    var traise = "eldritch_blue";
                                    var lower = eldr;
                                    var tlower = "eldritch_red";
                                } else {
                                    raise = eldr;
                                    var traise = "eldritch_red";
                                    var lower = eldb;
                                    var tlower = "eldritch_blue";
                                }

                                // Try raise
                                var ntiers = poecd["tiers"][useimplicits[raise]["id"]][usebase].length;
                                if (useimplicits[raise]["tindex"] < ntiers - 1) {
                                    useimplicits[raise]["tindex"]++;
                                    useldritch[traise]--;
                                    useimplicits[raise]["nvalues"] = poecd["tiers"][useimplicits[raise]["id"]][usebase][useimplicits[raise]["tindex"]]["nvalues"];
                                    useimplicits[raise]["rolls"] = poec_simRollValues(useimplicits[raise]["nvalues"]);
                                } else {

                                }

                                if (useimplicits[lower] == undefined) {
                                    console.log(useimplicits);
                                }

                                if (useimplicits[lower]["tindex"] == 0) {
                                    // Remove it
                                    var nimps = [];
                                    var eldritch = {};
                                    for (var i = 0; i < useimplicits.length; i++) {
                                        if (i != lower) {
                                            eldritch[useimplicits[i]["atype"]] = poecd["tiers"][useimplicits[i]["id"]][usebase].length - useimplicits[i]["tindex"];
                                            nimps.push(useimplicits[i]);
                                        }
                                    }
                                    useldritch = eldritch;
                                    useimplicits = jQuery.parseJSON(JSON.stringify(nimps));
                                } else {
                                    // Lower
                                    useimplicits[lower]["tindex"]--;
                                    useldritch[tlower]++;
                                    useimplicits[lower]["nvalues"] = poecd["tiers"][useimplicits[lower]["id"]][usebase][useimplicits[lower]["tindex"]]["nvalues"];
                                    useimplicits[lower]["rolls"] = poec_simRollValues(useimplicits[lower]["nvalues"]);
                                }

                                if (override) {
                                    crsim_bypass["eldritch"] = useldritch;
                                    crsim_bypass["implicits"] = useimplicits;
                                } else {
                                    crsim_data["eldritch"] = useldritch;
                                    crsim_data["implicits"] = useimplicits;
                                }
                                break;
                            case 'eldritchemberlesser':
                                poec_simAddEldritchImplicit("eldritch_red", 6);
                                break;
                            case 'eldritchembergreater':
                                poec_simAddEldritchImplicit("eldritch_red", 5);
                                break;
                            case 'eldritchembergrand':
                                poec_simAddEldritchImplicit("eldritch_red", 4);
                                break;
                            case 'eldritchemberexceptional':
                                poec_simAddEldritchImplicit("eldritch_red", 3);
                                break;
                            case 'eldritchichorlesser':
                                poec_simAddEldritchImplicit("eldritch_blue", 6);
                                break;
                            case 'eldritchichorgreater':
                                poec_simAddEldritchImplicit("eldritch_blue", 5);
                                break;
                            case 'eldritchichorgrand':
                                poec_simAddEldritchImplicit("eldritch_blue", 4);
                                break;
                            case 'eldritchichorexceptional':
                                poec_simAddEldritchImplicit("eldritch_blue", 3);
                                break;
                        }
                        if (success && !override) {
                            poec_simUpdateSpending("action", "eldritch", 1, null);
                        }
                        poec_simUpdateDominance();
                        break;
                    case 'scourge' :
                        var errors = "";
                        switch (crafts["subaction"]) {
                            case 'scourgetogglecorrupt' :
                                if (crsim_settings["corrupted"] == 1) {
                                    crsim_settings["corrupted"] = 0;
                                } else {
                                    crsim_settings["corrupted"] = 1;
                                }
                                success = true;
                                break;
                            case 'scourgettdivine' :
                                success = true;

                                var changes = 0;
                                var incs = 0;
                                var decs = 0;
                                for (var i = 0; i < crsim_data["iaffixes"].length; i++) {
                                    if (crsim_data["iaffixes"][i]["mgrp"] != 11 && poecd["tiers"][crsim_data["iaffixes"][i]["id"]] != undefined && crsim_data["iaffixes"][i]["maven"] == 0) {
                                        if (crsim_data["iaffixes"][i]["maven"] == 0) {
                                            // Modifier can un-elevate, drop to highest mod tier
                                        }
                                        var ntiers = poecd["tiers"][crsim_data["iaffixes"][i]["id"]][crsim_settings["base"]].length;
                                        if (ntiers > 1) {
                                            var delta = 0;
                                            var rolled = poec_rand(0, 2, true);
                                            if (crsim_data["iaffixes"][i]["tindex"] == 0) {
                                                if (rolled == 1) {
                                                    delta = 1;
                                                }
                                            } else {
                                                if (crsim_data["iaffixes"][i]["tindex"] >= ntiers - 1) {
                                                    if (rolled == 1) {
                                                        delta = -1;
                                                    }
                                                } else {
                                                    // 50/50
                                                    if (rolled == 1) {
                                                        delta = -1;
                                                    } else {
                                                        delta = 1;
                                                    }
                                                }
                                            }
                                            switch (delta) {
                                                case 1 :
                                                    crsim_data["iaffixes"][i]["tindex"]++;
                                                    crsim_data["iaffixes"][i]["nvalues"] = poecd["tiers"][crsim_data["iaffixes"][i]["id"]][crsim_settings["base"]][crsim_data["iaffixes"][i]["tindex"]]["nvalues"];
                                                    crsim_data["iaffixes"][i]["rolls"] = poec_simRollValues(crsim_data["iaffixes"][i]["nvalues"]);
                                                    incs++;
                                                    changes++;
                                                    break;
                                                case -1 :
                                                    crsim_data["iaffixes"][i]["tindex"]--;
                                                    crsim_data["iaffixes"][i]["nvalues"] = poecd["tiers"][crsim_data["iaffixes"][i]["id"]][crsim_settings["base"]][crsim_data["iaffixes"][i]["tindex"]]["nvalues"];
                                                    crsim_data["iaffixes"][i]["rolls"] = poec_simRollValues(crsim_data["iaffixes"][i]["nvalues"]);
                                                    decs++;
                                                    changes++;
                                                    break;
                                                default:
                                                    break;
                                            }
                                        }
                                    }
                                }

                                if (changes > 0) {
                                    craftDetail["det"] = "<div class='ssdesc'>" + incs + " Up, " + decs + " Down</div>";
                                } else {
                                    success = false;
                                    var errtxt = applyLang("No eligible mod to modify");
                                    $("#simItemHoverer").mcuiNotice({text: errtxt, type: "alert"}).showNotice();
                                    $("#simItemHoverer").mcuiNotice().setText(errtxt);
                                }

                                // If it raises/lowers individually

                                // If it raises all or lowers all
                                /*
                // Check if all tiers are at max/min tiers
                var atmax=0;
                var atmin=0;
                var maxaff=0;
                for(var i=0;i<crsim_data["iaffixes"].length;i++){
                  if(poecd["tiers"][crsim_data["iaffixes"][i]["id"]]!=undefined){
                    if(crsim_data["iaffixes"][i]["tindex"]==0){
                      atmin++;
                    }
                    var ntiers=poecd["tiers"][crsim_data["iaffixes"][i]["id"]][crsim_settings["base"]].length;
                    if(crsim_data["iaffixes"][i]["tindex"]>=ntiers-1){
                      atmax++;
                    }
                    console.log(ntiers+" tiers for "+crsim_data["iaffixes"][i]["id"]);
                    maxaff++;
                  }
                }
                if(atmin>=maxaff&&atmax>=maxaff){
                  success=false;
                  var errtxt=applyLang("No eligible mod to modify");
                  $("#simItemHoverer").mcuiNotice({text:errtxt,type:"alert"}).showNotice();
                  $("#simItemHoverer").mcuiNotice().setText(errtxt);
                }else{
                  if(atmin>=maxaff){
                    // Force increment
                    var delta=1;
                  }else{
                    if(atmax>=maxaff){
                      // Force decrement
                      var delta=-1;
                    }else{
                      // 50/50
                      var rolled=poec_rand(0,2,true);
                      if(rolled==1){
                        var delta=-1;
                        craftDetail["det"]="<div class='ssdesc'>Decrement</div>";
                      }else{
                        var delta=1;
                        craftDetail["det"]="<div class='ssdesc'>Increment</div>";
                      }
                    }
                  }
                  for(var i=0;i<crsim_data["iaffixes"].length;i++){
                    if(poecd["tiers"][crsim_data["iaffixes"][i]["id"]]!=undefined){
                      var ntiers=poecd["tiers"][crsim_data["iaffixes"][i]["id"]][crsim_settings["base"]].length;
                      console.log(poecd["tiers"][crsim_data["iaffixes"][i]["id"]][crsim_settings["base"]]);
                      if(delta>0){
                        // Increment
                        if(crsim_data["iaffixes"][i]["tindex"]<ntiers-1){
                          crsim_data["iaffixes"][i]["tindex"]++;
                          crsim_data["iaffixes"][i]["nvalues"]=poecd["tiers"][crsim_data["iaffixes"][i]["id"]][crsim_settings["base"]][crsim_data["iaffixes"][i]["tindex"]]["nvalues"];
                          crsim_data["iaffixes"][i]["rolls"]=poec_simRollValues(crsim_data["iaffixes"][i]["nvalues"]);
                        }
                      }else{
                        // Decrement
                        if(crsim_data["iaffixes"][i]["tindex"]>0){
                          crsim_data["iaffixes"][i]["tindex"]--;
                          crsim_data["iaffixes"][i]["nvalues"]=poecd["tiers"][crsim_data["iaffixes"][i]["id"]][crsim_settings["base"]][crsim_data["iaffixes"][i]["tindex"]]["nvalues"];
                          crsim_data["iaffixes"][i]["rolls"]=poec_simRollValues(crsim_data["iaffixes"][i]["nvalues"]);
                        }
                      }
                    }
                  }
                }
                */
                                break;
                            case 'scourgettexalt' :
                                success = true;
                                // Check if we have maximum number of affixes or 0
                                var cmaxaff = crsim_data["cmaxaffgrp"]["prefix"] + crsim_data["cmaxaffgrp"]["suffix"];
                                var caffs = crsim_data["iaffixes"].length;
                                if (caffs >= cmaxaff) {
                                    // Force annul
                                    var ttmode = "annul";
                                } else {
                                    if (caffs == 0) {
                                        // Force exalt
                                        var ttmode = "exalt";
                                    } else {
                                        // 50 / 50
                                        var rolled = poec_rand(0, 2, true);
                                        if (rolled == 1) {
                                            var ttmode = "annul";
                                        } else {
                                            var ttmode = "exalt";
                                        }
                                    }
                                }
                                switch (ttmode) {
                                    case 'annul':
                                        craftDetail["rem"] = poec_simRemoveAffix(null, null, null, true, false, true, false, false, null);
                                        break;
                                    case 'exalt':
                                        var ret = poec_simRollAffix(null, null, null, null, 1, true, true, false, false, false, false, null, false);
                                        if (ret.length > 0) {
                                            craftDetail["add"] = ret;
                                            poec_remCatQuality(20);
                                        } else {
                                            success = false;
                                            var errtxt = applyLang("No mod available to add in the pool");
                                            $("#simItemHoverer").mcuiNotice({text: errtxt, type: "alert"}).showNotice();
                                            $("#simItemHoverer").mcuiNotice().setText(errtxt);
                                        }
                                        break;
                                }
                                if (success) {
                                    poec_simUpdateSpending("action", "scourge", 1, null);
                                }
                                break;
                        }
                        break;
                    case 'vendor' :
                        var errors = "";
                        if (crafts["subaction"] != undefined) {
                            switch (crafts["subaction"]) {
                                default:
                                    var result = crsim_vendor[crafts["subaction"]]["result"];
                                    // Check for validity (max tier from config or max tier from ilvl)
                                    if (result["mods"]) {
                                        var vaffs = [];
                                        var verror = "";
                                        var vfail = false;
                                        for (var y = 0; y < result["mods"].length; y++) {
                                            if (result["mods"][y]["tier"] == "+") {
                                                // Raise tier
                                                var cmtindex = null;
                                                for (var w = 0; w < crsim_data["iaffixes"].length; w++) {
                                                    if (crsim_data["iaffixes"][w]["id"] == result["mods"][y]["id"]) {
                                                        cmtindex = crsim_data["iaffixes"][w]["tindex"];
                                                    }
                                                }
                                                if (cmtindex != null) {
                                                    var nexttier = cmtindex + 1;
                                                    var tdiff = poecd['tiers'][result["mods"][y]["id"]][crsim_settings["base"]].length - nexttier;
                                                    if (tdiff >= parseInt(result["mods"][y]["maxtier"])) {
                                                        var nextilvl = poecd['tiers'][result["mods"][y]["id"]][crsim_settings["base"]][nexttier]["ilvl"];
                                                        if (parseInt(nextilvl) > crsim_settings["ilvl"]) {
                                                            // Fail by ilvl
                                                            vfail = true;
                                                            verror = "Cannot raise tier higher in regards to item level";
                                                        } else {
                                                            vaffs.push({
                                                                "id": result["mods"][y]["id"],
                                                                "tindex": nexttier
                                                            });
                                                        }
                                                    } else {
                                                        // Fail by max tier
                                                        vfail = true;
                                                        verror = "Maximum tier reached for vendor recipee";
                                                    }
                                                } else {
                                                    // Should not happen
                                                    vfail = true;
                                                    verror = "Cannot find mod to increment";
                                                }
                                            } else {
                                                if (crsim_vendor[crafts["subaction"]]["subset"] != undefined) {
                                                    // Get subchoice
                                                    var selind = $("#vendorSS" + crafts["subaction"]).children(".abtn.sel").index() - 1;
                                                    var settier = poecd['tiers'][result["mods"][y]["id"]][crsim_settings["base"]].length - result["mods"][y]["tier"][selind];
                                                } else {
                                                    // Just add mod at specified tier
                                                    if (result["mods"][y]["tier"] < 0) {
                                                        var settier = 0;
                                                    } else {
                                                        var settier = poecd['tiers'][result["mods"][y]["id"]][crsim_settings["base"]].length - result["mods"][y]["tier"];
                                                    }
                                                }
                                                vaffs.push({"id": result["mods"][y]["id"], "tindex": settier});
                                            }
                                        }
                                        if (vfail) {
                                            $("#simItemHoverer").mcuiNotice({
                                                text: applyLang(verror),
                                                type: "alert"
                                            }).showNotice();
                                            $("#simItemHoverer").mcuiNotice().setText(applyLang(verror));
                                        } else {
                                            success = true;
                                            poec_simSetRarity(result["rarity"]);

                                            // Restore item implicits and remove eldritch influences
                                            crsim_data["eldritch"] = null;
                                            crsim_data["implicits"] = null;
                                            crsim_data["dominance"] = null;

                                            itemimps = poecd["bitems"]["seq"][poecd["bitems"]["ind"][crsim_settings["bitem"]]]["implicits"];
                                            if (itemimps) {
                                                itemimps = jQuery.parseJSON(itemimps);
                                                crsim_data["implicits"] = [];
                                                for (var zzi = 0; zzi < itemimps.length; zzi++) {
                                                    crsim_data["implicits"].push(poec_simParseImplicit(itemimps[zzi]));
                                                }
                                            }

                                            crsim_data["iaffixes"] = [];
                                            crsim_data["iaffbt"] = {"prefix": 0, "suffix": 0};

                                            for (var i = 0; i < vaffs.length; i++) {
                                                var naffix = poecl["mod"][vaffs[i]["id"]];
                                                var nvalues = poecd['tiers'][vaffs[i]["id"]][crsim_settings["base"]][vaffs[i]["tindex"]]["nvalues"];
                                                var rolls = poec_simRollValues(nvalues);
                                                crsim_data["iaffbt"][poecd["modifiers"]["seq"][poecd["modifiers"]["ind"][vaffs[i]["id"]]]["affix"]]++;

                                                crsim_data["iaffixes"].push({
                                                    "atype": poecd["modifiers"]["seq"][poecd["modifiers"]["ind"][vaffs[i]["id"]]]["affix"],
                                                    "bench": 0,
                                                    "frac": 0,
                                                    "maven": 0,
                                                    "id": vaffs[i]["id"],
                                                    "mgrp": poecd["modifiers"]["seq"][poecd["modifiers"]["ind"][vaffs[i]["id"]]]["id_mgroup"],
                                                    "modgroups": crsim_mgrpdata[vaffs[i]["id"]],
                                                    "nvalues": nvalues,
                                                    "rolls": rolls,
                                                    "tindex": vaffs[i]["tindex"],
                                                    "weight": poecd['tiers'][vaffs[i]["id"]][crsim_settings["base"]][vaffs[i]["tindex"]]["weighting"]
                                                });
                                            }

                                            poec_simUpdateSpending("action", "vendor", 1, null);
                                        }
                                    }
                                    break;
                            }
                        }
                        break;
                    case 'beast_crafting' :
                        var errors = "";
                        switch (crafts["subaction"]) {
                            case 'restimprint' :
                                success = true;
                                poec_simApplyImprint();
                                break;
                            case 'imprint' :
                                // Take a copy of the item
                                if (usecatalyst == undefined) {
                                    usecatalyst = null;
                                }
                                useimprint = {
                                    "influences": jQuery.parseJSON(JSON.stringify(useinfluence)),
                                    "affixes": jQuery.parseJSON(JSON.stringify(useaffixes)),
                                    "implicits": jQuery.parseJSON(JSON.stringify(useimplicits)),
                                    "catalyst": jQuery.parseJSON(JSON.stringify(usecatalyst)),
                                    "eldritch": jQuery.parseJSON(JSON.stringify(useldritch)),
                                    "corrupted": usecorrupted,
                                    "quality": usequality,
                                    "psn": {"prefix": useiaffbt["prefix"], "suffix": useiaffbt["suffix"]}
                                };
                                $("#simImprintZone").addClass("imprinted");
                                success = true;
                                if (override) {
                                    crsim_bypass["imprint"] = useimprint;
                                } else {
                                    crsim_data["imprint"] = useimprint;
                                }
                                break;
                            case 'pretosuf' :
                                if (useiaffbt["prefix"] == 0) {
                                    errors = applyLang("No prefix to remove");
                                } else {
                                    if (useiaffbt["suffix"] >= usecmaxaffgrp["suffix"]) {
                                        errors = applyLang("Cannot add another suffix");
                                    } else {
                                        craftDetail["add"] = poec_simRollAffix(null, null, "suffix", null, 1, true, false, false, false, false, false, null, false);
                                        craftDetail["rem"] = poec_simRemoveAffix(null, "prefix", null, true, false, false, false, false, null);
                                        success = true;
                                    }
                                }
                                break;
                            case 'suftopre' :
                                if (useiaffbt["suffix"] == 0) {
                                    errors = applyLang("No suffix to remove");
                                } else {
                                    if (useiaffbt["prefix"] >= usecmaxaffgrp["prefix"]) {
                                        errors = applyLang("Cannot add another prefix");
                                    } else {
                                        craftDetail["add"] = poec_simRollAffix(null, null, "prefix", null, 1, true, false, false, false, false, false, null, false);
                                        craftDetail["rem"] = poec_simRemoveAffix(null, "suffix", null, true, false, false, false, false, null);
                                        success = true;
                                    }
                                }
                                break;
                            case 'breroll' :
                                ists = poec_simRerollImplicits(false);
                                craftDetail["sts"] = poec_simRerollValues(null, null, false);
                                craftDetail["sts"]["rolls"] += ists["rolls"];
                                craftDetail["sts"]["cap"] += ists["cap"];
                                success = true;
                                break;
                            case 'bcat' :
                            case 'bavian' :
                            case 'bspider' :
                            case 'bcrab' :
                                if (useiaffbt["suffix"] >= usecmaxaffgrp["suffix"]) {
                                    errors = applyLang("No space to add aspect");
                                } else {
                                    var afound = false;
                                    for (var i = 0; i < useaffixes.length; i++) {
                                        if (crsim_aspectids.indexOf("|" + useaffixes[i]["id"] + "|") > -1) {
                                            afound = true;
                                        }
                                    }
                                    if (afound) {
                                        errors = applyLang("There is already an aspect on the item");
                                    } else {
                                        useaffixes.push({
                                            "atype": "suffix",
                                            "bench": 0,
                                            "frac": 0,
                                            "maven": 0,
                                            "id": crsim_aspects[crafts["subaction"]],
                                            "mgrp": 14,
                                            "modgroups": usemgrpdata[crsim_aspects[crafts["subaction"]]],
                                            "nvalues": "[20]",
                                            "rolls": [20],
                                            "tindex": 0,
                                            "weight": 0
                                        });
                                        useiaffbt["suffix"]++;
                                        success = true;
                                    }
                                    if (override) {
                                        crsim_bypass["iaffbt"] = useiaffbt;
                                        crsim_bypass["iaffixes"] = useaffixes;
                                    } else {
                                        crsim_data["iaffbt"] = useiaffbt;
                                        crsim_data["iaffixes"] = useaffixes;
                                    }
                                }
                                break;
                        }
                        if (success) {
                            if (!override) {
                                poec_simUpdateSpending("action", "beast_crafting", 1, null);
                            }
                        } else {
                            if (!override) {
                                $("#simItemHoverer").mcuiNotice({text: errors, type: "alert"}).showNotice();
                                $("#simItemHoverer").mcuiNotice().setText(errors);
                            } else {
                                poec_simThrowError(errors);
                            }
                        }
                        break;
                }
                break;
            default :
                success = false;
                console.log("No mod set, should not be able to apply craft");
                break;
        }
    }

    if (success && !override) {
        if (!nolog) {
            poec_updateCraftLog(craftDetail, forced, null);
        }
        poec_updateItemAffixes();
        poec_updateActionEnabling();
        clearTimeout(crsim_rmptm);
        if (forced) {
            poec_simRefreshModPool();
        } else {
            crsim_rmptm = setTimeout(function () {
                poec_simRefreshModPool();
            }, 1);
        }
    }
}

function poec_simAddEldritchImplicit(itype, ttier) {
    if (crsim_bypass) {
        var useimplicits = crsim_bypass["implicits"];
        var useldritch = crsim_bypass["eldritch"];
        var usebase = crsim_bypass["base"];
    } else {
        var useimplicits = crsim_data["implicits"];
        var useldritch = crsim_data["eldritch"];
        var usebase = crsim_settings["base"];
    }

    // Destroy any native implicit or corrupted
    if (useimplicits == null) {
        useimplicits = [];
    } else {
        if (useimplicits.length > 0) {
            if (useimplicits[0]["name"] != undefined) {
                useimplicits = [];
            } else {
                if (useimplicits[0]["atype"] == "corrupted") {
                    useimplicits = [];
                }
            }
        }
    }

    // Set implicit type to true in eldritch
    if (useldritch == null) {
        useldritch = {};
    }
    useldritch[itype] = ttier;

    // Get array of mods
    var modarr = [];
    var ttweight = 0;
    for (var i = 0; i < poecd["basemods"][usebase].length; i++) {
        var mod = poecd['modifiers']['seq'][poecd['modifiers']['ind'][poecd['basemods'][usebase][i]]];
        if (mod["affix"] == itype) {
            var ntiers = poecd['tiers'][mod["id_modifier"]][usebase].length;
            var truet = ntiers - ttier;
            if (truet >= 0) {
                var mweight = parseInt(poecd['tiers'][mod["id_modifier"]][usebase][truet]["weighting"]);
                modarr.push({
                    "id": mod["id_modifier"],
                    "tier": truet,
                    "weight": mweight,
                    "values": poecd['tiers'][mod["id_modifier"]][usebase][truet]["nvalues"]
                });
                ttweight += mweight;
            }
        }
    }

    var nimps = [];
    for (var i = 0; i < useimplicits.length > 0; i++) {
        if (useimplicits[i]["atype"] != itype) {
            nimps.push(useimplicits[i]);
        }
    }
    useimplicits = jQuery.parseJSON(JSON.stringify(nimps));

    // Roll mod and add or replace
    var rnd = poec_rand(1, ttweight, true);
    var simTWeight = 0;
    affix = null;
    for (var i = 0; i < modarr.length; i++) {
        var rs = simTWeight + 1;
        var re = simTWeight + modarr[i]["weight"];
        if (rnd >= rs && rnd <= re) {
            affix = modarr[i];
            break;
        }
        simTWeight += modarr[i]["weight"];
    }
    if (affix) {
        var naffix = {
            "atype": itype,
            "id": affix["id"],
            "mgrp": poecd['modifiers']['seq'][poecd['modifiers']['ind'][affix["id"]]]["id_mgroup"],
            "modgroups": poecd['modifiers']['seq'][poecd['modifiers']['ind'][affix["id"]]]["modgroups"],
            "nvalues": affix["values"],
            "rolls": poec_simRollValues(affix["values"]),
            "tindex": affix["tier"],
            "weight": affix["weight"]
        };
        useimplicits.push(naffix);
    } else {
        console.log("Could not roll? Should not happen");
    }

    if (crsim_bypass) {
        crsim_bypass["implicits"] = useimplicits;
        crsim_bypass["eldritch"] = useldritch;
    } else {
        crsim_data["implicits"] = useimplicits;
        crsim_data["eldritch"] = useldritch;
    }
}

function poec_remCatQuality(amount) {
    // Catalyst nerf
    /*
  if(crsim_catalyst){
    crsim_catalyst["val"]-=amount;
    if(crsim_catalyst["val"]<=0){
      crsim_catalyst=null;
    }
  }
  */
}

function poec_simRerollItem(rarity, fossil, affs, forcenum, remfrac, forcetag, tagplus, metaprot, keepside, woke, igcrca, veiled, rfmlk) {
    poec_simSetRarity(rarity);

    if (crsim_bypass) {
        var useaffixes = crsim_bypass["iaffixes"];
        var usemetas = crsim_bypass["meta_flags"];
        var usemaxaffgrp = crsim_bypass["cmaxaffgrp"];
        var usebase = crsim_bypass["base"];
        var useaffbt = crsim_bypass["iaffbt"];
        var usemgrpdata = crsim_bypass["mgrpdata"];
        var usesubaction = crsim_bypass["subaction"];
    } else {
        var useaffixes = crsim_data["iaffixes"];
        var usemetas = crsim_data["meta_flags"];
        var usemaxaffgrp = crsim_data["cmaxaffgrp"];
        var usebase = crsim_settings["base"];
        var useaffbt = crsim_data["iaffbt"];
        var usemgrpdata = crsim_mgrpdata;
        var usesubaction = crsim_params["subaction"];
    }

    // Keep fractured / metamod protected
    var keepf = [];
    if (!remfrac) {
        for (var i = 0; i < useaffixes.length; i++) {
            if (useaffixes[i]["frac"] == 1) {
                keepf.push(jQuery.parseJSON(JSON.stringify(useaffixes[i])));
            } else {
                if (keepside == useaffixes[i]["atype"]) {
                    keepf.push(jQuery.parseJSON(JSON.stringify(useaffixes[i])));
                } else {
                    if (metaprot) {
                        if (useaffixes[i]["atype"] == "prefix" && usemetas["nchg_pre"]) {
                            keepf.push(jQuery.parseJSON(JSON.stringify(useaffixes[i])));
                        } else {
                            if (useaffixes[i]["atype"] == "suffix" && usemetas["nchg_suf"]) {
                                keepf.push(jQuery.parseJSON(JSON.stringify(useaffixes[i])));
                            }
                        }
                    }
                }
            }
        }
    }

    var rfmlkt = false;
    var rfmlkv = rfmlk;
    if (rfmlk) {
        rfmlk = {};
        rfmlkt = {};
        forcenum = useaffixes.length;
        if (usemaxaffgrp["prefix"] == 2) {
            if (forcenum < 3) {
                forcenum = 3;
            }
        } else {
            if (forcenum < 4) {
                forcenum = 4;
            }
        }
        for (var i = 0; i < useaffixes.length; i++) {
            if (useaffixes[i]["id"] > 0) {
                rfmlkt[poecd["modifiers"]["seq"][poecd["modifiers"]["ind"][useaffixes[i]["id"]]]["name_modifier"]] = true;
                rfmlk[useaffixes[i]["id"]] = true;
            }
        }
    }

    // Reset data
    useaffixes = [];
    useaffbt = {"prefix": 0, "suffix": 0};

    // Add back fractured and additionnal forced affixes (essence)
    var prmods = 0;
    if (affs) {
        for (var i = 0; i < affs.length; i++) {
            var naffix = poecl["mod"][affs[i]["mod"]];
            var nvalues = poecd['tiers'][affs[i]["mod"]][usebase][affs[i]["tier"]]["nvalues"];
            var rolls = poec_simRollValues(nvalues);
            useaffbt[poecd["modifiers"]["seq"][poecd["modifiers"]["ind"][affs[i]["mod"]]]["affix"]]++;

            useaffixes.push({
                "atype": poecd["modifiers"]["seq"][poecd["modifiers"]["ind"][affs[i]["mod"]]]["affix"],
                "bench": 0,
                "frac": 0,
                "maven": 0,
                "id": affs[i]["mod"],
                "mgrp": poecd["modifiers"]["seq"][poecd["modifiers"]["ind"][affs[i]["mod"]]]["id_mgroup"],
                "modgroups": usemgrpdata[affs[i]["mod"]],
                "nvalues": nvalues,
                "rolls": rolls,
                "tindex": affs[i]["tier"],
                "weight": poecd['tiers'][affs[i]["mod"]][usebase][affs[i]["tier"]]["weighting"]
            });

            prmods++;
        }
    }
    usemetas = {};
    if (keepf.length > 0) {
        for (var i = 0; i < keepf.length; i++) {
            useaffixes.push(jQuery.parseJSON(JSON.stringify(keepf[i])));
            useaffbt[keepf[i]["atype"]]++;
            if (keepf[i]["id"] != -1) {
                if (poecd["modifiers"]["seq"][poecd["modifiers"]["ind"][keepf[i]["id"]]]["meta"]) {
                    usemetas[poecd["modifiers"]["seq"][poecd["modifiers"]["ind"][keepf[i]["id"]]]["meta"]] = true;
                }
            }
            prmods++;
        }
    }
    if (crsim_bypass) {
        crsim_bypass["meta_flags"] = usemetas;
    } else {
        crsim_data["meta_flags"] = usemetas;
    }

    // Veiled
    if (veiled) {
        var blkpr = false;
        var blksf = false;
        var veiltype = false;
        if (useaffbt["prefix"] >= usemaxaffgrp["prefix"]) {
            blkpr = true;
        }
        if (useaffbt["suffix"] >= usemaxaffgrp["suffix"]) {
            blksf = true;
        }
        if (blkpr) {
            if (blksf) {
                // No space
                console.log("No space to add veiled mod on reroll, should not happen?");
                veiltype = null;
            } else {
                veiltype = "suffix";
            }
        } else {
            if (blksf) {
                veiltype = "prefix";
            }
        }
        if (veiltype === false) {
            // Roll 50/50
            var rolled = poec_rand(0, 2, true);
            if (rolled == 1) {
                veiltype = "prefix";
            } else {
                veiltype = "suffix";
            }
        }
        if (veiltype !== null) {
            if (crsim_bypass) {
                crsim_bypass["iaffixes"] = useaffixes;
                crsim_bypass["iaffbt"] = useaffbt;
            } else {
                crsim_data["iaffixes"] = useaffixes;
                crsim_data["iaffbt"] = useaffbt;
            }
            poec_simAddVeiledAffix(veiltype);
            if (crsim_bypass) {
                useaffixes = crsim_bypass["iaffixes"];
                useaffbt = crsim_bypass["iaffbt"];
            } else {
                useaffixes = crsim_data["iaffixes"];
                useaffbt = crsim_data["iaffbt"];
            }
            prmods++;
        }
    }

    // Woke back
    if (woke) {
        var mconflict = false;
        for (var zy = 0; zy < woke["m2"]["modgroups"].length; zy++) {
            for (var zw = 0; zw < woke["m1"]["modgroups"].length; zw++) {
                if (woke["m2"]["modgroups"][zy] == woke["m1"]["modgroups"][zw]) {
                    mconflict = true;
                    break;
                }
            }
        }

        useaffixes.push(jQuery.parseJSON(JSON.stringify(woke["m1"])));
        if (!mconflict) {
            useaffixes.push(jQuery.parseJSON(JSON.stringify(woke["m2"])));
        }
        // Reroll values
        useaffixes[0]["rolls"] = poec_simRollValues(woke["m1"]["nvalues"]);
        if (!mconflict) {
            useaffixes[1]["rolls"] = poec_simRollValues(woke["m2"]["nvalues"]);
        }
        // Set stuff
        useaffbt[poecd["modifiers"]["seq"][poecd["modifiers"]["ind"][woke["m1"]["id"]]]["affix"]]++;
        if (!mconflict) {
            useaffbt[poecd["modifiers"]["seq"][poecd["modifiers"]["ind"][woke["m2"]["id"]]]["affix"]]++;
        }
        prmods++;
        if (!mconflict) {
            prmods++;
        }
    }

    var enforcetag = false;
    if (forcetag) {
        if (crsim_bypass) {
            crsim_bypass["iaffixes"] = useaffixes;
            crsim_bypass["iaffbt"] = useaffbt;
        } else {
            crsim_data["iaffixes"] = useaffixes;
            crsim_data["iaffbt"] = useaffbt;
        }
        poec_simRollAffix(null, forcetag, null, null, 1, true, false, false, igcrca, false, false, null, false);
        if (crsim_bypass) {
            useaffixes = crsim_bypass["iaffixes"];
            useaffbt = crsim_bypass["iaffbt"];
        } else {
            useaffixes = crsim_data["iaffixes"];
            useaffbt = crsim_data["iaffbt"];
        }
        if (tagplus) {
            enforcetag = forcetag;
        }
        prmods++;
    }

    if (fossil) {
        // Check for hollow
        if (JSON.stringify(usesubaction).indexOf("\"18\"") > -1) {
            useaffixes.push({
                "atype": "suffix",
                "bench": 0,
                "frac": 0,
                "maven": 0,
                "id": crsim_hollowid,
                "mgrp": poecd["modifiers"]["seq"][poecd["modifiers"]["ind"][crsim_hollowid]]["id_mgroup"],
                "modgroups": poecd["modifiers"]["seq"][poecd["modifiers"]["ind"][crsim_hollowid]]["modgroups"],
                "nvalues": "[]",
                "rolls": [],
                "tindex": 0,
                "weight": 0
            });
            useaffbt["suffix"]++;
            prmods++;
        }
    }

    if (forcenum) {
        noaffix = forcenum;
    } else {
        var maxnumaf = (usemaxaffgrp["prefix"] + usemaxaffgrp["suffix"]) / 2;
        // Get number of affixes generated
        var rnd = poec_rand(0, 1, false);
        var noaffix = -1;
        $.each(numOfAffixes[maxnumaf], function (num, range) {
            if (range["s"] <= rnd && range["e"] >= rnd) {
                noaffix = num;
            }
        });
    }

    if (crsim_bypass) {
        crsim_bypass["iaffixes"] = useaffixes;
        crsim_bypass["iaffbt"] = useaffbt;
    } else {
        crsim_data["iaffixes"] = useaffixes;
        crsim_data["iaffbt"] = useaffbt;
    }

    poec_simRollAffix(null, null, null, fossil, noaffix - prmods, true, false, enforcetag, igcrca, rfmlk, rfmlkt, rfmlkv, false);
}

function poec_simAddVeiledAffix(veiltype) {
    if (crsim_bypass) {
        var useaffixes = crsim_bypass["iaffixes"];
        var useaffbt = crsim_bypass["iaffbt"];
    } else {
        var useaffixes = crsim_data["iaffixes"];
        var useaffbt = crsim_data["iaffbt"];
    }
    useaffixes.push({
        "atype": veiltype,
        "bench": 0,
        "frac": 0,
        "maven": 0,
        "id": -1,
        "mgrp": -1,
        "modgroups": null,
        "nvalues": [],
        "rolls": [],
        "tindex": 0,
        "weight": 0
    });
    useaffbt[veiltype]++;
    if (crsim_bypass) {
        crsim_bypass["iaffixes"] = useaffixes;
        crsim_bypass["iaffbt"] = useaffbt;
    } else {
        crsim_data["iaffixes"] = useaffixes;
        crsim_data["iaffbt"] = useaffbt;
    }
}

function poec_simGetBlockData() {
    if (crsim_bypass) {
        var useaffixes = crsim_bypass["iaffixes"];
        var useimplicits = crsim_bypass["implicits"];
        var usecmaxaffgrp = crsim_bypass["cmaxaffgrp"];
        var usemaxaffgrp = crsim_bypass["maxaffgrp"];
        var useaffbt = crsim_bypass["iaffbt"];
        var usemgrpdata = crsim_bypass["mgrpdata"];
        var useinfluences = crsim_bypass["influences"];
    } else {
        var useaffixes = crsim_data["iaffixes"];
        var useimplicits = crsim_data["implicits"];
        var usecmaxaffgrp = crsim_data["cmaxaffgrp"];
        var usemaxaffgrp = crsim_data["maxaffgrp"];
        var useaffbt = crsim_data["iaffbt"];
        var usemgrpdata = crsim_mgrpdata;
        var useinfluences = crsim_settings["influences"];
    }

    // Build blocked modgroups from affixes present on item
    var blkmgroups = "|";
    var blkamg = "|";
    for (var i = 0; i < useaffixes.length; i++) {
        if (useaffixes[i]["id"] > 0) {
            if (usemgrpdata[useaffixes[i]["id"]]) {
                for (var j = 0; j < usemgrpdata[useaffixes[i]["id"]].length; j++) {
                    blkmgroups += usemgrpdata[useaffixes[i]["id"]][j] + "|";
                }
            }
            if (poecd["modifiers"]["seq"][poecd["modifiers"]["ind"][useaffixes[i]["id"]]]["amg"]) {
                var tamgs = poec_getAMGs(poecd["modifiers"]["seq"][poecd["modifiers"]["ind"][useaffixes[i]["id"]]]["amg"]);
                if (tamgs) {
                    for (var h = 0; h < tamgs.length; h++) {
                        blkamg += tamgs[h] + "|";
                    }
                }
            }
        }
    }
    blkamg = "|"; // Remove amgs since multigroup change

    // Check if we have reached max of a type
    var blktype = {"prefix": false, "suffix": false};
    if (useaffbt["prefix"] >= usecmaxaffgrp["prefix"]) {
        blktype["prefix"] = true;
    }
    if (useaffbt["suffix"] >= usecmaxaffgrp["suffix"]) {
        blktype["suffix"] = true;
    }

    // Check if we have reach ult max
    var blkutype = {"prefix": false, "suffix": false};
    if (useaffbt["prefix"] >= usemaxaffgrp["prefix"]) {
        blkutype["prefix"] = true;
    }
    if (useaffbt["suffix"] >= usemaxaffgrp["suffix"]) {
        blkutype["suffix"] = true;
    }

    // Check influences on item
    var vmgroups = "";
    if (useinfluences != null) {
        for (var i = 0; i < useinfluences.length; i++) {
            vmgroups += useinfluences[i] + "|";
        }
    }

    var blkdata = {
        "blkmgroups": blkmgroups,
        "blktype": blktype,
        "blkutype": blkutype,
        "vmgroups": vmgroups,
        "amgs": blkamg
    };
    return blkdata;
}

var crsim_tweight = 0;

function poec_simRollAffix(mgroup, tag, atype, fossil, numroll, meta, apcat, enforcetag, igcrca, rfmlk, rfmlkt, rfmlkv, hightier) {
    crsim_tweight = 0;

    if (crsim_bypass) {
        var usemetas = crsim_bypass["meta_flags"];
    } else {
        var usemetas = crsim_data["meta_flags"];
    }

    var blkdata = poec_simGetBlockData();

    var blktags = [];
    if (meta && !igcrca) {
        if (usemetas["no_attack"]) {
            blktags.push("3");
        }
        if (usemetas["no_caster"]) {
            blktags.push("13");
        }
    }
    blkdata["blktags"] = blktags;

    if (rfmlk == false) {
        rfmlk = {};
        rfmlkt = {};
    }

    // Build modpool
    var sfail = false;
    if (atype) {
        if (blkdata["blktype"][atype]) {
            sfail = true;
        } else {
            var tmodpool = poec_simBuildMods(mgroup, tag, atype, fossil, blkdata, apcat, enforcetag, rfmlk, rfmlkt, rfmlkv, hightier);
        }
    } else {
        if (blkdata["blktype"]["prefix"] && blkdata["blktype"]["suffix"]) {
            sfail = true;
        } else {
            if (blkdata["blktype"]["prefix"] || blkdata["blktype"]["suffix"]) {
                if (blkdata["blktype"]["prefix"]) {
                    var tmodpool = poec_simBuildMods(mgroup, tag, "suffix", fossil, blkdata, apcat, enforcetag, rfmlk, rfmlkt, rfmlkv, hightier);
                } else {
                    var tmodpool = poec_simBuildMods(mgroup, tag, "prefix", fossil, blkdata, apcat, enforcetag, rfmlk, rfmlkt, rfmlkv, hightier);
                }
            } else {
                var tmodp_pre = poec_simBuildMods(mgroup, tag, "prefix", fossil, blkdata, apcat, enforcetag, rfmlk, rfmlkt, rfmlkv, hightier);
                var tmodp_suf = poec_simBuildMods(mgroup, tag, "suffix", fossil, blkdata, apcat, enforcetag, rfmlk, rfmlkt, rfmlkv, hightier);
                var tmodpool = tmodp_pre.concat(tmodp_suf);
            }
        }
    }

    if (crsim_bypass) {
        var useaffixes = crsim_bypass["iaffixes"];
        var usemaxaffgrp = crsim_bypass["cmaxaffgrp"];
        var useaffbt = crsim_bypass["iaffbt"];
    } else {
        var useaffixes = crsim_data["iaffixes"];
        var usemaxaffgrp = crsim_data["cmaxaffgrp"];
        var useaffbt = crsim_data["iaffbt"];
    }

    //console.log(tmodpool);

    var aaffs = [];
    if (sfail || useaffixes.length >= usemaxaffgrp["prefix"] + usemaxaffgrp["suffix"]) {
        console.log(sfail);
        console.log(useaffixes);
        console.log(usemaxaffgrp);
        console.log("Cannot roll more affixes, should not happen");
        aaffs = null;
    } else {
        var affix = null;
        for (var m = 0; m < numroll; m++) {
            if (m > 0) {
                // Rebuild modpool after having picked mod
                var blktype = {"prefix": false, "suffix": false};
                if (useaffbt["prefix"] >= usemaxaffgrp["prefix"]) {
                    blktype["prefix"] = true;
                }
                if (useaffbt["suffix"] >= usemaxaffgrp["suffix"]) {
                    blktype["suffix"] = true;
                }
                var nmodpool = [];
                crsim_tweight = 0;
                for (var i = 0; i < tmodpool.length; i++) {
                    if (!blktype[tmodpool[i]["atype"]]) {
                        var mconflict = false;
                        for (var zy = 0; zy < tmodpool[i]["modgroups"].length; zy++) {
                            for (var zw = 0; zw < affix["modgroups"].length; zw++) {
                                if (tmodpool[i]["modgroups"][zy] == affix["modgroups"][zw]) {
                                    mconflict = true;
                                }
                            }
                        }
                        if (!mconflict) {
                            var gogo = true;
                            if (tmodpool[i]["amgs"]) {
                                for (var h = 0; h < tmodpool[i]["amgs"].length; h++) {
                                    if (blkdata["amgs"].indexOf("|" + tmodpool[i]["amgs"][h] + "|") > -1) {
                                        gogo = false;
                                    }
                                }
                            }
                            if (gogo) {
                                nmodpool.push(tmodpool[i]);
                                crsim_tweight += tmodpool[i]["weight"];
                            }
                        }
                    }
                }
                tmodpool = jQuery.parseJSON(JSON.stringify(nmodpool));
            }
            if (crsim_tweight == 0) {
                /*
        console.log(useaffixes);
        console.log(useaffbt);
        console.log(usemaxaffgrp);
        console.log("Nothing left in the pool to roll");
        */
            } else {
                var rnd = poec_rand(1, crsim_tweight, true);
                var simTWeight = 0;
                affix = null;
                var hitw = 0;
                var hitid = 0;
                var hitindex = 0;
                for (var i = 0; i < tmodpool.length; i++) {
                    var rs = simTWeight + 1;
                    var re = simTWeight + tmodpool[i]["weight"];
                    if (rnd >= rs && rnd <= re) {
                        affix = tmodpool[i];
                        hitw = tmodpool[i]["weight"];
                        hitid = tmodpool[i]["id"];
                        hitindex = i;
                        break;
                    }
                    simTWeight += tmodpool[i]["weight"];
                }
                if (affix) {
                    for (var i = hitindex + 1; i < tmodpool.length; i++) {
                        if (hitid != tmodpool[i]["id"]) {
                            break;
                        } else {
                            hitw += tmodpool[i]["weight"];
                        }
                    }
                    // Roll values
                    affix["rolls"] = poec_simRollValues(affix["nvalues"]);
                    affix["bench"] = 0;
                    affix["frac"] = 0;
                    affix["maven"] = 0;
                    affix["chance"] = hitw / crsim_tweight;
                    aaffs.push(affix);
                    useaffixes.push(affix);
                    useaffbt[affix["atype"]]++;
                    if (affix["amgs"]) {
                        for (var h = 0; h < affix["amgs"].length; h++) {
                            blkdata["amgs"] += affix["amgs"][h] + "|";
                        }
                    }
                } else {
                    console.log("Random number did not fall into mod range, problem");
                }
            }
        }
    }

    if (crsim_bypass) {
        crsim_bypass["iaffixes"] = useaffixes;
        crsim_bypass["iaffbt"] = useaffbt;
    } else {
        crsim_data["iaffixes"] = useaffixes;
        crsim_data["iaffbt"] = useaffbt;
    }

    return jQuery.parseJSON(JSON.stringify(aaffs));
}

function poec_simRollValues(nvalues) {
    var nvalues = jQuery.parseJSON(nvalues);
    var rolls = [];
    for (var z = 0; z < nvalues.length; z++) {
        if (Array.isArray(nvalues[z])) {
            if (Math.ceil(nvalues[z][0]) != nvalues[z][0] || Math.ceil(nvalues[z][1]) != nvalues[z][1]) {
                rolls.push(Math.round(poec_rand((nvalues[z][0] * 100), (nvalues[z][1] * 100) + 1, true)) / 100);
            } else {
                rolls.push(poec_rand(nvalues[z][0], nvalues[z][1] + 1, true));
            }
        } else {
            rolls.push(nvalues[z]);
        }
    }
    return rolls;
}

function poec_simRemoveAffix(tag, atype, mgroup, meta, nonto, apcat, ruleout, nocnoa, fixedset) {
    if (crsim_bypass) {
        var useaffixes = crsim_bypass["iaffixes"];
        var usemetas = crsim_bypass["meta_flags"];
        var useaffbt = crsim_bypass["iaffbt"];
        var usemtypes = crsim_bypass["mtypes"];
    } else {
        var useaffixes = crsim_data["iaffixes"];
        var usemetas = crsim_data["meta_flags"];
        var useaffbt = crsim_data["iaffbt"];
        var usemtypes = crsim_data["mtypes"];
    }

    var keep = {"prefix": false, "suffix": false, "attack": false, "caster": false};
    var raff = null;
    if (atype) {
        if (atype == "prefix") {
            keep["suffix"] = true;
        } else {
            keep["prefix"] = true;
        }
    }
    if (meta) {
        if (usemetas["nchg_pre"]) {
            keep["prefix"] = true;
        }
        if (usemetas["nchg_suf"]) {
            keep["suffix"] = true;
        }
    }
    if (nocnoa) {
        if (usemetas["no_attack"]) {
            keep["attack"] = true;
        }
        if (usemetas["no_caster"]) {
            keep["caster"] = true;
        }
    }
    var relig = [];
    var tewght = 0;
    if (fixedset !== null) {
        for (var i = 0; i < fixedset.length; i++) {
            var prvweight = poec_simCatToRWeight(1000, apcat, useaffixes[fixedset[i]]);
            tewght += prvweight;
            relig.push({"i": fixedset[i], "w": prvweight});
        }
    } else {
        if (tag) {
            for (var i = 0; i < useaffixes.length; i++) {
                var skip = false;
                if (ruleout) {
                    if (ruleout.indexOf("|" + i + "|") > -1) {
                        skip = true;
                    }
                }
                if (!skip) {
                    if (!keep[useaffixes[i]["atype"]] && useaffixes[i]["frac"] == 0) {
                        var contok = true;
                        if (keep["attack"] || keep["caster"]) { // 3 attack, 13 caster
                            if (keep["attack"]) {
                                if (usemtypes[useaffixes[i]["id"]]["strcheck"].indexOf("|3|") > -1) {
                                    contok = false;
                                }
                            }
                            if (keep["caster"]) {
                                if (usemtypes[useaffixes[i]["id"]]["strcheck"].indexOf("|13|") > -1) {
                                    contok = false;
                                }
                            }
                        }
                        if (contok) {
                            var prvweight = poec_simCatToRWeight(1000, apcat, useaffixes[i]);
                            if (nonto) {
                                if (useaffixes[i]["id"] > 0) {
                                    if (tag == "inf") {
                                        if (crsim_infgrps.indexOf("|" + useaffixes[i]["mgrp"] + "|") > -1) {
                                        } else {
                                            tewght += prvweight;
                                            relig.push({"i": i, "w": prvweight});
                                        }
                                    } else {
                                        if (useaffixes[i]["maven"]) {
                                            if (crsim_mvdata[useaffixes[i]["maven"]]["strcheck"].indexOf("|" + tag + "|") > -1) {
                                            } else {
                                                tewght += prvweight;
                                                relig.push({"i": i, "w": prvweight});
                                            }
                                        } else {
                                            if (usemtypes[useaffixes[i]["id"]]["strcheck"].indexOf("|" + tag + "|") > -1) {
                                            } else {
                                                tewght += prvweight;
                                                relig.push({"i": i, "w": prvweight});
                                            }
                                        }
                                    }
                                } else {
                                    tewght += prvweight;
                                    relig.push({"i": i, "w": prvweight});
                                }
                            } else {
                                if (tag == "inf") {
                                    if (crsim_infgrps.indexOf("|" + useaffixes[i]["mgrp"] + "|") > -1) {
                                        tewght += prvweight;
                                        relig.push({"i": i, "w": prvweight});
                                    }
                                } else {
                                    if (useaffixes[i]["maven"]) {
                                        if (crsim_mvdata[useaffixes[i]["maven"]]["strcheck"].indexOf("|" + tag + "|") > -1) {
                                            tewght += prvweight;
                                            relig.push({"i": i, "w": prvweight});
                                        }
                                    } else {
                                        if (usemtypes[useaffixes[i]["id"]]["strcheck"].indexOf("|" + tag + "|") > -1) {
                                            tewght += prvweight;
                                            relig.push({"i": i, "w": prvweight});
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        } else {
            if (mgroup) {
                // TODO (unused)
            } else {
                for (var i = 0; i < useaffixes.length; i++) {
                    var skip = false;
                    if (ruleout) {
                        if (ruleout.indexOf("|" + i + "|") > -1) {
                            skip = true;
                        }
                    }
                    if (!skip) {
                        if (!keep[useaffixes[i]["atype"]] && useaffixes[i]["frac"] == 0) {
                            var contok = true;
                            if (keep["attack"] || keep["caster"]) { // 3 attack, 13 caster
                                if (keep["attack"]) {
                                    if (usemtypes[useaffixes[i]["id"]]["strcheck"].indexOf("|3|") > -1) {
                                        contok = false;
                                    }
                                }
                                if (keep["caster"]) {
                                    if (usemtypes[useaffixes[i]["id"]]["strcheck"].indexOf("|13|") > -1) {
                                        contok = false;
                                    }
                                }
                            }
                            if (contok) {
                                var prvweight = poec_simCatToRWeight(1000, apcat, useaffixes[i]);
                                tewght += prvweight;
                                relig.push({"i": i, "w": prvweight});
                            }
                        }
                    }
                }
            }
        }
    }

    if (relig.length > 0) {
        // Roll for affix
        var rnd = poec_rand(1, tewght, true);
        var simTWeight = 0;
        var remaff = null;
        var rchg = 0;
        for (var i = 0; i < relig.length; i++) {
            var rs = simTWeight + 1;
            var re = simTWeight + relig[i]["w"];
            if (rnd >= rs && rnd <= re) {
                remaff = relig[i]["i"];
                rchg = relig[i]["w"];
                break;
            }
            simTWeight += relig[i]["w"];
        }
        if (remaff !== null) {
            raff = useaffixes[remaff];
            raff["chance"] = rchg / tewght;
            var rbaff = [];
            for (var i = 0; i < useaffixes.length; i++) {
                if (i != remaff) {
                    rbaff.push(useaffixes[i]);
                } else {
                    useaffbt[useaffixes[i]["atype"]]--;
                }
            }
            useaffixes = rbaff;
        } else {
            console.log("Could not roll a mod to remove! Should not happen");
        }
    } else {
        console.log("No eligible mod to remove! (Can happen?)");
    }
    //console.log(raff);

    if (crsim_bypass) {
        crsim_bypass["iaffixes"] = useaffixes;
        crsim_bypass["iaffbt"] = useaffbt;
        // Update meta flags
        poec_simUpdateMeta();
    } else {
        crsim_data["iaffixes"] = useaffixes;
        crsim_data["iaffbt"] = useaffbt;
    }

    return raff;
}

function poec_simCatToRWeight(weight, apcat, mod) {
    // Catalyst nerf
    /*
  if(mod["id"]>0){
    if(apcat&&crsim_catalyst&&crsim_data["is_catalyst"]){
      for(var j=0;j<crsim_catdata[crsim_catalyst["id"]].length;j++){
        if(crsim_data["mtypes"][mod["id"]]["strcheck"].indexOf("|"+crsim_catdata[crsim_catalyst["id"]][j]+"|")>-1){
          weight-=weight*(crsim_catalyst["val"]/100);
          break;
        }
      }
    }
  }
  */
    return weight;
}

function poec_simClearItem(meta) {
    if (crsim_bypass) {
        var useaffixes = crsim_bypass["iaffixes"];
        var usemetas = crsim_bypass["meta_flags"];
        var useaffbt = crsim_bypass["iaffbt"];
    } else {
        var useaffixes = crsim_data["iaffixes"];
        var usemetas = crsim_data["meta_flags"];
        var useaffbt = crsim_data["iaffbt"];
    }

    if (meta) {
        // Follow meta-mods
        var keep = {"prefix": false, "suffix": false};
        if (usemetas["nchg_pre"]) {
            keep["prefix"] = true;
        }
        if (usemetas["nchg_suf"]) {
            keep["suffix"] = true;
        }
        var naffixes = [];
        var nafftcnt = {"prefix": 0, "suffix": 0};
        var nfrac = 0;
        for (var i = 0; i < useaffixes.length; i++) {
            if (keep[useaffixes[i]["atype"]] || useaffixes[i]["frac"] == 1) {
                naffixes.push(useaffixes[i]);
                nafftcnt[useaffixes[i]["atype"]]++;
                if (useaffixes[i]["frac"] == 1) {
                    nfrac++;
                }
            }
        }
        var nrarity = "normal";
        if (naffixes.length > 0) {
            if (nafftcnt["prefix"] > 1 || nafftcnt["suffix"] > 1) {
                nrarity = "rare";
            } else {
                if (nfrac > 0 && nafftcnt["prefix"] == 1 && nafftcnt["suffix"] == 1) {
                    nrarity = "rare";
                } else {
                    nrarity = "magic";
                }
            }
        }
        poec_simSetRarity(nrarity);
        useaffixes = naffixes;
        useaffbt = nafftcnt;
    } else {
        // Just clear it all
        poec_simSetRarity("normal");
        useaffixes = [];
        useaffbt = {"prefix": 0, "suffix": 0};
    }

    if (crsim_bypass) {
        crsim_bypass["iaffixes"] = useaffixes;
        crsim_bypass["iaffbt"] = useaffbt;
    } else {
        crsim_data["iaffixes"] = useaffixes;
        crsim_data["iaffbt"] = useaffbt;
    }

    poec_simUpdateMeta();
}

function poec_simRerollValues(tag, what, lucky) {
    var rrst = {"rolls": 0, "cap": 0};

    if (crsim_bypass) {
        var useaffixes = crsim_bypass["iaffixes"];
        var usemetas = crsim_bypass["meta_flags"];
        var usemtypes = crsim_bypass["mtypes"];
    } else {
        var useaffixes = crsim_data["iaffixes"];
        var usemetas = crsim_data["meta_flags"];
        var usemtypes = crsim_data["mtypes"];
    }

    var keep = {"prefix": false, "suffix": false};

    if (what) {
        if (what["implicit"]) {
            poec_simRerollImplicits(lucky);
        }
        if (!what["prefix"]) {
            keep["prefix"] = true;
        }
        if (!what["suffix"]) {
            keep["suffix"] = true;
        }
    }

    if (usemetas["nchg_pre"]) {
        keep["prefix"] = true;
    }
    if (usemetas["nchg_suf"]) {
        keep["suffix"] = true;
    }

    for (var i = 0; i < useaffixes.length; i++) {
        var ivalid = true;
        if (tag) {
            if (useaffixes[i]["maven"]) {
                if (crsim_mvdata[useaffixes[i]["maven"]]["strcheck"].indexOf("|" + tag + "|") > -1) {
                } else {
                    ivalid = false;
                }
            } else {
                if (usemtypes[useaffixes[i]["id"]]["strcheck"].indexOf("|" + tag + "|") > -1) {
                } else {
                    ivalid = false;
                }
            }
        }
        if (useaffixes[i]["id"] == -1) {
            ivalid = false;
        }
        if (useaffixes[i]["frac"] == 1) {
            ivalid = false;
        }
        if (keep[useaffixes[i]["atype"]]) {
            ivalid = false;
        }
        if (ivalid) {
            // Roll values
            var nvalues = jQuery.parseJSON(useaffixes[i]["nvalues"]);
            var rolls = [];
            for (var z = 0; z < nvalues.length; z++) {
                if (Array.isArray(nvalues[z])) {
                    if (Math.ceil(nvalues[z][0]) != nvalues[z][0] || Math.ceil(nvalues[z][1]) != nvalues[z][1]) {
                        var nrand = Math.round(poec_rand((nvalues[z][0] * 100), (nvalues[z][1] * 100) + 1, true)) / 100;
                    } else {
                        var nrand = poec_rand(nvalues[z][0], nvalues[z][1] + 1, true);
                    }
                    if (lucky) {
                        if (Math.ceil(nvalues[z][0]) != nvalues[z][0] || Math.ceil(nvalues[z][1]) != nvalues[z][1]) {
                            var nrand2 = Math.round(poec_rand((nvalues[z][0] * 100), (nvalues[z][1] * 100) + 1, true)) / 100;
                        } else {
                            var nrand2 = poec_rand(nvalues[z][0], nvalues[z][1] + 1, true);
                        }
                        if (nrand < 0) {
                            if (nrand > nrand2) {
                                nrand = nrand2;
                            }
                        } else {
                            if (nrand2 > nrand) {
                                nrand = nrand2;
                            }
                        }
                    }
                    rrst["cap"] += nvalues[z][1] - nvalues[z][0];
                    rrst["rolls"] += nrand - nvalues[z][0];
                    rolls.push(nrand);
                } else {
                    rolls.push(nvalues[z]);
                }
            }
            useaffixes[i]["rolls"] = rolls;
        }
    }

    if (crsim_bypass) {
        crsim_bypass["iaffixes"] = useaffixes;
    } else {
        crsim_data["iaffixes"] = useaffixes;
    }

    return rrst;
}

function poec_simRerollImplicits(lucky) {
    if (crsim_bypass) {
        var userollableimps = crsim_bypass["rollable_implicits"];
        var useimplicits = crsim_bypass["implicits"];
    } else {
        var userollableimps = crsim_data["rollable_implicits"];
        var useimplicits = crsim_data["implicits"];
    }

    var rrst = {"rolls": 0, "cap": 0};
    if (userollableimps > 0) {
        for (var i = 0; i < useimplicits.length; i++) {
            if (useimplicits[i]["name"] != undefined) {
                if (useimplicits[i]["nvalues"]) {
                    var rolls = [];
                    for (var j = 0; j < useimplicits[i]["nvalues"].length; j++) {
                        if (Math.ceil(useimplicits[i]["nvalues"][j][0]) != useimplicits[i]["nvalues"][j][0] || Math.ceil(useimplicits[i]["nvalues"][j][1]) != useimplicits[i]["nvalues"][j][1]) {
                            var nrand = Math.round(poec_rand((useimplicits[i]["nvalues"][j][0] * 100), (useimplicits[i]["nvalues"][j][1] * 100) + 1, true)) / 100;
                        } else {
                            var nrand = poec_rand(useimplicits[i]["nvalues"][j][0], useimplicits[i]["nvalues"][j][1] + 1, true);
                        }
                        if (lucky) {
                            if (Math.ceil(useimplicits[i]["nvalues"][j][0]) != useimplicits[i]["nvalues"][j][0] || Math.ceil(useimplicits[i]["nvalues"][j][1]) != useimplicits[i]["nvalues"][j][1]) {
                                var nrand2 = Math.round(poec_rand((useimplicits[i]["nvalues"][j][0] * 100), (useimplicits[i]["nvalues"][j][1] * 100) + 1, true)) / 100;
                            } else {
                                var nrand2 = poec_rand(useimplicits[i]["nvalues"][j][0], useimplicits[i]["nvalues"][j][1] + 1, true);
                            }
                            if (nrand < 0) {
                                if (nrand > nrand2) {
                                    nrand = nrand2;
                                }
                            } else {
                                if (nrand2 > nrand) {
                                    nrand = nrand2;
                                }
                            }
                        }
                        rolls.push(nrand);
                        rrst["cap"] += useimplicits[i]["nvalues"][j][1] - useimplicits[i]["nvalues"][j][0];
                        rrst["rolls"] += nrand - useimplicits[i]["nvalues"][j][0];
                    }
                    useimplicits[i]["rolls"] = rolls;
                }
            } else {
                useimplicits[i]["rolls"] = poec_simRollValues(useimplicits[i]["nvalues"]);
            }
        }
    }

    if (crsim_bypass) {
        crsim_bypass["implicits"] = useimplicits;
    } else {
        crsim_data["implicits"] = useimplicits;
    }

    return rrst;
}

function poec_simSetRarity(rarity) {
    if (crsim_bypass) {
        crsim_bypass["rarity"] = rarity;
        switch (rarity) {
            case 'normal' :
                crsim_bypass["cmaxaffgrp"] = {"prefix": 0, "suffix": 0};
                break;
            case 'magic' :
                crsim_bypass["cmaxaffgrp"] = {"prefix": 1, "suffix": 1};
                break;
            case 'rare' :
                crsim_bypass["cmaxaffgrp"] = crsim_bypass["maxaffgrp"];
                break;
        }
    } else {
        crsim_settings["rarity"] = rarity;
        switch (rarity) {
            case 'normal' :
                crsim_data["cmaxaffgrp"] = {"prefix": 0, "suffix": 0};
                break;
            case 'magic' :
                crsim_data["cmaxaffgrp"] = {"prefix": 1, "suffix": 1};
                break;
            case 'rare' :
                crsim_data["cmaxaffgrp"] = crsim_data["maxaffgrp"];
                break;
        }
        $("#simItemHolder").removeClass("normal magic rare").addClass(rarity);
    }
}

function poec_simAddInfluence(inf) {
    if (crsim_bypass) {
        var useinfluence = crsim_bypass["influences"];
    } else {
        var useinfluence = crsim_settings["influences"];
    }
    useinfluence = [inf];
    if (crsim_bypass) {
        crsim_bypass["influences"] = useinfluence;
    } else {
        crsim_settings["influences"] = useinfluence;
        poec_setItemOutputInfluence();
    }
}

function poec_checkGetCatAWeight(catmod, strcheck) {
    for (var j = 0; j < crsim_catdata[crsim_catalyst["id"]].length; j++) {
        if (strcheck.indexOf("|" + crsim_catdata[crsim_catalyst["id"]][j] + "|") > -1) {
            return catmod;
            break;
        }
    }
    return 1;
}

function poec_simBuildMods(mgroup, tag, atype, fossil, blkdata, apcat, enforcetag, rfmlk, rfmlkt, rfmlkv, hightier) {
    if (crsim_bypass) {
        var usefmodpool = crsim_bypass["fmodpool"];
        var useiscatalyst = crsim_bypass["is_catalyst"];
        var usecatalyst = crsim_bypass["catalyst"];
        var usemtypes = crsim_bypass["mtypes"];
    } else {
        var usefmodpool = crsim_data["fmodpool"];
        var useiscatalyst = crsim_data["is_catalyst"];
        var usecatalyst = crsim_catalyst;
        var usemtypes = crsim_data["mtypes"];
    }

    var vmods = [];
    if (mgroup) {
        validmgroup = "|" + mgroup + "|";
    } else {
        var validmgroup = "|1|";
        validmgroup += blkdata["vmgroups"];
        if (fossil) {
            validmgroup += "8|";
        }
    }
    var catmod = 1;
    if (apcat && useiscatalyst && usecatalyst) {
        catmod += usecatalyst["val"] / 100;
    }
    $.each(usefmodpool[atype], function (idmgroup, mods) {
        if (validmgroup.indexOf("|" + idmgroup + "|") > -1) {
            for (var j = 0; j < mods.length; j++) {
                var mconflict = false;
                for (var zy = 0; zy < mods[j]["modgroups"].length; zy++) {
                    if (blkdata["blkmgroups"].indexOf("|" + mods[j]["modgroups"][zy] + "|") > -1) {
                        mconflict = true;
                    }
                }
                if (mconflict) {
                } else {
                    var valid = true;
                    if (tag) {
                        if (tag == "inf") {
                            if (crsim_infgrps.indexOf("|" + mods[j]["id_mgroup"] + "|") > -1) {
                            } else {
                                valid = false;
                            }
                        } else {
                            if (usemtypes[mods[j]["id_modifier"]]["strcheck"].indexOf("|" + tag + "|") > -1) {
                            } else {
                                valid = false;
                            }
                        }
                    }
                    var tamgs = poec_getAMGs(poecd["modifiers"]["seq"][poecd["modifiers"]["ind"][mods[j]["id_modifier"]]]["amg"]);
                    if (tamgs) {
                        for (var h = 0; h < tamgs.length; h++) {
                            if (blkdata["amgs"].indexOf("|" + tamgs[h] + "|") > -1) {
                                valid = false;
                            }
                        }
                    }
                    for (var o = 0; o < blkdata["blktags"].length; o++) {
                        if (usemtypes[mods[j]["id_modifier"]]["strcheck"].indexOf("|" + blkdata["blktags"][o] + "|") > -1) {
                            valid = false;
                            break;
                        }
                    }
                    if (mods[j]["id_mgroup"] == 8 && crsim_fossiling) {
                        if (crsim_fossiling["strfossils"].indexOf("|" + mods[j]["id_fossil"] + "|") > -1) {
                        } else {
                            valid = false;
                        }
                    }
                    if (valid) {
                        var modc = 1;
                        if (catmod > 1) {
                            modc = poec_checkGetCatAWeight(catmod, usemtypes[mods[j]["id_modifier"]]["strcheck"]);
                        }
                        var modw = 1;
                        if (crsim_fossiling !== false) {  // IF fossil, modify weighting as needed
                            var fmod = {
                                "tmtypes": usemtypes[mods[j]["id_modifier"]]["strcheck"],
                                "mtypes": usemtypes[mods[j]["id_modifier"]]["mtarr"]
                            }
                            modw = poec_getModdedWeight(fmod, crsim_fossiling["fmtypes"], 1, crsim_fossiling["hybrids"]);
                        } else {
                            if (enforcetag == "inf") {
                                if (crsim_infgrps.indexOf("|" + mods[j]["id_mgroup"] + "|") > -1) {
                                    modw = 10;
                                }
                            } else {
                                if (usemtypes[mods[j]["id_modifier"]]["strcheck"].indexOf("|" + enforcetag + "|") > -1) {
                                    modw = 10;
                                } else {
                                    if (rfmlk[mods[j]["id_modifier"]] != undefined || rfmlkt[poecd["modifiers"]["seq"][poecd["modifiers"]["ind"][mods[j]["id_modifier"]]]["name_modifier"]] != undefined) {
                                        if (rfmlkv == 1) {
                                            modw = 90;
                                        } else {
                                            modw = 0.01;
                                        }
                                    }
                                }
                            }
                        }
                        if (hightier) {
                            var start = mods[j]["tiers"].length - Math.ceil(mods[j]["tiers"].length / 2);
                        } else {
                            var start = 0;
                        }
                        for (var i = start; i < mods[j]["tiers"].length; i++) { // Add tiers
                            var tmodw = modw;
                            if (crsim_fossiling !== false && crsim_fossiling["has_sanc"]) { // Sanctified
                                tmodw = tmodw * mods[j]["tiers"][i]["sancmod"];
                            }

                            if (tmodw > 0) {
                                var fmodw = Math.round(mods[j]["tiers"][i]["weighting"] * tmodw * modc);
                                vmods.push({
                                    "id": mods[j]["id_modifier"],
                                    "mgrp": mods[j]["id_mgroup"],
                                    "tindex": i, "atype": mods[j]["affix"],
                                    "modgroups": mods[j]["modgroups"],
                                    "weight": fmodw,
                                    "nvalues": mods[j]["tiers"][i]["nvalues"],
                                    "amgs": tamgs
                                });
                                crsim_tweight += fmodw;
                            }
                        }
                    }
                }
            }
        }
    });

    return vmods;
}

function poec_simBuildModpool(atype) {
    var vmods = [];
    var cmods = [];

    if (!Array.isArray(atype)) {
        atype = [atype];
    }

    for (var z = 0; z < atype.length; z++) {
        $.each(crsim_data["fmodpool"][atype[z]], function (idmgroup, mods) {
            var is_bench = false;
            if (idmgroup == 11) {
                is_bench = true;
            }
            for (var j = 0; j < mods.length; j++) {
                var tweight = 0;
                var mtiers = [];
                for (var i = 0; i < mods[j]["tiers"].length; i++) {
                    mtiers.push({
                        "tindex": i,
                        "atype": mods[j]["affix"],
                        "weight": parseInt(mods[j]["tiers"][i]["weighting"]),
                        "nvalues": mods[j]["tiers"][i]["nvalues"],
                        "valout": mods[j]["tiers"][i]["valout"],
                        "ilvl": mods[j]["tiers"][i]["ilvl"]
                    });
                    tweight += parseInt(mods[j]["tiers"][i]["weighting"]);
                }
                if (mods[j]["meta"]) {
                    var is_meta = 1;
                } else {
                    var is_meta = 0;
                }
                vmods.push({
                    "id": mods[j]["id_modifier"],
                    "mgrp": mods[j]["id_mgroup"],
                    "atype": mods[j]["affix"],
                    "vex": mods[j]["vex"],
                    "modgroups": mods[j]["modgroups"],
                    "imeta": is_meta,
                    "meta": mods[j]["meta"],
                    "maven": 0,
                    "tiers": mtiers,
                    "tweight": tweight,
                    "ntiers": mods[j]["umtiers"]
                });
                if (!is_bench) {
                    crsim_cmpfull[mods[j]["id_modifier"]] = {
                        "id": mods[j]["id_modifier"],
                        "mgrp": mods[j]["id_mgroup"],
                        "atype": mods[j]["affix"],
                        "mtypes": crsim_data["mtypes"][mods[j]["id_modifier"]]["strcheck"]
                    };
                }
            }
        });
    }
    /*
  if(bench){
    // TODO : Reorder by meta first

  }
  */
    return vmods;
}

var crsim_lock = false;

function poec_simRefreshModPool() {
    var blkdata = poec_simGetBlockData();
    var actgrps = "|1|" + blkdata["vmgroups"];

    // Clear previous settings
    $("#crsimMasterModpool").find(".modpooltbl.prefix").removeClass("aftblkfalse aftblktrue").addClass("aftblk" + blkdata["blkutype"]["prefix"]);
    $("#crsimMasterModpool").find(".modpooltbl.suffix").removeClass("aftblkfalse aftblktrue").addClass("aftblk" + blkdata["blkutype"]["suffix"]);
    $("#crsimMasterModpool").find(".fractrue").removeClass("fractrue");
    $("#crsimMasterModpool").find(".blktrue,.prtrue,.find0").removeClass("blktrue prtrue find0");
    // Set stuff
    for (var i = 0; i < crsim_data["iaffixes"].length; i++) {
        $("#simMPa" + crsim_data["iaffixes"][i]["id"]).addClass("prtrue");
        $("#simMPa" + crsim_data["iaffixes"][i]["id"] + "det").addClass("prtrue");
        if (crsim_data["iaffixes"][i]["modgroups"]) {
            for (var zy = 0; zy < crsim_data["iaffixes"][i]["modgroups"].length; zy++) {
                $("#crsimMasterModpool").find(".modpooltbl:not(.implicit)").find(".smgrp_" + crsim_data["iaffixes"][i]["modgroups"][zy]).addClass("blktrue");
            }
        }
        if (crsim_data["iaffixes"][i]["tindex"] == -1) {
            $("#simMPa" + crsim_data["iaffixes"][i]["id"] + "t0").addClass("find0");
        } else {
            $("#simMPa" + crsim_data["iaffixes"][i]["id"] + "t" + crsim_data["iaffixes"][i]["tindex"]).addClass("find0");
        }
        if (crsim_data["iaffixes"][i]["frac"] == 1) {
            $("#simMPa" + crsim_data["iaffixes"][i]["id"] + "det").addClass("fractrue");
        }
    }
    // Set implicits
    if (crsim_data["implicits"]) {
        for (var i = 0; i < crsim_data["implicits"].length > 0; i++) {
            if (crsim_data["implicits"][i]["name"] == undefined) {
                $("#simMPa" + crsim_data["implicits"][i]["id"]).addClass("prtrue");
                $("#simMPa" + crsim_data["implicits"][i]["id"] + "det").addClass("prtrue");
                for (var zy = 0; zy < crsim_data["implicits"][i]["modgroups"].length; zy++) {
                    $("#crsimMasterModpool").find("#crsimMPImplicit").find(".smgrp_" + crsim_data["implicits"][i]["modgroups"][zy]).addClass("blktrue");
                }
                $("#simMPa" + crsim_data["implicits"][i]["id"] + "t" + crsim_data["implicits"][i]["tindex"]).addClass("find0");
            }
        }
    }

    // Set amgs
    if (blkdata["amgs"].length > 1) {
        var amgs = blkdata["amgs"].substring(1, blkdata["amgs"].length - 1).split("|");
        for (var i = 0; i < amgs.length; i++) {
            $("#crsimMasterModpool").find(".amg_" + amgs[i] + ":not(.prtrue)").addClass("blktrue");
        }
    }

    // Set active modgroups
    $("#crsimMasterModpool").find(".stmgrp").removeClass("active");
    if (crsim_settings["influences"]) {
        for (var i = 0; i < crsim_settings["influences"].length; i++) {
            $("#crsimMasterModpool").find(".mgrp" + crsim_settings["influences"][i]).addClass("active");
        }
    }

    // Regen harvest modpool
    var cmods = {"prefix": [], "suffix": []};
    var hmods = {"prefix": [], "suffix": []};
    $("#crsimMasterModpool").find(".modpooltbl:not(.implicit)").find(".smaff_mp:not(.blktrue,.prtrue)").each(function () {
        if (actgrps.indexOf("|" + $(this).attr("mgrp") + "|") > -1) {
            cmods[crsim_cmpfull[$(this).attr("affid")]["atype"]].push(crsim_cmpfull[$(this).attr("affid")]);
        }
    });
    $("#crsimMasterModpool").find(".modpooltbl:not(.implicit)").find(".smaff_mp").each(function () {
        if (actgrps.indexOf("|" + $(this).attr("mgrp") + "|") > -1) {
            hmods[crsim_cmpfull[$(this).attr("affid")]["atype"]].push(crsim_cmpfull[$(this).attr("affid")]);
        }
    });
    crsim_data["cmodpool"] = cmods;
    crsim_data["hmodpool"] = hmods;

    crsim_lock = false;
}

function poec_simToggleMGRP(vThis) {
    if (!$(vThis).hasClass("active")) {
        var mgrp = $(vThis).attr("mgrp");
        if ($(vThis).hasClass("toggled")) {
            $("#crsimMasterModpool").find(".mgrp" + mgrp).removeClass("toggled");
        } else {
            $("#crsimMasterModpool").find(".mgrp" + mgrp).addClass("toggled");
        }
    }
}

function poec_getAMGs(amgs) {
    return null; // Change since multigroup
    /*
  if(amgs){
    amgs=amgs.split("|");
    return amgs;
  }else{
    return null;
  }
  */
}

function poec_getAMGcls(tamgs) {
    var amgcls = "";
    if (tamgs) {
        for (var i = 0; i < tamgs.length; i++) {
            amgcls += " amg_" + tamgs[i];
        }
    }
    return amgcls;
}

function poec_simBuildMPHtml(modpool, atype, ptype) {
    if (modpool.length == 0) {
        var vHTML = "<div class='gen_msg'>" + applyLang("There are no affixes of this type for this base.") + "</div>";
    } else {
        var vHTML = "<div class='gen_msg search_not_found'>" + applyLang("No affix found for this type.") + "</div>";
        vHTML += "<table cellspacing='0' class='div_stable modpooltbl " + atype + "'>";
        var vTHEAD = "<div class='header'><div class='info'><div>" + applyLang("Tier") + "</div></div><div class='ilvl'><div>" + applyLang("iLvl") + "</div></div><div class='wgt'><div>" + applyLang("Weight") + "</div></div></div>";

        var lastmgrp = 0;
        var bcls = "lt";
        if (atype == "implicit") {
            var use = "atype";
        } else {
            var use = "mgrp";
        }
        for (var i = 0; i < modpool.length; i++) {
            if (lastmgrp != modpool[i][use]) {
                lastmgrp = modpool[i][use];
                if (use == "mgrp") {
                    if (modpool[i][use] == 1) {
                        var gname = applyLang("Base modpool");
                    } else {
                        var gname = poecd["mgroups"]["seq"][poecd["mgroups"]["ind"][modpool[i]["mgrp"]]]["name_mgroup"];
                    }
                } else {
                    switch (modpool[i][use]) {
                        case 'eldritch_blue' :
                            var gname = applyLang("Eater of Worlds");
                            break;
                        case 'eldritch_red' :
                            var gname = applyLang("Searing Exarch");
                            break;
                        default:
                            var gname = applyLang("Vaal implicits");
                            break;
                    }
                }
                vHTML += "<tr id='simMG" + atype + modpool[i][use] + "' class='stmgrp mgrp mgrp" + modpool[i][use] + "' onClick='poec_simToggleMGRP(this)' mgrp='" + modpool[i][use] + "'><td><div>" + gname + "</div></td></tr>";
                if (use == "atype") {
                    ptype = "im";
                } else {
                    if (modpool[i]["mgrp"] == 11) {
                        ptype = "cb";
                    } else {
                        ptype = "mp";
                    }
                }
            }
            if (bcls == "lt") {
                bcls = "drk";
            } else {
                bcls = "lt";
            }
            var tamgs = poec_getAMGs(poecd["modifiers"]["seq"][poecd["modifiers"]["ind"][modpool[i]["id"]]]["amg"]);
            var tamgcls = poec_getAMGcls(tamgs);
            var searchterm = poecl["mod"][modpool[i]["id"]].toLowerCase().replace(/["']/g, "");
            var mgrpnames = "";
            for (var zy = 0; zy < modpool[i]["modgroups"].length; zy++) {
                tamgcls += " smgrp_" + modpool[i]["modgroups"][zy];
                mgrpnames += ", " + modpool[i]["modgroups"][zy];
            }
            mgrpnames = mgrpnames.substring(2, mgrpnames.length);
            vHTML += "<tr id='simMPa" + modpool[i]["id"] + "' atype='" + atype + "' class='affix smaff_" + ptype + " stmgrp mgrp" + modpool[i][use] + " " + tamgcls + " " + bcls + " mt" + modpool[i]["imeta"] + "' mgrp='" + modpool[i][use] + "' affid='" + modpool[i]["id"] + "' search='" + searchterm + "' onClick='poec_simToggleMPAffix(this,\"" + atype + "\",\"" + ptype + "\")'>";
            var fmname = poecl["mod"][modpool[i]["id"]];
            if (crsim_settings["bgroup"] == 11 || crsim_settings["bgroup"] == 15) {
                fmname = poec_parseMapName(fmname);
            }
            vHTML += "<td class='name'><div>" + fmname + crsim_data["mtypes"][modpool[i]["id"]]["houtput"] + "</div></td>";
            vHTML += "</tr>";
            vHTML += "<tr id='simMPa" + modpool[i]["id"] + "det' class='affdet stmgrp mgrp" + modpool[i][use] + " " + tamgcls + "'><td><div class='modgroup'>" + mgrpnames + "<div class='frac' onClick='poec_simToggleFrac(this," + modpool[i]["id"] + ",\"" + ptype + "\")'></div></div><div class='div_stable adtierstbl'>";
            vHTML += vTHEAD;
            if (modpool[i]["present"]) {
                // Get tier of mod
                for (var j = 0; j < crsim_data["iaffixes"].length; j++) {
                    if (crsim_data["iaffixes"][j]["id"] == modpool[i]["id"]) {
                        findex = crsim_data["iaffixes"][j]["tindex"];
                        break;
                    }
                }
            }
            var lastj = 0;
            for (var j = 0; j < modpool[i]["tiers"].length; j++) {
                vHTML += "<div id='simMPa" + modpool[i]["id"] + "t" + j + "' class='tier'>";
                vHTML += "<div class='info'><div>T" + (modpool[i]["ntiers"] - j) + "<div class='nval'>" + modpool[i]["tiers"][j]["valout"] + "</div></div></div>";
                vHTML += "<div class='ilvl'><div>" + modpool[i]["tiers"][j]["ilvl"] + "</div></div>";
                if (modpool[i]["vex"] == 1) {
                    var sweight = "<span class='na'>N/A</span>";
                } else {
                    var sweight = modpool[i]["tiers"][j]["weight"];
                }
                vHTML += "<div class='wgt last'><div>" + sweight + "</div><div class='act' onClick='poec_simForceAction(this,\"" + ptype + "\"," + modpool[i]["id"] + "," + j + ")'></div></div>";
                vHTML += "</div>";
                lastj = j;
            }
            // Check for maven
            if (crsim_mavenact && ptype == "mp") {
                if (crsim_infgrps.indexOf("|" + modpool[i]["mgrp"] + "|") > -1) {
                    if (poecd["maeven"]["bmods"][crsim_settings["base"] + "-" + modpool[i]["id"]] != undefined) {
                        var tmaven = poecd["maeven"]["ind"][poecd["maeven"]["bmods"][crsim_settings["base"] + "-" + modpool[i]["id"]]];
                        vHTML += "<div id='simMPa" + modpool[i]["id"] + "te' class='tier maven'>";
                        var showmtags = "";
                        if (crsim_data["mtypes"][modpool[i]["id"]]["houtput"] != crsim_mvdata[poecd["maeven"]["bmods"][crsim_settings["base"] + "-" + modpool[i]["id"]]]["houtput"]) {
                            showmtags = crsim_mvdata[poecd["maeven"]["bmods"][crsim_settings["base"] + "-" + modpool[i]["id"]]]["houtput"];
                        }
                        vHTML += "<div class='info'><div>" + tmaven["name"] + showmtags + "</div></div>";
                        vHTML += "<div class='ilvl'><div>" + modpool[i]["tiers"][lastj]["ilvl"] + "</div></div>";
                        vHTML += "<div class='wgt last'><div>0</div><div class='act' onClick='poec_simForceAction(this,\"" + ptype + "\"," + modpool[i]["id"] + ",\"e\")'></div></div>";
                        vHTML += "</div>";
                    }
                }
            }

            vHTML += "</div></td></tr>";
        }

        vHTML += "</table>";
    }

    return vHTML;
}

function poec_simToggleMPAffix(vThis, atype, ptype) {
    var affid = $(vThis).attr("affid");
    crsim_opened[ptype][atype] = null;
    if ($(vThis).hasClass("opened")) {
        $(vThis).removeClass("opened");
        $("#simMPa" + affid + "det").removeClass("opened");
    } else {
        $(vThis).parent().children(".opened").removeClass("opened");
        $(vThis).parent().children(".affdet").removeClass("opened");
        $(vThis).addClass("opened");
        $("#simMPa" + affid + "det").addClass("opened");
        crsim_opened[ptype][atype] = affid;
    }
}

/************/
/* SPENDING */

/************/
function poec_simResetSpending() {
    $.each(crsim_actions["currency"], function (acode, asets) {
        crsim_spending["currency"][acode] = 0;
    });
    $.each(crsim_actions["actions"], function (acode, asets) {
        switch (acode) {
            case 'harvest' :
                $.each(crsim_spending["actions"][acode], function (scode, ssets) {
                    $.each(ssets, function (sscode, cnt) {
                        crsim_spending["actions"][acode][scode][sscode] = 0;
                    });
                });
                break;
            case 'essence' :
                $.each(crsim_spending["actions"][acode], function (scode, ssets) {
                    $.each(ssets, function (sscode, cnt) {
                        crsim_spending["actions"][acode][scode][sscode] = 0;
                    });
                });
                break;
            default :
                $.each(crsim_spending["actions"][acode], function (scode, cnt) {
                    crsim_spending["actions"][acode][scode] = 0;
                });
                break;
        }
    });
    poec_simUpdateSpending();
}

var crsim_spltm = null;

function poec_simUpdateSpending(mode, acode, cnt, rlog) {
    if (mode) {
        if (mode == "currency") {
            if (cnt == 0) {
                var vCNT = "";
            } else {
                var vCNT = cnt;
            }
            $("#crsimOptCur").find(".ac_" + acode).find(".ccnt").html(vCNT);
        } else {
            if (rlog) {
                var suba = rlog["subaction"];
                var ssba = rlog["ssaction"];
            } else {
                var suba = crsim_params["subaction"];
                var ssba = crsim_params["ssaction"];
            }
            switch (acode) {
                case 'fossil' :
                    var nreso = suba.length;
                    crsim_spending["actions"]["fossil"]["reso" + nreso] += cnt;
                    for (var i = 0; i < suba.length; i++) {
                        crsim_spending["actions"]["fossil"][suba[i]] += cnt;
                    }
                    break;
                case 'harvest' :
                    crsim_spending["actions"]["harvest"][suba][ssba] += cnt;
                    break;
                case 'essence' :
                    crsim_spending["actions"]["essence"][suba][ssba] += cnt;
                    break;
                default:
                    if (crsim_spending["actions"][acode] != undefined) {
                        crsim_spending["actions"][acode][suba] += cnt;
                    }
                    break;
            }
        }
    } else {
        // Update all spending
        $.each(crsim_actions["currency"], function (acode, asets) {
            if (crsim_spending["currency"][acode] == 0) {
                var vCNT = "";
            } else {
                var vCNT = crsim_spending["currency"][acode];
            }
            $("#crsimOptCur").find(".ac_" + acode).find(".ccnt").html(vCNT);
        });
    }

    // Update spending log
    clearTimeout(crsim_spltm);
    crsim_spltm = setTimeout(function () {
        poec_simUpdateSpendingLog();
    }, 500);
}

var crsim_prefcur = "chaos";

function poec_simUpdateSpendingLog() {
    var vHTML = "";
    var vOTH = "";
    var totcc = 0;
    $.each(crsim_actions["currency"], function (acode, asets) {
        if (crsim_spending["currency"][acode] > 0) {
            var ppcur = Math.round(poecp["data"][poec_cLNinja]["currency"][asets["name"]] * 100) / 100;
            var ppexa = Math.round((ppcur / poecp["data"][poec_cLNinja]["currency"]["Exalted Orb"]) * 100) / 100;
            var ppdiv = Math.round((ppcur / poecp["data"][poec_cLNinja]["currency"]["Divine Orb"]) * 100) / 100;
            vHTML += "<tr>";
            vHTML += "<td class='cnt'><div>" + crsim_spending["currency"][acode] + "</div></td>";
            vHTML += "<td class='name'><div><div class='icon'><img src=\"images/manual/method_" + acode + ".png\"></div>" + asets["name"] + "</div></td>";
            vHTML += "<td class='sprice amount'><div class='chaos'>" + ppcur + "</div><div class='exalted'>" + ppdiv + "</div></td>";
            vHTML += "<td class='tprice amount'><div class='chaos'>" + (Math.round((ppcur * crsim_spending["currency"][acode]) * 100) / 100) + "</div><div class='exalted'>" + (Math.round((ppdiv * crsim_spending["currency"][acode]) * 100) / 100) + "</div></td>";
            vHTML += "</tr>";
            totcc += (ppcur * crsim_spending["currency"][acode]);
        }
    });
    $.each(crsim_actions["actions"], function (acode, asets) {
        switch (acode) {
            case 'fossil' :
                $.each(crsim_spending["actions"][acode], function (fcode, cnt) {
                    if (cnt > 0) {
                        var rate = 0;
                        var fname = "";
                        var fimg = "";
                        if (fcode.substring(0, 4) == "reso") {
                            var reso = parseInt(fcode.substring(4, 5));
                            var term = "";
                            switch (reso) {
                                case 1 :
                                    term = "Primitive";
                                    break;
                                case 2 :
                                    term = "Potent";
                                    break;
                                case 3 :
                                    term = "Powerful";
                                    break;
                                case 4 :
                                    term = "Prime";
                                    break;
                            }
                            fname = term + " Chaotic";
                            rate = poecp["data"][poec_cLNinja]["resonators"][fname];
                            fname += " Resonator";
                            fimg = "resonator_" + reso;
                        } else {
                            switch (fcode) {
                                case 'perfect' :
                                case 'tangled' :
                                case 'gilded' :
                                    fname = fcode.capitalize();
                                    break;
                                default:
                                    fname = poecl["fossil"][fcode];
                                    break;
                            }
                            rate = poecp["data"][poec_cLNinja]["fossils"][fname];
                            fimg = "fossil_" + fcode;
                        }
                        var ppcur = Math.round(rate * 100) / 100;
                        var ppexa = Math.round((ppcur / poecp["data"][poec_cLNinja]["currency"]["Exalted Orb"]) * 100) / 100;
                        var ppdiv = Math.round((ppcur / poecp["data"][poec_cLNinja]["currency"]["Divine Orb"]) * 100) / 100;
                        vHTML += "<tr>";
                        vHTML += "<td class='cnt'><div>" + cnt + "</div></td>";
                        vHTML += "<td class='name'><div><div class='icon'><img src=\"images/manual/" + fimg + ".png\"></div>" + fname + "</div></td>";
                        vHTML += "<td class='sprice amount'><div class='chaos'>" + ppcur + "</div><div class='exalted'>" + ppdiv + "</div></td>";
                        vHTML += "<td class='tprice amount'><div class='chaos'>" + (Math.round((ppcur * cnt) * 100) / 100) + "</div><div class='exalted'>" + (Math.round((ppdiv * cnt) * 100) / 100) + "</div></td>";
                        vHTML += "</tr>";
                        totcc += (ppcur * cnt);
                    }
                });
                break;
            case 'harvest' :
                $.each(crsim_spending["actions"][acode], function (scode, sdata) {
                    $.each(sdata, function (sscode, cnt) {
                        if (cnt > 0) {
                            var nncode = sscode;
                            switch (scode) {
                                case 'hother' :
                                    var himg = "aharvest";
                                    var ssname = $("#harvestOtherChooser").find(".acss_" + sscode).text();
                                    break;
                                case 'hhight' :
                                    var himg = "aharvest";
                                    var ssname = $("#harvestHightierChooser").find(".acss_" + sscode).text();
                                    break;
                                case 'hresist' :
                                    var himg = "aharvest";
                                    var ssname = $("#harvestResistsChooser").find(".acss_" + sscode).text();
                                    break;
                                default:
                                    var himg = scode;
                                    if (sscode == "inf") {
                                        var ssname = applyLang("Influence");
                                    } else {
                                        var ssname = poecl["mtype"][sscode];
                                    }
                                    nncode = ssname.toLowerCase().replace("defences", "defence");
                                    break;
                            }
                            rate = 0;
                            if (poecp["data"][poec_cLNinja]["harvest"]) {
                                if (poecp["data"][poec_cLNinja]["harvest"][scode]) {
                                    if (poecp["data"][poec_cLNinja]["harvest"][scode][nncode]) {
                                        rate = poecp["data"][poec_cLNinja]["harvest"][scode][nncode];
                                    }
                                }
                            }
                            var ppcur = Math.round(rate * 100) / 100;
                            var ppexa = Math.round((ppcur / poecp["data"][poec_cLNinja]["currency"]["Exalted Orb"]) * 100) / 100;
                            var ppdiv = Math.round((ppcur / poecp["data"][poec_cLNinja]["currency"]["Divine Orb"]) * 100) / 100;
                            totcc += (ppcur * cnt);
                            vOTH += "<tr>";
                            vOTH += "<td class='cnt'><div>" + cnt + "</div></td>";
                            vOTH += "<td class='name'><div><div class='icon'><img src=\"images/manual/" + himg + ".png\"></div>" + crsim_actions["actions"][acode]["subset"][scode]["name"] + " : " + ssname + "</div></td>";
                            vOTH += "<td class='sprice amount'><div class='chaos'>" + ppcur + "</div><div class='exalted'>" + ppdiv + "</div></td>";
                            vOTH += "<td class='tprice amount'><div class='chaos'>" + (Math.round((ppcur * cnt) * 100) / 100) + "</div><div class='exalted'>" + (Math.round((ppdiv * cnt) * 100) / 100) + "</div></td>";
                            vOTH += "</tr>";
                        }
                    });
                });
                break;
            case 'syndicate' :
                $.each(crsim_spending["actions"][acode], function (scode, cnt) {
                    if (cnt > 0) {
                        rate = poecp["data"][poec_cLNinja]["other"][scode];
                        var ppcur = Math.round(rate * 100) / 100;
                        var ppexa = Math.round((ppcur / poecp["data"][poec_cLNinja]["currency"]["Exalted Orb"]) * 100) / 100;
                        var ppdiv = Math.round((ppcur / poecp["data"][poec_cLNinja]["currency"]["Divine Orb"]) * 100) / 100;
                        totcc += (ppcur * cnt);
                        vOTH += "<tr>";
                        vOTH += "<td class='cnt'><div>" + cnt + "</div></td>";
                        vOTH += "<td class='name'><div><div class='icon'><img src=\"images/manual/" + crsim_actions["actions"][acode]["subset"][scode]["img"] + ".png\"></div>" + crsim_actions["actions"][acode]["subset"][scode]["name"] + "</div></td>";
                        vOTH += "<td class='sprice amount'><div class='chaos'>" + ppcur + "</div><div class='exalted'>" + ppdiv + "</div></td>";
                        vOTH += "<td class='tprice amount'><div class='chaos'>" + (Math.round((ppcur * cnt) * 100) / 100) + "</div><div class='exalted'>" + (Math.round((ppdiv * cnt) * 100) / 100) + "</div></td>";
                        vOTH += "</tr>";
                    }
                });
                break;
            case 'beast_crafting' :
                // Craicic Chimeral / Farric Wolf Alpha / Farric Lynx Alpha
                $.each(crsim_spending["actions"][acode], function (scode, cnt) {
                    if (cnt > 0) {
                        var beast_rate = 0;
                        switch (scode) {
                            case 'imprint' :
                                beast_rate = poecp["data"][poec_cLNinja]["beasts"]["Craicic Chimeral"];
                                break;
                            case 'pretosuf' :
                                beast_rate = poecp["data"][poec_cLNinja]["beasts"]["Farric Wolf Alpha"];
                                break;
                            case 'suftopre' :
                                beast_rate = poecp["data"][poec_cLNinja]["beasts"]["Farric Lynx Alpha"];
                                break;
                            case 'breroll' :
                                beast_rate = poecp["data"][poec_cLNinja]["beasts"]["Farric Frost Hellion Alpha"];
                                break;
                            case 'bcat' :
                                beast_rate = poecp["data"][poec_cLNinja]["beasts"]["Farrul, First of the Plains"];
                                break;
                            case 'bavian' :
                                beast_rate = poecp["data"][poec_cLNinja]["beasts"]["Saqawal, First of the Sky"];
                                break;
                            case 'bspider' :
                                beast_rate = poecp["data"][poec_cLNinja]["beasts"]["Fenumus, First of the Night"];
                                break;
                            case 'bcrab' :
                                beast_rate = poecp["data"][poec_cLNinja]["beasts"]["Craiceann, First of the Deep"];
                                break;
                        }
                        var ppcur = Math.round(beast_rate * 100) / 100;
                        var ppexa = Math.round((ppcur / poecp["data"][poec_cLNinja]["currency"]["Exalted Orb"]) * 100) / 100;
                        var ppdiv = Math.round((ppcur / poecp["data"][poec_cLNinja]["currency"]["Divine Orb"]) * 100) / 100;
                        vHTML += "<tr>";
                        vHTML += "<td class='cnt'><div>" + cnt + "</div></td>";
                        vHTML += "<td class='name'><div><div class='icon'><img src=\"images/manual/" + crsim_actions["actions"][acode]["subset"][scode]["img"] + ".png\"></div>" + crsim_actions["actions"][acode]["subset"][scode]["name"] + "</div></td>";
                        vHTML += "<td class='sprice amount'><div class='chaos'>" + ppcur + "</div><div class='exalted'>" + ppdiv + "</div></td>";
                        vHTML += "<td class='tprice amount'><div class='chaos'>" + (Math.round((ppcur * cnt) * 100) / 100) + "</div><div class='exalted'>" + (Math.round((ppdiv * cnt) * 100) / 100) + "</div></td>";
                        vHTML += "</tr>";
                        totcc += (ppcur * cnt);
                    }
                });
                break;
            case 'scourge' :
                $.each(crsim_spending["actions"][acode], function (scode, cnt) {
                    if (cnt > 0) {
                        var scourge_rate = 0;
                        switch (scode) {
                            case 'scourgettexalt' :
                                scourge_rate = poecp["data"][poec_cLNinja]["currency"]["Tainted Exalted Orb"];
                                break;
                            case 'scourgettdivine' :
                                scourge_rate = poecp["data"][poec_cLNinja]["currency"]["Tainted Divine Teardrop"];
                                break;
                        }
                        if (isNaN(scourge_rate)) {
                            scourge_rate = 0;
                        }
                        var ppcur = Math.round(scourge_rate * 100) / 100;
                        var ppexa = Math.round((ppcur / poecp["data"][poec_cLNinja]["currency"]["Exalted Orb"]) * 100) / 100;
                        var ppdiv = Math.round((ppcur / poecp["data"][poec_cLNinja]["currency"]["Divine Orb"]) * 100) / 100;
                        vHTML += "<tr>";
                        vHTML += "<td class='cnt'><div>" + cnt + "</div></td>";
                        vHTML += "<td class='name'><div><div class='icon'><img src=\"images/manual/" + crsim_actions["actions"][acode]["subset"][scode]["img"] + ".png\"></div>" + crsim_actions["actions"][acode]["subset"][scode]["name"] + "</div></td>";
                        vHTML += "<td class='sprice amount'><div class='chaos'>" + ppcur + "</div><div class='exalted'>" + ppdiv + "</div></td>";
                        vHTML += "<td class='tprice amount'><div class='chaos'>" + (Math.round((ppcur * cnt) * 100) / 100) + "</div><div class='exalted'>" + (Math.round((ppdiv * cnt) * 100) / 100) + "</div></td>";
                        vHTML += "</tr>";
                        totcc += (ppcur * cnt);
                    }
                });
                break;
            case 'catalyst' :
                $.each(crsim_spending["actions"][acode], function (scode, cnt) {
                    if (cnt > 0) {
                        var ppcur = Math.round(poecp["data"][poec_cLNinja]["currency"][crsim_actions["actions"][acode]["subset"][scode]["name"] + " Catalyst"] * 100) / 100;
                        var ppexa = Math.round((ppcur / poecp["data"][poec_cLNinja]["currency"]["Exalted Orb"]) * 100) / 100;
                        var ppdiv = Math.round((ppcur / poecp["data"][poec_cLNinja]["currency"]["Divine Orb"]) * 100) / 100;
                        vHTML += "<tr>";
                        vHTML += "<td class='cnt'><div>" + cnt + "</div></td>";
                        vHTML += "<td class='name'><div><div class='icon'><img src=\"images/manual/" + crsim_actions["actions"][acode]["subset"][scode]["img"] + ".png\"></div>" + crsim_actions["actions"][acode]["subset"][scode]["name"] + "</div></td>";
                        vHTML += "<td class='sprice amount'><div class='chaos'>" + ppcur + "</div><div class='exalted'>" + ppdiv + "</div></td>";
                        vHTML += "<td class='tprice amount'><div class='chaos'>" + (Math.round((ppcur * cnt) * 100) / 100) + "</div><div class='exalted'>" + (Math.round((ppdiv * cnt) * 100) / 100) + "</div></td>";
                        vHTML += "</tr>";
                        totcc += (ppcur * cnt);
                    }
                });
                break;
            case 'essence' :
                $.each(crsim_spending["actions"][acode], function (scode, sdata) {
                    $.each(sdata, function (sscode, cnt) {
                        if (cnt > 0) {
                            switch (crsim_actions["actions"][acode]["subset"][scode]["name"]) {
                                case 'Horror' :
                                case 'Hysteria' :
                                case 'Delirium' :
                                case 'Insanity' :
                                    var etnid = 8;
                                    break;
                                default :
                                    var etnid = 7 - ($("#crsimESSTChooser_" + scode).children(".abtn").length - parseInt(sscode) - 1);
                                    break;
                            }
                            var ppcur = Math.round(poecp["data"][poec_cLNinja]["essences"][crsim_actions["actions"][acode]["subset"][scode]["name"]][etnid] * 100) / 100;
                            var ppexa = Math.round((ppcur / poecp["data"][poec_cLNinja]["currency"]["Exalted Orb"]) * 100) / 100;
                            var ppdiv = Math.round((ppcur / poecp["data"][poec_cLNinja]["currency"]["Divine Orb"]) * 100) / 100;
                            vHTML += "<tr>";
                            vHTML += "<td class='cnt'><div>" + cnt + "</div></td>";
                            vHTML += "<td class='name'><div><div class='icon'><img src=\"images/manual/" + crsim_actions["actions"][acode]["subset"][scode]["img"] + ".png\"></div>" + crsim_actions["actions"][acode]["subset"][scode]["name"] + "</div></td>";
                            vHTML += "<td class='sprice amount'><div class='chaos'>" + ppcur + "</div><div class='exalted'>" + ppdiv + "</div></td>";
                            vHTML += "<td class='tprice amount'><div class='chaos'>" + (Math.round((ppcur * cnt) * 100) / 100) + "</div><div class='exalted'>" + (Math.round((ppdiv * cnt) * 100) / 100) + "</div></td>";
                            vHTML += "</tr>";
                            totcc += (ppcur * cnt);
                        }
                    });
                });
                break;
            case 'eldritch' :
                $.each(crsim_spending["actions"][acode], function (scode, cnt) {
                    if (cnt > 0) {
                        var eldritch_rate = 0;
                        switch (scode) {
                            case 'eldritchemberexceptional' :
                                eldritch_rate = poecp["data"][poec_cLNinja]["currency"]["Exceptional Eldritch Ichor"];
                                break;
                            case 'eldritchichorexceptional' :
                                eldritch_rate = poecp["data"][poec_cLNinja]["currency"]["Exceptional Eldritch Ember"];
                                break;
                            case 'eldritchembergrand' :
                                eldritch_rate = poecp["data"][poec_cLNinja]["currency"]["Grand Eldritch Ichor"];
                                break;
                            case 'eldritchichorgrand' :
                                eldritch_rate = poecp["data"][poec_cLNinja]["currency"]["Grand Eldritch Ember"];
                                break;
                            case 'eldritchembergreater' :
                                eldritch_rate = poecp["data"][poec_cLNinja]["currency"]["Greater Eldritch Ichor"];
                                break;
                            case 'eldritchichorgreater' :
                                eldritch_rate = poecp["data"][poec_cLNinja]["currency"]["Greater Eldritch Ember"];
                                break;
                            case 'eldritchemberlesser' :
                                eldritch_rate = poecp["data"][poec_cLNinja]["currency"]["Lesser Eldritch Ichor"];
                                break;
                            case 'eldritchichorlesser' :
                                eldritch_rate = poecp["data"][poec_cLNinja]["currency"]["Lesser Eldritch Ember"];
                                break;
                            case 'eldritchconflict' :
                                eldritch_rate = poecp["data"][poec_cLNinja]["currency"]["Orb of Conflict"];
                                break;
                            case 'eldritchchaos' :
                                eldritch_rate = poecp["data"][poec_cLNinja]["currency"]["Eldritch Chaos Orb"];
                                break;
                            case 'eldritchexalt' :
                                eldritch_rate = poecp["data"][poec_cLNinja]["currency"]["Eldritch Exalted Orb"];
                                break;
                            case 'eldritchannul' :
                                eldritch_rate = poecp["data"][poec_cLNinja]["currency"]["Eldritch Orb of Annulment"];
                                break;
                        }
                        if (isNaN(eldritch_rate)) {
                            eldritch_rate = 0;
                        }
                        var ppcur = Math.round(eldritch_rate * 100) / 100;
                        var ppexa = Math.round((ppcur / poecp["data"][poec_cLNinja]["currency"]["Exalted Orb"]) * 100) / 100;
                        var ppdiv = Math.round((ppcur / poecp["data"][poec_cLNinja]["currency"]["Divine Orb"]) * 100) / 100;
                        vHTML += "<tr>";
                        vHTML += "<td class='cnt'><div>" + cnt + "</div></td>";
                        vHTML += "<td class='name'><div><div class='icon'><img src=\"images/manual/" + crsim_actions["actions"][acode]["subset"][scode]["img"] + ".png\"></div>" + crsim_actions["actions"][acode]["subset"][scode]["name"] + "</div></td>";
                        vHTML += "<td class='sprice amount'><div class='chaos'>" + ppcur + "</div><div class='exalted'>" + ppdiv + "</div></td>";
                        vHTML += "<td class='tprice amount'><div class='chaos'>" + (Math.round((ppcur * cnt) * 100) / 100) + "</div><div class='exalted'>" + (Math.round((ppdiv * cnt) * 100) / 100) + "</div></td>";
                        vHTML += "</tr>";
                        totcc += (ppcur * cnt);
                    }
                });
                break;
        }
    });
    if (vHTML != "" || vOTH != "") {
        totcc = Math.round(totcc * 100) / 100;
        var totexa = Math.round((totcc / poecp["data"][poec_cLNinja]["currency"]["Exalted Orb"]) * 100) / 100;
        var totdiv = Math.round((totcc / poecp["data"][poec_cLNinja]["currency"]["Divine Orb"]) * 100) / 100;

        if (vOTH) {
            vOTH = "<tr class='stitle'><td colspan='4'><div>" + applyLang("Other") + "</div></td></tr>" + vOTH;
        }
        vHTML = "<table cellspacing='0' class='div_stable' id='crsimSpendingTbl'><tr class='stitle'><td colspan='4'><div>" + applyLang("Currency") + "</div></td></tr>" + vHTML + vOTH + "</table>";
        vHTML += "<div class='div_stable' id='crsimSpendingTotal'><div>";
        vHTML += "<div><div>" + applyLang("Total") + "</div></div>";
        vHTML += "<div class='chaos switchcur' val='exalted' onClick='poec_simSwitchPrefCur(this)'><div><div class='icon'><img src=\"images/manual/method_chaos.png\"></div>" + totcc + "</div></div>";
        vHTML += "<div class='exalted switchcur' val='chaos' onClick='poec_simSwitchPrefCur(this)'><div><div class='icon'><img src=\"images/manual/method_divine.png\"></div>" + totdiv + "</div></div>";
        vHTML += "</div></div>";

        $("#crsimSpendingToggler").find(".chaos").find(".num").html(totcc);
        $("#crsimSpendingToggler").find(".exalted").find(".num").html(totdiv);
        $("#crsimSpendingToggler").removeClass("none");
    } else {
        $("#crsimSpendingToggler").addClass("none");
    }
    $("#crsimSpending").html(vHTML);
}

function poec_simSwitchPrefCur(vThis) {
    var crsim_prefcur = $(vThis).attr("val");
    $("#crsimSpendingOutput").removeClass("chaos exalted").addClass(crsim_prefcur);
    $("#crsimSpendingToggler").removeClass("chaos exalted").addClass(crsim_prefcur);
}

/***********/
/* HISTORY */

/***********/
function poec_buildFullHistory() {
    $("#crsimHistoryTbl").html("");
    if (crsim_log) {
        for (var i = 0; i < crsim_log.length; i++) {
            poec_updateCraftLog(null, null, crsim_log[i]);
        }
    }
}

function poec_updateCraftLog(craftDetail, forcedLog, imported) {
    if (imported) {
        var log_action = imported;
    } else {
        var log_action = {
            "mode": crsim_params["mode"],
            "currency": crsim_params["currency"],
            "action": crsim_params["action"],
            "ssaction": crsim_params["ssaction"],
            "subaction": crsim_params["subaction"],
            "forced": null,
            "add": craftDetail["add"],
            "rem": craftDetail["rem"],
            "upg": craftDetail["upg"],
            "sts": craftDetail["sts"],
            "det": craftDetail["det"],
            "ilvl": craftDetail["ilvl"],
            "bitem": craftDetail["bitem"],
            "base": craftDetail["base"],
            "bgroup": craftDetail["bgroup"],
            "rarity": craftDetail["rarity"],
            "affixes": craftDetail["affixes"],
            "implicits": craftDetail["implicits"],
            "eldritch": craftDetail["eldritch"],
            "influences": craftDetail["influences"],
            "imprint": craftDetail["imprint"],
            "psn": craftDetail["psn"],
            "catalyst": craftDetail["catalyst"],
            "corrupted": craftDetail["corrupted"],
            "destroyed": craftDetail["destroyed"],
            "quality": craftDetail["quality"],
            "nums": craftDetail["nums"]
        };

        if (forcedLog) {
            log_action["mode"] = "forced";
            log_action["currency"] = null;
            log_action["action"] = forcedLog["ptype"];
            log_action["subaction"] = forcedLog["affid"];
            log_action["ssaction"] = forcedLog["tindex"];
            log_action["forced"] = forcedLog["action"];
            log_action["extra"] = forcedLog["extra"];
        }

        crsim_log.push(log_action);
    }

    // Output line to visual log
    var fallback = "";
    var detail_add = "";
    var getcnum = null;
    if (log_action["mode"] == "currency") {
        var uname = "<div class='icon'><img src='images/manual/method_" + log_action["currency"] + ".png'/></div>";
        fallback = crsim_actions["currency"][log_action["currency"]]["name"];
        if (log_action["currency"] == "vaal") {
            fallback += " : " + log_action["sts"];
            log_action["sts"] = null;
        }
        getcnum = crsim_spending["currency"][log_action["currency"]];
    } else {
        if (log_action["mode"] == "forced") {
            if (log_action["action"] == "rimprint") {
                var uname = "<div class='icon'><img src='images/manual/bimprint.png'/></div>";
                fallback = applyLang("Apply imprint");
            } else {
                if (log_action["forced"] == "frac") {
                    var uname = "<div class='icon'><img src='images/manual/fractured.png'/></div>";
                } else {
                    if (log_action["forced"] == "unveil") {
                        var uname = "<div class='icon'><img src='images/manual/smlinf_10.png'/></div>";
                        fallback = applyLang("Unveil modifier");
                    } else {
                        var uname = "<div class='icon'><img src='images/manual/fico_" + log_action["forced"] + ".png'/></div>";
                    }
                }
            }
        } else {
            if (crsim_actions["actions"][log_action["action"]]["subset"] != undefined && crsim_actions["actions"][log_action["action"]]["subsel"] == undefined) {
                var uname = "<div class='icon'><img src='images/manual/" + crsim_actions["actions"][log_action["action"]]["subset"][log_action["subaction"]]["img"] + ".png'/></div>";
                fallback = crsim_actions["actions"][log_action["action"]]["subset"][log_action["subaction"]]["name"];
                if (log_action["ssaction"]) {
                    var daddtxt = "";
                    if (crsim_actions["actions"][log_action["action"]]["subset"][log_action["subaction"]]["toggled"] != undefined) {
                        daddtxt = $("#" + crsim_actions["actions"][log_action["action"]]["subset"][log_action["subaction"]]["toggled"]).find(".acss_" + log_action["ssaction"]).text();
                    } else {
                        daddtxt = $("#crsimSubsets").children("div.acs_" + log_action["action"]).children("div.ssubset").find(".acss_" + log_action["ssaction"]).text();
                    }
                    detail_add += "<div class='ssdesc'>" + crsim_actions["actions"][log_action["action"]]["subset"][log_action["subaction"]]["name"] + " : " + daddtxt + "</div>";
                    if (log_action["action"] == "essence") {
                        fallback += " - T" + (parseInt($("#crsimESSTChooser_" + log_action["subaction"]).children(".abtn").length - log_action["ssaction"]));
                    }
                    switch (log_action["subaction"]) {
                        case 'hother' :
                            fallback += " - " + $("#harvestOtherChooser").find(".acss_" + log_action["ssaction"]).text();
                            break;
                        case 'hresist' :
                            fallback += " - " + $("#harvestResistsChooser").find(".acss_" + log_action["ssaction"]).text();
                            break;
                    }
                    if (log_action["action"] == "catalyst") {
                        getcnum = crsim_spending["actions"][log_action["action"]][log_action["subaction"]];
                    } else {
                        getcnum = crsim_spending["actions"][log_action["action"]][log_action["subaction"]][log_action["ssaction"]];
                    }
                } else {
                    switch (log_action["subaction"]) {
                        case 'imprint' :
                            fallback = applyLang("Store imprint");
                            break;
                    }
                    getcnum = crsim_spending["actions"][log_action["action"]][log_action["subaction"]];
                }
            } else {
                switch (log_action["action"]) {
                    case 'fossil' :
                        var uname = "";
                        for (var k = 0; k < log_action["subaction"].length; k++) {
                            uname += "<div class='icon'><img src='images/manual/fossil_" + log_action["subaction"][k] + ".png'/></div>";
                        }
                        fallback = applyLang("Fossil crafting");
                        break;
                    case 'corruption_altar' :
                        var uname = "<div class='icon'><img src='images/manual/" + crsim_actions["actions"][log_action["action"]]["img"] + ".png'/></div>";
                        fallback = applyLang("Corruption altar") + " : " + log_action["sts"];
                        log_action["sts"] = null;
                        break;
                    default :
                        var uname = "<div class='icon'><img src='images/manual/" + crsim_actions["actions"][log_action["action"]]["img"] + ".png'/></div>";
                        fallback = crsim_actions["actions"][log_action["action"]]["name"];
                        getcnum = crsim_spending["actions"][log_action["action"]];
                        break;
                }
            }
        }
    }

    var details = "";
    if (log_action["rem"]) {
        details += "<div class='act rem'><div>" + poec_simParseAffix(log_action["rem"]) + "</div>" + poec_simParseChance(log_action["rem"]) + "</div>";
    }
    if (log_action["add"]) {
        for (var i = 0; i < log_action["add"].length; i++) {
            details += "<div class='act add'><div>" + poec_simParseAffix(log_action["add"][i]) + "</div>" + poec_simParseChance(log_action["add"][i]) + "</div>";
        }
    } else {
        if (log_action["upg"]) {
            details += "<div class='act upg'><div>" + poec_simParseAffix(log_action["upg"]) + "</div>" + poec_simParseChance(log_action["upg"]) + "</div>";
        }
    }
    if (log_action["sts"]) {
        if (log_action["sts"]["cap"] == 0) {
            var stscnt = applyLang("Nothing to roll");
        } else {
            var stscnt = Math.round((log_action["sts"]["rolls"] / log_action["sts"]["cap"]) * 100) + "% (" + (Math.round(log_action["sts"]["rolls"] * 100) / 100) + "/" + (Math.round(log_action["sts"]["cap"] * 100) / 100) + ")";
        }
        details += "<div class='act sts'>" + stscnt + "</div>";
    }

    if (details == "") {
        details += "<div class='act sts'>" + fallback + "</div>";
    } else {
        details = detail_add + details;
    }

    if (log_action["det"]) {
        details += log_action["det"];
    }

    var nlact = $("#crsimHistoryTbl").find(".logact").length;

    var vLINE = "<tr class='logact' lindex='" + nlact + "'>";
    vLINE += "<td class='rarity " + log_action["rarity"] + "'><div><div class='ricon med_shadow'></div></div></td>";
    var ocnum = "";
    if (getcnum) {
        ocnum = "<div><span class='h'>#</span>" + getcnum + "</div>";
    }
    vLINE += "<td class='num'>" + ocnum + "</td>";
    vLINE += "<td class='label'><div>" + uname + "</div></td>";
    vLINE += "<td class='detail'><div>" + details + "</div></td>";
    vLINE += "</tr>";

    if (crsim_log.length > 0) {
        $("#crsimOriginalIS").show();
    }

    $("#crsimHistoryTbl").append(vLINE);
    $("#crsimHistoryTbl").find("tr:last").hover(function () {
        poec_simShowHistoryState(this);
    }, function () {
        poec_simHideHistoryState();
    });
    $("#crsimHistory").scrollTop($("#crsimHistory")[0].scrollHeight);

    $("#simHistoryUndoBtn").show();
}

function poec_simShowHistoryState(vThis) {
    var lindex = parseInt($(vThis).attr("lindex"));
    if (lindex < crsim_log.length - 1) {
        var thispos = $(vThis).offset();

        if ($("#poecSimHistStater").length == 0) {
            $("<div>").attr("id", "poecSimHistStater").addClass("med_shadow").appendTo($("body"));
        }

        var stHTML = poec_simGetFullItem(crsim_log[lindex + 1], null);

        $("#poecSimHistStater").css({"right": wsWidth - (thispos.left - 20), "left": "auto", "top": thispos.top});
        $("#poecSimHistStater").html(stHTML).show();
    }
}

function poec_simHideHistoryState() {
    $("#poecSimHistStater").hide();
}

function poec_simParseChance(affdata) {
    var chance = "";
    if (affdata != undefined) {
        if (affdata["chance"]) {
            chance += "<div class='chance'>(" + number_format(affdata["chance"] * 100, 2, ".", " ") + "%)</div>";
        }
    }
    return chance;
}

function poec_simParseAffix(affdata) {
    if (affdata["id"] == undefined) {
        affdata = affdata[0];
    }
    if (affdata["id"] > 0) {
        var naffix = poecl["mod"][affdata["id"]];
        if (naffix.indexOf("#") > -1) {
            for (var j = 0; j < affdata["rolls"].length; j++) {
                naffix = naffix.replace("#", affdata["rolls"][j]);
            }
        }
        return naffix;
    } else {
        return "Veiled affix";
    }
}

function poec_simRevertHistory() {
    if (crsim_log.length > 0) {
        var rlog = crsim_log.pop();

        // Revert item state
        poec_simSetRarity(rlog["rarity"]);
        crsim_data["iaffixes"] = jQuery.parseJSON(JSON.stringify(rlog["affixes"]));
        crsim_data["implicits"] = jQuery.parseJSON(JSON.stringify(rlog["implicits"]));
        crsim_data["eldritch"] = jQuery.parseJSON(JSON.stringify(rlog["eldritch"]));
        crsim_settings["influences"] = jQuery.parseJSON(JSON.stringify(rlog["influences"]));
        crsim_settings["corrupted"] = rlog["corrupted"];
        crsim_settings["destroyed"] = rlog["destroyed"];
        crsim_settings["quality"] = rlog["quality"];
        if (rlog["bitem"] != crsim_settings["bitem"]) {
            if (!rlog["bitem"]) {
                rlog["bitem"] = crsim_settings["bitem"];
            }
            if (!rlog["base"]) {
                rlog["base"] = crsim_settings["base"];
            }
            if (!rlog["bgroup"]) {
                rlog["bgroup"] = crsim_settings["bgroup"];
            }
            poec_simUpdateBitemCopy(rlog["bitem"], rlog["base"], rlog["bgroup"]);
            if (rlog["base"] != crsim_settings["base"]) {
                poec_simBuildFullModpool(rlog["base"]);
                poec_simSetIniDisabled(false);
                poec_simSetItemModpool();
            }
        }
        crsim_settings["bitem"] = rlog["bitem"];
        crsim_settings["base"] = rlog["base"];
        crsim_settings["bgroup"] = rlog["bgroup"];
        crsim_catalyst = jQuery.parseJSON(JSON.stringify(rlog["catalyst"]));
        crsim_data["iaffbt"]["prefix"] = rlog["psn"]["prefix"];
        crsim_data["iaffbt"]["suffix"] = rlog["psn"]["suffix"];

        if (rlog["action"] == "rimprint") {
            crsim_data["imprint"] = jQuery.parseJSON(JSON.stringify(rlog["imprint"]));
            $("#simImprintZone").addClass("imprinted");
        } else {
            // Decrement spending
            if (rlog["mode"] == "currency") {
                var amode = rlog["currency"];
                crsim_spending["currency"][amode]--;
                var cnt = crsim_spending["currency"][amode];
                poec_simUpdateSpending(rlog["mode"], amode, cnt);
            } else {
                var amode = rlog["action"];
                if (amode == "beast_crafting") {
                    if (rlog["subaction"] == "imprint") {
                        $("#simImprintZone").removeClass("imprinted");
                        crsim_data["imprint"] = null;
                    }
                }
                poec_simUpdateSpending(rlog["mode"], amode, 0 - rlog["nums"], rlog);
            }
        }

        // Refresh Item and relevant information
        poec_simUpdateDominance();
        poec_updateItemAffixes();
        poec_updateActionEnabling();

        // Reselect what was selected in the menu
        //console.log(crsim_params);
        crsim_params["mode"] = rlog["mode"];
        crsim_params["currency"] = rlog["currency"];
        crsim_params["action"] = rlog["action"];
        crsim_params["ssaction"] = rlog["ssaction"];
        crsim_params["subaction"] = rlog["subaction"];
        if (crsim_params["action"] != "rimprint") {
            $("#crsimActions").children("div.abtn").removeClass("sel");
            $("#crsimOptCur").children("div").removeClass("sel");
            $("#crsimSubsets").children("div").hide();
            if (crsim_params["mode"] == "currency") {
                if (crsim_params["currency"] != "woke") {
                    $("#crsimOptCur").children("div.ac_" + crsim_params["currency"]).addClass("sel");
                }
            } else {
                if (crsim_params["action"] != "recombinate") {
                    $("#crsimActions").children("div.ac_" + crsim_params["action"]).addClass("sel");
                }
                if (crsim_actions["actions"][crsim_params["action"]] != undefined) {
                    if (crsim_actions["actions"][crsim_params["action"]]["subset"] != undefined) {
                        $("#crsimSubsets").children(".acs_" + crsim_params["action"]).show();
                        $("#crsimSubsets").children(".acs_" + crsim_params["action"]).find(".abtn").removeClass("sel");
                        if (crsim_actions["actions"][crsim_params["action"]]["subsel"] != undefined) {
                            for (var i = 0; i < crsim_params["subaction"].length; i++) {
                                $("#crsimSubsets").children(".acs_" + crsim_params["action"]).children(".acs_" + crsim_params["action"] + crsim_params["subaction"][i]).addClass("sel");
                            }
                        } else {
                            $("#crsimSubsets").children(".acs_" + crsim_params["action"]).children(".acs_" + crsim_params["action"] + crsim_params["subaction"]).addClass("sel");
                        }
                        if ($("#crsimSubsets").children(".acs_" + crsim_params["action"]).children(".ssubset").length > 0) {
                            if (crsim_params["action"] == "fossil") {
                                if (crsim_params["ssaction"]) {
                                    $("#fossilTangledMoreChooser").find(".acss_" + crsim_params["ssaction"]["pos"]).addClass("sel");
                                    $("#fossilTangledNoChooser").find(".acss_" + crsim_params["ssaction"]["neg"]).addClass("sel");
                                }
                            } else {
                                $("#crsimSubsets").children(".acs_" + crsim_params["action"]).children(".ssubset").children(".acss_" + crsim_params["ssaction"]).addClass("sel");
                            }
                        }
                        if (crsim_params["action"] == "essence") {
                            $("#essenceTiersArea").children(".esstchooser").removeClass("sel");
                            $("#essenceTiersArea").children(".esstchooser").children(".abtn").removeClass("sel");
                            $("#essenceTiersArea").children(".esstchooser").children(".abtn:last-child").addClass("sel");
                            $("#crsimESSTChooser_" + crsim_params["subaction"]).addClass("sel");
                            $("#crsimESSTChooser_" + crsim_params["subaction"]).children(".abtn").removeClass("sel");
                            $("#crsimESSTChooser_" + crsim_params["subaction"]).children(".abtn:eq(" + crsim_params["ssaction"] + ")").addClass("sel");
                        }
                    }
                }
            }

            if ($('#simItemHoverer').is(":hover")) {
                poec_simCApply();
                poec_simChangeCursor();
            }
        }

        $("#crsimHistoryTbl").find("tr:last-child").remove();
        if (crsim_log.length == 0) {
            $("#simHistoryUndoBtn").hide();
            $("#crsimOriginalIS").hide();
        }

        clearTimeout(crsim_rmptm);
        crsim_rmptm = setTimeout(function () {
            poec_simRefreshModPool();
        }, 1);
    }
}

/****************/
/* ZONE TOGGLER */

/****************/
function poec_simToggleZone(vThis) {
    if (!$(vThis).hasClass("sel")) {
        var tzone = $(vThis).attr("zone");
        var mzone = $(vThis).parent().attr("zones");
        var bound = $(vThis).parent().attr("bound");
        $(vThis).parent().children("div.toggle.sel").removeClass("sel");
        $(vThis).addClass("sel");
        $(".sim_zonecontent." + mzone).removeClass("sel");
        $("#" + tzone).addClass("sel");
        if (bound) {
            var bval = $(vThis).attr("bval");
            $("#crsimMasterModpool").find(".sim_zonetoggler." + bound).each(function () {
                $(this).children("div.toggle.sel").removeClass("sel");
                $(this).children("div.toggle." + bval).addClass("sel");
                var mzone = $(this).attr("zones");
                var tzone = $(this).children("div.toggle." + bval).attr("zone");
                $(".sim_zonecontent." + mzone).removeClass("sel");
                $("#" + tzone).addClass("sel");
            });
        }
    }
}

/***********/
/* HARVEST */

/***********/
function poec_simCheckHarvestValid() {
    var validity = true;

    if (crsim_bypass) {
        var useaffixes = crsim_bypass["iaffixes"];
        var usemetas = crsim_bypass["meta_flags"];
        var usemaxaffgrp = crsim_bypass["cmaxaffgrp"];
        var useamaxaffgrp = crsim_bypass["maxaffgrp"];
        var useaffbt = crsim_bypass["iaffbt"];
        var usesubaction = crsim_bypass["subaction"];
        var usessaction = crsim_bypass["ssaction"];
        var useinfluences = crsim_bypass["influences"];
        var usefmodpool = crsim_bypass["fmodpool"];
        var usehmodpool = crsim_bypass["hmodpool"];
        var usemtypes = crsim_bypass["mtypes"];
    } else {
        var useaffixes = crsim_data["iaffixes"];
        var usemetas = crsim_data["meta_flags"];
        var usemaxaffgrp = crsim_data["cmaxaffgrp"];
        var useamaxaffgrp = crsim_data["maxaffgrp"];
        var useaffbt = crsim_data["iaffbt"];
        var usesubaction = crsim_params["subaction"];
        var usessaction = crsim_params["ssaction"];
        var useinfluences = crsim_settings["influences"];
        var usefmodpool = crsim_data["fmodpool"];
        var usehmodpool = crsim_data["hmodpool"];
        var usemtypes = crsim_data["mtypes"];
    }

    var blktype = {"prefix": false, "suffix": false};
    if (useaffbt["prefix"] >= usemaxaffgrp["prefix"]) {
        blktype["prefix"] = true;
    }
    if (useaffbt["suffix"] >= usemaxaffgrp["suffix"]) {
        blktype["suffix"] = true;
    }
    var fblktype = {"prefix": false, "suffix": false};
    if (useaffbt["prefix"] >= useamaxaffgrp["prefix"]) {
        fblktype["prefix"] = true;
    }
    if (useaffbt["suffix"] >= useamaxaffgrp["suffix"]) {
        fblktype["suffix"] = true;
    }
    var metakeep = {"prefix": false, "suffix": false};
    if (usemetas["nchg_pre"]) {
        metakeep["prefix"] = true;
    }
    if (usemetas["nchg_suf"]) {
        metakeep["suffix"] = true;
    }

    if (usessaction == "inf") {
        var mtname = applyLang("Influence");
    } else {
        var mtname = poecl["mtype"][usessaction];
    }

    var sselect = usessaction;
    var errors = "";
    switch (usesubaction) {
        case "haugment" :
            if (useaffbt["suffix"] >= usemaxaffgrp["suffix"] && useaffbt["prefix"] >= usemaxaffgrp["prefix"]) {
                validity = false;
                errors += "No space left to add";
            } else {
                var gopass = true;
                if (crsim_hnerf) { // Check if item is influenced
                    if (useinfluences != null && usessaction != "inf") {
                        gopass = false;
                        validity = false;
                        errors += "Can only be used on a non-influenced item";
                    }
                }
                if (gopass) {
                    if (!poec_simCheckHAdd(blktype)) {
                        validity = false;
                        errors += "There is no '" + mtname + "' modifier left to add";
                    }
                }
            }
            break;
        case "hreplace" :
            if (!poec_simCheckHRem(false)) {
                validity = false;
                errors += "There is no '" + mtname + "' modifier to remove";
            } else {
                // Apply fix HERE to rule out drop-only mods in specific circumstances
                // Cycle each mod that could be removed and check if there is a valid target after removal
                var nvalidp = 0;
                var nvalids = 0;
                if (!blktype["prefix"]) {
                    nvalidp += poec_simGetNumTo("prefix");
                }
                if (!blktype["suffix"]) {
                    nvalids += poec_simGetNumTo("suffix");
                }

                var ruleout = "|";
                for (var i = 0; i < useaffixes.length; i++) {
                    var ifound = false;
                    if (crsim_nonadmgroups.indexOf("|" + useaffixes[i]["mgrp"] + "|") > -1) {
                        if (crsim_data["mtypes"][useaffixes[i]["id"]]["strcheck"].indexOf("|" + usessaction + "|") > -1) {
                            if (useaffixes[i]["atype"] == "prefix") {
                                if (nvalidp == 0) {
                                    if (nvalids == 0 || useaffbt["suffix"] >= usemaxaffgrp["suffix"]) {
                                        ruleout += i + "|";
                                    }
                                }
                            } else {
                                if (nvalids == 0) {
                                    if (nvalidp == 0 || useaffbt["prefix"] >= usemaxaffgrp["prefix"]) {
                                        ruleout += i + "|";
                                    }
                                }
                            }
                        }
                    }
                }

                validity = ruleout;
            }
            break;
        case "hnonto" :
            var gopass = true;
            if (crsim_hnerf) { // Check if item is influenced
                if (useinfluences != null && usessaction != "inf") {
                    gopass = false;
                    validity = false;
                    errors += "Can only be used on a non-influenced item";
                }
            }
            if (gopass) {
                var idaffs = "|";
                var nonvalid = [];
                for (var zz = 0; zz < useaffixes.length; zz++) {
                    idaffs += useaffixes[zz]["id"] + "|";
                    // Is non valid
                    if (useaffixes[zz]["frac"] == 0) {
                        var metablock = false;
                        if (usemetas["nchg_pre"] && useaffixes[zz]["atype"] == "prefix" || usemetas["nchg_suf"] && useaffixes[zz]["atype"] == "suffix") {
                            metablock = true;
                        }
                        if (!metablock) {
                            if (useaffixes[zz]["id"] > 0) {
                                if (usessaction == "inf") {
                                    if (crsim_infgrps.indexOf("|" + useaffixes[zz]["mgrp"] + "|") > -1) {
                                    } else {
                                        nonvalid.push(zz);
                                    }
                                } else {
                                    if (useaffixes[zz]["maven"]) {
                                        if (crsim_mvdata[useaffixes[zz]["maven"]]["strcheck"].indexOf("|" + usessaction + "|") > -1) {
                                        } else {
                                            nonvalid.push(zz);
                                        }
                                    } else {
                                        if (usemtypes[useaffixes[zz]["id"]]["strcheck"].indexOf("|" + usessaction + "|") > -1) {
                                        } else {
                                            nonvalid.push(zz);
                                        }
                                    }
                                }
                            } else {
                                nonvalid.push(zz);
                            }
                        }
                    }
                }

                if (nonvalid.length > 0) {
                    var blktags = [];
                    if (usemetas["no_attack"]) {
                        blktags.push("3");
                    }
                    if (usemetas["no_caster"]) {
                        blktags.push("13");
                    }

                    var truenvalid = [];
                    for (var zz = 0; zz < nonvalid.length; zz++) {
                        // For each removable affix, check if onced its been removed, we can spawn another one
                        var tidaffs = "|";
                        var tidmgrps = "|";
                        var taffbt = {"prefix": 0, "suffix": 0};
                        for (var zy = 0; zy < useaffixes.length; zy++) {
                            if (nonvalid[zz] != zy) {
                                tidaffs += useaffixes[zy]["id_modifier"] + "|";
                                for (var zx = 0; zx < useaffixes[zy]["modgroups"].length; zx++) {
                                    tidmgrps += useaffixes[zy]["modgroups"][zx] + "|";
                                }
                                taffbt[useaffixes[zy]["atype"]]++;
                            }
                        }
                        // Check what can be added
                        var nvadd = 0;
                        if (taffbt["prefix"] < usemaxaffgrp["prefix"]) {
                            for (var zy = 0; zy < usehmodpool["prefix"].length; zy++) {
                                var mconflict = false;
                                for (var zx = 0; zx < poecd["modifiers"]["seq"][poecd["modifiers"]["ind"][usehmodpool["prefix"][zy]["id"]]]["modgroups"].length; zx++) {
                                    if (tidmgrps.indexOf("|" + poecd["modifiers"]["seq"][poecd["modifiers"]["ind"][usehmodpool["prefix"][zy]["id"]]]["modgroups"][zx] + "|") > -1) {
                                        mconflict = true;
                                    }
                                }
                                if (mconflict) {
                                } else {
                                    var blocked = false;
                                    for (var j = 0; j < blktags.length; j++) {
                                        if (usehmodpool["prefix"][zy]["mtypes"].indexOf("|" + blktags[j] + "|") > -1) {
                                            blocked = true;
                                            break;
                                        }
                                    }
                                    if (!blocked) {
                                        if (usessaction == "inf") {
                                            if (crsim_infgrps.indexOf("|" + usehmodpool["prefix"][zy]["mgrp"] + "|") > -1) {
                                                nvadd++;
                                            }
                                        } else {
                                            if (usehmodpool["prefix"][zy]["mtypes"].indexOf("|" + usessaction + "|") > -1) {
                                                nvadd++;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        if (taffbt["suffix"] < usemaxaffgrp["suffix"]) {
                            for (var zy = 0; zy < usehmodpool["suffix"].length; zy++) {
                                var mconflict = false;
                                for (var zx = 0; zx < poecd["modifiers"]["seq"][poecd["modifiers"]["ind"][usehmodpool["suffix"][zy]["id"]]]["modgroups"].length; zx++) {
                                    if (tidmgrps.indexOf("|" + poecd["modifiers"]["seq"][poecd["modifiers"]["ind"][usehmodpool["suffix"][zy]["id"]]]["modgroups"][zx] + "|") > -1) {
                                        mconflict = true;
                                    }
                                }
                                if (mconflict) {
                                } else {
                                    var blocked = false;
                                    for (var j = 0; j < blktags.length; j++) {
                                        if (usehmodpool["suffix"][zy]["mtypes"].indexOf("|" + blktags[j] + "|") > -1) {
                                            blocked = true;
                                            break;
                                        }
                                    }
                                    if (!blocked) {
                                        if (usessaction == "inf") {
                                            if (crsim_infgrps.indexOf("|" + usehmodpool["suffix"][zy]["mgrp"] + "|") > -1) {
                                                nvadd++;
                                            }
                                        } else {
                                            if (usehmodpool["suffix"][zy]["mtypes"].indexOf("|" + usessaction + "|") > -1) {
                                                nvadd++;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        //console.log("mod "+nonvalid[zz]);
                        //console.log(jQuery.parseJSON(JSON.stringify(useaffixes[nonvalid[zz]])));
                        //console.log("nvadd "+nvadd);
                        if (nvadd > 0) {
                            truenvalid.push(nonvalid[zz]);
                        }
                    }

                    //console.log(usehmodpool);
                    //console.log(jQuery.parseJSON(JSON.stringify(useaffixes)));

                    if (truenvalid.length > 0) {
                        console.log(truenvalid);
                        validity = truenvalid;
                    } else {
                        validity = false;
                        errors += "There is no eligible modifier to remove";
                    }
                } else {
                    validity = false;
                    errors += "There is no eligible modifier to remove";
                }
            }
            break;
        case "hannul" :
            if (!poec_simCheckHRem(false)) {
                validity = false;
                errors += "There is no '" + mtname + "' modifier to remove";
            }
            break;
        case "hdivine" :
            if (!poec_simCheckHRem(false)) {
                validity = false;
                errors += "There is no '" + mtname + "' modifier to reroll";
            }
            break;
        case "hreroll" :
            // Check if there is a X mod on the item
            if (!poec_simCheckHReroll(fblktype, metakeep)) {
                validity = false;
                errors += "There is no '" + mtname + "' in the modpool that can be added";
            }
            break;
        case "hrerollp" :
            // Check if there is a X mod on the item
            if (!poec_simCheckHReroll(fblktype, metakeep)) {
                validity = false;
                errors += "There is no '" + mtname + "' in the modpool that can be added";
            }
            break;
        case "hother" :
            break;
        case "hhight" :
            break;
        case 'hresist' :
            // Check if the source resist is there and the target resist isnt there
            var from = null;
            var to = null;
            console.log(sselect);
            switch (sselect) {
                case 'hrftc' :
                    from = "Fire";
                    to = "Cold";
                    break;
                case 'hrftl' :
                    from = "Fire";
                    to = "Lightning";
                    break;
                case 'hrctf' :
                    from = "Cold";
                    to = "Fire";
                    break;
                case 'hrctl' :
                    from = "Cold";
                    to = "Lightning";
                    break;
                case 'hrltf' :
                    from = "Lightning";
                    to = "Fire";
                    break;
                case 'hrltc' :
                    from = "Lightning";
                    to = "Cold";
                    break;
            }
            validity = {"from": from, "to": to};
            if (from && to) {
                var fromfound = false;
                var numfrom = 0;
                var fromarr = [];
                var tofound = false;
                for (var i = 0; i < useaffixes.length; i++) {
                    if (useaffixes[i]["frac"] == 0) {
                        for (var j = 0; j < crsim_resswaps.length; j++) {
                            if (poecd["modifiers"]["seq"][poecd["modifiers"]["ind"][useaffixes[i]["id"]]]["name_modifier"] == crsim_resswaps[j]["text"].replace(/\[RES\]/g, from)) {
                                if (crsim_resswaps[j]["special"]) {
                                    var spcfound = false;
                                    for (var k = 0; k < crsim_resswapspc[from].length; k++) {
                                        if (crsim_resswapspc[from][k] == poecd["modifiers"]["seq"][poecd["modifiers"]["ind"][useaffixes[i]["id"]]]["name_modifier"]) {
                                            spcfound = k;
                                            break;
                                        }
                                    }
                                    var tocheck = crsim_resswapspc[to][k];
                                    var ncheck = tocheck;
                                } else {
                                    var tocheck = crsim_resswaps[j]["text"].replace(/\[RES\]/g, to);
                                    var ncheck = poecd["modifiers"]["seq"][poecd["modifiers"]["ind"][useaffixes[i]["id"]]]["name_modifier"].replaceAll(from, to);
                                }

                                var alreadythere = false;
                                for (var k = 0; k < useaffixes.length; k++) {
                                    if (i != k) {
                                        if (poecd["modifiers"]["seq"][poecd["modifiers"]["ind"][useaffixes[k]["id"]]]["name_modifier"] == tocheck) {
                                            alreadythere = true;
                                        }
                                    }
                                }

                                if (!alreadythere) {
                                    // Find actual modifier
                                    var curmgrp = poecd["modifiers"]["seq"][poecd["modifiers"]["ind"][useaffixes[i]["id"]]]["id_mgroup"];
                                    var foundto = false;

                                    if (crsim_resswaps[j]["bgrp"]) {
                                        var typecheck = "suffix";
                                        for (var k = 0; k < usefmodpool[typecheck][curmgrp].length; k++) {
                                            if (usefmodpool[typecheck][curmgrp][k]["name_modifier"] == ncheck) {
                                                foundto = k;
                                                break;
                                            }
                                        }
                                        if (foundto === false) {
                                            typecheck = "prefix";
                                            for (var k = 0; k < usefmodpool[typecheck][curmgrp].length; k++) {
                                                if (usefmodpool[typecheck][curmgrp][k]["name_modifier"] == ncheck) {
                                                    foundto = k;
                                                    break;
                                                }
                                            }
                                        }
                                    } else {
                                        // Check any modgroup
                                        var typecheck = "suffix";
                                        var foundgrp = false;
                                        var iinfs = "|" + crsim_resswaps[j]["addmgrps"];
                                        if (useinfluences) {
                                            for (var k = 0; k < useinfluences.length; k++) {
                                                iinfs += useinfluences[k] + "|";
                                            }
                                        }
                                        $.each(usefmodpool[typecheck], function (grpkey, cmods) {
                                            var grpvalid = true;
                                            if (grpkey != 1) {
                                                if (iinfs.indexOf("|" + grpkey + "|") > -1) {
                                                } else {
                                                    grpvalid = false;
                                                }
                                            }
                                            if (grpvalid) {
                                                for (var k = 0; k < cmods.length; k++) {
                                                    if (cmods[k]["name_modifier"] == ncheck) {
                                                        foundto = k;
                                                        curmgrp = grpkey;
                                                        break;
                                                    }
                                                }
                                            }
                                        });
                                        if (foundto === false) {
                                            typecheck = "prefix";
                                            $.each(usefmodpool[typecheck], function (grpkey, cmods) {
                                                var grpvalid = true;
                                                if (grpkey != 1) {
                                                    if (iinfs.indexOf("|" + grpkey + "|") > -1) {
                                                    } else {
                                                        grpvalid = false;
                                                    }
                                                }
                                                if (grpvalid) {
                                                    for (var k = 0; k < cmods.length; k++) {
                                                        if (cmods[k]["name_modifier"] == ncheck) {
                                                            foundto = k;
                                                            curmgrp = grpkey;
                                                            break;
                                                        }
                                                    }
                                                }
                                            });
                                        }
                                    }

                                    if (foundto !== false) {
                                        var allmgrps = "|";
                                        for (var z = 0; z < useaffixes.length; z++) {
                                            if (i != z) {
                                                for (var zy = 0; zy < useaffixes[z]["modgroups"].length; zy++) {
                                                    allmgrps += useaffixes[z]["modgroups"][zy] + "|";
                                                }
                                            }
                                        }
                                        // Check if there would be a modgroup conflict
                                        var mconflict = false;
                                        for (var zy = 0; zy < usefmodpool[typecheck][curmgrp][foundto]["modgroups"].length; zy++) {
                                            if (allmgrps.indexOf("|" + usefmodpool[typecheck][curmgrp][foundto]["modgroups"][zy] + "|") > -1) {
                                                mconflict = true;
                                            }
                                        }
                                        if (mconflict) {
                                        } else {
                                            numfrom++;
                                            fromarr.push({"ind": i, "to": foundto, "type": typecheck, "mgrp": curmgrp});
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                if (numfrom === 0) {
                    errors = "Could not find a compatible " + from + " modifier on the item";
                    validity = false;
                } else {
                    validity["fromind"] = fromarr;
                }
            } else {
                console.log("Bad from to, shouldnt happen");
                validity = false;
            }
            break;
        default :
            validity = false;
    }

    if (errors != "") {
        if (crsim_bypass) {
            poec_simThrowError(applyLang(errors));
        } else {
            $("#simItemHoverer").mcuiNotice({text: errors, type: "alert"}).showNotice();
            $("#simItemHoverer").mcuiNotice().setText(errors);
        }
    }

    return validity;
}

function poec_simCheckHAdd(blktype) {
    var nvalid = 0;

    if (!blktype["prefix"]) {
        nvalid += poec_simGetNumTo("prefix");
    }
    if (!blktype["suffix"]) {
        nvalid += poec_simGetNumTo("suffix");
    }

    if (nvalid > 0) {
        return true;
    } else {
        return false;
    }
}

function poec_simCheckHReroll(blktype, keep) {
    var nvalid = 0;

    if ((keep["prefix"] && !blktype["prefix"]) || !keep["prefix"]) {
        nvalid += poec_simGetNumFromPool("prefix", keep["prefix"]);
    }
    if ((keep["suffix"] && !blktype["suffix"]) || !keep["suffix"]) {
        nvalid += poec_simGetNumFromPool("suffix", keep["suffix"]);
    }

    if (nvalid > 0) {
        return true;
    } else {
        return false;
    }
}

function poec_simCheckHRem(nonto) {
    var nvalid = 0;

    if (crsim_bypass) {
        var useiaffixes = crsim_bypass["iaffixes"];
        var usemetas = crsim_bypass["meta_flags"];
        var usessaction = crsim_bypass["ssaction"];
        var usemtypes = crsim_bypass["mtypes"];
    } else {
        var useiaffixes = crsim_data["iaffixes"];
        var usemetas = crsim_data["meta_flags"];
        var usessaction = crsim_params["ssaction"];
        var usemtypes = crsim_data["mtypes"];
    }

    var keep = {"prefix": false, "suffix": false};
    if (usemetas["nchg_pre"]) {
        keep["prefix"] = true;
    }
    if (usemetas["nchg_suf"]) {
        keep["suffix"] = true;
    }

    if (nonto) {
        for (var i = 0; i < useiaffixes.length; i++) {
            if (!keep[useiaffixes[i]["atype"]] && useiaffixes[i]["frac"] == 0) {
                if (usessaction == "inf") {
                    if (crsim_infgrps.indexOf("|" + useiaffixes[i]["mgrp"] + "|")) {
                    } else {
                        nvalid++;
                    }
                } else {
                    if (useiaffixes[i]["maven"]) {
                        if (crsim_mvdata[useiaffixes[i]["maven"]]["strcheck"].indexOf("|" + usessaction + "|") > -1) {
                        } else {
                            nvalid++;
                        }
                    } else {
                        if (usemtypes[useiaffixes[i]["id"]]["strcheck"].indexOf("|" + usessaction + "|") > -1) {
                        } else {
                            nvalid++;
                        }
                    }
                }
            }
        }
    } else {
        for (var i = 0; i < useiaffixes.length; i++) {
            if (!keep[useiaffixes[i]["atype"]] && useiaffixes[i]["frac"] == 0) {
                if (usessaction == "inf") {
                    if (crsim_infgrps.indexOf("|" + useiaffixes[i]["mgrp"] + "|")) {
                        nvalid++;
                    }
                } else {
                    if (useiaffixes[i]["maven"]) {
                        if (crsim_mvdata[useiaffixes[i]["maven"]]["strcheck"].indexOf("|" + usessaction + "|") > -1) {
                            nvalid++;
                        }
                    } else {
                        if (usemtypes[useiaffixes[i]["id"]]["strcheck"].indexOf("|" + usessaction + "|") > -1) {
                            nvalid++;
                        }
                    }
                }
            }
        }
    }

    return nvalid;
}

function poec_simGetNumNon(atype) {
    var numnon = 0;

    if (crsim_bypass) {
        var useaffixes = crsim_bypass["iaffixes"];
        var usemtypes = crsim_bypass["mtypes"];
        var usessaction = crsim_bypass["ssaction"];
    } else {
        var useaffixes = crsim_data["iaffixes"];
        var usemtypes = crsim_data["mtypes"];
        var usessaction = crsim_params["ssaction"];
    }

    for (var i = 0; i < useaffixes.length; i++) {
        if (useaffixes[i]["atype"] == atype && useaffixes[i]["frac"] == 0) {
            if (useaffixes[i]["id"] > 0) {
                if (usessaction == "inf") {
                    if (crsim_infgrps.indexOf("|" + useaffixes[i]["mgrp"] + "|") > -1) {
                    } else {
                        numnon++;
                    }
                } else {
                    if (useaffixes[i]["maven"]) {
                        if (crsim_mvdata[useaffixes[i]["maven"]]["strcheck"].indexOf("|" + usessaction + "|") > -1) {
                        } else {
                            numnon++;
                        }
                    } else {
                        if (usemtypes[useaffixes[i]["id"]]["strcheck"].indexOf("|" + usessaction + "|") > -1) {
                        } else {
                            numnon++;
                        }
                    }
                }
            } else {
                numnon++;
            }
        }
    }

    return numnon;
}

function poec_simGetNumTo(atype) {
    var numto = 0;

    if (crsim_bypass) {
        var usecmodpool = crsim_bypass["cmodpool"];
        var usemetas = crsim_bypass["meta_flags"];
        var usessaction = crsim_bypass["ssaction"];
    } else {
        var usecmodpool = crsim_data["cmodpool"];
        var usemetas = crsim_data["meta_flags"];
        var usessaction = crsim_params["ssaction"];
    }

    var blktags = [];
    if (usemetas["no_attack"]) {
        blktags.push("3");
    }
    if (usemetas["no_caster"]) {
        blktags.push("13");
    }

    for (var i = 0; i < usecmodpool[atype].length; i++) {
        var blocked = false;
        for (var j = 0; j < blktags.length; j++) {
            if (usecmodpool[atype][i]["mtypes"].indexOf("|" + blktags[j] + "|") > -1) {
                blocked = true;
                break;
            }
        }
        if (!blocked) {
            if (usessaction == "inf") {
                if (crsim_infgrps.indexOf("|" + usecmodpool[atype][i]["mgrp"] + "|") > -1) {
                    numto++;
                }
            } else {
                if (usecmodpool[atype][i]["mtypes"].indexOf("|" + usessaction + "|") > -1) {
                    numto++;
                }
            }
        }
    }

    return numto;
}

function poec_simGetNumFromPool(atype, blk) {
    var numpool = 0;

    if (crsim_bypass) {
        var usehmodpool = crsim_bypass["hmodpool"];
        var useiaffixes = crsim_bypass["iaffixes"];
        var usessaction = crsim_bypass["ssaction"];
    } else {
        var usehmodpool = crsim_data["hmodpool"];
        var useiaffixes = crsim_data["iaffixes"];
        var usessaction = crsim_params["ssaction"];
    }

    for (var i = 0; i < usehmodpool[atype].length; i++) {
        var wouldadd = false;
        if (usessaction == "inf") {
            if (crsim_infgrps.indexOf("|" + usehmodpool[atype][i]["mgrp"] + "|") > -1) {
                wouldadd = true;
            }
        } else {
            if (usehmodpool[atype][i]["mtypes"].indexOf("|" + usessaction + "|") > -1) {
                wouldadd = true;
            }
        }
        if (wouldadd) {
            if (blk) {
                for (var j = 0; j < useiaffixes.length; j++) {
                    if (useiaffixes[j]["atype"] == atype && useiaffixes[j]["id"] == usehmodpool[atype][i]["id"]) {
                        wouldadd = false;
                    }
                }
            }

            if (wouldadd) {
                numpool++;
            }
        }
    }

    return numpool;
}

/****************/
/* FORCE ACTION */

/****************/
function poec_simForceAction(vThis, ptype, affid, tindex) {
    if (!crsim_lock) {
        crsim_lock = true;

        var tierrow = $(vThis).parent().parent();
        var affrow = $(vThis).parent().parent().parent().parent().parent();

        if (ptype == "im") {
            // IMPLICITS
            var craftDetail = {
                "add": null,
                "upg": null,
                "rem": null,
                "sts": null,
                "det": null,
                "nums": 1,
                "ilvl": crsim_settings["ilvl"],
                "quality": crsim_settings["quality"],
                "destroyed": crsim_settings["destroyed"],
                "corrupted": crsim_settings["corrupted"],
                "rarity": crsim_settings["rarity"],
                "imprint": null,
                "catalyst": jQuery.parseJSON(JSON.stringify(crsim_catalyst)),
                "influences": jQuery.parseJSON(JSON.stringify(crsim_settings["influences"])),
                "affixes": jQuery.parseJSON(JSON.stringify(crsim_data["iaffixes"])),
                "eldritch": jQuery.parseJSON(JSON.stringify(crsim_data["eldritch"])),
                "implicits": jQuery.parseJSON(JSON.stringify(crsim_data["implicits"])),
                "psn": {"prefix": crsim_data["iaffbt"]["prefix"], "suffix": crsim_data["iaffbt"]["suffix"]}
            };
            if (crsim_data["implicits"]) {
                if (crsim_data["implicits"].length > 0) {
                    if (crsim_data["implicits"][0]["atype"] == undefined) {
                        // Native, wipe
                        crsim_data["implicits"] = [];
                    }
                }
            } else {
                crsim_data["implicits"] = [];
            }
            success = true;
            var atype = $(affrow).prev().attr("mgrp");
            var forced = {"ptype": "im", "affid": affid, "tindex": tindex, "action": "add"};
            var found = -1;
            var iaffix = {
                "atype": atype,
                "id": affid,
                "mgrp": 1,
                "modgroups": poecd['modifiers']['seq'][poecd['modifiers']['ind'][affid]]["modgroups"],
                "nvalues": poecd['tiers'][affid][crsim_settings["base"]][tindex]["nvalues"],
                "rolls": poec_simRollValues(poecd['tiers'][affid][crsim_settings["base"]][tindex]["nvalues"]),
                "tindex": tindex,
                "weight": poecd['tiers'][affid][crsim_settings["base"]][tindex]["weighting"]
            }
            if (atype == "corrupted") {
                // Replace any eldritch implicits or native implicits and update eldritch/dominance
                if (crsim_data["eldritch"]) {
                    crsim_data["eldritch"] = null;
                    crsim_data["implicits"] = [];
                    poec_simUpdateDominance();
                }
                // Check if its already there
                for (var i = 0; i < crsim_data["implicits"].length; i++) {
                    if (crsim_data["implicits"][i]["id"] == affid) {
                        found = i;
                        if (crsim_data["implicits"][i]["tindex"] == tindex) {
                            forced["action"] = "rem";
                        } else {
                            forced["action"] = "swap";
                        }
                        break;
                    }
                }
            } else {
                // Check if base doesnt have an influence conflict
                if (crsim_settings["influences"]) {
                    success = false;
                } else {
                    // Remove any corrupted implicits
                    if (crsim_data["implicits"].length > 0) {
                        if (crsim_data["implicits"][0]["atype"] == "corrupted") {
                            crsim_data["implicits"] = [];
                        }
                    }
                    for (var i = 0; i < crsim_data["implicits"].length; i++) {
                        if (crsim_data["implicits"][i]["atype"] == atype) {
                            found = i;
                            if (crsim_data["implicits"][i]["id"] == affid && crsim_data["implicits"][i]["tindex"] == tindex) {
                                forced["action"] = "rem";
                            } else {
                                forced["action"] = "swap";
                            }
                            break;
                        }
                    }
                }
            }
            if (success) {
                switch (forced["action"]) {
                    case 'add' :
                        crsim_data["implicits"].push(iaffix);
                        craftDetail["add"] = [jQuery.parseJSON(JSON.stringify(iaffix))];
                        break;
                    case 'rem' :
                        var nimps = [];
                        for (var i = 0; i < crsim_data["implicits"].length; i++) {
                            if (i != found) {
                                nimps.push(crsim_data["implicits"][i]);
                            }
                        }
                        crsim_data["implicits"] = jQuery.parseJSON(JSON.stringify(nimps));
                        craftDetail["rem"] = [jQuery.parseJSON(JSON.stringify(iaffix))];
                        break;
                    case 'swap' :
                        for (var i = 0; i < crsim_data["implicits"].length; i++) {
                            if (i == found) {
                                craftDetail["rem"] = [jQuery.parseJSON(JSON.stringify(crsim_data["implicits"][i]))];
                                crsim_data["implicits"][i]["id"] = affid;
                                crsim_data["implicits"][i]["modgroups"] = poecd['modifiers']['seq'][poecd['modifiers']['ind'][affid]]["modgroups"];
                                crsim_data["implicits"][i]["tindex"] = tindex;
                                crsim_data["implicits"][i]["nvalues"] = poecd['tiers'][affid][crsim_settings["base"]][tindex]["nvalues"];
                                crsim_data["implicits"][i]["rolls"] = poec_simRollValues(poecd['tiers'][affid][crsim_settings["base"]][tindex]["nvalues"]);
                                crsim_data["implicits"][i]["weight"] = poecd['tiers'][affid][crsim_settings["base"]][tindex]["weighting"];
                            }
                        }
                        craftDetail["add"] = [jQuery.parseJSON(JSON.stringify(iaffix))];
                        break;
                }
                if (atype != "corrupted") {
                    crsim_data["eldritch"] = null;
                    for (var i = 0; i < crsim_data["implicits"].length; i++) {
                        var tindex = crsim_data["implicits"][i]["tindex"];
                        switch (crsim_data["implicits"][i]["atype"]) {
                            case 'eldritch_blue' :
                                if (!crsim_data["eldritch"]) {
                                    crsim_data["eldritch"] = {};
                                }
                                crsim_data["eldritch"]["eldritch_blue"] = poecd['tiers'][crsim_data["implicits"][i]["id"]][crsim_settings["base"]].length - tindex;
                                break;
                            case 'eldritch_red' :
                                if (!crsim_data["eldritch"]) {
                                    crsim_data["eldritch"] = {};
                                }
                                crsim_data["eldritch"]["eldritch_red"] = poecd['tiers'][crsim_data["implicits"][i]["id"]][crsim_settings["base"]].length - tindex;
                                break;
                        }
                    }
                    poec_simUpdateDominance();
                }
                poec_updateCraftLog(craftDetail, forced, null);
                poec_updateItemAffixes();
                poec_updateActionEnabling();
                poec_simRefreshModPool();
            }

            crsim_lock = false;
        } else {
            // EXPLICITS
            if ($(tierrow).hasClass("find0")) {
                poec_simApplyCraftGO({"action": "rem", "ptype": ptype, "affid": affid, "tindex": tindex}, null, false);
            } else {
                if ($(affrow).hasClass("prtrue")) {
                    // Swap
                    poec_simApplyCraftGO({
                        "action": "swap",
                        "ptype": ptype,
                        "affid": affid,
                        "tindex": tindex,
                        "trueswap": true
                    }, null, false);
                } else {
                    var mgrp = $(affrow).prev().attr("mgrp");
                    var passcraft = true;
                    if ($(affrow).hasClass("blktrue") || $(affrow).parent().parent().hasClass("aftblktrue")) {
                        passcraft = false;
                        if (mgrp == 11) {
                            if (!$(affrow).parent().parent().parent().parent().parent().hasClass("mul_mods")) {
                                var atype = poecd['modifiers']['seq'][poecd['modifiers']['ind'][affid]]["affix"];
                                if ($(affrow).parent().parent().parent().parent().parent().hasClass("bench" + atype)) {
                                    passcraft = true;
                                }
                            }
                        }
                    }
                    // Add, Make sure its not blocked
                    if (passcraft) {
                        if (ptype == "cb") {
                            if ($("#crsimMasterModpool").hasClass("benched") && !$("#crsimMasterModpool").hasClass("mul_mods")) {
                                // Bench Swap
                                poec_simApplyCraftGO({
                                    "action": "swap",
                                    "ptype": ptype,
                                    "affid": affid,
                                    "tindex": tindex,
                                    "trueswap": false,
                                    "bench": true
                                }, null, false);
                            } else {
                                if (!$("#crsimMasterModpool").hasClass("benched")) {
                                    // Regular add
                                    poec_simApplyCraftGO({
                                        "action": "add",
                                        "ptype": ptype,
                                        "affid": affid,
                                        "tindex": tindex,
                                        "bench": true
                                    }, null, false);
                                } else {
                                    if ($("#crsimMasterModpool").hasClass("benched") && $("#crsimMasterModpool").hasClass("mul_mods") && $("#crsimMasterModpool").hasClass("mmlimit")) {
                                        // Do nothing, limit
                                        crsim_lock = false;
                                    } else {
                                        // Multi-mod add
                                        poec_simApplyCraftGO({
                                            "action": "add",
                                            "ptype": ptype,
                                            "affid": affid,
                                            "tindex": tindex,
                                            "bench": true
                                        }, null, false);
                                    }
                                }
                            }
                        } else {
                            poec_simApplyCraftGO({
                                "action": "add",
                                "ptype": ptype,
                                "affid": affid,
                                "tindex": tindex
                            }, null, false);
                        }
                    } else {
                        crsim_lock = false;
                    }
                }
            }
        }
    }
}

/***********/
/* IMPRINT */

/***********/
function poec_simApplyImprint() {
    if (crsim_bypass) {
        var useimprint = crsim_bypass["imprint"];
        var useaffixes = crsim_bypass["iaffixes"];
        var useldritch = crsim_bypass["eldritch"];
        var useimplicits = crsim_bypass["implicits"];
        var useinfluences = crsim_bypass["influences"];
        var usecorrupted = crsim_bypass["corrupted"];
        var usedestroyed = crsim_bypass["destroyed"];
        var usequality = crsim_bypass["quality"];
        var useaffbt = crsim_bypass["iaffbt"];
        var usecatalyst = crsim_bypass["catalyst"];
        var usemetas = crsim_bypass["meta_flags"];
    } else {
        var useimprint = crsim_data["imprint"];
        var useaffixes = crsim_data["iaffixes"];
        var useldritch = crsim_data["eldritch"];
        var useimplicits = crsim_data["implicits"];
        var useinfluences = crsim_settings["influences"];
        var usecorrupted = crsim_settings["corrupted"];
        var usedestroyed = crsim_settings["destroyed"];
        var usequality = crsim_settings["quality"];
        var useaffbt = crsim_data["iaffbt"];
        var usecatalyst = crsim_catalyst;
        var usemetas = crsim_data["meta_flags"];

        var craftDetail = {
            "add": null,
            "upg": null,
            "rem": null,
            "sts": null,
            "det": null,
            "nums": 1,
            "ilvl": crsim_settings["ilvl"],
            "quality": crsim_settings["quality"],
            "bitem": crsim_settings["bitem"],
            "base": crsim_settings["base"],
            "bgroup": crsim_settings["bgroup"],
            "rarity": crsim_settings["rarity"],
            "destroyed": crsim_settings["destroyed"],
            "corrupted": crsim_settings["corrupted"],
            "catalyst": jQuery.parseJSON(JSON.stringify(crsim_catalyst)),
            "imprint": jQuery.parseJSON(JSON.stringify(useimprint)),
            "eldritch": jQuery.parseJSON(JSON.stringify(crsim_data["eldritch"])),
            "influences": jQuery.parseJSON(JSON.stringify(crsim_settings["influences"])),
            "affixes": jQuery.parseJSON(JSON.stringify(crsim_data["iaffixes"])),
            "implicits": jQuery.parseJSON(JSON.stringify(crsim_data["implicits"])),
            "psn": {"prefix": crsim_data["iaffbt"]["prefix"], "suffix": crsim_data["iaffbt"]["suffix"]}
        };
    }

    // Revert item state
    poec_simSetRarity("magic");
    usecatalyst = jQuery.parseJSON(JSON.stringify(useimprint["catalyst"]));
    useaffixes = jQuery.parseJSON(JSON.stringify(useimprint["affixes"]));
    useimplicits = jQuery.parseJSON(JSON.stringify(useimprint["implicits"]));
    useinfluences = jQuery.parseJSON(JSON.stringify(useimprint["influences"]));
    useldritch = jQuery.parseJSON(JSON.stringify(useimprint["eldritch"]));
    usecorrupted = useimprint["corrupted"];
    usedestroyed = useimprint["destroyed"];
    usequality = useimprint["quality"];
    useaffbt["prefix"] = useimprint["psn"]["prefix"];
    useaffbt["suffix"] = useimprint["psn"]["suffix"];

    if (!crsim_bypass) {
        crsim_data["iaffixes"] = useaffixes;
        crsim_data["implicits"] = useimplicits;
        crsim_data["eldritch"] = useldritch;
        crsim_settings["influences"] = useinfluences;
        crsim_settings["corrupted"] = usecorrupted;
        crsim_settings["destroyed"] = usedestroyed;
        crsim_settings["quality"] = usequality;
        crsim_data["iaffbt"] = useaffbt;
        crsim_catalyst = usecatalyst;

        $("#simImprintZone").removeClass("imprinted");

        // Refresh Item and relevant information
        poec_updateItemAffixes();
        poec_updateActionEnabling();

        poec_updateCraftLog(craftDetail, {"ptype": "rimprint", "affid": null, "tindex": null, "action": null}, null);

        clearTimeout(crsim_rmptm);
        crsim_rmptm = setTimeout(function () {
            poec_simRefreshModPool();
        }, 1);
    } else {
        crsim_bypass["iaffixes"] = useaffixes;
        crsim_bypass["implicits"] = useimplicits;
        crsim_bypass["influences"] = useinfluences;
        crsim_bypass["corrupted"] = usecorrupted;
        crsim_bypass["destroyed"] = usedestroyed;
        crsim_bypass["quality"] = usequality;
        crsim_bypass["iaffbt"] = useaffbt;
        crsim_bypass["catalyst"] = usecatalyst;
        crsim_bypass["eldritch"] = useldritch;
        poec_simUpdateMeta();
    }
}

/**********/
/* EXPORT */

/**********/
function poec_simExportData() {
    $("#crsimExportToggler").hide();
    var expdata = {
        "settings": crsim_settings,
        "params": crsim_params,
        "data": {
            "implicits": crsim_data["implicits"],
            "iaffixes": crsim_data["iaffixes"],
            "iaffbt": crsim_data["iaffbt"],
            "imprint": crsim_data["imprint"],
            "eldritch": crsim_data["eldritch"],
            "meta_flags": crsim_data["meta_flags"]
        },
        "log": crsim_log,
        "spending": crsim_spending,
        "opened": crsim_opened,
        "catalyst": crsim_catalyst
    };
    $("#crsimExportArea").val(JSON.stringify(expdata));
    $("#crsimExportToggled").show();
}

function poec_simCloseExporter() {
    $("#crsimExportToggled").hide();
    $("#crsimExportArea").val("");
    $("#crsimExportToggler").show();
}

function poec_simImportCheck() {
    if ($("#simImportArea").val().trim() != "" || $("#simImportInput").val().trim() != "") {
        $("#simImportBtn").css({"display": "inline-block"});
    }
}

function poec_simImportGo(data, init) {
    var import_success = false;
    if (data || !init) {
        try {
            var import_data = jQuery.parseJSON(data);
            import_success = true;
            if (import_data["config"]) {
                import_success = false;
                $("#simImportBtn").mcuiNotice({
                    text: applyLang("This appears to be a simulator dataset!"),
                    type: "alert"
                }).showNotice();
                $("#simImportBtn").mcuiNotice().setText("This appears to be a simulator dataset!");
            }
        } catch (err) {
            $("#simImportBtn").mcuiNotice({text: applyLang("Invalid dataset"), type: "alert"}).showNotice();
        }
    } else {
        var pastebin = $("#simImportInput").val().trim();
        if (pastebin) {
            // Ajax the thing
            $("#simSourceInt").hide();
            $("#simSourceInt").after('<div id="poecModDistBigLoader" class="pastebin" style="padding:30px 0px"><img src="../../images/ajax-loader-dark.gif"></div>');
            var acajax = new mc_ajax("../../cgi/web/custom/get_pastebin.php", "url=" + encodeURIComponent(pastebin), {
                complete: function (result) {
                    $("#poecModDistBigLoader.pastebin").remove();
                    $("#simSourceInt").show();
                    poec_simImportGo(result, false);
                }
            });
        } else {
            try {
                var import_data = jQuery.parseJSON($("#simImportArea").val());
                import_success = true;
                if (import_data["config"]) {
                    import_success = false;
                    $("#simImportBtn").mcuiNotice({
                        text: applyLang("This appears to be a simulator dataset!"),
                        type: "alert"
                    }).showNotice();
                    $("#simImportBtn").mcuiNotice().setText("This appears to be a simulator dataset!");
                }
            } catch (err) {
                $("#simImportBtn").mcuiNotice({text: applyLang("Invalid dataset"), type: "alert"}).showNotice();
            }
        }
    }
    if (import_success) {
        poec_simUseImportSettings(import_data);
    }
}

/*************/
/* FRACTURED */

/*************/
function poec_simToggleFrac(vThis, affid, ptype) {
    if (!crsim_settings["influences"]) {
        if ($(vThis).parent().parent().parent().hasClass("fractrue")) {
            var frac = 0;
        } else {
            var frac = 1;
        }
        var foundaff = -1;
        for (var i = 0; i < crsim_data["iaffixes"].length; i++) {
            if (crsim_data["iaffixes"][i]["id"] == affid) {
                foundaff = i;
                break;
            }
        }
        if (foundaff > -1) {
            poec_simApplyCraftGO({
                "action": "frac",
                "ptype": ptype,
                "affid": affid,
                "action": "frac",
                "tindex": foundaff,
                "extra": frac
            }, null, false);
        } else {
            console.log("Problem occured, could not find affix to frac");
        }
    } else {
        console.log("Should not happen, fracturing on influenced can't work");
    }
}

/**************/
/* CORRUPTING */

/**************/
function poec_simCorrupt(tbl, crafts) {
    if (crsim_bypass) {
        var usebgroup = crsim_bypass["bgroup"];
        var useisinf = crsim_bypass["is_influenced"];
    } else {
        var usebgroup = crsim_settings["bgroup"];
        var useisinf = crsim_data["is_influenced"];
    }
    var rolled = poec_rand(0, tbl.length, true);
    var retterm = tbl[rolled];
    switch (tbl[rolled]) {
        case 'white sockets' :
            switch (usebgroup) {
                case 9 :
                    retterm = "Unique jewel";
                    break;
                case 1 :
                case 10 :
                case 12 :
                case 13 :
                case 14 :
                    retterm = "Nothing";
                    break;
                case 11 :
                    retterm = "Unidentified";
                    break;
            }
            break;
        case 'implicit' :
            switch (usebgroup) {
                case 11 :
                    if (!crsim_bypass) {
                        crsim_hasfrac = false;
                    }
                    poec_simRerollItem("rare", null, null, 8, true, false, false, false, null, false, false, false, false);
                    retterm = "8-mod";
                    break;
                default:
                    poec_simRollImplicits(1);
                    break;
            }
            break;
        case 'implicits' :
            switch (usebgroup) {
                case 11 :
                    retterm = "8-mod";
                    break;
                default:
                    poec_simRollImplicits(2);
                    break;
            }
            break;
        case 'brick' :
            // Reroll item as a random 6 mod item
            if (crafts["mode"] == "action" && crafts["action"] == "corruption_altar" && useisinf == 1) {
                // Roll 2 random influences -> scratch that, one influence
                var crsim_rndinf = [2, 3, 4, 5, 6, 7];
                var rnd = poec_rand(0, crsim_rndinf.length, true);
                var inf1 = crsim_rndinf[rnd];
                //crsim_rndinf.splice(rnd,1);
                //var rnd=poec_rand(0,crsim_rndinf.length,true);
                //var inf2=crsim_rndinf[rnd];
                if (crsim_bypass) {
                    //crsim_bypass["influences"]=[inf1,inf2];
                    crsim_bypass["influences"] = [inf1];
                } else {
                    //crsim_settings["influences"]=[inf1,inf2];
                    crsim_settings["influences"] = [inf1];
                }
            }

            if (!crsim_bypass) {
                crsim_hasfrac = false;
            }
            poec_simRerollItem("rare", null, null, 6, true, false, false, false, null, false, false, false, false);

            switch (usebgroup) {
                case 11 :
                    var rnd = poec_rand(1, 3, true);
                    if (rnd == 1) {
                        retterm = "+1 tier";
                    }
                    break;
                case 2 :
                case 7 :
                    var rnd = poec_rand(1, 37, true);
                    if (rnd == 1) {
                        retterm = "6-link";
                    }
                    break;
            }
            break;
        case 'destroy' :
            if (crsim_bypass) {
                crsim_bypass["destroyed"] = 1;
            } else {
                crsim_settings["destroyed"] = 1;
            }
            break;
        case 'nothing' :
            break;
    }
    if (crsim_bypass) {
        crsim_bypass["corrupted"] = 1;
    } else {
        crsim_settings["corrupted"] = 1;
    }
    return retterm;
}

function poec_simRollImplicits(num) {
    if (crsim_bypass) {
        var useimplicits = crsim_bypass["implicits"];
        var usefmodpool = crsim_bypass["fmodpool"];
        var usebitem = crsim_bypass["bitem"];
    } else {
        var useimplicits = crsim_data["implicits"];
        var usefmodpool = crsim_data["fmodpool"];
        var usebitem = crsim_settings["bitem"];
    }
    if (crsim_igncorimp.indexOf("|" + usebitem + "|") > -1) {
    } else {
        if (usefmodpool["corrupted"][1] !== undefined) {
            var vmp = [];
            var trweight = 0;

            for (var i = 0; i < usefmodpool["corrupted"][1].length; i++) {
                for (var j = 0; j < usefmodpool["corrupted"][1][i]["tiers"].length; j++) {
                    vmp.push({
                        "id": usefmodpool["corrupted"][1][i]["id_modifier"],
                        "weight": parseInt(usefmodpool["corrupted"][1][i]["tiers"][j]["weighting"]),
                        "nvalues": usefmodpool["corrupted"][1][i]["tiers"][j]["nvalues"],
                        "tier": j,
                        "modgroups": usefmodpool["corrupted"][1][i]["modgroups"]
                    });
                    trweight += parseInt(usefmodpool["corrupted"][1][i]["tiers"][j]["weighting"]);
                }
            }

            var implicits = [];
            var affix = null;
            for (var m = 0; m < num; m++) {
                if (m > 0) {
                    // Rebuild modpool after having picked mod
                    var nmodpool = [];
                    trweight = 0;
                    for (var i = 0; i < vmp.length; i++) {
                        var mconflict = false;
                        for (var zy = 0; zy < vmp[i]["modgroups"].length; zy++) {
                            for (var zw = 0; zw < affix["modgroups"].length; zw++) {
                                if (vmp[i]["modgroups"][zy] == affix["modgroups"][zw]) {
                                    mconflict = true;
                                }
                            }
                        }
                        if (!mconflict) {
                            nmodpool.push(vmp[i]);
                            trweight += vmp[i]["weight"];
                        }
                    }
                    vmp = jQuery.parseJSON(JSON.stringify(nmodpool));
                }
                var rnd = poec_rand(1, trweight, true);
                var simTWeight = 0;
                affix = null;
                for (var i = 0; i < vmp.length; i++) {
                    var rs = simTWeight + 1;
                    var re = simTWeight + vmp[i]["weight"];
                    if (rnd >= rs && rnd <= re) {
                        affix = vmp[i];
                        break;
                    }
                    simTWeight += vmp[i]["weight"];
                }
                if (affix) {
                    implicits.push(affix);
                } else {
                    console.log("Could not roll implicit?!");
                }
            }

            var ncurimp = 0;
            var itorep = [];
            if (useimplicits) {
                ncurimp = useimplicits.length;
                for (var i = 0; i < ncurimp; i++) {
                    itorep.push(i);
                }
            } else {
                useimplicits = [];
            }

            impscopy = jQuery.parseJSON(JSON.stringify(useimplicits));

            var currep = 0;
            for (var i = 0; i < implicits.length; i++) {
                /*
        var nimp={
          "name":poecl["mod"][implicits[i]["id"]],
          "nvalues":jQuery.parseJSON(implicits[i]["nvalues"]),
          "rolls":poec_simRollValues(implicits[i]["nvalues"])
        };
        */
                var nimp = {
                    "atype": "corrupted",
                    "id": implicits[i]["id"],
                    "mgrp": poecd['modifiers']['seq'][poecd['modifiers']['ind'][implicits[i]["id"]]]["id_mgroup"],
                    "modgroups": poecd['modifiers']['seq'][poecd['modifiers']['ind'][implicits[i]["id"]]]["modgroups"],
                    "nvalues": implicits[i]["nvalues"],
                    "rolls": poec_simRollValues(implicits[i]["nvalues"]),
                    "tindex": implicits[i]["tier"],
                    "weight": implicits[i]["weight"]
                };
                if (currep < ncurimp) {
                    // Replace a current implicit at random
                    var ipick = poec_rand(0, itorep.length, true);
                    impscopy[itorep[ipick]] = nimp;
                    itorep.splice(ipick, 1);
                    currep++;
                } else {
                    // Add new implicit
                    impscopy.push(nimp);
                }
            }

            useimplicits = jQuery.parseJSON(JSON.stringify(impscopy));
        }
    }
    if (crsim_bypass) {
        crsim_bypass["implicits"] = useimplicits;
    } else {
        crsim_data["implicits"] = useimplicits;
    }
}

/*******************/
/* SPECIAL FOSSILS */
/*******************/
var crsim_specialfossils = "|perfect|gilded|18|20|";

function poec_simParsePoolFossils(selection) {
    var sel = [];
    for (var i = 0; i < selection.length; i++) {
        if (crsim_specialfossils.indexOf("|" + selection[i] + "|") > -1) {
        } else {
            sel.push(selection[i]);
        }
    }
    return sel;
}

/*********************/
/* SPECIAL FUNCTIONS */
/*********************/
String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

/*****************/
/* AFFIX CONTEXT */
/*****************/
var crsim_cactactx = null;

function poec_simToggleAffixContext(e, vThis) {
    e.preventDefault();
    var aind = $(vThis).attr("aind");
    crsim_cactactx = vThis;
    vHTML = "";
    if ($(vThis).hasClass("veiled")) {
        vHTML += "<div class='unveil' onClick='poec_simUnveilMod(" + aind + ",false)'>" + applyLang("Unveil") + "</div>";
    }
    if (crsim_settings["influences"] == null) {
        if (!$(vThis).hasClass("veiled")) {
            if ($(vThis).hasClass("frac1")) {
                vHTML += "<div class='ufrac' onClick='poec_simAffixContextGO(\"ufrac\")'>" + applyLang("Unfracture") + "</div>";
            } else {
                vHTML += "<div class='frac' onClick='poec_simAffixContextGO(\"frac\")'>" + applyLang("Fracture") + "</div>";
            }
        }
    }
    vHTML += "<div class='rem' onClick='poec_simAffixContextGO(\"rem\")'>" + applyLang("Remove") + "</div>";
    $("#poecSAffContext").css({"left": e.pageX - 5, "top": e.pageY - 5}).html(vHTML).show();
}

function poec_simCloseAffixContext() {
    $("#poecSAffContext").hide();
    crsim_cactactx = null;
}

function poec_simAffixContextGO(action) {
    var aind = $(crsim_cactactx).attr("aind");
    var affid = $(crsim_cactactx).attr("affid");
    switch (action) {
        case 'rem' :
            poec_simApplyCraftGO({"action": "rem", "ptype": "mp", "affid": affid, "tindex": aind}, null, false);
            break;
        case 'frac' :
            poec_simApplyCraftGO({
                "action": "frac",
                "ptype": "mp",
                "affid": affid,
                "action": "frac",
                "tindex": aind,
                "extra": 1
            }, null, false);
            break;
        case 'ufrac' :
            poec_simApplyCraftGO({
                "action": "frac",
                "ptype": "mp",
                "affid": affid,
                "action": "frac",
                "tindex": aind,
                "extra": 0
            }, null, false);
            break;
    }
    poec_simCloseAffixContext();
}

/*************/
/* CLIPBOARD */

/*************/
function poec_simCopyToClipboard() {
    $("#simClipboardData").show();
    $("#simClipboardData").select();
    document.execCommand('copy');
    $("#simClipboardData").hide();
    $("#simClipBtn").mcuiNotice({
        text: applyLang("Item copied to clipboard!<br>(Path of Building compatible)"),
        type: "alert"
    }).showNotice();
}

/**********/
/* UNVEIL */

/**********/
function poec_simUnveilMod(swapindex, retdata) {
    if (crsim_bypass) {
        var useimplicits = crsim_bypass["implicits"];
        var useaffixes = crsim_bypass["iaffixes"];
        var usefmodpool = crsim_bypass["fmodpool"];
    } else {
        var useimplicits = crsim_data["implicits"];
        var useaffixes = crsim_data["iaffixes"];
        var usefmodpool = crsim_data["fmodpool"];
    }

    // Build blocked modgroups from current modifiers
    var blkmgrps = "|";
    var blkamg = "|";
    // Get eldritch implicits that might block something as well
    for (var i = 0; i < useaffixes.length; i++) {
        if (useaffixes[i]["id"] > 0) {
            for (var zy = 0; zy < poecd["modifiers"]["seq"][poecd["modifiers"]["ind"][useaffixes[i]["id"]]]["modgroups"].length; zy++) {
                blkmgrps += poecd["modifiers"]["seq"][poecd["modifiers"]["ind"][useaffixes[i]["id"]]]["modgroups"][zy] + "|";
            }
            if (poecd["modifiers"]["seq"][poecd["modifiers"]["ind"][useaffixes[i]["id"]]]["amg"]) {
                var tamgs = poec_getAMGs(poecd["modifiers"]["seq"][poecd["modifiers"]["ind"][useaffixes[i]["id"]]]["amg"]);
                if (tamgs) {
                    for (var h = 0; h < tamgs.length; h++) {
                        blkamg += tamgs[h] + "|";
                    }
                }
            }
        } else {
            if (useaffixes[i]["id"] == -1 && swapindex === null) {
                swapindex = i;
            }
        }
    }
    // Build array of eligible veiled modifiers
    var varr = [];
    var vtweight = 0;
    for (var i = 0; i < usefmodpool[useaffixes[swapindex]["atype"]][crsim_veiledmgrp].length; i++) {
        var mconflict = false;
        for (var zy = 0; zy < usefmodpool[useaffixes[swapindex]["atype"]][crsim_veiledmgrp][i]["modgroups"].length; zy++) {
            if (blkmgrps.indexOf("|" + usefmodpool[useaffixes[swapindex]["atype"]][crsim_veiledmgrp][i]["modgroups"][zy] + "|") > -1) {
                mconflict = true;
            }
        }
        if (mconflict) {
        } else {
            var amgvalid = true;
            if (usefmodpool[useaffixes[swapindex]["atype"]][crsim_veiledmgrp][i]["amg"]) {
                var tamgs = poec_getAMGs(usefmodpool[useaffixes[swapindex]["atype"]][crsim_veiledmgrp][i]["amg"]);
                if (tamgs) {
                    for (var h = 0; h < tamgs.length; h++) {
                        if (blkamg.indexOf("|" + tamgs[h] + "|") > -1) {
                            amgvalid = false;
                        }
                    }
                }
            }
            if (amgvalid) {
                if (usefmodpool[useaffixes[swapindex]["atype"]][crsim_veiledmgrp][i]["vex"] == 0) {
                    varr.push({
                        "id": usefmodpool[useaffixes[swapindex]["atype"]][crsim_veiledmgrp][i]["id_modifier"],
                        "weight": parseInt(usefmodpool[useaffixes[swapindex]["atype"]][crsim_veiledmgrp][i]["tiers"][0]["weighting"]),
                        "mgrp": usefmodpool[useaffixes[swapindex]["atype"]][crsim_veiledmgrp][i]["modgroups"]
                    });
                    vtweight += varr[varr.length - 1]["weight"];
                }
            }
        }
    }
    // Pick 3 modifiers from the list
    var picks = [];
    for (var j = 0; j < 3; j++) {
        var rweight = poec_rand(0, vtweight, true);
        var cweight = 0;
        var chosengrp = null;
        for (var k = 0; k < varr.length; k++) {
            if (rweight >= cweight && rweight <= cweight + varr[k]["weight"]) {
                picks.push(varr[k]["id"]);
                chosengrp = varr[k]["mgrp"];
                vtweight -= varr[k]["weight"];
                break;
            }
            cweight += varr[k]["weight"];
        }
        varr.splice(k, 1);
        // Remove others from same modgroup
        var narr = [];
        for (var k = 0; k < varr.length; k++) {
            var mconflict = false;
            for (var zy = 0; zy < varr[k]["mgrp"].length; zy++) {
                for (var zw = 0; zw < chosengrp.length; zw++) {
                    if (varr[k]["mgrp"][zy] == chosengrp[zw]) {
                        mconflict = true;
                    }
                }
            }
            if (mconflict) {
                vtweight -= varr[k]["weight"];
            } else {
                narr.push(jQuery.parseJSON(JSON.stringify(varr[k])));
            }
        }
        varr = jQuery.parseJSON(JSON.stringify(narr));
    }
    if (!crsim_bypass) {
        if ($("#poec_simVeilChooser").length == 0) {
            $("<div>").attr("id", "poec_simVeilChooser").addClass("over_shadow").appendTo($("body"));
            if ($("#poecSimWCurtain").length == 0) {
                $("<div>").attr("id", "poecSimWCurtain").appendTo($("body"));
            }
        }
        var vHTML = "";
        for (var i = 0; i < picks.length; i++) {
            var mname = poecl["mod"][picks[i]];
            var rolls = poec_simRollValues(poecd["tiers"][picks[i]][crsim_settings["base"]][0]["nvalues"]);
            for (var j = 0; j < rolls.length; j++) {
                mname = mname.replace("#", rolls[j]);
            }
            vHTML += "<div class='vmod' onClick='poec_simPickVeiledMod(this)' swindex='" + swapindex + "' mid='" + picks[i] + "' nvalues='" + JSON.stringify(rolls) + "'>" + mname + "</div>";
        }
        $("#poec_simVeilChooser").html(vHTML).css({"visibility": "hidden", "display": "block"});
        $("#poec_simVeilChooser").css({
            "margin-left": 0 - ($("#poec_simVeilChooser").outerWidth() / 2),
            "margin-top": 0 - ($("#poec_simVeilChooser").outerHeight() / 2),
            "visibility": "visible"
        });
        $("#poecSimWCurtain").show();
    }

    if (retdata) {
        return picks;
    }
}

function poec_simPickVeiledMod(vThis) {
    var swapindex = $(vThis).attr("swindex");
    var mid = $(vThis).attr("mid");
    var nvalues = $(vThis).attr("nvalues");

    poec_simApplyCraftGO({"action": "unveil", "swapindex": swapindex, "mid": mid, "nvalues": nvalues}, null, false);

    $("#poec_simVeilChooser").hide();
    $("#poecSimWCurtain").hide();
}