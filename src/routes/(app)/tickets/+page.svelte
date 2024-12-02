<script lang="ts">
  import {
    collection,
    query,
    where,
    getDocs,
    orderBy,
  } from "firebase/firestore";
  import { onMount } from "svelte";
  import { db, auth } from "$lib/firebase";
  import { getAuth } from "firebase/auth";
  import { goto } from "$app/navigation";

  let purchases: any[] = [];
  let userId = $state(""); // Replace with the actual logged-in user's ID
  let loading = $state(false);
  let errorMessage = $state("");

  onMount(async () => {
    const authInstance = getAuth();
    const currentUser = authInstance.currentUser;

    if (currentUser) {
      userId = currentUser.uid;
    } else {
      goto("/login");
    }

    await fetchUserPurchases();
  });

  async function fetchUserPurchases() {
    try {
      loading = true;

      // Query Firestore to get all purchases for the user
      const q = query(
        collection(db, "purchases"),
        where("userId", "==", userId) // Filter by userId
      );

      const querySnapshot = await getDocs(q);
      purchases = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error("Error fetching purchases:", error.message);
      errorMessage = "Failed to load purchases.";
    } finally {
      loading = false;
    }
  }
</script>

<div class="max-w-3xl m-auto py-5">
  {#if loading}
    <div>Loading purchases...</div>
  {:else if errorMessage}
    <div class="error">{errorMessage}</div>
  {:else if purchases.length === 0}
    <div>No purchases found.</div>
  {:else}
    <div>
      <h2 class="pb-4 text-2xl">Your Purchases</h2>
      <ul>
        {#each purchases as purchase}
          <li>
            <a href="/tickets/{purchase.id}" class="flex gap-5">
              <div class="">
                <img src="ticket.png" alt="ticket" class="size-14">
              </div>
              <div class="">
                <strong>Match:</strong>
                {purchase.match}<br />
                <strong>Category:</strong>
                {purchase.category}<br />
                <strong>Quantity:</strong>
                {purchase.quantity}<br />
                <strong>Date:</strong>
                {purchase.date}<br />
              </div>
            </a>
          </li>
        {/each}
      </ul>
    </div>
  {/if}
</div>

<style>
  .error {
    color: red;
    margin-top: 20px;
  }

  ul {
    list-style: none;
    padding: 0;
  }

  li {
    margin-bottom: 20px;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 8px;
  }
</style>
