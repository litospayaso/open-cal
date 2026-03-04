# ComponentSlider

A customizable slider component built with Lit. It supports numerical and time-based formatting, custom step intervals, and min/max labels (tags) which can include emojis.

## Properties

| Property | Type             | Default  | Description                                            |
| -------- | ---------------- | -------- | ------------------------------------------------------ |
| `min`    | `Number`         | `0`      | Minimum value of the slider.                           |
| `max`    | `Number`         | `100`    | Maximum value of the slider.                           |
| `value`  | `Number`         | `50`     | Current value of the slider.                           |
| `steps`  | `Number`         | `1`      | Increment step for the slider.                         |
| `format` | `Number \| time` | `number` | Display format for the value (e.g., `time` for HH:mm). |
| `minTag` | `String`         | `''`     | Label text or emoji displayed at the minimum end.      |
| `maxTag` | `String`         | `''`     | Label text or emoji displayed at the maximum end.      |

## Events

| Event           | Detail              | Description                          |
| --------------- | ------------------- | ------------------------------------ |
| `value-changed` | `{ value: number }` | Fired when the slider value changes. |

## Usage

```html
<component-slider
  min="0"
  max="12"
  .steps="${0.25}"
  format="time"
  minTag="0h"
  maxTag="12h"
  .value="${7.5}"
  @value-changed="${(e) => console.log(e.detail.value)}"
></component-slider>
```

## Styling

The component uses CSS variables for themes and supports `data-theme="dark"` attribute for dark mode styling.
