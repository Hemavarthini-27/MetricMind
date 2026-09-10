WITH date_range AS (

    SELECT
        MIN(order_date) AS start_date,
        MAX(order_date) AS end_date
    FROM {{ ref('stg_orders') }}

),

dates AS (

    SELECT
        generate_series(
            start_date,
            end_date,
            interval '1 day'
        )::date AS date_day
    FROM date_range

)

SELECT
    date_day,

    EXTRACT(YEAR FROM date_day)::integer AS year,

    EXTRACT(QUARTER FROM date_day)::integer AS quarter,

    EXTRACT(MONTH FROM date_day)::integer AS month,

    TO_CHAR(date_day, 'Month') AS month_name,

    EXTRACT(DAY FROM date_day)::integer AS day,

    TO_CHAR(date_day, 'Day') AS day_name

FROM dates