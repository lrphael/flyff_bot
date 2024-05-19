import Draggabilly from "draggabilly";
import * as html from "./html";

export function initUI() {
    const container = html.toElement(html.container)!;
    document.body.appendChild(container);
    new Draggabilly(<Element>container, {
        handle: ".header",
    });

    const upgrade = <HTMLLinkElement>html.get(`#cheats_upgrade`);
    fetch("https://api.github.com/repos/Ariorh1337/flyff_bot/releases/latest")
        .then((r) => r.json())
        .then((data) => {
            upgrade.setAttribute("href", data.html_url);

            if (data.name === upgrade.getAttribute("name")) return;

            upgrade.innerHTML = `Update:<br>${upgrade.getAttribute("name")}->${
                data.name
            }`;
        });

    create2DCanvas();
}

function create2DCanvas() {
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
}
