import React from "react";
import {
  FlexWidget,
  TextWidget,
} from "react-native-android-widget";

export function HelloWidget() {
  return (
    <FlexWidget
      style={{
        height: "match_parent",
        width: "match_parent",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#000000",
        borderRadius: 16,
        padding: 16,
      }}
      clickAction="OPEN_APP"
    >
      <TextWidget
        text="Hello Bus App"
        style={{
          fontSize: 24,
          color: "#ffffff",
          fontWeight: "bold",
        }}
      />
    </FlexWidget>
  );
}
