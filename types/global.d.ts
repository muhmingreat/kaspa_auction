interface Window {
    kasware?: {
        getBalance: () => Promise<{ total: number }>;
        getAccounts: () => Promise<string[]>;
        requestAccounts: () => Promise<string[]>;
        on: (event: string, callback: (...args: any[]) => void) => void;
    }
}
