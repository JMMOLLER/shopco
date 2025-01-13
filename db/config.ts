import { defineDb, defineTable, column, NOW } from 'astro:db';

const Product = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    title: column.text({ optional: false }),
    thumbnailUrl: column.text({ optional: true }),
    rating: column.number({ optional: false }),
    discount: column.number({ optional: true }),
    price: column.number({ optional: false }),
    timestamp: column.date({ default: NOW }),
  }
})

export default defineDb({
  tables: {
    Product
  },
})