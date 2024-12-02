<script lang="ts">
  import { AuthUserOnly } from "$lib";
  import { db } from "$lib/firebase";
  import { collection, getDocs } from "firebase/firestore";
  import { onMount } from "svelte";

  let matches: string | any[] = [];
  let loading = true;
  let errorMessage = "";

  // Fetch matches from Firestore
  async function fetchMatches() {
    try {
      const querySnapshot = await getDocs(collection(db, "matches"));
      matches = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      loading = false;
    } catch (error) {
      errorMessage = "Failed to load matches. Please try again.";
      loading = false;
      console.error("Error fetching matches:", error.message);
    }
  }

  onMount(() => {

    AuthUserOnly();
    
    fetchMatches();
  });
</script>

<div class="matches-container">
  <h2 class="pb-4 text-2xl">Available Matches</h2>

  {#if loading}
    <p>Loading matches...</p>
  {/if}

  {#if errorMessage}
    <p class="error">{errorMessage}</p>
  {/if}

  {#if matches.length > 0}
    {#each matches as match}
      <div class="match-card flex gap-8">
        <div class="">
          <img src="pngegg.png" alt="ticket" width="150">
        </div>
        <div class="flex-1">
          <div class="match-header">
            <h3>{match.homeTeam} vs {match.awayTeam}</h3>
            <p><strong>Date:</strong> {match.date}</p>
          </div>
          <p><strong>Time:</strong> {match.time}</p>
          <p><strong>Venue:</strong> {match.venue}</p>

          <a href={`/details/${match.id}`}>View Details</a>
        </div>
      </div>
    {/each}
  {/if}
</div>

<style>
  .matches-container {
    max-width: 800px;
    margin: auto;
    padding: 20px;
  }

  .match-card {
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 15px;
    margin-bottom: 20px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }

  .match-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }

  .categories {
    margin-top: 10px;
  }

  .category {
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 5px 10px;
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
  }

  .error {
    color: red;
    text-align: center;
  }

  a {
    display: inline-block;
    margin-top: 10px;
    color: white;
    text-decoration: none;
    padding: 6px 20px;
    background-color: #007bff;
    border-radius: 4px;
  }

  a:hover {
    background-color: #0056b3;
  }
</style>
