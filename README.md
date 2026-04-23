# 🌟 RuneDex
[Link](https://runedex-nu.vercel.app/fr)
> A comprehensive encyclopedia of Runeterra's lore, champions, and universe

[![License](https://img.shields.io/badge/License-All%20Rights%20Reserved-red.svg)](./LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16.0.7-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)

## 🚧 Status

**Currently in active development** - New features and improvements are being added regularly.

## 📖 About

RuneDex is an interactive web application dedicated to exploring the rich lore of Runeterra (League of Legends universe). It provides a comprehensive database of champions, artifacts, world runes, and lore characters with an intuitive and modern interface.

### ✨ Key Features

- 🎮 **Champion Encyclopedia**: Detailed information on all League of Legends champions
  - Complete lore and backstories
  - Abilities and spells with visual displays
  - Skin collections with interactive carousel
  - Character relationships and connections
  
- 🗺️ **Interactive Map**: Explore the regions of Runeterra (Work in Progress)
  
- 🎯 **Quiz Games**: Test your knowledge with multiple quiz modes
  - Classic Quiz: Guess champions from their attributes
  - Skin Quiz: Identify champions and skins from modified images
  - Ability Quiz: Recognize champions by their spell icons
  
- 🔮 **Artifacts & Runes**: Browse legendary artifacts and world runes
  
- 🌍 **Multilingual**: Full support for French and English
  
- 🔍 **Advanced Filtering**: Filter champions by region, species, gender, role, and resource type

## 🛠️ Technologies

### Frontend
- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS 4** - Modern utility-first styling
- **Framer Motion** - Smooth animations and transitions
- **next-intl** - Internationalization (i18n)

### Data Architecture
- **JSON Files** - Static data organized in `src/data/` for easy community contributions
  - `champions/` - One JSON file per champion
  - `lore-characters/` - One JSON file per lore character
  - `artifacts/` - One JSON file per legendary artifact
  - `runes/` - One JSON file per world rune
- **Relation Files** - Links between entities
  - `relations.json` - Character relationships
  - `artifact-owners.json` - Artifact ownership data
  - `rune-owners.json` - Rune ownership data
- **Next.js Cache** - Optimized caching strategy for performance
- **Git-based** - All data is version-controlled and open for contributions

### Tools & Libraries
- **Lucide React** - Icon library
- **Axios** - HTTP client
- **ESLint** - Code linting
- **Vercel Speed Insights** - Performance monitoring

## 🚀 Getting Started

### Prerequisites

- Node.js 20.x or higher
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/TristanDu76/RuneDex.git
cd runedex
```

2. Install dependencies
```bash
npm install
```

3. Run the development server
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📁 Project Structure

```
runedex/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   └── [locale]/           # Internationalized routes
│   ├── components/             # React components
│   │   ├── champions/          # Champion-related components
│   │   ├── quiz/               # Quiz game components
│   │   ├── map/                # Interactive map components
│   │   ├── layout/             # Layout components (Navbar, etc.)
│   │   └── ui/                 # Reusable UI components
│   ├── data/                   # Project JSON data
│   │   ├── champions/          # One JSON file per champion
│   │   ├── lore-characters/    # One JSON file per lore character
│   │   ├── artifacts/          # One JSON file per artifact
│   │   ├── runes/              # One JSON file per rune
│   │   ├── relations.json      # Character relationships
│   │   ├── artifact-owners.json # Artifact ownership data
│   │   └── rune-owners.json    # Rune ownership data
│   ├── lib/                    # Utility functions and data fetching
│   │   ├── data.ts             # Data loading functions
│   │   └── cache.ts            # Caching utilities
│   ├── i18n/                   # Internationalization config
│   ├── types/                  # TypeScript type definitions
│   └── utils/                  # Helper functions
├── public/                     # Static assets
│   ├── images/                 # Project images
│   └── ...
└── ...config files
```

## 🎨 Features in Detail

### Champion Pages
Each champion page includes:
- High-quality splash art and skin carousel
- Complete lore and backstory
- Passive ability and spell list with icons
- Related characters and relationships
- Associated artifacts and runes
- Region, species, and gameplay information

### Quiz System
- **Progressive Hints**: Unlock hints as you make attempts
- **Multiple Difficulty Modes**: Blur, grayscale, zoom, and rotation
- **Score Tracking**: Keep track of your performance
- **Streak System**: Build up consecutive correct answers

### Data Management
- **Cached Queries**: Optimized data fetching with Next.js cache
- **Localized Content**: All content available in French and English
- **Type-Safe**: Full TypeScript coverage for data models

## 🌐 Deployment

The application is designed to be deployed on Vercel:

```bash
npm run build
```

## 🤝 Contributing

Contributions are welcome! This project uses a JSON-based data architecture, making it easy for anyone to contribute.

### How to Contribute Data

All game data is stored in `src/data/` as JSON files:

#### Data Structure
- `champions/` - One JSON file per champion (e.g., `Ahri.json`, `Yasuo.json`)
- `lore-characters/` - One JSON file per lore character
- `artifacts/` - One JSON file per legendary artifact
- `runes/` - One JSON file per world rune
- `relations.json` - Relationships between all characters
- `artifact-owners.json` - Artifact ownership data
- `rune-owners.json` - Rune ownership data

#### Name-based Identifiers
Entity `id`s are generated from their names (without accents or special characters):
- Example: "Ahri" → `id: "ahri"`
- Example: "Rek'Sai" → `id: "reksai"`
- The filename matches the entity's `id`

### Contribution Process

1. **Fork the repository**
2. **Create a new branch** (`git checkout -b fix/typo-in-yasuo-lore`)
3. **Edit the JSON files** with your corrections/additions
4. **Test locally** (`npm run dev`)
5. **Commit your changes** (`git commit -m 'Fix: Corrected Yasuo lore typo'`)
6. **Push to your fork** (`git push origin fix/typo-in-yasuo-lore`)
7. **Open a Pull Request**

### What to Contribute

- ✅ Lore corrections and updates
- ✅ Missing character relationships
- ✅ New champions (when Riot releases them)
- ✅ Translation improvements (French/English)
- ✅ Missing artifacts or runes
- ✅ Bug fixes
- ✅ Feature suggestions (via Issues)

### Data Format Example

```json
{
  "id": "champion-id",
  "name": "Champion Name",
  "title": "The Title",
  "title_en": "The Title",
  "lore": "French lore text...",
  "lore_en": "English lore text...",
  ...
}
```

All contributions will be reviewed before merging. Thank you for helping improve RuneDex! 🙏

## 📜 License

**All Rights Reserved** - This project is made publicly available for portfolio and educational purposes only. See [LICENSE](./LICENSE) for details.

## 👨‍💻 Author

**TristanDu76**

- GitHub: [@TristanDu76](https://github.com/TristanDu76)

## 💬 Community

Join the RuneDex Discord community to discuss the project, suggest features, and stay updated:

[![Discord](https://img.shields.io/badge/Discord-Join%20Server-5865F2?style=for-the-badge&logo=discord&logoColor=white)](https://discord.gg/R2VX8KnFwP)

## 🙏 Acknowledgments

- League of Legends and Runeterra lore by Riot Games
- Community Data Dragon for champion assets
- All contributors who have helped improve this project

---

⭐ If you find this project interesting, feel free to star it on GitHub!
