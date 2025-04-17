# ZeroDev Kernel 3.1 to 3.2 Migration & Intent Client Example

This repository demonstrates how to migrate from ZeroDev Kernel 3.1 to 3.2 and create an intent client using the ZeroDev SDK. It provides a practical example of using the new intent system for account abstraction.

## Features

- Migration guide from Kernel 3.1 to 3.2 and create intentClient

## Prerequisites

- Node.js 18+ or Bun
- A ZeroDev project ID
- Basic understanding of account abstraction and intents

## Getting Started

1. Clone the repository:
```bash
cd intent-dynamic-example
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
bun install
```

3. Create a `.env.local` file based on `.env.example` and add your ZeroDev project ID:
```
NEXT_PUBLIC_ZERODEV_PROJECT_ID=your_project_id
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
bun dev
```

5. Open [http://localhost:3000](http://localhost:3000) to see the example application.
