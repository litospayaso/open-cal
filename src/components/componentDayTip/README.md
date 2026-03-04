# ComponentDayTip

A dashed-border card component that displays a random healthy tip. It is intended to be shown on the home page when the user has not yet logged any food for the selected day.

## Usage

```html
<component-day-tip
  language="en"
></component-day-tip>
```

## Properties

| Property   | Type     | Default | Description                                                    |
| ---------- | -------- | ------- | -------------------------------------------------------------- |
| `language` | `String` | `'en'`  | Current language key (`'es'`, `'en'`, `'it'`, `'fr'`, `'de'`). |

## Styling

The component uses global CSS variables for its appearance:

- `--card-background`: Background color of the card.
- `--card-border`: Border color (dashed).
- `--card-text`: Color for the tip text.
- `--palette-purple`: Color for the title in dark mode.
- `--palette-green`: Color for the title in light mode.
