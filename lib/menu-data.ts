import { MenuItem } from "@/types/menu";

export const menuItems: MenuItem[] = [
  // ========== SMASH BURGERS ==========
  {
    id: "smash-1",
    name: "THE SMASH KING",
    description: "Two prime Angus patties, caramelized onions, lettuce, cheese, Algerian sauce",
    price: 7.99,
    category: "smash-burgers",
    available: true,
  },
  {
    id: "smash-2",
    name: "STAR'Z ANGUS SMASH",
    description: "Two prime Angus patties, cheese, lettuce, diced onion, Big Up sauce",
    price: 7.49,
    category: "smash-burgers",
    available: true,
  },
  {
    id: "smash-3",
    name: "GRINGO CRUSH",
    description: "Two prime Angus patties, 3 onion rings, BBQ cheese, gherkin, special sauce",
    price: 7.99,
    category: "smash-burgers",
    available: true,
  },
  {
    id: "smash-4",
    name: "SMASH DONER DELIGHT",
    description: "Two premium lamb doner patties, cheese, lettuce, gherkin, crunchy diced onion, Big Up sauce",
    price: 7.99,
    category: "smash-burgers",
    available: true,
  },
  {
    id: "smash-5",
    name: "RED DONER SIZZLE",
    description: "Two premium lamb doner patties, special spices, cheese, lettuce, gherkin, crunchy diced onion, special signature sauce",
    price: 7.99,
    category: "smash-burgers",
    available: true,
  },
  {
    id: "smash-6",
    name: "ONION WRAPPED FLYING DUTCHMAN",
    description: "Two prime Angus patties, cheese, Spanish white onion (no bun)",
    price: 7.99,
    category: "smash-burgers",
    available: true,
  },
  {
    id: "smash-7",
    name: "THE SKYLINE STACK",
    description: "Four juicy prime patties, tortilla chips, cheese, jalapeno, onion, special signature sauce",
    price: 11.49,
    category: "smash-burgers",
    available: true,
  },

  // ========== CHICKEN TENDERS ==========
  {
    id: "tenders-1",
    name: "3 Pcs Buttermilk Chicken Tenders",
    description: "Fried and coated in our special 7 herb seasoning",
    price: 5.49,
    category: "tenders",
    available: true,
    options: [
      {
        name: "Flavour",
        choices: [
          { label: "Classic" },
          { label: "Garlic Butter" },
          { label: "Flaming Butter" },
          { label: "Katsu Kurry" },
          { label: "Korean BBQ" },
          { label: "Peri Portuguese" },
          { label: "Lemon & Herb" },
        ],
      },
    ],
  },

  // ========== LOADED FRIES ==========
  {
    id: "loaded-1",
    name: "Vaca Fritas",
    description: "Minced Angus beef, fries, seasonal salt, special signature sauce, sriracha sauce, jalapenos",
    price: 7.49,
    category: "loaded-fries",
    available: true,
  },
  {
    id: "loaded-2",
    name: "Doner Fritas",
    description: "Minced premium lamb doner, crispy golden fries, cheese, lettuce, seasonal sweet chili, creamy mayo, spring onion, coriander",
    price: 7.49,
    category: "loaded-fries",
    available: true,
  },
  {
    id: "loaded-3",
    name: "Red Doner Fritas",
    description: "Minced premium lamb doner, crispy golden fries, cheese, lettuce, seasonal sweet chili, creamy mayo, spring onion, coriander",
    price: 7.49,
    category: "loaded-fries",
    available: true,
  },
  {
    id: "loaded-4",
    name: "Chica Fritas",
    description: "Grilled chicken, fries, seasonal salt, special signature sauce, sriracha sauce, jalapenos",
    price: 7.49,
    category: "loaded-fries",
    available: true,
  },

  // ========== CHICKEN BURGERS ==========
  {
    id: "chicken-1",
    name: "STAR'Z BUTTERMILK CRISPY",
    description: "Buttermilk chicken, 7 herb seasoning, lettuce, cheese, mayo",
    price: 7.49,
    category: "chicken-burgers",
    available: true,
  },
  {
    id: "chicken-2",
    name: "GARLIC BUTTERMILK CRISPY",
    description: "Buttermilk chicken, 7 herb seasoning, garlic and herbs butter glaze, lettuce, cheese, garlic mayo",
    price: 7.99,
    category: "chicken-burgers",
    available: true,
  },
  {
    id: "chicken-3",
    name: "FLAMING BUTTERMILK CRISPY",
    description: "Buttermilk chicken, 7 herb seasoning, flaming hot spicy butter glaze, lettuce, cheese, sriracha mayo",
    price: 7.49,
    category: "chicken-burgers",
    available: true,
  },
  {
    id: "chicken-4",
    name: "KOREAN BBQ CRISPY",
    description: "Buttermilk chicken, 7 herb seasoning, Hickory Korean BBQ glaze, lettuce, cheese, mayo",
    price: 7.99,
    category: "chicken-burgers",
    available: true,
  },
  {
    id: "chicken-5",
    name: "KATSU KURRY CRISPY",
    description: "Buttermilk chicken, 7 herb seasoning, Authentic Katsu curry glaze, lettuce, cheese, special signature sauce",
    price: 7.99,
    category: "chicken-burgers",
    available: true,
  },
  {
    id: "chicken-6",
    name: "SUPREME BUTTERMILK CRISPY",
    description: "Buttermilk chicken, 7 herb seasoning, lettuce, cheese, mayo, crispy potato hash brown",
    price: 8.49,
    category: "chicken-burgers",
    available: true,
  },
  {
    id: "chicken-7",
    name: "PERI PERIDISE",
    description: "Marinated chicken, peri peri sauce, flame grilled, lettuce, diced onion, cheese, STAR'Z special sauce",
    price: 8.49,
    category: "chicken-burgers",
    available: true,
  },
  {
    id: "chicken-8",
    name: "STAR'Z VEGGIE DELIGHT",
    description: "Premium veggie burger, crispy perfection, cheese, lettuce, crunchy diced onion, gherkin, creamy mayo",
    price: 6.99,
    category: "chicken-burgers",
    available: true,
  },

  // ========== SHAKES ==========
  {
    id: "shake-1",
    name: "Milkshake",
    description: "Creamy milkshake",
    price: 4.99,
    category: "shakes",
    available: true,
    options: [
      {
        name: "Flavour",
        choices: [
          { label: "Ferrero Rocher" },
          { label: "Kinder Bueno" },
          { label: "Oreo" },
          { label: "Aero Mint" },
          { label: "Crunchie" },
          { label: "Peanut Butter" },
          { label: "Maltesers" },
          { label: "Snickers" },
          { label: "Lotus Biscoff" },
          { label: "Strawberry" },
          { label: "Vanilla" },
          { label: "Banana" },
          { label: "Chocolate" },
        ],
      },
    ],
  },

  // ========== SIDES ==========
  {
    id: "side-1",
    name: "Peri Fries",
    price: 2.99,
    category: "sides",
    available: true,
  },
  {
    id: "side-2",
    name: "Fries",
    price: 2.49,
    category: "sides",
    available: true,
  },
  {
    id: "side-3",
    name: "Potato Wedges",
    price: 3.99,
    category: "sides",
    available: true,
  },
  {
    id: "side-4",
    name: "Nuggets",
    price: 3.99,
    category: "sides",
    available: true,
  },
  {
    id: "side-5",
    name: "Onion Rings",
    price: 3.99,
    category: "sides",
    available: true,
  },
  {
    id: "side-6",
    name: "Mozzarella Stick",
    price: 3.99,
    category: "sides",
    available: true,
  },
  {
    id: "side-7",
    name: "Cheese Fries",
    price: 4.49,
    category: "sides",
    available: true,
  },
  {
    id: "side-8",
    name: "Hash Brown",
    price: 3.99,
    category: "sides",
    available: true,
  },
  {
    id: "side-9",
    name: "Jalapeno Bites",
    price: 3.99,
    category: "sides",
    available: true,
  },

  // ========== DIPS ==========
  {
    id: "dip-1",
    name: "Mayo",
    price: 0.50,
    category: "dips",
    available: true,
  },
  {
    id: "dip-2",
    name: "Ketchup",
    price: 0.50,
    category: "dips",
    available: true,
  },
  {
    id: "dip-3",
    name: "Korean BBQ",
    price: 0.50,
    category: "dips",
    available: true,
  },
  {
    id: "dip-4",
    name: "Big Up",
    price: 0.50,
    category: "dips",
    available: true,
  },
  {
    id: "dip-5",
    name: "Algerian",
    price: 0.50,
    category: "dips",
    available: true,
  },
  {
    id: "dip-6",
    name: "Mr'2 Dynamite",
    price: 0.50,
    category: "dips",
    available: true,
  },
  {
    id: "dip-7",
    name: "Mr'2 Garlic Mayoli",
    price: 0.50,
    category: "dips",
    available: true,
  },
  {
    id: "dip-8",
    name: "Mr'2 Sweet Chilli",
    price: 0.50,
    category: "dips",
    available: true,
  },
  {
    id: "dip-9",
    name: "Mr'2 Special Signature",
    price: 0.50,
    category: "dips",
    available: true,
  },

  // ========== DIPPING POTS ==========
  {
    id: "dipping-1",
    name: "Garlic Butter",
    price: 1.00,
    category: "dips",
    available: true,
  },
  {
    id: "dipping-2",
    name: "Flaming Butter",
    price: 1.00,
    category: "dips",
    available: true,
  },
  {
    id: "dipping-3",
    name: "Katsu Kurry",
    price: 1.00,
    category: "dips",
    available: true,
  },
  {
    id: "dipping-4",
    name: "Korean BBQ",
    price: 1.00,
    category: "dips",
    available: true,
  },

  // ========== SPECIAL BOXES ==========
  {
    id: "box-1",
    name: "MR'2 SPECIAL Box",
    description: "Any Burger (Excluding The Skyline Stack), Loaded Fries, Tenders (Any Flavour), Any soft drink (or upgrade to shake only +£3 extra)",
    price: 18.99,
    category: "special-boxes",
    available: true,
    options: [
      {
        name: "Upgrade to Shake",
        choices: [
          { label: "No upgrade", price: 0 },
          { label: "Upgrade to shake", price: 3.00 },
        ],
      },
    ],
  },
  {
    id: "box-2",
    name: "BOX F-2",
    description: "Any 2 Burgers, Loaded Fries, Tenders, Any 2 Soft Drinks",
    price: 29.99,
    category: "special-boxes",
    available: true,
  },

  // ========== PIZZAS ==========
  {
    id: "pizza-1",
    name: "Margherita Pizza",
    description: "Tomato Base With Mozzarella Cheese",
    price: 6.90,
    category: "pizzas",
    available: true,
    options: [
      {
        name: "Size",
        choices: [
          { label: "9 inch", price: 0 },
          { label: "12 inch", price: 2.30 },
          { label: "15 inch", price: 4.60 },
        ],
      },
    ],
  },
  {
    id: "pizza-2",
    name: "Garlic Pizza",
    description: "Garlic Butter With Mozzarella Cheese",
    price: 6.90,
    category: "pizzas",
    available: true,
    options: [
      {
        name: "Size",
        choices: [
          { label: "9 inch", price: 0 },
          { label: "12 inch", price: 2.30 },
          { label: "15 inch", price: 4.60 },
        ],
      },
    ],
  },
  {
    id: "pizza-3",
    name: "Hawaiian Pizza",
    description: "Tomato Base, Mozzarella Cheese, Turkey Ham And Pineapple",
    price: 8.20,
    category: "pizzas",
    available: true,
    options: [
      {
        name: "Size",
        choices: [
          { label: "9 inch", price: 0 },
          { label: "12 inch", price: 2.30 },
          { label: "15 inch", price: 4.60 },
        ],
      },
    ],
  },
  {
    id: "pizza-4",
    name: "Farm House",
    description: "Tomato Base Mozzarella, Cheese, Mushroom And Turkey Ham",
    price: 8.20,
    category: "pizzas",
    available: true,
    options: [
      {
        name: "Size",
        choices: [
          { label: "9 inch", price: 0 },
          { label: "12 inch", price: 2.30 },
          { label: "15 inch", price: 4.60 },
        ],
      },
    ],
  },
  {
    id: "pizza-5",
    name: "Vegetarian Pizza",
    description: "Tomato Base, Mozzarella Cheese, Mushroom, Onion, Mix Pepper, And Sweet Corn",
    price: 8.20,
    category: "pizzas",
    available: true,
    options: [
      {
        name: "Size",
        choices: [
          { label: "9 inch", price: 0 },
          { label: "12 inch", price: 2.30 },
          { label: "15 inch", price: 4.60 },
        ],
      },
    ],
  },
  {
    id: "pizza-6",
    name: "Vegetarian Hot",
    description: "Tomato Base, Mozzarella Cheese, Onion, Mix Pepper, Green Chilli And Jalapenos",
    price: 8.20,
    category: "pizzas",
    available: true,
    options: [
      {
        name: "Size",
        choices: [
          { label: "9 inch", price: 0 },
          { label: "12 inch", price: 2.30 },
          { label: "15 inch", price: 4.60 },
        ],
      },
    ],
  },
  {
    id: "pizza-7",
    name: "Tandoori Chicken",
    description: "Tomato Base, Mozzarella Cheese, Tandoori Chicken, Onion, Mix Pepper And Sweet Corn",
    price: 9.20,
    category: "pizzas",
    available: true,
    options: [
      {
        name: "Size",
        choices: [
          { label: "9 inch", price: 0 },
          { label: "12 inch", price: 2.30 },
          { label: "15 inch", price: 4.60 },
        ],
      },
    ],
  },
  {
    id: "pizza-8",
    name: "Tandoori Hot",
    description: "Tomato Base, Mozzarella Cheese, Tandoori Chicken, Onion, Green Chilli, Jalapeno",
    price: 9.20,
    category: "pizzas",
    available: true,
    options: [
      {
        name: "Size",
        choices: [
          { label: "9 inch", price: 0 },
          { label: "12 inch", price: 2.30 },
          { label: "15 inch", price: 4.60 },
        ],
      },
    ],
  },
  {
    id: "pizza-9",
    name: "Special Kebab Pizza",
    description: "Tomato Base, Mozzarella Cheese, Lamb Donner, Tandoori Chicken, Onion And Mix Peppers",
    price: 10.20,
    category: "pizzas",
    available: true,
    options: [
      {
        name: "Size",
        choices: [
          { label: "9 inch", price: 0 },
          { label: "12 inch", price: 2.30 },
          { label: "15 inch", price: 4.60 },
        ],
      },
    ],
  },
  {
    id: "pizza-10",
    name: "Meat Feast",
    description: "Lamb Doner, Chicken Minced & Spicy Beef",
    price: 11.00,
    category: "pizzas",
    available: true,
    options: [
      {
        name: "Size",
        choices: [
          { label: "9 inch", price: 0 },
          { label: "12 inch", price: 2.50 },
          { label: "15 inch", price: 5.50 },
        ],
      },
    ],
  },
  {
    id: "pizza-11",
    name: "Romanian Pizza",
    description: "Tomato Base, Mozzarella Cheese, Pepperoni, Mushroom, Sweet Corn And Black Olives",
    price: 9.20,
    category: "pizzas",
    available: true,
    options: [
      {
        name: "Size",
        choices: [
          { label: "9 inch", price: 0 },
          { label: "12 inch", price: 2.30 },
          { label: "15 inch", price: 4.60 },
        ],
      },
    ],
  },
  {
    id: "pizza-12",
    name: "Mexican Pizza",
    description: "Tomato Base, Mozzarella Cheese, Spicy Beef, Red Onion, Green Chilli And Mix Pepper",
    price: 9.20,
    category: "pizzas",
    available: true,
    options: [
      {
        name: "Size",
        choices: [
          { label: "9 inch", price: 0 },
          { label: "12 inch", price: 2.30 },
          { label: "15 inch", price: 4.60 },
        ],
      },
    ],
  },
  {
    id: "pizza-13",
    name: "BBQ Chicken Pizza",
    description: "BBQ Base Mozzarella Cheese, Chicken Minced, Onion Sweet Corn & Mix Pepper",
    price: 9.20,
    category: "pizzas",
    available: true,
    options: [
      {
        name: "Size",
        choices: [
          { label: "9 inch", price: 0 },
          { label: "12 inch", price: 2.30 },
          { label: "15 inch", price: 4.60 },
        ],
      },
    ],
  },
  {
    id: "pizza-14",
    name: "Tuna Pizza",
    description: "Tomato Base, Mozzarella Cheese, Tuna & Sweetcorn",
    price: 8.20,
    category: "pizzas",
    available: true,
    options: [
      {
        name: "Size",
        choices: [
          { label: "9 inch", price: 0 },
          { label: "12 inch", price: 2.30 },
          { label: "15 inch", price: 4.60 },
        ],
      },
    ],
  },
  {
    id: "pizza-15",
    name: "Sea Food Pizza",
    description: "Tomato Base, Mozzarella Cheese, Tuna & Prawn",
    price: 9.20,
    category: "pizzas",
    available: true,
    options: [
      {
        name: "Size",
        choices: [
          { label: "9 inch", price: 0 },
          { label: "12 inch", price: 2.30 },
          { label: "15 inch", price: 4.60 },
        ],
      },
    ],
  },
  {
    id: "pizza-16",
    name: "STAR'Z Special Pizza",
    description: "Tomato Base, Mozzarella Cheese, Chicken Mince, Spicy Beef, Onion, Mix Pepper And Black Olives",
    price: 10.20,
    category: "pizzas",
    available: true,
    options: [
      {
        name: "Size",
        choices: [
          { label: "9 inch", price: 0 },
          { label: "12 inch", price: 2.30 },
          { label: "15 inch", price: 4.60 },
        ],
      },
    ],
  },
  {
    id: "pizza-17",
    name: "Create Your Own Pizza",
    description: "Any Four Toppings Of Your Own",
    price: 11.00,
    category: "pizzas",
    available: true,
    options: [
      {
        name: "Size",
        choices: [
          { label: "9 inch", price: 0 },
          { label: "12 inch", price: 2.50 },
          { label: "15 inch", price: 5.50 },
        ],
      },
      {
        name: "Extra Toppings",
        choices: [
          { label: "Chicken Mince", price: 1.50 },
          { label: "Turkey Ham", price: 1.50 },
          { label: "Pineapple", price: 1.50 },
          { label: "Pepperoni", price: 1.50 },
          { label: "Jalapeno", price: 1.50 },
          { label: "Tandoori Chicken", price: 1.50 },
          { label: "Mushroom", price: 1.50 },
          { label: "Tuna", price: 1.50 },
          { label: "Red Onion", price: 1.50 },
          { label: "Green Chilli", price: 1.50 },
          { label: "Donner Meat", price: 1.50 },
          { label: "Sweet Corn", price: 1.50 },
          { label: "Olive", price: 1.50 },
          { label: "Spicy Beef", price: 1.50 },
          { label: "Mix Pepper", price: 1.50 },
        ],
      },
    ],
  },
  {
    id: "pizza-18",
    name: "Garlic Bread",
    price: 4.99,
    category: "pizzas",
    available: true,
  },

  // ========== KIDS MENU ==========
  {
    id: "kids-1",
    name: "Mini Munchies",
    description: "Single Angus or doner smash patty served in a brioche bun with mayo, lettuce, and cheese. Includes fries and a fruit shoot",
    price: 6.99,
    category: "sides",
    available: true,
  },
  {
    id: "kids-2",
    name: "Dino Bite Nuggets",
    description: "5pc nuggets and fries. Includes a fruit shoot",
    price: 6.99,
    category: "sides",
    available: true,
  },
  {
    id: "kids-3",
    name: "Happy Bite Box",
    description: "2pc chicken strips and fries. Includes a fruit shoot",
    price: 6.99,
    category: "sides",
    available: true,
  },

  // ========== BROWNIES ==========
  {
    id: "brownie-1",
    name: "Brownie",
    price: 4.99,
    category: "desserts",
    available: true,
    options: [
      {
        name: "Flavour",
        choices: [
          { label: "Pistachio & Nuts" },
          { label: "White Drizzle" },
          { label: "Plain Jane" },
          { label: "Lotus Lovers" },
          { label: "Nutella Drizzle" },
          { label: "Ferrero Nut" },
          { label: "Oreo Lovers" },
        ],
      },
    ],
  },

  // ========== CHEESE CAKE ==========
  {
    id: "cheesecake-1",
    name: "Cheese Cake",
    price: 4.99,
    category: "desserts",
    available: true,
    options: [
      {
        name: "Flavour",
        choices: [
          { label: "Lotus Cheese Cake" },
          { label: "Oreo Cheese Cake" },
          { label: "Choc Fudge Cake" },
        ],
      },
    ],
  },

  // ========== SOFT DRINKS ==========
  {
    id: "drink-1",
    name: "Soft Drink Can",
    price: 1.29,
    category: "drinks",
    available: true,
    options: [
      {
        name: "Flavour",
        choices: [
          { label: "Cola" },
          { label: "Diet Cola" },
          { label: "Citrus" },
          { label: "Irn-Bru" },
          { label: "Rubicon Mango / Passion" },
          { label: "Rubicon Lychee / Guava" },
          { label: "Vimto" },
          { label: "Rio" },
        ],
      },
    ],
  },
  {
    id: "drink-2",
    name: "Fruit Shoot",
    price: 1.29,
    category: "drinks",
    available: true,
    options: [
      {
        name: "Flavour",
        choices: [
          { label: "Blackcurrant" },
          { label: "Orange" },
        ],
      },
    ],
  },
  {
    id: "drink-3",
    name: "Water",
    price: 1.29,
    category: "drinks",
    available: true,
  },
];

export const getMenuItemsByCategory = (category: string): MenuItem[] => {
  return menuItems.filter((item) => item.category === category);
};

export const getMenuItemById = (id: string): MenuItem | undefined => {
  return menuItems.find((item) => item.id === id);
};

export const categories = [
  { id: "special-boxes", name: "Special Boxes" },
  { id: "smash-burgers", name: "Smash Burgers" },
  { id: "chicken-burgers", name: "Chicken Burgers" },
  { id: "tenders", name: "Chicken Tenders" },
  { id: "loaded-fries", name: "Loaded Fries" },
  { id: "sides", name: "Sides" },
  { id: "dips", name: "Dips" },
  { id: "desserts", name: "Desserts" },
  { id: "shakes", name: "Shakes" },
  { id: "drinks", name: "Drinks" },
  { id: "pizzas", name: "Pizzas" },
];
