import categoriesData from '../mockData/categories.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let categories = [...categoriesData];

const categoryService = {
  async getAll() {
    await delay(150);
    return [...categories].sort((a, b) => a.position - b.position);
  },

  async getById(id) {
    await delay(100);
    const category = categories.find(c => c.id === id);
    return category ? { ...category } : null;
  },

  async create(categoryData) {
    await delay(250);
    const newCategory = {
      id: Date.now().toString(),
      name: categoryData.name,
      color: categoryData.color || "#8B5CF6",
      icon: categoryData.icon || "Folder",
      taskCount: 0,
      position: categories.length + 1
    };
    categories.push(newCategory);
    return { ...newCategory };
  },

  async update(id, updateData) {
    await delay(200);
    const index = categories.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Category not found');
    
    const updatedCategory = {
      ...categories[index],
      ...updateData
    };
    
    categories[index] = updatedCategory;
    return { ...updatedCategory };
  },

  async delete(id) {
    await delay(200);
    const index = categories.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Category not found');
    
    categories.splice(index, 1);
    return true;
  },

  async updateTaskCount(categoryId, count) {
    await delay(100);
    const index = categories.findIndex(c => c.id === categoryId);
    if (index !== -1) {
      categories[index].taskCount = count;
    }
  }
};

export default categoryService;