var recipes = [
    { race: 'Человек', parameter: 'Сила +3', ingredients: 'Мать-и-мачеха 15 шт., Чистотел 15 шт.', elixir: 'Свирепый Воин, 12-18 шт.' },
    { race: 'Человек', parameter: 'Ловкость +3', ingredients: 'Мать-и-мачеха 15 шт., Чертополох 15 шт.', elixir: 'Преследование, 12-18 шт.' },
    { race: 'Человек', parameter: 'Удача +5', ingredients: 'Мать-и-мачеха 17 шт., Женьшень 4 шт.', elixir: 'Момент Истины, 5-10 шт.' },
    { race: 'Человек', parameter: 'Усталость -20%', ingredients: 'Подорожник 10 шт.', elixir: 'Белый день, 20-30 шт.' },
    { race: 'Человек', parameter: 'Усталость -40%', ingredients: 'Мать-и-мачеха 8 шт.', elixir: 'Энергия, 20-30 шт.' },
    { race: 'Орк', parameter: 'Сила +5', ingredients: 'Пустырник 15 шт., Тысячелистник 6 шт.', elixir: 'Нечистая сила, 5-10 шт.' },
    { race: 'Орк', parameter: 'Ловкость +3', ingredients: 'Чертополох 15 шт., Пустырник 15 шт.', elixir: 'Укус Пчелы, 12-18 шт.' },
    { race: 'Орк', parameter: 'Удача +3', ingredients: 'Мята 15 шт., Пустырник 15 шт.', elixir: 'Медвежья песня, 12-18 шт.' },
    { race: 'Орк', parameter: 'Усталость -20%', ingredients: 'Подорожник 10 шт.', elixir: 'Трезвость, 20-30 шт.' },
    { race: 'Орк', parameter: 'Усталость -40%', ingredients: 'Пустырник 8 шт.', elixir: 'Полная Луна, 20-30 шт.' },
    { race: 'Эльф', parameter: 'Сила +3', ingredients: 'Зверобой 15 шт., Чистотел 15 шт.', elixir: 'Плач Неразумных, 12-18 шт.' },
    { race: 'Эльф', parameter: 'Ловкость +5', ingredients: 'Зверобой 19 шт., Трын-трава 2 шт.', elixir: 'Живая Вода, 5-10 шт.' },
    { race: 'Эльф', parameter: 'Удача +3', ingredients: 'Мята 15 шт., Зверобой 15 шт.', elixir: 'Розовый Свет, 12-18 шт.' },
    { race: 'Эльф', parameter: 'Усталость -20%', ingredients: 'Подорожник 10 шт.', elixir: 'Легкий путь, 20-30 шт.' },
    { race: 'Эльф', parameter: 'Усталость -40%', ingredients: 'Зверобой 8 шт.', elixir: 'Второе Дыхание, 20-30 шт.' }
];

var resources = {};

function uploadResources() {
    var resourcesText = document.getElementById("resources").value;
    var lines = resourcesText.split('\n');
    resources = {};
    lines.forEach(function(line) {
        var parts = line.split(' ');
        var name = parts.slice(0, -2).join(' ');
        var quantity = parseInt(parts[parts.length - 2]);
        resources[name] = quantity;
    });
    updateRemainingResources();
    updateCraftable();
}

function updateCraftable() {
    var table = document.getElementById("recipes");
    for (var i = 0; i < recipes.length; i++) {
        var craftable = calculateCraftable(recipes[i]);
        table.rows[i + 1].cells[4].innerHTML = craftable; 
        if (parseInt(table.rows[i + 1].cells[5].innerHTML) > 0) {
            table.rows[i + 1].style.backgroundColor = "lightgreen";
        } else {
            table.rows[i + 1].style.backgroundColor = ""; 
        }
    }
}

function calculateCraftable(recipe) {
    var ingredients = recipe.ingredients.split(', ');
    var craftable = Infinity;
    ingredients.forEach(function(ingredient) {
        var parts = ingredient.split(' ');
        var name = parts.slice(0, -2).join(' ');
        var quantity = parseInt(parts[parts.length - 2]);
        var available = resources[name] || 0;
        craftable = Math.min(craftable, Math.floor(available / quantity));
    });
    return craftable;
}

function increaseCraft(rowIndex) {
    var table = document.getElementById("recipes");
    var craftCell = table.rows[rowIndex + 1].cells[5];
    var craftableCell = table.rows[rowIndex + 1].cells[4];
    if (parseInt(craftableCell.innerHTML) > 0) {
        craftCell.innerHTML = parseInt(craftCell.innerHTML) + 1;
        craftableCell.innerHTML = parseInt(craftableCell.innerHTML) - 1;
        updateResources(recipes[rowIndex], -1);
        updateCraftable();
        if (parseInt(craftCell.innerHTML) > 0) {
            table.rows[rowIndex + 1].style.backgroundColor = "lightgreen";
        }
    }
}

function decreaseCraft(rowIndex) {
    var table = document.getElementById("recipes");
    var craftCell = table.rows[rowIndex + 1].cells[5]; 
    if (parseInt(craftCell.innerHTML) > 0) {
        craftCell.innerHTML = parseInt(craftCell.innerHTML) - 1;
        updateResources(recipes[rowIndex], 1);
        updateCraftable();
        if (parseInt(craftCell.innerHTML) === 0) {
            table.rows[rowIndex + 1].style.backgroundColor = "";
        }
    }
}

function updateRemainingResources() {
    var table = document.getElementById("remainingResources");
    while (table.rows.length > 0) {
        table.deleteRow(0);
    }
    for (var name in resources) {
        var row = table.insertRow();
        row.insertCell(0).innerHTML = name;
        row.insertCell(1).innerHTML = resources[name] + " шт.";
    }
}

function updateResources(recipe, direction) {
    var ingredients = recipe.ingredients.split(', ');
    ingredients.forEach(function(ingredient) {
        var parts = ingredient.split(' ');
        var name = parts.slice(0, -2).join(' ');
        var quantity = parseInt(parts[parts.length - 2]);
        resources[name] = (resources[name] || 0) + direction * quantity;
    });
    updateRemainingResources();
}

function initializeTable() {
    var table = document.getElementById("recipes");
    for (var i = 0; i < recipes.length; i++) {
        var row = table.insertRow();
        row.insertCell(0).innerHTML = recipes[i].race;
        row.insertCell(1).innerHTML = recipes[i].parameter;
        row.insertCell(2).innerHTML = recipes[i].ingredients;
        row.insertCell(3).innerHTML = recipes[i].elixir;
        var craftableCell = row.insertCell(4);
        craftableCell.innerHTML = "0"; 
        craftableCell.className = "large-text";
        var craftCell = row.insertCell(5);
        craftCell.innerHTML = "0";
        craftCell.className = "large-text";
        var buttonsCell = row.insertCell(6);
        buttonsCell.innerHTML = '<button onclick="increaseCraft(' + i + ')">+</button><button onclick="decreaseCraft(' + i + ')">-</button>';
    }
}

window.onload = initializeTable;
