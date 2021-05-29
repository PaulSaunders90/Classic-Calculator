// Talent Tree Functions //
// Talent Page Variables //
var clickState = false,
    talentButtons = document.querySelectorAll('td'),
    talentHeaders = document.querySelectorAll('.talentheader'),
    talentContainer = document.getElementsByClassName("classtalents"),
    clicksRemain = 51,
    clickedTalent = 0,
    talentBuildData = {},
    urlData = "",
    menuClicks = 0;

// Talent Page Dictionary //
// Talent Tree Class Directory //

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

// DOM Directory //

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
    talentMenuText: document.getElementById("talentmenutext"),
    scrollArrow: document.getElementById("scrollarrow"),
    copyBuildButton: document.getElementById("copylinkbutton"),
    resetButton: document.getElementById("treeresetbutton"),
    toolTip: document.querySelector(".tooltip"),
    classButtons: document.getElementsByClassName("character-button")
};

// Talent Tree Objects //

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
// Default Menu Text Initialization //

function toggleMenuText() {
    DOM["talentMenuText"].innerHTML = "Pick a Class!";
};

// Class Attribution DOM Selection //

function selectClass(e) {
    currentClass = e.target.getAttribute("data-character");
};

// Talent Tree Class Display On Click and Object Initialization Function //

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
        unselectedClassGrayingOut(e)
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

// Talent Table Generation and Talent Point Dataset Initialization Function //

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

// Class Selection Button Functions //
// Class Button Mouseover Class Name Display Function //

function displayClassName(e) {
    var selectedClass = e.target.getAttribute("data-character");
    if (e.pageX > (window.innerWidth * .5)) {
        DOM["toolTip"].style.left = (e.pageX - 60) + 'px'
    } else {
        DOM["toolTip"].style.left = (e.pageX + 30) + 'px';
    };
    DOM["toolTip"].style.top = e.pageY + 'px';
    DOM["toolTip"].style.width = "50px";
    DOM["toolTip"].style.visibility = "visible";
    DOM["toolTip"].innerHTML = "<p>" + selectedClass.charAt(0).toUpperCase() + selectedClass.slice(1) + "<p>";
};


// Class Button Mouseout Class Name Display Removal Function//

function hideClassName() {
    DOM["toolTip"].style.visibility = "hidden";
}

for (i = 0; i < DOM["classButtons"].length; i++) {
    DOM["classButtons"][i].addEventListener("mouseover", displayClassName)
    DOM["classButtons"][i].addEventListener("mouseout", hideClassName)
};

// Unselected Class Grey Filter Application Function //

function unselectedClassGrayingOut(e) {
    if (e.target.getAttribute("data-character") != null) {
        var selectedClass = e.target.getAttribute("data-character");
        var selectedButton = document.getElementById(selectedClass + "btn")
        for (i = 0; i < DOM["classButtons"].length; i++) {
            DOM["classButtons"][i].style.filter = "grayscale(100%)";
        }
        selectedButton.style.filter = "none";
    };
};

// Hover Functions for Class Button Functions //

function classButtonMouseOverFilterRemoval(e) {
    if (e.target.getAttribute("data-character") != null) {
        var selectedClass = e.target.getAttribute("data-character");
        var selectedButton = document.getElementById(selectedClass + "btn")
        selectedButton.style.filter = "none";
    };
};

function classButtonMouseOut(e) {
    if (e.target.getAttribute("data-character") != null) {
        var selectedClass = e.target.getAttribute("data-character");
        var selectedButton = document.getElementById(selectedClass + "btn")
        var currentClass = document.getElementById(window.location.pathname.split("/")[2] + "btn")
        selectedButton.style.filter = "grayscale(100%)";
        currentClass.style.filter = "none";
    };
};

for (i = 0; i < DOM["classButtons"].length; i++) {
    DOM["classButtons"][i].addEventListener("mouseover", classButtonMouseOverFilterRemoval)
    DOM["classButtons"][i].addEventListener("mouseout", classButtonMouseOut)
};

// Arrow Activation or Deactivation Based Upon Talent Points Function //

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

// Talent Decrement Event Listener to Determine Legal Decrements; Removes Context Menu //

for (var i = 0; i < talentContainer.length; i++) {
    talentContainer[i].addEventListener('contextmenu', function (event) {
        event.preventDefault();
        decrementTalentPoints(event)
        checkIfArrowsAreLegal()
        legalTalentCheck()
    })
};

// Legal Talent Click Checking Master Function //

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

// Point Increment on Click Function // 

function incrementTreePoints(talentClicked) {
    talentClicked.currentRank = parseInt(talentClicked.currentRank) + 1
    currentTalent = talentTrees[talentClicked.pos[0]]
    currentTalent.clicks = parseInt(currentTalent.clicks) + 1;
    currentTalent.dom.innerHTML = currentTalent.clicks;
};

// Point Decrement on Click Function //

function decrementTotalPoints() {
    clicksRemain -= 1;
    DOM["talentPoints"].innerHTML = clicksRemain;
};

