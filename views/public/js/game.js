(async () => {
    const resourceBar = document.querySelector('#resourcebar');

    // const resources = document.querySelector('#resources');
    // const buildings = document.querySelector('#buildings');

    const resourcesGroups = document.querySelectorAll('.resource-group');

    const defaultMiningRates = await fetch('/api/getDefaultMiningRates').then(res => res.json());
    const lang = await fetch('/lang/en_us.json').then(res => res.json());

    for(let i = 0; i < resourcesGroups.length; i++) {
        const id = resourcesGroups[i].children[0].id.slice(14);
        resourcesGroups[i].children[0].innerHTML = lang.resources[id];
        initRefresh(id, defaultMiningRates.rates[id]);   
    }

    // for(let i = 0; i < resourceBar.children.length; i++) {
    //     const id = resourceBar.children[i].children[0].id.slice(14);
    //     resourceBar.children[i].children[0].innerHTML = lang.resources[id];
    //     initRefresh(id, defaultMiningRates.rates[id]);
    // }

    // for(let i = 0; i < buildings.children.length; i++) {
    //     const id = buildings.children[i].children[0].id.slice(14);
    //     buildings.children[i].children[0].innerHTML = `${lang.buildings[id]}: `;
    // }
    
})();

function initRefresh(resource, perSecond) {
    setInterval(() => {
        const element = document.querySelector(`#resource-amount-${resource}`);
        const value = parseFloat(element.getAttribute('amount'));
        element.innerHTML = numToHumanReadable(value + perSecond);
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

async function spy(playerId) {
    const resources = (await fetch(`/api/getResources/${playerId}`, { headers: { "Authorization": "spy" } }).then(res => res.json())).resources;

    const resourceFormatted = `Coal: ${numToHumanReadable(resources.coal)}
Copper: ${numToHumanReadable(resources.copper)}
Gold: ${numToHumanReadable(resources.gold)}
Iron: ${numToHumanReadable(resources.iron)}
Oil: ${numToHumanReadable(resources.oil)}
Uranium: ${numToHumanReadable(resources.uranium)}
Wood: ${numToHumanReadable(resources.wood)}`;

    alert(resourceFormatted);
}