import { timer } from "../utils/timer";

let canvasActive = false;

export function startTarget(app: any) {
    const executeSearchTarget = async () => {
        if (!app.targetAnimationRunning) return;
        await searchTarget(app);
        if (app.targetAnimationRunning) {
            app.targetInterval = setTimeout(executeSearchTarget, 500);
        }
    };

    create2DCanvas(app);
    canvasActive = true;
    app.targetAnimationRunning = true;
    executeSearchTarget();
}

export function stopTarget(app: any) {
    if (app.targetInterval) {
        clearTimeout(app.targetInterval);
        app.targetInterval = null;
    }
    app.targetAnimationRunning = false;
    app.resetDefeatedCounter();
    canvasActive = false;
}

export function detectEnemy(app: any) {
    if (!canvasActive) return;

    const currentTime = new Date().getTime();
    if (app.isAttacking) {
        app.lastTargetDetectionTime = currentTime;
        if (app.detectionTimeout) {
            clearTimeout(app.detectionTimeout);
        }
        app.detectionTimeout = setTimeout(() => {
            if (
                !canvasActive ||
                document.body.style.cursor.indexOf("curattack") === -1
            ) {
                const checkTime = new Date().getTime();
                if (checkTime - (app.lastTargetDetectionTime ?? 0) > 1000) {
                    app.defeatedEnemies++;
                    app.updateDefeatedCounter();
                    app.isAttacking = false;
                }
            }
        }, 1000);
    } else {
        app.lastTargetDetectionTime = currentTime;
        app.isAttacking = true;
    }
}

async function searchTarget(app: any) {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const centerX = width / 2;
    const centerY = height / 2;

    let done = false;
    let [x, x2, y, y2] = [centerX, centerX, centerY, centerY];
    let radius = 0;
    const maxRadius = width / 4;

    const time = new Date().getTime();
    let targetFound = false;
    let targetFoundCounter = 0;

    return new Promise((resolve) => {
        // app.input.cursorMutation = () => {
        //     if (!canvasActive) return;
        //     app.input.mouseClickEmmit(x, y);
        //     targetFound = true;
        //     app.input.cursorMutation = new Function();

        //     (window as any).timeout = new Date().getTime() - time;
        //     resolve(true);
        // };
        app.input.cursorMutation = () => {
            app.input.mouseClickEmmit(x, y);
            done = true;
            app.input.cursorMutation = new Function();

            (<any>window).timeout = new Date().getTime() - time;

            resolve(true);
        };

        (async () => {
            // while (!done && app.targetAnimationRunning) {
            //     if (!canvasActive) {
            //         done = true;
            //         break;
            //     }
            //     app.ctx2D.clearRect(0, 0, width, height);
            //     app.ctx2D.moveTo(centerX, centerY);
            //     app.ctx2D.beginPath();
            //     radius += 10;
            //     if (radius > maxRadius) {
            //         radius = 10;
            //     }
            //     const steps = 36;
            //     for (let i = 0; i < steps; i++) {
            //         if (!canvasActive) {
            //             done = true;
            //             break;
            //         }
            //         const angle = (i * 2 * Math.PI) / steps;
            //         x2 = centerX + radius * Math.cos(angle);
            //         y2 = centerY + radius * Math.sin(angle);
            //         if (x2 < 0 || y2 < 0 || x2 > width || y2 > height) continue;
            //         app.ctx2D.arc(x2, y2, 3, 0, 2 * Math.PI);
            //         app.ctx2D.strokeStyle = "#fff";
            //         app.ctx2D.stroke();
            //         [x, y] = [x2, y2];
            //         await app.input.mouseMoveEmmit(x, y);
            //         if (done) break;
            //         if (targetFound) {
            //             targetFoundCounter++;
            //             if (targetFoundCounter >= 2) {
            //                 done = true;
            //                 app.lastTargetDetectionTime = new Date().getTime();
            //                 break;
            //             }
            //         }
            //     }
            //     if (done) break;
            //     app.ctx2D.closePath();
            //     await timer(10);
            // }
            // if (canvasActive) {
            //     app.ctx2D.clearRect(0, 0, width, height);
            // }
            // app.input.cursorMutation = new Function();
            // resolve(done);

            app.ctx2D.clearRect(0, 0, width, height);
            app.ctx2D.moveTo(centerX, centerY);
            app.ctx2D.beginPath();

            for (let angle = 0.01; angle < 72; angle += 0.01) {
                if (!canvasActive) {
                    app.ctx2D.clearRect(0, 0, width, height);
                    app.ctx2D.moveTo(centerX, centerY);
                    app.ctx2D.beginPath();
                    remove2DCanvas(app);
                    done = true;
                    break;
                }
                x2 = centerX + (10 + 5 * angle) * Math.cos(angle);
                y2 = centerY + (10 + 5 * angle) * Math.sin(angle);

                if (x2 < 0 || y2 < 0) continue;
                if (x2 > width || y2 > height) continue;
                if (Math.hypot(x2 - x, y2 - y) < 7) continue;

                [x, y] = [x2, y2];

                app.ctx2D.arc(x, y, 3, 0, 2 * Math.PI);
                app.ctx2D.strokeStyle = "#fff";
                app.ctx2D.stroke();

                await app.input.mouseMoveEmmit(x, y);

                if (done) break;
            }

            app.ctx2D.closePath();

            app.input.cursorMutation = new Function();

            timer(1000).then(() => app.ctx2D.clearRect(0, 0, width, height));

            (<any>window).timeout = new Date().getTime() - time;

            resolve(false);
        })();
    });
}

export async function attackTarget(
    app: any,
    target: HTMLInputElement,
    data: { count: number; key: string; cast: number }
) {
    if (!app.targetAnimationRunning || !canvasActive) return;
    target.classList.remove("btn-primary");
    target.classList.add("btn-secondary");

    if (await searchTarget(app)) {
        await timer(500);
        for (let i = 0; i < data.count; i++) {
            await app.input.send({ cast: data.cast, key: data.key });
        }
    }

    target.classList.remove("btn-secondary");
    target.classList.add("btn-primary");
}

function create2DCanvas(app: any) {
    const width = window.innerWidth;
    const height = window.innerHeight;

    const canvas = document.createElement("canvas");
    document.body.append(canvas);

    canvas.setAttribute("id", "canvas2D");
    canvas.setAttribute("width", String(width));
    canvas.setAttribute("height", String(height));

    canvas.style.setProperty("pointer-events", "none");
    canvas.style.setProperty("width", "100%");
    canvas.style.setProperty("height", "100%");
    canvas.style.setProperty("position", "absolute");
    canvas.style.setProperty("opacity", "0.2");

    window.addEventListener("resize", () => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        canvas.setAttribute("width", String(width));
        canvas.setAttribute("height", String(height));
    });

    app.canvas2D = canvas;
    app.ctx2D = canvas.getContext("2d")!;
}

function remove2DCanvas(app: any) {
    const canvas = document.getElementById("canvas2D");
    if (canvas) {
        canvas.remove();
    }
    app.canvas2D = null;
    app.ctx2D = null;
    canvasActive = false;
}
