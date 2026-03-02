import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, Button } from 'react-native';
import resolveEndpoint from '@/services/resolveEndpoint';
import { SafeAreaView } from 'react-native-safe-area-context';

const URL = resolveEndpoint("/api/drills/");

// 🔹 Drill model (matches backend)
export interface Drill {
  id: number;
  drillName: string;
  drillType: string;
  coachID: number;
  imageBackgroundColor: string;
  imageEmoji: string;
}

// 🔹 GET all drills
export async function fetchDrills(): Promise<Drill[]> {
  try {
    const res = await fetch(URL);
    if (!res.ok) throw new Error("Failed to fetch drills");
    return await res.json();
  } catch (err) {
    console.error("Fetch drills error:", err);
    return [];
  }
}

// 🔹 GET single drill
export async function fetchDrill(id: number): Promise<Drill | null> {
  try {
    const res = await fetch(`${URL}${id}/`);
    if (!res.ok) throw new Error("Failed to fetch drill");
    return await res.json();
  } catch (err) {
    console.error("Fetch drill error:", err);
    return null;
  }
}

// 🔹 CREATE
export async function createDrill(drill: Omit<Drill, "id">): Promise<Drill | null> {
  try {
    const res = await fetch(URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(drill),
    });

    if (!res.ok) throw new Error("Failed to create drill");

    return await res.json();
  } catch (err) {
    console.error("Create drill error:", err);
    return null;
  }
}

// 🔹 UPDATE
export async function updateDrill(id: number, drill: Omit<Drill, "id">): Promise<Drill | null> {
  try {
    const res = await fetch(`${URL}${id}/`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(drill),
    });

    if (!res.ok) throw new Error("Failed to update drill");

    return await res.json();
  } catch (err) {
    console.error("Update drill error:", err);
    return null;
  }
}

// 🔹 DELETE
export async function deleteDrill(id: number): Promise<boolean> {
  try {
    const res = await fetch(`${URL}${id}/`, {
      method: "DELETE",
    });

    return res.ok;
  } catch (err) {
    console.error("Delete drill error:", err);
    return false;
  }
}