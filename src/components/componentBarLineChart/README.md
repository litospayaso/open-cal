# Component Bar Line Chart

A dual-axis chart component that displays both bars and lines, built with Lit and SVG.

## Usage

```html
<component-bar-line-chart .chartData=${data}></component-bar-line-chart>
```

## Data Structure

The `chartData` property expects an object with the following structure:

```typescript
interface BarLineChartData {
  labels: string[]; // X-axis labels (e.g., ['L', 'M', 'X', ...])
  datasets: {
    label: string;  // Legend label
    type: 'bar' | 'line';
    data: number[]; // Array of values
    color: string;  // Hex or CSS variable
    yAxisID: 'y' | 'y1'; // 'y' for left axis (Calories), 'y1' for right axis (Levels 1-5)
    dashed?: boolean; // For lines: use dashed stroke
    dotted?: boolean; // For lines: use dotted stroke
  }[];
}
```

## Features

- **Dual Y-Axes:** Left axis for high-value metrics (e.g., Calories) and right axis for status metrics (e.g., Levels 1-5).
- **Grouped Bars:** Automatically handles multiple bar datasets side-by-side.
- **Curved Lines:** Renders smooth spline curves for line datasets.
- **Responsive:** Automatically scales to fit its container's dimensions.
- **Themed:** Uses CSS variables for consistent look and feel across Light and Dark modes.
