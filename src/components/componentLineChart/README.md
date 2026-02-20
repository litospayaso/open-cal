# Component Line Chart

A simple line chart component built with Lit.

## Usage

```html
<component-line-chart .data=${[{tag: 'Mon', value: 10}, {tag: 'Tue', value: 50}, {tag: 'Wed', value: 25}]}></component-line-chart>
```

## Properties

| Property  | Type                             | Default | Description                                      |
| --------- | -------------------------------- | ------- | ------------------------------------------------ |
| `data`    | `{tag: string, value: number}[]` | `[]`    | Array of data points to plot.                    |
| `color`   | `string`                         | `''`    | Color of the line stroke. Defaults to app theme. |
| `padding` | `number`                         | `20`    | Padding inside the chart area.                   |

## Features

- Responsive width and height.
- SVG based rendering.
- Tooltip on hover.
- Customizable line color.
