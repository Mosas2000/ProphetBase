# Contributing to ProphetBase

We welcome contributions! Please follow these guidelines to ensure a smooth workflow.

## Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/prophetbase.git
   cd prophetbase
   ```

2. **Install Dependencies**
   ```bash
   npm install      # Root
   cd frontend && npm install
   ```

3. **Environment Variables**
   Copy `.env.example` to `.env` in `frontend/` and `hardhat/` directories.
   Required: `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID`, `PRIVATE_KEY` (for deploy).

4. **Run Local Dev**
   ```bash
   # Terminal 1: Frontend
   cd frontend
   npm run dev
   ```

## Code Standards

### Styling
- **Tailwind CSS**: Use utility classes. Avoid custom CSS unless necessary in `globals.css`.
- **Theme**: Stick to the "Base Blue" variables (`bg-blue-600`, etc.).
- **Dark Mode**: Always verify components in dark mode (`dark:` classes).

### Components
- Use **Functional Components** with TypeScript interfaces.
- Place reusable components in `frontend/components/`.
- Use `lucide-react` or `heroicons` for icons.

### Testing
- Run component tests: `npm run test`
- Run E2E tests: `npx playwright test`

## Pull Requests

1. Create a new branch: `feature/my-feature` or `fix/issue-id`.
2. Commit changes with clear messages.
3. Ensure all tests pass.
4. Open a PR describing changes and attaching screenshots for UI work.

## License
MIT License. See `LICENSE` for details.
