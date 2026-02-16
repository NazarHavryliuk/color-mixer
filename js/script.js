function updateColor() {
    let r = document.getElementById("red").value;
    let g = document.getElementById("green").value;
    let b = document.getElementById("blue").value;

    document.getElementById("colorBox").style.backgroundColor =
        "rgb(" + r + "," + g + "," + b + ")";
}

document.getElementById("red").oninput = updateColor;
document.getElementById("green").oninput = updateColor;
document.getElementById("blue").oninput = updateColor;

