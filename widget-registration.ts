import { registerWidgetTaskHandler } from "react-native-android-widget";
import { widgetTaskHandler } from "./widget/widget-task-handler";

// Register the widget task handler
registerWidgetTaskHandler(widgetTaskHandler);
