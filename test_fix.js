import { validateMove, processMove, createGameState } from './server/Controller/gameController.js';

function test() {
    console.log("Testing gameController.js...");

    // Test validateMove range
    console.log("Testing validateMove range...");
    const state = createGameState();
    const result0 = validateMove(state.board, 0, 'X', 'X');
    console.log("Index 0 valid:", result0.valid); // should be true
    
    const result1 = validateMove(state.board, 1, 'X', 'X');
    console.log("Index 1 valid:", result1.valid); // should be true (was failing before)

    const result8 = validateMove(state.board, 8, 'X', 'X');
    console.log("Index 8 valid:", result8.valid); // should be true

    const result9 = validateMove(state.board, 9, 'X', 'X');
    console.log("Index 9 valid:", result9.valid); // should be false

    // Test processMove turn swap
    console.log("\nTesting processMove turn swap...");
    const newState = processMove(state, 0, 'X');
    console.log("New turn after X move:", newState.currentTurn); // should be 'O' (was '0' before)
    
    if (newState.currentTurn === 'O') {
        console.log("✅ Turn swap test passed!");
    } else {
        console.log("❌ Turn swap test failed! Current turn:", newState.currentTurn);
    }

    if (result1.valid && !result9.valid) {
        console.log("✅ Range check test passed!");
    } else {
        console.log("❌ Range check test failed!");
    }
}

test();
