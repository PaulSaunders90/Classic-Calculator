// Talent Tree Functions //
// Talent Page Variables //
var clickState = false,
    talentButtons = document.querySelectorAll('td'),
    talentHeaders = document.querySelectorAll('.talentheader'),
    talentContainer = document.getElementsByClassName("classtalents"),
    clicksRemain = 51,
    clickedTalent = 0,
    talentBuildData = {},
    menuClicks = 0;

// Talent Page Dictionary //

const classTalentsDict = {
    warrior: warriorTalents,
    mage: mageTalents,
    rogue: rogueTalents,
    priest: priestTalents,
    shaman: shamanTalents,
    hunter: hunterTalents,
    warlock: warlockTalents,
    paladin: paladinTalents,
    druid: druidTalents
};

const DOM = {
    talentBox: document.getElementById("talentbox"),
    selectedTalentOutput: document.getElementById("selectedTalentOutput"),
    talentOutputContainer: document.getElementById("talentOutputContainer"),
    talent1: document.getElementById("talent1"),
    talent2: document.getElementById("talent2"),
    talent3: document.getElementById("talent3"),
    headerIcon1: document.getElementById("headericon1"),
    headerIcon2: document.getElementById("headericon2"),
    headerIcon3: document.getElementById("headericon3"),
    headerText1: document.getElementById("headertext1"),
    headerText2: document.getElementById("headertext2"),
    headerText3: document.getElementById("headertext3"),
    talentPoints: document.getElementById("talentpoints"),
    talentPoints1: document.getElementById("talentpoints1"),
    talentPoints2: document.getElementById("talentpoints2"),
    talentPoints3: document.getElementById("talentpoints3"),
    talentOutput: document.getElementById("talentoutput").querySelector("p"),
    talentMenuText: document.getElementById("talentmenutext")
};

const talentTrees = {
    0: {
        dom: DOM['talentPoints1'],
        clicks: 0
    },
    1: {
        dom: DOM['talentPoints2'],
        clicks: 0
    },
    2: {
        dom: DOM['talentPoints3'],
        clicks: 0
    }
};

// Talent Page Functions // 

// General Class Talent Selection Function//

function toggleMenuText() {
    DOM["talentMenuText"].innerHTML = "Pick a Class!";
};

function selectClass(e) {
    currentClass = e.target.getAttribute("data-character");
};

function displayCharacter(e) {
    if (e.target.tagName.toLowerCase() == 'button') {
        e.preventDefault();
        clickState = true;
        changeClass();
        talent1BG = classTalentsDict[currentClass][0].treeBG;
        talent2BG = classTalentsDict[currentClass][1].treeBG;
        talent3BG = classTalentsDict[currentClass][2].treeBG;
        talent1icon = classTalentsDict[currentClass][0].treeIcon;
        talent2icon = classTalentsDict[currentClass][1].treeIcon;
        talent3icon = classTalentsDict[currentClass][2].treeIcon;
        talent1Head = classTalentsDict[currentClass][0].treeName;
        talent2Head = classTalentsDict[currentClass][1].treeName;
        talent3Head = classTalentsDict[currentClass][2].treeName;
        classTalents = classTalentsDict[currentClass];
        DOM["talentMenuText"].innerHTML = currentClass.charAt(0).toUpperCase() + currentClass.slice(1);
        DOM["talentBox"].style.display = "block";
        DOM["selectedTalentOutput"].style.display = "flex";
        DOM["talent1"].style.backgroundImage = `url('/img/bg/${talent1BG}')`;
        DOM["talent2"].style.backgroundImage = `url('/img/bg/${talent2BG}')`;
        DOM["talent3"].style.backgroundImage = `url('/img/bg/${talent3BG}')`;
        DOM["headerIcon1"].style.backgroundImage = `url('/img/talent-tree-icons/${talent1icon}')`;
        DOM["headerIcon2"].style.backgroundImage = `url('/img/talent-tree-icons/${talent2icon}')`;
        DOM["headerIcon3"].style.backgroundImage = `url('/img/talent-tree-icons/${talent3icon}')`;
        DOM["headerText1"].innerHTML = talent1Head;
        DOM["headerText2"].innerHTML = talent2Head;
        DOM["headerText3"].innerHTML = talent3Head;
        DOM["talentPoints"].innerHTML = clicksRemain;
        DOM["talentPoints1"].innerHTML = talentTrees[0].clicks;
        DOM["talentPoints2"].innerHTML = talentTrees[1].clicks;
        DOM["talentPoints3"].innerHTML = talentTrees[2].clicks;
        buttons(classTalents);
        displayTalentArrows();
        document.getElementById("reportbug").style.display = "block";
    };
};

