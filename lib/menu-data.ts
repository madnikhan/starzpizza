import { MenuItem } from "@/types/menu";

export const menuItems: MenuItem[] = [
  // SMASH BURGERS
  {
    id: "smash-king",
    name: "THE SMASH KING",
    description: "Two Juicy Prime Angus Patties Smashed Onto A Bed Of Thin Onions Which Embed Into The Beef And Caramelize Into Fresh Lettuce, Cheese And Algerian Sauce.",
    price: 7.99,
    category: "smash-burgers",
  },
  {
    id: "starz-angus-smash",
    name: "STAR'Z ANGUS SMASH",
    description: "Two Juicy Prime Angus Patties Smashed And Topped With Cheese, Fresh Lettuce, Diced Onion, And Big Up Sauce.",
    price: 7.49,
    category: "smash-burgers",
  },
  {
    id: "gringo-crush",
    name: "GRINGO CRUSH",
    description: "Two Juicy Prime Angus Patties Smashed And Topped With 3 Onion Rings With BBQ Cheese, Gherkin And Our Special Sauce.",
    price: 7.99,
    category: "smash-burgers",
  },
  {
    id: "smash-doner-delight",
    name: "SMASH DONER DELIGHT",
    description: "Two Premium Lamb Doner Patties Smashed And Topped With Cheese, Fresh Lettuce, Gherkin, Crunchy Diced Onion And Big Up Sauce.",
    price: 7.99,
    category: "smash-burgers",
  },
  {
    id: "red-doner-sizzle",
    name: "RED DONER SIZZLE",
    description: "Two Premium Lamb Doner Patties Mixed In Special Spices, Smashed and Topped With Cheese, Fresh Lettuce, Gherkin, Crunchy Diced Onion and Our Special Signature Sauce.",
    price: 7.99,
    category: "smash-burgers",
  },
  {
    id: "onion-wrapped-flying-dutchman",
    name: "ONION WRAPPED FLYING DUTCHMAN",
    description: "Bin That Bun! With Two Juicy Prime Angus Patties Topped With Cheese and Sandwiched Below Spanish White Onion, Seasoned And Caramelized To Perfection With Big Up Sauce.",
    price: 7.99,
    category: "smash-burgers",
  },
  {
    id: "skyline-stack",
    name: "THE SKYLINE STACK",
    description: "Four Juicy Prime Patties With Tortilla Chips, Cheese, Jalapeno, Onion, And Our Special Signature Sauce.",
    price: 11.49,
    category: "smash-burgers",
  },
  
  // CHICKEN BURGERS
  {
    id: "starz-buttermilk-crispy",
    name: "STAR'Z BUTTERMILK CRISPY",
    description: "Buttermilk chicken coated in our special 7 Herb seasoning fried to crispy perfection. Fresh lettuce, cheese and mayo.",
    price: 7.49,
    category: "chicken-burgers",
  },
  {
    id: "garlic-buttermilk-crispy",
    name: "GARLIC BUTTERMILK CRISPY",
    description: "Buttermilk chicken coated in our special 7 herb seasoning fried to crispy perfection. Dipped in our rich garlic and herbs butter glaze. Fresh lettuce, cheese and garlic mayo.",
    price: 7.99,
    category: "chicken-burgers",
  },
  {
    id: "flaming-buttermilk-crispy",
    name: "FLAMING BUTTERMILK CRISPY",
    description: "Buttermilk chicken coated in our special 7 herb seasoning fried to perfection and dipped in our flaming hot spicy butter glaze, fresh lettuce, cheese and sriracha mayo.",
    price: 7.49,
    category: "chicken-burgers",
  },
  {
    id: "korean-bbq-crispy",
    name: "KOREAN BBQ CRISPY",
    description: "Buttermilk chicken coated in our special 7 herb seasoning fried to perfection Dipped in Hickory Korean BBQ glaze. Fresh lettuce, cheese and mayo.",
    price: 7.99,
    category: "chicken-burgers",
  },
  {
    id: "katsu-kurry-crispy",
    name: "KATSU KURRY CRISPY",
    description: "Buttermilk chicken coated in our special 7 herb seasoning fried to perfection Dipped in Authentic Katsu curry glaze. Fresh lettuce, cheese and our special signature sauce.",
    price: 7.99,
    category: "chicken-burgers",
  },
  {
    id: "supreme-buttermilk-crispy",
    name: "SUPREME BUTTERMILK CRISPY",
    description: "Buttermilk chicken coated in our special 7 herb seasoning fried to perfection Fresh lettuce, cheese and mayo. Topped with a crispy potato hash brown.",
    price: 8.49,
    category: "chicken-burgers",
  },
  {
    id: "peri-peridise",
    name: "PERI PERIDISE",
    description: "Marinated for 24 hours in our house peri peri sauce and flame grilled to perfection. Lettuce, diced onion, cheese and STAR'Z special sauce.",
    price: 8.49,
    category: "chicken-burgers",
  },
  {
    id: "starz-veggie-delight",
    name: "STAR'Z VEGGIE DELIGHT",
    description: "Premium Veggie Burger Fried To Crispy Perfection Topped With Cheese and Fresh Lettuce, Crunchy Diced Onion, Gherkin And Creamy Mayo.",
    price: 6.99,
    category: "chicken-burgers",
  },

  // BUTTERMILK CHICKEN TENDERS
  {
    id: "buttermilk-chicken-tenders",
    name: "Buttermilk Chicken Tenders",
    description: "3 Pcs Buttermilk Chicken Tenders, Fried And Coated In Our Special 7 Herb Seasoning.",
    price: 5.49,
    category: "tenders",
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

  // LOADED FRIES
  {
    id: "vaca-fritas",
    name: "Vaca Fritas",
    description: "Minced Angus beef with freshly made fries, topped with seasonal salt and drizzled with our special signature sauce, sriracha sauce, and jalapenos.",
    price: 7.49,
    category: "loaded-fries",
  },
  {
    id: "doner-fritas",
    name: "Doner Fritas",
    description: "Minced premium lamb doner loaded onto a bed of crispy golden fries, topped with cheese, lettuce, seasonal sweet chili, and creamy mayo. Garnished with spring onion and coriander.",
    price: 7.49,
    category: "loaded-fries",
  },
  {
    id: "red-doner-fritas",
    name: "Red Doner Fritas",
    description: "Minced premium lamb doner loaded onto a bed of crispy golden fries, topped with cheese, lettuce, seasonal sweet chili, and creamy mayo. Garnished with spring onion and coriander.",
    price: 7.49,
    category: "loaded-fries",
  },
  {
    id: "chica-fritas",
    name: "Chica Fritas",
    description: "Grilled chicken with freshly made fries, topped with seasonal salt and drizzled with our special signature sauce, sriracha sauce, and jalapenos.",
    price: 7.49,
    category: "loaded-fries",
  },

  // SHAKES
  {
    id: "shake",
    name: "Milkshake",
    description: "Creamy, delicious milkshake",
    price: 4.99,
    category: "shakes",
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

  // SIDES
  {
    id: "peri-fries",
    name: "Peri Fries",
    price: 2.99,
    description: "Crispy fries with peri peri seasoning",
    category: "sides",
  },
  {
    id: "fries",
    name: "Fries",
    price: 2.49,
    description: "Classic golden fries",
    category: "sides",
  },
  {
    id: "potato-wedges",
    name: "Potato Wedges",
    price: 3.99,
    description: "Crispy potato wedges",
    category: "sides",
  },
  {
    id: "nuggets",
    name: "Nuggets",
    price: 3.99,
    description: "5pc chicken nuggets",
    category: "sides",
  },
  {
    id: "onion-rings",
    name: "Onion Rings",
    price: 3.99,
    description: "Crispy onion rings",
    category: "sides",
  },
  {
    id: "mozzarella-stick",
    name: "Mozzarella Stick",
    price: 3.99,
    description: "Fried mozzarella sticks",
    category: "sides",
  },
  {
    id: "cheese-fries",
    name: "Cheese Fries",
    price: 4.49,
    description: "Fries topped with melted cheese",
    category: "sides",
  },
  {
    id: "hash-brown",
    name: "Hash Brown",
    price: 3.99,
    description: "Crispy hash brown",
    category: "sides",
  },
  {
    id: "jalapeno-bites",
    name: "Jalapeno Bites",
    price: 3.99,
    description: "Fried jalapeno bites",
    category: "sides",
  },

  // DIPS
  {
    id: "dip",
    name: "Dip",
    price: 0.50,
    description: "50p each",
    category: "dips",
    options: [
      {
        name: "Flavour",
        choices: [
          { label: "Mayo" },
          { label: "Ketchup" },
          { label: "Korean BBQ" },
          { label: "Big up" },
          { label: "Algerian" },
          { label: "Mr'2 Dynamite" },
          { label: "Mr'2 Garlic Mayoli" },
          { label: "Mr'2 Sweet Chilli" },
          { label: "Mr'2 Special Signature" },
        ],
      },
    ],
  },

  // PIZZAS (9", 12", 15")
  {
    id: "margherita-9",
    name: "Margherita Pizza (9\")",
    description: "Tomato Base With Mozzarella Cheese",
    price: 6.90,
    category: "pizzas",
  },
  {
    id: "margherita-12",
    name: "Margherita Pizza (12\")",
    description: "Tomato Base With Mozzarella Cheese",
    price: 9.20,
    category: "pizzas",
  },
  {
    id: "margherita-15",
    name: "Margherita Pizza (15\")",
    description: "Tomato Base With Mozzarella Cheese",
    price: 11.50,
    category: "pizzas",
  },
  {
    id: "hawaiian-9",
    name: "Hawaiian Pizza (9\")",
    description: "Tomato Base, Mozzarella Cheese, Turkey Ham And Pineapple",
    price: 8.50,
    category: "pizzas",
  },
  {
    id: "hawaiian-12",
    name: "Hawaiian Pizza (12\")",
    description: "Tomato Base, Mozzarella Cheese, Turkey Ham And Pineapple",
    price: 11.50,
    category: "pizzas",
  },
  {
    id: "hawaiian-15",
    name: "Hawaiian Pizza (15\")",
    description: "Tomato Base, Mozzarella Cheese, Turkey Ham And Pineapple",
    price: 14.50,
    category: "pizzas",
  },
  {
    id: "tandoori-chicken-9",
    name: "Tandoori Chicken Pizza (9\")",
    description: "Tomato Base, Mozzarella Cheese, Tandoori Chicken, Onion, Mix Pepper And Sweet Corn",
    price: 11.00,
    category: "pizzas",
  },
  {
    id: "tandoori-chicken-12",
    name: "Tandoori Chicken Pizza (12\")",
    description: "Tomato Base, Mozzarella Cheese, Tandoori Chicken, Onion, Mix Pepper And Sweet Corn",
    price: 13.50,
    category: "pizzas",
  },
  {
    id: "tandoori-chicken-15",
    name: "Tandoori Chicken Pizza (15\")",
    description: "Tomato Base, Mozzarella Cheese, Tandoori Chicken, Onion, Mix Pepper And Sweet Corn",
    price: 16.50,
    category: "pizzas",
  },
  {
    id: "starz-special-9",
    name: "STAR'Z Special Pizza (9\")",
    description: "Tomato Base, Mozzarella Cheese, Chicken Mince, Spicy Beef, Onion, Mix Pepper And Black Olives",
    price: 12.00,
    category: "pizzas",
  },
  {
    id: "starz-special-12",
    name: "STAR'Z Special Pizza (12\")",
    description: "Tomato Base, Mozzarella Cheese, Chicken Mince, Spicy Beef, Onion, Mix Pepper And Black Olives",
    price: 15.00,
    category: "pizzas",
  },
  {
    id: "starz-special-15",
    name: "STAR'Z Special Pizza (15\")",
    description: "Tomato Base, Mozzarella Cheese, Chicken Mince, Spicy Beef, Onion, Mix Pepper And Black Olives",
    price: 18.00,
    category: "pizzas",
  },

  // DESSERTS - BROWNIES
  {
    id: "brownie-pistachio",
    name: "Pistachio & Nuts Brownie",
    price: 4.99,
    description: "Rich chocolate brownie with pistachio and nuts",
    category: "desserts",
  },
  {
    id: "brownie-white-drizzle",
    name: "White Drizzle Brownie",
    price: 4.99,
    description: "Chocolate brownie with white chocolate drizzle",
    category: "desserts",
  },
  {
    id: "brownie-plain",
    name: "Plain Jane Brownie",
    price: 4.99,
    description: "Classic chocolate brownie",
    category: "desserts",
  },
  {
    id: "brownie-lotus",
    name: "Lotus Lovers Brownie",
    price: 4.99,
    description: "Chocolate brownie with Lotus Biscoff",
    category: "desserts",
  },
  {
    id: "brownie-nutella",
    name: "Nutella Drizzle Brownie",
    price: 4.99,
    description: "Chocolate brownie with Nutella drizzle",
    category: "desserts",
  },
  {
    id: "brownie-ferrero",
    name: "Ferrero Nut Brownie",
    price: 4.99,
    description: "Chocolate brownie with Ferrero Rocher",
    category: "desserts",
  },
  {
    id: "brownie-oreo",
    name: "Oreo Lovers Brownie",
    price: 4.99,
    description: "Chocolate brownie with Oreo cookies",
    category: "desserts",
  },

  // DESSERTS - CHEESECAKES
  {
    id: "cheesecake-lotus",
    name: "Lotus Cheese Cake",
    price: 4.99,
    description: "Creamy cheesecake with Lotus Biscoff",
    category: "desserts",
  },
  {
    id: "cheesecake-oreo",
    name: "Oreo Cheese Cake",
    price: 4.99,
    description: "Creamy cheesecake with Oreo",
    category: "desserts",
  },
  {
    id: "cheesecake-choc-fudge",
    name: "Choc Fudge Cake",
    price: 4.99,
    description: "Rich chocolate fudge cheesecake",
    category: "desserts",
  },

  // SPECIAL BOXES
  {
    id: "mr2-special-box",
    name: "MR'2 SPECIAL Box",
    description: "Any Burger (Excluding The Skyline Stack), Loaded Fries, Tenders (Any Flavour), Any soft drink (or upgrade to shake only +£3 extra)",
    price: 18.99,
    category: "special-boxes",
  },
  {
    id: "box-f2",
    name: "BOX F-2",
    description: "Any 2 Burgers, Loaded Fries, Tenders, Any 2 Soft Drinks",
    price: 29.99,
    category: "special-boxes",
  },
];

export const getMenuItemsByCategory = (category: string): MenuItem[] => {
  return menuItems.filter((item) => item.category === category);
};

export const getMenuItemById = (id: string): MenuItem | undefined => {
  return menuItems.find((item) => item.id === id);
};

export const categories = [
  { id: "smash-burgers", name: "Smash Burgers" },
  { id: "chicken-burgers", name: "Chicken Burgers" },
  { id: "pizzas", name: "Pizzas" },
  { id: "loaded-fries", name: "Loaded Fries" },
  { id: "shakes", name: "Shakes" },
  { id: "sides", name: "Sides" },
  { id: "dips", name: "Dips" },
  { id: "tenders", name: "Chicken Tenders" },
  { id: "desserts", name: "Desserts" },
  { id: "special-boxes", name: "Special Boxes" },
];

