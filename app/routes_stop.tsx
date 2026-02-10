import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

const RoutesStopScreen = () => {
  const router = useRouter();
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 40 }}>
      <Pressable onPress={() => router.back()} style={{ position: 'absolute', left: 16, top: 40, padding: 8, zIndex: 10 }}>
        <Text style={{ fontSize: 24, color: '#007aff' }}>{'←'}</Text>
      </Pressable>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Hello World</Text>
    </View>
  );
};

export default RoutesStopScreen;
