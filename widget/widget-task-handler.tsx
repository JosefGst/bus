import React from "react";
import type { WidgetTaskHandlerProps } from "react-native-android-widget";

import { fetchStop, getAllBUSETAs } from "../utils/fetch";
import { BusETAWidget } from "./BusETAWidget";

const ROUTES_KEY = "baseRoutesToFetch";
const defaultRoutes = [
  { stop: "B464BD6334A93FA1", route: "272P", service_type: "1" },
  { stop: "B644204AEDE7A031", route: "272X", service_type: "1" },
];

/** Reject after ms so we never leave the widget stuck on Loading (e.g. when app is closed). */
function withTimeout<T>(ms: number, promise: Promise<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error("Widget update timeout")), ms);
    promise.then(
      (v) => {
        clearTimeout(t);
        resolve(v);
      },
      (e) => {
        clearTimeout(t);
        reject(e);
      }
    );
  });
}

/** Get routes from storage with a short timeout; never block the widget. */
async function getRoutesWithTimeout(): Promise<typeof defaultRoutes> {
  let AsyncStorage: any = null;
  try {
    AsyncStorage = require("@react-native-async-storage/async-storage").default;
  } catch {
    return defaultRoutes;
  }
  if (!AsyncStorage?.getItem) return defaultRoutes;
  try {
    const saved = await withTimeout(1500, AsyncStorage.getItem(ROUTES_KEY));
    if (!saved) return defaultRoutes;
    const parsed = JSON.parse(saved as string);
    if (
      Array.isArray(parsed) &&
      parsed.every((r: any) => r.stop && r.route && r.service_type)
    ) {
      return parsed.map((r: any) => ({
        stop: r.stop,
        route: r.route,
        service_type: r.service_type,
      }));
    }
  } catch {
    // Ignore; use default routes
  }
  return defaultRoutes;
}

const nameToWidget = {
  BusETAWidget: BusETAWidget,
};

const WIDGET_FETCH_TIMEOUT_MS = 12000;
const TAP_TO_REFRESH = "Tap to refresh";

export async function widgetTaskHandler(props: WidgetTaskHandlerProps) {
  const widgetInfo = props.widgetInfo;
  const Widget = nameToWidget[
    widgetInfo.widgetName as keyof typeof nameToWidget
  ] as any;

  if (!Widget) return;

  const renderError = (message: string) => {
    props.renderWidget(<Widget {...widgetInfo} error={message} />);
  };

  const fetchAndRenderETAs = async () => {
    let routesToFetch = defaultRoutes;
    try {
      routesToFetch = await getRoutesWithTimeout();
    } catch {
      // use defaultRoutes
    }

    try {
      const work = (async () => {
        const { allData } = await getAllBUSETAs(routesToFetch);
        const uniqueStops = Array.from(new Set(routesToFetch.map((r) => r.stop)));
        const stopInfoResults = await Promise.all(
          uniqueStops.map((stopId) => fetchStop(stopId))
        );
        const stopNameMap: Record<string, string> = {};
        stopInfoResults.forEach((info, idx) => {
          if (info) stopNameMap[uniqueStops[idx]] = info.name_en;
        });

        const { normalizeStopName } = require("../utils/string_formatting");
        const groupedEtas: Record<string, any[]> = {};
        routesToFetch.forEach((routeObj) => {
          const stopId = routeObj.stop;
          const stopNameRaw = stopNameMap[stopId] ?? stopId;
          const key = normalizeStopName(stopNameRaw);
          if (!groupedEtas[key]) groupedEtas[key] = [];
        });
        allData.forEach((eta: any) => {
          const stopId = eta.stop;
          const stopNameRaw = stopNameMap[stopId] ?? stopId;
          const key = normalizeStopName(stopNameRaw);
          if (groupedEtas[key]) groupedEtas[key].push(eta);
        });

        props.renderWidget(<Widget {...widgetInfo} groupedEtas={groupedEtas} />);
      })();

      await withTimeout(WIDGET_FETCH_TIMEOUT_MS, work);
    } catch (error) {
      console.error("[Widget] ETA fetch failed:", error);
      renderError(TAP_TO_REFRESH);
    }
  };

  props.renderWidget(<Widget {...widgetInfo} isLoading={true} />);

  fetchAndRenderETAs().catch(() => {
    renderError(TAP_TO_REFRESH);
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
