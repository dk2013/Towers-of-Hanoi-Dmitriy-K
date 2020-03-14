//////////// Actions ////////////
// 1 - move rim from col1 to col2
// 2 - move rim from col1 to col3
// 3 - move rim from col2 to col1
// 4 - move rim from col2 to col3
// 5 - move rim from col3 to col1
// 6 - move rim from col3 to col2
/////////////////////////////////
//var allAvailableActions = 6;
var initialRims = [
    [1,2,3,4,5,6,7,8],
    [],
    []
];
var actionTree = [];
var turn; // number of turn. 0 - is start position
/*
actionTree.prototype.addNode = function(node) {
}
*/


var currentNode;
var direction; // forward or backward
// var currentAvailableActions = []; 
function node(action) { // node is one action
    // Actions available for current node (Reverse action isn't available) - children nodes 
    this.availableActions = {},
    this.rimsSnapshot = [], // to Rims state snapshot save
    this.parent = null,
    this.action = action;
}
$( document ).ready(function() {
    init();
    $( '.next' ).on( "click", function() {
        // console.log('next');
        if(routine()) {
            alert ("Congratulations! You've resolved the puzzle!");
            return;
        }
    })
});

var routine = () => {
    // Increase turn
    turn++;
    console.log('--- TURN: ' + turn + ' ---');

    // var currentRims = []; // current rims positions for drawing
    //var currentAction = currentNode.action;
    // console.log('Prev action: ' + currentNode.action);

    // If the array with available actions (clildren) is not empty,
    // proceed traversal 
    if(Object.keys(currentNode.availableActions).length > 0) {
 
        //console.log("Not first checking of this node");
        // move forw
        // direction = 'forward';
    } else {
        // move backward
        // direction = 'backward';
        
    }
    // if there are children go to first child
    // if no move back
    getDirection();
    console.log(direction);
    
    

    if(direction == 'forward') {
        // Moving forward 
        

        moveForward();
    } else if (direction == 'backward') {
        // Need to proceed go backward to parent node
        // console.log("Need to proceed go backward to parent node");
  
        moveBackward();
    }
    
    drawRims();

    if(checkIsSuccess()) {
        return true;
    }

    return false;
}

var init = () => {
    // currentRims = initialRims;
    currentNode = new node(null);
    currentNode.rimsSnapshot = initialRims;
    determineActionsAvailability();
    turn = 0;
    direction = 'forward';
//    currentAvailableActions = [];
    actionTree.push(currentNode); // Push root node to tree
    // console.log(actionTree);
    drawRims();
}

var moveBackward = () => {
    console.log('Moving backward');
    var deadEnd = currentNode;
    currentNode = currentNode.parent;

    console.log(deadEnd, currentNode);
    // Remove dead end branch
    delete currentNode.availableActions[deadEnd.action];
    console.log(currentNode);
    // Mark node that we returned from as dead end
}

var moveForward = () => {
    console.log('Moving forward');
    var nextAction = parseInt(Object.keys(currentNode.availableActions)[0]); //currentNode.availableActions[0];
    // console.log('Current (next) action: ' + nextAction);
    var parent = currentNode;
    currentNode = new node(nextAction);
    // Set parent node
    currentNode.parent = parent;
    console.log('Parent node: ');
    console.log(parent);
    console.log('Current node: ');
    console.log(currentNode);
    // Set children
    parent.availableActions[nextAction] = currentNode;

    
    // Move rims to new state
    moveRims(nextAction);

    // Check whether the current node has the state the same that was before, 
    // except the root node
    if(seekTheSameStateNode()) {
        // Change direction. Need to go back
        changeDirection('backward');
        return;
    } // if it is false it doesn't have the same state, just continue

    // Save rims state
    // currentNode.rimsSnapshot = currentRims;

    // Need to get actions availability (first time in node)
    // console.log("Need to get actions availability");
    determineActionsAvailability();
    // remove reverse action from available action list
    removeReverseAction();
    // console.log('Current available actions: '); 
    // console.log(currentNode.availableActions);
}

var seekTheSameStateNode = () => {
    var seekNode = currentNode.parent;
    //console.log(seekNode);
    while(seekNode.parent != null) {
        console.log('Seek node with the same state as the current node, except the root node');
        // console.log(currentNode.rimsSnapshot, seekNode.rimsSnapshot);
        if(checkArraysEqual(currentNode.rimsSnapshot, seekNode.rimsSnapshot)) {
            console.log('seek and found');
            console.log(currentNode.rimsSnapshot, seekNode.rimsSnapshot);
            console.log(seekNode);
            return true;
        }
        seekNode = seekNode.parent
    }

    return false;
}

