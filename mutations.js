const mutations = [
    {
        name: "Wet",
        color: "#4169e1", // Royal blue
        chance: 0.1, // 10% chance
        multiplier: 1.5, // 50% bonus to CPS
        priceMultiplier: 1.25, // 25% increase to price
        eventRequired: "Rain" // Only appears during Rain events
    },
    {
        name: "Soaked",
        color: "#4169e1", 
        chance: 0.1, 
        multiplier: 1.6, 
        priceMultiplier: 1.45, 
        eventRequired: "Tsunami"
    },
    {
        name: "Overheated",
        color: "#ff3f34",
        chance: 0.1, 
        multiplier: 1.75,
        priceMultiplier: 1.5,
        eventRequired: "Heatwave" 
    },
    {
        name: "Wild",
        color: "#d1bd92",
        chance: 0.075, 
        multiplier: 1.25,
        priceMultiplier: 1,

    },
    {
        name: "Gold",
        color: "#ffd700",
        chance: 0.01, 
        multiplier: 2,
        priceMultiplier: 1.5,

    },
    {
        name: "Diamond",
        color: "#b9f2ff",
        chance: 0.00375, 
        multiplier: 3,
        priceMultiplier: 2,
    },
    {
        name: "Ruby",
        color: "#9b1113",
        chance: 0.0018, 
        multiplier: 5,
        priceMultiplier: 3,
    },
    {
        name: "Twisted",
        color: "#d0deec",
        chance: 0.15, 
        multiplier: 2.5,
        priceMultiplier: 1.25,
        eventRequired: "Tornado"
    },
    {
        name: "Burnt",
        color: "#592b1f",
        chance: 0.1, 
        multiplier: 0.95,
        priceMultiplier: 0.8,
        eventRequired: "Masterchef"
    },
    {
        name: "Sauteed",
        color: "#a69085",
        chance: 0.1, 
        multiplier: 1.4,
        priceMultiplier: 1.2,
        eventRequired: "Masterchef"
    },
    {
        name: "Horror",
        color: "#990000",
        chance: 0.08, 
        multiplier: 3.5,
        priceMultiplier: 2.5,
        eventRequired: "Blood Moon"
    },
    {
        name: "Icy",
        color: "#b9e8ea",
        chance: 0.1, 
        multiplier: 1.5,
        priceMultiplier: 1.2,
        eventRequired: "Hailstorm"
    },
    {
        name: "Radioactive",
        color: "#b0bf1a",
        chance: 0.2, 
        multiplier: 1.7,
        priceMultiplier: 1.35,
        eventRequired: "Fallout"
    }

    

];




