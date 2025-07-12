<script lang="ts">
    import PlayerState from "$lib/components/PlayerState.svelte";
    import type { GameInstance } from "$lib/game/instance.svelte";



    interface Props {
        game: GameInstance,
    }
    const { game }: Props = $props();

    function pickTeam(teamId: string) {
        game.send("joinTeam", teamId);
    }
</script>

<div class="container">
    <div class="hero">
        <div class="hero-content">
            <span class="text-2xl">Preparing Game...</span>
        </div>
    </div>
    <section class="card">
        <div class="card-body">
            <h1 class="card-title">Teams</h1>

            <div class="grid grid-cols-2 gap-4">
                {#each game.state.teams as [teamId, team] (teamId)}
                    <article class="px-4">
                        <div class="flex justify-between">
                            <h2 class="text-xl">{team.name} ({teamId})</h2>
                            <button
                                class="btn btn-primary"
                                disabled={game.currentPlayer?.team === teamId}
                                onclick={() => pickTeam(teamId)}
                            >
                                Join Team
                            </button>
                        </div>
                        <ul class="list bg-base-300 mt-4">
                            {#each game.state.players as [playerId, player] (playerId)}
                                {#if player.team === teamId}
                                    <li class={["list-row items-center", playerId === game.sessionId && "border-accent border-2"]}>
                                        <span class:italic={playerId === game.sessionId}>{player.name}</span>
                                        <div class="flex-1"></div>
                                        <button class="btn btn-secondary btn-sm">
                                            Change Name
                                        </button>
                                        <PlayerState state={player.state}/>
                                    </li>
                                {/if}
                            {/each}
                        </ul>
                    </article>
                {/each}
            </div>
        </div>
    </section>
</div>
