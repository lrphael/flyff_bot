import "bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import { detectEnemy } from "./detector/detector";
import { setupEventListeners } from "./events/events";
import { createKey } from "./key";
import { createTimer } from "./timeline";
import * as html from "./ui/html";
import { initUI } from "./ui/ui";
import Input from "./utils/inputs";

const canvas = <HTMLElement>html.get(`canvas`);

type Interval = ReturnType<typeof setInterval>;

class App {
    public canvas = canvas;
    public canvas2D!: HTMLCanvasElement;
    public ctx2D!: CanvasRenderingContext2D;
    public input = new Input(canvas);
    public timer_counter = 0;
    public timer_key_counter = new Map();
    public key_counter = 0;
    public isFocused = false;
    public targetAnimationRunning = false;
    public targetInterval: Interval | null = null;
    public defeatedEnemies = 0;
    public lastTargetDetectionTime: number | null = null;
    public detectionTimeout: ReturnType<typeof setTimeout> | null = null;
    public isAttacking = false;

    constructor() {
        this.initialize();
    }

    private initialize() {
        initUI();
        setupEventListeners(this);
        this.input.cursorMutation = () => detectEnemy(this);
    }

    public startTarget() {
        this.targetAnimationRunning = true;
    }

    public stopTarget() {
        this.targetAnimationRunning = false;
    }

    public updateDefeatedCounter() {
        const counterElement = document.getElementById("defeated_counter");
        if (counterElement) {
            counterElement.textContent = this.defeatedEnemies.toString();
        }
    }

    public resetDefeatedCounter() {
        this.defeatedEnemies = 0;
        this.updateDefeatedCounter();
    }

    public createTimer() {
        createTimer(this);
    }

    public createKey() {
        createKey(this);
    }

    public onCheckboxChange(event: Event) {
        const target = event.target as HTMLInputElement;
        const block = target.getAttribute("data-block-id");
        const enabled = target.checked;

        const block_element = document.getElementById(block!);
        [
            ...block_element?.querySelectorAll(`input:not([type="checkbox"])`)!,
        ].forEach((input) => {
            (<HTMLInputElement>input).disabled = enabled;
        });
        [...block_element?.querySelectorAll(`button:not(.cant_lock)`)!].forEach(
            (input) => {
                (<HTMLButtonElement>input).disabled = enabled;
            }
        );
    }
}

new App();
