<script lang="ts">
    import type { Snippet } from 'svelte';
    import type { LayoutData } from './$types';

    let { data, children }: { data: LayoutData, children: Snippet } = $props();
</script>

<header class="py-10">
    <nav>
        <a href="/login">Login</a>
        <a href="/register">Register</a>
    </nav>
</header>

<div class="py-5">
    {@render children()}
</div>