// Talent Point and Button Reset Function for Switching Classes //

function changeClass() {
    clicksRemain = 51;
    talentTrees[0].clicks = 0;
    talentTrees[1].clicks = 0;
    talentTrees[2].clicks = 0;
    talentButtons.forEach(function (allButtons) {
        allButtons.querySelector('.talentimage').style.backgroundImage = "none";
        allButtons.querySelector('.individualtalentpoints').style.display = 'none';
        allButtons.classList.remove("activetalent")
        allButtons.querySelector('.talentimage').classList.remove('loadedtalent')
        allButtons.dataset.currentRank = 0;
        allButtons.querySelector('.individualtalentpoints').classList.remove("activetalentnopoints")
        allButtons.querySelector('.individualtalentpoints').classList.remove("talentwithpoints")
        allButtons.querySelector('.talentimage').classList.remove("activetalentimage")
        allButtons.querySelector('.individualtalentpoints').classList.remove("maxranktalent")
        allButtons.querySelector('.talentimage').classList.remove("maxranktalent")
        allButtons.className = ''
        DOM['talentOutput'].innerHTML = ''
        delete allButtons.dataset.name
        delete allButtons.dataset.maxRank
        delete allButtons.dataset.pos
        delete allButtons.dataset.reqPoints
        delete allButtons.dataset.preReq
        delete allButtons.dataset.arrowsDir
        delete allButtons.dataset.arrowsTo
        delete allButtons.dataset.arrowsFrom
    });
    clearTalentArrows()
    talentBuildData = {}
    buildUrl()
};

// Talent Table Generation Function //

function buttons(classTalents) {
    classTalents.forEach(function (tree) {
        talentArray = Object.values(tree.talents[0]);
        talentArray.forEach(function (talentData) {
            talentButton = document.getElementById(talentData.pos);
            if (talentData.name) {
                talentButton.dataset.currentRank = 0;
                talentButton.dataset.maxRank = talentData.maxRank
                talentButton.dataset.pos = talentData.pos
                talentButton.dataset.name = talentData.name
                talentButton.dataset.reqPoints = talentData.reqPoints
                talentButton.querySelector('.talentimage').style.backgroundImage = `url("/img/skill-icons/${talentData.icon}")`;
                talentButton.querySelector('.talentimage').classList.add('loadedtalent')
                talentButton.querySelector('.individualtalentpoints').style.display = 'block';
                talentButton.querySelector('.currenttalentpoints').innerHTML = talentButton.dataset.currentRank
                talentButton.querySelector('.maxtalentpoints').innerHTML = talentButton.dataset.maxRank
                if (talentData.prereq) {
                    talentButton.dataset.preReq = talentData.prereq
                };
                if (talentData.arrows) {
                    talentButton.dataset.arrowsDir = talentData.arrows[0].dir
                    talentButton.dataset.arrowsFrom = talentData.arrows[0].from
                    talentButton.dataset.arrowsTo = talentData.arrows[0].to
                }
                legalTalentInitialize();
            };
        });
    });
};

// Class Talents Arrow Functions //
// Talent Arrow Generation Function //

