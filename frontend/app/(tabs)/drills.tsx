import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';

export default function DrillScreen() {
  const [drills, setDrills] = useState([]);

  useEffect(() => {
    fetch('http://100.76.132.101/futbolfrenzy/drills/') // <-- replace with your IP
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setDrills(data);
      })
      .catch(error => console.error(error));
  }, []);

  return (
    <View>
      <FlatList
        data={drills}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Text>{item.drillName}</Text>
        )}
      />
    </View>
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