import React, {useEffect} from 'react';
import {SafeAreaView, StyleSheet, Text} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

export default function App() {
  const x = useSharedValue(0);

  useEffect(() => {
    x.value = withRepeat(withTiming(200, {duration: 1000}), -1, true);
  }, [x]);

  const style = useAnimatedStyle(() => ({transform: [{translateX: x.value}]}));

  return (
    <SafeAreaView style={styles.container}>
      <Text>If this box moves, the app survived the reload.</Text>
      <Animated.View style={[styles.box, style]} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center', padding: 24},
  box: {width: 60, height: 60, backgroundColor: 'tomato', marginTop: 24},
});
