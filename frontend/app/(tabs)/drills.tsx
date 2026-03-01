import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import resolveEndpoint from '@/services/resolveEndpoint';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function DrillScreen() {
  console.log("Hello");
  const [drills, setDrills] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const URL = resolveEndpoint("/api/drills");
    const response = await fetch(URL);
    const output = await response.json();
    console.log(output);
  }

  return (
    <SafeAreaView>
      <FlatList
        data={drills}
        keyExtractor={(item) => "Here"}
        renderItem={({ item }) => (
          <Text>{JSON.stringify(item)}</Text>
        )}
      />
    </SafeAreaView>
  );
}

/*
export default function Drills() {
    const [drills, setDrills] = useState([]);

    useEffect(() => {
        fetch("http://127.0.0.1:8000/futbolfrenzy/drills/")
        .then(response => response.json())
        .then(data => setDrills(data));
    }, []);

    return (
        <div>
            {drills.map(drill => (
                <div key={drill.id}>
                    <h3>{drill.drillName}</h3>
                    <p>{drill.coachID}</p>
                </div>
            ))}
        </div>
        
        <View>
            <Text>
                Drills
            </Text>
        </View>
        
    );
}
*/