# Giveaway Widget - For StreamElements
Version: 1.0 - 13.04.2023 17:52

- [Vorschau](#vorschau)
- [Impotieren des Widget](#impotieren-des-widget)
  - [Neues Overlay erstellen](#neues-overlay-erstellen)
  - [Neues Custom Widget erstellen](#neues-custom-widget-erstellen)
- [Fields](#fields)
- [To-Do](#to-do)

## Vorschau

![2023-04-13 20-13-14_Trim](https://user-images.githubusercontent.com/31692271/231854863-97f82b3a-008a-41aa-92d4-cbf92f7e29a9.gif)
*Gewinnspiel Auslosung*

***

## Impotieren des Widget

### Neues Overlay erstellen

1. Öffne <https://streamelements.com/dashboard/overlays>.
2. Erstelle ein neues Overlay.
3. Wähle 1080p aus.

### Neues Custom Widget erstellen

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
> jebaited.net Token

Dieser Token wird benötigt um Nachrichten im Twitch Chat über den Bot zu versenden, wenn jemand ein Gewinnspiel gestartet hat, jemand teilnimmt oder gewinnt.

**Wie erstellt man einen Token?**

1. Öffne https://jebaited.net/login/ und melde dich dort mit StreamElements an.
2. Drücke links in der Seitenleiste auf den Reiter [*API Tokens*](https://jebaited.net/tokens/).
3. Drücke in der Katigorie "Add new token:" auf das Blaue Dropdown und wähle `botMsg`.
4. Drücke dann auf "Add Token" und kopiere dann unten bei der Katigorie "Current tokens:" den grade erstellen Token.
5. Füge den Token jetzt nurnoch auf StreamElements in das Feld "jebaited.net Token" ein. Fertig!

> Bot language

`Standart: English`

Mit dieser Einstellung kannst du die Sprache der Nachrichten die der Bot in den Chat sendet ändern. Zur auswahl steht aktuell: 🇺🇸 Englisch, 🇩🇪 Deutsch.

> Join command (Default: !join)

`Standart: !join`

Mit dieser Einstellung kannst du den Befehl oder die Phrase ändern, mit der man dem Gewinnspiel beitreten kann. Beispiel: !join oder #giveaway.

> Accent color

`Standart: #9147ff`

Die Akzent Farbe bestimmt Farbe des Kasten in dem der "Join command" und die Anzahl an Teilnehmern mit Gewinnchance steht.
![chrome_2VmHgNBUVB](https://user-images.githubusercontent.com/31692271/231823210-be6da6b7-17be-4967-97f0-6f7d1e44ae48.png)

> Font Color

`Standart: #ffffff`

Font color ändert die Farbe der Texte im Widget.

### Sounds

> Wheel ding - Sound

`Standart: ding.mp3`

> Wheel ding - Sound volume

`Standart: 1`

> Celebration - Sound

`Standart: celebration.mp3`

> Celebration - Sound volume

`Standart: 1`

## To-Do
- [ ] Gewinnspiel reroll
