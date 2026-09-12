cube(`FctSales`, {
  sql_table: `fct_sales`,

  measures: {
    orderCount: {
      type: `count`,
      drillMembers: [orderId, orderDate, customerName]
    },

    totalQuantity: {
      sql: `quantity`,
      type: `sum`
    },

    totalRevenue: {
      sql: `revenue`,
      type: `sum`
    },

    totalMaterialCost: {
      sql: `material_cost`,
      type: `sum`
    },

    totalShippingCost: {
      sql: `shipping_cost`,
      type: `sum`
    },

    totalLaborCost: {
      sql: `labor_cost`,
      type: `sum`
    },

    totalCost: {
      sql: `total_cost`,
      type: `sum`
    },

    totalProfit: {
      sql: `profit`,
      type: `sum`
    },

    averageMargin: {
      sql: `margin`,
      type: `avg`,
      format: `percent`
    }
  },

  dimensions: {
    orderId: {
      sql: `order_id`,
      type: `number`,
      primaryKey: true
    },

    orderDate: {
      sql: `order_date`,
      type: `time`
    },

    customerId: {
      sql: `customer_id`,
      type: `number`
    },

    customerName: {
      sql: `customer_name`,
      type: `string`
    },

    country: {
      sql: `country`,
      type: `string`
    },

    region: {
      sql: `region`,
      type: `string`
    },

    productId: {
      sql: `product_id`,
      type: `number`
    },

    productName: {
      sql: `product_name`,
      type: `string`
    },

    category: {
      sql: `category`,
      type: `string`
    }
  }
});