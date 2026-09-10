WITH sales AS (

    SELECT
        o.order_id,
        o.order_date,
        o.customer_id,
        c.customer_name,
        c.country,
        c.region,
        o.product_id,
        p.product_name,
        p.category,
        o.quantity,
        o.revenue,
        co.material_cost,
        co.shipping_cost,
        co.labor_cost,

        (
            co.material_cost
            + co.shipping_cost
            + co.labor_cost
        ) AS total_cost

    FROM {{ ref('stg_orders') }} o

    LEFT JOIN {{ ref('stg_customers') }} c
        ON o.customer_id = c.customer_id

    LEFT JOIN {{ ref('stg_products') }} p
        ON o.product_id = p.product_id

    LEFT JOIN {{ ref('stg_costs') }} co
        ON o.order_id = co.order_id

)

SELECT
    *,
    revenue - total_cost AS profit,

    CASE
        WHEN revenue = 0 THEN 0
        ELSE (revenue - total_cost) / revenue
    END AS margin

FROM sales