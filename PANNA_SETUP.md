# Panna SDK Integration - Lisk Garden DApp

## ✅ Implementation Complete

The Lisk Garden DApp now uses the **official Panna SDK** for Web3 authentication and wallet management.

## 📁 Project Structure

```
lisk-garden-dapp/
├── components/
│   ├── providers.tsx          # Panna SDK provider wrapper
│   └── garden-header.tsx      # Header with ConnectButton
├── app/
│   ├── layout.tsx             # Root layout with Providers
│   ├── globals.css            # Includes Panna SDK styles
│   └── page.tsx               # Home page
├── .env.local                 # Environment variables
└── next.config.mjs            # Next.js config with CORS headers
```

## 🔧 Configuration

### Environment Variables (`.env.local`)

```bash
NEXT_PUBLIC_PANNA_CLIENT_ID=7cb948c18beb24e6105880bdd3e734f0
NEXT_PUBLIC_PANNA_PARTNER_ID=ff838874-df55-4b2e-8bfc-88df08f33296
NEXT_PUBLIC_CHAIN_ID=4202  # Lisk Sepolia Testnet
```

### Provider Setup (`components/providers.tsx`)

```tsx
import { PannaProvider } from 'panna-sdk';
import { chain } from 'panna-sdk/core';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PannaProvider
      clientId={process.env.NEXT_PUBLIC_PANNA_CLIENT_ID}
      partnerId={process.env.NEXT_PUBLIC_PANNA_PARTNER_ID}
      chainId={process.env.NEXT_PUBLIC_CHAIN_ID || String(chain.liskSepolia.id)}
    >
      {children}
    </PannaProvider>
  );
}
```

## 🎯 Features

### 1. ConnectButton Component
The pre-built `ConnectButton` from Panna SDK provides:
- ✅ Email authentication with OTP
- ✅ Phone authentication with SMS
- ✅ Social login (Google, Apple, Facebook, etc.)
- ✅ Wallet connection
- ✅ Account management UI
- ✅ Responsive design

### 2. Available Hooks

Use these hooks anywhere in your app:

```tsx
import {
  useActiveAccount,      // Get connected account
  useUserProfiles,       // Get email/phone profiles
  useSocialAccounts,     // Get social profiles
  useAccountBalance,     // Get LSK balance
  useTokenBalances,      // Get ERC-20 balances
  useActivities,         // Get transaction history
  useLogout,             // Disconnect wallet
} from 'panna-sdk';
```

### 3. Example Usage

**Get Active Account:**
```tsx
'use client';

import { useActiveAccount } from 'panna-sdk';

export function MyComponent() {
  const activeAccount = useActiveAccount();

  if (!activeAccount) {
    return <div>Please connect your wallet</div>;
  }

  return <div>Connected: {activeAccount.address}</div>;
}
```

**Get Account Balance:**
```tsx
'use client';

import { useActiveAccount, useAccountBalance, usePanna, getEnvironmentChain } from 'panna-sdk';

export function Balance() {
  const activeAccount = useActiveAccount();
  const { client, chainId } = usePanna();

  const { data: balance, isLoading } = useAccountBalance({
    address: activeAccount?.address || '',
    client: client!,
    chain: getEnvironmentChain(chainId)
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {balance?.displayValue} {balance?.symbol}
    </div>
  );
}
```

**Logout:**
```tsx
'use client';

import { useLogout, useConnectedAccounts } from 'panna-sdk';

export function LogoutButton() {
  const { disconnect } = useLogout();
  const connectedAccounts = useConnectedAccounts();
  const activeAccount = connectedAccounts?.[0];

  const handleLogout = () => {
    if (activeAccount) {
      disconnect(activeAccount);
    }
  };

  return <button onClick={handleLogout}>Logout</button>;
}
```

## 🚀 Getting Started

### 1. Install Dependencies

Already installed! The project has:
- ✅ `panna-sdk@0.1.0`
- ✅ All peer dependencies

### 2. Start Development Server

