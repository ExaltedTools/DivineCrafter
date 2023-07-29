/*
If gear slot is selected : show typical item loadout for gear slot (pick X most common bases if no base is selected, if selected show only selected base, use most popular bitem)
raw stats on hover show slot/base/item distribution
copy loadouts to POB
load poec_affinities.json dynamically when the tag is engaged with
check to handle flasks properly
integrate beastcrafting affixes
when you select a unique item in the item selector, have the selections be limited to those that have the unique
integrate jewels/cluster jewels if possible
change crafted affix in crawl to be seperated because its possible, list crafted affix seperatly in raw stats
pick order for picks should be regardless of affix type
tradesite functionnality
*/

var poec_lastladdercrawl = "2023-05-01 11:0:00 EST (Crucible Softcore)";

var poeaf_options = {
    "asc": null,
    "bas": null,
    "bit": null,
    "crafted": 1,
    "droponly": 1,
    "essences": 1,
    "influences": 1,
    "mgrouped": 0,
    "modrarity": 1,
    "omode": "m",
    "skl": null,
    "slt": null,
    "suniques": 1,
    "archs": 0,
    "archk": 0,
    "mtbt": 0
};
var poeaf_constants = {
    "tresh": 1,
    "mtresh": 0.005,
    "crafted_mgrp": 11,
    "essence_mgrp": 13,
    "droponly_mgrps": "|9|10|12|",
    "dopick_mgrps": "|9|10|12|13|",
    "influence_mgrps": "|2|3|4|5|6|7|",
    "childs_mgrps": "|9|11|12|13|",
    "mtbt_excludes": "|10|11|12|22|18|21|27|36|37|",
    "undesirables": "|#% increased Stun and Block Recovery|",
    "noskillid": "|1342|1311|1202|1589|1215|1185|1238|1276|1288|1223|1253|1179|1257|1314|1355|1364|1216|1590|1181|1296|1233|1186|1582|1239|1243|1203|1293|1295|1177|1339|1348|1266|1221|1320|1381|1204|1346|1206|1572|1345|1258|1189|1340|1378|1585|",
    "ignores": "|2964|",
    "pexcepts": "|1735|",
    "disclaimer": "The results shown below are based on a merge of multiple league softcore top 15000 players ladder and as such represent what the top players are using. As such some builds may be lacking data to compare so take these results accordingly. Ladder data is best relevant when in the middle of a league. Usually i will merge the last two datasets together for more quantity. The last ladder crawl was executed : ",
    "experimental": "This section is in its experimental and testing phase and may change unexpectedly.",
    "raw_data": "These represent the number of times individual stat lines appeared on items on the ladder for the current selection. It is from this data that modifier power is computed."
};

function poec_initAffinities() {
    if ($("#poecAffinities").length == 0) {
        vHTML = "<div id='poecAffOptions' class='justload'>";
        vHTML += "<div id='poecAppLoading' class='poec_loading_msg'>" + applyLang("Loading Affinities data...") + "</div>";
        vHTML += "</div>";

        $("<div>").attr("id", "poecAffinities").html(vHTML).appendTo($("#poecAffinitiesZone"));

        setTimeout(function () {
            poec_affInitLoad();
        }, 1);
    }
}

function poec_affInitLoad() {
    if (poec_affsl) {
        var cntaf = 0;
        var tmpaffsl = jQuery.parseJSON(poec_affsl);
        $.each(poeaf_options, function (key, val) {
            poeaf_options[key] = tmpaffsl[cntaf];
            cntaf++;
        });
    }

    /*
    console.log(poeaf);
    console.log(poeexd);
    */

    // Build Affinities Interface
    vHTML = "";

    vHTML += "<div id='poecAffOptions' class='aff'>";
    //vHTML+="<div class='gen_msg medium' style='margin:0px 30px 10px 0px;'>"+poeaf_constants["experimental"]+"</div>";
    vHTML += "<div class='gen_msg lowkey medium' style='margin:0px 30px 30px 0px;'>" + poeaf_constants["disclaimer"] + "<span class='highlight'>" + poec_lastladdercrawl + "</span></div>";
    vHTML += "<div id='poecAffFilterHolder'>";
    vHTML += "<div id='poecAffFilter' class='poec_search_input'><input type='text' id='poecAffFilterInput' class='init left' value='" + applyLang("Filter Selectors") + "'/><div class='clear' onClick='poec_clearSearchFilter()'><div>X</div></div></div>";
    if (poeaf_options["omode"] == "m") {
        var s1 = "selected";
        var s2 = "";
    } else {
        var s1 = "";
        var s2 = "selected";
    }
    vHTML += '<div class="poec_affopt"><div class="mcui-radio med_shadow" id="poecAffOutMode"><div class="choice ' + s1 + '">' + applyLang("Modifiers") + '<div class="value">m</div></div><div class="choice ' + s2 + '">' + applyLang("Raw stats") + '<div class="value">s</div></div></div></div>';
    vHTML += '<div class="poec_affopt tgmode m_m"><div class="mcui-checkbox ' + poec_affGetIniCheck(poeaf_options["mgrouped"]) + ' med_shadow" id="poecAffGroupedCheck">' + applyLang("Grouped") + '</div></div>';
    vHTML += '<div class="poec_affopt tgmode m_m"><div class="mcui-checkbox ' + poec_affGetIniCheck(poeaf_options["crafted"]) + ' med_shadow" id="poecAffCraftedCheck">' + applyLang("Crafted") + '</div></div>';
    vHTML += '<div class="poec_affopt tgmode m_m"><div class="mcui-checkbox ' + poec_affGetIniCheck(poeaf_options["droponly"]) + ' med_shadow" id="poecAffDropOnlyCheck">' + applyLang("Drop Only") + '</div></div>';
    vHTML += '<div class="poec_affopt tgmode m_m"><div class="mcui-checkbox ' + poec_affGetIniCheck(poeaf_options["essences"]) + ' med_shadow" id="poecAffEssencesCheck">' + applyLang("Essences") + '</div></div>';
    vHTML += '<div class="poec_affopt tgmode m_m"><div class="mcui-checkbox ' + poec_affGetIniCheck(poeaf_options["influences"]) + ' med_shadow" id="poecAffInfluencesCheck">' + applyLang("Influences") + '</div></div>';
    vHTML += '<div class="poec_affopt tgmode m_m"><div class="mcui-checkbox ' + poec_affGetIniCheck(poeaf_options["modrarity"]) + ' med_shadow" id="poecAffRarityModCheck">' + applyLang("Modulate") + '</div></div>';
    vHTML += '<div class="poec_affopt"><div class="mcui-checkbox ' + poec_affGetIniCheck(poeaf_options["suniques"]) + ' med_shadow" id="poecAffUniquesCheck">' + applyLang("Uniques") + '</div></div>';
    vHTML += "</div>";

    var addcls = {};
    $.each(poeaf["oindex"]["ascls"], function (ekey, erecs) {
        addcls[ekey] = "";
        $.each(erecs, function (eekey, ebool) {
            addcls[ekey] += " sk" + eekey;
        });
    });

    vHTML += poec_affBuildMSelector(poeexd["classes"]["seq"], "id_pclass", "name_class", "poecAffMSClass", applyLang("Ascendency"), true, addcls, false, poeaf_options["asc"], "affinities");

    var addcls = {};
    $.each(poeaf["oindex"]["skill"], function (ekey, erecs) {
        addcls[ekey] = "";
        $.each(erecs, function (eekey, ebool) {
            addcls[ekey] += " ac" + eekey;
        });
    });

    vHTML += poec_affBuildMSelector(poeexd["gems"]["seq"], "id_gem", "name_gem", "poecAffMSSkill", applyLang("Skill gem"), false, addcls, true, poeaf_options["skl"], "affinities");

    var strvalidbases = "|";
    var tarrSIndex = {};
    for (var i = 0; i < poeexd["slots"]["seq"].length; i++) {
        for (var j = 0; j < poeexd["slots"]["seq"][i]["bases"].length; j++) {
            strvalidbases += poeexd["slots"]["seq"][i]["bases"][j] + "|";
            tarrSIndex[poeexd["slots"]["seq"][i]["bases"][j]] = poeexd["slots"]["seq"][i]["id"]
        }
    }

    vHTML += poec_affBuildMSelector(poeexd["slots"]["seq"], "id", "name", "poecAffMSSlot", applyLang("Gear slot"), false, null, false, poeaf_options["slt"], "affinities");

    var tarrBases = [];
    var addcls = {};
    for (var i = 0; i < poecd["bases"]["seq"].length; i++) {
        if (strvalidbases.indexOf("|" + poecd["bases"]["seq"][i]["id_base"] + "|") > -1) {
            tarrBases.push({"id": poecd["bases"]["seq"][i]["id_base"], "name": poecd["bases"]["seq"][i]["name_base"]});
            addcls[poecd["bases"]["seq"][i]["id_base"]] = "sl" + tarrSIndex[poecd["bases"]["seq"][i]["id_base"]];
        }
    }

    vHTML += poec_affBuildMSelector(tarrBases, "id", "name", "poecAffMSBase", applyLang("Item base"), false, addcls, false, poeaf_options["bas"], "affinities");

    var tarrBitems = [];
    var addcls = {};
    for (var i = 0; i < poeaf["iindex"].length; i++) {
        tarrBitems.push({
            "id": poeaf["iindex"][i],
            "name": poecd["bitems"]["seq"][poecd["bitems"]["ind"][poeaf["iindex"][i]]]["name_bitem"]
        });
        addcls[poeaf["iindex"][i]] = "bs" + poecd["bitems"]["seq"][poecd["bitems"]["ind"][poeaf["iindex"][i]]]["id_base"];
    }
    for (var i = 0; i < poeexd["uniques"]["seq"].length; i++) {
        tarrBitems.push({"id": "u" + poeexd["uniques"]["seq"][i]["id"], "name": poeexd["uniques"]["seq"][i]["uname"]});
        addcls["u" + poeexd["uniques"]["seq"][i]["id"]] = "bs" + poeexd["uniques"]["seq"][i]["id_base"] + " unique";
    }
    tarrBitems.push({"id": "rares", "name": applyLang("Non-uniques")});
    addcls["rares"] = "rares";
    tarrBitems.sort(sortColByNAME);

    vHTML += poec_affBuildMSelector(tarrBitems, "id", "name", "poecAffMSItem", applyLang("Item"), false, addcls, false, poeaf_options["bit"], "affinities");

    var tarrAnoints = [];
    var addcls = {};
    for (var i = 0; i < poeexd["anoints"].length; i++) {
        tarrAnoints.push({"id": poec_parseClassName(poeexd["anoints"][i]), "name": poeexd["anoints"][i]});
    }
    vHTML += poec_affBuildMSelector(tarrAnoints, "id", "name", "poecAffMSAnoint", applyLang("Anoint"), false, addcls, false, null, "affinities");

    vHTML += '<div id="poecAffArchOptions">';

    vHTML += '<div class="poec_affopt" id="poecAffArchSupport_holder"><label>Archetype Supports</label><div class="mcui-radio med_shadow" id="poecAffArchSupport">';
    if (poeaf_options["archs"] == 0) {
        var addsel = " selected";
    } else {
        var addsel = "";
    }
    vHTML += '<div class="choice none ' + addsel + '">None<div class="value">0</div></div>';
    $.each(poeexd["supports"], function (key, val) {
        if (poeaf_options["archs"] == val) {
            var addsel = " selected";
        } else {
            var addsel = "";
        }
        vHTML += '<div class="choice val_' + val + ' ' + addsel + '" name="' + key.replace(" Support", "") + '">' + key.replace(" Support", "") + '<div class="value">' + val + '</div></div>';
    });
    vHTML += '</div></div>';

    vHTML += '<div class="poec_affopt" id="poecAffArchKeystone_holder"><label>Archetype Keystones</label><div class="mcui-radio med_shadow" id="poecAffArchKeystone">';
    if (poeaf_options["archk"] == 0) {
        var addsel = " selected";
    } else {
        var addsel = "";
    }
    vHTML += '<div class="choice none ' + addsel + '">None<div class="value">0</div></div>';
    $.each(poeexd["keystones"], function (key, val) {
        if (poeaf_options["archk"] == val) {
            var addsel = " selected";
        } else {
            var addsel = "";
        }
        vHTML += '<div class="choice val_' + val + ' ' + addsel + '" name="' + key + '">' + key + '<div class="value">' + val + '</div></div>';
    });
    vHTML += '</div></div>';

    vHTML += '<div class="poec_affopt" id="poecAffMtypeChooser_holder"><label>Tag affinities</label><div class="mcui-radio med_shadow" id="poecAffMtypeChooser">';
    if (poeaf_options["mtbt"] == 0) {
        var addsel = " selected";
    } else {
        var addsel = "";
    }
    vHTML += '<div class="choice all ' + addsel + '">All<div class="value">0</div></div>';
    if (poeaf_options["mtbt"] == "offence") {
        var addsel = " selected";
    } else {
        var addsel = "";
    }
    vHTML += '<div class="choice offence ' + addsel + '">Offence<div class="value">offence</div></div>';
    if (poeaf_options["mtbt"] == "defence") {
        var addsel = " selected";
    } else {
        var addsel = "";
    }
    vHTML += '<div class="choice defence ' + addsel + '">Defence<div class="value">defence</div></div>';
    if (poeaf_options["mtbt"] == "other") {
        var addsel = " selected";
    } else {
        var addsel = "";
    }
    vHTML += '<div class="choice other ' + addsel + '">Utility<div class="value">other</div></div>';
    vHTML += '</div></div>';

    vHTML += "<div id='poecAffTradeLink' onClick='poec_affTradeWindow()'><div>Setup a trade search</div></div>";
    vHTML += "<div id='poecAffNinjaLink'><a href='https://poe.ninja' target='_blank'><img src='images/manual/pnbtn.png' class='idle'><img src='images/manual/pnbtno.png' class='over'></a></div>";

    vHTML += '</div>';

    vHTML += "</div>";

    vHTML += "<div id='poecAffRZone'>";
    vHTML += "</div>";

    vHTML += "<div id='poecAffItem' class='med_shadow'></div>";

    $("#poecAffinities").html(vHTML);

    poec_initAffPowerLevels();
    poec_initAffSearchFilter();
    $("#poecAffOptions.aff").find(".mcui-checkbox").mcuiCheck({
        "change": function () {
            poec_affSetOptions(false);
        }
    });
    $("#poecAffOptions.aff").find(".mcui-radio").mcuiRadio({
        "change": function () {
            poec_affSetOptions(false);
        }
    });
    poec_affSetOptions(true);
    poec_affMSUpdActive(true);

    if (poec_apptoaff != null) {
        poec_affForceSelect(poec_apptoaff);
        poec_apptoaff = null;
    }
}

function poec_parseClassName(name) {
    return name.replace(/[^a-z0-9]/gi, '');
}

function poec_affGetIniCheck(val) {
    if (val == 1) {
        return "ischecked";
    } else {
        return "unchecked";
    }
}

function poec_initAffPowerLevels() {
    poec_initAffPowerLevel("slot");
    poec_initAffPowerLevel("base");
    poec_initAffPowerLevel("all");
}

function poec_initAffPowerLevel(ptype) {
    switch (ptype) {
        case 'all' :
            $.each(poeaf["affind"][ptype], function (ukey, mods) {
                if (mods) {
                    for (var i = 0; i < mods.length; i++) {
                        if (poecd["tiers"][mods[i]["i"]] != undefined) {
                            poeaf["affind"][ptype][ukey][i]["mp"] = [-1];
                            $.each(poecd["tiers"][mods[i]["i"]], function (bkey, tiers) {
                                var tpow = poec_affGetMaxPower(tiers, 1);
                                if (tpow[0] > poeaf["affind"][ptype][ukey][i]["mp"][0]) {
                                    poeaf["affind"][ptype][ukey][i]["mp"] = tpow;
                                }
                            });
                            poeaf["affind"][ptype][ukey][i]["mp"] = poec_affCrunchMaxPower(poeaf["affind"][ptype][ukey][i]["mp"], mods[i]);
                            poeaf["affind"][ptype][ukey][i]["gcn"] = poec_affGetCrunchName(mods[i]);
                        }
                    }
                }
            });
            break;
        case 'base' :
            $.each(poeaf["affind"][ptype], function (key, urecs) {
                $.each(urecs, function (ukey, mods) {
                    if (mods) {
                        for (var i = 0; i < mods.length; i++) {
                            if (poecd["tiers"][mods[i]["i"]] != undefined) {
                                poeaf["affind"][ptype][key][ukey][i]["mp"] = poec_affGetMaxPower(poecd["tiers"][mods[i]["i"]][key], 1);
                                poeaf["affind"][ptype][key][ukey][i]["mp"] = poec_affCrunchMaxPower(poeaf["affind"][ptype][key][ukey][i]["mp"], mods[i]);
                                poeaf["affind"][ptype][key][ukey][i]["gcn"] = poec_affGetCrunchName(mods[i]);
                            }
                        }
                    }
                });
            });
            break;
        case 'slot' :
            $.each(poeaf["affind"][ptype], function (key, urecs) {
                var sbases = poeexd["slots"]["seq"][poeexd["slots"]["ind"][key]]["bases"];
                $.each(urecs, function (ukey, mods) {
                    if (mods) {
                        for (var i = 0; i < mods.length; i++) {
                            poeaf["affind"][ptype][key][ukey][i]["mp"] = [-1];
                            for (var j = 0; j < sbases.length; j++) {
                                if (poecd["tiers"][mods[i]["i"]] != undefined) {
                                    if (poecd["tiers"][mods[i]["i"]][sbases[j]]) {
                                        var tpow = poec_affGetMaxPower(poecd["tiers"][mods[i]["i"]][sbases[j]], 1);
                                        if (tpow[0] > poeaf["affind"][ptype][key][ukey][i]["mp"][0]) {
                                            poeaf["affind"][ptype][key][ukey][i]["mp"] = tpow;
                                        }
                                    }
                                }
                            }
                            poeaf["affind"][ptype][key][ukey][i]["mp"] = poec_affCrunchMaxPower(poeaf["affind"][ptype][key][ukey][i]["mp"], mods[i]);
                            poeaf["affind"][ptype][key][ukey][i]["gcn"] = poec_affGetCrunchName(mods[i]);
                        }
                    }
                });
            });
            break;
    }
}

function poec_affGetCrunchName(mod) {
    if (poecl["mod"][mod["i"]] != undefined) {
        if (mod["t"] == "e") {
            return poecl["mod"][mod["i"]];
        } else {
            var mterm = poecl["mod"][mod["i"]];
            mterm = mterm.split(", ");
            return mterm[mod["m"]];
        }
    } else {
        return "[DEAD_MOD]";
    }
}

function poec_affGetMaxPower(tiers, minmax) {
    if (tiers != undefined) {
        if (tiers[tiers.length - 1]["nvalues"].length > 2) {
            if (minmax == 1) {
                var uind = tiers.length - 1;
            } else {
                var uind = 0;
            }
            var jdec = jQuery.parseJSON(tiers[uind]["nvalues"]);
            var retarr = [];
            for (var i = 0; i < jdec.length; i++) {
                if (Array.isArray(jdec[i])) {
                    retarr.push(jdec[i][minmax]);
                } else {
                    retarr.push(jdec[i]);
                }
            }
            return retarr;
        } else {
            return [0];
        }
    } else {
        return [0];
    }
}

function poec_affCrunchMaxPower(mp, mod) {
    var nmp = 0;
    if (mod["t"] == "e") {
        for (var i = 0; i < mp.length; i++) {
            nmp += mp[i];
        }
        nmp = Math.round(nmp / mp.length);
    } else {
        if (poecl["mod"][mod["i"]] != undefined) {
            var mterm = poecl["mod"][mod["i"]];
            mterm = mterm.split(", ");
            var tnmp = [];
            var cpnt = 0;
            for (var i = 0; i < mterm.length; i++) {
                var tsplit = mterm[i].split("#");
                var tval = 0;
                for (var j = cpnt; j < cpnt + tsplit.length - 1; j++) {
                    tval += mp[j];
                }
                tval = Math.round(tval / (tsplit.length - 1));
                cpnt += tsplit.length - 1;
                tnmp.push(tval);
            }
            nmp = tnmp[mod["m"]];
        }
    }
    return nmp;
}

