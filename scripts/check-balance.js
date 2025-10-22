// Quick script to check contract balance
// Run with: node scripts/check-balance.js

const CONTRACT_ADDRESS = "0xf44adEdec3f5E7a9794bC8E830BE67e4855FA8fF";
const RPC_URL = "https://rpc.sepolia-api.lisk.com";

async function checkBalance() {
  try {
    const response = await fetch(RPC_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_getBalance',
        params: [CONTRACT_ADDRESS, 'latest'],
        id: 1
      })
    });

    const data = await response.json();
    const balanceWei = BigInt(data.result);
    const balanceEth = Number(balanceWei) / 1e18;

    console.log('\n=== Contract Balance ===');
    console.log('Contract:', CONTRACT_ADDRESS);
    console.log('Balance:', balanceEth, 'ETH');
    console.log('Balance (Wei):', balanceWei.toString());

    const harvestsAvailable = Math.floor(balanceEth / 0.003);
    console.log('\nHarvests Available:', harvestsAvailable);

    if (balanceEth < 0.01) {
      console.log('\n⚠️  WARNING: Low balance! Contract needs more ETH.');
      console.log('Recommended: Send at least 0.1 ETH to the contract.');
    } else {
      console.log('\n✅ Contract has sufficient balance.');
    }

  } catch (error) {
    console.error('Error checking balance:', error);
  }
}

checkBalance();
