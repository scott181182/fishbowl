<div class="container flex flex-col gap-8 py-8">
    <section class="hero">
        <div class="hero-content text-center">
            <h1 class="text-6xl">Fishbowl</h1>
        </div>
    </section>
    <section class="action-card-grid">
        <article>
            <div>
                <h2>Create Game</h2>
                <p>Create a new room to play Fishbowl with your friends!</p>
                <button class="btn btn-primary"> Go </button>
            </div>
        </article>
        <article>
            <div>
                <h2>Join Game</h2>
                <p>Join an existing game using the host's room name.</p>
                <div class="join">
                    <input
                        type="text"
                        placeholder="Room Name"
                        class="input join-item"
                    />
                    <button class="btn btn-primary join-item"> Join </button>
                </div>
            </div>
        </article>
    </section>
</div>

<style lang="postcss">
    @reference "../app.css";

    .action-card-grid {
        @apply grid grid-cols-1 md:grid-cols-2 gap-8 px-8;

        & > article {
            @apply card bg-base-100;

            & > div:first-child {
                @apply card-body items-center;

                & > h2 {
                    @apply text-2xl;
                }
            }
        }
    }
</style>
