const fs = require('fs');
const path = require('path');

const data = JSON.parse(fs.readFileSync('/tmp/slapz-menu.json', 'utf8'));

const categoryMap = {
  'ANGUS SMASH BURGERS': 'smash-burgers',
  'BUTTERMILK CHICKEN BURGERS': 'chicken-burgers',
  'SMASH DONNER BURGERS': 'smash-burgers',
  'VEGGIE BURGERS': 'chicken-burgers',
  'BUTTERMILK CHICKEN TENDERS': 'tenders',
  'LOADED FRIES': 'loaded-fries',
  'SIDES': 'sides',
  'DIPS': 'dips',
  'DIPPING POTS': 'dips',
  'CAKES & BROWNIES': 'desserts',
  'SLAPZ SHAKEZ': 'shakes',
  'SOFT DRINKS': 'sides',
  'SLAPZ BOXES': 'special-boxes',
  'LIL SLAPZ MEALS': 'special-boxes'
};

function escapeString(str) {
  if (!str) return '';
  return str.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, ' ');
}

function formatOptions(options) {
  if (!options || options.length === 0) return '';
  const opts = options.map(opt => {
    const choices = opt.choices.map(c => {
      const pricePart = c.price > 0 ? `, price: ${c.price}` : '';
      return `          { label: "${escapeString(c.label)}"${pricePart} }`;
    }).join(',\n');
    return `      {\n        name: "${escapeString(opt.name)}",\n        choices: [\n${choices}\n        ],\n      }`;
  }).join(',\n');
  return ',\n    options: [\n' + opts + '\n    ]';
}

let output = 'import { MenuItem } from "@/types/menu";\n\n';
output += 'export const menuItems: MenuItem[] = [\n';

const allItems = [];

data.MenuSections.forEach(section => {
  const category = categoryMap[section.Name] || 'sides';
  
  section.MenuItems?.forEach(item => {
    if (item.IsDeleted || !item.IsAvailable) return;
    
    const description = (item.Description || '').replace(/\n/g, ' ').trim();
    const menuItem = {
      id: `slapz-${item.MenuItemId}`,
      name: item.Name,
      description: description || undefined,
      price: item.Price,
      category: category,
      imageUrl: item.ImageUrl || item.ExternalImageUrl || null,
      options: []
    };
    
    if (item.MenuItemOptionSets && item.MenuItemOptionSets.length > 0) {
      item.MenuItemOptionSets.forEach(optSet => {
        if (optSet.IsDeleted) return;
        
        const choices = optSet.MenuItemOptionSetItems
          ?.filter(opt => !opt.IsDeleted && opt.IsAvailable)
          .map(opt => ({
            label: opt.Name,
            price: opt.Price || 0
          })) || [];
        
        if (choices.length > 0) {
          menuItem.options.push({
            name: optSet.Name,
            choices: choices
          });
        }
      });
    }
    
    allItems.push(menuItem);
  });
});

allItems.forEach((item, idx) => {
  const parts = [`    id: "${item.id}"`, `    name: "${escapeString(item.name)}"`];
  
  if (item.description) {
    parts.push(`    description: "${escapeString(item.description)}"`);
  }
  
  parts.push(`    price: ${item.price}`, `    category: "${item.category}"`);
  
  if (item.imageUrl) {
    parts.push(`    imageUrl: "${item.imageUrl}"`);
  }
  
  const options = formatOptions(item.options);
  if (options) {
    parts.push(options.substring(2)); // Remove leading ",\n"
  }
  
  output += `  {\n${parts.join(',\n')},\n  }`;
  if (idx < allItems.length - 1) output += ',';
  output += '\n';
});

output += '];\n\n';

output += 'export const getMenuItemsByCategory = (category: string): MenuItem[] => {\n';
output += '  return menuItems.filter((item) => item.category === category);\n';
output += '};\n\n';

output += 'export const getMenuItemById = (id: string): MenuItem | undefined => {\n';
output += '  return menuItems.find((item) => item.id === id);\n';
output += '};\n\n';

const categories = Array.from(new Set(allItems.map(i => i.category))).map(cat => {
  const names = {
    'smash-burgers': 'Smash Burgers',
    'chicken-burgers': 'Chicken Burgers',
    'loaded-fries': 'Loaded Fries',
    'shakes': 'Shakes',
    'sides': 'Sides',
    'dips': 'Dips',
    'tenders': 'Chicken Tenders',
    'desserts': 'Desserts',
    'special-boxes': 'Special Boxes'
  };
  return { id: cat, name: names[cat] || cat };
});

output += 'export const categories = [\n';
output += categories.map(c => `  { id: "${c.id}", name: "${c.name}" },`).join('\n');
output += '\n];\n';

fs.writeFileSync(path.join(__dirname, '../lib/menu-data.ts'), output);
console.log('Menu data file created successfully!');
console.log(`Total items: ${allItems.length}`);

