const { AuctionEngine } = require('./server/dist/server/src/engine');
const { Auction } = require('./server/dist/types/auction');

async function runTests() {
    console.log('--- Starting Auction Engine Verification ---');
    
    const engine = new AuctionEngine();
    const mockAuction = {
        id: 'test-1',
        title: 'Test Auction',
        description: 'Desc',
        imageUrl: '',
        seller: { address: 'kaspa:123' },
        startPrice: 100,
        currentPrice: 100,
        minimumIncrement: 10,
        startTime: new Date(Date.now() - 10000),
        endTime: new Date(Date.now() + 10000),
        status: 'live',
        bids: [],
        bidCount: 0
    };

    engine.createAuction(mockAuction);
    console.log('✓ Auction created');

    // Test 1: Valid Bid
    const txData1 = {
        hash: 'tx1',
        amount: 120,
        sender: 'bidder1',
        timestamp: Date.now()
    };

    const bid1 = await engine.processOnChainBid('test-1', txData1);
    if (bid1 && bid1.amount === 120) {
        console.log('✓ Valid bid accepted');
    } else {
        console.error('✗ Valid bid failed');
        process.exit(1);
    }

    // Test 2: Increment Check
    const txData2 = {
        hash: 'tx2',
        amount: 125, // Only +5, increment is 10
        sender: 'bidder2',
        timestamp: Date.now()
    };

    const bid2 = await engine.processOnChainBid('test-1', txData2);
    if (bid2 === null) {
        console.log('✓ Below minimum increment rejected');
    } else {
        console.error('✗ Below minimum increment accepted erroneously');
        process.exit(1);
    }

    console.log('--- Verification Successful ---');
}

runTests().catch(err => {
    console.error('Test execution failed:', err);
    process.exit(1);
});
