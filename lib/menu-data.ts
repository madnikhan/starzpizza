import { MenuItem } from "@/types/menu";

export const menuItems: MenuItem[] = [
  // ========== KEBABS ==========
  {
    id: "kebab-1",
    name: "Doner Kebab",
    description: "Mixed lamb with herb, served on a bed of fresh salad in pitta bread",
    price: 8.0,
    category: "kebabs",
    available: true,
    options: [
      {
        name: "Size",
        choices: [
          { label: "Small", price: 0 },
          { label: "Large", price: 2.0 },
        ],
      },
    ],
  },
  {
    id: "kebab-2",
    name: "Shish Kebab",
    description: "Skewer of shish kebab, served on a bed of salad in pitta bread",
    price: 10.0,
    category: "kebabs",
    available: true,
    options: [
      {
        name: "Size",
        choices: [
          { label: "Small", price: 0 },
          { label: "Large", price: 2.5 },
        ],
      },
    ],
  },
  {
    id: "kebab-3",
    name: "Chicken Kebab",
    description: "Marinated fillet of chicken breast served on a bed of fresh salad in pitta bread",
    price: 9.0,
    category: "kebabs",
    available: true,
    options: [
      {
        name: "Size",
        choices: [
          { label: "Small", price: 0 },
          { label: "Large", price: 2.0 },
        ],
      },
    ],
  },
  {
    id: "kebab-4",
    name: "Star'z Special Kebab",
    description: "Minced doner kebab, shish kebab and chicken kebab, served on a bed of fresh salad in pitta bread",
    price: 15.0,
    category: "kebabs",
    available: true,
  },

  // ========== SMASH BURGERS ==========
  {
    id: "smash-1",
    name: "THE SMASH KING",
    description: "Two juicy prime Angus patties smashed onto a bed of thin onions, fresh lettuce, cheese and Algerian sauce",
    price: 7.99,
    category: "smash-burgers",
    available: true,
    options: [
      {
        name: "Meal",
        choices: [
          { label: "Burger only", price: 0 },
          { label: "Make it a meal", price: 3.0 },
        ],
      },
    ],
  },
  {
    id: "smash-2",
    name: "STAR'Z ANGUS SMASH",
    description: "Two juicy prime Angus patties smashed and topped with cheese, fresh lettuce, diced onion and Algerian sauce",
    price: 7.99,
    category: "smash-burgers",
    available: true,
    options: [
      {
        name: "Meal",
        choices: [
          { label: "Burger only", price: 0 },
          { label: "Make it a meal", price: 3.0 },
        ],
      },
    ],
  },
  {
    id: "smash-3",
    name: "GRINGO CRUSH",
    description: "Two juicy prime Angus patties smashed and topped with 3 onion rings, BBQ cheese, gherkin and our special sauce",
    price: 7.99,
    category: "smash-burgers",
    available: true,
    options: [
      {
        name: "Meal",
        choices: [
          { label: "Burger only", price: 0 },
          { label: "Make it a meal", price: 3.0 },
        ],
      },
    ],
  },
  {
    id: "smash-4",
    name: "THE SKYLINE STACK",
    description: "Four juicy prime patties with tortilla chips, cheese, jalapeno, lettuce and our special signature sauce",
    price: 11.49,
    category: "smash-burgers",
    available: true,
    options: [
      {
        name: "Meal",
        choices: [
          { label: "Burger only", price: 0 },
          { label: "Make it a meal", price: 3.0 },
        ],
      },
    ],
  },

  // ========== WRAPS ==========
  {
    id: "wrap-1",
    name: "Chicken Kebab Wrap",
    price: 8.99,
    category: "wraps",
    available: true,
  },
  {
    id: "wrap-2",
    name: "Doner Kebab Wrap",
    price: 8.99,
    category: "wraps",
    available: true,
  },
  {
    id: "wrap-3",
    name: "Shish Kebab Wrap",
    price: 8.99,
    category: "wraps",
    available: true,
  },
  {
    id: "wrap-4",
    name: "Tender Wrap",
    price: 8.99,
    category: "wraps",
    available: true,
  },
  {
    id: "wrap-5",
    name: "Star'z Special Wrap",
    price: 9.99,
    category: "wraps",
    available: true,
  },

  // ========== PIZZAS (9", 12", 14") ==========
  {
    id: "pizza-1",
    name: "Margherita Pizza",
    description: "Tomato base with mozzarella cheese",
    price: 6.9,
    category: "pizzas",
    available: true,
    options: [
      {
        name: "Size",
        choices: [
          { label: "9 inch", price: 0 },
          { label: "12 inch", price: 2.3 },
          { label: "14 inch", price: 4.6 },
        ],
      },
    ],
  },
  {
    id: "pizza-2",
    name: "Hawaiian Pizza",
    description: "Tomato base, mozzarella cheese, turkey ham and pineapple",
    price: 9.5,
    category: "pizzas",
    available: true,
    options: [
      {
        name: "Size",
        choices: [
          { label: "9 inch", price: 0 },
          { label: "12 inch", price: 3.0 },
          { label: "14 inch", price: 5.0 },
        ],
      },
    ],
  },
  {
    id: "pizza-3",
    name: "Doner Pizza",
    description: "Tomato base, mozzarella cheese, doner and onion",
    price: 11.0,
    category: "pizzas",
    available: true,
    options: [
      {
        name: "Size",
        choices: [
          { label: "9 inch", price: 0 },
          { label: "12 inch", price: 2.5 },
          { label: "14 inch", price: 5.5 },
        ],
      },
    ],
  },
  {
    id: "pizza-4",
    name: "Pepperoni Pizza",
    description: "Tomato base, mozzarella cheese and pepperoni",
    price: 11.0,
    category: "pizzas",
    available: true,
    options: [
      {
        name: "Size",
        choices: [
          { label: "9 inch", price: 0 },
          { label: "12 inch", price: 2.5 },
          { label: "14 inch", price: 5.5 },
        ],
      },
    ],
  },
  {
    id: "pizza-5",
    name: "Vegetarian Pizza",
    description: "Tomato base, mozzarella cheese, mushroom, onion, mix pepper and sweet corn",
    price: 11.0,
    category: "pizzas",
    available: true,
    options: [
      {
        name: "Size",
        choices: [
          { label: "9 inch", price: 0 },
          { label: "12 inch", price: 2.5 },
          { label: "14 inch", price: 5.5 },
        ],
      },
    ],
  },
  {
    id: "pizza-6",
    name: "Vegetarian Hot",
    description: "Tomato base, mozzarella cheese, onion, mix pepper, green chilli and jalapenos",
    price: 11.0,
    category: "pizzas",
    available: true,
    options: [
      {
        name: "Size",
        choices: [
          { label: "9 inch", price: 0 },
          { label: "12 inch", price: 2.5 },
          { label: "14 inch", price: 5.5 },
        ],
      },
    ],
  },
  {
    id: "pizza-7",
    name: "Tandoori Chicken",
    description: "Tomato base, mozzarella cheese, tandoori chicken, onion, mix pepper and sweet corn",
    price: 11.0,
    category: "pizzas",
    available: true,
    options: [
      {
        name: "Size",
        choices: [
          { label: "9 inch", price: 0 },
          { label: "12 inch", price: 2.5 },
          { label: "14 inch", price: 5.5 },
        ],
      },
    ],
  },
  {
    id: "pizza-8",
    name: "Tandoori Hot",
    description: "Tomato base, mozzarella cheese, tandoori chicken, onion, green chilli, jalapenos",
    price: 11.0,
    category: "pizzas",
    available: true,
    options: [
      {
        name: "Size",
        choices: [
          { label: "9 inch", price: 0 },
          { label: "12 inch", price: 2.5 },
          { label: "14 inch", price: 5.5 },
        ],
      },
    ],
  },
  {
    id: "pizza-9",
    name: "Special Kebab Pizza",
    description: "Tomato base, mozzarella cheese, lamb doner, tandoori chicken, onion and mix peppers",
    price: 11.0,
    category: "pizzas",
    available: true,
    options: [
      {
        name: "Size",
        choices: [
          { label: "9 inch", price: 0 },
          { label: "12 inch", price: 2.5 },
          { label: "14 inch", price: 5.5 },
        ],
      },
    ],
  },
  {
    id: "pizza-10",
    name: "Meat Feast",
    description: "Lamb doner, chicken minced and spicy beef",
    price: 11.0,
    category: "pizzas",
    available: true,
    options: [
      {
        name: "Size",
        choices: [
          { label: "9 inch", price: 0 },
          { label: "12 inch", price: 2.5 },
          { label: "14 inch", price: 5.5 },
        ],
      },
    ],
  },
  {
    id: "pizza-11",
    name: "Mighty Meaty",
    description: "Tomato base, mozzarella cheese, pepperoni, ham, chicken, beef",
    price: 11.0,
    category: "pizzas",
    available: true,
    options: [
      {
        name: "Size",
        choices: [
          { label: "9 inch", price: 0 },
          { label: "12 inch", price: 2.5 },
          { label: "14 inch", price: 5.5 },
        ],
      },
    ],
  },
  {
    id: "pizza-12",
    name: "Caribbean Pizza",
    description: "Tomato base, mozzarella cheese, chicken, red onion, sweetcorn",
    price: 11.0,
    category: "pizzas",
    available: true,
    options: [
      {
        name: "Size",
        choices: [
          { label: "9 inch", price: 0 },
          { label: "12 inch", price: 2.5 },
          { label: "14 inch", price: 5.5 },
        ],
      },
    ],
  },
  {
    id: "pizza-13",
    name: "Mexican Pizza",
    description: "Tomato base, mozzarella cheese, spicy beef, red onion, green chilli and mix pepper",
    price: 11.0,
    category: "pizzas",
    available: true,
    options: [
      {
        name: "Size",
        choices: [
          { label: "9 inch", price: 0 },
          { label: "12 inch", price: 2.5 },
          { label: "14 inch", price: 5.5 },
        ],
      },
    ],
  },
  {
    id: "pizza-14",
    name: "Romanian Pizza",
    description: "Tomato base, mozzarella cheese, pepperoni, mushroom, sweet corn and black olives",
    price: 11.0,
    category: "pizzas",
    available: true,
    options: [
      {
        name: "Size",
        choices: [
          { label: "9 inch", price: 0 },
          { label: "12 inch", price: 2.5 },
          { label: "14 inch", price: 5.5 },
        ],
      },
    ],
  },
  {
    id: "pizza-15",
    name: "Tuna Pizza",
    description: "Tomato base, mozzarella cheese, tuna and sweetcorn",
    price: 11.0,
    category: "pizzas",
    available: true,
    options: [
      {
        name: "Size",
        choices: [
          { label: "9 inch", price: 0 },
          { label: "12 inch", price: 2.5 },
          { label: "14 inch", price: 5.5 },
        ],
      },
    ],
  },
  {
    id: "pizza-16",
    name: "STAR'Z Special Pizza",
    description: "Tomato base, mozzarella cheese, chicken mince, spicy beef, onion, mix pepper and black olives",
    price: 11.0,
    category: "pizzas",
    available: true,
    options: [
      {
        name: "Size",
        choices: [
          { label: "9 inch", price: 0 },
          { label: "12 inch", price: 2.5 },
          { label: "14 inch", price: 5.5 },
        ],
      },
    ],
  },
  {
    id: "pizza-17",
    name: "Create Your Own Pizza",
    description: "Any four toppings of your choice. Extra toppings £1 / £2 / £3 by size",
    price: 11.0,
    category: "pizzas",
    available: true,
    options: [
      {
        name: "Size",
        choices: [
          { label: "9 inch", price: 0 },
          { label: "12 inch", price: 2.5 },
          { label: "14 inch", price: 5.5 },
        ],
      },
      {
        name: "Extra Topping",
        choices: [
          { label: "Chicken Mince", price: 1.0 },
          { label: "Turkey Ham", price: 1.0 },
          { label: "Pineapple", price: 1.0 },
          { label: "Pepperoni", price: 1.0 },
          { label: "Jalapeno", price: 1.0 },
          { label: "Tandoori Chicken", price: 1.0 },
          { label: "Mushroom", price: 1.0 },
          { label: "Tuna", price: 1.0 },
          { label: "Red Onion", price: 1.0 },
          { label: "Green Chilli", price: 1.0 },
          { label: "Donner Meat", price: 1.0 },
          { label: "Sweetcorn", price: 1.0 },
          { label: "Olive", price: 1.0 },
          { label: "Spicy Beef", price: 1.0 },
          { label: "Mix Pepper", price: 1.0 },
        ],
      },
    ],
  },
  {
    id: "pizza-18",
    name: "Garlic Pizza Bread",
    price: 7.49,
    category: "pizzas",
    available: true,
    options: [
      {
        name: "Size",
        choices: [
          { label: "9 inch", price: 0 },
          { label: "12 inch", price: 1.51 },
          { label: "14 inch", price: 3.51 },
        ],
      },
    ],
  },
  {
    id: "pizza-19",
    name: "Garlic Pizza Bread with Cheese",
    price: 8.49,
    category: "pizzas",
    available: true,
    options: [
      {
        name: "Size",
        choices: [
          { label: "9 inch", price: 0 },
          { label: "12 inch", price: 1.51 },
          { label: "14 inch", price: 3.51 },
        ],
      },
    ],
  },

  // ========== LOADED FRIES ==========
  {
    id: "loaded-1",
    name: "Loaded Fries",
    price: 7.49,
    category: "loaded-fries",
    available: true,
  },
  {
    id: "loaded-2",
    name: "Vaca Fritas",
    description: "Minced Angus beef with freshly made fries, topped with seasonal salt and drizzled with our special signature sauce, sriracha sauce and jalapenos",
    price: 7.49,
    category: "loaded-fries",
    available: true,
  },
  {
    id: "loaded-3",
    name: "Doner Fritas",
    description: "Minced premium lamb doner loaded onto a bed of crispy golden fries, lettuce, seasonal sweet chilli, garlic",
    price: 7.49,
    category: "loaded-fries",
    available: true,
  },
  {
    id: "loaded-4",
    name: "Chica Fritas",
    description: "Grilled chicken with freshly made fries, topped with seasonal salt and drizzled with our special signature sauce, sriracha sauce and jalapenos",
    price: 7.49,
    category: "loaded-fries",
    available: true,
  },

  // ========== MUNCH BOXES ==========
  {
    id: "munch-1",
    name: "Snack Box",
    description: "Warm seasoned fries topped with mouth watering juicy mixed kebab, served with refreshing cold drink",
    price: 16.99,
    category: "munch-boxes",
    available: true,
  },
  {
    id: "munch-2",
    name: "Grafter Box",
    description: "A juicy burger meets generous sliced seasoned doner kebab, crowned over a bed of golden fries, all paired with a chilled can of drink",
    price: 18.99,
    category: "munch-boxes",
    available: true,
  },
  {
    id: "munch-3",
    name: "All In One Box",
    description: "A juicy burger, savoury doner fries, crispy wings and a chilled drink",
    price: 19.99,
    category: "munch-boxes",
    available: true,
  },

  // ========== CHICKEN BURGERS ==========
  {
    id: "chicken-1",
    name: "STAR'Z BUTTERMILK CRISPY",
    description: "Buttermilk chicken coated in our special 7 herb seasoning fried to crispy perfection. Fresh lettuce, cheese and mayo",
    price: 7.49,
    category: "chicken-burgers",
    available: true,
  },
  {
    id: "chicken-2",
    name: "GARLIC BUTTERMILK CRISPY",
    description: "Buttermilk chicken coated in our special 7 herb seasoning fried to crispy perfection, dipped in our rich garlic and herbs butter glaze. Fresh lettuce, cheese and garlic mayo",
    price: 7.99,
    category: "chicken-burgers",
    available: true,
  },
  {
    id: "chicken-3",
    name: "FLAMING BUTTERMILK CRISPY",
    description: "Buttermilk chicken coated in our special 7 herb seasoning fried to perfection and dipped in our flaming hot spicy butter glaze, fresh lettuce, cheese and mayo",
    price: 7.99,
    category: "chicken-burgers",
    available: true,
  },
  {
    id: "chicken-4",
    name: "KOREAN BBQ CRISPY",
    description: "Buttermilk chicken coated in our special 7 herb seasoning fried to perfection, dipped in Hickory Korean BBQ glaze. Fresh lettuce, cheese and mayo",
    price: 7.99,
    category: "chicken-burgers",
    available: true,
  },
  {
    id: "chicken-5",
    name: "SUPREME BUTTERMILK CRISPY",
    description: "Buttermilk chicken coated in our special 7 herb seasoning fried to perfection. Fresh lettuce, cheese and mayo, topped with a crispy potato hash brown",
    price: 8.49,
    category: "chicken-burgers",
    available: true,
  },
  {
    id: "chicken-6",
    name: "STAR'Z VEGGIE DELIGHT",
    description: "Premium veggie burger fried to crispy perfection topped with cheese and fresh lettuce, crunchy diced onion, gherkin and creamy mayo",
    price: 6.99,
    category: "chicken-burgers",
    available: true,
  },

  // ========== CHICKEN WINGS / TENDERS ==========
  {
    id: "tenders-1",
    name: "Chicken Wings",
    description: "Fried and coated in our special 7 herb seasoning",
    price: 5.49,
    category: "tenders",
    available: true,
    options: [
      {
        name: "Size",
        choices: [
          { label: "3 PCS", price: 0 },
          { label: "5 PCS", price: 1.41 },
        ],
      },
      {
        name: "Flavour",
        choices: [
          { label: "Classic Wings" },
          { label: "Smokey BBQ Wings" },
          { label: "Hot Wings" },
        ],
      },
    ],
  },
  {
    id: "tenders-2",
    name: "Chicken Tenders",
    description: "Fried and coated in our special 7 herb seasoning",
    price: 5.49,
    category: "tenders",
    available: true,
    options: [
      {
        name: "Size",
        choices: [
          { label: "3 PCS", price: 0 },
          { label: "5 PCS", price: 1.41 },
        ],
      },
      {
        name: "Flavour",
        choices: [
          { label: "Garlic Tenders" },
          { label: "Classic Tenders" },
          { label: "Flaming Tenders" },
          { label: "Smokey BBQ Tenders" },
        ],
      },
    ],
  },

  // ========== KIDS MENU ==========
  {
    id: "kids-1",
    name: "Mini Munchies",
    description: "Single Angus or doner smash patty served in a brioche bun with mayo, lettuce and cheese. Served with fries and Fruit Shoot",
    price: 6.99,
    category: "kids-menu",
    available: true,
  },
  {
    id: "kids-2",
    name: "Dino Bite Nuggets",
    description: "5pc nuggets and fries. Served with Fruit Shoot",
    price: 6.99,
    category: "kids-menu",
    available: true,
  },
  {
    id: "kids-3",
    name: "Happy Bite Box",
    description: "2pc chicken strips and fries. Served with Fruit Shoot",
    price: 6.99,
    category: "kids-menu",
    available: true,
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
  {
    id: "side-10",
    name: "Chicken Popcorn",
    price: 3.99,
    category: "sides",
    available: true,
  },
  {
    id: "side-11",
    name: "Curly Fries",
    price: 3.99,
    category: "sides",
    available: true,
  },

  // ========== CALZONE ==========
  {
    id: "calzone-1",
    name: "Doner Calzone",
    description: "Golden crispy calzone packed with savory doner meat, melted cheese, sweet onions and rich tomato sauce",
    price: 11.0,
    category: "calzone",
    available: true,
  },
  {
    id: "calzone-2",
    name: "The Rusticity Calzone",
    description: "Golden portable pizza pocket stuffed with savory chicken, spicy pepperoni, earthy mushrooms and melted cheese",
    price: 11.0,
    category: "calzone",
    available: true,
  },
  {
    id: "calzone-3",
    name: "Hawaiian Calzone",
    description: "Golden-baked calzone filled with savory ham, sweet juicy pineapple and melted cheese",
    price: 11.0,
    category: "calzone",
    available: true,
  },
  {
    id: "calzone-4",
    name: "Veggie Medley Calzone",
    description: "Hearty golden calzone with sautéed mushrooms, sweet corn, caramelized onions, bell peppers and cheese",
    price: 11.0,
    category: "calzone",
    available: true,
  },
  {
    id: "calzone-5",
    name: "Star'z Special Calzone",
    description: "Golden handheld pie with doner, chicken and beef, layered with spicy jalapeños, sweet onions, savory mushrooms in melted cheese",
    price: 12.49,
    category: "calzone",
    available: true,
  },

  // ========== DIPS (£1.00 each) ==========
  {
    id: "dip-1",
    name: "Mayo",
    price: 1.0,
    category: "dips",
    available: true,
  },
  {
    id: "dip-2",
    name: "Ketchup",
    price: 1.0,
    category: "dips",
    available: true,
  },
  {
    id: "dip-3",
    name: "Korean BBQ",
    price: 1.0,
    category: "dips",
    available: true,
  },
  {
    id: "dip-4",
    name: "Big Up",
    price: 1.0,
    category: "dips",
    available: true,
  },
  {
    id: "dip-5",
    name: "Algerian",
    price: 1.0,
    category: "dips",
    available: true,
  },
  {
    id: "dip-6",
    name: "Star'z Dynamite",
    price: 1.0,
    category: "dips",
    available: true,
  },
  {
    id: "dip-7",
    name: "Star'z Garlic Mayoli",
    price: 1.0,
    category: "dips",
    available: true,
  },
  {
    id: "dip-8",
    name: "Star'z Sweet Chilli",
    price: 1.0,
    category: "dips",
    available: true,
  },
  {
    id: "dip-9",
    name: "Star'z Special Signature",
    price: 1.0,
    category: "dips",
    available: true,
  },

  // ========== DIPPING POTS (£1.50 each) ==========
  {
    id: "dipping-1",
    name: "Garlic Butter",
    price: 1.5,
    category: "dipping-pots",
    available: true,
  },
  {
    id: "dipping-2",
    name: "Flaming Butter",
    price: 1.5,
    category: "dipping-pots",
    available: true,
  },
  {
    id: "dipping-3",
    name: "Korean BBQ",
    price: 1.5,
    category: "dipping-pots",
    available: true,
  },

  // ========== DESSERTS (Brownies & Cheesecakes) ==========
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
          { label: "Oreo Lovers" },
        ],
      },
    ],
  },
  {
    id: "brownie-2",
    name: "Star'z Special Brownie",
    price: 5.99,
    category: "desserts",
    available: true,
  },
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
    name: "Can 330ml",
    price: 1.49,
    category: "drinks",
    available: true,
    options: [
      {
        name: "Flavour",
        choices: [
          { label: "Ice Cola" },
          { label: "Ice X (Diet)" },
          { label: "Ice Citrus" },
          { label: "Irn-Bru" },
          { label: "Ice Mango" },
          { label: "Ice Guava" },
          { label: "Ice Rio" },
          { label: "Ice Mojito" },
          { label: "Ice Orange" },
          { label: "Ice Strawberry" },
          { label: "Vimto" },
        ],
      },
    ],
  },
  {
    id: "drink-2",
    name: "Fruit Shoot 200ml",
    price: 1.49,
    category: "drinks",
    available: true,
    options: [
      {
        name: "Flavour",
        choices: [
          { label: "Orange" },
          { label: "Blackcurrant" },
        ],
      },
    ],
  },
  {
    id: "drink-3",
    name: "Water 500ml",
    price: 1.49,
    category: "drinks",
    available: true,
  },
  {
    id: "drink-4",
    name: "Bottle 1.5L",
    price: 2.99,
    category: "drinks",
    available: true,
    options: [
      {
        name: "Flavour",
        choices: [
          { label: "Pepsi" },
          { label: "Tango Orange" },
          { label: "7up" },
        ],
      },
    ],
  },

  // ========== SPECIAL DEALS / BOXES ==========
  {
    id: "deal-1",
    name: "STAR'Z SPECIAL FIRE DEAL 1",
    description: "Any 2 x 9\" pizza and 2 garlic dips",
    price: 14.99,
    category: "special-boxes",
    available: true,
  },
  {
    id: "deal-2",
    name: "STAR'Z SPECIAL FIRE DEAL 2",
    description: "Any 1 x 9\" pizza, 3 garlic bread pcs, 1 x fries, 1 x garlic dip, 1 x can of drink",
    price: 16.0,
    category: "special-boxes",
    available: true,
  },
  {
    id: "deal-3",
    name: "STAR'Z SPECIAL FIRE DEAL 3",
    description: "Any 2 x 12\" pizzas, 1 x fries, 2 x garlic dips, 1 x bottle of drink",
    price: 24.99,
    category: "special-boxes",
    available: true,
  },
  {
    id: "deal-4",
    name: "STAR'Z FAMILY FIRE DEAL 4",
    description: "Any 2 x 9\" pizzas, 3 pcs tender, 1 x fries, 2 x garlic dips, 1 x cheese cake, 2 x can of drinks",
    price: 26.49,
    category: "special-boxes",
    available: true,
  },
  {
    id: "deal-5",
    name: "STAR'Z SPECIAL FIRE DEAL 5",
    description: "Any 1 x 9\" pizza, 1 x burger, 1 x fries, 1 x garlic dip, 1 x dessert, 2 x can of drinks",
    price: 23.49,
    category: "special-boxes",
    available: true,
  },
  {
    id: "deal-6",
    name: "STAR'Z SPECIAL FIRE DEAL 6",
    description: "Any 12\" pizza, any 14\" pizza and a bottle of drink",
    price: 27.49,
    category: "special-boxes",
    available: true,
  },
  {
    id: "deal-7",
    name: "STAR'Z PARTY FIRE DEAL 7",
    description: "Any 2 x 12\" pizza, 2 x burger, 5 pcs tender, 5 pcs wings, 2 x sides, 2 x dessert, 4 x dips and any 4 cans of drinks",
    price: 49.99,
    category: "special-boxes",
    available: true,
  },
  {
    id: "deal-8",
    name: "STAR'Z SPECIAL BOX",
    description: "Any burger, loaded fries, tenders (any flavour), any soft drink",
    price: 18.99,
    category: "special-boxes",
    available: true,
  },
  {
    id: "deal-9",
    name: "STAR'Z BOX F-2",
    description: "Any 2 burgers, any 2 loaded fries, tenders (any flavour), any 2 soft drinks",
    price: 29.99,
    category: "special-boxes",
    available: true,
  },
  {
    id: "deal-10",
    name: "DOUBLE BURGER COMBO",
    description: "Any 2 burgers, 2 fries, 2 soft drinks",
    price: 19.99,
    category: "special-boxes",
    available: true,
  },
  {
    id: "deal-11",
    name: "SIDE DEAL 1",
    description: "4 pcs tender, 6 pcs nuggets and fries, a can of drink",
    price: 15.99,
    category: "special-boxes",
    available: true,
  },
  {
    id: "deal-12",
    name: "SIDE DEAL 2",
    description: "6 pcs wings, 4 tenders, fries, 5 onion rings and can of drink",
    price: 19.99,
    category: "special-boxes",
    available: true,
  },
  {
    id: "deal-13",
    name: "SIDE DEAL 3",
    description: "10 pcs wings, 5 pcs tender, 2 fries, 2 cans of drink",
    price: 25.99,
    category: "special-boxes",
    available: true,
  },
  {
    id: "deal-14",
    name: "SIDE DEAL 4",
    description: "10 pcs tenders, 10 pcs wings, 5 onion rings, 2 fries, 1 bottle of drink",
    price: 29.99,
    category: "special-boxes",
    available: true,
  },
  {
    id: "deal-15",
    name: "SIDE DEAL 5",
    description: "15 pcs wings, 2 fries and bottle of drink",
    price: 24.99,
    category: "special-boxes",
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
  { id: "kebabs", name: "Kebabs" },
  { id: "smash-burgers", name: "Smash Burgers" },
  { id: "wraps", name: "Wraps" },
  { id: "pizzas", name: "Pizzas" },
  { id: "loaded-fries", name: "Loaded Fries" },
  { id: "munch-boxes", name: "Munch Boxes" },
  { id: "chicken-burgers", name: "Chicken Burgers" },
  { id: "sides", name: "Sides" },
  { id: "tenders", name: "Chicken Wings & Tenders" },
  { id: "calzone", name: "Calzone" },
  { id: "dips", name: "Dips" },
  { id: "dipping-pots", name: "Dipping Pots" },
  { id: "desserts", name: "Desserts" },
  { id: "drinks", name: "Drinks" },
  { id: "kids-menu", name: "Kids Menu" },
  { id: "special-boxes", name: "Special Deals" },
];
