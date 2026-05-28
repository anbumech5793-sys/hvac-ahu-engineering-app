function BOMCalculator({ data, update, setResult }) {
  function calculateBOM() {
    const materialCost =
      Number(data.sheetQty || 0) * Number(data.sheetRate || 0) +
      Number(data.filterQty || 0) * Number(data.filterRate || 0) +
      Number(data.coilQty || 0) * Number(data.coilRate || 0) +
      Number(data.fanQty || 0) * Number(data.fanRate || 0) +
      Number(data.motorQty || 0) * Number(data.motorRate || 0);

    const laborCost = Number(data.laborCost || 0);
    const overheadPercent = Number(data.overheadPercent || 0);
    const profitPercent = Number(data.profitPercent || 0);

    const overhead = materialCost * (overheadPercent / 100);
    const subtotal = materialCost + laborCost + overhead;
    const profit = subtotal * (profitPercent / 100);
    const sellingPrice = subtotal + profit;

    setResult(
      `Material Cost = ₹${materialCost.toFixed(2)} | Labor = ₹${laborCost.toFixed(
        2
      )} | Overhead = ₹${overhead.toFixed(2)} | Profit = ₹${profit.toFixed(
        2
      )} | Selling Price = ₹${sellingPrice.toFixed(2)}`
    );
  }

  return (
    <>
      <input type="number" placeholder="Sheet Qty" value={data.sheetQty || ""} onChange={(e) => update("sheetQty", e.target.value)} />
      <input type="number" placeholder="Sheet Rate ₹" value={data.sheetRate || ""} onChange={(e) => update("sheetRate", e.target.value)} />

      <input type="number" placeholder="Filter Qty" value={data.filterQty || ""} onChange={(e) => update("filterQty", e.target.value)} />
      <input type="number" placeholder="Filter Rate ₹" value={data.filterRate || ""} onChange={(e) => update("filterRate", e.target.value)} />

      <input type="number" placeholder="Coil Qty" value={data.coilQty || ""} onChange={(e) => update("coilQty", e.target.value)} />
      <input type="number" placeholder="Coil Rate ₹" value={data.coilRate || ""} onChange={(e) => update("coilRate", e.target.value)} />

      <input type="number" placeholder="Fan Qty" value={data.fanQty || ""} onChange={(e) => update("fanQty", e.target.value)} />
      <input type="number" placeholder="Fan Rate ₹" value={data.fanRate || ""} onChange={(e) => update("fanRate", e.target.value)} />

      <input type="number" placeholder="Motor Qty" value={data.motorQty || ""} onChange={(e) => update("motorQty", e.target.value)} />
      <input type="number" placeholder="Motor Rate ₹" value={data.motorRate || ""} onChange={(e) => update("motorRate", e.target.value)} />

      <input type="number" placeholder="Labor Cost ₹" value={data.laborCost || ""} onChange={(e) => update("laborCost", e.target.value)} />
      <input type="number" placeholder="Overhead %" value={data.overheadPercent || ""} onChange={(e) => update("overheadPercent", e.target.value)} />
      <input type="number" placeholder="Profit %" value={data.profitPercent || ""} onChange={(e) => update("profitPercent", e.target.value)} />

      <button onClick={calculateBOM}>Calculate BOM Cost</button>
    </>
  );
}

export default BOMCalculator;