function poec_initAffSearchFilter() {
    $("#poecAffFilterInput").mcuiText();
    $("#poecAffFilterInput").keyup(function () {
        poec_affSearchFilterGO();
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

function poec_affSetOptions(init) {
    poeaf_options["crafted"] = $("#poecAffCraftedCheck").mcuiCheck().getVal();
    poeaf_options["droponly"] = $("#poecAffDropOnlyCheck").mcuiCheck().getVal();
    poeaf_options["essences"] = $("#poecAffEssencesCheck").mcuiCheck().getVal();
    poeaf_options["influences"] = $("#poecAffInfluencesCheck").mcuiCheck().getVal();
    poeaf_options["modrarity"] = $("#poecAffRarityModCheck").mcuiCheck().getVal();
    poeaf_options["mgrouped"] = $("#poecAffGroupedCheck").mcuiCheck().getVal();
    poeaf_options["suniques"] = $("#poecAffUniquesCheck").mcuiCheck().getVal();
    if (poeaf_options["suniques"] == 1) {
        $("#poecAffMSItem").removeClass("hide_uniques");
    } else {
        $("#poecAffMSItem").addClass("hide_uniques");
        $("#poecAffMSItem").find(".unique.selected").removeClass("selected");
    }
    poeaf_options["omode"] = $("#poecAffOutMode").mcuiRadio().getVal();
    $("#poecAffOptions.aff").find(".tgmode").hide();
    $("#poecAffOptions.aff").find(".tgmode.m_" + poeaf_options["omode"]).show();
    if (!init) {
        poec_affUpdateResult();
        poec_affUpdShareLink();
    }
}

function poec_clearSearchFilter() {
    $("#poecAffFilterInput").addClass("init").val($("#poecAffFilterInput").attr("initerm"));
    $("#poecAffFilterInput").parent().removeClass("active");
    $("#poecAffOptions.aff").find(".poec_mselector").find(".opt").removeClass("hidden");
}

function poec_affSearchFilterGO() {
    $("#poecAffOptions.aff").find(".poec_mselector").find(".opt").removeClass("hidden");
    if (!$("#poecAffFilterInput").hasClass("init")) {
        var sval = $("#poecAffFilterInput").val().trim().toUpperCase();
        if (sval.length > 2) {
            $("#poecAffOptions.aff").find(".poec_mselector").find(".opt").each(function () {
                var ttext = $(this).text().toUpperCase();
                if (ttext.indexOf(sval) > -1) {
                } else {
                    $(this).addClass("hidden");
                }
            });
        }
    }
}

function poec_affBuildMSelector(source, idf, namef, sid, title, multi, addcls, invalide, selected, ct) {
    var vHTML = "<div id='" + sid + "' class='poec_mselector multi_" + multi + "'><div class='wrap med_shadow'><div class='title'>" + title + "</div><div class='sel'></div><div class='opts'><div class='holder'>";
    var cursel = "|";
    if (ct == "recipees") {
        var onclick = "poec_recMSOptChoose";
    } else {
        var onclick = "poec_affMSOptChoose";
    }
    var fonclick = "onClick='" + onclick + "(this)'";
    if (sid == "poecAffMSAnoint") {
        fonclick = "";
    }
    if (selected) {
        if (Array.isArray(selected)) {
            for (var i = 0; i < selected.length; i++) {
                cursel += selected[i] + "|";
            }
        } else {
            cursel += selected + "|";
        }
    }
    for (var i = 0; i < source.length; i++) {
        var acls = "";
        var valid = true;
        if (addcls) {
            if (addcls[source[i][idf]]) {
                var acls = addcls[source[i][idf]];
            }
        }
        if (invalide && acls == "") {
            valid = false;
        }
        if (valid) {
            if (cursel.indexOf("|" + source[i][idf] + "|") > -1) {
                var sel = " selected";
            } else {
                var sel = "";
            }
            vHTML += "<div class='opt " + acls + sel + " opt" + source[i][idf] + "' oval='" + source[i][idf] + "' " + fonclick + "><div class='text'>" + source[i][namef] + "</div><div class='rem'><div></div></div><div class='pct'><div></div></div><div class='bar'></div></div>";
        }
    }
    vHTML += "</div></div></div></div>";
    return vHTML;
}

function poec_affMSOptChoose(vThis) {
    var valid = true;
    if ($(vThis).attr("oval") == "rares" || $(vThis).hasClass("unique")) {
        valid = false;
    }
    if (valid) {
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
        poec_affMSUpdActive(false);
    }
    poec_affUpdShareLink();
}

function poec_affResetMS(vThis) {
    $(vThis).find(".opt.selected").removeClass("selected");
}

function poec_affMSGetVal(vThis) {
    if ($(vThis).hasClass("multi_true")) {
        var arrVals = [];
        $(vThis).find(".opt.selected").each(function () {
            arrVals.push($(this).attr("oval"));
        });
        if (arrVals.length == 0) {
            return null;
        } else {
            return arrVals;
        }
    } else {
        if ($(vThis).find(".opt.selected").length == 0) {
            return null;
        } else {
            return $(vThis).find(".opt.selected").attr("oval");
        }
    }
}

function poec_affMSUpdActive(init) {
    var asc = poec_affMSGetVal($("#poecAffMSClass"));
    var skl = poec_affMSGetVal($("#poecAffMSSkill"));
    var slt = poec_affMSGetVal($("#poecAffMSSlot"));
    var bas = poec_affMSGetVal($("#poecAffMSBase"));

    $("#poecAffMSSkill").find(".opt").removeClass("active");
    $("#poecAffMSSkill").removeClass("active");
    if (asc) {
        bsearch = "";
        for (var i = 0; i < asc.length; i++) {
            bsearch += ",.ac" + asc[i];
        }
        bsearch = bsearch.substring(1, bsearch.length);
        $("#poecAffMSSkill").find(".opts").find(bsearch).addClass("active");
        $("#poecAffMSSkill").addClass("active");
    }

    $("#poecAffMSClass").find(".opt").removeClass("active");
    $("#poecAffMSClass").removeClass("active");
    if (skl) {
        $("#poecAffMSClass").find(".opts").find(".sk" + skl).addClass("active");
        $("#poecAffMSClass").addClass("active");
    }

    $("#poecAffMSBase").find(".opt").removeClass("active");
    $("#poecAffMSBase").removeClass("active");
    if (slt) {
        $("#poecAffMSBase").find(".opts").find(".sl" + slt).addClass("active");
        $("#poecAffMSBase").addClass("active");
        $("#poecAffMSBase").find(".opt.selected:not(.active)").removeClass("selected");
    }

    $("#poecAffMSItem").find(".opt").removeClass("active");
    $("#poecAffMSItem").removeClass("active");
    if (bas || slt) {
        if (bas) {
            var jfind = ".bs" + bas + ", .rares";
        } else {
            var jfind = "";
            $("#poecAffMSBase").find(".opt.active").each(function () {
                jfind += ", .bs" + $(this).attr("oval");
            });
            jfind = jfind.substring(2, jfind.length) + ", .rares";
        }
        $("#poecAffMSItem").find(".opts").find(jfind).addClass("active");
        $("#poecAffMSItem").addClass("active");
        $("#poecAffMSItem").find(".opt.selected:not(.active)").removeClass("selected");
    }

    poec_affUpdateResult();
}

function poec_affUpdShareLink() {
    var asc = poec_affMSGetVal($("#poecAffMSClass"));
    var skl = poec_affMSGetVal($("#poecAffMSSkill"));
    var slt = poec_affMSGetVal($("#poecAffMSSlot"));
    var bas = poec_affMSGetVal($("#poecAffMSBase"));
    var bit = poec_affMSGetVal($("#poecAffMSItem"));
    poeaf_options["asc"] = asc;
    poeaf_options["skl"] = skl;
    poeaf_options["slt"] = slt;
    poeaf_options["bas"] = bas;
    poeaf_options["bit"] = bit;
    poeaf_options["archs"] = $("#poecAffArchSupport").mcuiRadio().getVal();
    poeaf_options["archk"] = $("#poecAffArchKeystone").mcuiRadio().getVal();
    poeaf_options["mtbt"] = $("#poecAffMtypeChooser").mcuiRadio().getVal();
    poec_affsl = null;
    if (poeaf_options["asc"] || poeaf_options["skl"] || poeaf_options["slt"] || poeaf_options["bas"] || poeaf_options["bit"] || poeaf_options["archs"] || poeaf_options["archk"] || poeaf_options["mtbt"]) {
        var basl = [];
        $.each(poeaf_options, function (key, val) {
            basl.push(val);
        });
        basl = JSON.stringify(basl);
        poec_affsl = basl;
    }
    poec_buildShareLink(true);
}

function poec_affForceSelect(fparam) {
    poec_affResetMS($("#poecAffMSClass"));
    poec_affResetMS($("#poecAffMSSkill"));
    poec_affResetMS($("#poecAffMSSlot"));
    poec_affResetMS($("#poecAffMSBase"));
    poec_affResetMS($("#poecAffMSItem"));
    $("#poecAffArchSupport").mcuiRadio().setVal(0);
    $("#poecAffArchKeystone").mcuiRadio().getVal(0);

    if (fparam["asc"]) {
        $("#poecAffMSClass").find(".opt" + fparam["asc"]).addClass("selected");
    }

    if (fparam["skl"]) {
        $("#poecAffMSSkill").find(".opt" + fparam["skl"]).addClass("selected");
    }

    if (fparam["slot"]) {
        $("#poecAffMSSlot").find(".opt" + fparam["slot"]).addClass("selected");
    }

    poec_affUpdateResult();
}

var poec_affrtm = null;

function poec_affUpdateResult() {
    clearTimeout(poec_affrtm);
    setTimeout(function () {
        poec_affUpdateResultGO();
    }, 1);
}

var maxweights = {"prefix": 0, "suffix": 0};
var minweights = {"prefix": 99999999999999, "suffix": 99999999999999};
var wbymgrps = {"prefix": {}, "suffix": {}};
var powerlevels = {"prefix": {}, "suffix": {}, "all": {}};
var rangeweights = {"prefix": {}, "suffix": {}};
var wbyaffid = {};
var poec_affMaxNonUnique = null;
var curaffar = null;
var curraffinds = null;

function poec_affUpdateResultGO() {
    var asc = poec_affMSGetVal($("#poecAffMSClass"));
    var skl = poec_affMSGetVal($("#poecAffMSSkill"));
    var slt = poec_affMSGetVal($("#poecAffMSSlot"));
    var bas = poec_affMSGetVal($("#poecAffMSBase"));
    var bit = poec_affMSGetVal($("#poecAffMSItem"));
    var nmst = {
        "asc": null,
        "skl": null,
        "slt": null,
        "bas": null,
        "bit": null,
        "ars": null,
        "ark": null,
        "tot": null
    };
    var parr = null;
    var uarr = null;
    var aarr = null;
    var hassel = false;
    var hasbsel = false;
    var hasninja = false;
    var ninjaprm = {"class": "", "skill": "", "keystone": ""};
    if (asc) {
        hassel = true;
        hasbsel = true;
        hasninja = true;
        parr = jQuery.parseJSON(JSON.stringify(poeaf["mindex"]["ascls"][asc[0]]));
        nmst["asc"] = poeaf["mindex"]["ascls"][asc[0]].length;
        ninjaprm["class"] += "," + poeexd["classes"]["seq"][poeexd["classes"]["ind"][asc[0]]]["name_class"];
        for (var i = 1; i < asc.length; i++) {
            parr = poec_affAMergeAdd(parr, poeaf["mindex"]["ascls"][asc[i]]);
            nmst["asc"] += poeaf["mindex"]["ascls"][asc[i]].length;
            ninjaprm["class"] += "," + poeexd["classes"]["seq"][poeexd["classes"]["ind"][asc[i]]]["name_class"];
        }
        uarr = jQuery.parseJSON(JSON.stringify(poeaf["uindex"]["ascls"][asc[0]]));
        for (var i = 1; i < asc.length; i++) {
            uarr = poec_affAMergeAdd(uarr, poeaf["uindex"]["ascls"][asc[i]]);
        }
        aarr = jQuery.parseJSON(JSON.stringify(poeaf["nindex"]["ascls"][asc[0]]));
        for (var i = 1; i < asc.length; i++) {
            aarr = poec_affAMergeAdd(aarr, poeaf["nindex"]["ascls"][asc[i]]);
        }
        ninjaprm["class"] = ninjaprm["class"].substring(1, ninjaprm["class"].length);
    }
    if (skl) {
        hassel = true;
        hasbsel = true;
        hasninja = true;
        nmst["skl"] = poeaf["mindex"]["skill"][skl].length;
        ninjaprm["skill"] = poeexd["gems"]["seq"][poeexd["gems"]["ind"][skl]]["name_gem"].replace(/ /g, "-");
        if (parr == null) {
            parr = jQuery.parseJSON(JSON.stringify(poeaf["mindex"]["skill"][skl]));
        } else {
            parr = poec_affAMergeCorr(parr, poeaf["mindex"]["skill"][skl]);
        }
        if (uarr == null) {
            uarr = jQuery.parseJSON(JSON.stringify(poeaf["uindex"]["skill"][skl]));
        } else {
            uarr = poec_affAMergeCorr(uarr, poeaf["uindex"]["skill"][skl]);
        }
        if (aarr == null) {
            aarr = jQuery.parseJSON(JSON.stringify(poeaf["nindex"]["skill"][skl]));
        } else {
            aarr = poec_affAMergeCorr(aarr, poeaf["nindex"]["skill"][skl]);
        }
    }
    if (slt) {
        hassel = true;
        hasbsel = true;
        nmst["slt"] = poeaf["mindex"]["slot"][slt].length;
        if (parr == null) {
            parr = jQuery.parseJSON(JSON.stringify(poeaf["mindex"]["slot"][slt]));
        } else {
            parr = poec_affAMergeCorr(parr, poeaf["mindex"]["slot"][slt]);
        }
        if (uarr == null && poeaf["uindex"]["slot"][slt] != undefined) {
            uarr = jQuery.parseJSON(JSON.stringify(poeaf["uindex"]["slot"][slt]));
        } else {
            uarr = poec_affAMergeCorr(uarr, poeaf["uindex"]["slot"][slt]);
        }
    }
    if (bas) {
        hassel = true;
        hasbsel = true;
        nmst["bas"] = poeaf["mindex"]["base"][bas].length;
        if (parr == null) {
            parr = jQuery.parseJSON(JSON.stringify(poeaf["mindex"]["base"][bas]));
        } else {
            parr = poec_affAMergeCorr(parr, poeaf["mindex"]["base"][bas]);
        }
        if (uarr == null && poeaf["uindex"]["base"][bas] != undefined) {
            uarr = jQuery.parseJSON(JSON.stringify(poeaf["uindex"]["base"][bas]));
        } else {
            uarr = poec_affAMergeCorr(uarr, poeaf["uindex"]["base"][bas]);
        }
    }
    var kparr = jQuery.parseJSON(JSON.stringify(parr));
    var kkparr = {};
    if (kparr != null) {
        for (var i = 0; i < kparr.length; i++) {
            kkparr[kparr[i]] = true;
        }
    }

    // Check for archetypes
    $("#poecAffArchOptions").show();
    $("#poecAffArchSupport_holder").show();
    $("#poecAffArchSupport").find(".choice:not(.none)").show();
    $("#poecAffArchKeystone_holder").show();
    $("#poecAffArchKeystone").find(".choice:not(.none)").show();
    var hasarchopt = false;
    if (hasbsel) {
        $("#poecAffArchSupport").find(".choice:not(.none)").each(function () {
            var val = $(this).find(".value").html();
            var foundk = false;
            for (var i = 0; i < poeaf["rindex"][val].length; i++) {
                if (kkparr[poeaf["rindex"][val][i]] == true) {
                    foundk = true;
                    break;
                }
            }
            if (!foundk) {
                $(this).hide();
                if ($(this).hasClass("selected")) {
                    $(this).removeClass("selected");
                    $("#poecAffArchSupport").find(".choice.none").addClass("selected");
                }
            }
        });
        if ($("#poecAffArchSupport").find(".choice:not(.none):visible").length == 0) {
            $("#poecAffArchSupport_holder").hide();
        } else {
            hasarchopt = true;
        }
        $("#poecAffArchKeystone").find(".choice:not(.none)").each(function () {
            var val = $(this).find(".value").html();
            var foundk = false;
            for (var i = 0; i < poeaf["kindex"][val].length; i++) {
                if (kkparr[poeaf["kindex"][val][i]] == true) {
                    foundk = true;
                    break;
                }
            }
            if (!foundk) {
                $(this).hide();
                if ($(this).hasClass("selected")) {
                    $(this).removeClass("selected");
                    $("#poecAffArchKeystone").find(".choice.none").addClass("selected");
                }
            }
        });
        if ($("#poecAffArchKeystone").find(".choice:not(.none):visible").length == 0) {
            $("#poecAffArchKeystone_holder").hide();
        } else {
            hasarchopt = true;
        }
    } else {
        hasarchopt = true;
    }
    if (!hasarchopt && !hasninja) {
        $("#poecAffArchOptions").hide();
    }
    var archs = $("#poecAffArchSupport").mcuiRadio().getVal();
    var archk = $("#poecAffArchKeystone").mcuiRadio().getVal();
    var archsname = $("#poecAffArchSupport").find(".selected").attr("name");
    var archkname = $("#poecAffArchKeystone").find(".selected").attr("name");

    if (archs != 0) {
        hassel = true;
        nmst["ars"] = poeaf["rindex"][archs].length;
        if (parr == null) {
            parr = jQuery.parseJSON(JSON.stringify(poeaf["rindex"][archs]));
        } else {
            parr = poec_affAMergeCorr(parr, poeaf["rindex"][archs]);
        }
    }
    if (archk != 0) {
        hassel = true;
        nmst["ark"] = poeaf["kindex"][archk].length;
        ninjaprm["keystone"] = $("#poecAffArchKeystone").find(".selected").attr("name").replace(/ /g, "-");
        if (parr == null) {
            parr = jQuery.parseJSON(JSON.stringify(poeaf["kindex"][archk]));
        } else {
            parr = poec_affAMergeCorr(parr, poeaf["kindex"][archk]);
        }
    }

    if (bit) {
        if (bit.substring(0, 1) == "u" || bit == "rares") {
            // TODO : handle uniques selection
        } else {
            hassel = true;
            nmst["bit"] = poeaf["mindex"]["bitem"][bit].length;
            if (parr == null) {
                parr = jQuery.parseJSON(JSON.stringify(poeaf["mindex"]["bitem"][bit]));
            } else {
                parr = poec_affAMergeCorr(parr, poeaf["mindex"]["bitem"][bit]);
            }
        }
    }

    if (parr) {
        nmst["tot"] = parr.length;
    }

    if (hasninja) {
        var ninjaget = "";
        if (ninjaprm["class"] != "") {
            ninjaget += "&class=" + ninjaprm["class"];
        }
        if (ninjaprm["skill"] != "") {
            ninjaget += "&skill=" + ninjaprm["skill"];
        }
        if (ninjaprm["keystone"] != "") {
            ninjaget += "&keystone=" + ninjaprm["keystone"];
        }
        var ninjaurl = "https://poe.ninja/challenge/builds?" + ninjaget.substring(1, ninjaget.length);
        $("#poecAffNinjaLink").find("a").attr("href", ninjaurl);
        $("#poecAffNinjaLink").css({"display": "inline-block"});
    } else {
        $("#poecAffNinjaLink").hide();
    }

    if (slt) {
        if (slt == "Offhand") {
            if (!bas) {
                $("#poecAffTradeLink").hide();
            } else {
                $("#poecAffTradeLink").css({"display": "inline-block"});
            }
        } else {
            $("#poecAffTradeLink").css({"display": "inline-block"});
        }
    } else {
        $("#poecAffTradeLink").hide();
    }

    var vHTML = "";
    var output = true;
    var prevalence = {
        "asc": {},
        "skl": {},
        "bas": {},
        "bit": {}
    };
    var uprev = {
        "asc": {},
        "skl": {},
        "bas": {}
    };
    var nprev = {
        "asc": {},
        "skl": {}
    };
    var udir = {};
    var utot = 0;
    if (uarr) {
        for (var i = 0; i < uarr.length; i++) {
            if (!uprev["asc"][poeaf["undata"][uarr[i]]["c"]]) {
                uprev["asc"][poeaf["undata"][uarr[i]]["c"]] = 0;
            }
            uprev["asc"][poeaf["undata"][uarr[i]]["c"]]++;
            if (!uprev["skl"][poeaf["undata"][uarr[i]]["s"]]) {
                uprev["skl"][poeaf["undata"][uarr[i]]["s"]] = 0;
            }
            uprev["skl"][poeaf["undata"][uarr[i]]["s"]]++;
            if (!uprev["bas"][poeaf["undata"][uarr[i]]["b"]]) {
                uprev["bas"][poeaf["undata"][uarr[i]]["b"]] = 0;
            }
            uprev["bas"][poeaf["undata"][uarr[i]]["b"]]++;

            if (poeaf["undata"][uarr[i]]["u"]) {
                $.each(poeaf["undata"][uarr[i]]["u"], function (ukey, num) {
                    if (!udir[ukey]) {
                        udir[ukey] = 0;
                    }
                    udir[ukey] += num;
                    utot += num;
                });
            }
        }
    }
    var adir = {};
    var atot = 0;
    if (aarr) {
        for (var i = 0; i < aarr.length; i++) {
            if (!nprev["asc"][poeaf["andata"][aarr[i]]["c"]]) {
                nprev["asc"][poeaf["andata"][aarr[i]]["c"]] = 0;
            }
            nprev["asc"][poeaf["undata"][aarr[i]]["c"]]++;
            if (!nprev["skl"][poeaf["andata"][aarr[i]]["s"]]) {
                nprev["skl"][poeaf["andata"][aarr[i]]["s"]] = 0;
            }
            nprev["skl"][poeaf["andata"][aarr[i]]["s"]]++;

            if (poeaf["andata"][aarr[i]]["a"]) {
                $.each(poeaf["andata"][aarr[i]]["a"], function (akey, num) {
                    if (!adir[akey]) {
                        adir[akey] = 0;
                    }
                    adir[akey] += num;
                    atot += num;
                });
            }
        }
    }
    if (parr) {
        var affa = {};
        for (var i = 0; i < parr.length; i++) {
            if (!prevalence["bas"][poeaf["njdata"][parr[i]]["b"]]) {
                prevalence["bas"][poeaf["njdata"][parr[i]]["b"]] = 0;
            }
            prevalence["bas"][poeaf["njdata"][parr[i]]["b"]]++;
            if (!prevalence["asc"][poeaf["njdata"][parr[i]]["c"]]) {
                prevalence["asc"][poeaf["njdata"][parr[i]]["c"]] = 0;
            }
            prevalence["asc"][poeaf["njdata"][parr[i]]["c"]]++;
            if (!prevalence["skl"][poeaf["njdata"][parr[i]]["s"]]) {
                prevalence["skl"][poeaf["njdata"][parr[i]]["s"]] = 0;
            }
            prevalence["skl"][poeaf["njdata"][parr[i]]["s"]]++;
            if (!prevalence["bit"][poeaf["njdata"][parr[i]]["i"]]) {
                prevalence["bit"][poeaf["njdata"][parr[i]]["i"]] = 0;
            }
            prevalence["bit"][poeaf["njdata"][parr[i]]["i"]]++;
            $.each(poeaf["njdata"][parr[i]]["a"], function (mkey, num) {
                if (!affa[mkey]) {
                    affa[mkey] = 0;
                }
                affa[mkey] += num;
            });
        }
        var affar = [];
        $.each(affa, function (mkey, num) {
            affar.push({"id": mkey, "val": num});
        });
        affar.sort(sortColByVAL);
        affar.reverse();
        curaffar = affar;

        var vSTOUT = "<div id='poecAffStout'><div id='poecAffViewItem'>Item</div>";
        var ntog = 0;
        if (nmst["asc"] !== null && nmst["asc"] !== 0) {
            var vcname = "";
            for (var i = 0; i < asc.length; i++) {
                vcname += " + " + poeexd["classes"]["seq"][poeexd["classes"]["ind"][asc[i]]]["name_class"];
            }
            vSTOUT += "<div class='asc'><div>" + nmst["asc"] + "</div><div>" + vcname.substring(3, vcname.length) + "</div></div>";
            ntog++;
        }
        if (nmst["skl"] !== null && nmst["skl"] !== 0) {
            vSTOUT += "<div class='skl'><div>" + nmst["skl"] + "</div><div>" + poeexd["gems"]["seq"][poeexd["gems"]["ind"][skl]]["name_gem"] + "</div></div>";
            ntog++;
        }
        if (nmst["slt"] !== null && nmst["slt"] !== 0) {
            vSTOUT += "<div class='slt'><div>" + nmst["slt"] + "</div><div>" + poeexd["slots"]["seq"][poeexd["slots"]["ind"][slt]]["name"] + "</div></div>";
            ntog++;
        }
        if (nmst["bas"] !== null && nmst["bas"] !== 0) {
            vSTOUT += "<div class='bas'><div>" + nmst["bas"] + "</div><div>" + poecd["bases"]["seq"][poecd["bases"]["ind"][bas]]["name_base"] + "</div></div>";
            ntog++;
        }
        if (nmst["bit"] !== null && nmst["bit"] !== 0) {
            vSTOUT += "<div class='bit'><div>" + nmst["bit"] + "</div><div>" + poecd["bitems"]["seq"][poecd["bitems"]["ind"][bit]]["name_bitem"] + "</div></div>";
            ntog++;
        }
        if (nmst["ars"] !== null && nmst["ars"] !== 0) {
            vSTOUT += "<div class='ars'><div>" + nmst["ars"] + "</div><div>" + archsname + "</div></div>";
            ntog++;
        }
        if (nmst["ark"] !== null && nmst["ark"] !== 0) {
            vSTOUT += "<div class='ark'><div>" + nmst["ark"] + "</div><div>" + archkname + "</div></div>";
            ntog++;
        }
        if (ntog > 1) {
            vSTOUT += "<div class='tot'><div>" + nmst["tot"] + "</div><div>" + applyLang("Cross-entries") + "</div></div>";
            if (utot > 0) {
                vSTOUT += "<div class='uni'><div>" + utot + "</div><div>" + applyLang("Uniques") + "</div></div>";
            }
        }
        vSTOUT += "</div>";

        var affinds = null;
        var mtind = null;
        var mtypes = {};
        var mtbt = {"offence": {}, "defence": {}, "other": {}};
        if (bas) {
            // Base affixes
            affinds = poeaf["affind"]["base"][bas];
            mtind = poeaf["mtypes"]["b"][bas];
        } else {
            if (slt) {
                // Slot affixes
                affinds = poeaf["affind"]["slot"][slt];
                mtind = poeaf["mtypes"]["j"][slt];
            } else {
                // All affixes
                affinds = poeaf["affind"]["all"];
                mtind = poeaf["mtypes"]["a"];
            }
        }
        curraffinds = affinds;

        if (poeaf_options["omode"] == "m") {
            // Merge affinds to affar
            var maffar = {"prefix": [], "suffix": []};
            var maffcheck = {"prefix": [], "suffix": []};
            var tvals = {"prefix": [], "suffix": []};
            var mmgra = {"prefix": {}, "suffix": {}};
            var mmgacheck = {"prefix": {}, "suffix": {}};
            var numvalaff = 0;

            // Predata
            var pretotval = {"prefix": 0, "suffix": 0};
            for (var i = 0; i < affar.length; i++) {
                if (affinds[affar[i]["id"]]) {
                    for (var j = 0; j < affinds[affar[i]["id"]].length; j++) {
                        var valid = true;
                        if (poeaf_options["crafted"] == 0) {
                            if (idmgrp == poeaf_constants["crafted_mgrp"]) {
                                valid = false;
                            }
                        }
                        if (poeaf_options["essences"] == 0) {
                            if (idmgrp == poeaf_constants["essence_mgrp"]) {
                                valid = false;
                            }
                        }
                        if (poeaf_options["droponly"] == 0) {
                            if (poeaf_constants["droponly_mgrps"].indexOf("|" + idmgrp + "|") > -1) {
                                valid = false;
                            }
                        }
                        if (poeaf_options["influences"] == 0) {
                            if (poeaf_constants["influence_mgrps"].indexOf("|" + idmgrp + "|") > -1) {
                                valid = false;
                            }
                        }
                        if (valid) {
                            if (poecd["modifiers"]["seq"][poecd["modifiers"]["ind"][affinds[affar[i]["id"]][j]["i"]]] != undefined) {
                                var aftype = poecd["modifiers"]["seq"][poecd["modifiers"]["ind"][affinds[affar[i]["id"]][j]["i"]]]["affix"];
                                pretotval[aftype] += affar[i]["val"];
                            }
                        }
                    }
                    // Increment mtypes
                    if (mtind[affar[i]["id"]]) {
                        $.each(mtind[affar[i]["id"]], function (mtkey, mtbool) {
                            if (mtypes[mtkey] == undefined) {
                                mtypes[mtkey] = 0;
                            }
                            mtypes[mtkey] += affar[i]["val"];
                        });
                        var is_attack = false;
                        if (mtind[affar[i]["id"]][3] || mtind[affar[i]["id"]][33] || mtind[affar[i]["id"]][13] || mtind[affar[i]["id"]][29]) {
                            is_attack = true;
                            $.each(mtind[affar[i]["id"]], function (mtkey, mtbool) {
                                if (mtbt["offence"][mtkey] == undefined) {
                                    mtbt["offence"][mtkey] = 0;
                                }
                                mtbt["offence"][mtkey] += affar[i]["val"];
                            });
                        }
                        var is_defence = false;
                        if (mtind[affar[i]["id"]][4] || mtind[affar[i]["id"]][35] || (!is_attack && (mtind[affar[i]["id"]][1] || mtind[affar[i]["id"]][28]))) {
                            is_defence = true;
                            $.each(mtind[affar[i]["id"]], function (mtkey, mtbool) {
                                if (mtbt["defence"][mtkey] == undefined) {
                                    mtbt["defence"][mtkey] = 0;
                                }
                                mtbt["defence"][mtkey] += affar[i]["val"];
                            });
                        }
                        if (!is_attack && !is_defence) {
                            $.each(mtind[affar[i]["id"]], function (mtkey, mtbool) {
                                if (mtbt["other"][mtkey] == undefined) {
                                    mtbt["other"][mtkey] = 0;
                                }
                                mtbt["other"][mtkey] += affar[i]["val"];
                            });
                        }
                    }
                }
            }

            mtypes = poec_affCleanMTypes(mtypes);
            mtbt["offence"] = poec_affCleanMTypes(mtbt["offence"]);
            mtbt["defence"] = poec_affCleanMTypes(mtbt["defence"]);
            mtbt["other"] = poec_affCleanMTypes(mtbt["other"]);

            // Get modulate data
            maxweights = {"prefix": 0, "suffix": 0};
            minweights = {"prefix": 99999999999999, "suffix": 99999999999999};
            wbymgrps = {"prefix": {}, "suffix": {}};
            wbyaffid = {};
            powerlevels = {"prefix": {}, "suffix": {}, "all": {}};
            for (var i = 0; i < affar.length; i++) {
                if (affinds[affar[i]["id"]]) {
                    for (var j = 0; j < affinds[affar[i]["id"]].length; j++) {
                        if (poecd["modifiers"]["seq"][poecd["modifiers"]["ind"][affinds[affar[i]["id"]][j]["i"]]] != undefined) {
                            var idmgrp = poecd["modifiers"]["seq"][poecd["modifiers"]["ind"][affinds[affar[i]["id"]][j]["i"]]]["id_mgroup"];
                            var aftype = poecd["modifiers"]["seq"][poecd["modifiers"]["ind"][affinds[affar[i]["id"]][j]["i"]]]["affix"];
                            var valid = true;
                            if (poeaf_options["crafted"] == 0) {
                                if (idmgrp == poeaf_constants["crafted_mgrp"]) {
                                    valid = false;
                                }
                            }
                            if (poeaf_options["essences"] == 0) {
                                if (idmgrp == poeaf_constants["essence_mgrp"]) {
                                    valid = false;
                                }
                            }
                            if (poeaf_options["droponly"] == 0) {
                                if (poeaf_constants["droponly_mgrps"].indexOf("|" + idmgrp + "|") > -1) {
                                    valid = false;
                                }
                            }
                            if (poeaf_options["influences"] == 0) {
                                if (poeaf_constants["influence_mgrps"].indexOf("|" + idmgrp + "|") > -1) {
                                    valid = false;
                                }
                            }
                            if (affar[i]["val"] / pretotval[aftype] < poeaf_constants["mtresh"]) {
                                valid = false;
                            }
                            if (valid) {
                                var modgroup = poecd["modifiers"]["seq"][poecd["modifiers"]["ind"][affinds[affar[i]["id"]][j]["i"]]]["modgroups"];
                                var mname = poecl["mod"][affinds[affar[i]["id"]][j]["i"]];
                                for (var zy = 0; zy < modgroup.length; zy++) {
                                    if (!wbymgrps[aftype][modgroup[zy]]) {
                                        wbymgrps[aftype][modgroup[zy]] = 0;
                                    }
                                }
                                var tweight = parseInt(affinds[affar[i]["id"]][j]["w"]);
                                for (var zy = 0; zy < modgroup.length; zy++) {
                                    wbymgrps[aftype][modgroup[zy]] += tweight;
                                }
                                wbyaffid[affinds[affar[i]["id"]][j]["i"]] = tweight;
                                if (tweight != 0) {
                                    if (tweight > maxweights[aftype]) {
                                        maxweights[aftype] = tweight;
                                    }
                                    if (tweight < minweights[aftype]) {
                                        minweights[aftype] = tweight;
                                    }
                                }

                                // Modulate by power level
                                if (powerlevels[aftype][affinds[affar[i]["id"]][j]["gcn"]]) {
                                    if (affinds[affar[i]["id"]][j]["mp"] > powerlevels[aftype][affinds[affar[i]["id"]][j]["gcn"]]) {
                                        powerlevels[aftype][affinds[affar[i]["id"]][j]["gcn"]] = affinds[affar[i]["id"]][j]["mp"];
                                    }
                                } else {
                                    powerlevels[aftype][affinds[affar[i]["id"]][j]["gcn"]] = affinds[affar[i]["id"]][j]["mp"];
                                }
                                if (powerlevels["all"][affinds[affar[i]["id"]][j]["gcn"]]) {
                                    if (affinds[affar[i]["id"]][j]["mp"] > powerlevels["all"][affinds[affar[i]["id"]][j]["gcn"]]) {
                                        powerlevels["all"][affinds[affar[i]["id"]][j]["gcn"]] = affinds[affar[i]["id"]][j]["mp"];
                                    }
                                } else {
                                    powerlevels["all"][affinds[affar[i]["id"]][j]["gcn"]] = affinds[affar[i]["id"]][j]["mp"];
                                }
                            }
                        }
                    }
                }
            }
            //console.log(powerlevels);
            rangeweights = {
                "prefix": maxweights["prefix"] - minweights["prefix"],
                "suffix": maxweights["suffix"] - minweights["suffix"]
            };

            var idsparsed = "|";
            var hybridspmatch = {"prefix": {}, "suffix": {}};
            // Build mod output data for base
            var affbindex = {"prefix": {}, "suffix": {}};
            for (var i = 0; i < affar.length; i++) {
                if (affinds[affar[i]["id"]]) {
                    for (var j = 0; j < affinds[affar[i]["id"]].length; j++) {
                        if (poecd["modifiers"]["seq"][poecd["modifiers"]["ind"][affinds[affar[i]["id"]][j]["i"]]] != undefined) {
                            var idmgrp = poecd["modifiers"]["seq"][poecd["modifiers"]["ind"][affinds[affar[i]["id"]][j]["i"]]]["id_mgroup"];
                            if (idmgrp == 1) {
                                var valid = true;
                                var aftype = poecd["modifiers"]["seq"][poecd["modifiers"]["ind"][affinds[affar[i]["id"]][j]["i"]]]["affix"];
                                if (affar[i]["val"] / pretotval[aftype] < poeaf_constants["mtresh"]) {
                                    valid = false;
                                }
                                if (affinds[affar[i]["id"]][j]["t"] == "p") {
                                    var checkid = affinds[affar[i]["id"]][j]["i"] + affinds[affar[i]["id"]][j]["t"] + affinds[affar[i]["id"]][j]["m"];
                                } else {
                                    var checkid = affinds[affar[i]["id"]][j]["i"];
                                }
                                if (idsparsed.indexOf("|" + checkid + "|") > -1) {
                                    valid = false;
                                } else {
                                    idsparsed += checkid + "|";
                                }
                                if (poeaf_constants["ignores"].indexOf("|" + affinds[affar[i]["id"]][j]["i"] + "|") > -1) {
                                    valid = false;
                                }
                                if (valid) {
                                    numvalaff++;
                                    var modgroup = poecd["modifiers"]["seq"][poecd["modifiers"]["ind"][affinds[affar[i]["id"]][j]["i"]]]["modgroups"];
                                    var mname = poecl["mod"][affinds[affar[i]["id"]][j]["i"]];
                                    var tval = affar[i]["val"];

                                    var checkname = mname;
                                    if (affinds[affar[i]["id"]][j]["t"] == "p") { // Hybrid downvalue
                                        //tval=Math.round(tval/affinds[affar[i]["id"]][j]["pw"]);
                                        checkname = affinds[affar[i]["id"]][j]["gcn"];
                                        if (!hybridspmatch[aftype][affinds[affar[i]["id"]][j]["i"]]) {
                                            hybridspmatch[aftype][affinds[affar[i]["id"]][j]["i"]] = {};
                                        }
                                        hybridspmatch[aftype][affinds[affar[i]["id"]][j]["i"]][affinds[affar[i]["id"]][j]["m"]] = affinds[affar[i]["id"]][j]["pw"];
                                        if (powerlevels["all"][affinds[affar[i]["id"]][j]["gcn"]]) {
                                            var tval = Math.round(affar[i]["val"] * (affinds[affar[i]["id"]][j]["mp"] / powerlevels["all"][affinds[affar[i]["id"]][j]["gcn"]]) * (affinds[affar[i]["id"]][j]["mp"] / powerlevels["all"][affinds[affar[i]["id"]][j]["gcn"]]));
                                        }
                                    } else {
                                        if (powerlevels[aftype][affinds[affar[i]["id"]][j]["gcn"]]) {
                                            var tval = Math.round(affar[i]["val"] * (affinds[affar[i]["id"]][j]["mp"] / powerlevels[aftype][affinds[affar[i]["id"]][j]["gcn"]]) * (affinds[affar[i]["id"]][j]["mp"] / powerlevels[aftype][affinds[affar[i]["id"]][j]["gcn"]]));
                                        }
                                    }

                                    var pctdiff = 0;
                                    if (poeaf_options["modrarity"] == 1) {
                                        if (poeaf_constants["undesirables"].indexOf("|" + checkname + "|") > -1) {
                                            tval = Math.round(tval * 0.10);
                                            pctdiff = -0.9;
                                        } else {
                                            var pctdiff = 0;
                                            if (affinds[affar[i]["id"]][j]["w"] != 0) {
                                                var remmgw = 0;
                                                for (var zy = 0; zy < modgroup.length; zy++) {
                                                    remmgw += wbymgrps[aftype][modgroup[zy]];
                                                }
                                                var diff = maxweights[aftype] - remmgw;
                                                //var diff=maxweights[aftype]-wbyaffid[affinds[affar[i]["id"]][j]["i"]];
                                                pctdiff = diff / rangeweights[aftype];
                                                pctdiff = (pctdiff * pctdiff); // Exponential
                                            }

                                            //pctdiff=pctdiff*(affinds[affar[i]["id"]][j]["mp"]/powerlevels[aftype][affinds[affar[i]["id"]][j]["gcn"]]);
                                            if (isNaN(pctdiff)) {
                                                pctdiff = 0;
                                            }

                                            tval = Math.round(tval * (1 + pctdiff));
                                        }
                                    } else {
                                        if (poeaf_constants["undesirables"].indexOf("|" + checkname + "|") > -1) {
                                            tval = Math.round(tval * 0.10);
                                            pctdiff = 0;
                                        }
                                    }

                                    for (var zy = 0; zy < modgroup.length; zy++) {
                                        if (!mmgra[aftype][modgroup[zy]]) {
                                            mmgra[aftype][modgroup[zy]] = {"val": 0, "num": 0, "max": 0};
                                            mmgacheck[aftype][modgroup[zy]] = "|";
                                        }
                                        if (mmgacheck[aftype][modgroup[zy]].indexOf("|" + mname + "|") > -1) {
                                        } else {
                                            mmgacheck[aftype][modgroup[zy]] += mname + "|";
                                            mmgra[aftype][modgroup[zy]]["val"] += tval;
                                            mmgra[aftype][modgroup[zy]]["num"]++;
                                        }
                                    }
                                    if (maffcheck[aftype][affinds[affar[i]["id"]][j]["i"]]) {
                                        maffar[aftype][maffcheck[aftype][affinds[affar[i]["id"]][j]["i"]]]["val"] += tval;
                                    } else {
                                        maffcheck[aftype][affinds[affar[i]["id"]][j]["i"]] = maffar[aftype].length;
                                        maffar[aftype].push({
                                            "mid": affinds[affar[i]["id"]][j]["i"],
                                            "type": affinds[affar[i]["id"]][j]["t"],
                                            "weight": affinds[affar[i]["id"]][j]["w"],
                                            "mgrp": modgroup,
                                            "vmod": number_format(1 + pctdiff, 2, ".", " "),
                                            "childs": [],
                                            "ccheck": "|",
                                            "val": tval
                                        });
                                    }
                                    for (var zy = 0; zy < modgroup.length; zy++) {
                                        if (maffar[aftype][maffcheck[aftype][affinds[affar[i]["id"]][j]["i"]]]["val"] > mmgra[aftype][modgroup[zy]]["max"]) {
                                            mmgra[aftype][modgroup[zy]]["max"] = maffar[aftype][maffcheck[aftype][affinds[affar[i]["id"]][j]["i"]]]["val"];
                                        }
                                    }
                                    tvals[aftype] += tval;

                                    affbindex[aftype][mname] = maffcheck[aftype][affinds[affar[i]["id"]][j]["i"]];
                                }
                            }
                        }
                    }
                }
            }

            // Build mod output for other modgroups
            for (var i = 0; i < affar.length; i++) {
                if (affinds[affar[i]["id"]]) {
                    for (var j = 0; j < affinds[affar[i]["id"]].length; j++) {
                        if (poecd["modifiers"]["seq"][poecd["modifiers"]["ind"][affinds[affar[i]["id"]][j]["i"]]] != undefined) {
                            var idmgrp = poecd["modifiers"]["seq"][poecd["modifiers"]["ind"][affinds[affar[i]["id"]][j]["i"]]]["id_mgroup"];
                            var valid = true;
                            if (poeaf_options["crafted"] == 0) {
                                if (idmgrp == poeaf_constants["crafted_mgrp"]) {
                                    valid = false;
                                }
                            }
                            if (poeaf_options["essences"] == 0) {
                                if (idmgrp == poeaf_constants["essence_mgrp"]) {
                                    valid = false;
                                }
                            }
                            if (poeaf_options["droponly"] == 0) {
                                if (poeaf_constants["droponly_mgrps"].indexOf("|" + idmgrp + "|") > -1) {
                                    valid = false;
                                }
                            }
                            if (poeaf_options["influences"] == 0) {
                                if (poeaf_constants["influence_mgrps"].indexOf("|" + idmgrp + "|") > -1) {
                                    valid = false;
                                }
                            }
                            if (affar[i]["val"] / pretotval[aftype] < poeaf_constants["mtresh"]) {
                                valid = false;
                            }
                            if (affinds[affar[i]["id"]][j]["t"] == "p") {
                                var checkid = affinds[affar[i]["id"]][j]["i"] + affinds[affar[i]["id"]][j]["t"] + affinds[affar[i]["id"]][j]["m"];
                            } else {
                                var checkid = affinds[affar[i]["id"]][j]["i"];
                            }
                            if (idsparsed.indexOf("|" + checkid + "|") > -1) {
                                valid = false;
                            } else {
                                idsparsed += checkid + "|";
                            }
                            if (poeaf_constants["ignores"].indexOf("|" + affinds[affar[i]["id"]][j]["i"] + "|") > -1) {
                                valid = false;
                            }
                            if (valid) {
                                var aftype = poecd["modifiers"]["seq"][poecd["modifiers"]["ind"][affinds[affar[i]["id"]][j]["i"]]]["affix"];
                                var mname = poecl["mod"][affinds[affar[i]["id"]][j]["i"]];
                                if (poeaf_constants["childs_mgrps"].indexOf("|" + idmgrp + "|") > -1 && affinds[affar[i]["id"]][j]["w"] == 0 && affbindex[aftype][mname] != undefined) {
                                    // Add to child of base
                                    if (maffar[aftype][affbindex[aftype][mname]]["ccheck"].indexOf("|" + idmgrp + "|") > -1) {
                                    } else {
                                        maffar[aftype][affbindex[aftype][mname]]["childs"].push(idmgrp);
                                        maffar[aftype][affbindex[aftype][mname]]["ccheck"] += idmgrp + "|";
                                    }
                                } else {
                                    numvalaff++;
                                    var modgroup = poecd["modifiers"]["seq"][poecd["modifiers"]["ind"][affinds[affar[i]["id"]][j]["i"]]]["modgroups"];
                                    var tval = affar[i]["val"];

                                    var checkname = mname;
                                    if (affinds[affar[i]["id"]][j]["t"] == "p") { // Hybrid downvalue
                                        //tval=Math.round(tval/affinds[affar[i]["id"]][j]["pw"]);
                                        checkname = affinds[affar[i]["id"]][j]["gcn"];
                                        if (!hybridspmatch[aftype][affinds[affar[i]["id"]][j]["i"]]) {
                                            hybridspmatch[aftype][affinds[affar[i]["id"]][j]["i"]] = {};
                                        }
                                        hybridspmatch[aftype][affinds[affar[i]["id"]][j]["i"]][affinds[affar[i]["id"]][j]["m"]] = affinds[affar[i]["id"]][j]["pw"];
                                        if (powerlevels["all"][affinds[affar[i]["id"]][j]["gcn"]]) {
                                            tval = Math.round(affar[i]["val"] * (affinds[affar[i]["id"]][j]["mp"] / powerlevels["all"][affinds[affar[i]["id"]][j]["gcn"]]) * (affinds[affar[i]["id"]][j]["mp"] / powerlevels["all"][affinds[affar[i]["id"]][j]["gcn"]]));
                                        }
                                    } else {
                                        if (powerlevels[aftype][affinds[affar[i]["id"]][j]["gcn"]]) {
                                            tval = Math.round(affar[i]["val"] * (affinds[affar[i]["id"]][j]["mp"] / powerlevels[aftype][affinds[affar[i]["id"]][j]["gcn"]]) * (affinds[affar[i]["id"]][j]["mp"] / powerlevels[aftype][affinds[affar[i]["id"]][j]["gcn"]]));
                                        }
                                    }

                                    var pctdiff = 0;
                                    if (poeaf_options["modrarity"] == 1) {
                                        if (poeaf_constants["undesirables"].indexOf("|" + checkname + "|") > -1) {
                                            tval = Math.round(tval * 0.10);
                                            pctdiff = -0.9;
                                        } else {
                                            var pctdiff = 0;
                                            if (affinds[affar[i]["id"]][j]["w"] != 0) {
                                                var remmgw = 0;
                                                for (var zy = 0; zy < modgroup.length; zy++) {
                                                    remmgw += wbymgrps[aftype][modgroup[zy]];
                                                }
                                                var diff = maxweights[aftype] - remmgw;
                                                pctdiff = diff / rangeweights[aftype];
                                                pctdiff = (pctdiff * pctdiff); // Exponential
                                            }

                                            if (isNaN(pctdiff)) {
                                                pctdiff = 0;
                                            }

                                            tval = Math.round(tval * (1 + pctdiff));
                                        }
                                    } else {
                                        if (poeaf_constants["undesirables"].indexOf("|" + checkname + "|") > -1) {
                                            tval = Math.round(tval * 0.10);
                                            pctdiff = 0;
                                        }
                                    }

                                    for (var zy = 0; zy < modgroup.length; zy++) {
                                        if (!mmgra[aftype][modgroup[zy]]) {
                                            mmgra[aftype][modgroup[zy]] = {"val": 0, "num": 0, "max": 0};
                                            mmgacheck[aftype][modgroup[zy]] = "|";
                                        }
                                        if (mmgacheck[aftype][modgroup[zy]].indexOf("|" + mname + "|") > -1) {
                                        } else {
                                            mmgacheck[aftype][modgroup[zy]] += mname + "|";
                                            mmgra[aftype][modgroup[zy]]["val"] += tval;
                                            mmgra[aftype][modgroup[zy]]["num"]++;
                                        }
                                    }
                                    if (maffcheck[aftype][affinds[affar[i]["id"]][j]["i"]]) {
                                        maffar[aftype][maffcheck[aftype][affinds[affar[i]["id"]][j]["i"]]]["val"] += tval;
                                    } else {
                                        maffcheck[aftype][affinds[affar[i]["id"]][j]["i"]] = maffar[aftype].length;
                                        maffar[aftype].push({
                                            "mid": affinds[affar[i]["id"]][j]["i"],
                                            "type": affinds[affar[i]["id"]][j]["t"],
                                            "weight": affinds[affar[i]["id"]][j]["w"],
                                            "mgrp": modgroup,
                                            "vmod": number_format(1 + pctdiff, 2, ".", " "),
                                            "childs": [],
                                            "ccheck": "|",
                                            "val": tval
                                        });
                                    }
                                    for (var zy = 0; zy < modgroup.length; zy++) {
                                        if (maffar[aftype][maffcheck[aftype][affinds[affar[i]["id"]][j]["i"]]]["val"] > mmgra[aftype][modgroup[zy]]["max"]) {
                                            mmgra[aftype][modgroup[zy]]["max"] = maffar[aftype][maffcheck[aftype][affinds[affar[i]["id"]][j]["i"]]]["val"];
                                        }
                                    }
                                    tvals[aftype] += tval;
                                }
                            }
                        }
                    }
                }
            }

            // Hybrid final modulate
            $.each(hybridspmatch, function (aftype, affids) {
                $.each(affids, function (affid, parts) {
                    var cntvp = 0;
                    var ppw = 0;
                    $.each(parts, function (partid, pbool) {
                        ppw = pbool;
                        cntvp++;
                    });
                    maffar[aftype][maffcheck[aftype][affid]]["val"] = Math.floor(maffar[aftype][maffcheck[aftype][affid]]["val"] * (cntvp / ppw));
                });
            });

            if (numvalaff > 0) {
                mmgra["prefix"] = poec_affReworkMGRP(mmgra["prefix"]);
                mmgra["suffix"] = poec_affReworkMGRP(mmgra["suffix"]);
                maffar["prefix"] = poec_affReworkAffArr(maffar["prefix"]);
                maffar["suffix"] = poec_affReworkAffArr(maffar["suffix"]);
                affgblmgrps = "|";
                affgblcrafted = false;
                affgblninfs = 0;
                affgblsinfs = "|";
                affgblhasdrop = 0;

                vHTML += vSTOUT;

                // Output tag affinities
                var arrMTypes = [];
                $.each(mtypes, function (mkey, mval) {
                    arrMTypes.push({"id": mkey, "val": mval});
                });
                arrMTypes.sort(sortColByVAL);
                arrMTypes.reverse();
                var arrMTByOffence = [];
                $.each(mtbt["offence"], function (mkey, mval) {
                    arrMTByOffence.push({"id": mkey, "val": mval});
                });
                arrMTByOffence.sort(sortColByVAL);
                arrMTByOffence.reverse();
                var arrMTByDefence = [];
                $.each(mtbt["defence"], function (mkey, mval) {
                    arrMTByDefence.push({"id": mkey, "val": mval});
                });
                arrMTByDefence.sort(sortColByVAL);
                arrMTByDefence.reverse();
                var arrMTByOther = [];
                $.each(mtbt["other"], function (mkey, mval) {
                    arrMTByOther.push({"id": mkey, "val": mval});
                });
                arrMTByOther.sort(sortColByVAL);
                arrMTByOther.reverse();

                vHTML += "<div id='poecAffResByMTypes'>";

                if (poeaf_options["mtbt"] == 0) {
                    var addsel = " selected";
                } else {
                    var addsel = "";
                }
                vHTML += "<div class='mtbt all " + addsel + "'>";
                for (var z = 0; z < arrMTypes.length; z++) {
                    vHTML += "<div class='mt bmt tmt" + arrMTypes[z]["id"] + "'><div>" + arrMTypes[z]["val"] + "</div><div class='mt tmt" + arrMTypes[z]["id"] + "'>" + poecl["mtype"][arrMTypes[z]["id"]] + "</div></div>";
                    if (z >= 9) {
                        break;
                    }
                }
                vHTML += "</div>";
                if (poeaf_options["mtbt"] == "offence") {
                    var addsel = " selected";
                } else {
                    var addsel = "";
                }
                vHTML += "<div class='mtbt offence " + addsel + "'>";
                for (var z = 0; z < arrMTByOffence.length; z++) {
                    vHTML += "<div class='mt bmt tmt" + arrMTByOffence[z]["id"] + "'><div>" + arrMTByOffence[z]["val"] + "</div><div class='mt tmt" + arrMTByOffence[z]["id"] + "'>" + poecl["mtype"][arrMTByOffence[z]["id"]] + "</div></div>";
                    if (z >= 9) {
                        break;
                    }
                }
                vHTML += "</div>";
                if (poeaf_options["mtbt"] == "defence") {
                    var addsel = " selected";
                } else {
                    var addsel = "";
                }
                vHTML += "<div class='mtbt defence " + addsel + "'>";
                for (var z = 0; z < arrMTByDefence.length; z++) {
                    vHTML += "<div class='mt bmt tmt" + arrMTByDefence[z]["id"] + "'><div>" + arrMTByDefence[z]["val"] + "</div><div class='mt tmt" + arrMTByDefence[z]["id"] + "'>" + poecl["mtype"][arrMTByDefence[z]["id"]] + "</div></div>";
                    if (z >= 9) {
                        break;
                    }
                }
                vHTML += "</div>";
                if (poeaf_options["mtbt"] == "other") {
                    var addsel = " selected";
                } else {
                    var addsel = "";
                }
                vHTML += "<div class='mtbt other " + addsel + "'>";
                for (var z = 0; z < arrMTByOther.length; z++) {
                    vHTML += "<div class='mt bmt tmt" + arrMTByOther[z]["id"] + "'><div>" + arrMTByOther[z]["val"] + "</div><div class='mt tmt" + arrMTByOther[z]["id"] + "'>" + poecl["mtype"][arrMTByOther[z]["id"]] + "</div></div>";
                    if (z >= 9) {
                        break;
                    }
                }
                vHTML += "</div>";

                vHTML += "</div>";

                vHTML += "<div id='poecAffResByType'><div>";
                vHTML += "<div id='poecAffRBTPrefix' class='atype prefix'><div class='title'>" + applyLang("Prefixes") + "</div><div class='holder div_stable'>" + poec_affRBTOutput(maffar["prefix"], mmgra["prefix"], "prefix") + "</div></div>";
                vHTML += "<div id='poecAffRBTSuffix' class='atype suffix'><div class='title'>" + applyLang("Suffixes") + "</div><div class='holder div_stable'>" + poec_affRBTOutput(maffar["suffix"], mmgra["suffix"], "suffix") + "</div></div>";
                vHTML += "</div></div>";
            } else {
                vHTML += "<div class='gen_msg red'>" + applyLang("No modifiers found for this combination of parameters.") + "</div>";
                output = false;
            }
        } else {
            /**************/
            /* RAW OUTPUT */
            /**************/
            var totval = 0;
            for (var i = 0; i < affar.length; i++) {
                totval += affar[i]["val"];
            }

            vHTML += vSTOUT;
            vHTML += "<div class='gen_msg lowkey medium' style='margin:10px 0px 10px 0px;'>" + poeaf_constants["raw_data"] + "</div>";
            vHTML += "<div id='poecAffResByType' class='full'><div>";
            vHTML += "<div id='poecAffRBTAffixes' class='atype'><div class='title'>" + applyLang("Affixes") + "</div><div class='holder div_stable'>";
            for (var i = 0; i < affar.length; i++) {
                vHTML += "<div class='affix mgrp mgrp1'>";
                vHTML += "<div class='div_stable'><div>";
                vHTML += "<div class='label'><div><div class='value'>" + affar[i]["val"] + "</div>" + poec_affParseName(poeaf["aindex"][affar[i]["id"]]) + "</div></div>";
                var pct = number_format((affar[i]["val"] / totval) * 100, 2, ".", " ");
                vHTML += "<div class='pct right'><div>" + pct + "<span class='sml'>%</span></div></div>";
                vHTML += "</div></div>";
                vHTML += "<div class='bar' style='width:" + pct + "%'></div>";
                vHTML += "</div>";
            }
            vHTML += "</div></div>";
            vHTML += "</div></div>";
        }
    } else {
        if (hassel === true) {
            vHTML += "<div class='gen_msg red'>" + applyLang("No modifiers found for this combination of parameters.") + "</div>";
        }
        output = false;
    }

    $("#poecAffRZone").removeClass("omode_m omode_s").addClass("omode_" + poeaf_options["omode"]).html(vHTML);
    if (poeaf_options["omode"] == "m") {
        poec_affApplyAffixHovers();
    }

    // Update prevalence inside selectors
    $("#poecAffOptions.aff").find(".opt.prev").removeClass("prev").attr("style", "");
    poec_affMaxNonUnique = null;
    if (output) {
        var tparr = parr.length;
        var jump = -1000;
        if (!bas) {
            var narr = [];
            $.each(prevalence["bas"], function (bid, num) {
                narr.push({"val": poec_affParsePct(num / tparr), "id": bid});
            });
            narr = sortByVALDesc(narr);
            $("#poecAffMSBase").find(".opt").removeClass("prev");
            for (var i = 0; i < narr.length; i++) {
                $("#poecAffMSBase").find(".opt" + narr[i]["id"]).addClass("prev").css({"order": (jump + i)}).find(".bar").css({"width": narr[i]["val"] + "%"});
                $("#poecAffMSBase").find(".opt" + narr[i]["id"]).find(".pct").children("div").html(narr[i]["val"] + "<span class='sml'>%</span>");
            }
        }
        if (skl && !asc) {
            var narr = [];
            $.each(prevalence["asc"], function (bid, num) {
                narr.push({"val": poec_affParsePct(num / tparr), "id": bid});
            });
            narr = sortByVALDesc(narr);
            $("#poecAffMSClass").find(".opt").removeClass("prev");
            for (var i = 0; i < narr.length; i++) {
                $("#poecAffMSClass").find(".opt" + narr[i]["id"]).addClass("prev").css({"order": (jump + i)}).find(".bar").css({"width": narr[i]["val"] + "%"});
                $("#poecAffMSClass").find(".opt" + narr[i]["id"]).find(".pct").children("div").html(narr[i]["val"] + "<span class='sml'>%</span>");
            }
        }
        if (asc && !skl) {
            var narr = [];
            $.each(prevalence["skl"], function (bid, num) {
                narr.push({"val": poec_affParsePct(num / tparr), "id": bid});
            });
            narr = sortByVALDesc(narr);
            $("#poecAffMSSkill").find(".opt").removeClass("prev");
            for (var i = 0; i < narr.length; i++) {
                $("#poecAffMSSkill").find(".opt" + narr[i]["id"]).addClass("prev").css({"order": (jump + i)}).find(".bar").css({"width": narr[i]["val"] + "%"});
                $("#poecAffMSSkill").find(".opt" + narr[i]["id"]).find(".pct").children("div").html(narr[i]["val"] + "<span class='sml'>%</span>");
            }
        }
        var narr = [];
        $.each(adir, function (akey, num) {
            narr.push({"val": poec_affParsePct(num / atot), "id": poec_parseClassName(akey)});
        });
        narr = sortByVALDesc(narr);
        $("#poecAffMSAnoint").find(".opt").removeClass("prev");
        for (var i = 0; i < narr.length; i++) {
            $("#poecAffMSAnoint").find(".opt" + narr[i]["id"]).addClass("prev").css({"order": (jump + i)}).find(".bar").css({"width": narr[i]["val"] + "%"});
            $("#poecAffMSAnoint").find(".opt" + narr[i]["id"]).find(".pct").children("div").html(narr[i]["val"] + "<span class='sml'>%</span>");
        }
        if ((bas || skl || asc || slt) && !bit) {
            var narr = [];
            var totall = tparr;
            var totutot = 0;
            var totallwu = tparr;
            if (poeaf_options["suniques"] == 1) {
                totallwu += utot;
                if (bas || slt) {
                    $.each(udir, function (uid, num) {
                        if ($("#poecAffMSItem").find(".opt.optu" + uid + ".active").is(":visible")) {
                            //totall+=num;
                            totutot += num;
                            narr.push({"val": poec_affParsePct(num / totallwu), "id": "u" + uid});
                        }
                    });
                } else {
                    $.each(udir, function (uid, num) {
                        //totall+=num;
                        totutot += num;
                        narr.push({"val": poec_affParsePct(num / totallwu), "id": "u" + uid});
                    });
                }
            }
            if (bas || slt) {
                var ttpct = 0;
                var maxnonu = 0;
                $.each(prevalence["bit"], function (bid, num) {
                    if (num > maxnonu) {
                        maxnonu = num;
                        poec_affMaxNonUnique = bid;
                    }
                    ttpct += Math.round((num / totallwu) * 100);
                    narr.push({"val": poec_affParsePct(num / totallwu), "id": bid});
                });
                if (slt == "Cluster") {
                    if (bas) {
                        ttpct = 100;
                    } else {
                        ttpct = Math.round((1 - (totutot / totallwu)) * 100);
                    }
                }
                if (poeaf_options["suniques"] == 1) {
                    if (ttpct > 100) {
                        ttpct = 100;
                    }
                    narr.push({"val": ttpct, "id": "rares"});
                }
            }
            narr = sortByVALDesc(narr);
            $("#poecAffMSItem").find(".opt").removeClass("prev");
            for (var i = 0; i < narr.length; i++) {
                $("#poecAffMSItem").find(".opt" + narr[i]["id"]).addClass("prev").css({"order": (jump + i)}).find(".bar").css({"width": narr[i]["val"] + "%"});
                $("#poecAffMSItem").find(".opt" + narr[i]["id"]).find(".pct").children("div").html(narr[i]["val"] + "<span class='sml'>%</span>");
            }
        }
    } else {
        if (!bas && !skl && !asc && !slt && !bit) {
            var jump = -1000;
            // Show base distributions
            var narr = [];
            $.each(poeaf["bdist"]["ascls"], function (key, vals) {
                narr.push({"val": poec_affParsePct(vals["p"]), "id": key});
            });
            narr = sortByVALDesc(narr);
            $("#poecAffMSClass").find(".opt").removeClass("prev");
            for (var i = 0; i < narr.length; i++) {
                $("#poecAffMSClass").find(".opt" + narr[i]["id"]).addClass("prev").css({"order": (jump + i)}).find(".bar").css({"width": narr[i]["val"] + "%"});
                $("#poecAffMSClass").find(".opt" + narr[i]["id"]).find(".pct").children("div").html(narr[i]["val"] + "<span class='sml'>%</span>");
            }
            jump = -1000;
            var narr = [];
            $.each(poeaf["bdist"]["skill"], function (key, vals) {
                narr.push({"val": poec_affParsePct(vals["p"]), "id": key});
            });
            narr = sortByVALDesc(narr);
            $("#poecAffMSSkill").find(".opt").removeClass("prev");
            for (var i = 0; i < narr.length; i++) {
                $("#poecAffMSSkill").find(".opt" + narr[i]["id"]).addClass("prev").css({"order": (jump + i)}).find(".bar").css({"width": narr[i]["val"] + "%"});
                $("#poecAffMSSkill").find(".opt" + narr[i]["id"]).find(".pct").children("div").html(narr[i]["val"] + "<span class='sml'>%</span>");
            }
            jump = -1000;
            var narr = [];
            $.each(poeaf["bdist"]["base"], function (key, vals) {
                narr.push({"val": poec_affParsePct(vals["p"]), "id": key});
            });
            narr = sortByVALDesc(narr);
            $("#poecAffMSBase").find(".opt").removeClass("prev");
            for (var i = 0; i < narr.length; i++) {
                $("#poecAffMSBase").find(".opt" + narr[i]["id"]).addClass("prev").css({"order": (jump + i)}).find(".bar").css({"width": narr[i]["val"] + "%"});
                $("#poecAffMSBase").find(".opt" + narr[i]["id"]).find(".pct").children("div").html(narr[i]["val"] + "<span class='sml'>%</span>");
            }
            jump = -1000;
            var narr = [];
            $.each(poeaf["bdist"]["bitem"], function (key, vals) {
                narr.push({"val": poec_affParsePct(vals["p"]), "id": key});
            });
            narr = sortByVALDesc(narr);
            $("#poecAffMSItem").find(".opt").removeClass("prev");
            for (var i = 0; i < narr.length; i++) {
                $("#poecAffMSItem").find(".opt" + narr[i]["id"]).addClass("prev").css({"order": (jump + i)}).find(".bar").css({"width": narr[i]["val"] + "%"});
                $("#poecAffMSItem").find(".opt" + narr[i]["id"]).find(".pct").children("div").html(narr[i]["val"] + "<span class='sml'>%</span>");
            }
            jump = -1000;
            var narr = [];
            //console.log(poeaf["bdist"]["anoint"]);
            $.each(poeaf["bdist"]["anoint"], function (key, vals) {
                narr.push({"val": poec_affParsePct(vals["p"]), "id": poec_parseClassName(key)});
            });
            narr = sortByVALDesc(narr);
            $("#poecAffMSAnoint").find(".opt").removeClass("prev");
            for (var i = 0; i < narr.length; i++) {
                $("#poecAffMSAnoint").find(".opt" + narr[i]["id"]).addClass("prev").css({"order": (jump + i)}).find(".bar").css({"width": narr[i]["val"] + "%"});
                $("#poecAffMSAnoint").find(".opt" + narr[i]["id"]).find(".pct").children("div").html(narr[i]["val"] + "<span class='sml'>%</span>");
            }
        }
    }

    $("#poecAppItem").html("");
    $("#poecAffViewItem").hide();
    if (!slt && !bas && (asc || skl)) {
        // Output build loadout

    } else {
        if (bas) {
            // Output simple optimal item
            $("#poecAffViewItem").hover(function () {
                $("#poecAffItem").css({"left": $(this).position().left - 400, "top": $(this).position().top}).show();
            }, function () {
                $("#poecAffItem").hide();
            }).show();
            poec_affGetItemFromPicked();
        }
    }
}

function poec_affCleanMTypes(marr) {
    var narr = {};
    $.each(marr, function (mkey, mval) {
        if (poeaf_constants["mtbt_excludes"].indexOf("|" + mkey + "|") > -1) {
        } else {
            narr[mkey] = mval;
        }
    });
    return narr;
}

function poec_affGetItemFromPicked() {
    var bit = poec_affMSGetVal($("#poecAffMSItem"));
    var slt = poec_affMSGetVal($("#poecAffMSSlot"));
    var pbas = poec_affMSGetVal($("#poecAffMSBase"));
    var infs = [];
    var affs = [];
    if (slt != "Cluster") {
        if (!bit) {
            bit = poec_affMaxNonUnique;
        }
        if (poecd["bitems"]["seq"][poecd["bitems"]["ind"][bit]] != undefined) {
            var bas = poecd["bitems"]["seq"][poecd["bitems"]["ind"][bit]]["id_base"];
            var imps = jQuery.parseJSON(poecd["bitems"]["seq"][poecd["bitems"]["ind"][bit]]["implicits"]);
            var timps = [];
            for (var i = 0; i < imps.length; i++) {
                timps.push("{spacer}");
                timps.push(imps[i]);
            }
            imps = timps;
        } else {
            var bas = pbas;
            var imps = [];
        }
    } else {
        var bas = pbas;
        var imps = [];
    }
    $("#poecAffResByType").find(".picked").each(function () {
        var aid = $(this).attr("aid");
        var mgrp = poecd["modifiers"]["seq"][poecd["modifiers"]["ind"][aid]]["id_mgroup"];
        if (poeaf_constants["influence_mgrps"].indexOf("|" + mgrp + "|") > -1) {
            infs.push(mgrp);
        }
        var tiers = poecd["tiers"][aid][bas];
        var tier = tiers[tiers.length - 1];
        var nvalues = jQuery.parseJSON(tier["nvalues"]);
        var rolls = [];
        for (var i = 0; i < nvalues.length; i++) {
            if (Array.isArray(nvalues[i])) {
                if (nvalues[i][1] < 0) {
                    if (nvalues[i][1] < nvalues[i][0]) {
                        rolls.push(nvalues[i][1]);
                    } else {
                        rolls.push(nvalues[i][0]);
                    }
                } else {
                    rolls.push(nvalues[i][1]);
                }
            } else {
                rolls.push(nvalues[i]);
            }
        }
        affs.push({
            atype: poecd["modifiers"]["seq"][poecd["modifiers"]["ind"][aid]]["affix"],
            bench: 0,
            frac: 0,
            id: aid,
            maven: 0,
            mgrp: mgrp,
            modgroups: poecd["modifiers"]["seq"][poecd["modifiers"]["ind"][aid]]["modgroups"],
            nvalues: tier["nvalues"],
            rolls: rolls,
            tindex: tiers.length - 1,
            weight: null
        });
    });
    if (infs.length == 0) {
        infs = null;
    }

    var nidata = {
        "quality": 20,
        "catalyst": null,
        "affixes": affs,
        "implicits": imps,
        "enchant": "",
        "influences": infs,
        "rarity": "rare",
        "ilvl": 100,
        "base": bas
    };
    //console.log(nidata);
    if (bit && bit != "na") {
        $("#poecAffViewItem").show();
        var ihtml = poec_simGetFullItem(nidata, bit, "Item", "bestinslot");
        $("#poecAffItem").html(ihtml);
    } else {
        $("#poecAffViewItem").hide();
    }
}

function poec_affParsePct(num) {
    var vnum = Math.round(num * 100);
    if (vnum >= 10) {
        return vnum;
    } else {
        return Math.round(num * 10000) / 100;
    }
}

function poec_affParseName(name) {
    name = name.replace(/(\bFire\b|\bIgnite\b|\bIgnites\b|\bBurning\b)/gm, `<span class='tfire'>$1</span>`);
    name = name.replace(/(\bCold\b|\bFreeze\b|\bChill\b)/gm, `<span class='tcold'>$1</span>`);
    name = name.replace(/(\bLightning\b|\bShock\b)/gm, `<span class='tlightning'>$1</span>`);
    name = name.replace(/(\bChaos\b)/gm, `<span class='tchaos'>$1</span>`);
    name = name.replace(/(\bSpeed\b)/gm, `<span class='tspeed'>$1</span>`);
    name = name.replace(/(\bCast\b)/gm, `<span class='tcaster'>$1</span>`);
    name = name.replace(/(\bSpell\b|\bSpells\b)/gm, `<span class='tcaster'>$1</span>`);
    name = name.replace(/(\bMana\b)/gm, `<span class='tmana'>$1</span>`);
    name = name.replace(/(\bLife\b)/gm, `<span class='tlife'>$1</span>`);
    name = name.replace(/(\bGems\b)/gm, `<span class='tgem'>$1</span>`);
    name = name.replace(/(\bCritical\b)/gm, `<span class='tcrit'>$1</span>`);
    name = name.replace(/(\bCurse\b|\bCurses\b)/gm, `<span class='tcurse'>$1</span>`);
    name = name.replace(/(\bDamage\b)/gm, `<span class='tdamage'>$1</span>`);
    name = name.replace(/(\bPhysical\b)/gm, `<span class='tphys'>$1</span>`);
    name = name.replace(/(\bAttack\b|\bAttacks\b)/gm, `<span class='tattack'>$1</span>`);
    name = name.replace(/(\bMinion\b|\bMinions\b)/gm, `<span class='tminion'>$1</span>`);
    name = name.replace(/(\bDexterity\b|\bIntelligence\b|\bStrength\b|\bAttributes\b)/gm, `<span class='tattr'>$1</span>`);
    name = name.replace(/(\bEnergy Shield\b|\bArmour\b|\bEvasion Rating\b)/gm, `<span class='tdef'>$1</span>`);
    return name;
}

function poec_affReworkMGRP(farr) {
    var garr = [];
    var totgarr = 0;
    $.each(farr, function (gkey, gdata) {
        totgarr += gdata["max"];
        garr.push({"val": gdata["max"], "id": gkey});
    });
    garr.sort(sortColByVAL);
    garr.reverse();
    var tottgarr = 0;
    for (var i = 0; i < garr.length; i++) {
        garr[i]["pct"] = (garr[i]["val"] / totgarr) * 100;
        if (garr[i]["pct"] >= poeaf_constants["tresh"]) {
            tottgarr += garr[i]["val"];
        }
    }
    for (var i = 0; i < garr.length; i++) {
        garr[i]["rpct"] = (garr[i]["val"] / tottgarr) * 100;
    }
    return garr;
}

function poec_affReworkAffArr(farr) {
    if (poeaf_options["mgrouped"] == 1) {
        var gfarr = {};
        for (var i = 0; i < farr.length; i++) {
            if (!gfarr[farr[i]["mgrp"]]) {
                gfarr[farr[i]["mgrp"]] = [];
            }
            gfarr[farr[i]["mgrp"]].push(farr[i]);
        }
        $.each(gfarr, function (gkey, farrs) {
            farrs.sort(sortColByVAL);
            farrs.reverse();
            gfarr[gkey] = farrs;
        });
        return gfarr;
    } else {
        farr.sort(sortColByVAL);
        farr.reverse();
        return farr;
    }
}

var affgblmgrps = "|";
var affgblcrafted = false;
var affgblninfs = 0;
var affgblsinfs = "|";
var affgblhasdrop = 0;

function poec_affRBTOutput(maff, gaff, aftype) {
    var vHTML = "";
    var bas = poec_affMSGetVal($("#poecAffMSBase"));

    var cntaff = 1;
    var usedmgrps = "|";
    var picked = 0;
    var notables = 0;
    var maxpicks = 3;
    var masterbase = null;
    if (bas) {
        maxpicks = poecd["bgroups"]["seq"][poecd["bgroups"]["ind"][poecd["bases"]["seq"][poecd["bases"]["ind"][bas]]["id_bgroup"]]]["max_affix"] / 2;
        masterbase = poecd["bases"]["seq"][poecd["bases"]["ind"][bas]]["master_base"];
    }
    if (poeaf_options["mgrouped"] == 1) {
        for (var j = 0; j < gaff.length; j++) {
            if (gaff[j]["pct"] < poeaf_constants["tresh"]) {
                break;
            }
            vHTML += "<div class='affix modgroup'>";
            vHTML += "<div class='label'><div>" + gaff[j]["id"] + "</div></div>";
            vHTML += "<div class='value right'><div>" + Math.round(gaff[j]["val"]) + "</div></div>";
            vHTML += "<div class='pct right'><div>" + number_format(gaff[j]["rpct"], 2, ".", "") + "<span class='sml'>%</span></div></div>";
            vHTML += "</div>";
            var mgpicked = false;
            var chkpmod = "|";
            for (var i = 0; i < maff[gaff[j]["id"]].length; i++) {
                var mgrp = poecd["modifiers"]["seq"][poecd["modifiers"]["ind"][maff[gaff[j]["id"]][i]["mid"]]]["id_mgroup"];
                if (chkpmod.indexOf("|" + mgrp + "-" + poecl["mod"][maff[gaff[j]["id"]][i]["mid"]] + "|") > -1) {
                } else {
                    var addcls = "";
                    var addpick = "";
                    if (bas && picked < maxpicks && !mgpicked) {
                        var modgroup = poecd["modifiers"]["seq"][poecd["modifiers"]["ind"][maff[gaff[j]["id"]][i]["mid"]]]["modgroups"];
                        var mconflict = false;
                        for (var zy = 0; zy < modgroup.length; zy++) {
                            if (usedmgrps.indexOf("|" + modgroup[zy] + "|") > -1 || affgblmgrps.indexOf("|" + modgroup[zy] + "|") > -1) {
                                mconflict == true;
                            }
                        }
                        if (mconflict || (affgblcrafted && mgrp == poeaf_constants["crafted_mgrp"])) {
                        } else {
                            var avalid = true;
                            if (poeaf_constants["influence_mgrps"].indexOf("|" + mgrp + "|") > -1) {
                                if (affgblsinfs.indexOf("|" + mgrp + "|") > -1) {
                                } else {
                                    if (affgblninfs < 2) {
                                        affgblninfs++;
                                        affgblsinfs += mgrp + "|";
                                    } else {
                                        avalid = false;
                                    }
                                }
                            } else {
                                if (poeaf_constants["dopick_mgrps"].indexOf("|" + mgrp + "|") > -1) {
                                    if (affgblhasdrop > 0) {
                                        avalid = false;
                                    } else {
                                        affgblhasdrop++;
                                    }
                                }
                            }
                            if (masterbase == 70) {
                                if (notables > 0 && poecd["modifiers"]["seq"][poecd["modifiers"]["ind"][maff[gaff[j]["id"]][i]["mid"]]]["notable"] == "1") {
                                    avalid = false;
                                }
                            }
                            if (avalid) {
                                if (mgrp == poeaf_constants["crafted_mgrp"]) {
                                    affgblcrafted = true;
                                }
                                for (var zy = 0; zy < modgroup.length; zy++) {
                                    usedmgrps += modgroup[zy] + "|";
                                    affgblmgrps += modgroup[zy] + "|";
                                }
                                addcls = " picked";
                                picked++;
                                if (poecd["modifiers"]["seq"][poecd["modifiers"]["ind"][maff[gaff[j]["id"]][i]["mid"]]]["notable"] == "1") {
                                    notables++;
                                }
                                mgpicked = true;
                                addpick = "<div class='pick'><img src='images/manual/apick.png'/></div>";
                            }
                        }
                    }
                    chkpmod += mgrp + "-" + poecl["mod"][maff[gaff[j]["id"]][i]["mid"]] + "|";
                    var htypes = "";
                    if (poecd["modifiers"]["seq"][poecd["modifiers"]["ind"][maff[gaff[j]["id"]][i]["mid"]]]["mtypes"]) {
                        if (poecd["modifiers"]["seq"][poecd["modifiers"]["ind"][maff[gaff[j]["id"]][i]["mid"]]]["mtypes"].length > 1) {
                            var mtypes = poecd["modifiers"]["seq"][poecd["modifiers"]["ind"][maff[gaff[j]["id"]][i]["mid"]]]["mtypes"].substring(1, poecd["modifiers"]["seq"][poecd["modifiers"]["ind"][maff[gaff[j]["id"]][i]["mid"]]]["mtypes"].length - 1).split("|");
                            for (var zz = 0; zz < mtypes.length; zz++) {
                                htypes += "<div class='mt tmt" + mtypes[zz] + " sml_shadow' title='Fossil/Harvest Tag'>" + poecl["mtype"][mtypes[zz]] + "</div>";
                            }
                        }
                    }
                    vHTML += "<div class='affix mgrp mgrp" + mgrp + addcls + "' aid='" + maff[gaff[j]["id"]][i]["mid"] + "' aftype='" + aftype + "' tweight='" + maff[gaff[j]["id"]][i]["weight"] + "' mgrp='" + maff[gaff[j]["id"]][i]["mgrp"] + "'>";
                    var achilds = "";
                    if (maff[gaff[j]["id"]][i]["childs"].length > 0) {
                        maff[gaff[j]["id"]][i]["childs"].sort();
                        for (k = 0; k < maff[gaff[j]["id"]][i]["childs"].length; k++) {
                            achilds += "<div class='child'><img src='images/manual/smlinf_" + maff[gaff[j]["id"]][i]["childs"][k] + ".png'/></div>";
                        }
                    }
                    vHTML += "<div class='label'><div>" + addpick + poecl["mod"][maff[gaff[j]["id"]][i]["mid"]] + achilds + htypes + "</div></div>";
                    if (maff[gaff[j]["id"]][i]["val"] < 1) {
                        maff[gaff[j]["id"]][i]["val"] = 1;
                    }
                    vHTML += "<div class='value right'><div>" + maff[gaff[j]["id"]][i]["val"] + "</div></div>";
                    if (maff[gaff[j]["id"]][i]["vmod"] == 1) {
                        var vmod = "<span class='na'>N/A</span>";
                    } else {
                        var vmod = "x" + maff[gaff[j]["id"]][i]["vmod"];
                    }
                    vHTML += "<div class='pct right'><div>" + vmod + "</div></div>";
                    vHTML += "</div>";
                    cntaff++;
                }
            }
        }
    } else {
        var chkpmod = "|";
        for (var i = 0; i < maff.length; i++) {
            var mgrp = poecd["modifiers"]["seq"][poecd["modifiers"]["ind"][maff[i]["mid"]]]["id_mgroup"];
            if (chkpmod.indexOf("|" + mgrp + "-" + poecl["mod"][maff[i]["mid"]] + "|") > -1) {
            } else {
                var addcls = "";
                var addpick = "";
                if (bas && picked < maxpicks) {
                    var modgroup = poecd["modifiers"]["seq"][poecd["modifiers"]["ind"][maff[i]["mid"]]]["modgroups"];
                    var mconflict = false;
                    for (var zy = 0; zy < modgroup.length; zy++) {
                        if (usedmgrps.indexOf("|" + modgroup[zy] + "|") > -1 || affgblmgrps.indexOf("|" + modgroup[zy] + "|") > -1) {
                            mconflict == true;
                        }
                    }
                    if (mconflict || (affgblcrafted && mgrp == 11)) {
                    } else {
                        var avalid = true;
                        if (poeaf_constants["influence_mgrps"].indexOf("|" + mgrp + "|") > -1) {
                            if (affgblsinfs.indexOf("|" + mgrp + "|") > -1) {
                            } else {
                                if (affgblninfs < 2) {
                                    affgblninfs++;
                                    affgblsinfs += mgrp + "|";
                                } else {
                                    avalid = false;
                                }
                            }
                        } else {
                            if (poeaf_constants["dopick_mgrps"].indexOf("|" + mgrp + "|") > -1) {
                                if (affgblhasdrop > 0) {
                                    avalid = false;
                                } else {
                                    affgblhasdrop++;
                                }
                            }
                        }
                        if (masterbase == 70) {
                            if (notables > 0 && poecd["modifiers"]["seq"][poecd["modifiers"]["ind"][maff[i]["mid"]]]["notable"] == "1") {
                                avalid = false;
                            }
                        }
                        if (avalid) {
                            if (mgrp == 11) {
                                affgblcrafted = true;
                            }
                            for (var zy = 0; zy < modgroup.length; zy++) {
                                usedmgrps += modgroup[zy] + "|";
                                affgblmgrps += modgroup[zy] + "|";
                            }
                            addcls = " picked";
                            picked++;
                            if (poecd["modifiers"]["seq"][poecd["modifiers"]["ind"][maff[i]["mid"]]]["notable"] == "1") {
                                notables++;
                            }
                            addpick = "<div class='pick'><img src='images/manual/apick.png'/></div>";
                        }
                    }
                }
                chkpmod += mgrp + "-" + poecl["mod"][maff[i]["mid"]] + "|";
                var htypes = "";
                if (poecd["modifiers"]["seq"][poecd["modifiers"]["ind"][maff[i]["mid"]]]["mtypes"]) {
                    if (poecd["modifiers"]["seq"][poecd["modifiers"]["ind"][maff[i]["mid"]]]["mtypes"].length > 1) {
                        var mtypes = poecd["modifiers"]["seq"][poecd["modifiers"]["ind"][maff[i]["mid"]]]["mtypes"].substring(1, poecd["modifiers"]["seq"][poecd["modifiers"]["ind"][maff[i]["mid"]]]["mtypes"].length - 1).split("|");
                        for (var zz = 0; zz < mtypes.length; zz++) {
                            htypes += "<div class='mt tmt" + mtypes[zz] + " sml_shadow' title='Fossil/Harvest Tag'>" + poecl["mtype"][mtypes[zz]] + "</div>";
                        }
                    }
                }

                var smgrp = "";
                for (var zy = 0; zy < maff[i]["mgrp"].length; zy++) {
                    smgrp += ", " + maff[i]["mgrp"][zy];
                }
                smgrp = smgrp.substring(2, smgrp.length);

                vHTML += "<div class='affix mgrp mgrp" + mgrp + addcls + "' aid='" + maff[i]["mid"] + "' aftype='" + aftype + "' tweight='" + maff[i]["weight"] + "' mgrp='" + smgrp + "'>";
                var achilds = "";
                if (maff[i]["childs"].length > 0) {
                    maff[i]["childs"].sort();
                    for (k = 0; k < maff[i]["childs"].length; k++) {
                        achilds += "<div class='child'><img src='images/manual/smlinf_" + maff[i]["childs"][k] + ".png'/></div>";
                    }
                }
                vHTML += "<div class='label'><div>" + addpick + poecl["mod"][maff[i]["mid"]] + achilds + htypes + "</div></div>";
                if (maff[i]["val"] < 1) {
                    maff[i]["val"] = 1;
                }
                vHTML += "<div class='value right'><div>" + maff[i]["val"] + "</div></div>";
                if (maff[i]["vmod"] == 1) {
                    var vmod = "<span class='na'>N/A</span>";
                } else {
                    var vmod = "x" + maff[i]["vmod"];
                }
                vHTML += "<div class='pct right'><div>" + vmod + "</div></div>";
                vHTML += "</div>";
                cntaff++;
            }
        }
    }

    return vHTML;
}

function poec_affSplitMTags(mtypes) {
    var atypes = {};
    if (mtypes) {
        mtypes = mtypes.substring(1, mtypes.length - 1).split("|");
        for (var i = 0; i < mtypes.length; i++) {
            atypes[mtypes[i]] = true;
        }
    }
    return atypes;
}

function poec_affGetMTagsCat(mtags) {
    var is_attack = false;
    if (mtags[3] || mtags[33] || mtags[13] || mtags[29]) {
        is_attack = true;
    }
    var is_defence = false;
    if (mtags[4] || mtags[35] || (!is_attack && (mtags[1] || mtags[28]))) {
        is_defence = true;
    }
    var is_other = false;
    if (!is_attack && !is_defence) {
        is_other = true;
    }
    return {"offence": is_attack, "defence": is_defence, "other": is_other};
}

function poec_affOutputMtCats(mtcats) {
    var vRet = "";
    if (mtcats["other"]) {
        vRet += "<div class='mtcat other'>Utility</div>";
    }
    if (mtcats["defence"]) {
        vRet += "<div class='mtcat defence'>Defence</div>";
    }
    if (mtcats["offence"]) {
        vRet += "<div class='mtcat offence'>Offence</div>";
    }
    return vRet;
}

function poec_affApplyAffixHovers() {
    $("#poecAffResByType").find(".affix:not(.modgroup)").hover(function () {
        if ($("#poecBindGrpToolTip").length == 0) {
            $("<div>").attr("id", "poecBindGrpToolTip").addClass("med_shadow").appendTo($("body"));
        }
        var aid = $(this).attr("aid");
        var aftype = $(this).attr("aftype");
        var tweight = $(this).attr("tweight");
        var mgrp = $(this).attr("mgrp");
        var thispos = $(this).offset();

        var hovHTML = "";

        var mtypes = poec_affSplitMTags(poecd["modifiers"]["seq"][poecd["modifiers"]["ind"][aid]]["mtypes"]);
        var mtcats = poec_affGetMTagsCat(mtypes);

        if (poeaf_options["mgrouped"] == 0) {
            hovHTML += "<div class='modgroup aff'><div class='value'>" + mgrp + "</div>" + poec_affOutputMtCats(mtcats) + "</div>";
        }

        var ptype = "all";
        if (poeaf_options["slt"]) {
            ptype = "slot";
        }
        if (poeaf_options["bas"] || poeaf_options["bit"]) {
            ptype = "base";
            if (poeaf_options["bas"]) {
                var pbase = poeaf_options["bas"];
            } else {
                var pbase = poecd["bitems"]["seq"][poecd["bitems"]["ind"][poeaf_options["bit"]]]["id_base"];
            }
        }

        // Get power range
        var power = {"min": null, "max": null};
        switch (ptype) {
            case 'all' :
                power["max"] = [-1];
                power["min"] = [9999999];
                $.each(poecd["tiers"][aid], function (bkey, tiers) {
                    var tpow = poec_affGetMaxPower(tiers, 1);
                    if (tpow[0] > power["max"][0]) {
                        power["max"] = tpow;
                    }
                    var tpow = poec_affGetMaxPower(tiers, 0);
                    if (tpow[0] < power["min"][0]) {
                        power["min"] = tpow;
                    }
                });
                break;
            case 'slot' :
                var sbases = poeexd["slots"]["seq"][poeexd["slots"]["ind"][poeaf_options["slt"]]]["bases"];
                power["max"] = [-1];
                power["min"] = [9999999];
                for (var j = 0; j < sbases.length; j++) {
                    if (poecd["tiers"][aid][sbases[j]]) {
                        var tpow = poec_affGetMaxPower(poecd["tiers"][aid][sbases[j]], 1);
                        if (tpow[0] > power["max"][0]) {
                            power["max"] = tpow;
                        }
                        var tpow = poec_affGetMaxPower(poecd["tiers"][aid][sbases[j]], 0);
                        if (tpow[0] < power["min"][0]) {
                            power["min"] = tpow;
                        }
                    }
                }
                break;
            case 'base' :
                power["max"] = poec_affGetMaxPower(poecd["tiers"][aid][pbase], 1);
                power["min"] = poec_affGetMaxPower(poecd["tiers"][aid][pbase], 0);
                break;
        }

        if (poeaf_constants["pexcepts"].indexOf("|" + aid + "|") > -1) {
            var mname = [poecl["mod"][aid]];
        } else {
            var mname = poecl["mod"][aid].split(", ");
        }
        var vpnt = 0;
        var lpower = [];
        var tpower = [];
        var affHTML = "";
        for (var i = 0; i < mname.length; i++) {
            if (mname[i].indexOf("#") > -1) {
                var tallypow = false;
                if (mname.length > 1) {
                    if (powerlevels["all"][mname[i]] != undefined) {
                        tpower.push(powerlevels["all"][mname[i]]);
                        lpower[tpower.length - 1] = 0;
                        tallypow = true;
                    }
                } else {
                    if (powerlevels[aftype][mname[i]] != undefined) {
                        tpower.push(powerlevels[aftype][mname[i]]);
                        lpower[tpower.length - 1] = 0;
                        tallypow = true;
                    }
                }
                var nvals = mname[i].split("#");
                nvals = nvals.length - 1;
                for (var j = 0; j < nvals; j++) {
                    if (power["min"][vpnt] == power["max"][vpnt]) {
                        var repp = power["min"][vpnt];
                        if (tallypow) {
                            lpower[tpower.length - 1] += power["min"][vpnt];
                        }
                    } else {
                        var repp = "(" + power["min"][vpnt] + "-" + power["max"][vpnt] + ")";
                        if (tallypow) {
                            lpower[tpower.length - 1] += power["max"][vpnt];
                        }
                    }
                    mname[i] = mname[i].replace("#", "<span class='mval'>" + repp + "</span>");
                    vpnt++;
                }
                if (tallypow) {
                    lpower[tpower.length - 1] = lpower[tpower.length - 1] / nvals;
                }
                affHTML += "<div class='mpart'>" + mname[i] + "</div>";
            }
        }
        if (affHTML != "") {
            hovHTML += "<div class='gaffix'>";
            hovHTML += affHTML;
            hovHTML += "</div>";
        }

        if (!wbyaffid[aid]) {
            wbyaffid[aid] = 0;
        }
        if (wbyaffid[aid] > 0 && poeaf_options["modrarity"] == 1) {
            hovHTML += "<div class='gaffix mcomp'><div class='div_stable'>";
            hovHTML += "<div class='header'><div>" + applyLang("Rarity") + "</div><div></div><div></div></div>";
            hovHTML += "<div><div>" + applyLang("Min/Max " + aftype + " Weight") + "</div><div>" + minweights[aftype] + "</div><div>" + maxweights[aftype] + "</div></div>";
            hovHTML += "<div><div>" + applyLang("Affix Weight") + "</div><div>" + wbyaffid[aid] + "</div><div>" + number_format((wbyaffid[aid] / maxweights[aftype] * 100), 0, ".", " ") + "<span class='sml'>%</span></div></div>";
            hovHTML += "<div><div>" + applyLang("Modgroup Weight") + "</div><div>" + wbymgrps[aftype][mgrp] + "</div><div>" + number_format((wbymgrps[aftype][mgrp] / maxweights[aftype] * 100), 0, ".", " ") + "<span class='sml'>%</span></div></div>";
            hovHTML += "</div></div>";
        }
        if (lpower.length > 0) {
            hovHTML += "<div class='gaffix mcomp'><div class='div_stable'>";
            hovHTML += "<div class='header'><div>" + applyLang("Power Level") + "</div>";
            for (var i = 0; i < tpower.length; i++) {
                if (tpower.length == 1) {
                    ht = "TOT";
                } else {
                    ht = "P" + (i + 1);
                }
                ;
                hovHTML += "<div>" + ht + "</div>";
            }
            if (tpower.length > 1) {
                hovHTML += "<div>TOT</div>";
            }
            hovHTML += "</div>";
            hovHTML += "<div><div>All power</div>";
            var ttpow = 0;
            for (var i = 0; i < tpower.length; i++) {
                ttpow += tpower[i];
                hovHTML += "<div>" + tpower[i] + "</div>";
            }
            if (tpower.length > 1) {
                hovHTML += "<div>" + ttpow + "</div>";
            }
            var llpow = 0;
            hovHTML += "</div><div><div>Affix power</div>";
            for (var i = 0; i < lpower.length; i++) {
                llpow += lpower[i];
                hovHTML += "<div>" + lpower[i] + "</div>";
            }
            if (tpower.length > 1) {
                hovHTML += "<div>" + llpow + "</div>";
            }
            hovHTML += "</div><div class='totline'><div>Percentages</div>";
            for (var i = 0; i < lpower.length; i++) {
                hovHTML += "<div>" + number_format((lpower[i] / tpower[i] * 100), 0, ".", " ") + "<span class='sml'>%</span></div>";
            }
            if (tpower.length > 1) {
                hovHTML += "<div>" + number_format((llpow / ttpow * 100), 0, ".", " ") + "<span class='sml'>%</span></div>";
            }
            hovHTML += "</div></div></div>";
        }

        if (aftype == "suffix") {
            $("#poecBindGrpToolTip").css({"right": wsWidth - (thispos.left - 20), "left": "auto", "top": thispos.top});
        } else {
            $("#poecBindGrpToolTip").css({
                "left": thispos.left + $(this).outerWidth(),
                "right": "auto",
                "top": thispos.top
            });
        }
        if (hovHTML != "") {
            $("#poecBindGrpToolTip").html(hovHTML).show();
        } else {
            $("#poecBindGrpToolTip").html("").hide();
        }
    }, function () {
        $("#poecBindGrpToolTip").hide();
    });
}

function poec_affAMergeCorr(sarr, narr) {
    if (narr) {
        var tarr = {};
        for (var i = 0; i < sarr.length; i++) {
            tarr[sarr[i]] = true;
        }
        var farr = [];
        for (var j = 0; j < narr.length; j++) {
            if (tarr[narr[j]]) {
                farr.push(narr[j]);
            }
        }
        return farr;
    } else {
        return sarr;
    }
}

function poec_affAMergeAdd(sarr, narr) {
    if (narr) {
        var tarr = {};
        for (var i = 0; i < sarr.length; i++) {
            tarr[sarr[i]] = true;
        }
        for (var j = 0; j < narr.length; j++) {
            if (!tarr[narr[j]]) {
                sarr.push(narr[j]);
            }
        }
        return sarr;
    } else {
        return sarr;
    }
}

function sortByVALDesc(arr) {
    arr.sort(sortColByVAL);
    arr.reverse();
    return arr;
}

function sortColByVAL(a, b) {
    if (a["val"] === b["val"]) {
        return 0;
    } else {
        return (a["val"] < b["val"]) ? -1 : 1;
    }
}

function sortColByNAME(a, b) {
    if (a["name"] < b["name"]) {
        return -1;
    }
    if (a["name"] > b["name"]) {
        return 1;
    }
    return 0;
}

/************/
/* APPRAISE */
/************/
poecap = {"rvslot": null, "bmpart": null, "powers": {}, "tops": {}, "maxabsl": {}};

function poec_initAppraise() {
    if ($("#poecAppraise").length == 0) {
        vHTML = "";
        //vHTML+="<div class='gen_msg medium' style='margin:0px 0px 10px 0px;'>"+poeaf_constants["experimental"]+"</div>";
        vHTML += "<div class='gen_msg lowkey medium' style='margin:0px 0px 30px 0px;'>" + poeaf_constants["disclaimer"] + "<span class='highlight'>" + poec_lastladdercrawl + "</span></div>";
        vHTML += "<div id='poecAffOptions' class='app'>";
        vHTML += "<div id='poecAppLoading' class='poec_loading_msg'>" + applyLang("Loading Appraise data...") + "</div>";
        vHTML += "<div id='poecAppImportBtn' class='mcui-button dark big' onClick='poec_importItem(\"app\")'>" + applyLang("Click here to import an item to appraise") + "</div>";
        vHTML += "<div id='poecAffFilterHolder' class='app'>";
        vHTML += '<div class="poec_affopt"><div class="mcui-checkbox ischecked med_shadow" id="poecAppIncludeResists">' + applyLang("Consider Resistances") + '</div></div>';
        vHTML += '<div class="poec_affopt"><div class="mcui-checkbox ischecked med_shadow" id="poecAppIncludeAttributes">' + applyLang("Consider Attributes") + '</div></div>';
        vHTML += "<div class='mcui-button green' onClick='poec_importItem(\"app\")'>" + applyLang("Import a new item") + "</div>";
        vHTML += "</div></div>";
        vHTML += "<div id='poecAppDetZone' style='display:none;' class='div_stable'><div>";
        vHTML += "<div class='det'><div id='poecAppDet' class='coe_dtbl'></div></div>";
        vHTML += "<div class='item'><div id='poecAppItem'></div></div>";
        vHTML += "</div></div>";
        vHTML += "<div id='poecAppResult'></div>";

        $("<div>").attr("id", "poecAppraise").html(vHTML).appendTo($("#poecAppraiseZone"));

        setTimeout(function () {
            poec_appInitLoad()
        }, 1);
    }
}

function poec_appInitLoad() {
    var t0 = performance.now();

    // Rework data for appraise
    poecap["rvslot"] = {};
    for (var i = 0; i < poeexd["slots"]["seq"].length; i++) {
        for (var j = 0; j < poeexd["slots"]["seq"][i]["bases"].length; j++) {
            poecap["rvslot"][poeexd["slots"]["seq"][i]["bases"][j]] = poeexd["slots"]["seq"][i]["id"];
        }
    }

    poecap["bmpart"] = {};
    poecap["tops"] = {};
    poecap["maxabsl"] = {};
    $.each(poeaf["njdata"], function (njkey, njdat) {
        $.each(njdat["a"], function (amkey, amcnt) {
            if (njdat["b"] != "na") {
                if (poecap["maxabsl"][poecap["rvslot"][njdat["b"]]] == undefined) {
                    poecap["maxabsl"][poecap["rvslot"][njdat["b"]]] = poecd["bgroups"]["seq"][poecd["bgroups"]["ind"][poecd["bases"]["seq"][poecd["bases"]["ind"][njdat["b"]]]["id_bgroup"]]]["max_affix"];
                }
                var cmbk = njdat["c"] + "-" + njdat["s"];
                //if(poeaf_constants["noskillid"].indexOf("|"+njdat["s"]+"|")>-1){}else{
                if (poecap["tops"][poecap["rvslot"][njdat["b"]]] == undefined) {
                    poecap["tops"][poecap["rvslot"][njdat["b"]]] = {"asc": {}, "skl": {}, "cmb": {}};
                }
                if (poecap["tops"][poecap["rvslot"][njdat["b"]]]["asc"][njdat["c"]] == undefined) {
                    poecap["tops"][poecap["rvslot"][njdat["b"]]]["asc"][njdat["c"]] = {};
                }
                if (poecap["tops"][poecap["rvslot"][njdat["b"]]]["skl"][njdat["s"]] == undefined) {
                    poecap["tops"][poecap["rvslot"][njdat["b"]]]["skl"][njdat["s"]] = {};
                }
                if (poecap["tops"][poecap["rvslot"][njdat["b"]]]["cmb"][cmbk] == undefined) {
                    poecap["tops"][poecap["rvslot"][njdat["b"]]]["cmb"][cmbk] = {};
                }
                if (poecap["bmpart"][amkey] == undefined) {
                    poecap["bmpart"][amkey] = {};
                }
                if (poecap["bmpart"][amkey][poecap["rvslot"][njdat["b"]]] == undefined) {
                    poecap["bmpart"][amkey][poecap["rvslot"][njdat["b"]]] = {};
                }
                if (poecap["bmpart"][amkey][poecap["rvslot"][njdat["b"]]][cmbk] == undefined) {
                    poecap["bmpart"][amkey][poecap["rvslot"][njdat["b"]]][cmbk] = 0;
                }
                poecap["bmpart"][amkey][poecap["rvslot"][njdat["b"]]][cmbk] += amcnt;
                if (poeaf["affind"]["base"][njdat["b"]][amkey]) {
                    for (var j = 0; j < poeaf["affind"]["base"][njdat["b"]][amkey].length; j++) {
                        var mmkey = poeaf["affind"]["base"][njdat["b"]][amkey][j]["i"];

                        if (poecap["tops"][poecap["rvslot"][njdat["b"]]]["asc"][njdat["c"]][mmkey] == undefined) {
                            poecap["tops"][poecap["rvslot"][njdat["b"]]]["asc"][njdat["c"]][[mmkey]] = 0;
                        }
                        if (poecap["tops"][poecap["rvslot"][njdat["b"]]]["skl"][njdat["s"]][mmkey] == undefined) {
                            poecap["tops"][poecap["rvslot"][njdat["b"]]]["skl"][njdat["s"]][[mmkey]] = 0;
                        }
                        if (poecap["tops"][poecap["rvslot"][njdat["b"]]]["cmb"][cmbk][mmkey] == undefined) {
                            poecap["tops"][poecap["rvslot"][njdat["b"]]]["cmb"][cmbk][[mmkey]] = 0;
                        }
                        poecap["tops"][poecap["rvslot"][njdat["b"]]]["asc"][njdat["c"]][mmkey] += amcnt;
                        poecap["tops"][poecap["rvslot"][njdat["b"]]]["skl"][njdat["s"]][mmkey] += amcnt;
                        poecap["tops"][poecap["rvslot"][njdat["b"]]]["cmb"][cmbk][mmkey] += amcnt;
                    }
                }
                //}
            }
        });
    });

    // Order tops and picks
    $.each(poecap["tops"], function (slotkey, sarrs) {
        poecap["tops"][slotkey]["asc"] = poec_appOrderTops(sarrs["asc"], poecap["maxabsl"][slotkey], "asc", slotkey);
        poecap["tops"][slotkey]["skl"] = poec_appOrderTops(sarrs["skl"], poecap["maxabsl"][slotkey], "skl", slotkey);
        poecap["tops"][slotkey]["cmb"] = poec_appOrderTops(sarrs["cmb"], poecap["maxabsl"][slotkey], "cmb", slotkey);
    });

    $("#poecAppLoading").hide();
    $("#poecAffLastCrawl").show();
    $("#poecAppDetZone").show();
    $("#poecAppImportBtn").css({"display": "inline-block"});

    //console.log(poecap["tops"]);

    var t1 = performance.now();
    console.log("Appraise data loading took " + (t1 - t0) + " milliseconds.");
}

function poec_appOrderTops(sarr, maxaff, rtype, slotkey) {
    $.each(sarr, function (skey, srecs) {
        var marr = [];
        $.each(srecs, function (amkey, amcnt) {
            marr.push({"key": amkey, "val": amcnt});
        });
        marr.sort(sortColByVAL);
        marr.reverse();
        var maxafbt = Math.floor(maxaff / 2);
        var curaffs = 0;
        var curabyflt = {"nores": 0, "noatt": 0, "noall": 0};
        var curafbt = {
            "prefix": 0, "suffix": 0, "byflt": {
                "nores": {"prefix": 0, "suffix": 0},
                "noatt": {"prefix": 0, "suffix": 0},
                "noall": {"prefix": 0, "suffix": 0}
            }
        };
        var curinf = [];
        var curinfbyflt = {
            "nores": [],
            "noatt": [],
            "noall": []
        };
        var strinf = "|";
        var strinfbyflt = {
            "nores": "|",
            "noatt": "|",
            "noall": "|"
        };
        var strmgrps = "|";
        var strmgrpsbyflt = {
            "nores": "|",
            "noatt": "|",
            "noall": "|"
        };
        var hasdrop = false;
        var hasdropbyflt = {
            "nores": false,
            "noatt": false,
            "noall": false
        };
        var tarr = {
            "prefix": [], "suffix": [], "tpow": 0, "byflt": {
                "yall": {"prefix": [], "suffix": [], "tpow": 0},
                "nores": {"prefix": [], "suffix": [], "tpow": 0},
                "noatt": {"prefix": [], "suffix": [], "tpow": 0},
                "noall": {"prefix": [], "suffix": [], "tpow": 0}
            }
        };
        for (var i = 0; i < marr.length; i++) {
            if (poecd["modifiers"]["seq"][poecd["modifiers"]["ind"][marr[i]["key"]]] != undefined) {
                var atype = poecd["modifiers"]["seq"][poecd["modifiers"]["ind"][marr[i]["key"]]]["affix"];
                var mgrp = poecd["modifiers"]["seq"][poecd["modifiers"]["ind"][marr[i]["key"]]]["id_mgroup"];
                var modgrp = poecd["modifiers"]["seq"][poecd["modifiers"]["ind"][marr[i]["key"]]]["modgroups"];
                var hasres = poecd["modifiers"]["seq"][poecd["modifiers"]["ind"][marr[i]["key"]]]["hr"];
                var hasatt = poecd["modifiers"]["seq"][poecd["modifiers"]["ind"][marr[i]["key"]]]["ha"];
                if (curafbt[atype] < maxafbt) {
                    var mconflict = false;
                    for (var zy = 0; zy < modgrp.length; zy++) {
                        if (strmgrps.indexOf("|" + modgrp[zy] + "|") > -1) {
                            mconflict = true;
                        }
                    }
                    if (mconflict) {
                    } else {
                        var pass = true;
                        if (poeaf_constants["influence_mgrps"].indexOf("|" + mgrp + "|") > -1) {
                            if (strinf.indexOf("|" + mgrp + "|") > -1) {
                            } else {
                                if (curinf.length >= 2) {
                                    pass = false;
                                } else {
                                    curinf.push(mgrp);
                                    strinf += mgrp + "|";
                                }
                            }
                        } else {
                            if (poeaf_constants["droponly_mgrps"].indexOf("|" + mgrp + "|") > -1) {
                                if (hasdrop) {
                                    pass = false;
                                } else {
                                    hasdrop = true;
                                }
                            }
                        }
                        if (pass) {
                            curaffs++;
                            curafbt[atype]++;
                            for (var zy = 0; zy < modgrp.length; zy++) {
                                strmgrps += modgrp[zy] + "|";
                            }
                            tarr[atype].push(marr[i]);
                            tarr["tpow"] += marr[i]["val"];
                            tarr["byflt"]["yall"][atype].push(marr[i]);
                            tarr["byflt"]["yall"]["tpow"] += marr[i]["val"];
                        }
                    }
                }
                if (curafbt["byflt"]["nores"][atype] < maxafbt) {
                    // NO RES
                    if (!hasres) {
                        var mconflict = false;
                        for (var zy = 0; zy < modgrp.length; zy++) {
                            if (strmgrpsbyflt["nores"].indexOf("|" + modgrp[zy] + "|") > -1) {
                                mconflict = true;
                            }
                        }
                        if (mconflict) {
                        } else {
                            var pass = true;
                            if (poeaf_constants["influence_mgrps"].indexOf("|" + mgrp + "|") > -1) {
                                if (strinfbyflt["nores"].indexOf("|" + mgrp + "|") > -1) {
                                } else {
                                    if (curinfbyflt["nores"].length >= 2) {
                                        pass = false;
                                    } else {
                                        curinfbyflt["nores"].push(mgrp);
                                        strinfbyflt["nores"] += mgrp + "|";
                                    }
                                }
                            } else {
                                if (poeaf_constants["droponly_mgrps"].indexOf("|" + mgrp + "|") > -1) {
                                    if (hasdropbyflt["nores"]) {
                                        pass = false;
                                    } else {
                                        hasdropbyflt["nores"] = true;
                                    }
                                }
                            }
                            if (pass) {
                                curabyflt["nores"]++;
                                curafbt["byflt"]["nores"][atype]++;
                                for (var zy = 0; zy < modgrp.length; zy++) {
                                    strmgrpsbyflt["nores"] += modgrp[zy] + "|";
                                }
                                tarr["byflt"]["nores"][atype].push(marr[i]);
                                tarr["byflt"]["nores"]["tpow"] += marr[i]["val"];
                            }
                        }
                    }
                }
                if (curafbt["byflt"]["noatt"][atype] < maxafbt) {
                    // NO ATT
                    if (!hasatt) {
                        var mconflict = false;
                        for (var zy = 0; zy < modgrp.length; zy++) {
                            if (strmgrpsbyflt["noatt"].indexOf("|" + modgrp[zy] + "|") > -1) {
                                mconflict = true;
                            }
                        }
                        if (mconflict) {
                        } else {
                            var pass = true;
                            if (poeaf_constants["influence_mgrps"].indexOf("|" + mgrp + "|") > -1) {
                                if (strinfbyflt["noatt"].indexOf("|" + mgrp + "|") > -1) {
                                } else {
                                    if (curinfbyflt["noatt"].length >= 2) {
                                        pass = false;
                                    } else {
                                        curinfbyflt["noatt"].push(mgrp);
                                        strinfbyflt["noatt"] += mgrp + "|";
                                    }
                                }
                            } else {
                                if (poeaf_constants["droponly_mgrps"].indexOf("|" + mgrp + "|") > -1) {
                                    if (hasdropbyflt["noatt"]) {
                                        pass = false;
                                    } else {
                                        hasdropbyflt["noatt"] = true;
                                    }
                                }
                            }
                            if (pass) {
                                curabyflt["noatt"]++;
                                curafbt["byflt"]["noatt"][atype]++;
                                for (var zy = 0; zy < modgrp.length; zy++) {
                                    strmgrpsbyflt["noatt"] += modgrp[zy] + "|";
                                }
                                tarr["byflt"]["noatt"][atype].push(marr[i]);
                                tarr["byflt"]["noatt"]["tpow"] += marr[i]["val"];
                            }
                        }
                    }
                }
                if (curafbt["byflt"]["noall"][atype] < maxafbt) {
                    // NO ALL
                    if (!hasatt && !hasres) {
                        var mconflict = false;
                        for (var zy = 0; zy < modgrp.length; zy++) {
                            if (strmgrpsbyflt["noall"].indexOf("|" + modgrp[zy] + "|") > -1) {
                                mconflict = true;
                            }
                        }
                        if (mconflict) {
                        } else {
                            var pass = true;
                            if (poeaf_constants["influence_mgrps"].indexOf("|" + mgrp + "|") > -1) {
                                if (strinfbyflt["noall"].indexOf("|" + mgrp + "|") > -1) {
                                } else {
                                    if (curinfbyflt["noall"].length >= 2) {
                                        pass = false;
                                    } else {
                                        curinfbyflt["noall"].push(mgrp);
                                        strinfbyflt["noall"] += mgrp + "|";
                                    }
                                }
                            } else {
                                if (poeaf_constants["droponly_mgrps"].indexOf("|" + mgrp + "|") > -1) {
                                    if (hasdropbyflt["noall"]) {
                                        pass = false;
                                    } else {
                                        hasdropbyflt["noall"] = true;
                                    }
                                }
                            }
                            if (pass) {
                                curabyflt["noall"]++;
                                curafbt["byflt"]["noall"][atype]++;
                                for (var zy = 0; zy < modgrp.length; zy++) {
                                    strmgrpsbyflt["noall"] += modgrp[zy] + "|";
                                }
                                tarr["byflt"]["noall"][atype].push(marr[i]);
                                tarr["byflt"]["noall"]["tpow"] += marr[i]["val"];
                            }
                        }
                    }
                }
                if (curaffs >= maxaff && curabyflt["nores"] >= maxaff && curabyflt["noatt"] >= maxaff && curabyflt["noall"] >= maxaff) {
                    break;
                }
            }
        }
        sarr[skey] = tarr;
    });
    return sarr;
}

function poec_appGetSpecTops() {
    var iresists = $("#poecAppIncludeResists").mcuiCheck().getVal();
    var iattributes = $("#poecAppIncludeAttributes").mcuiCheck().getVal();

    var spectops = "yall";
    if (iresists == 0 && iattributes == 0) {
        spectops = "noall";
    } else {
        if (iresists == 0) {
            spectops = "nores";
        } else {
            if (iattributes == 0) {
                spectops = "noatt";
            }
        }
    }
    return spectops;
}

var crapp_item = null;
var crapp_slot = null;
var crapp_affids = null;
var crapp_allmods = null;
var crapp_apppnts = null;
var crapp_appmcor = null;
var crapp_ntoggled = 0;

function poec_appImportDone() {
    crapp_item = poec_parseImportData();
    var nidata = {
        "quality": crapp_item["settings"]["quality"],
        "catalyst": poec_itemImportParams["catalysts"],
        "affixes": crapp_item["crsets"]["affixes"],
        "implicits": crapp_item["settings"]["implicits"],
        "enchant": "",
        "influences": crapp_item["settings"]["influences"],
        "rarity": crapp_item["settings"]["rarity"],
        "ilvl": crapp_item["settings"]["ilvl"],
        "base": crapp_item["settings"]["base"]
    };
    var ihtml = poec_simGetFullItem(nidata, crapp_item["settings"]["bitem"], "Item", "appraise");
    $("#poecAppItem").html(ihtml).show();

    for (var i = 0; i < crapp_item["crsets"]["affixes"].length; i++) {
        crapp_item["crsets"]["affixes"][i]["toggled"] = true;
        crapp_ntoggled++;
    }

    $("#poecAppItem").find(".affix.taff").click(function () {
        var aind = parseInt($(this).attr("aind"));
        var refresh = true;
        if ($(this).hasClass("ignore")) {
            crapp_ntoggled++;
            $(this).removeClass("ignore");
            crapp_item["crsets"]["affixes"][aind]["toggled"] = true;
        } else {
            if (crapp_ntoggled > 1) {
                crapp_ntoggled--;
                $(this).addClass("ignore");
                crapp_item["crsets"]["affixes"][aind]["toggled"] = false;
            } else {
                refresh = false;
            }

        }
        if (refresh) {
            setTimeout(function () {
                poec_appAppraise();
            }, 10);
        }
    });

    poec_appAppraise();
}

function poec_appAppraise() {
    /*****************/
    /* Appraise item */
    /*****************/

    if (!$("#poecAffFilterHolder.app").is(":visible")) {
        $("#poecAffFilterHolder.app").show();
        $("#poecAppImportBtn").hide();
        $("#poecAffOptions.app").find(".mcui-checkbox").mcuiCheck({
            "change": function () {
                poec_appImportDone();
            }
        });
    }

    spectops = poec_appGetSpecTops();

    // Find slot
    var islot = poecap["rvslot"][crapp_item["settings"]["base"]];
    crapp_slot = islot;

    crapp_affids = "|";
    var arraffcor = {};
    for (var i = 0; i < crapp_item["crsets"]["affixes"].length; i++) {
        if (crapp_item["crsets"]["affixes"][i]["toggled"]) {
            crapp_item["crsets"]["affixes"][i]["ampow"] = 0;
            crapp_affids += crapp_item["crsets"]["affixes"][i]["id"] + "|";
            arraffcor[crapp_item["crsets"]["affixes"][i]["id"]] = [];
        }
    }

    var strallmodp = "|";
    crapp_allmods = [];
    crapp_appmcor = {};
    $.each(poeaf["affind"]["base"][crapp_item["settings"]["base"]], function (modcor, marr) {
        if (marr != null) {
            for (var j = 0; j < marr.length; j++) {
                if (crapp_affids.indexOf("|" + marr[j]["i"] + "|") > -1) {
                    if (crapp_appmcor[marr[j]["i"]] == undefined) {
                        crapp_appmcor[marr[j]["i"]] = "|";
                    }
                    if (crapp_appmcor[marr[j]["i"]].indexOf("|" + modcor + "|") > -1) {
                    } else {
                        crapp_appmcor[marr[j]["i"]] += modcor + "|";
                    }
                    arraffcor[marr[j]["i"]].push({
                        "modcor": modcor,
                        "moddat": marr[j]
                    });
                    if (strallmodp.indexOf("|" + modcor + "|") > -1) {
                    } else {
                        strallmodp += modcor + "|";
                        crapp_allmods.push(modcor);
                    }
                }
            }
        }
    });

    crapp_apppnts = {"asc": {}, "skl": {}, "cmb": {}};
    for (var i = 0; i < crapp_allmods.length; i++) {
        $.each(poecap["bmpart"][crapp_allmods[i]][islot], function (cmbkey, cmbcnt) {
            if (crapp_apppnts["cmb"][cmbkey] == undefined) {
                crapp_apppnts["cmb"][cmbkey] = 0;
            }
            var scmb = cmbkey.split("-");
            if (crapp_apppnts["asc"][scmb[0]] == undefined) {
                crapp_apppnts["asc"][scmb[0]] = 0;
            }
            if (crapp_apppnts["skl"][scmb[1]] == undefined) {
                crapp_apppnts["skl"][scmb[1]] = 0;
            }
            crapp_apppnts["cmb"][cmbkey] += cmbcnt;
            crapp_apppnts["asc"][scmb[0]] += cmbcnt;
            crapp_apppnts["skl"][scmb[1]] += cmbcnt;
        });
    }

    // Reorder to sort
    var reordarr = {"asc": [], "skl": [], "cmb": []};
    $.each(crapp_apppnts["asc"], function (key, val) {
        reordarr["asc"].push({"key": key, "val": 0, "prv": 0, "score": val, "power": 0, "max": 0});
    });
    $.each(crapp_apppnts["skl"], function (key, val) {
        reordarr["skl"].push({"key": key, "val": 0, "prv": 0, "score": val, "power": 0, "max": 0});
    });
    $.each(crapp_apppnts["cmb"], function (key, val) {
        reordarr["cmb"].push({"key": key, "val": 0, "prv": 0, "score": val, "power": 0, "max": 0});
    });

    // Modify score by prevalence
    for (var i = 0; i < reordarr["asc"].length; i++) {
        reordarr["asc"][i]["max"] = poecap["tops"][islot]["asc"][reordarr["asc"][i]["key"]]["byflt"][spectops]["tpow"];
        reordarr["asc"][i]["prv"] = poeaf["mindex"]["ascls"][reordarr["asc"][i]["key"]].length;
        reordarr["asc"][i]["val"] = reordarr["asc"][i]["score"] / reordarr["asc"][i]["max"];
    }
    for (var i = 0; i < reordarr["skl"].length; i++) {
        reordarr["skl"][i]["max"] = poecap["tops"][islot]["skl"][reordarr["skl"][i]["key"]]["byflt"][spectops]["tpow"];
        reordarr["skl"][i]["prv"] = poeaf["mindex"]["skill"][reordarr["skl"][i]["key"]].length;
        reordarr["skl"][i]["val"] = reordarr["skl"][i]["score"] / reordarr["skl"][i]["max"];
    }
    for (var i = 0; i < reordarr["cmb"].length; i++) {
        var scmb = reordarr["cmb"][i]["key"].split("-");
        var parr = jQuery.parseJSON(JSON.stringify(poeaf["mindex"]["ascls"][scmb[0]]));
        parr = poec_affAMergeCorr(parr, poeaf["mindex"]["skill"][scmb[1]]);
        reordarr["cmb"][i]["max"] = poecap["tops"][islot]["cmb"][reordarr["cmb"][i]["key"]]["byflt"][spectops]["tpow"];
        reordarr["cmb"][i]["prv"] = parr.length;
        reordarr["cmb"][i]["val"] = reordarr["cmb"][i]["score"] / reordarr["cmb"][i]["max"];
    }

    // Filter low prevalence
    reordarr["skl"] = poec_appFilterPrevalence(reordarr["skl"]);
    reordarr["cmb"] = poec_appFilterPrevalence(reordarr["cmb"]);

    // Sort
    reordarr["asc"].sort(sortColByVAL);
    reordarr["asc"].reverse();
    reordarr["skl"].sort(sortColByVAL);
    reordarr["skl"].reverse();
    reordarr["cmb"].sort(sortColByVAL);
    reordarr["cmb"].reverse();
    //console.log(reordarr);

    var vHTML = "";
    vHTML += poec_appOutputResult(reordarr, "cmb");
    vHTML += poec_appOutputResult(reordarr, "skl");
    vHTML += poec_appOutputResult(reordarr, "asc");

    $("#poecAppResult").html(vHTML);
    $("#poecAppResult").find(".affix").click(function () {
        poec_appHLSel(this);
    });

    $("#poecAppResType.cmb").find(".affix:first").click();
}

var poec_apptoaff = null;

function poec_appGoToAff(rtype, rkey) {
    var fparam = {"asc": null, "skl": null, "slot": crapp_slot};
    switch (rtype) {
        case 'asc' :
            fparam["asc"] = rkey;
            break;
        case 'skl' :
            fparam["skl"] = rkey;
            break;
        case 'cmb' :
            rkey = rkey.split("-");
            fparam["asc"] = rkey[0];
            fparam["skl"] = rkey[1];
            break;
    }
    if ($("#poecAffinities").length == 0) {
        poec_apptoaff = fparam;
    } else {
        poec_affForceSelect(fparam);
    }
    $("#affinitiesTab").click();
}

function poec_appHLSel(vThis) {
    var rtype = $(vThis).attr("rtype");
    var rind = $(vThis).attr("rind");
    var rkey = $(vThis).attr("key");
    var rtitle = $(vThis).find(".label").text();

    $("#poecAppResult").find(".selected").removeClass("selected");
    $(vThis).addClass("selected");

    spectops = poec_appGetSpecTops();

    var vHTML = "";

    var nkeys = rkey.split("-");
    var nasc = nkeys[0];
    var nskl = (rtype == "skl") ? nkeys[0] : nkeys[1];

    var ninjaget = "";
    ninjaget += (rtype == "cmb" || rtype == "asc") ? "&class=" + poeexd["classes"]["seq"][poeexd["classes"]["ind"][nasc]]["name_class"] : "";
    ninjaget += (rtype == "cmb" || rtype == "skl") ? "&skill=" + poeexd["gems"]["seq"][poeexd["gems"]["ind"][nskl]]["name_gem"].replace(/ /g, "-") : "";

    vHTML += "<div class='title'>" + rtitle + "<div class='affbtn mcui-button dark' onClick='poec_appGoToAff(\"" + rtype + "\",\"" + rkey + "\")'>Affinities</div>";
    vHTML += "<div id='poecAffNinjaLinkApp'><a href='https://poe.ninja/challenge/builds?" + ninjaget.substring(1, ninjaget.length) + "' target='_blank'><img src='images/manual/pnbtn.png' class='idle'><img src='images/manual/pnbtno.png' class='over'></a></div>";
    vHTML += "</div>";

    vHTML += "<div class='mods div_stable med_shadow'>";
    vHTML += "<div class='header'>";
    vHTML += "<div></div>";
    vHTML += "<div>Modifier</div>";
    vHTML += "<div class='right'>Value</div>";
    vHTML += "<div class='right'>Score</div>";
    vHTML += "<div class='right'>Match</div>";
    vHTML += "<div class='right'>Power</div>";
    vHTML += "</div>";
    var iaffind = {};
    for (var i = 0; i < crapp_item["crsets"]["affixes"].length; i++) {
        if (crapp_item["crsets"]["affixes"][i]["toggled"]) {
            crapp_item["crsets"]["affixes"][i]["ampow"] = 0;
            iaffind[crapp_item["crsets"]["affixes"][i]["id"]] = i;
        }
    }
    for (var i = 0; i < crapp_allmods.length; i++) {
        var ampow = 0;
        $.each(poecap["bmpart"][crapp_allmods[i]][crapp_slot], function (cmbkey, cmbcnt) {
            var scmb = cmbkey.split("-");
            switch (rtype) {
                case 'asc' :
                    if (scmb[0] == rkey) {
                        ampow += cmbcnt;
                    }
                    break;
                case 'skl' :
                    if (scmb[1] == rkey) {
                        ampow += cmbcnt;
                    }
                    break;
                case 'cmb' :
                    if (cmbkey == rkey) {
                        ampow += cmbcnt;
                    }
                    break;
            }
        });
        for (var j = 0; j < crapp_item["crsets"]["affixes"].length; j++) {
            if (crapp_item["crsets"]["affixes"][j]["toggled"]) {
                if (crapp_appmcor[crapp_item["crsets"]["affixes"][j]["id"]] != undefined) {
                    if (crapp_appmcor[crapp_item["crsets"]["affixes"][j]["id"]].indexOf("|" + crapp_allmods[i] + "|") > -1) {
                        crapp_item["crsets"]["affixes"][j]["ampow"] += ampow;
                    }
                }
            }
        }
    }
    // Reorder by ampow
    var bampow = [];
    for (var j = 0; j < crapp_item["crsets"]["affixes"].length; j++) {
        if (crapp_item["crsets"]["affixes"][j]["toggled"]) {
            bampow.push({
                "key": crapp_item["crsets"]["affixes"][j]["id"],
                "val": crapp_item["crsets"]["affixes"][j]["ampow"]
            });
        }
    }
    bampow.sort(sortColByVAL);
    bampow.reverse();
    var toppnts = {"prefix": 0, "suffix": 0};
    var ratord = [];
    var lastppow = {"prefix": 0, "suffix": 0};
    for (var i = 0; i < bampow.length; i++) {
        var tatype = crapp_item["crsets"]["affixes"][iaffind[bampow[i]["key"]]]["atype"];
        if (poecap["tops"][crapp_slot][rtype][rkey]["byflt"][spectops][tatype][toppnts[tatype]] == undefined) {
            console.log("SLOT:" + crapp_slot);
            console.log("RTYPE:" + rtype);
            console.log("RKEY:" + rkey);
            console.log("SPECTOPS:" + spectops);
            console.log("TATYPE:" + tatype);
            console.log(poecap["tops"][crapp_slot][rtype][rkey]["byflt"][spectops][tatype]);
            var cmppow = lastppow[tatype];
        } else {
            var cmppow = poecap["tops"][crapp_slot][rtype][rkey]["byflt"][spectops][tatype][toppnts[tatype]]["val"];
            lastppow[tatype] = cmppow;
        }
        toppnts[tatype]++;
        var rating = crapp_item["crsets"]["affixes"][iaffind[bampow[i]["key"]]]["ampow"] / cmppow;
        crapp_item["crsets"]["affixes"][iaffind[bampow[i]["key"]]]["cmppow"] = cmppow;
        crapp_item["crsets"]["affixes"][iaffind[bampow[i]["key"]]]["rating"] = rating;
        ratord.push({"key": crapp_item["crsets"]["affixes"][iaffind[bampow[i]["key"]]]["id"], "val": rating});
    }
    ratord.sort(sortColByVAL);
    ratord.reverse();
    for (var i = 0; i < ratord.length; i++) {
        var addtags = "";
        var mname = poecl["mod"][crapp_item["crsets"]["affixes"][iaffind[ratord[i]["key"]]]["id"]];
        var rolls = crapp_item["crsets"]["affixes"][iaffind[ratord[i]["key"]]]["rolls"];
        var aid = crapp_item["crsets"]["affixes"][iaffind[ratord[i]["key"]]]["id"];
        if (mname.indexOf("#") > -1) {
            if (rolls != undefined) {
                for (var j = 0; j < rolls.length; j++) {
                    mname = mname.replace("#", rolls[j]);
                }
            }
        }

        var tiers = poecd["tiers"][aid][crapp_item["settings"]["base"]];
        var mvalue = 1;
        if (tiers.length > 1) {
            var nvalues = jQuery.parseJSON(tiers[tiers.length - 1]["nvalues"]);
            var tvals = 0;
            for (var k = 0; k < nvalues.length; k++) {
                if (Array.isArray(nvalues[k])) {
                    var ntval0 = Math.abs(nvalues[k][0]);
                    var ntval1 = Math.abs(nvalues[k][1]);
                    if (ntval0 > ntval1) {
                        var uval = ntval0;
                    } else {
                        var uval = ntval1;
                    }
                    tvals += uval;
                } else {
                    tvals += Math.abs(nvalues[k]);
                }
            }
            var trolls = 0;
            for (var k = 0; k < rolls.length; k++) {
                trolls += rolls[k];
            }
            mvalue = Math.abs(trolls) / tvals;
        }

        var power = crapp_item["crsets"]["affixes"][iaffind[ratord[i]["key"]]]["rating"] * mvalue;

        var tatype = crapp_item["crsets"]["affixes"][iaffind[ratord[i]["key"]]]["atype"];
        if (crapp_item["crsets"]["affixes"][iaffind[ratord[i]["key"]]]["mgrp"] != 1) {
            addtags += "<div class='tag mgrp mgrp" + crapp_item["crsets"]["affixes"][iaffind[ratord[i]["key"]]]["mgrp"] + "'></div>";
        }
        vHTML += "<div class='mod'>";
        vHTML += "<div class='tags'><div class='tag " + tatype + "'>" + tatype.substring(0, 1) + "</div>" + addtags + "</div>";
        vHTML += "<div>" + mname + "</div>";
        vHTML += "<div class='value hasbar right'>" + poec_appOutputPctBar(mvalue) + poec_appOutputDetPct(mvalue) + "</div>";
        vHTML += "<div class='ampow right'>" + crapp_item["crsets"]["affixes"][iaffind[ratord[i]["key"]]]["ampow"] + " / " + crapp_item["crsets"]["affixes"][iaffind[ratord[i]["key"]]]["cmppow"] + "</div>";
        vHTML += "<div class='cmpow hasbar right'>" + poec_appOutputPctBar(crapp_item["crsets"]["affixes"][iaffind[ratord[i]["key"]]]["rating"]) + poec_appOutputDetPct(crapp_item["crsets"]["affixes"][iaffind[ratord[i]["key"]]]["rating"]) + "</div>";
        vHTML += "<div class='power hasbar right'>" + poec_appOutputPctBar(power) + poec_appOutputDetPct(power) + "</div>";
        vHTML += "</div>";
    }
    vHTML += "</div>";

    $("#poecAppDet").html(vHTML);
}

function poec_appOutputPctBar(val) {
    if (val > 1) {
        val = 1;
    }
    return "<div class='bar' style='width:" + Math.round(val * 100) + "%'></div>";
}

function poec_appOutputDetPct(val) {
    return "<div class='dpct'>" + (Math.round(val * 10000) / 100) + "<span class='pct'>%</span></div>";
}

var crapp_prvtresh = {"fixed": 50};

function poec_appFilterPrevalence(crarr) {
    var narr = [];
    var utresh = crapp_prvtresh["fixed"];
    for (var i = 0; i < crarr.length; i++) {
        if (crarr[i]["prv"] >= utresh) {
            narr.push(crarr[i]);
        }
    }
    return narr;
}

function poec_appOutputResult(rdata, rtype) {
    var vHTML = "";

    var rtitle = "Title";
    switch (rtype) {
        case 'asc' :
            rtitle = applyLang("By Ascendency");
            break;
        case 'skl' :
            rtitle = applyLang("By Skill Gem");
            break;
        case 'cmb' :
            rtitle = applyLang("By Skill Gem/Ascendency");
            break;
    }

    vHTML += "<div id='poecAppResType' class='apprt " + rtype + "'><div class='div_stable agroup'>";
    vHTML += "<div class='header line'>";
    vHTML += "<div class='label'><div>" + rtitle + "</div></div>";
    vHTML += "<div class='matches right'><div>Score</div></div>";
    vHTML += "<div class='preval right'><div>Entries</div></div>";
    vHTML += "<div class='score right'><div>Match</div></div>";
    //vHTML+=    "<div class='power right'><div>Power</div></div>";
    vHTML += "</div>";
    var cnt = 0;
    for (var i = 0; i < rdata[rtype].length; i++) {
        var valid = true;
        switch (rtype) {
            case 'asc' :
                if (poeexd["classes"]["seq"][poeexd["classes"]["ind"][rdata[rtype][i]["key"]]] == undefined) {
                    valid = false;
                } else {
                    var label = poeexd["classes"]["seq"][poeexd["classes"]["ind"][rdata[rtype][i]["key"]]]["name_class"];
                }
                break;
            case 'skl' :
                if (poeexd["gems"]["seq"][poeexd["gems"]["ind"][rdata[rtype][i]["key"]]] == undefined) {
                    valid = false;
                } else {
                    var label = poeexd["gems"]["seq"][poeexd["gems"]["ind"][rdata[rtype][i]["key"]]]["name_gem"];
                }
                break;
            case 'cmb' :
                var ksplit = rdata[rtype][i]["key"].split("-");
                if (poeexd["classes"]["seq"][poeexd["classes"]["ind"][ksplit[0]]] == undefined || poeexd["gems"]["seq"][poeexd["gems"]["ind"][ksplit[1]]] == undefined) {
                    valid = false;
                } else {
                    var label = poeexd["gems"]["seq"][poeexd["gems"]["ind"][ksplit[1]]]["name_gem"] + " - " + poeexd["classes"]["seq"][poeexd["classes"]["ind"][ksplit[0]]]["name_class"];
                }
                break;
        }
        if (valid) {
            vHTML += "<div class='affix mgrp' rtype='" + rtype + "' rind=" + i + " key='" + rdata[rtype][i]["key"] + "'>";
            vHTML += "<div class='label'><div>" + label + "</div></div>";
            vHTML += "<div class='matches right'><div>" + rdata[rtype][i]["score"] + " / " + rdata[rtype][i]["max"] + "</div></div>";
            vHTML += "<div class='preval right'><div>" + rdata[rtype][i]["prv"] + "</div></div>";
            vHTML += "<div class='score right'><div>" + number_format(rdata[rtype][i]["val"] * 100, 2, ".", " ") + "<span class='pct'>%</span></div></div>";
            //vHTML+=  "<div class='power right'><div>"+rdata[rtype][i]["power"]+"</div></div>";
            vHTML += "</div>";
            cnt++;
            if (cnt > 15) {
                break;
            }
        }
    }
    vHTML += "</div></div>";

    return vHTML;
}

var afftrdignores = "|#% increased Stun and Block Recovery|Reflects # Physical Damage to Melee Attackers|#% increased Stun Duration on Enemies|";
var afftraffar = null;
var afftrchdat = {"x": null, "v": null, "w": null, "m": null, "i": null};

function poec_affTradeWindow() {
    if ($("#poecAffTradeWindow").length == 0) {
        var vHTML = "";
        vHTML += "<div class='title'>Trade search configuration</div>";
        vHTML += "<div class='config'>";
        vHTML += "<div class='poec_affopt'><label>Pool type</label><div id='poecAffTWOPool' class='mcui-radio med_shadow'><div class='choice selected'>Auto<div class='value'>auto</div></div><div class='choice'>Life<div class='value'>life</div></div><div class='choice'>ES<div class='value'>es</div></div><div class='choice'>Ward<div class='value'>ward</div></div><div class='choice'>All<div class='value'>all</div></div></div></div>";
        vHTML += "<div class='poec_affopt' id='poecAffTWOResetValsHolder'><div class='mcui-button dark' id='poecAffTWOResetVals' onClick='poec_affTradeResetValues()'>Reset values</div></div>";
        vHTML += "</div>";
        vHTML += "<div class='content' id='poecAffTradeWOutput'></div>";
        vHTML += "<div class='buttons'><div class='mcui-button green' onClick='poec_affTradeLink()'>Open trade search</div><div class='mcui-button red' onClick='poec_affCloseTradeWindow()'>Close</div></div>";
        $("<div>").attr("id", "poecAffTradeWindow").html("<div class='wrapper'><div id='poecAffTradeWContent' class='noselect med_shadow'>" + vHTML + "</div></div>").appendTo($("body"));
        $("#poecAffTradeWindow").find(".mcui-radio").mcuiRadio({
            change: function () {
                poec_affTradeRefreshSelection();
            }
        });
    }
    $("body").css({"overflow": "hidden"});
    $("#poecAffTWOResetValsHolder").hide();
    $("#poecAffTradeWindow").show();
    $("#poecAffTradeWOutput").height(0);
    $("#poecAffTradeWOutput").height($("#poecAffTradeWContent").outerHeight() - 2 - $("#poecAffTradeWindow").find(".config").outerHeight() - $("#poecAffTradeWindow").find(".title").outerHeight() - $("#poecAffTradeWindow").find(".buttons").outerHeight());

    var vHTML = "";

    afftraffar = [];
    for (var i = 0; i < curaffar.length; i++) {
        var fname = poec_affParseTradeName(poeaf["aindex"][curaffar[i]["id"]]);
        if (poeexd["trade"][fname]) {
            afftraffar.push(jQuery.parseJSON(JSON.stringify(curaffar[i])));
        }
    }

    vHTML += "<div class='div_stable' id='poecAffTWOTbl'>";
    for (var i = 0; i < afftraffar.length; i++) {
        vHTML += "<div class='affix " + ((afftrdignores.indexOf("|" + poeaf["aindex"][afftraffar[i]["id"]] + "|") > -1) ? "ignore" : "") + "' aid='" + afftraffar[i]["id"] + "'>";
        vHTML += "<div class='name'>" + poeaf["aindex"][afftraffar[i]["id"]] + "</div>";
        vHTML += "<div class='amount' inival='" + afftraffar[i]["val"] + "' curval='" + afftraffar[i]["val"] + "'>" + afftraffar[i]["val"] + "</div>";
        vHTML += "<div class='bar'><div class='wrap'><div class='handle'></div></div></div></div>";
    }
    vHTML += "</div>";

    $("#poecAffTradeWOutput").html(vHTML);
    $("#poecAffTradeWOutput").find(".affix").click(function () {
    });
    $("#poecAffTradeWOutput").find(".affix").mousedown(function (e) {
        $(this).attr("pagex", e.pageX);
    });
    $("#poecAffTradeWOutput").find(".affix").mouseup(function (e) {
        if (parseInt($(this).attr("pagex")) == e.pageX) {
            poec_affTradeToggleAffix(this);
        }
    });
    $("#poecAffTradeWOutput").find(".handle").mousedown(function (e) {
        var affline = $(this).parent().parent().parent();
        $(affline).addClass("handling");
        $(this).attr("pagex", e.pageX);
        afftrchdat["m"] = parseInt($("#poecAffTradeWOutput").find(".affix:first").find(".amount").attr("inival")) * 2;
        afftrchdat["x"] = e.pageX;
        afftrchdat["i"] = $(affline).find(".bar").outerWidth();
        afftrchdat["v"] = parseInt($(affline).find(".amount").attr("curval"));
        afftrchdat["w"] = $(affline).outerWidth();
        $(window).mousemove(function (e) {
            var dif = afftrchdat["x"] - e.pageX;
            var ni = afftrchdat["i"] + dif;
            ni = (ni < 5) ? 5 : ni;
            ni = (ni > afftrchdat["w"]) ? afftrchdat["w"] : ni;
            var nam = Math.floor((ni / afftrchdat["w"]) * afftrchdat["m"]);
            $("#poecAffTradeWOutput").find(".handling").find(".amount").attr("curval", nam).text(nam);
            $("#poecAffTradeWOutput").find(".handling").find(".bar").width(ni);
        });
        $(window).mouseup(function (e) {
            var cv = parseInt($("#poecAffTradeWOutput").find(".handling").find(".amount").attr("curval"));
            var iv = parseInt($("#poecAffTradeWOutput").find(".handling").find(".amount").attr("inival"));
            if (cv != iv) {
                $("#poecAffTradeWOutput").find(".handling").addClass("changed");
            } else {
                $("#poecAffTradeWOutput").find(".handling").removeClass("changed");
            }
            $("#poecAffTradeWOutput").find(".handling").removeClass("handling");
            $(window).unbind("mousemove");
            $(window).unbind("mouseup");
            if ($("#poecAffTradeWOutput").find(".changed").length > 0) {
                $("#poecAffTWOResetValsHolder").css({"display": "inline-block"});
            } else {
                $("#poecAffTWOResetValsHolder").hide();
            }
        });
    });

    poec_affTradeRefreshSelection();
    poec_affTrdComputeBars();
}

function poec_affTradeRefreshSelection() {
    var pool = $("#poecAffTWOPool").mcuiRadio().getVal();
    if (pool == "auto") {
        for (var i = 0; i < afftraffar.length; i++) {
            if (poeaf["aindex"][afftraffar[i]["id"]].indexOf("Life") > -1) {
                pool = "life";
                break;
            } else {
                if (poeaf["aindex"][afftraffar[i]["id"]].indexOf("Energy Shield") > -1) {
                    pool = "es";
                    break;
                } else {
                    if (poeaf["aindex"][afftraffar[i]["id"]].indexOf("Ward") > -1) {
                        pool = "ward";
                        break;
                    }
                }
            }
        }
    }
    var ignoring = [];
    switch (pool) {
        case 'life' :
            ignoring = ["Energy Shield", "Ward"];
            break;
        case 'es' :
            ignoring = ["Life", "Ward"];
            break;
        case 'ward' :
            ignoring = ["Life", "Energy Shield"];
            break;
    }
    var nactive = 0;
    var totv = 0;
    $("#poecAffTWOTbl").find(".affix").each(function () {
        var val = parseInt($(this).find(".amount").text());
        if ($(this).hasClass("ignore")) {
            if ($(this).hasClass("sel")) {
                nactive++;
                totv += val;
            }
        } else {
            var name = $(this).find(".name").text();
            var ignore = false;
            for (var i = 0; i < ignoring.length; i++) {
                if (name.indexOf(ignoring[i]) > -1) {
                    ignore = true;
                    break;
                }
            }
            if (ignore) {
                $(this).removeClass("sel");
            } else {
                $(this).addClass("sel");
                nactive++;
                totv += val;
            }
        }
        if (nactive >= 20) {
            $(this).removeClass("sel");
        }
    });
}

function poec_affTradeResetValues() {
    $("#poecAffTradeWOutput").find(".changed").each(function () {
        var inival = $(this).find(".amount").attr("inival");
        $(this).removeClass("changed").find(".amount").attr("curval", inival).text(inival);
    });
    $("#poecAffTWOResetValsHolder").hide();
    poec_affTrdComputeBars();
}

function poec_affTrdComputeBars() {
    var totv = 0;
    var topis = 0;
    $("#poecAffTWOTbl").find(".affix").each(function () {
        var val = parseInt($(this).find(".amount").text());
        totv += val;
        if (val > topis) {
            topis = val;
        }
    });
    $("#poecAffTWOTbl").find(".affix").each(function () {
        var val = parseInt($(this).find(".amount").text());
        $(this).find(".bar").width(((val / topis) / 2) * 100 + "%");
    });
}

function poec_affTradeToggleAffix(vThis) {
    if ($(vThis).hasClass("sel")) {
        $(vThis).removeClass("sel");
    } else {
        $(vThis).addClass("sel");
    }
}

function poec_affCloseTradeWindow() {
    $("body").css({"overflow": "auto"});
    $("#poecAffTradeWindow").hide();
}

function poec_affTradeLink() {
    var slt = poec_affMSGetVal($("#poecAffMSSlot"));
    var bas = poec_affMSGetVal($("#poecAffMSBase"));
    var bit = poec_affMSGetVal($("#poecAffMSItem"));

    var item = null;

    var naffixes = 6;
    var wendmod = 1;
    switch (slt) {
        case 'Amulet' :
            item = "accessory.amulet";
            break;
        case 'Ring' :
            item = "accessory.ring";
            break;
        case 'Belt' :
            item = "accessory.belt";
            wendmod = 1.5;
            break;
        case 'BodyArmour' :
            item = "armour.chest";
            wendmod = 1.5;
            break;
        case 'Boots' :
            item = "armour.boots";
            wendmod = 1.5;
            break;
        case 'Gloves' :
            item = "armour.gloves";
            wendmod = 1.5;
            break;
        case 'Helm' :
            item = "armour.helmet";
            wendmod = 1.5;
            break;
        case 'Flask' :
            item = "flask";
            naffixes = 2;
            break;
        case 'Cluster' :
            item = "jewel.cluster";
            break;
        case 'Jewel' :
            item = "jewel.base";
            naffixes = 4;
            break;
        case 'Weapon' :
            item = "weapon";
            break;
        default:
            break;
    }

    var type = null;
    var armour = null;
    if (bas) {
        switch (bas) {
            // Armours
            case '49' :
                armour = [1, 0, 1, 0];
                break;
            case '46' :
                armour = [0, 1, 0, 0];
                break;
            case '50' :
                armour = [0, 1, 1, 0];
                break;
            case '48' :
                armour = [1, 1, 0, 0];
                break;
            case '45' :
                armour = [1, 0, 0, 0];
                break;
            case '47' :
                armour = [0, 0, 1, 0];
                break;
            case '51' :
                armour = [1, 1, 1, 0];
                break;
            // Boots
            case '43' :
                armour = [1, 0, 1, 0];
                break;
            case '42' :
                armour = [1, 1, 0, 0];
                break;
            case '39' :
                armour = [1, 0, 0, 0];
                break;
            case '44' :
                armour = [0, 1, 1, 0];
                break;
            case '41' :
                armour = [0, 0, 1, 0];
                break;
            case '40' :
                armour = [0, 1, 0, 0];
                break;
            case '201':
                armour = [0, 0, 0, 1];
                break;
            // Helmets
            case '56' :
                armour = [1, 0, 1, 0];
                break;
            case '55' :
                armour = [1, 1, 0, 0];
                break;
            case '52' :
                armour = [1, 0, 0, 0];
                break;
            case '57' :
                armour = [0, 1, 1, 0];
                break;
            case '54' :
                armour = [0, 0, 1, 0];
                break;
            case '53' :
                armour = [0, 1, 0, 0];
                break;
            case '203':
                armour = [0, 0, 0, 1];
                break;
            // Gloves
            case '37' :
                armour = [1, 0, 1, 0];
                break;
            case '36' :
                armour = [1, 1, 0, 0];
                break;
            case '33' :
                armour = [1, 0, 0, 0];
                break;
            case '38' :
                armour = [0, 1, 1, 0];
                break;
            case '35' :
                armour = [0, 0, 1, 0];
                break;
            case '34' :
                armour = [0, 1, 0, 0];
                break;
            case '202':
                armour = [0, 0, 0, 1];
                break;
            // Shields
            case '9' :
                armour = [1, 0, 1, 0];
                item = "armour.shield";
                break;
            case '8' :
                armour = [1, 1, 0, 0];
                item = "armour.shield";
                break;
            case '5' :
                armour = [1, 0, 0, 0];
                item = "armour.shield";
                break;
            case '10' :
                armour = [0, 1, 1, 0];
                item = "armour.shield";
                break;
            case '7' :
                armour = [0, 0, 1, 0];
                item = "armour.shield";
                break;
            case '6' :
                armour = [0, 1, 0, 0];
                item = "armour.shield";
                break;
            case '212' :
                item = "armour.shield";
                type = "Bone Spirit Shield";
                break;
            // Quiver
            case '4' :
                item = "armour.quiver";
                wendmod = 1.5;
                break;
            // Weapons
            case '17' :
                item = "weapon.sceptre";
                break;
            case '18' :
                item = "weapon.wand";
                break;
            case '19' :
                item = "weapon.runedagger";
                break;
            case '21' :
                item = "weapon.basestaff";
                break;
            case '15' :
                item = "weapon.oneaxe";
                break;
            case '20' :
                item = "weapon.bow";
                break;
            case '11' :
                item = "weapon.claw";
                break;
            case '67' :
                item = "weapon.wand";
                type = "Convoking Wand";
                break;
            case '12' :
                item = "weapon.basedagger";
                break;
            case '16' :
                item = "weapon.basemace";
                break;
            case '13' :
                item = "weapon.onesword";
                break;
            case '14' :
                item = "weapon.onemelee";
                break;
            case '24' :
                item = "weapon.twoaxe";
                break;
            case '23' :
                item = "weapon.twomace";
                break;
            case '22' :
                item = "weapon.twosword";
                break;
            case '25' :
                item = "weapon.warstaff";
                break;
            // Jewels
            case '31' :
            case '30' :
            case '32' :
            case '29' :
                item = "jewel.abyss";
                break;
        }
    }

    if (bit) {
        if (!type) {
            type = poecd["bitems"]["seq"][poecd["bitems"]["ind"][bit]]["name_bitem"];
        }
    }

    var maxaff = (curaffar.length < 20) ? curaffar.length : 20;

    // Filter curraffinds
    /*
    var naffar=[];
    for(var i=0;i<curaffar.length;i++){
        if(afftrdignores.indexOf("|"+poeaf["aindex"][curaffar[i]["id"]]+"|")>-1){}else{
            naffar.push(jQuery.parseJSON(JSON.stringify(curaffar[i])));
        }
    }
    maxaff=(naffar.length<20)?naffar.length:20;
    */

    var naffar = [];
    $("#poecAffTWOTbl").find(".affix.sel").each(function () {
        naffar.push({"id": parseInt($(this).attr("aid")), "val": parseInt($(this).find(".amount").attr("curval"))});
    });

    maxaff = naffar.length;

    var qs = {
        "query": {
            "status": {
                "option": "online"
            },
            "stats": [{"type": "weight", "filters": [], "disabled": false, "value": {"min": 1}}],
            "filters": {
                "type_filters": {
                    "filters": {
                        "category": {
                            "option": item
                        },
                        "rarity": {
                            "option": "nonunique"
                        }
                    }
                },
            }
        },
        "sort": {
            "price": "desc"
        }
    };

    if (armour) {
        var filters = {"ar": {}, "ev": {}, "es": {}, "ward": {}};
        if (armour[0]) {
            filters["ar"]["min"] = 1;
        } else {
            filters["ar"]["max"] = 0;
        }
        if (armour[1]) {
            filters["ev"]["min"] = 1;
        } else {
            filters["ev"]["max"] = 0;
        }
        if (armour[2]) {
            filters["es"]["min"] = 1;
        } else {
            filters["es"]["max"] = 0;
        }
        if (armour[3]) {
            filters["ward"]["min"] = 1;
        } else {
            filters["ward"]["max"] = 0;
        }
        qs["query"]["filters"]["armour_filters"] = {
            "disabled": false,
            "filters": filters
        };
    }

    if (type) {
        qs["query"]["type"] = type;
    }

    // Find max values for each affix on this base
    var lowest = 9999999999;
    var highest = 0;
    var vpaff = {};
    var totvals = 0;
    for (var i = 0; i < maxaff; i++) {
        var high = 0;
        if (curraffinds[naffar[i]["id"]]) {
            for (var j = 0; j < curraffinds[naffar[i]["id"]].length; j++) {
                if (curraffinds[naffar[i]["id"]][j]["mp"] == 0) {
                    curraffinds[naffar[i]["id"]][j]["mp"] = naffar[i]["val"];
                }
                if (curraffinds[naffar[i]["id"]][j]["mp"] > high) {
                    high = curraffinds[naffar[i]["id"]][j]["mp"];
                }
                if (curraffinds[naffar[i]["id"]][j]["mp"] > highest) {
                    highest = curraffinds[naffar[i]["id"]][j]["mp"];
                }
                if (curraffinds[naffar[i]["id"]][j]["mp"] < lowest) {
                    lowest = curraffinds[naffar[i]["id"]][j]["mp"];
                }
            }
        }
        if (high == 0) {
            lowest = 1;
            high = 1;
        }
        vpaff[naffar[i]["id"]] = high;
        totvals += high;
    }

    if (highest < lowest) {
        highest = lowest;
    }

    var twval = 0;
    var valpaf = {};
    for (var i = 0; i < maxaff; i++) {
        if (lowest != highest) {
            vpaff[naffar[i]["id"]] = vpaff[naffar[i]["id"]] * (1 - (((highest - vpaff[naffar[i]["id"]]) / highest) / 3));
            valpaf[naffar[i]["id"]] = naffar[i]["val"] * (lowest / vpaff[naffar[i]["id"]]);
        } else {
            valpaf[naffar[i]["id"]] = naffar[i]["val"];
        }
        twval += valpaf[naffar[i]["id"]];
    }

    var totalweighting = 0;
    var tottop = 0;
    var nadded = 0;
    for (var i = 0; i < maxaff; i++) {
        console.log(poeaf["aindex"][naffar[i]["id"]]);
        var fname = poec_affParseTradeName(poeaf["aindex"][naffar[i]["id"]]);
        console.log(valpaf[naffar[i]["id"]]);
        var fval = (valpaf[naffar[i]["id"]] / twval) * 100;
        if (poeexd["trade"][fname]) {
            if (nadded < 3) {
                tottop += fval * vpaff[naffar[i]["id"]];
            }
            totalweighting += fval * vpaff[naffar[i]["id"]];
            var trade = poeexd["trade"][fname];
            qs["query"]["stats"][0]["filters"].push({
                "id": trade,
                "value": {"weight": fval},
                "disabled": false
            });
            nadded++;
        }
    }

    //qs["query"]["stats"][0]["value"]["min"]=totalweighting*0.4;
    qs["query"]["stats"][0]["value"]["min"] = (totalweighting / maxaff) * naffixes * wendmod;
    //qs["query"]["stats"][0]["value"]["min"]=tottop;

    //console.log(qs);

    var url = "https://www.pathofexile.com/trade/search/Crucible?q=" + JSON.stringify(qs);
    //console.log(url);
    window.open(url);
}

var afftparse_before = {
    "#% increased Energy Shield": "#% increased Energy Shield (Local)",
    "#% increased Armour and Evasion": "#% increased Armour and Evasion (Local)",
    "#% increased Armour and Energy Shield": "#% increased Armour and Energy Shield (Local)",
    "#% increased Evasion and Energy Shield": "#% increased Evasion and Energy Shield (Local)",
    "#% increased Armour, Evasion and Energy Shield": "#% increased Armour, Evasion and Energy Shield (Local)",
    "Bow Attacks fire an additional Arrow": "Bow Attacks fire # additional Arrows",
    "You can apply an additional Curse": "You can apply # additional Curses",
    "Strike Skills target # additional nearby Enemies": "Strike Skills target # additional nearby Enemy",
    "#% chance to Intimidate Enemies for # seconds on Hit": "#% chance to Intimidate Enemies for 4 seconds on Hit",
    "#% chance to Unnerve Enemies for # seconds on Hit": "#% chance to Unnerve Enemies for 4 seconds on Hit",
    "#% chance to gain Onslaught for # seconds on Kill": "#% chance to gain Onslaught for 4 seconds on Kill",
    "#% chance to gain Phasing for # seconds on Kill": "#% chance to gain Phasing for 4 seconds on Kill",
    "#% chance to gain Unholy Might for # seconds on Kill": "#% chance to gain Unholy Might for 10 seconds on Kill",
    "Projectiles Pierce an additional Target": "Projectiles Pierce # additional Targets",
    "Has # Abyssal Socket": "Has # Abyssal Sockets",
    "#% Chance to Block": "#% Chance to Block (Shields)",
    "#% chance to Trigger Level # Blood Rage when you Kill an Enemy": "#% chance to Trigger Level 1 Blood Rage when you Kill an Enemy",
    "#% increased Damage per # Strength": "#% increased Damage per 15 Strength",
    "#% increased Damage per # Dexterity": "#% increased Damage per 15 Dexterity",
    "#% increased Damage per # Intelligence": "#% increased Damage per 15 Intelligence",
    "#% increased Spell Damage per # Intelligence": "#% increased Spell Damage per 16 Intelligence",
    "#% increased Critical Strike Chance per # Strength": "#% increased Critical Strike Chance per 10 Strength",
    "#% increased Attack Speed per # Dexterity": "#% increased Attack Speed per 10 Dexterity",
    "#% increased Area of Effect per # Strength": "#% increased Area of Effect per 50 Strength",
    "#% increased Projectile Attack Damage per # Accuracy Rating": "#% increased Projectile Attack Damage per 200 Accuracy Rating",
    "#% increased Damage per #% Chance to Block Attack Damage": "#% increased Damage per 1% Chance to Block Attack Damage",
    "Trigger Level # Summon Spectral Wolf on Kill": "Trigger Level 10 Summon Spectral Wolf on Kill",
    "Triggers Level # Spectral Spirits when Equipped": "Triggers Level 20 Spectral Spirits when Equipped",
    "#% chance to Chill Attackers for # seconds on Block": "#% chance to Chill Attackers for 4 seconds on Block",
    "#% chance to Defend with #% of Armour": "#% chance to Defend with 200% of Armour",
    "Every # seconds, Regenerate #% of Life over one second": "Every 4 seconds, Regenerate #% of Life over one second",
    "Adds # to # Cold Damage to Attacks with this Weapon per # Dexterity": "Adds # to # Cold Damage to Attacks with this Weapon per 10 Dexterity",
    "#% chance to Gain Unholy Might for # seconds on Melee Kill": "#% chance to Gain Unholy Might for 4 seconds on Melee Kill",
    "Adds # to # Lightning Damage to Attacks with this Weapon per # Intelligence": "Adds # to # Lightning Damage to Attacks with this Weapon per 10 Intelligence",
    "Grants Immunity to Bleeding for # seconds if used while Bleeding, Grants Immunity to Corrupted Blood for # seconds if used while affected by Corrupted Blood": "Grants Immunity to Bleeding for 4 seconds if used while Bleeding\nGrants Immunity to Corrupted Blood for 4 seconds if used while affected by Corrupted Blood",
    "Grants Immunity to Chill for # seconds if used while Chilled, Grants Immunity to Freeze for # seconds if used while Frozen": "Grants Immunity to Chill for 4 seconds if used while Chilled\nGrants Immunity to Freeze for 4 seconds if used while Frozen",
    "Grants Immunity to Ignite for # seconds if used while Ignited, Removes all Burning when used": "Grants Immunity to Ignite for 4 seconds if used while Ignited\nRemoves all Burning when used",
    "Trigger a Socketed Spell on Using a Skill, with a # second Cooldown, Spells Triggered this way have #% more Cost": "Trigger a Socketed Spell on Using a Skill, with a # second Cooldown\nSpells Triggered this way have 150% more Cost"
};

var afftparse_after = {
    "#% increased Flask Charges used": "#% reduced Flask Charges used",
    "You and your Minions take #% increased Reflected Physical Damage": "You and your Minions take #% reduced Reflected Damage",
    "You and your Minions take #% increased Reflected Elemental Damage": "You and your Minions take #% reduced Reflected Elemental Damage",
    "#% increased Effect of Curses on you during Effect": "#% reduced Effect of Curses on you during Effect",
    "#% increased Effect of Chill on you during Effect": "#% reduced Effect of Chill on you during Effect",
    "#% increased Reflected Damage taken during Effect": "#% reduced Reflected Damage taken during Effect",
    "#% increased Mana Cost of Skills": "#% reduced Mana Cost of Skills",
    "#% increased Effect of Curses on you": "#% reduced Effect of Curses on you",
    "Hinders nearby Enemies with #% increased Movement Speed if used while not on Full Life": "Hinders nearby Enemies with #% reduced Movement Speed if used while not on Full Life",
    "#% increased Effect of Chill on you": "#% reduced Effect of Chill on you",
    "#% increased Enemy Stun Threshold": "#% reduced Enemy Stun Threshold",
    "Hinders nearby Enemies with #% increased Movement Speed if used while not on Full Mana": "Hinders nearby Enemies with #% reduced Movement Speed if used while not on Full Mana",
    "You take #% increased Extra Damage from Critical Strikes": "You take #% reduced Extra Damage from Critical Strikes",
    "You and your Minions take #% increased Reflected Damage": "You and your Minions take #% reduced Reflected Damage",
    "#% increased Ignite Duration on you": "#% reduced Ignite Duration on you",
    "#% increased Damage taken from Damage Over Time": "#% reduced Damage taken from Damage Over Time",
    "#% increased Chaos Damage taken over time": "#% reduced Chaos Damage taken over time",
    "Gain # Life per second": "Lose # Life per second",
    "Gain # Mana per second": "Lose # Mana per second"
}

function poec_affParseTradeName(name) {
    name = (afftparse_before[name]) ? afftparse_before[name] : name;
    name = name.replace("+", "");
    name = name.replace("-#", "#");
    name = name.replace("reduced", "increased");
    name = name.replace("less", "more");
    name = name.replace("Lose", "Gain");
    name = (afftparse_after[name]) ? afftparse_after[name] : name;
    return name;
}