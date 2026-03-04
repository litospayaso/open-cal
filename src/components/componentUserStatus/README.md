# ComponentUserStatus

A card component that displays daily user activity metrics in a single row. It includes calories burned (exercise and basal), steps taken, sleep hours, and current energy level.

## Usage

```html
<component-user-status 
  .exerciseCalories=${350}
  .basalCalories=${1600}
  .steps=${8500}
  .sleepHours=${7.5}
  .energyLevel=${4}
></component-user-status>
```

## Properties

| Property           | Type     | Default | Description                                     |
| ------------------ | -------- | ------- | ----------------------------------------------- |
| `exerciseCalories` | `Number` | `0`     | Calories burned through exercise (with 🔥 emoji) |
| `basalCalories`    | `Number` | `0`     | Basal metabolic rate calories (with 🏃 emoji)    |
| `steps`            | `Number` | `0`     | Total steps taken during the day (with 👣 emoji) |
| `sleepHours`       | `Number` | `0`     | Hours of sleep previous night (with 😴 emoji)    |
| `energyLevel`      | `Number` | `0`     | Energy level from 0 to 5 (with ⚡ emoji)         |

## Styling

The component uses global CSS variables for its appearance:

- `--card-background`: Background color of the card.
- `--card-border`: Border color.
- `--text-color`: Main text color for values.
- `--palette-grey`: Color for icons and unit labels.
