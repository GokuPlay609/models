# Adding Commands

The bot is designed to be easily extensible. All commands live in `src/commands`.

## Structure

Each command module must default export an object implementing the `Command` interface:

```typescript
interface Command {
    name: string;        // The trigger command (e.g., 'ping')
    aliases?: string[];  // Alternative triggers (e.g., ['p', 'pong'])
    description?: string;// Shown in help menu
    category?: string;   // Grouping in help menu
    usage?: string;      // Usage example
    execute: (sock: WASocket, msg: WAMessage, args: string[]) => Promise<void>;
}
```

## Best Practices

1.  **Check `remoteJid`**: Always ensure `msg.key.remoteJid` exists before sending.
2.  **Error Handling**: Use `try-catch` blocks. The handler catches errors, but custom handling allows better user feedback.
3.  **Utils**: Use helpers from `@/utils/messageUtils` for extracting text or downloading media.