```bash
yarn dev
```

### 3. Test Authentication

1. Open http://localhost:3000
2. Click the "Connect" button in the header
3. Choose authentication method:
   - **Email**: Enter email → Receive OTP → Enter code
   - **Phone**: Enter number → Receive SMS → Enter code
   - **Google**: One-click OAuth login

### 4. Get Test Tokens

Once connected, get test LSK tokens:
1. Copy your wallet address
2. Visit: https://sepolia-faucet.lisk.com
3. Paste address and request tokens

## 📚 API Reference

### PannaProvider Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `clientId` | `string` | Yes | Thirdweb client ID |
| `partnerId` | `string` | Yes | Lisk partner ID |
| `chainId` | `string` | No | Chain ID (default: 1135) |

### Available Hooks

| Hook | Purpose |
|------|---------|
| `useActiveAccount()` | Get currently connected account |
| `useConnectedAccounts()` | Get all connected accounts |
| `usePanna()` | Access client and chain config |
| `useUserProfiles()` | Get email/phone profiles |
| `useSocialAccounts()` | Get social profiles (Farcaster, Lens, ENS) |
| `useAccountBalance()` | Get native token balance |
| `useTokenBalances()` | Get all ERC-20 token balances |
| `useTotalFiatBalance()` | Get total portfolio value in USD |
| `useActivities()` | Get transaction history |
| `useCollectibles()` | Get NFTs owned by address |
| `useBuyWithFiatQuotes()` | Get fiat onramp quotes |
| `useLogout()` | Disconnect wallet |

## 🔒 Security

- ✅ Client ID is public (safe for frontend)
- ✅ Partner ID is public (safe for frontend)
- ✅ Private keys managed by Panna SDK
- ✅ No secrets in client-side code

## 🌐 Network Configuration

### Lisk Sepolia (Testnet - Current)
- **Chain ID**: 4202
- **Faucet**: https://sepolia-faucet.lisk.com
- **Explorer**: https://sepolia-blockscout.lisk.com

### Lisk Mainnet (Production)
- **Chain ID**: 1135
- **Explorer**: https://blockscout.lisk.com

To switch to mainnet, update `.env.local`:
```bash
NEXT_PUBLIC_CHAIN_ID=1135
```

## 🎨 Styling

Panna SDK styles are automatically imported in `globals.css`:

```css
@import "panna-sdk/styles.css";
```

The ConnectButton automatically adapts to your app's theme (light/dark mode).

## 🐛 Troubleshooting

### Issue: "ConnectButton not appearing"

**Solution**: Make sure `panna-sdk/styles.css` is imported in `globals.css`.

### Issue: "Hook called outside Provider"

**Solution**: Ensure all components using Panna hooks are wrapped in `<Providers>`.

### Issue: OAuth popup blocked

**Solution**: Already fixed! The `next.config.mjs` has CORS headers configured:
```javascript
headers: [
  {
    key: 'Cross-Origin-Opener-Policy',
    value: 'same-origin-allow-popups',
  },
]
```

### Issue: Balance shows 0

**Solution**: Get test tokens from the faucet: https://sepolia-faucet.lisk.com

## 📖 Resources

- **Panna SDK Docs**: See `PANNA_COMPLETE_GUIDE.md` (the doc you provided)
- **Lisk Docs**: https://lisk.com/documentation
- **Thirdweb Portal**: https://portal.thirdweb.com
- **Support**: support@lisk.com

## ✨ Next Steps

Now that authentication is working, you can:

1. **Add Profile Page**: Show user info, balances, transaction history
2. **Implement Transactions**: Let users plant seeds, water plants (blockchain transactions)
3. **Add NFT Support**: Turn plants into NFTs
4. **Enable Gasless Transactions**: Sponsor gas fees for users
5. **Add Fiat Onramp**: Let users buy LSK with credit cards

Example profile page coming soon!

---

**Last Updated**: 2025-10-21
**Panna SDK Version**: 0.1.0
**Status**: ✅ Working
