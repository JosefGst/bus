import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITE_STOP_KEY = 'FAVORITE_STOP_IDS';

export async function appendFavoriteStopId(stopId: string) {
  try {
    const existing = await AsyncStorage.getItem(FAVORITE_STOP_KEY);
    let ids: string[] = [];
    if (existing) {
      ids = JSON.parse(existing);
    }
    if (!ids.includes(stopId)) {
      ids.push(stopId);
      await AsyncStorage.setItem(FAVORITE_STOP_KEY, JSON.stringify(ids));
    }
  } catch (e) {
    console.error('Failed to append favorite stop id', e);
  }
}

export async function loadFavoriteStopIds(): Promise<string[]> {
  try {
    const data = await AsyncStorage.getItem(FAVORITE_STOP_KEY);
    if (data) {
      return JSON.parse(data);
    }
    return [];
  } catch (e) {
    console.error('Failed to load favorite stop ids', e);
    return [];
  }
}
