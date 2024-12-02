<script lang="ts">
  import { goto } from "$app/navigation";
    import { auth } from "$lib/firebase";
    import { signInWithEmailAndPassword } from "firebase/auth";
  
    let email = "";
    let password = "";
    let errorMessage = "";
  
    async function loginUser() {
      try {
        // Sign in the user with Firebase Auth
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
  
        alert(`Welcome back, ${userCredential.user.displayName || "User"}!`);

        localStorage.setItem("token", await userCredential.user.getIdToken());

        goto("/");

      } catch (error: any) {
        if (error.code === "auth/invalid-credential") {
          errorMessage = "Incorrect credentials. Please try again.";
        } else {
          errorMessage = "An error occurred during login. Please try again.";
        }
      }
    }
  </script>
  
  <style>
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
  
  <form on:submit|preventDefault={loginUser}>
    <h2>Login</h2>
  
    {#if errorMessage}
      <p class="error">{errorMessage}</p>
    {/if}
  
    <input type="email" placeholder="Email" bind:value={email} required />
    <input type="password" placeholder="Password" bind:value={password} required />
  
    <button type="submit">Login</button>
  </form>
  