function displayTalentArrows() {
    talentButtons.forEach(function (talentButton) {
        if (talentButton.dataset.arrowsDir != undefined) {
            const originOfArrow = [...talentButtons].find(button => button.dataset.pos == (talentButton.dataset.pos[0] + talentButton.dataset.arrowsFrom))
            const endPointOfArrow = [...talentButtons].find(button => button.dataset.pos == (talentButton.dataset.pos[0] + talentButton.dataset.arrowsTo))

            const heightDistance = parseInt(endPointOfArrow.offsetTop) - parseInt(originOfArrow.offsetTop)
            const widthDistance = parseInt(endPointOfArrow.offsetLeft) - parseInt(originOfArrow.offsetLeft)
            const columnsCrossedByArrow = (parseInt(endPointOfArrow.dataset.pos[2])) - (parseInt(originOfArrow.dataset.pos[2]))

            if (originOfArrow.querySelector(".arrowcontainer") == null) {
                var arrowContainer = document.createElement('div');
                arrowContainer.className = "arrowcontainer"
                originOfArrow.append(arrowContainer)
                var arrowDiv = document.createElement('div');
                arrowDiv.className = "arrowdiv"
                arrowContainer.append(arrowDiv)
                if (heightDistance == 0) {
                    originOfArrow.querySelector(".arrowcontainer").classList.add("sharesrow")
                    originOfArrow.querySelector(".arrowcontainer").style.width = "25px"
                    arrowContainer.querySelector(".arrowdiv").style.backgroundImage = "url('/img/arrows/" + talentButton.dataset.arrowsDir + "-arrow.png')"
                    arrowDiv.className = "arrowright"
                } else if (widthDistance == 0) {
                    originOfArrow.querySelector(".arrowcontainer").classList.add("sharescolumn")
                    originOfArrow.querySelector(".arrowcontainer").style.height = (heightDistance - 45) + "px"
                    arrowContainer.querySelector(".arrowdiv").style.backgroundImage = "url('/img/arrows/" + talentButton.dataset.arrowsDir + "-arrow.png')"
                    arrowDiv.className = "arrowbottom"
                }
                else if (widthDistance != 0 && heightDistance != 0) {
                    originOfArrow.querySelector(".arrowcontainer").style.height = "70px"
                    originOfArrow.querySelector(".arrowcontainer").style.width = (columnsCrossedByArrow * widthDistance) + "px"
                    originOfArrow.querySelector(".arrowcontainer").classList.add("crossesbothcolumsnandrows")
                    arrowContainer.querySelector(".arrowdiv").style.backgroundImage = "url('/img/arrows/" + talentButton.dataset.arrowsDir + "-arrow.png')"
                    arrowDiv.className = "arrowrightbottombottom"
                }
            } else {
                var secondArrowContainer = document.createElement('div');
                secondArrowContainer.className = "secondarrowcontainer"
                originOfArrow.append(secondArrowContainer)
                var arrowDiv = document.createElement('div');
                arrowDiv.className = "arrowdiv"
                secondArrowContainer.append(arrowDiv)
                originOfArrow.querySelector(".secondarrowcontainer").style.height = "70px"
                originOfArrow.querySelector(".secondarrowcontainer").style.width = (columnsCrossedByArrow * widthDistance) + "px"
                originOfArrow.querySelector(".secondarrowcontainer").classList.add("crossesbothcolumsnandrows")
                secondArrowContainer.querySelector(".arrowdiv").style.backgroundImage = "url('/img/arrows/" + talentButton.dataset.arrowsDir + "-arrow.png')"
                arrowDiv.className = "arrowrightbottombottom"
            };
        };
    });
};

// Arrow Activation or Deactivation Function //

function checkIfArrowsAreLegal() {
    talentButtons.forEach(function (talentButton) {
        if (talentButton.dataset.arrowsDir != undefined) {
            const originOfArrow = [...talentButtons].find(button => button.dataset.pos == (talentButton.dataset.pos[0] + talentButton.dataset.arrowsFrom))
            const endPointOfArrow = [...talentButtons].find(button => button.dataset.pos == (talentButton.dataset.pos[0] + talentButton.dataset.arrowsTo))

            const talentTreePoints = talentTrees[talentButton.dataset.pos[0]].clicks;
            const requiredTalentTreePoints = endPointOfArrow.dataset.reqPoints;
            const sufficientReqPoints = (requiredTalentTreePoints <= talentTreePoints);
            const arrowOriginHasMaxRank = (originOfArrow.dataset.currentRank == originOfArrow.dataset.maxRank)

            if (sufficientReqPoints == true && arrowOriginHasMaxRank == true) {
                if (originOfArrow.querySelector(".arrowcontainer") != null) {
                    originOfArrow.querySelector(".arrowcontainer").style.filter = 'none'
                }
                if (originOfArrow.querySelector(".secondarrowcontainer") != null) {
                    originOfArrow.querySelector(".secondarrowcontainer").style.filter = 'none'
                }
            } else {
                if (originOfArrow.querySelector(".arrowcontainer") != null) {
                    originOfArrow.querySelector(".arrowcontainer").style.filter = 'grayscale(100%)'
                }
                if (originOfArrow.querySelector(".secondarrowcontainer") != null) {
                    originOfArrow.querySelector(".secondarrowcontainer").style.filter = 'grayscale(100%)'
                }
            }
        };
    });
};