// Max Level Point Check Function //

function canIncrementTalentRank(talentClicked) {
    return talentClicked.currentRank < talentClicked.maxRank;
};

// Talent Prerequisite Check Function // 

function meetsPrereqRequirement(talentClicked) {
    if (talentClicked.preReq) {
        return Array.prototype.slice.call(talentButtons).some(function (talent) {
            return talent.dataset.name == talentClicked.preReq &&
                talent.dataset.maxRank == talent.dataset.currentRank;
        })
    };
    return true
};

// Required Pre-requisite Point Check Function //

function hasRequiredTreePoints(talentClicked) {
    return talentClicked.reqPoints <= talentTrees[talentClicked.pos[0]].clicks;
};


// Individual Talent Point Functions //

function incrementTalentPoints(talentClicked) {
    talentClicked.querySelector('.currenttalentpoints').innerHTML = talentClicked.dataset.currentRank;
    if (talentClicked.querySelector('.individualtalentpoints').classList.contains("activetalentnopoints") != undefined && talentClicked.dataset.currentRank != 0) {
        talentClicked.querySelector('.individualtalentpoints').classList.remove("activetalentnopoints")
        talentClicked.querySelector('.individualtalentpoints').classList.add("talentwithpoints")
    }
    checkIfTalentNoLongerAccessible()
};

// Initialize Legal Talents if All Legal Criteria is Met //

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

// Function to Check if All Prerequisites are Met, Determines if a Talent Can be Legally Clicked //

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
                    } else {
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

// Function that Determines Max Rank and Prevents Overabundant Point Allocation //

function talentReachedMaxRank(talentClicked) {
    if (talentClicked.dataset.currentRank == talentClicked.dataset.maxRank) {
        talentClicked.querySelector('.individualtalentpoints').classList.add("maxranktalent")
        talentClicked.querySelector('.talentimage').classList.add("maxranktalent")
    };
};

// Master Decrement Function to Determine if a Talent Can Legally Have its Points Reduced //

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


// Legal Decrement Check Master Function //

function checkLegalDecrement(talentClicked) {
    if (talentedIsNotReliedOn(talentClicked) && wouldNotBreachTalentPointReqs(talentClicked)) {
        return true
    };
};

// Function to Check if the Talent is Used and Necessary for Other Talents Down the Tree Line //

function talentedIsNotReliedOn(talentClicked) {
    if (talentClicked.dataset.name != undefined) {
        const buttonWithPrereq = [...talentButtons].find(button => button.dataset.preReq == talentClicked.dataset.name)
        if (buttonWithPrereq != undefined && buttonWithPrereq.dataset.currentRank != 0) {
            return false
        };
    }; return true
};

// Function to Determine if Decrementing Current Talent Would Affect Legality of Other Talents//

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

// Function that Adjusts Color of Borders Based Upon Ranking Decrements //

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

// Function Determining Whether Talent is Still Legal After Decrements of Other Talents Occur //

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

// Talent Description Text Functions //
// Mouse Over and Mouse Out Event Listeners for Talent Description Boxes //

for (var i = 0; i < talentButtons.length; i++) {
    talentButtons[i].addEventListener('mouseover', generateDescription)
};
for (var i = 0; i < talentButtons.length; i++) {
    talentButtons[i].addEventListener('mouseout', hideDescription)
};

// Talent Description Generation Function //

function generateDescription(event) {
    const talentImage = event.target.parentNode
    if (talentImage.tagName.toLowerCase() == 'td') {
        currentTalentTreeId = talentImage.parentNode.parentNode.dataset.id
        currentTreeTalentsArray = Object.values(classTalentsDict[currentClass][currentTalentTreeId].talents[0])
        currentTreeTalentsArray.forEach(function (talentData) {
            if (talentImage.dataset.name == talentData.name) {
                DOM["toolTip"].innerHTML = "<h1>" + talentData.name + "</h1>" + "\n" + "<p>" + talentData.description(talentImage.dataset.currentRank) + "</p>";
                if (event.pageX > (window.innerWidth * .5)) {
                    DOM["toolTip"].style.left = (talentImage.getBoundingClientRect().left - 125) + "px";
                } else {
                    DOM["toolTip"].style.left = (talentImage.getBoundingClientRect().left + 30) + "px";
                }
                DOM["toolTip"].style.top = (event.pageY - 30 ) + "px";
                DOM["toolTip"].style.width = "150px";
                DOM["toolTip"].style.visibility = "visible";
                talentBuildDataOuput(event.target, talentData)
            };
        });
    };
};

// Talent Description Obfuscation Function //

function hideDescription(event) {
    if (event.target.parentNode.tagName.toLowerCase() == 'td') {
        DOM["toolTip"].style.visibility = "hidden";
        DOM["toolTip"].style.left = "";
        DOM["toolTip"].style.top = "";
        DOM["toolTip"].style.width = "";
    }
}

// Talent Build Data Output to Text Function //

function talentBuildDataOuput(event, talentData) {
    if (event.parentNode.tagName.toLowerCase() == 'td') {
        if (event.parentNode.dataset.currentRank != 0) {
            if (event.parentNode.dataset.name == talentData.name && event.parentNode.dataset.name != talentBuildData.name) {
                talentBuildData[talentData.name] = "<li>" + talentData.description(event.parentNode.dataset.currentRank) + "</li>";
            };
            if (event.parentNode.dataset.name == talentBuildData.name) {
                talentBuildData[talentData.name] = "<li>" + talentData.description(event.parentNode.dataset.currentRank) + "</li>";
            };
            DOM['talentOutput'].innerHTML = Object.values(talentBuildData).join(" ");
        };
        if (event.parentNode.dataset.name == talentData.name && event.parentNode.dataset.currentRank == 0) {
            delete talentBuildData[event.parentNode.dataset.name]
            DOM['talentOutput'].innerHTML = Object.values(talentBuildData).join(" ");
        };
    };
};

// Talent Output Text Display Checks //

function displayTalentOutput() {
    var remainingClicks = parseInt(DOM["talentPoints"].innerHTML)
    if (remainingClicks < 51) {
        DOM['talentOutputContainer'].style.display = "block"
    } else {
        DOM['talentOutputContainer'].style.display = "none"
    }
}

function removeTalentOutputOnDecrement() {
    var remainingClicks = parseInt(DOM["talentPoints"].innerHTML)
    if (remainingClicks == 51) {
        DOM['talentOutputContainer'].style.display = "none"
    } else {
        DOM['talentOutputContainer'].style.display = "block"
    }
}

window.addEventListener('click', displayTalentOutput);
window.addEventListener('contextmenu', removeTalentOutputOnDecrement);

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
        };
        document.getElementById("talentmenutext").innerHTML = currentClass.charAt(0).toUpperCase() + currentClass.slice(1);
        document.getElementById(currentClass + 'btn').dispatchEvent(new Event('click'));
        buttons(classTalentsDict[currentClass])
        talentsUsedCount = 51
        talentValuesArray = Array.from(pathArray[3])
        urlData += "/talent/" + currentClass + "/";
        talentValuesArray.forEach(function (talentValues, i) {
            if (talentButtons[i].dataset.name != undefined) {
                talentButtons[i].dataset.currentRank = parseInt(talentValues)
                if (talentButtons[i].dataset.currentRank > talentButtons[i].dataset.maxRank) {
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
                    talentBuildData[currentTalentData.name] = "<li>" + currentTalentData.description(talentButtons[i].dataset.currentRank) + "</li>";
                }
                legalTalentCheck()
                if (talentButtons[i].dataset.currentRank != 0 && talentButtons[i].classList.contains("activetalent") == false) {
                    window.location.pathname = '/error'
                }
                talentReachedMaxRank(talentButtons[i])
            }
            urlData += talentButtons[i].dataset.currentRank;
            if (talentsUsedCount < 51) {
                DOM['talentOutputContainer'].style.display = "block"
            }
        });
        DOM['talentOutput'].innerHTML = Object.values(talentBuildData).join(" ")
    };
};


