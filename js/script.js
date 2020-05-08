"use strict";

$( document ).ready(function() {
    runApp();
});
    
// Node constructor
function Node(action) { // node is one action
    // Actions available for current node (Reverse action isn't available) - children nodes 
    this.availableActions = {}, // contents children nodes
    this.rimsSnapshot = [], // to save Rims state snapshot
    this.parent = null,
    this.action = action;
}

function runApp() {
    // Define Application state object with common variables (in the runApp scope)
    let appState = {
        turn: null, // number of turns. 0 - is start position
        currentNode: null, // Current node is the pointer to the current Node in the node list
        direction: null, // traversal direction (forward or backward)
        autoplayStatus: false, // On / Off the autoplay
        autoplaySliderVal: 2, // Autoplay speed. 1 - slow, 2 - normal, 3 - fast
        timer: null, // timer ID for setInterval
        initialRims: [ // Rims initial position
            [1,2,3,4,5,6,7,8],
            [],
            []
        ]
    }

    // Init App state
    init(appState);

    // Next turn button click
    $( '#next' ).on( "click", function() {
        nextTurn(appState);
    })

    // Autoplay button click
    $( '#autoplay' ).on( "click", function() {
        if(appState.autoplayStatus) {
            // autoplay is activated - disactivate it
            deactivateAutoplay(appState);
        } else {
            // autoplay is disactivated - activate it
            activateAutoplay(appState);
        }
    })

    // Set up Bootstrap Slider
    $('#autoplaySpeed').slider();
    $("#autoplaySpeed").on("change", function(slideEvent) {
        appState.autoplaySliderVal = slideEvent.value.newValue;
        if(appState.timer) {
            deactivateAutoplay(appState);
            activateAutoplay(appState);
        }
    });

    // Reset button click
    $( '#reset' ).on( "click", function() {
        // Call init
        init(appState);
    })
}

let activateAutoplay = (appState) => {
    $('#autoplay').text('Stop autoplay');
    appState.autoplayStatus = true;

    // Set turn timer
    let autoplaySpeed = null;
    switch(appState.autoplaySliderVal) {
        case 1:
            autoplaySpeed = 1500; // Slow speed
            break;
        case 3: 
            autoplaySpeed = 5; // Fast speed
            break;
        default:
            autoplaySpeed = 500; // Normal speed. Value = 2
    }
    appState.timer = setInterval(() => nextTurn(appState), autoplaySpeed);
}

let deactivateAutoplay = (appState) => {
    $('#autoplay').text('Autoplay');
    appState.autoplayStatus = false;

    clearTimer(appState.timer);
}

let clearTimer = (timer) => {
    // Turn off timer
    clearInterval(timer);
    timer = null;
}

let nextTurn = (appState) => {
    if(checkIsSuccess(appState)) {
        return true;
    }

    // Increase turn counter
    appState.turn++;
    updateTurnCounter(appState.turn);
    console.log('--- TURN: ' + appState.turn + ' ---');
    setDirection(appState);
    
    // If the array with available actions (clildren) is not empty,
    // proceed traversal and move forward
    if(appState.direction == 'forward') {
        moveForward(appState);
    } else if (appState.direction == 'backward') {  
        moveBackward(appState);
    }
    
    // Redraw rims in new position
    drawRims(appState.currentNode);

    if(checkIsSuccess(appState)) {
        return true;
    }

    return false;
}

function init(appState) {
    // Set initial values
    $('#reset').hide();
    let node = new Node(null);
    node.rimsSnapshot = appState.initialRims;
    setActionsAvailability(node);
    appState.turn = 0;
    updateTurnCounter(appState.turn);
    appState.direction = 'forward';
    deactivateAutoplay(appState);
    drawRims(node);
    appState.currentNode = node;
}

let moveBackward = (appState) => {
    // Need to proceed go backward to parent node
    console.log('Moving backward');
    let deadEnd = appState.currentNode;
    let parentNode = appState.currentNode.parent;

    // Remove dead end branch
    delete parentNode.availableActions[deadEnd.action];

    appState.currentNode = parentNode;
}

let moveForward = (appState) => {
    console.log('Moving forward');
    let nextAction = parseInt(Object.keys(appState.currentNode.availableActions)[0]);
    let parent = appState.currentNode;
    appState.currentNode = new Node(nextAction);

    // Set parent node
    appState.currentNode.parent = parent;

    // Set child
    parent.availableActions[nextAction] = appState.currentNode;

    // Change rims position
    moveRims(appState);

    // Check whether the current node has the state the same that was before, 
    // except the root node
    if(seekTheSameStateNode(appState.currentNode)) {
        // Change direction. Need to go back
        appState.direction = 'backward';
        return;
    } // if it is false it doesn't have the same state, just continue

    // Need to get actions availability (first time in node)
    setActionsAvailability(appState.currentNode);

    // remove reverse action from available action list
    removeReverseAction(appState.currentNode);
}

let seekTheSameStateNode = (node) => {
    let seekNode = node.parent;
    while(seekNode.parent != null) {
        if(checkArraysEqual(node.rimsSnapshot, seekNode.rimsSnapshot)) {
            // The same rims position found
            return true;
        }
        seekNode = seekNode.parent
    }

    return false;
}

