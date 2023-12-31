(async () => {
    const resourceBar = document.querySelector('#resourcebar');
    const playerId = document.querySelector('#div-user-id').getAttribute('data-user-id');

    // const resources = document.querySelector('#resources');
    // const buildings = document.querySelector('#buildings');

    const resourcesGroups = document.querySelectorAll('.resource-group');

    const buildings = await fetch(`/api/getBuildings/${playerId}`).then(res => res.json());

    const defaultMiningRates = await fetch('/api/getDefaultMiningRates').then(res => res.json());
    const lang = await fetch('/lang/en_us.json').then(res => res.json());

    const resourceToBuilding = {
        coal: "coal_mine",
        copper: "copper_mine",
        gold: "gold_mine",
        iron: "iron_mine",
        oil: "oil_pump",
        uranium: "uranium_mine",
        wood: "lumber"
    }

    for(let i = 0; i < resourcesGroups.length; i++) {
        const id = resourcesGroups[i].children[0].id.slice(14);
        resourcesGroups[i].children[0].innerHTML = lang.resources[id];
        initRefresh(id, ((2 ** (buildings.buildings[resourceToBuilding[id]] ?? 0)) * defaultMiningRates.rates[id]))
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
    
    // const kurvixETA = document.querySelector('#kurvix-eta');
    // const kurvixProgress = document.querySelector('#kurvix-progress');
    // const json = JSON.parse(kurvixProgress.getAttribute('data-json'));

    // setInterval(() => {
    //     const now = new Date().getTime();
    //     const eta = Math.floor((json.arrival - now) / 1000);
    //     const elapsed = Math.floor((json.arrival - json.departed) / 1000) - eta;

    //     kurvixETA.innerHTML = `${eta}s`;
    //     kurvixProgress.setAttribute("value", (elapsed / Math.floor((json.arrival - json.departed) / 1000)) * 100)
    // }, 1000);


    const dialogBox = document.querySelector('.dialog')
    const dialogClose = document.querySelectorAll('.dialog-exit')

    dialogClose.forEach((button) => {
        button.addEventListener('click', function() {
            dialogBox.classList.remove('dialog-active');
        });
    });

    window.onkeydown = function(evt) {
        evt = evt || window.event;
        if (evt.key == "Escape") {
            dialogBox.classList.remove('dialog-active');
        }
    };    
})();

function initRefresh(resource, perSecond) {
    setInterval(() => {
        const element = document.querySelector(`#resource-amount-${resource}`);
        const value = parseFloat(element.getAttribute('amount'));
        element.innerHTML = numToHumanReadable(value + perSecond);
        element.setAttribute('amount', value + perSecond);
        element.setAttribute('title', `Amount: ${value + perSecond}\nPer second: ${perSecond}`);
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

async function attack(originPlayerId, playerId) {
    const response = await fetch(`/api/attackPlayer/${playerId}`, { method: "post", headers: { "Authorization": originPlayerId } }).then(res => res.json());

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

async function build(userId, buildingId, toLevel) {
    buildingId = buildingId.substring(13, buildingId.length);
    const toSnakeCase = buildingId.replace("-", "_");
    const costs = await fetch("/api/getBaseBuildingsCosts").then(res => res.json());
    const lang = await fetch('/lang/en_us.json').then(res => res.json());
    // const current = parseInt(document.querySelector(`#resource-amount-coal`).getAttribute('amount'));
    const arr = [];

    const actualCosts = {
        coal: costs.costs[toSnakeCase].coal * (4 ** toLevel),
        copper: costs.costs[toSnakeCase].copper * (4 ** toLevel),
        gold: costs.costs[toSnakeCase].gold * (4 ** toLevel),
        iron: costs.costs[toSnakeCase].iron * (4 ** toLevel),
        oil: costs.costs[toSnakeCase].oil * (4 ** toLevel),
        uranium: costs.costs[toSnakeCase].uranium * (4 ** toLevel),
        wood: costs.costs[toSnakeCase].wood * (4 ** toLevel)
    }
    
    document.querySelector('.dialog-title').innerHTML = `Building <b>${lang.buildings[toSnakeCase]}</b> to level <b>${toLevel}</b>`;

    let canBuild = true;
    for (const [key, value] of Object.entries(actualCosts)) {
        const current = parseInt(document.querySelector(`#resource-amount-${key}`).getAttribute('amount'));
        arr.push([lang.resources[key], value, current, current - value]);
        if (current - value < 0) {
            canBuild = false;
        }
    }
    
    let reply = `<table>
<thead>
    <tr>
        <th>Resource</th>
        <th>Required</th>
        <th>Current</th>
        <th>Amount after</th>
    </tr>
</thead>
<tbody>`;

    for (let i = 0; i < arr.length; i++) {
        reply += `<tr>
        <td>${arr[i][0]}</td>
        <td>${numToHumanReadable(arr[i][1])}</td>
        <td>${numToHumanReadable(arr[i][2])}</td>
        <td${ arr[i][3] < 0 ? ' class="dialog-content-red"' : '' }>${numToHumanReadable(arr[i][3])}</td>
    </tr>`
    }

    reply += `</tbody>
    </table>`;

    const content = document.querySelector(`.dialog-content`);
    content.innerHTML = reply;

    const dialogBox = document.querySelector('.dialog');
    dialogBox.classList.add('dialog-active');

    const confirm = document.querySelector('#dialog-confirm-button');

    if(canBuild) {
        confirm.classList.add('dialog-confirm');
        confirm.classList.add('dialog-button-green');
        confirm.classList.remove('dialog-button-gray');
        confirm.innerHTML = "Build";
        confirm.addEventListener('click', async () => {
            const build = await fetch(`/api/createBuilding/${userId}/${toSnakeCase}/${toLevel}`, {
                method: 'POST',
            }).then(res => res.json());

            console.log(build)

            dialogBox.classList.remove('dialog-active');

            window.location.reload();
        });
    } else {
        confirm.classList.remove('dialog-confirm');
        confirm.classList.remove('dialog-button-green');
        confirm.classList.add('dialog-button-gray');
        confirm.innerHTML = "Not enough resources";
    }
}