#!/usr/bin/env bash
# Optional: saves the images locally so the site no longer depends on Base44's CDN.
# Run once from this folder (needs internet): bash download-assets.sh
set -e
B=https://media.base44.com/images/public/6a1a85931c288fc1c4041338
mkdir -p assets
curl -fsSL "$B/121e1016b_generated_image.png" -o assets/hero.png
curl -fsSL "$B/54fae1fee_ChatGPT_Image_30__2026__12_47_18_pm.png" -o assets/logo-nav.png
curl -fsSL "$B/f1372accd_ChatGPTImage30202612_47_18pm.png" -o assets/logo-footer.png
curl -fsSL "$B/2037520a8_logo.png/v1/fit/w_180,h_180/2037520a8_logo.png" -o assets/favicon.png
sed -i.bak \
  -e "s#$B/121e1016b_generated_image.png#assets/hero.png#g" \
  -e "s#$B/54fae1fee_ChatGPT_Image_30__2026__12_47_18_pm.png#assets/logo-nav.png#g" \
  -e "s#$B/f1372accd_ChatGPTImage30202612_47_18pm.png#assets/logo-footer.png#g" \
  -e "s#$B/2037520a8_logo.png/v1/fit/w_180,h_180/2037520a8_logo.png#assets/favicon.png#g" index.html
rm -f index.html.bak
echo "Done. Images saved in ./assets and index.html updated."
