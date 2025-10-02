# React Native Wallet Integration Demo

A minimal React Native app that demonstrates integration with external wallets and reads balances from Ink Testnet.

## 🎯 Goal

Build a minimal React Native app that demonstrates the ability to integrate with external wallets and read balances from Ink Testnet.

## 📋 Requirements

### 1. Wallet Connection

- Integrate wallet connection to a user's mobile wallet (ex. Metamask)
- User should be able to connect and disconnect their wallet

### 2. Chain Integration

- The app must connect to Ink Testnet

### 3. App Layout (3 tabs)

#### Account Tab

- When connected, display the connected wallet's address
- Show ETH balance
- Show ERC-20 token balance for the address: `0x5F65358d61A9a281ea3BB930d05889ACa21E3f4f`
- When disconnected, should show some CTA that switches to the settings tab

#### Settings Tab

- Show Connect button when disconnected
- Show Disconnect button when connected

#### Chat Tab

- Uses websocket to connect to `wss://echo.websocket.org`
- Has a text input to send messages
- Has a running list of sent and received messages

_Specific UI choices are left up to your discretion_

## 📦 Deliverables

- A working React Native app
- Code uploaded to a public GitHub repository
- A README.md that explains:
  - Setup instructions
  - How to run the app (iOS/Android)

## 🔗 Optional Resources

- **Ink Faucet**: https://inkonchain.com/faucet (for test ETH)
- **Wagmi** (React hooks for Ethereum): https://wagmi.sh
- Our testnet USDC contract `0x5F65358d61A9a281ea3BB930d05889ACa21E3f4f` has an available Mint function
