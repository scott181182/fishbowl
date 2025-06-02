<script lang="ts">
    import type { Room } from "colyseus.js";
    import { onMount } from "svelte";

    import { joinGameRoom } from "$lib/game/index.js";
    import type { FishbowlState } from "$lib/game/schema/state.js";
    import type { PageProps } from "./$types.js";



    const { data }: PageProps = $props();

    let room = $state<Room<FishbowlState> | null>(null);

    onMount(async () => {
        room = await joinGameRoom(data.roomId);
        console.log(room);
    });
</script>

<div class="container flex flex-col gap-8 py-8">
    <section>
        <article>
            <div>
                <h2>Hello There!</h2>
                <p>{room?.name} : {room?.roomId}</p>
            </div>
        </article>
    </section>
</div>
