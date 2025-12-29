# WhatsApp UserBot

![CI Status](https://github.com/yourusername/whatsapp-userbot/actions/workflows/ci.yml/badge.svg)
![License](https://img.shields.io/npm/l/whatsapp-userbot)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)

A modular, production-ready WhatsApp UserBot built with **TypeScript** and **Baileys**. designed for simplicity, extensibility, and performance.

## 🚀 Features

- **Modular Architecture**: Commands are dynamically loaded from `src/commands`.
- **User Bot Mode**: Securely runs on your own WhatsApp account.
- **Media Tools**: Create stickers from images and videos.
- **System Stats**: Check uptime, RAM, and platform info.
- **Group Management**: Admin tools included.
- **Docker Ready**: One-command deployment.

## 🛠 Prerequisites

- [Node.js v18+](https://nodejs.org/)
- [FFmpeg](https://ffmpeg.org/) (Required for sticker commands)
- WhatsApp Account (Mobile App)

## ⚡️ Quick Start

### Option 1: Automated Setup (Recommended)

Run the interactive setup script:

```bash
chmod +x scripts/setup.sh
./scripts/setup.sh
```

This script will check prerequisites, set up your configuration, install dependencies, and build the project.

### Option 2: Manual Installation

1.  **Clone & Install:**
    ```bash
    git clone https://github.com/yourusername/whatsapp-userbot.git
    cd whatsapp-userbot
    npm install
    ```

2.  **Configure:**
    Copy `.env.example` to `.env` and edit it:
    ```bash
    cp .env.example .env
    nano .env
    ```

3.  **Build & Run:**
    ```bash
    npm run build
    npm start
    ```

### Option 3: Docker

```bash
docker-compose up -d
```

## 📝 Configuration

The bot is configured via the `.env` file:

| Variable | Description | Default |
| :--- | :--- | :--- |
| `PREFIX` | Command prefix (e.g., `.`, `!`, `/`) | `.` |
| `LOG_LEVEL` | Logging verbosity | `info` |

## 🤝 Contributing

We welcome contributions! Please see [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md) for a guide on adding new commands.

1.  Fork the repo.
2.  Create your feature branch (`git checkout -b feature/amazing-feature`).
3.  Commit your changes (`git commit -m 'Add amazing feature'`).
4.  Push to the branch (`git push origin feature/amazing-feature`).
5.  Open a Pull Request.

## 📄 License

This project is licensed under the ISC License.
