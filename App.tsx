import React from "react";
import { StyleSheet, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import Login from "./src/screens/Login";
import Map from "./src/screens/Map";
import type { RootStackParamList } from "./src/types/navigation";

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <View style={styles.container}>
      <NavigationContainer>
        {/* <Image
          source={require('./assets/top_banner_light.png')}
          style={styles.banner}
        /> */}
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Map" component={Map} />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgb(66,73,169)",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  banner: {
    width: "100%",
    height: 100,
    resizeMode: "cover",
  },
});