// Arrow Removal on Class Change Function //

function clearTalentArrows() {
    talentButtons.forEach(function (talentButton) {
        if (talentButton.querySelector('.arrowcontainer') != null) {
            talentButton.querySelector('.arrowcontainer').remove()
        }
        if (talentButton.querySelector('.secondarrowcontainer') != null) {
            talentButton.querySelector('.secondarrowcontainer').remove()
        }
    })
}

// Talent Point Click Tracker Function // 

document.addEventListener('click', onTalentClick);
for (var i = 0; i < talentButtons.length; i++) {
    talentButtons[i].addEventListener('mouseover', generateDescription)
};
for (var i = 0; i < talentButtons.length; i++) {
    talentButtons[i].addEventListener('mouseout', hideDescription)
};
for (var i = 0; i < talentContainer.length; i++) {
    talentContainer[i].addEventListener('contextmenu', function (event) {
        event.preventDefault();
        decrementTalentPoints(event)
        checkIfArrowsAreLegal()
        legalTalentCheck()
    })
};

function onTalentClick(event) {
    const talentImage = event.target.parentNode
    if (event.target.classList.contains('talentimage') &&
        talentImage.dataset.name != undefined &&
        clicksRemain != 0 &&
        canIncrementTalentRank(talentImage.dataset) &&
        hasRequiredTreePoints(talentImage.dataset) &&
        meetsPrereqRequirement(talentImage.dataset)) {
        decrementTotalPoints()
        incrementTreePoints(talentImage.dataset)
        incrementTalentPoints(talentImage)
        generateDescription(event)
        buildUrl()
        legalTalentCheck()
        talentReachedMaxRank(talentImage)
        checkIfArrowsAreLegal()
    }
};

function incrementTreePoints(talentClicked) {
    talentClicked.currentRank = parseInt(talentClicked.currentRank) + 1
    currentTalent = talentTrees[talentClicked.pos[0]]
    currentTalent.clicks = parseInt(currentTalent.clicks) + 1;
    currentTalent.dom.innerHTML = currentTalent.clicks;
};

function decrementTotalPoints() {
    clicksRemain -= 1;
    DOM["talentPoints"].innerHTML = clicksRemain;
};

function canIncrementTalentRank(talentClicked) {
    return talentClicked.currentRank < talentClicked.maxRank;
};

function meetsPrereqRequirement(talentClicked) {
    if (talentClicked.preReq) {
        return Array.prototype.slice.call(talentButtons).some(function (talent) {
            return talent.dataset.name == talentClicked.preReq &&
                talent.dataset.maxRank == talent.dataset.currentRank;
        })
    };
    return true
};

function hasRequiredTreePoints(talentClicked) {
    return talentClicked.reqPoints <= talentTrees[talentClicked.pos[0]].clicks;
};


// Individual Talent Point Functions //

function incrementTalentPoints(talentClicked) {
    talentClicked.querySelector('.currenttalentpoints').innerHTML = talentClicked.dataset.currentRank;
    if (talentClicked.querySelector('.individualtalentpoints').classList.contains("activetalentnopoints") != undefined && talentClicked.dataset.currentRank != 0){
        talentClicked.querySelector('.individualtalentpoints').classList.remove("activetalentnopoints")
        talentClicked.querySelector('.individualtalentpoints').classList.add("talentwithpoints")
    }
    checkIfTalentNoLongerAccessible()
};

