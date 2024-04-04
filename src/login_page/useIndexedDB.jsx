//useIndexedDB  

//Troubleshooting:
//for a clean set-up, the DB can be deleted to set everything up. This ensures that it's possible
// to login with "developer". This is done in signup.jsx, line 36
//1. uncomment deleteDatabase()
//2. save, close browser and re-navigate to localhostxxx
//3. comment out deleteDatabase in signup.jsx and save file. 

import { useState, useEffect } from 'react';
function useIndexedDB() {

  const [db, setDb] = useState(null);

  //initialize DB
  useEffect(() => {
    // Setup the database:
    const request = indexedDB.open('myDatabase');

    request.onerror = (event) => {
      console.error('Database error:', event.target.error);
    };

    request.onsuccess = (event) => {
      const database = event.target.result;
      //console.log('Database opened successfully:', database);
      setDb(database);
    };
    
    //if table doesn't exist, add new one (in our case, 'person' table is the user profiles)
    //this must be implemented in the onupgrade needed method.
    request.onupgradeneeded = (event) => {
      const database = event.target.result;
      console.log('Upgrading database:', database);

      //create person table if doesn't exist
      if (!database.objectStoreNames.contains('person')) {
        const personStore = database.createObjectStore('person', { keyPath: 'id', autoIncrement: true });
        console.log("Object store 'person' created successfully");

        // Populate default data for 'person' store. this is the default data also used to login if user
        //clicks "continue without logging in," which logs them in as "developer."
        personStore.transaction.oncomplete = () => {
          const defaultData = [
            { data: {sex: 1, age: 35, height: 175, weight: 75, userId: 'developer' }}
          ];
          const personObjectStore = database.transaction('person', 'readwrite').objectStore('person');
          defaultData.forEach((data) => {
            personObjectStore.add(data);
          });
        };
      }

      //create feedback table for any user feedback
      if (!database.objectStoreNames.contains('feedback')) {
        const feedbackStore = database.createObjectStore('feedback', { keyPath: 'id', autoIncrement: true });
        console.log("Object store 'feedback' created successfully");
      }
    };


  }, []); //initialize only once
  
  //handle submit of new user data in the table "person" 
  const handleAddData = (formData, userId) => {
    if (!db) return; //if db found,
 
    const transaction = db.transaction(['person'], 'readwrite');
    const person = transaction.objectStore('person');
    formData = {
      ...formData, //data coming from SignupForm.jsx
      userId, // Include the generated code (this is generated in Signup.jsx)
    };
    const newData = { data: formData };
    const request = person.add(newData);
    request.onsuccess = () => {
      console.log('Data added successfully:', newData);
    };
    request.onerror = (event) => {
      console.error('Error adding data:', event.target.error);
    };
    return userId
  };

  //for logging in with existing userId
  const checkUserId = async (userId) => {
    if (!db) return null;

    const transaction = db.transaction(['person'], 'readonly');
    const objectStore = transaction.objectStore('person');
    const request = objectStore.openCursor();


    return new Promise((resolve, reject) => {
      request.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          // console.log("event",cursor.value.data.userId)
          if (cursor.value.data.userId === userId) {    
            resolve(cursor.value); //return the value
          } else {
            cursor.continue(); //or keep going
          }
        } else {
          resolve(null); //no match found
        }
      };

      request.onerror = (event) => {
        reject(event.target.error);
      };
    });
  };
  
  // feedback function. 
  const handleAddFeedback = (userId, feedbackFormData) => {
    if (!db) return;
    console.log({userId}, feedbackFormData, userId) 
    const transaction = db.transaction(['feedback'], 'readwrite');
    const feedback = transaction.objectStore('feedback');
    feedbackFormData = {
      ...feedbackFormData, //data coming from Feedback.jsx
      userId //add userId to submitted data (the user's currently logged in ID)
    };
    const newData = { data: feedbackFormData };
    const request = feedback.add(newData);
    request.onsuccess = () => {
      console.log('Feedback from {userId} added successfully:', newData);
    };
    request.onerror = (event) => {
      console.error('Error adding data:', event.target.error);
    };
  };

  //called only by uncommenting line 36 ish in Signup.jsx. 
  const deleteDatabase = () => {
    if (!db) return;
    db.close(); // Close the database connection
    const deleteRequest = indexedDB.deleteDatabase('myDatabase'); // Delete the database
    deleteRequest.onsuccess = () => {
      console.log('Database deleted successfully');
      setDb(null); // Clear the state variable
    };
    deleteRequest.onerror = (event) => {
      console.error('Error deleting database:', event.target.errorCode);
    };
  };

  return {
    handleAddData,
    checkUserId,
    handleAddFeedback,
    deleteDatabase
  };
}

export default useIndexedDB;