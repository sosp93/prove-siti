const items = document.querySelectorAll('.item');

function goto (ev, link) {
    //console.log(ev);
    //console.log(link);
    location.href = link;
}

items.forEach(
    item => {
        item.addEventListener('click', (event) => goto (event, item.attributes.goto.value));
    }
)