<script lang="ts">
    import Menu from "@lucide/svelte/icons/menu";

    import "../app.css";
    import { onMount } from "svelte";
    import { themeChange } from "theme-change";
    import ThemeSwitcher from "$lib/components/ThemeSwitcher.svelte";

    let { children } = $props();

    onMount(() => {
        themeChange(false);
    });
</script>

<div class="flex flex-col items-stretch h-screen">
    <header class="flex-none">
        <nav class="navbar bg-base-100 shadow-md justify-between">
            <span class="text-2xl">Fishbowl</span>
            <div class="flex gap-4">
                <ThemeSwitcher />
                <Menu />
            </div>
        </nav>
    </header>
    <main class="flex-1 bg-base-300">
        {@render children()}
    </main>
</div>
