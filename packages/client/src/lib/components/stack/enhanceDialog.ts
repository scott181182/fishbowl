import type { ActionReturn } from "svelte/action";



export interface EnhanceDialogAttributes {
    /** fired when clicked on backdrop */
    onclickbackdrop: (e: CustomEvent<void>) => void
}

export type EnhanceDialogActionReturn = ActionReturn<undefined, EnhanceDialogAttributes>;

export function enhancedialog(dialog: HTMLDialogElement): EnhanceDialogActionReturn {
    function onClick(event: MouseEvent) {
        const rect = (event.target as HTMLElement).getBoundingClientRect();
        if (!event.clientX || !event.clientY) {
            // not a mouse event (probably triggered by keyboard)
            return;
        }
        if (
            rect.left > event.clientX ||
            rect.right < event.clientX ||
            rect.top > event.clientY ||
            rect.bottom < event.clientY
        ) {
            dialog.dispatchEvent(new CustomEvent("clickbackdrop"));
        }
    }

    dialog.addEventListener("click", onClick);

    return {
        destroy() {
            dialog.removeEventListener("click", onClick);
        },
    };
}
