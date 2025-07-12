<script lang="ts">
    import type { PlayerState } from "$lib/game/schema";



    interface Props {
        class?: string;
        state: PlayerState;
    }

    const { class: clazz, state }: Props = $props();
</script>

{#if state === "writing"}
    <span class={["badge badge-info", clazz]}>{state}...</span>
{:else if state === "ready"}
    <span class={["badge badge-success", clazz]}>{state}...</span>
{:else}
    <span class={["badge", clazz]}>{state}</span>
{/if}
