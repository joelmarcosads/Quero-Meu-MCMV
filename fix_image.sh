#!/bin/bash
for file in src/pages/*.tsx; do
  if [ "$file" != "src/pages/Home.tsx" ] && [ "$file" != "src/pages/PrivacyPolicy.tsx" ] && [ "$file" != "src/pages/TermsOfUse.tsx" ]; then
    sed -i 's/className="w-full h-full object-cover"/className="w-full h-auto aspect-video object-cover"/g' "$file"
    # But wait, we want the Hero image to remain h-full.
    # The hero image is preceded by <div className="absolute inset-0 z-0">.
    sed -i '/<div className="absolute inset-0 z-0">/{n;n;n;s/className="w-full h-auto aspect-video object-cover"/className="w-full h-full object-cover"/}' "$file"
  fi
done
