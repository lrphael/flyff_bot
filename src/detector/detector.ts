import { timer } from "../utils/timer";

export function startTarget(app: any) {
    const executeSearchTarget = async () => {
        if (!app.targetAnimationRunning) return;
        await searchTarget(app);
        if (app.targetAnimationRunning) {
            app.targetInterval = setTimeout(executeSearchTarget, 500);
        }
    };

    executeSearchTarget();
}

export function stopTarget(app: any) {
    if (app.targetInterval) {
        clearTimeout(app.targetInterval);
        app.targetInterval = null;
    }
    app.resetDefeatedCounter();
}

export function detectEnemy(app: any) {
    const currentTime = new Date().getTime();
    if (app.isAttacking) {
        app.lastTargetDetectionTime = currentTime;
        if (app.detectionTimeout) {
            clearTimeout(app.detectionTimeout);
        }
        app.detectionTimeout = setTimeout(() => {
            if (document.body.style.cursor.indexOf("curattack") === -1) {
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
        app.input.cursorMutation = () => {
            app.input.mouseClickEmmit(x, y);
            targetFound = true;
            app.input.cursorMutation = new Function();

            (window as any).timeout = new Date().getTime() - time;
            resolve(true);
        };

        (async () => {
            while (!done && app.targetAnimationRunning) {
                app.ctx2D.clearRect(0, 0, width, height);
                app.ctx2D.moveTo(centerX, centerY);
                app.ctx2D.beginPath();

                radius += 10;
                if (radius > maxRadius) {
                    radius = 10;
                }

                const steps = 36;
                for (let i = 0; i < steps; i++) {
                    const angle = (i * 2 * Math.PI) / steps;
                    x2 = centerX + radius * Math.cos(angle);
                    y2 = centerY + radius * Math.sin(angle);

                    if (x2 < 0 || y2 < 0 || x2 > width || y2 > height) continue;

                    app.ctx2D.arc(x2, y2, 3, 0, 2 * Math.PI);
                    app.ctx2D.strokeStyle = "#fff";
                    app.ctx2D.stroke();

                    [x, y] = [x2, y2];

                    await app.input.mouseMoveEmmit(x, y);

                    if (done) break;

                    if (targetFound) {
                        targetFoundCounter++;
                        if (targetFoundCounter >= 2) {
                            done = true;
                            app.lastTargetDetectionTime = new Date().getTime();
                            break;
                        }
                    }
                }

                if (done) break;

                app.ctx2D.closePath();
                await timer(10);
            }

            app.ctx2D.clearRect(0, 0, width, height);
            app.input.cursorMutation = new Function();

            resolve(done);
        })();
    });
}
