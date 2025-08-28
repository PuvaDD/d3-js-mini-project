**D3.JS mini project**

## 📖 Overview

This project is a **React + TypeScript application** that renders an interactive **line chart** using **D3.JS**.  
The chart supports both **single-series** and **multi-series** datasets, with zooming and panning on the X-axis.

It was built as part of a coding exercise to demonstrate:

- Data visualization with D3 inside React
- TypeScript type safety
- Error handling for unexpected data
- Clean and maintainable component design

**IMPORTANT NOTE:**

**The main focus was to make the minimum viable product for the scope of this project. I kept the functionality simple to tick all the boxes that were asked by the employer. We'll discuss what features were removed and the reasoning behind them.**

## 🚀 Tech Stack

- **React 19** (functional components + hooks)
- **TypeScript** (strong typing for data + components)
- **D3.js** (scales, axes, zooming, rendering)
- **Vite**

---

## 📥 Installation

Clone the repo:

```bash
git clone https://github.com/your-username/line-chart-visualization.git
cd line-chart-visualization

Install dependencies:
`npm install`
# or
`yarn install`
# or
`pnpm install`

Start the development server:
`npm run dev`
```

## 📝 Summary:

Initially `app.tsx` fetches the data from the public folder (`data.json` provided by the employer) and pre-processes the data which is then passed to the `lineChart.tsx` component.

The data is static and doesn't change with time so I decoupled the pre-processing from the `lineChart` component and moved it to the fetch level to decrease the load on the chart component so that it doesn't happen every time a prop changes **(This could change based on the project needs)**.

When pre-processing the data, a filter checks for single/multi series type and converts the data to so that the component knows how to render.

## 📈 Features:

- **Canvas:** Since there were a lot of timestamps to render, the SVG approach was not ideal since it added thousands of elements to the DOM which could crash the app. Instead I uses `Canvas` to draw the lines and only used `SVG` for the axes.
- **Scrolling:** Initially I added both X and Y scaling/zooming but there were some flickering that happened when scrolling in both axes. And due to the time limit this feature was removed.
- **Tooltips:** An overlay was added that showed the hovered timestamps information. This too was removed due to the time constraint as it wasn't fully developed. SVG was also used for this tooltip.

## ⚠️ Error Handling

- Handles missing/invalid data points gracefully
- Differentiates between single-series and multi-series datasets
- Prevents chart rendering if data format is unexpected

**I detailed the removed features to explain the thought process behind this project.**

**Features like React router, responsiveness and styling were omitted as described in the project description.**
