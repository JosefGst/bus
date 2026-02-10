import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';

import { ROUTS, fetchBusROUTS } from './utils/fetch';
import { formatEtaToHKTime } from './utils/time_formatting';



const App = () => {
  const [isLoading, setLoading] = useState(true);
  const [routes, setRoutes] = useState<ROUTS[]>([]);
  const [generatedTimestamp, setGeneratedTimestamp] = useState<string>('');

  // Fetch all bus routes
  const fetchAllRoutes = async () => {
    try {
      const res = await fetchBusROUTS();
      setRoutes(res.data);
      setGeneratedTimestamp(res.generated_timestamp);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllRoutes();
  }, []);

  return (
    <View style={{flex: 1, padding: 24}}>
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <>
          <Text style={{fontWeight: 'bold', fontSize: 18, marginBottom: 8}}>
            Generated Timestamp: {formatEtaToHKTime(generatedTimestamp) || 'N/A'}
          </Text>
          <FlatList
            data={routes}
            keyExtractor={(item, index) => `${item.route}-${item.bound}-${item.service_type}-${item.orig_en}-${item.dest_en}-${index}`}
            renderItem={({item}) => (
              <Text>
                {item.route} ({item.bound}) [{item.service_type}] {item.orig_en} → {item.dest_en}
              </Text>
            )}
          />
        </>
      )}
    </View>
  );
};

export default App;