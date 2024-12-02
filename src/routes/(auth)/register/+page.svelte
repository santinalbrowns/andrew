<script lang="ts">
  import { goto } from "$app/navigation";
  import { auth } from "$lib/firebase";
  import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

  let name = "";
  let email = "";
  let phone = "";
  let password = "";
  let errorMessage = "";

  let loading = $state(false);

  async function registerUser() {
    try {
      // Create user in Firebase Auth
      loading = true;

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Update user profile with display name
      await updateProfile(userCredential.user, { displayName: name });

      alert("Registration successful! Please log in.");

      goto("/login");
    } catch (error) {
      console.error("Error during registration:", error);
      //errorMessage = error.message;
    } finally {
      loading = false;
    }
  }
</script>

<form onsubmit={registerUser}>
  <h2>Register</h2>

  {#if errorMessage}
    <p class="error">{errorMessage}</p>
  {/if}

  <input type="text" placeholder="Full Name" bind:value={name} required />
  <input type="email" placeholder="Email" bind:value={email} required />
  <input type="text" placeholder="Phone" bind:value={phone} required />
  <input
    type="password"
    placeholder="Password"
    bind:value={password}
    required
  />

  <button disabled={loading} type="submit">
    {#if loading}
      <div
        class="animate-spin inline-block size-4 border-[3px] border-current border-t-transparent text-white rounded-full"
        role="status"
        aria-label="loading"
      >
        <span class="sr-only">Loading...</span>
      </div>
    {:else}
      <div class="">Register</div>
    {/if}
  </button>
</form>

<style>
  /* Basic styling for the form */
  form {
    display: flex;
    flex-direction: column;
    max-width: 400px;
    margin: auto;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }

  input,
  button {
    margin-bottom: 15px;
    padding: 10px;
    font-size: 16px;
  }

  input {
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  button {
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  button:hover {
    background-color: #0056b3;
  }

  .error {
    color: red;
    margin-bottom: 15px;
  }
</style>
