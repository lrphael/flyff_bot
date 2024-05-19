import * as html from "../ui/html";

export function setupEventListeners(app: any) {
    let interval: ReturnType<typeof setInterval> = -1 as unknown as ReturnType<
        typeof setInterval
    >;

    const follow = <HTMLInputElement>html.get(`#input_follow`);
    follow.addEventListener("change", (event: Event) => {
        const target = event.target as HTMLInputElement;
        const enabled = target.checked;
        if (!enabled) {
            clearInterval(interval);
            return (interval = -1 as unknown as ReturnType<typeof setInterval>);
        }

        interval = setInterval(() => {
            app.input.send({ cast: 100, key: "z" });
        }, 5000);
    });

    const button = <HTMLInputElement>html.get(`#cheats_add_timeline`);
    button.addEventListener("pointerdown", () => app.createTimer());

    const button2 = <HTMLInputElement>html.get(`#cheats_add_key`);
    button2.addEventListener("pointerdown", () => app.createKey());

    const infoButton = <HTMLInputElement>html.get(`#cheats_info`);
    infoButton.addEventListener("pointerdown", () => {
        const infoSection = document.getElementById("info_section");
        if (infoSection) {
            if (
                infoSection.style.display === "none" ||
                infoSection.style.display === ""
            ) {
                infoSection.style.display = "block";
            } else {
                infoSection.style.display = "none";
            }
        }
    });

    const targetButton = <HTMLInputElement>html.get(`#cheats_target`);
    targetButton.addEventListener("pointerdown", () => {
        if (app.targetAnimationRunning) {
            app.stopTarget();
            targetButton.innerText = "Target";
            targetButton.classList.remove("btn-secondary");
            targetButton.classList.add("btn-primary");
        } else {
            app.startTarget();
            targetButton.innerText = "Stop Target";
            targetButton.classList.remove("btn-primary");
            targetButton.classList.add("btn-secondary");
        }
    });

    const cheatsButton = <HTMLInputElement>(
        html.get(`[data-bs-target="#cheats_collapse"]`)
    );
    cheatsButton.addEventListener("click", () => {
        const cheatsCollapse = document.getElementById("cheats_collapse");
        if (cheatsCollapse) {
            if (cheatsCollapse.classList.contains("show")) {
                cheatsCollapse.classList.remove("show");
                cheatsCollapse.style.display = "none";
            } else {
                cheatsCollapse.classList.add("show");
                cheatsCollapse.style.display = "block";
            }
        }
    });
}
