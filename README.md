# Princess's Comfort Corner 💗

A cute, responsive, client-side period-care surprise built with React + Vite. No backend or API keys are needed.

## Run locally

1. Install Node.js (LTS) from https://nodejs.org/
2. Extract this project and open a terminal in its folder.
3. Run:

   ```bash
   npm install
   npm run dev
   ```

4. Open the local URL printed by Vite (usually http://localhost:5173).

## Build for production

```bash
npm run build
npm run preview
```

The production website is generated in `dist/`.

## Deploy to Netlify (recommended: GitHub)

1. Create a GitHub repository and upload/push all files in this folder.
2. Sign in at https://app.netlify.com/ and choose **Add new site → Import an existing project**.
3. Connect GitHub and select this repository.
4. Netlify should detect the included `netlify.toml`. Confirm:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Click **Deploy**. Netlify will provide a public URL you can send to Princess.

### Deploy without GitHub

1. Run `npm install` and `npm run build` on your computer.
2. Open https://app.netlify.com/drop
3. Drag the generated `dist` folder into the page.

## Personalize

Open `src/App.jsx` and edit:
- `Princess` in the greeting if you want another nickname.
- `Your favourite person` in the footer signature.
- The message arrays and coupon labels to make them more personal.

## Privacy note

Mood selections and redeemed coupons are stored only in that browser's localStorage. Nothing is sent to a server. If she opens the link on another device/browser, those local selections will not sync.
