import { defineDb, defineTable, column, NOW } from "astro:db";

const Comment = defineTable({
  columns: {
    id: column.text({
      primaryKey: true,
    }),
    publishedAt: column.date({
      default: NOW,
    }),
    body: column.text(),
    userId: column.text({
      references: () => User.columns.id,
    }),
    articleId: column.text(),
  },
});
const User = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    username: column.text({
      unique: true,
    }),
    name: column.text(),
    passwordHash: column.text(),
  },
});

const Session = defineTable({
  columns: {
    id: column.text({ unique: true }),
    expiresAt: column.number({ optional: false }),
    userId: column.text({ optional: false, references: () => User.columns.id }),
  },
});
// https://astro.build/db/config
export default defineDb({
  tables: { Comment, User, Session },
});
