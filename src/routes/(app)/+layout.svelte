<script lang="ts">
    import type { Snippet } from 'svelte';
    import type { LayoutData } from './$types';

    let { children }: { data: LayoutData, children: Snippet } = $props();
</script>

<header class="py-10">
    <nav>
        <a href="/">Matches</a>
        <a href="/tickets">Tickets</a>
        <a href="/login">Logout</a>
    </nav>
</header>

{@render children()}