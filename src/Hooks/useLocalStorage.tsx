import { useState } from "react";

const useLocalStorage = (key: string, initialValue: any[]) => {
  const [storedValue, setStoredValue] = useState<any[]>(() => {
    try {
      const item = localStorage.getItem(key);
      // Parse stored JSON or if none, return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If error, return initialValue
      console.error("Error loading from local storage:", error);
      return initialValue;
    }
  });

  // Set a new value in local storage
  const setValue = (key: string, value: any[]) => {
    try {
      setStoredValue((prevValue) => {
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
        localStorage.setItem(key, JSON.stringify(newValue));
        return newValue;
      });
    } catch (error) {
      console.error("Error saving to local storage:", error);
    }
  };

  const removeItem = (key: string, id: any) => {
    try {
      // Retrieve transactions from local storage
      const storedData = localStorage.getItem(key);
      let transactionsLocalStorage;

      // Parse storedData if it's not null, otherwise use an empty array
      if (storedData !== null) {
        transactionsLocalStorage = JSON.parse(storedData);
      } else {
        transactionsLocalStorage = [];
      }

      // Filter transactions to remove the item with the given ID
      const updatedTransactions = transactionsLocalStorage.filter(
        (transaction: { id: any }) => transaction.id !== id
      );

      // Update local storage with the filtered transactions
      localStorage.setItem(key, JSON.stringify(updatedTransactions));

      // Optionally, you can update the state with the filtered transactions
      setStoredValue(updatedTransactions);
    } catch (error) {
      console.error("Error removing from local storage:", error);
    }
  };

  // Clear all items from local storage
  const clear = () => {
    try {
      // Clear local storage
      localStorage.clear();
      // Reset the stored value to an empty array
      setStoredValue([]);
    } catch (error) {
      console.error("Error clearing local storage:", error);
    }
  };

  return { storedValue, setValue, removeItem, clear, setStoredValue };
};

export default useLocalStorage;
