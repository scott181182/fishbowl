<script lang="ts">
    import type { GameInstance } from "$lib/game/instance.svelte";



    interface Props {
        game: GameInstance,
    }
    const { game }: Props = $props();
</script>
