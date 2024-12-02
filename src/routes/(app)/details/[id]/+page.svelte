<script lang="ts">
  import { page } from "$app/stores";
  import { db } from "$lib/firebase";
  import { getAuth } from "firebase/auth";
  import {
    doc,
    getDoc,
    updateDoc,
    addDoc,
    collection,
  } from "firebase/firestore";
  import QRCode from "qrcode";
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";

  let match: any = $state(undefined);
  let selectedCategory: any = $state(null);
  let quantity: number = $state(1);
  let totalPrice: number = $state(0); // Add totalPrice state
  let loading = $state(false);
  let errorMessage = $state("");
  let qrCodeData = $state("");
  let userId = $state("");

  onMount(async () => {
    const authInstance = getAuth();
    const currentUser = authInstance.currentUser;

    if (currentUser) {
      userId = currentUser.uid;
    } else {
      goto("/login");
    }

    try {
      loading = true;
      const matchDoc = await getDoc(doc(db, "matches", $page.params.id));
      if (matchDoc.exists()) {
        match = { id: matchDoc.id, ...matchDoc.data() };
      } else {
        errorMessage = "Match not found.";
      }
    } catch (error) {
      console.error("Error fetching match details:", error.message);
      errorMessage = "Failed to load match details.";
    } finally {
      loading = false;
    }
  });

  // Handle dropdown selection
  function handleCategorySelection(event: Event) {
    const selectedName = (event.target as HTMLSelectElement).value;
    selectedCategory = match.categories.find(
      (cat: any) => cat.name === selectedName
    );
    quantity = 1;
    calculateTotalPrice(); // Calculate initial total price
  }

  // Ensure quantity does not exceed available tickets and calculate total price
  function handleQuantityChange(event: Event) {
    const inputQuantity = parseInt((event.target as HTMLInputElement).value);
    if (inputQuantity > selectedCategory.quantity) {
      quantity = selectedCategory.quantity;
    } else if (inputQuantity < 1) {
      quantity = 1;
    } else {
      quantity = inputQuantity;
    }
    calculateTotalPrice();
  }

  // Calculate total price
  function calculateTotalPrice() {
    if (selectedCategory) {
      totalPrice = quantity * selectedCategory.price;
    }
  }

  async function generateQRCode(id: string) {
    const baseUrl = "http://192.168.8.106/scan"; // Replace with your actual domain or endpoint
    const url = `${baseUrl}/${id}`; // URL including purchaseId as a query parameter
    qrCodeData = await QRCode.toDataURL(url);
  }

  async function proceedToCheckout() {
    if (
      !selectedCategory ||
      quantity < 1 ||
      quantity > selectedCategory.quantity
    ) {
      alert("Invalid category or quantity selection.");
      return;
    }

    try {
      

      const purchase = {
        userId,
        match: `${match.homeTeam} vs ${match.awayTeam}`,
        date: match.date,
        time: match.time,
        venue: match.venue,
        category: selectedCategory.name,
        quantity,
        totalPrice, // Add total price to purchase record
        qrCode: "",
        createdAt: new Date().toISOString(),
      };

      const ref = await addDoc(collection(db, "purchases"), purchase);

      await generateQRCode(ref.id);

      const updatedCategories = match.categories.map((cat: any) => {
        if (cat.name === selectedCategory.name) {
          return { ...cat, quantity: cat.quantity - quantity };
        }
        return cat;
      });

      await updateDoc(doc(db, "purchases", ref.id), {
        qrCode: qrCodeData
      })

      await updateDoc(doc(db, "matches", match.id), {
        categories: updatedCategories,
      });

      // Optionally initiate payment
      makePayment(totalPrice, ref.id);
    } catch (error) {
      console.error("Error during checkout:", error.message);
      alert("An error occurred. Please try again.");
    }
  }

  const authInstance = getAuth();
  const currentUser = authInstance.currentUser;

  function makePayment(amount: number, id: string) {
    PaychanguCheckout({
      public_key: "PUB-5cdvDNmzkGV6ejlzj3xHeFOQUctgqjWc",
      tx_ref: "" + Math.floor(Math.random() * 1000000000 + 1),
      amount,
      currency: "MWK",
      callback_url: `http://localhost/tickets/${id}`,
      return_url: "http://localhost/cancel",
      customer: {
        email: currentUser?.email,
        first_name: currentUser?.displayName,
        last_name: "Kapito",
      },
      customization: {
        title: "Test Payment",
        description: "Payment Description",
      },
    });
  }
</script>

<div id="wrapper"></div>

<div class="p-4 bg-white shadow-md">
  {#if loading}
    <div class="">Loading...</div>
  {:else if errorMessage}
    <div class="error">{errorMessage}</div>
  {:else if match}
    <div class="details-container">
      <h2 class="font-bold text-2xl mb-4">
        {match.homeTeam} vs {match.awayTeam}
      </h2>
      <p><strong>Date:</strong> {match.date}</p>
      <p><strong>Time:</strong> {match.time}</p>
      <p><strong>Venue:</strong> {match.venue}</p>

      <div class="categories">
        <h3>Select a Category</h3>
        <select onchange={handleCategorySelection}>
          <option value="" disabled selected>Select a category</option>
          {#each match.categories as category}
            <option value={category.name}>{category.name}</option>
          {/each}
        </select>
      </div>

      {#if selectedCategory}
        <div class="selected-category">
          <h4>Selected Category: {selectedCategory.name}</h4>
          <p><strong>Price:</strong> MWK {selectedCategory.price}</p>
          <p><strong>Available Seats:</strong> {selectedCategory.quantity}</p>

          <div class="quantity-input">
            <label for="quantity">Enter Quantity:</label>
            <input
              type="number"
              id="quantity"
              min="1"
              max={selectedCategory.quantity}
              value={quantity}
              oninput={handleQuantityChange}
            />
          </div>

          <button onclick={proceedToCheckout} class="proceed-button">
            Proceed to Checkout
          </button>
        </div>
      {/if}
    </div>
  {/if}
</div>

<style>
  .details-container {
    max-width: 800px;
    margin: auto;
    padding: 20px;
  }

  .categories {
    margin-top: 10px;
  }

  select {
    width: 100%;
    padding: 10px;
    margin-top: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  .selected-category {
    margin-top: 20px;
    border: 1px solid #ddd;
    padding: 15px;
    border-radius: 8px;
  }

  .quantity-input {
    margin-top: 10px;
  }

  input[type="number"] {
    width: 100%;
    padding: 10px;
    margin-top: 5px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  .proceed-button {
    margin-top: 15px;
    padding: 10px 20px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  .proceed-button:hover {
    background-color: #0056b3;
  }

  .error {
    color: red;
    text-align: center;
    margin-top: 20px;
  }
</style>
