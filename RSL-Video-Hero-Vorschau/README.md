# Rhein-Sieg Lasertechnik – Video-Hero-Vorschau

Dies ist **eine separate Kopie** des bereits gestalteten Onepagers, basierend auf den verfügbaren Originaldateien im übergebenen Design-Kit. Die bereits veröffentlichte Website wird nicht verändert.

## Starten
- `index.html` im Browser öffnen (einige Browser verlangen für Videowiedergabe einen lokalen Webserver).
- Zuverlässig testen: Im Ordner `python3 -m http.server 8000` starten und `http://localhost:8000/` öffnen.
- Für Vercel: neues Projekt / neues GitHub-Repository, Framework Preset **Other**, Root `./`, **kein Build Command**, Output `./` (Root als statische Website). Keine Umgebungsvariablen.

## Die zwei Videos
- Standard: `/?video=graffiti` – Graffiti-Entfernung (`media/graffiti.mp4`).
- Alternative: `/?video=industrie` – Maschinen-/Rost-Reinigung (`media/industrie.mp4`).
- Zusätzlich gibt es unten rechts einen Testumschalter.

Die beiden Videodateien wurden aus den hochgeladenen HEVC-Dateien in browserfreundliche H.264-MP4s **ohne Audio** umgewandelt. Die ursprünglichen KI-Videos wurden ansonsten nicht inhaltlich verändert. Ein Standbild pro Video wird als Poster verwendet. Bei `prefers-reduced-motion` wird das Video angehalten.

## Wichtig
- KI-generierte Anwendungsszenen; nicht als echte dokumentierte Kundenaufträge ausgeben.
- Bilder, Texte, Vergleichsregler und Design stammen aus dem bereitgestellten alten Website-Kit; vor dem finalen Launch aktuelle Unternehmensdaten, Logos, Impressum, Datenschutz und Kontaktformulare prüfen.
- Kontaktformular ist im Quellmaterial nur eine Vorschau; keine echte Datenübertragung.
- Die Domains/Projekte `rhein-sieg-lasertechnik.vercel.app` und bereits vorhandene Projekte nicht überschreiben. Separate GitHub- und Vercel-Projekte nutzen.
- Für eine dauerhafte Verwaltung per GitHub neues Repo (z. B. `RSL-Video-Hero-Vorschau`) anlegen, Dateien aus diesem Verzeichnis in den Repo-Root hochladen, anschließend im Vercel-Dashboard ein **neues** Projekt mit dem Repo verbinden.