// Propagate URL after Translation Function //

function propagateURL() {
    history.replaceState("", "Classic Calculator", urlData);
};

window.addEventListener("load", propagateURL);

// Scroll to Top Functions //
// Scroll to Top on Arrow Click Function //

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
    DOM["scrollArrow"].style.display = "none";
};

DOM["scrollArrow"].addEventListener("click", scrollToTop);

// Function to Make Arrow Visible After Scrolling Down //

function checkScrollPosition() {
    var windowPosition = window.scrollY
    var visibleArrowPosition = DOM["talentPoints"].getBoundingClientRect().bottom
    if (windowPosition >= visibleArrowPosition) {
        DOM["scrollArrow"].style.display = "block";
    }
    else {
        DOM["scrollArrow"].style.display = "none";
    };
};

window.addEventListener("scroll", checkScrollPosition);

// Copy Build Button Function //

function copyBuild() {
    var urlBuild = window.location.href;
    var copyInput = document.createElement("input");
    copyInput.className = "urlInput";
    document.body.append(copyInput);
    copyInput.value = urlBuild;
    copyInput.select();
    document.execCommand("copy");
    document.body.removeChild(copyInput);
    DOM["toolTip"].style.left = (DOM["copyBuildButton"].getBoundingClientRect().left + 30) + "px";
    DOM["toolTip"].style.top = (DOM["copyBuildButton"].getBoundingClientRect().top + 30) + "px";
    DOM["toolTip"].style.visibility = "visible";
    DOM["toolTip"].innerHTML = "<h1>URL Copied!</h1>";
}

function hideCopyBuildNotification() {
    DOM["toolTip"].style.visibility = "hidden";
}

DOM["copyBuildButton"].addEventListener('click', copyBuild);
DOM["copyBuildButton"].addEventListener('mouseout', hideCopyBuildNotification)

// Reset Button Function //

function talentReset(e) {
    displayCharacter(e)
}

DOM["resetButton"].addEventListener('click', talentReset);