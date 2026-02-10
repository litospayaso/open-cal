# SearchResult

A component that displays a single food item from the search results.

## Features
- Displays food name and calorie information.
- Provides a toggle button for marking as favorite.
- Emits events for clicking the item or the favorite icon.

## Events
- `element-click`: Fired when the component (icon or name) is clicked. Detail: `{ code: string }`
- `favorite-click`: Fired when the favorite icon is clicked. Detail: `{ code: string, value: boolean }`
