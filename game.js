class Game {
    constructor() {
        this.coins = 10;
        this.equippedItems = new Array(5).fill(null);
        this.activeEvents = [];
        this.conveyorItems = [];
        this.nextItemId = 0;
        
        this.loadGame();
        this.init();
    }

    init() {
        this.updateDisplay();
        this.setupEventListeners();
        
        // Start game loops
        setInterval(() => this.spawnItem(), 3000); // Every 3 seconds
        setInterval(() => this.updateConveyor(), 50); // Smooth movement
        setInterval(() => this.generateCoins(), 1000); // Every second for coins
        setInterval(() => this.checkEvents(), 3000); // Check for events every 3 seconds
        setInterval(() => this.updateEvents(), 1000); // Update event timers
        setInterval(() => this.saveGame(), 5000); // Auto-save every 5 seconds
    }

    setupEventListeners() {
        // Slot middle-click for selling
        document.querySelectorAll('.slot').forEach(slot => {
            slot.addEventListener('mousedown', (e) => {
                if (e.button === 1) { // Middle click
                    e.preventDefault();
                    const slotIndex = parseInt(slot.dataset.slot);
                    this.sellItem(slotIndex);
                }
            });
            
            slot.addEventListener('contextmenu', (e) => e.preventDefault());
        });

        // Prevent middle click scrolling
        document.addEventListener('mousedown', (e) => {
            if (e.button === 1) e.preventDefault();
        });
    }

    spawnItem() {
        if (this.conveyorItems.length >= 10) return; // Limit items on conveyor

        const itemData = this.getRandomItem();
        const mutations = this.generateMutations();
        
        const item = {
            id: this.nextItemId++,
            ...itemData,
            mutations: mutations,
            position: -130, // Start off-screen
            element: this.createItemElement(itemData, mutations)
        };

        this.conveyorItems.push(item);
        document.getElementById('conveyor').appendChild(item.element);
    }

    getRandomItem() {
        const totalWeight = items.reduce((sum, item) => sum + item.chance, 0);
        let random = Math.random() * totalWeight;
        
        for (const item of items) {
            random -= item.chance;
            if (random <= 0) {
                return { ...item };
            }
        }
        return { ...items[0] };
    }

    generateMutations() {
        const itemMutations = [];
        
        for (const mutation of mutations) {
            let canApply = true;
            
            // Check event requirements
            if (mutation.eventRequired) {
                canApply = this.activeEvents.some(event => event.name === mutation.eventRequired);
            }
            
            if (canApply && Math.random() < mutation.chance) {
                itemMutations.push(mutation);
            }
        }
        
        return itemMutations;
    }

    createItemElement(itemData, itemMutations) {
        const element = document.createElement('div');
        element.className = 'item';
        
        const rarity = this.getItemRarity(itemData.chance);
        const totalCps = this.calculateCPS(itemData.cps, itemMutations);
        
        element.innerHTML = `
            <img src="${itemData.image}" alt="${itemData.name}">
            <div class="item-name">${itemData.name}</div>
            <div class="item-rarity" style="color: ${rarity.color}">${rarity.name}</div>
            <div class="item-cps">${totalCps} c/s</div>
            <div class="item-price">$${itemData.price}</div>
            <div class="item-tooltip">
                ${itemMutations.length > 0 ? 
                    itemMutations.map(mut => `<span class="mutation" style="color: ${mut.color}">${mut.name}</span>`).join(' + ') 
                    : 'No mutations'}
            </div>
        `;

        element.addEventListener('click', () => this.buyItem(itemData, itemMutations, element));
        
        return element;
    }

    getItemRarity(chance) {
        for (const rarity of rarities) {
            if (chance >= rarity.minChance && chance <= rarity.maxChance) {
                return rarity;
            }
        }
        return rarities[0]; // Default to first rarity
    }

    calculateCPS(baseCps, itemMutations) {
        let multiplier = 1;
        for (const mutation of itemMutations) {
            multiplier *= mutation.multiplier;
        }
        return Math.round(baseCps * multiplier);
    }

    buyItem(itemData, itemMutations, element) {
        // Check if player has enough coins
        if (this.coins < itemData.price) {
            element.classList.add('insufficient-funds');
            setTimeout(() => element.classList.remove('insufficient-funds'), 1000);
            return;
        }

        // Check if there's an empty slot
        const emptySlot = this.equippedItems.findIndex(item => item === null);
        if (emptySlot === -1) {
            element.classList.add('slots-full');
            setTimeout(() => element.classList.remove('slots-full'), 1000);
            return;
        }

        // Purchase item
        this.coins -= itemData.price;
        const totalCps = this.calculateCPS(itemData.cps, itemMutations);
        
        this.equippedItems[emptySlot] = {
            ...itemData,
            mutations: itemMutations,
            totalCps: totalCps
        };

        // Remove from conveyor
        const itemIndex = this.conveyorItems.findIndex(item => item.element === element);
        if (itemIndex !== -1) {
            this.conveyorItems.splice(itemIndex, 1);
            element.remove();
        }

        this.updateDisplay();
        this.saveGame();
    }

    sellItem(slotIndex) {
        const item = this.equippedItems[slotIndex];
        if (!item) return;

        const sellPrice = Math.floor(item.price * 0.5);
        this.coins += sellPrice;
        this.equippedItems[slotIndex] = null;

        this.updateDisplay();
        this.saveGame();
    }

    updateConveyor() {
        this.conveyorItems.forEach((item, index) => {
            item.position += 3; // Move right
            item.element.style.left = item.position + 'px';

            // Remove items that reach the end
            if (item.position > window.innerWidth) {
                item.element.remove();
                this.conveyorItems.splice(index, 1);
            }
        });
    }

    generateCoins() {
        let totalCps = 0;
        this.equippedItems.forEach(item => {
            if (item) {
                totalCps += item.totalCps;
            }
        });

        this.coins += totalCps;
        this.updateDisplay();
    }

    checkEvents() {
        for (const eventData of events) {
            const isActive = this.activeEvents.some(event => event.name === eventData.name);
            
            if (!isActive && Math.random() < eventData.chance) {
                this.startEvent(eventData);
            }
        }
    }

    startEvent(eventData) {
        const event = {
            ...eventData,
            timeLeft: eventData.duration * 1000 // Convert to milliseconds
        };

        this.activeEvents.push(event);
        
        // Play event sound
        if (event.audio) {
            const audio = new Audio(event.audio);
            audio.volume = 0.5;
            audio.play().catch(() => {}); // Ignore errors if audio fails
        }
        
        this.updateEventsDisplay();
    }

    updateEvents() {
        this.activeEvents = this.activeEvents.filter(event => {
            event.timeLeft -= 1000;
            return event.timeLeft > 0;
        });

        this.updateEventsDisplay();
    }

    updateEventsDisplay() {
        const eventsContainer = document.getElementById('events');
        eventsContainer.innerHTML = '';

        this.activeEvents.forEach(event => {
            const eventElement = document.createElement('div');
            eventElement.className = 'event';
            
            const timeLeftSec = Math.ceil(event.timeLeft / 1000);
            
            eventElement.innerHTML = `
                <img src="${event.image}" style="width: 20px; height: 20px; vertical-align: middle; margin-right: 5px;">
                ${event.name} (${timeLeftSec}s)
                <div class="event-tooltip">
                    <div class="event-name">${event.name}</div>
                    <div class="event-description">${event.description}</div>
                </div>
            `;
            
            // Add mouse event listeners for tooltip positioning
            const tooltip = eventElement.querySelector('.event-tooltip');
            eventElement.addEventListener('mouseenter', (e) => {
                tooltip.style.display = 'block';
            });
            
            eventElement.addEventListener('mousemove', (e) => {
                tooltip.style.left = (e.clientX - 100) + 'px';
                tooltip.style.top = e.clientY + 10 + 'px';
            });
            
            eventElement.addEventListener('mouseleave', () => {
                tooltip.style.display = 'none';
            });
            
            eventsContainer.appendChild(eventElement);
        });
    }

    updateDisplay() {
        document.getElementById('coin-count').textContent = Math.floor(this.coins);

        // Update slots
        document.querySelectorAll('.slot').forEach((slot, index) => {
            const item = this.equippedItems[index];
            
            if (item) {
                slot.className = 'slot occupied';
                slot.innerHTML = `
                    <img src="${item.image}" alt="${item.name}">
                    <div class="slot-item-name">${item.name}</div>
                    <div class="slot-cps">${item.totalCps} c/s</div>
                `;
            } else {
                slot.className = 'slot';
                slot.innerHTML = '';
            }
        });
    }

    saveGame() {
        const gameData = {
            coins: this.coins,
            equippedItems: this.equippedItems
        };
        localStorage.setItem('conveyorGame', JSON.stringify(gameData));
    }

    loadGame() {
        const savedData = localStorage.getItem('conveyorGame');
        if (savedData) {
            const gameData = JSON.parse(savedData);
            this.coins = gameData.coins || 10;
            this.equippedItems = gameData.equippedItems || new Array(5).fill(null);
        }
    }
}

// Start the game when page loads
window.addEventListener('load', () => {
    new Game();
});