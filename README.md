# WhatsApp UserBot

A modular, production-ready WhatsApp UserBot built with TypeScript and [Baileys](https://github.com/WhiskeySockets/Baileys).

## Features

- **Modular Architecture**: Easy to add new commands in the `src/commands` directory.
- **User Bot Mode**: Runs on your own WhatsApp account.
- **Media Handling**: Includes sticker creation (requires FFmpeg).
- **Group Management**: Basic admin commands like `promote`.
- **Developer Friendly**: Written in TypeScript with ESLint, Prettier, and Jest tests.
- **Docker Ready**: Includes Dockerfile and Compose setup.

## Prerequisites

- Node.js v18+
- [FFmpeg](https://ffmpeg.org/) (Required for sticker commands)
- A WhatsApp account on your phone

## Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/whatsapp-userbot.git
    cd whatsapp-userbot
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Setup Configuration:**
    Create a `.env` file in the root directory:
    ```env
    PREFIX=.
    # OWNER_NUMBER=1234567890 (Optional)
    LOG_LEVEL=info
    ```

4.  **Build the project:**
    ```bash
    npm run build
    ```

5.  **Start the bot:**
    ```bash
    npm start
    ```
    Scan the QR code that appears in your terminal using WhatsApp on your phone (Linked Devices).

## Development

### Adding a New Command

Create a new file in `src/commands/<category>/<commandName>.ts`:

```typescript
import { Command } from '../../types';

const myCommand: Command = {
    name: 'mycommand',
    description: 'Description of my command',
    category: 'general',
    usage: 'mycommand <args>',
    execute: async (sock, msg, args) => {
        const remoteJid = msg.key.remoteJid;
        if (remoteJid) {
            await sock.sendMessage(remoteJid, { text: 'Hello World!' });
        }
    }
};

export default myCommand;
```

### Running Tests

```bash
npm test
```

### Linting

```bash
npm run lint
```

## Deployment

### Docker

1.  **Build the image:**
    ```bash
    docker build -t whatsapp-userbot .
    ```

2.  **Run the container:**
    ```bash
    docker run -d --name my-userbot -v ./auth_info_baileys:/usr/src/app/auth_info_baileys whatsapp-userbot
    ```

### Docker Compose

```bash
docker-compose up -d
```

## Troubleshooting

-   **Stickers not working?** Ensure FFmpeg is installed and accessible in your system PATH.
-   **Connection Failed?** Delete `auth_info_baileys` folder and restart to re-scan QR.

## License

ISC
