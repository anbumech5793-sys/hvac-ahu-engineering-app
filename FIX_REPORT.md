# HVAC AHU App Fix Report

## Fixed in this version

1. Supabase database engine import corrected
   - Changed `../supabaseClient` to `../supabase`.

2. Project Database module connected to main dashboard
   - Added Project Database menu item.
   - Added dashboard import and switch case.

3. Design Basis module restored in main dashboard
   - Added Design Basis menu item.
   - Added dashboard import and switch case.

4. Units added to professional dashboard labels
   - Room dimensions now show `m`.
   - Area shows `m²`.
   - Volume shows `m³`.
   - Airflow shows `CFM`, `CMH`, or `m³/s`.
   - Temperature shows `°C`.
   - Pressure shows `Pa` / `kPa`.
   - Costing shows `₹` and `%`.
   - Filter, fan, coil, duct, GA and BOM fields now show engineering units.

5. Created shared HVAC field metadata utility
   - File: `src/utils/hvacFieldMeta.js`
   - Keeps labels and units consistent across all modules.

6. Project Database dashboard improved
   - Added success/error messages.
   - Added required field validation.
   - Added loading state.
   - Added table location column.
   - Added safer delete confirmation.

7. Production build tested successfully
   - `npm run build` completed without errors.

## How to run

```bash
npm install
npm run dev
```

## Supabase table required

```sql
CREATE TABLE IF NOT EXISTS hvac_projects (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  project_name TEXT,
  client_name TEXT,
  location TEXT,
  airflow_cfm NUMERIC,
  cooling_tr NUMERIC,
  created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE hvac_projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all operations" ON hvac_projects;

CREATE POLICY "Allow all operations"
ON hvac_projects
FOR ALL
USING (true)
WITH CHECK (true);
```
