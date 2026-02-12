import React from "react";
import type { WidgetTaskHandlerProps } from "react-native-android-widget";

import { fetchStop, getAllBUSETAs } from "../app/utils/fetch";
import { BusETAWidget } from "./BusETAWidget";

// Use the same AsyncStorage key as MyRoutes
const ROUTES_KEY = 'baseRoutesToFetch';
// Fallback default routes if storage is empty or fails
const defaultRoutes = [
  { stop: 'B464BD6334A93FA1', route: '272P', service_type: '1' },
  { stop: 'B644204AEDE7A031', route: '272X', service_type: '1' },
];

// Dynamically import AsyncStorage (avoid import at top-level for widget env)
let AsyncStorage: any = null;
try {
  AsyncStorage = require('@react-native-async-storage/async-storage').default;
} catch (e) {
  // If not available, will fallback to defaultRoutes
}

const nameToWidget = {
  // BusETAWidget must match the "name" in app.json widget configuration
  BusETAWidget: BusETAWidget,
};

export async function widgetTaskHandler(props: WidgetTaskHandlerProps) {
  const widgetInfo = props.widgetInfo;
  const Widget = nameToWidget[
    widgetInfo.widgetName as keyof typeof nameToWidget
  ] as any;

  if (!Widget) {
    return;
  }


  // Helper function to fetch and render ETA data
  const fetchAndRenderETAs = async () => {
    let routesToFetch = defaultRoutes;
    // Try to load routes from AsyncStorage if available
    if (AsyncStorage && AsyncStorage.getItem) {
      try {
        const saved = await AsyncStorage.getItem(ROUTES_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          // Defensive: ensure array of objects with stop/route/dir
          if (Array.isArray(parsed) && parsed.every(r => r.stop && r.route && r.service_type)) {
            // Convert service_type to dir for widget
            routesToFetch = parsed.map(r => ({ stop: r.stop, route: r.route, service_type: r.service_type }));
          }
        }
      } catch (e) {
        // Ignore, fallback to defaultRoutes
      }
    }

    // Debug: log the routes to fetch
    console.log('[Widget] routesToFetch:', JSON.stringify(routesToFetch));

    try {
      const { allData } = await getAllBUSETAs(routesToFetch);

      // Debug: log the fetched ETA data
      console.log('[Widget] allData from getAllBUSETAs:', JSON.stringify(allData));

      // Fetch stop names for all unique stops
      const uniqueStops = Array.from(new Set(routesToFetch.map(r => r.stop)));
      const stopInfoResults = await Promise.all(uniqueStops.map(stopId => fetchStop(stopId)));
      const stopNameMap: Record<string, string> = {};
      stopInfoResults.forEach((info, idx) => {
        if (info) {
          stopNameMap[uniqueStops[idx]] = info.name_en;
        }
      });

      // Attach stopName to each ETA (by matching route/dir to routesToFetch)
      const normalizeDir = (dir: string) => {
        if (dir === '1' || dir === 'O') return ['1', 'O'];
        if (dir === '2' || dir === 'I') return ['2', 'I'];
        return [dir];
      };
      const etasWithStopName = allData.map((eta, idx) => {
        const routeObj = routesToFetch.find(r => r.route === eta.route && normalizeDir(r.dir).includes(eta.dir));
        const stopId = routeObj ? routeObj.stop : routesToFetch[idx]?.stop;
        const stopName = stopId ? stopNameMap[stopId] : undefined;
        return { ...eta, stopName };
      });

      // Debug: log the final ETAs with stopName
      console.log('[Widget] etasWithStopName:', JSON.stringify(etasWithStopName));

      props.renderWidget(<Widget {...widgetInfo} etas={etasWithStopName} />);
    } catch (error) {
      console.error("Error fetching ETA data:", error);
      // Always render something, even on error
      props.renderWidget(
        <Widget 
          {...widgetInfo} 
          error="Failed to load ETAs" 
        />
      );
    }
  };

  // Always render the widget immediately for all actions that require display
  // First render with loading state synchronously
  props.renderWidget(<Widget {...widgetInfo} isLoading={true} />);
  
  // Then fetch data asynchronously (don't await, let it update in background)
  fetchAndRenderETAs().catch(err => {
    console.error("Failed to fetch ETAs:", err);
    props.renderWidget(<Widget {...widgetInfo} error="Failed to load ETAs" />);
  });

  switch (props.widgetAction) {
    case "WIDGET_ADDED": {
      // Already rendered above
      break;
    }

    case "WIDGET_UPDATE": {
      // Already rendered above
      break;
    }

    case "WIDGET_RESIZED": {
      // Already rendered above
      break;
    }

    case "WIDGET_DELETED":
      // Not needed for now
      break;

    case "WIDGET_CLICK": {
      // On click, refresh the data (already fetching above)
      // Don't open the app, just update the widget
      break;
    }
    default:
      // Already rendered above
      break;
  }
}
