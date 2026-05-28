function BOMEngine({ components = [] }) {
  const rateTable = {
    Filter: { material: "GI / HEPA", weight: 8, rate: 2500 },
    Coil: { material: "Cu/Al", weight: 22, rate: 18000 },
    Fan: { material: "MS", weight: 35, rate: 22000 },
    Motor: { material: "Standard", weight: 28, rate: 15000 },
    Damper: { material: "GI", weight: 6, rate: 3500 },
  };

  const bomItems = components.map((c, index) => {
    const item = rateTable[c.type] || {
      material: "MS",
      weight: 5,
      rate: 1000,
    };

    return {
      sl: index + 1,
      item: c.type,
      qty: 1,
      material: item.material,
      weight: item.weight,
      cost: item.rate,
    };
  });

  const materialCost = bomItems.reduce((sum, item) => sum + item.cost, 0);
  const fabricationCost = materialCost * 0.18;
  const assemblyCost = materialCost * 0.12;
  const overhead = materialCost * 0.1;
  const subtotal = materialCost + fabricationCost + assemblyCost + overhead;
  const profit = subtotal * 0.25;
  const sellingPrice = subtotal + profit;

  return (
    <div className="bomPanel">
      <h3>Auto BOM + Cost Estimation</h3>

      {bomItems.length === 0 ? (
        <p className="bomEmpty">Add CAD components to generate BOM.</p>
      ) : (
        <>
          <table className="bomTable">
            <thead>
              <tr>
                <th>Sl</th>
                <th>Item</th>
                <th>Qty</th>
                <th>Material</th>
                <th>Weight kg</th>
                <th>Cost ₹</th>
              </tr>
            </thead>

            <tbody>
              {bomItems.map((item) => (
                <tr key={item.sl}>
                  <td>{item.sl}</td>
                  <td>{item.item}</td>
                  <td>{item.qty}</td>
                  <td>{item.material}</td>
                  <td>{item.weight}</td>
                  <td>{item.cost.toFixed(0)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="bomSummary">
            <p>Material Cost: ₹{materialCost.toFixed(0)}</p>
            <p>Fabrication: ₹{fabricationCost.toFixed(0)}</p>
            <p>Assembly: ₹{assemblyCost.toFixed(0)}</p>
            <p>Overhead: ₹{overhead.toFixed(0)}</p>
            <p>Profit: ₹{profit.toFixed(0)}</p>
            <h4>Selling Price: ₹{sellingPrice.toFixed(0)}</h4>
          </div>
        </>
      )}
    </div>
  );
}

export default BOMEngine;