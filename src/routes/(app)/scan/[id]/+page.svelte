<script lang="ts">
  import { onMount } from "svelte";


onMount( async() => {
    await fetch("http://192.168.8.144:3000")
})

</script>

<div class="text-3xl font-bold text-green-500 p-8 my-5">
    <span>Thank you for your scan</span>
</div>