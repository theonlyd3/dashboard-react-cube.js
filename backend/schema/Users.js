cube(`Users`, {
  sql: `SELECT * FROM public.users`,

  joins: {},

  measures: {
    count: {
      type: `count`,
      drillMembers: [city, id, createdAt]
    }
  },

  dimensions: {
    gender: {
      sql: `number`,
      type: `string`
    },

    city: {
      sql: `city`,
      type: `string`
    },

    company: {
      sql: `company`,
      type: `string`
    },

    id: {
      sql: `id`,
      type: `number`,
      primaryKey: true
    },

    createdAt: {
      sql: `created_at`,
      type: `time`
    }
  }
});
