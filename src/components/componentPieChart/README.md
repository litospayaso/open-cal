# ComponentPieChart

A reusable component that displays a macronutrient distribution pie chart using CSS `conic-gradient`. It supports slot content for the center of the chart (e.g., total calories).

## Usage

```typescript
import '../componentPieChart/index';

// In your render method:
html`
  <component-pie-chart
    .protein="${30}"
    .carbs="${40}"
    .fat="${30}"
  >
    <div style="display: flex; flex-direction: column; align-items: center;">
      <span>100</span>
      <span>kcal</span>
    </div>
  </component-pie-chart>
`
```

## Properties

| Property  | Type     | Default | Description                                     |
| --------- | -------- | ------- | ----------------------------------------------- |
| `protein` | `Number` | `0`     | Amount of protein (used for calculation).       |
| `carbs`   | `Number` | `0`     | Amount of carbohydrates (used for calculation). |
| `fat`     | `Number` | `0`     | Amount of fat (used for calculation).           |

## CSS Variables

The component uses the following CSS variables for colors:

-   `--protein-color`
-   `--carbs-color`
-   `--fat-color`
-   `--card-background` (for the center hole background)

## Slots

-   `default`: The content to display in the center of the doughnut chart.
