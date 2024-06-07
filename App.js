import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Login from './components/Login';
import Map from './components/Map';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      {/* <Image
        source={require('./assets/top_banner_light.png')}
        style={styles.banner}
      /> */}
      <Stack.Navigator initialRouteName='Login' style={styles.container}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Map" component={Map} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(66,73,169)',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  banner: {
    width: '100%',
    height: 100, 
    resizeMode: 'cover', 
    
  },
});
