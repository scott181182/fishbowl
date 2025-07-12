<script lang="ts">
    import { MatchMakeError } from "colyseus.js";
    import { onDestroy, onMount } from "svelte";

    import { joinGameRoom } from "$lib/game/index.js";
    import { GameInstance } from "$lib/game/instance.svelte.js";
    import type { PageProps } from "./$types.js";
    import GamePlaying from "./GamePlaying.svelte";
    import GamePreparing from "./GamePreparing.svelte";



    const { data }: PageProps = $props();

    let game = $state.raw<GameInstance | null>(null);
    let error = $state<string | null>(null);

    onMount(async () => {
        try {
            const room = await joinGameRoom(data.roomId);
            game = new GameInstance(room);
        } catch(err) {
            if(err instanceof MatchMakeError && err.message.includes("Could not find room")) {
                error = `Could not find room '${data.roomId}'`;
            } else {
                throw err;
            }
        }
    });
    onDestroy(() => {
        game?.disconnect();
    });
</script>

<div class="container flex flex-col gap-8 py-8">
    <section>
        {#if error}
            <div>
                <div role="alert" class="alert alert-error alert-vertical m-auto w-1/2">
                    <span>{error}</span>
                    <a href="/" class="link">Return to Main Page</a>
                </div>
            </div>
        {:else if game}
            {#if game.state.phase === "preparing"}
                <GamePreparing game={game}/>
            {:else if game.state.phase === "playing"}
                <GamePlaying game={game}/>
            {/if}
        {/if}
    </section>
</div>
