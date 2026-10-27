# Sunchem — static HTML site

Static HTML/CSS/JS version of the Base44 app (same layout, colors, Inter font, icons and animations).
No build step or server needed: open `index.html` in a browser, or upload the three files to any static host.

- `index.html` — page markup
- `styles.css` — compiled Tailwind CSS (same config/theme as the Base44 export)
- `script.js` — nav, scroll reveal, hero parallax, product tabs, contact form

## Contact form
Submissions go to the same Base44 `Enquiry` entity as the original app (app id in `script.js`),
so they still appear in your Base44 dashboard. If the request fails, the visitor's email app opens
with the enquiry pre-filled for `sales@sunchem.co.in`.

## Images
The hero image and logos load from Base44's media CDN, exactly like the original. To make the site
independent of Base44, run `bash download-assets.sh` once (needs internet); it saves them to `assets/`
and updates `index.html`.
# sunchem
