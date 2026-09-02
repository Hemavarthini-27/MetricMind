import pandas as pd
import numpy as np
import random
from datetime import datetime, timedelta

# Reproducibility
np.random.seed(42)
random.seed(42)

# =========================================================
# 1. CUSTOMERS
# =========================================================

countries = {
    "Europe": ["Germany", "France", "UK", "Italy", "Spain"],
    "Asia": ["India", "Japan", "Singapore", "South Korea"],
    "North America": ["USA", "Canada"],
    "South America": ["Brazil", "Argentina"]
}

customer_names = [
    "TechCorp", "GlobalRetail", "EuroSystems", "SmartStore",
    "EnterpriseHub", "DigitalWorld", "MegaMart", "FutureTech",
    "CloudWorks", "DataSolutions"
]

customers = []

for customer_id in range(1, 501):

    region = random.choice(list(countries.keys()))
    country = random.choice(countries[region])

    name = random.choice(customer_names) + f" {customer_id}"

    customers.append({
        "customer_id": customer_id,
        "customer_name": name,
        "country": country,
        "region": region
    })

customers_df = pd.DataFrame(customers)


# =========================================================
# 2. PRODUCTS
# =========================================================

product_names = [
    "Laptop Pro",
    "Monitor Ultra",
    "Server X",
    "Tablet Pro",
    "Phone X",
    "Workstation Z",
    "Network Router",
    "Storage System",
    "Business Laptop",
    "Enterprise Server"
]

categories = [
    "Electronics",
    "Infrastructure",
    "Mobile",
    "Networking",
    "Computing"
]

products = []

for product_id in range(101, 201):

    product_name = random.choice(product_names)

    category = random.choice(categories)

    unit_price = random.choice([
        500,
        700,
        900,
        1200,
        1500,
        2000,
        3500,
        5000
    ])

    products.append({
        "product_id": product_id,
        "product_name": product_name,
        "category": category,
        "unit_price": unit_price
    })

products_df = pd.DataFrame(products)


# =========================================================
# 3. ORDERS + COSTS
# =========================================================

orders = []
costs = []

start_date = datetime(2026, 1, 1)
end_date = datetime(2026, 12, 31)

date_range = (end_date - start_date).days

for order_id in range(10001, 60001):

    order_date = start_date + timedelta(
        days=random.randint(0, date_range)
    )

    customer = customers_df.sample(1).iloc[0]
    product = products_df.sample(1).iloc[0]

    customer_id = int(customer["customer_id"])
    product_id = int(product["product_id"])

    quantity = random.randint(1, 50)

    unit_price = product["unit_price"]

    revenue = quantity * unit_price

    # -----------------------------------------------------
    # Base costs
    # -----------------------------------------------------

    material_cost = revenue * random.uniform(0.35, 0.55)

    shipping_cost = revenue * random.uniform(0.05, 0.10)

    labor_cost = revenue * random.uniform(0.05, 0.12)

    # -----------------------------------------------------
    # IMPORTANT:
    # Increase European shipping costs during Q3
    # This creates the business problem MetricMind
    # will eventually discover.
    # -----------------------------------------------------

    if (
        customer["region"] == "Europe"
        and order_date.month in [7, 8, 9]
    ):
        shipping_cost *= random.uniform(1.5, 2.0)

    revenue = round(revenue, 2)

    material_cost = round(material_cost, 2)
    shipping_cost = round(shipping_cost, 2)
    labor_cost = round(labor_cost, 2)

    orders.append({
        "order_id": order_id,
        "order_date": order_date.date(),
        "customer_id": customer_id,
        "product_id": product_id,
        "quantity": quantity,
        "revenue": revenue
    })

    costs.append({
        "order_id": order_id,
        "material_cost": material_cost,
        "shipping_cost": shipping_cost,
        "labor_cost": labor_cost
    })


orders_df = pd.DataFrame(orders)
costs_df = pd.DataFrame(costs)


# =========================================================
# 4. SAVE CSV FILES
# =========================================================

customers_df.to_csv(
    "data/customers.csv",
    index=False
)

products_df.to_csv(
    "data/products.csv",
    index=False
)

orders_df.to_csv(
    "data/orders.csv",
    index=False
)

costs_df.to_csv(
    "data/costs.csv",
    index=False
)


# =========================================================
# 5. DISPLAY SUMMARY
# =========================================================

print("\n====================================")
print("      METRICMIND DATA GENERATED")
print("====================================")

print(f"Customers : {len(customers_df):,}")
print(f"Products  : {len(products_df):,}")
print(f"Orders    : {len(orders_df):,}")
print(f"Costs     : {len(costs_df):,}")

print("\nFiles created:")

print("✓ data/customers.csv")
print("✓ data/products.csv")
print("✓ data/orders.csv")
print("✓ data/costs.csv")

print("\nSample Orders:")
print(orders_df.head())

print("\nSample Costs:")
print(costs_df.head())

print("\n====================================")
print("        DATA GENERATION COMPLETE")
print("====================================")