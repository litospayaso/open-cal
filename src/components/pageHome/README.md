# PageHome

The main dashboard page of the OpenCal application.

## Features

- **Daily Nutrition Summary**: Displays total Calories, Carbs, Fat, and Protein consumed for the selected date.
- **Date Navigation**: Allows users to switch between dates to view history.
- **Categorized Food Log**: Lists food items consumed during Breakfast, Snacks, Lunch, and Dinner.
- **Data Persistence**: Uses IndexedDB to store daily logs locally.

## Usage

This component is intended to be used within the `PageOpenCal` router.

```html
<page-home></page-home>
```

## Dependencies

- `ComponentEmoji`: For displaying food emojis.
- `ComponentSearchResult`: For displaying logged food items.
- `DBService`: For data management.
