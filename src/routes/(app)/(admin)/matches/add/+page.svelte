<script lang="ts">
    import { db } from "$lib/firebase";
    import { collection, addDoc } from "firebase/firestore";
  
    let homeTeam = "";
    let awayTeam = "";
    let date = "";
    let time = "";
    let venue = "";
    let categories = [
      { name: "Premium", price: "", quantity: "" },
      { name: "Standard", price: "", quantity: "" },
      { name: "Regular", price: "", quantity: "" },
    ];
    let errorMessage = "";
    let successMessage = "";
  
    async function addMatch() {
      try {
        // Validate category inputs
        for (const category of categories) {
          if (!category.price || !category.quantity) {
            throw new Error(`Please provide price and quantity for ${category.name}`);
          }
        }
  
        // Add match details to Firestore
        await addDoc(collection(db, "matches"), {
          homeTeam,
          awayTeam,
          date,
          time,
          venue,
          categories,
          createdAt: new Date(),
        });
  
        successMessage = "Match added successfully!";
        errorMessage = "";
  
        // Reset fields
        homeTeam = "";
        awayTeam = "";
        date = "";
        time = "";
        venue = "";
        categories = [
          { name: "Premium", price: "", quantity: "" },
          { name: "Standard", price: "", quantity: "" },
          { name: "Regular", price: "", quantity: "" },
        ];
      } catch (error: any) {
        errorMessage = error.message || "An error occurred while adding the match. Please try again.";
        successMessage = "";
        console.error("Error adding match:", error.message);
      }
    }
  </script>
  
  <style>
    form {
      display: flex;
      flex-direction: column;
      max-width: 600px;
      margin: auto;
      padding: 20px;
      border: 1px solid #ddd;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }
  
    input, button {
      margin-bottom: 15px;
      padding: 10px;
      font-size: 16px;
    }
  
    input {
      border: 1px solid #ccc;
      border-radius: 4px;
    }
  
    button {
      background-color: #28a745;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
  
    button:hover {
      background-color: #218838;
    }
  
    .category-section {
      margin-bottom: 20px;
      padding: 10px;
      border: 1px solid #ccc;
      border-radius: 8px;
    }
  
    .error {
      color: red;
      margin-bottom: 15px;
    }
  
    .success {
      color: green;
      margin-bottom: 15px;
    }
  </style>
  
  <form on:submit|preventDefault={addMatch}>
    <h2>Add Match</h2>
  
    {#if errorMessage}
      <p class="error">{errorMessage}</p>
    {/if}
  
    {#if successMessage}
      <p class="success">{successMessage}</p>
    {/if}
  
    <input type="text" placeholder="Home Team" bind:value={homeTeam} required />
    <input type="text" placeholder="Away Team" bind:value={awayTeam} required />
    <input type="date" bind:value={date} required />
    <input type="time" bind:value={time} required />
    <input type="text" placeholder="Venue" bind:value={venue} required />
  
    <h3>Seat Categories</h3>
    {#each categories as category, index}
      <div class="category-section">
        <strong>{category.name}</strong>
        <input type="number" placeholder="Price" bind:value={category.price} required />
        <input type="number" placeholder="Quantity" bind:value={category.quantity} required />
      </div>
    {/each}
  
    <button type="submit">Add Match</button>
  </form>
  