var moveRims = (action) => {
    // Copy parents rims snapshot to current node
    // console.log('copy');
    // console.log(currentNode.rimsSnapshot, currentNode.parent.rimsSnapshot);
    currentNode.parent.rimsSnapshot.forEach((v, i) => {currentNode.rimsSnapshot[i] = v.slice()})
    var col1 = currentNode.rimsSnapshot[0];
    var col2 = currentNode.rimsSnapshot[1];
    var col3 = currentNode.rimsSnapshot[2];
    // console.log(currentNode.rimsSnapshot);

    switch(action) {
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
        case 2:
            col2.push(col3.pop());
    }
    // console.log(col1, col2, col3);
}

var changeDirection = (direction) => {
    console.log('Go ' + direction);
    direction = direction;
}

var getDirection = () => {
    if (Object.keys(currentNode.availableActions).length > 0) {
        // there are available actions
        direction = 'forward'
    } else {
        direction = 'backward'
    }
} 

var determineActionsAvailability = () => {
    var currentAvailableActions = {};
    var col1 = currentNode.rimsSnapshot[0];
    var top1 = col1[col1.length - 1];
    // console.log('top1: ' + top1);
    if(typeof top1 === 'undefined') {
        top1 = 0;
    }
    var col2 = currentNode.rimsSnapshot[1];
    var top2 = col2[col2.length - 1];
    // console.log('top2: ' + top2);
    if(typeof top2 === 'undefined') {
        top2 = 0;
    }
    var col3 = currentNode.rimsSnapshot[2];
    var top3 = col3[col3.length - 1];
    // console.log('top3: ' + top3);
    if(typeof top3 === 'undefined') {
        top3 = 0;
    }
    // console.log(currentNode.rimsSnapshot, top1, top2, top3);

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

    currentNode.availableActions = currentAvailableActions;
}

var removeReverseAction = () => {
    //// Reverse actions array: ////
    // Action: 1 - Reverse action: 3
    // Action: 2 - Reverse action: 5
    // Action: 3 - Reverse action: 1
    // Action: 4 - Reverse action: 6
    // Action: 5 - Reverse action: 2
    // Action: 6 - Reverse action: 4
    switch(currentNode.action) {
        case 1:
            var reverseAction = 3;
            break;
        case 2:
            var reverseAction = 5;
            break;
        case 3:
            var reverseAction = 1;
            break;
        case 4:
            var reverseAction = 6;
            break;
        case 5:
            var reverseAction = 2;
            break;
        case 6:
            var reverseAction = 4;
    }
    delete currentNode.availableActions[reverseAction]
}

var checkIsSuccess = () => {
    var column = 0;
    if(currentNode.rimsSnapshot[1].length == initialRims[0].length) {
        column = 1;
    }
    if(currentNode.rimsSnapshot[2].length == initialRims[0].length) {
        column = 2;
    }
    if(column == 0) {
        // Not all rims are on one column
        return false;
    }
    for(var i = 1; i <= initialRims[0].length; i++) {
        if(currentNode.rimsSnapshot[column][i] != initialRims[0][i]) {
            // gotten not equal element it is not solution
            return false;
        }
    }

    // the end of array has reached and all elements are equal so it is proper solution
    return true;
}

var drawRims = () => {
    $("#col1, #col2, #col3").find('div.col-box div').remove();
    currentNode.rimsSnapshot.forEach(function (value, index) {
        if(Array.isArray(value)) {
            value.forEach(function (v, i) {
                // console.log(index, i, v);
                $('#col' + (index + 1)).find('div.col-box').prepend('<div id="rim' + v + '" class="rim">' + v + '</div>');
            })
        }
    })
}

var checkArraysEqual = (arr1, arr2) => {
    //console.log(arr1, arr2);
    // check is array
    if (!Array.isArray(arr1) || !Array.isArray(arr2)) {
        return false;
    }
    // if length are not equal
    if (arr1.length !== arr2.length) {
        return false;
    } else {
        // comapring each element of arrays
        for (var i = 0; i < arr1.length; i++) {
            if (Array.isArray(arr1[i]) && Array.isArray(arr2[i])) {
                if (arr1[i].length !== arr2[i].length) {
                    return false;
                } else {
                    for (var j = 0; j < arr1[i].length; j++) {
                        // console.log("i: " + i, "j: " + j);
                        if (arr1[i][j] !== arr2[i][j]) {
                            return false;
                        }
                    }
                }
            } else if (arr1[i] !== arr2[i]) {
                // console.log("-i-: " + i);
                return false;
            }
        }
    }
    return true;
};