function legalTalentInitialize() {
    const buttonWithPrereq = [...talentButtons].find(button => button.dataset.preReq == talentButton.dataset.name)
    if (talentButton.dataset.reqPoints == 0 && !buttonWithPrereq) {
        talentButton.classList.add("activetalent")
        talentButton.querySelector('.individualtalentpoints').classList.add("activetalentnopoints")
        talentButton.querySelector('.talentimage').classList.add("activetalentimage")
    };
    if (talentButton.dataset.currentRank == talentButton.dataset.maxRank) {
        talentClicked.querySelector('.individualtalentpoints').classList.add("maxranktalent")
        talentClicked.querySelector('.talentimage').classList.add("maxranktalent")
    };
};

function legalTalentCheck() {
    talentButtons.forEach(function (talentButton) {
        if (talentButton.dataset.name != undefined) {

            const talentTreePoints = talentTrees[talentButton.dataset.pos[0]].clicks;
            const requiredTalentTreePoints = talentButton.dataset.reqPoints;
            const sufficientReqPoints = (requiredTalentTreePoints <= talentTreePoints);

            const preReqTalentName = talentButton.dataset.preReq;
            const hasTalentPoints = (talentButton.dataset.currentRank > 0)

            const isMaxRank = (talentButton.dataset.currentRank == talentButton.dataset.maxRank)

            let meetsPreReq = !preReqTalentName;
            if (sufficientReqPoints && !isMaxRank && !hasTalentPoints) {
                if (!meetsPreReq) {
                    const preReqButton = [...talentButtons].find(button => button.dataset.name == preReqTalentName)
                    if (preReqButton.dataset.currentRank == preReqButton.dataset.maxRank) {
                        talentButton.classList.add("activetalent")
                        talentButton.querySelector('.individualtalentpoints').classList.add("activetalentnopoints")
                        talentButton.querySelector('.talentimage').classList.add("activetalentimage")
                    } else{
                        talentButton.classList.remove("activetalent")
                    }
                }
                if (meetsPreReq) {
                    talentButton.classList.add("activetalent")
                    talentButton.querySelector('.individualtalentpoints').classList.add("activetalentnopoints")
                    talentButton.querySelector('.talentimage').classList.add("activetalentimage")
                }
            }
            if (sufficientReqPoints && !isMaxRank && hasTalentPoints && meetsPreReq) {
                talentButton.querySelector('.individualtalentpoints').classList.add("talentwithpoints")
            };
        };
    });
};

function talentReachedMaxRank(talentClicked) {
    if (talentClicked.dataset.currentRank == talentClicked.dataset.maxRank) {
        talentClicked.querySelector('.individualtalentpoints').classList.add("maxranktalent")
        talentClicked.querySelector('.talentimage').classList.add("maxranktalent")
    };
};

function decrementTalentPoints(event) {
    const talentClicked = event.target.parentNode;
    if (talentClicked.dataset.name != undefined) {
        const currentTalent = talentTrees[talentClicked.dataset.pos[0]];
        const talentPointsRemain = talentClicked.dataset.currentRank > 0;
        const legalDecrement = checkLegalDecrement(talentClicked)
        if (talentPointsRemain && clicksRemain < 51 && currentTalent.clicks > 0 && legalDecrement) {
            talentClicked.dataset.currentRank = parseInt(talentClicked.dataset.currentRank) - 1
            currentTalent.clicks = parseInt(currentTalent.clicks) - 1
            currentTalent.dom.innerHTML = currentTalent.clicks
            clicksRemain += 1
            DOM["talentPoints"].innerHTML = clicksRemain
            event.target.parentNode.querySelector('.currenttalentpoints').innerHTML = talentClicked.dataset.currentRank
            decrementTalentBorderCheck(talentClicked)
            generateDescription(event)
        };
    };
};

function checkLegalDecrement(talentClicked) {
    if (talentedIsNotReliedOn(talentClicked) && wouldNotBreachTalentPointReqs(talentClicked)) {
        return true
    };
};

