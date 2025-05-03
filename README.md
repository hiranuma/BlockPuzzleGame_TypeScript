# Block Puzzle Game

A simple block puzzle game implemented in TypeScript and HTML5 Canvas.

![game_area](https://github.com/user-attachments/assets/0ccdfdcb-9ff7-4cd7-a977-2ccbf1a9e267)

![block](https://github.com/user-attachments/assets/ad455000-8134-4c7e-80e9-74d86c426559)


## Features

- Classic block puzzle gameplay
- Keyboard controls for moving, rotating, and dropping pieces
- Score tracking
- Preview of the next piece

## Controls

- **Arrow Left (`←`)**: Move the current piece left
- **Arrow Right (`→`)**: Move the current piece right
- **Arrow Up (`↑`)**: Rotate the current piece
- **Arrow Down (`↓`)**: Perform a hard drop (instantly drop the piece to the bottom)

## How to Run

### Prerequisites

- [Node.js](https://nodejs.org/) (version 16 or later)
- [npm](https://www.npmjs.com/) (comes with Node.js)

### Steps

1. Clone the repository or download the source code.

   ```bash
   git clone <repository-url>
   cd block-puzzle-game
   ```

2. Install dependencies.

   ```bash
   npm install
   ```

3. Start the development server.

   ```bash
   npm run dev
   ```

4. Open your browser and navigate to the URL provided by the development server (usually `http://localhost:5173`).

### Build for Production

To build the project for production, run:

```bash
npm run build
```

The output files will be located in the `dist` directory.

### Preview the Production Build

To preview the production build locally, run:

```bash
npm run preview
```

## Project Structure

- `index.html`: The main HTML file for the game.
- `src/main.ts`: The main TypeScript file containing the game logic.
- `src/style.css`: The CSS file for styling the game.
- `tsconfig.json`: TypeScript configuration file.
- `.gitignore`: Git ignore file.

## License

This project is for educational purposes and does not include a license. Feel free to modify and use it as you like.
