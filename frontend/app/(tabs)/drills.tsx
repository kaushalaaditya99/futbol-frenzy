import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, Button } from 'react-native';
import resolveEndpoint from '@/services/resolveEndpoint';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function DrillScreen() {
  console.log("Hello");
  const [drills, setDrills] = useState([]);
  const [drillName, setDrillName] = useState("");
  const [coachID, setCoachID] = useState("");

  const URL = resolveEndpoint("/api/drills/");

  // READ
const fetchDrills = async () => {
    try {
      const res = await fetch(URL);
      const data = await res.json();
      setDrills(data);
      console.log(data);
    } catch (err) {
      console.log("Fetch error:", err);
    }

  };

  useEffect(() => {
    fetchDrills();
  }, []);

  // 🔹 CREATE (POST)
  const createDrill = async () => {
    try {
      const res = await fetch(URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          drillName: drillName,
          coachID: parseInt(coachID),
        }),
      });

      const data = await res.json();
      setDrills([...drills, data]);
      setDrillName("");
      setCoachID("");
    } catch (err) {
      console.log("Create error:", err);
    }
  };

  // 🔹 UPDATE (PUT)
  const updateDrill = async (id: number) => {
    try {
      const res = await fetch(`${URL}${id}/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          drillName: "Updated Name",    // NAME
          coachID: 1,                   // COACH ID
        }),
      });

      const updated = await res.json();

      setDrills(drills.map(d => (d.id === id ? updated : d)));
    } catch (err) {
      console.log("Update error:", err);
    }
  };

  // 🔹 DELETE
  const deleteDrill = async (id : number) => {
    try {
      await fetch(`${URL}${id}/`, {
        method: "DELETE",
      });

      setDrills(drills.filter(d => d.id !== id));
      console.log("DELETED");
      fetchDrills();
    } catch (err) {
      console.log("Delete error:", err);
    }
  };

  return (
    <View style={{ padding: 20 }}>

      <TextInput
        placeholder="Drill Name"
        value={drillName}
        onChangeText={setDrillName}
        style={{ borderWidth: 1, marginBottom: 10 }}
      />

      <TextInput
        placeholder="Coach ID"
        value={coachID}
        onChangeText={setCoachID}
        keyboardType="numeric"
        style={{ borderWidth: 1, marginBottom: 10 }}
      />

      <Button title="Create Drill" onPress={createDrill} />

      <FlatList
        data={drills}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={{ marginTop: 15 }}>
            <Text>{item.drillName}</Text>
            <Button title="Update" onPress={() => updateDrill(item.id)} />
            <Button title="Delete" onPress={() => deleteDrill(item.id)} />
          </View>
        )}
      />
    </View>
  );
}

  /*
  const [drillID, setDrillID] = useState('');
  const [drillName, setDrillName] = useState('');
  const [coachID, setCoachID] = useState('');

  useEffect(() => {
    loadDrills();
    createDrill();
  }, []);

  // read operation
  const loadDrills = async () => {
    const URL = resolveEndpoint("/api/drills");
    const response = await fetch(URL);
    const output = await response.json();
    console.log(output);
  }

  // create operation
  const createDrill = async () => {
    console.log("CREATING");
    const newDrill = {
      drillID: drillID,
      drillName: drillName,
      coachID : coachID,
    }
    try{
      console.log("TESTING");
      const URL = resolveEndpoint("/api/drills");
      const response = await axios.post(URL, newDrill);

      if (response.status === 201){
        console.log("IN HERE");
        Alert.alert('Success', 'Item created successfully!');
        setDrillID('');
        setDrillName('');
        setCoachID('');
      }
    }catch (error){
      console.error("Error creating item:");
    }
  };

  /*const createDrill = async () => {
    console.log("before create");
    const response = await fetch("/api/drills",{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({drillName, coach}),
    });

    const data = await response.text();
    console.log("Status:", response.status);
    console.log("Response:", data);

    if (response.ok){
      Alert.alert('Success');
      loadDrills();
    }else{
      throw new Error("failed to create new drill");
    }
    console.log("testing");
  }*/

 /* return (
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
}*/