function talentedIsNotReliedOn(talentClicked) {
    if (talentClicked.dataset.name != undefined) {
        const buttonWithPrereq = [...talentButtons].find(button => button.dataset.preReq == talentClicked.dataset.name)
        if (buttonWithPrereq != undefined && buttonWithPrereq.dataset.currentRank != 0) {
            return false
        };
    }; return true
};

function wouldNotBreachTalentPointReqs(talentClicked) {
    if (talentClicked.dataset.name == undefined) {
        return false;
    };
    const treeButtons = [...talentButtons].filter(button => button.dataset.reqPoints != undefined && button.dataset.pos[0] == talentClicked.dataset.pos[0]),
        rowPoints = new Array();

    treeButtons.map(button => {
        return {
            row: button.dataset.reqPoints / 5,
            points: parseInt(button.dataset.currentRank)
        }
    }).forEach(function (talent) {
        if (rowPoints[talent.row] == undefined) {
            rowPoints[talent.row] = 0;
        };
        rowPoints[talent.row] += parseInt(talent.points);
    });

    let lastRowWithPoints = 0;
    rowPoints.forEach((points, index) => {
        if (points != 0) {
            lastRowWithPoints = index;
        };
    });

    let valid = true,
        totalPointsSoFar = 0,
        rowDecrementedFrom = talentClicked.dataset.reqPoints / 5;

    for (let i = 0; i <= lastRowWithPoints; i++) {
        const pointsRequiredForRow = i * 5;
        let pointsAfterDecrement = totalPointsSoFar;
        if (rowDecrementedFrom < i) {
            pointsAfterDecrement -= 1;
        };
        if (pointsAfterDecrement < pointsRequiredForRow) {
            valid = false;
        };
        totalPointsSoFar += rowPoints[i];
    };
    return valid;
};

function decrementTalentBorderCheck(talentClicked) {
    if (talentClicked.dataset.currentRank > 0 && talentClicked.dataset.currentRank != talentClicked.dataset.maxRank) {
        talentClicked.querySelector('.individualtalentpoints').classList.remove("maxranktalent")
        talentClicked.querySelector('.talentimage').classList.remove("maxranktalent")
        talentClicked.querySelector('.talentimage').classList.add("activetalentimage")
        talentClicked.querySelector('.individualtalentpoints').classList.add("talentwithpoints")
    };
    if (talentClicked.dataset.currentRank == 0) {
        talentClicked.querySelector('.individualtalentpoints').classList.remove("maxranktalent")
        talentClicked.querySelector('.talentimage').classList.remove("maxranktalent")
        talentClicked.querySelector('.individualtalentpoints').classList.remove("talentwithpoints")
        talentClicked.querySelector('.individualtalentpoints').classList.add("activetalentnopoints")
    };
    checkIfTalentNoLongerAccessible()
}

function checkIfTalentNoLongerAccessible() {
    talentButtons.forEach(function (talentButton) {
        if (talentButton.dataset.name != undefined) {
            const talentTreePoints = talentTrees[talentButton.dataset.pos[0]].clicks;
            const requiredTalentTreePoints = talentButton.dataset.reqPoints;
            const sufficientReqPoints = (requiredTalentTreePoints <= talentTreePoints);
            if (!sufficientReqPoints) {
                talentButton.classList.remove("activetalent")
            }
            else {
                talentButton.classList.add("activetalent")
            };
        };
    });
};

// Talent Description Text Function //

function generateDescription(event) {
    const talentImage = event.target.parentNode
    if (talentImage.tagName.toLowerCase() == 'td') {
        currentTalentTreeId = talentImage.parentNode.parentNode.dataset.id
        currentTreeTalentsArray = Object.values(classTalentsDict[currentClass][currentTalentTreeId].talents[0])
        currentTreeTalentsArray.forEach(function (talentData) {
            if (talentImage.dataset.name == talentData.name) {
                if (event.pageX > (window.innerWidth * .5)){
                    document.querySelector(".tooltip").style.left = (event.pageX - 175) + 'px'
                } else{
                    document.querySelector(".tooltip").style.left = event.pageX + 'px'
                }
                document.querySelector(".tooltip").style.top = (event.pageY - 150) + 'px'
                document.querySelector(".tooltip").style.visibility = "visible"
                document.querySelector(".tooltip").innerHTML = "<h1>" + talentData.name + "</h1>" + "\n" + "<p>" + talentData.description(talentImage.dataset.currentRank) + "</p>"
                talentBuildDataOuput(event.target, talentData)
            };
        });
    };
};

