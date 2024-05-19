import * as html from "./ui/html";

export function createTimer(app: any) {
    const timerCounterSave = app.timer_counter++;

    const actionsContainer = <HTMLElement>html.get(`#actions-collapse`);
    const timer = html.toElement(html.collapseTimeline(timerCounterSave));
    actionsContainer?.appendChild(timer);

    const button = <HTMLInputElement>(
        html.get(`#timeline_${timerCounterSave}_add`)
    );
    button.addEventListener("pointerdown", () =>
        createTimerKey(app, timerCounterSave)
    );

    const button2 = <HTMLInputElement>(
        html.get(`#timeline_${timerCounterSave}_add_click`)
    );
    button2.addEventListener("pointerdown", () =>
        createClickKey(app, timerCounterSave)
    );

    const removeButton = <HTMLInputElement>(
        html.get(`#timeline_${timerCounterSave}_remove`)
    );
    removeButton.addEventListener("click", function () {
        const parentElement = this.closest(`[id^="input_timeline_"]`);
        if (parentElement) {
            parentElement.remove();
        }
    });

    let interval: ReturnType<typeof setInterval> = -1 as unknown as ReturnType<
        typeof setInterval
    >;
    const block = <HTMLInputElement>(
        html.get(`#timeline_${timerCounterSave}_on`)
    );
    block?.addEventListener("change", (event: Event) => {
        const target = event.target as HTMLInputElement;

        const id = timerCounterSave;
        const duration = html.getInput(`timeline_${id}_time`)!.value;
        if (Number(duration) <= 0) return (target.checked = false);

        app.onCheckboxChange(event);

        const enabled = target.checked;
        if (!enabled) {
            clearInterval(interval);
            return (interval = -1 as unknown as ReturnType<typeof setInterval>);
        }

        const keys_blocks = <HTMLInputElement[]>(
            html.getAll(`div[name="input_timeline_${id}_timer"]`)
        );
        const keys = [...keys_blocks].map((block) => {
            const key = (<HTMLInputElement>(
                block.querySelector(`input[name="key"]`)
            ))?.value;
            const cast = (<HTMLInputElement>(
                block.querySelector(`input[name="cast"]`)
            ))?.value;

            const x = (<HTMLInputElement>block.querySelector(`input[name="x"]`))
                ?.value;
            const y = (<HTMLInputElement>block.querySelector(`input[name="y"]`))
                ?.value;

            if (key && cast && key !== "" && cast !== "") {
                return { cast: +cast, key };
            }

            if (x && y && x !== "" && y !== "") {
                return { x: +x, y: +y, cast: 100 };
            }
        });

        interval = setInterval(() => {
            keys.forEach((data) => {
                app.input.send(data!);
            });
        }, Number(duration));
    });
}

export function createTimerKey(app: any, timerCounterSave: number) {
    const key_counter_save = app.timer_key_counter.get(timerCounterSave) || 0;
    app.timer_key_counter.set(timerCounterSave, key_counter_save + 1);

    const cheats_container = <HTMLElement>(
        html.get(`#timeline_${timerCounterSave}_collapse`)
    );
    const timer = html.toElement(
        html.input_timeline_group(
            `timeline_${timerCounterSave}_timer`,
            `timeline_${timerCounterSave}_timer_${key_counter_save}`
        )
    );

    cheats_container?.appendChild(timer);

    const button = <HTMLInputElement>(
        html.get(
            `#input_timeline_${timerCounterSave}_timer_${key_counter_save}_remove`
        )
    );
    button.addEventListener("pointerdown", function (event: Event) {
        const target = event.target as HTMLInputElement;
        const block = target.getAttribute("data-block-id");
        (<HTMLElement>html.get(`#${block}`)).remove();
    });
}

export function createClickKey(app: any, timerCounterSave: number) {
    const key_counter_save = app.timer_key_counter.get(timerCounterSave) || 0;
    app.timer_key_counter.set(timerCounterSave, key_counter_save + 1);

    const cheats_container = <HTMLElement>(
        html.get(`#timeline_${timerCounterSave}_collapse`)
    );
    const timer = html.toElement(
        html.click_timeline_group(
            `timeline_${timerCounterSave}_timer`,
            `timeline_${timerCounterSave}_timer_${key_counter_save}`
        )
    );

    cheats_container?.appendChild(timer);

    const button = <HTMLInputElement>(
        html.get(
            `#input_timeline_${timerCounterSave}_timer_${key_counter_save}_remove`
        )
    );
    button.addEventListener("pointerdown", function (event: Event) {
        const target = event.target as HTMLInputElement;
        const block = target.getAttribute("data-block-id");
        (<HTMLElement>html.get(`#${block}`)).remove();
    });

    const button2 = <HTMLInputElement>(
        html.get(
            `#input_timeline_${timerCounterSave}_timer_${key_counter_save}_pos`
        )
    );

    let enabled = true;
    button2.addEventListener("pointerdown", (event: Event) => {
        if (!enabled) return;
        enabled = false;

        const canvas = app.canvas;

        const id = (e: string) =>
            `input_timeline_${timerCounterSave}_timer_${key_counter_save}_${e}`;
        const input_x = html.getInput(id("x"))!;
        const input_y = html.getInput(id("y"))!;

        const update_pos = (event: MouseEvent) => {
            const x = event.offsetX;
            const y = event.offsetY;

            input_x.value = x.toString();
            input_y.value = y.toString();
        };

        function remove() {
            canvas.removeEventListener("pointermove", update_pos);
            canvas.removeEventListener("pointerdown", remove);
            enabled = true;
        }

        canvas.addEventListener("pointermove", update_pos);
        canvas.addEventListener("pointerdown", remove);
    });
}