# ComponentMaintenanceCalories

Component to calculate maintenance calories based on Mifflin-St Jeor formula.

## Usage

```typescript
import '@brote/component-maintenance-calories';

// ... in html
// <component-maintenance-calories
//   .height="${170}"
//   .weight="${70}"
//   .gender="${'male'}"
//   @calories-calculated="${(e) => console.log(e.detail.calories)}"
// ></component-maintenance-calories>
```

### Properties

- `height`: Number (cm)
- `weight`: Number (kg)
- `gender`: String ('male' or 'female')
- `showWarning`: Boolean (default: true) - Toggles the visibility of the psychological warning.
- `translations`: JSON string containing localized texts.

### Events

- `calories-calculated`: Triggered automatically when any form value changes.
  - `detail: { calories: number }`
- `save-calories`: Triggered when the user clicks the "Save" button.
  - `detail: { calories: number, height: number, weight: number, gender: string, age: number, activityLevel: string }`

### Maintenance Calories Calculation
The component uses the Mifflin-St Jeor formula...
