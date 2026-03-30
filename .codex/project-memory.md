# Project Memory

## Project
- name: Portfolio Web
- root: `D:\Web Portfolio\portfolio`

## Current Status
- Home page sudah dirombak ke arah hybrid `zickrian.dev` + `tajmirul.site`.
- Hero memakai video pesawat fullscreen dengan scroll stack yang menutup hero setelah scroll.
- `Selected Projects` dan `Latest Writing` sudah memakai layout curated list dengan preview aktif, hover state, dan treatment row yang lebih ringan.
- Section GitHub proof sudah live dari GitHub API + contribution heatmap, dengan revalidate `10m`.
- `Core Stack` sekarang berupa globe/orb interaktif yang bisa di-drag dan di-click, dengan detail skill aktif dipindah ke panel bawah.
- Branch `main` sudah dipush ke `origin/main` sampai commit `d8da58e`.

## Key Context
- User suka visual yang editorial, clean, dan premium; tidak suka UI yang terlalu penuh atau card-heavy.
- Referensi utama:
- `https://www.zickrian.dev/` untuk mood hero, sticky scroll flow, dan GitHub proof inspiration.
- `https://www.tajmirul.site/` untuk `Selected Projects` dan `Latest Writing`.
- `https://www.pszostak.pl/` untuk inspirasi `Core Stack / My Skills`.
- Video hero yang dipakai adalah tema jendela pesawat, bukan visual AI literal seperti robot/futuristic city.
- User lebih suka AI terasa dari narrative, systems feel, dan interface polish, bukan sci-fi klise.

## Recent Work
- 2026-03-29 sampai 2026-03-30: redesign besar home page.
- Hero disederhanakan, role typing dikembalikan, `Current vector` dihapus.
- Scroll reveal on enter/leave viewport dipasang di section-section home.
- `Selected Projects` dan `Latest Writing` dibuat lebih compact, bottom-border only, dan default button chrome dihapus.
- GitHub proof section ditambahkan, month labels ditambahkan, stat cards di-animate count-up, heatmap low-activity visibility diperjelas.
- Cache GitHub section diturunkan dari `1h` menjadi `10m`.
- `Core Stack` static tokens diganti jadi globe interaktif; globe kemudian direvisi agar lebih netral dan detail panel tidak menutupi orb.

## Files Changed
- Major home layout:
- `D:\Web Portfolio\portfolio\src\app\page.tsx`
- `D:\Web Portfolio\portfolio\src\app\page.module.css`
- Hero:
- `D:\Web Portfolio\portfolio\src\components\sections\Hero.tsx`
- `D:\Web Portfolio\portfolio\src\components\sections\Hero.module.css`
- About:
- `D:\Web Portfolio\portfolio\src\components\sections\AboutTeaser.tsx`
- `D:\Web Portfolio\portfolio\src\components\sections\AboutTeaser.module.css`
- `D:\Web Portfolio\portfolio\src\components\ui\TextScramble.tsx`
- `D:\Web Portfolio\portfolio\src\components\ui\TypeWriter.tsx`
- `D:\Web Portfolio\portfolio\src\components\ui\FadeIn.tsx`
- Projects / writing:
- `D:\Web Portfolio\portfolio\src\components\sections\Projects.tsx`
- `D:\Web Portfolio\portfolio\src\components\sections\Projects.module.css`
- `D:\Web Portfolio\portfolio\src\components\sections\Blog.tsx`
- `D:\Web Portfolio\portfolio\src\components\sections\Blog.module.css`
- GitHub proof:
- `D:\Web Portfolio\portfolio\src\components\sections\GitHubProof.tsx`
- `D:\Web Portfolio\portfolio\src\components\sections\GitHubProof.module.css`
- `D:\Web Portfolio\portfolio\src\lib\github.ts`
- `D:\Web Portfolio\portfolio\src\components\ui\AnimatedNumber.tsx`
- Core Stack:
- `D:\Web Portfolio\portfolio\src\components\sections\Skills.tsx`
- `D:\Web Portfolio\portfolio\src\components\sections\Skills.module.css`
- Styling / theme:
- `D:\Web Portfolio\portfolio\src/styles/globals.css`
- Asset:
- `D:\Web Portfolio\portfolio\public/videos/airplane-window.mp4`

## Decisions
- Keep airplane-window hero; do not switch to literal AI/sci-fi background.
- Use `zickrian.dev` for overall flow and atmosphere, but `tajmirul.site` for project/writing presentation.
- GitHub proof is allowed to use public API plus third-party contribution endpoint; cache kept at `10m` to reduce lag without becoming aggressive.
- `Core Stack` should feel interactive and premium, but avoid heavy 3D engine dependence for now.
- Detail explanation for active stack item should stay outside the center of the globe to keep the orb readable.
- Playwright inspection artifacts are local only and intentionally not committed.

## Verification
- `npm.cmd run build` succeeded multiple times after the major redesign passes.
- Latest confirmed successful build was after the final `Core Stack` neutral-color + detail-card revision on `2026-03-30`.
- `main` pushed successfully to GitHub with commit `d8da58e` `Polish interactive core stack globe`.

## Open Questions
- `Core Stack` globe is much better than the first version, but may still benefit from additional polish on node spacing, radius, or shading if the user wants another pass.
- Playwright artifacts remain untracked locally in `.playwright-cli/`.

## Next Steps
- If continuing later, first inspect the live look of `Skills` and confirm whether the globe still needs another polish pass.
- Possible next polish targets:
- tighter orb/node composition
- further typography/layout refinement on remaining sections
- cleanup of `.playwright-cli/` if the user wants a clean working tree
