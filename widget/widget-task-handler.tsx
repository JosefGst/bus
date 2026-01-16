import React from "react";
import { Linking } from "react-native";
import type { WidgetTaskHandlerProps } from "react-native-android-widget";
import { HelloWidget } from "./HelloWidget";

const nameToWidget = {
  // Hello will be the **name** with which we will reference our widget.
  Hello: HelloWidget,
};

export async function widgetTaskHandler(props: WidgetTaskHandlerProps) {
  const widgetInfo = props.widgetInfo;
  const Widget = nameToWidget[
    widgetInfo.widgetName as keyof typeof nameToWidget
  ] as any;

  // Always render the widget for all actions that require display
  if (Widget) {
    switch (props.widgetAction) {
      case "WIDGET_ADDED": {
        props.renderWidget(<Widget {...widgetInfo} />);
        break;
      }

      case "WIDGET_UPDATE": {
        props.renderWidget(<Widget {...widgetInfo} />);
        break;
      }

      case "WIDGET_RESIZED": {
        props.renderWidget(<Widget {...widgetInfo} />);
        break;
      }

      case "WIDGET_DELETED":
        // Not needed for now
        break;

      case "WIDGET_CLICK": {
        if (props.clickAction === "OPEN_APP") {
          Linking.openURL("bus://");
        }
        // Re-render widget after click
        props.renderWidget(<Widget {...widgetInfo} />);
        break;
      }
      default:
        // Render widget for any other action
        props.renderWidget(<Widget {...widgetInfo} />);
        break;
    }
  }
}
