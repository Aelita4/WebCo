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
    
    const kurvixETA = document.querySelector('#kurvix-eta');
    const kurvixProgress = document.querySelector('#kurvix-progress');
    const json = JSON.parse(kurvixProgress.getAttribute('data-json'));

    setInterval(() => {
        const now = new Date().getTime();
        const eta = Math.floor((json.arrival - now) / 1000);
        const elapsed = Math.floor((json.arrival - json.departed) / 1000) - eta;

        kurvixETA.innerHTML = `${eta}s`;
        kurvixProgress.setAttribute("value", (elapsed / Math.floor((json.arrival - json.departed) / 1000)) * 100)
    }, 1000);
    
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

async function attack(playerId) {
    const response = await fetch(`/api/attackPlayer/${playerId}`, { method: "post", headers: { "Authorization": "fhhsfn8scjll7wi34rurf" } }).then(res => res.json());

    if(response.code === 200) {
        window.location.reload();
    } else {
        console.error(response);
    }
}

async function changePlanetName(userId) {
    const name = prompt("Enter new planet name");
    if (name == null || name == "") {
        return;
    }
    await fetch('/api/changePlanetName', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, userId })
    }).then(res => res.json());
    location.reload();
}