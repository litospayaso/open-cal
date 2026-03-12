# component-shape-chart

A radar (spider) chart component for displaying multi-dimensional data in a polygon shape.

## Usage

```html
<component-shape-chart .chartData="${data}"></component-shape-chart>
```

## Data Format

```typescript
{
  labels: ['Label 1', 'Label 2', ...],
  datasets: [
    {
      label: 'Dataset 1',
      data: [val1, val2, ...],
      color: '#ff0000' // Optional
    }
  ]
}
```
