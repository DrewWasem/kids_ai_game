# /pre-demo — Pre-Demo Checklist

Run this 30 minutes before any demo or presentation.

## Automated Checks

1. **Build passes** — Run `npm run build` and verify no errors.

2. **Cache exists** — Check that `src/data/demo-cache.json` exists and contains responses for:
   - Monster Birthday Party: at least 8 cached inputs
   - Robot Pizza Delivery (if applicable): at least 5 cached inputs

3. **Fallback responses exist** — Verify fallback scripts are defined for every task.

4. **Environment** — Verify `.env` has `VITE_ANTHROPIC_API_KEY` set (don't print the value).

5. **Deployment** — If a Vercel URL is configured, check that it's accessible.

## Manual Checklist (remind Drew)

Print this checklist for Drew to run through manually:

```
[ ] Open Chrome (NOT Firefox/Safari/Edge for voice)
[ ] Navigate to deployed URL (or localhost:5173)
[ ] App loads — game scene + input box visible
[ ] Test cached input: "throw a giant cake with balloons" → instant animation
[ ] Test partial input: "have a party" → feedback panel appears
[ ] Confetti fires on full success
[ ] No console errors (open DevTools briefly to check)
[ ] Close all other tabs and apps
[ ] Disable notifications / do-not-disturb ON
[ ] Maximize browser window
[ ] Backup demo video loaded in separate tab
[ ] Laptop charged to 100%
[ ] Take 3 deep breaths
```

## If Something Fails

- **Build fails**: Fix the error. Do not demo a broken build.
- **Cache is empty**: Run `/build-cache` immediately.
- **API key missing**: Copy from `.env.example`, fill in value.
- **Vercel down**: Use `npm run dev` on localhost as backup.
- **Everything is broken**: Play the backup demo video.
