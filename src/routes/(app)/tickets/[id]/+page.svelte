<script lang="ts">
  import { doc, getDoc } from "firebase/firestore";
  import { page } from "$app/stores";
  import { db } from "$lib/firebase";
  import { onMount } from "svelte";
  import { AuthUserOnly } from "$lib";

  let purchase: any = $state(null);
  let loading = $state(false);
  let errorMessage = $state("");

  // Fetch purchase details using the ID from the URL
  onMount(async () => {

    AuthUserOnly();

    const { id } = $page.params;

    try {
      loading = true;

      // Fetch purchase details from Firestore
      const purchaseDoc = await getDoc(doc(db, "purchases", id));
      if (purchaseDoc.exists()) {
        purchase = { id: purchaseDoc.id, ...purchaseDoc.data() };
      } else {
        errorMessage = "Purchase not found.";
      }
    } catch (error) {
      console.error("Error fetching purchase:", error.message);
      errorMessage = "Failed to load purchase details.";
    } finally {
      loading = false;
    }
  });
</script>

<div class="max-w-3xl m-auto">
  {#if loading}
    <div>Loading purchase details...</div>
  {:else if errorMessage}
    <div class="error">{errorMessage}</div>
  {:else if purchase}
    <div class="flex items-center gap-4 bg-white my-5">
      <img src={purchase.qrCode} alt="QR Code" width="200" />
      <div class="purchase-details">
        <h2>Ticket Details</h2>
        <p><strong>Match:</strong> {purchase.match}</p>
        <p><strong>Category:</strong> {purchase.category}</p>
        <p><strong>Quantity:</strong> {purchase.quantity}</p>
        <p><strong>Date:</strong> {purchase.date}</p>
        <p><strong>Venue:</strong> {purchase.venue}</p>
      </div>
    </div>
  {/if}
</div>

<style>
  .error {
    color: red;
    margin-top: 20px;
  }
</style>
