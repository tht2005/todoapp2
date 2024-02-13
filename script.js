function getInnerHTML(text) {
    return `
    <div class="circle">
        <input type="checkbox">
        <div></div>
    </div>
    <div>${text}</div>
    <div class="delete-button"></div>
    `;
}

function removeBox(e) {
    --n;
    let i = parseInt(e.getAttribute('index'));
    arr.splice(i, 1);
    order.splice(i, 1);
    e.parentNode.removeChild(e);
}

function keyPressListener(e, text) {
    const keyCode = e.keyCode ? e.keyCode : e.which;
    if (keyCode == 13) {
        const newDiv = document.createElement('div');
        newDiv.className = "box";
        newDiv.draggable = "true";
        newDiv.innerHTML = getInnerHTML(text.value);
        ++tot;
        order.push(`${-tot}`);
        newDiv.style.order = `${-tot}`;
        newDiv.setAttribute('index', `${n}`);
        ++n;
        arr.push(text.value);
        text.value = '';
        document.querySelector('#todo-container').prepend(newDiv);
        cntItemUpdate();
        updateElement();
        saveData();
    }
}

function clearComplete() {
    const container = document.querySelector('#todo-container');
    container.querySelectorAll('.box').forEach(e => {
        if (e.querySelector('input').checked) {
            removeBox(e);
        }
    });
    cntItemUpdate();
    updateElement();
    saveData();
}

function cntItemUpdate() {
    let res = 0;
    document.querySelectorAll('#todo-container > .box').forEach(e => {
        if (e.style.display != "none") {
            ++res;
        }
    });
    document.querySelector('#cnt-left > span').innerText = `${res}`;
}

function initRadio() {
    var rad = document.querySelectorAll('input[type="radio"]');
    rad.forEach(e => {
        e.onchange = () => {
            const container = document.querySelector('#todo-container');
            console.log(e);
            container.querySelectorAll('.box').forEach(e => {
                e.style.display = "none";
            });
            if (e.value % 2) {
                container.querySelectorAll('.box').forEach(e => {
                    if (!e.querySelector('input').checked) {
                        e.style.display = "flex";
                    }
                });
            }
            if (e.value > 1) {
                container.querySelectorAll('.box').forEach(e => {
                    if (e.querySelector('input').checked) {
                        e.style.display = "flex";
                    }
                });
            }
            cntItemUpdate();
        };
    })
}

let from = null;

function updateElement() {
    const container = document.querySelector('#todo-container');
    container.querySelectorAll('.box').forEach(e => {
        e.querySelector('.delete-button').onclick = () => {
            removeBox(e);
            cntItemUpdate();
            saveData();
        }
        e.ondragstart = event => {
            from = event.target;
        }
        e.ondragover = event => {
            event.preventDefault();
        };
        e.ondrop = event => {
            let tmp = e.style.order;
            e.style.order = from.style.order;
            from.style.order = tmp;
            let i = parseInt(e.getAttribute('index')),
                j = parseInt(from.getAttribute('index'));
            tmp = order[i];
            order[i] = order[j];
            order[j] = tmp;
            saveData();
        };
    });
}

function initData() {
    if (localStorage.getItem('duong') === null) {
        localStorage.setItem('duong', true);
        localStorage.setItem('n', 0);
        localStorage.setItem('tot', 0);
        n = 0;
        arr = new Array(0);
        tot = 0;
        order = new Array(0);
        return;
    }
    n = parseInt(localStorage.getItem('n'));
    arr = new Array(n);
    order = new Array(n);
    for (let i = 0; i < n; ++i) {
        arr[i] = localStorage.getItem(`arr#${i}`);
        order[i] = localStorage.getItem(`ord#${i}`);
    }
    tot = localStorage.getItem('tot');
    const container = document.querySelector('#todo-container');
    for (let i = n; i > 0; --i) {
        const newDiv = document.createElement('div');
        newDiv.className = "box";
        newDiv.draggable = "true";
        newDiv.style.order = order[i - 1];
        newDiv.setAttribute('index', `${i - 1}`);
        newDiv.innerHTML = getInnerHTML(arr[i - 1]);
        container.append(newDiv);
    }
    updateElement();
}

function saveData() {
    localStorage.setItem('n', n);
    for (let i = 0; i < n; ++i) {
        localStorage.setItem(`arr#${i}`, arr[i]);
        localStorage.setItem(`ord#${i}`, order[i]);
    }
    localStorage.setItem('tot', tot);
    console.log(arr, order);
}



let n, arr, tot, order;
initData(n, arr);

cntItemUpdate();
initRadio();
updateElement();