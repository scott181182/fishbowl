<script lang="ts">
    import type { ToJSON } from "@colyseus/schema";
    import type { Room } from "colyseus.js";
    import { onDestroy, onMount } from "svelte";

    import { joinGameRoom } from "$lib/game/index.js";
    import type { FishbowlState } from "$lib/game/schema/state.js";
    import type { PageProps } from "./$types.js";



    const { data }: PageProps = $props();

    let room = $state.raw<Room<FishbowlState> | null>(null);
    let gameState = $state.raw<ToJSON<FishbowlState> | null>(null);

    onMount(async () => {
        room = await joinGameRoom(data.roomId);
        gameState = room.state.toJSON();
        room.onStateChange((state) => {
            gameState = state.toJSON();
        });
    });
    onDestroy(() => {
        room?.leave();
    });
</script>

<div class="container flex flex-col gap-8 py-8">
    <section>
        {#if gameState}
            <article>
                <dl>
                    <dt>State</dt>
                    <dd>{gameState.phase}</dd>
                </dl>
            </article>
            <article class="p-4 flex gap-4 *:flex-1">
                <div>
                    <h2>All Players</h2>
                    <ul>
                        {#each Object.entries(gameState.players) as [playerId, player] (playerId)}
                            <li>{player.name}</li>
                        {/each}
                    </ul>
                </div>
                {#each Object.entries(gameState.teams) as [teamId, team] (teamId)}
                    <div>
                        <h2>{team.name} ({teamId})</h2>
                        <ul>
                            {#each Object.entries(gameState.players) as [playerId, player] (playerId)}
                                {#if player.team === teamId}
                                    <li>{player.name}</li>
                                {/if}
                            {/each}
                        </ul>
                    </div>
                {/each}
            </article>
        {/if}
    </section>
</div>
