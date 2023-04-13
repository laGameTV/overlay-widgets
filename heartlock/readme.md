# Heartlock Widget - For StreamElements
Version: 1.1 - 13.04.2023 20:25

## Vorschau

*[image]*

***

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
> Center Image (at least 96x96px recommended)

`Standart: heart.png`

Setzt das Bild welches bei einem Heartlock in der Mitte des Bildschirms erscheint.

> Color of bar

`Standart: #9147ff80`

Farbe des Hintergrunds der die Anzahl an Herzen darstellt.

> Font color

`Standart: #ffffff`

Farbe des Text in dem Widget.

> Emotes (comma separated)

`Standart: <3`

Alle Emotes oder Phrasen die im Text gewertet werden sollen. Die Emotes sind mit einem Komma (,) getrennt.