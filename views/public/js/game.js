(async () => {
    const resources = document.querySelector('#resources');
    const buildings = document.querySelector('#buildings');

    const lang = await fetch('/lang/en_us.json').then(res => res.json());

    for(let i = 0; i < resources.children.length; i++) {
        const id = resources.children[i].children[0].id.slice(9);
        resources.children[i].children[0].innerHTML = `${lang.resources[id]}: 0`;
        initRefresh(id, Math.random() * 100_000_000_000, lang);
    }

    for(let i = 0; i < buildings.children.length; i++) {
        const id = buildings.children[i].children[0].id.slice(9);
        buildings.children[i].children[0].innerHTML = `${lang.buildings[id]}: 0`;
    }

})();

function initRefresh(resource, perSecond, lang) {
    setInterval(() => {
        const element = document.querySelector(`#resource-${resource}`);
        const value = parseFloat(element.getAttribute('amount'));
        element.innerHTML = `${lang.resources[resource]}: ${numToHumanReadable(value + perSecond)}`;
        element.setAttribute('amount', value + perSecond);
    }, 1_000);
}

function numToHumanReadable(num) {
    num = parseInt(num);

    if (num >= 1_000_000_000_000) {
        return "w pizdu"
    }
    if (num >= 1_000_000_000) {
        return (num / 1_000_000_000).toFixed(2).replace(/\.0$/, '') + 'B';
    }
    if (num >= 1_000_000) {
        return (num / 1_000_000).toFixed(2).replace(/\.0$/, '') + 'M';
    }
    if (num >= 1_000) {
        return (num / 1_000).toFixed(2).replace(/\.0$/, '') + 'K';
    }
    return num;
}