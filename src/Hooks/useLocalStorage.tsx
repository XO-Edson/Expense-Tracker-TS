import { useState } from "react";

const useLocalStorage = (
  key1: string,
  initialValue1: any[],
  key2: string,
  initialValue2: any[]
) => {
  const [storedValue1, setStoredValue1] = useState<any[]>(() => {
    try {
      const item = localStorage.getItem(key1);
      // Parse stored JSON or if none, return initialValue
      return item ? JSON.parse(item) : initialValue1;
    } catch (error) {
      // If error, return initialValue
      console.error("Error loading from local storage:", error);
      return initialValue1;
    }
  });

  const [storedValue2, setStoredValue2] = useState<any[]>(() => {
    try {
      const item = localStorage.getItem(key2);
      // Parse stored JSON or if none, return initialValue
      return item ? JSON.parse(item) : initialValue2;
    } catch (error) {
      // If error, return initialValue
      console.error("Error loading from local storage:", error);
      return initialValue2;
    }
  });

  // Set a new value in local storage
  const setValue = (key: string, value: any[]) => {
    try {
      if (key === key1) {
        setStoredValue1((prevValue) => {
          const newValue = [...prevValue];
          value.forEach((item) => {
            // Check if item with the same id exists
            const existingItem = newValue.find(
              (existing) => existing.id === item.id
            );
            if (!existingItem) {
              newValue.push(item);
            }
          });
          localStorage.setItem(key1, JSON.stringify(newValue));
          return newValue;
        });
      } else if (key === key2) {
        setStoredValue2((prevValue: any) => {
          const newValue = [...prevValue];
          value.forEach((item) => {
            // Check if item with the same id exists
            const existingItem = newValue.find(
              (existing) => existing.id === item.id
            );
            if (!existingItem) {
              newValue.push(item);
            }
          });
          localStorage.setItem(key2, JSON.stringify(newValue));
          return newValue;
        });
      }
    } catch (error) {
      console.error("Error saving to local storage:", error);
    }
  };

  const removeItem = (key: string, id: any) => {
    try {
      let updatedValue;
      if (key === key1) {
        // Retrieve data from local storage
        const storedData = localStorage.getItem(key1);
        const data = storedData ? JSON.parse(storedData) : [];
        // Filter data to remove the item with the given ID
        updatedValue = data.filter((item: any) => item.id !== id);
        // Update local storage with the filtered data
        localStorage.setItem(key1, JSON.stringify(updatedValue));
        // Update state with the filtered data
        setStoredValue1(updatedValue);
      } else if (key === key2) {
        // Retrieve data from local storage
        const storedData = localStorage.getItem(key2);
        const data = storedData ? JSON.parse(storedData) : [];
        // Filter data to remove the item with the given ID
        updatedValue = data.filter((item: any) => item.id !== id);
        // Update local storage with the filtered data
        localStorage.setItem(key2, JSON.stringify(updatedValue));
        // Update state with the filtered data
        setStoredValue2(updatedValue);
      }
    } catch (error) {
      console.error("Error removing from local storage:", error);
    }
  };

  // Clear all items from local storage
  const clear = () => {
    try {
      // Clear local storage
      localStorage.removeItem(key1);
      localStorage.removeItem(key2);

      // Reset the stored value to an empty array
      setStoredValue1(initialValue1);
      setStoredValue2(initialValue2);
    } catch (error) {
      console.error("Error clearing local storage:", error);
    }
  };

  return {
    storedValue1,
    setStoredValue1,
    storedValue2,
    setValue,
    removeItem,
    clear,
    setStoredValue2,
  };
};

export default useLocalStorage;
