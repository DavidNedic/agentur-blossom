# Schreibtisch-Verfeinerung

## Änderungen
- Einen klaren WhatsApp-Termin-Tab ergänzen und alle Termin-Buttons auf denselben WhatsApp-Link vereinheitlichen.
- Sheets über URL-Hashes öffnen, Browser-Zurück korrekt schließen und direkte Hash-Aufrufe unterstützen, inklusive `#adriaticum` für das interne Adriaticum-Sheet.
- Dialoge vollständig sperren: Hintergrund und Tabs werden inaktiv, Fokusführung und individuelle Überschriften-Zuordnung werden korrekt gesetzt.
- Die genannten Kontrastwerte, Mindestschriftgrößen, Touch-Hinweise und mobilen Abstände exakt anpassen.
- Mobile Ladezeit senken: versteckte 3D-Modelle nicht laden, Three.js und Modelle nach dem Intro im Leerlauf nachladen, Render-Loops bei verborgenem Tab oder offenem Sheet pausieren.
- Systembalken auf transform-basierte Animation umstellen und die Schrift-Preloads auf die tatsächlich sichtbaren Desk-Schriften aktualisieren.
- Die beiden 14-Tage-Bezeichnungen korrigieren, `sr-Latn` setzen, die englische OG-Locale entfernen und die 404-Seite im Schreibtisch-Stil auf Serbisch gestalten.
- Die bestehende Gestaltung, Tageszeit-Texte, Sheets, Tabs und übrigen Inhalte unverändert lassen.

## Technische Details
- Hashes werden mit `pushState`/`popstate` synchronisiert; Schließen nutzt nur dann `history.back()`, wenn der Sheet-Eintrag von der Seite gesetzt wurde.
- `inert` wird nur während eines offenen Sheets auf Schreibtisch, Tab-Leiste und Hinweis gesetzt.
- Die 3D-Abhängigkeiten werden ausschließlich clientseitig dynamisch importiert; Mobilgeräte laden nur die sichtbare Pflanze.
- Der offene Sheet-Zustand pausiert beide Zeichen-Schleifen und setzt sie beim Schließen fort.

## Prüfung
- Desktop mit 1440 px und Mobilgerät mit 390 px prüfen.
- Kontrollieren, dass alle sechs Tabs in einer Zeile bleiben, der mobile CTA verkürzt wird und Touch-Ziele mindestens 44 px hoch sind.
- Direkte Hash-Aufrufe sowie Öffnen, Zurück-Taste, Escape, Schließen-Button und Hintergrundklick testen.
- Fokus, `inert`, aktuelle `aria-labelledby`-Zuordnung, WhatsApp-Ziele und mobile Überschriften prüfen.
- Sicherstellen, dass keine Konsolenfehler oder Buildfehler bestehen und die mobilen 3D-Anfragen reduziert sind.
