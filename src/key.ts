import { attackTarget } from "./detector/detector";
import * as html from "./ui/html";

export function createKey(app: any) {
    const keyCounterSave = app.key_counter++;
    const actionsContainer = <HTMLElement>html.get(`#actions-collapse`);
    const timer = html.toElement(html.input_key_group(keyCounterSave))!;
    actionsContainer?.appendChild(timer);

    let interval: ReturnType<typeof setInterval> = -1 as unknown as ReturnType<
        typeof setInterval
    >;
    const block = <HTMLInputElement>html.get(`#input_${keyCounterSave}_on`);
    block?.addEventListener("change", (event: Event) => {
        app.onCheckboxChange(event);

        const target = event.target as HTMLInputElement;
        const enabled = target.checked;
        if (!enabled) {
            clearInterval(interval);
            return (interval = -1 as unknown as ReturnType<typeof setInterval>);
        }

        const id = keyCounterSave;
        const duration = html.getInput(`input_${id}_time`)!.value;
        const cast = html.getInput(`input_${id}_cast`)!.value;
        const key = html.getInput(`input_${id}_key`)!.value;

        if (key.indexOf("TAB") !== -1) {
            let done = false;
            const target = <HTMLInputElement>html.get(`#btn_target`);
            interval = setInterval(async () => {
                if (done) return;
                done = true;
                await attackTarget(app, target, {
                    count: Number(duration),
                    key: key.replace("TAB+", ""),
                    cast: Number(cast),
                });
                done = false;
            }, 100);
        } else {
            interval = setInterval(() => {
                app.input.send({ cast: +cast, key });
            }, Number(duration));
        }
    });

    const removeButton = <HTMLInputElement>(
        html.get(`#input_key_${keyCounterSave}_remove`)
    );
    removeButton.addEventListener("click", function () {
        const blockId = this.getAttribute("data-block-id");
        const parentElement = document.getElementById(blockId!);
        if (parentElement) {
            parentElement.remove();
        }
    });
}
