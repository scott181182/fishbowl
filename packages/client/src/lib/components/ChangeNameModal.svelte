<script lang="ts">
    import type { StackItemProps } from "@svelte-put/async-stack";

    import { enhancedialog } from "./stack/enhanceDialog";



    let {
        item,
        title,
        description,
    }: StackItemProps<{ confirmed: boolean }> & {
        title: string;
        description: string;
    } = $props();

    let dialog: HTMLDialogElement;

    function checkAndResolve() {
        // when dialog has closed and animation has finished, resolve
        if (!dialog.open) {
            item.resolve({ confirmed: dialog.returnValue === "yes" });
        }
    }

    $effect(() => {
        dialog?.showModal();
    });
</script>

<dialog
    class="modal"
    bind:this={dialog}
    use:enhancedialog
    onclickbackdrop={() => dialog.close()}
    onanimationend={checkAndResolve}
>
    <div class="modal-box">
        <h1 class="text-lg font-medium">{title}</h1>
        <p>{description}</p>
        <form method="dialog" class="flex justify-end gap-4">
            <button type="submit" class="c-btn c-btn--outlined" value="no">No</button>
            <button type="submit" class="c-btn" value="yes">Yes</button>
        </form>
    </div>
</dialog>
