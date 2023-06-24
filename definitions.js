/**********************************************

    Common constants definition
    Usage : Simulator

    TODO : Need to adapt emulator to use it 
    as alot of it is redundant

**********************************************/
var poec_constants={
    "constraints":{
        "active_mgroups":"|1|2|3|4|5|6|7|8|9|10|11|12|13|14|15|", // Active mod groups for crafting
        "influence_mgroups":"|2|3|4|5|6|7|", // Influence mod groups
        "eldritch_bgroups":"|2|3|4|5|", // Base item groups valid for eldritch crafting
        "defense_bgroups":"|2|3|4|5|8|", // Defense bgroups
        "maps_bgroups":"|15|11|", // Maps bgroups
        "ward_bgroups":"|3|4|5|", // Ward bgroups
        "ward_bases":"|201|202|203|", // Ward bases
        "defense_base_ignore":"|4|",
        "weapon_bgroups":"|6|7|",
        "veil_bgroups":"|1|2|3|4|5|6|7|8|", // Base item groups valid for veil/unveil
        "beast_bgroups":"|2|3|4|5|6|7|8|", // Aspects groups valid
        "quality_bgroups":"|2|3|4|5|6|7|8|11|", // Base item groups valid for quality application
        "quality_base_ignore":"|4|", // Base items invalid for quality application
        "ignore_fossils":"|", // Fossils to ignore at the moment
        "hollow_bgroups":"|2|3|4|5|", // Hollow fossil valid bgroups
        "recombinate_bgroups":"|1|2|3|4|5|6|7|8|"
    },
    "refs":{ // References to specific IDs
        "hollow_fossil_mod":757,
        "veiled_mgroup":10,
        "bench_mgroup":11,
        "multimod_mod":2964,
        "beast_aspect_mods":"|3656|3655|3653|3654|"
    },
    "indexes":{
        "currency":{
            "bench":{
                1:"alteration",
                2:"chaos",
                3:"transmute",
                4:"augmentation",
                5:"alchemy",
                6:"chance",
                7:"exalted",
                8:"regal",
                9:"glassblower",
                10:"divine",
                11:"vaal",
                12:"blessed",
                13:"armourer",
                14:"gemcutter",
                15:"scour"
            },
            "poeninja":{
                "alteration":{"grp":"currency","key":"Orb of Alteration"},
                "chaos":{"grp":"currency","key":"Chaos Orb"},
                "transmute":{"grp":"currency","key":"Orb of Transmutation"},
                "augmentation":{"grp":"currency","key":"Orb of Augmentation"},
                "annul":{"grp":"currency","key":"Orb of Annulment"},
                "alchemy":{"grp":"currency","key":"Orb of Alchemy"},
                "chance":{"grp":"currency","key":"Orb of Chance"},
                "exalted":{"grp":"currency","key":"Exalted Orb"},
                "regal":{"grp":"currency","key":"Regal Orb"},
                "glassblower":{"grp":"currency","key":"Glassblower's Bauble"},
                "divine":{"grp":"currency","key":"Divine Orb"},
                "vaal":{"grp":"currency","key":"Vaal Orb"},
                "blessed":{"grp":"currency","key":"Blessed Orb"},
                "armourer":{"grp":"currency","key":"Armourer's Scrap"},
                "gemcutter":{"grp":"currency","key":"Gemcutter's Prism"},
                "hunter":{"grp":"currency","key":"Hunter's Exalted Orb"},
                "crusader":{"grp":"currency","key":"Crusader's Exalted Orb"},
                "redeemer":{"grp":"currency","key":"Redeemer's Exalted Orb"},
                "warlord":{"grp":"currency","key":"Warlord's Exalted Orb"},
                "woke":{"grp":"currency","key":"Awakener's Orb"},
                "maven":{"grp":"currency","key":"Orb of Dominance"},
                "scour":{"grp":"currency","key":"Orb of Scouring"},
                "reso_1":{"grp":"resonators","key":"Primitive Chaotic"},
                "reso_2":{"grp":"resonators","key":"Potent Chaotic"},
                "reso_3":{"grp":"resonators","key":"Powerful Chaotic"},
                "reso_4":{"grp":"resonators","key":"Prime Chaotic"},
                "suftopre":{"grp":"beasts","key":"Farric Lynx Alpha"},
                "pretosuf":{"grp":"beasts","key":"Farric Wolf Alpha"},
                "imprint":{"grp":"beasts","key":"Craicic Chimeral"},
                "breroll":{"grp":"beasts","key":"Farric Frost Hellion Alpha"},
                "bcat":{"grp":"beasts","key":"Farrul, First of the Plains"},
                "bavian":{"grp":"beasts","key":"Saqawal, First of the Sky"},
                "bspider":{"grp":"beasts","key":"Fenumus, First of the Night"},
                "bcrab":{"grp":"beasts","key":"Craiceann, First of the Deep"},
                "eldritchichorlesser":{"grp":"currency","key":"Lesser Eldritch Ichor"},
                "eldritchichorgreater":{"grp":"currency","key":"Greater Eldritch Ichor"},
                "eldritchichorgrand":{"grp":"currency","key":"Grand Eldritch Ichor"},
                "eldritchichorexceptional":{"grp":"currency","key":"Exceptional Eldritch Ichor"},
                "eldritchemberlesser":{"grp":"currency","key":"Lesser Eldritch Ember"},
                "eldritchembergreater":{"grp":"currency","key":"Greater Eldritch Ember"},
                "eldritchembergrand":{"grp":"currency","key":"Grand Eldritch Ember"},
                "eldritchemberexceptional":{"grp":"currency","key":"Exceptional Eldritch Ember"},
                "eldritchchaos":{"grp":"currency","key":"Eldritch Chaos Orb"},
                "eldritchexalt":{"grp":"currency","key":"Eldritch Exalted Orb"},
                "eldritchannul":{"grp":"currency","key":"Eldritch Orb of Annulment"},
                "eldritchconflict":{"grp":"currency","key":"Orb of Conflict"},
                "veiled":{"grp":"currency","key":"Veiled Chaos Orb"},
                "jrecomb":{"grp":"currency","key":"Jewellery Recombinator"},
                "wrecomb":{"grp":"currency","key":"Weapon Recombinator"},
                "arecomb":{"grp":"currency","key":"Armour Recombinator"},
                "fracturing":{"grp":"currency","key":"Fracturing Orb"}
            }
        }
    }
}

