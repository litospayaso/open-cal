# ComponentProgressBar

A visual progress bar component that displays daily calorie intake versus a goal, segmented by macronutrients (Fat, Carbs, Protein).

## Features

- **Visual Progress Tracking**: Shows calories consumed relative to the daily goal.
- **Macronutrient Breakdown**: Displays segments for Fat, Carbs, and Protein within the progress bar.
- **Goal Comparison**: Shows current macronutrient percentages against target goals.
- **Status Messages**: dynamic text indicating remaining calories or overage.
- **Responsive Design**: Adapts to container width.

## Usage

```html
<component-progress-bar
  .dailyCaloriesGoal=${2000}
  .caloriesEaten=${1500}
  .fatEaten=${60}
  .carbsEaten=${150}
  .proteinEaten=${80}
  .fatGoalPercent=${30}
  .carbsGoalPercent=${50}
  .proteinGoalPercent=${20}
  .translations=${JSON.stringify(translations)}
></component-progress-bar>
```

## Properties

| Property             | Type     | Description                                 |
| -------------------- | -------- | ------------------------------------------- |
| `dailyCaloriesGoal`  | `Number` | The total daily calorie goal.               |
| `caloriesEaten`      | `Number` | Total calories consumed so far.             |
| `fatEaten`           | `Number` | Grams of fat consumed.                      |
| `carbsEaten`         | `Number` | Grams of carbohydrates consumed.            |
| `proteinEaten`       | `Number` | Grams of protein consumed.                  |
| `fatGoalPercent`     | `Number` | Target percentage for fat intake.           |
| `carbsGoalPercent`   | `Number` | Target percentage for carb intake.          |
| `proteinGoalPercent` | `Number` | Target percentage for protein intake.       |
| `translations`       | `String` | JSON string of translation key-value pairs. |
