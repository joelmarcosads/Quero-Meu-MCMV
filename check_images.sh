#!/bin/bash

# Get all images referenced in src
grep -rE -o "'/[^']+\.webp'" src/ | awk -F"'" '{print $2}' | sort | uniq > expected.txt
grep -rE -o '"/[^"]+\.webp"' src/ | awk -F'"' '{print $2}' | sort | uniq >> expected.txt
grep -rE -o "https://queromeumcmv.com.br/[^\"]+\.webp" src/ | awk -F"/" '{print "/"$4}' | sort | uniq >> expected.txt

# Strip trailing characters, sort and uniq
cat expected.txt | sort | uniq > expected_clean.txt

echo "Missing images in public/:"
while read p; do
  file="public${p}"
  if [ ! -f "$file" ]; then
    echo "$file"
  fi
done < expected_clean.txt