var poec_cpseudos={
    "def":{
        "armour":{
            "name":"Armour",
            "property":true,
            "quality":true,
            "bgroups":poec_constants["constraints"]["defense_bgroups"],
            "ignore_bases":poec_constants["constraints"]["defense_base_ignore"],
            "noitemoutput":true
        },
        "attack_time":{
            "name":"Attack Speed (local)",
            "bgroups":poec_constants["constraints"]["weapon_bgroups"],
            "divide":1000,
            "decimal":2,
            "property":true,
            "noitemoutput":true
        },
        "attributes":{
            "name":"Attributes",
            "property":false
        },
        "block":{
            "name":"Block",
            "property":true,
            "nosim":true
        },
        "dexterity":{
            "name":"Dexterity",
            "property":false
        },
        "chaos_resist":{
            "name":"Chaos Resistance",
            "property":false
        },
        "cold_resist":{
            "name":"Cold Resistance",
            "property":false
        },
        "critical_strike_chance":{
            "name":"Critical Strike Chance",
            "property":true,
            "nosim":true,
            "noitemoutput":true
        },
        "elemental_damage":{
            "name":"Elemental Damage (local)",
            "property":false,
            "bgroups":poec_constants["constraints"]["weapon_bgroups"]
        },
        "elemental_dps":{
            "name":"Elemental DPS",
            "bgroups":poec_constants["constraints"]["weapon_bgroups"],
            "parts":{
                "elemental_damage":"f",
                "attack_time":"m",
            },
            "advanced":true
        },
        "elemental_resists":{
            "name":"Elemental Resistances",
            "property":false
        },
        "energy_shield":{
            "name":"Energy Shield",
            "property":true,
            "quality":true,
            "bgroups":poec_constants["constraints"]["defense_bgroups"],
            "ignore_bases":poec_constants["constraints"]["defense_base_ignore"],
            "noitemoutput":true
        },
        "evasion":{
            "name":"Evasion",
            "property":true,
            "quality":true,
            "bgroups":poec_constants["constraints"]["defense_bgroups"],
            "ignore_bases":poec_constants["constraints"]["defense_base_ignore"],
            "noitemoutput":true
        },
        "fire_resist":{
            "name":"Fire Resistance",
            "property":false
        },
        "flat_life":{
            "name":"Life (flat)",
            "property":false
        },
        "intelligence":{
            "name":"Intelligence",
            "property":false
        },
        "lightning_resist":{
            "name":"Lightning Resistance",
            "property":false
        },
        "packsize":{
            "name":"Packsize",
            "property":false,
            "bgroups":poec_constants["constraints"]["maps_bgroups"]
        },
        "physical_damage_min":{
            "name":"Physical Damage (min)",
            "property":true,
            "quality":true,
            "nosim":true
        },
        "physical_damage_max":{
            "name":"Physical Damage (max)",
            "property":true,
            "quality":true,
            "nosim":true
        },
        "physical_damage":{
            "name":"Physical Damage (local)",
            "property":["physical_damage_min","physical_damage_max"],
            "bgroups":poec_constants["constraints"]["weapon_bgroups"],
            "quality":true
        },
        "physical_dps":{
            "name":"Physical DPS",
            "bgroups":poec_constants["constraints"]["weapon_bgroups"],
            "parts":{
                "physical_damage":"f",
                "attack_time":"m",
            },
            "advanced":true
        },
        "quality":{
            "name":"Quality",
            "property":true,
            "nosim":true
        },
        "quantity":{
            "name":"Quantity",
            "property":false,
            "bgroups":poec_constants["constraints"]["maps_bgroups"]
        },
        "rarity":{
            "name":"Rarity",
            "property":false,
            "bgroups":poec_constants["constraints"]["maps_bgroups"]
        },
        "strength":{
            "name":"Strength",
            "property":false
        },
        "total_damage":{
            "name":"Total Damage (local)",
            "bgroups":poec_constants["constraints"]["weapon_bgroups"],
            "parts":{
                "physical_damage":"f",
                "elemental_damage":"f",
            },
            "advanced":true
        },
        "total_dps":{
            "name":"Total DPS",
            "bgroups":poec_constants["constraints"]["weapon_bgroups"],
            "parts":{
                "physical_damage":"f",
                "elemental_damage":"f",
                "attack_time":"m",
            },
            "advanced":true
        },
        "total_resists":{
            "name":"Total Resistances",
            "property":false
        },
        "ward":{
            "name":"Ward",
            "property":true,
            "quality":true,
            "bases":poec_constants["constraints"]["ward_bases"],
            "noitemoutput":true
        }
    },
    "mods":{
        "#% increased Rarity of Items found in this Area":{"affects":["rarity"],"type":"f","mod":[1]},
        "#% increased Quantity of Items found in this Area":{"affects":["quantity"],"type":"f","mod":[1]},
        "#% increased Pack size":{"affects":["packsize"],"type":"f","mod":[1]},
        "#% increased Physical Damage":{"affects":["physical_damage_min","physical_damage_max","physical_damage"],"type":"m","mod":[1,1,1]},
        "Adds # to # Physical Damage":{"affects":["physical_damage_min","physical_damage_max","physical_damage"],"type":"f","mod":[1,1,1]},
        "#% increased Attack Speed":{"affects":["attack_time"],"type":"m","mod":[1]},
        "#% increased Critical Strike Chance":{"affects":["critical_strike_chance"],"type":"m","mod":[1]},
        "+#% Chance to Block":{"affects":["block"],"type":"f","mod":[1]},
        "+# to Armour":{"affects":["armour"],"type":"f","mod":[1]},
        "#% increased Armour":{"affects":["armour"],"type":"m","mod":[1]},
        "+# to Evasion Rating":{"affects":["evasion"],"type":"f","mod":[1]},
        "#% increased Evasion Rating":{"affects":["evasion"],"type":"m","mod":[1]},
        "+# to maximum Energy Shield":{"affects":["energy_shield"],"type":"f","mod":[1]},
        "#% increased Energy Shield":{"affects":["energy_shield"],"type":"m","mod":[1]},
        "#% increased Ward":{"affects":["ward"],"type":"m","mod":[1]},
        "+# to Ward":{"affects":["ward"],"type":"f","mod":[1]},
        "#% increased Armour and Energy Shield":{"affects":["armour","energy_shield"],"type":"m","mod":[1,1]},
        "#% increased Armour and Evasion":{"affects":["armour","evasion"],"type":"m","mod":[1,1]},
        "#% increased Evasion and Energy Shield":{"affects":["evasion","energy_shield"],"type":"m","mod":[1,1]},
        "#% increased Armour| Evasion and Energy Shield":{"affects":["armour","evasion","energy_shield"],"type":"m","mod":[1,1,1]},
        "+#% to Quality":{"affects":["quality"],"type":"f","mod":[1]},
        "+#% to Fire Resistance":{"affects":["elemental_resists","total_resists","fire_resist"],"type":"f","mod":[1,1,1]},
        "+#% to Cold Resistance":{"affects":["elemental_resists","total_resists","cold_resist"],"type":"f","mod":[1,1,1]},
        "+#% to Lightning Resistance":{"affects":["elemental_resists","total_resists","lightning_resist"],"type":"f","mod":[1,1,1]},
        "+#% to Chaos Resistance":{"affects":["total_resists","chaos_resist"],"type":"f","mod":[1,1]},
        "+#% to Fire and Cold Resistances":{"affects":["elemental_resists","total_resists","fire_resist","cold_resist"],"type":"f","mod":[2,2,1,1]},
        "+#% to Fire and Lightning Resistances":{"affects":["elemental_resists","total_resists","fire_resist","lightning_resist"],"type":"f","mod":[2,2,1,1]},
        "+#% to Cold and Lightning Resistances":{"affects":["elemental_resists","total_resists","cold_resist","lightning_resist"],"type":"f","mod":[2,2,1,1]},
        "+#% to Cold and Chaos Resistances":{"affects":["elemental_resists","total_resists","cold_resist","chaos_resist"],"type":"f","mod":[1,2,1,1]},
        "+#% to Fire and Chaos Resistances":{"affects":["elemental_resists","total_resists","fire_resist","chaos_resist"],"type":"f","mod":[1,2,1,1]},
        "+#% to Lightning and Chaos Resistances":{"affects":["elemental_resists","total_resists","lightning_resist","chaos_resist"],"type":"f","mod":[1,2,1,1]},
        "+#% to all Elemental Resistances":{"affects":["elemental_resists","total_resists","fire_resist","cold_resist","lightning_resist"],"type":"f","mod":[3,3,1,1,1]},
        "+# to Maximum Life":{"affects":["flat_life"],"type":"f","mod":[1]},
        "+# to Strength":{"affects":["strength","attributes"],"type":"f","mod":[1,1]},
        "+# to Dexterity":{"affects":["dexterity","attributes"],"type":"f","mod":[1,1]},
        "+# to Intelligence":{"affects":["intelligence","attributes"],"type":"f","mod":[1,1]},
        "+# to Strength and Dexterity":{"affects":["strength","dexterity","attributes"],"type":"f","mod":[1,1,2]},
        "+# to Strength and Intelligence":{"affects":["strength","intelligence","attributes"],"type":"f","mod":[1,1,2]},
        "+# to Dexterity and Intelligence":{"affects":["dexterity","intelligence","attributes"],"type":"f","mod":[1,1,2]},
        "+# to all Attributes":{"affects":["strength","dexterity","intelligence","attributes"],"type":"f","mod":[1,1,1,3]},
        "Adds # to # Fire Damage":{"affects":["elemental_damage"],"type":"f","mod":[1]},
        "Adds # to # Cold Damage":{"affects":["elemental_damage"],"type":"f","mod":[1]},
        "Adds # to # Lightning Damage":{"affects":["elemental_damage"],"type":"f","mod":[1]}
    }
}