let moveRims = (appState) => {
    //////////// Actions ////////////
    // 1 - move rim from col1 to col2
    // 2 - move rim from col1 to col3
    // 3 - move rim from col2 to col1
    // 4 - move rim from col2 to col3
    // 5 - move rim from col3 to col1
    // 6 - move rim from col3 to col2
    /////////////////////////////////

    // Copy parents rims snapshot to current node
    appState.currentNode.parent.rimsSnapshot.forEach((v, i) => {appState.currentNode.rimsSnapshot[i] = v.slice()})
    let col1 = appState.currentNode.rimsSnapshot[0];
    let col2 = appState.currentNode.rimsSnapshot[1];
    let col3 = appState.currentNode.rimsSnapshot[2];

    switch(appState.currentNode.action) {
        case 1:
            col2.push(col1.pop());
            break;
        case 2:
            col3.push(col1.pop());
            break;
        case 3:
            col1.push(col2.pop());
            break;
        case 4:
            col3.push(col2.pop());
            break;
        case 5:
            col1.push(col3.pop());
            break;
        case 6:
            col2.push(col3.pop());
    }
}

let setDirection = (appState) => {
    if (Object.keys(appState.currentNode.availableActions).length > 0) {
        // there are available actions
        appState.direction = 'forward'
    } else {
        appState.direction = 'backward'
    }
} 

let setActionsAvailability = (node) => {
    let currentAvailableActions = {};

    let col1 = node.rimsSnapshot[0];
    let top1 = col1[col1.length - 1];
    if(typeof top1 === 'undefined') {
        top1 = 0;
    }

    let col2 = node.rimsSnapshot[1];
    let top2 = col2[col2.length - 1];
    if(typeof top2 === 'undefined') {
        top2 = 0;
    }

    let col3 = node.rimsSnapshot[2];
    let top3 = col3[col3.length - 1];
    if(typeof top3 === 'undefined') {
        top3 = 0;
    }

    if(top1 > top2) {
        currentAvailableActions[1] = null;
    }
    if(top1 > top3) {
        currentAvailableActions[2] = null;
    }
    if(top2 > top1) {
        currentAvailableActions[3] = null;
    }
    if(top2 > top3) {
        currentAvailableActions[4] = null;
    }
    if(top3 > top1) {
        currentAvailableActions[5] = null;
    }
    if(top3 > top2) {
        currentAvailableActions[6] = null;
    }

    node.availableActions = currentAvailableActions;
}

let removeReverseAction = (node) => {
    //// Reverse actions array: ////
    // Action: 1 - Reverse action: 3
    // Action: 2 - Reverse action: 5
    // Action: 3 - Reverse action: 1
    // Action: 4 - Reverse action: 6
    // Action: 5 - Reverse action: 2
    // Action: 6 - Reverse action: 4
    ////////////////////////////////

    let reverseAction;
    switch(node.action) {
        case 1:
            reverseAction = 3;
            break;
        case 2:
            reverseAction = 5;
            break;
        case 3:
            reverseAction = 1;
            break;
        case 4:
            reverseAction = 6;
            break;
        case 5:
            reverseAction = 2;
            break;
        case 6:
            reverseAction = 4;
    }

    // Prevent moving to previous position
    delete node.availableActions[reverseAction]
}

let checkIsSuccess = (appState) => {
    let column = 0;
    let rimsSnapshot = appState.currentNode.rimsSnapshot;
    let initialRims = appState.initialRims;
    if(rimsSnapshot[1].length == initialRims[0].length) {
        column = 1;
    }
    if(rimsSnapshot[2].length == initialRims[0].length) {
        column = 2;
    }
    if(column == 0) {
        // Not all rims are on one column
        return false;
    }
    let rimsArrLength = initialRims[0].length;
    for(var i = 1; i <= rimsArrLength; i++) {
        if(rimsSnapshot[column][i] != initialRims[0][i]) {
            // not equal element found, so it is not solution
            return false;
        }
    }

    // the end of array has reached and all elements are equal, so it is the puzzle solution
    finalize(appState);

    return true;
}

let finalize = (appState) => {
    deactivateAutoplay(appState);
    $('#reset').show();
    let alertTimeout = setTimeout(() => {
        alert ("Congratulations! You've resolved the puzzle!");
    }, 100)
      
    console.log('Resolved for ' + turn + ' turns');
}

let drawRims = (node) => {
    $("#col1, #col2, #col3").find('div.col-box div').remove();
    const totalBootstrapCols = 12;

    node.rimsSnapshot.forEach(function (value, index) {
        if(Array.isArray(value)) {
            value.forEach(function (v, i) {
                $('#col' + (index + 1)).find('div.col-box')
                .prepend('<div class="rim col-' + (totalBootstrapCols - v) + '">' + v + '</div>');
            })
        }
    })
}

let checkArraysEqual = (arr1, arr2) => {
    // check is array
    if (!Array.isArray(arr1) || !Array.isArray(arr2)) {
        return false;
    }

    // if lengths are not equal
    if (arr1.length !== arr2.length) {
        return false;
    } else {
        // comapring each element of arrays
        let arr1Length = arr1.length;
        for (var i = 0; i < arr1Length; i++) {
            if (Array.isArray(arr1[i]) && Array.isArray(arr2[i])) {
                // Subarray - comapring each element of subarrays
                if (arr1[i].length !== arr2[i].length) {
                    return false;
                } else {
                    let arr1ILength = arr1[i].length;
                    for (var j = 0; j < arr1ILength; j++) {
                        if (arr1[i][j] !== arr2[i][j]) {
                            return false;
                        }
                    }
                }
            } else if (arr1[i] !== arr2[i]) {
                return false;
            }
        }
    }
    return true;
};

let updateTurnCounter = (turn) => {
    $('#turn').text(turn);
}