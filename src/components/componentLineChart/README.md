# Component Line Chart

A simple line chart component built with Lit.

## Usage

```html
<component-line-chart .data=${[10, 50, 25, 70]}></component-line-chart>
```

## Properties

| Property  | Type       | Default | Description                                      |
| --------- | ---------- | ------- | ------------------------------------------------ |
| `data`    | `number[]` | `[]`    | Array of numbers to plot.                        |
| `color`   | `string`   | `''`    | Color of the line stroke. Defaults to app theme. |
| `padding` | `number`   | `20`    | Padding inside the chart area.                   |

## Features

- Responsive width and height.
- SVG based rendering.
- Tooltip on hover.
- Customizable line color.
