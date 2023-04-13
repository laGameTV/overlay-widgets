# Counting Game - For StreamElements
Version: 1.2 - 13.04.2023 18:58

## Impotieren des Widget

**Neues Overlay erstellen**

1. Öffne <https://streamelements.com/dashboard/overlays>.
2. Erstelle ein neues Overlay.
3. Wähle 1080p aus.

**Neues Custom Widget erstellen**

4. Erstelle ein neues **Custom Widget**.
5. Ändere die Größe auf `1920x1080px`.
6. Öffne den Overlay Editor.
7. Kopiere die einzelnen Inhalte aus `/code` in die jeweiligen Kategorien.
```
.html        -> HTML
.css         -> CSS
.js          -> JS
fields.json  -> FIELDS
data.json    -> DATA
```
***

## Fields
> Rules position

`Standart: Left`

Es gibt folgende  Auswahloptionen: Left, Right, Hidden.

Die Optionen "Left" und "Right" geben die Position an. Mit "Hidden" kannst du die Regeln komplett verstecken.

> Banned users (comma seperated)

`Standart: Streamelements`

Alle Nutzer die in dieser Liste stehen werden vom Widget ignoriert. Die Namen sind mit einem Komma (,) getrennt.

> Reveal chatter who broke the steak

`Standart: Aktiviert`

Wenn aktiviert wird wenn eine Person die falsche oder eine doppelte Zahl sendet wird der Name dieser Person angezeigt.

> Reset Highscore

Setzt wenn man es anklickt den Highscore auf 0 zurück.