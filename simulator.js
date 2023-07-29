/*************************

 TODO LIST
 1. Pseudos left to do : individual elemental dps and flat (also resolve problem with things like solarine bow)
 2. More presets please
 3. More conditions : specific fractured (if harvest fracture craft is integrated)
 4. Printable instructions
 5. Click to use an item in item output as starting base
 6. Bloodstained fossil (or their mods rather, for blocking purpose)
 7. Possibly select tier from a dropdown
 8. Integrate beast influence slams
 9. Copy button for items for PoB

 Add a Mod to a Crusader Item	1x Farric Goliath / 1x Craicic Maw
 Add a Mod to a Hunter Item		1x Craicic Watcher / 1x Craicic Maw
 Add a Mod to a Redeemer Item	1x Fenumal Queen / 1x Craicic Maw
 Add a Mod to a Shaper Item		1x Fenumal Devourer / 1x Craicic Maw
 Add a Mod to a Warlord Item		1x Fenumal Scrabbler /1x Craicic Maw
 Add a Mod to an Elder Item		1x Saqawine Blood Viper / 1x Craicic Maw

 RECIPEES
 2. Main crafting recipees page
 3. Homepage emphasys on best recipees
 4. Tag an account as content creator/streamer so recipees are more visible without upvoting
 5. Expected crafts costs

 // UNRELATED : for the extlink general import, make it so it can pipe into emu/calc/sim/appraise

 USER REQUESTS
 2. vendor recipees
 3. have a way to have some legacy mods present

 - Thousand separators would be really nice.
 - why dont i include the costs calculations when you import back if results are included?
 - more visibility for condition check

 2. Naming steps. "Step 12" quickly becomes impossible to keep track of. "No caster mods before reforge" is much clearer to select. I'd suggest replacing "Step X" with just "Unnamed step X" and using names instead of indices throughout the system for gotos, which allows for...
 3.  ...re-ordering of steps, either by dragging (a bit fancy) or just a button to move it up/down.
 4. Full flexibility in the success/failure actions. E.g. continue in failure, or "go to step X", which currently is disabled if X is currently the next item (presumably due to continue disabling it).
 5. Allowing a maximum tier/value instead of only a minimum.
 6. Labelling pseudo/meta mods in some way for searchability. E.g. "open prefix" is very hard to find since tons of things are labelled prefix.
 8. We have post-operation checks on all non-deterministic crafts to decide where to go next. This is good, it prevents needless condition check bloat. I would suggest also adding an optional pre-condition check to all crafts to decide whether to apply the operation at all. The crafts I tried generally had a lot of unnecessarily hard to follow gotos due to condition checks for something as simple as "annul if prefixes full". Adding a simple condition to an operator shouldn't need to involve a conditional jump you have to keep track of.
 oh and in the calculator section you can choose your own prices for orbs, I don't seem to be able to do that here
 possibly bulk pricing
 11. store the number of steps used for each crafts for each successes to allow for more interesting results

 maybe be able to have condition groups be checked before or after the method is applied

 bypassing ilvl with beastcrafts please

 golden wreath is missing (reason is that there is no base to accomodate it, its a simple helmet armor that can roll int)

 being able to store a specific imprint and select that imprint later on (for multiple parallel imprints)

 When using eldritch currency, automate tier selected of filters to matching tier of currency

 Number of Attack/Non-attack/Caster/Non-caster : should have versions for prefix/suffix as well

 *************************/

var simulator_constants = {
    "default_stored_items": 99
};
var simulator_settings = null;
var simulator_data = null;
var simulator_flow = null;
var simulator_config = null;
var simulator_essences = null;
var simulator_states = {
    "init": {},
    "current": {},
    "states": []
};

var simulator_selinits = {
    "method": "Choose a method",
    "fossil": "Choose 1-4 fossil(s)"
}

var simulator_noautosuccess = ["modunveil", "check"];
var simulator_alwaysautopass = ["imprint", "restimprint", "bench", "scour"];

var simulator_presets = [
    {
        "name": "Alt, Aug, Regal", "desc": "", "data": "", "subs": [
            {
                "name": "2 prefix",
                "rarity": "magic",
                "data": '[{"method":["currency","alteration"],"autopass":false,"filters":[{"type":"and","treshold":1,"conds":[{"id":"","treshold":1,"init":"- Prefix 1 -"},{"id":"","treshold":1,"init":"- Prefix 2 -"}]}],"vfilter":[],"actions":{"win":"step","win_route":"6","fail":"step","fail_route":"2"}},{"method":["check"],"autopass":false,"filters":[{"type":"and","treshold":null,"conds":[{"id":"open_prefix","treshold":1}]}],"vfilter":[],"actions":{"win":"next","win_route":null,"fail":"restart","fail_route":null}},{"method":["currency","augmentation"],"autopass":false,"filters":[{"type":"and","treshold":1,"conds":[{"id":"","treshold":1,"init":"- Prefix 1 -"},{"id":"","treshold":1,"init":"- Prefix 2 -"}]}],"vfilter":[],"actions":{"win":"step","win_route":"6","fail":"step","fail_route":"1"}},{"method":["currency","scour"],"autopass":true,"filters":null,"vfilter":null,"actions":{"win":"next","win_route":null,"fail":"loop","fail_route":null}},{"method":["currency","transmute"],"autopass":true,"filters":null,"vfilter":null,"actions":{"win":"step","win_route":"1","fail":"loop","fail_route":null}},{"method":["currency","regal"],"autopass":false,"filters":[{"type":"and","treshold":null,"conds":[{"id":"","treshold":1,"init":"- Prefix 1 -"},{"id":"","treshold":1,"init":"- Prefix 2 -"}]}],"vfilter":[],"actions":{"win":"next","win_route":null,"fail":"step","fail_route":"4"}}]'
            },
            {
                "name": "2 suffix",
                "rarity": "magic",
                "data": '[{"method":["currency","alteration"],"autopass":false,"filters":[{"type":"and","treshold":1,"conds":[{"id":"","treshold":1,"init":"- Suffix 1 -"},{"id":"","treshold":1,"init":"- Suffix 2 -"}]}],"vfilter":[],"actions":{"win":"step","win_route":"6","fail":"step","fail_route":"2"}},{"method":["check"],"autopass":false,"filters":[{"type":"and","treshold":null,"conds":[{"id":"open_suffix","treshold":1}]}],"vfilter":[],"actions":{"win":"next","win_route":null,"fail":"restart","fail_route":null}},{"method":["currency","augmentation"],"autopass":false,"filters":[{"type":"and","treshold":1,"conds":[{"id":"","treshold":1,"init":"- Suffix 1 -"},{"id":"","treshold":1,"init":"- Suffix 2 -"}]}],"vfilter":[],"actions":{"win":"step","win_route":"6","fail":"step","fail_route":"1"}},{"method":["currency","scour"],"autopass":true,"filters":null,"vfilter":null,"actions":{"win":"next","win_route":null,"fail":"loop","fail_route":null}},{"method":["currency","transmute"],"autopass":true,"filters":null,"vfilter":null,"actions":{"win":"step","win_route":"1","fail":"loop","fail_route":null}},{"method":["currency","regal"],"autopass":false,"filters":[{"type":"and","treshold":null,"conds":[{"id":"","treshold":1,"init":"- Suffix 1 -"},{"id":"","treshold":1,"init":"- Suffix 2 -"}]}],"vfilter":[],"actions":{"win":"next","win_route":null,"fail":"step","fail_route":"4"}}]'
            },
            {
                "name": "2 prefix, 1 suffix",
                "rarity": "magic",
                "data": '[{"method":["currency","alteration"],"autopass":false,"filters":[{"type":"and","treshold":2,"conds":[{"id":"","treshold":1,"init":"- Prefix 1 -"},{"id":"","treshold":1,"init":"- Prefix 2 -"},{"id":"","treshold":1,"init":"- Suffix 1 -"}]}],"vfilter":[],"actions":{"win":"step","win_route":"7","fail":"step","fail_route":"2"}},{"method":["check"],"autopass":false,"filters":[{"type":"and","treshold":1,"conds":[{"id":"","treshold":1,"init":"- Prefix 1 -"},{"id":"","treshold":1,"init":"- Prefix 2 -"},{"id":"","treshold":1,"init":"- Suffix 1 -"}]}],"vfilter":[],"actions":{"win":"next","win_route":null,"fail":"restart","fail_route":null}},{"method":["check"],"autopass":false,"filters":[{"type":"and","treshold":1,"conds":[{"id":"open_prefix","treshold":1},{"id":"open_suffix","treshold":1}]}],"vfilter":[],"actions":{"win":"next","win_route":null,"fail":"restart","fail_route":null}},{"method":["currency","augmentation"],"autopass":false,"filters":[{"type":"and","treshold":2,"conds":[{"id":"","treshold":1,"init":"- Prefix 1 -"},{"id":"","treshold":1,"init":"- Prefix 2 -"},{"id":"","treshold":1,"init":"- Suffix 1 -"}]}],"vfilter":[],"actions":{"win":"step","win_route":"7","fail":"step","fail_route":"1"}},{"method":["currency","scour"],"autopass":true,"filters":null,"vfilter":null,"actions":{"win":"next","win_route":null,"fail":"loop","fail_route":null}},{"method":["currency","transmute"],"autopass":true,"filters":null,"vfilter":null,"actions":{"win":"step","win_route":"1","fail":"loop","fail_route":null}},{"method":["currency","regal"],"autopass":false,"filters":[{"type":"and","treshold":null,"conds":[{"id":"","treshold":1,"init":"- Prefix 1 -"},{"id":"","treshold":1,"init":"- Prefix 2 -"},{"id":"","treshold":1,"init":"- Suffix 1 -"}]}],"vfilter":[],"actions":{"win":"next","win_route":null,"fail":"step","fail_route":"5"}}]'
            },
            {
                "name": "2 suffix, 1 prefix",
                "rarity": "magic",
                "data": '[{"method":["currency","alteration"],"autopass":false,"filters":[{"type":"and","treshold":2,"conds":[{"id":"","treshold":1,"init":"- Suffix 1 -"},{"id":"","treshold":1,"init":"- Prefix 2 -"},{"id":"","treshold":1,"init":"- Prefix 1 -"}]}],"vfilter":[],"actions":{"win":"step","win_route":"7","fail":"step","fail_route":"2"}},{"method":["check"],"autopass":false,"filters":[{"type":"and","treshold":1,"conds":[{"id":"","treshold":1,"init":"- Suffix 1 -"},{"id":"","treshold":1,"init":"- Suffix 2 -"},{"id":"","treshold":1,"init":"- Prefix 1 -"}]}],"vfilter":[],"actions":{"win":"next","win_route":null,"fail":"restart","fail_route":null}},{"method":["check"],"autopass":false,"filters":[{"type":"and","treshold":1,"conds":[{"id":"open_prefix","treshold":1},{"id":"open_suffix","treshold":1}]}],"vfilter":[],"actions":{"win":"next","win_route":null,"fail":"restart","fail_route":null}},{"method":["currency","augmentation"],"autopass":false,"filters":[{"type":"and","treshold":2,"conds":[{"id":"","treshold":1,"init":"- Suffix 1 -"},{"id":"","treshold":1,"init":"- Suffix 2 -"},{"id":"","treshold":1,"init":"- Prefix 1 -"}]}],"vfilter":[],"actions":{"win":"step","win_route":"7","fail":"step","fail_route":"1"}},{"method":["currency","scour"],"autopass":true,"filters":null,"vfilter":null,"actions":{"win":"next","win_route":null,"fail":"loop","fail_route":null}},{"method":["currency","transmute"],"autopass":true,"filters":null,"vfilter":null,"actions":{"win":"step","win_route":"1","fail":"loop","fail_route":null}},{"method":["currency","regal"],"autopass":false,"filters":[{"type":"and","treshold":null,"conds":[{"id":"","treshold":1,"init":"- Suffix 1 -"},{"id":"","treshold":1,"init":"- Suffix 2 -"},{"id":"","treshold":1,"init":"- Prefix 1 -"}]}],"vfilter":[],"actions":{"win":"next","win_route":null,"fail":"step","fail_route":"5"}}]'
            }
        ]
    },
    {
        "name": "Alt, Aug, Imprint, Regal", "desc": "", "data": "", "subs": [
            {
                "name": "Required prefix",
                "rarity": "magic",
                "data": '[{"method":["currency","alteration"],"autopass":false,"filters":[{"type":"and","treshold":null,"conds":[{"id":"","treshold":1,"init":"- Required Prefix -"}]}],"vfilter":[],"actions":{"win":"step","win_route":"4","fail":"step","fail_route":"2"}},{"method":["check"],"autopass":false,"filters":[{"type":"and","treshold":null,"conds":[{"id":"open_prefix","treshold":1}]}],"vfilter":[],"actions":{"win":"next","win_route":null,"fail":"step","fail_route":"1"}},{"method":["currency","augmentation"],"autopass":false,"filters":[{"type":"and","treshold":null,"conds":[{"id":"","treshold":1,"init":"- Required Prefix -"}]}],"vfilter":[],"actions":{"win":"next","win_route":null,"fail":"step","fail_route":"1"}},{"method":["beast_crafting","imprint"],"autopass":true,"filters":null,"vfilter":null,"actions":{"win":"step","win_route":"6","fail":"loop","fail_route":null}},{"method":["beast_crafting","restimprint"],"autopass":true,"filters":null,"vfilter":null,"actions":{"win":"step","win_route":"4","fail":"loop","fail_route":null}},{"method":["currency","regal"],"autopass":false,"filters":[{"type":"and","treshold":null,"conds":[{"id":"","treshold":1,"init":"- Second Affix -"}]}],"vfilter":[],"actions":{"win":"next","win_route":null,"fail":"step","fail_route":"5"}}]'
            },
            {
                "name": "Required suffix",
                "rarity": "magic",
                "data": '[{"method":["currency","alteration"],"autopass":false,"filters":[{"type":"and","treshold":null,"conds":[{"id":"","treshold":1,"init":"- Required Suffix -"}]}],"vfilter":[],"actions":{"win":"step","win_route":"4","fail":"step","fail_route":"2"}},{"method":["check"],"autopass":false,"filters":[{"type":"and","treshold":null,"conds":[{"id":"open_suffix","treshold":1}]}],"vfilter":[],"actions":{"win":"next","win_route":null,"fail":"step","fail_route":"1"}},{"method":["currency","augmentation"],"autopass":false,"filters":[{"type":"and","treshold":null,"conds":[{"id":"","treshold":1,"init":"- Required Suffix -"}]}],"vfilter":[],"actions":{"win":"next","win_route":null,"fail":"step","fail_route":"1"}},{"method":["beast_crafting","imprint"],"autopass":true,"filters":null,"vfilter":null,"actions":{"win":"step","win_route":"6","fail":"loop","fail_route":null}},{"method":["beast_crafting","restimprint"],"autopass":true,"filters":null,"vfilter":null,"actions":{"win":"step","win_route":"4","fail":"loop","fail_route":null}},{"method":["currency","regal"],"autopass":false,"filters":[{"type":"and","treshold":null,"conds":[{"id":"","treshold":1,"init":"- Second Affix -"}]}],"vfilter":[],"actions":{"win":"next","win_route":null,"fail":"step","fail_route":"5"}}]'
            }
        ]
    },
    {
        "name": "Woke Prefixes, Reforge",
        "desc": "Awaken 2 Prefixes together then harvest reforge for 3rd",
        "data": '[{"method":["currency","woke"],"autopass":false,"filters":[{"type":"and","treshold":null,"conds":[{"id":"","treshold":1,"init":"- 3rd target prefix -"}]}],"vfilter":[],"actions":{"win":"end","win_route":null,"fail":"step","fail_route":"2"}},{"method":["check"],"autopass":false,"filters":[{"type":"and","treshold":null,"conds":[{"id":"open_prefix","treshold":1},{"id":"open_suffix","treshold":1}]}],"vfilter":[],"actions":{"win":"step","win_route":"4","fail":"step","fail_route":"3"}},{"method":["currency","annul"],"autopass":false,"filters":[{"type":"and","treshold":null,"conds":[{"id":"","treshold":1,"init":"- Awakened prefix 1 -"},{"id":"","treshold":1,"init":"- Awakened prefix 2 -"}]}],"vfilter":[],"actions":{"win":"step","win_route":"2","fail":"restart","fail_route":null}},{"method":["bench","|2962t0|"],"autopass":true,"filters":null,"vfilter":null,"actions":{"win":"next","win_route":null,"fail":"restart","fail_route":null}},{"method":["harvest","hreroll"],"autopass":true,"filters":null,"vfilter":null,"actions":{"win":"next","win_route":null,"fail":"loop","fail_route":null}}]'
    },
    {
        "name": "Woke Suffixes, Reforge",
        "desc": "Awaken 2 Suffixes together then harvest reforge for 3rd",
        "data": '[{"method":["currency","woke"],"autopass":false,"filters":[{"type":"and","treshold":null,"conds":[{"id":"","treshold":1,"init":"- 3rd target suffix -"}]}],"vfilter":[],"actions":{"win":"end","win_route":null,"fail":"step","fail_route":"2"}},{"method":["check"],"autopass":false,"filters":[{"type":"and","treshold":null,"conds":[{"id":"open_prefix","treshold":1},{"id":"open_suffix","treshold":1}]}],"vfilter":[],"actions":{"win":"step","win_route":"4","fail":"step","fail_route":"3"}},{"method":["currency","annul"],"autopass":false,"filters":[{"type":"and","treshold":null,"conds":[{"id":"","treshold":1,"init":"- Awakened suffix 1 -"},{"id":"","treshold":1,"init":"- Awakened suffix 2 -"}]}],"vfilter":[],"actions":{"win":"step","win_route":"2","fail":"restart","fail_route":null}},{"method":["bench","|2963t0|"],"autopass":true,"filters":null,"vfilter":null,"actions":{"win":"next","win_route":null,"fail":"restart","fail_route":null}},{"method":["harvest","hreroll"],"autopass":true,"filters":null,"vfilter":null,"actions":{"win":"next","win_route":null,"fail":"loop","fail_route":null}}]'
    }
];

var simulator_metam = [
    {
        "name": "Wipe prefixes", "autopass": true, "seq": [
            {
                "method": ["check"],
                "autopass": false,
                "actions": {"win": "next", "win_route": null, "fail": "step", "fail_route": 4},
                "filters": [
                    {"type": "or", "treshold": null, "conds": [{"id": "open_prefix", "treshold": 1, "max": null}]}
                ]
            },
            {
                "method": ["bench", "|2963t0|"],
                "autopass": true,
                "actions": {"win": "next", "win_route": null, "fail": null, "fail_route": null},
                "filters": []
            },
            {
                "method": ["currency", "scour"],
                "autopass": true,
                "actions": {"win": "end", "win_route": null, "fail": null, "fail_route": null},
                "filters": []
            },
            {
                "method": ["harvest", "hother", "hrepf"],
                "autopass": false,
                "actions": {"win": "step", "win_route": 2, "fail": "loop", "fail_route": null},
                "filters": [
                    {"type": "or", "treshold": null, "conds": [{"id": "open_prefix", "treshold": 1, "max": null}]}
                ]
            }
        ]
    },
    {
        "name": "Wipe suffixes", "autopass": true, "seq": [
            {
                "method": ["check"],
                "autopass": false,
                "actions": {"win": "next", "win_route": null, "fail": "step", "fail_route": 4},
                "filters": [
                    {"type": "or", "treshold": null, "conds": [{"id": "open_suffix", "treshold": 1, "max": null}]}
                ]
            },
            {
                "method": ["bench", "|2962t0|"],
                "autopass": true,
                "actions": {"win": "next", "win_route": null, "fail": null, "fail_route": null},
                "filters": []
            },
            {
                "method": ["currency", "scour"],
                "autopass": true,
                "actions": {"win": "end", "win_route": null, "fail": null, "fail_route": null},
                "filters": []
            },
            {
                "method": ["harvest", "hother", "hresf"],
                "autopass": false,
                "actions": {"win": "step", "win_route": 2, "fail": "loop", "fail_route": null},
                "filters": [
                    {"type": "or", "treshold": null, "conds": [{"id": "open_suffix", "treshold": 1, "max": null}]}
                ]
            }
        ]
    },
    {
        "name": "Annul save prefix", "autopass": false, "seq": [
            {
                "method": ["bench", "|2963t0|"],
                "autopass": true,
                "actions": {"win": "next", "win_route": null, "fail": null, "fail_route": null},
                "filters": []
            },
            {
                "method": ["currency", "annul"],
                "autopass": false,
                "actions": {"win": "next", "win_route": null, "fail": "restart", "fail_route": null},
                "filters": [
                    {"type": "or", "treshold": null, "conds": [{"id": "[COND:1]", "treshold": null, "max": null}]}
                ]
            },
            {
                "method": ["check"],
                "autopass": false,
                "actions": {"win": "end", "win_route": null, "fail": "step", "fail_route": 1},
                "filters": [
                    {"type": "or", "treshold": null, "conds": [{"id": 2963, "treshold": 1}]}
                ]
            }
        ]
    },
    {
        "name": "Annul save suffix", "autopass": false, "seq": [
            {
                "method": ["bench", "|2962t0|"],
                "autopass": true,
                "actions": {"win": "next", "win_route": null, "fail": null, "fail_route": null},
                "filters": []
            },
            {
                "method": ["currency", "annul"],
                "autopass": false,
                "actions": {"win": "next", "win_route": null, "fail": "restart", "fail_route": null},
                "filters": [
                    {"type": "or", "treshold": null, "conds": [{"id": "[COND:1]", "treshold": null, "max": null}]}
                ]
            },
            {
                "method": ["check"],
                "autopass": false,
                "actions": {"win": "end", "win_route": null, "fail": "step", "fail_route": 1},
                "filters": [
                    {"type": "or", "treshold": null, "conds": [{"id": 2962, "treshold": 1, "max": null}]}
                ]
            }
        ]
    }
];

function poec_initSimulator(timeout) {
    if ($("#poecSimulator").length == 0) {
        vHTML = "<div id='poecSimulator'><div id='poecAffOptions' class='justload'>";
        vHTML += "<div id='poecAppLoading' class='poec_loading_msg'>" + applyLang("Loading Simulator data...") + "</div>";
        vHTML += "</div></div>";

        $("#poecSimulatorZone").html(vHTML);

        if (timeout) {
            setTimeout(function () {
                poec_simInitLoad();
            }, 1);
        } else {
            poec_simInitLoad();
        }

        $(window).scroll(function () {
            poec_simScroll();
        });
        $(window).resize(function () {
            poec_simResize();
        });
    }
}

var poecsim_selectors = {};
var poecsim_cselectors = {};

function poec_simInitLoad() {
    // Build initial setup interface
    vHTML = "";
    vHTML += "<div class='wrapper'><div class='title'><img src='images/manual/krangle2.png'/><div class='mcui-button dark' onClick='poec_nsimGoToStep(6)' id='nsimRestoreBtn'>" + applyLang("Restore saved item") + "</div><div class='mcui-button yellow' onClick='poec_nsimRestart(null,true)' id='nsimRestartBtn'>" + applyLang("Restart") + "</div><div class='mcui-button yellow' id='nsimBackStepBtn' onClick='poec_nsimBackOneStep()'>&#10149;</div></div><div class='content'><div class='wrapper'>";

    vHTML += "<div id='nsimSourceInt'>";
    vHTML += "<div class='stepload step' step='loading'>";
    vHTML += '<div id="poecModDistBigLoader" style="padding:30px 0px"><div class="loadtitle">' + applyLang("Unvaaling and Unkrangling...") + '</div><img src="../../images/ajax-loader-dark.gif"></div>';
    vHTML += "</div>";
    vHTML += "<div class='step1 step' step='1'>"; // Settings or item chooser
    vHTML += "<div class='stitle'>" + applyLang("Choose item creation mode") + "</div>";
    vHTML += "<div class='content'><div>";
    vHTML += "<div id='nsimStep1ESBtn'>";
    vHTML += "<div class='mcui-button dark big' onClick='poec_nsimUseCurrentSettings(\"emu\")'>" + applyLang("Use emulator settings") + "</div>";
    vHTML += "<div class='or'>" + applyLang("or") + "</div>";
    vHTML += "</div>";
    vHTML += "<div id='nsimStep1CSBtn'>";
    vHTML += "<div class='mcui-button dark big' onClick='poec_nsimUseCurrentSettings(\"calc\")'>" + applyLang("Use calculator settings") + "</div>";
    vHTML += "<div class='or'>" + applyLang("or") + "</div>";
    vHTML += "</div>";
    vHTML += "<div class='mcui-button dark big' onClick='poec_nsimGoToStep(2)'>" + applyLang("Create new item") + "</div>";
    vHTML += "<div class='or'>" + applyLang("or") + "</div>";
    vHTML += "<div class='mcui-button dark big' onClick='poec_importItem(\"nsim\")'>" + applyLang("Import item") + "</div>";
    vHTML += "</div></div>";
    vHTML += "</div>";
    vHTML += "<div class='step2 step scroll' id='nsimStepBGroupChoice' step='2'>"; // Base group choice
    vHTML += "<div class='stitle'>" + applyLang("Choose a base group") + "</div>";
    vHTML += "<div class='content'><div>";
    for (var i = 0; i < poecd['bgroups']['seq'].length; i++) {
        vHTML += "<div class='mcui-button dark' onClick='poec_nsimPickBaseGroup(" + poecd['bgroups']['seq'][i]["id_bgroup"] + ")'>" + poecl["bgroup"][poecd['bgroups']['seq'][i]["id_bgroup"]] + "</div>";
    }
    vHTML += "</div></div>";
    vHTML += "</div>";
    vHTML += "<div class='step3 step scroll' id='nsimStepBaseChoice' step='3'>"; // Base choice
    vHTML += "<div class='stitle'>" + applyLang("Choose a base") + "<div id='nsimFLBase' class='simfl'></div></div>";
    vHTML += "<div class='content'><div>";
    for (var i = 0; i < arrMasters.length; i++) {
        vHTML += "<div class='mcui-button dark master bgroup" + arrMasters[i]["id_bgroup"] + "' onClick='poec_nsimPickBase(" + arrMasters[i]["id_base"] + ")'>" + poecl["base"][arrMasters[i]["id_base"]] + "</div>";
    }
    for (var i = 0; i < arrChilds.length; i++) {
        vHTML += "<div class='mcui-button dark child mbase" + arrChilds[i]["master_base"] + "' onClick='poec_nsimPickBChild(" + arrChilds[i]["id_base"] + ")'>" + poecl["base"][arrChilds[i]["id_base"]] + "</div>";
    }
    vHTML += "</div></div>";
    vHTML += "</div>";
    vHTML += "<div class='step4 step' id='nsimStepItemChoice' step='4'>"; // Item choice
    vHTML += "<div class='stitle'>" + applyLang("Choose an item") + "<div id='nsimFLItem' class='simfl'></div></div>";
    vHTML += "<div class='content'><div>";

    for (var i = 0; i < poecd['bitems']['seq'].length; i++) {
        var iinfo = poec_outputItemDetails(poecd["bitems"]["seq"][i], 0.2, true);
        vHTML += "<div class='item base" + poecd['bitems']['seq'][i]["id_base"] + "' iid='" + poecd['bitems']['seq'][i]["id_bitem"] + "' onClick='poec_nsimPickItem(" + poecd['bitems']['seq'][i]["id_bitem"] + ")'><div class='div_stable poec_item med_shadow'><div><div class='img'><img src='" + poec_getBItemIMG(poecd['bitems']['seq'][i]["imgurl"], poecd['bitems']['seq'][i]["id_bitem"]) + "'/></div><div class='info affixes'><div class='name'>" + poecl["bitem"][poecd['bitems']['seq'][i]["id_bitem"]] + "</div><div class='sep'></div>" + iinfo + "</div></div></div></div>";

    }
    vHTML += "</div></div>";
    vHTML += "</div>";
    vHTML += "<div class='step5 step' id='nsimStepOptionsChoice' step='5'>"; // Options : Influences / ILVL / Fracture affix
    vHTML += "<div class='stitle'>" + applyLang("Choose options") + "<div id='nsimFLOptions' class='simfl'></div></div>";
    vHTML += "<div class='content'><div>";
    // Influences
    vHTML += "<div id='nsimOptionsInfluences' class='simopt noselect'>";
    vHTML += "<div class='label'>" + applyLang("Choose zero to two influence(s)") + "</div>";
    for (var i = 0; i < poecd['mgroups']['seq'].length; i++) {
        if (poecd['mgroups']['seq'][i]['is_influence'] == 1) {
            vHTML += "<div class='inf big abtn iconed bid" + poecd['mgroups']['seq'][i]["id_mgroup"] + "' bid='" + poecd['mgroups']['seq'][i]["id_mgroup"] + "' onClick='poec_nsimSelectInf(this)'><div class='icon'><img src='images/manual/influence_" + poecd['mgroups']['seq'][i]["id_mgroup"] + ".png'></div>" + poecl["mgroup"][poecd['mgroups']['seq'][i]["id_mgroup"]] + "</div>";
        }
    }
    vHTML += "</div>";

    // ILVL
    vHTML += "<div id='nsimOptionsILvl' class='simopt'>";
    vHTML += "<div class='label'>" + applyLang("Select item level") + "</div>";
    for (var i = 1; i <= 100; i++) {
        vHTML += "<div class='ilvl abtn ilvl" + i + "' bid='" + i + "' onClick='poec_nsimSelectILvl(this)'>" + i + "</div>";
    }
    vHTML += "</div>";

    // Quality
    vHTML += "<div id='nsimOptionsQuality' class='simopt'>";
    vHTML += "<div class='label'>" + applyLang("Set item quality") + "</div>";
    for (var i = 0; i <= 30; i++) {
        vHTML += "<div class='qual abtn qual" + i + "' bid='" + i + "' onClick='poec_nsimSelectQuality(this)'>" + i + "</div>";
    }
    vHTML += "</div>";

    vHTML += "<div></div><div class='mcui-button green big' onClick='poec_nsimFinishSetup()'>" + applyLang("Proceed") + "</div>";

    vHTML += "</div></div>";
    vHTML += "</div>";
    vHTML += "<div class='step6 step' id='nsimStepImportChoice' step='6'>"; // Import
    vHTML += "<div class='stitle'>" + applyLang("Input import settings") + "</div>";
    vHTML += "<div class='content'><div>";
    vHTML += "<div class='gen_msg' id='nsimImportInstructions'>" + applyLang("Paste a gist or pastebin link into the below text input to proceed") + ".</div>";
    vHTML += "<div><input type='text' id='nsimImportInput' class='simieinput' onKeyUp='poec_nsimImportCheck()'></div>";
    vHTML += "<div class='simietitle'><div class='title'>" + applyLang("OR") + "</div></div>";
    vHTML += "<div class='gen_msg' id='nsimImportInstructions'>" + applyLang("Paste dataset into the below text area to proceed") + ".</div>";
    vHTML += "<div><textarea id='nsimImportArea' class='simietextarea' onKeyUp='poec_nsimImportCheck()'></textarea></div>";
    vHTML += "<div id='nsimImportBtn' class='mcui-button green' onClick='poec_nsimImportGo(null,true)'>" + applyLang("Import") + "</div>";
    vHTML += "</div></div>";
    vHTML += "</div>";
    vHTML += "</div>";

    vHTML += "</div></div></div>";

    vHTML += "<div id='nsimMainInterface'>";

    vHTML += "</div>";

    $("#poecSimulator").html(vHTML);

    poec_nsimGoToStart();
}

function poec_nsimGoToStart() {
    $("#nsimMainInterface").hide();
    $("#nsimRestartBtn").hide();
    $("#nsimBackStepBtn").removeClass("hidden");
    poec_nsimGoToStep(1);
    $("#nsimSourceInt").show();
}

function poec_nsimRestart(delta, init) {
    if (init) {
        $("#nsimRestartBtn").mcuiNotice({
            text: applyLang("You will lose current project<br/>are you sure you wish to proceed?"),
            type: "confirm",
            complete: function (delta) {
                poec_nsimRestart(delta, false);
            }
        }).showNotice();
    } else {
        if (delta == true) {
            simulator_settings = null;
            simulator_data = null;
            simulator_flow = null;
            nsim_tmpsets = null;
            nsim_tmpconfig = null;
            nsim_savesettings = null;
            nsim_initsaveparams = null;
            nsim_cursampleitem = null;
            nsim_curcraftid = null;
            $(".nsim_flowdet").remove();
            $("#poecSimDebugItem").remove();
            $("#nsimMainInterface").html("");
            poec_nsimGoToStart();
        }
    }
}

function poec_nsimGoToStep(step) {
    $("#nsimSourceInt").find(".step").hide();
    $("#nsimRestoreBtn").hide();
    switch (step) {
        case 1 :
            $("#nsimStep1CSBtn").hide();
            $("#nsimStep1ESBtn").hide();
            if (poec_cBase) {
                $("#nsimStep1CSBtn").show();
            }
            if (crsim_settings != undefined) {
                if (crsim_settings["base"] != undefined) {
                    $("#nsimStep1ESBtn").css({"display": "inline-block"});
                }
            }
            $("#nsimRestoreBtn").show();
            if (poec_useractive) {
                // Load user recipees
                if ($("#nsimMyRecipees").length == 0) {
                    $("<div>").attr("id", "nsimMyRecipees").html('<div class="stitle">' + applyLang("Use one of my saved recipees") + '</div><div id="nsimMyRecipeesList" class="content"></div>').appendTo($("#nsimSourceInt").find(".step.step1"));
                }
                poec_nsimLoadUserRecipees($("#nsimMyRecipeesList"));
            } else {
                $("#nsimMyRecipees").remove();
            }
            break;
        case 3 :
            // Show only bases under base group
            $("#nsimStepBaseChoice").find(".master").hide();
            $("#nsimStepBaseChoice").find(".child").hide();
            $("#nsimStepBaseChoice").find(".master.bgroup" + simulator_settings["bgroup"]).show();
            $("#nsimFLBase").html("<div>" + poecl["bgroup"][simulator_settings["bgroup"]] + "</div>");
            break;
        case 4 :
            // Show only items under base
            $("#nsimStepItemChoice").find(".item").hide();
            if ($("#nsimStepItemChoice").find(".item.base" + simulator_settings["base"]).length > 0) {
                if ($("#nsimStepItemChoice").find(".item.base" + simulator_settings["base"]).length == 1) {
                    var ifound = $("#nsimStepItemChoice").find(".item.base" + simulator_settings["base"]);
                    simulator_settings["bitem"] = parseInt($(ifound[0]).attr("iid"));
                    step = 5;
                    poec_nsimGoToStep(step);
                } else {
                    $("#nsimStepItemChoice").find(".item.base" + simulator_settings["base"]).show();
                    $("#nsimFLItem").html("<div>" + poecl["bgroup"][simulator_settings["bgroup"]] + "</div><div class='sep'>➤</div><div>" + poecl["base"][simulator_settings["base"]] + "</div>");
                }
            } else {
                // Go to options
                step = 5;
                poec_nsimGoToStep(step);
            }
            break;
        case 5 :
            var additem = "";
            if (simulator_settings["bitem"]) {
                additem += "<div class='sep'>➤</div><div>" + poecl["bitem"][simulator_settings["bitem"]] + "</div>";
            }
            $("#nsimFLOptions").html("<div>" + poecl["bgroup"][simulator_settings["bgroup"]] + "</div><div class='sep'>➤</div><div>" + poecl["base"][simulator_settings["base"]] + "</div>" + additem);
            if (simulator_settings["ilvl"] == null) {
                simulator_settings["ilvl"] = 100;
            }
            poec_nsimSelectILvl($("#nsimOptionsILvl").find(".ilvl" + simulator_settings["ilvl"]));
            if (parseInt(simulator_settings["ilvl"]) < 68) {
                $("#nsimOptionsInfluences").find(".sel").removeClass("sel");
                $("#nsimOptionsInfluences").addClass("disabled");
                simulator_settings["influences"] = null;
            }
            if (simulator_settings["quality"] == undefined) {
                simulator_settings["quality"] = 20;
            }
            poec_nsimSelectQuality($("#nsimOptionsQuality").find(".qual" + simulator_settings["quality"]));
            if (crsim_qualbgroups.indexOf("|" + simulator_settings["bgroup"] + "|") > -1) {
                if (crsim_qualnbases.indexOf("|" + simulator_settings["base"] + "|") > -1) {
                    $("#nsimOptionsQuality").hide();
                } else {
                    $("#nsimOptionsQuality").show();
                }
            } else {
                $("#nsimOptionsQuality").hide();
            }
            $("#nsimOptionsInfluences").find(".sel").removeClass("sel");
            var is_influence = parseInt(poecd["bgroups"]["seq"][poecd["bgroups"]["ind"][simulator_settings["bgroup"]]]["is_influenced"]);
            if (is_influence == 1) {
                if (simulator_settings["bitem"] == 8201) {
                    $("#nsimOptionsInfluences").hide();
                } else {
                    $("#nsimOptionsInfluences").show();
                }
            } else {
                $("#nsimOptionsInfluences").hide();
            }
            break;
        case 6 :
            $("#nsimImportArea").val("");
            $("#nsimImportInput").val("");
            $("#nsimImportBtn").hide();
            break;
    }
    $("#nsimSourceInt").find(".step" + step).show();
    if (step > 1) {
        if (step == 2) {
            if (poec_cBase) {
                $("#nsimBackStepBtn").show();
            } else {
                $("#nsimBackStepBtn").hide();
            }
        } else {
            $("#nsimBackStepBtn").show();
        }
    } else {
        $("#nsimBackStepBtn").hide();
    }
}

function poec_nsimBackOneStep() {
    var cstep = parseInt($("#nsimSourceInt").find(".step:visible").attr("step"));
    if (cstep == 6) {
        cstep = 1;
    } else {
        if (cstep == 5) {
            // Check if we go back to 4 or 3
            if ($("#nsimStepItemChoice").find(".item.base" + simulator_settings["base"]).length > 1) {
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
    if (cstep < 5 && simulator_settings) {
        simulator_settings["influences"] = null;
        simulator_settings["ilvl"] = null;
        simulator_settings["bitem"] = null;
        if (cstep < 4) {
            simulator_settings["base"] = null;
            if (cstep < 3) {
                simulator_settings["bgroup"] = null;
            }
        }
    }
    poec_nsimGoToStep(cstep);
}

function poec_nsimPickBaseGroup(vGroup) {
    simulator_settings = {
        "bgroup": vGroup,
        "base": null,
        "bitem": null,
        "ilvl": null,
        "rarity": "normal",
        "influences": null
    };
    poec_nsimGoToStep(3);
}

function poec_nsimPickBase(vBase) {
    simulator_settings["base"] = vBase;
    // Check for child choice
    if ($("#nsimStepBaseChoice").find(".mbase" + vBase).length > 0) {
        $("#nsimStepBaseChoice").find(".master").hide();
        $("#nsimStepBaseChoice").find(".child").hide();
        $("#nsimStepBaseChoice").find(".child.mbase" + vBase).show();
    } else {
        poec_nsimGoToStep(4);
    }
}

function poec_nsimPickBChild(vChild) {
    simulator_settings["base"] = vChild;
    poec_nsimGoToStep(4);
}

function poec_nsimPickItem(vItem) {
    simulator_settings["bitem"] = vItem;
    poec_nsimGoToStep(5);
}

function poec_nsimSelectInf(vThis) {
    if (!$("#nsimOptionsInfluences").hasClass("disabled")) {
        var ival = parseInt($(vThis).attr("bid"));
        if ($(vThis).hasClass("sel")) {
            $(vThis).removeClass("sel");
            if (simulator_settings["influences"].length == 1) {
                simulator_settings["influences"] = null;
            } else {
                for (var i = 0; i < simulator_settings["influences"].length; i++) {
                    if (simulator_settings["influences"][i] != ival) {
                        simulator_settings["influences"] = [simulator_settings["influences"][i]];
                    }
                }
            }
        } else {
            if (simulator_settings["influences"] == null) {
                simulator_settings["influences"] = [ival];
                $(vThis).addClass("sel");
            } else {
                var ninf = simulator_settings["influences"].length;
                if (ninf == 1) {
                    simulator_settings["influences"].push(ival);
                    $(vThis).addClass("sel");
                }
            }
        }
    }
}

function poec_nsimSelectILvl(vThis) {
    var ival = parseInt($(vThis).attr("bid"));
    $("#nsimOptionsILvl").find(".ilvl").removeClass("sel");
    $(vThis).addClass("sel");
    simulator_settings["ilvl"] = ival;
    if (parseInt(simulator_settings["ilvl"]) < 68) {
        $("#nsimOptionsInfluences").find(".sel").removeClass("sel");
        $("#nsimOptionsInfluences").addClass("disabled");
        simulator_settings["influences"] = null;
    } else {
        $("#nsimOptionsInfluences").removeClass("disabled");
    }
}

function poec_nsimSelectQuality(vThis) {
    var ival = parseInt($(vThis).attr("bid"));
    $("#nsimOptionsQuality").find(".qual").removeClass("sel");
    $(vThis).addClass("sel");
    simulator_settings["quality"] = ival;
}

function poec_nsimFinishSetup() {
    if (nsim_tmpsets && nsim_tmpconfig) {
        poec_nsimShowMainInt(nsim_tmpsets, false, nsim_tmpconfig);
    } else {
        poec_nsimShowMainInt(null, false, null);
    }
}

function poec_nsimShowMainInt(simulator_crsets, imported, simuuseconfig) {
    $("#nsimSourceInt").hide();
    poec_nsimBuildIntBase(simulator_crsets, imported);
    poec_nsimBuildSetupPreview();
    poec_nsimBuildOptionsInterface();
    $("#nsimMainInterface").show();
    $("#nsimRestoreBtn").hide();
    $("#nsimRestartBtn").show();
    $("#nsimBackStepBtn").addClass("hidden");
    if (simuuseconfig) {
        poec_nsimBuildConfig(simuuseconfig);
    }
    nsim_tmpsets = null;
    nsim_tmpconfig = null;
}

function poec_nsimBuildIntBase(simulator_crsets, imported) {
    var maxafftmp = parseInt(poecd["bgroups"]["seq"][poecd["bgroups"]["ind"][simulator_settings["bgroup"]]]["max_affix"]) / 2;

    if (imported) {
        simulator_states = imported["states"];
    } else {
        simulator_states = {
            "init": {},
            "current": {},
            "states": []
        };
    }

    simulator_data = {
        "fmodpool": null,
        "eldritch": null,
        "dominance": null,
        "mtypes": null,
        "implicits": null,
        "rollable_implicits": 0,
        "cmodpool": {"prefix": [], "suffix": []},
        "hmodpool": {"prefix": [], "suffix": []},
        "maxaffgrp": {"prefix": maxafftmp, "suffix": maxafftmp},
        "is_rare": parseInt(poecd["bgroups"]["seq"][poecd["bgroups"]["ind"][simulator_settings["bgroup"]]]["is_rare"]),
        "is_fossil": parseInt(poecd["bgroups"]["seq"][poecd["bgroups"]["ind"][simulator_settings["bgroup"]]]["is_fossil"]),
        "is_craftable": parseInt(poecd["bgroups"]["seq"][poecd["bgroups"]["ind"][simulator_settings["bgroup"]]]["is_craftable"]),
        "is_influenced": parseInt(poecd["bgroups"]["seq"][poecd["bgroups"]["ind"][simulator_settings["bgroup"]]]["is_influenced"]),
        "is_essence": parseInt(poecd["bgroups"]["seq"][poecd["bgroups"]["ind"][simulator_settings["bgroup"]]]["is_ess"]),
        "is_catalyst": parseInt(poecd["bgroups"]["seq"][poecd["bgroups"]["ind"][simulator_settings["bgroup"]]]["is_catalyst"]),
        "is_notable": parseInt(poecd["bgroups"]["seq"][poecd["bgroups"]["ind"][simulator_settings["bgroup"]]]["is_notable"]),
        "unique_notable": parseInt(poecd["bases"]["seq"][poecd["bases"]["ind"][simulator_settings["base"]]]["unique_notable"]),
        "iaffixes": [],
        "meta_flags": {},
        "imprint": null,
        "enchant": "",
        "iaffbt": {"prefix": 0, "suffix": 0}
    };


    switch (parseInt(simulator_settings["bitem"])) {
        case 8209 :
            simulator_data["maxaffgrp"] = {"prefix": 2, "suffix": 4};
            break; // Cogwork
        case 8224 :
            simulator_data["maxaffgrp"] = {"prefix": 4, "suffix": 2};
            break; // Geodesic
        case 8246 :
            simulator_data["maxaffgrp"] = {"prefix": 2, "suffix": 2};
            break; // Simplex
        case 8201 :
            simulator_settings["influences"] = [2, 3, 4, 5, 6, 7];
            break; // Astrolabe
    }

    switch (simulator_settings["rarity"]) {
        case 'normal' :
            simulator_data["cmaxaffgrp"] = {"prefix": 0, "suffix": 0};
            break;
        case 'magic' :
            simulator_data["cmaxaffgrp"] = {"prefix": 1, "suffix": 1};
            break;
        default :
            simulator_data["cmaxaffgrp"] = simulator_data["maxaffgrp"];
            break;
    }

    if (simulator_crsets) {
        simulator_data["iaffixes"] = jQuery.parseJSON(JSON.stringify(simulator_crsets["affixes"]));
        simulator_data["meta_flags"] = jQuery.parseJSON(JSON.stringify(simulator_crsets["meta_flags"]));
        simulator_data["iaffbt"] = jQuery.parseJSON(JSON.stringify(simulator_crsets["iaffbt"]));
        simulator_data["eldritch"] = jQuery.parseJSON(JSON.stringify(simulator_crsets["eldritch"]));
        if (simulator_crsets["implicits"]) {
            if (simulator_crsets["implicits"].length > 0) {
                simulator_data["implicits"] = jQuery.parseJSON(JSON.stringify(simulator_crsets["implicits"]));
            }
        }
        if (simulator_crsets["imprint"]) {
            simulator_data["imprint"] = jQuery.parseJSON(JSON.stringify(simulator_crsets["imprint"]));
        }

        // Reset eldritch to be sure
        if (simulator_crsets["implicits"]) {
            simulator_data["eldritch"] = {};
            for (var i = 0; i < simulator_crsets["implicits"].length > 0; i++) {
                switch (simulator_crsets["implicits"][i]["atype"]) {
                    case 'eldritch_red' :
                    case 'eldritch_blue':
                        simulator_data["eldritch"][simulator_crsets["implicits"][i]["atype"]] = poecd["tiers"][simulator_crsets["implicits"][i]["id"]][simulator_settings["base"]].length - simulator_crsets["implicits"][i]["tindex"];
                        break;
                }
            }
            if (simulator_data["eldritch"]["eldritch_blue"] == undefined && simulator_data["eldritch"]["eldritch_red"] == undefined) {
                simulator_data["eldritch"] = null;
            }
        }
    }


    // Build full mod pool
    var affixes = {"prefix": {}, "suffix": {}, "corrupted": {}, "eldritch_red": {}, "eldritch_blue": {}};
    var vaffixes = {"prefix": {10: []}, "suffix": {10: []}};
    var okafft = "|prefix|suffix|corrupted|eldritch_red|eldritch_blue|";
    simulator_data["mtypes"] = {};
    simulator_data["mgrpdata"] = {};
    simulator_data["affbymgrp"] = {};
    if (simulator_settings["ilvl"] == undefined) {
        simulator_settings["ilvl"] = 100;
    }
    for (var i = 0; i < poecd['basemods'][simulator_settings["base"]].length; i++) {
        var mod = jQuery.parseJSON(JSON.stringify(poecd['modifiers']['seq'][poecd['modifiers']['ind'][poecd['basemods'][simulator_settings["base"]][i]]]));
        if (poec_constants["constraints"]["active_mgroups"].indexOf("|" + mod["id_mgroup"] + "|") > -1 && okafft.indexOf("|" + mod["affix"] + "|") > -1) {
            var skip_affix = false;
            if (simulator_settings["exmods"] != "" && mod["exkey"]) {
                if (simulator_settings["exmods"] == mod["exkey"]) {
                    skip_affix = true;
                }
            }
            if (!skip_affix) {
                mod["umtiers"] = poecd['tiers'][mod["id_modifier"]][simulator_settings["base"]].length;
                mod["umvals"] = 0;
                // Get tiers
                var mtiers = [];
                for (var j = 0; j < poecd['tiers'][mod["id_modifier"]][simulator_settings["base"]].length; j++) {
                    var htilvl = parseInt(poecd['tiers'][mod["id_modifier"]][simulator_settings["base"]][j]["ilvl"]);
                    if (htilvl <= simulator_settings["ilvl"] || mod["id_mgroup"] == 11 || mod["id_mgroup"] == 13 || mod["id_mgroup"] == 10) {
                        // Get sanctified fossil modifier
                        var sancmod = 1 + (1 * ((htilvl - 40) / 100));
                        mtiers.push(jQuery.parseJSON(JSON.stringify(poecd['tiers'][mod["id_modifier"]][simulator_settings["base"]][j])));
                        mtiers[mtiers.length - 1]["sancmod"] = sancmod;
                        // Build values output
                        mtiers[mtiers.length - 1]["valout"] = poec_simOutputTValues(poecd['tiers'][mod["id_modifier"]][simulator_settings["base"]][j]["nvalues"]);
                        var nvalues = poecd['tiers'][mod["id_modifier"]][simulator_settings["base"]][j]["nvalues"];
                        if (nvalues && nvalues != "[]") {
                            nvalues = jQuery.parseJSON(nvalues);
                            var totnv = 0;
                            for (var z = 0; z < nvalues.length; z++) {
                                if (Array.isArray(nvalues[z])) {
                                    totnv += parseFloat(nvalues[z][1]);
                                } else {
                                    totnv += parseFloat(nvalues[z]);
                                }
                            }
                            if (totnv > mod["umvals"]) {
                                mod["umvals"] = totnv;
                            }
                        }
                    }
                }
                // Parse MTYPES
                var strcheck = "|";
                var amtypes = [];
                var houtput = "";
                if (mod["mtypes"]) {
                    if (mod["mtypes"].length > 1) {
                        strcheck = mod["mtypes"];
                        amtypes = mod["mtypes"].substring(1, mod["mtypes"].length - 1).split("|");
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
                var mmtypes = {
                    "strcheck": strcheck,
                    "mtarr": amtypes,
                    "houtput": houtput
                }
                simulator_data["mtypes"][mod["id_modifier"]] = mmtypes;
                // STORE DATA
                if (mtiers.length > 0) {
                    if (mod["notable"] == 1) {
                        if (simulator_data["is_notable"] && simulator_data["unique_notable"]) {
                            mod["modgroups"].push("unique_notable");
                        }
                    }
                    simulator_data["mgrpdata"][mod["id_modifier"]] = mod["modgroups"];
                    for (var zy = 0; zy < mod["modgroups"].length; zy++) {
                        if (simulator_data["affbymgrp"][mod["modgroups"][zy]] == undefined) {
                            simulator_data["affbymgrp"][mod["modgroups"][zy]] = [];
                        }
                        simulator_data["affbymgrp"][mod["modgroups"][zy]].push(mod["id_modifier"]);
                    }
                    mod["tiers"] = mtiers;
                    if (affixes[mod["affix"]][mod["id_mgroup"]] == undefined) {
                        affixes[mod["affix"]][mod["id_mgroup"]] = [];
                    }
                    affixes[mod["affix"]][mod["id_mgroup"]].push(mod);
                    if (mod["id_mgroup"] == 10) {
                        vaffixes[mod["affix"]][mod["id_mgroup"]].push(mod);
                    }
                }
            }
        }
    }
    simulator_data["fmodpool"] = affixes;
    simulator_data["veiledmods"] = vaffixes;

    // Build essence data if relevant
    simulator_essences = null;
    if (simulator_data["is_essence"]) {
        simulator_essences = [];
        for (var i = 0; i < poecd['essences']['seq'].length; i++) {
            var etiers = jQuery.parseJSON(poecd["essences"]["seq"][i]["tiers"]);
            if (etiers[simulator_settings["base"]] != undefined) {
                var modid = etiers[simulator_settings["base"]];
                var mname = poecl["mod"][modid];
                if (poecd['tiers'][modid]) {
                    if (poecd['tiers'][modid][simulator_settings["base"]]) {
                        var essname = poecl["essence"][poecd['essences']['seq'][i]["id_essence"]];
                        var essimg = "essence_" + poecd['essences']['seq'][i]["name_essence"];
                        var ntiers = poecd['tiers'][modid][simulator_settings["base"]].length;
                        var tiers = [];
                        for (var j = 0; j < ntiers; j++) {
                            var pname = poecd_parseMName(mname, poecd['tiers'][modid][simulator_settings["base"]][j]["nvalues"]);
                            tiers.push({
                                "tindex": j,
                                "tname": pname
                            });
                        }
                        simulator_essences.push({
                            "essid": poecd["essences"]["seq"][i]["id_essence"],
                            "essname": essname,
                            "essimg": essimg,
                            "ntiers": ntiers,
                            "mname": mname,
                            "modid": modid,
                            "tiers": tiers
                        });
                    }
                }
            }
        }
    }

    // Build method selectors from [poec_cmethods]
    poecsim_selectors = {};
    poecsim_cselectors = {};
    nsim_curcraftid = null;
    poec_nsimBuildMethodSelector("base", poec_cmethods, null, null);

    poec_nsimBuildCondFilter();
    poec_nsimBuildVeiledFilter();
    poec_nsimUpdateDominance();
    poec_nsimSetMethodToggles("base", poec_cmethods, null);
    poec_nsimInitCurrentState();
    poec_nsimLoadSettings();
}

var simulator_condfilter = null;

function poec_nsimBuildCondFilter() {
    var vHTML = "";
    vHTML += "<div class='opt mgrp0 at_prefix mkey_open_prefix' apply_class='just_min' tabindex='0' modid='open_prefix' mtiers='" + simulator_data["maxaffgrp"]["prefix"] + "' search='empty " + applyLang("open") + " " + applyLang("prefix") + "'><tag class='atype at_prefix'>" + applyLang("prefix") + "</tag>" + applyLang("Open Prefix") + "</div>";
    vHTML += "<div class='opt mgrp0 at_suffix mkey_open_suffix' apply_class='just_min' tabindex='0' modid='open_suffix' mtiers='" + simulator_data["maxaffgrp"]["suffix"] + "' search='empty " + applyLang("open") + " " + applyLang("suffix") + "'><tag class='atype at_suffix'>" + applyLang("suffix") + "</tag>" + applyLang("Open Suffix") + "</div>";
    vHTML += "<div class='opt mgrp0 at_special mkey_open_affix' apply_class='just_min' tabindex='0' modid='open_affix' mtiers='" + (simulator_data["maxaffgrp"]["prefix"] + simulator_data["maxaffgrp"]["suffix"]) + "' search='empty " + applyLang("open") + " " + applyLang("affix") + "'><tag class='atype at_other'>" + applyLang("special") + "</tag>" + applyLang("Open Affix") + "</div>";
    vHTML += "<div class='opt mgrp0 at_prefix mkey_count_prefix' apply_class='just_min' tabindex='0' modid='count_prefix' mtiers='" + simulator_data["maxaffgrp"]["prefix"] + "' search='" + applyLang("count number of") + " " + applyLang("prefix") + "es " + applyLang("modifiers") + "'><tag class='atype at_prefix'>" + applyLang("prefix") + "</tag>" + applyLang("Number of Prefixes") + "</div>";
    vHTML += "<div class='opt mgrp0 at_suffix mkey_count_suffix' apply_class='just_min' tabindex='0' modid='count_suffix' mtiers='" + simulator_data["maxaffgrp"]["suffix"] + "' search='" + applyLang("count number of") + " " + applyLang("suffix") + "es " + applyLang("modifiers") + "'><tag class='atype at_suffix'>" + applyLang("suffix") + "</tag>" + applyLang("Number of Suffixes") + "</div>";
    vHTML += "<div class='opt mgrp0 at_special mkey_count_affix' apply_class='just_min' tabindex='0' modid='count_affix' mtiers='" + (simulator_data["maxaffgrp"]["prefix"] + simulator_data["maxaffgrp"]["suffix"]) + "' search='" + applyLang("count number of") + " " + applyLang("affix") + "es'><tag class='atype at_other'>" + applyLang("special") + "</tag>" + applyLang("Number of Affixes") + "</div>";
    vHTML += "<div class='opt mgrp0 at_prefix mkey_count_iprefix' apply_class='just_min' tabindex='0' modid='count_iprefix' mtiers='" + simulator_data["maxaffgrp"]["prefix"] + "' search='" + applyLang("count number of") + " " + applyLang("influenced prefix") + "es'><tag class='atype at_prefix'>" + applyLang("prefix") + "</tag>" + applyLang("Number of Influenced Prefixes") + "</div>";
    vHTML += "<div class='opt mgrp0 at_suffix mkey_count_isuffix' apply_class='just_min' tabindex='0' modid='count_isuffix' mtiers='" + simulator_data["maxaffgrp"]["suffix"] + "' search='" + applyLang("count number of") + " " + applyLang("influenced suffix") + "es'><tag class='atype at_suffix'>" + applyLang("suffix") + "</tag>" + applyLang("Number of Influenced Suffixes") + "</div>";
    vHTML += "<div class='opt mgrp0 at_special mkey_count_iaffix' apply_class='just_min' tabindex='0' modid='count_iaffix' mtiers='" + (simulator_data["maxaffgrp"]["prefix"] + simulator_data["maxaffgrp"]["suffix"]) + "' search='" + applyLang("count number of") + " " + applyLang("influenced affix") + "es'><tag class='atype at_other'>" + applyLang("special") + "</tag>" + applyLang("Number of Influenced Affixes") + "</div>";
    vHTML += "<div class='opt mgrp0 at_prefix mkey_veiled_prefix' apply_class='just_min' tabindex='0' modid='veiled_prefix' mtiers='" + simulator_data["maxaffgrp"]["prefix"] + "' search='" + applyLang("veiled") + " " + applyLang("prefix") + "'><tag class='atype at_prefix'>" + applyLang("prefix") + "</tag>" + applyLang("Veiled") + "</div>";
    vHTML += "<div class='opt mgrp0 at_suffix mkey_veiled_suffix' apply_class='just_min' tabindex='0' modid='veiled_suffix' mtiers='" + simulator_data["maxaffgrp"]["suffix"] + "' search='" + applyLang("veiled") + " " + applyLang("suffix") + "'><tag class='atype at_suffix'>" + applyLang("suffix") + "</tag>" + applyLang("Veiled") + "</div>";
    vHTML += "<div class='opt mgrp0 at_special mkey_count_attack' apply_class='just_min' tabindex='0' modid='count_attack' mtiers='" + (simulator_data["maxaffgrp"]["prefix"] + simulator_data["maxaffgrp"]["suffix"]) + "' search='" + applyLang("count number of") + " " + applyLang("attack modifiers") + "'><tag class='atype at_other'>" + applyLang("special") + "</tag>" + applyLang("Number of Attack Modifiers") + "</div>";
    vHTML += "<div class='opt mgrp0 at_special mkey_count_nattack' apply_class='just_min' tabindex='0' modid='count_nattack' mtiers='" + (simulator_data["maxaffgrp"]["prefix"] + simulator_data["maxaffgrp"]["suffix"]) + "' search='" + applyLang("count number of") + " " + applyLang("non-attack modifiers") + "'><tag class='atype at_other'>" + applyLang("special") + "</tag>" + applyLang("Number of Non-Attack Modifiers") + "</div>";
    vHTML += "<div class='opt mgrp0 at_special mkey_count_caster' apply_class='just_min' tabindex='0' modid='count_caster' mtiers='" + (simulator_data["maxaffgrp"]["prefix"] + simulator_data["maxaffgrp"]["suffix"]) + "' search='" + applyLang("count number of") + " " + applyLang("caster modifiers") + "'><tag class='atype at_other'>" + applyLang("special") + "</tag>" + applyLang("Number of Caster Modifiers") + "</div>";
    vHTML += "<div class='opt mgrp0 at_special mkey_count_ncaster' apply_class='just_min' tabindex='0' modid='count_ncaster' mtiers='" + (simulator_data["maxaffgrp"]["prefix"] + simulator_data["maxaffgrp"]["suffix"]) + "' search='" + applyLang("count number of") + " " + applyLang("non-caster modifiers") + "'><tag class='atype at_other'>" + applyLang("special") + "</tag>" + applyLang("Number of Non-Caster Modifiers") + "</div>";
    vHTML += "<div class='opt mgrp0 at_special mkey_quality default_to_max' tabindex='0' modid='quality' mtiers='30' apply_class='just_min' search='" + applyLang("special") + " " + applyLang("item quality") + "'><tag class='atype at_other'>" + applyLang("special") + "</tag>" + applyLang("Item Quality") + "</div>";
    vHTML += "<div class='opt mgrp0 at_special mkey_eldritch_blue' tabindex='0' modid='eldritch_blue' mtiers='1' apply_class='just_min' search='" + applyLang("special") + " eldritch eater tangled'><tag class='atype at_other'>" + applyLang("special") + "</tag>" + applyLang("Eater of Worlds influence") + "</div>";
    vHTML += "<div class='opt mgrp0 at_special mkey_eldritch_red' tabindex='0' modid='eldritch_red' mtiers='1' apply_class='just_min' search='" + applyLang("special") + " eldritch searing exarch'><tag class='atype at_other'>" + applyLang("special") + "</tag>" + applyLang("Searing Exarch influence") + "</div>";
    // Pseudos
    $.each(poec_cpseudos["def"], function (key, dat) {
        if (dat["nosim"] == undefined) {
            var pass = true;
            if (dat["bgroups"] != undefined) {
                pass = false;
                if (dat["bgroups"].indexOf("|" + simulator_settings["bgroup"] + "|") > -1) {
                    pass = true;
                }
            }
            if (pass) {
                if (dat["bases"] != undefined) {
                    pass = false;
                    if (dat["bases"].indexOf("|" + simulator_settings["base"] + "|") > -1) {
                        pass = true;
                    }
                }
            }
            if (pass) {
                if (dat["ignore_bases"] != undefined) {
                    if (dat["ignore_bases"].indexOf("|" + simulator_settings["base"] + "|") > -1) {
                        pass = false;
                    }
                }
            }
            if (pass) {
                vHTML += "<div class='opt mgrp0 at_pseudo mkey_pseudo_" + key + "' tabindex='0' modid='pseudo_" + key + "' mtiers='9999' apply_class='just_min pseudo' search='" + applyLang("pseudo") + " " + applyLang(dat["name"].toLowerCase()) + "'><tag class='atype at_pseudo'>" + applyLang("pseudo") + "</tag>" + applyLang(dat["name"]) + "</div>";
            }
        }
    });
    $.each(simulator_data["fmodpool"], function (key, dat) {
        vHTML += poec_nsimGetATypeHTML(key, dat);
    });
    vHTML += "<div class='opt mgrp0 notfound'>" + applyLang("No element found") + "</div>";
    simulator_condfilter = vHTML;
}

var simulator_veilfilter = null;

function poec_nsimBuildVeiledFilter() {
    var vHTML = "";
    $.each(simulator_data["veiledmods"], function (key, dat) {
        vHTML += poec_nsimGetATypeHTML(key, dat);
    });
    vHTML += "<div class='opt mgrp0 notfound'>" + applyLang("No element found") + "</div>";
    simulator_veilfilter = vHTML;
}

function poec_nsimGetTagName(tag) {
    switch (tag) {
        case 'eldritch_blue' :
            return "eater of worlds";
            break;
        case 'eldritch_red' :
            return "searing exarch";
            break;
        default:
            return tag;
            break;
    }
}

function poec_nsimGetATypeHTML(atype, mgroups) {
    var vHTML = "";
    $.each(mgroups, function (mkey, mods) {
        var lowergroup = poecl["mgroup"][mkey].toLowerCase();
        $.each(mods, function (mindex, mod) {
            var prehtml = "";
            var posthtml = "";
            var addsearch = "";
            var atypetag = poec_nsimGetTagName(atype);
            prehtml += "<tag class='mgrp mgrp" + mod["id_mgroup"] + "'>" + poecl["mgroup"][mkey] + "</tag>";
            if (atype != "prefix" && atype != "suffix") {
                addsearch += " implicit";
                prehtml += "<tag class='atype at_implicit'>implicit</tag>";
            }
            prehtml += "<tag class='atype at_" + atype + "'>" + atypetag + "</tag>";
            var elevated = 0;
            if (poecd["maeven"]["bmods"][simulator_settings["base"] + "-" + mod["id_modifier"]] !== undefined) {
                elevated = 1;
            }
            var addmtypes = "";
            if (mod["mtypes"]) {
                if (mod["mtypes"].length > 1) {
                    var brkmt = mod["mtypes"].substring(1, mod["mtypes"].length - 1).split("|");
                    for (var i = 0; i < brkmt.length; i++) {
                        addmtypes += " " + poecd["mtypes"]["seq"][poecd["mtypes"]["ind"][brkmt[i]]]["poedb_id"];
                    }
                }
            }
            var tmpname = mod["name_modifier"];
            if (simulator_settings["bgroup"] == 11 || simulator_settings["bgroup"] == 15) {
                tmpname = poec_parseMapName(tmpname);
            }
            vHTML += "<div class='opt mgrp" + mod["id_mgroup"] + " at_" + atype + " mkey_" + mod["id_modifier"] + addmtypes + "' tabindex='0' modid='" + mod["id_modifier"] + "' mtiers='" + mod["umtiers"] + "' mvals='" + mod["umvals"] + "' elevated='" + elevated + "' mtypes='" + mod["mtypes"] + "' search='" + tmpname.toLowerCase().replaceAll("'", "").replaceAll('"', '') + " " + atypetag + " " + lowergroup + addsearch + "'>" + prehtml + tmpname + posthtml + "</div>";
        });
    });
    return vHTML;
}

function poec_nsimGetAddonModHTML(affix) {
    var mhtml = "";
    var prehtml = "";
    var atypetag = poec_nsimGetTagName(affix["atype"]);
    prehtml += "<tag class='mgrp mgrp" + affix["mgrp"] + "'>" + poecl["mgroup"][affix["mgrp"]] + "</tag>";
    prehtml += "<tag class='atype at_" + affix["atype"] + "'>" + atypetag + "</tag>";
    var addmtypes = "";
    var mtypes = poecd["modifiers"]["seq"][poecd["modifiers"]["ind"][affix["id"]]]["mtypes"];
    var lowergroup = poecl["mgroup"][affix["mgrp"]].toLowerCase();
    if (mtypes) {
        if (mtypes.length > 1) {
            var brkmt = mtypes.substring(1, mtypes.length - 1).split("|");
            for (var i = 0; i < brkmt.length; i++) {
                addmtypes += " " + poecd["mtypes"]["seq"][poecd["mtypes"]["ind"][brkmt[i]]]["poedb_id"];
            }
        }
    }
    var modname = poecl["mod"][affix["id"]];
    var mtiers = poecd["tiers"][affix["id"]][affix["base"]].length;
    var umvals = 0;
    for (var i = 0; i < poecd["tiers"][affix["id"]][affix["base"]].length; i++) {
        var nvalues = poecd["tiers"][affix["id"]][affix["base"]][i]["nvalues"];
        if (nvalues && nvalues != "[]") {
            nvalues = jQuery.parseJSON(nvalues);
            var totnv = 0;
            for (var z = 0; z < nvalues.length; z++) {
                if (Array.isArray(nvalues[z])) {
                    totnv += parseFloat(nvalues[z][1]);
                } else {
                    totnv += parseFloat(nvalues[z]);
                }
            }
            if (totnv > umvals) {
                umvals = totnv;
            }
        }
    }
    mhtml += "<div class='opt addon mgrp" + affix["mgrp"] + " at_" + affix["atype"] + " mkey_" + affix["id"] + addmtypes + "' abase='" + affix["base"] + "' tabindex='0' modid='" + affix["id"] + "' mtiers='" + mtiers + "' mvals='" + umvals + "' elevated='0' mtypes='" + mtypes + "' search='" + modname.toLowerCase().replaceAll("'", "").replaceAll('"', '') + " " + atypetag + " " + lowergroup + "'>" + prehtml + modname + "</div>";
    return mhtml;
}

function poec_nsimUpdateDominance() {
    simulator_data["dominance"] = null;
    if (simulator_data["eldritch"]) {
        if (simulator_data["eldritch"]["eldritch_blue"] > 0 && simulator_data["eldritch"]["eldritch_red"] > 0) {
            if (simulator_data["eldritch"]["eldritch_blue"] != simulator_data["eldritch"]["eldritch_red"]) {
                if (simulator_data["eldritch"]["eldritch_blue"] > simulator_data["eldritch"]["eldritch_red"]) {
                    simulator_data["dominance"] = "searing";
                } else {
                    simulator_data["dominance"] = "tangled";
                }
            }
        } else {
            if (simulator_data["eldritch"]["eldritch_blue"] > 0) {
                simulator_data["dominance"] = "tangled";
            } else {
                if (simulator_data["eldritch"]["eldritch_red"] > 0) {
                    simulator_data["dominance"] = "searing";
                }
            }
        }
    }
}

function poec_nsimUseImportFunction() {
    var iret = poec_parseImportData();

    simulator_settings = iret["settings"];

    poec_nsimShowMainInt(iret["crsets"], false, null);
}

var simulator_curwokeimport = null;

function poec_nsimUseImportWoker() {
    var iret = poec_parseImportData();
    $(simulator_curwokeimport).removeClass("init").find(".wokeritemdata").html(JSON.stringify(iret));
}

var simulator_currecombimport = null;

function poec_nsimUseImportRecomb() {
    var iret = poec_parseImportData();
    iret = poec_nsimFixImportedTindex(iret);
    $(simulator_currecombimport).removeClass("init").find(".wokeritemdata").html(JSON.stringify(iret));
    poec_nsimUpdateAddonAffixes();
}

function poec_nsimFixImportedTindex(iret) {
    for (var i = 0; i < iret["crsets"]["affixes"].length; i++) {
        if (iret["crsets"]["affixes"][i]["tindex"] == -1) {
            iret["crsets"]["affixes"][i]["tindex"] = 0;
        }
    }
    return iret;
}

function poec_nsimWokeFromEmulator(mode) {
    // Check if emulator data can support it
    if (crsim_data && crsim_settings) {
        var iret = {
            "crsets": {
                "affixes": crsim_data["iaffixes"],
                "eldritch": crsim_data["eldritch"],
                "iaffbt": crsim_data["iaffbt"],
                "implicits": crsim_data["implicits"],
                "meta_flags": crsim_data["meta_flags"]
            },
            "settings": {
                "base": crsim_settings["base"],
                "bgroup": crsim_settings["bgroup"],
                "bitem": crsim_settings["bitem"],
                "corrupted": crsim_settings["corrupted"],
                "destroyed": crsim_settings["destroyed"],
                "ilvl": crsim_settings["ilvl"],
                "implicits": crsim_data["implicits"],
                "influences": crsim_settings["influences"],
                "quality": crsim_settings["quality"],
                "rarity": crsim_settings["rarity"],
                "veils": null
            }
        }
        if (mode == "woke") {
            $(simulator_curwokeimport).removeClass("init").find(".wokeritemdata").html(JSON.stringify(iret));
        } else {
            iret = poec_nsimFixImportedTindex(iret);
            $(simulator_currecombimport).removeClass("init").find(".wokeritemdata").html(JSON.stringify(iret));
            poec_nsimUpdateAddonAffixes();
        }
    } else {
        poec_outputNotice("<div>" + applyLang("Import error") + "</div><div>" + applyLang("There does not seem to be an item configured in the emulator") + "</div>", "error");
    }
    poec_importItemCancel();
}

var nsim_addonmods = [];
var nsim_addonhtml = "";

function poec_nsimUpdateAddonAffixes() {
    nsim_addonmods = [];
    $("#poecSimSequence").find(".step").find(".method").find(".woker:not(.init)").each(function () {
        var additem = jQuery.parseJSON($(this).find(".wokeritemdata").html());
        for (var i = 0; i < additem["crsets"]["affixes"].length; i++) {
            if (poecd["tiers"][additem["crsets"]["affixes"][i]["id"]][simulator_settings["base"]] == undefined) {
                nsim_addonmods.push(jQuery.parseJSON(JSON.stringify(additem["crsets"]["affixes"][i])));
                nsim_addonmods[nsim_addonmods.length - 1]["base"] = additem["settings"]["base"];
            }
        }
    });
    var addonhtml = "";
    for (var i = 0; i < nsim_addonmods.length; i++) {
        addonhtml += poec_nsimGetAddonModHTML(nsim_addonmods[i]);
    }
    nsim_addonhtml = addonhtml;
    // For each current nsim_filter, remove addon options and append these at the end
    $(".nsimfilter").each(function () {
        poec_nsimApplyAddonsToFilter($(this), false);
    });
}

function poec_nsimApplyAddonsToFilter(vThis, init) {
    var curval = $(vThis).attr("curval");
    $(vThis).find(".options").find(".opt.addon").remove();
    $(vThis).find(".options").children(".wrapper").append(nsim_addonhtml);
    $(vThis).find(".options").find(".opt.addon").click(function () {
        poec_nsimSetFilterClick($(this));
    });
    if (!init) {
        if (curval != "null") {
            var found = false;
            if ($(vThis).find(".opt.selected").length == 0) {
                $(vThis).find(".options").find(".opt.addon").each(function () {
                    if (curval == $(this).attr("modid")) {
                        $(this).addClass("selected");
                        poec_nsimSetFilter($(vThis));
                        found = true;
                    }
                });
            } else {
                found = true;
            }
            if (!found) {
                $(vThis).attr("curval", "null");
                poec_nsimSetFilter($(vThis));
            }
        }
    }
}

var nsim_tmpsets = null;
var nsim_tmpconfig = null;

function poec_nsimUseCurrentSettings(usewhat) {
    var simulator_crsets = {
        "affixes": [],
        "implicits": [],
        "meta_flags": {},
        "eldritch": null,
        "iaffbt": {"prefix": 0, "suffix": 0}
    };

    var simuuseconfig = null;
    var simuusereqs = null;
    var simuusemethod = null;

    if (usewhat == "emu") {
        var bitem = crsim_settings["bitem"];
        if (bitem == 0) {
            bitem = null;
        }
        simulator_settings = {
            "bgroup": parseInt(crsim_settings["bgroup"]),
            "base": crsim_settings["base"],
            "bitem": bitem,
            "ilvl": crsim_settings["ilvl"],
            "rarity": crsim_settings["rarity"],
            "influences": crsim_settings["influences"],
            "eldritch": crsim_settings["eldritch"],
            "catalysts": crsim_catalyst,
            "quality": crsim_settings["quality"],
            "corrupted": crsim_settings["corrupted"],
            "destroyed": crsim_settings["destroyed"]
        };
        simulator_crsets["affixes"] = crsim_data["iaffixes"];
        simulator_crsets["implicits"] = crsim_data["implicits"];
        simulator_crsets["meta_flags"] = crsim_data["meta_flags"];
        simulator_crsets["eldritch"] = crsim_data["eldritch"];
        simulator_crsets["iaffbt"] = crsim_data["iaffbt"];
    } else {
        var bitem = poec_nBase["i"];
        if (bitem == 0) {
            bitem = null;
        }
        var infs = null;
        if (poec_cInfluences) {
            if (poec_cInfluences.length > 1) {
                var infs = poec_cInfluences.substring(1, poec_cInfluences.length - 1).split("|");
            }
            var ilvl = poec_cILvl;
            if (ilvl == null) {
                ilvl = 100;
            }
        }

        simulator_settings = {
            "bgroup": parseInt(poec_nBase["g"]),
            "base": poec_cBase,
            "bitem": poec_nBase["i"],
            "ilvl": ilvl,
            "rarity": "normal", // TODO : set in relation to configured affixes, also, set configured affixes
            "influences": infs,
            "eldritch": null,
            "catalysts": null,
            "quality": 20,
            "corrupted": 0,
            "destroyed": 0
        };

        if (poec_cCatalyst) {
            simulator_settings["catalysts"] = {"id": poec_cCatalyst, "val": parseInt(poec_cCatValue)};
        }

        var frac = 0;
        if (poec_isFractured == 1 && poec_isSlam == 0) {
            frac = 1;
        }

        var basic_imps = false;
        if (poec_cImps) {
            if (Object.keys(poec_cImps).length > 0) {
                $.each(poec_cImps, function (modid, tilvl) {
                    var atype = poecd["modifiers"]["seq"][poecd["modifiers"]["ind"][modid]]["affix"];
                    if (tilvl != null) {
                        if (!simulator_crsets["eldritch"]) {
                            simulator_crsets["eldritch"] = {};
                        }
                        simulator_crsets["eldritch"][atype] = tilvl;
                        var tierlen = poecd['tiers'][modid][simulator_settings["base"]].length;
                        var trueind = tierlen - tilvl;
                        var naffix = {
                            "atype": atype,
                            "id": modid,
                            "mgrp": poecd["modifiers"]["seq"][poecd["modifiers"]["ind"][modid]]["id_mgroup"],
                            "modgroups": poecd["modifiers"]["seq"][poecd["modifiers"]["ind"][modid]]["modgroups"],
                            "weight": poecd['tiers'][modid][simulator_settings["base"]][trueind]["weighting"],
                            "nvalues": poecd['tiers'][modid][simulator_settings["base"]][trueind]["nvalues"],
                            "tindex": trueind
                        };
                        naffix["rolls"] = poec_simRollValues(naffix["nvalues"]);
                        simulator_crsets["implicits"].push(naffix);
                    }
                });
            } else {
                basic_imps = true;
            }
        } else {
            basic_imps = true;
        }
        if (basic_imps) {
            // Standard item implicits
            if (poec_nBase["i"]) {
                var baseimps = jQuery.parseJSON(poecd["bitems"]["seq"][poecd["bitems"]["ind"][poec_nBase["i"]]]["implicits"]);
                simulator_crsets["implicits"] = [];
                for (var z = 0; z < baseimps.length; z++) {
                    simulator_crsets["implicits"].push(poec_simParseImplicit(baseimps[z]));
                }
            }
        }
        if (poec_cBuild) {
            $.each(poec_cBuild, function (modid, tilvl) {
                // TODO Parse crafted affixes for meta flags
                var atype = poecd["modifiers"]["seq"][poecd["modifiers"]["ind"][modid]]["affix"];
                var ftier = null;
                for (var j = 0; j < poecd['tiers'][modid][simulator_settings["base"]].length; j++) {
                    var htilvl = parseInt(poecd['tiers'][modid][simulator_settings["base"]][j]["ilvl"]);
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
                        "weight": poecd['tiers'][modid][simulator_settings["base"]][ftier]["weighting"],
                        "nvalues": poecd['tiers'][modid][simulator_settings["base"]][ftier]["nvalues"],
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
                    simulator_crsets["affixes"].push(naffix);
                    simulator_crsets["iaffbt"][atype]++;
                    if (poecd["modifiers"]["seq"][poecd["modifiers"]["ind"][modid]]["meta"]) {
                        simulator_crsets["meta_flags"][poecd["modifiers"]["seq"][poecd["modifiers"]["ind"][modid]]["meta"]] = true;
                    }
                } else {
                    console.log("Could not find tier '" + tilvl + " for mod '" + modid + "'");
                }
            });
            if (simulator_crsets["iaffbt"]["prefix"] > 1 || simulator_crsets["iaffbt"]["suffix"] > 1) {
                simulator_settings["rarity"] = "rare";
            } else {
                if (simulator_crsets["affixes"].length > 0) {
                    simulator_settings["rarity"] = "magic";
                }
            }
        }

        if (poec_cSettings) {
            var rbymg = {};
            var nsvalid = 0;
            $.each(poec_cSettings, function (modid, sets) {
                if (sets) {
                    if (sets == undefined) {
                        console.log(poec_cSettings);
                        console.log(modid + " undefined sets");
                    }
                    // Find true tier number
                    var ttier = null;
                    var ntiers = poecd["tiers"][modid][simulator_settings["base"]].length;
                    for (var z = 0; z < ntiers; z++) {
                        if (poecd["tiers"][modid][simulator_settings["base"]][z]["ilvl"] == sets["l"]) {
                            ttier = ntiers - z;
                            break;
                        }
                    }
                    if (ttier === null) {
                        console.log("Could not find tier for mod '" + modid + "' ilvl '" + sets["l"] + "'");
                    } else {
                        if (rbymg[sets["g"]] == undefined) {
                            rbymg[sets["g"]] = [];
                        }
                        rbymg[sets["g"]].push({"modid": modid, "tier": ttier});
                    }
                    nsvalid++;
                }
            });
            if (nsvalid > 0) {
                simuusereqs = [];
                var lmginc = [];
                $.each(rbymg, function (ind, reqs) {
                    if (reqs.length > 1) {
                        var ngfilt = {
                            "type": "and",
                            "treshold": 1,
                            "conds": []
                        };
                        for (var z = 0; z < reqs.length; z++) {
                            ngfilt["conds"].push({
                                "id": reqs[z]["modid"],
                                "treshold": reqs[z]["tier"]
                            });
                        }
                        simuusereqs.push(ngfilt);
                    } else {
                        lmginc.push(reqs[0]);
                    }
                });
                if (lmginc.length > 0) {
                    var ngfilt = {
                        "type": "and",
                        "treshold": null,
                        "conds": []
                    };
                    for (var z = 0; z < lmginc.length; z++) {
                        ngfilt["conds"].push({
                            "id": lmginc[z]["modid"],
                            "treshold": lmginc[z]["tier"]
                        });
                    }
                    simuusereqs.push(ngfilt);
                }
            }
        }

        if (poec_cMethod) {
            switch (poec_cMethod) {
                case 'fossil' :
                    simuusemethod = ['fossil'];
                    if (poec_cFossils) {
                        if (poec_cFossils != "|") {
                            simuusemethod.push(poec_cFossils);
                        }
                    }
                    break;
                case 'essence' :
                    simuusemethod = ['essence'];
                    if (poec_cEssence) {
                        simuusemethod.push("ess" + poec_cEssence);
                    }
                    break;
                case 'chaos' :
                    simuusemethod = ['currency', 'chaos'];
                    break;
                case 'exalted' :
                    simuusemethod = ['currency', 'exalted'];
                    break;
                case 'alchemy' :
                    simuusemethod = ['currency', 'alchemy'];
                    break;
                case 'alteration' :
                    simuusemethod = ['currency', 'alteration'];
                    if (poec_cAdvMet) {
                        // poec_cMandatory
                        switch (poec_cAdvMet) {
                            case 'aa' :

                                break;
                            case 'aar' :

                                break;
                            case 'aair' :

                                break;
                        }
                    }
                    break;
                case 'augmentation' :
                    simuusemethod = ['currency', 'augmentation'];
                    break;
                case 'transmute' :
                    simuusemethod = ['currency', 'transmute'];
                    break;
                case 'regal' :
                    simuusemethod = ['currency', 'regal'];
                    break;
                case 'crusader' :
                    simuusemethod = ['currency', 'crusader'];
                    break;
                case 'redeemer' :
                    simuusemethod = ['currency', 'redeemer'];
                    break;
                case 'hunter' :
                    simuusemethod = ['currency', 'hunter'];
                    break;
                case 'warlord' :
                    simuusemethod = ['currency', 'warlord'];
                    break;
            }
        }
    }

    if (simuusemethod || simuusereqs) {
        simuuseconfig = [{
            "method": simuusemethod,
            "autopass": false,
            "filters": simuusereqs,
            "vfilter": null,
            "actions": {
                "win": "next",
                "win_route": null,
                "fail": "restart",
                "fail_route": null
            }
        }];
    }

    if (bitem || usewhat == "emu") {
        poec_nsimShowMainInt(simulator_crsets, false, simuuseconfig);
    } else {
        nsim_tmpsets = simulator_crsets;
        nsim_tmpconfig = simuuseconfig;
        if ($("#nsimStepItemChoice").find(".item.base" + simulator_settings["base"]).length > 0) {
            poec_nsimGoToStep(4);
        } else {
            poec_nsimGoToStep(5);
        }
    }
}

/***************************/
/* Method Selector Builder */
/***************************/
var poecsim_csindexes = {};
var peocsim_tangled = "";

function poec_nsimBuildMethodSelector(mkey, mdata, mcustom, adata) {
    var html = "";
    var tindex = null;
    var msettings = {};
    if (adata) {
        $.each(adata, function (akey, aval) {
            if (akey != "subset") {
                msettings[akey] = jQuery.parseJSON(JSON.stringify(aval));
            }
        });
    }
    if (mdata == "custom") {
        if (mcustom) {
            if (poecsim_cselectors[mcustom] == undefined) {
                var chtml = "";
                var cindex = {};
                switch (mcustom) {
                    case 'harvest_basic' :
                        for (var i = 0; i < poecd['mtypes']['seq'].length; i++) {
                            if (poecd['mtypes']['seq'][i]["harvest"] == "1") {
                                cindex[poecd['mtypes']['seq'][i]["id_mtype"]] = {
                                    "name": poecl["mtype"][poecd['mtypes']['seq'][i]["id_mtype"]],
                                    "img": null
                                };
                                chtml += "<div class='opt mkey_" + poecd['mtypes']['seq'][i]["id_mtype"] + "' mkey='" + poecd['mtypes']['seq'][i]["id_mtype"] + "' mparent='[PARENT]'>" + poecl["mtype"][poecd['mtypes']['seq'][i]["id_mtype"]] + "</div>";
                            }
                        }
                        cindex['inf'] = {"name": applyLang("Influence"), "img": null};
                        chtml += "<div class='opt mkey_inf' mkey='inf' mparent='[PARENT]'>" + applyLang("Influence") + "</div>";
                        break;
                    case 'harvest_basic_noinf' :
                        for (var i = 0; i < poecd['mtypes']['seq'].length; i++) {
                            if (poecd['mtypes']['seq'][i]["harvest"] == "1") {
                                cindex[poecd['mtypes']['seq'][i]["id_mtype"]] = {
                                    "name": poecl["mtype"][poecd['mtypes']['seq'][i]["id_mtype"]],
                                    "img": null
                                };
                                chtml += "<div class='opt mkey_" + poecd['mtypes']['seq'][i]["id_mtype"] + "' mkey='" + poecd['mtypes']['seq'][i]["id_mtype"] + "' mparent='[PARENT]'>" + poecl["mtype"][poecd['mtypes']['seq'][i]["id_mtype"]] + "</div>";
                            }
                        }
                        break;
                    case 'essences' :
                        if (simulator_essences) {
                            for (var i = 0; i < simulator_essences.length; i++) {
                                cindex[simulator_essences[i]["essid"]] = {
                                    "name": simulator_essences[i]["essname"] + " : " + simulator_essences[i]["mname"],
                                    "img": simulator_essences[i]["essimg"]
                                };
                                chtml += "<div class='opt mkey_ess" + simulator_essences[i]["essid"] + " img' mkey='ess" + simulator_essences[i]["essid"] + "' mparent='[PARENT]'><img src='images/manual/" + simulator_essences[i]["essimg"] + ".png'/>" + simulator_essences[i]["essname"] + " : " + simulator_essences[i]["mname"] + "</div>";
                                poec_nsimBuildMethodSelector("ess" + simulator_essences[i]["essid"], "custom", "esstiers", null);
                            }
                        }
                        break;
                    case 'esstiers' :
                        for (var i = 0; i < simulator_essences.length; i++) {
                            if ("ess" + simulator_essences[i]["essid"] == mkey) {
                                for (var j = 0; j < simulator_essences[i]["tiers"].length; j++) {
                                    var tn = simulator_essences[i]["ntiers"] - simulator_essences[i]["tiers"][j]["tindex"];
                                    cindex[simulator_essences[i]["tiers"][j]["tindex"]] = {
                                        "name": "T" + tn + " : " + simulator_essences[i]["tiers"][j]["tname"],
                                        "img": null
                                    };
                                    chtml += "<div class='opt mkey_esst" + simulator_essences[i]["tiers"][j]["tindex"] + " img' mkey='esst" + simulator_essences[i]["tiers"][j]["tindex"] + "' mparent='[PARENT]'>" + "T" + tn + " : " + simulator_essences[i]["tiers"][j]["tname"] + "</div>";
                                }
                            }
                        }
                        break;
                    case 'catalysts' :
                        for (var i = 0; i < poecd['catalysts']['seq'].length; i++) {
                            cindex[poecd['catalysts']['seq'][i]["id_catalyst"]] = {
                                "name": poecl["catalyst"][poecd['catalysts']['seq'][i]["id_catalyst"]],
                                "img": "catalyst_" + poecd['catalysts']['seq'][i]["id_catalyst"]
                            };
                            chtml += "<div class='opt mkey_" + poecd['catalysts']['seq'][i]["id_catalyst"] + " img' mkey='" + poecd['catalysts']['seq'][i]["id_catalyst"] + "' mparent='[PARENT]'><img src='images/manual/catalyst_" + poecd['catalysts']['seq'][i]["id_catalyst"] + ".png'/>" + poecl["catalyst"][poecd['catalysts']['seq'][i]["id_catalyst"]] + "</div>";
                        }
                        break;
                    case 'fossils' :
                        for (var i = 0; i < poecd['fossils']['seq'].length; i++) {
                            if (poec_constants["constraints"]["ignore_fossils"].indexOf("|" + poecd['fossils']['seq'][i]["id_fossil"] + "|") > -1) {
                            } else {
                                var tpass = true;
                                switch (poecd['fossils']['seq'][i]["id_fossil"]) {
                                    case "18" :
                                        if (poec_constants["constraints"]["hollow_bgroups"].indexOf("|" + simulator_settings["bgroup"] + "|") > -1) {
                                        } else {
                                            tpass = false;
                                        }
                                        break;
                                }
                                if (tpass) {
                                    cindex[poecd['fossils']['seq'][i]["id_fossil"]] = {
                                        "name": poecl["fossil"][poecd['fossils']['seq'][i]["id_fossil"]],
                                        "img": "fossil_" + poecd['fossils']['seq'][i]["id_fossil"]
                                    };
                                    chtml += "<div class='opt mkey_" + poecd['fossils']['seq'][i]["id_fossil"] + " img' mkey='" + poecd['fossils']['seq'][i]["id_fossil"] + "' mparent='[PARENT]'><img src='images/manual/fossil_" + poecd['fossils']['seq'][i]["id_fossil"] + ".png'/>" + poecl["fossil"][poecd['fossils']['seq'][i]["id_fossil"]] + "</div>";
                                }
                            }
                        }
                        // Tangled
                        cindex['tangled'] = {"name": applyLang("Tangled"), "img": "fossil_tangled"};
                        chtml += "<div class='opt mkey_tangled img' mkey='tangled' mparent='[PARENT]'><img src='images/manual/fossil_tangled.png'/>" + applyLang("Tangled") + "</div>";
                        // Build tangled selector
                        peocsim_tangled = "";
                        for (var i = 0; i < poecd['mtypes']['seq'].length; i++) {
                            if (poecd['mtypes']['seq'][i]["tangled"] == "1") {
                                peocsim_tangled += "<div class='opt mkey_" + poecd['mtypes']['seq'][i]["id_mtype"] + "' mkey='" + poecd['mtypes']['seq'][i]["id_mtype"] + "' mparent='[PARENT]'>" + poecl["mtype"][poecd['mtypes']['seq'][i]["id_mtype"]] + "</div>";
                            }
                        }
                        // Perfect
                        if (poec_constants["constraints"]["quality_bgroups"].indexOf("|" + simulator_settings["bgroup"] + "|") > -1) {
                            cindex['perfect'] = {"name": applyLang("Perfect"), "img": "fossil_perfect"};
                            chtml += "<div class='opt mkey_perfect img' mkey='perfect' mparent='[PARENT]'><img src='images/manual/fossil_perfect.png'/>" + applyLang("Perfect") + "</div>";
                        }
                        // Gilded
                        cindex['gilded'] = {"name": applyLang("Gilded"), "img": "fossil_gilded"};
                        chtml += "<div class='opt mkey_gilded img' mkey='gilded' mparent='[PARENT]'><img src='images/manual/fossil_gilded.png'/>" + applyLang("Gilded") + "</div>";
                        break;
                    case 'benchcraft' :
                        var bmg = poec_constants["refs"]["bench_mgroup"];
                        $.each(simulator_data["fmodpool"], function (atkey, mdt) {
                            if (atkey == "prefix" || atkey == "suffix") {
                                if (mdt[bmg]) {
                                    for (var i = 0; i < mdt[bmg].length; i++) {
                                        var mname = mdt[bmg][i]["name_modifier"];
                                        for (var j = 0; j < mdt[bmg][i]["tiers"].length; j++) {
                                            var pname = poecd_parseMName(mname, mdt[bmg][i]["tiers"][j]["nvalues"]);
                                            var cmbid = mdt[bmg][i]["id_modifier"] + "t" + j;
                                            cindex[cmbid] = {"name": pname, "img": null};
                                            chtml += "<div class='opt mkey_" + cmbid + "' mkey='" + cmbid + "' search='" + atkey + " " + pname.toLowerCase() + "' tabindex='0' modid='" + mdt[bmg][i]["id_modifier"] + "' ntier='" + j + "' mparent='[PARENT]'><tag class='atype at_" + atkey + "'>" + atkey + "</tag>" + pname + "</div>";
                                        }
                                    }
                                }
                            }
                        });
                        chtml += "<div class='opt mkey_remove_bench' mkey='remove_bench' search='" + applyLang("remove benchcraft") + "' tabindex='0'>" + applyLang("Remove benchcraft") + "</div>";
                        chtml += "<div class='opt notfound'>" + applyLang("No element found") + "</div>";
                        break;
                    case 'metamethod' :
                        for (var i = 0; i < simulator_metam.length; i++) {
                            chtml += "<div class='opt mkey_" + i + "' mkey='" + i + "' mparent='[PARENT]'>" + simulator_metam[i]["name"] + "</div>";
                        }
                        break;
                    default :
                        console.log("No definition for mcustom '" + mcustom + "'");
                        break;
                }
                if (chtml != "") {
                    if (mcustom == "esstiers") {
                        poecsim_cselectors["ess" + mkey] = chtml;
                        poecsim_csindexes["ess" + mkey] = cindex;
                    } else {
                        poecsim_cselectors[mcustom] = chtml;
                        poecsim_csindexes[mcustom] = cindex;
                    }
                }
            }
            if (mcustom == "esstiers") {
                if (poecsim_cselectors["ess" + mkey] != undefined) {
                    html = poecsim_cselectors["ess" + mkey].replace(/\[PARENT\]/g, mkey);
                    tindex = poecsim_csindexes["ess" + mkey];
                }
            } else {
                if (poecsim_cselectors[mcustom] != undefined) {
                    html = poecsim_cselectors[mcustom].replace(/\[PARENT\]/g, mkey);
                    tindex = poecsim_csindexes[mcustom];
                }
            }
        } else {
            console.log("Custom subset is not defined for '" + mkey + "'");
        }
    } else {
        $.each(mdata, function (key, dat) {
            if (dat["nosim"] != true) {
                var addcls = "";
                var img = "";
                if (dat["img"] != undefined) {
                    addcls += " img";
                    img = "<img src='images/manual/" + dat["img"] + ".png'/>";
                }
                html += "<div class='opt mkey_" + key + addcls + "' mkey='" + key + "' mparent='" + mkey + "'>" + img + dat["name"] + "</div>";
                if (dat["subset"] != undefined) {
                    poec_nsimBuildMethodSelector(key, dat["subset"], dat["subsim"], dat);
                }
            }
        });
    }
    poecsim_selectors[mkey] = {"html": html, "data": mdata, "settings": msettings, "cindex": tindex};
}

/**********************/
/* ITEM SETUP PREVIEW */

/**********************/
function poec_nsimBuildSetupPreview() {
    $("<div>").attr("id", "poecSimItem").appendTo($("#nsimMainInterface"));
    $("#poecSimItem").show();
    poec_nsimGenStartingItem();
}

function poec_nsimGenStartingItem() {
    var nidata = {
        "quality": simulator_settings["quality"],
        "catalyst": simulator_settings["catalysts"],
        "affixes": simulator_data["iaffixes"],
        "implicits": simulator_data["implicits"],
        "eldritch": simulator_data["eldritch"],
        "enchant": "",
        "influences": simulator_settings["influences"],
        "rarity": simulator_settings["rarity"],
        "ilvl": simulator_settings["ilvl"],
        "base": simulator_settings["base"]
    };
    $("#poecSimItem").html(poec_simGetFullItem(nidata, simulator_settings["bitem"], "Starting item", "simulator", true));
    // Behavior
    $("<div>").addClass("item_opts").click(function () {
        poec_nsimItemSwapOptions($(this), "start");
    }).appendTo($("#poecSimItem").find(".poec_item"));
}

/**********************/
/* SIMULATION OPTIONS */
/**********************/
var simulator_filtergroupsel = "";
var simulator_filtergroupopts = {
    "or": "Or",
    "and": "And",
    "not": "Not"
};

function poec_nsimBuildOptionsInterface() {
    $("<div>").attr("id", "poecSimDetZone").addClass("div_stable").html("<div><div class='opts'></div><div class='item'></div></div>").appendTo($("#nsimMainInterface"));
    $("#poecSimItem").appendTo($("#poecSimDetZone").find(".item"));
    /* OPTIONS */
    var vHTML = "<div id='poecSimOptions'>";
    var add = "";
    if (poec_useractive && !nsim_notowner) {
        add = '<div class="choice">' + applyLang("Save") + '<div class="value">save</div></div>';
    }
    vHTML += '<div class="poec_affopt always"><label>' + applyLang("Mode") + '</label><div class="mcui-radio med_shadow" id="poecSimMode"><div class="choice selected">' + applyLang("Configuration") + '<div class="value">config</div></div><div class="choice">' + applyLang("Results") + '<div class="value">results</div></div><div class="choice" id="poecSimModeItemsChoice">' + applyLang("Items") + '<div class="value">items</div></div><div class="choice flow">' + applyLang("Flowchart") + '<div class="value">flow</div></div><div class="choice">' + applyLang("Instructions") + '<div class="value">instructions</div></div><div class="choice">' + applyLang("Export") + '<div class="value">export</div></div>' + add + '</div></div>';
    vHTML += '<div class="poec_affopt config"><label>' + applyLang("Generation type") + '</label><div class="mcui-radio med_shadow" id="poecSimGenType"><div class="choice selected">' + applyLang("Real-time") + '<div class="value">rt</div></div><div class="choice">' + applyLang("Fixed") + '<div class="value">fx</div></div><div class="choice">' + applyLang("Debug") + '<div class="value">db</div></div></div></div>';
    vHTML += '<div class="poec_affopt config gentype fx"><label>' + applyLang("Fixed type") + '</label><div class="mcui-radio med_shadow" id="poecSimFixedWhat"><div class="choice selected">' + applyLang("Actions") + '<div class="value">ac</div></div><div class="choice">' + applyLang("Items") + '<div class="value">it</div></div></div></div>';
    vHTML += '<div class="poec_affopt config gentype fx"><label>' + applyLang("Target") + '</label><div><input type="text" id="poecSimFixedLoops" maxlength="8" value="10000"/></div></div>';
    vHTML += '<div class="poec_affopt config gentype db"><div class="mcui-checkbox ischecked" id="poecSimNoStopOnLoop">' + applyLang("Don't stop on loop") + '</div></div>';
    vHTML += '<div class="poec_affopt config"><div class="mcui-checkbox ischecked" id="poecSimKeepItems">' + applyLang("Store items") + '</div></div>';
    vHTML += '<div class="poec_affopt config stored"><label>' + applyLang("# stored") + '</label><div><input type="text" id="poecSimStoredItems" maxlength="4" value="' + simulator_constants["default_stored_items"] + '"/></div></div>';
    vHTML += '<div class="poec_affopt config"><div class="mcui-checkbox unchecked" id="poecSimShowDist">' + applyLang("Distribution tables") + '</div></div>';
    vHTML += '<div class="poec_affopt export"><div class="mcui-checkbox ischecked" id="poecSimExportResults">' + applyLang("Include results") + '</div></div>';
    vHTML += '<div class="poec_affopt export"><div class="mcui-checkbox unchecked" id="poecSimExportItems">' + applyLang("Include items") + '</div></div>';
    vHTML += '<div class="poec_affopt flow"><div class="mcui-checkbox unchecked" id="poecSimFlowSplit">' + applyLang("Split charts") + '</div></div>';
    vHTML += '<div class="poec_affopt flow"><label>' + applyLang("Into") + '</label><div><input type="text" id="poecSimFlowSplitConf" value="2"/></div></div>';
    vHTML += '<div class="poec_affopt flow"><div class="mcui-checkbox unchecked" id="poecSimFlowEditing">' + applyLang("Edit Routing") + '</div></div>';
    vHTML += '<div class="poec_affopt instructions"id="poecSimCopyInstBtnHolder"><div class="mcui-button yellow" id="poecSimCopyInstBtn" onClick="poec_simCopyInstToClip()">' + applyLang("Copy to clipboard") + '</div></div>';
    vHTML += '<div class="poec_affopt config fullbtn" id="poecSimStartBtnHolder"><div class="mcui-button green" id="poecSimStartBtn" onClick="poec_simStartSimulation()">' + applyLang("Start simulation") + '</div></div>';
    vHTML += '<div class="poec_affopt results fullbtn" id="poecSimResultsStatus">' + "<div class='message poecsimnotice'><div>" + applyLang("Notice") + "</div><div>" + applyLang("No results generated yet.") + "</div></div>" + '</div>';
    vHTML += '<div class="poec_affopt instructions fullbtn" id="poecSimInstructionsOutputZone"></div>';
    vHTML += '<div class="poec_affopt items fullbtn" id="poecSimItemsMessageZone"><div class="poecsimnotice_holder"><div id="poecItemStartMsg" class="message poecsimnotice"><div>' + applyLang("Notice") + '</div><div>' + applyLang("No items generated yet") + '</div></div><div id="poecItemNoMsg" class="poecsimnotice"><div>' + applyLang("Notice") + '</div><div>' + applyLang("No items were succesfully generated") + '</div></div></div></div>';
    vHTML += '<div class="poec_affopt export fullbtn" id="poecSimExportBtnHolder"><div id="crnsimExportToggler"><div class="mcui-button green" id="crnsimGenExpDataBtn" onclick="poec_nsimExportData()">Generate export data</div></div></div>';
    vHTML += '<div class="poec_affopt save fullbtn" id="poecSimSaveConfigZone"></div>';
    vHTML += "</div>";
    $("#poecSimDetZone").find(".opts").html(vHTML);
    $("#poecSimFixedLoops,#poecSimStoredItems").keypress(function (event) {
        var char = String.fromCharCode(event.keyCode);
        if (char) {
            char = parseInt(char);
            if (isNaN(char)) {
                event.preventDefault();
            }
        }
    }).blur(function () {
        var val = parseInt($(this).val());
        if (isNaN(val)) {
            val = 0;
        }
        if (val < 1) {
            $(this).val(100000);
        }
    }).focus(function () {
        $(this).select();
    });
    $("#poecSimOptions").find(".mcui-radio").mcuiRadio({
        "change": function (val, elem) {
            poec_simSetOptions(false, val, elem);
        }
    });
    $("#poecSimOptions").find(".mcui-checkbox").mcuiCheck({
        "change": function (val, elem) {
            poec_simSetOptions(false, val, elem);
        }
    });
    /* SEQUENCE CONFIG */
    $("<div>").attr("id", "poecSimSeqZone").addClass("nsimmaintab config").appendTo($("#nsimMainInterface"));
    var vHTML = "<div id='poecSimSeqTitle'><div class='title base'>Simulation sequence configuration</div><div class='title template'>Crafting templates</div><div id='nsimPresetsToggleBtn' class='mcui-button dark' onClick='poec_nsimTogglePresets()'>Presets</div></div>";
    vHTML += "<div id='poecSimSequence' class='div_stable'><div class='header'><div>" + applyLang("Step") + "</div><div>" + applyLang("Method") + "</div><div>" + applyLang("Conditions") + "</div><div>" + applyLang("Actions") + "</div><div></div></div></div><div id='poecSimTmpZone' class='hidden'></div>";
    vHTML += "<div id='poecSimSeqAddBtnZone'><div id='poecSimSeqAddStepBtn' class='mcui-button green' onClick='poec_nsimAddSeqStep(false,null,null)'>Add sequence step</div></div>";
    vHTML += "<div id='poecSimPresetsZone'></div>";
    $("#poecSimSeqZone").html(vHTML);
    /* RESULTS TAB */
    $("<div>").attr("id", "poecSimResultsZone").addClass("nsimmaintab results").html("").appendTo($("#nsimMainInterface"));
    /* ITEMS TAB */
    $("<div>").attr("id", "poecSimItemsZone").addClass("nsimmaintab items").html("").appendTo($("#nsimMainInterface"));
    /* FLOWCHART TAB */
    $("<div>").attr("id", "poecSimFlowchartZone").addClass("nsimmaintab flow").html("").appendTo($("#nsimMainInterface"));
    /* INSTRUCTIONS TAB */
    $("<div>").attr("id", "poecSimInstructionsZone").addClass("nsimmaintab instructions").html("").appendTo($("#nsimMainInterface"));
    /* EXPORT TAB */
    var vHTML = "";
    vHTML += '<div id="crnsimExportToggled"><div class="gen_msg">Copy the content below to a file to save and save to .txt format.</div><textarea id="crnsimExportArea" class="nsimietextarea" onclick="$(this).select()"></textarea></div>';
    $("<div>").attr("id", "poecSimExportZone").addClass("nsimmaintab export").html(vHTML).appendTo($("#nsimMainInterface"));
    /* SAVE TAB */
    if (poec_useractive) {
        $("<div>").attr("id", "poecSimSaveZone").addClass("nsimmaintab save").html("").appendTo($("#nsimMainInterface"));
    }
    // Build filter group selector options
    var vHTML = "";
    vHTML += "<div class='opt mkey_null cancel' mkey='null' mparent='null'>" + applyLang("Cancel") + "</div>";
    $.each(simulator_filtergroupopts, function (key, val) {
        vHTML += "<div class='opt mkey_" + key + "' mkey='" + key + "' mparent='null'>" + applyLang(val) + "</div>";
    });
    simulator_filtergroupsel = vHTML;
    // Init
    $("#poecSimFlowSplitConf").keyup(function () {
        if ($("#poecSimFlowSplit").mcuiCheck().getVal()) {
            clearTimeout(nsim_splitconftm);
            nsim_splitconftm = setTimeout(function () {
                poec_simInitFlowchartGO();
            }, 500);
        }
    });
    poec_simChangeMainTab("config");
    poec_nsimInitSequence();
}

var nsim_splitconftm = null;

function poec_nsimTogglePresets() {
    if ($("#poecSimPresetsZone").is(":visible")) {
        poec_nsimClosePresets();
    } else {
        $("#poecSimStartBtn").hide();
        $("#poecSimSequence").hide();
        $("#poecSimSeqAddBtnZone").hide();
        $("#poecSimSeqTitle").find("div.title.template").css({"display": "inline-block"});
        $("#poecSimSeqTitle").find("div.title.base").hide();
        $("#nsimPresetsToggleBtn").html("Configuration");
        if ($("#poecSimPresetsZone").find(".preset").length == 0) {
            // Build presets
            var vHTML = "";
            for (var i = 0; i < simulator_presets.length; i++) {
                var dHTML = "";
                var onclick = "";
                var addcls = "";
                if (simulator_presets[i]["subs"] != undefined) {
                    addcls += " subs";
                    for (var j = 0; j < simulator_presets[i]["subs"].length; j++) {
                        dHTML += "<div class='sub' onClick='poec_nsimUsePreset(" + i + "," + j + ")'>" + simulator_presets[i]["subs"][j]["name"] + "</div>";
                    }
                } else {
                    onclick = " onClick='poec_nsimUsePreset(" + i + ",null)'";
                    dHTML += "<div class='desc'>" + simulator_presets[i]["desc"] + "</div>";
                }
                vHTML += "<div class='preset mcui-button dark " + addcls + "' pindex='" + i + "'" + onclick + ">";
                vHTML += "<div class='name'>" + simulator_presets[i]["name"] + "</div>";
                vHTML += dHTML;
                vHTML += "</div>";
            }
            $("#poecSimPresetsZone").html(vHTML);
        }
        $("#poecSimPresetsZone").show();
    }
}

function poec_nsimClosePresets() {
    $("#poecSimPresetsZone").hide();
    $("#poecSimStartBtn").show();
    $("#poecSimSequence").show();
    $("#poecSimSeqAddBtnZone").show();
    $("#poecSimSeqTitle").find("div.title.template").hide();
    $("#poecSimSeqTitle").find("div.title.base").css({"display": "inline-block"});
    $("#nsimPresetsToggleBtn").html("Presets");
}

function poec_nsimUsePreset(pindex, psindex) {
    if (psindex !== null) {
        var udata = simulator_presets[pindex]["subs"][psindex]["data"];
        var trare = simulator_presets[pindex]["subs"][psindex]["rarity"];
    } else {
        var udata = simulator_presets[pindex]["data"];
        var trare = simulator_presets[pindex]["rarity"];
    }
    var prdat = jQuery.parseJSON(udata);
    if (trare) {
        poec_simChangeStartRarity(trare);
    }
    poec_nsimClosePresets();
    poec_nsimBuildOptionsInterface();
    poec_nsimBuildConfig(prdat);
}

function poec_simSetOptions(init, val, elem) {
    var eid = $(elem).attr("id");
    switch (eid) {
        case 'poecSimMode' :
            poec_simChangeMainTab(val);
            if (val == "config") {
                poec_simSetOptions(false, $("#poecSimGenType").find(".selected").find(".value").html(), $("#poecSimGenType"));
                poec_simSetOptions(false, $("#poecSimKeepItems").mcuiCheck().getVal(), $("#poecSimKeepItems"));
            }
            break;
        case 'poecSimGenType' :
            $("#poecSimOptions").find(".poec_affopt.gentype").hide();
            $("#poecSimOptions").find(".poec_affopt.gentype." + val).show();
            break;
        case 'poecSimKeepItems' :
            if (val) {
                $("#poecSimOptions").find(".poec_affopt.config.stored").show();
            } else {
                $("#poecSimOptions").find(".poec_affopt.config.stored").hide();
            }
            break;
        case 'poecSimFlowEditing' :
            $(".nsim_flowdet").remove();
            break;
        case 'poecSimExportResults' :
        case 'poecSimExportItems' :
            poec_nsimCloseExporter();
            break;
        case 'poecSimFlowSplit' :
            poec_simInitFlowchartGO();
            break;
    }
}

function poec_simChangeMainTab(val) {
    poec_nsimCloseExporter();
    $("#poecSimDebugItem").hide();
    switch (val) {
        case 'instructions' :
            poec_simGenerateInstruction("standard");
            break;
        case 'save' :
            poec_simInitSaveTab();
            break;
        case 'results' :
            $("#poecSimDebugItem").show();
            break;
        case 'flow' :
            poec_nsimGenerateConfigData();
            poec_nsimParseFlowConfig();
            $("#poecSimFlowSplit").mcuiCheck().setState(simulator_flow["split"]);
            $("#poecSimFlowSplitConf").val(simulator_flow["into"]);
            poec_simInitFlowchart();
            break;
    }
    if (val != "flow") {
        //$("#siteWrap").unbind("mousemove");
    }
    $("#poecSimItem").hide();
    if (val == "config") {
        $("#poecSimItem").show();
    }
    $(".nsim_flowdet").remove();
    $("#nsimMainInterface").find(".nsimmaintab").hide();
    $("#nsimMainInterface").find(".nsimmaintab." + val).show();
    $("#poecSimOptions").find(".poec_affopt:not(.always)").hide();
    $("#poecSimOptions").find(".poec_affopt." + val + ":not(.fullbtn)").css({"display": "inline-block"});
    $("#poecSimOptions").find(".poec_affopt." + val + ".fullbtn").css({"display": "block"});
    switch (val) {
        case 'config' :
            poec_simSetOptions(false, $("#poecSimGenType").find(".selected").find(".value").html(), $("#poecSimGenType"));
            poec_simSetOptions(false, $("#poecSimKeepItems").mcuiCheck().getVal(), $("#poecSimKeepItems"));
            break;
    }
}

function poec_simScroll() {
    var cscroll = $(window).scrollTop();
    if ($("#poecSimDebugItem").length > 0) {
        if ($("#poecSimDebugItem").is(":visible")) {
            var check = $("#poecSimDebugLayout").find(".dbstepS").offset().top;
            if (cscroll < check - 30) {
                $("#poecSimDebugItem").css({"position": "absolute", "top": check});
            } else {
                $("#poecSimDebugItem").css({"position": "fixed", "top": 30});
            }
        }
    }
}

function poec_simResize() {
    var cwidth = $(window).width();
    if ($("#poecSimDebugItem").length > 0) {
        if ($("#poecSimDebugItem").is(":visible")) {
            var zwidth = $("#poecMain").children("div.swrap").width();
            if (cwidth > zwidth) {
                $("#poecSimDebugItem").css({"right": ((cwidth - zwidth) / 2) + 30});
            } else {
                $("#poecSimDebugItem").css({"right": 60});
            }
        }
    }
}

/**********************/
/* SEQUENCE INTERFACE */
/**********************/
var nsim_curseli = 1;

function poec_nsimInitSequence() {
    /*
    console.log(simulator_settings);
    console.log(simulator_data);
    console.log(poec_cmethods);
    console.log(simulator_mtoggles);
    */
    nsim_curseli = 1;
    poec_nsimAddSeqStep(true, null, null);
}

function poec_nsimInitCurrentState() {
    simulator_states["init"] = {
        "rarity": simulator_settings["rarity"],
        "dominance": simulator_data["dominance"],
        "influences": simulator_settings["influences"],
        "meta": null
    };
    simulator_states["states"].push(jQuery.parseJSON(JSON.stringify(simulator_states["init"])));
    simulator_states["current"] = jQuery.parseJSON(JSON.stringify(simulator_states["init"]));
}

function poec_nsimUpdateCurrentState() {
    var cnt = 0;
    var cseq = [];
    var rarity = null;
    var influence = null;
    $("#poecSimSeqZone").find(".step:last").find(".method").find(".nsimsel").each(function () {
        var cval = $(this).attr("curval");
        if (cval != "null") {
            cseq.push(cval);
            var curdat = null;
            for (var i = 0; i < cseq.length; i++) {
                if (i == 0) {
                    curdat = poec_cmethods[cseq[i]];
                } else {
                    if (curdat["subset"] != undefined) {
                        if (curdat["subset"] != "custom") {
                            curdat = curdat["subset"][cseq[i]];
                        }
                    }
                }
            }
            if (curdat) {
                if (curdat["rarity"] != undefined) {
                    rarity = curdat["rarity"];
                }
                if (curdat["influence"] != undefined) {
                    influence = [curdat["influence"]];
                }
            }
        }
        cnt++;
    });
    simulator_states["current"]["rarity"] = rarity;
    simulator_states["current"]["influences"] = influence;
    //console.log(simulator_states);
}

function poec_nsimPushCurrentState() {
    var laststate = simulator_states["states"][simulator_states["states"].length - 1];
    if (simulator_states["current"]["rarity"] == null) {
        simulator_states["current"]["rarity"] = laststate["rarity"];
    }
    if (simulator_states["current"]["influences"] == null) {
        simulator_states["current"]["influences"] = laststate["influences"];
    }
    simulator_states["states"].push(jQuery.parseJSON(JSON.stringify(simulator_states["current"])));
}

function poec_nsimAddSeqStep(init, addwhere, snum) {
    var cont = true;
    if (!init) {
        if ($("#poecSimSeqAddStepBtn").hasClass("disabled")) {
            cont = false;
        }
    }
    poec_nsimCloseSelectors();
    if (cont) {
        // Lock current step
        var nstep = $("#poecSimSeqZone").find(".step").length;
        //$("#poecSimSeqStep"+nstep).find(".method").find(".nsimsel").addClass("locked"); // TEMPO REMOVE BECAUSE WE ARE NOT USING STATES FOR THE MOMENT
        //$("#poecSimSeqStep"+nstep).find(".method").find(".nselwhat").addClass("locked");
        // Push state into step state array
        if (!init) {
            //poec_nsimPushCurrentState();
        }
        // Add new step
        if (snum) {
            nstep = snum;
        } else {
            nstep++;
        }
        var vHTML = "<div id='poecSimSeqStep" + nstep + "' nstep='" + nstep + "' class='step'>";
        vHTML += "<div class='num'><div class='med_shadow'>" + nstep + "</div></div>";
        vHTML += "<div class='method'>" + poec_nsimOutputSelector("base", "method", null, true, null, true) + "</div>";
        vHTML += "<div class='conditions'>";
        vHTML += '<div class="autopassopts"><div class="poec_affopt"><div class="mcui-checkbox unchecked med_shadow" id="poecSimCondAutoPass' + nstep + '" step="' + nstep + '">' + applyLang("Automatic success") + '</div></div>';
        vHTML += '<div class="poec_affopt filteraddoptall filteraddopt filtercopyholder" id="poecSimCopyStepFiltersHolder' + nstep + '"></div>';
        vHTML += '<div class="poec_affopt filteraddoptall filteraddopt"><div class="mcui-button yellow" onClick="poec_simResetFilters(\'' + nstep + '\')">' + applyLang("Reset") + '</div></div>';
        vHTML += '<div class="poec_affopt filteraddoptall"><div id="poecSimAdvOptTog' + nstep + '" class="med_shadow advopttog filter" onclick="poec_simToggleAdvFilterOpts(this)"><div class="text"><div>Additional</div><div>Options</div></div><div class="arrow"></div></div></div></div>';
        // Condition filtering section
        vHTML += "<div id='poecSimCondArea" + nstep + "' class='condition_area'>";
        vHTML += poec_nsimAddConditionZone(nstep, "and", "normal");
        vHTML += "<div id='poecSimCondGroupSet'>";
        vHTML += "<div class='nsimselholder fgroupadd'><div id='poecSimCondAddGroup" + nstep + "' class='nsimsel noselect med_shadow custom' sparent='null' sindex='fgroupadd" + nstep + "' skey='fgroupadd" + nstep + "' nstep='" + nstep + "' customtype='fgroupadd' iniset='" + applyLang("Add a condition group") + "' curval='null'><div class='current'></div><div class='options med_shadow'><div class='wrapper'>";
        vHTML += simulator_filtergroupsel;
        vHTML += "</div></div></div></div>";
        vHTML += "</div>";
        vHTML += "</div>";
        vHTML += "<div id='poecSimUnveilArea" + nstep + "' class='unveil_area'>";
        vHTML += poec_nsimAddConditionZone(nstep, "veiled", "veiled");
        vHTML += "</div>";
        vHTML += "</div>";
        vHTML += "<div class='actions'>";
        // On success : goto : next OR step (select step > this)
        vHTML += '<div class="actionholder success_holder success_holder_' + nstep + '"><div class="poec_affopt success_opt"><label class="green">' + applyLang("On success") + '</label><div class="mcui-radio med_shadow" id="poecSimSuccessMode' + nstep + '"><div class="choice selected next">' + applyLang("Continue") + '<div class="value">next</div></div><div class="choice end htooltip" tooltip="' + applyLang("Item is finished, go to end") + '">' + applyLang("End") + '<div class="value">end</div></div><div class="choice cstep">' + applyLang("Go to step") + '<div class="value">step</div></div></div></div></div>';
        // On fail : loop OR step (select step < this)
        vHTML += '<div class="actionholder failure_holder failure_holder_' + nstep + '"><div class="poec_affopt failure_opt"><label class="red">' + applyLang("On failure") + '</label><div class="mcui-radio med_shadow" id="poecSimFailMode' + nstep + '"><div class="choice selected loop htooltip" tooltip="' + applyLang("Do the current step again") + '">' + applyLang("Loop") + '<div class="value">loop</div></div><div class="choice restart htooltip" tooltip="' + applyLang("Restart process from step one using starting item") + '">' + applyLang("Restart") + '<div class="value">restart</div></div><div class="choice cstep">' + applyLang("Go to step") + '<div class="value">step</div></div></div></div></div>';
        vHTML += "</div>";
        vHTML += "<div class='remcol'><div><div class='mcui-button add_btn before' onClick='poec_simAddStep(this,-1)'>+</div></div><div><div class='mcui-button rem_btn' onClick='poec_simRemoveStep(this)'>X</div></div><div><div class='mcui-button add_btn after' onClick='poec_simAddStep(this,1)'>+</div></div></div>";
        vHTML += "</div>";
        vHTML += "<div class='spacer'></div>";
        if (addwhere === null) {
            $("#poecSimSequence").append(vHTML);
        } else {
            $("#poecSimSeqStep" + (addwhere + 1)).before(vHTML);
        }
        // Tooltips
        $("#poecSimSeqStep" + nstep).find(".htooltip").hover(function () {
            $(this).find(".tooltip").show();
        }, function () {
            $(this).find(".tooltip").hide();
        }).each(function () {
            $("<div>").addClass("tooltip").html($(this).attr("tooltip")).appendTo($(this));
        });
        // Behaviors
        $("#poecSimCondAutoPass" + nstep).mcuiCheck({
            change: function (val, elem) {
                poec_nsimToggleAutoPass(val, elem);
            }
        });
        $("#poecSimSuccessMode" + nstep).mcuiRadio({
            change: function (val, elem) {
                poec_nsimToggleStepSelector(val, elem);
            }
        });
        $("#poecSimFailMode" + nstep).mcuiRadio({
            change: function (val, elem) {
                poec_nsimToggleStepSelector(val, elem);
            }
        });
        poec_nsimInitSelectors($("#poecSimSeqStep" + nstep));
        poec_nsimInitFilters($("#poecSimSeqStep" + nstep));
        poec_nsimInitInputs($("#poecSimSeqStep" + nstep));
        poec_nsimUpdateStepSelectors();
        poec_nsimCheckAddStepValid();
    }
}

function poec_simRemoveStep(bnode) {
    if ($(bnode).hasClass("red")) {
        poec_simRemoveStepCommit(bnode);
    } else {
        $(bnode).addClass("red");
    }
}

function poec_simAddStep(bnode, delta) {
    if ($(bnode).hasClass("green")) {
        poec_simAddStepCommit(bnode, delta);
    } else {
        $(bnode).addClass("green");
    }
}

jQuery.fn.reverse = [].reverse;

function poec_simChangeStepOrder(stepord, reversed) {
    if (reversed) {
        var arrg = $("#poecSimSeqZone").find(".step").reverse();
    } else {
        var arrg = $("#poecSimSeqZone").find(".step");
    }
    $.each(arrg, function (key, elem) {
        var nstep = parseInt($(elem).attr("nstep"));
        var winmode = $("#poecSimSuccessMode" + nstep).mcuiRadio().getVal();
        if (winmode == "step") {
            var selstep = parseInt($("#poecSimSuccessStep" + nstep).attr("curval"));
            if (!isNaN(selstep)) {
                if (stepord[selstep] != selstep) {
                    if (stepord[selstep] == null) { // Deselect
                        $("#poecSimSuccessStep" + nstep).attr("curval", "null");
                    } else { // Change select
                        $("#poecSimSuccessStep" + nstep).attr("curval", stepord[selstep]);
                    }
                    poec_nsimSetSelector($("#poecSimSuccessStep" + nstep));
                }
            }
        }
        var failmode = $("#poecSimFailMode" + nstep).mcuiRadio().getVal();
        if (failmode == "step") {
            var selstep = $("#poecSimFailureStep" + nstep).attr("curval");
            if (!isNaN(selstep)) {
                if (stepord[selstep] != selstep) {
                    if (stepord[selstep] == null) { // Deselect
                        $("#poecSimFailureStep" + nstep).attr("curval", "null");
                    } else { // Change select
                        $("#poecSimFailureStep" + nstep).attr("curval", stepord[selstep]);
                    }
                    poec_nsimSetSelector($("#poecSimFailureStep" + nstep));
                }
            }
        }
        if (stepord[nstep] != nstep) { // ordering changed for this one
            $("#poecSimSeqStep" + nstep).find(".success_holder").removeClass("success_holder_" + nstep).addClass("success_holder_" + stepord[nstep]);
            $("#poecSimSeqStep" + nstep).find(".failure_holder").removeClass("failure_holder_" + nstep).addClass("failure_holder_" + stepord[nstep]);
            $("#poecSimCopyStepFiltersHolder" + nstep).attr({"id": "poecSimCopyStepFiltersHolder" + stepord[nstep]});
            $("#poecSimCondAutoPass" + nstep).attr({
                "id": "poecSimCondAutoPass" + stepord[nstep],
                "step": stepord[nstep]
            });
            $("#poecSimSuccessMode" + nstep).attr({"id": "poecSimSuccessMode" + stepord[nstep]});
            $("#poecSimSuccessStep" + nstep).attr({
                "id": "poecSimSuccessStep" + stepord[nstep],
                "sindex": "step" + stepord[nstep],
                "skey": "step" + stepord[nstep]
            });
            $("#poecSimFailMode" + nstep).attr({"id": "poecSimFailMode" + stepord[nstep]});
            $("#poecSimFailureStep" + nstep).attr({
                "id": "poecSimFailureStep" + stepord[nstep],
                "sindex": "step" + stepord[nstep],
                "skey": "step" + stepord[nstep]
            });
            $("#poecSimCopyStepSel" + nstep).attr({
                "id": "poecSimCopyStepSel" + stepord[nstep],
                "sindex": "cstep" + stepord[nstep],
                "skey": "cstep" + stepord[nstep]
            });
            $("#poecSimCondArea" + nstep).attr({"id": "poecSimCondArea" + stepord[nstep]});
            $("#poecSimUnveilArea" + nstep).attr({"id": "poecSimUnveilArea" + stepord[nstep]});
            $("#poecSimSeqStep" + nstep).find(".num").find(".med_shadow").html(stepord[nstep]);
            $("#poecSimSeqStep" + nstep).attr({"id": "poecSimSeqStep" + stepord[nstep], "nstep": stepord[nstep]});
            $("#poecSimCondAddGroup" + nstep).attr({
                "id": "poecSimCondAddGroup" + stepord[nstep],
                "nstep": stepord[nstep],
                "sindex": "fgroupadd" + stepord[nstep],
                "skey": "fgroupadd" + stepord[nstep]
            });
            $(".nsimfilter.noselectnstep" + nstep).removeClass("noselectnstep" + nstep).addClass("noselectnstep" + stepord[nstep]).attr("nstep", stepord[nstep]);
            poec_nsimResequenceFilters(stepord[nstep]);
        }
    });
}

function poec_simRemoveStepCommit(bnode) {
    // Check if we need to shift go to step selectors
    var cstep = parseInt($(bnode).parent().parent().parent().attr("nstep"));
    var step_changes = {};
    $("#poecSimSeqZone").find(".step").each(function () {
        var nstep = parseInt($(this).attr("nstep"));
        var newstep = nstep;
        if (nstep != cstep) {
            if (nstep > cstep) {
                newstep--;
            }
        } else {
            newstep = null;
        }
        step_changes[nstep] = newstep;
    });

    $(bnode).parent().parent().parent().next(".spacer").remove();
    $(bnode).parent().parent().parent().remove();

    poec_simChangeStepOrder(step_changes, false);

    //simulator_states["current"]=jQuery.parseJSON(JSON.stringify(simulator_states["states"][simulator_states["states"].length-1])); // discontinued
    //simulator_states["states"].pop();
    //console.log(simulator_states);
    //$("#poecSimSequence").find(".step:last").find(".method").find(".nsimsel").removeClass("locked"); // discontinued
    //$("#poecSimSequence").find(".step:last").find(".method").find(".nselwhat").removeClass("locked"); // discontinued
    poec_nsimUpdateStepSelectors();
    poec_nsimCheckAddStepValid();
}

function poec_simAddStepCommit(bnode, delta) {
    var cstep = parseInt($(bnode).parent().parent().parent().attr("nstep"));
    $(bnode).removeClass("green");
    if (delta < 0) {
        cstep--;
    }
    var step_changes = {};
    $("#poecSimSeqZone").find(".step").each(function () {
        var nstep = parseInt($(this).attr("nstep"));
        var newstep = nstep;
        if (nstep > cstep) {
            newstep++;
        }
        step_changes[nstep] = newstep;
    });
    console.log(step_changes);
    poec_simChangeStepOrder(step_changes, true);
    poec_nsimAddSeqStep(false, cstep + 1, cstep + 1);
}

function poec_simToggleAdvFilterOpts(vThis) {
    if ($(vThis).hasClass("toggled")) {
        $(vThis).removeClass("toggled");
        $(vThis).parent().parent().find(".poec_affopt.filteraddopt").removeClass("show");
    } else {
        $(vThis).addClass("toggled");
        $(vThis).parent().parent().find(".poec_affopt.filteraddopt").addClass("show");
    }
}

function poec_nsimAddConditionZone(nstep, gtype, mode) {
    var vHTML = "";
    vHTML += "<div class='condition_zone gtype_" + gtype + "' gtype='" + gtype + "'>";
    vHTML += "<div class='gheader div_stable'><div><div class='lblcol'><div class='label'>" + applyLang(gtype) + "</div></div><div class='cntcol'>Count<input type='text' class='grpmintresh init' iniset='" + applyLang("Min") + "' value=''/></div><div class='actcol'><div class='mcui-button remconfirm' onClick='poec_simRemoveFilterGroup(this)'>X</div></div></div></div>";
    if (mode == "veiled") {
        vHTML += "<div class='description'>" + applyLang("Choose one or more target veiled modifiers, prioritizing top to bottom.") + "</div>";
    }
    vHTML += poec_nsimOuterFilterSelector(nstep, mode);
    vHTML += "</div>";
    return vHTML;
}

function poec_simRemoveFilterGroup(bnode) {
    if (!$(bnode).hasClass("red")) {
        $(bnode).addClass("red");
    } else {
        poec_simRemoveFilterGroupCommit(bnode);
    }
}

function poec_simRemoveFilterGroupCommit(bnode) {
    var nstep = $(bnode).parent().parent().parent().parent().find(".nsimfilter").attr("nstep");
    $(bnode).parent().parent().parent().parent().remove();
    poec_nsimResequenceFilters(nstep);
}

function poec_nsimInitInputs(cnode) {
    $(cnode).find("input:not(.treshold):not(.max)").blur(function () {
        var val = $(this).val();
        if (val.trim() == "") {
            $(this).addClass("init").val($(this).attr("iniset"));
        } else {
            if ($(this).hasClass("grpmintresh")) {
                poec_nsimCheckGrpTreshMax($(this).parent().parent().parent().parent());
            }
        }
    }).focus(function () {
        if ($(this).hasClass("init")) {
            $(this).removeClass("init").val("");
        }
    }).each(function () {
        if ($(this).val() == $(this).attr("iniset") || $(this).val() == "") {
            $(this).addClass("init").val($(this).attr("iniset"));
        }
    });
    $(cnode).find("input").click(function () {
        $(this).select();
    });
    $(cnode).find("input.grpmintresh").keyup(function (event) {
        if (event.keyCode == 13) {
            $(this).blur();
        }
    });
}

function poec_nsimCheckGrpTreshMax(grp) {
    var nholder = $(grp).find(".nsimfilter_holder:not(.init)").length;
    var cval = $(grp).find(".grpmintresh").val().trim();
    if (cval != "" && cval != "Min") {
        cval = parseInt(cval);
        if (cval > nholder) {
            cval = nholder;
        }
        if (cval == 0) {
            $(grp).find(".grpmintresh").addClass("init").val($(grp).find(".grpmintresh").attr("iniset"));
        } else {
            $(grp).find(".grpmintresh").val(cval);
        }
    }
}

function poec_nsimCheckAddStepValid() {
    if ($("#poecSimSeqZone").find(".step").find(".method").find(".nsimsel.req.init:not(.hasdata)").length > 0) {
        //$("#poecSimSeqAddStepBtn").addClass("disabled");
    } else {
        //$("#poecSimSeqAddStepBtn").removeClass("disabled");
    }
}

function poec_nsimToggleAutoPass(val, elem) {
    var nstep = $(elem).attr("step");
    if (val) {
        $(".failure_holder_" + nstep).addClass("hidden");
        $("#poecSimCondArea" + nstep).hide();
        $("#poecSimSeqStep" + nstep).find(".filteraddoptall").addClass("noshow");
    } else {
        $(".failure_holder_" + nstep).removeClass("hidden");
        $("#poecSimCondArea" + nstep).show();
        $("#poecSimSeqStep" + nstep).find(".filteraddoptall").removeClass("noshow");
        console.log("autopass off");
        if ($("#poecSimFailureStep" + nstep).length == 0) {
            console.log("create failure step selector");
            var sHTML = "";
            var nsteps = $("#poecSimSeqZone").find(".step").length;
            var stepterm = applyLang("Step");
            for (var i = 1; i <= nsteps; i++) {
                if (i != nstep) {
                    sHTML += "<div class='opt mkey_" + i + "' mkey='" + i + "' mparent='null'>" + stepterm + " " + i + "</div>";
                }
            }
            var vHTML = "<div class='nsimselholder stepsel'><div id='poecSimFailureStep" + nstep + "' class='nsimsel noselect med_shadow req failure custom' style='display:block' sparent='null' sindex='step" + nstep + "' skey='step" + nstep + "' iniset='" + applyLang("Choose a step") + "' curval='null'><div class='current'></div><div class='options med_shadow'><div class='wrapper'>";
            vHTML += sHTML;
            vHTML += "</div></div></div></div>";
            $("#poecSimSeqStep" + nstep).find(".failure_opt").after(vHTML);
            poec_nsimInitSelector($("#poecSimFailureStep" + nstep));
            var fm = $("#poecSimFailMode" + nstep).find(".selected").find(".value").html();
            if (fm != "step") {
                $("#poecSimFailureStep" + nstep).hide();
            }
        }
    }
}

function poec_nsimToggleStepSelector(val, elem) {
    if (val == "step") {
        $(elem).parent().parent().find(".nsimselholder.stepsel").show();
    } else {
        $(elem).parent().parent().find(".nsimselholder.stepsel").hide();
    }
}

function poec_nsimUpdateStepSelectors() {
    $("#poecSimSeqZone").find(".poec_affopt:not(.filteraddopt)").show();
    $("#poecSimSeqZone").find(".step").find(".success_opt").find(".end").show();
    $("#poecSimSeqZone").find(".step:last").find(".success_opt").find(".end").hide();
    if ($("#poecSimSeqZone").find(".step:last").find(".success_opt").find(".end").hasClass("selected")) {
        $("#poecSimSeqZone").find(".step:last").find(".success_opt").find(".end").removeClass("selected");
        $("#poecSimSeqZone").find(".step:last").find(".success_opt").find(".next").addClass("selected");
    }

    var nstep = 1;
    var nsteps = $("#poecSimSeqZone").find(".step").length;
    var stepterm = applyLang("Step");
    if (nsteps < 3) {
        $("#poecSimSeqZone").find(".step:first").find(".failure_opt").find(".cstep").hide();
        if ($("#poecSimSeqZone").find(".step:first").find(".failure_opt").find(".cstep").hasClass("selected")) {
            $("#poecSimSeqZone").find(".step:first").find(".failure_opt").find(".cstep").removeClass("selected");
            $("#poecSimSeqZone").find(".step:first").find(".failure_opt").find(".loop").addClass("selected");
        }
    } else {
        $("#poecSimSeqZone").find(".step:first").find(".failure_opt").find(".cstep").show();
    }
    if (nsteps > 1) {
        var cstep = 1;
        $(".filtercopyholder").removeClass("hidden");
        $("#poecSimSeqZone").find(".cstepsel").remove();
        $("#poecSimSeqZone").find(".step").each(function () {
            var vHTML = "<div class='nsimselholder cstepsel'><div id='poecSimCopyStepSel" + cstep + "' class='nsimsel noselect med_shadow custom' sparent='null' nstep='" + cstep + "' sindex='cstep" + cstep + "' customtype='copystep' skey='cstep" + cstep + "' iniset='" + applyLang("Copy conditions") + "' curval='null'><div class='current'></div><div class='options med_shadow'><div class='wrapper'>";
            vHTML += "<div class='opt mkey_null cancel' mkey='null' mparent='null'>" + applyLang("Cancel") + "</div>";
            for (var i = 1; i <= nsteps; i++) {
                if (i != cstep) {
                    vHTML += "<div class='opt mkey_" + i + "' mkey='" + i + "' mparent='null'>" + stepterm + " " + i + "</div>";
                }
            }
            vHTML += "</div></div></div></div>";
            $("#poecSimCopyStepFiltersHolder" + cstep).html(vHTML);
            poec_nsimInitSelector($("#poecSimCopyStepFiltersHolder" + cstep).find(".nsimsel"));
            cstep++;
        });
    } else {
        $(".filtercopyholder").addClass("hidden");
    }
    var stepvars = [];
    $("#poecSimSeqZone").find(".step").each(function () {
        var sfailure = null;
        if ($(this).find(".nsimsel.failure").length > 0) {
            sfailure = $(this).find(".nsimsel.failure").attr("curval");
        }
        var ssuccess = null;
        if ($(this).find(".nsimsel.success").length > 0) {
            ssuccess = $(this).find(".nsimsel.success").attr("curval");
        }
        stepvars.push({"failure": sfailure, "success": ssuccess});
    });
    $("#poecSimSeqZone").find(".stepsel").remove();
    $("#poecSimSeqZone").find(".step").each(function () {
        if ($(this).find(".success_opt").is(":visible")) {
            var sHTML = "";
            var cvfound = false;
            for (var i = 1; i <= nsteps; i++) {
                if (i != nstep && i != nstep + 1) {
                    if (stepvars[nstep - 1]["success"] == i) {
                        cvfound = true;
                    }
                    sHTML += "<div class='opt mkey_" + i + "' mkey='" + i + "' mparent='null'>" + stepterm + " " + i + "</div>";
                }
            }
            if (sHTML != "") {
                $("#poecSimSuccessMode" + nstep).find(".cstep").show();
                var vHTML = "<div class='nsimselholder stepsel'><div id='poecSimSuccessStep" + nstep + "' class='nsimsel noselect med_shadow req success custom' sparent='null' sindex='step" + nstep + "' skey='step" + nstep + "' iniset='" + applyLang("Choose a step") + "' curval='" + stepvars[nstep - 1]["success"] + "'><div class='current'></div><div class='options med_shadow'><div class='wrapper'>";
                vHTML += sHTML;
                vHTML += "</div></div></div></div>";
                $(this).find(".success_opt").after(vHTML);
                if (!cvfound) {
                    $("#poecSimSuccessStep" + nstep).attr("curval", "null");
                }
                poec_nsimInitSelector($("#poecSimSuccessStep" + nstep));
            } else {
                $("#poecSimSuccessMode" + nstep).find(".cstep").hide();
            }
            poec_nsimToggleStepSelector($("#poecSimSuccessMode" + nstep).mcuiRadio().getVal(), $("#poecSimSuccessMode" + nstep));
        }
        if ($(this).find(".failure_opt").is(":visible")) {
            var sHTML = "";
            var cvfound = false;
            for (var i = 1; i <= nsteps; i++) {
                if (i != nstep) {
                    if (stepvars[nstep - 1]["failure"] == i) {
                        cvfound = true;
                    }
                    sHTML += "<div class='opt mkey_" + i + "' mkey='" + i + "' mparent='null'>" + stepterm + " " + i + "</div>";
                }
            }
            if (sHTML != "") {
                $("#poecSimFailMode" + nstep).find(".cstep").show();
                var vHTML = "<div class='nsimselholder stepsel'><div id='poecSimFailureStep" + nstep + "' class='nsimsel noselect med_shadow req failure custom' sparent='null' sindex='step" + nstep + "' skey='step" + nstep + "' iniset='" + applyLang("Choose a step") + "' curval='" + stepvars[nstep - 1]["failure"] + "'><div class='current'></div><div class='options med_shadow'><div class='wrapper'>";
                vHTML += sHTML;
                vHTML += "</div></div></div></div>";
                $(this).find(".failure_opt").after(vHTML);
                if (!cvfound) {
                    $("#poecSimFailureStep" + nstep).attr("curval", "null");
                }
                poec_nsimInitSelector($("#poecSimFailureStep" + nstep));
            } else {
                $("#poecSimFailMode" + nstep).find(".cstep").hide();
            }
            poec_nsimToggleStepSelector($("#poecSimFailMode" + nstep).mcuiRadio().getVal(), $("#poecSimFailMode" + nstep));
        }
        nstep++;
    });
    if ($("#poecSimSeqZone").find(".step").length > 1) {
        $("#poecSimSeqZone").find(".step:first").find(".remcol").find(".mcui-button").css({"display": "inline-block"});
    } else {
        $("#poecSimSeqZone").find(".step:first").find(".remcol").find(".mcui-button").hide();
    }
}

/*********************/
/* CONDITION FILTERS */

/*********************/
function poec_nsimOuterFilterSelector(nstep, mode) {
    var nfilter = $("#poecSimSeqStep" + nstep).find(".nsimfilter").length;
    nfilter++;

    if (mode == "veiled") {
        var usefilter = simulator_veilfilter;
    } else {
        var usefilter = simulator_condfilter;
    }

    var vHTML = "<div id='poecSimFilterHolder" + nstep + "i" + nfilter + "' class='nsimfilter_holder div_stable init'><div>";
    vHTML += "<div class='filter'><div id='poecSimFilter" + nstep + "i" + nfilter + "' class='nsimfilter noselectnstep" + nstep + "' nfilter='" + nfilter + "' nstep='" + nstep + "' iniset='" + applyLang("Add a condition") + "' curval='null' treshold='null'>";
    vHTML += "<div class='current med-shadow'></div>";
    vHTML += "<div class='options med-shadow'><div class='wrapper'>" + usefilter + "</div></div>";
    vHTML += "</div></div>";
    vHTML += "<div class='treshold'>";
    vHTML += "<input type='text' maxval='null' minval='null' class='treshold' iniset='min' value=''/>";
    vHTML += "</div>";
    vHTML += "<div class='max'>";
    vHTML += "<input type='text' maxval='null' minval='null' class='max' iniset='max' value=''/>";
    vHTML += "</div>";
    vHTML += "<div class='action'>";
    vHTML += "<div class='mcui-button remconfirm' onClick='poec_simRemoveFilterSelector(this)'>X</div>";
    vHTML += "</div>";
    vHTML += "</div></div>";
    return vHTML;
}

function poec_simRemoveFilterSelector(bnode) {
    if (!$(bnode).hasClass("red")) {
        $(bnode).addClass("red");
    } else {
        poec_simRemoveFilterSelectorCommit(bnode);
    }
}

function poec_simRemoveFilterSelectorCommit(bnode) {
    var nstep = $(bnode).parent().parent().find(".nsimfilter").attr("nstep");
    var trep = $(bnode).parent().parent().parent().parent();
    $(bnode).parent().parent().parent().remove();
    poec_nsimCheckGrpTreshMax($(trep));
    poec_nsimResequenceFilters(nstep);
}

function poec_nsimInitFilters(cnode) {
    $(cnode).find(".nsimfilter").each(function () {
        poec_nsimInitFilter($(this));
    });
}

function poec_nsimSetFilterClick(vThis) {
    if (!$(vThis).hasClass("disabled") && !$(vThis).hasClass("blocked")) {
        var mkey = $(vThis).attr("modid");
        var curval = $(vThis).parent().parent().parent().attr("curval");
        if (mkey != curval) {
            $(vThis).parent().parent().parent().attr("curval", mkey);
            poec_nsimSetFilter($(vThis).parent().parent().parent());
            var dvalues = $(vThis).parent().parent().parent().parent().parent().parent().parent().parent().hasClass("dvalues");
            if (dvalues) {
                var maxval = $(vThis).attr("mvals");
            } else {
                var maxval = $(vThis).attr("mtiers");
            }
            var tierval = parseInt($(vThis).parent().parent().parent().parent().parent().parent().find("input.treshold").val());
            if (isNaN(tierval)) {
                tierval = maxval;
            } else {
                if (tierval > maxval) {
                    tierval = maxval;
                }
            }
            var gtype = $(vThis).parent().parent().parent().parent().parent().parent().parent().attr("gtype");
            var newfilter = "normal";
            if (gtype == "or" || gtype == "and") {
                if (!$(vThis).hasClass("default_to_max") && !dvalues) {
                    tierval = 1;
                }
            } else {
                if (gtype == "veiled") {
                    newfilter = "veiled";
                }
            }
            $(vThis).parent().parent().parent().children(".current").removeClass("sinit");
            $(vThis).parent().parent().parent().parent().parent().parent().find("input.treshold").attr("maxval", maxval).removeClass("init").val(tierval);
            $(vThis).parent().parent().parent().parent().parent().parent().find("input.max").attr("maxval", maxval).addClass("init").val($(vThis).parent().parent().parent().parent().parent().parent().find("input.max").attr("iniset"));
            if (!$(vThis).parent().parent().parent().parent().parent().parent().next().hasClass("nsimfilter_holder")) {
                var nstep = $(vThis).parent().parent().parent().attr("nstep");
                poec_nsimResequenceFilters(nstep);
                $(vThis).parent().parent().parent().parent().parent().parent().parent().append(poec_nsimOuterFilterSelector(nstep, newfilter));
                poec_nsimInitFilter($(vThis).parent().parent().parent().parent().parent().parent().parent().find(".nsimfilter:last"));
                poec_nsimBlockFilters($(vThis).parent().parent().parent().parent().parent().parent().parent().find(".nsimfilter:last").parent(), nstep);
            }
        } else {
            $(vThis).parent().parent().parent().removeClass("toggled");
            $(vThis).parent().parent().parent().parent().parent().parent().removeClass("toggled");
        }
    }
}

function poec_nsimInitFilter(selnode) {
    $(selnode).find(".current").click(function () {
        poec_nsimCloseSelectors();
        $(this).parent().removeClass("error");
        if (!$(this).parent().hasClass("locked")) {
            $(this).parent().addClass("toggled");
            $(this).parent().parent().parent().parent().addClass("toggled");
            $(this).parent().find(".options").css({"width": $(this).parent().outerWidth()});
            $(this).parent().find(".opt").removeClass("disabled");
            // Get other selector from the same grouping
            var nstep = $(this).parent().attr("nstep");
            var nfilter = $(this).parent().attr("nfilter");
            var notfilter = "";
            $(this).parent().parent().parent().parent().parent().find(".nsimfilter:not(#poecSimFilter" + nstep + "i" + nfilter + ")").each(function () {
                var thisval = $(this).attr("curval");
                if (thisval != "null") {
                    notfilter += ",.opt.mkey_" + thisval;
                }
            });
            if (notfilter != "") {
                notfilter = notfilter.substring(1, notfilter.length);
                $(this).parent().find(notfilter).addClass("disabled");
            }
            if ($(this).children("input").length == 0) {
                $("<input>").addClass("searcher").blur(function (event) {
                    if (!$(event.relatedTarget).hasClass("opt")) {
                        $(this).parent().parent().removeClass("toggled");
                        $(this).parent().parent().parent().parent().parent().removeClass("toggled");
                    }
                }).keyup(function () {
                    poec_nsimFilterFilter($(this));
                }).appendTo($(this));
            }
            var sval = "";
            if (!$(this).parent().hasClass("init")) {
                var curval = $(this).parent().attr("curval");
                sval = poecl["mod"][curval];
            }
            $(this).find(".searcher").val(sval).show().select();
            poec_nsimFilterFilter($(this).find(".searcher"));
        }
    });
    $(selnode).find(".opt:not(.notfound)").click(function () {
        poec_nsimSetFilterClick($(this));
    });
    poec_nsimApplyAddonsToFilter($(selnode), true);
    $(selnode).parent().parent().find("input.treshold,input.max").keyup(function () {
        var just_min = $(this).parent().parent().hasClass("just_min");
        poec_nsimTreshCheck($(this), just_min);
    }).blur(function () {
        var just_min = $(this).parent().parent().hasClass("just_min");
        if (just_min) {
            var val = $(this).val();
            if (val.trim() === "") {
                $(this).addClass("init").val($(this).attr("iniset"));
            } else {
                poec_nsimTreshCheck($(this), true);
            }
        } else {
            poec_nsimTreshCheck($(this), false);
        }
    }).focus(function () {
        $(this).parent().parent().find(".nsimfilter").removeClass("error");
        if ($(this).hasClass("init")) {
            $(this).removeClass("init").val("");
        }
    }).each(function () {
        if ($(this).val() == $(this).attr("iniset") || $(this).val() == "") {
            $(this).addClass("init").val($(this).attr("iniset"));
        }
    });

    poec_nsimSetFilter(selnode);
}

function poec_nsimTreshCheck(tnode, canbeempty) {
    var tval = $(tnode).val();
    var skip = false;
    if (canbeempty && tval == "") {
        skip = true;
    }
    if (!skip) {
        var tval = parseInt(tval);
        var maxval = parseInt($(tnode).attr("maxval"));
        var minval = parseInt($(tnode).attr("minval"));
        if (isNaN(maxval)) {
            maxval = 1;
        }
        if (isNaN(minval)) {
            minval = 1;
        }
        if (isNaN(tval)) {
            tval = maxval;
        } else {
            if (tval > maxval) {
                tval = maxval;
            }
        }
        if (tval < minval) {
            tval = 1;
        }
        if ($(tnode).hasClass("max")) {
            if (!$(tnode).parent().parent().find("input.treshold").hasClass("init")) {
                var cval = parseInt($(tnode).parent().parent().find("input.treshold").val());
                if (cval > tval) {
                    tval = cval;
                }
            }
        } else {
            if (!$(tnode).parent().parent().find("input.max").hasClass("init")) {
                var cval = parseInt($(tnode).parent().parent().find("input.max").val());
                if (cval < tval) {
                    tval = cval;
                }
            }
        }
        $(tnode).val(tval);
    }
}

function poec_nsimResequenceFilters(nstep) {
    var cfilter = 1;
    $("#poecSimSeqStep" + nstep).find(".nsimfilter_holder").each(function () {
        $(this).attr("id", "poecSimFilterHolder" + nstep + "i" + cfilter);
        $(this).find(".nsimfiltert").attr({"id": "poecSimFilter" + nstep + "i" + cfilter, "nfilter": cfilter});
        cfilter++;
    });
}

function poec_nsimFilterFilter(searcher) {
    var val = $(searcher).val().toLowerCase().trim();
    $(searcher).parent().parent().find(".opt.notfound").hide();
    if (val == "") {
        $(searcher).parent().parent().find(".opt:not(.notfound)").show();
    } else {
        $(searcher).parent().parent().find(".opt:not(.notfound)").hide();
        if (val.substring(0, 1) == "~") {
            val = val.substring(1);
            var vals = val.trim().replace(/\s\s+/g, ' ').split(" ");
        } else {
            var vals = val.split(",");
        }
        for (var i = 0; i < vals.length; i++) {
            vals[i] = vals[i].trim();
        }
        var nfound = 0;
        $(searcher).parent().parent().find(".opt:not(.notfound)").each(function () {
            var search = $(this).attr("search");
            var pass = true;
            for (var i = 0; i < vals.length; i++) {
                if (search.indexOf(vals[i]) > -1) {
                } else {
                    pass = false;
                }
            }
            if (pass) {
                $(this).show();
                nfound++;
            }
        });
        if (nfound == 0) {
            $(searcher).parent().parent().find(".opt.notfound").show();
        }
    }
}

function poec_nsimSetFilter(selnode) {
    var cval = $(selnode).attr("curval");
    $(selnode).removeClass("toggled");
    $(selnode).parent().parent().parent().removeClass("toggled");
    $(selnode).find(".opt").removeClass("selected");
    if (cval == "null") {
        $(selnode).addClass("init").find(".current").html($(selnode).attr("iniset"));
        $(selnode).parent().parent().parent().addClass("init");
    } else {
        $(selnode).removeClass("init").find(".current").html($(selnode).find(".mkey_" + cval).html());
        $(selnode).find(".mkey_" + cval).addClass("selected");
        $(selnode).parent().parent().parent().removeClass("init");
        var elevated = parseInt($(selnode).find(".mkey_" + cval).attr("elevated"));
        if (isNaN(elevated)) {
            elevated = 0;
        }
        if (elevated == 1) {
            var minval = 0;
        } else {
            var minval = 1;
        }
        $(selnode).parent().parent().removeClass("just_min pseudo");
        if ($(selnode).find(".mkey_" + cval).attr("apply_class")) {
            $(selnode).parent().parent().addClass($(selnode).find(".mkey_" + cval).attr("apply_class"));
        }
        if ($(selnode).parent().parent().parent().parent().parent().hasClass("dvalues")) {
            var tmaxval = $(selnode).find(".mkey_" + cval).attr("mvals");
        } else {
            var tmaxval = $(selnode).find(".mkey_" + cval).attr("mtiers");
        }
        $(selnode).parent().parent().find("input.treshold").attr({"maxval": tmaxval, "minval": minval});
        $(selnode).parent().parent().find("input.max").attr({"maxval": tmaxval, "minval": minval});
    }
}

function poec_nsimFilterGroupAdd(selnode) {
    var curval = $(selnode).attr("curval");
    if (curval != "null") {
        $(selnode).attr("curval", "null");
        poec_nsimSetFilter(selnode);
        var nstep = $(selnode).attr("nstep");
        var vHTML = poec_nsimAddConditionZone(nstep, curval, "normal");
        $(selnode).parent().parent().before(vHTML);
        poec_nsimInitFilters($(selnode).parent().parent().prev());
        poec_nsimInitInputs($(selnode).parent().parent().prev());
        poec_nsimBlockFilters($(selnode).parent().parent().prev(), nstep);
    }
}

function poec_nsimCopyStepFilters(selnode) {
    var curval = $(selnode).attr("curval");
    if (curval != "null") {
        $(selnode).attr("curval", "null");
        poec_nsimSetFilter(selnode);
        var nstep = $(selnode).attr("nstep");
        var ccv = $("#poecSimSeqStep" + curval).find(".method").find(".nsimsel:eq(0)").attr("curval");
        var cHTML = "";
        if (ccv == "modunveil") {
            $("#poecSimSeqStep" + curval).find(".unveil_area").find(".condition_zone").each(function () {
                var gtype = $(this).attr("gtype");
                cHTML += "<div class='condition_zone gtype_" + gtype + "' gtype='" + gtype + "'>";
                cHTML += $(this).html();
                cHTML += "</div>";
            });
            $("#poecSimSeqStep" + nstep).find(".unveil_area").find(".condition_zone").remove();
            $("#poecSimSeqStep" + nstep).find(".unveil_area").prepend(cHTML);
            $("#poecSimSeqStep" + curval).find("input").each(function (idx) {
                $("#poecSimSeqStep" + nstep).find("input").eq(idx).val($(this).val());
            });
            $("#poecSimSeqStep" + nstep).find(".unveil_area").find(".condition_zone").each(function () {
                poec_nsimInitFilters($(this));
                poec_nsimInitInputs($(this));
                poec_nsimBlockFilters($(this), nstep);
            });
        } else {
            $("#poecSimSeqStep" + curval).find(".condition_area").find(".condition_zone").each(function () {
                var gtype = $(this).attr("gtype");
                cHTML += "<div class='condition_zone gtype_" + gtype + "' gtype='" + gtype + "'>";
                cHTML += $(this).html();
                cHTML += "</div>";
            });
            $("#poecSimSeqStep" + nstep).find(".condition_area").find(".condition_zone").remove();
            $("#poecSimSeqStep" + nstep).find(".condition_area").prepend(cHTML);
            $("#poecSimSeqStep" + curval).find("input").each(function (idx) {
                $("#poecSimSeqStep" + nstep).find("input").eq(idx).val($(this).val());
            });
            $("#poecSimSeqStep" + nstep).find(".condition_area").find(".condition_zone").each(function () {
                poec_nsimInitFilters($(this));
                poec_nsimInitInputs($(this));
                poec_nsimBlockFilters($(this), nstep);
            });
        }
        poec_nsimResequenceFilters(nstep);
        $("#poecSimAdvOptTog" + nstep).click();
    }
}

function poec_simResetFilters(nstep) {
    $("#poecSimSeqStep" + nstep).find(".condition_area").find(".condition_zone").remove();
    var vHTML = poec_nsimAddConditionZone(nstep, "and", "normal");
    $("#poecSimSeqStep" + nstep).find("#poecSimCondGroupSet").before(vHTML);
    poec_nsimInitFilters($("#poecSimSeqStep" + nstep).find("#poecSimCondGroupSet").prev());
    poec_nsimInitInputs($("#poecSimSeqStep" + nstep).find("#poecSimCondGroupSet").prev());
    poec_nsimBlockFilters($("#poecSimSeqStep" + nstep).find("#poecSimCondGroupSet").prev(), nstep);
    $("#poecSimAdvOptTog" + nstep).click();
}

/********************/

/* SELECTOR BUILDER */
/************* ******/
function poec_nsimOutputSelector(selindex, stype, sparent, sfilter, cval, req) {
    var addcls = "";

    if (req) {
        req = " req";
    } else {
        req = "";
    }

    /*
    var sid=$("#poecSimSeqZone").find(".nsimsel:not(.child)").length;
    sid="nsimsel"+(sid+1);
    */
    sid = "nsimsel" + nsim_curseli;
    nsim_curseli++;

    if (sparent != null) {
        addcls += " " + sparent;
    }

    var selhtml = poecsim_selectors[selindex]["html"];

    if (sfilter) {
        $("#poecSimTmpZone").html(selhtml);
        poec_nsimSelectorFilter($("#poecSimTmpZone"), selindex);
        selhtml = $("#poecSimTmpZone").html();
    }

    if (simulator_selinits[stype] != undefined) {
        var iniset = applyLang(simulator_selinits[stype]);
    } else {
        var iniset = applyLang("Choose an option");
    }

    var numsel = 1;
    var mulsel = 0;
    if (poecsim_selectors[selindex]["settings"]["subsel"] != undefined) {
        numsel = poecsim_selectors[selindex]["settings"]["subsel"];
        mulsel = 1;
    }

    var searchable = 0;
    if (poecsim_selectors[selindex]["settings"]["subsearch"]) {
        searchable = 1;
        addcls += " searchable";
    }

    var vHTML = "<div class='nsimselholder'><div id='" + sid + "' class='nsimsel noselect med_shadow " + stype + req + addcls + "' searchable='" + searchable + "' numsel='" + numsel + "' mulsel='" + mulsel + "' sparent='" + sparent + "' sindex='" + sid + "' skey='" + selindex + "' iniset='" + iniset + "' curval='" + cval + "'><div class='current'></div><div class='options med_shadow'><div class='wrapper'>";
    vHTML += selhtml;
    vHTML += "</div></div></div></div>";
    return vHTML;
}

function poec_nsimInitSelectors(cnode) {
    $(cnode).find(".nsimsel").each(function () {
        poec_nsimInitSelector($(this));
    });
}

function poec_nsimCloseSelectors() {
    $(".nsimsel").removeClass("toggled");
    $(".nsimfilter").removeClass("toggled");
    $(".nsimfilter_holder").removeClass("toggled");
}

function poec_nsimInitSelector(selnode) {
    var skey = $(selnode).attr("skey");
    if (skey != "bench" && !$(selnode).hasClass("tags")) {
        $(selnode).attr("tabindex", -1).blur(function () {
            $(this).removeClass("toggled");
        });
    }
    $(selnode).find(".current").click(function () {
        $(this).parent().removeClass("error");
        poec_nsimCloseSelectors(); // Close all other nsimsel that might be opened
        var snode = $(this).parent();
        if (!$(snode).hasClass("locked")) {
            $(snode).find(".options").css({"width": "auto"});
            $(snode).removeClass("noscroll").addClass("toggled");
            var cwidth = $(snode).outerWidth();
            var owidth = $(snode).find(".options").outerWidth();
            if (owidth < cwidth) {
                $(snode).find(".options").css({"width": cwidth});
            }
            var wheight = $(snode).find(".options").find(".wrapper").outerHeight();
            var oheight = $(snode).find(".options").outerHeight();
            if (wheight <= oheight) {
                $(snode).addClass("noscroll");
            }
            $(snode).find(".options").scrollTop(0);

            if ($(snode).hasClass("searchable")) {
                if ($(this).children("input").length == 0) {
                    $("<input>").addClass("searcher").blur(function (event) {
                        if (!$(event.relatedTarget).hasClass("opt")) {
                            $(this).parent().parent().removeClass("toggled");
                            $(this).parent().parent().parent().parent().parent().removeClass("toggled");
                        }
                    }).keyup(function () {
                        poec_nsimFilterSelector($(this));
                    }).appendTo($(this));
                }
                $(this).find(".searcher").val("").show().select();
                poec_nsimFilterSelector($(this).find(".searcher"));
            }
        }
    });
    $(selnode).find(".opt:not(.notfound)").click(function () {
        if (!$(this).hasClass("disabled")) {
            var mkey = $(this).attr("mkey");
            var snode = $(this).parent().parent().parent();
            var skey = $(snode).attr("skey");
            var curval = $(snode).attr("curval");
            var numsel = parseInt($(snode).attr("numsel"));
            var mulsel = parseInt($(snode).attr("mulsel"));
            if (mulsel == 1) {
                switch (skey) {
                    case 'bench' :
                        if (curval != "null") {
                            var tcv = mkey.split("t");
                            var splitsel = curval.substring(1, curval.length - 1).split("|");
                            for (var z = 0; z < splitsel.length; z++) {
                                var tsel = splitsel[z].split("t");
                                if (tcv[0] == tsel[0]) {
                                    curval = curval.replace("|" + splitsel[z] + "|", "|");
                                    if (curval == "|") {
                                        curval = "null";
                                    }
                                }
                            }
                        }
                        break;
                }

                // Multiple selector
                curnsel = 0;
                if (curval != "null") {
                    var splitsel = curval.substring(1, curval.length - 1).split("|");
                    curnsel = splitsel.length;
                }
                if (curval.indexOf("|" + mkey + "|") > -1) {
                    // Already selected, do nothing
                } else {
                    if (curval == "null") {
                        curval = "|";
                    }
                    if (curnsel >= numsel) {
                        // Selection limit
                    } else {
                        curval += mkey + "|";
                    }
                }
                if (curval == "null") {
                    $(snode).removeClass("hasdata");
                } else {
                    $(snode).addClass("hasdata");
                }
                $(snode).attr("curval", curval);
                poec_nsimSetSelector($(snode));
                poec_nsimCheckAddStepValid();
            } else {
                if (mkey != curval) {
                    $(snode).attr("curval", mkey);
                    poec_nsimSetSelector($(snode));
                    if (!$(snode).hasClass("custom")) {
                        poec_nsimSetSelChilds($(snode), skey);
                        poec_nsimCheckAddStepValid();
                        poec_nsimUpdateCurrentState();
                    } else {
                        var customtype = $(snode).attr("customtype");
                        switch (customtype) {
                            case 'fgroupadd' :
                                poec_nsimFilterGroupAdd($(snode));
                                break;
                            case 'copystep' :
                                poec_nsimCopyStepFilters($(snode));
                                break;
                            default:
                                break;
                        }
                    }
                } else {
                    $(snode).removeClass("toggled");
                }
            }
        }
    });
    poec_nsimSetSelector(selnode);
}

function poec_nsimFilterSelector(searcher) {
    var val = $(searcher).val().toLowerCase().trim();
    $(searcher).parent().parent().find(".opt.notfound").hide();
    if (val == "") {
        $(searcher).parent().parent().find(".opt:not(.notfound)").show();
    } else {
        $(searcher).parent().parent().find(".opt:not(.notfound)").hide();
        if (val.substring(0, 1) == "~") {
            val = val.substring(1);
            var vals = val.trim().replace(/\s\s+/g, ' ').split(" ");
        } else {
            var vals = val.split(",");
        }
        for (var i = 0; i < vals.length; i++) {
            vals[i] = vals[i].trim();
        }
        var nfound = 0;
        $(searcher).parent().parent().find(".opt:not(.notfound)").each(function () {
            var search = $(this).attr("search");
            var pass = true;
            for (var i = 0; i < vals.length; i++) {
                if (search.indexOf(vals[i]) > -1) {
                } else {
                    pass = false;
                }
            }
            if (pass) {
                $(this).show();
                nfound++;
            }
        });
        if (nfound == 0) {
            $(searcher).parent().parent().find(".opt.notfound").show();
        }
    }
}

var nsim_stepblocks = {};

function poec_nsimSetSelector(selnode) {
    var cval = $(selnode).attr("curval");
    $(selnode).removeClass("toggled");
    $(selnode).find(".opt").removeClass("selected");
    var skey = $(selnode).attr("skey");

    var nstep = $(selnode).parent().parent().parent().attr("nstep");

    if (cval != "woke" && cval != "recombinate") {
        $(selnode).parent().find(".woker").remove();
    }
    var sautopass = false;
    var snoautopass = false;
    switch (skey) {
        case 'bench' :
            if (cval.indexOf("|2964t0|") > -1) {
                $(selnode).attr("numsel", 3);
            } else {
                $(selnode).attr("numsel", 1);
            }
            break;
        case 'gems':
        case 'class':
        case 'archs':
        case 'focus':
            poec_nsimUpdateSaveSettings();
            break;
        case 'tangled':
            if ($(selnode).hasClass("pos")) {
                var othis = "neg";
            } else {
                var othis = "pos";
            }
            $(selnode).parent().parent().find(".tangled." + othis).find(".opt").removeClass("disabled");
            if (cval != "null") {
                $(selnode).parent().parent().find(".tangled." + othis).find(".opt.mkey_" + cval).addClass("disabled");
            }
            break;
        case 'metamethod' :
            if (cval != "null") {
                sautopass = simulator_metam[cval]["autopass"];
                if (!sautopass) {
                    snoautopass = true;
                }
            }
            break;
    }
    switch (cval) {
        case 'woke' :
            // Check if woke item importer is already there, if not, create
            if ($(selnode).parent().find(".woker").length == 0) {
                var vWoker = "";
                vWoker += "<div class='wokeritemviewer med_shadow'>" + applyLang("item") + "</div><div class='hidden wokeritemdata'></div><div class='itempreview med_shadow'></div>";
                $("<div>").addClass("woker init").html(vWoker).hover(function () {
                    var idata = $(this).find(".wokeritemdata").html();
                    var pHTML = "";
                    if (idata != "") {
                        idata = jQuery.parseJSON(idata);
                        var nidata = {
                            "quality": idata["settings"]["quality"],
                            "catalyst": null,
                            "affixes": idata["crsets"]["affixes"],
                            "implicits": idata["crsets"]["implicits"],
                            "eldritch": idata["crsets"]["eldritch"],
                            "enchant": "",
                            "influences": idata["settings"]["influences"],
                            "rarity": idata["settings"]["rarity"],
                            "ilvl": idata["settings"]["ilvl"],
                            "base": idata["settings"]["base"]
                        };
                        pHTML = poec_simGetFullItem(nidata, idata["settings"]["bitem"], "Source item", "simulator", true);
                    } else {
                        pHTML = applyLang("<div class='msg'>Click to set up item to awaken</div>");
                    }
                    $(this).find(".itempreview").html(pHTML).show();
                }, function () {
                    $(this).find(".itempreview").hide();
                }).click(function () {
                    simulator_curwokeimport = $(this);
                    poec_importItem("nsimwoker");
                }).insertAfter($(selnode));
            }
            break;
        case 'recombinate' :
            // Check if recombinator item importer is already there, if not, create
            if ($(selnode).parent().find(".recomb").length == 0) {
                var vRecomb = "";
                vRecomb += "<div class='wokeritemviewer med_shadow'>" + applyLang("item") + "</div><div class='hidden wokeritemdata'></div><div class='itempreview med_shadow'></div>";
                $("<div>").addClass("woker init").html(vRecomb).hover(function () {
                    var idata = $(this).find(".wokeritemdata").html();
                    var pHTML = "";
                    if (idata != "") {
                        idata = jQuery.parseJSON(idata);
                        var nidata = {
                            "quality": idata["settings"]["quality"],
                            "catalyst": null,
                            "affixes": idata["crsets"]["affixes"],
                            "implicits": idata["crsets"]["implicits"],
                            "eldritch": idata["crsets"]["eldritch"],
                            "enchant": "",
                            "influences": idata["settings"]["influences"],
                            "rarity": idata["settings"]["rarity"],
                            "ilvl": idata["settings"]["ilvl"],
                            "base": idata["settings"]["base"],
                            "bitem": idata["settings"]["bitem"]
                        };
                        pHTML = poec_simGetFullItem(nidata, idata["settings"]["bitem"], "Source item", "simulator", true);
                    } else {
                        pHTML = applyLang("<div class='msg'>Click to set up item to recombinate</div>");
                    }
                    $(this).find(".itempreview").html(pHTML).show();
                }, function () {
                    $(this).find(".itempreview").hide();
                }).click(function () {
                    simulator_currecombimport = $(this);
                    poec_importItem("nsimrecomb");
                }).insertAfter($(selnode));
            }
            break;
    }

    $("#poecSimCondArea" + nstep).removeClass("noshow");
    var haddvalues = $("#poecSimCondArea" + nstep).hasClass("dvalues");
    $("#poecSimCondArea" + nstep).removeClass("dvalues");
    $("#poecSimUnveilArea" + nstep).hide();
    $("#poecSimFailMode" + nstep).find(".loop").show();
    switch (cval) {
        case 'divine' :
        case 'hrrvpsi' :
        case 'hrrvp' :
        case 'hrrvs' :
        case 'breroll' :
            $("#poecSimCondArea" + nstep).addClass("dvalues");
            break;
        case 'modunveil' :
            $("#poecSimCondArea" + nstep).addClass("noshow");
            $("#poecSimUnveilArea" + nstep).show();
            break;
        case 'check' :
            $("#poecSimFailMode" + nstep).find(".loop").hide();
            if ($("#poecSimFailMode" + nstep).find(".loop").hasClass("selected")) {
                $("#poecSimFailMode" + nstep).find(".loop").removeClass("selected");
                $("#poecSimFailMode" + nstep).find(".restart").addClass("selected");
            }
            break;
    }
    var hasdvalues = $("#poecSimCondArea" + nstep).hasClass("dvalues");
    if (hasdvalues != haddvalues) {
        // Reset max vals and check that they are not over max
        $("#poecSimCondArea" + nstep).find(".nsimfilter_holder:not(.init)").find(".nsimfilter").each(function () {
            var curval = $(this).attr("curval");
            if (hasdvalues) {
                var tmaxval = $(this).find(".opt.mkey_" + curval).attr("mvals");
            } else {
                var tmaxval = $(this).find(".opt.mkey_" + curval).attr("mtiers");
            }
            tmaxval = parseFloat(tmaxval);
            if (isNaN(tmaxval)) {
                tmaxval = 0;
            }
            $(this).parent().parent().find("input.treshold").attr({"maxval": tmaxval});
            var ctv = parseFloat($(this).parent().parent().find("input.treshold").val());
            if (ctv > tmaxval) {
                $(this).parent().parent().find("input.treshold").val(tmaxval);
            }
        });
    }

    var tgrpsel = "|";
    $(selnode).parent().parent().find(".nsimsel").each(function () {
        tgrpsel += $(this).attr("curval") + "|";
    });

    var noautosuccess = false;
    for (var i = 0; i < simulator_noautosuccess.length; i++) {
        if (tgrpsel.indexOf("|" + simulator_noautosuccess[i] + "|") > -1) {
            noautosuccess = true;
        }
    }

    $("#poecSimCondAutoPass" + nstep).removeClass("locked");
    if ($("#poecSimCondAutoPass" + nstep).length > 0) {
        $("#poecSimCondAutoPass" + nstep).mcuiCheck().disable(0);
    }
    if (snoautopass) {
        noautosuccess = snoautopass;
    }
    $("#poecSimCondAutoPass" + nstep).parent().show();
    if (!noautosuccess) {
        $("#poecSimSeqStep" + nstep).find(".autopassopts").show();
        var alwaysauto = false;
        for (var i = 0; i < simulator_alwaysautopass.length; i++) {
            if (tgrpsel.indexOf("|" + simulator_alwaysautopass[i] + "|") > -1) {
                alwaysauto = true;
            }
        }
        if (sautopass) {
            alwaysauto = sautopass;
        }
        if (alwaysauto) {
            $("#poecSimCondAutoPass" + nstep).addClass("locked");
            if ($("#poecSimCondAutoPass" + nstep).length > 0) {
                $("#poecSimCondAutoPass" + nstep).mcuiCheck().disable(1);
            }
            if (!$("#poecSimCondAutoPass" + nstep).hasClass("ischecked")) {
                $("#poecSimCondAutoPass" + nstep).mcuiCheck().setState(1);
                poec_nsimToggleAutoPass(1, $("#poecSimCondAutoPass" + nstep));
            }
        }
    } else {
        if ($("#poecSimCondAutoPass" + nstep).hasClass("ischecked")) {
            $("#poecSimCondAutoPass" + nstep).mcuiCheck().setState(0);
            poec_nsimToggleAutoPass(0, $("#poecSimCondAutoPass" + nstep));
        }
        if (tgrpsel.indexOf("|check|") > -1) {
            $("#poecSimSeqStep" + nstep).find(".autopassopts").show();
            $("#poecSimCondAutoPass" + nstep).parent().hide();
        } else {
            $("#poecSimSeqStep" + nstep).find(".autopassopts").hide();
        }
    }

    var numsel = parseInt($(selnode).attr("numsel"));
    var mulsel = parseInt($(selnode).attr("mulsel"));
    if (mulsel == 1) {
        $(selnode).addClass("init").find(".current").html($(selnode).attr("iniset"));
        $(selnode).next(".nselwhat").remove();
        if (cval != "null") {
            var splitsel = cval.substring(1, cval.length - 1).split("|");
            if (splitsel.length > numsel) {
                var newval = "|";
                var nspsel = [];
                for (var i = 0; i < numsel; i++) {
                    nspsel.push(splitsel[i]);
                    newval += splitsel[i] + "|";
                }
                splitsel = nspsel;
                $(selnode).attr("curval", newval);
            }
            var vHTML = "<div class='nselwhat'>";
            for (var i = 0; i < splitsel.length; i++) {
                $(selnode).find(".mkey_" + splitsel[i]).addClass("selected");
                vHTML += "<div class='nselholder'><div class='nsel med_shadow' mkey='" + splitsel[i] + "'>" + $(selnode).find(".mkey_" + splitsel[i]).html() + "<div class='mcui-button remnsel' onClick='poec_nsimRemoveNSel(this)'>X</div></div></div>";
            }
            vHTML += "</div>";
            $(selnode).after(vHTML);
            $(selnode).addClass("hasdata");
        } else {
            $(selnode).removeClass("hasdata");
        }
    } else {
        if (cval == "null") {
            $(selnode).addClass("init").find(".current").html($(selnode).attr("iniset"));
        } else {
            $(selnode).removeClass("init").find(".current").html($(selnode).find(".mkey_" + cval).html());
            $(selnode).find(".mkey_" + cval).addClass("selected");
        }
    }

    var blocks = null;

    switch (skey) {
        case 'fossil' :
            var cval = $(selnode).attr("curval");
            if (cval != "null") {
                // Build a block list
                var splitsel = cval.substring(1, cval.length - 1).split("|");
                var blocks = {};
                for (var i = 0; i < splitsel.length; i++) {
                    if (poecd['fossils']['ind'][splitsel[i]] != undefined) {
                        var fodat = poecd['fossils']['seq'][poecd['fossils']['ind'][splitsel[i]]];
                        var fomods = jQuery.parseJSON(fodat["mod_data"]);
                        if (fomods) {
                            $.each(fomods, function (ident, weight) {
                                if (weight == 0) {
                                    blocks[ident] = true;
                                }
                            });
                        }
                    }
                }
                // Remove already selector modifiers from said block list
                $("#poecSimCondArea" + nstep).find(".nsimfilter_holder:not(.init)").find(".nsimfilter").each(function () {
                    var curval = $(this).attr("curval");
                    var filter = $(this);
                    var block = false;
                    $.each(blocks, function (mtkey, mtbool) {
                        if ($(filter).find(".opt.mkey_" + curval + "." + mtkey).length > 0) {
                            block = true;
                        }
                    });
                    if (block) {
                        $(this).attr("curval", "null");
                        poec_nsimSetSelector($(this));
                    }
                });
                // Make tangled selectors appear if they are not already there
                if (cval.indexOf("tangled") > -1) {
                    if ($(selnode).parent().find(".stangled").length == 0) {
                        var tangling = $(selnode).attr("tangling");
                        var spos = "null";
                        var npos = "null";
                        if (tangling) {
                            tangling = jQuery.parseJSON(tangling);
                            $(selnode).attr("tangling", "");
                            spos = tangling["pos"];
                            npos = tangling["neg"];
                        }
                        var vHTML = "<div class='stangled'>";
                        vHTML += "<div class='nsimselholder'><div><div class='label'>Greatly more</div></div><div id='tangled" + nstep + "pos' class='nsimsel tangled pos noselect med_shadow' searchable='0' numsel='1' mulsel='0' sparent='null' sindex='tangled" + nstep + "pos' skey='tangled' iniset='" + applyLang("Choose a tag") + "' curval='" + spos + "'><div class='current'></div><div class='options med_shadow'><div class='wrapper'>";
                        vHTML += peocsim_tangled;
                        vHTML += "</div></div></div></div>";
                        vHTML += "<div class='nsimselholder'><div><div class='label'>No</div></div><div id='tangled" + nstep + "neg' class='nsimsel tangled neg noselect med_shadow' searchable='0' numsel='1' mulsel='0' sparent='null' sindex='tangled" + nstep + "neg' skey='tangled' iniset='" + applyLang("Choose a tag") + "' curval='" + npos + "'><div class='current'></div><div class='options med_shadow'><div class='wrapper'>";
                        vHTML += peocsim_tangled;
                        vHTML += "</div></div></div></div>";
                        vHTML += "</div>";
                        $(selnode).parent().append(vHTML);
                        poec_nsimInitSelector($(selnode).parent().find(".nsimsel.tangled.pos"));
                        poec_nsimInitSelector($(selnode).parent().find(".nsimsel.tangled.neg"));
                    }
                } else {
                    // Remove tangled selectors if they were there
                    $(selnode).parent().find(".stangled").remove();
                }
            } else {
                // Remove tangled selectors if they were there
                $(selnode).parent().find(".stangled").remove();
            }
            break;
    }

    nsim_stepblocks[nstep] = blocks;

    switch (skey) {
        case 'fossil' :
            poec_nsimBlockFilters($("#poecSimCondArea" + nstep), nstep);
            break;
    }
}

function poec_nsimBlockFilters(nnode, nstep) {
    $(nnode).find(".nsimfilter").find(".opt").removeClass("blocked");
    if (nsim_stepblocks[nstep]) {
        var jqsel = "";
        $.each(nsim_stepblocks[nstep], function (mtype, mbool) {
            jqsel += ",." + mtype;
        });
        jqsel = jqsel.substring(1);
        $(nnode).find(".nsimfilter").find(".options").find(jqsel).addClass("blocked");
    }
}

function poec_nsimRemoveNSel(vThis) {
    if ($(vThis).hasClass("red")) {
        var mkey = $(vThis).parent().attr("mkey");
        var nsimnode = $(vThis).parent().parent().parent().parent().children(".nsimsel");
        var curval = $(nsimnode).attr("curval");
        curval = curval.replace("|" + mkey + "|", "|");
        if (curval == "|") {
            curval = "null";
        }
        if (curval == "null") {
            $(nsimnode).removeClass("hasdata");
        } else {
            $(nsimnode).addClass("hasdata");
        }
        $(nsimnode).attr("curval", curval);
        poec_nsimSetSelector($(nsimnode));
        poec_nsimCheckAddStepValid();
    } else {
        $(vThis).addClass("red");
    }
}

function poec_nsimSetSelChilds(selnode, parkey) {
    var sid = $(selnode).attr("id");
    // Destroy all childs
    $("." + sid).parent().remove();

    var skey = $(selnode).attr("curval");
    if (skey != "null") {
        // Options
        if (poec_cmethods[skey] != undefined) {
            if (poec_cmethods[skey]["options"] != undefined) {
                for (var i = 0; i < poec_cmethods[skey]["options"].length; i++) {
                    var oHTML = "";
                    switch (poec_cmethods[skey]["options"][i]["type"]) {
                        case 'check' :
                            if (poec_cmethods[skey]["options"][i]["default"]) {
                                var checked = "ischecked";
                            } else {
                                var checked = "unchecked";
                            }
                            oHTML += "<div class='optholder'><div class='mcui-checkbox med_shadow nopt nopt_" + poec_cmethods[skey]["options"][i]["id"] + " " + checked + " " + sid + "' opttype='check' optid='" + poec_cmethods[skey]["options"][i]["id"] + "'>" + poec_cmethods[skey]["options"][i]["name"] + "</div></div>";
                            $(selnode).parent().after(oHTML);
                            $(selnode).parent().next(".optholder").children(".mcui-checkbox").mcuiCheck();
                            break;
                        case 'radio' :
                            oHTML += "<div class='optholder'><label>" + poec_cmethods[skey]["options"][i]["name"] + "</label><div class='mcui-radio med_shadow nopt nopt_" + poec_cmethods[skey]["options"][i]["id"] + " " + sid + "' opttype='radio' optid='" + poec_cmethods[skey]["options"][i]["id"] + "'>";
                            for (var j = 0; j < poec_cmethods[skey]["options"][i]["choices"].length; j++) {
                                var addcls = "";
                                var tooltip = "";
                                if (poec_cmethods[skey]["options"][i]["choices"][j]["desc"]) {
                                    addcls = "htooltip";
                                    tooltip = "tooltip='" + poec_cmethods[skey]["options"][i]["choices"][j]["desc"] + "'";
                                }
                                if (poec_cmethods[skey]["options"][i]["default"] == poec_cmethods[skey]["options"][i]["choices"][j]["value"]) {
                                    var sel = " selected";
                                } else {
                                    var sel = "";
                                }
                                oHTML += "<div class='choice " + addcls + " " + sel + "' " + tooltip + ">" + poec_cmethods[skey]["options"][i]["choices"][j]["name"] + "<div class='value'>" + poec_cmethods[skey]["options"][i]["choices"][j]["value"] + "</div></div>";
                            }
                            oHTML += "</div></div>";
                            $(selnode).parent().after(oHTML);
                            $(selnode).parent().next(".optholder").children(".mcui-radio").mcuiRadio();
                            $(selnode).parent().next(".optholder").children(".mcui-radio").find(".htooltip").hover(function () {
                                $(this).find(".tooltip").show();
                            }, function () {
                                $(this).find(".tooltip").hide();
                            }).each(function () {
                                $("<div>").addClass("tooltip").html($(this).attr("tooltip")).appendTo($(this));
                            });
                            break;
                    }
                }
            }
        }
        // Childs
        if (poecsim_selectors[skey] != undefined) {
            if (poecsim_selectors[skey]["html"] != undefined) {
                var req = false;
                if ($(selnode).hasClass("req")) {
                    req = true;
                }
                var sindex = $(selnode).attr("sindex");
                var sparent = $(selnode).attr("sparent");
                if (sparent != "null") {
                    sindex += " " + sparent;
                }
                // Rebuild first child
                var csel = poec_nsimOutputSelector(skey, skey, sindex, true, null, req);
                $(selnode).parent().after(csel);
                poec_nsimInitSelector($(selnode).parent().next(".nsimselholder").children(".nsimsel"));
                if (parkey == "essence") {
                    // Auto-select highest tier
                    $(selnode).parent().next(".nsimselholder").children(".nsimsel").attr("curval", $(selnode).parent().next(".nsimselholder").children(".nsimsel").find(".opt:last").attr("mkey"));
                    poec_nsimSetSelector($(selnode).parent().next(".nsimselholder").children(".nsimsel"));
                }
            }
        }
    }
}

/****************/
/* FILTER LOGIC */
/****************/
var simulator_mtoggles = {};

function poec_nsimSetMethodToggles(mkey, mdata, mcustom) {
    if (mdata == "custom") {
        // TODO for custom
    } else {
        $.each(mdata, function (key, dat) {
            if (dat["nosim"] != true) {
                simulator_mtoggles[key] = poec_nsimCheckIFilter(key, dat);
                if (dat["subset"] != undefined) {
                    poec_nsimSetMethodToggles(key, dat["subset"], dat["subsim"]);
                }
            }
        });
    }
}

function poec_nsimSelectorFilter(selnode, selindex) {
    if (poecsim_selectors[selindex]["data"] != "custom") {
        $.each(poecsim_selectors[selindex]["data"], function (skey, sdata) {
            var enabled = true;
            if (!simulator_mtoggles[skey]) {
                enabled = false;
            } else {
                //enabled=poec_nsimCheckFilter(sdata);
            }
            if (!enabled) {
                $(selnode).find(".mkey_" + skey).addClass("disabled"); // Tempo disable filtering here, TODO
            }
        });
    }
}

// Check initial filtering according to starting item state
function poec_nsimCheckIFilter(ikey, dat) {
    var pass = true;
    if (dat["required"] != undefined) {
        $.each(dat["required"], function (key, val) {
            switch (key) {
                case "flags" :
                    for (var i = 0; i < val.length; i++) {
                        if (simulator_data[val[i]] == 0) {
                            pass = false;
                            break;
                        }
                    }
                    break;
                case 'ilvl' :
                    if (simulator_settings["ilvl"] < val) {
                        pass = false;
                    }
                    break;
                case "bgroup" :
                    if (val.indexOf("|" + simulator_settings["bgroup"] + "|") > -1) {
                    } else {
                        pass = false;
                    }
                    break;
            }
        });
    }
    if (pass) {
        if (dat["cannot"] != undefined) {
            $.each(dat["cannot"], function (key, val) {
                switch (key) {
                    case "bgroup" :
                        if (val.indexOf("|" + simulator_settings["bgroup"] + "|") > -1) {
                            pass = false;
                        }
                        break;
                    case 'influenced' :
                        if (simulator_settings["influences"]) {
                            pass = false;
                        }
                        break;
                    case 'fractured' :
                        // TODO

                        break;
                }
            });
        }
    }
    return pass;
}

// Check live filtering according to current item state
function poec_nsimCheckFilter(dat) {
    var pass = true;
    var fsource = simulator_states["states"][simulator_states["states"].length - 1];
    if (dat["required"] != undefined) {
        $.each(dat["required"], function (key, val) {
            switch (key) {
                case 'rarity' :
                    if (val != fsource["rarity"]) {
                        pass = false;
                    }
                    break;
            }
        });
    }
    if (pass) {
        if (dat["cannot"] != undefined) {
            $.each(dat["cannot"], function (key, val) {
                switch (key) {

                }
            });
        }
    }
    return pass;
}

/* EXPORT/IMPORT */
function poec_nsimExportData() {
    $("#crnsimExportToggler").hide();
    poec_nsimGenerateConfigData();
    var new_data = jQuery.parseJSON(JSON.stringify(simulator_data));
    new_data["fmodpool"] = null;
    new_data["cmodpool"] = null;
    new_data["veiledmods"] = null;
    new_data["hmodpool"] = null;
    new_data["affbymgrp"] = null;
    new_data["mgrpdata"] = null;
    new_data["mtypes"] = null;
    var exp_results = null;
    if ($("#poecSimExportResults").mcuiCheck().getVal()) {
        if (nsim_results) {
            exp_results = jQuery.parseJSON(JSON.stringify(nsim_results));
        }
    }
    var exp_items = null;
    if ($("#poecSimExportItems").mcuiCheck().getVal()) {
        if (nsim_items) {
            exp_items = jQuery.parseJSON(JSON.stringify(nsim_items));
        }
    }
    var expdata = {
        "settings": simulator_settings,
        "data": new_data,
        "config": simulator_config,
        "flow": simulator_flow,
        "states": simulator_states,
        "results": exp_results,
        "items": exp_items
    };
    $("#crnsimExportArea").val(JSON.stringify(expdata));
    $("#crnsimExportToggled").show();
}

function poec_nsimCloseExporter() {
    $("#crnsimExportToggled").hide();
    $("#crnsimExportArea").val("");
    $("#crnsimExportToggler").show();
}

function poec_nsimImportCheck() {
    if ($("#nsimImportArea").val().trim() != "" || $("#nsimImportInput").val().trim() != "") {
        $("#nsimImportBtn").css({"display": "inline-block"});
    }
}

function poec_nsimImportGo(data, init) {
    var import_success = false;
    if (data || !init) {
        try {
            var import_data = jQuery.parseJSON(data);
            import_success = true;
            if (import_data["params"]) {
                import_success = false;
                $("#nsimImportBtn").mcuiNotice({
                    text: applyLang("This appears to be an emulator dataset!"),
                    type: "alert"
                }).showNotice();
                $("#nsimImportBtn").mcuiNotice().setText("This appears to be an emulator dataset!");
            }
        } catch (err) {
            $("#nsimImportBtn").mcuiNotice({text: applyLang("Invalid dataset"), type: "alert"}).showNotice();
        }
    } else {
        var pastebin = $("#nsimImportInput").val().trim();
        if (pastebin) {
            // Ajax the thing
            $("#nsimSourceInt").hide();
            $("#nsimSourceInt").after('<div id="poecModDistBigLoader" class="pastebin" style="padding:30px 0px"><img src="../../images/ajax-loader-dark.gif"></div>');
            var acajax = new mc_ajax("../../cgi/web/custom/get_pastebin.php", "url=" + encodeURIComponent(pastebin), {
                complete: function (result) {
                    $("#poecModDistBigLoader.pastebin").remove();
                    $("#nsimSourceInt").show();
                    poec_nsimImportGo(result, false);
                }
            });
        } else {
            try {
                var import_data = jQuery.parseJSON($("#nsimImportArea").val());
                import_success = true;
                if (import_data["params"]) {
                    import_success = false;
                    $("#nsimImportBtn").mcuiNotice({
                        text: applyLang("This appears to be an emulator dataset!"),
                        type: "alert"
                    }).showNotice();
                    $("#nsimImportBtn").mcuiNotice().setText("This appears to be an emulator dataset!");
                }
            } catch (err) {
                $("#nsimImportBtn").mcuiNotice({text: applyLang("Invalid dataset"), type: "alert"}).showNotice();
            }
        }
    }
    if (import_success) {
        $("#simImportArea").val("");
        $("#nsimSourceInt").find(".step").hide();
        $("#nsimSourceInt").find(".stepload").css({"display": "block"});
        setTimeout(function () {
            poec_nsimImportGoFinal(import_data);
        }, 1);
    }
}

function poec_nsimImportGoFinal(import_data) {
    simulator_settings = import_data["settings"];
    simulator_states = import_data["states"];
    if (import_data["flow"]) {
        simulator_flow = import_data["flow"];
    }
    var simulator_crsets = {
        "affixes": [],
        "implicits": [],
        "meta_flags": {},
        "eldritch": null,
        "iaffbt": {"prefix": 0, "suffix": 0}
    };
    simulator_crsets["affixes"] = import_data["data"]["iaffixes"];
    simulator_crsets["implicits"] = import_data["data"]["implicits"];
    simulator_crsets["meta_flags"] = import_data["data"]["meta_flags"];
    simulator_crsets["eldritch"] = import_data["data"]["eldritch"];
    simulator_crsets["iaffbt"] = import_data["data"]["iaffbt"];
    poec_nsimShowMainInt(simulator_crsets, import_data, null);
    poec_nsimBuildConfig(import_data["config"]);
    nsim_items = [];
    nsim_numsuccess = 0;
    if (import_data["items"]) {
        nsim_items = import_data["items"];
        poec_simOutputRItems();
    }
    if (import_data["results"]) {
        poec_nsimGenerateConfigData();
        nsim_econfig = poec_nsimRelayConfigData(simulator_config);
        nsim_results = import_data["results"];
        $("#poecSimResultsZone").html(poec_simOutputResultsTbl(false));
        $("#poecSimResultsStatus").html("");
    }
}

function poec_nsimBuildConfig(config) {
    for (var i = 0; i < config.length; i++) {
        if (i > 0) {
            poec_nsimAddSeqStep(true, null, null);
        }
    }
    for (var i = 0; i < config.length; i++) {
        var nstep = i + 1;
        // Set method
        if (config[i]["method"]) {
            for (var j = 0; j < config[i]["method"].length; j++) {
                var lastsel = $("#poecSimSeqStep" + nstep).find(".method").find(".nsimsel:last");
                $(lastsel).attr("curval", config[i]["method"][j]);
                var vtype = typeof config[i]["method"][j];
                if (vtype == "String") {
                    if (config[i]["method"][j].indexOf("|tangled|") > -1) {
                        $(lastsel).attr("tangling", JSON.stringify(config[i]["method"][j + 1]));
                    }
                }
                poec_nsimSetSelector($(lastsel));
                poec_nsimSetSelChilds($(lastsel), $(lastsel).attr("skey"));
                switch (config[i]["method"][j]) {
                    case 'woke' :
                    case 'recombinate' :
                        if (config[i]["woking"]) {
                            $(lastsel).parent().find(".woker.init").removeClass("init");
                            $(lastsel).parent().find(".wokeritemdata").html(JSON.stringify(config[i]["woking"]));
                        }
                        break;
                }
                if (vtype == "String") {
                    if (config[i]["method"][j].indexOf("|tangled|") > -1) {
                        break;
                    }
                }
            }
        }
        if (config[i]["mopts"]) {
            $.each(config[i]["mopts"], function (okey, oval) {
                $("#poecSimSeqStep" + nstep).find(".method").find(".nopt_" + okey).each(function () {
                    var opttype = $(this).attr("opttype");
                    switch (opttype) {
                        case 'check' :
                            $(this).mcuiCheck().setState(oval);
                            break;
                        case 'radio' :
                            $(this).mcuiRadio().setVal(oval);
                            break;
                    }
                });
            });
        }
        // Set conditions
        if (config[i]["autopass"]) {
            $("#poecSimCondAutoPass" + nstep).mcuiCheck().setState(1);
            poec_nsimToggleAutoPass(1, $("#poecSimCondAutoPass" + nstep));
        } else {
            if (config[i]["filters"]) {
                if (config[i]["filters"].length > 0) {
                    $("#poecSimCondArea" + nstep).find(".condition_zone").remove();
                    // Create condition zones
                    var cHTML = "";
                    for (j = 0; j < config[i]["filters"].length; j++) {
                        cHTML += poec_nsimAddConditionZone(nstep, config[i]["filters"][j]["type"], "normal");
                    }
                    $("#poecSimCondArea" + nstep).prepend(cHTML);
                    // Init controls
                    poec_nsimInitFilters($("#poecSimCondArea" + nstep));
                    poec_nsimInitInputs($("#poecSimCondArea" + nstep));
                    // Populate and create conditions
                    for (j = 0; j < config[i]["filters"].length; j++) {
                        if (config[i]["filters"][j]["treshold"] != null) {
                            $("#poecSimCondArea" + nstep).find(".condition_zone:eq(" + j + ")").find(".grpmintresh").removeClass("init").val(config[i]["filters"][j]["treshold"]);
                        }
                        for (k = 0; k < config[i]["filters"][j]["conds"].length; k++) {
                            var lastfilter = $("#poecSimCondArea" + nstep).find(".condition_zone:eq(" + j + ")").find(".nsimfilter:last");
                            $(lastfilter).attr("curval", config[i]["filters"][j]["conds"][k]["id"]);
                            if (config[i]["filters"][j]["conds"][k]["treshold"] != null) {
                                $(lastfilter).parent().parent().find("input.treshold").removeClass("init").val(config[i]["filters"][j]["conds"][k]["treshold"]);
                            }
                            if (config[i]["filters"][j]["conds"][k]["max"] != null && config[i]["filters"][j]["conds"][k]["max"] != undefined) {
                                $(lastfilter).parent().parent().find("input.max").removeClass("init").val(config[i]["filters"][j]["conds"][k]["max"]);
                            }
                            if (config[i]["filters"][j]["conds"][k]["init"]) {
                                if (config[i]["filters"][j]["conds"][k]["id"] == "") {
                                    $(lastfilter).find(".current").addClass("sinit").html(config[i]["filters"][j]["conds"][k]["init"]);
                                }
                            }
                            $(lastfilter).parent().parent().parent().removeClass("init");
                            poec_nsimSetFilter($(lastfilter));
                            $("#poecSimCondArea" + nstep).find(".condition_zone:eq(" + j + ")").find(".nsimfilter_holder:last").after(poec_nsimOuterFilterSelector(nstep, "normal"));
                            poec_nsimInitFilter($("#poecSimCondArea" + nstep).find(".condition_zone:eq(" + j + ")").find(".nsimfilter:last"));
                        }
                    }
                    // VFILTERS
                    if (config[i]["vfilter"]) {
                        for (j = 0; j < config[i]["vfilter"].length; j++) {
                            var lastfilter = $("#poecSimUnveilArea" + nstep).find(".condition_zone:eq(0)").find(".nsimfilter:last");
                            $(lastfilter).attr("curval", config[i]["vfilter"][j]);
                            $(lastfilter).parent().parent().parent().removeClass("init");
                            poec_nsimSetFilter($(lastfilter));
                            $("#poecSimUnveilArea" + nstep).find(".condition_zone:eq(0)").find(".nsimfilter_holder:last").after(poec_nsimOuterFilterSelector(nstep, "veiled"));
                            poec_nsimInitFilter($("#poecSimUnveilArea" + nstep).find(".condition_zone:eq(0)").find(".nsimfilter:last"));
                        }
                    }
                    poec_nsimBlockFilters($("#poecSimUnveilArea" + nstep), nstep);
                    poec_nsimResequenceFilters(nstep);
                }
            }
        }
        // Set actions
        $("#poecSimSuccessMode" + nstep).mcuiRadio().setVal(config[i]["actions"]["win"]);
        if (config[i]["actions"]["win"] == "step") {
            $("#poecSimSuccessStep" + nstep).parent().show();
            if (config[i]["actions"]["win_route"]) {
                $("#poecSimSuccessStep" + nstep).attr("curval", config[i]["actions"]["win_route"]);
                poec_nsimSetFilter($("#poecSimSuccessStep" + nstep));
            }
        }
        $("#poecSimFailMode" + nstep).mcuiRadio().setVal(config[i]["actions"]["fail"]);
        if (config[i]["actions"]["fail"] == "step") {
            $("#poecSimFailureStep" + nstep).parent().show();
            if (config[i]["actions"]["fail_route"]) {
                $("#poecSimFailureStep" + nstep).attr("curval", config[i]["actions"]["fail_route"]);
                poec_nsimSetFilter($("#poecSimFailureStep" + nstep));
            }
        }
    }
    poec_nsimCheckAddStepValid();
    poec_nsimUpdateAddonAffixes();
}

/***************/
/* CONFIG DATA */
/***************/
var nsim_activepseudos = null;

function poec_nsimGenerateConfigData() {
    nsim_activepseudos = null;
    simulator_config = [];
    var nstep = 1;
    $("#poecSimSequence").find(".step").each(function () {
        var step = {};
        // METHOD
        var method = [];
        var woking = null;
        $(this).find(".method").find(".nsimsel:not(.tangled)").each(function () {
            var curval = $(this).attr("curval");
            if (curval == "null") {
                curval = null;
            }
            method.push(curval);
            if (curval == "woke" || curval == "recombinate") {
                var wokeidata = $(this).parent().find(".wokeritemdata").html();
                if (wokeidata != "") {
                    woking = jQuery.parseJSON($(this).parent().find(".wokeritemdata").html());
                }
            }
            if (typeof curval == "String") {
                if (curval.indexOf("|tangled|") > -1) {
                    method.push({
                        "pos": $(this).parent().find(".tangled.pos").attr("curval"),
                        "neg": $(this).parent().find(".tangled.neg").attr("curval")
                    });
                }
            }
        });
        step["method"] = method;
        if (woking) {
            step["woking"] = woking;
        }
        // METHOD OPTIONS
        var options = null;
        if ($(this).find(".method").find(".nopt").length > 0) {
            options = {};
            $(this).find(".method").find(".nopt").each(function () {
                var opttype = $(this).attr("opttype");
                var optid = $(this).attr("optid");
                switch (opttype) {
                    case 'check' :
                        options[optid] = $(this).mcuiCheck().getVal();
                        break;
                    case 'radio' :
                        options[optid] = $(this).mcuiRadio().getVal();
                        break;
                }
            });
        }
        step["mopts"] = options;
        // FILTERS
        var filters = null;
        var vfilter = null;
        step["autopass"] = false;
        var autopass = $("#poecSimCondAutoPass" + nstep).mcuiCheck().getVal();
        if (autopass) {
            step["autopass"] = true;
        } else {
            filters = [];
            $("#poecSimCondArea" + nstep).find(".condition_zone").each(function () {
                var czone = {};
                czone["type"] = $(this).attr("gtype");
                czone["treshold"] = null;
                if (!$(this).find(".grpmintresh").hasClass("init")) {
                    czone["treshold"] = parseInt($(this).find(".grpmintresh").val());
                }
                czone["conds"] = [];
                $(this).find(".nsimfilter").each(function () {
                    var curval = $(this).attr("curval");
                    if (curval == "null") {
                        curval = null;
                    }
                    var treshold = null;
                    var max = null;
                    if (curval) {
                        var tnode = $(this).parent().parent().find("input.treshold");
                        if (!$(tnode).hasClass("init")) {
                            treshold = parseInt($(tnode).val());
                        }
                        var mnode = $(this).parent().parent().find("input.max");
                        if (!$(mnode).hasClass("init")) {
                            max = parseInt($(mnode).val());
                        }
                        var base = null;
                        if ($(this).find(".opt.selected").hasClass("addon")) {
                            base = $(this).find(".opt.selected").attr("abase");
                        }
                        czone["conds"].push({"id": curval, "treshold": treshold, "max": max, "base": base});
                        // Store pseudo active
                        if (curval.indexOf("pseudo_") > -1) {
                            var spcid = curval.replace("pseudo_", "");
                            if (nsim_activepseudos == null) {
                                nsim_activepseudos = {};
                            }
                            nsim_activepseudos[spcid] = true;
                        }
                    }
                });
                filters.push(czone);
            });
            vfilter = [];
            $("#poecSimUnveilArea" + nstep).find(".condition_zone").each(function () {
                $(this).find(".nsimfilter").each(function () {
                    var curval = $(this).attr("curval");
                    if (curval == "null") {
                        curval = null;
                    }
                    if (curval) {
                        vfilter.push(curval);
                    }
                });
            });
        }
        step["filters"] = filters;
        step["vfilter"] = vfilter;
        // ACTIONS
        var actions = {};
        actions["win"] = $("#poecSimSuccessMode" + nstep).mcuiRadio().getVal();
        actions["win_route"] = null;
        if ($("#poecSimSuccessStep" + nstep).length > 0) {
            var curval = $("#poecSimSuccessStep" + nstep).attr("curval");
            if (curval == "null") {
                curval = null;
            }
            actions["win_route"] = curval;
        }
        actions["fail"] = $("#poecSimFailMode" + nstep).mcuiRadio().getVal();
        actions["fail_route"] = null;
        if ($("#poecSimFailureStep" + nstep).length > 0) {
            var curval = $("#poecSimFailureStep" + nstep).attr("curval");
            if (curval == "null") {
                curval = null;
            }
            actions["fail_route"] = curval;
        }
        step["actions"] = actions;
        simulator_config.push(step);
        nstep++;
    });
    //console.log(simulator_config);
}

/************************/
/* MAIN EXECUTION LOGIC */
/************************/
var nsimMode = "rt";
var nsimFixedNum = null;
var nsimFixedCnt = null;
var nsimStoreItems = true;
var nsimFixedWhat = "ac";
var nsimStoreDist = false;
var nsim_distributions = null;

function poec_simStartSimulation() {
    // Check that execution is valid
    var errors = false;
    // Validate that all methods are set
    $("#poecSimSequence").find(".method").find(".nsimsel").each(function () {
        var curval = $(this).attr("curval");
        if (curval == "null") {
            errors = {"type": "method", "node": $(this), "step": $(this).parent().parent().parent().attr("nstep")};
            return false;
        } else {
            if (curval.indexOf("|tangled|") > -1) {
                var pos = $(this).parent().find(".tangled.pos").attr("curval");
                if (pos == "null") {
                    errors = {
                        "type": "method",
                        "node": $(this).parent().find(".tangled.pos"),
                        "step": $(this).parent().parent().parent().attr("nstep")
                    };
                    return false;
                } else {
                    var neg = $(this).parent().find(".tangled.neg").attr("curval");
                    if (neg == "null") {
                        errors = {
                            "type": "method",
                            "node": $(this).parent().find(".tangled.neg"),
                            "step": $(this).parent().parent().parent().attr("nstep")
                        };
                        return false;
                    }
                }
            }
        }
    });
    // Check for woker items
    if (!errors) {
        $("#poecSimSequence").find(".woker.init:first").each(function () {
            errors = {"type": "method", "node": $(this), "step": $(this).parent().parent().parent().attr("nstep")};
        });
    }
    // Validate that all steps have at least one condition OR success is autopass
    if (!errors) {
        var nstep = 1;
        $("#poecSimSequence").find(".step").each(function () {
            var autopass = $("#poecSimCondAutoPass" + nstep).mcuiCheck().getVal();
            if (autopass == 0) {
                var fmcv = $("#poecSimSeqStep" + nstep).find(".method").find(".nsimsel:first").attr("curval");
                if (fmcv == "modunveil") {
                    // Unveiling, check for unveiling cond block
                    $("#poecSimUnveilArea" + nstep).find(".condition_zone").each(function () {
                        var nvalid = 0;
                        var firstinvalid = false;
                        $(this).find(".nsimfilter").each(function () {
                            var curval = $(this).attr("curval");
                            if (curval != "null") {
                                nvalid++;
                            } else {
                                if (!firstinvalid) {
                                    firstinvalid = $(this);
                                }
                            }
                        });
                        if (nvalid == 0) {
                            errors = {"type": "vcondition", "node": firstinvalid, "step": nstep};
                            return false;
                        }
                    });
                } else {
                    var czone = 1;
                    var totvalid = 0;
                    $("#poecSimCondArea" + nstep).find(".condition_zone").each(function () {
                        var nvalid = 0;
                        var firstinvalid = false;
                        var errtype = "condition";
                        $(this).find(".nsimfilter").each(function () {
                            var curval = $(this).attr("curval");
                            if (curval != "null") {
                                // Check that there is either a min or max or both
                                if ($(this).parent().parent().find("input.treshold").hasClass("init") && $(this).parent().parent().find("input.max").hasClass("init")) {
                                    if (!firstinvalid) {
                                        errtype = "treshold";
                                        firstinvalid = $(this);
                                    }
                                } else {
                                    nvalid++;
                                }
                            } else {
                                if (!firstinvalid) {
                                    firstinvalid = $(this);
                                }
                            }
                        });
                        totvalid += nvalid;
                        //console.log(errtype);
                        if ((nvalid == 0 && nstep != 1) || errtype == "treshold") {
                            errors = {"type": errtype, "node": firstinvalid, "step": nstep, "zone": czone};
                            return false;
                        }
                        czone++;
                    });
                    if (totvalid == 0 && !errors) {
                        errors = {
                            "type": "condition",
                            "node": $("#poecSimCondArea1").find(".condition_zone:eq(0)").find('.nsimfilter:first'),
                            "step": 1,
                            "zone": 1
                        };
                    }
                }
            }
            if (errors) {
                return false;
            }
            nstep++;
        });
    }
    // Validate that actions that are set to step have a step selected
    if (!errors) {
        var nstep = 1;
        $("#poecSimSequence").find(".step").each(function () {
            if ($("#poecSimSuccessStep" + nstep).length > 0) {
                if ($("#poecSimSuccessStep" + nstep).is(":visible")) {
                    var cval = $("#poecSimSuccessMode" + nstep).mcuiRadio().getVal();
                    if (cval == "step") {
                        if ($("#poecSimSuccessStep" + nstep).attr("curval") == "null") {
                            errors = {
                                "type": "step",
                                "node": $("#poecSimSuccessStep" + nstep),
                                "step": nstep,
                                "stype": "success"
                            };
                            return false;
                        }
                    }
                }
            }
            if ($("#poecSimFailureStep" + nstep).length > 0) {
                if ($("#poecSimFailureStep" + nstep).is(":visible")) {
                    var cval = $("#poecSimFailMode" + nstep).mcuiRadio().getVal();
                    if (cval == "step") {
                        if ($("#poecSimFailureStep" + nstep).attr("curval") == "null") {
                            errors = {
                                "type": "step",
                                "node": $("#poecSimFailureStep" + nstep),
                                "step": nstep,
                                "stype": "failure"
                            };
                            return false;
                        }
                    }
                }
            }
            nstep++;
        });
    }
    if (errors) {
        $(errors["node"]).addClass("error");
        errmsg = "<div>" + applyLang("Configuration Error") + "</div><div>";
        switch (errors["type"]) {
            case 'method' :
                errmsg += applyLang("Missing method for step") + " " + errors["step"];
                break;
            case 'condition' :
                errmsg += applyLang("No condition set for step") + " " + errors["step"] + " " + applyLang("zone") + " " + errors["zone"];
                break;
            case 'treshold' :
                errmsg += applyLang("No min/max set for condition on step") + " " + errors["step"] + " " + applyLang("zone") + " " + errors["zone"];
                break;
            case 'vcondition' :
                errmsg += applyLang("No condition set for step") + " " + errors["step"];
                break;
            case 'step' :
                errmsg += applyLang("Go to step selection missing for step") + " " + errors["step"] + " " + applyLang(errors["stype"]);
                break;
        }
        errmsg += "</div>";
        $(window).scrollTop($(errors["node"]).offset().top - 100);
        poec_outputNotice(errmsg, "error");
    } else {
        nsimStoreItems = $("#poecSimKeepItems").mcuiCheck().getVal();

        // Can proceed
        poec_nsimGenerateConfigData();
        nsim_econfig = poec_nsimRelayConfigData(simulator_config);
        //console.log(nsim_econfig);

        nsimFixedNum = parseInt($("#poecSimFixedLoops").val().replace(/ /g, ""));
        nsimMode = $("#poecSimGenType").mcuiRadio().getVal();
        nsimFixedCnt = 0;
        nsimStoreDist = $("#poecSimShowDist").mcuiCheck().getVal();
        nsim_distributions = {"mod": {}, "affix": {}};
        for (var i = 0; i <= simulator_data["cmaxaffgrp"]["prefix"]; i++) {
            for (var j = 0; j <= simulator_data["cmaxaffgrp"]["suffix"]; j++) {
                nsim_distributions["mod"][i + "-" + j] = 0;
            }
        }
        if (nsimMode == "fx") {
            nsimFixedWhat = $("#poecSimFixedWhat").mcuiRadio().getVal();
            if (!isNaN(nsimFixedNum)) {
                maxCallStack = computeMaxCallStackSize() / 10;
            }
        }
        if (!isNaN(nsimFixedNum)) {
            setTimeout(function () {
                poec_simStartSimulationGO();
            }, 10);
        }
    }
}

/* RELAY CONFIG TO EMULATOR STANDARDS */
function poec_nsimRelayConfigData(simulator_config) {
    var execution_config = jQuery.parseJSON(JSON.stringify(simulator_config));

    // Rewrite for metamethods
    var hasmm = true;
    while (hasmm) {
        hasmm = false;
        for (var i = 0; i < execution_config.length; i++) {
            if (execution_config[i]["method"][0] == "metamethod") {
                hasmm = true;
                var usemm = jQuery.parseJSON(JSON.stringify(simulator_metam[execution_config[i]["method"][1]]));
                var nmsteps = usemm["seq"].length;
                var toffset = nmsteps - 1;
                var delta = i;
                var new_config = [];
                for (var j = 0; j < execution_config.length; j++) {
                    if (j == delta) {
                        // Is the metamethod, add sequence instead
                        for (var k = 0; k < usemm["seq"].length; k++) {
                            if (usemm["seq"][k]["actions"]["win"] == "step") {
                                usemm["seq"][k]["actions"]["win_route"] += delta;
                            } else {
                                if (usemm["seq"][k]["actions"]["win"] == "end") { // Go to true win route
                                    switch (execution_config[j]["actions"]["win"]) {
                                        case 'next' :
                                            if (j + 1 < execution_config.length) { // Continue/next
                                                usemm["seq"][k]["actions"]["win"] = "step";
                                                usemm["seq"][k]["actions"]["win_route"] = nmsteps + delta + 1;
                                            }
                                            break;
                                        case 'step' :
                                            usemm["seq"][k]["actions"]["win"] = "step";
                                            if (execution_config[j]["actions"]["win_route"] < delta + 1) {
                                                usemm["seq"][k]["actions"]["win_route"] = execution_config[j]["actions"]["win_route"];
                                            } else {
                                                usemm["seq"][k]["actions"]["win_route"] = toffset + execution_config[j]["actions"]["win_route"];
                                            }
                                            break;
                                        case 'end' :
                                            break; // Leave end
                                    }
                                }
                            }
                            if (usemm["seq"][k]["actions"]["fail"] == "step") {
                                usemm["seq"][k]["actions"]["fail_route"] += delta;
                            } else {
                                if (usemm["seq"][k]["actions"]["fail"] == "restart") { // Go to true fail route
                                    switch (execution_config[j]["actions"]["fail"]) {
                                        case 'loop' :
                                            break; // Should not be a logical or possible choice?
                                        case 'step' :
                                            usemm["seq"][k]["actions"]["fail"] = "step";
                                            if (execution_config[j]["actions"]["fail_route"] < delta + 1) {
                                                usemm["seq"][k]["actions"]["fail_route"] = execution_config[j]["actions"]["fail_route"];
                                            } else {
                                                usemm["seq"][k]["actions"]["fail_route"] = toffset + execution_config[j]["actions"]["fail_route"];
                                            }
                                            break;
                                        case 'restart' :
                                            break; // Leave restart
                                    }
                                }
                            }
                            // Filter conditions in
                            for (z = 0; z < usemm["seq"][k]["filters"].length; z++) {
                                for (zz = 0; zz < usemm["seq"][k]["filters"][z]["conds"].length; zz++) {
                                    if (typeof usemm["seq"][k]["filters"][z]["conds"][zz]["id"] === 'string') {
                                        if (usemm["seq"][k]["filters"][z]["conds"][zz]["id"].substring(0, 6) == "[COND:") {
                                            var brkz = usemm["seq"][k]["filters"][z]["conds"][zz]["id"].split(":");
                                            var condi = parseInt(brkz[1].replace("]", "")) - 1;
                                            usemm["seq"][k]["filters"][z]["conds"][zz]["id"] = execution_config[j]["filters"][0]["conds"][condi]["id"];
                                            usemm["seq"][k]["filters"][z]["conds"][zz]["treshold"] = execution_config[j]["filters"][0]["conds"][condi]["treshold"];
                                            usemm["seq"][k]["filters"][z]["conds"][zz]["max"] = execution_config[j]["filters"][0]["conds"][condi]["max"];
                                        }
                                    }
                                }
                            }
                            new_config.push(usemm["seq"][k]);
                        }
                    } else {
                        if (execution_config[j]["actions"]["win"] == "step") {
                            execution_config[j]["actions"]["win_route"] = parseInt(execution_config[j]["actions"]["win_route"]);
                            if (execution_config[j]["actions"]["win_route"] > (delta + 1)) {
                                execution_config[j]["actions"]["win_route"] += toffset;
                            }
                        }
                        if (execution_config[j]["actions"]["fail"] == "step") {
                            execution_config[j]["actions"]["fail_route"] = parseInt(execution_config[j]["actions"]["fail_route"]);
                            if (execution_config[j]["actions"]["fail_route"] > (delta + 1)) {
                                execution_config[j]["actions"]["fail_route"] += toffset;
                            }
                        }
                        new_config.push(execution_config[j]);
                    }
                }
                execution_config = jQuery.parseJSON(JSON.stringify(new_config));
                break;
            }
        }
    }

    for (var i = 0; i < execution_config.length; i++) {
        execution_config[i]["pseudos"] = false;
        execution_config[i]["storevals"] = false;
        execution_config[i]["storemeta"] = false;
        execution_config[i]["isloop"] = false;
        // Check condition group types
        if (execution_config[i]["filters"]) {
            if (execution_config[i]["filters"].length > 1) {
                if (execution_config[i]["filters"][1]["type"] == "or") {
                    execution_config[i]["filters"][0]["type"] = "or";
                }
            }
        }
        // Crunch constraints
        execution_config[i]["constraints"] = {"required": null, "cannot": null};
        var curdef = null;
        for (var j = 0; j < execution_config[i]["method"].length; j++) {
            switch (execution_config[i]["method"][j]) {
                case 'divine' :
                case 'hrrvpsi' :
                case 'hrrvp' :
                case 'hrrvs' :
                case 'breroll' :
                    execution_config[i]["storevals"] = true;
                    break;
            }
            if (j == 0) {
                curdef = poec_cmethods[execution_config[i]["method"][j]];
            } else {
                if (curdef) {
                    if (curdef["subset"] != undefined && curdef["subset"] != "custom") {
                        curdef = curdef["subset"][execution_config[i]["method"][j]];
                    } else {
                        curdef = null;
                    }
                }
            }
            if (curdef) {
                if (curdef["required"] != undefined) {
                    $.each(curdef["required"], function (key, val) {
                        if (execution_config[i]["constraints"]["required"] == null) {
                            execution_config[i]["constraints"]["required"] = {};
                        }
                        if (Array.isArray(val)) {
                            if (execution_config[i]["constraints"]["required"][key] == undefined) {
                                execution_config[i]["constraints"]["required"][key] = [];
                            }
                            for (k = 0; k < val.length; k++) {
                                var ifound = false;
                                for (l = 0; l < execution_config[i]["constraints"]["required"][key].length; l++) {
                                    if (val[k] == execution_config[i]["constraints"]["required"][key][l]) {
                                        ifound = true;
                                        break;
                                    }
                                }
                                if (!ifound) {
                                    execution_config[i]["constraints"]["required"][key].push(val[k]);
                                }
                            }
                        } else {
                            execution_config[i]["constraints"]["required"][key] = val;
                        }
                    });
                }
                if (curdef["cannot"] != undefined) {
                    $.each(curdef["cannot"], function (key, val) {
                        if (execution_config[i]["constraints"]["cannot"] == null) {
                            execution_config[i]["constraints"]["cannot"] = {};
                        }
                        if (Array.isArray(val)) {
                            if (execution_config[i]["constraints"]["cannot"][key] == undefined) {
                                execution_config[i]["constraints"]["cannot"][key] = [];
                            }
                            for (k = 0; k < val.length; k++) {
                                var ifound = false;
                                for (l = 0; l < execution_config[i]["constraints"]["cannot"][key].length; l++) {
                                    if (val[k] == execution_config[i]["constraints"]["cannot"][key][l]) {
                                        ifound = true;
                                        break;
                                    }
                                }
                                if (!ifound) {
                                    execution_config[i]["constraints"]["cannot"][key].push(val[k]);
                                }
                            }
                        } else {
                            execution_config[i]["constraints"]["cannot"][key] = val;
                        }
                    });
                }
            }
        }

        // Transform modifier tresholds to their tindex
        switch (execution_config[i]["method"][0]) {
            case 'fossil' :
                execution_config[i]["method"][1] = execution_config[i]["method"][1].substring(1, execution_config[i]["method"][1].length - 1).split("|");
                break;
            case 'bench' :
                var bsel = execution_config[i]["method"][1].substring(1, execution_config[i]["method"][1].length - 1).split("|");
                var bdata = [];
                for (var z = 0; z < bsel.length; z++) {
                    if (bsel[z] != "remove_bench") {
                        bsel[z] = bsel[z].split("t");
                        bdata.push({"id": bsel[z][0], "tier": bsel[z][1]});
                    } else {
                        bdata.push({"id": bsel[z], "tier": null});
                    }
                }
                execution_config[i]["method"][1] = bdata;
                break;
            case 'essence' :
                // Change essid for modid in [1]
                var essid = execution_config[i]["method"][1].replace("ess", "");
                var essti = execution_config[i]["method"][2].replace("esst", "");
                var modid = null;
                for (var j = 0; j < poecd['essences']['seq'].length; j++) {
                    if (essid == poecd['essences']['seq'][j]["id_essence"]) {
                        var etiers = jQuery.parseJSON(poecd["essences"]["seq"][j]["tiers"]);
                        modid = etiers[simulator_settings["base"]];
                        break;
                    }
                }
                if (modid) {
                    execution_config[i]["method"][1] = modid;
                    execution_config[i]["method"][2] = essti;
                } else {
                    console.log("Could not find modid for essence " + essid);
                }
                break;
        }
        if (!execution_config[i]["autopass"]) {
            for (var j = 0; j < execution_config[i]["filters"].length; j++) {
                for (var k = 0; k < execution_config[i]["filters"][j]["conds"].length; k++) {
                    execution_config[i]["filters"][j]["conds"][k]["type"] = "normal";
                    var tresh = execution_config[i]["filters"][j]["conds"][k]["treshold"];
                    var max = execution_config[i]["filters"][j]["conds"][k]["max"];
                    var base = execution_config[i]["filters"][j]["conds"][k]["base"];
                    var modid = parseInt(execution_config[i]["filters"][j]["conds"][k]["id"]);
                    if (!isNaN(modid)) {
                        if (base) {
                            var ntiers = poecd['tiers'][modid][base].length;
                        } else {
                            var ntiers = poecd['tiers'][modid][simulator_settings['base']].length;
                        }
                        if (!execution_config[i]["storevals"]) {
                            if (tresh !== null) {
                                execution_config[i]["filters"][j]["conds"][k]["treshold"] = ntiers - tresh;
                            }
                            if (max !== null) {
                                execution_config[i]["filters"][j]["conds"][k]["max"] = ntiers - max;
                            }
                        }
                    } else {
                        // Special and pseudos
                        var spcid = execution_config[i]["filters"][j]["conds"][k]["id"];
                        if (spcid.indexOf("pseudo_") > -1) {
                            if (!execution_config[i]["pseudos"]) {
                                execution_config[i]["pseudos"] = {};
                            }
                            execution_config[i]["filters"][j]["conds"][k]["type"] = "pseudo";
                            spcid = spcid.replace("pseudo_", "");
                            execution_config[i]["filters"][j]["conds"][k]["pseudo"] = spcid;
                            if (execution_config[i]["pseudos"][spcid] == undefined) {
                                if (poec_cpseudos["def"][spcid]["advanced"]) {
                                    $.each(poec_cpseudos["def"][spcid]["parts"], function (partk, ptype) {
                                        execution_config[i] = poec_nsimSetupPseudoInit(execution_config[i], partk);
                                    });
                                    execution_config[i]["pseudos"][spcid] = {};
                                } else {
                                    execution_config[i] = poec_nsimSetupPseudoInit(execution_config[i], spcid);
                                }
                            }
                        } else {
                            execution_config[i]["filters"][j]["conds"][k]["type"] = "special";
                            switch (spcid) {
                                case 'count_attack' :
                                case 'count_nattack' :
                                case 'count_caster' :
                                case 'count_ncaster' :
                                    execution_config[i]["storemeta"] = true;
                                    break;
                            }
                        }
                    }
                }
            }
            if (execution_config[i]["actions"]["fail"] == "loop") {
                execution_config[i]["isloop"] = true;
            }
        }
    }
    //console.log(jQuery.parseJSON(JSON.stringify(execution_config)));
    return execution_config;
}

function poec_nsimSetupPseudoInit(cfg, spcid) {
    if (cfg["pseudos"][spcid] == undefined) {
        cfg["pseudos"][spcid] = {};
        // Get starting value
        var pstart = 0;
        if (poec_cpseudos["def"][spcid]["property"]) {
            if (simulator_settings["bitem"]) {
                var iprops = poecd["bitems"]["seq"][poecd["bitems"]["ind"][simulator_settings["bitem"]]]["properties"];
                if (iprops) {
                    iprops = jQuery.parseJSON(iprops);
                    if (Array.isArray(poec_cpseudos["def"][spcid]["property"])) {
                        for (z = 0; z < poec_cpseudos["def"][spcid]["property"].length; z++) {
                            if (iprops[poec_cpseudos["def"][spcid]["property"][z]]) {
                                var cval = parseFloat(iprops[poec_cpseudos["def"][spcid]["property"][z]]);
                                if (poec_cpseudos["def"][spcid]["divide"]) {
                                    cval = poec_cpseudos["def"][spcid]["divide"] / cval;
                                }
                                pstart += cval;
                            }
                        }
                        pstart = pstart / poec_cpseudos["def"][spcid]["property"].length;
                    } else {
                        if (iprops[spcid]) {
                            var cval = parseFloat(iprops[spcid]);
                            if (poec_cpseudos["def"][spcid]["divide"]) {
                                cval = poec_cpseudos["def"][spcid]["divide"] / cval;
                            }
                            pstart = cval;
                        }
                    }
                }
            }
        }
        cfg["pseudos"][spcid]["pstart"] = pstart;
        cfg["pseudos"][spcid]["pmods"] = [];
        $.each(poec_cpseudos["mods"], function (mkey, dat) {
            for (var z = 0; z < dat["affects"].length; z++) {
                if (dat["affects"][z] == spcid) {
                    cfg["pseudos"][spcid]["pmods"].push({
                        "part": mkey,
                        "type": dat["type"],
                        "mod": dat["mod"][z]
                    });
                }
            }
        });
    }
    return cfg;
}

/* INIT LOOP */
var nsim_sdata = null;
var nsim_cdata = null;
var nsim_results = null;
var nsim_baseresult = null;
var nsim_crafts = null;
var nsim_curcraft = null;
var nsim_cstep = null;
var nsim_lstep = null;
var nsim_nstep = null;
var nsim_items = null;
var nsim_econfig = null;
var nsim_error = null;
var nsim_maxitems = null;
var nsim_benchrem = 0;
var nsim_ignorecur = "|check|";
var nsim_execstart = null;
var nsim_nostoponloop = true;

function poec_simStartSimulationGO() {
    nsim_execstart = new Date().getTime();

    poec_simChangeMainTab("results");
    $("#poecSimMode").find(".choice").removeClass("selected");
    $("#poecSimMode").find(".choice").each(function () {
        var value = $(this).find(".value").html();
        if (value == "results") {
            $(this).addClass("selected");
            return false;
        }
    })
    $("#poecSimDebugItem").remove();
    $("#poecSimResultsStatus").html('<div id="poecFixedStatusZone"></div><div id="poecModDistBigLoader" class="siming"><img src="../../images/ajax-loader-dark.gif"></div><div class="actions"><div class="mcui-button red" onClick="poec_simStopLoops(false,false)" id="poecSimStopSimBtn">' + applyLang("Stop simulation") + '</div><div class="mcui-button green" onClick="poec_simContLoops()" id="poecSimContSimBtn">' + applyLang("Continue simulation") + '</div></div>');
    $("#poecFixedStatusZone").show();
    simState = true;

    poec_simInitMVData();

    // Setup initial data
    simulator_data["iaffbt"] = {"prefix": 0, "suffix": 0};
    for (var i = 0; i < simulator_data["iaffixes"].length; i++) {
        simulator_data["iaffbt"][simulator_data["iaffixes"][i]["atype"]]++;
    }

    nsim_sdata = {
        "iaffixes": simulator_data["iaffixes"],
        "cmaxaffgrp": simulator_data["cmaxaffgrp"],
        "maxaffgrp": simulator_data["maxaffgrp"],
        "iaffbt": simulator_data["iaffbt"],
        "fmodpool": null,
        "is_catalyst": simulator_data["is_catalyst"],
        "is_influenced": simulator_data["is_influenced"],
        "is_rare": simulator_data["is_rare"],
        "catalyst": simulator_settings["catalysts"],
        "mtypes": null,
        "meta_flags": simulator_data["meta_flags"],
        "base": simulator_settings["base"],
        "bgroup": simulator_settings["bgroup"],
        "bitem": simulator_settings["bitem"],
        "mgrpdata": null,
        "eldritch": simulator_data["eldritch"],
        "dominance": simulator_data["dominance"],
        "rarity": simulator_settings["rarity"],
        "quality": simulator_settings["quality"],
        "corrupted": simulator_settings["corrupted"],
        "ilvl": simulator_settings["ilvl"],
        "vpicks": null,
        "destroyed": 0,
        "imprint": null,
        "subaction": null,
        "ssaction": null,
        "cmodpool": null,
        "hmodpool": null,
        "implicits": simulator_data["implicits"],
        "rollable_implicits": simulator_data["rollable_implicits"],
        "influences": simulator_settings["influences"]
    };
    nsim_cdata = jQuery.parseJSON(JSON.stringify(nsim_sdata));
    crsim_bypass = nsim_cdata;
    nsim_cstep = 0;
    nsim_lstep = 0;
    nsim_nstep = nsim_econfig.length;
    nsim_results = [];
    nsim_baseresult = [];
    nsim_crafts = [];
    nsim_items = [];
    nsim_numsuccess = 0;
    nsim_maxitems = parseInt($("#poecSimStoredItems").val());
    nsim_chmpStore = {};
    nsim_error = null;
    nsim_benchrem = 0;
    nsim_stephistory = [];
    $("#poecSimItemsZone").html("");
    $("#poecItemStartMsg").show();
    $("#poecSimModeItemsChoice").html(applyLang("Items"));
    $("#poecItemNoMsg").hide();

    for (var i = 0; i < nsim_nstep; i++) {
        nsim_results.push({"cnt": 0, "pass": 0});
        nsim_baseresult.push(0);
    }
    nsim_curcraft = {"actions": 0, "steps": jQuery.parseJSON(JSON.stringify(nsim_baseresult))};

    if (nsimMode == "rt") {
        var initbl = poec_simOutputResultsTbl(true);
        $("#poecSimResultsZone").html(initbl);
    } else {
        if (nsimMode == "db") {
            // Generate equivalent of instructions but for debugging
            nsim_firstofloop = true;
            nsim_nostoponloop = $("#poecSimNoStopOnLoop").mcuiCheck().getVal();
            var dbgtbl = poec_simOutputDebugLayout();
            $("#poecSimResultsZone").html(dbgtbl);
            $("#poecSimResultsStatus").html("");
            poec_simSetCurrentDebug(true);
        } else {
            $("#poecSimDebugHolder").remove();
        }
    }

    setTimeout(function () {
        poec_simLoopAction();
    }, 10)
}

/* LOOP */
var nsim_firstofloop = true;
var maxCallStack = 0;
var curCallStack = 0;

function poec_simLoopAction() {
    poec_simExecuteAction();
    if (simState == true) {
        if (nsimMode == "fx") {
            curCallStack++;
            nsimFixedCnt++;
            if (nsimFixedWhat == "ac") {
                var checkagainst = nsimFixedCnt;
                var checkout = "<b>" + nsimFixedCnt + '</b> of ' + nsimFixedNum + ' actions simulated (' + nsim_numsuccess + ' items done)';
            } else {
                var checkagainst = nsim_numsuccess;
                var checkout = "<b>" + nsim_numsuccess + '</b> of ' + nsimFixedNum + ' items done (' + nsimFixedCnt + ' actions simulated)';
            }
            if (checkagainst < nsimFixedNum) {
                if (curCallStack > maxCallStack) {
                    $("#poecFixedStatusZone").html("<div id='poecFixedStatus'>" + checkout + '</div>');
                    curCallStack = 0;
                    setTimeout(poec_simLoopAction, 10);
                } else {
                    poec_simLoopAction();
                }
            } else {
                simState = false;
                // STOP
                $("#poecFixedStatusZone").html("<div id='poecFixedStatus'>" + checkout + '</div>');
                poec_simOutputResults(true);
            }
        } else {
            nsimFixedCnt++;
            $("#poecFixedStatusZone").html("<div id='poecFixedStatus'><b>" + nsimFixedCnt + '</b> actions simulated</div>');
            if (nsimMode == "rt") {
                poec_simLoopRTUpd();
                setTimeout(function () {
                    poec_simLoopAction();
                }, 1);
            } else {
                if (nsim_nostoponloop && nsim_econfig[nsim_cstep]["isloop"]) {
                    if (nsim_firstofloop) {
                        nsim_firstofloop = false;
                        poec_simSetCurrentDebug(false);
                        $("#poec_simDebugNextBtn").addClass("disabled");
                    }
                    setTimeout(function () {
                        poec_simLoopAction();
                    }, 1);
                } else {
                    poec_simSetCurrentDebug(false);
                }
            }
        }
    } else {
        if (nsim_error) {
            var eHTML = "";
            eHTML += "<div><div class='poecsimnotice'><div>" + applyLang("Sequencing error") + "</div><div>" + nsim_error + "</div></div></div>";
            var nidata = {
                "quality": simulator_settings["quality"],
                "catalyst": nsim_lastistate["catalyst"],
                "affixes": nsim_lastistate["iaffixes"],
                "implicits": nsim_lastistate["implicits"],
                "eldritch": nsim_lastistate["eldritch"],
                "enchant": "",
                "influences": nsim_lastistate["influences"],
                "rarity": nsim_lastistate["rarity"],
                "ilvl": simulator_settings["ilvl"],
                "base": nsim_lastistate["base"]
            };
            eHTML += "<br>";
            eHTML += poec_simGetFullItem(nidata, simulator_settings["bitem"], "Item state before error", "simulator", true);
            $("#poecSimResultsStatus").html(eHTML);
            $("#poecSimModeItemsChoice").html(applyLang("Items"));
            $(window).scrollTop(0);
        } else {
            if (nsimMode == "fx") {
                if (nsimFixedWhat == "ac") {
                    var checkout = "<b>" + nsimFixedCnt + '</b> of ' + nsimFixedNum + ' actions simulated (' + nsim_numsuccess + ' items done)';
                } else {
                    var checkout = "<b>" + nsim_numsuccess + '</b> of ' + nsimFixedNum + ' items done (' + nsimFixedCnt + ' actions simulated)';
                }
                $("#poecFixedStatusZone").html("<div id='poecFixedStatus'><b>" + checkout + '</div>');
            } else {
                $("#poecFixedStatusZone").html("<div id='poecFixedStatus'><b>" + nsimFixedCnt + '</b> actions simulated</div>');
            }
            poec_simOutputResults(false);
        }
    }
}

var nsim_chmpStore = {};

function poec_simBuildCHModPool() {
    var checkn = JSON.stringify(crsim_bypass["influences"]);
    var sarray = [];
    var mgrpblk = "|";
    for (var i = 0; i < crsim_bypass["iaffixes"].length; i++) {
        for (var zy = 0; zy < crsim_bypass["iaffixes"][i]["modgroups"].length; zy++) {
            mgrpblk += crsim_bypass["iaffixes"][i]["modgroups"][zy] + "|";
        }
        sarray.push({"i": crsim_bypass["iaffixes"][i]["id"], "t": crsim_bypass["iaffixes"][i]["tindex"]})
    }
    checkn += JSON.stringify(sarray);
    checkn = $.MD5(checkn);
    if (nsim_chmpStore[checkn] != undefined) {
        var cmods = nsim_chmpStore[checkn]["cmods"];
        var hmods = nsim_chmpStore[checkn]["hmods"];
    } else {
        var cmods = {"prefix": [], "suffix": []};
        var hmods = {"prefix": [], "suffix": []};
        var blkdata = poec_simGetBlockData();
        var actgrps = "|1|" + blkdata["vmgroups"];
        // Build Harvest modpool for this configuration
        $.each(crsim_bypass["fmodpool"], function (atkey, mbt) {
            if (atkey == "prefix" || atkey == "suffix") {
                $.each(mbt, function (mgkey, mbg) {
                    if (actgrps.indexOf("|" + mgkey + "|") > -1) {
                        for (var i = 0; i < mbg.length; i++) {
                            var tmod = {
                                "id": mbg[i]["id_modifier"],
                                "mgrp": mbg[i]["id_mgroup"],
                                "atype": atkey,
                                "mtypes": simulator_data["mtypes"][mbg[i]["id_modifier"]]["strcheck"]
                            }
                            hmods[atkey].push(tmod);
                            var mconflict = false;
                            for (var zy = 0; zy < mbg[i]["modgroups"].length; zy++) {
                                if (mgrpblk.indexOf("|" + mbg[i]["modgroups"][zy] + "|") > -1) {
                                    mconflict = true;
                                }
                            }
                            if (mconflict) {
                            } else {
                                cmods[atkey].push(tmod);
                            }
                        }
                    }
                });
            }
        });
        nsim_chmpStore[checkn] = {"cmods": cmods, "hmods": hmods};
    }
    crsim_bypass["cmodpool"] = cmods;
    crsim_bypass["hmodpool"] = hmods;
}

function poec_simApplyBenchCraft() {
    // Check if the selected benchcraft/crafts can actually be applied
    var errtype = null;
    var strids = "|";
    var strmgrps = "|";
    var benches = 0;
    var multimod = 0;
    for (var i = 0; i < crsim_bypass["iaffixes"].length; i++) {
        if (crsim_bypass["iaffixes"][i]["bench"] == 1) {
            benches++;
            if (crsim_bypass["iaffixes"][i]["id"] == poec_constants["refs"]["multimod_mod"]) {
                multimod = 1;
            }
        }
    }
    var bench = nsim_econfig[nsim_cstep]["method"][1];
    if ((benches > 0 && !multimod) || benches == 3 || bench[0]["id"] == "remove_bench") {
        // Remove benchmods with scour spending as it is assumed the user is replacing the benchmods
        var newaffs = [];
        crsim_bypass["iaffbt"] = {"prefix": 0, "suffix": 0};
        for (var i = 0; i < crsim_bypass["iaffixes"].length; i++) {
            if (crsim_bypass["iaffixes"][i]["bench"] != 1) {
                newaffs.push(crsim_bypass["iaffixes"][i]);
                crsim_bypass["iaffbt"][crsim_bypass["iaffixes"][i]["atype"]]++;
            }
        }
        crsim_bypass["iaffixes"] = jQuery.parseJSON(JSON.stringify(newaffs));
        nsim_benchrem++;
    }
    // Build mgrps and ids
    for (var i = 0; i < crsim_bypass["iaffixes"].length; i++) {
        strids += crsim_bypass["iaffixes"][i]["id"] + "|";
        if (crsim_bypass["iaffixes"][i]["modgroups"]) {
            for (var zy = 0; zy < crsim_bypass["iaffixes"][i]["modgroups"].length; zy++) {
                strmgrps += crsim_bypass["iaffixes"][i]["modgroups"][zy] + "|";
            }
        }
        if (crsim_bypass["iaffixes"][i]["id"] > 0) {
            var amgs = poecd["modifiers"]["seq"][poecd["modifiers"]["ind"][crsim_bypass["iaffixes"][i]["id"]]]["amg"];
            if (amgs) {
                strmgrps += amgs + "|";
            }
        }
    }
    if (bench[0]["id"] != "remove_bench") {
        var openaff = {
            "prefix": crsim_bypass["cmaxaffgrp"]["prefix"] - crsim_bypass["iaffbt"]["prefix"],
            "suffix": crsim_bypass["cmaxaffgrp"]["suffix"] - crsim_bypass["iaffbt"]["suffix"]
        };
        for (var i = 0; i < bench.length; i++) {
            var modgroup = poecd["modifiers"]["seq"][poecd["modifiers"]["ind"][bench[i]["id"]]]["modgroups"];
            var atype = poecd["modifiers"]["seq"][poecd["modifiers"]["ind"][bench[i]["id"]]]["affix"];
            if (openaff[atype] > 0 || crsim_bypass["rarity"] == "normal") {
                var amgs = poecd["modifiers"]["seq"][poecd["modifiers"]["ind"][bench[i]["id"]]]["amg"];
                if (amgs) {
                    amgs = amgs.split("|");
                    for (var z = 0; z < amgs.length; z++) {
                        if (strmgrps.indexOf("|" + amgs[z] + "|") > -1) {
                            console.log("AMG conflict ON");
                            console.log(bench[i]);
                            errtype = "modgroup";
                            break;
                        }
                    }
                }
                if (!errtype) {
                    var mconflict = false;
                    for (var zy = 0; zy < modgroup.length; zy++) {
                        if (strmgrps.indexOf("|" + modgroup[zy] + "|") > -1) {
                            mconflict = true;
                        }
                    }
                    if (mconflict) {
                        console.log("MODGROUP conflict ON");
                        console.log(bench[i]);
                        errtype = "modgroup";
                    } else {
                        if (strids.indexOf("|" + bench[i]["id"] + "|") > -1) {
                            errtype = "id";
                        } else {
                            // OK
                            openaff[atype]--;
                            var nvalues = poecd['tiers'][bench[i]["id"]][simulator_settings["base"]][bench[i]["tier"]]["nvalues"];
                            var rolls = poec_simRollValues(nvalues);
                            crsim_bypass["iaffixes"].push({
                                "atype": atype,
                                "bench": 1,
                                "frac": 0,
                                "maven": 0,
                                "id": bench[i]["id"],
                                "mgrp": poecd["modifiers"]["seq"][poecd["modifiers"]["ind"][bench[i]["id"]]]["id_mgroup"],
                                "modgroups": modgroup,
                                "nvalues": nvalues,
                                "rolls": rolls,
                                "tindex": bench[i]["tier"],
                                "weight": poecd['tiers'][bench[i]["id"]][simulator_settings["base"]][bench[i]["tier"]]["weighting"]
                            });
                            crsim_bypass["iaffbt"][atype]++;
                            if (crsim_bypass["rarity"] == "normal") {
                                poec_simSetRarity("magic");
                            }
                        }
                    }
                }
            } else {
                errtype = atype;
                break;
            }
        }
    }
    if (errtype) {
        switch (errtype) {
            case 'prefix' :
            case 'suffix' :
                errtype = applyLang("No " + errtype + " left to add benchcraft on step ") + (nsim_cstep + 1);
                break;
            case 'id' :
                errtype = applyLang("Benchcraft already there on step ") + (nsim_cstep + 1);
                break;
            case 'modgroup' :
                errtype = applyLang("Modgroup conflict for benchcraft on step ") + (nsim_cstep + 1);
                break;
        }
        var skiperror = false;
        if (nsim_econfig[nsim_cstep]["mopts"] != undefined) {
            if (nsim_econfig[nsim_cstep]["mopts"]["bmd"] != undefined) {
                if (nsim_econfig[nsim_cstep]["mopts"]["bmd"] == "skipf") {
                    skiperror = true;
                }
            }
        }
        if (!skiperror) {
            poec_simStopLoops(errtype, true);
        }
    } else {
        poec_simUpdateMeta();
    }
}

var simulator_curvswapindex = null;

function poec_simUnveilModifier() {
    simulator_curvswapindex = null;
    if (crsim_bypass["iaffixes"]) {
        for (var i = 0; i < crsim_bypass["iaffixes"].length; i++) {
            if (crsim_bypass["iaffixes"][i]["id"] < 0) {
                simulator_curvswapindex = i;
                break;
            }
        }
    }
    if (simulator_curvswapindex !== null) {
        crsim_bypass["vpicks"] = poec_simUnveilMod(simulator_curvswapindex, true);
    } else {
        poec_simThrowError(applyLang("Found no veiled modifier to unveil"));
    }
}

function poec_simVerifyAction(econst, step) {
    var verif_error = null;
    // Required
    if (econst["required"]) {
        $.each(econst["required"], function (ckey, cstate) {
            switch (ckey) {
                case 'rarity' :
                    if (crsim_bypass["rarity"] != cstate) {
                        verif_error = applyLang("Item rarity needs to be " + cstate + " for this action");
                        return false;
                    }
                    break;
                case 'influenced' :
                    if (!crsim_bypass["influences"]) {
                        verif_error = applyLang("Item needs to be influenced");
                        return false;
                    }
                    break;
                case 'eldritched' :
                    if (!crsim_bypass["eldritch"]) {
                        verif_error = applyLang("Item needs to be eldritch influenced");
                        return false;
                    }
                    break;
                case 'dualeldritch' :
                    var epass = false;
                    if (crsim_bypass["eldritch"]) {
                        if (crsim_bypass["eldritch"]["eldritch_red"] && crsim_bypass["eldritch"]["eldritch_blue"]) {
                            epass = true;
                        }
                    }
                    if (!epass) {
                        verif_error = applyLang("Item needs to have both eldritch influences");
                        return false;
                    }
                    break;
                case 'dominance' :
                    if (!crsim_bypass["dominance"]) {
                        verif_error = applyLang("Item needs to be eldritch dominated");
                        return false;
                    }
                    break;
                case 'open' :
                    switch (cstate) {
                        case 'any' :
                            if (crsim_bypass["iaffixes"].length >= crsim_bypass["cmaxaffgrp"]["prefix"] + crsim_bypass["cmaxaffgrp"]["suffix"]) {
                                verif_error = applyLang("Item has no open affix");
                                return false;
                            }
                            break;
                        default:
                            if (crsim_bypass["iaffbt"][cstate] >= crsim_bypass["cmaxaffgrp"][cstate]) {
                                verif_error = applyLang("Item has no open") + " " + cstate;
                                return false;
                            }
                            break;
                    }
                    break;
                case 'affixes' :
                    if (crsim_bypass["iaffixes"].length < cstate) {
                        verif_error = applyLang("Item needs at least") + " " + cstate + " " + applyLang("affix to use action");
                        return false;
                    }
                    break;
                case 'woke' :
                    if (!crsim_bypass["influences"]) {
                        verif_error = applyLang("Item needs to be influenced");
                        return false;
                    } else {
                        if (crsim_bypass["influences"].length > 1) {
                            verif_error = applyLang("Item already dual-influenced");
                            return false;
                        } else {
                            var ninfmod = 0;
                            for (var i = 0; i < crsim_bypass["iaffixes"].length; i++) {
                                if (poec_constants["constraints"]["influence_mgroups"].indexOf("|" + crsim_bypass["iaffixes"][i]["mgrp"] + "|") > -1) {
                                    ninfmod++;
                                }
                            }
                            if (ninfmod == 0) {
                                verif_error = applyLang("Item needs at least one influenced modifier");
                                return false;
                            }
                        }
                    }
                    break;
            }
        });
    }

    // Cannot
    if (econst["cannot"]) {
        $.each(econst["cannot"], function (ckey, cstate) {
            switch (ckey) {
                case 'rarity' :
                    if (crsim_bypass["rarity"] == cstate) {
                        verif_error = applyLang("Item rarity cannot be " + cstate + " for this action");
                        return false;
                    }
                    break;
                case 'influenced' :
                    if (crsim_bypass["influences"]) {
                        verif_error = applyLang("Cannot be used on an influenced item");
                        return false;
                    }
                    break;
                case 'eldritched' :
                    if (crsim_bypass["eldritch"]) {
                        verif_error = applyLang("Cannot be used on an eldritched influenced item");
                        return false;
                    }
                    break;
                case 'fractured' :
                    var nfrac = false;
                    //console.log("checking fractured");
                    for (var i = 0; i < crsim_bypass["iaffixes"].length; i++) {
                        //console.log(crsim_bypass["iaffixes"][i]["frac"]);
                        if (crsim_bypass["iaffixes"][i]["frac"]) {
                            nfrac = true;
                            break;
                        }
                    }
                    if (nfrac) {
                        verif_error = applyLang("Cannot be used when a fractured affix is present");
                        return false;
                    }
                    break;
                case 'aspect' :
                    var nasp = false;
                    for (var i = 0; i < crsim_bypass["iaffixes"].length; i++) {
                        if (poec_constants["refs"]["beast_aspect_mods"].indexOf("|" + crsim_bypass["iaffixes"][i]["id"] + "|") > -1) {
                            nasp = true;
                            break;
                        }
                    }
                    if (nasp) {
                        verif_error = applyLang("Item already has an aspect modifier");
                        return false;
                    }
                    break;
                case 'veiled' :
                    var nveil = false;
                    for (var i = 0; i < crsim_bypass["iaffixes"].length; i++) {
                        if (crsim_bypass["iaffixes"][i]["id"] == -1) {
                            nveil = true;
                            break;
                        } else {
                            if (crsim_bypass["iaffixes"][i]["mgrp"] == poec_constants["refs"]["veiled_mgroup"]) {
                                nveil = true;
                                break;
                            }
                        }
                    }
                    if (nveil) {
                        verif_error = applyLang("Item already has an veiled or unveiled modifier");
                        return false;
                    }
                    break;
                case 'meta' :
                    if (crsim_bypass["meta_flags"]["nchg_suf"] || crsim_bypass["meta_flags"]["nchg_pre"] || crsim_bypass["meta_flags"]["no_attack"] || crsim_bypass["meta_flags"]["no_caster"]) {
                        verif_error = applyLang("Action cannot be used when a metamod is present");
                        return false;
                    }
                    break;
            }
        });
    }

    if (verif_error) {
        poec_simThrowError(verif_error);
        return false;
    } else {
        return true;
    }
}

function poec_simThrowError(err) {
    simState = false;
    nsim_error = applyLang("STEP ") + (nsim_cstep + 1) + " : " + err;
}

function poec_checkAgainstRange(what, cond) {
    var pass = true;
    if (cond["treshold"]) {
        if (what < cond["treshold"]) {
            pass = false;
        }
    }
    if (cond["max"]) {
        if (what > cond["max"]) {
            pass = false;
        }
    }
    return pass;
}

var nsim_lastistate = null;
var nsim_stephistory = null;

function poec_simExecuteAction() {
    nsim_lastistate = jQuery.parseJSON(JSON.stringify(crsim_bypass));
    /*
    nsim_stephistory.push({"step":nsim_cstep,"data":jQuery.parseJSON(JSON.stringify(nsim_lastistate))});
    if(nsim_stephistory.length>15){
        nsim_stephistory.shift();
    }
    */
    if (crsim_bypass["corrupted"] == 1) {
        poec_simThrowError(applyLang("Item has been corrupted and cannot be further modified"));
    } else {
        var verif = poec_simVerifyAction(nsim_econfig[nsim_cstep]["constraints"], nsim_cstep);
        if (verif) {
            crsim_bypass["mgrpdata"] = simulator_data["mgrpdata"];
            crsim_bypass["mtypes"] = simulator_data["mtypes"];
            crsim_bypass["fmodpool"] = simulator_data["fmodpool"];
            // ACTION APPLICATION
            switch (nsim_econfig[nsim_cstep]["method"][0]) {
                case 'check' :
                    break; // Do nothing and proceed to conditions
                case 'bench' :
                    poec_simApplyBenchCraft();
                    break;
                case 'modunveil' :
                    if (crsim_bypass["vpicks"] == null) {
                        poec_simUnveilModifier();
                    }
                    break;
                case 'recombinate' :
                    poec_simRecombinate(nsim_econfig[nsim_cstep]["woking"]);
                    break;
                default:
                    craftdata = {
                        "mode": nsim_econfig[nsim_cstep]["method"][0],
                        "action": nsim_econfig[nsim_cstep]["method"][1],
                        "subaction": nsim_econfig[nsim_cstep]["method"][2]
                    };
                    crsim_bypass["subaction"] = nsim_econfig[nsim_cstep]["method"][1];
                    crsim_bypass["ssaction"] = nsim_econfig[nsim_cstep]["method"][2];
                    if (nsim_econfig[nsim_cstep]["method"][0] == "harvest") {
                        poec_simBuildCHModPool();
                    } else {
                        if (nsim_econfig[nsim_cstep]["method"][1] == "woke") {
                            craftdata["woking"] = nsim_econfig[nsim_cstep]["woking"];
                        }
                    }
                    // Execute step craft
                    poec_simApplyCraftGO(null, craftdata, true);
                    break;
            }
            //console.log(jQuery.parseJSON(JSON.stringify(crsim_bypass)));
            crsim_bypass["mgrpdata"] = null;
            crsim_bypass["mtypes"] = null;
            crsim_bypass["fmodpool"] = null;
            // CONDITION CHECK
            var pass = true;
            if (simState) {
                if (nsim_econfig[nsim_cstep]["method"][0] == "modunveil") {
                    var donotforcepick = false;
                    if (nsim_econfig[nsim_cstep]["mopts"]["udnpm"] != undefined) {
                        if (nsim_econfig[nsim_cstep]["mopts"]["udnpm"]) {
                            donotforcepick = true;
                        }
                    }
                    // Unveil conditions
                    var strpicks = "|";
                    for (var i = 0; i < crsim_bypass["vpicks"].length; i++) {
                        strpicks += crsim_bypass["vpicks"][i] + "|";
                    }
                    var pickfound = -1;
                    for (var i = 0; i < nsim_econfig[nsim_cstep]["vfilter"].length; i++) {
                        if (strpicks.indexOf("|" + nsim_econfig[nsim_cstep]["vfilter"][i] + "|") > -1) {
                            pickfound = i;
                            break;
                        }
                    }
                    if (pickfound > -1) {
                        // Add pick to item
                        var nmodid = nsim_econfig[nsim_cstep]["vfilter"][pickfound];
                    } else {
                        pass = false;
                        // Still add a random mod from those 3 picks to the item
                        var nmodid = crsim_bypass["vpicks"][0];
                    }
                    if (pass || !donotforcepick) {
                        crsim_bypass["iaffixes"][simulator_curvswapindex] = {
                            "atype": poecd["modifiers"]["seq"][poecd["modifiers"]["ind"][nmodid]]["affix"],
                            "bench": 0,
                            "frac": 0,
                            "maven": 0,
                            "id": nmodid,
                            "mgrp": poec_constants["refs"]["veiled_mgroup"],
                            "modgroups": poecd["modifiers"]["seq"][poecd["modifiers"]["ind"][nmodid]]["modgroups"],
                            "nvalues": poecd["tiers"][nmodid][simulator_settings["base"]][0]["nvalues"],
                            "rolls": poec_simRollValues(poecd["tiers"][nmodid][simulator_settings["base"]][0]["nvalues"]),
                            "tindex": 0,
                            "weight": poecd["tiers"][nmodid][simulator_settings["base"]][0]["weighting"]
                        };
                        crsim_bypass["vpicks"] = null;
                        poec_simUpdateMeta();
                        simulator_curvswapindex = null;
                    }
                } else {
                    // Store data for quicker access
                    var nveiled = {"prefix": 0, "suffix": 0};
                    var tnveiled = 0;
                    var ninfs = {"prefix": 0, "suffix": 0};
                    var nmetas = {"attack": 0, "caster": 0};
                    var affdat = {};
                    var fractured = {};
                    //var hasess=false;
                    for (var i = 0; i < crsim_bypass["iaffixes"].length; i++) { // Explicits
                        /*
                        if(crsim_bypass["iaffixes"][i]["id"]==2660||crsim_bypass["iaffixes"][i]["id"]=="2660"){
                            hasess=true;
                        }
                        */
                        if (crsim_bypass["iaffixes"][i]["id"] < 0) {
                            nveiled[crsim_bypass["iaffixes"][i]["atype"]]++;
                            tnveiled++;
                        } else {
                            if (crsim_bypass["iaffixes"][i]["frac"] == 1) {
                                fractured[crsim_bypass["iaffixes"][i]["id"]] = true;
                            }
                            if (poec_constants["constraints"]["influence_mgroups"].indexOf("|" + crsim_bypass["iaffixes"][i]["mgrp"] + "|") > -1) {
                                ninfs[crsim_bypass["iaffixes"][i]["atype"]]++;
                            }
                            if (nsim_econfig[nsim_cstep]["storevals"]) {
                                var totv = 0;
                                if (crsim_bypass["iaffixes"][i]["rolls"]) {
                                    for (var n = 0; n < crsim_bypass["iaffixes"][i]["rolls"].length; n++) {
                                        totv += crsim_bypass["iaffixes"][i]["rolls"][n];
                                    }
                                }
                                affdat[crsim_bypass["iaffixes"][i]["id"]] = totv;
                            } else {
                                if (crsim_bypass["iaffixes"][i]["tindex"] == "e") {
                                    affdat[crsim_bypass["iaffixes"][i]["id"]] = 99;
                                } else {
                                    affdat[crsim_bypass["iaffixes"][i]["id"]] = crsim_bypass["iaffixes"][i]["tindex"];
                                }
                                if (nsim_econfig[nsim_cstep]["storemeta"]) {
                                    if (simulator_data["mtypes"][crsim_bypass["iaffixes"][i]["id"]]["strcheck"].indexOf("|3|") > -1) {
                                        nmetas["attack"]++;
                                    }
                                    if (simulator_data["mtypes"][crsim_bypass["iaffixes"][i]["id"]]["strcheck"].indexOf("|13|") > -1) {
                                        nmetas["caster"]++;
                                    }
                                }
                            }
                        }
                    }
                    if (tnveiled == 0) {
                        crsim_bypass["vpicks"] = null;
                    }
                    /*
                    //if(nsim_cstep==20){
                    if(nsim_cstep==20&&!hasess){
                    //if(nsim_cstep==20&&(affdat["2660"]==undefined||affdat[2660]==undefined||affdat["2660"]!==0)){
                        console.log(affdat);
                        simState=false;
                        console.log(jQuery.parseJSON(JSON.stringify(crsim_bypass)));
                        console.log(nsim_stephistory);
                    }
                    */
                    if (crsim_bypass["implicits"]) {
                        for (var i = 0; i < crsim_bypass["implicits"].length; i++) { // Implicits
                            affdat[crsim_bypass["implicits"][i]["id"]] = crsim_bypass["implicits"][i]["tindex"];
                        }
                    }
                    if (nsim_econfig[nsim_cstep]["pseudos"]) {
                        // Has pseudo conditions, compute active pseudos
                        var mparts = poec_nsimGetAffixesByParts(crsim_bypass["iaffixes"]);
                        //console.log(jQuery.parseJSON(JSON.stringify(mparts)));
                        $.each(nsim_econfig[nsim_cstep]["pseudos"], function (pkey, pdat) {
                            if (poec_cpseudos["def"][pkey]["advanced"] == undefined) {
                                nsim_econfig[nsim_cstep]["pseudos"][pkey]["state"] = {"f": 0, "m": 100, "t": 0};
                                if (poec_cpseudos["def"][pkey]["quality"]) {
                                    nsim_econfig[nsim_cstep]["pseudos"][pkey]["state"]["m"] += parseInt(crsim_bypass["quality"]);
                                }
                                for (var i = 0; i < nsim_econfig[nsim_cstep]["pseudos"][pkey]["pmods"].length; i++) {
                                    if (mparts[nsim_econfig[nsim_cstep]["pseudos"][pkey]["pmods"][i]["part"]] != undefined) {
                                        nsim_econfig[nsim_cstep]["pseudos"][pkey]["state"][nsim_econfig[nsim_cstep]["pseudos"][pkey]["pmods"][i]["type"]] += mparts[nsim_econfig[nsim_cstep]["pseudos"][pkey]["pmods"][i]["part"]] * nsim_econfig[nsim_cstep]["pseudos"][pkey]["pmods"][i]["mod"];
                                    }
                                }
                                nsim_econfig[nsim_cstep]["pseudos"][pkey]["state"]["t"] = (nsim_econfig[nsim_cstep]["pseudos"][pkey]["pstart"] + nsim_econfig[nsim_cstep]["pseudos"][pkey]["state"]["f"]) * (nsim_econfig[nsim_cstep]["pseudos"][pkey]["state"]["m"] / 100);
                            }
                        });
                        $.each(nsim_econfig[nsim_cstep]["pseudos"], function (pkey, pdat) {
                            if (poec_cpseudos["def"][pkey]["advanced"]) {
                                nsim_econfig[nsim_cstep]["pseudos"][pkey]["state"] = {"f": 0, "m": 1, "t": 0};
                                $.each(poec_cpseudos["def"][pkey]["parts"], function (partk, ptype) {
                                    if (ptype == "f") {
                                        nsim_econfig[nsim_cstep]["pseudos"][pkey]["state"]["f"] += nsim_econfig[nsim_cstep]["pseudos"][partk]["state"]["t"];
                                    } else {
                                        nsim_econfig[nsim_cstep]["pseudos"][pkey]["state"]["m"] = nsim_econfig[nsim_cstep]["pseudos"][partk]["state"]["t"];
                                    }
                                    nsim_econfig[nsim_cstep]["pseudos"][pkey]["state"]["t"] = nsim_econfig[nsim_cstep]["pseudos"][pkey]["state"]["f"] * nsim_econfig[nsim_cstep]["pseudos"][pkey]["state"]["m"];
                                });
                            }
                        });
                        //console.log(jQuery.parseJSON(JSON.stringify(nsim_econfig[nsim_cstep])));
                    }
                    // Check if conditions are passed
                    var ngrppass = 0;
                    if (!nsim_econfig[nsim_cstep]["autopass"]) {
                        for (var i = 0; i < nsim_econfig[nsim_cstep]["filters"].length; i++) { // Condition groups
                            var npass = 0;
                            for (var j = 0; j < nsim_econfig[nsim_cstep]["filters"][i]["conds"].length; j++) { // Condition
                                var modid = nsim_econfig[nsim_cstep]["filters"][i]["conds"][j]["id"];
                                if (affdat[modid] != undefined) {
                                    if (affdat[modid] >= nsim_econfig[nsim_cstep]["filters"][i]["conds"][j]["treshold"]) {
                                        if (nsim_econfig[nsim_cstep]["method"][1] == "fracturing") {
                                            if (fractured[modid]) {
                                                npass++;
                                            }
                                        } else {
                                            npass++;
                                        }
                                    }
                                } else {
                                    if (nsim_econfig[nsim_cstep]["filters"][i]["conds"][j]["type"] != "normal") {
                                        switch (modid) {
                                            case 'open_prefix' :
                                                if (poec_checkAgainstRange(crsim_bypass["cmaxaffgrp"]["prefix"] - crsim_bypass["iaffbt"]["prefix"], nsim_econfig[nsim_cstep]["filters"][i]["conds"][j])) {
                                                    npass++;
                                                }
                                                break;
                                            case 'open_suffix' :
                                                if (poec_checkAgainstRange(crsim_bypass["cmaxaffgrp"]["suffix"] - crsim_bypass["iaffbt"]["suffix"], nsim_econfig[nsim_cstep]["filters"][i]["conds"][j])) {
                                                    npass++;
                                                }
                                                break;
                                            case 'open_affix' :
                                                if (poec_checkAgainstRange((crsim_bypass["cmaxaffgrp"]["suffix"] + crsim_bypass["cmaxaffgrp"]["prefix"]) - (crsim_bypass["iaffbt"]["suffix"] + crsim_bypass["iaffbt"]["prefix"]), nsim_econfig[nsim_cstep]["filters"][i]["conds"][j])) {
                                                    npass++;
                                                }
                                                break;
                                            case 'count_prefix' :
                                                if (poec_checkAgainstRange(crsim_bypass["iaffbt"]["prefix"], nsim_econfig[nsim_cstep]["filters"][i]["conds"][j])) {
                                                    npass++;
                                                }
                                                break;
                                            case 'count_suffix' :
                                                if (poec_checkAgainstRange(crsim_bypass["iaffbt"]["suffix"], nsim_econfig[nsim_cstep]["filters"][i]["conds"][j])) {
                                                    npass++;
                                                }
                                                break;
                                            case 'count_affix' :
                                                if (poec_checkAgainstRange((crsim_bypass["iaffbt"]["suffix"] + crsim_bypass["iaffbt"]["prefix"]), nsim_econfig[nsim_cstep]["filters"][i]["conds"][j])) {
                                                    npass++;
                                                }
                                                break;
                                            case 'count_iprefix' :
                                                if (poec_checkAgainstRange(ninfs["prefix"], nsim_econfig[nsim_cstep]["filters"][i]["conds"][j])) {
                                                    npass++;
                                                }
                                                break;
                                            case 'count_isuffix' :
                                                if (poec_checkAgainstRange(ninfs["suffix"], nsim_econfig[nsim_cstep]["filters"][i]["conds"][j])) {
                                                    npass++;
                                                }
                                                break;
                                            case 'count_iaffix' :
                                                if (poec_checkAgainstRange((ninfs["prefix"] + ninfs["suffix"]), nsim_econfig[nsim_cstep]["filters"][i]["conds"][j])) {
                                                    npass++;
                                                }
                                                break;
                                            case 'veiled_prefix' :
                                                if (poec_checkAgainstRange(nveiled["prefix"], nsim_econfig[nsim_cstep]["filters"][i]["conds"][j])) {
                                                    npass++;
                                                }
                                                break;
                                            case 'veiled_suffix' :
                                                if (poec_checkAgainstRange(nveiled["suffix"], nsim_econfig[nsim_cstep]["filters"][i]["conds"][j])) {
                                                    npass++;
                                                }
                                                break;
                                            case 'quality' :
                                                if (crsim_bypass["catalyst"]) {
                                                    var checkqual = crsim_bypass["catalyst"]["val"];
                                                } else {
                                                    var checkqual = crsim_bypass["quality"];
                                                }
                                                if (poec_checkAgainstRange(checkqual, nsim_econfig[nsim_cstep]["filters"][i]["conds"][j])) {
                                                    npass++;
                                                }
                                                break;
                                            case 'eldritch_blue' :
                                                if (crsim_bypass["eldritch"]) {
                                                    if (crsim_bypass["eldritch"]["eldritch_blue"]) {
                                                        npass++;
                                                    }
                                                }
                                                break;
                                            case 'eldritch_red' :
                                                if (crsim_bypass["eldritch"]) {
                                                    if (crsim_bypass["eldritch"]["eldritch_red"]) {
                                                        npass++;
                                                    }
                                                }
                                                break;
                                            case 'count_attack' :
                                                if (poec_checkAgainstRange(nmetas["attack"], nsim_econfig[nsim_cstep]["filters"][i]["conds"][j])) {
                                                    npass++;
                                                }
                                                break;
                                            case 'count_nattack' :
                                                if (poec_checkAgainstRange((crsim_bypass["iaffbt"]["suffix"] + crsim_bypass["iaffbt"]["prefix"]) - nmetas["attack"], nsim_econfig[nsim_cstep]["filters"][i]["conds"][j])) {
                                                    npass++;
                                                }
                                                break;
                                            case 'count_caster' :
                                                if (poec_checkAgainstRange(nmetas["caster"], nsim_econfig[nsim_cstep]["filters"][i]["conds"][j])) {
                                                    npass++;
                                                }
                                                break;
                                            case 'count_ncaster' :
                                                if (poec_checkAgainstRange((crsim_bypass["iaffbt"]["suffix"] + crsim_bypass["iaffbt"]["prefix"]) - nmetas["caster"], nsim_econfig[nsim_cstep]["filters"][i]["conds"][j])) {
                                                    npass++;
                                                }
                                                break;
                                            default:
                                                // PSEUDOS
                                                if (nsim_econfig[nsim_cstep]["pseudos"][nsim_econfig[nsim_cstep]["filters"][i]["conds"][j]["pseudo"]]["state"]["t"] >= nsim_econfig[nsim_cstep]["filters"][i]["conds"][j]["treshold"]) {
                                                    npass++;
                                                }
                                                break;
                                        }
                                    }
                                }
                            }
                            switch (nsim_econfig[nsim_cstep]["filters"][i]["type"]) {
                                case 'or' :
                                    if (nsim_econfig[nsim_cstep]["filters"][i]["treshold"]) {
                                        var needed = nsim_econfig[nsim_cstep]["filters"][i]["treshold"]; // Use treshold
                                    } else {
                                        var needed = nsim_econfig[nsim_cstep]["filters"][i]["conds"].length; // Use total number
                                    }
                                    if (npass >= needed) { // OR group, if matches are under needed, fail
                                        ngrppass++;
                                    }
                                    break;
                                case 'and' :
                                    if (nsim_econfig[nsim_cstep]["filters"][i]["treshold"]) {
                                        var needed = nsim_econfig[nsim_cstep]["filters"][i]["treshold"]; // Use treshold
                                    } else {
                                        var needed = nsim_econfig[nsim_cstep]["filters"][i]["conds"].length; // Use total number
                                    }
                                    if (npass >= needed) { // AND group, if matches are under needed, fail
                                        ngrppass++;
                                    } else {
                                        pass = false;
                                    }
                                    break;
                                default:
                                    if (npass > 0) { // NOT group, if any match then fail
                                        pass = false;
                                    }
                                    break;
                            }
                        }
                        if (ngrppass == 0) {
                            pass = false;
                        }
                    }
                }
                nsim_lstep = nsim_cstep;
                // Increment results
                nsim_results[nsim_cstep]["cnt"]++;
                nsim_curcraft["actions"]++;
                nsim_curcraft["steps"][nsim_cstep]++;
                if (pass) {
                    nsim_results[nsim_cstep]["pass"]++;
                    // Route win
                    switch (nsim_econfig[nsim_cstep]["actions"]["win"]) {
                        case 'next' :
                            nsim_cstep++;
                            break;
                        case 'end' :
                            nsim_cstep = nsim_nstep;
                            break;
                        case 'step' :
                            nsim_cstep = nsim_econfig[nsim_cstep]["actions"]["win_route"] - 1;
                            break;
                    }
                } else {
                    // Route fail
                    switch (nsim_econfig[nsim_cstep]["actions"]["fail"]) {
                        case 'loop' :
                            break; // Doing the same thing again, do nothing
                        case 'restart' :
                            nsim_cstep = 0;
                            crsim_bypass = jQuery.parseJSON(JSON.stringify(nsim_sdata));
                            break;
                        case 'step' :
                            nsim_cstep = nsim_econfig[nsim_cstep]["actions"]["fail_route"] - 1;
                            break;
                    }
                }

                if (nsim_cstep >= nsim_nstep) {
                    // Made it to the end! success
                    nsim_crafts.push(jQuery.parseJSON(JSON.stringify(nsim_curcraft)));
                    nsim_curcraft = {"actions": 0, "steps": jQuery.parseJSON(JSON.stringify(nsim_baseresult))};
                    poec_simActionSucceed();
                }
            }
        }
    }
}

function poec_nsimGetAffixesByParts(affixes) {
    var mparts = {};
    for (var i = 0; i < affixes.length; i++) {
        if (affixes[i]["id"] > 0) {
            var mname = poecd["modifiers"]["seq"][poecd["modifiers"]["ind"][affixes[i]["id"]]]["name_modifier"];
            mname = mname.split(",");
            rolli = 0;
            for (j = 0; j < mname.length; j++) {
                mname[j] = mname[j].trim();
                var rolls = 0;
                var vsplit = mname[j].split("#");
                vsplit = vsplit.length - 1;
                for (k = 0; k < vsplit; k++) {
                    rolls += affixes[i]["rolls"][rolli];
                    rolli++;
                }
                if (vsplit > 0) {
                    rolls = rolls / vsplit;
                }
                if (mparts[mname[j]] == undefined) {
                    mparts[mname[j]] = 0;
                }
                mparts[mname[j]] += rolls;
            }
        }
    }
    return mparts;
}

var nsim_numsuccess = 0;

function poec_simActionSucceed() {
    if (nsimStoreItems) {
        if (nsim_items.length < nsim_maxitems) {
            if (crsim_bypass["catalyst"] == undefined) {
                crsim_bypass["catalyst"] = null;
            }
            nsim_items.push({
                "quality": jQuery.parseJSON(JSON.stringify(crsim_bypass["quality"])),
                "catalyst": jQuery.parseJSON(JSON.stringify(crsim_bypass["catalyst"])),
                "iaffixes": jQuery.parseJSON(JSON.stringify(crsim_bypass["iaffixes"])),
                "implicits": jQuery.parseJSON(JSON.stringify(crsim_bypass["implicits"])),
                "eldritch": jQuery.parseJSON(JSON.stringify(crsim_bypass["eldritch"])),
                "influences": jQuery.parseJSON(JSON.stringify(crsim_bypass["influences"])),
                "rarity": crsim_bypass["rarity"],
                "base": crsim_bypass["base"]
            });
            //nsim_items.push(jQuery.parseJSON(JSON.stringify(crsim_bypass)));
        }
    }
    if (nsimMode == "db") {
        poec_outputNotice("<div>" + applyLang("Debug") + "</div><div>" + applyLang("Item was completed succesfully!") + "</div>", "green");
    }
    if (nsimStoreDist) {
        // Store distribution data
        var mdk = crsim_bypass["iaffbt"]["prefix"] + "-" + crsim_bypass["iaffbt"]["suffix"];
        nsim_distributions["mod"][mdk]++;
        for (var i = 0; i < crsim_bypass["iaffixes"].length; i++) {
            if (crsim_bypass["iaffixes"][i]["id"] > 0) {
                if (nsim_distributions["affix"][crsim_bypass["iaffixes"][i]["id"]] == undefined) {
                    nsim_distributions["affix"][crsim_bypass["iaffixes"][i]["id"]] = {"num": 0, "tt": 0};
                }
                nsim_distributions["affix"][crsim_bypass["iaffixes"][i]["id"]]["num"]++;
                nsim_distributions["affix"][crsim_bypass["iaffixes"][i]["id"]]["tt"] += parseInt(crsim_bypass["iaffixes"][i]["tindex"]);
            }
        }
    }
    crsim_bypass = jQuery.parseJSON(JSON.stringify(nsim_sdata));
    nsim_cstep = 0;
    nsim_numsuccess++;
}

function poec_simStopLoops(error, automat) {
    simState = false;
    if (error) {
        nsim_error = error;
    }
    $("#poecModDistBigLoader.siming").hide();
    $("#poecSimStopSimBtn").hide();
    if (!automat) {
        $("#poecSimContSimBtn").css({"display": "inline-block"});
    }
}

function poec_simContLoops() {
    $("#poecSimContSimBtn").hide();
    $("#poecModDistBigLoader.siming").show();
    $("#poecSimStopSimBtn").css({"display": "inline-block"});
    simState = true;
    poec_simLoopAction();
}

function poec_simOutputResults(planned) {
    if (planned) {
        var exectime = (new Date().getTime() - nsim_execstart) / 1000;
        if (nsimFixedWhat == "ac") {
            var checkout = "<b>" + nsimFixedCnt + '</b> of ' + nsimFixedNum + ' actions simulated (' + nsim_numsuccess + ' items done)';
        } else {
            var checkout = "<b>" + nsim_numsuccess + '</b> of ' + nsimFixedNum + ' items done (' + nsimFixedCnt + ' actions simulated)';
        }
        $("#poecSimResultsStatus").html(checkout + "<div style='padding-top:10px;color:#BBB;font-size:12px;'>Executed in : " + number_format(exectime, 3, ".", " ") + " seconds</div>");
    }
    $("#poecSimResultsZone").html(poec_simOutputResultsTbl(false));

    // Output items in items tab
    if (nsimStoreItems) {
        poec_simOutputRItems();
    }
}

function poec_simOutputRItems() {
    var vHTML = "";
    var addnitem = "";
    $("#poecItemStartMsg").hide();
    $("#poecItemNoMsg").hide();
    if (nsim_items.length > 0) {
        vHTML += "<div class='title'>" + applyLang("Successfully generated items") + "</div>";
        for (var i = 0; i < nsim_items.length; i++) {
            var nidata = {
                "quality": nsim_items[i]["quality"],
                "catalyst": nsim_items[i]["catalyst"],
                "affixes": nsim_items[i]["iaffixes"],
                "implicits": nsim_items[i]["implicits"],
                "eldritch": nsim_items[i]["eldritch"],
                "enchant": "",
                "influences": nsim_items[i]["influences"],
                "rarity": nsim_items[i]["rarity"],
                "ilvl": simulator_settings["ilvl"],
                "base": nsim_items[i]["base"]
            };
            vHTML += poec_simGetFullItem(nidata, simulator_settings["bitem"], "Item #" + (i + 1), "simulator", true);
        }
        addnitem = " (" + nsim_items.length + ")";
    } else {
        $("#poecItemNoMsg").css({"display": "inline-block"});
    }
    $("#poecSimItemsZone").html(vHTML);
    // Behavior
    $("<div>").addClass("item_opts").click(function () {
        poec_nsimItemSwapOptions($(this), "result");
    }).appendTo($("#poecSimItemsZone").find(".poec_item"));
    $("<div>").addClass("abtn nsimclipbtn").click(function () {
        poec_nsimCopyToClipboard($(this));
    }).html('<img src="images/manual/clip.png">').appendTo($("#poecSimItemsZone").find(".poec_item"));
    $("#poecSimModeItemsChoice").html(applyLang("Items") + addnitem + '<div class="value">items</div>');
    // Pseudos computation if any
    //console.log(nsim_activepseudos);
    if (nsim_activepseudos) {
        var pcfg = {"pseudos": {}};
        $.each(nsim_activepseudos, function (pkey, pbool) {
            if (pcfg["pseudos"][pkey] == undefined) {
                if (poec_cpseudos["def"][pkey]["noitemoutput"] == undefined) {
                    if (poec_cpseudos["def"][pkey]["advanced"]) {
                        $.each(poec_cpseudos["def"][pkey]["parts"], function (partk, ptype) {
                            pcfg = poec_nsimSetupPseudoInit(pcfg, partk);
                        });
                        pcfg["pseudos"][pkey] = {};
                    } else {
                        pcfg = poec_nsimSetupPseudoInit(pcfg, pkey);
                    }
                }
            }
        });
        //console.log(pcfg);
        $("#poecSimItemsZone").find(".poec_item").each(function () {
            var idata = jQuery.parseJSON($(this).find(".item_data").html());
            //console.log(idata);
            var mparts = poec_nsimGetAffixesByParts(idata["affixes"]);
            var ipseudo = {};
            $.each(pcfg["pseudos"], function (pkey, pdat) {
                if (poec_cpseudos["def"][pkey]["advanced"] == undefined) {
                    ipseudo[pkey] = {"state": {"f": 0, "m": 100, "t": 0}};
                    if (poec_cpseudos["def"][pkey]["quality"]) {
                        ipseudo[pkey]["state"]["m"] += parseInt(idata["quality"]);
                    }
                    for (var i = 0; i < pdat["pmods"].length; i++) {
                        if (mparts[pdat["pmods"][i]["part"]] != undefined) {
                            ipseudo[pkey]["state"][pdat["pmods"][i]["type"]] += mparts[pdat["pmods"][i]["part"]] * pdat["pmods"][i]["mod"];
                        }
                    }
                    ipseudo[pkey]["state"]["t"] = (pdat["pstart"] + ipseudo[pkey]["state"]["f"]) * (ipseudo[pkey]["state"]["m"] / 100);
                }
            });
            $.each(pcfg["pseudos"], function (pkey, pdat) {
                if (poec_cpseudos["def"][pkey]["advanced"]) {
                    ipseudo[pkey] = {"state": {"f": 0, "m": 1, "t": 0}};
                    $.each(poec_cpseudos["def"][pkey]["parts"], function (partk, ptype) {
                        if (ptype == "f") {
                            ipseudo[pkey]["state"]["f"] += ipseudo[partk]["state"]["t"];
                        } else {
                            ipseudo[pkey]["state"]["m"] = ipseudo[partk]["state"]["t"];
                        }
                        ipseudo[pkey]["state"]["t"] = ipseudo[pkey]["state"]["f"] * ipseudo[pkey]["state"]["m"];
                    });
                }
            });
            var pHTML = "<div class='spacer'></div>";
            var nact = 0;
            $.each(nsim_activepseudos, function (pkey, pbool) {
                if (poec_cpseudos["def"][pkey]["noitemoutput"] == undefined) {
                    if (poec_cpseudos["def"][pkey]["decimal"] != undefined) {
                        var unum = nunber_format(ipseudo[pkey]["state"]["t"], poec_cpseudos["def"][pkey]["decimal"], ".", " ");
                    } else {
                        var unum = Math.floor(ipseudo[pkey]["state"]["t"]);
                    }
                    pHTML += "<div class='pseudo'>" + poec_cpseudos["def"][pkey]["name"] + ": <span class='num'>" + unum + "</span></div>";
                    nact++;
                }
            });
            if (nact > 0) {
                $(this).find(".affixes").append(pHTML);
            }
        });
    }
}

function poec_nsimCopyToClipboard(vThis) {

}

var nsim_curitemcontext = null;
var nsim_cursampleitem = null;

function poec_nsimItemSwapOptions(vThis, type) {
    nsim_curitemcontext = vThis;
    poec_initAffContext();

    var vHTML = "";
    if (type == "result") {
        vHTML += "<div class='swap' onClick='poec_simMoveItemTo(\"emu\")'>" + applyLang("Move to emulator") + "</div>";
        if (poec_useractive) {
            vHTML += "<div class='swap' onClick='poec_simUseAsSampleItem()'>" + applyLang("Use as sample item") + "</div>";
        }
        //vHTML+="<div class='swap' onClick='poec_simMoveItemTo(\"sim\")'>"+applyLang("Restart a simulation")+"</div>"; // TODO
    } else {
        var has_affixes = false;
        var fracsbt = {"prefix": 0, "suffix": 0};
        var fracs = 0;
        if (simulator_data["iaffixes"]) {
            if (simulator_data["iaffixes"].length > 0) {
                for (var i = 0; i < simulator_data["iaffixes"].length; i++) {
                    if (simulator_data["iaffixes"][i]["frac"]) {
                        fracsbt[simulator_data["iaffixes"][i]["atype"]]++;
                        fracs++;
                    } else {
                        has_affixes = true;
                    }
                }
            }
        }
        if (has_affixes) {
            vHTML += "<div class='swap' onClick='poec_simClearStartingItem()'>" + applyLang("Clear Affixes") + "</div>";
        } else {
            var arrt = [];
            if (fracs == 0) {
                arrt.push("normal");
            }
            if (fracsbt["prefix"] <= 1 && fracsbt["suffix"] <= 1) {
                arrt.push("magic");
            }
            arrt.push("rare");
            for (var i = 0; i < arrt.length; i++) {
                if (arrt[i] != simulator_settings["rarity"]) {
                    vHTML += "<div class='swap' onClick='poec_simChangeStartRarity(\"" + arrt[i] + "\")'>" + applyLang("Rarity > ") + arrt[i] + "</div>";
                }
            }
        }
    }
    $("#poecSAffContext").css({
        "right": $(window).width() - ($(vThis).offset().left + $(vThis).width()),
        "top": $(vThis).offset().top - 1
    }).html(vHTML).show();
}

function poec_simClearStartingItem() {
    simulator_data["iaffixes"] = [];
    simulator_settings["meta_flags"] = {};
    poec_nsimGenStartingItem();
    poec_simCloseAffixContext();
}

function poec_simChangeStartRarity(rarity) {
    simulator_settings["rarity"] = rarity;
    poec_nsimGenStartingItem();
    poec_simCloseAffixContext();
}

function poec_simMoveItemTo(where) {
    var idata = jQuery.parseJSON($(nsim_curitemcontext).parent().find(".item_data").html());
    //console.log(idata);

    if (where == "emu") {
        // Move item to emulator
        crsim_skipinitimeout = true;
        poec_selectZone($("#nmtabs").find(".emulator"));
        poec_simRestart(true, false);
        poec_simUseSimulatorItem(idata);
    } else {
        // Restart a simulation with this item
        alert("TODO");
    }
}

function poec_simUseAsSampleItem() {
    var idata = jQuery.parseJSON($(nsim_curitemcontext).parent().find(".item_data").html());
    nsim_cursampleitem = idata;
    poec_outputNotice("<div>" + applyLang("Sample item") + "</div><div>" + applyLang("Item was set succesfully!") + "</div>", "green");
}

function poec_simOutputResultsTbl(init) {
    var currencies = {};
    var curpstep = [];
    var vHTML = "<div id='poecSimResultTbl' class='coe_dtbl'><div class='title'>" + applyLang("Results per step") + "</div><div class='mods div_stable med_shadow'>";
    vHTML += "<div class='header'>";
    vHTML += "<div class='center'>" + applyLang("Step") + "</div>";
    vHTML += "<div>" + applyLang("Method") + "</div>";
    vHTML += "<div class='right'>" + applyLang("Actions") + "</div>";
    vHTML += "<div class='right'>" + applyLang("Passed") + "</div>";
    vHTML += "<div class='right'>" + applyLang("Pct.") + "</div>";
    vHTML += "<div class='right'>" + applyLang("Ratio") + "</div>";
    vHTML += "</div>";
    for (var i = 0; i < nsim_results.length; i++) {
        curpstep[i] = {};
        var method = "";
        var mroot = null;
        var mcur = [];
        var skipconcat = false;
        var skipconcatafter = false;
        if (nsim_econfig[i]) {
            for (var j = 0; j < nsim_econfig[i]["method"].length; j++) {
                var no_currency = false;
                if (!mroot) {
                    switch (nsim_econfig[i]["method"][j]) {
                        case 'modunveil' :
                            no_currency = true;
                            break;
                    }
                    if (poec_cmethods[nsim_econfig[i]["method"][j]] != undefined) {
                        mroot = poec_cmethods[nsim_econfig[i]["method"][j]];
                    } else {
                        console.log("not found root");
                        console.log(nsim_econfig[i]["method"][j]);
                    }
                } else {
                    if (mroot["subset"] == "custom") {
                        switch (nsim_econfig[i]["method"][0]) {
                            case 'fossil' :
                                var name = "";
                                var img = "";
                                for (var l = 0; l < nsim_econfig[i]["method"][j].length; l++) {
                                    if (l > 0) {
                                        name += " + <img src='images/manual/" + poecsim_selectors[nsim_econfig[i]["method"][j - 1]]["cindex"][nsim_econfig[i]["method"][j][l]]["img"] + ".png'/>";
                                    } else {
                                        img = poecsim_selectors[nsim_econfig[i]["method"][j - 1]]["cindex"][nsim_econfig[i]["method"][j][l]]["img"];
                                    }
                                    name += poecsim_selectors[nsim_econfig[i]["method"][j - 1]]["cindex"][nsim_econfig[i]["method"][j][l]]["name"];
                                    mcur.push({
                                        "name": "<img src='images/manual/fossil_6.png'/>" + mroot["name"] + "<div class='sep'>></div><img src='images/manual/" + poecsim_selectors[nsim_econfig[i]["method"][j - 1]]["cindex"][nsim_econfig[i]["method"][j][l]]["img"] + ".png'/> " + poecsim_selectors[nsim_econfig[i]["method"][j - 1]]["cindex"][nsim_econfig[i]["method"][j][l]]["name"],
                                        "id": "fossil_" + nsim_econfig[i]["method"][j][l],
                                        "num": 1
                                    });
                                }
                                mcur.push({
                                    "name": "<img src='images/manual/fossil_6.png'/>" + mroot["name"] + "<div class='sep'>></div><img src='images/manual/resonator_" + nsim_econfig[i]["method"][j].length + ".png'/>" + nsim_econfig[i]["method"][j].length + "-Socket Resonator",
                                    "id": "reso_" + nsim_econfig[i]["method"][j].length,
                                    "num": 1
                                });
                                mroot = {
                                    "name": name,
                                    "img": img
                                }
                                break;
                            case 'bench' :
                                var name = "";
                                var img = null;
                                for (var l = 0; l < nsim_econfig[i]["method"][j].length; l++) {
                                    if (nsim_econfig[i]["method"][j][l]["id"] != "remove_bench") {
                                        var tiervals = poecd['tiers'][nsim_econfig[i]["method"][j][l]["id"]][simulator_settings["base"]][nsim_econfig[i]["method"][j][l]["tier"]]["nvalues"];
                                        var pname = poecd_parseMName(poecd["modifiers"]["seq"][poecd["modifiers"]["ind"][nsim_econfig[i]["method"][j][l]["id"]]]["name_modifier"], tiervals);
                                        if (l > 0) {
                                            name += " + ";
                                        }
                                        name += pname;
                                        var bckey = nsim_econfig[i]["method"][j][l]["id"] + "b" + simulator_settings["base"];
                                        if (poecc["benchcosts"][bckey] != undefined) {
                                            if (poecc["benchcosts"][bckey][nsim_econfig[i]["method"][j][l]["tier"]] != undefined) {
                                                $.each(poecc["benchcosts"][bckey][nsim_econfig[i]["method"][j][l]["tier"]], function (bkey, bnum) {
                                                    var bterm = poec_constants["indexes"]["currency"]["bench"][bkey];
                                                    var sname = "<img src='images/manual/method_" + bterm + ".png'/>" + poec_constants["indexes"]["currency"]["poeninja"][bterm]["key"];
                                                    mcur.push({
                                                        "name": "<img src='images/manual/method_chaos.png'/>" + applyLang("Basic") + "<div class='sep'>></div>" + sname,
                                                        "id": bterm,
                                                        "num": bnum
                                                    });
                                                });
                                            } else {
                                                console.log("Could not find tier benchcosts for '" + bckey + "'");
                                            }
                                        } else {
                                            console.log("Could not find benchcosts for '" + bckey + "'");
                                        }
                                    } else {
                                        name = applyLang("Remove benchcraft");
                                        no_currency = true;
                                    }
                                }
                                mroot = {
                                    "name": name,
                                    "img": img
                                }
                                break;
                            case 'essence' :
                                if (j == 1) {
                                    var name = "";
                                    var img = null;

                                    var essid = simulator_config[i]["method"][1].replace("ess", "");
                                    var ename = poecd["essences"]["seq"][poecd["essences"]["ind"][essid]]["name_essence"];
                                    img = "essence_" + ename;
                                    var tindex = nsim_econfig[i]["method"][2].replace("esst", "");
                                    var ntiers = poecd['tiers'][nsim_econfig[i]["method"][1]][simulator_settings["base"]].length;
                                    name = ename + "<div class='sep'>></div>T" + (ntiers - parseInt(tindex));
                                    switch (ename) {
                                        case 'Horror' :
                                        case 'Hysteria' :
                                        case 'Insanity' :
                                        case 'Delirium' :
                                            var nindex = 8;
                                            break;
                                        default:
                                            var nindex = (7 - ntiers) + parseInt(tindex) + 1;
                                            break;
                                    }
                                    mcur.push({
                                        "name": "<img src='images/manual/essence_Horror.png'/>" + applyLang("Essence") + "<div class='sep'>></div>" + name,
                                        "id": "essence_" + poecd["essences"]["seq"][poecd["essences"]["ind"][essid]]["name_essence"] + "_" + nindex,
                                        "num": 1
                                    });

                                    mroot = {
                                        "name": name,
                                        "img": img
                                    }
                                    skipconcatafter = true;
                                }
                                break;
                            default :
                                if (poecsim_selectors[nsim_econfig[i]["method"][j - 1]]["cindex"]) {
                                    if (poecsim_selectors[nsim_econfig[i]["method"][j - 1]]["cindex"][nsim_econfig[i]["method"][j]]) {
                                        var nroot = {
                                            "name": poecsim_selectors[nsim_econfig[i]["method"][j - 1]]["cindex"][nsim_econfig[i]["method"][j]]["name"],
                                            "img": poecsim_selectors[nsim_econfig[i]["method"][j - 1]]["cindex"][nsim_econfig[i]["method"][j]]["img"]
                                        }
                                        mroot = nroot;
                                    }
                                }
                                break;
                        }
                    } else {
                        switch (nsim_econfig[i]["method"][j]) {
                            case 'restimprint' :
                                no_currency = true;
                                break;
                        }
                        if (mroot["subset"]) {
                            if (mroot["subset"][nsim_econfig[i]["method"][j]] != undefined) {
                                mroot = mroot["subset"][nsim_econfig[i]["method"][j]];
                            } else {
                                console.log("child not found");
                                console.log(nsim_econfig[i]["method"][j]);
                            }
                        }
                    }
                }
                if (!skipconcat) {
                    var addimg = "";
                    if (mroot["img"] != undefined) {
                        addimg += "<img src='images/manual/" + mroot["img"] + ".png'/>";
                    }
                    if (j > 0) {
                        method += "<div class='sep'>></div>";
                    }
                    method += addimg + mroot["name"];
                }
                if (skipconcatafter) {
                    skipconcat = true;
                }
                if (nsim_econfig[i]["method"][0] == "fossil" && j == 1) {
                    break;
                }
            }
            if (!init) {
                if (!no_currency) {
                    var lastmet = nsim_econfig[i]["method"][nsim_econfig[i]["method"].length - 1];
                    switch (nsim_econfig[i]["method"][0]) {
                        case 'harvest' :
                            lastmet = nsim_econfig[i]["method"][0] + "_" + nsim_econfig[i]["method"][1] + "_" + nsim_econfig[i]["method"][2];
                            break;
                    }
                    if (mcur.length > 0) {
                        for (z = 0; z < mcur.length; z++) {
                            if (currencies[mcur[z]["id"]] == undefined) {
                                currencies[mcur[z]["id"]] = {"label": mcur[z]["name"], "cnt": 0};
                            }
                            if (curpstep[i][mcur[z]["id"]] == undefined) {
                                curpstep[i][mcur[z]["id"]] = {"label": mcur[z]["name"], "cnt": 0};
                            }
                            currencies[mcur[z]["id"]]["cnt"] += (nsim_results[i]["cnt"] * mcur[z]["num"]);
                            curpstep[i][mcur[z]["id"]]["cnt"] += mcur[z]["num"];
                        }
                    } else {
                        if (currencies[lastmet] == undefined) {
                            currencies[lastmet] = {"label": method, "cnt": 0};
                        }
                        if (curpstep[i][lastmet] == undefined) {
                            curpstep[i][lastmet] = {"label": method, "cnt": 0};
                        }
                        currencies[lastmet]["cnt"] += nsim_results[i]["cnt"];
                        curpstep[i][lastmet]["cnt"] = 1;
                    }
                }
            }
        }
        vHTML += "<div class='mod step" + i + "'>";
        vHTML += "<div class='step center'><div class='num'>" + (i + 1) + "</div></div>";
        vHTML += "<div class='method'>" + method + "</div>";
        if (!init) {
            vHTML += "<div class='right cnt'>" + nsim_results[i]["cnt"] + "</div>";
            vHTML += "<div class='right pass'>" + nsim_results[i]["pass"] + "</div>";
            var pct = 0;
            var ratio = "<span class='na'>N/A</span>";
            if (nsim_results[i]["cnt"] > 0) {
                pct = nsim_results[i]["pass"] / nsim_results[i]["cnt"];
                if (pct > 0) {
                    ratio = "1 / " + Math.ceil(1 / pct);
                }
            }
            vHTML += "<div class='right pct'>" + poec_parsePct(pct) + "</div>";
            vHTML += "<div class='right ratio'>" + ratio + "</div>";
        } else {
            vHTML += "<div class='right cnt'>0</div>";
            vHTML += "<div class='right pass'>0</div>";
            vHTML += "<div class='right pct'><span class='na'>N/A</span></div>";
            vHTML += "<div class='right ratio'><span class='na'>N/A</span></div>";
        }
        vHTML += "</div>";
    }
    vHTML += "</div></div>";

    if (!init) {
        // Currency breakdown and currency per success
        if (nsim_benchrem > 0) {
            if (currencies["scour"] == undefined) {
                currencies["scour"] = {
                    "label": "<img src='images/manual/method_chaos.png'/>" + applyLang("Basic") + "<div class='sep'>></div><img src='images/manual/method_scour.png'/>" + applyLang("Orb of Scouring"),
                    "cnt": 0
                };
            }
            currencies["scour"]["cnt"] += nsim_benchrem;
        }
        var successes = nsim_numsuccess;
        if (successes > 0) {
            var exaltrate = poecp["data"][poec_cLNinja]["currency"]["Divine Orb"];
            vHTML += "<div id='poecSimCurrenciesTbl' class='coe_dtbl'><div class='title'>" + applyLang("Costs per success") + "</div><div class='mods div_stable med_shadow'>";
            vHTML += "<div class='header'>";
            vHTML += "<div>" + applyLang("Currency") + "</div>";
            vHTML += "<div class='right'>" + applyLang("# used") + "</div>";
            vHTML += "<div class='right'>" + applyLang("To chaos") + "</div>";
            vHTML += "<div class='right'>" + applyLang("To exalt") + "</div>";
            vHTML += "</div>";
            var totalspent = 0;
            var prcpcur = {};
            $.each(currencies, function (ckey, cur) {
                if (nsim_ignorecur.indexOf("|" + ckey + "|") > -1) {
                } else {
                    var pers = Math.ceil(cur["cnt"] / successes);

                    var tochaos = "<span class='na'>N/A</span>";
                    var toexalt = "<span class='na'>N/A</span>";

                    var poeninja = null;
                    if (ckey.indexOf("fossil_") > -1) {
                        var fosid = ckey.replace("fossil_", "");
                        switch (fosid) {
                            case 'perfect':
                                fosname = "Perfect";
                                break;
                            case 'gilded':
                                fosname = "Gilded";
                                break;
                            case 'tangled':
                                fosname = "Tangled";
                                break;
                            default:
                                var fosname = poecd["fossils"]["seq"][poecd["fossils"]["ind"][fosid]]["name_fossil"];
                                break;
                        }
                        poeninja = {"grp": "fossils", "key": fosname};
                    } else {
                        if (ckey.indexOf("essence_") > -1) {
                            var essbrk = ckey.split("_");
                            var essname = essbrk[1];
                            var esstier = parseInt(essbrk[2]);
                            switch (essname) {
                                case 'Dread' :
                                    if (simulator_settings["base"] == 20) { // Bows with dreads have t1 and t2 at same effect
                                        esstier--;
                                    }
                                    break;
                            }
                            poeninja = {"grp": "essences", "key": essname, "subkey": esstier};
                        } else {
                            if (ckey.indexOf("harvest_") > -1) {
                                var harvid = ckey.split("_");
                                var harvend = harvid[2];
                                switch (harvid[1]) {
                                    case 'haugment' :
                                    case 'hnonto' :
                                    case 'hreroll' :
                                    case 'hrerollp' :
                                        if (harvend == "inf") {
                                            harvend = "influence";
                                        } else {
                                            for (var z = 0; z < poecd['mtypes']['seq'].length; z++) {
                                                if (poecd['mtypes']['seq'][z]["harvest"] == "1") {
                                                    if (poecd['mtypes']['seq'][z]["id_mtype"] == harvend) {
                                                        harvend = poecd['mtypes']['seq'][z]["name_mtype"].toLowerCase().replace("defences", "defence");
                                                    }
                                                }
                                            }
                                        }
                                        break;
                                }
                                if (poecp["data"][poec_cLNinja]["harvest"]) {
                                    if (poecp["data"][poec_cLNinja]["harvest"][harvid[1]]) {
                                        if (poecp["data"][poec_cLNinja]["harvest"][harvid[1]][harvend]) {
                                            poeninja = poecp["data"][poec_cLNinja]["harvest"][harvid[1]][harvend];
                                        }
                                    }
                                }
                            } else {
                                poeninja = poec_constants["indexes"]["currency"]["poeninja"][ckey];
                            }
                        }
                    }

                    if (!poeninja) {
                        switch (ckey) {
                            case 'recombinate' :
                                // Find out which of the 3 recombinators it is
                                if (simulator_settings["bgroup"] == 6) {
                                    // Jewellery
                                    poeninja = poec_constants["indexes"]["currency"]["poeninja"]["jrecomb"];
                                } else {
                                    if (poec_constants["constraints"]["weapon_bgroups"].indexOf("|" + simulator_settings["bgroup"] + "|") > -1 || simulator_settings["base"] == 4) {
                                        // Weapon
                                        poeninja = poec_constants["indexes"]["currency"]["poeninja"]["wrecomb"];
                                    } else {
                                        // Armor
                                        poeninja = poec_constants["indexes"]["currency"]["poeninja"]["arecomb"];
                                    }
                                }
                                cur["label"] = '<img src="images/manual/recombinate.png">' + poeninja["key"];
                                break;
                        }
                    }

                    if (!poeninja) {
                        // Check in "other" group
                        console.log("checking");
                        if (poecp["data"][poec_cLNinja]["other"][ckey] != undefined) {
                            poeninja = poecp["data"][poec_cLNinja]["other"][ckey];
                        }
                    }

                    prcpcur[ckey] = null;
                    if (poeninja) {
                        if (!isNaN(poeninja)) {
                            var takeninja = poeninja;
                        } else {
                            if (poeninja["subkey"] != undefined) {
                                var takeninja = poecp["data"][poec_cLNinja][poeninja["grp"]][poeninja["key"]][poeninja["subkey"]];
                            } else {
                                var takeninja = poecp["data"][poec_cLNinja][poeninja["grp"]][poeninja["key"]];
                            }
                        }
                        if (takeninja != undefined) {
                            var tochaos = number_format(pers * takeninja, 2, ".", " ");
                            totalspent += parseFloat(pers * takeninja);
                            var toexalt = number_format((pers * takeninja) / exaltrate, 2, ".", " ");
                            prcpcur[ckey] = takeninja;
                        } else {
                            console.log("poeninja not found for group='" + poeninja["grp"] + "' key='" + poeninja["key"] + "' subkey='" + poeninja["subkey"] + "'");
                        }
                    } else {
                        console.log("poeninja not found for '" + ckey + "'");
                    }

                    vHTML += "<div class='mod'>";
                    vHTML += "<div class='method'>" + cur["label"] + "</div>";
                    vHTML += "<div class='right'>" + pers + "</div>";
                    vHTML += "<div class='right'>" + tochaos + "</div>";
                    vHTML += "<div class='right'>" + toexalt + "</div>";
                    vHTML += "</div>";
                }
            });
            // Output total avg spent per success
            var tochaos = number_format(totalspent, 2, ".", " ");
            var toexalt = number_format(totalspent / exaltrate, 2, ".", " ");
            vHTML += "<div class='header total'>";
            vHTML += "<div>" + applyLang("Total per success") + "</div>";
            vHTML += "<div class='right'></div>";
            vHTML += "<div class='right'><img src='images/manual/method_chaos.png'>" + tochaos + "</div>";
            vHTML += "<div class='right'><img src='images/manual/method_divine.png'>" + toexalt + "</div>";
            vHTML += "</div>";

            nsim_crafts.sort(poec_sortByActions);
            //console.log(nsim_crafts);
            //console.log(curpstep);
            //console.log(prcpcur);
            var amount = 0;
            var takecraft = nsim_crafts[0];
            $.each(takecraft["steps"], function (k, v) {
                $.each(curpstep[k], function (ck, cv) {
                    if (prcpcur[ck]) {
                        amount += prcpcur[ck] * cv["cnt"] * v;
                    }
                });
            });
            vHTML += "<div class='header total sub'>";
            vHTML += "<div>" + applyLang("Cheapest craft") + "</div>";
            vHTML += "<div class='right'></div>";
            vHTML += "<div class='right'><img src='images/manual/method_chaos.png'>" + number_format(amount, 2, ".", " ") + "</div>";
            vHTML += "<div class='right'><img src='images/manual/method_divine.png'>" + number_format(amount / exaltrate, 2, ".", " ") + "</div>";
            vHTML += "</div>";
            var amount = 0;
            var takecraft = nsim_crafts[nsim_crafts.length - 1];
            $.each(takecraft["steps"], function (k, v) {
                $.each(curpstep[k], function (ck, cv) {
                    if (prcpcur[ck]) {
                        amount += prcpcur[ck] * cv["cnt"] * v;
                    }
                });
            });
            vHTML += "<div class='header total sub'>";
            vHTML += "<div>" + applyLang("Costliest craft") + "</div>";
            vHTML += "<div class='right'></div>";
            vHTML += "<div class='right'><img src='images/manual/method_chaos.png'>" + number_format(amount, 2, ".", " ") + "</div>";
            vHTML += "<div class='right'><img src='images/manual/method_divine.png'>" + number_format(amount / exaltrate, 2, ".", " ") + "</div>";
            vHTML += "</div>";

            vHTML += "</div>";

            if (nsimStoreDist) {
                vHTML += "<div id='poecSimModDistTbl' class='coe_dtbl'><div class='title'>" + applyLang("Mod distribution on success") + "</div><div class='mods div_stable med_shadow'>";
                var rheader = "";
                var rcount = "";
                var rdist = "";
                var rsuccess = "";
                var nmod = {};
                $.each(nsim_distributions["mod"], function (key, num) {
                    if (num > 0) {
                        var bkey = key.split("-");
                        var nmods = parseInt(bkey[0]) + parseInt(bkey[1]);
                        if (nmod[nmods] == undefined) {
                            nmod[nmods] = 0;
                        }
                        nmod[nmods] += num;
                        var rat = num / successes;
                        rheader += "<div class='center'>" + bkey[0] + "/" + bkey[1] + "</div>";
                        rcount += "<div class='center'>" + num + "</div>";
                        rdist += "<div class='center'>" + poec_parsePct(rat) + "</div>";
                        if (nsim_econfig.length == 1) {
                            var srat = num / nsimFixedCnt;
                            rsuccess += "<div class='center'>" + poec_parsePct(srat) + "</div>";
                        }
                    }
                });
                var nmbk = [];
                $.each(nmod, function (nmods, num) {
                    nmbk.push([nmods, num]);
                });
                nmbk.sort(function (a, b) {
                    return a[0] > b[0] ? 1 : -1;
                });
                var totr = 0;
                for (var i = 0; i < nmbk.length; i++) {
                    rheader += "<div class='center'>" + nmbk[i][0] + " mod</div>";
                    rcount += "<div class='center'>" + nmbk[i][1] + "</div>";
                    rdist += "<div class='center'>" + poec_parsePct(nmbk[i][1] / successes) + "</div>";
                    if (nsim_econfig.length == 1) {
                        var srat = nmbk[i][1] / nsimFixedCnt;
                        totr += nmbk[i][1];
                        rsuccess += "<div class='center'>" + poec_parsePct(srat) + "</div>";
                    }
                }

                rheader += "<div class='center'>Total</div>";
                rcount += "<div class='center'>" + successes + "</div>";
                rdist += "<div class='center'>" + poec_parsePct(1) + "</div>";
                if (nsim_econfig.length == 1) {
                    rsuccess += "<div class='center'>" + poec_parsePct(totr / nsimFixedCnt) + "</div>";
                }

                vHTML += "<div class='header'><div>" + applyLang("Results") + "</div>" + rheader + "</div>";
                vHTML += "<div class='mod'><div>" + applyLang("Count") + "</div>" + rcount + "</div>";
                vHTML += "<div class='mod'><div>" + applyLang("Distribution") + "</div>" + rdist + "</div>";
                if (nsim_econfig.length == 1) {
                    vHTML += "<div class='mod'><div>" + applyLang("Success") + "</div>" + rsuccess + "</div>";
                }
                vHTML += "</div></div>";

                // Affix dist
                var mdak = {"prefix": [], "suffix": []};
                $.each(nsim_distributions["affix"], function (mkey, mdat) {
                    mdak[poecd["modifiers"]["seq"][poecd["modifiers"]["ind"][mkey]]["affix"]].push([mdat["num"] / successes, mkey, mdat["num"], mdat["tt"]]);
                });
                mdak["prefix"].sort(function (a, b) {
                    return a[0] > b[0] ? 1 : -1;
                });
                mdak["prefix"].reverse();
                mdak["suffix"].sort(function (a, b) {
                    return a[0] > b[0] ? 1 : -1;
                });
                mdak["suffix"].reverse();
                vHTML += "<div id='poecSimAffixDistTbl' class='coe_dtbl'><div class='title'>" + applyLang("Affix distribution on success") + "</div>";
                vHTML += "<div class='div_stable'><div><div>";
                vHTML += "<div class='mods div_stable med_shadow'>";
                vHTML += "<div class='header'><div>" + applyLang("Prefixes") + "</div><div class='right'>" + applyLang("Avg. Tier") + "</div><div class='right'>" + applyLang("Count") + "</div><div class='right'>" + applyLang("Presence") + "</div></div>";
                for (var i = 0; i < mdak["prefix"].length; i++) {
                    vHTML += "<div class='mod'>";
                    vHTML += "<div class='label'>" + poecl["mod"][mdak["prefix"][i][1]] + "</div>";
                    var ntiers = poecd["tiers"][mdak["prefix"][i][1]][simulator_settings["base"]].length;
                    //console.log(ntiers+"-("+mdak["prefix"][i][3]+"/"+mdak["prefix"][i][2]+")");
                    var atier = Math.round(ntiers - (mdak["prefix"][i][3] / mdak["prefix"][i][2]));
                    vHTML += "<div class='right'>" + atier + "</div>";
                    vHTML += "<div class='right'>" + mdak["prefix"][i][2] + "</div>";
                    vHTML += "<div class='right'>" + poec_parsePct(mdak["prefix"][i][0]) + "</div>";
                    vHTML += "</div>";
                }
                vHTML += "</div>";
                vHTML += "</div><div>";
                vHTML += "<div class='mods div_stable med_shadow'>";
                vHTML += "<div class='header'><div>" + applyLang("Suffixes") + "</div><div class='right'>" + applyLang("Avg. Tier") + "</div><div class='right'>" + applyLang("Count") + "</div><div class='right'>" + applyLang("Presence") + "</div></div>";
                for (var i = 0; i < mdak["suffix"].length; i++) {
                    vHTML += "<div class='mod'>";
                    vHTML += "<div class='label'>" + poecl["mod"][mdak["suffix"][i][1]] + "</div>";
                    var ntiers = poecd["tiers"][mdak["suffix"][i][1]][simulator_settings["base"]].length;
                    //console.log(ntiers+"-("+mdak["suffix"][i][3]+"/"+mdak["suffix"][i][2]+")");
                    var atier = Math.round(ntiers - (mdak["suffix"][i][3] / mdak["suffix"][i][2]));
                    vHTML += "<div class='right'>" + atier + "</div>";
                    vHTML += "<div class='right'>" + mdak["suffix"][i][2] + "</div>";
                    vHTML += "<div class='right'>" + poec_parsePct(mdak["suffix"][i][0]) + "</div>";
                    vHTML += "</div>";
                }
                vHTML += "</div>";
                vHTML += "</div></div></div></div>";
            }
        }
    }

    return vHTML;
}

function poec_sortByActions(a, b) {
    if (a["actions"] === b["actions"]) {
        return 0;
    } else {
        return (a["actions"] < b["actions"]) ? -1 : 1;
    }
}

function poec_simLoopRTUpd() {
    $("#poecSimResultTbl").find(".mod.step" + nsim_lstep).each(function () {
        $(this).find(".cnt").html(nsim_results[nsim_lstep]["cnt"]);
        $(this).find(".pass").html(nsim_results[nsim_lstep]["pass"]);
        var pct = 0;
        var ratio = "<span class='na'>N/A</span>";
        if (nsim_results[nsim_lstep]["cnt"] > 0) {
            pct = nsim_results[nsim_lstep]["pass"] / nsim_results[nsim_lstep]["cnt"];
            if (pct > 0) {
                ratio = "1 / " + Math.ceil(1 / pct);
            }
        }
        $(this).find(".pct").html(poec_parsePct(pct));
        $(this).find(".ratio").html(ratio);
    });
}

// DEBUG LAYOUT
function poec_simOutputDebugLayout() {
    var dhtml = "";

    dhtml += "<div id='poecSimDebugHolder'><div id='poecSimDebugLayout' class='div_stable'>";
    dhtml += poec_simGenerateInstruction("debug");
    dhtml += "</div></div>";

    return dhtml;
}

/* CURRENT DEBUG */
function poec_simSetCurrentDebug(init) {
    $("#poec_simDebugNextBtn").removeClass("disabled");
    $("#poecSimDebugLayout").find(".step").removeClass("current win fail");
    var dbs = {
        "cur": nsim_cstep + 1,
        "win": null,
        "fail": null
    }
    if (init) {
        // Setup
        dbs["cur"] = "S";
        dbs["win"] = 1;
        if ($("#poecSimDebugItem").length == 0) {
            $("<div>").attr("id", "poecSimDebugItem").addClass("med_shadow").html("<div class='state'><div id='poecFixedStatusZone'></div></div><div class='actions'><div class='mcui-button green' id='poec_simDebugNextBtn' onClick='poec_simDebugNext()'>" + applyLang("Next") + "</div><div class='mcui-button red' onClick='poec_simDebugStop()'>" + applyLang("Stop") + "</div></div><div id='poecSimDebugItemZone'></div>").appendTo($("body"));
        }
        $("#poecSimDebugItem").show();
        $("#poecFixedStatusZone").show();
    } else {
        switch (nsim_econfig[nsim_cstep]["actions"]["win"]) {
            case 'next' :
                dbs["win"] = nsim_cstep + 2;
                break;
            case 'end' :
                dbs["win"] = "E";
                break;
            case 'step' :
                dbs["win"] = nsim_econfig[nsim_cstep]["actions"]["win_route"];
                break;
        }
        switch (nsim_econfig[nsim_cstep]["actions"]["fail"]) {
            case 'restart' :
                dbs["fail"] = "S";
                break;
            case 'step' :
                dbs["fail"] = nsim_econfig[nsim_cstep]["actions"]["fail_route"];
                break;
        }
    }
    $("#poecSimDebugLayout").find(".dbstep" + dbs["cur"]).addClass("current");
    if (dbs["win"]) {
        $("#poecSimDebugLayout").find(".dbstep" + dbs["win"]).addClass("win");
    }
    if (dbs["fail"]) {
        $("#poecSimDebugLayout").find(".dbstep" + dbs["fail"]).addClass("fail");
    }
    // Update item
    var nidata = {
        "quality": simulator_settings["quality"],
        "catalyst": crsim_bypass["catalyst"],
        "affixes": crsim_bypass["iaffixes"],
        "implicits": crsim_bypass["implicits"],
        "eldritch": crsim_bypass["eldritch"],
        "enchant": "",
        "influences": crsim_bypass["influences"],
        "rarity": crsim_bypass["rarity"],
        "ilvl": simulator_settings["ilvl"],
        "base": crsim_bypass["base"]
    };
    $("#poecSimDebugItemZone").html(poec_simGetFullItem(nidata, simulator_settings["bitem"], "Current state", "simulator", true));
    // Update counts
    for (var i = 0; i < nsim_results.length; i++) {
        $("#poecSimDebugLayout").find(".dbstep" + (i + 1)).find(".count").html(nsim_results[i]["cnt"] - nsim_results[i]["pass"]);
        $("#poecSimDebugLayout").find(".dbstep" + (i + 1)).find(".pass").html(nsim_results[i]["pass"]);
    }
    // Scroll to current step
    var ctop = $("#poecSimDebugLayout").find(".dbstep" + dbs["cur"]).offset().top;
    var cheight = $("#poecSimDebugLayout").find(".dbstep" + dbs["cur"]).outerHeight();
    var stop = $(window).scrollTop();
    var wheight = $(window).height();
    if (ctop + cheight > stop + wheight || stop > ctop + cheight) {
        $(window).scrollTop($("#poecSimDebugLayout").find(".dbstep" + dbs["cur"]).offset().top - 150);
    }
    poec_simScroll();
    poec_simResize();
}

function poec_simDebugNext() {
    if (!$("#poec_simDebugNextBtn").hasClass("disabled")) {
        nsim_firstofloop = true;
        poec_simLoopAction();
    }
}

function poec_simDebugStop() {
    poec_simStopLoops(null, false);
    $("#poecSimDebugItem").remove();
    poec_simOutputResults(false);
}

/****************/
/* INSTRUCTIONS */

/****************/
function poec_simGenerateInstruction(imode) {
    poec_nsimGenerateConfigData();
    //console.log(simulator_config);
    var ihtml = "";
    var istephtml = [];
    for (var i = 0; i < simulator_config.length; i++) {
        if (simulator_config[i]["method"][0] != null) {
            var start = "Use";
            var what = "";
            var endline = "";
            var is_plural = false;
            var onsuccess = "";
            var onfailure = "";
            var failure_short = "";

            if (simulator_config[i]["autopass"] == false) {
                switch (simulator_config[i]["actions"]["fail"]) {
                    case 'loop' :
                        // Use (s) until
                        endline += " " + applyLang("until you get");
                        is_plural = true;
                        break;
                    case 'restart' :
                        onfailure = applyLang("restart from first step");
                        failure_short = applyLang("Restart");
                        break;
                    case 'step' :
                        var isback = "";
                        if (simulator_config[i]["actions"]["fail_route"] < i + 1) {
                            isback = "back ";
                        }
                        onfailure = applyLang("go " + isback + "to step") + " " + simulator_config[i]["actions"]["fail_route"];
                        failure_short = applyLang("Step") + " " + simulator_config[i]["actions"]["fail_route"];
                        break;
                    default:
                        break;
                }
            }

            switch (simulator_config[i]["method"][0]) {
                case 'fossil' :
                    if (is_plural) {
                        what += applyLang("Fossils") + " [";
                    } else {
                        what += applyLang("a") + " " + applyLang("Fossil") + " [";
                    }
                    if (simulator_config[i]["method"][1]) {
                        var fossils = simulator_config[i]["method"][1].substring(1, simulator_config[i]["method"][1].length - 1).split("|");
                        for (var j = 0; j < fossils.length; j++) {
                            if (j > 0) {
                                what += "+";
                            }
                            switch (fossils[j]) {
                                case 'perfect':
                                    var fname = applyLang("Perfect");
                                    break;
                                case 'gilded':
                                    var fname = applyLang("Gilded");
                                    break;
                                case 'tangled':
                                    var fname = applyLang("Tangled");
                                    fname += " (";
                                    if (simulator_config[i]["method"][2]["pos"]) {
                                        fname += applyLang("Greatly more") + " " + poecd["mtypes"]["seq"][poecd["mtypes"]["ind"][simulator_config[i]["method"][2]["pos"]]]["name_mtype"];
                                    }
                                    fname += ", ";
                                    if (simulator_config[i]["method"][2]["neg"]) {
                                        fname += applyLang("No") + " " + poecd["mtypes"]["seq"][poecd["mtypes"]["ind"][simulator_config[i]["method"][2]["neg"]]]["name_mtype"];
                                    }
                                    fname += ")";
                                    break;
                                default:
                                    var fname = poecd["fossils"]["seq"][poecd["fossils"]["ind"][fossils[j]]]["name_fossil"];
                                    break;
                            }
                            what += fname;
                        }
                    }
                    what += "]";
                    break;
                case 'bench' :
                    start = "Benchcraft";
                    if (typeof simulator_config[i]["method"][1] === 'string') {
                        var bsel = simulator_config[i]["method"][1].substring(1, simulator_config[i]["method"][1].length - 1).split("|");
                        for (var z = 0; z < bsel.length; z++) {
                            if (bsel[z] == "remove_bench") {
                                start = applyLang("Remove benchcraft");
                            } else {
                                if (z > 0) {
                                    what += " and ";
                                }
                                bsel[z] = bsel[z].split("t");
                                var fname = poecl["mod"][bsel[z][0]];
                                var nvalues = poecd["tiers"][bsel[z][0]][simulator_settings["base"]][bsel[z][1]]["nvalues"];
                                var pname = poecd_parseMName(fname, nvalues);
                                what += "[" + pname + "]";
                            }
                        }
                    } else {
                        what += "[???]";
                    }
                    break;
                case 'beast_crafting' :
                    if (simulator_config[i]["method"][1] == "restimprint") {
                        start = applyLang("Restore imprint");
                    } else {
                        if (!is_plural) {
                            start += " " + applyLang("a") + " ";
                        }
                        start += applyLang("Beast");
                        if (is_plural) {
                            start += "s";
                        }
                        start += " [";
                        start += poec_constants["indexes"]["currency"]["poeninja"][simulator_config[i]["method"][1]]["key"];
                        start += "]";
                    }
                    break;
                case 'harvest' :
                    start = applyLang("Harvest crafting") + " > ";
                    switch (simulator_config[i]["method"][1]) {
                        case 'hother' :
                            break;
                        default:
                            start += poec_cmethods["harvest"]["subset"][simulator_config[i]["method"][1]]["name"] + " > ";
                            break;
                    }
                    switch (simulator_config[i]["method"][1]) {
                        case 'hresist' :
                        case 'hother' :
                            start += poec_cmethods["harvest"]["subset"][simulator_config[i]["method"][1]]["subset"][simulator_config[i]["method"][2]]["name"];
                            break;
                        default:
                            if (simulator_config[i]["method"][2] == "inf") {
                                start += applyLang("Influence");
                            } else {
                                for (var z = 0; z < poecd['mtypes']['seq'].length; z++) {
                                    if (poecd['mtypes']['seq'][z]["harvest"] == "1") {
                                        if (poecd['mtypes']['seq'][z]["id_mtype"] == simulator_config[i]["method"][2]) {
                                            start += poecl["mtype"][poecd['mtypes']['seq'][z]["id_mtype"]]
                                        }
                                    }
                                }
                            }
                            break;
                    }
                    break;
                case 'essence' :
                    var essid = simulator_config[i]["method"][1].replace("ess", "");
                    var essname = poecd["essences"]["seq"][poecd["essences"]["ind"][essid]]["name_essence"];
                    var esstier = parseInt(simulator_config[i]["method"][2].replace("esst", ""));
                    var btiers = jQuery.parseJSON(poecd["essences"]["seq"][poecd["essences"]["ind"][essid]]["tiers"]);
                    var modid = btiers[simulator_settings["base"]];
                    var ntiers = poecd["tiers"][modid][simulator_settings["base"]].length;
                    switch (essname) {
                        case 'Dread' :
                            if (simulator_settings["base"] == 20) { // Bows with dreads have t1 and t2 at same effect
                                ntiers++;
                            }
                            break;
                    }
                    var esspref = "";
                    switch (essname) {
                        case 'Horror' :
                        case 'Insanity' :
                        case 'Delirium' :
                        case 'Hysteria' :
                            break;
                        default:
                            var trueetier = esstier + (7 - ntiers) + 1;
                            switch (trueetier) {
                                case 1 :
                                    esspref = applyLang("Whispering") + " ";
                                    break;
                                case 2 :
                                    esspref = applyLang("Muttering") + " ";
                                    break;
                                case 3 :
                                    esspref = applyLang("Weeping") + " ";
                                    break;
                                case 4 :
                                    esspref = applyLang("Wailing") + " ";
                                    break;
                                case 5 :
                                    esspref = applyLang("Screaming") + " ";
                                    break;
                                case 6 :
                                    esspref = applyLang("Shrieking") + " ";
                                    break;
                                case 7 :
                                    esspref = applyLang("Deafening") + " ";
                                    break;
                            }
                            break;
                    }

                    start += " ";
                    if (!is_plural) {
                        if (esspref == "") {
                            start += applyLang("an") + " ";
                        } else {
                            start += applyLang("a") + " ";
                        }
                    }
                    start += esspref;
                    start += applyLang("Essence");
                    if (is_plural) {
                        start += "s";
                    }
                    start += " " + applyLang("of") + " " + essname;
                    break;
                case 'check' :
                    start = applyLang("Check that the item");
                    break;
                case 'modunveil' :
                    start = applyLang("Unveil a modifier");
                    break;
                case 'metamethod' :
                    start += " Meta-method [" + simulator_metam[simulator_config[i]["method"][1]]["name"] + "]";
                    break;
                case 'recombinate' :
                    start += applyLang(" a Recombinator");
                    break;
                default:
                    var onlyend = false;
                    for (var j = 0; j < simulator_config[i]["method"].length; j++) {
                        if (simulator_config[i]["method"][0] == "currency") {
                            onlyend = true;
                        }
                        var proceed = true;
                        if (onlyend) {
                            if (j < simulator_config[i]["method"].length - 1) {
                                proceed = false;
                            }
                        }
                        if (proceed) {
                            if (j > 0) {
                                what += " ";
                            }
                            if (poecsim_selectors[simulator_config[i]["method"][j]] == undefined) {
                                var taken = null;
                                var psing = "";
                                if (poecsim_selectors[simulator_config[i]["method"][j - 1]]["data"] == "custom") {
                                    taken = "";
                                } else {
                                    if (is_plural) {
                                        if (poecsim_selectors[simulator_config[i]["method"][j - 1]]["data"][simulator_config[i]["method"][j]]["plural"]) {
                                            taken = poecsim_selectors[simulator_config[i]["method"][j - 1]]["data"][simulator_config[i]["method"][j]]["plural"];
                                        }
                                    } else {
                                        if (poecsim_selectors[simulator_config[i]["method"][j - 1]]["data"][simulator_config[i]["method"][j]]["psing"]) {
                                            psing = poecsim_selectors[simulator_config[i]["method"][j - 1]]["data"][simulator_config[i]["method"][j]]["psing"] + " ";
                                        } else {
                                            psing = applyLang("a") + " ";
                                        }
                                    }
                                    if (!taken) {
                                        if (onlyend || j == 0) {
                                        } else {
                                            psing = "";
                                        }
                                        taken = psing + poecsim_selectors[simulator_config[i]["method"][j - 1]]["data"][simulator_config[i]["method"][j]]["name"];
                                    }
                                }
                            } else {
                                var taken = null;
                                if (is_plural) {
                                    if (poecsim_selectors[simulator_config[i]["method"][j]]["settings"]["plural"]) {
                                        taken = poecsim_selectors[simulator_config[i]["method"][j]]["settings"]["plural"];
                                    }
                                } else {
                                    if (poecsim_selectors[simulator_config[i]["method"][j]]["settings"]["psing"]) {
                                        psing = poecsim_selectors[simulator_config[i]["method"][j]]["settings"]["psing"] + " ";
                                    } else {
                                        psing = applyLang("a") + " ";
                                    }
                                }
                                if (!taken) {
                                    if (onlyend || j == 0) {
                                    } else {
                                        psing = "";
                                    }
                                    taken = psing + poecsim_selectors[simulator_config[i]["method"][j]]["settings"]["name"];
                                }
                            }
                            what += taken;
                        }
                    }
                    break;
            }

            // Check for conditions
            var conditions = poec_nsimGetStepConditions(simulator_config[i], is_plural, "instructions");

            var success_short = "";
            switch (simulator_config[i]["actions"]["win"]) {
                case 'next' :
                    success_short += applyLang("Next");
                    break;
                case 'end' :
                    onsuccess += applyLang("the item is done!");
                    success_short += applyLang("Done!");
                    break;
                case 'step' :
                    var isback = "";
                    if (simulator_config[i]["actions"]["win_route"] < i + 1) {
                        isback = "back ";
                    }
                    onsuccess += applyLang("go " + isback + "to step") + " " + simulator_config[i]["actions"]["win_route"];
                    success_short += applyLang("Step") + " " + simulator_config[i]["actions"]["win_route"];
                    break;
            }

            if (onsuccess != "") {
                if (!simulator_config[i]["autopass"]) {
                    var prepend = applyLang("If so, ");
                } else {
                    var prepend = applyLang("Then, ");
                }
                onsuccess = prepend + onsuccess + "<br>";
            }

            if (onfailure != "") {
                onfailure = applyLang("If not, ") + onfailure + "<br>";
            }

            ihtml += (i + 1) + " - " + start + " " + what + endline + "<br/>";
            ihtml += conditions;
            ihtml += onsuccess;
            ihtml += onfailure;

            istephtml.push({
                "step": (i + 1),
                "title": start + " " + what + endline,
                "content": conditions + onsuccess + onfailure,
                "conditions": conditions,
                "onsuccess": success_short,
                "onfailure": failure_short
            });
        }
    }

    if (imode == "standard") {
        var ohtml = "";
        if (istephtml.length == 0) {
            ohtml = "<div class='poecsimnotice_holder'><div class='message poecsimnotice'><div>" + applyLang("Notice") + "</div><div>" + applyLang("No configuration to turn into instructions.") + "</div></div></div>";
            $("#poecSimCopyInstBtn").hide();
        } else {
            $("#poecSimCopyInstBtn").show();
            // Visual output
            for (var i = 0; i < istephtml.length > 0; i++) {
                ohtml += "<div class='step'>";
                ohtml += "<div class='stepnum'>" + istephtml[i]["step"] + "</div>";
                ohtml += "<div class='stitle'>" + poec_affParseName(istephtml[i]["title"]) + "</div>";
                ohtml += "<div class='scontent'>" + poec_affParseName(istephtml[i]["content"]) + "</div>";
                ohtml += "</div>";
            }

            // Raw output
            var regex = /<br\s*[\/]?>/gi;
            ohtml += "<textarea id='poecSimInstRaw'>" + ihtml.replace(regex, "\n") + "</textarea>";
        }

        $("#poecSimInstructionsOutputZone").html("<div id='poecSimInstructionsOutput'>" + ohtml + "</div>");
    } else {
        var ohtml = "";
        ohtml += "<div class='step dbstepS' nstep='S'>";
        ohtml += "<div class='col2'><div class='stitle div_stable'><div><div class='stepnum'>S</div><div class='ctitle'>" + applyLang("Start") + "</div></div></div></div>";
        ohtml += "<div class='col3'></div>";
        ohtml += "</div>";
        for (var i = 0; i < istephtml.length > 0; i++) {
            ohtml += "<div class='step dbstep" + (i + 1) + "' nstep='" + (i + 1) + "'>";
            ohtml += "<div class='col2'>";
            ohtml += "<div class='stitle div_stable'><div><div class='stepnum'>" + istephtml[i]["step"] + "</div><div class='ctitle'>" + poec_affParseName(istephtml[i]["title"]) + "</div><div class='count'>0</div><div class='pass'>0</div></div></div>";
            ohtml += "<div class='scontent'>" + poec_affParseName(istephtml[i]["conditions"]) + "</div>";
            ohtml += "</div>";
            ohtml += "<div class='col3'>";
            if (istephtml[i]["onsuccess"]) {
                ohtml += "<div class='success'>";
                ohtml += "<div>" + applyLang("Success") + "</div>";
                ohtml += "<div>" + istephtml[i]["onsuccess"] + "</div>";
                ohtml += "</div>";
            }
            if (istephtml[i]["onfailure"]) {
                ohtml += "<div class='failure'>";
                ohtml += "<div>" + applyLang("Failure") + "</div>";
                ohtml += "<div>" + istephtml[i]["onfailure"] + "</div>";
                ohtml += "</div>";
            }
            ohtml += "</div>";
            ohtml += "</div>";
        }
        ohtml += "<div class='step dbstepE' nstep='E'>";
        ohtml += "<div class='col2'><div class='stitle div_stable'><div><div class='stepnum'>E</div><div class='ctitle'>" + applyLang("End") + "</div></div></div></div>";
        ohtml += "<div class='col3'></div>";
        ohtml += "</div>";
        return ohtml;
    }
}

function poec_nsimInstAgainstRange(cond) {
    if (cond["treshold"] && cond["max"]) {
        if (cond["treshold"] == cond["max"]) {
            return cond["treshold"];
        } else {
            return cond["treshold"] + " " + applyLang("to") + " " + cond["max"];
        }
    } else {
        if (cond["treshold"]) {
            return cond["treshold"] + " " + applyLang("or more");
        } else {
            return cond["max"] + " " + applyLang("or less");
        }
    }
}

function poec_nsimGetStepConditions(conds, is_plural, ctype) {
    var conditions = "";
    if (!conds["autopass"]) {
        if (conds["method"][0] == "modunveil") {
            if (ctype == "flowdet") {
                conditions += "<span class='dtitle'>" + applyLang("Look for") + "</span> ";
            } else {
                conditions += applyLang("Look for") + " ";
            }
            for (var z = 0; z < conds["vfilter"].length; z++) {
                if (z > 0) {
                    conditions += applyLang("or") + " ";
                }
                var modid = parseInt(conds["vfilter"][z]);
                var mname = poecl["mod"][modid];
                conditions += "[" + mname + "] ";
            }
            if (conds["vfilter"].length > 1) {
                conditions += " " + applyLang("prioritizing left to right");
            }
            conditions += "<br>";
        } else {
            if (!is_plural && (conds["method"][0] != "check" || ctype == "flowdet")) {
                if (ctype == "flowdet") {
                    conditions += "<span class='dtitle'>" + applyLang("Check that item") + "</span><br>";
                } else {
                    conditions += applyLang("Check that item") + "<br>";
                }
            }
            if (conds["actions"]["fail"] == "loop" && ctype == "flowdet") {
                conditions += "<span class='dtitle'>" + applyLang("Loop until") + "</span> ";
            }
            var notfilter = "";
            var orfilter = "";
            if (ctype == "flowdet") {
                var has = "<span class='dtitle'>" + applyLang("HAS") + "</span>";
                var or = "<span class='dtitle'>" + applyLang("OR") + "</span>";
                var and = "<span class='dtitle'>" + applyLang("AND") + "</span>";
            } else {
                var has = applyLang("HAS");
                var or = applyLang("OR");
                var and = applyLang("AND");
            }
            for (var z = 0; z < conds["filters"].length; z++) {
                if (conds["filters"][z]["type"] == "or" || conds["filters"][z]["type"] == "and") {
                    if (orfilter == "") {
                        if (!is_plural) {
                            orfilter += has + " ";
                        }
                    } else {
                        if (conds["filters"][z]["type"] == "or") {
                            orfilter += or + " ";
                        } else {
                            orfilter += and + " ";
                        }
                    }
                    var isand = true;
                    if (conds["filters"][z]["treshold"]) {
                        if (conds["filters"][z]["treshold"] < conds["filters"][z]["conds"].length) {
                            isand = false;
                            orfilter += conds["filters"][z]["treshold"] + " " + applyLang("of the following") + ": ";
                        }
                    }
                    var thiscond = "";
                    if (conds["filters"][z]["conds"] == 0) {
                        thiscond += applyLang("[CONDITIONS NOT SET]");
                    } else {
                        for (y = 0; y < conds["filters"][z]["conds"].length; y++) {
                            if (thiscond != "") {
                                if (isand) {
                                    thiscond += " " + applyLang("and") + " ";
                                } else {
                                    thiscond += ", ";
                                }
                            }
                            var modid = parseInt(conds["filters"][z]["conds"][y]["id"]);
                            if (isNaN(modid)) {
                                // Special conditions
                                var rnginst = poec_nsimInstAgainstRange(conds["filters"][z]["conds"][y]);
                                switch (conds["filters"][z]["conds"][y]["id"]) {
                                    case 'open_prefix' :
                                        thiscond += rnginst + " " + applyLang("Open Prefix");
                                        break;
                                    case 'open_suffix' :
                                        thiscond += rnginst + " " + applyLang("Open Suffix");
                                        break;
                                    case 'open_affix' :
                                        thiscond += rnginst + " " + applyLang("Open Affix");
                                        break;
                                    case 'count_prefix' :
                                        thiscond += rnginst + " " + applyLang("Prefix");
                                        break;
                                    case 'count_suffix' :
                                        thiscond += rnginst + " " + applyLang("Suffix");
                                        break;
                                    case 'count_affix' :
                                        thiscond += rnginst + " " + applyLang("Affix");
                                        break;
                                    case 'count_iprefix' :
                                        thiscond += rnginst + " " + applyLang("Influenced Prefix");
                                        break;
                                    case 'count_isuffix' :
                                        thiscond += rnginst + " " + applyLang("Influenced Suffix");
                                        break;
                                    case 'count_iaffix' :
                                        thiscond += rnginst + " " + applyLang("Influenced Affix");
                                        break;
                                    case 'count_attack' :
                                        thiscond += rnginst + " " + applyLang("Attack Modifiers");
                                        break;
                                    case 'count_nattack' :
                                        thiscond += rnginst + " " + applyLang("Non-Attack Modifiers");
                                        break;
                                    case 'count_caster' :
                                        thiscond += rnginst + " " + applyLang("Caster Modifiers");
                                        break;
                                    case 'count_ncaster' :
                                        thiscond += rnginst + " " + applyLang("Non-Caster Modifiers");
                                        break;
                                    case 'veiled_prefix' :
                                        thiscond += rnginst + " " + applyLang("Veiled Prefix");
                                        break;
                                    case 'veiled_suffix' :
                                        thiscond += rnginst + " " + applyLang("Veiled Suffix");
                                        break;
                                    case 'quality' :
                                        thiscond += rnginst + " " + applyLang("Quality");
                                        break;
                                    case 'eldritch_blue' :
                                        thiscond += applyLang("Eater of Worlds influence");
                                        break;
                                    case 'eldritch_red' :
                                        thiscond += applyLang("Searing Exarch influence");
                                        break;
                                    default: // Pseudo
                                        var pseudokey = conds["filters"][z]["conds"][y]["id"].replace("pseudo_", "");
                                        thiscond += conds["filters"][z]["conds"][y]["treshold"] + " " + applyLang("or more") + " " + poec_cpseudos["def"][pseudokey]["name"];
                                        break;
                                }
                            } else {
                                var tresh = parseInt(conds["filters"][z]["conds"][y]["treshold"]);
                                var mname = poecl["mod"][modid];
                                if (conds["filters"][z]["conds"][y]["base"]) {
                                    var ntiers = poecd["tiers"][modid][conds["filters"][z]["conds"][y]["base"]].length;
                                } else {
                                    var ntiers = poecd["tiers"][modid][simulator_settings["base"]].length;
                                }
                                var tinfo = "";
                                var orbetter = "";
                                if (tresh >= ntiers) {
                                    // All tiers, so dont bother
                                } else {
                                    tinfo = "T" + tresh + " ";
                                    if (tresh != 1) {
                                        orbetter = " " + applyLang("or better");
                                    }
                                }
                                thiscond += tinfo + "[" + mname + "]" + orbetter;
                            }
                        }
                    }
                    orfilter += thiscond + "<br>";
                } else {
                    for (y = 0; y < conds["filters"][z]["conds"].length; y++) {
                        if (notfilter != "") {
                            notfilter += " " + applyLang("nor") + " ";
                        }
                        var modid = parseInt(conds["filters"][z]["conds"][y]["id"]);
                        if (isNaN(modid)) {
                            // Special conditions
                            switch (conds["filters"][z]["conds"][y]["id"]) {
                                case 'open_prefix' :
                                    thiscond += rnginst + " " + applyLang("Open Prefix");
                                    break;
                                case 'open_suffix' :
                                    thiscond += rnginst + " " + applyLang("Open Suffix");
                                    break;
                                case 'open_affix' :
                                    thiscond += rnginst + " " + applyLang("Open Affix");
                                    break;
                                case 'count_prefix' :
                                    thiscond += rnginst + " " + applyLang("Prefix");
                                    break;
                                case 'count_suffix' :
                                    thiscond += rnginst + " " + applyLang("Suffix");
                                    break;
                                case 'count_affix' :
                                    thiscond += rnginst + " " + applyLang("Affix");
                                    break;
                                case 'count_iprefix' :
                                    thiscond += rnginst + " " + applyLang("Influenced Prefix");
                                    break;
                                case 'count_isuffix' :
                                    thiscond += rnginst + " " + applyLang("Influenced Suffix");
                                    break;
                                case 'count_iaffix' :
                                    thiscond += rnginst + " " + applyLang("Influenced Affix");
                                    break;
                                case 'count_attack' :
                                    thiscond += rnginst + " " + applyLang("Attack Modifiers");
                                    break;
                                case 'count_nattack' :
                                    thiscond += rnginst + " " + applyLang("Non-Attack Modifiers");
                                    break;
                                case 'count_caster' :
                                    thiscond += rnginst + " " + applyLang("Caster Modifiers");
                                    break;
                                case 'count_ncaster' :
                                    thiscond += rnginst + " " + applyLang("Non-Caster Modifiers");
                                    break;
                                case 'veiled_prefix' :
                                    thiscond += rnginst + " " + applyLang("Veiled Prefix");
                                    break;
                                case 'veiled_suffix' :
                                    thiscond += rnginst + " " + applyLang("Veiled Suffix");
                                    break;
                                case 'quality' :
                                    thiscond += rnginst + " " + applyLang("Quality");
                                    break;
                                case 'eldritch_blue' :
                                    thiscond += applyLang("Eater of Worlds influence");
                                    break;
                                case 'eldritch_red' :
                                    thiscond += applyLang("Searing Exarch influence");
                                    break;
                                default: // Pseudo
                                    var pseudokey = conds["filters"][z]["conds"][y]["id"].replace("pseudo_", "");
                                    thiscond += conds["filters"][z]["conds"][y]["treshold"] + " " + applyLang("or more") + " " + poec_cpseudos["def"][pseudokey]["name"];
                                    break;
                            }
                        } else {
                            var tresh = parseInt(conds["filters"][z]["conds"][y]["treshold"]);
                            var mname = poecl["mod"][modid];
                            var ntiers = poecd["tiers"][modid][simulator_settings["base"]].length;
                            var tinfo = "";
                            var orbetter = "";
                            if (tresh >= ntiers) {
                                // All tiers, so dont bother
                            } else {
                                tinfo = "T" + tresh + " ";
                                if (tresh != 1) {
                                    orbetter = " " + applyLang("or better");
                                }
                            }
                            notfilter += tinfo + "[" + mname + "]" + orbetter;
                        }
                    }
                }
            }
            conditions += orfilter;
            if (notfilter != "") {
                if (orfilter != "") {
                    conditions += and + " ";
                }
                conditions += applyLang("does not have ") + notfilter + "<br>";
            }
        }
    } else {
        if (ctype == "flowdet") {
            conditions += "Automatic <span class='dtitle'>Success</span>";
        }
    }
    return conditions;
}

function poec_simCopyInstToClip() {
    $("#poecSimInstRaw").show();
    var copyText = document.getElementById("poecSimInstRaw");
    copyText.select();
    copyText.setSelectionRange(0, 99999);
    document.execCommand("copy");
    $("#poecSimInstRaw").hide();
    poec_outputNotice("<div>" + applyLang("Notice") + "</div><div>" + applyLang("Instructions succesfully copied to clipboard.") + "</div>", "info");
}

/********/
/* SAVE */

/********/
function poec_simBuildTagSel(selindex, numsel, selhtml, ttitle) {
    var sid = "tagsel_" + selindex;
    var iniset = applyLang("Choose a tag");
    var mulsel = 1;

    var curval = "null";
    if (nsim_savesettings) {
        if (nsim_savesettings[selindex]) {
            curval = nsim_savesettings[selindex];
        }
    }

    var vHTML = "<div class='nsimtagholder'><label>" + ttitle + "</label><div class='nsimselholder'><div id='" + sid + "' class='nsimsel noselect med_shadow searchable tags' searchable='1' numsel='" + numsel + "' mulsel='" + mulsel + "' sparent='null' sindex='" + sid + "' skey='" + selindex + "' iniset='" + iniset + "' curval='" + curval + "'><div class='current'></div><div class='options med_shadow'><div class='wrapper'>";
    vHTML += selhtml;
    vHTML += "</div></div></div></div></div>";

    return vHTML;
}

var nsim_tagsels = null;
var nsim_addarches = {
    "Aurabot": "aurabot",
    "Aurastacker": "aurastack",
    "Omniscience": "omniscience",
    "Wander": "wander",
    "Melee": "melee",
    "Ranged": "ranged",
    "Summoner": "summoner",
    "Self-cast": "selfcast"
};

function poec_simInitSaveTab() {
    // Build tag selector opts
    if (nsim_tagsels == null) {
        var notfound = "<div class='opt notfound'>" + applyLang("No element found") + "</div>";
        nsim_tagsels = {};
        // GEMS
        var chtml = "";
        for (var i = 0; i < poeexd["gems"]["seq"].length; i++) {
            var cmbid = poeexd["gems"]["seq"][i]["id_gem"];
            var pname = poeexd["gems"]["seq"][i]["name_gem"];
            chtml += "<div class='opt mkey_" + cmbid + "' mkey='" + cmbid + "' search='" + pname.toLowerCase() + "' tabindex='0' mparent='gems'>" + pname + "</div>";
        }
        chtml += notfound;
        nsim_tagsels["gems"] = chtml;
        // ASCENDENCIES
        var chtml = "";
        for (var i = 0; i < poeexd["classes"]["seq"].length; i++) {
            var cmbid = poeexd["classes"]["seq"][i]["id_pclass"];
            var pname = poeexd["classes"]["seq"][i]["name_class"];
            chtml += "<div class='opt mkey_" + cmbid + "' mkey='" + cmbid + "' search='" + pname.toLowerCase() + "' tabindex='0' mparent='class'>" + pname + "</div>";
        }
        chtml += notfound;
        nsim_tagsels["class"] = chtml;
        // ARCHETYPES
        var chtml = "";
        var arrall = [];
        $.each(poeexd["supports"], function (pname, key) {
            pname = pname.replace(" Support", "");
            arrall.push([key, pname]);
        });
        $.each(poeexd["keystones"], function (pname, key) {
            arrall.push([key, pname]);
        });
        $.each(nsim_addarches, function (pname, key) {
            arrall.push([key, pname]);
        });
        arrall.sort(function (a, b) {
            return a[1] > b[1] ? 1 : -1;
        });
        for (var i = 0; i < arrall.length; i++) {
            var key = arrall[i][0];
            var pname = arrall[i][1];
            chtml += "<div class='opt mkey_" + key + "' mkey='" + key + "' search='" + pname.toLowerCase() + "' tabindex='0' mparent='class'>" + pname + "</div>";
        }
        chtml += notfound;
        nsim_tagsels["archs"] = chtml;
        // FOCUS
        var chtml = "";
        for (var i = 0; i < poecd["mtypes"]["seq"].length; i++) {
            if (poecd["mtypes"]["seq"][i]["jewellery_tag"] == 0) {
                var cmbid = poecd["mtypes"]["seq"][i]["id_mtype"];
                var pname = poecd["mtypes"]["seq"][i]["name_mtype"];
                chtml += "<div class='opt mkey_" + cmbid + "' mkey='" + cmbid + "' search='" + pname.toLowerCase() + "' tabindex='0' mparent='class'>" + pname + "</div>";
            }
        }
        chtml += notfound;
        nsim_tagsels["focus"] = chtml;
    }

    var vHTML = "";
    var checked = " unchecked";
    if (nsim_savesettings) {
        if (nsim_savesettings["public"]) {
            checked = " ischecked";
        }
    }
    vHTML += '<div class="nsimtagholder"><div class="mcui-checkbox ' + checked + '" id="poecSimSaveIsPublic">' + applyLang("Public") + '</div></div>';
    var checked = " unchecked";
    if (nsim_savesettings) {
        if (nsim_savesettings["ssf"]) {
            checked = " ischecked";
        }
    }
    vHTML += '<div class="nsimtagholder"><div class="mcui-checkbox ' + checked + '" id="poecSimSaveIsSSF">' + applyLang("SSF-Friendly") + '</div></div>';
    var checked = " unchecked";
    if (nsim_savesettings) {
        if (nsim_savesettings["full"]) {
            checked = " ischecked";
        }
    }
    vHTML += '<div class="nsimtagholder"><div class="mcui-checkbox ' + checked + '" id="poecSimSaveIsFull">' + applyLang("Full Recipee") + '</div></div>';
    vHTML += '<div class="nsimtagholder woker init" id="poecSimCraftSampleItemHolder"><div class="wokeritemviewer med_shadow" id="poecSimCraftSampleItem">' + applyLang("Sample Item") + '</div><div id="poecSimCraftSampleData" class="hidden"></div><div class="itempreview"></div></div>';
    vHTML += "<div></div>";
    vHTML += poec_simBuildTagSel("gems", 10, nsim_tagsels["gems"], applyLang("Skill gems"));
    vHTML += poec_simBuildTagSel("class", 5, nsim_tagsels["class"], applyLang("Ascendencies"));
    vHTML += poec_simBuildTagSel("archs", 5, nsim_tagsels["archs"], applyLang("Archetypes"));
    vHTML += poec_simBuildTagSel("focus", 10, nsim_tagsels["focus"], applyLang("Focus"));

    $("#poecSimSaveConfigZone").html(vHTML);
    poec_nsimInitSelectors($("#poecSimSaveConfigZone"));
    $("#poecSimSaveIsPublic").mcuiCheck().setChange(function () {
        poec_nsimUpdateSaveSettings();
    });
    $("#poecSimSaveIsSSF").mcuiCheck().setChange(function () {
        poec_nsimUpdateSaveSettings();
    });
    $("#poecSimSaveIsFull").mcuiCheck().setChange(function () {
        poec_nsimUpdateSaveSettings();
    });
    $("#poecSimCraftSampleItemHolder").hover(function () {
        var idata = $("#poecSimCraftSampleData").html();
        var pHTML = "";
        if (idata != "") {
            idata = jQuery.parseJSON(idata);
            //console.log(idata);
            var nidata = {
                "quality": idata["quality"],
                "catalyst": null,
                "affixes": idata["affixes"],
                "implicits": idata["implicits"],
                "eldritch": idata["eldritch"],
                "enchant": "",
                "influences": idata["influences"],
                "rarity": idata["rarity"],
                "ilvl": idata["ilvl"],
                "base": idata["base"]
            };
            pHTML = poec_simGetFullItem(nidata, idata["bitem"], "Sample item", "simulator", true);
        } else {
            pHTML = applyLang("<div class='msg'>Go to the items tab to choose a sample item</div>");
        }
        $(this).find(".itempreview").html(pHTML).show();
    }, function () {
        $(this).find(".itempreview").hide();
    });

    if (nsim_cursampleitem) {
        nsim_savesettings["sample_item"] = nsim_cursampleitem;
        nsim_cursampleitem = null;
    }

    if (nsim_savesettings["sample_item"]) {
        $("#poecSimCraftSampleItemHolder").removeClass("init");
        $("#poecSimCraftSampleData").html(JSON.stringify(nsim_savesettings["sample_item"]));
    }

    if (nsim_initsaveparams) {
        $("#poecSimSaveIsPublic").mcuiCheck().setState(nsim_initsaveparams["public"]);
        nsim_savesettings["public"] = nsim_initsaveparams["public"];
        $("#poecSimSaveIsSSF").mcuiCheck().setState(nsim_initsaveparams["ssf"]);
        nsim_savesettings["public"] = nsim_initsaveparams["ssf"];
        $("#poecSimSaveIsFull").mcuiCheck().setState(nsim_initsaveparams["full"]);
        nsim_savesettings["full"] = nsim_initsaveparams["full"];
        if (nsim_initsaveparams["ctags"]) {
            if (nsim_initsaveparams["ctags"].length > 1) {
                var ctags = nsim_initsaveparams["ctags"].substring(1, nsim_initsaveparams["ctags"].length - 1).split("|");
                var ntags = {"ge": "|", "cl": "|", "ar": "|", "fo": "|"};
                for (var i = 0; i < ctags.length; i++) {
                    var tgt = ctags[i].substring(0, 2);
                    var tgi = ctags[i].substring(2);
                    ntags[tgt] += tgi + "|";
                }
                $.each(ntags, function (key, val) {
                    if (val.length == 1) {
                        ntags[key] = "null";
                    }
                });
                $("#tagsel_gems").attr("curval", ntags["ge"]);
                $("#tagsel_class").attr("curval", ntags["cl"]);
                $("#tagsel_archs").attr("curval", ntags["ar"]);
                $("#tagsel_focus").attr("curval", ntags["fo"]);
                poec_nsimSetSelector($("#tagsel_gems"));
                poec_nsimSetSelector($("#tagsel_class"));
                poec_nsimSetSelector($("#tagsel_archs"));
                poec_nsimSetSelector($("#tagsel_focus"));
            }
        }
        nsim_initsaveparams = null;
    }

    var rHTML = "";
    var saveterm = applyLang("Save Craft");
    var addcls = "";
    if (nsim_curcraftid) {
        rHTML += poec_nsimOutputCraftLink();
        saveterm = applyLang("Save changes");
        addcls += " delact";
    }

    vHTML = "";
    vHTML += "<div id='poec_nsimSaveResponse'>" + rHTML + "</div>";
    vHTML += "<div id='poec_nsimSaveCraftBtnZone' class='" + addcls + "'><div class='mcui-button green' onClick='poec_nsimSaveCraft()'>" + saveterm + "</div><div class='mcui-button red' id='poec_nsimDeleteCraftBtn' onClick='poec_nsimDeleteCraft(null,true)'>" + applyLang("Delete craft") + "</div></div>";
    $("#poecSimSaveZone").html(vHTML);
    poec_nsimApplyCraftLinkCP();
}

function poec_nsimOutputCraftLink() {
    return "<div id='poec_nsimCraftFriendlyURL' class='med_shadow'><div class='label'>" + applyLang("Craft unique URL") + "</div><div class='url'>" + $g_fullurl + "?craft=" + nsim_curcraftid["cuid"] + "c" + nsim_curcraftid["crid"] + "</div><input id='poec_nsimCraftFriendlyCP' type='text' value='" + $g_fullurl + "?craft=" + nsim_curcraftid["cuid"] + "c" + nsim_curcraftid["crid"] + "'/></div>";
}

function poec_nsimApplyCraftLinkCP() {
    $("#poec_nsimCraftFriendlyURL").click(function () {
        $("#poec_nsimCraftFriendlyCP").show();
        var copyText = document.getElementById("poec_nsimCraftFriendlyCP");
        copyText.select();
        copyText.setSelectionRange(0, 99999);
        document.execCommand("copy");
        $("#poec_nsimCraftFriendlyCP").hide();
        poec_outputNotice("<div>" + applyLang("Craft link") + "</div><div>" + applyLang("URL succesfully copied to clipboard.") + "</div>", "info");
    });
}

var nsim_savesettings = null;

function poec_nsimUpdateSaveSettings() {
    if (nsim_savesettings == null) {
        nsim_savesettings = {};
    }
    nsim_savesettings["gems"] = $("#tagsel_gems").attr("curval");
    nsim_savesettings["class"] = $("#tagsel_class").attr("curval");
    nsim_savesettings["archs"] = $("#tagsel_archs").attr("curval");
    nsim_savesettings["focus"] = $("#tagsel_focus").attr("curval");
    nsim_savesettings["public"] = $("#poecSimSaveIsPublic").mcuiCheck().getVal();
    nsim_savesettings["ssf"] = $("#poecSimSaveIsSSF").mcuiCheck().getVal();
    nsim_savesettings["full"] = $("#poecSimSaveIsFull").mcuiCheck().getVal();
}

function poec_nsimLoadSettings() {
    nsim_savesettings = null;
}

/*******************/
/* USER OPERATIONS */

/*******************/
function poec_nsimGetCurrentTags() {
    var alltags = "|";
    $("#poecSimOptions").find(".nsimsel.tags").each(function () {
        var skey = $(this).attr("skey").substring(0, 2);
        var curval = $(this).attr("curval");
        if (curval != "null") {
            var valarr = curval.substring(1, curval.length - 1).split("|");
            for (var i = 0; i < valarr.length; i++) {
                alltags += skey + valarr[i] + "|";
            }
        }
    });
    return alltags;
}

var nsim_archindex = null;

function poec_nsimBuildArchIndex() {
    if (nsim_archindex === null) {
        var arrall = [];
        nsim_archindex = {};
        $.each(poeexd["supports"], function (pname, key) {
            pname = pname.replace(" Support", "");
            arrall.push([key, pname]);
        });
        $.each(poeexd["keystones"], function (pname, key) {
            arrall.push([key, pname]);
        });
        $.each(nsim_addarches, function (pname, key) {
            arrall.push([key, pname]);
        });
        for (var i = 0; i < arrall.length; i++) {
            nsim_archindex[arrall[i][0]] = arrall[i][1];
        }
    }
}

function poec_nsimOutputCTags(ctags) {
    poec_nsimBuildArchIndex();
    var htags = "";
    if (ctags) {
        if (ctags.length > 1) {
            ctags = ctags.substring(1, ctags.length - 1).split("|");
            for (var i = 0; i < ctags.length; i++) {
                var tgt = ctags[i].substring(0, 2);
                var tgi = ctags[i].substring(2);
                htags += "<div class='ctag " + tgt + "'>";
                switch (tgt) {
                    case 'ge' :
                        htags += poeexd["gems"]["seq"][poeexd["gems"]["ind"][tgi]]["name_gem"];
                        break;
                    case 'cl' :
                        htags += poeexd["classes"]["seq"][poeexd["classes"]["ind"][tgi]]["name_class"];
                        break;
                    case 'ar' :
                        htags += nsim_archindex[tgi];
                        break;
                    case 'fo' :
                        htags += poecd["mtypes"]["seq"][poecd["mtypes"]["ind"][tgi]]["name_mtype"];
                        break;
                }
                htags += "</div>";
            }
        }
    }
    if (htags == "") {
        htags += "<div class='ctag notag'>" + applyLang("No tags") + "</div>";
    }
    return htags;
}

function poec_nsimSaveCraft() {
    $("#poec_nsimSaveCraftBtnZone").hide();
    poec_nsimGenerateConfigData();
    var startitem = {
        "bgroup": simulator_settings["bgroup"],
        "base": simulator_settings["base"],
        "bitem": simulator_settings["bitem"],
        "ilvl": simulator_settings["ilvl"],
        "rarity": simulator_settings["rarity"],
        "influences": simulator_settings["influences"],
        "eldritch": simulator_settings["eldritch"],
        "catalysts": simulator_settings["catalysts"],
        "quality": simulator_settings["quality"],
        "corrupted": simulator_settings["corrupted"],
        "destroyed": simulator_settings["destroyed"],
        "implicits": simulator_data["implicits"],
        "iaffixes": simulator_data["iaffixes"]
    };
    var tags = poec_nsimGetCurrentTags();
    var public = parseInt($("#poecSimSaveIsPublic").mcuiCheck().getVal());
    var ssf = parseInt($("#poecSimSaveIsSSF").mcuiCheck().getVal());
    var full = parseInt($("#poecSimSaveIsFull").mcuiCheck().getVal());
    var istart = $("#poecSimCraftSampleData").html();
    var league = parseInt(poecc["leagues"][0]["id"]); // Current league
    var crid = 0;
    if (nsim_curcraftid) {
        crid = nsim_curcraftid["crid"];
    }
    poec_nsimParseFlowConfig();
    var vQS = "operation=save_craft&crid=" + crid + "&cconfig=" + encodeURIComponent(JSON.stringify(simulator_config)) + "&flowcfg=" + encodeURIComponent(JSON.stringify(simulator_flow)) + "&csettings=" + encodeURIComponent(JSON.stringify(startitem)) + "&tags=" + encodeURIComponent(tags) + "&public=" + public + "&ssf=" + ssf + "&full=" + full + "&league=" + league + "&istart=" + encodeURIComponent(istart);
    poec_nsimCreateResponseLoader();
    $("#poec_nsimSaveResponse").html('<div id="poecModDistBigLoader" style="padding:30px 0px"><img src="../../images/ajax-loader-dark.gif"></div>');
    var acajax = new mc_ajax("../../cgi/web/custom/user_operation.php", vQS, {
        target: $("#nsimResponseLoader"), complete: function (result) {
            var error = null;
            try {
                var ret = jQuery.parseJSON($("#nsimResponseLoader").html());
            } catch (e) {
                error = applyLang("Could not parse returned JSON");
            }
            if (!error) {
                if (ret) {
                    if (ret["status"]) {
                        var retdat = ret["return"];
                        nsim_curcraftid = retdat;
                    } else {
                        error = ret["error"];
                    }
                } else {
                    error = applyLang("Unknown Error");
                }
            }
            if (error) {
                console.log($("#nsimResponseLoader").html());
                poec_outputNotice("<div>" + applyLang("Error") + "</div><div>" + error + "</div>", "red");
                $("#poec_nsimSaveResponse").html("");
            } else {
                $("#poec_nsimSaveResponse").html(poec_nsimOutputCraftLink());
                poec_nsimApplyCraftLinkCP();
                $("#poec_nsimSaveCraftBtnZone").find(".mcui-button.green").html(applyLang("Save changes"));
                $("#poec_nsimSaveCraftBtnZone").addClass("delact");
                poec_outputNotice("<div>" + applyLang("Save craft") + "</div><div>" + applyLang("Craft was saved succesfully!") + "</div>", "green");
            }
            $("#poec_nsimSaveCraftBtnZone").show();
        }
    });
}

var nsim_cmetnames = {
    "fossil": "Fossils",
    "essence": "Essences",
    "imprint": "Imprinting",
    "woke": "Awakening",
    "maven": "Dominance",
    "metamod": "Metamods",
    "harvest": "Harvest",
    "veiled": "Veiling",
    "eldritch": "Eldritch"
};

function poec_nsimCreateResponseLoader() {
    if ($("#nsimResponseLoader").length == 0) {
        $("<div>").attr("id", "nsimResponseLoader").appendTo($("body"));
    }
}

function poec_nsimLoadUserRecipees(node) {
    var vQS = "operation=get_recipees";
    poec_nsimCreateResponseLoader();
    $(node).html('<div id="poecModDistBigLoader" style="padding:30px 0px"><img src="../../images/ajax-loader-dark.gif"></div>');
    var acajax = new mc_ajax("../../cgi/web/custom/user_operation.php", vQS, {
        target: $("#nsimResponseLoader"), complete: function (result) {
            var error = null;
            var vHTML = "";
            try {
                var ret = jQuery.parseJSON($("#nsimResponseLoader").html());
            } catch (e) {
                error = applyLang("Could not parse returned JSON") + " : [" + $("#nsimResponseLoader").html() + "]";
            }
            if (!error) {
                if (ret) {
                    if (ret["status"]) {
                        var recipees = ret["return"]["crafts"];
                        var has_recipees = false;
                        var pct = ret["return"]["cur"] / ret["return"]["max"];
                        vHTML += "<div id='poec_nsimCraftsState'><div class='count'>" + ret["return"]["cur"] + " / " + ret["return"]["max"] + " (" + poec_parsePct(pct) + ")</div><div class='bar' style='width:" + (pct * 100) + "%'></div></div>";
                        if (Array.isArray(recipees)) {
                            if (recipees.length > 0) {
                                has_recipees = true;
                                vHTML += "<div class='coe_recipee_set'>";
                                for (var i = 0; i < recipees.length; i++) {
                                    if (recipees[i]["showcase_item"]) {
                                        recipees[i]["showcase_item"] = jQuery.parseJSON(recipees[i]["showcase_item"]);
                                    }
                                    recipees[i]["start_item"] = jQuery.parseJSON(recipees[i]["start_item"]);
                                    recipees[i]["cconfig"] = jQuery.parseJSON(recipees[i]["cconfig"]);
                                    recipees[i]["owner"] = true;
                                    vHTML += poec_nsimGetCraftInfoTab(recipees[i], "user");
                                }
                                vHTML += "</div>";
                            }
                        }
                        if (!has_recipees) {
                            vHTML += applyLang("<div style='padding:30px;'>You currently have no saved crafting recipees.</div>"); // TODO : Message that says you dont have any recipees yet
                        }
                    } else {
                        error = ret["error"];
                    }
                } else {
                    error = applyLang("Unknown Error");
                }
            }
            if (error) {
                vHTML += "<div class='gen_msg red'>" + applyLang("An error occured") + " : " + error + "</div>";
            }
            $(node).html(vHTML);
            poec_nsimSetInfoTabBehavior($(node));
        }
    });
}

function poec_nsimSetInfoTabBehavior(node) {
    $(node).find(".showcase").hover(function () {
        var left = $(this).offset().left;
        if (left + 350 > $(window).width()) {
            $(this).addClass("alright");
        } else {
            $(this).removeClass("alright");
        }
        var idata = $(this).parent().parent().find(".data").html();
        var pHTML = "";
        if (idata != "") {
            idata = jQuery.parseJSON(idata);
            idata = idata["showcase"];
            var nidata = {
                "quality": idata["quality"],
                "catalyst": null,
                "affixes": idata["affixes"],
                "implicits": idata["implicits"],
                "eldritch": idata["eldritch"],
                "enchant": "",
                "influences": idata["influences"],
                "rarity": idata["rarity"],
                "ilvl": idata["ilvl"],
                "base": idata["base"]
            };
            pHTML = poec_simGetFullItem(nidata, idata["bitem"], "Sample item", "simulator", true);
        } else {
            pHTML = applyLang("<div class='msg'>Click to set up item to awaken</div>");
        }
        $(this).find(".itempreview").html(pHTML).show();
    }, function () {
        $(this).find(".itempreview").hide();
    });
}

function poec_nsimGetCraftInfoTab(recip, from) {
    var showcase = null;
    var vHTML = "";
    if (recip["showcase_item"]) {
        showcase = recip["showcase_item"];
    }
    var rdat = {
        "start": recip["start_item"],
        "showcase": showcase,
        "cconfig": recip["cconfig"],
        "flowcfg": recip["flowcfg"],
        "ctags": recip["ctags"],
        "ssf": recip["ssf_friendly"],
        "full": recip["is_fullcraft"],
        "public": recip["is_public"],
        "crid": recip["id_craft"],
        "cuid": recip["cuid"],
        "owner": recip["owner"]
    };
    var nsteps = rdat["cconfig"].length;
    var crtags = "";
    if (recip["cmets"]) {
        var cmets = recip["cmets"].substring(1, recip["cmets"].length - 1).split("|");
        for (var j = 0; j < cmets.length; j++) {
            crtags += "<div class='crtag " + cmets[j] + "'>" + nsim_cmetnames[cmets[j]] + "</div>";
        }
    }
    vHTML += "<div class='recipee mcui-button dark' onClick='poec_nsimLoadRecipee(this,\"" + from + "\")'>";

    if (poecd["bases"]["seq"][poecd["bases"]["ind"][recip["base"]]]["master_base"]) {
        var base = poecd["bases"]["seq"][poecd["bases"]["ind"][poecd["bases"]["seq"][poecd["bases"]["ind"][recip["base"]]]["master_base"]]]["name_base"];
        base += "<span class='bitem'>" + poecd["bases"]["seq"][poecd["bases"]["ind"][recip["base"]]]["name_base"] + "</span>";
    } else {
        var base = poecd["bases"]["seq"][poecd["bases"]["ind"][recip["base"]]]["name_base"];
        if (recip["bitem"]) {
            base += "<span class='bitem'>" + poecd["bitems"]["seq"][poecd["bitems"]["ind"][recip["bitem"]]]["name_bitem"] + "</span>";
        }
    }
    if (showcase) {
        base += "<div class='showcase'><div class='itempreview'></div></div>";
    }
    vHTML += "<div class='base'>" + base + "</div>";
    var tags = poec_nsimOutputCTags(recip["ctags"]);
    vHTML += "<div class='tags'>" + tags + "</div>";
    var stepterm = applyLang("Steps");
    if (nsteps == 1) {
        stepterm = applyLang("Step");
    }
    var addtags = "";
    if (recip["ssf_friendly"] == 1) {
        addtags += "<div class='atag'>" + applyLang("SSF") + "</div>";
    }
    if (recip["is_fullcraft"] == 1) {
        addtags += "<div class='atag'>" + applyLang("Full") + "</div>";
    }
    if (recip["is_public"] == 1) {
        addtags += "<div class='atag'>" + applyLang("Public") + "</div>";
    }
    vHTML += "<div class='steps'><span class='num'>" + nsteps + "</span>" + applyLang("Crafting") + " " + stepterm + addtags + "</div>";
    vHTML += "<div class='crtags'>" + crtags + "</div>";
    vHTML += "<div class='data'>" + JSON.stringify(rdat) + "</div></div>";
    return vHTML;
}

var nsim_initsaveparams = null;
var nsim_curcraftid = null;
var nsim_notowner = false;

function poec_nsimLoadRecipee(vThis, from) {
    if (!$("#simulatorTab").hasClass("sel")) {
        $(".poec_zone").hide();
        $(".poec_zone.simulator").show();
        $("#nmtabs").children("div").removeClass("sel");
        $("#simulatorTab").addClass("sel");
        poec_initSimulator(false);
    }
    $("#nsimMainInterface").html("").hide();
    $("#nsimSourceInt").show();
    $("#nsimSourceInt").find(".step").hide();
    $("#nsimSourceInt").find(".stepload").css({"display": "block"});

    setTimeout(function () {
        poec_nsimLoadRecipeeGO(vThis, from);
    }, 1);
}

function poec_nsimLoadRecipeeGO(vThis, from) {
    if ($(vThis).find(".data").length > 0) {
        var rdat = jQuery.parseJSON($(vThis).find(".data").html());
    } else {
        var rdat = jQuery.parseJSON($(vThis).html());
    }
    simulator_settings = rdat["start"];
    simulator_states = [];
    var simulator_crsets = {
        "affixes": [],
        "implicits": [],
        "meta_flags": {},
        "eldritch": null,
        "iaffbt": {"prefix": 0, "suffix": 0}
    };
    simulator_crsets["affixes"] = rdat["start"]["iaffixes"];
    simulator_crsets["implicits"] = rdat["start"]["implicits"];
    //console.log(rdat);
    if (rdat["owner"] == false) {
        nsim_notowner = true;
    }
    poec_nsimShowMainInt(simulator_crsets, null, null);
    poec_nsimBuildConfig(rdat["cconfig"]);
    nsim_items = [];
    nsim_numsuccess = 0;
    try {
        if (rdat["flowcfg"]["into"] == undefined) {
            simulator_flow = jQuery.parseJSON(rdat["flowcfg"]);
        } else {
            simulator_flow = rdat["flowcfg"];
        }
    } catch (e) {
        simulator_flow = null;
    }
    //console.log(simulator_flow);
    nsim_initsaveparams = rdat;
    nsim_cursampleitem = null;
    if (rdat["showcase"]) {
        nsim_cursampleitem = rdat["showcase"];
    }
    nsim_curcraftid = {"crid": rdat["crid"], "cuid": rdat["cuid"]};
}

function poec_nsimDeleteCraft(delta, init) {
    if (init) {
        $("#poec_nsimDeleteCraftBtn").mcuiNotice({
            text: applyLang("Are you sure you wish to delete this craft?"),
            type: "confirm",
            complete: function (delta) {
                poec_nsimDeleteCraft(delta, false);
            }
        }).showNotice();
    } else {
        if (delta == true) {
            $("#poec_nsimSaveCraftBtnZone").hide();
            var vQS = "operation=delete_craft&crid=" + nsim_curcraftid["crid"];
            poec_nsimCreateResponseLoader();
            $("#poec_nsimSaveResponse").html('<div id="poecModDistBigLoader" style="padding:30px 0px"><img src="../../images/ajax-loader-dark.gif"></div>');
            var acajax = new mc_ajax("../../cgi/web/custom/user_operation.php", vQS, {
                target: $("#nsimResponseLoader"), complete: function (result) {
                    var error = null;
                    try {
                        var ret = jQuery.parseJSON($("#nsimResponseLoader").html());
                    } catch (e) {
                        error = applyLang("Could not parse returned JSON");
                    }
                    if (!error) {
                        if (ret) {
                            if (ret["status"]) {
                                var retdat = ret["return"];
                                nsim_curcraftid = retdat;
                            } else {
                                error = ret["error"];
                            }
                        } else {
                            error = applyLang("Unknown Error");
                        }
                    }
                    if (error) {
                        console.log($("#nsimResponseLoader").html());
                        poec_outputNotice("<div>" + applyLang("Error") + "</div><div>" + error + "</div>", "red");
                        $("#poec_nsimSaveResponse").html("");
                    } else {
                        $("#poec_nsimSaveResponse").html("");
                        poec_nsimRestart(true, false);
                        poec_outputNotice("<div>" + applyLang("Deleting craft") + "</div><div>" + applyLang("Craft was deleted succesfully!") + "</div>", "green");
                    }
                    $("#poec_nsimSaveCraftBtnZone").show();
                }
            });
        }
    }
}

/************/
/* RECIPEES */
/************/
var poerec_options = {
    "asc": null,
    "bas": null,
    "bit": null,
    "skl": null,
    "slt": null,
    "arch": null,
    "foc": null,
    "full": 1,
    "ssf": 0
};

function poec_initRecipees() {
    if ($("#poecRecipees").length == 0) {
        if (poec_recsl) {
            var cntaf = 0;
            var tmpaffsl = jQuery.parseJSON(poec_recsl);
            $.each(poerec_options, function (key, val) {
                poerec_options[key] = tmpaffsl[cntaf];
                cntaf++;
            });
        }

        vHTML = "";

        vHTML += "<div id='poecAffOptions' class='rec'>";
        vHTML += "<div id='poecAffFilterHolder'>";
        vHTML += "<div id='poecRecFilter' class='poec_search_input'><input type='text' id='poecRecFilterInput' class='init left' value='" + applyLang("Search Filter") + "'/><div class='clear' onClick='poec_clearRecSearchFilter()'><div>X</div></div></div>";
        vHTML += '<div class="poec_affopt"><div class="mcui-radio med_shadow" id="poecRecOutMode"><div class="choice selected">' + applyLang("List") + '<div class="value">l</div></div><div class="choice">' + applyLang("Infotabs") + '<div class="value">t</div></div><div class="choice">' + applyLang("Preview Items") + '<div class="value">i</div></div></div></div>';
        vHTML += '<div class="poec_affopt tgmode"><div class="mcui-checkbox ' + poec_affGetIniCheck(poerec_options["full"]) + ' med_shadow" id="poecRecFullRecipees">' + applyLang("Full Recipees") + '</div></div>';
        vHTML += '<div class="poec_affopt tgmode"><div class="mcui-checkbox ' + poec_affGetIniCheck(poerec_options["ssf"]) + ' med_shadow" id="poecRecSsfFriendly">' + applyLang("SSF Friendly") + '</div></div>';
        vHTML += "</div>";

        var addcls = {};
        $.each(poeaf["oindex"]["ascls"], function (ekey, erecs) {
            addcls[ekey] = "";
            $.each(erecs, function (eekey, ebool) {
                addcls[ekey] += " sk" + eekey;
            });
        });

        vHTML += poec_affBuildMSelector(poeexd["classes"]["seq"], "id_pclass", "name_class", "poecRecMSClass", applyLang("Ascendency"), true, addcls, false, poerec_options["asc"], "recipees");

        var addcls = {};
        $.each(poeaf["oindex"]["skill"], function (ekey, erecs) {
            addcls[ekey] = "";
            $.each(erecs, function (eekey, ebool) {
                addcls[ekey] += " ac" + eekey;
            });
        });

        vHTML += poec_affBuildMSelector(poeexd["gems"]["seq"], "id_gem", "name_gem", "poecRecMSSkill", applyLang("Skill gem"), true, addcls, true, poerec_options["skl"], "recipees");

        var strvalidbases = "|";
        var tarrSIndex = {};
        for (var i = 0; i < poeexd["slots"]["seq"].length; i++) {
            for (var j = 0; j < poeexd["slots"]["seq"][i]["bases"].length; j++) {
                strvalidbases += poeexd["slots"]["seq"][i]["bases"][j] + "|";
                tarrSIndex[poeexd["slots"]["seq"][i]["bases"][j]] = poeexd["slots"]["seq"][i]["id"]
            }
        }

        vHTML += poec_affBuildMSelector(poeexd["slots"]["seq"], "id", "name", "poecRecMSSlot", applyLang("Gear slot"), false, null, false, poerec_options["slt"], "recipees");

        var tarrBases = [];
        var addcls = {};
        for (var i = 0; i < poecd["bases"]["seq"].length; i++) {
            if (strvalidbases.indexOf("|" + poecd["bases"]["seq"][i]["id_base"] + "|") > -1) {
                tarrBases.push({
                    "id": poecd["bases"]["seq"][i]["id_base"],
                    "name": poecd["bases"]["seq"][i]["name_base"]
                });
                addcls[poecd["bases"]["seq"][i]["id_base"]] = "sl" + tarrSIndex[poecd["bases"]["seq"][i]["id_base"]];
            }
        }

        vHTML += poec_affBuildMSelector(tarrBases, "id", "name", "poecRecMSBase", applyLang("Item base"), false, addcls, false, poerec_options["bas"], "recipees");

        var tarrBitems = [];
        var addcls = {};
        for (var i = 0; i < poeaf["iindex"].length; i++) {
            tarrBitems.push({
                "id": poeaf["iindex"][i],
                "name": poecd["bitems"]["seq"][poecd["bitems"]["ind"][poeaf["iindex"][i]]]["name_bitem"]
            });
            addcls[poeaf["iindex"][i]] = "bs" + poecd["bitems"]["seq"][poecd["bitems"]["ind"][poeaf["iindex"][i]]]["id_base"];
        }

        vHTML += poec_affBuildMSelector(tarrBitems, "id", "name", "poecRecMSItem", applyLang("Item"), false, addcls, false, poerec_options["bit"], "recipees");

        // Archetype
        var arrall = [];
        $.each(poeexd["supports"], function (pname, key) {
            pname = pname.replace(" Support", "");
            arrall.push([key, pname]);
        });
        $.each(poeexd["keystones"], function (pname, key) {
            arrall.push([key, pname]);
        });
        $.each(nsim_addarches, function (pname, key) {
            arrall.push([key, pname]);
        });
        arrall.sort(function (a, b) {
            return a[1] > b[1] ? 1 : -1;
        });
        var tarrArches = [];
        var addcls = {};
        for (var i = 0; i < arrall.length; i++) {
            tarrArches.push({"id": arrall[i][0], "name": arrall[i][1]});
        }

        vHTML += poec_affBuildMSelector(tarrArches, "id", "name", "poecRecArches", applyLang("Archetype"), true, null, false, poerec_options["arch"], "recipees");

        // Focus
        var tarrFocus = [];
        for (var i = 0; i < poecd["mtypes"]["seq"].length; i++) {
            if (poecd["mtypes"]["seq"][i]["jewellery_tag"] == 0) {
                tarrFocus.push({
                    "id": poecd["mtypes"]["seq"][i]["id_mtype"],
                    "name": poecd["mtypes"]["seq"][i]["name_mtype"]
                });
            }
        }

        vHTML += poec_affBuildMSelector(tarrFocus, "id", "name", "poecRecFocus", applyLang("Focus"), true, null, false, poerec_options["foc"], "recipees");

        vHTML += "</div>";
        vHTML += "<div id='poecRecipeesOutput'></div>";

        $("<div>").attr("id", "poecRecipees").html(vHTML).appendTo($("#poecRecipeesZone"));

        $("#poecAffOptions.rec").find(".mcui-checkbox").mcuiCheck({
            "change": function () {
                poec_recSetOptions(false);
            }
        });
        $("#poecRecOutMode").mcuiRadio({
            "change": function () {
                poec_buildRecipeesOutput();
            }
        });

        poec_initRecSearchFilter();
        poec_recUpdateResult();
    }
}

function poec_buildRecipeesOutput() {
    $("#poecRecipeesLayout").html('<div id="poecModDistBigLoader" style="padding:30px 0px"><img src="../../images/ajax-loader-dark.gif"></div>');
    setTimeout(function () {
        poec_buildRecipeesOutputGO();
    }, 1);
}

function poec_buildRecipeesOutputGO() {
    var omode = $("#poecRecOutMode").mcuiRadio().getVal();
    var rdata = jQuery.parseJSON($("#poecRecipeesData").html());
    for (var i = 0; i < rdata.length; i++) {
        rdata[i]["cconfig"] = jQuery.parseJSON(rdata[i]["cconfig"]);
        rdata[i]["showcase_item"] = jQuery.parseJSON(rdata[i]["showcase_item"]);
        rdata[i]["start_item"] = jQuery.parseJSON(rdata[i]["start_item"]);
    }
    var ohtml = "";
    ohtml += "<div class='reclayoutholder lt_" + omode + "'>";
    switch (omode) {
        case 'l' :
            ohtml += "<div id='poecSimRecipeesList' class='div_stable'>";
            for (var i = 0; i < rdata.length; i++) {
                if (poecd["bases"]["seq"][poecd["bases"]["ind"][rdata[i]["base"]]]["master_base"]) {
                    var base = poecd["bases"]["seq"][poecd["bases"]["ind"][poecd["bases"]["seq"][poecd["bases"]["ind"][rdata[i]["base"]]]["master_base"]]]["name_base"];
                    base += "<span class='bitem'>" + poecd["bases"]["seq"][poecd["bases"]["ind"][rdata[i]["base"]]]["name_base"] + "</span>";
                } else {
                    var base = poecd["bases"]["seq"][poecd["bases"]["ind"][rdata[i]["base"]]]["name_base"];
                    if (rdata[i]["bitem"]) {
                        base += "<span class='bitem'>" + poecd["bitems"]["seq"][poecd["bitems"]["ind"][rdata[i]["bitem"]]]["name_bitem"] + "</span>";
                    }
                }
                ohtml += "<div class='craft med_shadow'>";
                ohtml += "<div class='base'>" + base + "<div class='by'>By <span class='whom'>" + rdata[i]["crafter_name"] + "</span></div></div>";
                ohtml += "<div class='steps'>" + rdata[i]["cconfig"].length + "<div class='label'>" + applyLang("Steps") + "</div></div>";
                var tags = poec_nsimOutputCTags(rdata[i]["ctags"]);
                var addtags = "";
                if (rdata[i]["ssf_friendly"] == 1) {
                    addtags += "<div class='atag'>" + applyLang("SSF") + "</div>";
                }
                if (rdata[i]["is_fullcraft"] == 1) {
                    addtags += "<div class='atag'>" + applyLang("Full") + "</div>";
                }
                if (rdata[i]["is_public"] == 1) {
                    addtags += "<div class='atag'>" + applyLang("Public") + "</div>";
                }
                var crtags = "";
                if (rdata[i]["cmets"]) {
                    var cmets = rdata[i]["cmets"].substring(1, rdata[i]["cmets"].length - 1).split("|");
                    for (var j = 0; j < cmets.length; j++) {
                        crtags += "<div class='crtag " + cmets[j] + "'>" + nsim_cmetnames[cmets[j]] + "</div>";
                    }
                }
                ohtml += "<div class='tags'>" + tags + addtags + crtags + "</div>";
                //ohtml+=  "<div class='author'>By <span class=''>"+rdata[i]["crafter_name"]+"</span></div>";
                ohtml += "</div>";
                ohtml += "<div class='spacer'><div></div></div>";
            }
            ohtml += "</div>";
            break;
        case 't' :
            ohtml += "<div class='coe_recipee_set'>";
            for (var i = 0; i < rdata.length; i++) {
                ohtml += poec_nsimGetCraftInfoTab(rdata[i], "browser");
            }
            ohtml += "</div>";
            break;
        case 'i' :
            for (var i = 0; i < rdata.length; i++) {
                if (rdata[i]["showcase_item"]) {
                    var nidata = {
                        "quality": rdata[i]["showcase_item"]["quality"],
                        "catalyst": rdata[i]["showcase_item"]["catalysts"],
                        "affixes": rdata[i]["showcase_item"]["affixes"],
                        "implicits": rdata[i]["showcase_item"]["implicits"],
                        "eldritch": rdata[i]["showcase_item"]["eldritch"],
                        "enchant": "",
                        "influences": rdata[i]["showcase_item"]["influences"],
                        "rarity": rdata[i]["showcase_item"]["rarity"],
                        "ilvl": rdata[i]["showcase_item"]["ilvl"],
                        "base": rdata[i]["showcase_item"]["base"]
                    };
                    ohtml += poec_simGetFullItem(nidata, rdata[i]["showcase_item"]["bitem"], "Showcase item", "simulator", true);
                }
            }
            break;
    }
    ohtml += "</div>";
    $("#poecRecipeesLayout").html(ohtml);
    if (omode == "t") {
        poec_nsimSetInfoTabBehavior($("#poecRecipeesLayout"));
    }
}

function poec_initRecSearchFilter() {
    $("#poecRecFilterInput").mcuiText();
    $("#poecRecFilterInput").keyup(function () {
        poec_recSearchFilterGO();
    }).focus(function () {
        if ($(this).hasClass("init")) {
            $(this).attr("initerm", $(this).val()).removeClass("init").val("");
            $(this).parent().addClass("active");
        } else {
            $(this).select();
        }
    }).blur(function () {
        if ($(this).val() == "") {
            $(this).addClass("init").val($(this).attr("initerm"));
            $(this).parent().removeClass("active");
        }
    });
}

function poec_clearRecSearchFilter() {
    $("#poecRecFilterInput").addClass("init").val($("#poecRecFilterInput").attr("initerm"));
    $("#poecRecFilterInput").parent().removeClass("active");
    $("#poecAffOptions.rec").find(".poec_mselector").find(".opt").removeClass("hidden");
}

function poec_recSearchFilterGO() {
    $("#poecAffOptions.rec").find(".poec_mselector").find(".opt").removeClass("hidden");
    if (!$("#poecRecFilterInput").hasClass("init")) {
        var sval = $("#poecRecFilterInput").val().trim().toUpperCase();
        if (sval.length > 2) {
            $("#poecAffOptions.rec").find(".poec_mselector").find(".opt").each(function () {
                var ttext = $(this).text().toUpperCase();
                if (ttext.indexOf(sval) > -1) {
                } else {
                    $(this).addClass("hidden");
                }
            });
        }
    }
}

function poec_recSetOptions(init) {
    poerec_options["ssf"] = $("#poecRecSsfFriendly").mcuiCheck().getVal();
    poerec_options["full"] = $("#poecRecFullRecipees").mcuiCheck().getVal();
    poec_recUpdateResult();
}

function poec_recMSOptChoose(vThis) {
    if ($(vThis).hasClass("selected")) {
        $(vThis).removeClass("selected");
    } else {
        var is_multi = $(vThis).parent().parent().parent().parent().hasClass("multi_true");
        if (!is_multi) {
            $(vThis).parent().children(".opt").removeClass("selected");
        }
        $(vThis).addClass("selected");
        $(vThis).parent().parent().scrollTop(0);
    }
    poec_recMSUpdActive(false);
    poec_recUpdShareLink();
}

function poec_recMSUpdActive(init) {
    var slt = poec_affMSGetVal($("#poecRecMSSlot"));
    var bas = poec_affMSGetVal($("#poecRecMSBase"));

    $("#poecRecMSBase").find(".opt").removeClass("active");
    $("#poecRecMSBase").removeClass("active");
    if (slt) {
        $("#poecRecMSBase").find(".opts").find(".sl" + slt).addClass("active");
        $("#poecRecMSBase").addClass("active");
        $("#poecRecMSBase").find(".opt.selected:not(.active)").removeClass("selected");
    }

    $("#poecRecMSItem").find(".opt").removeClass("active");
    $("#poecRecMSItem").removeClass("active");
    if (bas || slt) {
        if (bas) {
            var jfind = ".bs" + bas + ", .rares";
        } else {
            var jfind = "";
            $("#poecRecMSBase").find(".opt.active").each(function () {
                jfind += ", .bs" + $(this).attr("oval");
            });
            jfind = jfind.substring(2, jfind.length) + ", .rares";
        }
        $("#poecRecMSItem").find(".opts").find(jfind).addClass("active");
        $("#poecRecMSItem").addClass("active");
        $("#poecRecMSItem").find(".opt.selected:not(.active)").removeClass("selected");
    }

    poec_recUpdateResult();
}

var poec_recrtm = null;

function poec_recUpdateResult() {
    clearTimeout(poec_recrtm);
    poec_recrtm = setTimeout(function () {
        poec_recUpdateResultGO(0);
    }, 500);
}

function poec_recUpdateResultGO(vPG) {
    poerec_options["asc"] = poec_affMSGetVal($("#poecRecMSClass"));
    poerec_options["skl"] = poec_affMSGetVal($("#poecRecMSSkill"));
    poerec_options["slt"] = poec_affMSGetVal($("#poecRecMSSlot"));
    poerec_options["bas"] = poec_affMSGetVal($("#poecRecMSBase"));
    poerec_options["bit"] = poec_affMSGetVal($("#poecRecMSItem"));
    poerec_options["arch"] = poec_affMSGetVal($("#poecRecArches"));
    poerec_options["foc"] = poec_affMSGetVal($("#poecRecFocus"));
    poec_recUpdShareLink();
    var vQS = "opts=" + encodeURIComponent(JSON.stringify(poerec_options)) + "&pg=" + vPG;
    var acajax = new mc_ajax("../../cgi/web/custom/get_recipees.php", vQS, {
        target: $("#poecRecipeesOutput"), complete: function (result) {
            poec_buildRecipeesOutput();
        }
    });
}

function poec_recUpdShareLink() {
    poec_recsl = null;
    if (poerec_options["asc"] || poerec_options["skl"] || poerec_options["slt"] || poerec_options["bas"] || poerec_options["bit"] || poerec_options["arch"] || poerec_options["foc"]) {
        var basl = [];
        $.each(poerec_options, function (key, val) {
            basl.push(val);
        });
        basl = JSON.stringify(basl);
        poec_recsl = basl;
    }
    poec_buildShareLink(true);
}

/*************/
/* FLOWCHART */

/*************/
function poec_simInitFlowchart() {
    $("poecFlowDiagram").remove();
    var fHTML = "";
    fHTML += "<div id='poecFlowDiagram' class='noselect'></div>";
    $("#poecSimFlowchartZone").html(fHTML);
    setTimeout(function () {
        poec_simInitFlowchartGO();
    }, 1);
}

function poec_simFlowCheckBounds(route, from, to) {
    if (route < from || route > to) {
        return false;
    } else {
        return true;
    }
}

function poec_nsimParseFlowConfig() {
    if (simulator_flow == null) {
        simulator_flow = {
            "split": $("#poecSimFlowSplit").mcuiCheck().getVal(),
            "into": $("#poecSimFlowSplitConf").val(),
            "layout": {}
        };
    }
    for (var i = 0; i < simulator_config.length; i++) {
        if (simulator_flow["layout"][i] == undefined) {
            simulator_flow["layout"][i] = {"w": "a", "f": "a"};
        }
    }
}

function poec_nsimGetLayoutDir(dir) {
    switch (dir) {
        case 'l' :
            return "left";
            break;
        case 't' :
            return "top";
            break;
        case 'r' :
            return "right";
            break;
        case 'b' :
            return "bottom";
            break;
    }
}

function poec_simInitFlowchartGO() {
    // Convert sequence to flowchart
    $(".nsim_flowdet").remove();
    poec_nsimGenerateConfigData();
    poec_nsimParseFlowConfig();

    simulator_flow["split"] = $("#poecSimFlowSplit").mcuiCheck().getVal();
    simulator_flow["into"] = $("#poecSimFlowSplitConf").val();
    //console.log(simulator_flow);

    var cur_index = 0;
    var route_index = [];

    var split = $("#poecSimFlowSplit").mcuiCheck().getVal();
    var arrcharts = [];
    defsplit = true;
    if (split) {
        var ssplit = $("#poecSimFlowSplitConf").val();
        var ssplit = ssplit.split(",");
        if (ssplit.length == 1) {
            // Dividing
            ssplit = parseInt(ssplit[0].trim());
            if (!isNaN(ssplit)) {
                defsplit = false;
                var spliteach = Math.floor(simulator_config.length / ssplit);
                var cindex = 0;
                var lastpush = 0;
                for (var j = 0; j < ssplit; j++) {
                    var thischart = [];
                    for (var i = cindex; i < cindex + spliteach; i++) {
                        if (i >= simulator_config.length) {
                            break;
                        } else {
                            thischart.push(i);
                            lastpush = i;
                        }
                    }
                    cindex += spliteach;
                    arrcharts.push(thischart);
                }
                if (lastpush < simulator_config.length - 1) {
                    for (var i = lastpush + 1; i < simulator_config.length; i++) {
                        arrcharts[arrcharts.length - 1].push(i);
                    }
                }
            }
        } else {
            // Manual spliting
            var cindex = 0;
            var lastjindex = 0;
            for (var i = 0; i < ssplit.length; i++) {
                ssplit[i] = parseInt(ssplit[i].trim());
                if (!isNaN(ssplit[i])) {
                    defsplit = false;
                    var thischart = [];
                    for (var j = 0; j < ssplit[i]; j++) {
                        if (j + cindex >= simulator_config.length) {
                            break;
                        } else {
                            thischart.push(j + cindex);
                            lastjindex = j + cindex;
                        }
                    }
                    cindex += ssplit[i];
                    arrcharts.push(thischart);
                }
            }
            if (!defsplit) {
                if (lastjindex + 1 < simulator_config.length) {
                    // Leftover
                    var thischart = [];
                    for (var j = lastjindex + 1; j < simulator_config.length; j++) {
                        thischart.push(j);
                    }
                    arrcharts.push(thischart);
                }
            }
        }
    }

    if (defsplit) {
        var thischart = [];
        for (var i = 0; i < simulator_config.length; i++) {
            thischart.push(i);
        }
        arrcharts.push(thischart);
    }

    var fHTML = "";
    var partindex = {};
    for (var i = 0; i < arrcharts.length; i++) {
        fHTML += "<div id='poecFlowDiagram" + i + "' class='flowdiagram noselect'></div>";
        for (var j = 0; j < arrcharts[i].length; j++) {
            partindex[arrcharts[i][j]] = i;
        }
    }
    $("#poecSimFlowchartZone").html(fHTML);

    //console.log(arrcharts);

    poecFlowInitSizes = [];

    try {

        var starti = 0;
        for (var zn = 0; zn < arrcharts.length; zn++) {
            var sfrom = starti + 1;
            var sto = starti + arrcharts[zn].length;
            var subrcnt = 1;
            var is_start = false;
            var is_end = false;
            if (zn == 0) {
                is_start = true;
            }
            if (zn == arrcharts.length - 1) {
                is_end = true;
            }
            var flowdata = {
                "def": "",
                "routing": "",
                "styling": ""
            }
            if (is_start) {
                flowdata["def"] += "start=>start: Start" + "\n";
            } else {
                flowdata["def"] += "start=>start: Part " + (zn) + "|subr:>javascript:poec_flowGoToPart(" + zn + ")" + "\n";
            }
            for (var i = starti; i < starti + arrcharts[zn].length; i++) {
                var stepn = i + 1;
                var thisn = "step" + stepn;
                var nextn = "step" + (stepn + 1);
                var otext = stepn + ". ";
                var routing = "";
                var styling = "";
                var flowstate = "";
                if (i == starti) {
                    routing += "start->" + thisn + "\n";
                    styling += 'start@>' + thisn + '({"stroke":"#66FF66"})' + "\n";
                }
                if (i == starti + arrcharts[zn].length - 1) {
                    nextn = "end";
                }

                var bnname = poec_cmethods[simulator_config[i]["method"][0]]["name"];
                flowstate = simulator_config[i]["method"][0];
                switch (simulator_config[i]["method"][0]) {
                    case 'fossil':
                        bnname += "s";
                        if (simulator_config[i]["method"][1]) {
                            what = "";
                            var fossils = simulator_config[i]["method"][1].substring(1, simulator_config[i]["method"][1].length - 1).split("|");
                            for (var j = 0; j < fossils.length; j++) {
                                if (j > 0) {
                                    what += "+";
                                }
                                switch (fossils[j]) {
                                    case 'perfect':
                                        var fname = applyLang("Perfect");
                                        break;
                                    case 'gilded':
                                        var fname = applyLang("Gilded");
                                        break;
                                    case 'tangled':
                                        var fname = applyLang("Tangled");
                                        break;
                                    default:
                                        var fname = poecd["fossils"]["seq"][poecd["fossils"]["ind"][fossils[j]]]["name_fossil"];
                                        break;
                                }
                                what += fname;
                            }
                            bnname += "\n" + what;
                        }
                        break;
                    case 'harvest' :
                        bnname = "Harvest";
                        switch (simulator_config[i]["method"][1]) {
                            case 'hother' :
                                bnname += "\n";
                                break;
                            default:
                                bnname += "\n" + poec_cmethods["harvest"]["subset"][simulator_config[i]["method"][1]]["name"] + " > ";
                                break;
                        }
                        switch (simulator_config[i]["method"][1]) {
                            case 'hresist' :
                            case 'hother' :
                                bnname += poec_cmethods["harvest"]["subset"][simulator_config[i]["method"][1]]["subset"][simulator_config[i]["method"][2]]["name"];
                                break;
                            default:
                                if (simulator_config[i]["method"][2] == "inf") {
                                    bnname += applyLang("Influence");
                                } else {
                                    for (var z = 0; z < poecd['mtypes']['seq'].length; z++) {
                                        if (poecd['mtypes']['seq'][z]["harvest"] == "1") {
                                            if (poecd['mtypes']['seq'][z]["id_mtype"] == simulator_config[i]["method"][2]) {
                                                bnname += poecl["mtype"][poecd['mtypes']['seq'][z]["id_mtype"]]
                                            }
                                        }
                                    }
                                }
                                break;
                        }
                        break;
                    case 'beast_crafting' :
                    case 'eldritch' :
                    case 'syndicate' :
                        bnname += "\n" + poec_cmethods[simulator_config[i]["method"][0]]["subset"][simulator_config[i]["method"][1]]["name"];
                        break;
                    case 'currency' :
                        bnname = poec_cmethods[simulator_config[i]["method"][0]]["subset"][simulator_config[i]["method"][1]]["name"];
                        break;
                    case 'bench':
                        var bsel = simulator_config[i]["method"][1].substring(1, simulator_config[i]["method"][1].length - 1).split("|");
                        for (var z = 0; z < bsel.length; z++) {
                            if (bsel[z] == "remove_bench") {
                                bnname = applyLang("Remove benchcraft");
                                break;
                            } else {
                                bsel[z] = bsel[z].split("t");
                                var fname = poecl["mod"][bsel[z][0]];
                                var nvalues = poecd["tiers"][bsel[z][0]][simulator_settings["base"]][bsel[z][1]]["nvalues"];
                                var pname = poecd_parseMName(fname, nvalues);
                                if (pname.length > 40) {
                                    pname = pname.substring(0, 40) + "...";
                                }
                                bnname += "\n" + pname;
                            }
                        }
                        break;
                    case 'metamethod':
                        bnname = simulator_metam[simulator_config[i]["method"][1]]["name"];
                        break;
                    case 'essence':
                        var essid = simulator_config[i]["method"][1].replace("ess", "");
                        var essname = poecd["essences"]["seq"][poecd["essences"]["ind"][essid]]["name_essence"];
                        var esstier = parseInt(simulator_config[i]["method"][2].replace("esst", ""));
                        var btiers = jQuery.parseJSON(poecd["essences"]["seq"][poecd["essences"]["ind"][essid]]["tiers"]);
                        var modid = btiers[simulator_settings["base"]];
                        var ntiers = poecd["tiers"][modid][simulator_settings["base"]].length;
                        switch (essname) {
                            case 'Dread' :
                                if (simulator_settings["base"] == 20) { // Bows with dreads have t1 and t2 at same effect
                                    ntiers++;
                                }
                                break;
                        }
                        var esspref = "";
                        switch (essname) {
                            case 'Horror' :
                            case 'Insanity' :
                            case 'Delirium' :
                            case 'Hysteria' :
                                break;
                            default:
                                var trueetier = esstier + (7 - ntiers) + 1;
                                switch (trueetier) {
                                    case 1 :
                                        esspref = applyLang("Whispering") + " ";
                                        break;
                                    case 2 :
                                        esspref = applyLang("Muttering") + " ";
                                        break;
                                    case 3 :
                                        esspref = applyLang("Weeping") + " ";
                                        break;
                                    case 4 :
                                        esspref = applyLang("Wailing") + " ";
                                        break;
                                    case 5 :
                                        esspref = applyLang("Screaming") + " ";
                                        break;
                                    case 6 :
                                        esspref = applyLang("Shrieking") + " ";
                                        break;
                                    case 7 :
                                        esspref = applyLang("Deafening") + " ";
                                        break;
                                }
                                break;
                        }
                        bnname = esspref;
                        bnname += applyLang("Essence");
                        bnname += " " + applyLang("of") + " " + essname;
                        break;
                    default:

                        break;
                }

                otext += bnname;

                var wdir = "";
                var owdir = "";
                if (simulator_flow["layout"][i]["w"]) {
                    if (simulator_flow["layout"][i]["w"] != "a") {
                        wdir = poec_nsimGetLayoutDir(simulator_flow["layout"][i]["w"]);
                        owdir = "(" + wdir + ")";
                        wdir = "," + wdir;
                    }
                }
                var fdir = "";
                var fwdir = "";
                if (simulator_flow["layout"][i]["f"]) {
                    if (simulator_flow["layout"][i]["f"] != "a") {
                        fdir = poec_nsimGetLayoutDir(simulator_flow["layout"][i]["f"]);
                        fwdir = "(" + fdir + ")";
                        fdir = "," + fdir;
                    }
                }

                if (simulator_config[i]["actions"]["win"] == "next" && simulator_config[i]["actions"]["fail"] == "loop") {
                    // Operation
                    var otype = "operation";
                    routing += thisn + owdir + "->" + nextn + "\n";
                    styling += thisn + '@>' + nextn + '({"stroke":"#66FF66"})' + "\n";
                } else {
                    if (simulator_config[i]["autopass"]) {
                        var otype = "operation";
                        if (simulator_config[i]["actions"]["win"] == "next") {
                            routing += thisn + owdir + "->" + nextn + "\n";
                            styling += thisn + '@>' + nextn + '({"stroke":"#66FF66"})' + "\n";
                        } else {
                            if (simulator_config[i]["actions"]["win"] == "end") {
                                routing += thisn + owdir + "->end" + "\n";
                                styling += thisn + '@>end({"stroke":"#66FF66"})' + "\n";
                            } else {
                                var rname = "step" + simulator_config[i]["actions"]["win_route"];
                                if (!poec_simFlowCheckBounds(simulator_config[i]["actions"]["win_route"], sfrom, sto)) {
                                    rname = "subr" + subrcnt;
                                    subrcnt++;
                                    flowdata["def"] += rname + "=>subroutine: Part " + (partindex[simulator_config[i]["actions"]["win_route"] - 1] + 1) + "\nStep " + simulator_config[i]["actions"]["win_route"] + "|subr:>javascript:poec_flowGoToPart(" + (partindex[simulator_config[i]["actions"]["win_route"] - 1] + 1) + ")" + "\n";
                                }
                                routing += thisn + owdir + "->" + rname + "\n";
                                styling += thisn + "->" + rname + '({"stroke":"#66FF66"})' + "\n";
                            }
                        }
                    } else {
                        // Condition
                        var otype = "condition";
                        var addyc = "";
                        var yesright = false;
                        var noright = false;
                        var invert_routing = false;
                        if (simulator_config[i]["actions"]["win"] == "step" && simulator_config[i]["actions"]["fail"] == "step") {
                            invert_routing = true;
                            if (simulator_config[i]["actions"]["win_route"] > stepn && simulator_config[i]["actions"]["fail_route"] > stepn) {
                                yesright = true;
                            }
                        } else {
                            if (simulator_config[i]["actions"]["win"] == "step" && simulator_config[i]["actions"]["fail"] == "restart") {
                                invert_routing = true;
                            }
                        }
                        if (simulator_config[i]["actions"]["fail"] == "restart") {
                            yesright = true;
                        }
                        switch (simulator_config[i]["actions"]["win"]) {
                            case 'end' :
                                var gotowin = "end";
                                break;
                            case 'next' :
                                var gotowin = nextn;
                                break;
                            case 'step' :
                                var gotowin = "step" + simulator_config[i]["actions"]["win_route"];
                                if (!poec_simFlowCheckBounds(simulator_config[i]["actions"]["win_route"], sfrom, sto)) {
                                    gotowin = "subr" + subrcnt;
                                    subrcnt++;
                                    flowdata["def"] += gotowin + "=>subroutine: Part " + (partindex[simulator_config[i]["actions"]["win_route"] - 1] + 1) + "\nStep " + simulator_config[i]["actions"]["win_route"] + "|subr:>javascript:poec_flowGoToPart(" + (partindex[simulator_config[i]["actions"]["win_route"] - 1] + 1) + ")" + "\n";
                                }
                                if (simulator_config[i]["actions"]["win_route"] < stepn) {
                                    yesright = true;
                                }
                                break;
                        }
                        var nofroute = false;
                        switch (simulator_config[i]["actions"]["fail"]) {
                            case 'restart' :
                                flowdata["def"] += "restart" + stepn + "=>operation: Restart|restart" + "\n";
                                var gotofail = "restart" + stepn;
                                break;
                            case 'step' :
                                var gotofail = "step" + simulator_config[i]["actions"]["fail_route"];
                                if (!poec_simFlowCheckBounds(simulator_config[i]["actions"]["fail_route"], sfrom, sto)) {
                                    gotofail = "subr" + subrcnt;
                                    subrcnt++;
                                    flowdata["def"] += gotofail + "=>subroutine: Part " + (partindex[simulator_config[i]["actions"]["fail_route"] - 1] + 1) + "\nStep " + simulator_config[i]["actions"]["fail_route"] + "|subr:>javascript:poec_flowGoToPart(" + (partindex[simulator_config[i]["actions"]["fail_route"] - 1] + 1) + ")" + "\n";
                                }
                                if (simulator_config[i]["actions"]["fail_route"] < stepn) {
                                    noright = true;
                                }
                                break;
                            case 'loop' :
                                // ??
                                nofroute = true;
                                break;
                        }
                        if (yesright) {
                            addyc += ",right";
                        }
                        if (invert_routing) {
                            if (fdir) {
                                addyc = fdir;
                            }
                            routing += thisn + "(yes@ " + addyc + ")->" + gotofail + "\n";
                            styling += thisn + '@>' + gotofail + '({"stroke":"#FF6666"})' + "\n";
                            if (!nofroute) {
                                routing += thisn + "(no@ " + wdir + ")->" + gotowin + "\n";
                                styling += thisn + '@>' + gotowin + '({"stroke":"#66FF66"})' + "\n";
                            }
                        } else {
                            if (wdir) {
                                addyc = wdir;
                            }
                            routing += thisn + "(yes@ " + addyc + ")->" + gotowin + "\n";
                            styling += thisn + '@>' + gotowin + '({"stroke":"#66FF66"})' + "\n";
                            if (!nofroute) {
                                routing += thisn + "(no@ " + fdir + ")->" + gotofail + "\n";
                                styling += thisn + '@>' + gotofail + '({"stroke":"#FF6666"})' + "\n";
                            }
                        }
                    }
                }
                if (flowstate != "") {
                    flowstate = "|" + flowstate;
                }
                flowdata["def"] += thisn + "(step=" + stepn + ",detc=" + flowstate.replace("|", "") + ")=>" + otype + ": " + otext + flowstate + ":$poec_flowGetStepDet" + "\n";
                flowdata["routing"] += routing;
                flowdata["styling"] += styling;
                /*
                console.log("STEPPING:"+thisn);
                console.log(thisn+"=>"+otype+": "+otext+flowstate);
                console.log(routing);
                */
            }
            if (is_end) {
                flowdata["def"] += "end=>end: End" + "\n";
            } else {
                flowdata["def"] += "end=>end: Part " + (zn + 2) + "|subr:>javascript:poec_flowGoToPart(" + (zn + 2) + ")" + "\n";
            }
            var flowdat = flowdata["def"] + flowdata["routing"] + flowdata["styling"];

            console.log(flowdat);

            var diagram = flowchart.parse(flowdat);
            diagram.drawSVG('poecFlowDiagram' + zn, {
                'x': 0,
                'y': 0,
                'line-width': 1.5,
                'line-length': 30,
                'text-margin': 10,
                'font-size': 12,
                'font-color': 'white',
                'line-color': 'white',
                'element-color': '#666666',
                'font-family': 'Open Sans',
                'fill': '#333333',
                'yes-text': 'win',
                'no-text': 'fail',
                'arrow-end': 'block',
                'scale': 1,
                'symbols': {
                    'start': {
                        'font-color': '#FFEEBB',
                        'element-color': '#FFEEBB',
                        'fill': '#000000'
                    },
                    'end': {
                        'font-color': '#FFEEBB',
                        'element-color': '#FFEEBB',
                        'fill': '#000000'
                    }
                },
                'flowstate': {
                    'restart': {'fill': '#330000', 'font-color': '#FF6666', 'element-color': '#FF6666'},
                    'fossil': {'font-color': '#FFDD66', 'element-color': "#FFBB00"},
                    'harvest': {'font-color': '#66f6ff', 'element-color': "#00f0ff"},
                    'syndicate': {'font-color': '#66FFBB', 'element-color': "#33FF99"},
                    'essence': {'font-color': '#AAAAFF', 'element-color': "#8888FF"},
                    'eldritch': {'font-color': '#FFAAAA', 'element-color': "#FF8888"},
                    'beast_crafting': {'font-color': '#FFBB66', 'element-color': "#FFA500"},
                    "subr": {'font-color': '#FFEEBB', 'element-color': '#FFEEBB', "fill": "#000000"},
                    "bench": {'font-color': '#b8daf1', 'element-color': '#b8daf1'}
                }
            });

            var svgw = parseFloat($("#poecFlowDiagram" + zn).children("svg").attr("width"));
            var fldw = $("#poecFlowDiagram" + zn).width();
            if (svgw < fldw) {
                $("#poecFlowDiagram" + zn).addClass("noscroll").height(parseFloat($("#poecFlowDiagram" + zn).children("svg").attr("height")) + 50);
            } else {
                $("#poecFlowDiagram" + zn).mousedown(function (e) {
                    poec_startDragScroll($(this), e);
                });
                $('#poecFlowDiagram' + zn).bind('mousewheel', function (e) {
                    e.preventDefault();
                    var w = $(e.currentTarget).children("svg").width();
                    var h = $(e.currentTarget).children("svg").height();
                    if (e.originalEvent.wheelDelta / 120 > 0) {
                        var nw = w + 100;
                    } else {
                        var nw = w - 100;
                    }
                    var nh = (h * nw) / w;
                    $(e.currentTarget).children("svg").height(nh).width(nw).attr({"width": nw, "height": nh});
                    $(".nsim_flowdet").remove();
                });
            }

            poecFlowInitSizes.push({
                "w": $('#poecFlowDiagram' + zn).children("svg").attr("width"),
                "h": $('#poecFlowDiagram' + zn).children("svg").attr("height")
            });

            starti += arrcharts[zn].length;

            if (arrcharts.length > 1) {
                $("<div>").addClass("partitle med_shadow").html("Part " + (zn + 1)).appendTo($("#poecFlowDiagram" + zn));
            }
        }
    } catch (e) {
        poec_outputNotice("<div>" + applyLang("Error occured") + "</div><div>" + e + "</div>", "red");
    }

    /*
    $("#siteWrap").mousemove(function(e){
        poecCurrentMS["x"]=e.pageX;
        poecCurrentMS["y"]=e.pageY;
    });
    */
}

var poecFlowInitSizes = null;
var poecCurrentMS = {"x": null, "y": null};
var poecCurrentDS = null;
var poecDragging = false;

function poec_startDragScroll(vThis, event) {
    //console.log("START SCROLL");
    poecCurrentDS = {
        "node": vThis,
        "startx": event.pageX,
        "starty": event.pageY,
        "scrollx": $(vThis).scrollLeft(),
        "scrolly": $(vThis).scrollTop()
    }
    poecDragging = true;
    $("body").mousemove(function (e) {
        var dx = (poecCurrentDS["startx"] - e.pageX) * 2;
        var dy = (poecCurrentDS["starty"] - e.pageY) * 2;
        $(poecCurrentDS["node"]).scrollTop(poecCurrentDS["scrolly"] + dy).scrollLeft(poecCurrentDS["scrollx"] + dx);
        if (poecDragging) {
            $(".nsim_flowdet").remove();
        }
    }).mouseup(function () {
        //console.log("STOP");
        poecDragging = false;
        $("body").unbind("mousemove").unbind("mouseup");
    });
}

function poec_stopDragScroll() {

}

function poec_flowGetStepDet(evt, opts, symbol) {
    var tstep = opts["params"]["step"];
    var ignore = false;
    if (symbol) {
        var epos = $(symbol[0]).offset();
        var ewidth = $(symbol[0]).width();
        var eheight = $(symbol[0]).height();
        if (ewidth == 0) {
            for (var i = 0; i < symbol["realPath"].length; i++) {
                if (symbol["realPath"][i][1] > ewidth) {
                    ewidth = symbol["realPath"][i][1];
                }
                if (symbol["realPath"][i][2] > eheight) {
                    eheight = symbol["realPath"][i][2];
                }
            }
        }
    } else {
        var ignore = true;
    }
    if (!ignore) {
        if ($("#nsimFlowDetStep" + tstep).length > 0) {
            $("#nsimFlowDetStep" + tstep).remove();
        } else {
            if (evt["path"] == undefined) {
                // FIREFOX
                var svg = $(evt["target"]);
                if ($(svg).is("path")) {
                } else {
                    svg = $(svg).parent().prev();
                }
            } else {
                if ($(evt["path"][1]).is("svg")) {
                    var svg = $(evt["path"][1]);
                } else {
                    var svg = $(evt["path"][2]);
                }
            }

            var svgd = {"w": $(svg).attr("width"), "h": $(svg).attr("height")};
            var svgi = $(svg).parent().index();

            var npct = svgd["w"] / poecFlowInitSizes[svgi]["w"];
            npct = 1;

            var addclass = "";
            if (svgd["w"] != poecFlowInitSizes[svgi]["w"]) {
                addclass = " noline";
            }

            var dtop = (epos.top + (eheight / 2) - 1) * npct;
            var dleft = (epos.left + ewidth) * npct;

            var sconf = simulator_config[tstep - 1];

            var dHTML = "";
            dHTML += "<div class='content'>";

            var is_plural = false;
            if (sconf["autopass"] == false) {
                if (sconf["actions"]["fail"] == "loop") {
                    is_plural = true;
                }
            }
            dHTML += poec_affParseName(poec_nsimGetStepConditions(sconf, is_plural, "flowdet"));

            dHTML += "</div>";

            if ($("#poecSimFlowEditing").mcuiCheck().getVal()) {
                var winroutename = applyLang("Win routing");
                if (sconf["autopass"]) {
                    winroutename = applyLang("Next routing")
                }

                dHTML += "<div class='options'>";
                dHTML += "<div><div class='label win'>" + winroutename + "</div><div id='flowRouteWin' class='mcui-radio' tstep='" + tstep + "' ttype='w'>";
                dHTML += poec_getFlowRoutingChoices(simulator_flow["layout"][tstep - 1]["w"]);
                dHTML += "</div></div>";
                if (!sconf["autopass"]) {
                    if (sconf["actions"]["fail"] != "loop") {
                        dHTML += "<div><div class='label fail'>" + applyLang("Fail routing") + "</div><div id='flowRouteFail' class='mcui-radio' tstep='" + tstep + "' ttype='f'>";
                        dHTML += poec_getFlowRoutingChoices(simulator_flow["layout"][tstep - 1]["f"]);
                        dHTML += "</div></div>";
                    }
                }
                dHTML += "</div>";
            }

            $("<div>").attr({"id": "nsimFlowDetStep" + tstep}).addClass("nsim_flowdet med_shadow " + opts["params"]["detc"] + addclass).css({
                "top": dtop,
                "left": dleft
            }).html(dHTML).appendTo($("body"));

            if ($("#poecSimFlowEditing").mcuiCheck().getVal()) {
                $("#nsimFlowDetStep" + tstep).find(".mcui-radio").mcuiRadio({
                    change: function (val, elem) {
                        var tstep = $(elem).attr("tstep");
                        var ttype = $(elem).attr("ttype");
                        simulator_flow["layout"][tstep - 1][ttype] = val;
                        poec_simInitFlowchartGO();
                    }
                });
            }

            var dheight = $("#nsimFlowDetStep" + tstep).height();
            $("#nsimFlowDetStep" + tstep).css({"margin-top": 0 - (dheight / 2)});
        }
    }
}

function poec_getFlowRoutingChoices(val) {
    var choices = [
        {"name": applyLang("Auto"), "val": "a"},
        {"name": applyLang("Left"), "val": "l"},
        {"name": applyLang("Top"), "val": "t"},
        {"name": applyLang("Right"), "val": "r"},
        {"name": applyLang("Bottom"), "val": "b"}
    ];
    var dHTML = "";
    for (var i = 0; i < choices.length; i++) {
        if (val == choices[i]["val"]) {
            var sel = " selected";
        } else {
            var sel = "";
        }
        dHTML += "<div class='choice" + sel + "'>" + choices[i]["name"] + "<div class='value'>" + choices[i]["val"] + "</div></div>";
    }
    return dHTML;
}

function poec_flowGoToPart(partn) {
    $(window).scrollTop($("#poecFlowDiagram" + (partn - 1)).offset().top);
}