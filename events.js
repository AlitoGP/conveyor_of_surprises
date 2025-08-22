const events = [
    {
        name: "Rain",
        description: "10% Wet chance",
        image: "https://cdn-icons-png.flaticon.com/512/1146/1146860.png",
        audio: "sfx/rain.ogg",
        chance: 0.03, // 3% chance every 3 seconds
        spawnInterval: 3,
        duration: 180 // 3 minutes in seconds
    },
    {
        name: "Hailstorm",
        description: "10% Icy chance",
        image: "",
        audio: "sfx/hs.ogg",
        chance: 0.03, // 3% chance every 3 seconds
        spawnInterval: 3,
        duration: 180 // 3 minutes in seconds
    },
    {
        name: "Heatwave",
        description: "10% Overheated chance",
        image: "https://cdn-icons-png.flaticon.com/512/6468/6468088.png",
        audio: "sfx/hw.ogg",
        chance: 0.02, // 
        spawnInterval: 5,
        duration: 120
    },
    {
        name: "Tornado",
        description: "15% Twisted chance",
        image: "",
        audio: "sfx/tornado.ogg",
        chance: 0.06, 
        spawnInterval: 10,
        duration: 30 
    },
    {
        name: "Blood Moon",
        description: "12% Horror chance",
        image: "",
        audio: "sfx/bm.ogg",
        chance: 0.08, 
        spawnInterval: 30,
        duration: 120
    },
    {
        name: "Masterchef",
        description: "10% Sauteed and Burnt chance",
        image: "",
        audio: "sfx/masterchef.ogg",
        chance: 0.01, 
        spawnInterval: 7,
        duration: 300
    }

];