function hideDescription(event) {
    if (event.target.parentNode.tagName.toLowerCase() == 'td') {
        document.querySelector(".tooltip").style.visibility = "hidden"
    }
}

// Talent Build Data Output Function //

function talentBuildDataOuput(event, talentData) {
    if (event.parentNode.tagName.toLowerCase() == 'td') {
        if (event.parentNode.dataset.currentRank != 0) {
            if (event.parentNode.dataset.name == talentData.name && event.parentNode.dataset.name != talentBuildData.name) {
                talentBuildData[talentData.name] = talentData.description(event.parentNode.dataset.currentRank);
            };
            if (event.parentNode.dataset.name == talentBuildData.name) {
                talentBuildData[talentData.name] = talentData.description(event.parentNode.dataset.currentRank);
            };
            DOM['talentOutput'].innerHTML = Object.values(talentBuildData).join(" ")
        };
        if (event.parentNode.dataset.name == talentData.name && event.parentNode.dataset.currentRank == 0) {
            delete talentBuildData[event.parentNode.dataset.name]
            DOM['talentOutput'].innerHTML = Object.values(talentBuildData).join(" ")
        };
    };
};

// Talent Build URL Tracker Function///

function buildUrl() {
    let url = '/talent/' + currentClass + '/';
    talentButtons.forEach(function (talent) {
        url += talent.dataset.currentRank;
    });
    history.pushState({}, "", url)
}

// Talent URL Translator Function //

function translateURL() {
    if (window.location.pathname != '/talent' && window.location.pathname != '/talent/') {
        pathArray = window.location.pathname.split('/');
        currentClass = pathArray[2]
        if (document.getElementById(currentClass + 'btn') == null) {
            window.location.pathname = '/error'
        }
        document.getElementById(currentClass + 'btn').dispatchEvent(new Event('click'));
        buttons(classTalentsDict[currentClass])
        talentsUsedCount = 51
        talentValuesArray = Array.from(pathArray[3])
        talentValuesArray.forEach(function (talentValues, i) {
            if (talentButtons[i].dataset.name != undefined) {
                talentButtons[i].dataset.currentRank = parseInt(talentValues)
                if(talentButtons[i].dataset.currentRank > talentButtons[i].dataset.maxRank){
                    window.location.pathname = '/error'
                }
                talentButtons[i].querySelector('.currenttalentpoints').innerHTML = talentButtons[i].dataset.currentRank
                talentsUsedCount -= talentButtons[i].dataset.currentRank
                DOM["talentPoints"].innerHTML = talentsUsedCount
                clicksRemain = talentsUsedCount
                currentTalent = talentTrees[talentButtons[i].dataset.pos[0]]
                currentTalent.clicks = parseInt(currentTalent.clicks) + parseInt(talentValues);
                currentTalent.dom.innerHTML = currentTalent.clicks;
                let currentTalentData = classTalentsDict[currentClass][talentButtons[i].parentNode.parentNode.dataset.id].talents[0][talentButtons[i].dataset.name];
                if (currentTalentData && talentButtons[i].dataset.currentRank != 0) {
                    talentBuildData[currentTalentData.name] = currentTalentData.description(talentButtons[i].dataset.currentRank);
                }
                legalTalentCheck()
                if(talentButtons[i].dataset.currentRank != 0 && talentButtons[i].classList.contains("activetalent") == false){
                    window.location.pathname = '/error'
                }
                    talentReachedMaxRank(talentButtons[i])
            }
        })
        DOM['talentOutput'].innerHTML = Object.values(talentBuildData).join(" ")
        document.getElementById("talentmenutext").innerHTML = currentClass.charAt(0).toUpperCase() + currentClass.slice(1);;
    }
}