/**********************************************

    Crafting methods definition              
    Usage : Simulator        

    TODO : Need to adapt emulator to use it 
    as alot of it is redundant

**********************************************/
var poec_cmethods={
    "currency":{ // BASIC METHODS
        "name":"Basic currency", 
        "img":"method_multi",
        "subset":{
            "transmute":{
                "desc":"Upgrades a normal item to a magic item",
                "name":"Orb of Transmutation",
                "plural":"Orbs of Transmutation",
                "psing":"an",
                "img":"method_transmute",
                "rarity":"magic",
                "required":{
                    "rarity":"normal"
                }
            },
            "alteration":{
                "desc":"Reforges a magic item with new random properties",
                "name":"Orb of Alteration",
                "plural":"Orbs of Alteration",
                "psing":"an",
                "img":"method_alteration",
                "required":{
                    "rarity":"magic"
                }
            },
            "augmentation":{
                "desc":"Enchants a magic item with a new random property",
                "name":"Orb of Augmentation",
                "plural":"Orbs of Augmentation",
                "psing":"an",
                "img":"method_augmentation",
                "required":{
                    "rarity":"magic",
                    "open":"any"
                }
            },
            "regal":{
                "desc":"Upgrades a magic item to a rare item",
                "name":"Regal Orb",
                "plural":"Regal Orbs",
                "rarity":"rare",
                "img":"method_regal",
                "required":{
                    "rarity":"magic",
                    "flags":["is_rare"]
                }
            },
            "alchemy":{
                "desc":"Upgrades a normal item to a rare item",
                "name":"Orb of Alchemy",
                "plural":"Orbs of Alchemy",
                "psing":"an",
                "rarity":"rare",
                "img":"method_alchemy",
                "required":{
                    "rarity":"normal",
                    "flags":["is_rare"]
                }
            },
            "chaos":{
                "desc":"Reforges a rare item with new random modifiers",
                "name":"Chaos Orb",
                "plural":"Chaos Orbs",
                "img":"method_chaos",
                "required":{
                    "rarity":"rare",
                    "flags":["is_rare"]
                }
            },
            "exalted":{
                "desc":"Enchants a rare item with a new random property",
                "name":"Exalted Orb",
                "plural":"Exalted Orbs",
                "psing":"an",
                "img":"method_exalted",
                "required":{
                    "rarity":"rare",
                    "flags":["is_rare"],
                    "open":"any"
                }
            },
            "scour":{
                "desc":"Removes all properties from an item",
                "name":"Orb of Scouring",
                "plural":"Orbs of Scouring",
                "psing":"an",
                "img":"method_scour",
                "rarity":"normal",
                "cannot":{
                    "rarity":"normal"
                }
            },
            "annul":{
                "desc":"Removes a random modifier from an item",
                "name":"Orb of Annulment",
                "plural":"Orbs of Annulment",
                "psing":"an",
                "img":"method_annul",
                "required":{
                    "affixes":1
                },
                "cannot":{
                    "rarity":"normal"
                }
            }, 
            "crusader":{
                "desc":"Enchants a rare item with a new Crusader modifier",
                "name":"Crusader's Exalted Orb",
                "plural":"Crusader's Exalted Orbs",
                "img":"method_crusader",
                "influence":4,
                "required":{
                    "rarity":"rare",
                    "ilvl":68,
                    "flags":["is_influenced","is_rare"],
                    "open":"any"
                },
                "cannot":{
                    "influenced":true,
                    "fractured":true,
                    "eldritched":true
                }
            },
            "hunter":{
                "desc":"Enchants a rare item with a new Hunter modifier",
                "name":"Hunter's Exalted Orb",
                "plural":"Hunter's Exalted Orbs",
                "img":"method_hunter",
                "influence":5,
                "required":{
                    "rarity":"rare",
                    "ilvl":68,
                    "flags":["is_influenced","is_rare"],
                    "open":"any"
                },
                "cannot":{
                    "influenced":true,
                    "fractured":true,
                    "eldritched":true
                }
            },
            "redeemer":{
                "desc":"Enchants a rare item with a new Redeemer modifier",
                "name":"Redeemer's Exalted Orb",
                "plural":"Redeemer's Exalted Orbs",
                "img":"method_redeemer",
                "influence":7,
                "required":{
                    "rarity":"rare",
                    "ilvl":68,
                    "flags":["is_influenced","is_rare"],
                    "open":"any"
                },
                "cannot":{
                    "influenced":true,
                    "fractured":true,
                    "eldritched":true
                }
            },
            "warlord":{
                "desc":"Enchants a rare item with a new Warlord modifier",
                "name":"Warlord's Exalted Orb",
                "plural":"Warlord's Exalted Orbs",
                "img":"method_warlord",
                "influence":6,
                "required":{
                    "rarity":"rare",
                    "ilvl":68,
                    "flags":["is_influenced","is_rare"],
                    "open":"any"
                },
                "cannot":{
                    "influenced":true,
                    "fractured":true,
                    "eldritched":true
                }
            },
            "blessed":{
                "desc":"Randomises the numeric values of the implicit properties of an item",
                "name":"Blessed Orb",
                "plural":"Blessed Orbs",
                "img":"method_blessed",
                "required":{
                    "flags":["rollable_implicits"]
                }
            },
            "divine":{
                "desc":"Randomises the numeric values of the random properties on an item",
                "name":"Divine Orb",
                "plural":"Divine Orbs",
                "img":"method_divine",
                "required":{
                    "affixes":1
                },
                "cannot":{
                    "rarity":"normal"
                }
            },
            "veiled":{
                "desc":"Reforges a rare item with new random modifiers, including a veiled modifier.",
                "name":"Veiled Chaos Orb",
                "plural":"Veiled Chaos Orbs",
                "img":"method_veiled",
                "required":{
                    "rarity":"rare",
                    "bgroup":poec_constants["constraints"]["veil_bgroups"],
                    "flags":["is_rare"]
                }
            },
            "woke":{
                "desc":"Destroys an item, applying its influence to another of the same item class. The second item is reforged as a rare item with both influence types and new modifiers",
                "name":"Awakener's Orb",
                "plural":"Awakener's Orbs",
                "img":"method_woke",
                "required":{
                    "ilvl":68,
                    "woke":true,
                    "flags":["is_influenced","is_rare"]
                }
            },
            "maven":{
                "desc":"Removes one Influenced Modifier from an item with at least two Influenced Modifiers and upgrades another Influenced Modifier",
                "name":"Orb of Dominance",
                "plural":"Orbs of Dominance",
                "psing":"an",
                "img":"method_maven",
                "required":{
                    "ilvl":68,
                    "influenced":true,
                    "flags":["is_influenced","is_rare"]
                },
                "cannot":{
                    "rarity":"normal"
                }
            },
            "fracturing":{
                "desc":"Fracture a random modifier on a rare item with at least 4 modifiers, locking it in place",
                "name":"Fracturing Orb",
                "plural":"Fracturing Orbs",
                "img":"method_fracturing",
                "required":{
                    "flags":["is_rare"]
                },
                "cannot":{
                    "influenced":true,
                    "fractured":true,
                    "eldritched":true
                }
            },
            "vaal":{
                "desc":"Corrupts an item, modifying it unpredictably",
                "name":"Vaal Orb",
                "plural":"Vaal Orbs",
                "img":"method_vaal",
                "cannot":{
                    "bgroup":"|10|13|14|"
                }
            }
        }
    },
    "fossil":{ // FOSSIL CRAFTING 
        "name":"Fossil",
        "plural":"Fossils",
        "subname":"Fossils",
        "desc":"Fossil crafting",
        "img":"fossil_6",
        "subset":"custom",
        "subsim":"fossils",
        "subsel":4,
        "required":{
            "flags":["is_fossil"]
        },
        "cannot":{
            "rarity":"magic",
            "meta":true
        }
    }, 
    "harvest":{ // HARVEST CRAFTING 
        "name":"Harvest crafting",
        "img":"aharvest",
        "cannot":{
            "bgroup":"|14|"
        },
        "subset":{
            "haugment":{
                "name":"Add/Remove",
                "img":"haugment",
                "toggled":"harvestTypeChooser",
                "desc":"Enchants an item with a new random property of a specific type",
                "subset":"custom",
                "subsim":"harvest_basic_noinf",
                "required":{
                    "open":"any"
                },
                "cannot":{
                    "rarity":"normal"
                }
            },
            "hreplace":{
                "name":"Replace",
                "img":"hreplace",
                "toggled":"harvestTypeChooser",
                "desc":"Replaces a random property of a specific type with another one of the same type<div class='mmi'>Ignores the cannot roll caster/attack metamods for 'influence'</div>",
                "subset":"custom",
                "nosim":true,
                "cannot":{
                    "rarity":"normal"
                }
            },
            "hnonto":{
                "name":"Non-type to type",
                "img":"hreplace",
                "toggled":"harvestTypeChooser",
                "desc":"Replaces a random property of another type with one of a specific type",
                "subset":"custom",
                "subsim":"harvest_basic",
                "required":{
                    "affixes":1
                },
                "cannot":{
                    "rarity":"normal"
                }
            },
            "hannul":{
                "name":"Annul",
                "img":"hannul",
                "toggled":"harvestTypeChooser",
                "desc":"Removes a random modifier of a specific type",
                "subset":"custom",
                "nosim":true,
                "required":{
                    "affixes":1
                },
                "cannot":{
                    "rarity":"normal"
                }
            },
            "hdivine":{
                "name":"Divine",
                "img":"hdivine",
                "toggled":"harvestTypeChooser",
                "desc":"Randomises the numeric values of the random properties of a specific type",
                "subset":"custom",
                "nosim":true,
                "required":{
                    "affixes":1
                },
                "cannot":{
                    "rarity":"normal"
                }
            },
            "hreroll":{
                "name":"Reforge",
                "img":"hreroll",
                "toggled":"harvestTypeChooser",
                "desc":"Reforge a Rare item with new random modifiers, including a modifier with the selected type<div class='mmi'>Ignores the cannot roll caster/attack metamods</div>",
                "subset":"custom",
                "subsim":"harvest_basic"
            },
            "hrerollp":{
                "name":"Reforge+",
                "img":"hrerollp",
                "toggled":"harvestTypeChooser",
                "desc":"Reforge a Rare item with new random modifiers, including a modifier with the selected type, modifiers of the selected type are more common<div class='mmi'>Ignores the cannot roll caster/attack metamods</div>",
                "subset":"custom",
                "nosim":true,
                "subsim":"harvest_basic"
            },
            "hresist":{
                "name":"Resists",
                "img":"aharvest",
                "toggled":"harvestResistsChooser",
                "desc":"Change a modifier that grants a certain Resistance into a similar-tier modifier that grants another Resistance",
                "subset":{
                    "hrftc":{
                        "name":"Fire > Cold",
                        "desc":"Change a modifier that grants a Fire Resistance into a similar-tier modifier that grants Cold Resistance"
                    },
                    "hrftl":{
                        "name":"Fire > Lightning",
                        "desc":"Change a modifier that grants a Fire Resistance into a similar-tier modifier that grants Lightning Resistance"
                    },
                    "hrctf":{
                        "name":"Cold > Fire",
                        "desc":"Change a modifier that grants a Cold Resistance into a similar-tier modifier that grants Fire Resistance"
                    },
                    "hrctl":{
                        "name":"Cold > Lightning",
                        "desc":"Change a modifier that grants a Cold Resistance into a similar-tier modifier that grants Lightning Resistance"
                    },
                    "hrltf":{
                        "name":"Lightning > Fire",
                        "desc":"Change a modifier that grants a Lightning Resistance into a similar-tier modifier that grants Fire Resistance"
                    },
                    "hrltc":{
                        "name":"Lightning > Cold",
                        "desc":"Change a modifier that grants a Lightning Resistance into a similar-tier modifier that grants Cold Resistance"
                    }
                },
                "cannot":{
                    "rarity":"normal"
                }
            },
            "hhight":{
                "name":"High-tier",
                "img":"aharvest",
                "toggled":"harvestHightierChooser",
                "desc":"",
                "subset":{
                    "htnmo":{
                        "name":"Normal to magic > one mod",
                        "desc":"Upgrade a Normal item to a Magic item, adding one random high-tier modifier",
                        "required":{
                            "rarity":"normal"
                        }
                    },
                    "htnmt":{
                        "name":"Normal to magic > two mod",
                        "desc":"Upgrade a Normal item to a Magic item, adding two random high-tier modifiers",
                        "required":{
                            "rarity":"normal"
                        }
                    },
                    "htmrt":{
                        "name":"Magic to rare > two mod",
                        "desc":"Upgrade a Magic item to a Rare item, adding two random high-tier modifiers",
                        "required":{
                            "rarity":"magic"
                        }
                    },
                    "htmrr":{
                        "name":"Magic to rare > three mod",
                        "desc":"Upgrade a Magic item to a Rare item, adding three random high-tier modifiers",
                        "required":{
                            "rarity":"magic"
                        }
                    },
                    "htmrf":{
                        "name":"Magic to rare > four mod",
                        "desc":"Upgrade a Magic item to a Rare item, adding four random high-tier modifiers",
                        "required":{
                            "rarity":"magic"
                        }
                    }
                }
            },
            "hother":{
                "name":"Other",
                "img":"aharvest",
                "toggled":"harvestOtherChooser",
                "desc":"",
                "subset":{
                    "hresf":{
                        "name":"Reforge keeping prefixes",
                        "nosim":true,
                        "desc":"Reforge a rare item keeping prefixes"
                    },
                    "hrepf":{
                        "name":"Reforge keeping suffixes",
                        "nosim":true,
                        "desc":"Reforge a rare item keeping suffixes"
                    },
                    "rfmlk":{
                        "name":"Reforge more likely",
                        "desc":"Reforge a rare item, being much more likely to receive the same modifier types<div class=\"mmi\">Ignores the cannot roll caster/attack metamods</div>"
                    },
                    "rfllk":{
                        "name":"Reforge less likely",
                        "desc":"Reforge a rare item, being much less likely to receive the same modifier types<div class=\"mmi\">Ignores the cannot roll caster/attack metamods</div>"
                    },
                    "hrrvpsi":{
                        "name":"Divine all lucky",
                        "nosim":true,
                        "desc":"Reroll the values of Prefix, Suffix and Implicit modifiers on a Rare item, with Lucky modifier values"
                    },
                    "hrrvp":{
                        "name":"Divine prefixes lucky",
                        "nosim":true,
                        "desc":"Reroll the values of Prefix modifiers on a Magic or Rare item, with Lucky modifier values"
                    },
                    "hrrvs":{
                        "name":"Divine suffixes lucky",
                        "nosim":true,
                        "desc":"Reroll the values of Suffix modifiers on a Magic or Rare item, with Lucky modifier values"
                    }
                }
            }
        }
    },
    "essence":{ // ESSENCE CRAFTING
        "name":"Essence",
        "plural":"Essences",
        "subname":"Essences",
        "desc":"Essences",
        "img":"essence_Horror",
        "subset":"custom",
        "subsim":"essences",
        "required":{
            "flags":["is_essence"]
        },
        "cannot":{
            "rarity":"magic",
            "meta":true
        }
    },
    "catalyst":{ // CATALYSTS
        "name":"Catalyst",
        "plural":"Catalysts",
        "subname":"Catalysts",
        "desc":"Catalysts",
        "img":"acatalyst",
        "subset":"custom",
        "subsim":"catalysts",
        "required":{
            "flags":["is_catalyst"]
        }
    },
    "beast_crafting":{ // BEAST CRAFTING
        "name":"Beast crafting",
        "img":"method_imprint",
        "desc":"Beast crafting",
        "subname":"Method",
        "cannot":{
            "rarity":"normal"
        },
        "subset":{ 
            "pretosuf":{
                "name":"Prefix > Suffix",
                "desc":"Remove a prefix, add a new suffix",
                "img":"bpretsuf",
                "isize":38,
                "cannot":{
                    "rarity":"magic"
                }
            },
            "suftopre":{
                "name":"Suffix > Prefix",
                "desc":"Remove a suffix, add a new prefix",
                "img":"bsuftpre",
                "isize":38,
                "cannot":{
                    "rarity":"magic"
                }
            },
            "imprint":{
                "name":"Imprint",
                "desc":"Create an imprint of a magic item",
                "img":"bimprint",
                "required":{
                    "rarity":"magic"
                },
                "cannot":{
                    "bgroup":"|14|",
                    "fractured":true
                }
            },
            "restimprint":{ 
                "name":"Restore imprint",
                "desc":"Restore a previously imprinted item",
                "img":"sim_imprint",
                "noemu":true,
                "cannot":{
                    "bgroup":"|14|"
                }
            },
            "breroll":{
                "name":"Reroll values",
                "desc":"Randomises the numeric values of implicit and explicit modifiers of a rare item",
                "img":"breroll",
                "required":{
                    "rarity":"rare"
                }
            },
            "bcat":{
                "name":"Cat",
                "desc":"Craft an Aspect of the Cat onto item",
                "img":"bcat",
                "required":{
                    "bgroup":poec_constants["constraints"]["beast_bgroups"],
                    "open":"suffix"
                },
                "cannot":{
                    "aspect":true
                }
            },
            "bavian":{
                "name":"Avian",
                "desc":"Craft an Aspect of the Avian onto item",
                "img":"bavian",
                "required":{
                    "bgroup":poec_constants["constraints"]["beast_bgroups"],
                    "open":"suffix"
                },
                "cannot":{
                    "aspect":true
                }
            },
            "bspider":{
                "name":"Spider",
                "desc":"Craft an Aspect of the Spider onto item",
                "img":"bspider",
                "required":{
                    "bgroup":poec_constants["constraints"]["beast_bgroups"],
                    "open":"suffix"
                },
                "cannot":{
                    "aspect":true
                }
            },
            "bcrab":{
                "name":"Crab",
                "desc":"Craft an Aspect of the Crab onto item",
                "img":"bcrab",
                "required":{
                    "bgroup":poec_constants["constraints"]["beast_bgroups"],
                    "open":"suffix"
                },
                "cannot":{
                    "aspect":true
                }
            }
        }
    },
    "eldritch":{ // ELDRITCH CRAFTING
        "name":"Eldritch crafting",
        "img":"EldritchChaosOrb",
        "desc":"Eldritch crafting",
        "subname":"Method",
        "required":{
            "bgroup":poec_constants["constraints"]["eldritch_bgroups"]
        },
        "cannot":{
            "influenced":true,
        },
        "subset":{
            "eldritchchaos":{
                "name":"Chaos",
                "desc":"If The Searing Exarch is dominant, reroll prefix modifiers. If The Eater of Worlds is dominant, reroll suffix modifiers.<div class='mmi'>Ignores the prefixes/suffixes cannot be changed metamods</div>",
                "img":"EldritchChaosOrb",
                "required":{
                    "eldritched":true,
                    "dominance":true
                },
                "cannot":{
                    "rarity":"normal"
                }
            },
            "eldritchexalt":{
                "name":"Exalted",
                "desc":"If The Searing Exarch is dominant, add a prefix modifier. If The Eater of Worlds is dominant, add a suffix modifier.",
                "img":"EldritchExaltedOrb",
                "required":{
                    "eldritched":true,
                    "dominance":true,
                    "open":"any"
                },
                "cannot":{
                    "rarity":"normal"
                }
            },
            "eldritchannul":{
                "name":"Annul",
                "desc":"If The Searing Exarch is dominant, remove a prefix modifier. If The Eater of Worlds is dominant, remove a suffix modifier.",
                "img":"EldritchOrbofAnnulment",
                "required":{
                    "eldritched":true,
                    "dominance":true
                },
                "cannot":{
                    "rarity":"normal"
                }
            },
            "eldritchconflict":{
                "name":"Orb of Conflict",
                "desc":"Unpredictably raise the strength of one Searing Exarch or Eater of Worlds modifier on an item and lower the strength of another. Lesser modifiers that have their strength lowered will be removed.",
                "img":"OrbofConflict",
                "required":{
                    "eldritched":true,
                    "dualeldritch":true
                }
            },
            "eldritchemberlesser":{
                "name":"Lesser Ember","desc":"Adds a Lesser Searing Exarch implicit modifier to a Body Armour, Boots, Gloves or Helmet. This replaces any existing implicit modifiers other than Eater of Worlds implicit modifiers.",
                "img":"LesserEldritchEmber"
            },
            "eldritchembergreater":{
                "name":"Greater Ember","desc":"Adds a Greater Searing Exarch implicit modifier to a Body Armour, Boots, Gloves or Helmet. This replaces any existing implicit modifiers other than Eater of Worlds implicit modifiers.",
                "img":"GreaterEldritchEmber"
            },
            "eldritchembergrand":{
                "name":"Grand Ember",
                "desc":"Adds a Grand Searing Exarch implicit modifier to a Body Armour, Boots, Gloves or Helmet. This replaces any existing implicit modifiers other than Eater of Worlds implicit modifiers.",
                "img":"GrandEldritchEmber"
            },
            "eldritchemberexceptional":{
                "name":"Exceptional Ember",
                "desc":"Adds a Exceptionnal Searing Exarch implicit modifier to a Body Armour, Boots, Gloves or Helmet. This replaces any existing implicit modifiers other than Eater of Worlds implicit modifiers.",
                "img":"ExceptionalEldritchEmber"
            },
            "eldritchichorlesser":{
                "name":"Lesser Ichor",
                "desc":"Adds a Lesser Eater of Worlds implicit modifier to a Body Armour, Boots, Gloves or Helmet. This replaces any existing implicit modifiers other than Searing Exarch implicit modifiers.",
                "img":"LesserEldritchIchor"
            },
            "eldritchichorgreater":{
                "name":"Greater Ichor","desc":"Adds a Greater Eater of Worlds implicit modifier to a Body Armour, Boots, Gloves or Helmet. This replaces any existing implicit modifiers other than Searing Exarch implicit modifiers.",
                "img":"GreaterEldritchIchor"
            },
            "eldritchichorgrand":{
                "name":"Grand Ichor","desc":"Adds a Grand Eater of Worlds implicit modifier to a Body Armour, Boots, Gloves or Helmet. This replaces any existing implicit modifiers other than Searing Exarch implicit modifiers.",
                "img":"GrandEldritchIchor"
            },
            "eldritchichorexceptional":{
                "name":"Exceptional Ichor",
                "desc":"Adds a Exceptionnal Eater of Worlds implicit modifier to a Body Armour, Boots, Gloves or Helmet. This replaces any existing implicit modifiers other than Searing Exarch implicit modifiers.",
                "img":"ExceptionalEldritchIchor"
            }
        }
    },
    "scourge":{
        "name":"Scourge crafting",
        "img":"tainted_exalt",
        "desc":"Scourge crafting",
        "nosim":true,
        "subname":"Method",
        "subset":{
            "scourgetogglecorrupt":{
                "name":"Corruption",
                "desc":"Force a swap from corrupted to uncorrupted or vice-versa",
                "img":"method_vaal"
            },
            "scourgettexalt":{
                "name":"Tainted Exalted Orb",
                "desc":"Unpredictably adds or removes a modifier on a corrupted rare item",
                "img":"tainted_exalt",
                "required":{
                    "rarity":"magic"
                }
            },
            "scourgettdivine":{
                "name":"Tainted Divine Teardrop",
                "desc":"Unpredictably raises or lowers the tier of each modifiers on a corrupted rare item",
                "img":"tainted_divine",
                "required":{
                    "rarity":"magic"
                }
            }
        }
    },
    "corruption_altar":{ // DOUBLE CORRUPT
        "name":"Locus of Corruption",
        "desc":"Potently corrupts an item, modifying it drastically and unpredictably",
        "img":"locus",
        "isize":66,
        "cannot":{
            "bgroup":"|10|11|13|14|"
        }
    }, 
    "syndicate":{ // SYNDICATE CRAFTING
        "name":"Syndicate",
        "img":"sim_syndicate",
        "desc":"Syndicate",
        "subname":"Method",
        "subset":{
            "aisling":{
                "name":"Aisling Veil",
                "desc":"Replace a random modifier on a rare item with a veiled modifier<div class='mmi'>Unveil ignores the cannot roll caster/attack metamods</div>",
                "img":"aisling",
                "required":{
                    "bgroup":poec_constants["constraints"]["veil_bgroups"]
                },
                "cannot":{
                    "veiled":true
                }
            },
            "leoslam":{
                "name":"Leo Slam",
                "desc":"Enchants a rare item with a new random property",
                "img":"leoslam",
                "noemu":true,
                "required":{
                    "rarity":"rare",
                    "flags":["is_rare"]
                }
            }
        }
    },
    "vendor":{ // VENDOR RECIPEES 
        "name":"Vendor recipees",
        "subname":"Vendor recipees",
        "desc":"Vendor recipees",
        "img":"vendor",
        "nosim":true,
        "subset":"custom"
    },
    "bench":{ // BENCH CRAFTING
        "name":"Bench crafting",
        "desc":"",
        "noemu":true,
        "img":"vendor",
        "subset":"custom",
        "subsim":"benchcraft",
        "subsel":1,
        "subsearch":true,
        "required":{
            "flags":["is_craftable"]
        },
        "options":[
            {"type":"radio","id":"bmd","name":"Mode","default":"normal","choices":[
                {"name":"Normal","desc":"Will throw an error if something prevents the benchcraft","value":"normal"},
                {"name":"Skip on error","desc":"On error, skip craft and continue","value":"skipf"}
            ]}
        ]
    },
    "check":{ // CONDITION CHECK
        "name":"Condition check",
        "desc":"",
        "img":"key",
        "noemu":true
    },
    "modunveil":{
        "name":"Unveil modifier",
        "desc":"",
        "img":"unveilicn",
        "required":{
            "bgroup":poec_constants["constraints"]["veil_bgroups"]
        },
        "options":[
            {"type":"check","id":"udnpm","name":"Do not pick a mod on fail","default":false}
        ],
        "noemu":true
    },
    "recombinate":{
        "name":"Recombinate",
        "desc":"",
        "img":"recombinate",
        "required":{
            "bgroup":poec_constants["constraints"]["recombinate_bgroups"]
        },
        "noemu":true
    },
    "metamethod":{
        "name":"Meta methods",
        "desc":"",
        "img":"method_meta",
        "noemu":true,
        "subset":"custom",
        "subsim":"metamethod"
    }
};